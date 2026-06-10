import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { posts, postLikes, postComments, users } from "../../drizzle/schema";
import { eq, desc, and, sql } from "drizzle-orm";

const toDatabasePostType = (postType: "status" | "achievement" | "workout" | "nil_deal" | "announcement" | "milestone") => {
  const legacyPostTypeMap = {
    status: "text",
    achievement: "highlight",
    workout: "training",
    nil_deal: "nil_deal",
    announcement: "text",
    milestone: "highlight",
  } as const;

  return legacyPostTypeMap[postType];
};

export const feedRouter = router({
  getFeed: publicProcedure
    .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
      const { limit = 20, offset = 0 } = input ?? {};
      return db
        .select({
          id: posts.id,
          content: posts.content,
          postType: posts.postType,
          mediaUrls: posts.mediaUrls,
          mediaType: posts.mediaType,
          visibility: posts.visibility,
          likesCount: posts.likesCount,
          commentsCount: posts.commentsCount,
          sharesCount: posts.sharesCount,
          isPinned: posts.isPinned,
          createdAt: posts.createdAt,
          userId: posts.userId,
          authorName: users.name,
          authorAvatar: users.avatarUrl,
        })
        .from(posts)
        .leftJoin(users, eq(posts.userId, users.id))
        .where(eq(posts.visibility, "public"))
        .orderBy(desc(posts.isPinned), desc(posts.createdAt))
        .limit(limit)
        .offset(offset);
    }),

  createPost: protectedProcedure
    .input(z.object({
      content: z.string().min(1).max(2000),
      postType: z.enum(["status", "achievement", "workout", "nil_deal", "announcement", "milestone"]).default("status"),
      mediaUrls: z.array(z.string()).optional(),
      mediaType: z.enum(["none", "image", "video", "gallery"]).default("none"),
      visibility: z.enum(["public", "followers", "private"]).default("public"),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database is temporarily unavailable. Please try again in a moment.",
        });
      }
      try {
        const result = await db.insert(posts).values({
          userId: ctx.user.id,
          content: input.content,
          postType: toDatabasePostType(input.postType) as any,
          mediaUrls: input.mediaUrls ?? null,
          mediaType: input.mediaType,
          visibility: input.visibility,
        }).returning({ id: posts.id });
        return { success: true, postId: result[0]?.id };
      } catch (err) {
        console.error("[Feed] createPost error:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create post. Please try again.",
        });
      }
    }),

  likePost: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
      const existing = await db
        .select()
        .from(postLikes)
        .where(and(eq(postLikes.postId, input.postId), eq(postLikes.userId, ctx.user.id)))
        .limit(1);

      if (existing.length > 0) {
        await db.delete(postLikes).where(
          and(eq(postLikes.postId, input.postId), eq(postLikes.userId, ctx.user.id))
        );
        await db.update(posts)
          .set({ likesCount: sql`${posts.likesCount} - 1` })
          .where(eq(posts.id, input.postId));
        return { liked: false };
      } else {
        await db.insert(postLikes).values({ postId: input.postId, userId: ctx.user.id });
        await db.update(posts)
          .set({ likesCount: sql`${posts.likesCount} + 1` })
          .where(eq(posts.id, input.postId));
        return { liked: true };
      }
    }),

  getComments: publicProcedure
    .input(z.object({ postId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
      return db
        .select({
          id: postComments.id,
          content: postComments.content,
          createdAt: postComments.createdAt,
          userId: postComments.userId,
          authorName: users.name,
          authorAvatar: users.avatarUrl,
        })
        .from(postComments)
        .leftJoin(users, eq(postComments.userId, users.id))
        .where(eq(postComments.postId, input.postId))
        .orderBy(desc(postComments.createdAt));
    }),

  addComment: protectedProcedure
    .input(z.object({ postId: z.number(), content: z.string().min(1).max(500) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
      await db.insert(postComments).values({
        postId: input.postId,
        userId: ctx.user.id,
        content: input.content,
      });
      await db.update(posts)
        .set({ commentsCount: sql`${posts.commentsCount} + 1` })
        .where(eq(posts.id, input.postId));
      return { success: true };
    }),

  getUserPosts: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
      return db
        .select()
        .from(posts)
        .where(eq(posts.userId, input.userId))
        .orderBy(desc(posts.createdAt));
    }),
});
