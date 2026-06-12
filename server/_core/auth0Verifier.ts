/**
 * AthlynXAI — Auth0 / Okta ID Token Verifier
 *
 * Verifies Auth0 ID tokens (RS256) via JWKS endpoint.
 * No client secret required — PKCE SPA flow only.
 *
 * Auth system: Auth0/Okta PKCE ONLY — no Firebase, no Supabase auth.
 * Domain: dev-8yqdmei0v8kc3qqy.us.auth0.com
 * SPA Client ID: eDJT34flTy4oOq1cie6ItFubLDPHOrcI
 */

import { createRemoteJWKSet, jwtVerify } from "jose";

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
