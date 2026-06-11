/**
 * AthlynX Governance Doctrine — single source of truth.
 *
 * Locked by Chad A. Dozier Sr. on May 29, 2026. Any change to this file
 * must be authored by the Master Admin (chaddozier75@gmail.com) only.
 *
 * Rules:
 *  1. There is exactly ONE Master Admin: Chad A. Dozier Sr.
 *     Developer · Founder · CEO · Chairman.
 *  2. The Master Admin grants and revokes all access — unilaterally,
 *     instantly, with no committee.
 *  3. THE THREE (Chad · Lee · Glenn) pay nothing. Unlimited
 *     credits, billing-exempt. Everyone else pays via standard
 *     Stripe billing.
 *  4. Any access tier (Full Admin, Partner, Team Member, Unlimited
 *     Credits, Billing Exempt) exists at the Master Admin's
 *     discretion and can be revoked at will.
 *
 *  Brand discipline applies here too: cobalt #1E90FF + true black +
 *  white. No gold/yellow/orange anywhere in role badges or chrome.
 *  Signoff:  */

export const MASTER_ADMIN_EMAIL = "chaddozier75@gmail.com";

/**
 * The locked roster of THE FOUR — each person has up to two addresses
 * the platform must recognize as the same identity:
 *   • primary    — the athlynx.ai / corporate address shown on the platform UI
 *   • signIn[]  — every address they actually use to sign in (Google OAuth
 *                  almost always lands on the personal Gmail, not the athlynx.ai
 *                  alias). Listed so the allowlist match succeeds either way.
 *
 * Added 2026-05-31 · Chad: prevent Full Admin lockout when team logs in
 * with their Gmail tomorrow.
 */
export interface DoctrineMember {
  readonly primary: string;
  readonly signIn: readonly string[];
  readonly role: "Master Admin" | "Full Admin";
  readonly label: string;
}

export const THE_FOUR: readonly DoctrineMember[] = [
  {
    primary: "chaddozier75@gmail.com",
    signIn: [
      "chaddozier75@gmail.com",
      "cdozier14@athlynx.ai",
      "cdozier@dozierholdingsgroup.com",
      "chad.dozier@icloud.com",
    ],
    role: "Master Admin",
    label: "Chad — Founder · CEO · Chairman",
  },
  {
    primary: "lmarshall@athlynx.ai",
    signIn: [
      "lmarshall@athlynx.ai",
      "leronious@gmail.com",
    ],
    role: "Full Admin",
    label: "Lee — Co-Host · VP Sales & Partnerships",
  },
  {
    primary: "gtse@dozierholdingsgroup.com",
    signIn: [
      "gtse@dozierholdingsgroup.com",
      "gtse@athlynx.ai",
      "glenn.tse@gmail.com",
    ],
    role: "Full Admin",
    label: "Glenn — CFO / COO",
  },
  // SUSPENDED 2026-06-09:  access suspended by Master Admin.
  // { primary: "tlockey24@athlynx.ai", signIn: ["tlockey24@athlynx.ai", "tlocey@athlynx.ai", "tonyloceybaseball@gmail.com"], role: "Full Admin", label: "Tony —  & Partner" },
] as const;

/**
 * BACK-COMPAT: existing callers import THE_FOUR_ATHLYNX_EMAILS and treat it
 * as a flat string[]. We now expose ALL recognized sign-in addresses across
 * THE FOUR so isBillingExempt still works for personal-Gmail logins.
 */
export const THE_FOUR_ATHLYNX_EMAILS = THE_FOUR.flatMap((m) => m.signIn) as readonly string[];

export type AccessTier = "Master Admin" | "Full Admin";
export type PartnerStatus = "Partner & Team Member";

/** Returns true if the given email is on the locked $0-billing roster. */
export function isBillingExempt(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return THE_FOUR.some((m) =>
    m.signIn.some((s) => s.toLowerCase() === normalized),
  );
}

/** Returns true if the given email is the sole Master Admin (any of Chad's sign-in addresses). */
export function isMasterAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  const chad = THE_FOUR.find((m) => m.role === "Master Admin");
  return !!chad && chad.signIn.some((s) => s.toLowerCase() === normalized);
}

/** Resolve any sign-in email back to the canonical primary athlynx.ai/corporate address. */
export function canonicalEmailFor(email: string | null | undefined): string | null {
  if (!email) return null;
  const normalized = email.trim().toLowerCase();
  const m = THE_FOUR.find((x) => x.signIn.some((s) => s.toLowerCase() === normalized));
  return m?.primary ?? null;
}

/** Returns the access tier for any email — or null if not on the roster. */
export function accessTierFor(email: string | null | undefined): AccessTier | null {
  if (!email) return null;
  if (isMasterAdmin(email)) return "Master Admin";
  if (isBillingExempt(email)) return "Full Admin";
  return null;
}

/** Convenience: should the platform skip Stripe billing for this email? */
export function shouldSkipStripeBilling(email: string | null | undefined): boolean {
  return isBillingExempt(email);
}

/** Convenience: should the platform skip platform-credit throttling? */
export function shouldSkipCreditThrottling(email: string | null | undefined): boolean {
  return isBillingExempt(email);
}

//  COMPUTE DOCTRINE 
// Added May 29, 2026 · NVIDIA / Nebius alignment per Chad's strategic direction.
// Source: NVIDIA Ising launch (April 14, 2026) + NVIDIA-Nebius full-stack AI
// cloud partnership (March 11, 2026). Build 27 LayerCake handoff confirms
// Nebius (NVIDIA H200) is wired as AI Layer 3 production fallback in
// server/services/nebius.ts with NEBIUS_API_KEY env var.
//
// AthlynX positioning: vertical-AI workload generator for sports — the
// demand-side counterpart to NVIDIA's silicon + cloud + open-model stack.
// Not a chip play, not a cloud play — a workload-creator play.
// 

/** AthlynXAI OS compute stack — public-safe declarations (no API keys, no endpoints). */
export const COMPUTE_DOCTRINE = {
  primary_inference: {
    family: "Google Gemini 2.5 Flash",
    role: "Primary inference path — sports intelligence + fast paths",
  },
  fallback_1: {
    family: "Anthropic Claude Opus 4",
    role: "Deep reasoning — contract analysis, NIL deal review",
  },
  fallback_2: {
    family: "Nebius Llama-3.3-70B on NVIDIA H200",
    role: "Open-weight production fallback — scouting reports, EPX score",
    hardware: "NVIDIA H200 GPU cluster (Nebius AI Cloud)",
  },
  open_model_alignment: {
    portfolio: ["NVIDIA Nemotron", "NVIDIA Cosmos", "NVIDIA Ising", "NVIDIA Isaac GR00T", "NVIDIA BioNeMo"],
    posture: "AthlynXAI OS is designed to integrate with NVIDIA's open-model portfolio as vertical sports AI matures.",
    market_thesis:
      "NVIDIA invests across silicon + cloud + workload generators (Nebius $1B+ stake confirmed). AthlynX is the sports-vertical workload generator NVIDIA has not yet met.",
  },
  workload_thesis:
    "Every athlete query through AthlynX (recruiting, NIL valuation, Battery Coach, scouting, content) = inference cycles consumed. AthlynX is demand-side AI infrastructure, packaged in sports.",
} as const;

export type ComputeDoctrine = typeof COMPUTE_DOCTRINE;

//  LIFETIME ATHLETE IDENTITY DOCTRINE (Innovation F · May 30, 2026) 
// First in sports tech: one athlete identity from birth to retirement.
// Diamond Grind (8-14) → High School (14-18) → College (18-22+) → Pro → Post-Career.
// Same user_id. Same profile. Same audit trail. Same brand history.
// No competitor owns this arc. This is the moat.
// 

/** Five-stage athlete career arc. Stage shifts trigger feature unlocks + compliance gates. */
export type LifetimeStage =
  | "youth"          // ages 8-13 · COPPA-locked · parent-managed
  | "high_school"    // ages 14-18 · school + family co-managed · early NIL flow
  | "college"        // ages 18-22+ · NIL active · transfer portal · recruiting
  | "pro"            // 22+ · brand marketplace · agent / agency · contract vault
  | "post_career";   // post-playing · alumni · coaching / broadcasting / brand

export const LIFETIME_ATHLETE_IDENTITY = {
  doctrine: "One identity, every athlete, every platform — from birth to retirement.",
  stages: [
    { stage: "youth",        ages: "8–13",   compliance: "COPPA · parent-managed",        unlocks: ["Diamond Grind IQ", "Parent Dashboard", "Drill Library"] },
    { stage: "high_school",  ages: "14–18",  compliance: "School + family co-managed",    unlocks: ["Recruiting Profile", "Early NIL Flow", "Transfer Portal Watch"] },
    { stage: "college",      ages: "18–22+", compliance: "NIL active · NCAA compliance",  unlocks: ["NIL Marketplace", "AI Recruiting Concierge", "Transfer Portal Entry"] },
    { stage: "pro",          ages: "22+",    compliance: "Pro contracts · agent / agency", unlocks: ["Brand Marketplace", "Contract Vault", "Performance NIL Valuation"] },
    { stage: "post_career",  ages: "—",      compliance: "Post-playing · alumni",         unlocks: ["Alumni Network", "Coaching / Broadcasting Tools", "Legacy Brand Story"] },
  ] as const,
  moat:
    "No competitor owns the youth → pro → post-career arc as one identity. Opendorse, INFLCR, On3, 247Sports each own one slice. AthlynX is the only platform where the kid in the bullpen tonight has the same user_id at age 34.",
  innovation_claim: "First Lifetime Athlete Identity — birth to retirement, one platform.",
} as const;

export type LifetimeAthleteIdentity = typeof LIFETIME_ATHLETE_IDENTITY;

//  AI RECRUITING CONCIERGE DOCTRINE (Innovation B · May 30, 2026) 
// Every Pro / Elite / Champion athlete gets a dedicated AI agent running on
// NVIDIA Nemotron Ultra 253B (H200 via Nebius). Daily briefing on recruiting
// interest, NIL opportunities, transfer windows, eligibility status.
// 

export const AI_RECRUITING_CONCIERGE = {
  doctrine: "Every athlete gets a personal AI recruiting agent — not a chatbot, a concierge.",
  model: "NVIDIA Nemotron Ultra 253B (H200 via Nebius)",
  available_to: ["athlete_pro", "athlete_elite", "athlete_champion", "athlete_mvp"],
  capabilities: [
    "Daily personalized briefing (recruiting interest, NIL deal flow, eligibility windows)",
    "Real-time alerts on transfer portal openings + recruiting visits",
    "NIL opportunity matching with brand fit scoring",
    "Eligibility timeline tracking (academic + athletic)",
    "Personalized brand outreach drafts (athlete approves before send)",
  ] as const,
  innovation_claim: "First Personal AI Recruiting Concierge per athlete, backed by NVIDIA Nemotron Ultra.",
} as const;

export type AIRecruitingConcierge = typeof AI_RECRUITING_CONCIERGE;

//  REAL-TIME NIL VALUATION SPIKES (Innovation D · May 30, 2026) 
// When a player has a breakout game, their NIL value gets re-scored in real time.
// Brands see a "Top NIL Value Gainers This Hour" feed.
// Athletes get push notifications when their valuation jumps.
// 

export const NIL_VALUATION_SPIKES = {
  doctrine: "Performance drives valuation in real time, not next quarter.",
  trigger_events: [
    "regional_breakout_game",
    "super_regional_breakout_game",
    "cws_breakout_game",
    "transfer_portal_entry",
    "viral_social_moment",
    "national_team_call_up",
  ] as const,
  engine: "Nebius Llama-3.3-70B on H200 — performance + social + viewership context",
  audience_feeds: [
    "athlete_push: 'Your AthlynX NIL value jumped 23%'",
    "brand_feed: 'Top 10 NIL value gainers this hour'",
    "agent_dashboard: 'Clients with value spikes pending action'",
  ] as const,
  innovation_claim: "First Real-Time Performance-Based NIL Valuation Engine.",
} as const;

export type NilValuationSpikes = typeof NIL_VALUATION_SPIKES;
