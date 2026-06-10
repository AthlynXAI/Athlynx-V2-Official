/**
 * AthlynX — Supabase JWT Verifier
 * Verifies Supabase access tokens server-side using Supabase's JWKS endpoint.
 * Project: pgrbkisgwpxgphpqmual.supabase.co
 *
 */
import { createRemoteJWKSet, jwtVerify } from "jose";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://pgrbkisgwpxgphpqmual.supabase.co";
const SUPABASE_JWKS_URL = `${SUPABASE_URL}/auth/v1/.well-known/jwks.json`;
const SUPABASE_ISSUER = `${SUPABASE_URL}/auth/v1`;

// Cache the JWKS set (auto-refreshes)
let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
function getJwks() {
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(SUPABASE_JWKS_URL));
  }
  return jwks;
}

export type SupabaseTokenPayload = {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  phone_number?: string;
  provider: string;
};


/**
 * Verify a Supabase access token and return the decoded payload.
 * Throws if the token is invalid or expired.
 */
export async function verifySupabaseToken(accessToken: string): Promise<SupabaseTokenPayload> {
  const { payload } = await jwtVerify(accessToken, getJwks(), {
    issuer: SUPABASE_ISSUER,
    algorithms: ["RS256", "HS256"],
  });

  const uid = payload.sub;
  if (!uid) {
    throw new Error("Supabase token missing sub (uid)");
  }

  const meta = (payload as any).user_metadata ?? {};
  const appMeta = (payload as any).app_metadata ?? {};

  return {
    uid,
    email: typeof payload.email === "string" ? payload.email : undefined,
    name: meta.full_name ?? meta.name ?? undefined,
    picture: meta.avatar_url ?? meta.picture ?? undefined,
    phone_number: typeof (payload as any).phone === "string" ? (payload as any).phone : undefined,
    provider: appMeta.provider ?? "email",
  };
}
