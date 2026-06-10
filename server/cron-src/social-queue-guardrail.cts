/**
 * Social Queue Guardrail Cron handler — Vercel entry point.
 *
 * Runs before weekday posting windows and alerts the owner if Social OS has
 * no active account, no active content, or no scheduled post for the day.
 *
 * Auth: Bearer ${CRON_SECRET} required.
 * Guardrail only: never posts, mutates, deletes, or queues content.
 */
import { runSocialQueueGuardrail } from "../jobs/socialQueueGuardrail";

module.exports = async function handler(req: any, res: any) {
  const authHeader = req.headers?.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await runSocialQueueGuardrail();
    return res.status(200).json({
      status: result.ok ? "ok" : "alert",
      ...result,
    });
  } catch (err: any) {
    console.error("[SocialQueueGuardrail Cron] Error:", err);
    return res.status(500).json({
      status: "failed",
      error: err?.message ?? String(err),
    });
  }
};
