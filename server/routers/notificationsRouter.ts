import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { notifications, users } from "../../drizzle/schema";
import { eq, desc, and, count, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const notificationsRouter = router({
  getRecent: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database unavailable — please try again in a moment.",
      });
    }
    // users.id is BIGINT UNSIGNED (serial) but notifications.userId is INT.
    // Number() cast prevents mysql2 from sending a BigInt literal which causes
    // a MySQL type mismatch error on the WHERE clause.
    const userId = Number(ctx.user.id);
    return db
      .select()
      .from(notifications)
      .where(sql`${notifications.userId} = ${userId}`)
      .orderBy(desc(notifications.createdAt))
      .limit(20);
  }),

  markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
    const userId = Number(ctx.user.id);
    await db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(and(sql`${notifications.userId} = ${userId}`, eq(notifications.isRead, false)));
    return { success: true };
  }),

  markRead: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
      const userId = Number(ctx.user.id);
      await db
        .update(notifications)
        .set({ isRead: true, readAt: new Date() })
        .where(and(eq(notifications.id, input.id), sql`${notifications.userId} = ${userId}`));
      return { success: true };
    }),

  create: protectedProcedure
    .input(z.object({
      title: z.string(),
      message: z.string().optional(),
      type: z.enum(["welcome","vip_approved","system_announcement","custom","credit_added","new_feature","promotion","reminder","achievement","message"]).default("custom"),
      link: z.string().optional(),
      priority: z.enum(["low","normal","high","urgent"]).default("normal"),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
      await db.insert(notifications).values({
        userId: Number(ctx.user.id),
        title: input.title,
        message: input.message,
        type: input.type,
        link: input.link,
        priority: input.priority,
        isRead: false,
      });
      return { success: true };
    }),

  // Get unread count for badge
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { count: 0 };
    const userId = Number(ctx.user.id);
    const result = await db
      .select({ count: count() })
      .from(notifications)
      .where(and(sql`${notifications.userId} = ${userId}`, eq(notifications.isRead, false)));
    return { count: result[0]?.count ?? 0 };
  }),

  // Admin: send notification to a specific user
  sendToUser: protectedProcedure
    .input(z.object({
      userId: z.number(),
      title: z.string(),
      message: z.string().optional(),
      type: z.enum(["welcome","vip_approved","system_announcement","custom","credit_added","new_feature","promotion","reminder","achievement","message"]).default("system_announcement"),
      priority: z.enum(["low","normal","high","urgent"]).default("normal"),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }
      const db = await getDb();
      if (!db) return { success: false, sent: 0 };
      await db.insert(notifications).values({
        userId: input.userId,
        title: input.title,
        message: input.message,
        type: input.type,
        priority: input.priority,
        isRead: false,
      });
      return { success: true, sent: 1 };
    }),

  // Admin: broadcast notification to ALL users
  broadcast: protectedProcedure
    .input(z.object({
      title: z.string(),
      message: z.string().optional(),
      type: z.enum(["welcome","vip_approved","system_announcement","custom","credit_added","new_feature","promotion","reminder","achievement","message"]).default("system_announcement"),
      priority: z.enum(["low","normal","high","urgent"]).default("normal"),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }
      const db = await getDb();
      if (!db) return { success: false, sent: 0 };
      const allUsers = await db.select({ id: users.id }).from(users);
      if (allUsers.length === 0) return { success: true, sent: 0 };
      await db.insert(notifications).values(
        allUsers.map((u: { id: number }) => ({
          userId: Number(u.id),
          title: input.title,
          message: input.message,
          type: input.type,
          priority: input.priority,
          isBroadcast: true as const,
          isRead: false as const,
        }))
      );
      return { success: true, sent: allUsers.length };
    }),
});
