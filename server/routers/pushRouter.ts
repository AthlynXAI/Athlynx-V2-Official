/**
 * AthlynX — Push Notification Router
 * Handles push subscription management
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { sql } from "drizzle-orm";
import { getVapidPublicKey } from "../services/push-notifications";

export const pushRouter = router({
  // Get the VAPID public key for the client to subscribe
  getVapidKey: publicProcedure.query(() => {
    return { publicKey: getVapidPublicKey() };
  }),

  // Subscribe this device to push notifications
  subscribe: protectedProcedure
    .input(
      z.object({
        endpoint: z.string().url(),
        p256dhKey: z.string(),
        authKey: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });

      // Upsert subscription
      await db.execute(
        sql`INSERT INTO push_subscriptions ("userId", endpoint, "p256dhKey", "authKey")
            VALUES (${ctx.user.id}, ${input.endpoint}, ${input.p256dhKey}, ${input.authKey})
            ON CONFLICT (endpoint) DO UPDATE SET 
              "userId" = ${ctx.user.id},
              "p256dhKey" = ${input.p256dhKey},
              "authKey" = ${input.authKey}`
      );

      return { success: true };
    }),

  // Unsubscribe this device
  unsubscribe: protectedProcedure
    .input(z.object({ endpoint: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
      await db.execute(sql`DELETE FROM push_subscriptions WHERE endpoint = ${input.endpoint}`);
      return { success: true };
    }),

  // Check if this device is subscribed
  isSubscribed: protectedProcedure
    .input(z.object({ endpoint: z.string() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return { subscribed: false };
      const result = await db.execute(
        sql`SELECT id FROM push_subscriptions WHERE endpoint = ${input.endpoint} AND "userId" = ${ctx.user.id} LIMIT 1`
      );
      const rows = (result as any).rows ?? result ?? [];
      return { subscribed: rows.length > 0 };
    }),
});
