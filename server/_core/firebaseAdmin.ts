/**
 * AthlynXAI — Auth0 ID Token Verifier
 * Verifies Auth0 ID tokens (RS256) via JWKS.
 * No audience check — uses issuer only (ID token flow).
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

export type FirebaseTokenPayload = {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  phone_number?: string;
  firebase: { sign_in_provider: string; identities?: Record<string, string[]> };
};

export async function verifyFirebaseToken(idToken: string): Promise<FirebaseTokenPayload> {
  const { payload } = await jwtVerify(idToken, getJwks(), {
    issuer: AUTH0_ISSUER,
    // No audience check for ID tokens — Auth0 ID tokens use client_id as audience
    // which we don't need to enforce server-side
  });

  const uid = payload.sub;
  if (!uid) throw new Error("Auth0 ID token missing sub");

  const subParts = uid.split("|");
  const provider = subParts.length > 1 ? subParts[0] : "auth0";
  const p = payload as any;

  return {
    uid,
    email: typeof p.email === "string" ? p.email : undefined,
    name: typeof p.name === "string" ? p.name : typeof p.nickname === "string" ? p.nickname : undefined,
    picture: typeof p.picture === "string" ? p.picture : undefined,
    phone_number: typeof p.phone_number === "string" ? p.phone_number : undefined,
    firebase: { sign_in_provider: provider, identities: {} },
  };
}
