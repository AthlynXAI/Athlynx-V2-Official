/**
 * AthlynXAI — Auth0 / Okta PKCE Implementation
 *
 * Auth provider: Auth0 (Okta) — PKCE flow, no SDK redirect wrapper.
 * All authentication is handled exclusively here. No Firebase. No Supabase auth.
 *
 * Domain:    dev-8yqdmei0v8kc3qqy.us.auth0.com
 * Client ID: eDJT34flTy4oOq1cie6ItFubLDPHOrcI
 */

const AUTH0_DOMAIN =
  (import.meta.env.VITE_AUTH0_DOMAIN as string | undefined) ||
  "dev-8yqdmei0v8kc3qqy.us.auth0.com";

const AUTH0_CLIENT_ID =
  (import.meta.env.VITE_AUTH0_CLIENT_ID as string | undefined) ||
  "eDJT34flTy4oOq1cie6ItFubLDPHOrcI";

const AUTH0_REDIRECT_URI =
  typeof window !== "undefined"
    ? `${window.location.origin}/auth/callback`
    : "https://athlynx.ai/auth/callback";

const STORAGE_KEY_VERIFIER = "auth0_pkce_verifier";
const STORAGE_KEY_STATE    = "auth0_pkce_state";

// ─── PKCE helpers ──────────────────────────────────────────────────────────

function base64urlEncode(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

async function generateCodeVerifier(): Promise<string> {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64urlEncode(array.buffer);
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64urlEncode(digest);
}

function generateState(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return base64urlEncode(array.buffer);
}

// ─── Core redirect ─────────────────────────────────────────────────────────

async function redirectToAuth0(params: {
  connection?: string;
  loginHint?: string;
  screenHint?: string;
}): Promise<void> {
  const verifier = await generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  const state = generateState();

  // Store in sessionStorage — survives page reload, cleared on tab close
  sessionStorage.setItem(STORAGE_KEY_VERIFIER, verifier);
  sessionStorage.setItem(STORAGE_KEY_STATE, state);

  const url = new URL(`https://${AUTH0_DOMAIN}/authorize`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", AUTH0_CLIENT_ID);
  url.searchParams.set("redirect_uri", AUTH0_REDIRECT_URI);
  url.searchParams.set("scope", "openid profile email");
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("state", state);

  if (params.connection) url.searchParams.set("connection", params.connection);
  if (params.loginHint)  url.searchParams.set("login_hint", params.loginHint);
  if (params.screenHint) url.searchParams.set("screen_hint", params.screenHint);

  window.location.href = url.toString();
}

// ─── Shared types ──────────────────────────────────────────────────────────

export type AthlynXUser = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
};

/** @deprecated Use AthlynXUser — kept for any remaining legacy references during migration */
export type FirebaseUser = AthlynXUser;

export const isAuthConfigured = true;

// ─── Sign-in methods ──────────────────────────────────────────────────────

export async function signInWithGoogle(): Promise<{ idToken: string; user: AthlynXUser }> {
  await redirectToAuth0({ connection: "google-oauth2" });
  return { idToken: "", user: { uid: "", displayName: null, email: null, photoURL: null } };
}

export async function signInWithApple(): Promise<{ idToken: string; user: AthlynXUser }> {
  await redirectToAuth0({ connection: "apple" });
  return { idToken: "", user: { uid: "", displayName: null, email: null, photoURL: null } };
}

export async function signInWithFacebook(): Promise<{ idToken: string; user: AthlynXUser }> {
  await redirectToAuth0({ connection: "facebook" });
  return { idToken: "", user: { uid: "", displayName: null, email: null, photoURL: null } };
}

export async function signInWithTwitter(): Promise<{ idToken: string; user: AthlynXUser }> {
  await redirectToAuth0({ connection: "twitter" });
  return { idToken: "", user: { uid: "", displayName: null, email: null, photoURL: null } };
}

export async function loginWithRedirect(): Promise<void> {
  await redirectToAuth0({});
}

export async function signInWithEmailAndPassword(
  _auth: unknown, email: string, _password: string
): Promise<{ idToken: string; user: AthlynXUser }> {
  await redirectToAuth0({ loginHint: email });
  return { idToken: "", user: { uid: "", displayName: null, email: null, photoURL: null } };
}

export async function createUserWithEmailAndPassword(
  _auth: unknown, email: string, _password: string
): Promise<{ idToken: string; user: AthlynXUser }> {
  await redirectToAuth0({ loginHint: email, screenHint: "signup" });
  return { idToken: "", user: { uid: "", displayName: null, email: null, photoURL: null } };
}

// ─── Callback handler ─────────────────────────────────────────────────────

export async function handleRedirectResult(): Promise<{ idToken: string; user: AthlynXUser } | null> {
  const params = new URLSearchParams(window.location.search);
  const code  = params.get("code");
  const state = params.get("state");
  const error = params.get("error");

  if (error) {
    console.error("[okta] Auth0 error:", error, params.get("error_description"));
    return null;
  }

  if (!code) {
    console.error("[okta] No code in callback URL");
    return null;
  }

  const verifier      = sessionStorage.getItem(STORAGE_KEY_VERIFIER);
  const savedState    = sessionStorage.getItem(STORAGE_KEY_STATE);

  if (!verifier) {
    console.error("[okta] No PKCE verifier in sessionStorage");
    return null;
  }

  if (savedState && state !== savedState) {
    console.error("[okta] State mismatch — possible CSRF");
    return null;
  }

  // Clean up storage
  sessionStorage.removeItem(STORAGE_KEY_VERIFIER);
  sessionStorage.removeItem(STORAGE_KEY_STATE);

  // Exchange code for tokens
  const tokenResp = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type:    "authorization_code",
      client_id:     AUTH0_CLIENT_ID,
      code,
      redirect_uri:  AUTH0_REDIRECT_URI,
      code_verifier: verifier,
    }),
  });

  if (!tokenResp.ok) {
    const err = await tokenResp.text();
    console.error("[okta] Token exchange failed:", err);
    return null;
  }

  const tokens = await tokenResp.json();
  const idToken: string = tokens.id_token;

  if (!idToken) {
    console.error("[okta] No id_token in token response");
    return null;
  }

  // Decode ID token payload (server verifies signature via JWKS)
  let payload: any = {};
  try {
    payload = JSON.parse(atob(idToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch (e) {
    console.error("[okta] Failed to decode ID token:", e);
  }

  return {
    idToken,
    user: {
      uid:         payload.sub ?? "",
      displayName: payload.name ?? payload.nickname ?? null,
      email:       payload.email ?? null,
      photoURL:    payload.picture ?? null,
    },
  };
}

// ─── Sign-out ─────────────────────────────────────────────────────────────

export async function signOut(): Promise<void> {
  const returnTo = typeof window !== "undefined" ? window.location.origin : "https://athlynx.ai";
  window.location.href = `https://${AUTH0_DOMAIN}/v2/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent(returnTo)}`;
}

/** @deprecated Use signOut() */
export const firebaseSignOut = signOut;

// ─── Auth state listener ──────────────────────────────────────────────────

export function onAuthStateChanged(
  _auth: unknown,
  callback: (user: AthlynXUser | null) => void
): () => void {
  // No persistent session in PKCE flow — always unauthenticated on fresh load
  callback(null);
  return () => {};
}

export const auth = { currentUser: null as AthlynXUser | null };
