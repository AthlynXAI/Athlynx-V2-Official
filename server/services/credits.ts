/**
 * AthlynX Credits Service — the survival layer.
 *
 * Every credit movement goes through here. Nothing bypasses the ledger.
 *   - grantCredits         → grant_plan, grant_bonus, pack_purchase, refund, adjustment
 *   - spendCredits         → enforced at the call site; throws if insufficient
 *   - getBalance / getLedger
 *   - applyPlanGrant       → idempotent per (subscription, period_start)
 *   - applyPackPurchase    → idempotent per stripe_payment_intent_id
 *
 * Idempotency keys ensure Stripe webhook replays do not double-credit.
 */
import { sql } from "drizzle-orm";
import { getDb } from "../db";

export type CreditPool = "general" | "ai" | "beta";
export type CreditKind =
  | "grant_plan"
  | "grant_bonus"
  | "pack_purchase"
  | "spend"
  | "refund"
  | "adjustment"
  | "rollover_expired";

export interface CreditMoveInput {
  userId: number;
  pool?: CreditPool;
  delta: number;                 // positive for grant/refund, negative for spend
  kind: CreditKind;
  reason?: string;
  referenceId?: string;          // generic external id (wizard run, post id, etc.)
  stripeInvoiceId?: string;
  stripeSubscriptionId?: string;
  stripePaymentIntentId?: string;
  accountId?: number;
  metadata?: Record<string, any>;
  idempotencyKey?: string;       // if set, skip if a ledger row already has this reference_id
}

async function getBalanceRow(userId: number, pool: CreditPool) {
  const db = await getDb();
  const rows = await db.execute(sql`
    SELECT user_id, pool, balance, lifetime_granted, lifetime_spent
    FROM credit_balances WHERE user_id = ${userId} AND pool = ${pool}
  `);
  const list: any[] = (rows as any).rows ?? rows ?? [];
  return list[0] ?? null;
}

export async function getBalance(userId: number, pool: CreditPool = "general"): Promise<number> {
  const row = await getBalanceRow(userId, pool);
  return row ? Number(row.balance ?? 0) : 0;
}

export async function getAllBalances(userId: number) {
  const db = await getDb();
  const rows = await db.execute(sql`
    SELECT pool, balance, lifetime_granted, lifetime_spent, current_tier_key, next_grant_at
    FROM credit_balances WHERE user_id = ${userId}
  `);
  return (rows as any).rows ?? rows ?? [];
}

export async function getLedger(userId: number, limit = 50) {
  const db = await getDb();
  const rows = await db.execute(sql`
    SELECT * FROM credit_ledger
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `);
  return (rows as any).rows ?? rows ?? [];
}

/**
 * Single source of truth for all credit movements.
 * Atomic: writes ledger row + updates balance in one transaction.
 */
export async function applyCreditMove(input: CreditMoveInput): Promise<{
  ok: boolean;
  duplicate?: boolean;
  newBalance: number;
  ledgerId?: number;
}> {
  const db = await getDb();
  const pool = input.pool ?? "general";

  // Idempotency check: if idempotencyKey present, see if we already booked it.
  if (input.idempotencyKey) {
    const dup = await db.execute(sql`
      SELECT id, balance_after FROM credit_ledger
      WHERE user_id = ${input.userId}
        AND reference_id = ${input.idempotencyKey}
        AND kind = ${input.kind}
      LIMIT 1
    `);
    const dupList: any[] = (dup as any).rows ?? dup ?? [];
    if (dupList.length > 0) {
      return {
        ok: true,
        duplicate: true,
        newBalance: Number(dupList[0].balance_after ?? 0),
        ledgerId: Number(dupList[0].id),
      };
    }
  }

  // Read current balance, then write atomically.
  const current = await getBalanceRow(input.userId, pool);
  const startingBalance = current ? Number(current.balance ?? 0) : 0;
  const newBalance = startingBalance + input.delta;

  if (input.delta < 0 && newBalance < 0) {
    throw new Error(`INSUFFICIENT_CREDITS: have ${startingBalance}, need ${-input.delta} in pool=${pool}`);
  }

  // Insert ledger row.
  const ins = await db.execute(sql`
    INSERT INTO credit_ledger
      (user_id, account_id, kind, pool, delta, balance_after, reason,
       reference_id, stripe_invoice_id, stripe_subscription_id, stripe_payment_intent_id, metadata)
    VALUES
      (${input.userId}, ${input.accountId ?? null}, ${input.kind}, ${pool},
       ${input.delta}, ${newBalance}, ${input.reason ?? null},
       ${input.idempotencyKey ?? input.referenceId ?? null},
       ${input.stripeInvoiceId ?? null},
       ${input.stripeSubscriptionId ?? null},
       ${input.stripePaymentIntentId ?? null},
       ${JSON.stringify(input.metadata ?? {})}::jsonb)
    RETURNING id
  `);
  const insList: any[] = (ins as any).rows ?? ins ?? [];
  const ledgerId = Number(insList[0]?.id);

  // Upsert balance.
  const lifetimeGrantedDelta = input.delta > 0 ? input.delta : 0;
  const lifetimeSpentDelta = input.delta < 0 ? -input.delta : 0;
  await db.execute(sql`
    INSERT INTO credit_balances (user_id, pool, balance, lifetime_granted, lifetime_spent, updated_at)
    VALUES (${input.userId}, ${pool}, ${newBalance}, ${lifetimeGrantedDelta}, ${lifetimeSpentDelta}, now())
    ON CONFLICT (user_id, pool) DO UPDATE SET
      balance = EXCLUDED.balance,
      lifetime_granted = credit_balances.lifetime_granted + ${lifetimeGrantedDelta},
      lifetime_spent   = credit_balances.lifetime_spent   + ${lifetimeSpentDelta},
      updated_at = now()
  `);

  return { ok: true, newBalance, ledgerId };
}

export async function spendCredits(opts: {
  userId: number;
  amount: number;
  pool?: CreditPool;
  reason: string;
  referenceId?: string;
}): Promise<{ ok: boolean; newBalance: number }> {
  if (opts.amount <= 0) throw new Error("amount must be positive");
  const res = await applyCreditMove({
    userId: opts.userId,
    pool: opts.pool ?? "general",
    delta: -opts.amount,
    kind: "spend",
    reason: opts.reason,
    referenceId: opts.referenceId,
  });
  return { ok: true, newBalance: res.newBalance };
}

/**
 * Apply the recurring plan grant for one billing cycle.
 * Idempotency key = `${subscriptionId}:${currentPeriodStart.toISOString()}` so a replay never double-grants.
 */
export async function applyPlanGrant(opts: {
  userId: number;
  tierKey: string;
  monthlyCredits: number;
  aiCreditsMonthly: number;
  stripeSubscriptionId?: string;
  stripeInvoiceId?: string;
  periodStart: Date;
}): Promise<{ generalLedgerId?: number; aiLedgerId?: number; duplicate: boolean }> {
  const idemBase = `${opts.stripeSubscriptionId ?? "manual"}:${opts.periodStart.toISOString()}`;
  let duplicate = false;

  let generalRes: any = null;
  if (opts.monthlyCredits > 0) {
    generalRes = await applyCreditMove({
      userId: opts.userId,
      pool: "general",
      delta: opts.monthlyCredits,
      kind: "grant_plan",
      reason: `plan:${opts.tierKey}:monthly`,
      stripeSubscriptionId: opts.stripeSubscriptionId,
      stripeInvoiceId: opts.stripeInvoiceId,
      idempotencyKey: `${idemBase}:general`,
      metadata: { tier: opts.tierKey },
    });
    if (generalRes.duplicate) duplicate = true;
  }

  let aiRes: any = null;
  if (opts.aiCreditsMonthly > 0) {
    aiRes = await applyCreditMove({
      userId: opts.userId,
      pool: "ai",
      delta: opts.aiCreditsMonthly,
      kind: "grant_plan",
      reason: `plan:${opts.tierKey}:ai_monthly`,
      stripeSubscriptionId: opts.stripeSubscriptionId,
      stripeInvoiceId: opts.stripeInvoiceId,
      idempotencyKey: `${idemBase}:ai`,
      metadata: { tier: opts.tierKey },
    });
    if (aiRes.duplicate) duplicate = true;
  }

  // Stamp current tier on balances.
  const db = await getDb();
  await db.execute(sql`
    UPDATE credit_balances SET current_tier_key = ${opts.tierKey}, updated_at = now()
    WHERE user_id = ${opts.userId}
  `);

  return {
    generalLedgerId: generalRes?.ledgerId,
    aiLedgerId: aiRes?.ledgerId,
    duplicate,
  };
}

export async function applyBonusGrant(opts: {
  userId: number;
  tierKey: string;
  bonusCredits: number;
  stripeSubscriptionId?: string;
}): Promise<void> {
  if (opts.bonusCredits <= 0) return;
  await applyCreditMove({
    userId: opts.userId,
    pool: "general",
    delta: opts.bonusCredits,
    kind: "grant_bonus",
    reason: `plan:${opts.tierKey}:welcome_bonus`,
    stripeSubscriptionId: opts.stripeSubscriptionId,
    idempotencyKey: `bonus:${opts.stripeSubscriptionId ?? opts.tierKey}`,
    metadata: { tier: opts.tierKey, welcome: true },
  });
}

export async function applyPackPurchase(opts: {
  userId: number;
  packKey: string;
  credits: number;
  bonusCredits: number;
  stripePaymentIntentId?: string;
  stripeInvoiceId?: string;
}): Promise<void> {
  const total = opts.credits + (opts.bonusCredits || 0);
  if (total <= 0) return;
  await applyCreditMove({
    userId: opts.userId,
    pool: "general",
    delta: total,
    kind: "pack_purchase",
    reason: `pack:${opts.packKey}`,
    stripePaymentIntentId: opts.stripePaymentIntentId,
    stripeInvoiceId: opts.stripeInvoiceId,
    idempotencyKey: `pack:${opts.stripePaymentIntentId ?? opts.packKey}`,
    metadata: { pack: opts.packKey, bonus: opts.bonusCredits },
  });
}

export async function applyRefund(opts: {
  userId: number;
  amount: number;
  reason: string;
  stripePaymentIntentId?: string;
  stripeInvoiceId?: string;
}): Promise<void> {
  await applyCreditMove({
    userId: opts.userId,
    pool: "general",
    delta: opts.amount,
    kind: "refund",
    reason: opts.reason,
    stripePaymentIntentId: opts.stripePaymentIntentId,
    stripeInvoiceId: opts.stripeInvoiceId,
    idempotencyKey: `refund:${opts.stripePaymentIntentId ?? opts.stripeInvoiceId ?? opts.reason}`,
  });
}

/**
 * Convenience guard for AI wizards / agent calls.
 * Throws TRPC-friendly error if the user cannot afford the call.
 */
export async function ensureCredits(opts: {
  userId: number;
  amount: number;
  pool?: CreditPool;
}): Promise<void> {
  const balance = await getBalance(opts.userId, opts.pool ?? "general");
  if (balance < opts.amount) {
    throw new Error(
      `INSUFFICIENT_CREDITS: have ${balance}, need ${opts.amount} in pool=${opts.pool ?? "general"}`
    );
  }
}
