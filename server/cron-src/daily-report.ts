/**
 * Daily Profile Growth Report Cron handler — Vercel entry point.
 *
 * Bundled by esbuild to api/cron/daily-report.js and invoked
 * by Vercel Cron at 7:00 AM CDT (12:00 UTC) daily.
 *
 * Recipients: chaddozier75@gmail.com, cdozier14@athlynx.ai,
 *             cdozier@dozierholdingsgroup.com
 *
 * Auth: Bearer ${CRON_SECRET} required.
 */
import { sendDailyReport } from "../jobs/dailyReport";

module.exports = async function handler(req: any, res: any) {
  const authHeader = req.headers["authorization"];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    await sendDailyReport();
    return res.status(200).json({ ok: true, message: "Daily report sent" });
  } catch (err: any) {
    console.error("[DailyReport Cron] Error:", err);
    return res.status(500).json({ ok: false, error: err?.message ?? String(err) });
  }
};
