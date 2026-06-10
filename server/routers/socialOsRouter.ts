/**
 * Build 7 — Soul Source OS Router
 * The Apple Moment integration layer. Owns auth tokens, content pool, dedup, post log.
 * Every social/app endpoint flows through here — one keyring, one rotation brain.
 */
import { z } from "zod";
import crypto from "crypto";
import { sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { isMasterAdmin } from "../_core/adminAllowlist";
import { audit } from "../_core/audit";

function contentHash(body: string, imageUrl?: string | null, videoUrl?: string | null, linkUrl?: string | null): string {
  const canonical = [body.trim().toLowerCase(), imageUrl ?? "", videoUrl ?? "", linkUrl ?? ""].join("|");
  return crypto.createHash("sha256").update(canonical).digest("hex").slice(0, 32);
}

const contentKind = z.enum(["text", "image", "video", "link", "mixed"]);
const platformSlug = z.string().min(2).max(40);

function socialOsTenantId(): string {
  return (process.env.SOCIAL_OS_TENANT_ID || process.env.AthlynXAI_TENANT_ID || "athlynxai").trim();
}

// ─── AI Draft Helper ──────────────────────────────────────────────────────────
// Calls Claude / OpenAI / Gemini / Perplexity directly to draft 5 AthlynX-voice
// posts on a theme. Returns drafts only — Chad picks which ones to add to the pool.
const draftEngine = z.enum(["claude", "gpt", "gemini", "sonar"]);

const DRAFT_SYSTEM_PROMPT = `You are the AthlynX brand voice — a man on a porch telling the truth.
AthlynX is the complete athlete ecosystem. From backyard to billion-dollar deal.
We serve athletes from youth to pro to retirement. 22 founding athletes are already on board.

Write five short social posts about the theme the user gives you.

Voice rules (non-negotiable):
- Plain words. Short sentences. Real cadence.
- No emojis. No hashtags. No exclamation points.
- No corporate buzzwords. No "unlock", "empower", "revolutionize", "game-changer", "synergy".
- No family or personal disclosures.
- Confidence without arrogance. Truth without theater.
- Each post must stand on its own. 1–3 short paragraphs each.
- Each post must be 60–280 characters.

Output format (strict JSON, nothing else):
{"drafts":[{"title":"short internal title","body":"the post text","kind":"text","tags":["theme","keyword"]}, ... 5 total]}`;

function extractJsonBlock(text: string): any {
  // Try direct parse first
  try { return JSON.parse(text); } catch {}
  // Strip ```json fences
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) {
    try { return JSON.parse(fenced[1]); } catch {}
  }
  // Find first { ... last }
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try { return JSON.parse(text.slice(start, end + 1)); } catch {}
  }
  throw new Error("Could not parse JSON from model output");
}

const draftItemSchema = z.object({
  title: z.string().max(200).optional().default(""),
  body: z.string().min(1).max(5000),
  kind: z.string().optional().default("text"),
  tags: z.array(z.string()).optional().default([]),
});

async function draftClaude(theme: string): Promise<any[]> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new TRPCError({ code: "BAD_REQUEST", message: "ANTHROPIC_API_KEY not set in Vercel env" });
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 2000,
      system: DRAFT_SYSTEM_PROMPT,
      messages: [{ role: "user", content: `Theme: ${theme}\n\nReturn the JSON object only.` }],
    }),
  });
  if (!res.ok) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Claude API ${res.status}: ${await res.text()}` });
  const j = await res.json();
  const text = (j.content?.[0]?.text ?? "").toString();
  const parsed = extractJsonBlock(text);
  return parsed.drafts ?? [];
}

async function draftGpt(theme: string): Promise<any[]> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new TRPCError({ code: "BAD_REQUEST", message: "OPENAI_API_KEY not set in Vercel env" });
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: DRAFT_SYSTEM_PROMPT },
        { role: "user", content: `Theme: ${theme}\n\nReturn the JSON object only.` },
      ],
    }),
  });
  if (!res.ok) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `OpenAI API ${res.status}: ${await res.text()}` });
  const j = await res.json();
  const text = (j.choices?.[0]?.message?.content ?? "").toString();
  const parsed = extractJsonBlock(text);
  return parsed.drafts ?? [];
}

async function draftGemini(theme: string): Promise<any[]> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new TRPCError({ code: "BAD_REQUEST", message: "GEMINI_API_KEY not set in Vercel env" });
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: DRAFT_SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: `Theme: ${theme}\n\nReturn the JSON object only.` }] }],
      generationConfig: { responseMimeType: "application/json", maxOutputTokens: 2000 },
    }),
  });
  if (!res.ok) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Gemini API ${res.status}: ${await res.text()}` });
  const j = await res.json();
  const text = (j.candidates?.[0]?.content?.parts?.[0]?.text ?? "").toString();
  const parsed = extractJsonBlock(text);
  return parsed.drafts ?? [];
}

async function draftSonar(theme: string): Promise<any[]> {
  const key = process.env.PERPLEXITY_API_KEY;
  if (!key) throw new TRPCError({ code: "BAD_REQUEST", message: "PERPLEXITY_API_KEY not set in Vercel env" });
  const res = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      model: "sonar",
      messages: [
        { role: "system", content: DRAFT_SYSTEM_PROMPT },
        { role: "user", content: `Theme: ${theme}\n\nReturn the JSON object only.` },
      ],
    }),
  });
  if (!res.ok) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Perplexity API ${res.status}: ${await res.text()}` });
  const j = await res.json();
  const text = (j.choices?.[0]?.message?.content ?? "").toString();
  const parsed = extractJsonBlock(text);
  return parsed.drafts ?? [];
}

export const socialOsRouter = router({
  // ─── PUBLIC READS (so the admin page can render without auth flapping) ──────
  platforms: publicProcedure.query(async () => {
    const db = await getDb();
    const rows = await db.execute(sql`
      SELECT slug, name, category, posts_per_day, supports_text, supports_image,
             supports_video, supports_link, notes, is_active
      FROM social_platforms
      WHERE is_active = TRUE
      ORDER BY category, name
    `);
    return (rows as any).rows ?? rows;
  }),

  // ─── ADMIN ACTIONS ──────────────────────────────────────────────────────────
  accountsList: protectedProcedure.query(async ({ ctx }) => {
    if (!isMasterAdmin(ctx.user?.email)) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Master admin only" });
    }
    const db = await getDb();
    const tenantId = socialOsTenantId();
    const rows = await db.execute(sql`
      SELECT id, platform_slug, display_name, handle, external_id,
             access_token_env, refresh_token_env, webhook_url, status,
             last_used_at, last_error, created_at, updated_at
      FROM social_accounts
      WHERE tenant_id = ${tenantId}
      ORDER BY platform_slug, display_name
    `);
    return (rows as any).rows ?? rows;
  }),

  accountUpsert: protectedProcedure
    .input(
      z.object({
        id: z.number().int().optional(),
        platformSlug,
        displayName: z.string().min(1).max(120),
        handle: z.string().max(120).optional(),
        externalId: z.string().max(120).optional(),
        accessTokenEnv: z.string().max(120).optional(),
        refreshTokenEnv: z.string().max(120).optional(),
        webhookUrl: z.string().url().optional(),
        status: z.enum(["active", "paused", "error"]).default("active"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!isMasterAdmin(ctx.user?.email)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Master admin only" });
      }
      const db = await getDb();
      const tenantId = socialOsTenantId();
      if (input.id) {
        await db.execute(sql`
          UPDATE social_accounts
          SET platform_slug = ${input.platformSlug},
              display_name = ${input.displayName},
              handle = ${input.handle ?? null},
              external_id = ${input.externalId ?? null},
              access_token_env = ${input.accessTokenEnv ?? null},
              refresh_token_env = ${input.refreshTokenEnv ?? null},
              webhook_url = ${input.webhookUrl ?? null},
              status = ${input.status},
              updated_at = NOW()
          WHERE id = ${input.id} AND tenant_id = ${tenantId}
        `);
        await audit({ ctx, action: "social_os.account_update", targetType: "social_account", targetId: String(input.id) });
        return { id: input.id, ok: true };
      }
      const result = await db.execute(sql`
        INSERT INTO social_accounts (tenant_id, platform_slug, display_name, handle, external_id, access_token_env, refresh_token_env, webhook_url, status)
        VALUES (${tenantId}, ${input.platformSlug}, ${input.displayName}, ${input.handle ?? null}, ${input.externalId ?? null}, ${input.accessTokenEnv ?? null}, ${input.refreshTokenEnv ?? null}, ${input.webhookUrl ?? null}, ${input.status})
        RETURNING id
      `);
      const id = ((result as any).rows?.[0]?.id ?? null);
      await audit({ ctx, action: "social_os.account_create", targetType: "social_account", targetId: String(id), metadata: { platform: input.platformSlug } });
      return { id, ok: true };
    }),

  accountDelete: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      if (!isMasterAdmin(ctx.user?.email)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Master admin only" });
      }
      const db = await getDb();
      const tenantId = socialOsTenantId();
      await db.execute(sql`DELETE FROM social_accounts WHERE id = ${input.id} AND tenant_id = ${tenantId}`);
      await audit({ ctx, action: "social_os.account_delete", targetType: "social_account", targetId: String(input.id) });
      return { ok: true };
    }),

  contentList: protectedProcedure
    .input(z.object({ activeOnly: z.boolean().default(true), limit: z.number().int().min(1).max(500).default(100) }).optional())
    .query(async ({ ctx, input }) => {
      if (!isMasterAdmin(ctx.user?.email)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Master admin only" });
      }
      const db = await getDb();
      const tenantId = socialOsTenantId();
      const activeOnly = input?.activeOnly ?? true;
      const limit = input?.limit ?? 100;
      const rows = await db.execute(sql`
        SELECT id, kind, title, body, link_url, image_url, video_url, tags,
               content_hash, is_active, use_count, last_used_at, created_at
        FROM social_content
        WHERE tenant_id = ${tenantId}
          AND (${activeOnly}::boolean = FALSE OR is_active = TRUE)
        ORDER BY created_at DESC
        LIMIT ${limit}
      `);
      return (rows as any).rows ?? rows;
    }),

  contentUpsert: protectedProcedure
    .input(
      z.object({
        id: z.number().int().optional(),
        kind: contentKind.default("text"),
        title: z.string().max(200).optional(),
        body: z.string().min(1).max(5000),
        linkUrl: z.string().url().optional(),
        imageUrl: z.string().url().optional(),
        videoUrl: z.string().url().optional(),
        tags: z.array(z.string()).optional(),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!isMasterAdmin(ctx.user?.email)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Master admin only" });
      }
      const db = await getDb();
      const tenantId = socialOsTenantId();
      const hash = contentHash(input.body, input.imageUrl, input.videoUrl, input.linkUrl);
      const tagsLit = input.tags && input.tags.length > 0 ? sql`${input.tags}::text[]` : sql`NULL`;
      if (input.id) {
        await db.execute(sql`
          UPDATE social_content
          SET kind = ${input.kind},
              title = ${input.title ?? null},
              body = ${input.body},
              link_url = ${input.linkUrl ?? null},
              image_url = ${input.imageUrl ?? null},
              video_url = ${input.videoUrl ?? null},
              tags = ${tagsLit},
              content_hash = ${hash},
              is_active = ${input.isActive},
              updated_at = NOW()
          WHERE id = ${input.id} AND tenant_id = ${tenantId}
        `);
        await audit({ ctx, action: "social_os.content_update", targetType: "social_content", targetId: String(input.id) });
        return { id: input.id, ok: true };
      }
      const result = await db.execute(sql`
        INSERT INTO social_content (tenant_id, kind, title, body, link_url, image_url, video_url, tags, content_hash, is_active, created_by)
        VALUES (${tenantId}, ${input.kind}, ${input.title ?? null}, ${input.body}, ${input.linkUrl ?? null}, ${input.imageUrl ?? null}, ${input.videoUrl ?? null}, ${tagsLit}, ${hash}, ${input.isActive}, ${ctx.user?.email ?? null})
        RETURNING id
      `);
      const id = ((result as any).rows?.[0]?.id ?? null);
      await audit({ ctx, action: "social_os.content_create", targetType: "social_content", targetId: String(id), metadata: { kind: input.kind } });
      return { id, ok: true };
    }),

  contentToggle: protectedProcedure
    .input(z.object({ id: z.number().int(), isActive: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if (!isMasterAdmin(ctx.user?.email)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Master admin only" });
      }
      const db = await getDb();
      const tenantId = socialOsTenantId();
      await db.execute(sql`UPDATE social_content SET is_active = ${input.isActive}, updated_at = NOW() WHERE id = ${input.id} AND tenant_id = ${tenantId}`);
      return { ok: true };
    }),

  // The post log — read for the daily report + dashboard.
  postsList: protectedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(500).default(100), sinceHours: z.number().int().min(1).max(168).default(48) }).optional())
    .query(async ({ ctx, input }) => {
      if (!isMasterAdmin(ctx.user?.email)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Master admin only" });
      }
      const db = await getDb();
      const tenantId = socialOsTenantId();
      const limit = input?.limit ?? 100;
      const sinceHours = input?.sinceHours ?? 48;
      const rows = await db.execute(sql`
        SELECT p.id, p.platform_slug, p.status, p.scheduled_for, p.posted_at,
               p.external_post_url, p.error, p.attempt,
               c.kind, c.title, c.body
        FROM social_posts p
        JOIN social_content c ON c.id = p.content_id
        WHERE p.tenant_id = ${tenantId}
          AND p.created_at > NOW() - (${sinceHours} || ' hours')::interval
        ORDER BY COALESCE(p.posted_at, p.scheduled_for, p.created_at) DESC
        LIMIT ${limit}
      `);
      return (rows as any).rows ?? rows;
    }),

  // Queue a content item to one or more platforms. The cron picks these up and posts.
  queue: protectedProcedure
    .input(
      z.object({
        contentId: z.number().int(),
        accountIds: z.array(z.number().int()).min(1),
        scheduledFor: z.string().datetime().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!isMasterAdmin(ctx.user?.email)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Master admin only" });
      }
      const db = await getDb();
      const tenantId = socialOsTenantId();
      const content = await db.execute(sql`SELECT content_hash FROM social_content WHERE id = ${input.contentId} AND tenant_id = ${tenantId}`);
      const hash = ((content as any).rows?.[0]?.content_hash ?? null);
      if (!hash) throw new TRPCError({ code: "NOT_FOUND", message: "Content not found" });

      let queued = 0;
      let skipped = 0;
      for (const accountId of input.accountIds) {
        const acct = await db.execute(sql`SELECT platform_slug FROM social_accounts WHERE id = ${accountId} AND tenant_id = ${tenantId}`);
        const slug = ((acct as any).rows?.[0]?.platform_slug ?? null);
        if (!slug) { skipped++; continue; }

        // Apple-Moment dedupe: never post the same content to the same platform twice.
        const dupe = await db.execute(sql`
          SELECT 1 FROM social_posts
          WHERE tenant_id = ${tenantId} AND content_hash = ${hash} AND platform_slug = ${slug} AND status = 'posted'
          LIMIT 1
        `);
        if (((dupe as any).rows?.length ?? 0) > 0) { skipped++; continue; }

        await db.execute(sql`
          INSERT INTO social_posts (tenant_id, content_id, account_id, platform_slug, content_hash, status, scheduled_for)
          VALUES (${tenantId}, ${input.contentId}, ${accountId}, ${slug}, ${hash}, 'scheduled', ${input.scheduledFor ?? null})
        `);
        queued++;
      }
      await audit({ ctx, action: "social_os.queue", targetType: "social_content", targetId: String(input.contentId), metadata: { queued, skipped } });
      return { queued, skipped, ok: true };
    }),

  // ─── AI DRAFT ───────────────────────────────────────────────────────────────────────────
  // Asks one of the wired AI engines to draft 5 AthlynX-voice posts on a theme.
  // Read-only: nothing is written to social_content until Chad accepts a draft.
  draftWithAi: protectedProcedure
    .input(z.object({ engine: draftEngine, theme: z.string().min(2).max(500) }))
    .mutation(async ({ ctx, input }) => {
      if (!isMasterAdmin(ctx.user?.email)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Master admin only" });
      }
      let rawDrafts: any[] = [];
      try {
        if (input.engine === "claude") rawDrafts = await draftClaude(input.theme);
        else if (input.engine === "gpt") rawDrafts = await draftGpt(input.theme);
        else if (input.engine === "gemini") rawDrafts = await draftGemini(input.theme);
        else if (input.engine === "sonar") rawDrafts = await draftSonar(input.theme);
      } catch (err: any) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Draft failed: ${err?.message ?? String(err)}` });
      }
      const drafts: Array<{ title: string; body: string; kind: string; tags: string[] }> = [];
      for (const d of rawDrafts) {
        const parsed = draftItemSchema.safeParse(d);
        if (parsed.success) {
          drafts.push({
            title: parsed.data.title ?? "",
            body: parsed.data.body,
            kind: ["text", "image", "video", "link", "mixed"].includes(parsed.data.kind ?? "text") ? (parsed.data.kind ?? "text") : "text",
            tags: parsed.data.tags ?? [],
          });
        }
      }
      await audit({ ctx, action: "social_os.draft_with_ai", targetType: "social_content", metadata: { engine: input.engine, theme: input.theme, count: drafts.length } });
      return { engine: input.engine, theme: input.theme, drafts };
    }),
});
