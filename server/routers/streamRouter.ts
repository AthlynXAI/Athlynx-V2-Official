import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { Pool } from "pg";
import { streamProvider } from "../services/streamProvider";

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

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 96);

async function isFounder(userId: number | null): Promise<boolean> {
  if (!userId) return false;
  const pool = await getPool();
  const r = await pool.query<{ isFounder: boolean }>(
    `SELECT "isFounder" FROM users WHERE id = $1 LIMIT 1`,
    [userId]
  );
  return !!r.rows[0]?.isFounder;
}

export const streamRouter = router({
  // ── Public channel + event browsing ────────────────────────────────────
  listChannels: publicProcedure
    .input(
      z.object({ sport: z.string().max(32).optional(), limit: z.number().min(1).max(100).default(50) })
    )
    .query(async ({ input }) => {
      const pool = await getPool();
      const params: any[] = [input.limit];
      let where = `active = true`;
      if (input.sport) {
        params.push(input.sport);
        where += ` AND sport = $${params.length}`;
      }
      const r = await pool.query(
        `SELECT id, slug, name, description, sport, "logoUrl", "bannerUrl"
         FROM stream_channels
         WHERE ${where}
         ORDER BY name ASC
         LIMIT $1`,
        params
      );
      return r.rows;
    }),

  getChannel: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      const pool = await getPool();
      const ch = await pool.query(
        `SELECT * FROM stream_channels WHERE slug = $1 AND active = true LIMIT 1`,
        [input.slug]
      );
      if (!ch.rows[0]) throw new TRPCError({ code: "NOT_FOUND" });
      const events = await pool.query(
        `SELECT id, slug, title, description, provider, "playbackUrl", "thumbnailUrl",
                status, "scheduledStartAt", "actualStartAt", "endedAt", "viewerCount"
         FROM stream_events
         WHERE "channelId" = $1 AND "isPublic" = true
         ORDER BY
           CASE status WHEN 'live' THEN 0 WHEN 'scheduled' THEN 1 ELSE 2 END,
           COALESCE("scheduledStartAt", "createdAt") DESC
         LIMIT 50`,
        [ch.rows[0].id]
      );
      return { channel: ch.rows[0], events: events.rows };
    }),

  listLive: publicProcedure.query(async () => {
    const pool = await getPool();
    const r = await pool.query(
      `SELECT e.id, e.slug, e.title, e.provider, e."playbackUrl", e."thumbnailUrl",
              e.status, e."viewerCount", c.name AS "channelName", c.slug AS "channelSlug"
       FROM stream_events e
       JOIN stream_channels c ON c.id = e."channelId"
       WHERE e.status = 'live' AND e."isPublic" = true AND c.active = true
       ORDER BY e."viewerCount" DESC
       LIMIT 50`
    );
    return r.rows;
  }),

  listUpcoming: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(20) }))
    .query(async ({ input }) => {
      const pool = await getPool();
      const r = await pool.query(
        `SELECT e.id, e.slug, e.title, e."thumbnailUrl", e."scheduledStartAt",
                c.name AS "channelName", c.slug AS "channelSlug"
         FROM stream_events e
         JOIN stream_channels c ON c.id = e."channelId"
         WHERE e.status = 'scheduled' AND e."isPublic" = true
           AND e."scheduledStartAt" IS NOT NULL
           AND e."scheduledStartAt" > now()
         ORDER BY e."scheduledStartAt" ASC
         LIMIT $1`,
        [input.limit]
      );
      return r.rows;
    }),

  // ── Founder/owner mutations ────────────────────────────────────────────
  createChannel: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(160),
        description: z.string().max(2000).optional(),
        sport: z.string().max(32).optional(),
        logoUrl: z.string().url().optional(),
        bannerUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id ?? null;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });
      const pool = await getPool();
      const slug = slugify(input.name) || `channel-${Date.now().toString(36)}`;
      const r = await pool.query(
        `INSERT INTO stream_channels (slug, name, description, sport, "logoUrl", "bannerUrl", "ownerUserId")
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, slug`,
        [
          slug,
          input.name,
          input.description ?? null,
          input.sport ?? null,
          input.logoUrl ?? null,
          input.bannerUrl ?? null,
          userId,
        ]
      );
      return r.rows[0];
    }),

  scheduleEvent: protectedProcedure
    .input(
      z.object({
        channelId: z.number(),
        title: z.string().min(2).max(240),
        description: z.string().max(4000).optional(),
        scheduledStartAt: z.string(), // ISO
        isPublic: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id ?? null;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });
      const pool = await getPool();
      // Verify ownership or founder
      const ch = await pool.query(
        `SELECT "ownerUserId" FROM stream_channels WHERE id = $1 LIMIT 1`,
        [input.channelId]
      );
      const owner = ch.rows[0]?.ownerUserId as number | null;
      if (owner !== userId && !(await isFounder(userId))) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      // Create live input on the provider
      const live = await streamProvider.createLiveInput({ name: input.title, recording: true });
      const slug = `${slugify(input.title)}-${Date.now().toString(36)}`;
      const r = await pool.query(
        `INSERT INTO stream_events
          ("channelId", slug, title, description, provider, "providerStreamId",
           "playbackUrl", status, "scheduledStartAt", "isPublic")
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'scheduled', $8, $9)
         RETURNING id, slug, "providerStreamId", "playbackUrl"`,
        [
          input.channelId,
          slug,
          input.title,
          input.description ?? null,
          streamProvider.name,
          live.providerStreamId,
          live.playbackHlsUrl,
          new Date(input.scheduledStartAt),
          input.isPublic,
        ]
      );
      return { ...r.rows[0], rtmpsUrl: live.rtmpsUrl, rtmpsStreamKey: live.rtmpsStreamKey };
    }),

  setEventStatus: protectedProcedure
    .input(
      z.object({
        eventId: z.number(),
        status: z.enum(["scheduled", "live", "ended", "vod", "draft"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id ?? null;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });
      const pool = await getPool();
      const sets: string[] = [`status = $2`, `"updatedAt" = now()`];
      const params: any[] = [input.eventId, input.status];
      if (input.status === "live") sets.push(`"actualStartAt" = now()`);
      if (input.status === "ended" || input.status === "vod") sets.push(`"endedAt" = now()`);
      await pool.query(
        `UPDATE stream_events SET ${sets.join(", ")} WHERE id = $1`,
        params
      );
      return { success: true };
    }),
});
