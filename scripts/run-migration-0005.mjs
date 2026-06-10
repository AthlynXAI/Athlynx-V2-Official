// One-shot runner for drizzle/0005_build2_foundation.sql against Neon prod.
// Idempotent: every statement uses IF NOT EXISTS.

import { readFileSync } from "node:fs";
import { Pool } from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const sql = readFileSync(new URL("../drizzle/0005_build2_foundation.sql", import.meta.url), "utf8");

const pool = new Pool({
  connectionString: url,
  ssl: url.includes("sslmode=require") || url.includes("neon.tech") ? { rejectUnauthorized: false } : undefined,
});

const client = await pool.connect();
try {
  console.log("[0005] connected. running migration...");
  await client.query("BEGIN");
  await client.query(sql);
  await client.query("COMMIT");
  console.log("[0005] migration committed.");

  // Verification — count Build 2 tables that should now exist
  const tablesRes = await client.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name IN (
        'recruiting_board_entries',
        'recruiting_coach_views',
        'athlete_awards',
        'athlete_social_accounts',
        'coach_lynx_messages',
        'coach_lynx_memory'
      )
    ORDER BY table_name
  `);
  console.log("[0005] tables present:", tablesRes.rows.map((r) => r.table_name));

  const colsRes = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'athlete_profiles'
      AND column_name IN (
        'headshot_url','action_photo_url','stat_screenshot_url',
        'jersey_number','dominant_hand','athlynx_star_rating',
        'athleticism_score','published','profile_views','last_published_at'
      )
    ORDER BY column_name
  `);
  console.log("[0005] new athlete_profiles columns:", colsRes.rows.map((r) => r.column_name));
} catch (err) {
  await client.query("ROLLBACK").catch(() => {});
  console.error("[0005] FAILED:", err.message);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
