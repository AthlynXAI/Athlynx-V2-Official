/**
 * Social Content Seeder cron handler — Vercel entry point (PR #54).
 *
 * Runs before the morning posting window to:
 *   1. Resolve owner-approved Buffer profile IDs (Instagram priority list).
 *   2. Promote any newly owner-approved content packages from
 *      social_content_approved into social_content + social_posts.
 *
 * Doctrine refs:
 *   - AthlynXAI_COMMUNICATIONS_DOCTRINE.md
 *   - docs/specs/03-autonomous-os.md (Engines 2 + 3)
 *
 * Auth: Bearer ${CRON_SECRET} required.
 * Posting still gated by SOCIAL_POSTING_ENABLED — this endpoint never calls Buffer.
 */
import { runSocialContentSeeder } from "../jobs/socialContentSeeder";
import { resolveBufferProfiles } from "../jobs/bufferProfileResolver";

module.exports = async function handler(req: any, res: any) {
  const authHeader = req.headers?.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const dryRun =
    (req.query?.dry_run === "1" ||
      req.query?.dry_run === "true" ||
      (req.headers?.["x-dry-run"] ?? "") === "1") === true;

  try {
    const resolver = await resolveBufferProfiles();
    const seeder = await runSocialContentSeeder({ dryRun });
    const status =
      resolver.ok && seeder.ok && seeder.errors.length === 0 ? "ok" : "alert";
    return res.status(200).json({
      status,
      dryRun,
      resolver,
      seeder,
    });
  } catch (err: any) {
    console.error("[SocialContentSeeder Cron] Error:", err);
    return res.status(500).json({
      status: "failed",
      error: err?.message ?? String(err),
    });
  }
};
