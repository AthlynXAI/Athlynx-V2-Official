/**
 * Nebius Spend Tracker — AthlynXAI
 *
 * In-memory token accounting for every Nebius API call.
 * Captures prompt + completion tokens from response.usage, converts to USD
 * using Nebius Token Factory published pricing (as of May 2026), and
 * accumulates a rolling 24h spend total + per-model breakdown.
 *
 * Why in-memory and not a DB table:
 *   - Zero schema migrations before launch
 *   - Daily digest job snapshots + resets the counters every 8am CT
 *   - Process-local (Vercel serverless): a single Vercel function instance
 *     handles all AI calls; if we scale to multiple regions we'll move
 *     this to Redis or a usage table
 *
 * Thresholds:
 *   - $50/day  → Slack INFO
 *   - $100/day → Slack HIGH
 *   - $200/day → Slack CRITICAL + email
 */

import { sendBuildAlert } from "./slackAlerter";

// ─── Nebius Token Factory pricing — May 2026 (per 1M tokens, USD) ──────────
// Source: https://tokenfactory.nebius.com/pricing — verified live May 16 2026
const PRICING: Record<string, { input: number; output: number }> = {
  // Llama 4 (latest)
  "meta-llama/Llama-4-Maverick-17B-128E-Instruct": { input: 0.20, output: 0.60 },
  "meta-llama/Llama-4-Scout-17B-16E-Instruct":     { input: 0.10, output: 0.30 },
  // Llama 3.3 / 3.1
  "meta-llama/Llama-3.3-70B-Instruct":              { input: 0.13, output: 0.40 },
  "meta-llama/Meta-Llama-3.1-8B-Instruct":          { input: 0.02, output: 0.06 },
  "nvidia/Llama-3_1-Nemotron-Ultra-253B-v1":        { input: 0.60, output: 1.80 },
};

const DEFAULT_PRICING = { input: 0.20, output: 0.60 };

// ─── Rolling 24h spend state (in-memory) ───────────────────────────────────
type SpendBucket = {
  totalUsd: number;
  callCount: number;
  inputTokens: number;
  outputTokens: number;
  byModel: Record<string, { usd: number; calls: number; inputTokens: number; outputTokens: number }>;
  windowStartedAt: number;
  alertsFired: Set<number>; // thresholds already alerted to avoid spam
};

const STATE: SpendBucket = freshBucket();

function freshBucket(): SpendBucket {
  return {
    totalUsd: 0,
    callCount: 0,
    inputTokens: 0,
    outputTokens: 0,
    byModel: {},
    windowStartedAt: Date.now(),
    alertsFired: new Set(),
  };
}

const ALERT_THRESHOLDS: { usd: number; severity: "low" | "medium" | "high" | "critical" }[] = [
  { usd: 50,  severity: "low" },
  { usd: 100, severity: "high" },
  { usd: 200, severity: "critical" },
];

/**
 * Record a Nebius call. Pulls usage from the OpenAI-compatible response.
 * Safe to call from any code path — never throws.
 */
export function recordNebiusCall(model: string, usage: { prompt_tokens?: number; completion_tokens?: number } | undefined): void {
  if (!usage) return;
  try {
    const inputTokens = usage.prompt_tokens ?? 0;
    const outputTokens = usage.completion_tokens ?? 0;
    if (inputTokens === 0 && outputTokens === 0) return;

    const price = PRICING[model] || DEFAULT_PRICING;
    const usd = (inputTokens / 1_000_000) * price.input + (outputTokens / 1_000_000) * price.output;

    STATE.totalUsd += usd;
    STATE.callCount += 1;
    STATE.inputTokens += inputTokens;
    STATE.outputTokens += outputTokens;

    if (!STATE.byModel[model]) {
      STATE.byModel[model] = { usd: 0, calls: 0, inputTokens: 0, outputTokens: 0 };
    }
    STATE.byModel[model].usd += usd;
    STATE.byModel[model].calls += 1;
    STATE.byModel[model].inputTokens += inputTokens;
    STATE.byModel[model].outputTokens += outputTokens;

    // Fire threshold alerts (one-shot per threshold per window)
    for (const t of ALERT_THRESHOLDS) {
      if (STATE.totalUsd >= t.usd && !STATE.alertsFired.has(t.usd)) {
        STATE.alertsFired.add(t.usd);
        fireThresholdAlert(t.usd, t.severity).catch((err) => {
          console.warn("[nebiusSpend] threshold alert failed:", err);
        });
      }
    }
  } catch (err) {
    // Never let cost-tracking break a real AI call
    console.warn("[nebiusSpend] recordNebiusCall failed:", err);
  }
}

async function fireThresholdAlert(usd: number, severity: "low" | "medium" | "high" | "critical"): Promise<void> {
  const elapsedHrs = ((Date.now() - STATE.windowStartedAt) / 1000 / 60 / 60).toFixed(1);
  await sendBuildAlert({
    severity,
    title: `Nebius spend crossed $${usd} threshold`,
    body: `Current 24h Nebius spend: $${STATE.totalUsd.toFixed(2)}\nCalls: ${STATE.callCount}\nInput tokens: ${STATE.inputTokens.toLocaleString()}\nOutput tokens: ${STATE.outputTokens.toLocaleString()}\nWindow elapsed: ${elapsedHrs}h\n\nCredits remaining (est. starting from $5,000): $${(5000 - STATE.totalUsd).toFixed(2)}`,
  });
}

/**
 * Snapshot the current spend bucket (called by daily digest job).
 * Returns the snapshot and resets the bucket.
 */
export function snapshotAndReset(): {
  totalUsd: number;
  callCount: number;
  inputTokens: number;
  outputTokens: number;
  byModel: Record<string, { usd: number; calls: number; inputTokens: number; outputTokens: number }>;
  windowHours: number;
} {
  const windowHours = (Date.now() - STATE.windowStartedAt) / 1000 / 60 / 60;
  const snapshot = {
    totalUsd: STATE.totalUsd,
    callCount: STATE.callCount,
    inputTokens: STATE.inputTokens,
    outputTokens: STATE.outputTokens,
    byModel: { ...STATE.byModel },
    windowHours,
  };

  // Reset
  STATE.totalUsd = 0;
  STATE.callCount = 0;
  STATE.inputTokens = 0;
  STATE.outputTokens = 0;
  STATE.byModel = {};
  STATE.windowStartedAt = Date.now();
  STATE.alertsFired.clear();

  return snapshot;
}

/**
 * Read-only peek at current spend without resetting. For health endpoints.
 */
export function getCurrentSpend(): { totalUsd: number; callCount: number; windowStartedAt: number } {
  return {
    totalUsd: STATE.totalUsd,
    callCount: STATE.callCount,
    windowStartedAt: STATE.windowStartedAt,
  };
}
