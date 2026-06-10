/**
 * Nebius Spend Digest Cron handler — Vercel entry point.
 *
 * Bundled by esbuild to api/cron/nebius-spend-digest.js and invoked
 * by Vercel Cron at 8:00 AM CST (14:00 UTC) daily.
 *
 * Auth: Bearer ${CRON_SECRET} required.
 */
import { sendNebiusSpendDigest } from "../jobs/nebiusSpendDigest";

module.exports = async function handler(req: any, res: any) {
  const authHeader = req.headers["authorization"];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const result = await sendNebiusSpendDigest();
    return res.status(200).json({ ...result, ok: result.ok !== false });
  } catch (err: any) {
    console.error("[NebiusSpendDigest Cron] Error:", err);
    return res.status(500).json({ ok: false, error: err?.message ?? String(err) });
  }
};
