import { Pool } from "pg";
const url = process.env.DATABASE_URL;
const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
const c = await pool.connect();
const r = await c.query(`
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'athlete_profiles'
    AND column_name IN (
      'headshotUrl','actionPhotoUrl','statScreenshotUrl',
      'jerseyNumber','dominantHand','athlynxStarRating',
      'athleticismScore','published','publishedAt','recruitingTopFive'
    )
  ORDER BY column_name
`);
console.log("athlete_profiles Build 2 cols:", r.rows.map((x) => x.column_name));
c.release();
await pool.end();
