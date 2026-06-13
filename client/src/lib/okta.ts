/**
 * okta.ts — Auth0 SPA SDK wrapper for AthlynX
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
 * Uses @auth0/auth0-spa-js which handles iOS Safari ITP automatically.
 * The SDK stores PKCE verifier in memory (not localStorage/sessionStorage),
 * so it survives cross-origin redirects on iOS Safari with ITP enabled.
 *
 * NOTE: Social connections (google-oauth2, apple, facebook) are NOT passed
 * as the `connection` parameter — instead we use Auth0 Universal Login which
 * shows the social buttons natively. This avoids the "connection is not enabled"
 * error that occurs when a social connection is not explicitly enabled per-app.
 */
import { createAuth0Client, Auth0Client } from "@auth0/auth0-spa-js";

// ⚠️ FROZEN — DO NOT CHANGE THESE VALUES — see header above
const AUTH0_DOMAIN    = (typeof import.meta !== "undefined" && import.meta.env?.VITE_AUTH0_DOMAIN) || "dev-8yqdmei0v8kc3qqy.us.auth0.com";
const AUTH0_CLIENT_ID = (typeof import.meta !== "undefined" && import.meta.env?.VITE_AUTH0_CLIENT_ID) || "eDJT34flTy4oOq1cie6ItFubLDPHOrcI";
const AUTH0_REDIRECT_URI =
  typeof window !== "undefined"
    ? `${window.location.origin}/callback`
    : "https://athlynx.ai/callback";

export type AthlynXUser = {
  uid:         string;
  displayName: string | null;
  email:       string | null;
  photoURL:    string | null;
};

export const isAuthConfigured = true;

// ─── Singleton client ─────────────────────────────────────────────────────
let _client: Auth0Client | null = null;

async function getClient(): Promise<Auth0Client> {
  if (_client) return _client;
  _client = await createAuth0Client({
    domain:   AUTH0_DOMAIN,
    clientId: AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: AUTH0_REDIRECT_URI,
      scope:        "openid profile email",
    },
    useRefreshTokens: false,
    cacheLocation:    "localstorage",
  });
  return _client;
}

// ─── Core login helper ────────────────────────────────────────────────────
// NOTE: We do NOT pass `connection` to avoid "connection is not enabled" errors.
// Auth0 Universal Login handles social provider selection natively.
async function loginWith(params: {
  login_hint?: string;
  screen_hint?: string;
}): Promise<void> {
  const client = await getClient();
  await client.loginWithRedirect({
    authorizationParams: {
      redirect_uri: AUTH0_REDIRECT_URI,
      ...params,
    },
  });
}

// ─── Sign-in methods ──────────────────────────────────────────────────────
// All social sign-ins go through Auth0 Universal Login (no connection param).
// The Universal Login page shows Google, Apple, Facebook buttons natively.
export async function signInWithGoogle(): Promise<{ idToken: string; user: AthlynXUser }> {
  await loginWith({});
  return { idToken: "", user: { uid: "", displayName: null, email: null, photoURL: null } };
}

export async function signInWithApple(): Promise<{ idToken: string; user: AthlynXUser }> {
  await loginWith({});
  return { idToken: "", user: { uid: "", displayName: null, email: null, photoURL: null } };
}

export async function signInWithFacebook(): Promise<{ idToken: string; user: AthlynXUser }> {
  await loginWith({});
  return { idToken: "", user: { uid: "", displayName: null, email: null, photoURL: null } };
}

export async function signInWithTwitter(): Promise<{ idToken: string; user: AthlynXUser }> {
  await loginWith({});
  return { idToken: "", user: { uid: "", displayName: null, email: null, photoURL: null } };
}

export async function loginWithRedirect(): Promise<void> {
  await loginWith({});
}

export async function signInWithEmailAndPassword(
  _auth: unknown, email: string, _password: string
): Promise<{ idToken: string; user: AthlynXUser }> {
  await loginWith({ login_hint: email });
  return { idToken: "", user: { uid: "", displayName: null, email: null, photoURL: null } };
}

export async function createUserWithEmailAndPassword(
  _auth: unknown, email: string, _password: string
): Promise<{ idToken: string; user: AthlynXUser }> {
  await loginWith({ login_hint: email, screen_hint: "signup" });
  return { idToken: "", user: { uid: "", displayName: null, email: null, photoURL: null } };
}

// ─── Callback handler ─────────────────────────────────────────────────────
export async function handleRedirectResult(): Promise<{ idToken: string; user: AthlynXUser } | null> {
  const params = new URLSearchParams(window.location.search);

  if (params.get("error")) {
    console.error("[okta] Auth0 error:", params.get("error"), params.get("error_description"));
    return null;
  }

  if (!params.get("code")) {
    console.error("[okta] No code in callback URL");
    return null;
  }

  try {
    const client = await getClient();
    // The SDK handles PKCE verifier internally — no localStorage needed
    await client.handleRedirectCallback();

    const claims = await client.getIdTokenClaims();
    if (!claims) {
      console.error("[okta] No ID token claims after callback");
      return null;
    }

    return {
      idToken: claims.__raw,
      user: {
        uid:         claims.sub ?? "",
        displayName: (claims["name"] as string) ?? (claims["nickname"] as string) ?? null,
        email:       (claims["email"] as string) ?? null,
        photoURL:    (claims["picture"] as string) ?? null,
      },
    };
  } catch (err) {
    console.error("[okta] handleRedirectCallback failed:", err);
    return null;
  }
}

// ─── Sign-out ─────────────────────────────────────────────────────────────
export async function signOut(): Promise<void> {
  const client = await getClient();
  await client.logout({
    logoutParams: {
      returnTo: typeof window !== "undefined" ? window.location.origin : "https://athlynx.ai",
    },
  });
}

// ─── Auth state listener ──────────────────────────────────────────────────
export function onAuthStateChanged(
  _auth: unknown,
  callback: (user: AthlynXUser | null) => void
): () => void {
  getClient().then(async (client) => {
    try {
      const isAuthenticated = await client.isAuthenticated();
      if (isAuthenticated) {
        const claims = await client.getIdTokenClaims();
        if (claims) {
          callback({
            uid:         claims.sub ?? "",
            displayName: (claims["name"] as string) ?? null,
            email:       (claims["email"] as string) ?? null,
            photoURL:    (claims["picture"] as string) ?? null,
          });
          return;
        }
      }
    } catch (_) {}
    callback(null);
  });
  return () => {};
}

export const auth = { currentUser: null as AthlynXUser | null };
