#!/usr/bin/env node
/**
 * Pre-flight migration guard.
 *
 * Run BEFORE any migration. Refuses to write a target-proof file unless:
 *  - vercel whoami returns the canonical owner identity
 *  - vercel production NEON_DATABASE_URL/DATABASE_URL host matches the intended target host
 *  - the script is being run from a real shell, not as part of a Manus PR
 *
 * Writes db/migration-target-proof.json on success.
 * Exits non-zero on any check failure. Does not log secrets.
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

const CANONICAL_VERCEL_USER = "chaddozier75-cmd";
const CANONICAL_VERCEL_SCOPE = "chad-a-doziers-projects";
const CANONICAL_VERCEL_PROJECT = "athlynx-platform";
const EXPECTED_HOST_REAL_PROD = "ep-misty-glade-aeu51x06-pooler.c-2.us-east-2.aws.neon.tech";
const EXPECTED_DB = "neondb";
const EXPECTED_ROLE = "neondb_owner";
const PROOF_PATH = "db/migration-target-proof.json";

function die(msg) {
  console.error(`[preflight] BLOCK: ${msg}`);
  process.exit(2);
}

function run(cmd, opts = {}) {
  return execSync(cmd, { stdio: ["ignore", "pipe", "pipe"], ...opts }).toString().trim();
}

// 0. Refuse to run if invoked by a Manus actor.
const actor = process.env.GITHUB_ACTOR || process.env.MANUS_ACTOR || "";
if (actor.toLowerCase().includes("manus")) {
  die(`Manus actor (${actor}) is not authorized to run migrations. Lane violation.`);
}

// 0b. Refuse to run if branch name starts with manus/
const branch = (process.env.GITHUB_REF_NAME || run("git rev-parse --abbrev-ref HEAD")) || "";
if (branch.startsWith("manus/")) {
  die(`Branch ${branch} is a Manus-owned branch. Migrations must come from a non-Manus branch.`);
}

// 1. Required tokens present
if (!process.env.VERCEL_TOKEN) die("VERCEL_TOKEN not set in environment.");

// 2. Confirm vercel identity
let who;
try {
  who = run(`npx --yes vercel --token "${process.env.VERCEL_TOKEN}" whoami`);
} catch (e) {
  die("vercel whoami failed. Token or network issue.");
}
if (!who.includes(CANONICAL_VERCEL_USER)) {
  die(`vercel whoami returned "${who}", expected "${CANONICAL_VERCEL_USER}". Wrong identity.`);
}

// 3. Confirm project visibility
let projects;
try {
  projects = run(`npx --yes vercel --token "${process.env.VERCEL_TOKEN}" --scope ${CANONICAL_VERCEL_SCOPE} project ls`);
} catch (e) {
  die("vercel project ls failed.");
}
if (!projects.includes(CANONICAL_VERCEL_PROJECT)) {
  die(`Project ${CANONICAL_VERCEL_PROJECT} not visible under scope ${CANONICAL_VERCEL_SCOPE}.`);
}

// 4. Pull prod env to a temp file. Wipe immediately after parse.
const tmpEnv = join(tmpdir(), `.athlynx.prod.env.${process.pid}.${Date.now()}`);
try {
  // Link first (idempotent)
  try {
    run(`npx --yes vercel --token "${process.env.VERCEL_TOKEN}" --scope ${CANONICAL_VERCEL_SCOPE} link --project ${CANONICAL_VERCEL_PROJECT} --yes`, { cwd: process.cwd() });
  } catch (e) {
    // not fatal if already linked
  }
  run(`npx --yes vercel --token "${process.env.VERCEL_TOKEN}" --scope ${CANONICAL_VERCEL_SCOPE} env pull "${tmpEnv}" --environment=production --yes`);
} catch (e) {
  die("vercel env pull failed.");
}

if (!existsSync(tmpEnv)) die("env pull produced no file.");

const envText = readFileSync(tmpEnv, "utf8");
// wipe asap
try { unlinkSync(tmpEnv); } catch {}

const dbUrlLine = envText
  .split("\n")
  .find((l) => l.startsWith("NEON_DATABASE_URL="))
  || envText.split("\n").find((l) => l.startsWith("DATABASE_URL="));
if (!dbUrlLine) die("NEON_DATABASE_URL or DATABASE_URL not present in production env.");

const raw = dbUrlLine.replace(/^(NEON_DATABASE_URL|DATABASE_URL)\s*=\s*"?/, "").replace(/"\s*$/, "");
const parsed = parsePgUrl(raw);
if (!parsed) die("Production database URL not parseable.");

// 5. Compare against expected real prod
if (parsed.host !== EXPECTED_HOST_REAL_PROD) {
  die(`Vercel prod DATABASE_URL host "${parsed.host}" does not match expected real prod host "${EXPECTED_HOST_REAL_PROD}". STOP. Investigate before any migration.`);
}
if (parsed.db !== EXPECTED_DB) {
  die(`DB name "${parsed.db}" != expected "${EXPECTED_DB}".`);
}
if (parsed.user !== EXPECTED_ROLE) {
  die(`DB role "${parsed.user}" != expected "${EXPECTED_ROLE}".`);
}

// 6. Migration files to be applied — must be listed by the caller via MIGRATION_FILES env (comma-separated)
const migFilesRaw = process.env.MIGRATION_FILES || "";
const migFiles = migFilesRaw.split(",").map((s) => s.trim()).filter(Boolean);
if (migFiles.length === 0) die("MIGRATION_FILES env not provided. List the exact migration filenames being applied.");

for (const f of migFiles) {
  if (!existsSync(f)) die(`Migration file ${f} does not exist in working tree.`);
}

// 7. Write the proof
const proof = {
  intended_target_host: parsed.host,
  intended_target_db: parsed.db,
  intended_target_role: parsed.user,
  proof_source: "vercel-production-env",
  proof_command: `vercel --scope ${CANONICAL_VERCEL_SCOPE} env pull --environment=production`,
  proof_timestamp_utc: new Date().toISOString(),
  verified_by: process.env.PROOF_VERIFIED_BY || "computer",
  vercel_identity: who,
  migration_files: migFiles,
};

mkdirSync(dirname(PROOF_PATH), { recursive: true });
writeFileSync(PROOF_PATH, JSON.stringify(proof, null, 2) + "\n");
console.log(`[preflight] OK. Wrote ${PROOF_PATH}.`);
console.log(`[preflight] Target host: ${parsed.host}`);
console.log(`[preflight] Target db:   ${parsed.db}`);
console.log(`[preflight] Target role: ${parsed.user}`);
console.log(`[preflight] Migrations:  ${migFiles.join(", ")}`);
console.log(`[preflight] Now commit ${PROOF_PATH} to your PR. Owner must add the Migration-Approved-By trailer before merge.`);

function parsePgUrl(u) {
  const m = u.match(/^(\w+):\/\/([^:]+):([^@]+)@([^/?:]+)(?::(\d+))?(\/[^?]*)?(\?.*)?$/);
  if (!m) return null;
  const [, , user, , host, , db] = m;
  return { user, host, db: (db || "").replace(/^\//, "") };
}
