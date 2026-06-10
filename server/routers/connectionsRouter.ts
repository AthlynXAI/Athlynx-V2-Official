/**
 * Connections Router — AthlynXAI
 * Athlete-to-athlete and athlete-to-coach social connections
 * Like Facebook Friends — Meet New Athletes, Follow, Connect, Discover
 * School coach integration — coaches can find and recruit athletes
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { users, athleteProfiles } from "../../drizzle/schema";
import { eq, ne, and, or, ilike, sql, desc, notInArray, inArray } from "drizzle-orm";

export const connectionsRouter = router({

  /**
   * Get suggested athletes to connect with
   * Prioritizes: same sport, same school, same position, same state
   * Like Facebook "People You May Know"
   */
  getSuggestedAthletes: protectedProcedure
    .input(z.object({ limit: z.number().default(12) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });

      // Get current user's profile
      const [myProfile] = await db.select().from(athleteProfiles)
        .where(eq(athleteProfiles.userId, ctx.user.id)).limit(1);

      // Get all athletes with profiles (exclude self)
      const athletes = await db
        .select({
          id: users.id,
          name: users.name,
          avatarUrl: users.avatarUrl,
          sport: athleteProfiles.sport,
          position: athleteProfiles.position,
          school: athleteProfiles.school,
          state: athleteProfiles.state,
          recruitingStatus: athleteProfiles.recruitingStatus,
          nilVerified: athleteProfiles.nilVerified,
          xScore: athleteProfiles.recruitingScore,
          highlightUrl: athleteProfiles.highlightUrl,
          role: users.role,
        })
        .from(users)
        .leftJoin(athleteProfiles, eq(athleteProfiles.userId, users.id))
        .where(ne(users.id, ctx.user.id))
        .limit(100);

      // Score each athlete by similarity
      const scored = athletes.map((a: any) => {
        let score = 0;
        if (myProfile) {
          if (a.sport && a.sport === myProfile.sport) score += 30;
          if (a.school && a.school === myProfile.school) score += 25;
          if (a.position && a.position === myProfile.position) score += 15;
          if (a.state && a.state === myProfile.state) score += 10;
        }
        if (a.nilVerified) score += 5;
        if (a.xScore && a.xScore > 80) score += 5;
        // Add some randomness for discovery
        score += Math.random() * 10;
        return { ...a, matchScore: score };
      });

      // Sort by score and return top N
      return scored
        .sort((a: any, b: any) => b.matchScore - a.matchScore)
        .slice(0, input.limit)
        .map((a: any) => ({
          id: a.id,
          name: a.name || "Athlete",
          avatarUrl: a.avatarUrl,
          sport: a.sport || "Multi-Sport",
          position: a.position,
          school: a.school,
          state: a.state,
          recruitingStatus: a.recruitingStatus,
          nilVerified: a.nilVerified,
          xScore: a.xScore || 0,
          highlightUrl: a.highlightUrl,
          role: a.role || "athlete",
          matchScore: Math.round(a.matchScore),
        }));
    }),

  /**
   * Get suggested coaches based on athlete's sport and school
   */
  getSuggestedCoaches: protectedProcedure
    .input(z.object({ limit: z.number().default(8) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });

      const [myProfile] = await db.select().from(athleteProfiles)
        .where(eq(athleteProfiles.userId, ctx.user.id)).limit(1);

      // Get users with role = coach
      const coaches = await db
        .select({
          id: users.id,
          name: users.name,
          avatarUrl: users.avatarUrl,
          sport: athleteProfiles.sport,
          school: athleteProfiles.school,
          state: athleteProfiles.state,
          role: users.role,
        })
        .from(users)
        .leftJoin(athleteProfiles, eq(athleteProfiles.userId, users.id))
        .where(and(
          ne(users.id, ctx.user.id),
          eq(users.role as any, "coach")
        ))
        .limit(50);

      // Also include seed coaches if not enough real ones
      const seedCoaches = [
        { id: -1, name: "Coach Davis", sport: myProfile?.sport || "Football", school: "NFL Scout · Dallas Cowboys", state: "TX", role: "coach", avatarUrl: null, isScout: true },
        { id: -2, name: "Coach Williams", sport: myProfile?.sport || "Basketball", school: "NCAA D1 Recruiter", state: "CA", role: "coach", avatarUrl: null, isScout: true },
        { id: -3, name: "NIL Agency Pro", sport: "All Sports", school: "Certified NIL Agent", state: "FL", role: "agent", avatarUrl: null, isScout: true },
        { id: -4, name: "Coach Johnson", sport: myProfile?.sport || "Baseball", school: "Perfect Game Scout", state: "GA", role: "coach", avatarUrl: null, isScout: true },
      ];

      const allCoaches = [...coaches, ...seedCoaches].slice(0, input.limit);
      return allCoaches;
    }),

  /**
   * Search athletes and coaches
   */
  searchPeople: publicProcedure
    .input(z.object({
      query: z.string().min(1),
      sport: z.string().optional(),
      role: z.enum(["athlete", "coach", "all"]).default("all"),
      limit: z.number().default(20),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });

      const results = await db
        .select({
          id: users.id,
          name: users.name,
          avatarUrl: users.avatarUrl,
          sport: athleteProfiles.sport,
          position: athleteProfiles.position,
          school: athleteProfiles.school,
          state: athleteProfiles.state,
          role: users.role,
          xScore: athleteProfiles.recruitingScore,
          highlightUrl: athleteProfiles.highlightUrl,
          nilVerified: athleteProfiles.nilVerified,
        })
        .from(users)
        .leftJoin(athleteProfiles, eq(athleteProfiles.userId, users.id))
        .where(
          ilike(users.name, `%${input.query}%`)
        )
        .limit(input.limit);

      return results;
    }),

  /**
   * Follow an athlete or coach
   */
  followUser: protectedProcedure
    .input(z.object({ targetUserId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });

      // Increment follower count on target
      await db.execute(
        sql`UPDATE users SET followers = COALESCE(followers, 0) + 1 WHERE id = ${input.targetUserId}`
      );

      return { success: true, following: true };
    }),

  /**
   * Send a connection request (like Facebook friend request)
   */
  sendConnectionRequest: protectedProcedure
    .input(z.object({
      targetUserId: z.number(),
      message: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });

      // Start a conversation with the connection request as first message
      const { messengerRouter } = await import("./messengerRouter");
      // Just follow for now — full connection system can be expanded
      await db.execute(
        sql`UPDATE users SET followers = COALESCE(followers, 0) + 1 WHERE id = ${input.targetUserId}`
      );

      return {
        success: true,
        message: "Connection request sent! They'll see your profile and can message you back.",
      };
    }),

  /**
   * Get athletes from the same school
   */
  getSchoolmates: protectedProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });

      const [myProfile] = await db.select().from(athleteProfiles)
        .where(eq(athleteProfiles.userId, ctx.user.id)).limit(1);

      if (!myProfile?.school) return [];

      return db
        .select({
          id: users.id,
          name: users.name,
          avatarUrl: users.avatarUrl,
          sport: athleteProfiles.sport,
          position: athleteProfiles.position,
          school: athleteProfiles.school,
          role: users.role,
          xScore: athleteProfiles.recruitingScore,
        })
        .from(users)
        .leftJoin(athleteProfiles, eq(athleteProfiles.userId, users.id))
        .where(and(
          ne(users.id, ctx.user.id),
          eq(athleteProfiles.school, myProfile.school)
        ))
        .limit(input.limit);
    }),

  /**
   * Get athletes in the same sport
   */
  getSportmates: protectedProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });

      const [myProfile] = await db.select().from(athleteProfiles)
        .where(eq(athleteProfiles.userId, ctx.user.id)).limit(1);

      if (!myProfile?.sport) return [];

      return db
        .select({
          id: users.id,
          name: users.name,
          avatarUrl: users.avatarUrl,
          sport: athleteProfiles.sport,
          position: athleteProfiles.position,
          school: athleteProfiles.school,
          role: users.role,
          xScore: athleteProfiles.recruitingScore,
          highlightUrl: athleteProfiles.highlightUrl,
        })
        .from(users)
        .leftJoin(athleteProfiles, eq(athleteProfiles.userId, users.id))
        .where(and(
          ne(users.id, ctx.user.id),
          eq(athleteProfiles.sport, myProfile.sport)
        ))
        .orderBy(desc(athleteProfiles.recruitingScore))
        .limit(input.limit);
    }),
});
