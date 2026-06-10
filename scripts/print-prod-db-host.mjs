#!/usr/bin/env node
/**
 * Print masked production database host info from a .env file path.
 * Never prints the password. Wipes the file after reading.
 *
 * Usage: node scripts/print-prod-db-host.mjs /tmp/.env.prod
 */
import { readFileSync, unlinkSync } from "node:fs";

const path = process.argv[2];
if (!path) {
  console.error("usage: print-prod-db-host.mjs <env-file>");
  process.exit(1);
}

const text = readFileSync(path, "utf8");
try { unlinkSync(path); } catch {}

const line = text.split("\n").find((l) => l.startsWith("NEON_DATABASE_URL="))
  || text.split("\n").find((l) => l.startsWith("DATABASE_URL="));
if (!line) {
  console.error("NEON_DATABASE_URL or DATABASE_URL not found");
  process.exit(2);
}
const raw = line.replace(/^(NEON_DATABASE_URL|DATABASE_URL)\s*=\s*"?/, "").replace(/"\s*$/, "");
const m = raw.match(/^(\w+):\/\/([^:]+):([^@]+)@([^/?:]+)(?::(\d+))?(\/[^?]*)?(\?.*)?$/);
if (!m) {
  console.error("could not parse production database URL");
  process.exit(3);
}
const [, proto, user, pw, host, port, db] = m;
console.log(`protocol: ${proto}`);
console.log(`user:     ${user}`);
console.log(`host:     ${host}`);
console.log(`port:     ${port || "5432"}`);
console.log(`db:       ${(db || "").replace(/^\//, "")}`);
console.log(`pw_len:   ${pw.length} (masked)`);
