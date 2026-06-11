/**
 * AthlynXAI — Auth0 JWT Verifier (replaces Firebase Admin + Supabase JWKS)
 *
 * Verifies Auth0 access tokens using the Auth0 JWKS endpoint.
 * Drop-in replacement: exports verifyFirebaseToken() with the same signature
 * so customAuthRouter.ts needs zero changes.
 *
 * Auth0 Domain: dev-8yqdmei0v8kc3qqy.us.auth0.com
 * Audience:     https://api.athlynx.ai/
 * Algorithm:    RS256
 */
import { createRemoteJWKSet, jwtVerify } from "jose";

const AUTH0_DOMAIN =
  process.env.AUTH0_DOMAIN || "dev-8yqdmei0v8kc3qqy.us.auth0.com";

const AUTH0_AUDIENCE =
  process.env.AUTH0_AUDIENCE || "https://api.athlynx.ai/";

const AUTH0_JWKS_URL = `https://${AUTH0_DOMAIN}/.well-known/jwks.json`;
const AUTH0_ISSUER = `https://${AUTH0_DOMAIN}/`;

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJwks() {
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(AUTH0_JWKS_URL));
  }
  return jwks;
}

export type FirebaseTokenPayload = {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  phone_number?: string;
  firebase: {
    sign_in_provider: string;
    identities?: Record<string, string[]>;
  };
};

/**
 * Verify an Auth0 access token and return a payload compatible with the
 * existing FirebaseTokenPayload shape so callers need no changes.
 */
export async function verifyFirebaseToken(
  accessToken: string
): Promise<FirebaseTokenPayload> {
  const { payload } = await jwtVerify(accessToken, getJwks(), {
    issuer: AUTH0_ISSUER,
    audience: AUTH0_AUDIENCE,
  });

  const uid = payload.sub;
  if (!uid) {
    throw new Error("Auth0 token missing sub (uid)");
  }

  // Auth0 stores provider info in the sub prefix: "google-oauth2|...", "auth0|...", etc.
  const subParts = uid.split("|");
  const provider: string = subParts.length > 1 ? subParts[0] : "auth0";

  const p = payload as any;

  return {
    uid,
    email: typeof p.email === "string" ? p.email : undefined,
    name: typeof p.name === "string" ? p.name : typeof p.nickname === "string" ? p.nickname : undefined,
    picture: typeof p.picture === "string" ? p.picture : undefined,
    phone_number: typeof p.phone_number === "string" ? p.phone_number : undefined,
    firebase: {
      sign_in_provider: provider,
      identities: {},
    },
  };
}
