/**
 * AthlynXAI Mobile — Auth (Auth0/Okta PKCE only)
 *
 * Auth system: Auth0/Okta PKCE ONLY — no Firebase, no Supabase auth.
 *
 * Mobile auth flow:
 *   1. Email/password → POST /api/trpc/auth.login or auth.register
 *   2. Social login → Auth0 Universal Login via expo-auth-session (PKCE)
 *   3. Session stored as signed JWT cookie / SecureStore token
 *
 * The server session is managed by customAuthRouter (server/routers/customAuthRouter.ts).
 * Auth0 Domain: dev-8yqdmei0v8kc3qqy.us.auth0.com
 * Auth0 SPA Client ID: eDJT34flTy4oOq1cie6ItFubLDPHOrcI
 */

import * as SecureStore from "expo-secure-store";

const SESSION_KEY = "athlynx_session_token";
const API_BASE = process.env.EXPO_PUBLIC_API_URL || "https://athlynx.ai";

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
}

// ─── Session storage ──────────────────────────────────────────────────────────

async function storeSession(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(SESSION_KEY, token);
  } catch (err) {
    console.warn("[auth] SecureStore set failed", (err as Error)?.message);
  }
}

async function clearSession(): Promise<void> {
  try { await SecureStore.deleteItemAsync(SESSION_KEY); } catch {}
}

export async function getStoredSession(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(SESSION_KEY);
  } catch {
    return null;
  }
}

// ─── API helpers ──────────────────────────────────────────────────────────────

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
    throw new Error(body.error?.json?.message || body.error?.message || "Request failed");
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
    `${API_BASE}/api/trpc/${procedure}?input=${encodeURIComponent(JSON.stringify({ json: {} }))}`,
    { headers }
  );
  const body = await resp.json();
  if (body?.error) {
    throw new Error(body.error?.json?.message || body.error?.message || "Request failed");
  }
  return body?.result?.data?.json as T;
}

// ─── Auth functions ───────────────────────────────────────────────────────────

/**
 * Email/password login — calls server auth.login tRPC procedure.
 * Returns user and session token.
 */
export async function login(
  email: string,
  password: string
): Promise<{ user: User; sessionId: string }> {
  const result = await trpcMutation<{ user: User; sessionToken?: string }>(
    "auth.login",
    { email, password }
  );
  const token = result?.sessionToken || "";
  if (token) await storeSession(token);
  return { user: result.user, sessionId: token };
}

/**
 * Email/password registration — calls server auth.register tRPC procedure.
 */
export async function register(data: {
  name: string;
  email: string;
  password: string;
  sport?: string;
  school?: string;
}): Promise<{ user: User; sessionId: string }> {
  const result = await trpcMutation<{ user: User; sessionToken?: string }>(
    "auth.register",
    {
      name: data.name,
      email: data.email,
      password: data.password,
      ...(data.sport ? { sport: data.sport } : {}),
      ...(data.school ? { school: data.school } : {}),
    }
  );
  const token = result?.sessionToken || "";
  if (token) await storeSession(token);
  return { user: result.user, sessionId: token };
}

/**
 * Social login via Auth0 ID token (from expo-auth-session PKCE flow).
 * Pass the idToken returned by Auth0 after the PKCE redirect.
 */
export async function loginWithAuth0Token(
  idToken: string,
  profile: { name?: string; email?: string; picture?: string }
): Promise<{ user: User; sessionId: string }> {
  const result = await trpcMutation<{ user: User; sessionToken?: string }>(
    "auth.syncFirebaseUser",
    {
      idToken,
      name: profile.name || "",
      email: profile.email || "",
      picture: profile.picture,
    }
  );
  const token = result?.sessionToken || "";
  if (token) await storeSession(token);
  return { user: result.user, sessionId: token };
}

/**
 * Logout — clears local session.
 */
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
}

/**
 * Get current user from server session.
 * Returns null if not authenticated.
 */
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
