import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { Pool } from "pg";

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

async function getFounderUserId(userId: number | null): Promise<number | null> {
  if (!userId) return null;
  const pool = await getPool();
  const r = await pool.query<{ id: number; isFounder: boolean }>(
    `SELECT id, "isFounder" FROM users WHERE id = $1 LIMIT 1`,
    [userId]
  );
  return r.rows[0]?.isFounder ? r.rows[0].id : null;
}

async function requireFounder(userId: number | null): Promise<number> {
  const fid = await getFounderUserId(userId);
  if (!fid) throw new TRPCError({ code: "FORBIDDEN", message: "Founder access required" });
  return fid;
}

export const founderRouter = router({
  // ── Public reads ───────────────────────────────────────────────────────
  // Is this athlete followed by a founder? Returns founder display info.
  isFollowedByFounder: publicProcedure
    .input(z.object({ athleteId: z.number() }))
    .query(async ({ input }) => {
      const pool = await getPool();
      const r = await pool.query(
        `SELECT u.id, u.name AS "displayName", u."avatarUrl"
         FROM founder_follows ff
         JOIN users u ON u.id = ff."founderUserId"
         WHERE ff."athleteId" = $1
         LIMIT 1`,
        [input.athleteId]
      );
      return r.rows[0] || null;
    }),

  // Pinned founder note for a specific athlete (one card on their Summary tab)
  getPinnedNote: publicProcedure
    .input(z.object({ athleteId: z.number() }))
    .query(async ({ input }) => {
      const pool = await getPool();
      const r = await pool.query(
        `SELECT id, title, body, "createdAt"
         FROM founder_notes
         WHERE "athleteId" = $1 AND pinned = true
         ORDER BY "createdAt" DESC
         LIMIT 1`,
        [input.athleteId]
      );
      return r.rows[0] || null;
    }),

  // Platform-wide founder lessons feed
  listLessons: publicProcedure
    .input(
      z.object({
        category: z
          .enum(["all", "mindset", "recruiting", "NIL", "training", "life"])
          .default("all"),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const pool = await getPool();
      const params: any[] = [input.limit, input.offset];
      let where = `active = true`;
      if (input.category !== "all") {
        params.push(input.category);
        where += ` AND category = $${params.length}`;
      }
      const r = await pool.query(
        `SELECT id, title, body, "audioUrl", category, "publishedAt"
         FROM founder_lessons
         WHERE ${where}
         ORDER BY "publishedAt" DESC
         LIMIT $1 OFFSET $2`,
        params
      );
      return r.rows;
    }),

  // Founder profile for /founder page
  getFounderProfile: publicProcedure.query(async () => {
    const pool = await getPool();
    const r = await pool.query(
      `SELECT id, name AS "displayName", "avatarUrl", email
       FROM users WHERE "isFounder" = true ORDER BY id ASC LIMIT 1`
    );
    return r.rows[0] || null;
  }),

  // ── Founder-only mutations ─────────────────────────────────────────────
  followAthlete: protectedProcedure
    .input(z.object({ athleteId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const fid = await requireFounder(ctx.user?.id ?? null);
      const pool = await getPool();
      await pool.query(
        `INSERT INTO founder_follows ("founderUserId", "athleteId")
         VALUES ($1, $2)
         ON CONFLICT ("founderUserId", "athleteId") DO NOTHING`,
        [fid, input.athleteId]
      );
      return { success: true };
    }),

  unfollowAthlete: protectedProcedure
    .input(z.object({ athleteId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const fid = await requireFounder(ctx.user?.id ?? null);
      const pool = await getPool();
      await pool.query(
        `DELETE FROM founder_follows WHERE "founderUserId" = $1 AND "athleteId" = $2`,
        [fid, input.athleteId]
      );
      return { success: true };
    }),

  postNote: protectedProcedure
    .input(
      z.object({
        athleteId: z.number(),
        title: z.string().max(160).optional(),
        body: z.string().min(1).max(4000),
        pinned: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const fid = await requireFounder(ctx.user?.id ?? null);
      const pool = await getPool();
      // Only one pinned note at a time per athlete
      if (input.pinned) {
        await pool.query(
          `UPDATE founder_notes SET pinned = false WHERE "athleteId" = $1`,
          [input.athleteId]
        );
      }
      const r = await pool.query(
        `INSERT INTO founder_notes ("founderUserId", "athleteId", title, body, pinned)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [fid, input.athleteId, input.title ?? null, input.body, input.pinned]
      );
      return r.rows[0];
    }),

  publishLesson: protectedProcedure
    .input(
      z.object({
        title: z.string().min(2).max(160),
        body: z.string().min(1).max(8000),
        audioUrl: z.string().url().optional(),
        category: z.enum(["mindset", "recruiting", "NIL", "training", "life"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const fid = await requireFounder(ctx.user?.id ?? null);
      const pool = await getPool();
      const r = await pool.query(
        `INSERT INTO founder_lessons ("founderUserId", title, body, "audioUrl", category)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [fid, input.title, input.body, input.audioUrl ?? null, input.category ?? null]
      );
      return r.rows[0];
    }),
});
