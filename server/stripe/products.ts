/**
 * AthlynX Stripe Products & Pricing Configuration
 *
 * Build 50 · May 29, 2026 · Locked by Chad A. Dozier Sr.
 *
 * DOCTRINE:
 *   - The team does not pay. Only new users pay.
 *   - Stripe Price IDs MUST come from Vercel environment variables.
 *   - No hardcoded Price IDs in source. Stale Price IDs from prior Stripe
 *     accounts are removed.
 *   - If the env var is missing, the checkout layer refuses to charge and
 *     returns a clear configuration error instead of silently creating an
 *     off-catalog inline Stripe product.
 *
 * Required monthly env vars for the current ATHLYNX public tiers:
 *   STRIPE_PRICE_ATHLETE_FREE_MONTHLY or STRIPE_PRICE_FREE
 *   STRIPE_PRICE_ATHLETE_PRO_MONTHLY or STRIPE_PRICE_PRO
 *   STRIPE_PRICE_ATHLETE_ELITE_MONTHLY or STRIPE_PRICE_ELITE
 *
 * Optional/legacy aliases and other product env vars:
 *   STRIPE_PRICE_STARTER, STRIPE_PRICE_STARTER_YEARLY
 *   STRIPE_PRICE_CHAMPION, STRIPE_PRICE_CHAMPION_YEARLY
 *   STRIPE_PRICE_MVP, STRIPE_PRICE_MVP_YEARLY
 *   STRIPE_PRICE_PRO_TEAMS, STRIPE_PRICE_PRO_TEAMS_YEARLY
 *   STRIPE_PRICE_CREDITS_100, STRIPE_PRICE_CREDITS_500, STRIPE_PRICE_CREDITS_1000
 *
 * After Stripe products are (re)created in the live account, paste the
 * resulting `price_...` IDs into the Vercel env tab for the athlynx-platform
 * project. Do not paste them in chat. Do not commit them to source.
 *
 * Signoff:  */

const PRICE = (...values: Array<string | undefined>): string | undefined => {
  for (const value of values) {
    if (!value) continue;
    const trimmed = value.trim();
    if (trimmed.length > 0) return trimmed;
  }
  return undefined;
};

export const STRIPE_PLANS = [
  {
    id: "athlete_free",
    name: "Athlete Free",
    description: "Get started at no cost. 7-day free trial — converts to Starter ($9.99/mo) on day 8.",
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      "Basic Athlete Profile",
      "NIL Deal Discovery",
      "Community Feed",
      "Transfer Portal Access",
      "7-Day Free Trial",
    ],
    stripePriceIdMonthly: PRICE(process.env.STRIPE_PRICE_ATHLETE_FREE_MONTHLY, process.env.STRIPE_PRICE_FREE),
    stripePriceIdYearly: PRICE(process.env.STRIPE_PRICE_ATHLETE_FREE_YEARLY, process.env.STRIPE_PRICE_FREE_YEARLY, process.env.STRIPE_PRICE_ATHLETE_FREE_MONTHLY, process.env.STRIPE_PRICE_FREE),
    badge: "Free Trial",
    color: "#1E90FF",
    trialDays: 7,
    trialConvertsTo: "athlete_starter",
  },
  {
    id: "athlete_starter",
    name: "Athlete Starter",
    description: "Essential access to the AthlynX platform — NIL discovery, messaging, and community features.",
    priceMonthly: 999,
    priceYearly: 9588,
    features: [
      "Basic Athlete Profile",
      "NIL Deal Discovery",
      "Community Messaging",
      "Transfer Portal Access",
      "Diamond Grind Training",
      "7-Day Free Trial",
    ],
    stripePriceIdMonthly: PRICE(process.env.STRIPE_PRICE_ATHLETE_STARTER_MONTHLY, process.env.STRIPE_PRICE_STARTER, process.env.STRIPE_PRICE_STARTER_MONTHLY),
    stripePriceIdYearly: PRICE(process.env.STRIPE_PRICE_ATHLETE_STARTER_YEARLY, process.env.STRIPE_PRICE_STARTER_YEARLY),
    badge: "Best for Beginners",
    color: "#1E90FF",
    trialDays: 7,
  },
  {
    id: "athlete_pro",
    name: "Athlete Pro",
    description: "Full platform access with AI recruiting, NIL deal tracking, and transfer portal intelligence.",
    priceMonthly: 1999,
    priceYearly: 19188,
    features: [
      "Everything in Starter",
      "AI Recruiter Tools",
      "NIL Deal Marketplace",
      "Warriors Playbook",
      "AI Sales Automation",
      "Priority Support",
    ],
    stripePriceIdMonthly: PRICE(process.env.STRIPE_PRICE_ATHLETE_PRO_MONTHLY, process.env.STRIPE_PRICE_PRO, process.env.STRIPE_PRICE_PRO_MONTHLY),
    stripePriceIdYearly: PRICE(process.env.STRIPE_PRICE_ATHLETE_PRO_YEARLY, process.env.STRIPE_PRICE_PRO_YEARLY),
    badge: "Most Popular",
    color: "#1E90FF",
    trialDays: 7,
  },
  {
    id: "athlete_elite",
    name: "Athlete Elite",
    description: "The complete AthlynX experience — NIL management, brand deals, and 1-on-1 strategy.",
    priceMonthly: 3999,
    priceYearly: 38388,
    features: [
      "Everything in Pro",
      "NIL Vault (Contract Archive)",
      "Brand Deal Negotiation AI",
      "Dedicated Account Manager",
      "White-label Branding",
      "API Access",
    ],
    stripePriceIdMonthly: PRICE(process.env.STRIPE_PRICE_ATHLETE_ELITE_MONTHLY, process.env.STRIPE_PRICE_ELITE, process.env.STRIPE_PRICE_ELITE_MONTHLY),
    stripePriceIdYearly: PRICE(process.env.STRIPE_PRICE_ATHLETE_ELITE_YEARLY, process.env.STRIPE_PRICE_ELITE_YEARLY),
    badge: "Best Value",
    color: "#1E90FF",
    trialDays: 7,
  },
  {
    id: "athlete_champion",
    name: "Athlete Champion",
    description: "Advanced NIL analytics, custom athlete page, and early access to new features.",
    priceMonthly: 5999,
    priceYearly: 57588,
    features: [
      "Everything in Elite",
      "Advanced NIL Analytics",
      "Custom Athlete Page",
      "Early Access Features",
      "Priority Deal Matching",
      "Champion Badge",
    ],
    stripePriceIdMonthly: PRICE(process.env.STRIPE_PRICE_CHAMPION, process.env.STRIPE_PRICE_CHAMPION_MONTHLY),
    stripePriceIdYearly: PRICE(process.env.STRIPE_PRICE_CHAMPION_YEARLY),
    badge: "Champion Tier",
    color: "#1E90FF",
    trialDays: 7,
  },
  {
    id: "athlete_mvp",
    name: "Athlete MVP",
    description: "1-on-1 strategy, VIP network, unlimited credits, and white-glove service.",
    priceMonthly: 9999,
    priceYearly: 95988,
    features: [
      "Everything in Champion",
      "1-on-1 Strategy Sessions",
      "VIP Athlete Network",
      "Unlimited AI Credits",
      "White-Glove Service",
      "MVP Badge & Verified",
    ],
    stripePriceIdMonthly: PRICE(process.env.STRIPE_PRICE_MVP, process.env.STRIPE_PRICE_MVP_MONTHLY),
    stripePriceIdYearly: PRICE(process.env.STRIPE_PRICE_MVP_YEARLY),
    badge: "MVP — Top Tier",
    color: "#1E90FF",
    trialDays: 7,
  },
  {
    id: "pro_teams",
    name: "Pro Teams",
    description: "Full platform access for professional sports organizations — NFL, NBA, MLB, NHL, MLS, WNBA, Pro Soccer, Pro Baseball. Roster management, contract tracking, AI scouting, training, and brand deals.",
    priceMonthly: 250000,
    priceYearly: 2400000,
    features: [
      "Up to 100 roster slots",
      "Contract tracking & cap management",
      "AI Scouting Intelligence",
      "Team messaging & scheduling",
      "Training & performance logs",
      "Brand deals & NIL management",
      "Advanced analytics dashboard",
      "Dedicated account manager",
      "API access",
    ],
    stripePriceIdMonthly: PRICE(process.env.STRIPE_PRICE_PRO_TEAMS, process.env.STRIPE_PRICE_PRO_TEAMS_MONTHLY),
    stripePriceIdYearly: PRICE(process.env.STRIPE_PRICE_PRO_TEAMS_YEARLY),
    badge: "Pro Teams",
    color: "#1E90FF",
    trialDays: 30,
  },
] as const;

export type PlanId = (typeof STRIPE_PLANS)[number]["id"];

export const CREDIT_PACKS = [
  {
    id: "credits_100",
    name: "100 Credits",
    description: "100 AI credits — use for AI Trainers, Teammates & Companions.",
    credits: 100,
    price: 999,
    stripePriceId: PRICE(process.env.STRIPE_PRICE_CREDITS_100),
  },
  {
    id: "credits_500",
    name: "500 Credits",
    description: "500 AI credits — best value for active users.",
    credits: 500,
    price: 3999,
    stripePriceId: PRICE(process.env.STRIPE_PRICE_CREDITS_500),
  },
  {
    id: "credits_1000",
    name: "1,000 Credits",
    description: "1,000 AI credits — power users and teams.",
    credits: 1000,
    price: 6999,
    stripePriceId: PRICE(process.env.STRIPE_PRICE_CREDITS_1000),
  },
] as const;

export type CreditPackId = (typeof CREDIT_PACKS)[number]["id"];

// ───────────────────────────────────────────────────────────────────────────
// Helpers for checkout layer
// ───────────────────────────────────────────────────────────────────────────

/** True when a plan has at least one configured Stripe Price ID (monthly OR yearly). */
export function planHasStripePrice(planId: string): boolean {
  const plan = STRIPE_PLANS.find((p) => p.id === planId);
  if (!plan) return false;
  return Boolean(plan.stripePriceIdMonthly || plan.stripePriceIdYearly);
}

/** True when a credit pack has a configured Stripe Price ID. */
export function creditPackHasStripePrice(packId: string): boolean {
  const pack = CREDIT_PACKS.find((p) => p.id === packId);
  return Boolean(pack?.stripePriceId);
}

/** Diagnostic snapshot — which plans/packs have Stripe Price IDs wired. */
export function stripeCatalogStatus() {
  return {
    plans: STRIPE_PLANS.map((p) => ({
      id: p.id,
      name: p.name,
      monthly: Boolean(p.stripePriceIdMonthly),
      yearly: Boolean(p.stripePriceIdYearly),
    })),
    creditPacks: CREDIT_PACKS.map((p) => ({
      id: p.id,
      name: p.name,
      configured: Boolean(p.stripePriceId),
    })),
  };
}
