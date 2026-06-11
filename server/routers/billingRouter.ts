/**
 * AthlynX Billing Router — tiered plans + credits, the survival layer.
 *
 * Reads tiers + packs from the database (plan_tiers, credit_packs) so pricing
 * is configurable without redeploys. Wires Stripe Checkout (subscriptions and
 * one-off pack purchases) and the Stripe Billing Portal. Webhook reconciliation
 * lives in server/stripe/webhook.ts (extended by Build 4 to call credits service).
 *
 * Locked rules:
 *   - Every credit grant goes through credits.applyPlanGrant / applyPackPurchase
 *     (idempotent by subscription:period or payment_intent).
 *   - Spend goes through credits.spendCredits (throws on insufficient).
 *   - Admin tier overrides write to plan_tiers + flag updated_at.
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { sql } from "drizzle-orm";
import {
  applyPlanGrant,
  applyBonusGrant,
  applyPackPurchase,
  getAllBalances,
  getBalance,
  getLedger,
  spendCredits,
} from "../services/credits";

let _stripe: Stripe | null = null;
function stripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "STRIPE_SECRET_KEY is not configured.",
    });
  }
  _stripe = new Stripe(key, { apiVersion: "2026-05-27.dahlia" as any });
  return _stripe;
}

function appUrl(): string {
  return (
    process.env.APP_PUBLIC_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "https://athlynx.ai"
  );
}

function isMasterAdmin(email?: string | null): boolean {
  if (!email) return false;
  const m = email.toLowerCase();
  return (
    m === "chaddozier75@gmail.com" ||
    m === "cdozier14@athlynx.ai" ||
    m === "cdozier@dozierholdingsgroup.com"
  );
}

export const billingRouter = router({

  // ─── Catalog (public) ───────────────────────────────────────────────────────

  listTiers: publicProcedure.query(async () => {
    const db = await getDb();
    const rows = await db.execute(sql`
      SELECT id, key, name, description, audience,
             monthly_price_cents, yearly_price_cents,
             monthly_credits, bonus_credits, ai_credits_monthly,
             features, sort_order
      FROM plan_tiers
      WHERE is_active = true
      ORDER BY sort_order ASC, monthly_price_cents ASC
    `);
    return (rows as any).rows ?? rows ?? [];
  }),

  listCreditPacks: publicProcedure.query(async () => {
    const db = await getDb();
    const rows = await db.execute(sql`
      SELECT id, key, name, credits, price_cents, bonus_credits, sort_order
      FROM credit_packs
      WHERE is_active = true
      ORDER BY sort_order ASC, price_cents ASC
    `);
    return (rows as any).rows ?? rows ?? [];
  }),

  // ─── My status ──────────────────────────────────────────────────────────────

  myStatus: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    const userId = Number(ctx.user.id);
    const [balances, ledger, subRows] = await Promise.all([
      getAllBalances(userId),
      getLedger(userId, 25),
      db.execute(sql`
        SELECT us.*, pt.name AS tier_name, pt.monthly_credits, pt.ai_credits_monthly,
               pt.monthly_price_cents, pt.yearly_price_cents
        FROM user_subscriptions us
        LEFT JOIN plan_tiers pt ON pt.key = us.tier_key
        WHERE us.user_id = ${userId}
        ORDER BY us.created_at DESC
        LIMIT 1
      `),
    ]);
    const subList: any[] = (subRows as any).rows ?? subRows ?? [];
    return {
      tier_key: subList[0]?.tier_key ?? "backyard",
      subscription: subList[0] ?? null,
      balances,
      ledger,
    };
  }),

  // ─── Checkout: subscribe to a tier ──────────────────────────────────────────

  startSubscriptionCheckout: protectedProcedure
    .input(
      z.object({
        tierKey: z.string(),
        cadence: z.enum(["monthly", "yearly"]).default("monthly"),
        returnPath: z.string().default("/billing"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const userId = Number(ctx.user.id);
      const userEmail = ctx.user.email ?? undefined;

      const tierRows = await db.execute(sql`
        SELECT * FROM plan_tiers WHERE key = ${input.tierKey} AND is_active = true LIMIT 1
      `);
      const tier: any = ((tierRows as any).rows ?? tierRows ?? [])[0];
      if (!tier) {
        throw new TRPCError({ code: "NOT_FOUND", message: `Tier "${input.tierKey}" not found.` });
      }
      const priceId =
        input.cadence === "yearly"
          ? tier.stripe_price_id_yearly
          : tier.stripe_price_id_monthly;
      if (!priceId) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Stripe price not configured for ${input.tierKey} ${input.cadence}. Admin must run billing.adminEnsureStripePrices.`,
        });
      }

      const s = stripe();
      const session = await s.checkout.sessions.create({
        mode: "subscription",
        customer_email: userEmail,
        client_reference_id: String(userId),
        line_items: [{ price: priceId, quantity: 1 }],
        allow_promotion_codes: true,
        success_url: `${appUrl()}${input.returnPath}?status=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl()}${input.returnPath}?status=cancelled`,
        subscription_data: {
          metadata: {
            athlynx_user_id: String(userId),
            athlynx_tier_key: tier.key,
          },
        },
        metadata: {
          athlynx_user_id: String(userId),
          athlynx_tier_key: tier.key,
          athlynx_kind: "subscription",
        },
      });
      return { url: session.url };
    }),

  // ─── Checkout: buy a credit pack (one-off) ──────────────────────────────────

  startPackCheckout: protectedProcedure
    .input(
      z.object({
        packKey: z.string(),
        returnPath: z.string().default("/billing"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const userId = Number(ctx.user.id);

      const packRows = await db.execute(sql`
        SELECT * FROM credit_packs WHERE key = ${input.packKey} AND is_active = true LIMIT 1
      `);
      const pack: any = ((packRows as any).rows ?? packRows ?? [])[0];
      if (!pack) {
        throw new TRPCError({ code: "NOT_FOUND", message: `Pack "${input.packKey}" not found.` });
      }

      const s = stripe();
      const session = await s.checkout.sessions.create({
        mode: "payment",
        customer_email: ctx.user.email ?? undefined,
        client_reference_id: String(userId),
        line_items: [
          pack.stripe_price_id
            ? { price: pack.stripe_price_id, quantity: 1 }
            : {
                quantity: 1,
                price_data: {
                  currency: "usd",
                  unit_amount: Number(pack.price_cents),
                  product_data: {
                    name: `AthlynX ${pack.name}`,
                    description: `${pack.credits} credits${
                      pack.bonus_credits ? ` + ${pack.bonus_credits} bonus` : ""
                    }`,
                  },
                },
              },
        ],
        success_url: `${appUrl()}${input.returnPath}?status=success&pack=${pack.key}`,
        cancel_url: `${appUrl()}${input.returnPath}?status=cancelled`,
        metadata: {
          athlynx_user_id: String(userId),
          athlynx_pack_key: pack.key,
          athlynx_pack_credits: String(pack.credits),
          athlynx_pack_bonus: String(pack.bonus_credits ?? 0),
          athlynx_kind: "pack",
        },
      });
      return { url: session.url };
    }),

  // ─── Stripe Billing Portal ──────────────────────────────────────────────────

  openBillingPortal: protectedProcedure
    .input(z.object({ returnPath: z.string().default("/billing") }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const userId = Number(ctx.user.id);
      const rows = await db.execute(sql`
        SELECT stripe_customer_id FROM users WHERE id = ${userId}
      `);
      const list: any[] = (rows as any).rows ?? rows ?? [];
      const customerId: string | null = list[0]?.stripe_customer_id ?? null;
      if (!customerId) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "No Stripe customer yet. Subscribe to a tier first.",
        });
      }
      const s = stripe();
      const portal = await s.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${appUrl()}${input.returnPath}`,
      });
      return { url: portal.url };
    }),

  // ─── Spend / Refund (callable by other routers, exposed for admin tools) ────

  spend: protectedProcedure
    .input(
      z.object({
        amount: z.number().int().positive(),
        pool: z.enum(["general", "ai", "beta"]).default("general"),
        reason: z.string(),
        referenceId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = Number(ctx.user.id);
      try {
        const r = await spendCredits({
          userId,
          amount: input.amount,
          pool: input.pool,
          reason: input.reason,
          referenceId: input.referenceId,
        });
        return r;
      } catch (err: any) {
        if (String(err?.message ?? "").startsWith("INSUFFICIENT_CREDITS")) {
          throw new TRPCError({
            code: "PAYMENT_REQUIRED",
            message: "You are out of credits. Add a pack or upgrade your tier to keep going.",
          });
        }
        throw err;
      }
    }),

  // ─── Admin: ensure Stripe products + prices exist for every active tier/pack ───

  adminEnsureStripePrices: protectedProcedure.mutation(async ({ ctx }) => {
    if (!isMasterAdmin(ctx.user.email)) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Master Admin only." });
    }
    const s = stripe();
    const db = await getDb();

    // Tiers
    const tiers = ((await db.execute(sql`
      SELECT * FROM plan_tiers WHERE is_active = true ORDER BY sort_order
    `)) as any).rows ?? [];

    for (const t of tiers) {
      if (Number(t.monthly_price_cents) === 0 && Number(t.yearly_price_cents) === 0) continue;
      let productId: string | null = t.stripe_product_id;
      if (!productId) {
        const product = await s.products.create({
          name: `AthlynX ${t.name}`,
          description: t.description ?? undefined,
          metadata: { athlynx_tier_key: t.key },
        });
        productId = product.id;
      }
      let monthlyPriceId: string | null = t.stripe_price_id_monthly;
      if (!monthlyPriceId && Number(t.monthly_price_cents) > 0) {
        const price = await s.prices.create({
          product: productId,
          currency: "usd",
          unit_amount: Number(t.monthly_price_cents),
          recurring: { interval: "month" },
          nickname: `${t.name} Monthly`,
          metadata: { athlynx_tier_key: t.key, cadence: "monthly" },
        });
        monthlyPriceId = price.id;
      }
      let yearlyPriceId: string | null = t.stripe_price_id_yearly;
      if (!yearlyPriceId && Number(t.yearly_price_cents) > 0) {
        const price = await s.prices.create({
          product: productId,
          currency: "usd",
          unit_amount: Number(t.yearly_price_cents),
          recurring: { interval: "year" },
          nickname: `${t.name} Yearly`,
          metadata: { athlynx_tier_key: t.key, cadence: "yearly" },
        });
        yearlyPriceId = price.id;
      }
      await db.execute(sql`
        UPDATE plan_tiers
        SET stripe_product_id = ${productId},
            stripe_price_id_monthly = ${monthlyPriceId},
            stripe_price_id_yearly = ${yearlyPriceId},
            updated_at = now()
        WHERE id = ${t.id}
      `);
    }

    // Packs
    const packs = ((await db.execute(sql`
      SELECT * FROM credit_packs WHERE is_active = true ORDER BY sort_order
    `)) as any).rows ?? [];

    for (const p of packs) {
      let productId: string | null = p.stripe_product_id;
      if (!productId) {
        const product = await s.products.create({
          name: `AthlynX ${p.name}`,
          description: `${p.credits} credits${p.bonus_credits ? ` + ${p.bonus_credits} bonus` : ""}`,
          metadata: { athlynx_pack_key: p.key, kind: "credit_pack" },
        });
        productId = product.id;
      }
      let priceId: string | null = p.stripe_price_id;
      if (!priceId) {
        const price = await s.prices.create({
          product: productId,
          currency: "usd",
          unit_amount: Number(p.price_cents),
          nickname: p.name,
          metadata: { athlynx_pack_key: p.key },
        });
        priceId = price.id;
      }
      await db.execute(sql`
        UPDATE credit_packs SET stripe_product_id = ${productId}, stripe_price_id = ${priceId}
        WHERE id = ${p.id}
      `);
    }

    return { ok: true, tiers: tiers.length, packs: packs.length };
  }),

  // ─── Admin: grant credits to any user (overrides, comps, support) ──────────

  adminGrantCredits: protectedProcedure
    .input(
      z.object({
        targetUserId: z.number().int().positive(),
        amount: z.number().int(),
        pool: z.enum(["general", "ai", "beta"]).default("general"),
        reason: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!isMasterAdmin(ctx.user.email)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Master Admin only." });
      }
      const { applyCreditMove } = await import("../services/credits");
      const r = await applyCreditMove({
        userId: input.targetUserId,
        pool: input.pool,
        delta: input.amount,
        kind: "adjustment",
        reason: `admin:${input.reason}`,
        metadata: { granted_by: ctx.user.email },
      });
      return r;
    }),

  // ─── Server-side helper used by webhook (re-exported for admin manual replay) ───

  adminReplayInvoice: protectedProcedure
    .input(z.object({ stripeInvoiceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!isMasterAdmin(ctx.user.email)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Master Admin only." });
      }
      const s = stripe();
      const inv: any = await s.invoices.retrieve(input.stripeInvoiceId, {
        expand: ["subscription", "customer", "lines.data.subscription"],
      });
      // Stripe API 2026-05-27.dahlia: invoice.subscription moved off the top level.
      // Read from lines.data[*].subscription as the canonical source, with fallbacks.
      const subscriptionId: string | null =
        (typeof inv.subscription === "string" ? inv.subscription : inv.subscription?.id) ??
        (inv.lines?.data ?? [])
          .map((ln: any) =>
            typeof ln.subscription === "string" ? ln.subscription : ln.subscription?.id,
          )
          .find((x: any) => !!x) ??
        inv.parent?.subscription_details?.subscription ??
        null;
      const customerId: string | null =
        typeof inv.customer === "string" ? inv.customer : inv.customer?.id ?? null;
      if (!subscriptionId || !customerId) {
        return { ok: false, reason: "invoice has no subscription/customer (one-off?)" };
      }
      const db = await getDb();
      const subRows = await db.execute(sql`
        SELECT us.user_id, pt.key AS tier_key, pt.monthly_credits, pt.bonus_credits, pt.ai_credits_monthly
        FROM user_subscriptions us
        LEFT JOIN plan_tiers pt ON pt.key = us.tier_key
        WHERE us.stripe_subscription_id = ${subscriptionId}
        LIMIT 1
      `);
      const sub: any = ((subRows as any).rows ?? subRows ?? [])[0];
      if (!sub) return { ok: false, reason: "subscription not mapped to user yet" };
      const periodStart = new Date(((inv as any).period_start ?? Date.now() / 1000) * 1000);
      const r = await applyPlanGrant({
        userId: Number(sub.user_id),
        tierKey: sub.tier_key,
        monthlyCredits: Number(sub.monthly_credits ?? 0),
        aiCreditsMonthly: Number(sub.ai_credits_monthly ?? 0),
        stripeSubscriptionId: subscriptionId,
        stripeInvoiceId: inv.id,
        periodStart,
      });
      return { ok: true, duplicate: r.duplicate, ledger: { general: r.generalLedgerId, ai: r.aiLedgerId } };
    }),
});
