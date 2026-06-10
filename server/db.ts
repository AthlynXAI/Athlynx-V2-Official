import { eq, sql, gte, and, lt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  InsertUser,
  users,
  waitlist,
  crmContacts,
  crmPipeline,
  activityLog,
  posts,
  nilDeals,
  transferPortalEntries,
  conversations,
  conversationParticipants,
  messages,
  notifications,
  aiTrainerSessions,
  InsertAiTrainerSession,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: any = null;
let _pool: Pool | null = null;
let _lastConnectAttempt = 0;
const RECONNECT_COOLDOWN_MS = 5_000; // retry after 5s on failure

function resetDbPool(reason: string) {
  if (_pool) {
    try {
      void _pool.end().catch(() => {});
    } catch (_) {}
  }
  _pool = null;
  _db = null;
  console.warn(`[Database] Pool reset: ${reason}`);
}

export function isTransientDbError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /connection terminated|ECONNRESET|socket disconnected|Connection terminated unexpectedly|timeout|ETIMEDOUT/i.test(message);
}

// Lazily create the drizzle instance so local tooling can run without a DB.
// If the pool goes stale or the initial connect fails, reset and retry after cooldown.
export async function getDb() {
  if (_db) return _db;

  const now = Date.now();
  if (now - _lastConnectAttempt < RECONNECT_COOLDOWN_MS) {
    return null;
  }
  _lastConnectAttempt = now;

  // Neon is the ONLY production database. PlanetScale has been removed entirely.
  // NEON_DATABASE_URL is the canonical direct Neon connection string.
  // DATABASE_URL is the only accepted fallback (must also be a Neon/Postgres URL).
  // PLANETSCALE_DATABASE_URL is no longer read — do not re-add it.
  const urls = [
    { url: (process.env.NEON_DATABASE_URL || '').trim(), label: 'Neon' },
    { url: (process.env.DATABASE_URL || '').trim(), label: 'DATABASE_URL' },
  ].filter((u, index, all) =>
    u.url &&
    (u.url.startsWith('postgres://') || u.url.startsWith('postgresql://')) &&
    all.findIndex((candidate) => candidate.url === u.url) === index
  );

  if (urls.length === 0) {
    console.warn('[Database] No valid Postgres/Neon connection string found in NEON_DATABASE_URL or DATABASE_URL');
    return null;
  }

  for (const { url, label } of urls) {
    try {
      if (_pool) {
        try { await _pool.end(); } catch (_) {}
        _pool = null;
      }
      _pool = new Pool({
        connectionString: url,
        ssl: { rejectUnauthorized: false },
        // Vercel serverless: keep concurrency modest so we don't blow Neon's
        // pooler connection cap during traffic spikes.
        max: 10,
        connectionTimeoutMillis: 8000,
        // Neon closes idle pooler connections after ~5 min. Recycle ours sooner
        // (every 4 min) so a long idle never collides with their teardown.
        idleTimeoutMillis: 240_000,
        // TCP keepalive prevents Vercel's NAT layer (and any intermediate load
        // balancer) from silently dropping the socket while it's reused.
        // initial delay = 10s after socket idle before probes start.
        keepAlive: true,
        keepAliveInitialDelayMillis: 10_000,
        // Hard cap any single query — protects against runaway statements
        // taking down the pool and against idle-in-transaction zombies.
        statement_timeout: 15_000,
        idle_in_transaction_session_timeout: 10_000,
        // pg v8.16+: forcibly destroy any connection idle for too long.
        // Belt-and-suspenders with idleTimeoutMillis above.
        allowExitOnIdle: true,
      } as any);
      const poolForAttempt = _pool;
      poolForAttempt.on("error", (error) => {
        // CRITICAL: pg emits 'error' on the Pool when a backend connection
        // dies asynchronously. If we don't listen, Node treats it as an
        // uncaughtException and Sentry fires. Listen + reset = silent recovery.
        console.warn(
          `[Database] ${label} pool error (auto-recovering):`,
          (error as Error).message,
        );
        if (_pool === poolForAttempt) resetDbPool(`${label} pool error`);
      });
      // Also listen on each acquired client — prevents per-client async errors
      // from bubbling up as uncaught exceptions.
      poolForAttempt.on("connect", (client) => {
        client.on("error", (clientErr) => {
          console.warn(
            `[Database] ${label} client error (auto-recovering):`,
            (clientErr as Error).message,
          );
          if (_pool === poolForAttempt) resetDbPool(`${label} client error`);
        });
      });
      const client = await poolForAttempt.connect();
      client.release();
      _db = drizzle(_pool);
      console.log(`[Database] Connected via ${label} (PostgreSQL / Neon)`);
      return _db;
    } catch (error) {
      console.warn(`[Database] ${label} failed, trying next...`, (error as Error).message);
      resetDbPool(`${label} connection attempt failed`);
    }
  }

  console.warn('[Database] All Neon/Postgres connections failed');
  return null;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }
    // Give new users 100 starting AI credits on first creation
    // NOTE: only set in values (INSERT), NOT in updateSet — so existing credits are never overwritten
    values.credits = 100;
    values.aiCredits = 100;

    if (user.trialEndsAt !== undefined) {
      values.trialEndsAt = user.trialEndsAt;
      updateSet.trialEndsAt = user.trialEndsAt;
    }
    if (user.phone !== undefined) {
      values.phone = user.phone;
      updateSet.phone = user.phone;
    }
    if (user.phoneVerified !== undefined) {
      values.phoneVerified = user.phoneVerified;
      updateSet.phoneVerified = user.phoneVerified;
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    // PostgreSQL uses onConflictDoUpdate
    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Waitlist ─────────────────────────────────────────────────────────────────
export async function getWaitlistCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)` }).from(waitlist);
  return Number(result[0]?.count ?? 0);
}

export async function getWaitlistEntries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(waitlist).orderBy(waitlist.createdAt);
}

export async function addToWaitlist(data: { email: string; name?: string; sport?: string; school?: string; phone?: string; role?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(waitlist).values(data).onConflictDoUpdate({ target: waitlist.email, set: { email: data.email } });
}

// ─── CRM ──────────────────────────────────────────────────────────────────────
export async function getCrmContacts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(crmContacts).orderBy(crmContacts.createdAt);
}

export async function getCrmPipeline() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(crmPipeline).orderBy(crmPipeline.updatedAt);
}

// ─── Activity Log ─────────────────────────────────────────────────────────────
export async function logActivity(userId: number | null, eventType: string, metadata?: Record<string, unknown>) {
  const db = await getDb();
  if (!db) return;
  await db.insert(activityLog).values({
    userId: userId ?? undefined,
    eventType,
    metadata: metadata ? JSON.stringify(metadata) : undefined,
  });
}

export async function getActivityLog(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(activityLog).orderBy(activityLog.createdAt).limit(limit);
}

// ─── Stats ────────────────────────────────────────────────────────────────────
export async function getWeeklySignupStats() {
  const db = await getDb();
  if (!db) return { thisWeek: 0, lastWeek: 0, total: 0, topLoginMethods: [] as { method: string; count: number }[] };
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);
  const twoWeeksStart = new Date(now);
  twoWeeksStart.setDate(now.getDate() - 14);
  const [thisWeekResult, lastWeekResult, totalResult, loginMethods] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(users).where(gte(users.createdAt, weekStart)),
    db.select({ count: sql<number>`count(*)` }).from(users).where(and(gte(users.createdAt, twoWeeksStart), lt(users.createdAt, weekStart))),
    db.select({ count: sql<number>`count(*)` }).from(users),
    db.select({ method: users.loginMethod, count: sql<number>`count(*)` }).from(users).where(gte(users.createdAt, weekStart)).groupBy(users.loginMethod),
  ]);
  return {
    thisWeek: Number(thisWeekResult[0]?.count ?? 0),
    lastWeek: Number(lastWeekResult[0]?.count ?? 0),
    total: Number(totalResult[0]?.count ?? 0),
    topLoginMethods: loginMethods.map((r: { method: string | null; count: number }) => ({ method: r.method ?? 'unknown', count: Number(r.count) })),
  };
}

export async function getPlatformStats() {
  const db = await getDb();
  if (!db) return { totalUsers: 0, waitlistCount: 0, nilDealsCount: 0, transferCount: 0 };
  const [userCount, waitlistCount, nilCount, transferCount] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(users),
    db.select({ count: sql<number>`count(*)` }).from(waitlist),
    db.select({ count: sql<number>`count(*)` }).from(nilDeals),
    db.select({ count: sql<number>`count(*)` }).from(transferPortalEntries),
  ]);
  return {
    totalUsers: Number(userCount[0]?.count ?? 0),
    waitlistCount: Number(waitlistCount[0]?.count ?? 0),
    nilDealsCount: Number(nilCount[0]?.count ?? 0),
    transferCount: Number(transferCount[0]?.count ?? 0),
  };
}

// ─── Stripe/Webhook helper stubs ─────────────────────────────────────────────
export async function getUserByStripeCustomerId(customerId: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(users).where(eq(users.stripeCustomerId, customerId)).limit(1);
  return rows[0] ?? null;
}

export async function createSubscription(data: {
  userId: number; stripeSubscriptionId: string; stripeCustomerId: string;
  tierId: string; status: string; currentPeriodStart: Date; currentPeriodEnd: Date;
}) {
  const db = await getDb();
  if (!db) return;
  await db.execute(sql`
    INSERT INTO subscriptions (userId, stripeSubscriptionId, stripeCustomerId, tierId, status, currentPeriodStart, currentPeriodEnd)
    VALUES (${data.userId}, ${data.stripeSubscriptionId}, ${data.stripeCustomerId}, ${data.tierId}, ${data.status}, ${data.currentPeriodStart}, ${data.currentPeriodEnd})
    ON CONFLICT (stripeSubscriptionId) DO UPDATE SET status=${data.status}, tierId=${data.tierId}, currentPeriodStart=${data.currentPeriodStart}, currentPeriodEnd=${data.currentPeriodEnd}
  `);
}

export async function updateSubscription(stripeSubscriptionId: string, data: {
  status?: string; tierId?: string; currentPeriodStart?: Date; currentPeriodEnd?: Date; cancelAtPeriodEnd?: boolean;
}) {
  const db = await getDb();
  if (!db) return;
  const sets = Object.entries(data).filter(([, v]) => v !== undefined).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(', ');
  if (!sets) return;
  await db.execute(sql`UPDATE subscriptions SET ${sql.raw(sets)} WHERE stripeSubscriptionId=${stripeSubscriptionId}`);
}

export async function updateUserSubscriptionTier(userId: number, tier: string) {
  const db = await getDb();
  if (!db) return;
  await db.execute(sql`UPDATE users SET stripePlanId=${tier} WHERE id=${userId}`);
}

export async function addUserCredits(userId: number, credits: number) {
  const db = await getDb();
  if (!db) return;
  await db.execute(sql`UPDATE users SET credits = credits + ${credits} WHERE id=${userId}`);
}

export async function recordPayment(data: {
  userId: number; stripePaymentIntentId?: string; stripeInvoiceId?: string;
  amount: string; currency: string; status: string;
}) {
  const db = await getDb();
  if (!db) return;
  await db.execute(sql`
    INSERT INTO payments (userId, stripePaymentIntentId, stripeInvoiceId, amount, currency, status)
    VALUES (${data.userId}, ${data.stripePaymentIntentId ?? null}, ${data.stripeInvoiceId ?? null}, ${data.amount}, ${data.currency}, ${data.status})
  `).catch(() => {}); // Silently fail if table doesn't exist yet
}

// ─── AI Trainer Bot ───────────────────────────────────────────────────────────
export async function getTrainerHistory(userId: number, limit = 40) {
  const db = await getDb();
  if (!db) return [];
  const { desc } = await import("drizzle-orm");
  const rows = await db
    .select()
    .from(aiTrainerSessions)
    .where(eq(aiTrainerSessions.userId, userId))
    .orderBy(desc(aiTrainerSessions.createdAt))
    .limit(limit);
  return rows.reverse(); // chronological order
}

export async function saveTrainerMessage(data: InsertAiTrainerSession) {
  const db = await getDb();
  if (!db) return;
  await db.insert(aiTrainerSessions).values(data);
}
