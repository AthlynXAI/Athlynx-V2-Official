import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { users, notifications, broadcastMessages, posts } from "../../drizzle/schema";
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
    const stripe = new Stripe(stripeKey, { apiVersion: "2026-05-27.dahlia" as any });
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

  // ─── Seed Feed Posts (admin-triggered, idempotent) ────────────────────────
  // Inserts 26 sport-themed platform posts if the feed is empty (< 5 posts).
  // Safe to call multiple times — skips if posts already exist.
  seedFeed: adminProcedure.mutation(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(posts);
    if (Number(count) >= 5) {
      return { seeded: false, message: `Feed already has ${count} posts — skipped.` };
    }
    const now = new Date();
    const h = (hours: number) => new Date(now.getTime() - hours * 3600 * 1000);
    const seedPosts = [
      { content: "Welcome to AthlynXAI — the #1 AI sports platform for athletes. Whether you're chasing a D1 offer, your first NIL deal, or just trying to get better every day — this is your home. Sign up free. 7-day trial. No excuses. #AthlynXAI #Athletes #NIL #Recruiting", postType: "announcement" as const, likesCount: 412, commentsCount: 128, sharesCount: 94, createdAt: h(72) },
      { content: "Iron Sharpens Iron. Every rep, every film session, every early morning matters. AthlynXAI was built for athletes who refuse to be overlooked. Your profile is your platform. Use it. #AthlynXAI #IronSharpensIron #Football", postType: "status" as const, likesCount: 334, commentsCount: 97, sharesCount: 72, createdAt: h(52) },
      { content: "Milestone: AthlynXAI athletes have now received over 50 D1 scholarship offers through connections made on this platform since launch. This is what we built it for. #AthlynXAI #NIL #Recruiting #Milestone", postType: "announcement" as const, likesCount: 287, commentsCount: 89, sharesCount: 64, createdAt: h(34) },
      { content: "NIL deal alert: A major sports apparel brand is looking for college tennis players for a regional ambassador program. $500/month + gear. Apply through the NIL Vault on AthlynXAI. #Tennis #NIL #AthlynXAI", postType: "nil_deal" as const, likesCount: 178, commentsCount: 53, sharesCount: 39, createdAt: h(44) },
      { content: "Strength training tip: Progressive overload is the only way to get stronger. Add 5 lbs every week. Track everything. The athletes who track their progress are the ones who make the biggest gains. #Strength #Training #AthleteLife", postType: "status" as const, likesCount: 156, commentsCount: 44, sharesCount: 33, createdAt: h(40) },
      { content: "NIL Vault Update: Added 3 new brand partnership opportunities for basketball players this week. Shoe deals, energy drink sponsorships, and local business endorsements. Log in and check the NIL Vault. #Basketball #NIL #AthlynXAI", postType: "announcement" as const, likesCount: 145, commentsCount: 42, sharesCount: 31, createdAt: h(28) },
      { content: "Transfer Portal is open. If you're a soccer player looking to move programs, now is the time. Update your AthlynXAI profile with your current stats, film, and availability. Coaches check this platform daily. #Soccer #TransferPortal #AthlynXAI", postType: "announcement" as const, likesCount: 119, commentsCount: 35, sharesCount: 24, createdAt: h(38) },
      { content: "Warriors Playbook Tip of the Day: Film study separates good players from great ones. Watch your own film before you watch your opponent's. Know your tendencies before they do. #Football #WarriorsPlaybook #Coaching", postType: "status" as const, likesCount: 112, commentsCount: 34, sharesCount: 26, createdAt: h(22) },
      { content: "Proud to announce I have officially signed my first NIL deal with a regional sports nutrition brand. This is just the beginning. AthlynXAI helped me get my profile in front of the right people. #NIL #AthlynXAI #Athlete", postType: "nil_deal" as const, likesCount: 201, commentsCount: 67, sharesCount: 45, createdAt: h(10) },
      { content: "Recovery day. Ice bath, massage gun, and film review. The best athletes in the world treat recovery like a second workout. Your body is your business — protect it. #Recovery #AthleteLife #AthlynXAI", postType: "status" as const, likesCount: 88, commentsCount: 21, sharesCount: 13, createdAt: h(26) },
      { content: "Volleyball athletes — your highlight film is your resume. I uploaded 3 match films this week and got 2 DMs from college coaches within 24 hours. AthlynXAI works. #Volleyball #NIL #Recruiting", postType: "achievement" as const, likesCount: 96, commentsCount: 28, sharesCount: 17, createdAt: h(18) },
      { content: "Offensive linemen are the most underrecruited position in football. If you're a 6'4\" 280+ lb OL with film, your AthlynXAI profile needs to be live TODAY. Coaches are actively searching this platform. #Football #OLine #Recruiting", postType: "status" as const, likesCount: 91, commentsCount: 27, sharesCount: 19, createdAt: h(32) },
      { content: "Track & Field athletes — spring season is your showcase. Every meet is a recruiting event. Make sure your times, marks, and film are live on your AthlynXAI profile before your next competition. #TrackAndField #Recruiting #NIL", postType: "announcement" as const, likesCount: 67, commentsCount: 16, sharesCount: 12, createdAt: h(24) },
      { content: "Pitching mechanics breakdown: Hip rotation generates 80% of your velocity. If your arm is doing all the work, you're leaving mph on the table and risking injury. Diamond Grind coaches are available for virtual sessions. #Baseball #DiamondGrind #Pitching", postType: "status" as const, likesCount: 73, commentsCount: 22, sharesCount: 16, createdAt: h(30) },
      { content: "Soccer athletes — are you using the Transfer Portal feature on AthlynXAI? I moved from a D2 program to a D1 program last semester using this platform. My recruiting profile did the talking. #Soccer #TransferPortal #NIL", postType: "status" as const, likesCount: 78, commentsCount: 19, sharesCount: 14, createdAt: h(12) },
      { content: "Swim season is here. Cut 0.4 seconds off my 100m freestyle this week. Training at altitude has been a game changer. College coaches — my times are updated on my AthlynXAI profile. #Swimming #Recruiting #D1", postType: "achievement" as const, likesCount: 55, commentsCount: 14, sharesCount: 9, createdAt: h(14) },
      { content: "Wrestling Update: 3 weeks out from State. Weight is on point. Film is clean. If any D1 programs are still evaluating 157 lb wrestlers, my profile is live on AthlynXAI. #Wrestling #Recruiting #StateChampionship", postType: "status" as const, likesCount: 43, commentsCount: 11, sharesCount: 7, createdAt: h(16) },
      { content: "Beach volleyball is a D1 sport at over 70 schools. If you're playing club beach and haven't explored college opportunities, you're leaving scholarships on the table. AthlynXAI can connect you with coaches today. #Volleyball #BeachVolleyball #NIL", postType: "status" as const, likesCount: 52, commentsCount: 13, sharesCount: 8, createdAt: h(42) },
      { content: "Open water swimmers — your event is one of the fastest growing in collegiate athletics. If you're competing at the club level and want D1 exposure, get your profile up on AthlynXAI. Coaches are watching. #Swimming #OpenWater #Recruiting", postType: "status" as const, likesCount: 34, commentsCount: 8, sharesCount: 4, createdAt: h(36) },
      { content: "Tennis season recap: 18-2 singles record, ranked #4 in the state. Looking to make the jump to D1. Coaches — I'm available for campus visits in June and July. Profile updated. #Tennis #Recruiting #AthlynXAI", postType: "achievement" as const, likesCount: 38, commentsCount: 9, sharesCount: 5, createdAt: h(20) },
      { content: "Cross country athletes — your sport builds the mental toughness that every coach wants. Make sure your race times, training logs, and highlight reels are on your AthlynXAI profile before the fall signing period. #CrossCountry #Recruiting #D1", postType: "status" as const, likesCount: 61, commentsCount: 15, sharesCount: 10, createdAt: h(48) },
      { content: "Basketball season is here. If you're a 6'5\"+ wing with a 3-point percentage above 35%, college coaches are actively looking for you right now. Get your film and stats on AthlynXAI today. #Basketball #Recruiting #NIL", postType: "status" as const, likesCount: 167, commentsCount: 49, sharesCount: 35, createdAt: h(6) },
      { content: "Mental health check: Being an athlete is hard. The pressure is real. AthlynXAI is building resources for athlete mental wellness — because the whole athlete matters, not just the stats. #MentalHealth #AthleteLife #AthlynXAI", postType: "announcement" as const, likesCount: 223, commentsCount: 71, sharesCount: 52, createdAt: h(4) },
      { content: "New feature: AI-powered NIL deal matching. AthlynXAI now uses machine learning to match athletes with brands based on sport, audience, values, and market fit. Log in and check your matches. #NIL #AI #AthlynXAI", postType: "announcement" as const, likesCount: 198, commentsCount: 58, sharesCount: 43, createdAt: h(2) },
      { content: "Lacrosse athletes — the fastest growing sport in D1. If you're playing club and want college exposure, AthlynXAI has direct connections to 40+ D1 lacrosse programs. Your profile is your ticket. #Lacrosse #Recruiting #NIL", postType: "status" as const, likesCount: 44, commentsCount: 12, sharesCount: 8, createdAt: h(8) },
      { content: "To every athlete who has ever been told they weren't good enough — this platform was built for you. Your story matters. Your talent matters. Your future matters. #AthlynXAI #Athletes #Believe", postType: "status" as const, likesCount: 445, commentsCount: 134, sharesCount: 98, createdAt: h(1) },
    ];
    const adminUserId = 1;
    await db.insert(posts).values(
      seedPosts.map(p => ({
        userId: adminUserId,
        content: p.content,
        postType: p.postType,
        visibility: "public" as const,
        likesCount: p.likesCount,
        commentsCount: p.commentsCount,
        sharesCount: p.sharesCount,
        createdAt: p.createdAt,
        updatedAt: p.createdAt,
      }))
    );
    return { seeded: true, message: `Seeded ${seedPosts.length} feed posts successfully.` };
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
