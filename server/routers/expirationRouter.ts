/**
 * Expiration Warnings Router
 * Admin-only endpoints for viewing subscription expiry notices and overdue accounts.
 */
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { users, subscriptionExpiryNotices } from "../../drizzle/schema";
import { eq, and, isNotNull, lt, gte, desc } from "drizzle-orm";
import { z } from "zod";

export const expirationRouter = router({
  /**
   * Get all users with expiring subscriptions (admin view)
   * Returns users whose trial ends within 8 days and have no paid subscription.
   */
  getWarnings: protectedProcedure.query(async ({ ctx }) => {
    if ((ctx.user as any).role !== "admin") {
      throw new Error("Admin access required");
    }
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });

    const now = new Date();
    const eightDaysFromNow = new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const expiringUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        trialEndsAt: users.trialEndsAt,
        stripeSubscriptionId: users.stripeSubscriptionId,
        stripePlanId: users.stripePlanId,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(
        and(
          isNotNull(users.trialEndsAt),
          gte(users.trialEndsAt, oneDayAgo),
          lt(users.trialEndsAt, eightDaysFromNow)
        )
      )
      .orderBy(users.trialEndsAt);

    // Attach latest email log for each user
    const results = await Promise.all(
      expiringUsers.map(async (u: typeof expiringUsers[number]) => {
        const notices = await db!
          .select({
            emailType: subscriptionExpiryNotices.emailType,
            status: subscriptionExpiryNotices.status,
            emailSentAt: subscriptionExpiryNotices.emailSentAt,
            daysRemaining: subscriptionExpiryNotices.daysRemaining,
          })
          .from(subscriptionExpiryNotices)
          .where(eq(subscriptionExpiryNotices.userId, u.id))
          .orderBy(desc(subscriptionExpiryNotices.emailSentAt))
          .limit(10);

        const msRemaining = u.trialEndsAt
          ? new Date(u.trialEndsAt).getTime() - now.getTime()
          : 0;
        const daysLeft = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));

        return {
          ...u,
          daysLeft: Math.max(daysLeft, 0),
          isExpired: daysLeft <= 0,
          hasPaidSub: !!u.stripeSubscriptionId,
          emailLog: notices,
        };
      })
    );

    return results;
  }),

  /**
   * Get overdue accounts (expired trial, no paid subscription)
   */
  getOverdue: protectedProcedure.query(async ({ ctx }) => {
    if ((ctx.user as any).role !== "admin") {
      throw new Error("Admin access required");
    }
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });

    const now = new Date();

    const overdueUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        trialEndsAt: users.trialEndsAt,
        stripePlanId: users.stripePlanId,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(
        and(
          isNotNull(users.trialEndsAt),
          lt(users.trialEndsAt, now),
          // No paid subscription
          eq(users.stripeSubscriptionId as any, null as any)
        )
      )
      .orderBy(desc(users.trialEndsAt));

    return overdueUsers.map((u: typeof overdueUsers[number]) => ({
      ...u,
      expiredDaysAgo: u.trialEndsAt
        ? Math.floor((now.getTime() - new Date(u.trialEndsAt).getTime()) / (1000 * 60 * 60 * 24))
        : 0,
    }));
  }),

  /**
   * Mark a specific notice as sent (manual override for admin)
   */
  markSent: protectedProcedure
    .input(z.object({ noticeId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if ((ctx.user as any).role !== "admin") {
        throw new Error("Admin access required");
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });

      await db
        .update(subscriptionExpiryNotices)
        .set({ status: "sent", emailSentAt: new Date() })
        .where(eq(subscriptionExpiryNotices.id, input.noticeId));

      return { success: true };
    }),
});
