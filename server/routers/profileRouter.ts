import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb, isTransientDbError } from "../db";
import { athleteProfiles, users, sportsAvatarLibrary } from "../../drizzle/schema";
import { and, asc, eq, sql } from "drizzle-orm";
import { getSignedUploadUrl } from "../services/r2Upload";

export const profileRouter = router({
  getMyProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database temporarily unavailable. Please try again.",
      });
    const profile = await db
      .select()
      .from(athleteProfiles)
      .where(eq(athleteProfiles.userId, ctx.user.id))
      .limit(1);
    return profile[0] ?? null;
  }),

  getProfile: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database temporarily unavailable. Please try again.",
        });
      const [profile] = await db
        .select({
          id: athleteProfiles.id,
          userId: athleteProfiles.userId,
          sport: athleteProfiles.sport,
          position: athleteProfiles.position,
          school: athleteProfiles.school,
          height: athleteProfiles.height,
          weight: athleteProfiles.weight,
          gpa: athleteProfiles.gpa,
          classYear: athleteProfiles.classYear,
          state: athleteProfiles.state,
          bio: athleteProfiles.bio,
          recruitingStatus: athleteProfiles.recruitingStatus,
          nilValue: athleteProfiles.nilValue,
          coverUrl: athleteProfiles.coverUrl,
          highlightUrl: athleteProfiles.highlightUrl,
          instagram: athleteProfiles.instagram,
          twitter: athleteProfiles.twitter,
          followers: athleteProfiles.followers,
          sportStats: athleteProfiles.sportStats,
          coachViews: athleteProfiles.coachViews,
          collegesInterested: athleteProfiles.collegesInterested,
          nilVerified: athleteProfiles.nilVerified,
          facebookUrl: athleteProfiles.facebookUrl,
          youtubeUrl: athleteProfiles.youtubeUrl,
          linkedinUrl: athleteProfiles.linkedinUrl,
          tiktokHandle: athleteProfiles.tiktokHandle,
          spotifyUrl: athleteProfiles.spotifyUrl,
          capcutUrl: athleteProfiles.capcutUrl,
          recruitingScore: athleteProfiles.recruitingScore,
          // Build 50 · May 29, 2026 — Removed ghost columns flagged by Build 27 audit:
          //   recruitingVideos, filmRoomEnabled, totalVideoViews
          // These columns do not exist in athleteProfiles schema. Previous `as any`
          // cast hid the type error but the runtime query would fail.
          // Re-add after a real Drizzle migration adds them.
          name: users.name,
          email: users.email,
          avatarUrl: users.avatarUrl,
          stripePlanId: users.stripePlanId,
        })
        .from(athleteProfiles)
        .leftJoin(users, eq(athleteProfiles.userId, users.id))
        .where(eq(athleteProfiles.userId, input.userId))
        .limit(1);
      return profile ?? null;
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        sport: z.string().optional(),
        position: z.string().optional(),
        school: z.string().optional(),
        height: z.string().optional(),
        weight: z.number().optional(),
        gpa: z.number().min(0).max(4).optional(),
        classYear: z.string().optional(),
        state: z.string().optional(),
        bio: z.string().max(500).optional(),
        recruitingStatus: z
          .enum(["available", "committed", "signed", "transferred"])
          .optional(),
        instagram: z.string().optional(),
        twitter: z.string().optional(),
        followers: z.number().optional(),
        coverUrl: z.string().optional(),
        highlightUrl: z.string().optional(),
        sportStats: z.any().optional(),
        facebookUrl: z.string().optional(),
        youtubeUrl: z.string().optional(),
        linkedinUrl: z.string().optional(),
        tiktokHandle: z.string().optional(),
        spotifyUrl: z.string().optional(),
        capcutUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database temporarily unavailable. Please try again.",
        });
      const existing = await db
        .select({ id: athleteProfiles.id })
        .from(athleteProfiles)
        .where(eq(athleteProfiles.userId, ctx.user.id))
        .limit(1);

      const profileData = {
        sport: input.sport,
        position: input.position,
        school: input.school,
        height: input.height,
        weight: input.weight,
        gpa: input.gpa,
        classYear: input.classYear,
        state: input.state,
        bio: input.bio,
        recruitingStatus: input.recruitingStatus,
        instagram: input.instagram,
        twitter: input.twitter,
        followers: input.followers,
        coverUrl: input.coverUrl,
        highlightUrl: input.highlightUrl,
        sportStats: input.sportStats,
        facebookUrl: input.facebookUrl,
        youtubeUrl: input.youtubeUrl,
        linkedinUrl: input.linkedinUrl,
        tiktokHandle: input.tiktokHandle,
        spotifyUrl: input.spotifyUrl,
        capcutUrl: input.capcutUrl,
      };
      if (existing.length > 0) {
        await db
          .update(athleteProfiles)
          .set(profileData)
          .where(eq(athleteProfiles.userId, ctx.user.id));
      } else {
        await db
          .insert(athleteProfiles)
          .values({ userId: ctx.user.id, ...profileData });
      }

      // Calculate NIL value based on followers and sport
      const followers = input.followers ?? 0;
      const nilValue = Math.floor(followers * 0.05 + (input.gpa ?? 0) * 1000);
      if (nilValue > 0) {
        await db
          .update(athleteProfiles)
          .set({ nilValue })
          .where(eq(athleteProfiles.userId, ctx.user.id));
      }

      return { success: true };
    }),

  updateAvatar: protectedProcedure
    .input(z.object({ avatarUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database temporarily unavailable. Please try again.",
        });
      await db
        .update(users)
        .set({ avatarUrl: input.avatarUrl })
        .where(eq(users.id, ctx.user.id));
      return { success: true };
    }),

  browseAthletes: publicProcedure
    .input(
      z.object({
        sport: z.string().nullable().optional(),
        position: z.string().nullable().optional(),
        school: z.string().nullable().optional(),
        recruitingStatus: z.string().nullable().optional(),
        limit: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database temporarily unavailable. Please try again.",
        });

      const limit = input.limit ?? 20;
      try {
        const query = db
          .select({
            id: athleteProfiles.id,
            userId: athleteProfiles.userId,
            sport: athleteProfiles.sport,
            position: athleteProfiles.position,
            school: athleteProfiles.school,
            classYear: athleteProfiles.classYear,
            state: athleteProfiles.state,
            recruitingStatus: athleteProfiles.recruitingStatus,
            nilValue: athleteProfiles.nilValue,
            followers: athleteProfiles.followers,
            name: users.name,
            avatarUrl: users.avatarUrl,
          })
          .from(athleteProfiles)
          .leftJoin(users, eq(athleteProfiles.userId, users.id))
          .limit(limit);
        return query;
      } catch (error) {
        if (isTransientDbError(error)) {
          console.warn("[profile.browseAthletes] transient database error; returning empty list", (error as Error).message);
          return [];
        }
        throw error;
      }
    }),

  saveOnboarding: protectedProcedure
    .input(
      z.object({
        role: z.string(),
        data: z.record(z.string(), z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database temporarily unavailable. Please try again.",
        });
      // Save onboarding data to users table
      await db
        .update(users)
        .set({
          onboardingRole: input.role,
          onboardingData: JSON.stringify(input.data),
          onboardingCompleted: 1,
          sport: input.data.sport ?? undefined,
          school: input.data.school ?? undefined,
        })
        .where(eq(users.id, ctx.user.id));
      // Also update athlete profile if role is athlete
      if (input.role === "athlete") {
        const existing = await db
          .select({ id: athleteProfiles.id })
          .from(athleteProfiles)
          .where(eq(athleteProfiles.userId, ctx.user.id))
          .limit(1);
        const profileData = {
          sport: input.data.sport || null,
          position: input.data.position || null,
          school: input.data.school || null,
          classYear: input.data.graduation_year || null,
          state: input.data.location || null,
          recruitingStatus: input.data.recruiting_status || null,
          gpa: input.data.gpa ? parseFloat(input.data.gpa) : null,
          instagram: input.data.instagram || null,
          twitter: input.data.twitter || null,
          highlightUrl: input.data.highlight_reel || null,
        };
        if (existing.length > 0) {
          await db
            .update(athleteProfiles)
            .set(profileData)
            .where(eq(athleteProfiles.userId, ctx.user.id));
        } else {
          await db.insert(athleteProfiles).values({ userId: ctx.user.id });
          await db
            .update(athleteProfiles)
            .set(profileData)
            .where(eq(athleteProfiles.userId, ctx.user.id));
        }
      }
      return { success: true };
    }),

  /**
   * Build 1 — thin pass-through to update a single column on athleteProfiles.
   * Used by the 8-screen onboarding flow. Only allows columns we know exist
   * on the current schema; unknown columns return success without writing so
   * the onboarding flow can keep moving. TODO: harden once schema migrations
   * for jerseyNumber, headshotUrl, dominantHand, etc. land.
   */
  updateField: protectedProcedure
    .input(
      z.object({
        field: z.string().min(1).max(64),
        value: z.union([z.string(), z.number(), z.boolean(), z.null()]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database temporarily unavailable. Please try again.",
        });

      const allowed = new Set([
        "sport",
        "position",
        "school",
        "height",
        "weight",
        "gpa",
        "classYear",
        "state",
        "bio",
        "recruitingStatus",
        "instagram",
        "twitter",
        "followers",
        "coverUrl",
        "highlightUrl",
        "facebookUrl",
        "youtubeUrl",
        "linkedinUrl",
        "tiktokHandle",
        "spotifyUrl",
        "capcutUrl",
        // Build 2 columns ─────────────────────────────────────────────────────
        "headshotUrl",
        "actionPhotoUrl",
        "statScreenshotUrl",
        "jerseyNumber",
        "dominantHand",
        "athlynxStarRating",
        "athleticismScore",
        "published",
        // Build 3 — Editable Everywhere ─────────────────────────────────────
        "avatarChoiceKey",
        "coverChoiceKey",
        "recruitingLadderDirection",
      ]);
      if (!allowed.has(input.field)) {
        return {
          success: true,
          persisted: false,
          reason: "field not yet in schema",
        };
      }

      const existing = await db
        .select({ id: athleteProfiles.id })
        .from(athleteProfiles)
        .where(eq(athleteProfiles.userId, ctx.user.id))
        .limit(1);

      const patch: Record<string, unknown> = { [input.field]: input.value };
      if (existing.length > 0) {
        await db
          .update(athleteProfiles)
          .set(patch)
          .where(eq(athleteProfiles.userId, ctx.user.id));
      } else {
        await db
          .insert(athleteProfiles)
          .values({ userId: ctx.user.id, ...patch });
      }
      return { success: true, persisted: true };
    }),

  // ── Build 3: curated sports avatar / cover library ─────────────────────────
  listAvatarLibrary: publicProcedure
    .input(
      z.object({
        kind: z.enum(["avatar", "cover"]),
        sport: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const rows = await db
        .select()
        .from(sportsAvatarLibrary)
        .where(
          input.sport
            ? and(
                eq(sportsAvatarLibrary.kind, input.kind),
                eq(sportsAvatarLibrary.active, true),
                sql`(${sportsAvatarLibrary.sport} IS NULL OR ${sportsAvatarLibrary.sport} = ${input.sport})`
              )
            : and(
                eq(sportsAvatarLibrary.kind, input.kind),
                eq(sportsAvatarLibrary.active, true)
              )
        )
        .orderBy(asc(sportsAvatarLibrary.sortOrder), asc(sportsAvatarLibrary.label));
      return rows;
    }),

  // ── Build 3: pre-signed R2 upload URL for profile/cover photos ─────────────
  getPhotoUploadUrl: protectedProcedure
    .input(
      z.object({
        kind: z.enum(["avatar", "cover"]),
        filename: z.string().min(1).max(200),
        contentType: z.string().min(1).max(120),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Allow only image types.
      if (!/^image\//.test(input.contentType)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only image files are allowed.",
        });
      }
      const safeName = input.filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
      const key = `profile-photos/${ctx.user.id}/${input.kind}/${Date.now()}-${safeName}`;
      const { uploadUrl, readUrl } = await getSignedUploadUrl(
        key,
        input.contentType,
        900
      );
      return { uploadUrl, readUrl, key };
    }),

  getOnboardingStatus: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { completed: false, role: null };
    const [user] = await db
      .select({
        onboardingCompleted: sql<number>`onboardingCompleted`,
        onboardingRole: sql<string>`onboardingRole`,
      })
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);
    return {
      completed: (user?.onboardingCompleted ?? 0) === 1,
      role: user?.onboardingRole ?? null,
    };
  }),
});
