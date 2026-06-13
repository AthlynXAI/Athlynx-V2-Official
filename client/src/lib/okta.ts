/**
 * okta.ts — Auth0 SPA SDK wrapper for AthlynX
 *
 * Uses @auth0/auth0-spa-js which handles iOS Safari ITP automatically.
 * The SDK stores PKCE verifier in memory (not localStorage/sessionStorage),
 * so it survives cross-origin redirects on iOS Safari with ITP enabled.
 *
 * Domain:    dev-8yqdmei0v8kc3qqy.us.auth0.com
 * Client ID: eDJT34flTy4oOq1cie6ItFubLDPHOrcI
 */
import { createAuth0Client, Auth0Client } from "@auth0/auth0-spa-js";

const AUTH0_DOMAIN    = "dev-8yqdmei0v8kc3qqy.us.auth0.com";
const AUTH0_CLIENT_ID = "eDJT34flTy4oOq1cie6ItFubLDPHOrcI";
const AUTH0_REDIRECT_URI =
  typeof window !== "undefined"
    ? `${window.location.origin}/auth/callback`
    : "https://athlynx.ai/auth/callback";

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
    useRefreshTokens: true,
    cacheLocation:    "localstorage",
  });
  return _client;
}

// ─── Core login helper ────────────────────────────────────────────────────
async function loginWith(params: {
  connection?: string;
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
export async function signInWithGoogle(): Promise<{ idToken: string; user: AthlynXUser }> {
  await loginWith({ connection: "google-oauth2" });
  return { idToken: "", user: { uid: "", displayName: null, email: null, photoURL: null } };
}

export async function signInWithApple(): Promise<{ idToken: string; user: AthlynXUser }> {
  await loginWith({ connection: "apple" });
  return { idToken: "", user: { uid: "", displayName: null, email: null, photoURL: null } };
}

export async function signInWithFacebook(): Promise<{ idToken: string; user: AthlynXUser }> {
  await loginWith({ connection: "facebook" });
  return { idToken: "", user: { uid: "", displayName: null, email: null, photoURL: null } };
}

export async function signInWithTwitter(): Promise<{ idToken: string; user: AthlynXUser }> {
  await loginWith({ connection: "twitter" });
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
