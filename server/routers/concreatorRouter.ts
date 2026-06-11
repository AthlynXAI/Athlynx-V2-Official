/**
 * ConCreator™ B2B Billing Router
 * Handles enterprise client subscriptions for DHG/Softmor's
 * Data Intelligence & AI Credit System
 *
 * All 4 tiers — per machine, per month:
 *   Pulse      → price_1TTaLKGvvjXZw2uE0j4ZMU9J  ($297/mo · 500 credits)
 *   Insight    → price_1TTaLMGvvjXZw2uE8m5Imwtn  ($597/mo · 2,000 credits)
 *   Command    → price_1TTaLNGvvjXZw2uEVbyQse2H  ($997/mo · 5,000 credits) ← RECOMMENDED
 *   Enterprise → price_1TTaLPGvvjXZw2uEOGZwzZUA  ($1,997/mo · Unlimited)
 *
 * Revenue flows to DHG bank account via Stripe LIVE mode.
 * IP owned by Dozier Holdings Group & Softmor Inc.
 * Governing Law: State of Texas. Houston, TX.
 */

import { z } from "zod";
import { router, adminProcedure } from "../_core/trpc";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-04-22.dahlia" });

// ConCreator™ Stripe Price IDs (LIVE mode)
export const CONCREATOR_PRICES = {
  pulse:      { priceId: "price_1TTaLKGvvjXZw2uE0j4ZMU9J", amount: 29700,  credits: 500,       label: "Pulse"      },
  insight:    { priceId: "price_1TTaLMGvvjXZw2uE8m5Imwtn", amount: 59700,  credits: 2000,      label: "Insight"    },
  command:    { priceId: "price_1TTaLNGvvjXZw2uEVbyQse2H", amount: 99700,  credits: 5000,      label: "Command"    },
  enterprise: { priceId: "price_1TTaLPGvvjXZw2uEOGZwzZUA", amount: 199700, credits: -1,        label: "Enterprise" }, // -1 = unlimited
  // Add-on: extra credit block
  credits_1000: { priceId: "price_1TPlWyGvvjXZw2uET83zN0aZ", amount: 4900, credits: 1000, label: "1,000 Credits" },
} as const;

export type ConCreatorTier = keyof typeof CONCREATOR_PRICES;

export const concreatorRouter = router({

  /**
   * List all ConCreator™ tiers with pricing
   */
  getTiers: adminProcedure.query(() => {
    return Object.entries(CONCREATOR_PRICES).map(([id, tier]) => ({
      id,
      ...tier,
      amountFormatted: `$${(tier.amount / 100).toFixed(2)}/mo`,
      creditsFormatted: tier.credits === -1 ? "Unlimited" : tier.credits.toLocaleString(),
    }));
  }),

  /**
   * Create a new B2B client subscription
   * Admin only — called when onboarding a new ConCreator™ client
   */
  createClientSubscription: adminProcedure
    .input(z.object({
      companyName:  z.string().min(1),
      contactName:  z.string().min(1),
      contactEmail: z.string().email(),
      tier:         z.enum(["pulse", "insight", "command", "enterprise"]),
      machineCount: z.number().min(1).max(1000),
      soldBy:       z.string().default("Chad A. Dozier — DHG/Softmor"),
      notes:        z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const tierConfig = CONCREATOR_PRICES[input.tier];

      // Create Stripe customer for the B2B client
      const customer = await stripe.customers.create({
        name:  input.companyName,
        email: input.contactEmail,
        metadata: {
          contactName:  input.contactName,
          tier:         input.tier,
          machineCount: String(input.machineCount),
          soldBy:       input.soldBy,
          product:      "ConCreator™",
          company:      "Dozier Holdings Group / Softmor Inc.",
          notes:        input.notes ?? "",
        },
      });

      // Create subscription with quantity = machineCount
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: tierConfig.priceId, quantity: input.machineCount }],
        metadata: {
          product:      "ConCreator™",
          tier:         input.tier,
          machineCount: String(input.machineCount),
          soldBy:       input.soldBy,
          company:      input.companyName,
        },
        payment_behavior: "default_incomplete",
        expand: ["latest_invoice.payment_intent"],
      });

      const monthlyRevenue = (tierConfig.amount * input.machineCount) / 100;

      return {
        success:          true,
        customerId:       customer.id,
        subscriptionId:   subscription.id,
        tier:             tierConfig.label,
        machineCount:     input.machineCount,
        monthlyRevenue:   `$${monthlyRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        annualRevenue:    `$${(monthlyRevenue * 12).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        creditsPerMonth:  tierConfig.credits === -1 ? "Unlimited" : (tierConfig.credits * input.machineCount).toLocaleString(),
        message: `ConCreator™ ${tierConfig.label} subscription created for ${input.companyName} — ${input.machineCount} machines at ${tierConfig.amount / 100}/mo each = $${monthlyRevenue.toLocaleString()}/mo`,
      };
    }),

  /**
   * List all active ConCreator™ B2B subscriptions
   */
  listClients: adminProcedure.query(async () => {
    const subscriptions = await stripe.subscriptions.list({
      limit: 100,
      expand: ["data.customer"],
    });

    // Filter for ConCreator subscriptions
    const concreatorSubs = subscriptions.data.filter(sub =>
      sub.metadata?.product === "ConCreator™"
    );

    return concreatorSubs.map(sub => {
      const customer = sub.customer as Stripe.Customer;
      const item = sub.items.data[0];
      const machineCount = parseInt(sub.metadata?.machineCount ?? "1");
      const tier = sub.metadata?.tier ?? "unknown";
      const tierConfig = CONCREATOR_PRICES[tier as ConCreatorTier];
      const monthlyRevenue = tierConfig ? (tierConfig.amount * machineCount) / 100 : 0;

      return {
        subscriptionId:  sub.id,
        customerId:      customer.id,
        companyName:     customer.name ?? "Unknown",
        contactEmail:    customer.email ?? "",
        tier:            tierConfig?.label ?? tier,
        machineCount,
        monthlyRevenue:  `$${monthlyRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        annualRevenue:   `$${(monthlyRevenue * 12).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        status:          sub.status,
        soldBy:          sub.metadata?.soldBy ?? "DHG",
        createdAt:       new Date(sub.created * 1000).toLocaleDateString(),
      };
    });
  }),

  /**
   * Get ConCreator™ revenue summary
   */
  getRevenueSummary: adminProcedure.query(async () => {
    const subscriptions = await stripe.subscriptions.list({
      limit: 100,
      status: "active",
    });

    const concreatorSubs = subscriptions.data.filter(sub =>
      sub.metadata?.product === "ConCreator™"
    );

    let totalMRR = 0;
    let totalMachines = 0;

    for (const sub of concreatorSubs) {
      const machineCount = parseInt(sub.metadata?.machineCount ?? "1");
      const tier = sub.metadata?.tier as ConCreatorTier;
      const tierConfig = CONCREATOR_PRICES[tier];
      if (tierConfig) {
        totalMRR += (tierConfig.amount * machineCount) / 100;
        totalMachines += machineCount;
      }
    }

    return {
      activeClients:  concreatorSubs.length,
      totalMachines,
      mrr:            totalMRR,
      arr:            totalMRR * 12,
      mrrFormatted:   `$${totalMRR.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      arrFormatted:   `$${(totalMRR * 12).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    };
  }),

});
