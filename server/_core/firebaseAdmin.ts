/**
 * AthlynX — Firebase Admin SDK
 * Verifies Firebase ID tokens server-side without needing a service account key file.
 * Uses Google's public JWKS endpoint to verify RS256 tokens.
 * Project ID: athlynxai
 */
import { createRemoteJWKSet, jwtVerify } from "jose";

const FIREBASE_PROJECT_ID = "athlynxai";
const FIREBASE_JWKS_URL = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";
const FIREBASE_ISSUER = `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`;

// Cache the JWKS set (auto-refreshes)
let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
function getJwks() {
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(FIREBASE_JWKS_URL));
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
 * Verify a Firebase ID token and return the decoded payload.
 * Throws if the token is invalid or expired.
 */
export async function verifyFirebaseToken(idToken: string): Promise<FirebaseTokenPayload> {
  const { payload } = await jwtVerify(idToken, getJwks(), {
    issuer: FIREBASE_ISSUER,
    audience: FIREBASE_PROJECT_ID,
    algorithms: ["RS256"],
  });

  const uid = payload.sub;
  if (!uid) {
    throw new Error("Firebase token missing sub (uid)");
  }

  return {
    uid,
    email: typeof payload.email === "string" ? payload.email : undefined,
    name: typeof payload.name === "string" ? payload.name : undefined,
    picture: typeof payload.picture === "string" ? payload.picture : undefined,
    phone_number: typeof payload.phone_number === "string" ? payload.phone_number : undefined,
    firebase: (payload as any).firebase ?? { sign_in_provider: "unknown" },
  };
}
