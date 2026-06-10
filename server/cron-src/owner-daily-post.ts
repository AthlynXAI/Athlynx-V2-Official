/**
 * Owner Daily Post Cron handler — Vercel entry point.
 *
 * Bundled by esbuild to api/cron/owner-daily-post.js and invoked
 * by Vercel Cron on the schedule defined in vercel.json.
 *
 * Auth: Bearer ${CRON_SECRET} required.
 *
 * Iron Sharpens Iron — Proverbs 27:17.
 */
import { runOwnerDailyPostCron } from "../jobs/ownerDailyPost";

module.exports = async function handler(req: any, res: any) {
  const authHeader = req.headers["authorization"];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const result = await runOwnerDailyPostCron();
    return res.status(200).json({ ...result, ok: result.ok !== false });
  } catch (err: any) {
    console.error("[OwnerDailyPost Cron] Error:", err);
    return res.status(500).json({ ok: false, error: err?.message ?? String(err) });
  }
};
