/**
 * AthlynXAI — Supabase JWT Verifier (replaces Firebase Admin)
 * Firebase has been fully removed. This module verifies Supabase access tokens
 * using the Supabase JWKS endpoint so the server can trust client sessions.
 *
 * Drop-in replacement: exports verifyFirebaseToken() with the same signature
 * so customAuthRouter.ts needs zero changes.
 */
import { createRemoteJWKSet, jwtVerify } from "jose";

const SUPABASE_PROJECT_REF = "pgrbkisgwpxgphpqmual";
const SUPABASE_JWKS_URL = `https://${SUPABASE_PROJECT_REF}.supabase.co/auth/v1/.well-known/jwks.json`;
const SUPABASE_ISSUER = `https://${SUPABASE_PROJECT_REF}.supabase.co/auth/v1`;

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJwks() {
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(SUPABASE_JWKS_URL));
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
 * Verify a Supabase access token and return a payload compatible with the
 * existing FirebaseTokenPayload shape so callers need no changes.
 */
export async function verifyFirebaseToken(
  accessToken: string
): Promise<FirebaseTokenPayload> {
  const { payload } = await jwtVerify(accessToken, getJwks(), {
    issuer: SUPABASE_ISSUER,
  });

  const uid = payload.sub;
  if (!uid) {
    throw new Error("Supabase token missing sub (uid)");
  }

  // Supabase stores provider info in app_metadata
  const appMeta = (payload as any).app_metadata ?? {};
  const provider: string = appMeta.provider ?? "email";

  return {
    uid,
    email:
      typeof payload.email === "string" ? payload.email : undefined,
    name:
      typeof (payload as any).user_metadata?.full_name === "string"
        ? (payload as any).user_metadata.full_name
        : typeof (payload as any).user_metadata?.name === "string"
        ? (payload as any).user_metadata.name
        : undefined,
    picture:
      typeof (payload as any).user_metadata?.avatar_url === "string"
        ? (payload as any).user_metadata.avatar_url
        : undefined,
    phone_number:
      typeof payload.phone === "string" ? payload.phone : undefined,
    firebase: {
      sign_in_provider: provider,
      identities: {},
    },
  };
}
