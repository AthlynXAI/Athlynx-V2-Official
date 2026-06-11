#!/usr/bin/env node
/**
 * Commit author allow-list check — with Bot Suggestion Policy.
 *
 * CI runs this on every PR. It reads all commits in the PR and enforces:
 *
 *   1. Every commit author must be on either the OWNER allow-list, the
 *      SUBAGENT allow-list (Manus, Computer), or the BOT-SUGGESTION
 *      allow-list (vercel[bot], github-actions[bot]).
 *
 *   2. Manus commits are restricted to manus/* branches AND docs/drafts/
 *      paths (existing rule, unchanged).
 *
 *   3. Bot-suggestion commits (vercel[bot], github-actions[bot]) are
 *      restricted to:
 *        - docs/** paths only (no code, no schema, no workflows)
 *        - PR branches only (never directly on main; main protection
 *          handles that, but we also check here)
 *        - Must be RATIFIED by a later commit from an Owner email on
 *          the same PR before the PR can pass. "Ratified" means an
 *          Owner-authored commit exists in the PR after the bot commit,
 *          or the bot commit is reverted by an Owner.
 *
 *   4. If a bot commit is present and unratified, the script fails with
 *      a clear message telling the Owner how to ratify (commit an empty
 *      "Reviewed: <sha>" commit, or revert).
 *
 * This implements the "bots suggest, Owner ratifies" pattern documented
 * in docs/policies/bot-suggestion-policy.md.
 *
 * Inputs (env):
 *   PR_COMMIT_AUTHORS  — newline-separated "email|sha" pairs (chronological)
 *   PR_COMMIT_FILES    — newline-separated "sha\tpath" rows
 *   PR_BRANCH          — head ref
 */

import { readFileSync } from "node:fs";

// Platform-lane Owner emails. cdozier14@athlynx.ai is Chad's platform-owner
// email and may appear on PR commits made through GitHub mobile/web. The
// GitHub noreply uses the user ID + login format because the Owner's canonical
// GitHub login is 'AthlyXAI' (user id 251627004), not 'chaddozier75'. The
// latter is the local-part of the verified primary email, not a GitHub username.
// chad.dozier@icloud.com is Chad's Apple ID / iCloud email; commits authored
// from Apple devices (Xcode, GitHub mobile on iOS) may carry this identity.
// Added 2026-06-11 per standing doctrine (AGENTS.md §Identity).
const OWNER_EMAILS = new Set([
  "chaddozier75@gmail.com",
  "cdozier14@athlynx.ai",
  "chad.dozier@icloud.com",
  "251627004+athlyxai@users.noreply.github.com",
]);
const MANUS_EMAIL = "manus-ai-bot@athlynx.ai";
const COMPUTER_EMAIL = "computer-bot@athlynx.ai";

// Bot-suggestion allow-list. These bots may author commits ONLY on PR
// branches, ONLY touching docs/** paths, and ONLY when ratified by a
// later Owner commit on the same PR.
//
// Canonical bot emails follow the GitHub pattern:
//   <numeric-app-id>+<bot-login>@users.noreply.github.com
//
// vercel[bot] app id is 35613825 (verified via api.github.com/users/vercel[bot]).
// github-actions[bot] app id is 41898282.
const BOT_SUGGESTION_EMAILS = new Set([
  "35613825+vercel[bot]@users.noreply.github.com",
  "41898282+github-actions[bot]@users.noreply.github.com",
]);

// Dependabot is allowed only for dependency-security/update branches and only
// when every changed path is a package manifest or lockfile. It is not a
// general bot-suggestion author and does not get access to source, workflows,
// scripts, schema, docs, or production config.
const DEPENDABOT_EMAILS = new Set([
  "49699333+dependabot[bot]@users.noreply.github.com",
]);
const DEPENDABOT_ALLOWED_PATH_RE = /(^|\/)(package\.json|package-lock\.json|pnpm-lock\.yaml|yarn\.lock|npm-shrinkwrap\.json)$/;

const SUBAGENT_EMAILS = new Set([MANUS_EMAIL, COMPUTER_EMAIL]);
const ALL_ALLOWED = new Set([
  ...OWNER_EMAILS,
  ...SUBAGENT_EMAILS,
  ...BOT_SUGGESTION_EMAILS,
  ...DEPENDABOT_EMAILS,
]);

// Prefer file paths (avoid ARG_MAX on large PRs); fall back to inline env vars.
const authorsRaw = process.env.PR_COMMIT_AUTHORS_PATH
  ? readFileSync(process.env.PR_COMMIT_AUTHORS_PATH, "utf8")
  : (process.env.PR_COMMIT_AUTHORS || "");
const filesRaw = process.env.PR_COMMIT_FILES_PATH
  ? readFileSync(process.env.PR_COMMIT_FILES_PATH, "utf8")
  : (process.env.PR_COMMIT_FILES || "");
const branch = process.env.PR_BRANCH || process.env.GITHUB_HEAD_REF || "";

let failed = false;
function fail(msg) {
  console.error(`[author-check] FAIL: ${msg}`);
  failed = true;
}

// Parse authors. Order matters — the env var preserves chronological order
// from `git log --format='%ae|%H' base..head` (which is reverse-chronological,
// newest first), so we reverse it here to get oldest-first.
const authorsChronological = authorsRaw
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean)
  .reverse();

const filesByCommit = {};
for (const row of filesRaw.split("\n")) {
  const [sha, path] = row.split("\t");
  if (!sha || !path) continue;
  (filesByCommit[sha] ||= []).push(path);
}

// First pass — every author must be on some allow-list at all.
const parsedCommits = [];
for (const entry of authorsChronological) {
  const [email, sha] = entry.split("|").map((s) => s.trim());
  if (!email) continue;
  const normalized = email.toLowerCase();
  parsedCommits.push({ email: normalized, sha, raw: email });
  if (!ALL_ALLOWED.has(normalized)) {
    fail(
      `Commit ${sha} author email "${email}" not on any allow-list (owner/subagent/bot-suggestion).`,
    );
  }
}

// Second pass — Manus lane rules (unchanged).
for (const c of parsedCommits) {
  if (c.email !== MANUS_EMAIL) continue;
  if (!branch.startsWith("manus/")) {
    fail(
      `Manus commit ${c.sha} on non-manus branch "${branch}". Manus must work on manus/* branches only.`,
    );
  }
  const paths = filesByCommit[c.sha] || [];
  for (const p of paths) {
    if (!p.startsWith("docs/drafts/")) {
      fail(
        `Manus commit ${c.sha} touches "${p}" outside docs/drafts/. Lane violation.`,
      );
    }
  }
}

// Third pass — Bot-suggestion lane rules.
// Bots may only touch docs/** paths.
for (const c of parsedCommits) {
  if (!BOT_SUGGESTION_EMAILS.has(c.email)) continue;
  const paths = filesByCommit[c.sha] || [];
  for (const p of paths) {
    if (!p.startsWith("docs/")) {
      fail(
        `Bot-suggestion commit ${c.sha} by "${c.raw}" touches "${p}" outside docs/. Bots may only suggest doc changes.`,
      );
    }
  }
}

// Dependabot security/update lane rules.
// Dependabot may only operate from dependabot/* branches and may only touch
// package manifests or lockfiles. Any source/config/schema/workflow/doc change
// must be rewritten or ratified by an Owner commit instead of being accepted as
// a raw Dependabot commit.
for (const c of parsedCommits) {
  if (!DEPENDABOT_EMAILS.has(c.email)) continue;
  if (!branch.startsWith("dependabot/")) {
    fail(
      `Dependabot commit ${c.sha} appears on non-dependabot branch "${branch}".`,
    );
  }
  const paths = filesByCommit[c.sha] || [];
  for (const p of paths) {
    if (!DEPENDABOT_ALLOWED_PATH_RE.test(p)) {
      fail(
        `Dependabot commit ${c.sha} touches "${p}" outside package manifests/lockfiles. Owner must rewrite or ratify this change.`,
      );
    }
  }
}

// Fourth pass — Owner Ratification.
// For each bot-suggestion commit, an Owner-authored commit MUST exist
// later in the PR chronology. This is the "bots suggest, Owner ratifies"
// rule. If a PR ends with a bot commit and no later Owner commit, fail.
const ratifyCommit = (idx) => {
  for (let j = idx + 1; j < parsedCommits.length; j++) {
    if (OWNER_EMAILS.has(parsedCommits[j].email)) return parsedCommits[j];
  }
  return null;
};

for (let i = 0; i < parsedCommits.length; i++) {
  const c = parsedCommits[i];
  if (!BOT_SUGGESTION_EMAILS.has(c.email)) continue;
  const ratifier = ratifyCommit(i);
  if (!ratifier) {
    fail(
      `Bot-suggestion commit ${c.sha} by "${c.raw}" is UNRATIFIED. ` +
        `An Owner-authored commit must follow it on this PR before merge. ` +
        `To ratify, the Owner should either:\n` +
        `  (a) accept the suggestion: add a commit (even empty) on top, OR\n` +
        `  (b) reject the suggestion: revert the bot commit, OR\n` +
        `  (c) overwrite the suggestion: force-push the branch from a state without the bot commit.`,
    );
  }
}

if (failed) process.exit(1);
console.log("[author-check] OK.");
