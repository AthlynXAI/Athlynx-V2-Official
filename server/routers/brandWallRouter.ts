import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { Pool } from "pg";

let _pool: Pool | null = null;
function destroyPool(reason: string) {
  if (_pool) {
    const old = _pool;
    _pool = null;
    try {
      void old.end().catch(() => {});
    } catch (_) {}
    console.warn(`[brandWallRouter] Pool reset: ${reason}`);
  }
}
async function getPool(): Promise<Pool> {
  if (!_pool) {
    _pool = new Pool({
      connectionString: process.env.DATABASE_URL!,
      ssl: { rejectUnauthorized: false },
      max: 5,
      connectionTimeoutMillis: 8000,
      idleTimeoutMillis: 240_000,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10_000,
      statement_timeout: 15_000,
      idle_in_transaction_session_timeout: 10_000,
      allowExitOnIdle: true,
    } as any);
    const poolHandle = _pool;
    poolHandle.on("error", (err) => {
      console.warn(
        `[brandWallRouter] pool error (auto-recovering): ${(err as Error).message}`,
      );
      if (_pool === poolHandle) destroyPool("pool error");
    });
    poolHandle.on("connect", (client) => {
      client.on("error", (clientErr) => {
        console.warn(
          `[brandWallRouter] client error (auto-recovering): ${(clientErr as Error).message}`,
        );
        if (_pool === poolHandle) destroyPool("client error");
      });
    });
  }
  return _pool;
}

async function isFounder(userId: number | null): Promise<boolean> {
  if (!userId) return false;
  const pool = await getPool();
  const r = await pool.query<{ isFounder: boolean }>(
    `SELECT "isFounder" FROM users WHERE id = $1 LIMIT 1`,
    [userId]
  );
  return !!r.rows[0]?.isFounder;
}

export const brandWallRouter = router({
  // ── Public reads ───────────────────────────────────────────────────────
  // Tiered platform-wide wall — every brand approved by the founder.
  listApproved: publicProcedure
    .input(
      z.object({
        tier: z.enum(["all", "iconic", "major", "regional", "local", "unknown"]).default("all"),
        category: z.string().max(48).optional(),
        limit: z.number().min(1).max(200).default(100),
      })
    )
    .query(async ({ input }) => {
      const pool = await getPool();
      const params: any[] = [input.limit];
      let where = `approved = true AND active = true`;
      if (input.tier !== "all") {
        params.push(input.tier);
        where += ` AND tier = $${params.length}`;
      }
      if (input.category) {
        params.push(input.category);
        where += ` AND category = $${params.length}`;
      }
      const r = await pool.query(
        `SELECT id, "brandName", "brandLogoUrl", "brandDomain", tier, category, "sortOrder"
         FROM brand_wall_entries
         WHERE ${where}
         ORDER BY
           CASE tier
             WHEN 'iconic' THEN 0
             WHEN 'major' THEN 1
             WHEN 'regional' THEN 2
             WHEN 'local' THEN 3
             ELSE 4
           END,
           "sortOrder" ASC,
           "brandName" ASC
         LIMIT $1`,
        params
      );
      return r.rows;
    }),

  // Receipts for an athlete profile — only signed deals are public
  receiptsForAthlete: publicProcedure
    .input(z.object({ athleteId: z.number() }))
    .query(async ({ input }) => {
      const pool = await getPool();
      const r = await pool.query(
        `SELECT p.id, p."signedAt", p."dealValueCents",
                b.id AS "brandId", b."brandName", b."brandLogoUrl", b.tier, b.category
         FROM brand_wall_pursuits p
         JOIN brand_wall_entries b ON b.id = p."brandWallEntryId"
         WHERE p."athleteId" = $1 AND p.status = 'signed' AND b.approved = true
         ORDER BY p."signedAt" DESC NULLS LAST`,
        [input.athleteId]
      );
      return r.rows;
    }),

  // ── Athlete actions ────────────────────────────────────────────────────
  submitBrand: protectedProcedure
    .input(
      z.object({
        brandName: z.string().min(2).max(160),
        brandDomain: z.string().max(160).optional(),
        brandLogoUrl: z.string().url().optional(),
        category: z.string().max(48).optional(),
        suggestedTier: z.enum(["iconic", "major", "regional", "local"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id ?? null;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });
      const pool = await getPool();
      const r = await pool.query(
        `INSERT INTO brand_wall_entries
         ("brandName", "brandDomain", "brandLogoUrl", category, tier, "submittedBy", approved)
         VALUES ($1, $2, $3, $4, $5, $6, false)
         ON CONFLICT ((LOWER("brandName"))) DO UPDATE SET "updatedAt" = now()
         RETURNING id, "brandName", approved`,
        [
          input.brandName.trim(),
          input.brandDomain ?? null,
          input.brandLogoUrl ?? null,
          input.category ?? null,
          input.suggestedTier ?? "unknown",
          userId,
        ]
      );
      return r.rows[0];
    }),

  setPursuit: protectedProcedure
    .input(
      z.object({
        brandWallEntryId: z.number(),
        athleteId: z.number(),
        status: z.enum(["wishlist", "pitched", "conversation", "signed", "closed"]),
        notes: z.string().max(4000).optional(),
        signedAt: z.string().optional(),
        dealValueCents: z.number().int().nonnegative().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id ?? null;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });
      const pool = await getPool();
      // Verify the athleteId belongs to this user (or founder)
      const own = await pool.query(
        `SELECT 1 FROM athlete_profiles WHERE id = $1 AND "userId" = $2 LIMIT 1`,
        [input.athleteId, userId]
      );
      if (own.rows.length === 0 && !(await isFounder(userId))) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const signedAt = input.signedAt
        ? new Date(input.signedAt)
        : input.status === "signed"
        ? new Date()
        : null;
      await pool.query(
        `INSERT INTO brand_wall_pursuits
         ("athleteId", "brandWallEntryId", status, notes, "signedAt", "dealValueCents")
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT ("athleteId", "brandWallEntryId") DO UPDATE SET
           status = EXCLUDED.status,
           notes = COALESCE(EXCLUDED.notes, brand_wall_pursuits.notes),
           "signedAt" = COALESCE(EXCLUDED."signedAt", brand_wall_pursuits."signedAt"),
           "dealValueCents" = COALESCE(EXCLUDED."dealValueCents", brand_wall_pursuits."dealValueCents"),
           "updatedAt" = now()`,
        [
          input.athleteId,
          input.brandWallEntryId,
          input.status,
          input.notes ?? null,
          signedAt,
          input.dealValueCents ?? null,
        ]
      );
      return { success: true };
    }),

  // ── Founder curation ───────────────────────────────────────────────────
  approveBrand: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        tier: z.enum(["iconic", "major", "regional", "local", "unknown"]),
        sortOrder: z.number().int().default(0),
        brandLogoUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id ?? null;
      if (!(await isFounder(userId))) throw new TRPCError({ code: "FORBIDDEN" });
      const pool = await getPool();
      await pool.query(
        `UPDATE brand_wall_entries
         SET approved = true, tier = $2, "sortOrder" = $3,
             "brandLogoUrl" = COALESCE($4, "brandLogoUrl"),
             "curatedBy" = $5, "updatedAt" = now()
         WHERE id = $1`,
        [input.id, input.tier, input.sortOrder, input.brandLogoUrl ?? null, userId]
      );
      return { success: true };
    }),
});
