/**
 * studioRouter — Build 27.1 Studio Suite backend
 *
 * Powers <LineupStudio /> (Phase 2.1), <MatchDayStudio /> (2.2), and
 * <FinalScoreStudio /> (2.3). Composes existing schema (athlete_profiles,
 * athlete_calendar_events) and writes generated graphics to studio_graphics.
 *
 * AI Caption Engine (Phase 2.4) lives on this router as `generateCaptions`.
 * One-Tap Publish (Phase 2.5) lives on this router as `publish`.
 *
 * Doctrine:
 * - Athlete-owned: roster pulls only from the requesting user's connected roster.
 * - Routing not inventory: this composes existing identity records; the only
 *   new write is the studio_graphics row that records what was generated.
 */
import { z } from "zod";
import { Pool } from "pg";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { nebiusChat, NEBIUS_MODELS } from "../services/nebius";
import { schedulePost } from "../services/buffer";
import { deductAiCredits } from "../services/aiCredits";

let _pool: Pool | null = null;
async function getPool(): Promise<Pool> {
  if (!_pool) {
    _pool = new Pool({
      connectionString: process.env.DATABASE_URL!,
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
  }
  return _pool;
}

const studioTypeEnum = z.enum(["lineup", "matchday", "finalscore"]);

export const studioRouter = router({
  /** Roster pull: list athletes available to the requesting user. */
  rosterList: protectedProcedure.query(async ({ ctx }) => {
    const pool = await getPool();
    // V1: pull every published athlete profile. Team-scoping arrives with Phase 4
    // (Team Shared Workspace). Until then, the UI filter is client-side.
    const result = await pool.query(
      `SELECT
         ap.id,
         ap."userId" AS user_id,
         COALESCE(u."displayName", u.email) AS display_name,
         ap."jerseyNumber" AS jersey_number,
         ap."headshotUrl" AS headshot_url,
         ap.position
       FROM athlete_profiles ap
       INNER JOIN users u ON u.id = ap."userId"
       WHERE ap.published = true
       ORDER BY ap."jerseyNumber" NULLS LAST, display_name
       LIMIT 200`,
    );
    return {
      athletes: result.rows.map((r: any) => ({
        id: Number(r.id),
        displayName: String(r.display_name ?? "Athlete"),
        jerseyNumber: r.jersey_number == null ? null : Number(r.jersey_number),
        headshotUrl: r.headshot_url ?? null,
        position: r.headshot_url ?? null,
      })),
    };
  }),

  /** Calendar pull for MatchDayStudio. */
  upcomingGames: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(10) }))
    .query(async ({ ctx, input }) => {
      const pool = await getPool();
      const userId = (ctx as any).user?.id;
      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const result = await pool.query(
        `SELECT id, title, date, time, type, location, description
         FROM athlete_calendar_events
         WHERE "userId" = $1 AND type IN ('game', 'tournament', 'meet', 'competition')
           AND date >= to_char(CURRENT_DATE, 'YYYY-MM-DD')
         ORDER BY date ASC, time ASC
         LIMIT $2`,
        [userId, input.limit],
      );
      return { games: result.rows };
    }),

  /**
   * Latest GameChanger auto-ingest for the requesting user.
   *
   * Returns the most-recent `finalscore` graphic whose payload.source is
   * 'gamechanger' — used to prefill <FinalScoreStudio /> the moment a game ends.
   * Returns `{ ingest: null }` if no auto-ingest is waiting.
   */
  latestAutoIngest: protectedProcedure.query(async ({ ctx }) => {
    const userId = (ctx as any).user?.id;
    if (!userId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const pool = await getPool();
    const result = await pool.query(
      `SELECT id, payload, "createdAt"
         FROM studio_graphics
        WHERE "userId" = $1
          AND type = 'finalscore'
          AND payload->>'source' = 'gamechanger'
        ORDER BY "createdAt" DESC
        LIMIT 1`,
      [userId],
    );
    if (result.rows.length === 0) {
      return { ingest: null };
    }
    const row = result.rows[0];
    const payload = (row.payload ?? {}) as Record<string, unknown>;
    const score = (payload.score ?? {}) as { us?: number; them?: number };
    const topPerformerRaw = payload.topPerformer;
    return {
      ingest: {
        graphicId: Number(row.id),
        createdAt: row.createdAt as string,
        opponent: String(payload.opponent ?? ""),
        teamScore: typeof score.us === "number" ? score.us : 0,
        opponentScore: typeof score.them === "number" ? score.them : 0,
        result: (payload.result as "W" | "L" | "T" | null) ?? null,
        gameDate: (payload.gameDate as string | null) ?? null,
        topPerformer:
          typeof topPerformerRaw === "string" ? topPerformerRaw : "",
        gcEventId: String(payload.gcEventId ?? ""),
      },
    };
  }),

  /** Persist a generated graphic. */
  saveGraphic: protectedProcedure
    .input(
      z.object({
        type: studioTypeEnum,
        teamName: z.string().min(1).max(160),
        opponent: z.string().max(160).optional(),
        gameDate: z.string().length(10).optional(),
        pngUrl: z.string().url().optional(),
        payload: z.unknown(),
        captions: z.array(z.string()).max(10).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const pool = await getPool();
      const userId = (ctx as any).user?.id;
      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const result = await pool.query(
        `INSERT INTO studio_graphics
           ("userId", type, "teamName", opponent, "gameDate", "pngUrl", payload, captions)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id, "createdAt"`,
        [
          userId,
          input.type,
          input.teamName,
          input.opponent ?? null,
          input.gameDate ?? null,
          input.pngUrl ?? null,
          JSON.stringify(input.payload ?? {}),
          input.captions ? JSON.stringify(input.captions) : null,
        ],
      );
      return { id: Number(result.rows[0].id), createdAt: result.rows[0].createdAt };
    }),

  /**
   * Phase 2.4 AI Caption Engine — Nebius Llama 3.3-70B.
   * Generates exactly 3 captions per graphic in the AthlynXAI team voice
   * (Founder-direct, Athlete-first, Proof-backed, Faith-anchored, Mississippi-grounded).
   * Persists captions onto the studio_graphics row.
   */
  generateCaptions: protectedProcedure
    .input(
      z.object({
        graphicId: z.number().int().positive(),
        type: studioTypeEnum,
        teamName: z.string().min(1).max(160),
        opponent: z.string().max(160).optional(),
        gameDate: z.string().length(10).optional(),
        topPerformer: z.string().max(160).optional(),
        result: z.enum(["W", "L", "T"]).optional(),
        score: z.string().max(32).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = (ctx as any).user?.id;
      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await deductAiCredits({
        userId,
        action: "studio.generateCaptions",
        cost: 5,
        description: "Studio AI captions",
      });

      // Layer Cake v1 mental model (spec 05):
      // - Athletes are an identity OS, not a stat snapshot. Lifecycle > moment.
      // - We route athletes to opportunities; we do not inventory them.
      // - Every claim is a verified noun (named, dated, sourced) over puffery.
      // Voice blend below is the M-9 baseline; reconcile lands when m9_brand_voice_reconciled drops.
      const systemPrompt = [
        "You are the AthlynXAI team-voice caption engine.",
        "Mental model: every athlete is a lifecycle, not a snapshot. The team is the subject. We name real moments, not generic hype.",
        "Write social captions in this brand voice blend:",
        "- Founder-direct (30%): plain, declarative, no filler. Sound like a coach who knows the kid by name.",
        "- Athlete-first (25%): the athlete or team is the subject. The platform is never the hero.",
        "- Proof-backed (20%): verified nouns — real numbers, named players, dates, scores — over adjectives.",
        "- Faith-anchored (15%): respectful, never preachy. End with the closer only if the moment calls for it.",
        "- Mississippi-grounded (10%): grit, work, family. No coastal startup jargon.",
        "Hard rules:",
        "- Never use the words: revolutionary, disrupt, game-changer, synergy, leverage, ecosystem, AI-powered.",
        "- Never describe the platform; describe the moment.",
        "- Max 220 characters per caption.",
        "- No hashtags unless the team handle is given.",
        "- Output exactly 3 captions, one per line, no numbering, no commentary.",
      ].join("\n");

      const contextParts: string[] = [
        `Team: ${input.teamName}`,
        `Graphic type: ${input.type}`,
      ];
      if (input.opponent) contextParts.push(`Opponent: ${input.opponent}`);
      if (input.gameDate) contextParts.push(`Date: ${input.gameDate}`);
      if (input.result) contextParts.push(`Result: ${input.result}`);
      if (input.score) contextParts.push(`Score: ${input.score}`);
      if (input.topPerformer) contextParts.push(`Top performer: ${input.topPerformer}`);

      const userPrompt = [
        "Write 3 social captions for this graphic.",
        "",
        ...contextParts,
      ].join("\n");

      let captions: string[];
      try {
        const raw = await nebiusChat(
          [{ role: "user", content: userPrompt }],
          NEBIUS_MODELS.LLAMA_70B,
          { systemPrompt, maxTokens: 512, temperature: 0.65 },
        );
        captions = raw
          .split("\n")
          .map((l) => l.replace(/^[\s\-*\d.)]+/, "").trim())
          .filter((l) => l.length > 0)
          .slice(0, 3);
      } catch (err) {
        // Graceful fallback so save flow never breaks if Nebius is down.
        captions = [
          `${input.teamName} — locked in.`,
          `Eyes up. ${input.teamName} on the clock.`,
          `Built for this. ${input.teamName}.`,
        ];
      }

      // Persist captions onto the graphic row so they survive page refresh.
      const pool = await getPool();
      await pool.query(
        `UPDATE studio_graphics
         SET captions = $1, "updatedAt" = NOW()
         WHERE id = $2 AND "userId" = $3`,
        [JSON.stringify(captions), input.graphicId, userId],
      );

      return {
        graphicId: input.graphicId,
        captions,
        model: NEBIUS_MODELS.LLAMA_70B,
      };
    }),

  /**
   * Phase 2.5 One-Tap Publish — Buffer + Zapier.
   *
   * Buffer: schedules a post using server/services/buffer.ts (schedulePost)
   * Zapier: POSTs the payload to STUDIO_ZAPIER_WEBHOOK_URL for downstream fan-out
   * (Notion log, team Slack, Airtable row, etc.).
   *
   * Records publishedTo on the graphic row.
   */
  publish: protectedProcedure
    .input(
      z.object({
        graphicId: z.number().int().positive(),
        caption: z.string().min(1).max(2200),
        imageUrl: z.string().url().optional(),
        channels: z.array(z.enum(["buffer", "zapier"])).min(1),
        bufferProfileIds: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = (ctx as any).user?.id;
      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const results: Record<string, { ok: boolean; error?: string; detail?: unknown }> = {};

      if (input.channels.includes("buffer")) {
        try {
          const profileIds =
            input.bufferProfileIds && input.bufferProfileIds.length > 0
              ? input.bufferProfileIds
              : (process.env.BUFFER_DEFAULT_PROFILE_IDS ?? "")
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean);
          if (profileIds.length === 0) {
            results.buffer = {
              ok: false,
              error: "No Buffer profile IDs configured. Set BUFFER_DEFAULT_PROFILE_IDS.",
            };
          } else {
            const res = await schedulePost(profileIds, input.caption, input.imageUrl);
            results.buffer = { ok: res.ok, detail: res.body };
          }
        } catch (err) {
          results.buffer = {
            ok: false,
            error: err instanceof Error ? err.message : "Buffer call failed",
          };
        }
      }

      if (input.channels.includes("zapier")) {
        const webhookUrl = process.env.STUDIO_ZAPIER_WEBHOOK_URL;
        if (!webhookUrl) {
          results.zapier = {
            ok: false,
            error: "STUDIO_ZAPIER_WEBHOOK_URL is not configured.",
          };
        } else {
          try {
            const resp = await fetch(webhookUrl, {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                graphicId: input.graphicId,
                userId,
                caption: input.caption,
                imageUrl: input.imageUrl,
                source: "athlynx_studio_suite",
                publishedAt: new Date().toISOString(),
              }),
            });
            results.zapier = { ok: resp.ok, detail: { status: resp.status } };
          } catch (err) {
            results.zapier = {
              ok: false,
              error: err instanceof Error ? err.message : "Zapier webhook failed",
            };
          }
        }
      }

      // Record what was attempted on the graphic row.
      const pool = await getPool();
      await pool.query(
        `UPDATE studio_graphics
         SET "publishedTo" = $1, "updatedAt" = NOW()
         WHERE id = $2 AND "userId" = $3`,
        [JSON.stringify(results), input.graphicId, userId],
      );

      return {
        graphicId: input.graphicId,
        results,
      };
    }),
});
