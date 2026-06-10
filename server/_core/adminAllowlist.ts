/**
 * AthlynX Master Admin Doctrine — server-side gate (Build 50 · May 29, 2026)
 *
 * Single source of truth: client/src/governance.ts
 *
 * This file mirrors the locked doctrine for server-side reads. The runtime
 * env-var override is preserved for emergencies, but the FALLBACK list is
 * now identical to THE_FOUR_ATHLYNX_EMAILS in governance.ts.
 *
 * Going forward, every server file that needs to check "is this Chad?"
 * must import isMasterAdmin from here — no more hardcoded lists.
 */

import type { User } from "../../drizzle/schema";

const MASTER_ADMIN_EMAIL = "chaddozier75@gmail.com";

/**
 * THE THREE — locked roster (mirrors client/src/governance.ts).
 * Master Admin: Chad. Full Admins: Lee, Glenn.
 * Tony Locey — access revoked by Master Admin. Account suspended.
 *
 * Each person lists every sign-in address Google/Auth0 may surface so the
 * server-side allowlist match succeeds whether they log in with their
 * athlynx.ai alias or their personal Gmail. Added 2026-05-31.
 */
const THE_FOUR_DOCTRINE_EMAILS = [
  // Chad — Master Admin
  "chaddozier75@gmail.com",
  "cdozier14@athlynx.ai",
  "cdozier@dozierholdingsgroup.com",
  // Lee — Full Admin · VP Sales & Partnerships
  "lmarshall@athlynx.ai",
  "leronious@gmail.com",
  // Glenn — Full Admin · CFO / COO
  "gtse@dozierholdingsgroup.com",
  "gtse@athlynx.ai",
  "glenn.tse@gmail.com",
  // Tony Locey — SUSPENDED by Master Admin (Chad A. Dozier Sr.) — no access
  // "tlockey24@athlynx.ai",   // suspended
  // "tlocey@athlynx.ai",      // suspended
  // "tonyloceybaseball@gmail.com", // suspended
] as const;

/** Back-compat alias — some imports still reference this name. */
const THE_FOUR_ATHLYNX_EMAILS = THE_FOUR_DOCTRINE_EMAILS;

/** Chad-only sign-in addresses (Master Admin tier). */
const MASTER_ADMIN_SIGNIN_EMAILS = [
  "chaddozier75@gmail.com",
  "cdozier14@athlynx.ai",
  "cdozier@dozierholdingsgroup.com",
] as const;

function masterAdminList(): string[] {
  const env = (process.env.MASTER_ADMIN_EMAILS ?? "").trim();
  if (!env) return MASTER_ADMIN_SIGNIN_EMAILS.map((e) => e.toLowerCase()) as string[];
  return env
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function billingExemptList(): string[] {
  // Doctrine roster — env override exists for emergencies only.
  const env = (process.env.BILLING_EXEMPT_EMAILS ?? "").trim();
  if (!env) return THE_FOUR_DOCTRINE_EMAILS.map((e) => e.toLowerCase()) as string[];
  return env
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isMasterAdmin(email?: string | null): boolean {
  if (!email) return false;
  return masterAdminList().includes(email.toLowerCase());
}

export function getMasterAdminEmails(): string[] {
  return masterAdminList();
}

/** TRUE if email is on THE FOUR — used for billing skips and credit throttling skips. */
export function isBillingExempt(email?: string | null): boolean {
  if (!email) return false;
  return billingExemptList().includes(email.toLowerCase());
}

/** Server-side access tier resolution. Falls back to email match if DB column is null. */
export function accessTierFor(user: User | null): "Master Admin" | "Full Admin" | null {
  if (!user) return null;
  // Prefer the DB column (set by STEP A.1) — but fall back to email match for safety
  // until every doctrine row is fully populated.
  if (user.accessTier === "Master Admin" || user.accessTier === "Full Admin") {
    return user.accessTier;
  }
  if (isMasterAdmin(user.email)) return "Master Admin";
  if (isBillingExempt(user.email)) return "Full Admin";
  return null;
}

/** Convenience guard for billing routes — checks both DB flag and email allowlist. */
export function shouldSkipStripeBilling(user: User | null): boolean {
  if (!user) return false;
  if (user.billingExempt === true) return true;
  return isBillingExempt(user.email);
}

/** Convenience guard for credit throttling — checks both DB flag and email allowlist. */
export function shouldSkipCreditThrottling(user: User | null): boolean {
  if (!user) return false;
  if (user.unlimitedCredits === true) return true;
  return isBillingExempt(user.email);
}

/** Convenience guard for full-admin UI gates (e.g., admin panels, internal tools). */
export function isFullAdmin(user: User | null): boolean {
  if (!user) return false;
  if (user.fullAdmin === true) return true;
  return isBillingExempt(user.email);
}
