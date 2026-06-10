import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  recruitingBoardEntries,
  recruitingCoachViews,
  athleteAwards,
  athleteProfiles,
} from "../../drizzle/schema";
import { and, asc, count, desc, eq, sql } from "drizzle-orm";
import { getSignedUploadUrl } from "../services/r2Upload";

const interestLevel = z.enum([
  "watching",
  "interested",
  "offer_extended",
  "committed",
]);

const letterType = z.enum([
  "offer",
  "commitment",
  "interest",
  "ncaa_loi",
  "camp_invite",
]);

const ladderDirection = z.enum(["countdown", "topdown"]);

// Throws FORBIDDEN if the calling user does not own the athleteId.
async function ensureAthleteOwner(db: any, athleteId: number, userId: number) {
  const [owner] = await db
    .select({ userId: athleteProfiles.userId })
    .from(athleteProfiles)
    .where(eq(athleteProfiles.id, athleteId))
    .limit(1);
  if (!owner || owner.userId !== userId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Not your profile." });
  }
  return owner;
}

export const recruitingRouter = router({
  // ─── Reads ─────────────────────────────────────────────────────────────────
  getBoardForAthlete: publicProcedure
    .input(z.object({ athleteId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database temporarily unavailable.",
        });
      const entries = await db
        .select()
        .from(recruitingBoardEntries)
        .where(eq(recruitingBoardEntries.athleteId, input.athleteId))
        .orderBy(desc(recruitingBoardEntries.lastContactAt));
      return entries;
    }),

  getCoachViewCount: publicProcedure
    .input(z.object({ athleteId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database temporarily unavailable.",
        });
      const [row] = await db
        .select({ total: count() })
        .from(recruitingCoachViews)
        .where(eq(recruitingCoachViews.athleteId, input.athleteId));
      return { count: Number(row?.total ?? 0) };
    }),

  getTopFive: publicProcedure
    .input(z.object({ athleteId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database temporarily unavailable.",
        });
      const [row] = await db
        .select({ topFive: athleteProfiles.recruitingTopFive })
        .from(athleteProfiles)
        .where(eq(athleteProfiles.id, input.athleteId))
        .limit(1);
      const list = Array.isArray(row?.topFive)
        ? (row!.topFive as string[])
        : [];
      return { topFive: list.slice(0, 5) };
    }),

  // Build 3: full Top 5 ladder — rank-ordered entries plus the athlete's
  // preferred direction (countdown 5→1 or top-down 1→5).
  getTopFiveLadder: publicProcedure
    .input(z.object({ athleteId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database temporarily unavailable.",
        });
      const [profileRow] = await db
        .select({
          direction: athleteProfiles.recruitingLadderDirection,
        })
        .from(athleteProfiles)
        .where(eq(athleteProfiles.id, input.athleteId))
        .limit(1);
      const entries = await db
        .select()
        .from(recruitingBoardEntries)
        .where(
          and(
            eq(recruitingBoardEntries.athleteId, input.athleteId),
            sql`${recruitingBoardEntries.rank} IS NOT NULL`
          )
        )
        .orderBy(asc(recruitingBoardEntries.rank))
        .limit(5);
      return {
        direction: (profileRow?.direction ?? "countdown") as
          | "countdown"
          | "topdown",
        slots: entries,
      };
    }),

  getAwards: publicProcedure
    .input(z.object({ athleteId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database temporarily unavailable.",
        });
      const rows = await db
        .select()
        .from(athleteAwards)
        .where(eq(athleteAwards.athleteId, input.athleteId))
        .orderBy(desc(athleteAwards.awardedOn));
      return rows;
    }),

  // ─── Writes (athlete-controlled) ──────────────────────────────────────────
  setTopFive: protectedProcedure
    .input(
      z.object({
        athleteId: z.number(),
        colleges: z.array(z.string().min(1).max(255)).max(5),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database temporarily unavailable.",
        });
      // Verify ownership.
      const [owner] = await db
        .select({ userId: athleteProfiles.userId })
        .from(athleteProfiles)
        .where(eq(athleteProfiles.id, input.athleteId))
        .limit(1);
      if (!owner || owner.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not your profile.",
        });
      }
      await db
        .update(athleteProfiles)
        .set({ recruitingTopFive: input.colleges, updatedAt: new Date() })
        .where(eq(athleteProfiles.id, input.athleteId));
      return { ok: true, colleges: input.colleges };
    }),

  // ─── Build 3: Top 5 ladder writes ──────────────────────────────

  // Set the ladder direction (countdown 5→1 or topdown 1→5).
  setLadderDirection: protectedProcedure
    .input(z.object({ athleteId: z.number(), direction: ladderDirection }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database temporarily unavailable.",
        });
      await ensureAthleteOwner(db, input.athleteId, ctx.user.id);
      await db
        .update(athleteProfiles)
        .set({
          recruitingLadderDirection: input.direction,
          updatedAt: new Date(),
        })
        .where(eq(athleteProfiles.id, input.athleteId));
      return { ok: true, direction: input.direction };
    }),

  // Assign a rank (1-5) to a board entry. Pass null to clear.
  // Swaps ranks if another entry already holds the target rank.
  setSlotRank: protectedProcedure
    .input(
      z.object({
        athleteId: z.number(),
        entryId: z.number(),
        rank: z.number().int().min(1).max(5).nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database temporarily unavailable.",
        });
      await ensureAthleteOwner(db, input.athleteId, ctx.user.id);

      // Verify entry belongs to athlete.
      const [entry] = await db
        .select({
          id: recruitingBoardEntries.id,
          athleteId: recruitingBoardEntries.athleteId,
          currentRank: recruitingBoardEntries.rank,
        })
        .from(recruitingBoardEntries)
        .where(eq(recruitingBoardEntries.id, input.entryId))
        .limit(1);
      if (!entry || entry.athleteId !== input.athleteId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Entry not on your board.",
        });
      }

      // If clearing rank, just null it.
      if (input.rank === null) {
        await db
          .update(recruitingBoardEntries)
          .set({ rank: null, updatedAt: new Date() })
          .where(eq(recruitingBoardEntries.id, input.entryId));
        return { ok: true, cleared: true };
      }

      // If something else currently has this rank, swap.
      const [conflict] = await db
        .select({ id: recruitingBoardEntries.id })
        .from(recruitingBoardEntries)
        .where(
          and(
            eq(recruitingBoardEntries.athleteId, input.athleteId),
            eq(recruitingBoardEntries.rank, input.rank)
          )
        )
        .limit(1);
      if (conflict && conflict.id !== input.entryId) {
        await db
          .update(recruitingBoardEntries)
          .set({ rank: entry.currentRank ?? null, updatedAt: new Date() })
          .where(eq(recruitingBoardEntries.id, conflict.id));
      }
      await db
        .update(recruitingBoardEntries)
        .set({ rank: input.rank, updatedAt: new Date() })
        .where(eq(recruitingBoardEntries.id, input.entryId));
      return { ok: true, rank: input.rank, swapped: !!(conflict && conflict.id !== input.entryId) };
    }),

  // Presigned R2 PUT URL for uploading a letter PDF/image.
  getLetterUploadUrl: protectedProcedure
    .input(
      z.object({
        athleteId: z.number(),
        filename: z.string().min(1).max(200),
        contentType: z.string().min(1).max(120),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database temporarily unavailable.",
        });
      await ensureAthleteOwner(db, input.athleteId, ctx.user.id);
      if (!/^(application\/pdf|image\/)/.test(input.contentType)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only PDF or image files are allowed.",
        });
      }
      const safeName = input.filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
      const key = `recruiting-letters/${input.athleteId}/${Date.now()}-${safeName}`;
      const { uploadUrl, readUrl } = await getSignedUploadUrl(
        key,
        input.contentType,
        900
      );
      return { uploadUrl, readUrl, key };
    }),

  // Attach an uploaded letter to a board entry.
  setSlotLetter: protectedProcedure
    .input(
      z.object({
        athleteId: z.number(),
        entryId: z.number(),
        letterUrl: z.string().url().nullable(),
        letterType: letterType.nullable(),
        letterFilename: z.string().max(255).nullable(),
        letterPublic: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database temporarily unavailable.",
        });
      await ensureAthleteOwner(db, input.athleteId, ctx.user.id);
      const [entry] = await db
        .select({
          id: recruitingBoardEntries.id,
          athleteId: recruitingBoardEntries.athleteId,
        })
        .from(recruitingBoardEntries)
        .where(eq(recruitingBoardEntries.id, input.entryId))
        .limit(1);
      if (!entry || entry.athleteId !== input.athleteId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Entry not on your board.",
        });
      }
      await db
        .update(recruitingBoardEntries)
        .set({
          letterUrl: input.letterUrl,
          letterType: input.letterType,
          letterFilename: input.letterFilename,
          letterPublic: input.letterPublic,
          letterUploadedAt: input.letterUrl ? new Date() : null,
          updatedAt: new Date(),
        })
        .where(eq(recruitingBoardEntries.id, input.entryId));
      return { ok: true };
    }),

  // ─── Writes (recruiter-driven; not athlete-controlled) ────────────────────
  logCoachView: publicProcedure
    .input(
      z.object({
        athleteId: z.number(),
        coachName: z.string().max(128).optional(),
        collegeName: z.string().max(255).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database temporarily unavailable.",
        });
      await db.insert(recruitingCoachViews).values({
        athleteId: input.athleteId,
        coachName: input.coachName ?? null,
        collegeName: input.collegeName ?? null,
      });
      return { ok: true };
    }),

  upsertInterest: protectedProcedure
    .input(
      z.object({
        athleteId: z.number(),
        collegeName: z.string().min(1).max(255),
        level: interestLevel.default("watching"),
        division: z.string().max(32).optional(),
        conference: z.string().max(64).optional(),
        coachName: z.string().max(128).optional(),
        coachEmail: z.string().email().optional(),
        notes: z.string().max(2000).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database temporarily unavailable.",
        });
      const existing = await db
        .select()
        .from(recruitingBoardEntries)
        .where(
          and(
            eq(recruitingBoardEntries.athleteId, input.athleteId),
            eq(recruitingBoardEntries.collegeName, input.collegeName)
          )
        )
        .limit(1);
      if (existing.length) {
        await db
          .update(recruitingBoardEntries)
          .set({
            level: input.level,
            division: input.division ?? existing[0].division,
            conference: input.conference ?? existing[0].conference,
            coachName: input.coachName ?? existing[0].coachName,
            coachEmail: input.coachEmail ?? existing[0].coachEmail,
            notes: input.notes ?? existing[0].notes,
            lastContactAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(recruitingBoardEntries.id, existing[0].id));
        return { ok: true, id: existing[0].id, updated: true };
      }
      const [inserted] = await db
        .insert(recruitingBoardEntries)
        .values({
          athleteId: input.athleteId,
          collegeName: input.collegeName,
          level: input.level,
          division: input.division ?? null,
          conference: input.conference ?? null,
          coachName: input.coachName ?? null,
          coachEmail: input.coachEmail ?? null,
          notes: input.notes ?? null,
          firstContactAt: new Date(),
          lastContactAt: new Date(),
        })
        .returning({ id: recruitingBoardEntries.id });
      return { ok: true, id: inserted?.id, created: true };
    }),

  addAward: protectedProcedure
    .input(
      z.object({
        athleteId: z.number(),
        title: z.string().min(1).max(255),
        organization: z.string().max(255).optional(),
        category: z
          .enum([
            "team",
            "conference",
            "state",
            "regional",
            "national",
            "academic",
            "media",
            "combine",
          ])
          .default("team"),
        season: z.string().max(16).optional(),
        awardedOn: z.date().optional(),
        proofUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database temporarily unavailable.",
        });
      const [owner] = await db
        .select({ userId: athleteProfiles.userId })
        .from(athleteProfiles)
        .where(eq(athleteProfiles.id, input.athleteId))
        .limit(1);
      if (!owner || owner.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not your profile.",
        });
      }
      const [inserted] = await db
        .insert(athleteAwards)
        .values({
          athleteId: input.athleteId,
          title: input.title,
          organization: input.organization ?? null,
          category: input.category,
          season: input.season ?? null,
          awardedOn: input.awardedOn ?? null,
          proofUrl: input.proofUrl ?? null,
        })
        .returning({ id: athleteAwards.id });
      return { ok: true, id: inserted?.id };
    }),
});
