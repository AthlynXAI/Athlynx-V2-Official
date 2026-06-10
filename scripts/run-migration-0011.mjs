// One-shot runner for drizzle/0011_build27_1_studio_suite.sql against Neon prod.
// Idempotent: every statement uses IF NOT EXISTS / DO-EXCEPTION duplicate_object.
//
// Usage (local):
//   DATABASE_URL=postgres://... node scripts/run-migration-0011.mjs
//
// Usage (CI):
//   Triggered by .github/workflows/run-db-migration.yml with manual dispatch.

import { readFileSync } from "node:fs";
import { Pool } from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("[0011] DATABASE_URL is required");
  process.exit(1);
}

const sql = readFileSync(
  new URL("../drizzle/0011_build27_1_studio_suite.sql", import.meta.url),
  "utf8",
);

const pool = new Pool({
  connectionString: url,
  ssl:
    url.includes("sslmode=require") || url.includes("neon.tech")
      ? { rejectUnauthorized: false }
      : undefined,
});

const client = await pool.connect();
try {
  console.log("[0011] connected. running migration...");
  await client.query("BEGIN");
  await client.query(sql);
  await client.query("COMMIT");
  console.log("[0011] migration committed.");

  const tablesRes = await client.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name IN ('studio_graphics')
    ORDER BY table_name
  `);
  console.log(
    "[0011] tables present:",
    tablesRes.rows.map((r) => r.table_name),
  );

  const enumRes = await client.query(`
    SELECT typname FROM pg_type WHERE typname = 'studio_graphic_type'
  `);
  console.log(
    "[0011] enums present:",
    enumRes.rows.map((r) => r.typname),
  );

  if (tablesRes.rows.length === 0) {
    console.error("[0011] VERIFICATION FAILED: studio_graphics not found");
    process.exitCode = 1;
  } else {
    console.log("[0011] OK");
  }
} catch (err) {
  await client.query("ROLLBACK").catch(() => {});
  console.error("[0011] FAILED:", err.message);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
