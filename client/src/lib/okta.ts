/**
 * AthlynXAI — Auth0 OIDC Client
 * Domain:    dev-8yqdmei0v8kc3qqy.us.auth0.com
 * Client ID: eDJT34flTy4oOq1cie6ItFubLDPHOrcI (Athlynx-FrontEnd-Single-Page)
 *
 * Uses ID token (not access token) — no API audience registration required.
 */
import { createAuth0Client, Auth0Client, User } from "@auth0/auth0-spa-js";

const AUTH0_DOMAIN =
  (import.meta.env.VITE_AUTH0_DOMAIN as string | undefined) ||
  "dev-8yqdmei0v8kc3qqy.us.auth0.com";

const AUTH0_CLIENT_ID =
  (import.meta.env.VITE_AUTH0_CLIENT_ID as string | undefined) ||
  "eDJT34flTy4oOq1cie6ItFubLDPHOrcI";

const AUTH0_REDIRECT_URI =
  typeof window !== "undefined"
    ? `${window.location.origin}/callback`
    : "https://athlynx.ai/callback";

// ─── Singleton client ──────────────────────────────────────────────────────
let _client: Auth0Client | null = null;

export async function getAuth0Client(): Promise<Auth0Client> {
  if (_client) return _client;
  _client = await createAuth0Client({
    domain: AUTH0_DOMAIN,
    clientId: AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: AUTH0_REDIRECT_URI,
      scope: "openid profile email",
    },
    cacheLocation: "localstorage",
  });
  return _client;
}

// ─── Shared types ──────────────────────────────────────────────────────────
export type FirebaseUser = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
};

export const isFirebaseConfigured = true;

// ─── Extract ID token from cache ──────────────────────────────────────────
async function getIdToken(client: Auth0Client): Promise<string> {
  // getIdTokenClaims returns the raw ID token claims including __raw (the JWT)
  const claims = await client.getIdTokenClaims();
  if (!claims || !claims.__raw) {
    throw new Error("No ID token available");
  }
  return claims.__raw;
}

// ─── Sign-in methods ──────────────────────────────────────────────────────
export async function signInWithGoogle(): Promise<{ idToken: string; user: FirebaseUser }> {
  const client = await getAuth0Client();
  await client.loginWithRedirect({
    authorizationParams: { connection: "google-oauth2", redirect_uri: AUTH0_REDIRECT_URI },
  });
  return { idToken: "", user: { uid: "", displayName: null, email: null, photoURL: null } };
}

export async function signInWithApple(): Promise<{ idToken: string; user: FirebaseUser }> {
  const client = await getAuth0Client();
  await client.loginWithRedirect({
    authorizationParams: { connection: "apple", redirect_uri: AUTH0_REDIRECT_URI },
  });
  return { idToken: "", user: { uid: "", displayName: null, email: null, photoURL: null } };
}

export async function signInWithFacebook(): Promise<{ idToken: string; user: FirebaseUser }> {
  const client = await getAuth0Client();
  await client.loginWithRedirect({
    authorizationParams: { connection: "facebook", redirect_uri: AUTH0_REDIRECT_URI },
  });
  return { idToken: "", user: { uid: "", displayName: null, email: null, photoURL: null } };
}

export async function signInWithTwitter(): Promise<{ idToken: string; user: FirebaseUser }> {
  const client = await getAuth0Client();
  await client.loginWithRedirect({
    authorizationParams: { connection: "twitter", redirect_uri: AUTH0_REDIRECT_URI },
  });
  return { idToken: "", user: { uid: "", displayName: null, email: null, photoURL: null } };
}

export async function loginWithRedirect(): Promise<void> {
  const client = await getAuth0Client();
  await client.loginWithRedirect({
    authorizationParams: { redirect_uri: AUTH0_REDIRECT_URI },
  });
}

// ─── Callback handler ─────────────────────────────────────────────────────
export async function handleRedirectResult(): Promise<{ idToken: string; user: FirebaseUser } | null> {
  const client = await getAuth0Client();
  try {
    await client.handleRedirectCallback();
  } catch (e) {
    console.error("[okta] handleRedirectCallback failed:", e);
    return null;
  }
  const auth0User: User | undefined = await client.getUser();
  if (!auth0User) return null;

  let idToken: string;
  try {
    idToken = await getIdToken(client);
  } catch (e) {
    console.error("[okta] getIdToken failed:", e);
    return null;
  }

  return {
    idToken,
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

// ─── Email sign-in ────────────────────────────────────────────────────────
export async function signInWithEmailAndPassword(
  _auth: unknown, email: string, _password: string
): Promise<{ idToken: string; user: FirebaseUser }> {
  const client = await getAuth0Client();
  await client.loginWithRedirect({
    authorizationParams: { redirect_uri: AUTH0_REDIRECT_URI, login_hint: email },
  });
  return { idToken: "", user: { uid: "", displayName: null, email: null, photoURL: null } };
}

export async function createUserWithEmailAndPassword(
  _auth: unknown, email: string, _password: string
): Promise<{ idToken: string; user: FirebaseUser }> {
  const client = await getAuth0Client();
  await client.loginWithRedirect({
    authorizationParams: { redirect_uri: AUTH0_REDIRECT_URI, login_hint: email, screen_hint: "signup" },
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
      if (!isAuthenticated) { callback(null); return; }
      const u = await client.getUser();
      if (cancelled) return;
      callback(u ? { uid: u.sub ?? "", displayName: u.name ?? u.nickname ?? null, email: u.email ?? null, photoURL: u.picture ?? null } : null);
    } catch {
      if (!cancelled) callback(null);
    }
  })();
  return () => { cancelled = true; };
}

export const auth = { currentUser: null as FirebaseUser | null };
