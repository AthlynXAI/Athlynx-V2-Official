#!/usr/bin/env node
/**
 * Lane discipline CI check.
 *
 * Reads the list of changed files (provided via CHANGED_FILES env, comma-separated, or via
 * stdin one-per-line), determines the author/branch, and fails if the change violates
 * lane rules:
 *
 *  - Manus actor/branch may not modify protected paths (db, migrations, sql, workflows,
 *    scripts, infra, vercel.json, .env*, docs/runbooks, docs/incidents, docs/policies).
 *  - Any PR that modifies migration files must include a fresh db/migration-target-proof.json
 *    whose proof_timestamp_utc is within the last 24 hours.
 *  - Any PR that ADDS blacklisted words (new lines only) in changed files fails.
 *    Pre-existing occurrences in untouched lines do not block — those are addressed
 *    in dedicated copy-cleanup PRs, not as side-effects of unrelated changes.
 *  - A migration PR that does not have the Migration-Approved-By trailer on at least one
 *    commit fails. (Trailer is checked from PR_COMMIT_MESSAGES env, newline-separated.)
 */

import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

// Return only the lines ADDED in this PR for file `f`, as a single string.
// Falls back to whole-file contents if we cannot determine a diff base
// (e.g. running locally without env vars).
function addedLines(f) {
  const baseSha = process.env.BASE_SHA || process.env.GITHUB_BASE_SHA;
  const headSha = process.env.HEAD_SHA || process.env.GITHUB_HEAD_SHA || "HEAD";
  try {
    let baseRef = baseSha;
    if (!baseRef) {
      // Best-effort fallback: merge-base with origin/main.
      try {
        baseRef = execSync("git merge-base HEAD origin/main", { encoding: "utf8" }).trim();
      } catch {
        return readFileSync(f, "utf8");
      }
    }
    const diff = execSync(
      `git diff --no-color --unified=0 ${baseRef} ${headSha} -- ${JSON.stringify(f)}`,
      { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 }
    );
    const added = [];
    for (const line of diff.split("\n")) {
      // Skip diff metadata (+++ header) but keep real + additions.
      if (line.startsWith("+++ ")) continue;
      if (line.startsWith("+")) added.push(line.slice(1));
    }
    return added.join("\n");
  } catch {
    // If anything goes wrong, fall back to scanning the whole file
    // so we err on the side of catching, not missing.
    return readFileSync(f, "utf8");
  }
}

const BLACKLIST = [
  "revolutionary","disrupt","game-changer","synergy","leverage",
  "AI-powered","premier","elite","best-in-class",
  // NOTE: "ecosystem" intentionally removed per owner decision 2026-05-17.
  // The actual product/network is ours; the word itself is not blacklisted.
];

// Files that legitimately define or enumerate the blacklist (the rule itself).
// Scanning these for the words they define would be a self-referential false positive.
// Anything matching one of these globs is skipped by the blacklist check ONLY.
// All other lane-discipline checks still apply.
const BLACKLIST_DEFINITION_FILES = new Set([
  "scripts/check-lane-discipline.mjs",
  "MANUS-START-HERE.md",
  "docs/runbooks/lane-discipline.md",
  "docs/runbooks/build-discipline.md",
  "docs/runbooks/runtime-source-of-truth.md",
  "docs/policies/canonical-authority.md",
  "docs/incidents/2026-05-16-wrong-neon-target.md",
]);

// Inline opt-out for legitimate quoting of blacklist words inside other docs.
// Wrap the quoted block in HTML comments: text between
//   <!-- blacklist-allow-start --> ... <!-- blacklist-allow-end -->
// is stripped before scanning. Use sparingly and only for QA rubrics, training
// material, or examples that name forbidden words for educational reasons.
const BLACKLIST_ALLOW_RE = /<!--\s*blacklist-allow-start\s*-->[\s\S]*?<!--\s*blacklist-allow-end\s*-->/g;

const PROTECTED_PATTERNS = [
  /^db\//, /^drizzle\//, /^migrations\//, /\.sql$/i,
  /^prisma\//, /^supabase\/migrations\//,
  /^\.github\/workflows\//, /^\.github\/actions\//,
  /^scripts\//, /^infra\//, /^terraform\//,
  /^vercel\.json$/, /^next\.config\./, /^Dockerfile/, /^docker-compose/,
  /^\.env/, /^docs\/runbooks\//, /^docs\/incidents\//, /^docs\/policies\//,
];

const MIGRATION_PATH_RE = /^(db|drizzle|migrations|prisma\/migrations|supabase\/migrations)\/.*\.sql$/i;

function readChangedFiles() {
  // Preferred: CHANGED_FILES_PATH (avoids ARG_MAX / env-var size limits on large PRs)
  if (process.env.CHANGED_FILES_PATH) {
    const content = readFileSync(process.env.CHANGED_FILES_PATH, "utf8");
    return content.split("\n").map((s) => s.trim()).filter(Boolean);
  }
  // Legacy: CHANGED_FILES env var (kept for backward compatibility on small PRs)
  if (process.env.CHANGED_FILES) {
    return process.env.CHANGED_FILES.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
  }
  const stdin = readFileSync(0, "utf8").trim();
  if (!stdin) return [];
  return stdin.split("\n").map((s) => s.trim()).filter(Boolean);
}

function readCommitMessages() {
  if (process.env.PR_COMMIT_MESSAGES_PATH) {
    return readFileSync(process.env.PR_COMMIT_MESSAGES_PATH, "utf8").split("\n");
  }
  return (process.env.PR_COMMIT_MESSAGES || "").split("\n");
}

function fail(msg) {
  console.error(`[lane-discipline] FAIL: ${msg}`);
  process.exitCode = 1;
}

const changed = readChangedFiles();
const actor = (process.env.GITHUB_ACTOR || "").toLowerCase();
const prAuthor = (process.env.PR_AUTHOR || "").toLowerCase();
const branch = process.env.GITHUB_HEAD_REF || process.env.PR_BRANCH || "";
const commitMessages = readCommitMessages();

const OWNER_ACTORS = new Set(["athlyxai", "chaddozier75"]);
const ownerActor = OWNER_ACTORS.has(actor) || OWNER_ACTORS.has(prAuthor);
const actorIsManus = actor.includes("manus") || prAuthor.includes("manus");
const branchIsManus = branch.startsWith("manus/");

// 1. Manus may not touch protected paths.
// A manus/* branch is treated as Manus-controlled unless the GitHub actor or PR
// author is the canonical owner. This keeps the protected-path stop in place for
// real Manus activity while allowing an owner-ratified doctrine override commit
// on an existing Manus-assisted branch.
const manusActor = actorIsManus || (branchIsManus && !ownerActor);
if (manusActor) {
  for (const f of changed) {
    if (PROTECTED_PATTERNS.some((re) => re.test(f))) {
      fail(`Manus actor "${actor || prAuthor}" / branch "${branch}" modified protected path: ${f}`);
    }
  }
}

// 2. Migration PRs must have a fresh proof file
const migs = changed.filter((f) => MIGRATION_PATH_RE.test(f));
if (migs.length > 0) {
  const proofPath = "db/migration-target-proof.json";
  if (!existsSync(proofPath)) {
    fail(`Migration files changed (${migs.join(", ")}) but ${proofPath} is missing. Run scripts/preflight-migration.mjs first.`);
  } else {
    try {
      const proof = JSON.parse(readFileSync(proofPath, "utf8"));
      const ts = new Date(proof.proof_timestamp_utc);
      const ageMs = Date.now() - ts.getTime();
      if (Number.isNaN(ts.getTime()) || ageMs > 24 * 3600 * 1000 || ageMs < 0) {
        fail(`migration-target-proof.json timestamp ${proof.proof_timestamp_utc} is stale or invalid (must be < 24h old).`);
      }
      const declaredMigs = new Set(proof.migration_files || []);
      for (const m of migs) {
        if (!declaredMigs.has(m)) {
          fail(`Migration file ${m} not listed in migration_files of proof.`);
        }
      }
      if (proof.intended_target_host !== "ep-restless-dream-ahvptyne-pooler.c-3.us-east-1.aws.neon.tech") {
        fail(`migration-target-proof.json intended_target_host ${proof.intended_target_host} does not match canonical real prod host.`);
      }
    } catch (e) {
      fail(`Could not parse ${proofPath}: ${e.message}`);
    }
  }

  // 3. Migration PR must have Migration-Approved-By trailer from owner
  const approvedLine = commitMessages.find((l) => l.startsWith("Migration-Approved-By:"));
  if (!approvedLine) {
    fail(`Migration PR is missing Migration-Approved-By: trailer on any commit. Owner must approve.`);
  } else if (!approvedLine.includes("chaddozier75@gmail.com")) {
    fail(`Migration-Approved-By trailer is not from canonical owner. Got: "${approvedLine.trim()}".`);
  }
}

// 4. Blacklisted words in ADDED lines of changed files (pre-existing text untouched).
for (const f of changed) {
  if (!existsSync(f)) continue;
  // Skip files that define the blacklist itself.
  if (BLACKLIST_DEFINITION_FILES.has(f)) continue;
  // only check text-ish files
  if (!/\.(md|mdx|txt|ts|tsx|js|jsx|json|yml|yaml|html|css|sql)$/i.test(f)) continue;
  let text = addedLines(f);
  // Strip explicitly-quoted blocks so QA rubrics can name forbidden words.
  text = text.replace(BLACKLIST_ALLOW_RE, "");
  if (!text.trim()) continue;
  for (const word of BLACKLIST) {
    const re = new RegExp(`(^|[^\\w])${word.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}([^\\w]|$)`, "i");
    if (re.test(text)) {
      fail(`Blacklisted word "${word}" newly added in ${f}.`);
    }
  }
}

if (process.exitCode === 1) {
  console.error("[lane-discipline] One or more checks failed. See messages above.");
  process.exit(1);
}
console.log("[lane-discipline] OK.");
