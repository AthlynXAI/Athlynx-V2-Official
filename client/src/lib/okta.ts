/**
 * AthlynXAI — Auth0 OIDC Client (replaces Firebase + Supabase auth)
 *
 * Uses @auth0/auth0-spa-js with PKCE flow.
 * Domain:    dev-8yqdmei0v8kc3qqy.us.auth0.com
 * Client ID: configured via VITE_AUTH0_CLIENT_ID
 * Audience:  https://api.athlynx.ai/
 *
 * Exports the same surface that pages imported from the old firebase.ts
 * so no page-level import changes are needed beyond switching the import path.
 */
import { createAuth0Client, Auth0Client, User } from "@auth0/auth0-spa-js";

const AUTH0_DOMAIN =
  (import.meta.env.VITE_AUTH0_DOMAIN as string | undefined) ||
  "dev-8yqdmei0v8kc3qqy.us.auth0.com";

const AUTH0_CLIENT_ID =
  (import.meta.env.VITE_AUTH0_CLIENT_ID as string | undefined) ||
  "eDJT34flTy4oOq1cie6ItFubLDPHOrcI";

const AUTH0_AUDIENCE =
  (import.meta.env.VITE_AUTH0_AUDIENCE as string | undefined) ||
  "https://api.athlynx.ai/";

const AUTH0_REDIRECT_URI =
  typeof window !== "undefined"
    ? `${window.location.origin}/auth/callback`
    : "https://athlynx.ai/auth/callback";

// ─── Singleton client ──────────────────────────────────────────────────────

let _client: Auth0Client | null = null;

export async function getAuth0Client(): Promise<Auth0Client> {
  if (_client) return _client;
  _client = await createAuth0Client({
    domain: AUTH0_DOMAIN,
    clientId: AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: AUTH0_REDIRECT_URI,
      audience: AUTH0_AUDIENCE,
      scope: "openid profile email offline_access",
    },
    cacheLocation: "localstorage",
    useRefreshTokens: true,
  });
  return _client;
}

// ─── Shared types (compatible with old firebase.ts surface) ───────────────

export type FirebaseUser = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
};

export const isFirebaseConfigured = true; // Auth0 is always configured

// ─── Sign-in helpers ──────────────────────────────────────────────────────

/**
 * Redirect to Auth0 Universal Login.
 * Returns a dummy AuthResult — the real result comes back in AuthCallback.
 */
export async function signInWithGoogle(): Promise<{
  idToken: string;
  user: FirebaseUser;
}> {
  const client = await getAuth0Client();
  await client.loginWithRedirect({
    authorizationParams: {
      connection: "google-oauth2",
      redirect_uri: AUTH0_REDIRECT_URI,
    },
  });
  return { idToken: "", user: { uid: "", displayName: null, email: null, photoURL: null } };
}

export async function signInWithApple(): Promise<{
  idToken: string;
  user: FirebaseUser;
}> {
  const client = await getAuth0Client();
  await client.loginWithRedirect({
    authorizationParams: {
      connection: "apple",
      redirect_uri: AUTH0_REDIRECT_URI,
    },
  });
  return { idToken: "", user: { uid: "", displayName: null, email: null, photoURL: null } };
}

export async function signInWithFacebook(): Promise<{
  idToken: string;
  user: FirebaseUser;
}> {
  const client = await getAuth0Client();
  await client.loginWithRedirect({
    authorizationParams: {
      connection: "facebook",
      redirect_uri: AUTH0_REDIRECT_URI,
    },
  });
  return { idToken: "", user: { uid: "", displayName: null, email: null, photoURL: null } };
}

export async function signInWithTwitter(): Promise<{
  idToken: string;
  user: FirebaseUser;
}> {
  const client = await getAuth0Client();
  await client.loginWithRedirect({
    authorizationParams: {
      connection: "twitter",
      redirect_uri: AUTH0_REDIRECT_URI,
    },
  });
  return { idToken: "", user: { uid: "", displayName: null, email: null, photoURL: null } };
}

/**
 * Generic redirect to Auth0 Universal Login (no connection hint).
 * Used when user clicks "Sign In" without a specific provider.
 */
export async function loginWithRedirect(): Promise<void> {
  const client = await getAuth0Client();
  await client.loginWithRedirect({
    authorizationParams: { redirect_uri: AUTH0_REDIRECT_URI },
  });
}

// ─── Callback handler ─────────────────────────────────────────────────────

/**
 * Called at /auth/callback to exchange the Auth0 code for tokens.
 * Returns idToken (access_token) + FirebaseUser-compatible shape.
 */
export async function handleRedirectResult(): Promise<{
  idToken: string;
  user: FirebaseUser;
} | null> {
  const client = await getAuth0Client();
  try {
    await client.handleRedirectCallback();
  } catch {
    return null;
  }
  const auth0User: User | undefined = await client.getUser();
  if (!auth0User) return null;

  const accessToken = await client.getTokenSilently({
    authorizationParams: { audience: AUTH0_AUDIENCE },
  });

  return {
    idToken: accessToken,
    user: {
      uid: auth0User.sub ?? "",
      displayName: auth0User.name ?? auth0User.nickname ?? null,
      email: auth0User.email ?? null,
      photoURL: auth0User.picture ?? null,
    },
  };
}

// ─── Sign-out ─────────────────────────────────────────────────────────────

export async function firebaseSignOut(): Promise<void> {
  const client = await getAuth0Client();
  await client.logout({
    logoutParams: { returnTo: typeof window !== "undefined" ? window.location.origin : "https://athlynx.ai" },
  });
}

// ─── Email / password (Auth0 Database connection) ─────────────────────────

export async function signInWithEmailAndPassword(
  _auth: unknown,
  email: string,
  _password: string
): Promise<{ idToken: string; user: FirebaseUser }> {
  // Auth0 SPA uses Universal Login for email/password — redirect flow
  const client = await getAuth0Client();
  await client.loginWithRedirect({
    authorizationParams: {
      redirect_uri: AUTH0_REDIRECT_URI,
      login_hint: email,
    },
  });
  return { idToken: "", user: { uid: "", displayName: null, email: null, photoURL: null } };
}

export async function createUserWithEmailAndPassword(
  _auth: unknown,
  email: string,
  _password: string
): Promise<{ idToken: string; user: FirebaseUser }> {
  const client = await getAuth0Client();
  await client.loginWithRedirect({
    authorizationParams: {
      redirect_uri: AUTH0_REDIRECT_URI,
      login_hint: email,
      screen_hint: "signup",
    },
  });
  return { idToken: "", user: { uid: "", displayName: null, email: null, photoURL: null } };
}

// ─── Auth state listener ──────────────────────────────────────────────────

export function onAuthStateChanged(
  _auth: unknown,
  callback: (user: FirebaseUser | null) => void
): () => void {
  let cancelled = false;
  (async () => {
    try {
      const client = await getAuth0Client();
      const isAuthenticated = await client.isAuthenticated();
      if (cancelled) return;
      if (!isAuthenticated) {
        callback(null);
        return;
      }
      const u = await client.getUser();
      if (cancelled) return;
      callback(
        u
          ? {
              uid: u.sub ?? "",
              displayName: u.name ?? u.nickname ?? null,
              email: u.email ?? null,
              photoURL: u.picture ?? null,
            }
          : null
      );
    } catch {
      if (!cancelled) callback(null);
    }
  })();
  return () => {
    cancelled = true;
  };
}

// ─── auth export (pages that reference `auth` directly) ──────────────────
export const auth = {
  currentUser: null as FirebaseUser | null,
};
