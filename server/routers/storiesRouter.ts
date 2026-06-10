/**
 * AthlynX — Stories Router
 * Instagram/Facebook-style 24-hour stories
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { athleteStories, users } from "../../drizzle/schema";
import { eq, and, gte, desc } from "drizzle-orm";
import { sql } from "drizzle-orm";

export const storiesRouter = router({
  // Get active stories for the feed (last 24 hours)
  getActiveStories: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const stories = await db
      .select({
        id: athleteStories.id,
        userId: athleteStories.userId,
        mediaUrl: athleteStories.mediaUrl,
        mediaType: athleteStories.mediaType,
        caption: athleteStories.caption,
        storyType: athleteStories.storyType,
        viewCount: athleteStories.viewCount,
        createdAt: athleteStories.createdAt,
        authorName: users.name,
        authorAvatar: users.avatarUrl,
      })
      .from(athleteStories)
      .leftJoin(users, eq(athleteStories.userId, users.id))
      .where(
        and(
          eq(athleteStories.isActive, true),
          gte(athleteStories.createdAt, yesterday)
        )
      )
      .orderBy(desc(athleteStories.createdAt))
      .limit(20);
    return stories;
  }),

  // Create a new story
  createStory: protectedProcedure
    .input(z.object({
      mediaUrl: z.string().optional(),
      mediaType: z.enum(["image", "video", "text"]).default("image"),
      caption: z.string().max(500).optional(),
      storyType: z.enum(["update", "highlight", "nil", "game", "training", "life"]).default("update"),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const [story] = await db
        .insert(athleteStories)
        .values({
          userId: ctx.user.id,
          mediaUrl: input.mediaUrl,
          mediaType: input.mediaType,
          caption: input.caption,
          storyType: input.storyType,
          expiresAt,
          isActive: true,
        })
        .returning();
      return story;
    }),

  // View a story (increment view count)
  viewStory: publicProcedure
    .input(z.object({ storyId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return;
      await db
        .update(athleteStories)
        .set({ viewCount: sql`${athleteStories.viewCount} + 1` })
        .where(eq(athleteStories.id, input.storyId));
    }),

  // Delete own story
  deleteStory: protectedProcedure
    .input(z.object({ storyId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
      await db
        .update(athleteStories)
        .set({ isActive: false })
        .where(
          and(
            eq(athleteStories.id, input.storyId),
            eq(athleteStories.userId, ctx.user.id)
          )
        );
      return { success: true };
    }),
});
