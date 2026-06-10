import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import { getDb } from "../db";
import { shouldSkipCreditThrottling } from "../_core/adminAllowlist";

export interface DeductAiCreditsInput {
  userId: number;
  action: string;
  cost: number;
  description?: string;
}

export interface DeductAiCreditsResult {
  cost: number;
  balanceAfter: number | null;
  skipped: boolean;
}

/**
 * Enforce AI credit monetization for all athlete-facing AI actions.
 *
 * The doctrine-active team bypasses throttling through the same server-side
 * helper used for billing exemptions. Every other user is charged atomically
 * from users.credits before work runs, preventing negative balances under
 * concurrent requests. A legacy credit_transactions audit row is written so
 * the current UI/reporting path remains visible while the newer credit ledger
 * service continues to support billing webhooks.
 */
export async function deductAiCredits(input: DeductAiCreditsInput): Promise<DeductAiCreditsResult> {
  const cost = Math.max(0, Math.floor(input.cost));
  if (cost === 0) {
    return { cost, balanceAfter: null, skipped: true };
  }

  const db = await getDb();
  if (!db) {
    throw new TRPCError({
      code: "SERVICE_UNAVAILABLE",
      message: "Credits service is temporarily unavailable. Please try again in a moment.",
    });
  }

  const userRows = await db.execute(sql`
    SELECT id, email, credits, unlimited_credits, billing_exempt
    FROM users
    WHERE id = ${input.userId}
    LIMIT 1
  `);
  const users = ((userRows as any).rows ?? userRows ?? []) as Array<{
    id: number;
    email: string | null;
    credits: number | null;
    unlimited_credits: boolean | null;
    billing_exempt: boolean | null;
  }>;
  const user = users[0];

  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "User not found for credit check." });
  }

  if (shouldSkipCreditThrottling({
    id: user.id,
    email: user.email,
    credits: user.credits ?? 0,
    unlimitedCredits: user.unlimited_credits ?? false,
    billingExempt: user.billing_exempt ?? false,
  } as any)) {
    return { cost, balanceAfter: user.credits ?? null, skipped: true };
  }

  const updateResult = await db.execute(sql`
    UPDATE users
    SET credits = credits - ${cost},
        "aiCredits" = GREATEST("aiCredits" - ${cost}, 0),
        "updatedAt" = NOW()
    WHERE id = ${input.userId}
      AND credits >= ${cost}
    RETURNING credits
  `);
  const updated = ((updateResult as any).rows ?? updateResult ?? []) as Array<{ credits: number }>;

  if (updated.length === 0) {
    const currentBalance = Number(user.credits ?? 0);
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `Insufficient credits. This action costs ${cost} credits. You have ${currentBalance} credits. Purchase more credits to continue.`,
    });
  }

  const balanceAfter = Number(updated[0].credits ?? 0);

  await db.execute(sql`
    INSERT INTO credit_transactions ("userId", type, amount, "balanceAfter", description, "aiAction")
    VALUES (
      ${input.userId},
      'deduction',
      ${-cost},
      ${balanceAfter},
      ${input.description ?? `AI action: ${input.action}`},
      ${input.action}
    )
  `).catch((error: unknown) => {
    console.warn(`[Credits] Audit log failed for ${input.action}:`, String(error));
  });

  return { cost, balanceAfter, skipped: false };
}
