/**
 * AthlynX — Athlete Calendar Router
 * CRUD for athlete calendar events — games, practice, NIL, recruiting, etc.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { athleteCalendarEvents } from "../../drizzle/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export const calendarRouter = router({
  // Get all events for the current user
  getMyEvents: protectedProcedure
    .input(z.object({
      month: z.string().optional(), // YYYY-MM format
    }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
      const events = await db
        .select()
        .from(athleteCalendarEvents)
        .where(eq(athleteCalendarEvents.userId, ctx.user.id))
        .orderBy(athleteCalendarEvents.date);
      return events;
    }),

  // Get events for a specific date
  getEventsForDate: protectedProcedure
    .input(z.object({ date: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
      return db
        .select()
        .from(athleteCalendarEvents)
        .where(and(
          eq(athleteCalendarEvents.userId, ctx.user.id),
          eq(athleteCalendarEvents.date, input.date)
        ));
    }),

  // Create a new event
  createEvent: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(255),
      date: z.string(),
      time: z.string().optional(),
      type: z.enum(["game", "practice", "nil", "recruiting", "team", "personal", "training", "media"]).default("personal"),
      location: z.string().optional(),
      description: z.string().optional(),
      priority: z.enum(["high", "medium", "low"]).default("medium"),
      isPublic: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
      const [event] = await db
        .insert(athleteCalendarEvents)
        .values({
          userId: ctx.user.id,
          title: input.title,
          date: input.date,
          time: input.time,
          type: input.type,
          location: input.location,
          description: input.description,
          priority: input.priority,
          isPublic: input.isPublic,
        })
        .returning();
      return event;
    }),

  // Update an event
  updateEvent: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      date: z.string().optional(),
      time: z.string().optional(),
      type: z.enum(["game", "practice", "nil", "recruiting", "team", "personal", "training", "media"]).optional(),
      location: z.string().optional(),
      description: z.string().optional(),
      priority: z.enum(["high", "medium", "low"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
      const { id, ...updates } = input;
      await db
        .update(athleteCalendarEvents)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(
          eq(athleteCalendarEvents.id, id),
          eq(athleteCalendarEvents.userId, ctx.user.id)
        ));
      return { success: true };
    }),

  // Delete an event
  deleteEvent: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
      await db
        .delete(athleteCalendarEvents)
        .where(and(
          eq(athleteCalendarEvents.id, input.id),
          eq(athleteCalendarEvents.userId, ctx.user.id)
        ));
      return { success: true };
    }),
});
