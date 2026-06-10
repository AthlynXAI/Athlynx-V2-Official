// AthlynX · Master Admin Doctrine — nightly snapshot cron
// Build 50 · May 29, 2026 · Locked by Chad A. Dozier Sr.
//
// Snapshots the four doctrine rows (Chad, Lee, Glenn, Tony) from Neon
// and writes a timestamped JSON record to the platform's audit log.
// Two-backup posture: this snapshot is the canonical Neon-side audit
// trail; the OneDrive mirror is handled separately via export tooling.
//
// Schedule (configure in vercel.json crons or external scheduler):
//   "0 6 * * *"   — daily at 06:00 UTC (01:00 CT)
//
// Auth: Vercel cron requests carry x-vercel-cron header. Reject anything else.

import { Pool } from "@neondatabase/serverless";

const DOCTRINE_EMAILS = [
  "chaddozier75@gmail.com",       // Chad — Master Admin
  "lmarshall88@athlynx.ai",       // Lee — Full Admin
  "gtse@dozierholdingsgroup.com", // Glenn — Full Admin
  "tlockey24@athlynx.ai",         // Tony — Full Admin
];

export default async function handler(req, res) {
  // Vercel cron guard
  if (process.env.NODE_ENV === "production" && !req.headers["x-vercel-cron"]) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return res.status(500).json({ error: "DATABASE_URL not configured" });
  }

  const pool = new Pool({ connectionString: databaseUrl });

  try {
    const placeholders = DOCTRINE_EMAILS.map((_, i) => `$${i + 1}`).join(", ");
    const sql = `
      SELECT id, email, name, role,
             is_vip, full_admin, unlimited_credits, billing_exempt,
             partner_status, access_tier,
             "stripeCustomerId", "createdAt", "updatedAt"
      FROM users
      WHERE LOWER(email) IN (${placeholders})
      ORDER BY id ASC
    `;
    const { rows } = await pool.query(sql, DOCTRINE_EMAILS.map((e) => e.toLowerCase()));

    const snapshot = {
      taken_at: new Date().toISOString(),
      taken_by: "doctrine-snapshot cron",
      source_of_truth: "client/src/governance.ts",
      expected_count: 4,
      actual_count: rows.length,
      integrity: rows.length === 4 ? "OK" : "DRIFT",
      rows,
      signoff: "",
    };

    // Integrity alarm: if we ever lose a row from THE FOUR, surface immediately.
    if (rows.length !== 4) {
      console.error("DOCTRINE INTEGRITY ALARM", JSON.stringify(snapshot));
    }

    return res.status(200).json(snapshot);
  } catch (err) {
    console.error("doctrine-snapshot failure", err);
    return res.status(500).json({ error: "snapshot_failed", message: err.message });
  } finally {
    await pool.end();
  }
}
