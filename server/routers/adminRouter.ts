import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { users, notifications, broadcastMessages } from "../../drizzle/schema";
import { desc, eq, like, or, sql } from "drizzle-orm";
import { sendEmail } from "../services/aws-ses";
import { sendSMS } from "../services/aws-sns";
import { getGravatarProfile, getGravatarUrl } from "../services/gravatar";
import Stripe from "stripe";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const adminRouter = router({
  getUsers: adminProcedure
    .input(z.object({
      page: z.number().int().min(1).default(1),
      limit: z.number().int().min(1).max(100).default(50),
      search: z.string().optional(),
      sortBy: z.enum(["createdAt", "name", "email", "role"]).default("createdAt"),
      sortDir: z.enum(["asc", "desc"]).default("desc"),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      const offset = (input.page - 1) * input.limit;
      let query = db.select({
        id: users.id, name: users.name, email: users.email, role: users.role,
        sport: users.sport, school: users.school, loginMethod: users.loginMethod,
        avatarUrl: users.avatarUrl, bio: users.bio,
        stripeCustomerId: users.stripeCustomerId, stripeSubscriptionId: users.stripeSubscriptionId,
        stripePlanId: users.stripePlanId, trialEndsAt: users.trialEndsAt,
        credits: users.credits, lastSignedIn: users.lastSignedIn, createdAt: users.createdAt,
      }).from(users).$dynamic();
      if (input.search?.trim()) {
        const term = `%${input.search.trim()}%`;
        query = query.where(or(like(users.name, term), like(users.email, term), like(users.sport, term), like(users.school, term))) as typeof query;
      }
      const col = users[input.sortBy as keyof typeof users] as any;
      query = (input.sortDir === "desc" ? query.orderBy(desc(col)) : query.orderBy(col)) as typeof query;
      let countQuery = db.select({ count: sql<number>`count(*)` }).from(users).$dynamic();
      if (input.search?.trim()) {
        const term = `%${input.search.trim()}%`;
        countQuery = countQuery.where(or(like(users.name, term), like(users.email, term), like(users.sport, term), like(users.school, term))) as typeof countQuery;
      }
      const [rows, countResult] = await Promise.all([query.limit(input.limit).offset(offset), countQuery]);
      const total = Number(countResult[0]?.count ?? 0);
      return { users: rows, total, page: input.page, limit: input.limit, totalPages: Math.ceil(total / input.limit) };
    }),

  getStats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const [total, thisWeek, thisMonth, withSub, onTrial] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(users),
      db.select({ count: sql<number>`count(*)` }).from(users).where(sql`${users.createdAt} >= ${weekAgo}`),
      db.select({ count: sql<number>`count(*)` }).from(users).where(sql`${users.createdAt} >= ${monthAgo}`),
      db.select({ count: sql<number>`count(*)` }).from(users).where(sql`${users.stripeSubscriptionId} IS NOT NULL`),
      db.select({ count: sql<number>`count(*)` }).from(users).where(sql`${users.trialEndsAt} > ${now}`),
    ]);
    return {
      totalUsers: Number(total[0]?.count ?? 0),
      newThisWeek: Number(thisWeek[0]?.count ?? 0),
      newThisMonth: Number(thisMonth[0]?.count ?? 0),
      withSubscription: Number(withSub[0]?.count ?? 0),
      onTrial: Number(onTrial[0]?.count ?? 0),
    };
  }),

  setUserRole: adminProcedure
    .input(z.object({ userId: z.number().int(), role: z.enum(["user", "admin"]) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      await db.update(users).set({ role: input.role }).where(eq(users.id, input.userId));
      return { success: true };
    }),

  sendBroadcast: adminProcedure
    .input(z.object({
      subject: z.string().min(1).max(256),
      body: z.string().min(1),
      channel: z.enum(["email", "in_app", "both"]).default("in_app"),
      recipientFilter: z.enum(["all", "trial", "subscribed", "free"]).default("all"),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      const now = new Date();
      let rq = db.select({ id: users.id, name: users.name, email: users.email }).from(users).$dynamic();
      if (input.recipientFilter === "trial") rq = rq.where(sql`${users.trialEndsAt} > ${now}`) as typeof rq;
      else if (input.recipientFilter === "subscribed") rq = rq.where(sql`${users.stripeSubscriptionId} IS NOT NULL`) as typeof rq;
      else if (input.recipientFilter === "free") rq = rq.where(sql`${users.stripeSubscriptionId} IS NULL AND (${users.trialEndsAt} IS NULL OR ${users.trialEndsAt} <= ${now})`) as typeof rq;
      const recipients = await rq;

      // ── In-App Notifications ─────────────────────────────────────────────
      if (input.channel === "in_app" || input.channel === "both") {
        const rows = recipients.map((u: { id: number; name: string; email: string }) => ({
          userId: u.id, type: "custom" as const, title: input.subject, message: input.body,
          priority: "normal" as const, isBroadcast: "yes" as const, isRead: "no" as const, isDismissed: "no" as const,
        }));
        for (let i = 0; i < rows.length; i += 100) await db.insert(notifications).values(rows.slice(i, i + 100));
      }

      // ── Email Delivery ───────────────────────────────────────────────────
      let emailsSent = 0;
      let emailsFailed = 0;
      if (input.channel === "email" || input.channel === "both") {
        const emailHtml = `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a1628;color:#e2e8f0;padding:32px;border-radius:12px;">
            <div style="text-align:center;margin-bottom:24px;">
              <img src="https://athlynx.ai/athlynx-icon.png" alt="AthlynX" style="height:48px;" />
            </div>
            <h2 style="color:#00d4ff;font-size:22px;margin-bottom:8px;">${input.subject}</h2>
            <div style="background:#0f1f3d;border-radius:8px;padding:20px;margin:16px 0;line-height:1.7;white-space:pre-wrap;">${input.body.replace(/\n/g, '<br/>')}</div>
            <hr style="border:none;border-top:1px solid #1e3a5f;margin:24px 0;"/>
            <p style="color:#64748b;font-size:12px;text-align:center;">You're receiving this because you're an AthlynX member.<br/>
            <a href="https://athlynx.ai" style="color:#00d4ff;">athlynx.ai</a> — Iron Sharpens Iron</p>
          </div>
        `;
        // Send in batches of 10 to avoid rate limits
        for (let i = 0; i < recipients.length; i += 10) {
          const batch = recipients.slice(i, i + 10);
          await Promise.all(batch.map(async (u: { id: number; name: string; email: string }) => {
            const ok = await sendEmail({
              to: u.email,
              subject: `AthlynX: ${input.subject}`,
              html: emailHtml,
              text: `${input.subject}\n\n${input.body}\n\n---\nAthlynX — athlynx.ai`,
            });
            if (ok) emailsSent++; else emailsFailed++;
          }));
        }
        console.log(`[Broadcast] Email: ${emailsSent} sent, ${emailsFailed} failed`);
      }

      await db.insert(broadcastMessages).values({
        senderId: ctx.user.id, subject: input.subject, body: input.body,
        channel: input.channel, recipientFilter: input.recipientFilter,
        recipientCount: recipients.length, status: "sent",
      });
      return { success: true, recipientCount: recipients.length, emailsSent, emailsFailed };
    }),

  getBroadcasts: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    return db.select().from(broadcastMessages).orderBy(desc(broadcastMessages.createdAt)).limit(50);
  }),

  // ── Test Email ────────────────────────────────────────────────────────────
  testEmail: adminProcedure.mutation(async () => {
    const ok = await sendEmail({
      to: "cdozier14@athlynx.ai",
      subject: "✅ AthlynX — Test Email Confirmed",
      html: `<div style="font-family:sans-serif;padding:24px;">
        <h2 style="color:#00c2ff;">AthlynXAI — Email Service Working</h2>
        <p>This is a test email sent from the Admin CRM.</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        <p><strong>From:</strong> AWS SES → cdozier14@athlynx.ai</p>
        <hr/><p style="color:#888;font-size:12px;">Iron Sharpens Iron — Chad A. Dozier Sr.</p>
      </div>`,
      text: "AthlynXAI — Email service is working. Sent at " + new Date().toISOString(),
    });
    if (!ok) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Email failed — check AWS SES credentials in Vercel env vars" });
    return { success: true, message: "Test email sent to cdozier14@athlynx.ai" };
  }),

  // ── Test SMS ──────────────────────────────────────────────────────────────
  testSms: adminProcedure.mutation(async () => {
    const ok = await sendSMS(
      "+16014985282",
      `AthlynXAI ✅ SMS service working. Sent ${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })} CST`
    );
    if (!ok) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "SMS failed — check Twilio credentials in Vercel env vars" });
    return { success: true, message: "Test SMS sent to +1-601-498-5282" };
  }),

  // ── Send Daily Report Now ────────────────────────────────────────────────────
  sendDailyReport: adminProcedure.mutation(async () => {
    const { sendDailyReport } = await import("../jobs/dailyReport");
    await sendDailyReport();
    return { success: true, message: "Daily report sent to cdozier14@athlynx.ai" };
  }),

  // ── Real Stripe Revenue Stats ─────────────────────────────────────────────
  getRevenueStats: adminProcedure.query(async () => {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "STRIPE_SECRET_KEY not set" });
    const stripe = new Stripe(stripeKey, { apiVersion: "2026-04-22.dahlia" });
    const startOfMonth = Math.floor(new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime() / 1000);
    const startOfLastMonth = Math.floor(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).getTime() / 1000);

    const [balance, charges, subs, lastMonthCharges] = await Promise.all([
      stripe.balance.retrieve(),
      stripe.charges.list({ created: { gte: startOfMonth }, limit: 100 }),
      stripe.subscriptions.list({ status: "active", limit: 100 }),
      stripe.charges.list({ created: { gte: startOfLastMonth, lt: startOfMonth }, limit: 100 }),
    ]);

    const mtdRevenue = charges.data.filter(c => c.paid && !c.refunded).reduce((s, c) => s + c.amount, 0) / 100;
    const lastMonthRevenue = lastMonthCharges.data.filter(c => c.paid && !c.refunded).reduce((s, c) => s + c.amount, 0) / 100;
    const mrr = subs.data.reduce((s, sub) => {
      const item = sub.items.data[0];
      if (!item?.price?.unit_amount) return s;
      const amt = item.price.unit_amount / 100;
      return s + (item.price.recurring?.interval === "year" ? amt / 12 : amt);
    }, 0);
    const availableBalance = balance.available.reduce((s, b) => s + b.amount, 0) / 100;
    const pendingBalance = balance.pending.reduce((s, b) => s + b.amount, 0) / 100;

    return {
      mtdRevenue: Math.round(mtdRevenue * 100) / 100,
      lastMonthRevenue: Math.round(lastMonthRevenue * 100) / 100,
      mrr: Math.round(mrr * 100) / 100,
      arr: Math.round(mrr * 12 * 100) / 100,
      activeSubscriptions: subs.data.length,
      availableBalance: Math.round(availableBalance * 100) / 100,
      pendingBalance: Math.round(pendingBalance * 100) / 100,
      currency: "usd",
    };
  }),

  // ─── Refresh Gravatar for a user (admin-triggered) ─────────────────────────
  // Pulls the latest avatar + profile metadata from gravatar.com and writes it
  // to the user record. If `userId` is omitted, refreshes the calling admin's own row.
  refreshGravatar: adminProcedure
    .input(z.object({
      userId: z.number().int().positive().optional(),
      email: z.string().email().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const targetId = input.userId ?? ctx.user.id;
      const [targetUser] = await db.select({
        id: users.id, email: users.email, name: users.name, avatarUrl: users.avatarUrl,
      }).from(users).where(eq(users.id, targetId)).limit(1);
      if (!targetUser) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

      const email = input.email ?? targetUser.email;
      if (!email) throw new TRPCError({ code: "BAD_REQUEST", message: "No email on record; pass one explicitly." });

      const [avatarUrl, profile] = await Promise.all([
        getGravatarUrl(email),
        getGravatarProfile(email),
      ]);

      if (!avatarUrl) {
        return {
          success: false,
          message: `No Gravatar found for ${email}. Verify the email is registered at gravatar.com.`,
          previousAvatarUrl: targetUser.avatarUrl,
        };
      }

      const patch: Record<string, unknown> = { avatarUrl };
      // Enrich bio if Gravatar has richer data and local is empty
      if (profile?.description && !targetUser.name) patch.bio = profile.description;

      await db.update(users).set(patch).where(eq(users.id, targetId));

      return {
        success: true,
        userId: targetId,
        email,
        previousAvatarUrl: targetUser.avatarUrl,
        newAvatarUrl: avatarUrl,
        displayName: profile?.display_name ?? null,
        jobTitle: profile?.job_title ?? null,
        company: profile?.company ?? null,
        location: profile?.location ?? null,
        verifiedAccounts: profile?.number_verified_accounts ?? 0,
      };
    }),
});
