/**
 * Morning Briefing Cron handler \u2014 Vercel entry point.
 *
 * Vercel schedule: 7:00 AM CT (12:00 UTC during CDT).
 * Replaces the thin daily-report with a real game-day briefing.
 * Auth: Bearer ${CRON_SECRET}.
 */
import { sendMorningBriefing } from "../jobs/morningBriefing";

module.exports = async function handler(req: any, res: any) {
  const authHeader = req.headers["authorization"];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const result = await sendMorningBriefing();
    return res.status(200).json({ ...result });
  } catch (err: any) {
    console.error("[MorningBriefing Cron] Error:", err);
    return res.status(500).json({ ok: false, error: err?.message ?? String(err) });
  }
};
