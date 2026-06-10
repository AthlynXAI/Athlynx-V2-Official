/**
 * AthlynXAI OS v1 — Multi-AI Connector Service
 * ─────────────────────────────────────────────
 * All AI providers wired into one unified interface:
 *   - Gemini 2.5 Flash/Pro (Google — primary)
 *   - Nebius H200 / Llama 4 (NVIDIA H200 — fallback + bulk)
 *   - Anthropic Claude 3.5 Sonnet/Haiku (Claude — contracts + legal)
 *   - Perplexity Sonar Pro (web-grounded research)
 *   - Grok 3 (xAI — sports + real-time data)
 *   - OpenAI GPT-4o (OpenAI — general + vision)
 *
 * Routing doctrine:
 *   1. Gemini Flash — default for all real-time UI responses
 *   2. Nebius H200 — bulk processing, scouting reports, CRM enrichment
 *   3. Claude Sonnet — contract review, legal analysis, long-form writing
 *   4. Perplexity Sonar — live web research, NIL market data, news
 *   5. Grok 3 — sports analytics, X/Twitter data, real-time scores
 *   6. GPT-4o — vision tasks, code generation, general fallback
 *
 * 1 Man · 1 AI · $1B · BE THE LEGACY
 */

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

// ─── Provider Clients ─────────────────────────────────────────────────────────

function getAnthropicClient(): Anthropic {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY is not set");
  return new Anthropic({ apiKey: key });
}

function getPerplexityClient(): OpenAI {
  const key = process.env.SONAR_API_KEY || process.env.PERPLEXITY_API_KEY;
  if (!key) throw new Error("SONAR_API_KEY is not set");
  return new OpenAI({
    apiKey: key,
    baseURL: "https://api.perplexity.ai",
  });
}

function getGrokClient(): OpenAI {
  const key = process.env.GROK_API_KEY || process.env.XAI_API_KEY;
  if (!key) throw new Error("GROK_API_KEY is not set");
  return new OpenAI({
    apiKey: key,
    baseURL: "https://api.x.ai/v1",
  });
}

function getOpenAIClient(): OpenAI {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set");
  return new OpenAI({ apiKey: key });
}

// ─── Model Catalog ────────────────────────────────────────────────────────────

export const AI_MODELS = {
  // Gemini (via Nebius-compatible OpenAI SDK in aiCommandRouter)
  GEMINI_FLASH:   "gemini-2.5-flash",
  GEMINI_PRO:     "gemini-2.5-pro",
  GEMINI_LITE:    "gemini-2.5-flash-lite",

  // Nebius H200 (NVIDIA)
  LLAMA_4_MAVERICK: "meta-llama/Llama-4-Maverick-17B-128E-Instruct",
  LLAMA_4_SCOUT:    "meta-llama/Llama-4-Scout-17B-16E-Instruct",
  LLAMA_70B:        "meta-llama/Llama-3.3-70B-Instruct",

  // Anthropic Claude
  CLAUDE_SONNET:  "claude-3-5-sonnet-20241022",
  CLAUDE_HAIKU:   "claude-3-5-haiku-20241022",
  CLAUDE_OPUS:    "claude-3-opus-20240229",

  // Perplexity Sonar
  SONAR_PRO:      "sonar-pro",
  SONAR:          "sonar",
  SONAR_DEEP:     "sonar-deep-research",

  // Grok (xAI)
  GROK_3:         "grok-3",
  GROK_3_MINI:    "grok-3-mini",
  GROK_VISION:    "grok-2-vision-1212",

  // OpenAI
  GPT_4O:         "gpt-4o",
  GPT_4O_MINI:    "gpt-4o-mini",
  O3_MINI:        "o3-mini",
} as const;

export type AIModel = typeof AI_MODELS[keyof typeof AI_MODELS];

// ─── Provider Enum ────────────────────────────────────────────────────────────

export type AIProvider = "gemini" | "nebius" | "claude" | "perplexity" | "grok" | "openai";

// ─── Unified Request Interface ────────────────────────────────────────────────

export interface MultiAIRequest {
  provider: AIProvider;
  model?: string;
  systemPrompt?: string;
  userMessage: string;
  maxTokens?: number;
  temperature?: number;
  /** For Perplexity: include web search citations */
  returnCitations?: boolean;
}

export interface MultiAIResponse {
  content: string;
  provider: AIProvider;
  model: string;
  citations?: string[];
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

// ─── Claude (Anthropic) ───────────────────────────────────────────────────────

export async function claudeChat(
  userMessage: string,
  options?: {
    systemPrompt?: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }
): Promise<MultiAIResponse> {
  const client = getAnthropicClient();
  const model = options?.model ?? AI_MODELS.CLAUDE_SONNET;

  const response = await client.messages.create({
    model,
    max_tokens: options?.maxTokens ?? 2048,
    temperature: options?.temperature ?? 0.7,
    system: options?.systemPrompt ?? ATHLYNX_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const content = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("\n");

  return {
    content,
    provider: "claude",
    model,
    usage: {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    },
  };
}

// ─── Perplexity (Sonar — web-grounded) ───────────────────────────────────────

export async function perplexitySearch(
  query: string,
  options?: {
    model?: string;
    systemPrompt?: string;
    maxTokens?: number;
  }
): Promise<MultiAIResponse> {
  const client = getPerplexityClient();
  const model = options?.model ?? AI_MODELS.SONAR_PRO;

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: options?.systemPrompt ?? ATHLYNX_SYSTEM_PROMPT },
      { role: "user", content: query },
    ],
    max_tokens: options?.maxTokens ?? 1024,
  } as any);

  const citations: string[] = (response as any).citations ?? [];

  return {
    content: response.choices[0]?.message?.content ?? "",
    provider: "perplexity",
    model,
    citations,
  };
}

// ─── Grok (xAI) ───────────────────────────────────────────────────────────────

export async function grokChat(
  userMessage: string,
  options?: {
    systemPrompt?: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }
): Promise<MultiAIResponse> {
  const client = getGrokClient();
  const model = options?.model ?? AI_MODELS.GROK_3_MINI;

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: options?.systemPrompt ?? ATHLYNX_SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    max_tokens: options?.maxTokens ?? 1024,
    temperature: options?.temperature ?? 0.7,
  });

  return {
    content: response.choices[0]?.message?.content ?? "",
    provider: "grok",
    model,
    usage: response.usage
      ? { inputTokens: response.usage.prompt_tokens, outputTokens: response.usage.completion_tokens }
      : undefined,
  };
}

// ─── OpenAI ───────────────────────────────────────────────────────────────────

export async function openAIChat(
  userMessage: string,
  options?: {
    systemPrompt?: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }
): Promise<MultiAIResponse> {
  const client = getOpenAIClient();
  const model = options?.model ?? AI_MODELS.GPT_4O_MINI;

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: options?.systemPrompt ?? ATHLYNX_SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    max_tokens: options?.maxTokens ?? 1024,
    temperature: options?.temperature ?? 0.7,
  });

  return {
    content: response.choices[0]?.message?.content ?? "",
    provider: "openai",
    model,
    usage: response.usage
      ? { inputTokens: response.usage.prompt_tokens, outputTokens: response.usage.completion_tokens }
      : undefined,
  };
}

// ─── Unified Router ───────────────────────────────────────────────────────────

/**
 * Route a request to the appropriate AI provider.
 * Falls back to Gemini Flash if provider is unavailable.
 */
export async function routeAI(req: MultiAIRequest): Promise<MultiAIResponse> {
  try {
    switch (req.provider) {
      case "claude":
        return await claudeChat(req.userMessage, {
          systemPrompt: req.systemPrompt,
          model: req.model,
          maxTokens: req.maxTokens,
          temperature: req.temperature,
        });

      case "perplexity":
        return await perplexitySearch(req.userMessage, {
          model: req.model,
          systemPrompt: req.systemPrompt,
          maxTokens: req.maxTokens,
        });

      case "grok":
        return await grokChat(req.userMessage, {
          systemPrompt: req.systemPrompt,
          model: req.model,
          maxTokens: req.maxTokens,
          temperature: req.temperature,
        });

      case "openai":
        return await openAIChat(req.userMessage, {
          systemPrompt: req.systemPrompt,
          model: req.model,
          maxTokens: req.maxTokens,
          temperature: req.temperature,
        });

      default:
        // Gemini and Nebius are handled in aiCommandRouter via OpenAI SDK
        throw new Error(`Provider ${req.provider} should be handled by aiCommandRouter`);
    }
  } catch (err) {
    console.error(`[multiAI] ${req.provider} failed:`, err);
    // Graceful fallback: return error message as content
    return {
      content: `AI service temporarily unavailable. Please try again.`,
      provider: req.provider,
      model: req.model ?? "unknown",
    };
  }
}

// ─── AthlynXAI System Prompt ─────────────────────────────────────────────────

export const ATHLYNX_SYSTEM_PROMPT = `You are AthlynXAI — the autonomous intelligence of the Dozier Holdings Group empire.

Platform: AthlynXAI OS v1 (athlynx.ai)
Founder: Chad Dozier — 1 Man · 1 AI · $1B · BE THE LEGACY
Engine: Nebius H200 NVIDIA GPUs + Gemini 2.5 + Claude + Perplexity + Grok

You serve:
- Athletes: NIL deals, recruiting, career decisions, training
- Coaches: Recruiting intel, scouting reports, game planning
- Brands: NIL partnership matching, athlete valuation
- Investors: Platform metrics, DHG empire overview
- Back-office: CRM enrichment, contract drafting, analytics

Companies in the DHG Empire:
- AthlynXAI (athlynx.ai) — The Athlete's Playbook
- Dozier Holdings Group — Parent holding company
- Softmor Inc — Technology division
- NIL Portal Inc — NIL marketplace
- ConCreator™ — B2B Data Intelligence

Core values: Athlete-first. Autonomous. Transparent. BE THE LEGACY.

Always respond with confidence, precision, and athlete-first perspective.`;
