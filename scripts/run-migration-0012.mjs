// One-shot runner for drizzle/0012_build28_comms_os_scaffold.sql against Neon prod.
// Idempotent: every statement uses IF NOT EXISTS / DO-EXCEPTION duplicate_object.
//
// Usage (local):
//   DATABASE_URL=postgres://... node scripts/run-migration-0012.mjs
//
// Usage (CI):
//   Triggered by .github/workflows/run-db-migration.yml with manual dispatch.

import { readFileSync } from "node:fs";
import { Pool } from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("[0012] DATABASE_URL is required");
  process.exit(1);
}

const sql = readFileSync(
  new URL("../drizzle/0012_build28_comms_os_scaffold.sql", import.meta.url),
  "utf8",
);

const pool = new Pool({
  connectionString: url,
  ssl:
    url.includes("sslmode=require") || url.includes("neon.tech")
      ? { rejectUnauthorized: false }
      : undefined,
});

const COMMS_TABLES = [
  "communication_events",
  "communication_threads",
  "reply_templates",
  "reply_drafts",
  "communication_classifications",
  "sender_identities",
  "webhook_intake_log",
  "contact_communication_prefs",
];

const client = await pool.connect();
try {
  console.log("[0012] connected. running migration...");
  await client.query("BEGIN");
  await client.query(sql);
  await client.query("COMMIT");
  console.log("[0012] migration committed.");

  const tablesRes = await client.query(
    `
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = ANY($1::text[])
    ORDER BY table_name
  `,
    [COMMS_TABLES],
  );
  console.log(
    "[0012] tables present:",
    tablesRes.rows.map((r) => r.table_name),
  );

  const missing = COMMS_TABLES.filter(
    (t) => !tablesRes.rows.find((r) => r.table_name === t),
  );

  if (missing.length > 0) {
    console.error("[0012] VERIFICATION FAILED — missing tables:", missing);
    process.exitCode = 1;
  } else {
    console.log("[0012] OK — all 8 comms tables present.");
  }
} catch (err) {
  await client.query("ROLLBACK").catch(() => {});
  console.error("[0012] FAILED:", err.message);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
