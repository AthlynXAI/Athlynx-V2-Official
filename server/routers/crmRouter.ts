import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb, logActivity } from "../db";
import { TRPCError } from "@trpc/server";

// Admin guard middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const crmRouter = router({
  // ─── Public: Track growth/conversion events ────────────────────────────────
  trackGrowthEvent: publicProcedure
    .input(z.object({
      eventType: z.enum([
        "signup_page_view",
        "landing_signup_cta_click",
        "signup_started",
        "signup_email_started",
        "signup_social_started",
        "signup_completed",
        "profile_created",
        "profile_claim_completed",
        "studio_activation_prompted",
        "referral_link_clicked",
      ]),
      path: z.string().optional(),
      metadata: z.record(z.string(), z.unknown()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const rawReq = ctx.req as any;
      const ipAddress =
        rawReq.headers?.["x-forwarded-for"]?.toString().split(",")[0] ||
        rawReq.headers?.["x-real-ip"]?.toString() ||
        "unknown";
      const userAgent = rawReq.headers?.["user-agent"] || "";
      await logActivity(null, input.eventType, {
        ...(input.metadata || {}),
        path: input.path,
        ipAddress,
        userAgent,
        trackedAt: new Date().toISOString(),
      });
      return { success: true };
    }),

  // ─── Public: Track signup ──────────────────────────────────────────────────
  trackSignup: publicProcedure
    .input(z.object({
      fullName: z.string(),
      email: z.string().min(1),
      phone: z.string().optional(),
      role: z.string().optional(),
      sport: z.string().optional(),
      referralSource: z.string().optional(),
      utmSource: z.string().optional(),
      utmMedium: z.string().optional(),
      utmCampaign: z.string().optional(),
      signupType: z.enum(["waitlist", "vip", "direct", "referral"]).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const rawReq = ctx.req as any;
      const ipAddress =
        rawReq.headers?.["x-forwarded-for"]?.toString().split(",")[0] ||
        rawReq.headers?.["x-real-ip"]?.toString() ||
        "unknown";
      const userAgent = rawReq.headers?.["user-agent"] || "";
      const metadata = { ...input, ipAddress, userAgent, timestamp: new Date().toISOString() };
      console.log("[CRM] New signup tracked:", metadata);
      await logActivity(null, "signup_tracked", metadata);
      return { success: true, message: "Signup tracked" };
    }),

  // ─── Public: Validate access code ─────────────────────────────────────────
  validateAccess: publicProcedure
    .input(z.object({ accessCode: z.string() }))
    .query(async ({ input }) => {
      const validCodes = ["AthlynX2025", "DHG_PARTNER", "FOUNDER_ACCESS"];
      const valid = validCodes.includes(input.accessCode.toUpperCase());
      return { valid, partner: valid ? { name: "Partner", code: input.accessCode, role: "admin" } : null };
    }),

  // ─── Protected: Stats overview ────────────────────────────────────────────
  stats: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { totalSignups: 0, todaySignups: 0, weekSignups: 0, convertedUsers: 0, payingUsers: 0, totalRevenue: 0, waitlistCount: 0, contactsCount: 0, conversionRate: "0%", lastUpdated: new Date().toISOString() };
    const { users, waitlist, crmContacts } = await import("../../drizzle/schema");
    const { count, gte } = await import("drizzle-orm");
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const [totalResult] = await db.select({ total: count() }).from(users);
    const [todayResult] = await db.select({ total: count() }).from(users).where(gte(users.createdAt, todayStart));
    const [weekResult] = await db.select({ total: count() }).from(users).where(gte(users.createdAt, weekStart));
    const [waitlistResult] = await db.select({ total: count() }).from(waitlist);
    const [contactsResult] = await db.select({ total: count() }).from(crmContacts);
    const total = totalResult?.total ?? 0;
    return {
      totalSignups: total,
      todaySignups: todayResult?.total ?? 0,
      weekSignups: weekResult?.total ?? 0,
      convertedUsers: 0,
      payingUsers: 0,
      totalRevenue: 0,
      waitlistCount: waitlistResult?.total ?? 0,
      contactsCount: contactsResult?.total ?? 0,
      conversionRate: "0%",
      lastUpdated: new Date().toISOString(),
    };
  }),

  // ─── Protected: Get signups list ──────────────────────────────────────────
  signups: protectedProcedure
    .input(z.object({ limit: z.number().default(100), offset: z.number().default(0) }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { signups: [], total: 0 };
      const { users } = await import("../../drizzle/schema");
      const { desc } = await import("drizzle-orm");
      const rows = await db.select().from(users).orderBy(desc(users.createdAt)).limit(input?.limit ?? 100).offset(input?.offset ?? 0);
      const signups = rows.map((u: typeof rows[0], i: number) => ({
        id: u.id, signupNumber: i + 1, fullName: u.name, email: u.email ?? "",
        phone: u.phone ?? null, role: u.role ?? "athlete", sport: null,
        ipAddress: null, browser: null, device: null, os: null, country: null, city: null,
        signupType: "direct", isConverted: false, isPaying: false, lifetimeValue: null, createdAt: u.createdAt,
      }));
      return { signups, total: rows.length };
    }),

  // ─── Admin: Get CRM contacts ──────────────────────────────────────────────
  getContacts: adminProcedure
    .input(z.object({
      search: z.string().optional(),
      role: z.string().optional(),
      status: z.string().optional(),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { contacts: [], total: 0 };
      const { crmContacts } = await import("../../drizzle/schema");
      const { desc, ilike, and, eq, or, count } = await import("drizzle-orm");
      const conditions = [];
      if (input?.search) {
        conditions.push(or(
          ilike(crmContacts.name, `%${input.search}%`),
          ilike(crmContacts.email, `%${input.search}%`),
          ilike(crmContacts.company, `%${input.search}%`)
        ));
      }
      if (input?.role) conditions.push(eq(crmContacts.role, input.role as "Athlete" | "Coach" | "Brand" | "Agent" | "Investor" | "Team"));
      if (input?.status) conditions.push(eq(crmContacts.status, input.status as "Lead" | "Active" | "VIP" | "Churned"));
      const [totalResult] = await db.select({ total: count() }).from(crmContacts);
      const query = db.select().from(crmContacts).orderBy(desc(crmContacts.lastActivity)).limit(input?.limit ?? 50).offset(input?.offset ?? 0);
      const contacts = conditions.length > 0 ? await query.where(and(...conditions)) : await query;
      return { contacts, total: totalResult?.total ?? 0 };
    }),

  // ─── Admin: Create contact ────────────────────────────────────────────────
  createContact: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().min(1).optional(),
      phone: z.string().optional(),
      company: z.string().optional(),
      role: z.enum(["Athlete", "Coach", "Brand", "Agent", "Investor", "Team"]).default("Athlete"),
      status: z.enum(["Lead", "Active", "VIP", "Churned"]).default("Lead"),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { crmContacts } = await import("../../drizzle/schema");
      const { eq: eqLocal1 } = await import("drizzle-orm");
      const result = await db.insert(crmContacts).values(input).$returningId();
      const contactId = result[0]?.id;
      if (!contactId) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const [contact] = await db.select().from(crmContacts).where(eqLocal1(crmContacts.id, contactId)).limit(1);
      return contact;
    }),

  // ─── Admin: Update contact ────────────────────────────────────────────────
  updateContact: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      email: z.string().min(1).optional(),
      phone: z.string().optional(),
      company: z.string().optional(),
      role: z.enum(["Athlete", "Coach", "Brand", "Agent", "Investor", "Team"]).optional(),
      status: z.enum(["Lead", "Active", "VIP", "Churned"]).optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { crmContacts } = await import("../../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      const { id, ...updates } = input;
      await db.update(crmContacts).set({ ...updates, lastActivity: new Date() }).where(eq(crmContacts.id, id));
      const [contact] = await db.select().from(crmContacts).where(eq(crmContacts.id, id)).limit(1);
      return contact;
    }),

  // ─── Admin: Delete contact ────────────────────────────────────────────────
  deleteContact: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { crmContacts } = await import("../../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      await db.delete(crmContacts).where(eq(crmContacts.id, input.id));
      return { success: true };
    }),

  // ─── Admin: Get pipeline ──────────────────────────────────────────────────
  getPipeline: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
    const { crmPipeline, crmContacts } = await import("../../drizzle/schema");
    const { desc, eq } = await import("drizzle-orm");
    const rows = await db
      .select({
        pipeline: crmPipeline,
        contact: { id: crmContacts.id, name: crmContacts.name, email: crmContacts.email, role: crmContacts.role },
      })
      .from(crmPipeline)
      .leftJoin(crmContacts, eq(crmPipeline.contactId, crmContacts.id))
      .orderBy(desc(crmPipeline.updatedAt));
    return rows;
  }),

  // ─── Admin: Update pipeline stage ────────────────────────────────────────
  updatePipelineStage: adminProcedure
    .input(z.object({
      id: z.number(),
      stage: z.enum(["New Lead", "Contacted", "Demo Scheduled", "Proposal Sent", "Closed Won", "Closed Lost"]),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { crmPipeline } = await import("../../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      await db.update(crmPipeline).set({ stage: input.stage, updatedAt: new Date() }).where(eq(crmPipeline.id, input.id));
      const [row] = await db.select().from(crmPipeline).where(eq(crmPipeline.id, input.id)).limit(1);
      return row;
    }),

  // ─── Admin: Add to pipeline ───────────────────────────────────────────────
  addToPipeline: adminProcedure
    .input(z.object({
      contactId: z.number(),
      stage: z.enum(["New Lead", "Contacted", "Demo Scheduled", "Proposal Sent", "Closed Won", "Closed Lost"]).default("New Lead"),
      dealValue: z.number().default(0),
      assignedTo: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { crmPipeline } = await import("../../drizzle/schema");
      const { eq: eqLocal2 } = await import("drizzle-orm");
      const pipelineResult = await db.insert(crmPipeline).values(input).$returningId();
      const pipelineId = pipelineResult[0]?.id;
      if (!pipelineId) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const [row] = await db.select().from(crmPipeline).where(eqLocal2(crmPipeline.id, pipelineId)).limit(1);
      return row;
    }),

  // ─── Admin: Get waitlist ──────────────────────────────────────────────────
  getWaitlist: adminProcedure
    .input(z.object({ limit: z.number().default(200), offset: z.number().default(0) }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { entries: [], total: 0 };
      const { waitlist } = await import("../../drizzle/schema");
      const { desc, count } = await import("drizzle-orm");
      const [totalResult] = await db.select({ total: count() }).from(waitlist);
      const entries = await db.select().from(waitlist).orderBy(desc(waitlist.createdAt)).limit(input?.limit ?? 200).offset(input?.offset ?? 0);
      return { entries, total: totalResult?.total ?? 0 };
    }),

  // ─── Admin: Get activity log ──────────────────────────────────────────────
  getActivityLog: adminProcedure
    .input(z.object({ limit: z.number().default(100), offset: z.number().default(0), eventType: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { events: [], total: 0 };
      const { activityLog, users } = await import("../../drizzle/schema");
      const { desc, eq, count } = await import("drizzle-orm");
      const [totalResult] = await db.select({ total: count() }).from(activityLog);
      const baseQuery = db
        .select({ log: activityLog, user: { id: users.id, name: users.name, email: users.email } })
        .from(activityLog)
        .leftJoin(users, eq(activityLog.userId, users.id))
        .orderBy(desc(activityLog.createdAt))
        .limit(input?.limit ?? 100)
        .offset(input?.offset ?? 0);
      const events = input?.eventType ? await baseQuery.where(eq(activityLog.eventType, input.eventType)) : await baseQuery;
      return { events, total: totalResult?.total ?? 0 };
    }),

  // ─── Admin: Get all users ─────────────────────────────────────────────────
  getUsers: adminProcedure
    .input(z.object({ limit: z.number().default(100), offset: z.number().default(0), search: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { users: [], total: 0 };
      const { users } = await import("../../drizzle/schema");
      const { desc, ilike, count, or } = await import("drizzle-orm");
      const [totalResult] = await db.select({ total: count() }).from(users);
      const query = db.select().from(users).orderBy(desc(users.createdAt)).limit(input?.limit ?? 100).offset(input?.offset ?? 0);
      const rows = input?.search
        ? await query.where(or(ilike(users.name, `%${input.search}%`), ilike(users.email, `%${input.search}%`)))
        : await query;
      return { users: rows, total: totalResult?.total ?? 0 };
    }),

  // ─── Admin: Update user role ──────────────────────────────────────────────
  updateUserRole: adminProcedure
    .input(z.object({ userId: z.number(), role: z.enum(["athlete", "coach", "brand", "admin"]) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { users } = await import("../../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      await db.update(users).set({ role: input.role as any }).where(eq(users.id, input.userId));
      const [user] = await db.select().from(users).where(eq(users.id, input.userId)).limit(1);
      return user;
    }),

  // ─── AI CRM: Smart contact search (beats ZoomInfo) ──────────────────────────
  smartSearch: adminProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { contacts: [], users: [], suggestions: [] };
      const { crmContacts, users } = await import("../../drizzle/schema");
      const { ilike, or, desc } = await import("drizzle-orm");
      const q = `%${input.query}%`;
      const [contacts, matchedUsers] = await Promise.all([
        db.select().from(crmContacts)
          .where(or(ilike(crmContacts.name, q), ilike(crmContacts.email, q), ilike(crmContacts.company, q)))
          .orderBy(desc(crmContacts.createdAt)).limit(10),
        db.select().from(users)
          .where(or(ilike(users.name, q), ilike(users.email, q), ilike(users.sport, q), ilike(users.school, q)))
          .orderBy(desc(users.createdAt)).limit(10),
      ]);
      return { contacts, users: matchedUsers, total: contacts.length + matchedUsers.length };
    }),

  // ─── AI CRM: Revenue dashboard (beats QuickBooks for this use case) ─────────
  revenueDashboard: adminProcedure.query(async () => {
    try {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-04-22.dahlia" });
      const [balance, subs, charges] = await Promise.all([
        stripe.balance.retrieve(),
        stripe.subscriptions.list({ limit: 100, status: "active" }),
        stripe.charges.list({ limit: 100 }),
      ]);
      const mrr = subs.data.reduce((sum, sub) => {
        const item = sub.items.data[0];
        return sum + (item?.price?.unit_amount ?? 0) * (item?.quantity ?? 1) / 100;
      }, 0);
      const mtd = charges.data
        .filter(c => c.paid && new Date(c.created * 1000).getMonth() === new Date().getMonth())
        .reduce((sum, c) => sum + c.amount / 100, 0);
      const athleteSubs  = subs.data.filter(s => !s.metadata?.product || s.metadata.product !== "ConCreator™").length;
      const b2bSubs      = subs.data.filter(s => s.metadata?.product === "ConCreator™").length;
      return {
        mrr, arr: mrr * 12, mtd,
        activeSubscriptions: subs.data.length,
        athleteSubscriptions: athleteSubs,
        b2bSubscriptions: b2bSubs,
        availableBalance: (balance.available[0]?.amount ?? 0) / 100,
        pendingBalance:   (balance.pending[0]?.amount ?? 0) / 100,
        currency: "usd",
        lastUpdated: new Date().toISOString(),
      };
    } catch {
      return { mrr: 0, arr: 0, mtd: 0, activeSubscriptions: 0, athleteSubscriptions: 0, b2bSubscriptions: 0, availableBalance: 0, pendingBalance: 0, currency: "usd", lastUpdated: new Date().toISOString() };
    }
  }),

  // ─── AI CRM: Bulk contact import ───────────────────────────────────────────────────
  bulkImportContacts: adminProcedure
    .input(z.object({
      contacts: z.array(z.object({
        name:    z.string(),
        email:   z.string().optional(),
        phone:   z.string().optional(),
        company: z.string().optional(),
        role:    z.string().default("Athlete"),
        status:  z.string().default("Lead"),
        notes:   z.string().optional(),
      })),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const { crmContacts } = await import("../../drizzle/schema");
      let imported = 0;
      for (const contact of input.contacts) {
        try {
          await db.insert(crmContacts).values({
            name:    contact.name,
            email:   contact.email ?? "",
            phone:   contact.phone,
            company: contact.company,
            role:    contact.role as any,
            status:  contact.status as any,
            notes:   contact.notes,
          });
          imported++;
        } catch { /* skip duplicates */ }
      }
      return { imported, total: input.contacts.length };
    }),
});
