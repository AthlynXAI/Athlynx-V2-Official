/**
 * Layer Cake Router — AthlynX Profile Automation (the marketing machine)
 *
 * Owner-authorized by Chad A Dozier (Master Admin) on 2026-05-11.
 *
 * What it does:
 *   - Connect/disconnect accounts: Buffer, Zapier, Gravatar, Jira, Confluence,
 *     Atlassian, Alignable, LinkedIn, X, Facebook, Instagram, TikTok, YouTube
 *   - Toggle daily automation on/off per user
 *   - Queue posts with Real Me / Real AI Me voice
 *   - Master Admin override: Chad pre-empts any scheduled post with a personal Real Me update
 *   - All AI-generated posts pass through the Values Gate before they queue
 *
 * Doctrine: see /home/user/workspace/athlynx_brand_doctrine.md
 *   People remember meaning, not features.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { sql } from "drizzle-orm";
import { runValuesGate } from "../services/valuesGate";

const PROVIDERS = [
  "buffer", "zapier", "gravatar",
  "jira", "confluence", "atlassian",
  "alignable",
  "linkedin", "x", "facebook", "instagram", "tiktok", "youtube",
  "google_business",
] as const;

const VOICES = ["real_me", "real_ai"] as const;

function isMasterAdmin(email?: string | null): boolean {
  if (!email) return false;
  const m = email.toLowerCase();
  return m === "chaddozier75@gmail.com"
      || m === "cdozier14@athlynx.ai"
      || m === "cdozier@dozierholdingsgroup.com";
}

export const layerCakeRouter = router({

  // ─── Connected accounts ─────────────────────────────────────────────────────

  listConnectedAccounts: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      const userId = Number(ctx.user.id);
      const rows = await db.execute(sql`
        SELECT id, provider, account_label, external_id, api_endpoint, is_active, is_owner_only, metadata, created_at, updated_at
        FROM connected_accounts
        WHERE user_id = ${userId}
        ORDER BY provider ASC, created_at DESC
      `);
      return (rows as any).rows ?? rows ?? [];
    }),

  connectAccount: protectedProcedure
    .input(z.object({
      provider: z.enum(PROVIDERS),
      accountLabel: z.string().optional(),
      externalId: z.string().optional(),
      apiEndpoint: z.string().url().optional(),
      isOwnerOnly: z.boolean().optional(),
      metadata: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const userId = Number(ctx.user.id);
      await db.execute(sql`
        INSERT INTO connected_accounts
          (user_id, provider, account_label, external_id, api_endpoint, is_owner_only, metadata)
        VALUES
          (${userId}, ${input.provider}, ${input.accountLabel ?? null},
           ${input.externalId ?? null}, ${input.apiEndpoint ?? null},
           ${input.isOwnerOnly ?? false}, ${JSON.stringify(input.metadata ?? {})}::jsonb)
      `);
      return { ok: true };
    }),

  toggleAccount: protectedProcedure
    .input(z.object({ accountId: z.number(), isActive: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const userId = Number(ctx.user.id);
      await db.execute(sql`
        UPDATE connected_accounts
        SET is_active = ${input.isActive}, updated_at = now()
        WHERE id = ${input.accountId} AND user_id = ${userId}
      `);
      return { ok: true };
    }),

  disconnectAccount: protectedProcedure
    .input(z.object({ accountId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const userId = Number(ctx.user.id);
      await db.execute(sql`
        DELETE FROM connected_accounts WHERE id = ${input.accountId} AND user_id = ${userId}
      `);
      return { ok: true };
    }),

  // ─── Automation settings ────────────────────────────────────────────────────

  getAutomation: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      const userId = Number(ctx.user.id);
      const rows = await db.execute(sql`
        SELECT * FROM profile_automation WHERE user_id = ${userId}
      `);
      const list: any[] = (rows as any).rows ?? rows ?? [];
      if (list.length === 0) {
        return {
          user_id: userId,
          enabled: false,
          daily_target_count: 1,
          default_voice: "real_ai",
          brand_voice_note: "man on a porch telling the truth",
          channels: [],
          master_admin: isMasterAdmin(ctx.user.email),
        };
      }
      return list[0];
    }),

  upsertAutomation: protectedProcedure
    .input(z.object({
      enabled: z.boolean(),
      dailyTargetCount: z.number().min(0).max(20),
      defaultVoice: z.enum(VOICES),
      brandVoiceNote: z.string().optional(),
      channels: z.array(z.string()),
      quietHoursStart: z.number().min(0).max(23).optional(),
      quietHoursEnd: z.number().min(0).max(23).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const userId = Number(ctx.user.id);
      const master = isMasterAdmin(ctx.user.email);
      await db.execute(sql`
        INSERT INTO profile_automation
          (user_id, enabled, daily_target_count, default_voice, brand_voice_note,
           channels, quiet_hours_start, quiet_hours_end, master_admin)
        VALUES
          (${userId}, ${input.enabled}, ${input.dailyTargetCount}, ${input.defaultVoice},
           ${input.brandVoiceNote ?? "man on a porch telling the truth"},
           ${JSON.stringify(input.channels)}::jsonb,
           ${input.quietHoursStart ?? 22}, ${input.quietHoursEnd ?? 6},
           ${master})
        ON CONFLICT (user_id) DO UPDATE SET
           enabled = EXCLUDED.enabled,
           daily_target_count = EXCLUDED.daily_target_count,
           default_voice = EXCLUDED.default_voice,
           brand_voice_note = EXCLUDED.brand_voice_note,
           channels = EXCLUDED.channels,
           quiet_hours_start = EXCLUDED.quiet_hours_start,
           quiet_hours_end = EXCLUDED.quiet_hours_end,
           master_admin = EXCLUDED.master_admin,
           updated_at = now()
      `);
      return { ok: true };
    }),

  // ─── Scheduled posts ────────────────────────────────────────────────────────

  listScheduledPosts: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(200).default(50) }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      const userId = Number(ctx.user.id);
      const limit = input?.limit ?? 50;
      const rows = await db.execute(sql`
        SELECT * FROM scheduled_posts
        WHERE user_id = ${userId}
        ORDER BY scheduled_for DESC
        LIMIT ${limit}
      `);
      return (rows as any).rows ?? rows ?? [];
    }),

  queuePost: protectedProcedure
    .input(z.object({
      body: z.string().min(1).max(8000),
      voice: z.enum(VOICES).default("real_ai"),
      channels: z.array(z.string()).min(1),
      mediaUrl: z.string().url().optional(),
      linkUrl: z.string().url().optional(),
      scheduledFor: z.string().optional(), // ISO; defaults to now+10min
      source: z.enum(["agent", "manual", "owner_override"]).default("manual"),
      sourceNote: z.string().optional(),
      skipValuesGate: z.boolean().optional(), // Real Me from Master Admin can skip
    }))
    .mutation(async ({ ctx, input }) => {
      const master = isMasterAdmin(ctx.user.email);

      // Values gate enforcement
      if (!(input.skipValuesGate && master && input.voice === "real_me")) {
        const gate = runValuesGate(input.body);
        if (!gate.passes) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Values gate rejected this post: ${gate.reasons.join("; ")}. ${gate.rewrite_hint ?? ""}`,
          });
        }
      }

      const db = await getDb();
      const userId = Number(ctx.user.id);
      const scheduledFor = input.scheduledFor
        ? new Date(input.scheduledFor)
        : new Date(Date.now() + 10 * 60 * 1000);
      const rows = await db.execute(sql`
        INSERT INTO scheduled_posts
          (user_id, voice, body, media_url, link_url, channels,
           scheduled_for, source, source_note)
        VALUES
          (${userId}, ${input.voice}, ${input.body},
           ${input.mediaUrl ?? null}, ${input.linkUrl ?? null},
           ${JSON.stringify(input.channels)}::jsonb,
           ${scheduledFor.toISOString()}, ${input.source}, ${input.sourceNote ?? null})
        RETURNING id
      `);
      const list: any[] = (rows as any).rows ?? rows ?? [];
      return { ok: true, id: list[0]?.id };
    }),

  // Master Admin override: pre-empt the next queued post with a personal Real Me message.
  ownerPreempt: protectedProcedure
    .input(z.object({
      body: z.string().min(1).max(8000),
      channels: z.array(z.string()).min(1),
      mediaUrl: z.string().url().optional(),
      linkUrl: z.string().url().optional(),
      sourceNote: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!isMasterAdmin(ctx.user.email)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Master Admin only." });
      }
      const db = await getDb();
      const userId = Number(ctx.user.id);
      // Cancel the next queued post for this user
      await db.execute(sql`
        UPDATE scheduled_posts SET status = 'preempted', updated_at = now()
        WHERE id IN (
          SELECT id FROM scheduled_posts
          WHERE user_id = ${userId} AND status = 'queued'
          ORDER BY scheduled_for ASC LIMIT 1
        )
      `);
      // Insert the Real Me override at scheduled_for = now
      const rows = await db.execute(sql`
        INSERT INTO scheduled_posts
          (user_id, voice, body, media_url, link_url, channels,
           scheduled_for, source, source_note)
        VALUES
          (${userId}, 'real_me', ${input.body},
           ${input.mediaUrl ?? null}, ${input.linkUrl ?? null},
           ${JSON.stringify(input.channels)}::jsonb,
           ${new Date().toISOString()}, 'owner_override',
           ${input.sourceNote ?? "Master Admin Real Me override"})
        RETURNING id
      `);
      const list: any[] = (rows as any).rows ?? rows ?? [];
      return { ok: true, id: list[0]?.id };
    }),

  cancelScheduledPost: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const userId = Number(ctx.user.id);
      await db.execute(sql`
        UPDATE scheduled_posts SET status = 'cancelled', updated_at = now()
        WHERE id = ${input.postId} AND user_id = ${userId} AND status = 'queued'
      `);
      return { ok: true };
    }),

  // Health: does this draft pass the gate? Used by the agent before queueing.
  checkValuesGate: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => runValuesGate(input.text)),
});
