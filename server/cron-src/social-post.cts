/**
 * Social Post Cron handler — Vercel entry point.
 *
 * Owner-approved Social OS restoration, 2026-05-18.
 * Bundled by esbuild to api/cron/social-post.js and invoked by Vercel Cron.
 *
 * Auth: Bearer ${CRON_SECRET} required.
 * Guard: SOCIAL_POSTING_ENABLED must be "true" before any post can leave.
 *
 * Iron Sharpens Iron — Proverbs 27:17.
 */
import { runSocialPostsWorker } from "../jobs/socialPostsWorker";
import { checkSocialPostingGuard } from "../services/socialPostingGuard";

module.exports = async function handler(req: any, res: any) {
  const authHeader = req.headers?.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const guard = checkSocialPostingGuard();
  if (!guard.allowed) {
    return res.status(200).json({
      status: "skipped",
      reason: guard.reason,
    });
  }

  try {
    const result = await runSocialPostsWorker({ limit: 10 });
    return res.status(result.ok ? 200 : 500).json({
      status: result.ok ? "success" : "failed",
      processed: result.posted,
      considered: result.considered,
      posted: result.posted,
      failed: result.failed,
      skipped_killswitch: result.skipped_killswitch,
      errors: result.errors,
    });
  } catch (err: any) {
    console.error("[SocialPost Cron] Error:", err);
    return res.status(500).json({
      status: "failed",
      error: err?.message ?? String(err),
    });
  }
};
