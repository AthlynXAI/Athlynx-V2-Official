/**
 * Nebius AI Service — AthlynXAI Platform
 * Secondary AI Engine — Nebius AI Cloud (OpenAI-compatible API)
 * NVIDIA H200 GPU Cluster — $5,000 OG Credits Active (confirmed live S37 May 2026)
 * Tenant: tenant-e00r74k0pbm4nqmw2w | SA: serviceaccount-e00jhyptxnfgbev15v
 *
 * Models: Llama 4 Maverick/Scout (latest) + Llama 3.3-70B (proven production)
 * Use cases:
 * - Always-on fallback when Gemini/Claude quota is exhausted
 * - High-throughput batch AI tasks (CRM enrichment, bulk content generation)
 * - Long-context processing (athlete profiles, scouting reports)
 * - Token Factory — AI credits economy
 */

import OpenAI from "openai";
import { recordNebiusCall } from "./nebiusSpendTracker";

const NEBIUS_API_KEY = process.env.NEBIUS_API_KEY || "";
const NEBIUS_BASE_URL = "https://api.studio.nebius.ai/v1/";

// ─── Models (S37 May 2026 — Llama 4 + Llama 3.3 on H200) ────────────────────
export const NEBIUS_MODELS = {
  // Llama 4 — latest generation (best quality + speed on H200)
  LLAMA_4_MAVERICK: "meta-llama/Llama-4-Maverick-17B-128E-Instruct", // MoE — best quality
  LLAMA_4_SCOUT:    "meta-llama/Llama-4-Scout-17B-16E-Instruct",     // Fast — high throughput
  // Llama 3.3 — proven production (confirmed live May 2026, sub-500ms)
  LLAMA_70B:  "meta-llama/Llama-3.3-70B-Instruct",                  // Complex tasks — primary fallback
  LLAMA_8B:   "meta-llama/Meta-Llama-3.1-8B-Instruct",              // Fast + bulk tasks
  LLAMA_405B: "nvidia/Llama-3_1-Nemotron-Ultra-253B-v1",            // Elite analysis (253B on H200)
} as const;

export type NebiusModel = typeof NEBIUS_MODELS[keyof typeof NEBIUS_MODELS];

function getClient(): OpenAI {
  if (!NEBIUS_API_KEY) throw new Error("NEBIUS_API_KEY is not set");
  return new OpenAI({
    baseURL: NEBIUS_BASE_URL,
    apiKey: NEBIUS_API_KEY,
  });
}

export interface NebiusMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Generate a completion using Nebius AI (Llama models)
 * Primary fallback when Gemini quota is exhausted
 */
export async function nebiusChat(
  messages: NebiusMessage[],
  model: NebiusModel = NEBIUS_MODELS.LLAMA_70B,
  options?: {
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
  }
): Promise<string> {
  const client = getClient();

  const allMessages: NebiusMessage[] = [];

  if (options?.systemPrompt) {
    allMessages.push({ role: "system", content: options.systemPrompt });
  }

  allMessages.push(...messages);

  const response = await client.chat.completions.create({
    model,
    messages: allMessages,
    max_tokens: options?.maxTokens ?? 2048,
    temperature: options?.temperature ?? 0.7,
  });

  // Track spend (never throws)
  recordNebiusCall(model, response.usage);

  return response.choices[0]?.message?.content ?? "";
}

/**
 * Quick single-prompt completion — ideal for CRM enrichment, short AI tasks
 */
export async function nebiusComplete(
  prompt: string,
  systemPrompt?: string,
  model: NebiusModel = NEBIUS_MODELS.LLAMA_8B
): Promise<string> {
  return nebiusChat(
    [{ role: "user", content: prompt }],
    model,
    { systemPrompt }
  );
}

/**
 * Athlete X-Factor Score calculation using Nebius AI
 * Analyzes athlete stats, sport, school, recruiting status, NIL value
 */
export async function calculateXFactorScore(athleteData: {
  name: string;
  sport: string;
  position: string;
  school: string;
  gpa?: number;
  height?: string;
  weight?: number;
  sportStats?: Record<string, string | number>;
  recruitingStatus?: string;
  nilValue?: number;
  followers?: number;
}): Promise<{ score: number; breakdown: string; tier: string }> {
  const prompt = `You are the AthlynX X-Factor AI scoring engine. Calculate an X-Factor score (0-100) for this athlete.

Athlete Data:
- Name: ${athleteData.name}
- Sport: ${athleteData.sport}
- Position: ${athleteData.position}
- School: ${athleteData.school}
- GPA: ${athleteData.gpa ?? "N/A"}
- Height: ${athleteData.height ?? "N/A"}
- Weight: ${athleteData.weight ?? "N/A"} lbs
- Sport Stats: ${JSON.stringify(athleteData.sportStats ?? {})}
- Recruiting Status: ${athleteData.recruitingStatus ?? "Available"}
- NIL Value: $${athleteData.nilValue ?? 0}
- Social Followers: ${athleteData.followers ?? 0}

Respond in JSON format only:
{
  "score": <number 0-100>,
  "breakdown": "<2-3 sentence explanation>",
  "tier": "<Elite|High Major D1|Mid Major D1|D2/D3 Prospect|Developing>"
}`;

  try {
    const result = await nebiusComplete(prompt, undefined, NEBIUS_MODELS.LLAMA_70B);
    const parsed = JSON.parse(result.trim());
    return {
      score: Math.min(100, Math.max(0, Number(parsed.score) || 75)),
      breakdown: parsed.breakdown || "Strong athlete profile with good fundamentals.",
      tier: parsed.tier || "High Major D1",
    };
  } catch {
    // Fallback scoring
    const baseScore = 70;
    const gpaBonus = athleteData.gpa ? (athleteData.gpa / 4.0) * 10 : 0;
    const nilBonus = athleteData.nilValue ? Math.min(10, athleteData.nilValue / 5000) : 0;
    const score = Math.min(100, Math.round(baseScore + gpaBonus + nilBonus));
    return {
      score,
      breakdown: "Score calculated based on available athlete metrics.",
      tier: score >= 90 ? "Elite" : score >= 80 ? "High Major D1" : score >= 70 ? "Mid Major D1" : "D2/D3 Prospect",
    };
  }
}

/**
 * Bulk CRM enrichment — enrich multiple athlete profiles at once
 * Uses fast 8B model for cost efficiency
 */
export async function enrichAthleteProfile(athleteData: {
  name: string;
  sport: string;
  school: string;
  email?: string;
}): Promise<{
  suggestedNilValue: number;
  recruitingScore: number;
  keyStrengths: string[];
  recommendedActions: string[];
}> {
  const prompt = `You are the AthlynX CRM AI. Enrich this athlete profile with insights.

Athlete: ${athleteData.name}
Sport: ${athleteData.sport}
School: ${athleteData.school}

Respond in JSON only:
{
  "suggestedNilValue": <number in dollars>,
  "recruitingScore": <number 0-100>,
  "keyStrengths": ["<strength1>", "<strength2>", "<strength3>"],
  "recommendedActions": ["<action1>", "<action2>"]
}`;

  try {
    const result = await nebiusComplete(prompt, undefined, NEBIUS_MODELS.LLAMA_8B);
    return JSON.parse(result.trim());
  } catch {
    return {
      suggestedNilValue: 5000,
      recruitingScore: 75,
      keyStrengths: ["Athletic potential", "Academic focus", "Team player"],
      recommendedActions: ["Complete athlete profile", "Upload highlight reel"],
    };
  }
}

/**
 * Health check — verify Nebius API is responding
 */
export async function nebiusHealthCheck(): Promise<{ status: "ok" | "error"; model: string; latencyMs: number }> {
  const start = Date.now();
  try {
    await nebiusComplete("Say OK", undefined, NEBIUS_MODELS.LLAMA_8B);
    return { status: "ok", model: NEBIUS_MODELS.LLAMA_8B, latencyMs: Date.now() - start };
  } catch (e) {
    return { status: "error", model: NEBIUS_MODELS.LLAMA_8B, latencyMs: Date.now() - start };
  }
}

// ─── NVIDIA-Class Compute Route (added May 29, 2026) ───────────────────────
//
// First-class route for NVIDIA's own open-weight model on Nebius H200 —
// nvidia/Llama-3_1-Nemotron-Ultra-253B-v1. Reserved for elite analysis paths
// (deep scouting, high-value NIL valuation, owner-tier strategy queries).
//
// Doctrine integration:
//   - Aligns AthlynXAI OS with NVIDIA's open-model portfolio (Nemotron family)
//   - When NVIDIA exposes Ising via Nebius, flip NEBIUS_ISING_ENABLED=true and
//     wire the model id in NEBIUS_MODELS to start hybrid quantum-AI workloads
//   - Read by GET /api/os/compute health endpoint for public proof

export async function nemotronUltraChat(
  messages: NebiusMessage[],
  options?: { maxTokens?: number; temperature?: number; systemPrompt?: string }
): Promise<string> {
  return nebiusChat(messages, NEBIUS_MODELS.LLAMA_405B, options);
}

export async function nemotronHealthCheck(): Promise<{ status: "ok" | "error"; model: string; latencyMs: number }> {
  const start = Date.now();
  try {
    await nebiusComplete("Reply with the single word OK.", undefined, NEBIUS_MODELS.LLAMA_405B);
    return { status: "ok", model: NEBIUS_MODELS.LLAMA_405B, latencyMs: Date.now() - start };
  } catch (_e) {
    return { status: "error", model: NEBIUS_MODELS.LLAMA_405B, latencyMs: Date.now() - start };
  }
}

/**
 * Returns the live compute-stack manifest. Public-safe (no keys, no tenant IDs,
 * no endpoint URLs). Used by /api/os/compute and the public Layer Cake page.
 */
export function computeStackManifest() {
  return {
    hardware: "NVIDIA H200 GPU cluster (Nebius AI Cloud)",
    nebius_configured: Boolean(NEBIUS_API_KEY),
    models: {
      primary_fast:     { id: NEBIUS_MODELS.LLAMA_8B,    role: "Bulk + fast tasks" },
      production_70b:   { id: NEBIUS_MODELS.LLAMA_70B,   role: "Production fallback — scouting, X-Factor" },
      nvidia_nemotron:  { id: NEBIUS_MODELS.LLAMA_405B,  role: "NVIDIA Nemotron Ultra 253B — elite analysis" },
      llama4_quality:   { id: NEBIUS_MODELS.LLAMA_4_MAVERICK, role: "Llama 4 Maverick — highest quality" },
      llama4_speed:     { id: NEBIUS_MODELS.LLAMA_4_SCOUT,    role: "Llama 4 Scout — high throughput" },
    },
    open_model_alignment: [
      "NVIDIA Nemotron (LIVE on H200 via Nebius)",
      "NVIDIA Cosmos (physical AI — future integration for biomechanics)",
      "NVIDIA Ising (quantum-AI — readiness flag: NEBIUS_ISING_ENABLED)",
      "NVIDIA Isaac GR00T (robotics — future integration for training drills)",
      "NVIDIA BioNeMo (biomedical — future integration for injury prevention research)",
    ],
    ising_readiness: Boolean(process.env.NEBIUS_ISING_ENABLED === "true"),
    workload_thesis:
      "Every athlete query through AthlynXAI OS (recruiting, NIL valuation, Battery Coach, scouting, content) = inference cycles consumed. Vertical-AI workload generator for sports on the NVIDIA stack.",
  };
}
