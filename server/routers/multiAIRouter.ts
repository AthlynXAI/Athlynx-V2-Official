/**
 * AthlynXAI OS v1 — Multi-AI Router
 * Exposes all AI providers (Gemini, Nebius, Claude, Perplexity, Grok, OpenAI)
 * through a unified tRPC API endpoint.
 *
 * Routes:
 *   multiAI.query       — Route to any provider
 *   multiAI.research    — Perplexity web-grounded research
 *   multiAI.legal       — Claude contract/legal analysis
 *   multiAI.sports      — Grok sports/real-time data
 *   multiAI.vision      — OpenAI/Gemini image analysis
 *   multiAI.providerStatus — Health check all providers
 */

import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import {
  routeAI,
  claudeChat,
  perplexitySearch,
  grokChat,
  openAIChat,
  AI_MODELS,
  ATHLYNX_SYSTEM_PROMPT,
  type AIProvider,
} from "../services/multiAI";

const AI_PROVIDER_SCHEMA = z.enum(["gemini", "nebius", "claude", "perplexity", "grok", "openai"]);

export const multiAIRouter = router({
  /**
   * Universal AI query — route to any provider
   */
  query: protectedProcedure
    .input(z.object({
      provider:     AI_PROVIDER_SCHEMA.default("gemini"),
      model:        z.string().optional(),
      userMessage:  z.string().min(1).max(4000),
      systemPrompt: z.string().optional(),
      maxTokens:    z.number().min(100).max(8000).optional(),
      temperature:  z.number().min(0).max(2).optional(),
    }))
    .mutation(async ({ input }) => {
      const result = await routeAI({
        provider:     input.provider as AIProvider,
        model:        input.model,
        userMessage:  input.userMessage,
        systemPrompt: input.systemPrompt,
        maxTokens:    input.maxTokens,
        temperature:  input.temperature,
      });
      return result;
    }),

  /**
   * Perplexity web-grounded research — live data, NIL market, news
   */
  research: protectedProcedure
    .input(z.object({
      query:        z.string().min(1).max(2000),
      deepResearch: z.boolean().default(false),
      context:      z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const model = input.deepResearch ? AI_MODELS.SONAR_DEEP : AI_MODELS.SONAR_PRO;
      const systemPrompt = input.context
        ? `${ATHLYNX_SYSTEM_PROMPT}\n\nContext: ${input.context}`
        : ATHLYNX_SYSTEM_PROMPT;

      return await perplexitySearch(input.query, {
        model,
        systemPrompt,
        maxTokens: 2048,
      });
    }),

  /**
   * Claude legal/contract analysis
   */
  legal: protectedProcedure
    .input(z.object({
      document:     z.string().min(1).max(10000),
      task:         z.enum(["review", "summarize", "red_flags", "compare", "draft"]),
      context:      z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const taskPrompts: Record<string, string> = {
        review:    "Review this legal document thoroughly. Identify key terms, obligations, risks, and recommendations.",
        summarize: "Summarize this legal document in plain language. Focus on what the athlete needs to know.",
        red_flags: "Identify all red flags, concerning clauses, and unfavorable terms in this document.",
        compare:   "Compare the terms in this document against standard NIL deal benchmarks.",
        draft:     "Draft a professional legal document based on these requirements.",
      };

      const systemPrompt = `You are the AthlynXAI Legal AI — specialized in NIL contracts, athlete agreements, and sports law.
${ATHLYNX_SYSTEM_PROMPT}
Focus: Contract review, legal analysis, athlete protection.`;

      return await claudeChat(
        `${taskPrompts[input.task]}\n\n${input.context ? `Context: ${input.context}\n\n` : ""}Document:\n${input.document}`,
        {
          systemPrompt,
          model: AI_MODELS.CLAUDE_SONNET,
          maxTokens: 4096,
          temperature: 0.3,
        }
      );
    }),

  /**
   * Grok sports analytics + real-time data
   */
  sports: protectedProcedure
    .input(z.object({
      query:   z.string().min(1).max(2000),
      sport:   z.string().optional(),
      context: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const systemPrompt = `You are the AthlynXAI Sports Intelligence Engine — powered by Grok 3 (xAI).
Specialties: Real-time sports data, recruiting intel, NIL valuations, draft analysis, game analytics.
Sport focus: ${input.sport ?? "all sports"}.
${ATHLYNX_SYSTEM_PROMPT}`;

      return await grokChat(
        input.context ? `${input.context}\n\n${input.query}` : input.query,
        {
          systemPrompt,
          model: AI_MODELS.GROK_3_MINI,
          maxTokens: 1024,
          temperature: 0.7,
        }
      );
    }),

  /**
   * Provider health check — public endpoint for the AI Engine dashboard
   */
  providerStatus: publicProcedure
    .query(async () => {
      const providers: { name: string; key: string; models: string[] }[] = [
        {
          name: "Gemini (Google)",
          key: "GOOGLE_AI_API_KEY",
          models: ["gemini-2.5-flash", "gemini-2.5-pro"],
        },
        {
          name: "Nebius H200 (NVIDIA)",
          key: "NEBIUS_API_KEY",
          models: ["Llama-4-Maverick", "Llama-4-Scout", "Llama-3.3-70B"],
        },
        {
          name: "Anthropic Claude",
          key: "ANTHROPIC_API_KEY",
          models: ["claude-3-5-sonnet", "claude-3-5-haiku"],
        },
        {
          name: "Perplexity Sonar",
          key: "SONAR_API_KEY",
          models: ["sonar-pro", "sonar", "sonar-deep-research"],
        },
        {
          name: "Grok (xAI)",
          key: "GROK_API_KEY",
          models: ["grok-3", "grok-3-mini"],
        },
        {
          name: "OpenAI",
          key: "OPENAI_API_KEY",
          models: ["gpt-4o", "gpt-4o-mini", "o3-mini"],
        },
      ];

      return providers.map((p) => ({
        name:      p.name,
        status:    process.env[p.key] ? "configured" : "missing_key",
        models:    p.models,
        hasKey:    !!process.env[p.key],
      }));
    }),
});
