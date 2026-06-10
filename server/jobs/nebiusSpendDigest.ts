/**
 * Nebius Spend Digest — AthlynXAI
 *
 * Runs daily at 8:00 AM CST (14:00 UTC) — alongside sendDailyReport.
 * Snapshots the rolling 24h Nebius spend (from in-memory tracker),
 * posts a compact digest to Slack, and resets the bucket.
 *
 * Format:
 *   💰 Nebius spend yesterday: $X.XX (Y calls, Z tokens)
 *   Top models, est. credits remaining from the $5K OG pool.
 */

import { snapshotAndReset } from "../services/nebiusSpendTracker";
import { sendBuildAlert } from "../services/slackAlerter";

// Estimated starting credit pool — used to compute remaining runway.
// Update if Nebius adds more credits or if you start funding from credit card.
const STARTING_CREDIT_POOL_USD = Number(process.env.NEBIUS_STARTING_CREDITS_USD ?? "5000");

// Persisted across job runs in process memory. For multi-instance deployments
// this lives in the same Vercel function as the rest of the app, so a single
// counter is accurate for the typical low-traffic case. If we ever shard,
// move this to Redis or a DB row.
let cumulativeSpendUsd = 0;

export async function sendNebiusSpendDigest(): Promise<{
  ok: boolean;
  totalUsd: number;
  callCount: number;
  alertsSent: number;
}> {
  try {
    const snap = snapshotAndReset();
    cumulativeSpendUsd += snap.totalUsd;
    const remaining = Math.max(0, STARTING_CREDIT_POOL_USD - cumulativeSpendUsd);

    // Format the top models by spend
    const topModels = Object.entries(snap.byModel)
      .sort((a, b) => b[1].usd - a[1].usd)
      .slice(0, 3)
      .map(([model, stats]) => {
        const short = model.split("/").pop() || model;
        return `  • ${short}: $${stats.usd.toFixed(2)} (${stats.calls} calls)`;
      })
      .join("\n") || "  (no calls in window)";

    const totalTokens = snap.inputTokens + snap.outputTokens;
    const body = [
      `Window: last ${snap.windowHours.toFixed(1)}h`,
      `Total spend: $${snap.totalUsd.toFixed(2)}`,
      `Calls: ${snap.callCount}`,
      `Tokens: ${totalTokens.toLocaleString()} (in: ${snap.inputTokens.toLocaleString()}, out: ${snap.outputTokens.toLocaleString()})`,
      "",
      "Top models:",
      topModels,
      "",
      `Cumulative spend since digest start: $${cumulativeSpendUsd.toFixed(2)}`,
      `Est. credits remaining: $${remaining.toFixed(2)} of $${STARTING_CREDIT_POOL_USD.toFixed(0)}`,
      remaining < 500 ? "⚠️  Under $500 remaining — plan for top-up" : "",
    ].filter(Boolean).join("\n");

    // Severity escalates as remaining drops
    const severity: "low" | "medium" | "high" | "critical" =
      remaining < 250 ? "critical" :
      remaining < 1000 ? "high" :
      snap.totalUsd > 100 ? "medium" :
      "low";

    const alert = await sendBuildAlert({
      severity,
      title: `💰 Nebius daily spend digest — $${snap.totalUsd.toFixed(2)} / ${snap.callCount} calls`,
      body,
    });

    const alertsSent = (alert.slack ? 1 : 0) + (alert.email ? 1 : 0);

    return {
      ok: true,
      totalUsd: snap.totalUsd,
      callCount: snap.callCount,
      alertsSent,
    };
  } catch (err) {
    console.error("[nebiusSpendDigest] failed:", err);
    return { ok: false, totalUsd: 0, callCount: 0, alertsSent: 0 };
  }
}
