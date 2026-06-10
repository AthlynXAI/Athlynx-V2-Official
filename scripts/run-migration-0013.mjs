// One-shot runner for drizzle/0013_build28_behavior_signals.sql against Neon prod.
// Idempotent: every statement uses IF NOT EXISTS / DO-EXCEPTION duplicate_object.
//
// Usage (local):
//   DATABASE_URL=postgres://... node scripts/run-migration-0013.mjs
//
// Usage (CI):
//   Triggered by .github/workflows/run-db-migration.yml with manual dispatch.

import { readFileSync } from "node:fs";
import { Pool } from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("[0013] DATABASE_URL is required");
  process.exit(1);
}

const sql = readFileSync(
  new URL("../drizzle/0013_build28_behavior_signals.sql", import.meta.url),
  "utf8",
);

const pool = new Pool({
  connectionString: url,
  ssl:
    url.includes("sslmode=require") || url.includes("neon.tech")
      ? { rejectUnauthorized: false }
      : undefined,
});

const SIGNAL_TABLES = [
  "signal_events",
  "signal_aggregates",
  "lifecycle_transitions",
  "athlete_lifecycle_state",
  "recommendation_scores",
  "athlete_behavior_segments",
];

const client = await pool.connect();
try {
  console.log("[0013] connected. running migration...");
  await client.query("BEGIN");
  await client.query(sql);
  await client.query("COMMIT");
  console.log("[0013] migration committed.");

  const tablesRes = await client.query(
    `
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = ANY($1::text[])
    ORDER BY table_name
  `,
    [SIGNAL_TABLES],
  );
  console.log(
    "[0013] tables present:",
    tablesRes.rows.map((r) => r.table_name),
  );

  const missing = SIGNAL_TABLES.filter(
    (t) => !tablesRes.rows.find((r) => r.table_name === t),
  );

  if (missing.length > 0) {
    console.error("[0013] VERIFICATION FAILED — missing tables:", missing);
    process.exitCode = 1;
  } else {
    console.log("[0013] OK — all 6 behavior-signal tables present.");
  }
} catch (err) {
  await client.query("ROLLBACK").catch(() => {});
  console.error("[0013] FAILED:", err.message);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
