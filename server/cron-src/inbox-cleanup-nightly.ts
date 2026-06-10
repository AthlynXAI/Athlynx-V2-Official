/**
 * Inbox Cleanup Nightly Cron handler \u2014 Vercel entry point.
 *
 * Vercel schedule: 11:59 PM CT (04:59 UTC during CDT).
 * Auth: Bearer ${CRON_SECRET}.
 */
import { runInboxCleanupNightly } from "../jobs/inboxCleanupNightly";

module.exports = async function handler(req: any, res: any) {
  const authHeader = req.headers["authorization"];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const result = await runInboxCleanupNightly();
    return res.status(200).json({ ...result });
  } catch (err: any) {
    console.error("[InboxCleanup Cron] Error:", err);
    return res.status(500).json({ ok: false, error: err?.message ?? String(err) });
  }
};
