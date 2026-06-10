/**
 * Sent.dm Router — AthlynXAI OS v1
 * tRPC endpoints for platform-triggered messaging via Sent.dm
 * WhatsApp-first → SMS → RCS
 *
 * Procedures:
 *  - sendNILAlert        : Notify athlete of NIL deal activity
 *  - sendScheduleAlert   : Remind athlete of upcoming event
 *  - sendBroadcast       : Coach/agent mass message to roster
 *  - sendTransferAlert   : Transfer portal notification
 *  - sendEndorsementAlert: Endorsement deal notification
 *  - sendScoreAlert      : Live score push to subscriber list
 *  - testMessage         : Admin test — send a test WhatsApp/SMS
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";

export const sentRouter = router({
  // ─── NIL Deal Alert ───────────────────────────────────────────────────────
  sendNILAlert: protectedProcedure
    .input(
      z.object({
        phone: z.string().min(7),
        athleteName: z.string().min(1),
        brandName: z.string().min(1),
        dealValue: z.string().min(1),
        action: z.enum(["new_offer", "counter", "signed", "expired"]),
      })
    )
    .mutation(async ({ input }) => {
      const { sendNILAlert } = await import("../services/sentService");
      const ok = await sendNILAlert(
        input.phone,
        input.athleteName,
        input.brandName,
        input.dealValue,
        input.action
      );
      if (!ok) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to send NIL alert" });
      return { success: true };
    }),

  // ─── Schedule / Event Reminder ────────────────────────────────────────────
  sendScheduleAlert: protectedProcedure
    .input(
      z.object({
        phone: z.string().min(7),
        athleteName: z.string().min(1),
        eventName: z.string().min(1),
        eventDate: z.string().min(1),
        location: z.string().min(1),
        eventType: z.enum(["game", "practice", "camp", "tournament", "combine"]),
      })
    )
    .mutation(async ({ input }) => {
      const { sendScheduleAlert } = await import("../services/sentService");
      const ok = await sendScheduleAlert(
        input.phone,
        input.athleteName,
        input.eventName,
        input.eventDate,
        input.location,
        input.eventType
      );
      if (!ok) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to send schedule alert" });
      return { success: true };
    }),

  // ─── Coach / Agent Broadcast ──────────────────────────────────────────────
  sendBroadcast: protectedProcedure
    .input(
      z.object({
        phones: z.array(z.string().min(7)).min(1).max(500),
        senderName: z.string().min(1),
        message: z.string().min(1).max(1600),
        subject: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { sendBroadcast } = await import("../services/sentService");
      const result = await sendBroadcast(
        input.phones,
        input.senderName,
        input.message,
        input.subject
      );
      return { success: result.ok, sent: result.sent, failed: result.failed };
    }),

  // ─── Transfer Portal Alert ────────────────────────────────────────────────
  sendTransferAlert: protectedProcedure
    .input(
      z.object({
        phone: z.string().min(7),
        athleteName: z.string().min(1),
        action: z.enum(["entered", "offer_received", "committed", "withdrawn"]),
        schoolName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { sendTransferAlert } = await import("../services/sentService");
      const ok = await sendTransferAlert(
        input.phone,
        input.athleteName,
        input.action,
        input.schoolName
      );
      if (!ok) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to send transfer alert" });
      return { success: true };
    }),

  // ─── Endorsement / Brand Deal Alert ──────────────────────────────────────
  sendEndorsementAlert: protectedProcedure
    .input(
      z.object({
        phone: z.string().min(7),
        athleteName: z.string().min(1),
        brandName: z.string().min(1),
        dealType: z.string().min(1),
        value: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const { sendEndorsementAlert } = await import("../services/sentService");
      const ok = await sendEndorsementAlert(
        input.phone,
        input.athleteName,
        input.brandName,
        input.dealType,
        input.value
      );
      if (!ok) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to send endorsement alert" });
      return { success: true };
    }),

  // ─── Live Score Alert ─────────────────────────────────────────────────────
  sendScoreAlert: protectedProcedure
    .input(
      z.object({
        phones: z.array(z.string().min(7)).min(1),
        homeTeam: z.string().min(1),
        awayTeam: z.string().min(1),
        homeScore: z.number().int().min(0),
        awayScore: z.number().int().min(0),
        status: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const { sendScoreAlert } = await import("../services/sentService");
      const ok = await sendScoreAlert(
        input.phones,
        input.homeTeam,
        input.awayTeam,
        input.homeScore,
        input.awayScore,
        input.status
      );
      if (!ok) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to send score alert" });
      return { success: true };
    }),

  // ─── Admin Test Message ───────────────────────────────────────────────────
  testMessage: protectedProcedure
    .input(
      z.object({
        phone: z.string().min(7),
        message: z.string().min(1).max(500),
        channel: z.enum(["whatsapp", "sms", "rcs"]).default("whatsapp"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Only admins can send test messages
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const { sendBroadcast } = await import("../services/sentService");
      const result = await sendBroadcast(
        [input.phone],
        "AthlynXAI Admin",
        `[TEST] ${input.message}`,
        "AthlynXAI Test Message"
      );
      return { success: result.ok };
    }),
});
