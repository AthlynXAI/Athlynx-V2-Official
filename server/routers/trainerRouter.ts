import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { invokeLLM, getActiveEngine } from "../_core/llm";
import {
  appendMessage,
  getHistory,
  clearHistory,
  recallFacts,
} from "../services/trainerStore";

// Locked system prompt for Coach Lynx.
const COACH_LYNX_SYSTEM_PROMPT = `You are Coach Lynx, the AthlynXAI trainer. You speak like a man on a porch telling the truth — direct, warm, brief. You honor the athlete's journey from youth to pro to retired. You never use emojis. You never lead with features. You help the athlete build their profile, find recruiters, plan training, and stay focused. Close every response with "Iron sharpens iron."`;

export const trainerRouter = router({
  history: protectedProcedure.query(async ({ ctx }) => {
    const messages = await getHistory(ctx.user.id);
    return { messages };
  }),

  chat: protectedProcedure
    .input(
      z.object({
        message: z.string().min(1).max(4000),
        contextScreen: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await appendMessage(ctx.user.id, {
        role: "user",
        content: input.message,
        createdAt: Date.now(),
        contextScreen: input.contextScreen,
      });

      const [history, facts] = await Promise.all([
        getHistory(ctx.user.id),
        recallFacts(ctx.user.id, 10),
      ]);
      const recent = history.slice(-20);
      const factsBlock = facts.length
        ? `\n\nWhat you remember about this athlete:\n- ${facts.join("\n- ")}`
        : "";

      const llmMessages = [
        {
          role: "system" as const,
          content:
            COACH_LYNX_SYSTEM_PROMPT +
            factsBlock +
            (input.contextScreen
              ? `\n\nCurrent screen: ${input.contextScreen}`
              : ""),
        },
        ...recent.map(m => ({ role: m.role, content: m.content })),
      ];

      let reply = "";
      const engine = getActiveEngine();
      try {
        const result = await invokeLLM({
          messages: llmMessages,
          maxTokens: 600,
        });
        const c = result.choices?.[0]?.message?.content;
        reply =
          typeof c === "string"
            ? c
            : Array.isArray(c)
              ? c.map(p => ("text" in p ? p.text : "")).join("")
              : "";
      } catch {
        reply =
          "Took a tough rep there. Try me again in a moment. Iron sharpens iron.";
      }

      if (!reply.trim()) {
        reply = "Still with you. Ask me again. Iron sharpens iron.";
      }

      await appendMessage(ctx.user.id, {
        role: "assistant",
        content: reply,
        createdAt: Date.now(),
        contextScreen: input.contextScreen,
        modelUsed: engine,
      });

      return { reply, engine };
    }),

  reset: protectedProcedure.mutation(async ({ ctx }) => {
    await clearHistory(ctx.user.id);
    return { ok: true };
  }),
});
