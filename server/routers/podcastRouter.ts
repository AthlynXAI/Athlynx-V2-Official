import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { Pool } from "pg";
import { streamProvider } from "../services/streamProvider";
import { getSignedUploadUrl } from "../services/r2Upload";

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
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 160);

async function isFounder(userId: number | null): Promise<boolean> {
  if (!userId) return false;
  const pool = await getPool();
  const r = await pool.query<{ isFounder: boolean }>(
    `SELECT "isFounder" FROM users WHERE id = $1 LIMIT 1`,
    [userId]
  );
  return !!r.rows[0]?.isFounder;
}

export const podcastRouter = router({
  // ── Public ─────────────────────────────────────────────────────────────
  listPublished: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const pool = await getPool();
      const r = await pool.query(
        `SELECT id, slug, title, subtitle, description, "episodeNumber", "seasonNumber",
                "audioUrl", "videoStreamId", "videoThumbnailUrl", "coverArtUrl",
                "durationSeconds", "publishedAt", explicit
         FROM podcast_episodes
         WHERE status = 'published' AND "publishedAt" IS NOT NULL
         ORDER BY "publishedAt" DESC NULLS LAST
         LIMIT $1 OFFSET $2`,
        [input.limit, input.offset]
      );
      return r.rows;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      const pool = await getPool();
      const ep = await pool.query(
        `SELECT * FROM podcast_episodes WHERE slug = $1 AND status = 'published' LIMIT 1`,
        [input.slug]
      );
      if (!ep.rows[0]) throw new TRPCError({ code: "NOT_FOUND" });
      const guests = await pool.query(
        `SELECT id, "userId", "guestName", "guestRole", "guestAvatarUrl", "sortOrder"
         FROM podcast_episode_guests
         WHERE "episodeId" = $1
         ORDER BY "sortOrder" ASC`,
        [ep.rows[0].id]
      );
      return { episode: ep.rows[0], guests: guests.rows };
    }),

  // RSS data — page handler renders the XML
  rssData: publicProcedure.query(async () => {
    const pool = await getPool();
    const r = await pool.query(
      `SELECT id, slug, title, subtitle, description, "episodeNumber", "audioUrl",
              "coverArtUrl", "durationSeconds", "publishedAt", explicit
       FROM podcast_episodes
       WHERE status = 'published' AND "audioUrl" IS NOT NULL
       ORDER BY "publishedAt" DESC NULLS LAST
       LIMIT 200`
    );
    return r.rows;
  }),

  // Receipt: which episodes feature a given user as a guest
  receiptsForUser: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const pool = await getPool();
      const r = await pool.query(
        `SELECT e.id, e.slug, e.title, e."publishedAt", e."coverArtUrl",
                g."guestName", g."guestRole"
         FROM podcast_episode_guests g
         JOIN podcast_episodes e ON e.id = g."episodeId"
         WHERE g."userId" = $1 AND e.status = 'published'
         ORDER BY e."publishedAt" DESC NULLS LAST`,
        [input.userId]
      );
      return r.rows;
    }),

  // ── Founder-only ───────────────────────────────────────────────────────
  createEpisode: protectedProcedure
    .input(
      z.object({
        title: z.string().min(2).max(240),
        subtitle: z.string().max(240).optional(),
        description: z.string().max(8000).optional(),
        episodeNumber: z.number().int().positive().optional(),
        seasonNumber: z.number().int().positive().default(1),
        explicit: z.boolean().default(false),
        showNotes: z.string().max(20000).optional(),
        coverArtUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id ?? null;
      if (!(await isFounder(userId))) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Founder access required" });
      }
      const pool = await getPool();
      let slug = slugify(input.title);
      if (!slug) slug = `episode-${Date.now()}`;
      // Ensure unique slug
      const exists = await pool.query(`SELECT 1 FROM podcast_episodes WHERE slug = $1`, [slug]);
      if (exists.rows.length) slug = `${slug}-${Date.now().toString(36)}`;
      const r = await pool.query(
        `INSERT INTO podcast_episodes (slug, title, subtitle, description, "episodeNumber",
            "seasonNumber", explicit, "showNotes", "coverArtUrl", status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'draft')
         RETURNING id, slug`,
        [
          slug,
          input.title,
          input.subtitle ?? null,
          input.description ?? null,
          input.episodeNumber ?? null,
          input.seasonNumber,
          input.explicit,
          input.showNotes ?? null,
          input.coverArtUrl ?? null,
        ]
      );
      return r.rows[0];
    }),

  publishEpisode: protectedProcedure
    .input(z.object({ id: z.number(), publishedAt: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      if (!(await isFounder(ctx.user?.id ?? null))) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const pool = await getPool();
      const when = input.publishedAt ? new Date(input.publishedAt) : new Date();
      await pool.query(
        `UPDATE podcast_episodes SET status = 'published', "publishedAt" = $2, "updatedAt" = now() WHERE id = $1`,
        [input.id, when]
      );
      return { success: true };
    }),

  // Sign an R2 upload URL for podcast audio
  signAudioUpload: protectedProcedure
    .input(
      z.object({
        episodeId: z.number(),
        filename: z.string().min(1).max(255),
        contentType: z.string().default("audio/mpeg"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!(await isFounder(ctx.user?.id ?? null))) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const safe = input.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
      const key = `podcast/${input.episodeId}/${Date.now()}-${safe}`;
      const signed = await getSignedUploadUrl(key, input.contentType);
      // Persist read URL on the episode row so it's ready to play after upload
      const pool = await getPool();
      await pool.query(
        `UPDATE podcast_episodes SET "audioUrl" = $2, "updatedAt" = now() WHERE id = $1`,
        [input.episodeId, signed.readUrl]
      );
      return signed;
    }),

  // Create a Cloudflare Stream direct-upload URL for the video version
  signVideoUpload: protectedProcedure
    .input(z.object({ episodeId: z.number(), filename: z.string().min(1).max(255) }))
    .mutation(async ({ ctx, input }) => {
      if (!(await isFounder(ctx.user?.id ?? null))) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const signed = await streamProvider.getUploadUrl(`podcast-${input.episodeId}-${input.filename}`);
      const pool = await getPool();
      await pool.query(
        `UPDATE podcast_episodes SET "videoStreamId" = $2, "updatedAt" = now() WHERE id = $1`,
        [input.episodeId, signed.providerStreamId]
      );
      return signed;
    }),

  addGuest: protectedProcedure
    .input(
      z.object({
        episodeId: z.number(),
        userId: z.number().nullable().optional(),
        guestName: z.string().min(1).max(160),
        guestRole: z.string().max(160).optional(),
        guestAvatarUrl: z.string().url().optional(),
        sortOrder: z.number().int().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!(await isFounder(ctx.user?.id ?? null))) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const pool = await getPool();
      const r = await pool.query(
        `INSERT INTO podcast_episode_guests
         ("episodeId", "userId", "guestName", "guestRole", "guestAvatarUrl", "sortOrder")
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [
          input.episodeId,
          input.userId ?? null,
          input.guestName,
          input.guestRole ?? null,
          input.guestAvatarUrl ?? null,
          input.sortOrder,
        ]
      );
      return r.rows[0];
    }),
});
