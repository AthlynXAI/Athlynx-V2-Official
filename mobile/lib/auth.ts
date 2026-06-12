/**
 * AthlynXAI Mobile — Auth (Auth0/Okta PKCE ONLY)
 *
 * ONE auth system. Auth0 PKCE via expo-auth-session.
 * NO email/password. NO Supabase auth. NO Firebase.
 *
 * Auth0 Domain: dev-8yqdmei0v8kc3qqy.us.auth0.com
 * Auth0 SPA Client ID: eDJT34flTy4oOq1cie6ItFubLDPHOrcI
 */

import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";

WebBrowser.maybeCompleteAuthSession();

// ─── Auth0 Config ─────────────────────────────────────────────────────────────

const AUTH0_DOMAIN = "dev-8yqdmei0v8kc3qqy.us.auth0.com";
const AUTH0_CLIENT_ID = "eDJT34flTy4oOq1cie6ItFubLDPHOrcI";
const REDIRECT_URI = AuthSession.makeRedirectUri({ scheme: "athlynxai" });
const API_BASE = process.env.EXPO_PUBLIC_API_URL || "https://athlynx.ai";
const SESSION_KEY = "athlynx_session_token";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: number | string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
  sport?: string;
  school?: string;
  credits?: number;
  subscriptionTier?: string;
  picture?: string;
}

// ─── Session Storage ──────────────────────────────────────────────────────────

async function storeSession(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(SESSION_KEY, token);
  } catch (err) {
    console.warn("[auth] SecureStore set failed", (err as Error)?.message);
  }
}

async function clearSession(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  } catch {}
}

export async function getStoredSession(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(SESSION_KEY);
  } catch {
    return null;
  }
}

// ─── API Helpers ──────────────────────────────────────────────────────────────

async function trpcMutation<T>(
  procedure: string,
  input: Record<string, unknown>,
  sessionToken?: string | null
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (sessionToken) headers["Cookie"] = `app_session_id=${sessionToken}`;

  const resp = await fetch(`${API_BASE}/api/trpc/${procedure}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ json: input }),
  });

  const body = await resp.json();
  if (body?.error) {
    throw new Error(
      body.error?.json?.message || body.error?.message || "Request failed"
    );
  }
  return body?.result?.data?.json as T;
}

async function trpcQuery<T>(
  procedure: string,
  sessionToken?: string | null
): Promise<T> {
  const headers: Record<string, string> = {};
  if (sessionToken) headers["Cookie"] = `app_session_id=${sessionToken}`;

  const resp = await fetch(
    `${API_BASE}/api/trpc/${procedure}?input=${encodeURIComponent(
      JSON.stringify({ json: {} })
    )}`,
    { headers }
  );
  const body = await resp.json();
  if (body?.error) {
    throw new Error(
      body.error?.json?.message || body.error?.message || "Request failed"
    );
  }
  return body?.result?.data?.json as T;
}

// ─── Auth0 PKCE Login (THE ONLY LOGIN METHOD) ─────────────────────────────────

/**
 * Opens Auth0 Universal Login in an in-app browser.
 * Handles the PKCE code exchange and syncs the user with the AthlynX backend.
 * Returns the user and session token on success.
 */
export async function loginWithAuth0(): Promise<{ user: User; sessionId: string }> {
  const discovery = await AuthSession.fetchDiscoveryAsync(
    `https://${AUTH0_DOMAIN}`
  );

  const request = new AuthSession.AuthRequest({
    clientId: AUTH0_CLIENT_ID,
    redirectUri: REDIRECT_URI,
    responseType: AuthSession.ResponseType.Code,
    scopes: ["openid", "profile", "email", "offline_access"],
    usePKCE: true,
  });

  const result = await request.promptAsync(discovery);

  if (result.type === "cancel") {
    throw new Error("Login cancelled");
  }
  if (result.type !== "success") {
    throw new Error("Login failed. Please try again.");
  }

  // Exchange authorization code for tokens
  // expo-auth-session v6: codeVerifier is passed via extraParams as code_verifier
  const tokenResult = await AuthSession.exchangeCodeAsync(
    {
      clientId: AUTH0_CLIENT_ID,
      redirectUri: REDIRECT_URI,
      code: result.params.code,
      extraParams: request.codeVerifier
        ? { code_verifier: request.codeVerifier }
        : undefined,
    },
    discovery
  );

  const { accessToken, idToken } = tokenResult;
  if (!accessToken) throw new Error("Authentication failed — no access token");

  // Fetch user profile from Auth0
  const userInfoResp = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const userInfo = await userInfoResp.json();

  // Sync with AthlynX backend to create/update user record
  let user: User;
  let sessionId = "";

  try {
    const syncResult = await trpcMutation<{ user: User; sessionToken?: string }>(
      "auth.syncUser",
      {
        idToken: idToken || accessToken,
        name: userInfo.name || userInfo.nickname || "",
        email: userInfo.email || "",
        picture: userInfo.picture,
      }
    );
    user = syncResult.user;
    sessionId = syncResult.sessionToken || "";
  } catch {
    // Fallback: construct user from Auth0 profile if backend is unreachable
    user = {
      id: userInfo.sub,
      name: userInfo.name || userInfo.nickname || "",
      email: userInfo.email || "",
      picture: userInfo.picture,
    };
  }

  if (sessionId) await storeSession(sessionId);
  return { user, sessionId };
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  const token = await getStoredSession();
  if (token) {
    try {
      await trpcMutation("auth.logout", {}, token);
    } catch {
      // Best-effort — clear local session regardless
    }
  }
  await clearSession();
  // Clear Auth0 session in browser
  try {
    const logoutUrl = `https://${AUTH0_DOMAIN}/v2/logout?client_id=${AUTH0_CLIENT_ID}`;
    await WebBrowser.openBrowserAsync(logoutUrl);
  } catch {}
}

// ─── Get Current User ─────────────────────────────────────────────────────────

export async function getMe(): Promise<User | null> {
  const token = await getStoredSession();
  if (!token) return null;
  try {
    const user = await trpcQuery<User>("auth.me", token);
    return user ?? null;
  } catch {
    return null;
  }
}

// ─── DISABLED: Email/Password ─────────────────────────────────────────────────
// These are intentionally disabled. Auth0 PKCE is the ONLY login method.

export async function login(
  _email: string,
  _password: string
): Promise<never> {
  throw new Error(
    "Email/password login is disabled. Use loginWithAuth0() instead."
  );
}

export async function register(_data: {
  name: string;
  email: string;
  password: string;
  sport?: string;
  school?: string;
}): Promise<never> {
  throw new Error(
    "Email/password registration is disabled. Use loginWithAuth0() instead."
  );
}

// Legacy alias kept for compatibility
export const loginWithAuth0Token = loginWithAuth0;
