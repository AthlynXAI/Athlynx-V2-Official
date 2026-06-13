/**
 * AthlynXAI — Auth0 / Okta ID Token Verifier
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  ⚠️  AUTH CREDENTIALS FROZEN — DO NOT MODIFY — EVER            ║
 * ║  Domain:    dev-8yqdmei0v8kc3qqy.us.auth0.com                  ║
 * ║  Client ID: eDJT34flTy4oOq1cie6ItFubLDPHOrcI                  ║
 * ║  These are the ONLY valid credentials for athlynx.ai           ║
 * ║  Changing these WILL break production auth immediately          ║
 * ║  Verified working: 2026-06-13 (real users signing up live)     ║
 * ║  Locked by: Chad Dozier — Build 1 Session 5                    ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Verifies Auth0 ID tokens (RS256) via JWKS endpoint.
 * No client secret required — PKCE SPA flow only.
 *
 * Auth system: Auth0 PKCE ONLY — no Firebase, no Supabase auth.
 */

import { createRemoteJWKSet, jwtVerify } from "jose";

// ⚠️ FROZEN — DO NOT CHANGE THIS VALUE — see header above
const AUTH0_DOMAIN =
  process.env.AUTH0_DOMAIN || "dev-8yqdmei0v8kc3qqy.us.auth0.com";

const AUTH0_JWKS_URL = `https://${AUTH0_DOMAIN}/.well-known/jwks.json`;
const AUTH0_ISSUER = `https://${AUTH0_DOMAIN}/`;

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJwks() {
  if (!jwks) jwks = createRemoteJWKSet(new URL(AUTH0_JWKS_URL));
  return jwks;
}

// ─── Token payload type ───────────────────────────────────────────────────────

/** Normalized Auth0 token payload for the user upsert flow */
export type Auth0TokenPayload = {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  phone_number?: string;
  /** Provider derived from sub claim: "google-oauth2" | "facebook" | "apple" | "auth0" */
  provider: string;
};

// ─── Token verifier ───────────────────────────────────────────────────────────

/**
 * Verify an Auth0 ID token (RS256) via JWKS.
 * Returns a normalized payload for the user upsert flow.
 */
export async function verifyToken(idToken: string): Promise<Auth0TokenPayload> {
  const { payload } = await jwtVerify(idToken, getJwks(), {
    issuer: AUTH0_ISSUER,
  });

  const uid = payload.sub;
  if (!uid) throw new Error("Auth0 ID token missing sub");

  // Derive the provider from the sub claim: "google-oauth2|1234" → "google-oauth2"
  const subParts = uid.split("|");
  const provider = subParts.length > 1 ? subParts[0] : "auth0";

  const p = payload as Record<string, unknown>;

  return {
    uid,
    email: typeof p.email === "string" ? p.email : undefined,
    name:
      typeof p.name === "string"
        ? p.name
        : typeof p.nickname === "string"
        ? p.nickname
        : undefined,
    picture: typeof p.picture === "string" ? p.picture : undefined,
    phone_number: typeof p.phone_number === "string" ? p.phone_number : undefined,
    provider,
  };
}
