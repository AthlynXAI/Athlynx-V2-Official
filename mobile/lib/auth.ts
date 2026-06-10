import * as SecureStore from "expo-secure-store";
import { isSupabaseConfigured, supabase } from "./supabase";

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

const SUPABASE_SESSION_KEY = "supabase_session";

function mapSupabaseUser(authUser: any): User {
  const metadata = authUser?.user_metadata ?? {};
  return {
    id: authUser?.id ?? authUser?.email ?? "athlete",
    name: metadata.name || metadata.full_name || authUser?.email?.split("@")[0] || "Athlete",
    email: authUser?.email || "",
    avatarUrl: metadata.avatar_url,
    role: metadata.role || "athlete",
    sport: metadata.sport,
    school: metadata.school,
    credits: metadata.credits,
    subscriptionTier: metadata.subscription_tier,
  };
}

async function storeSupabaseSession(session: any): Promise<void> {
  try {
    if (session) {
      await SecureStore.setItemAsync(SUPABASE_SESSION_KEY, JSON.stringify(session));
      if (session.access_token) {
        await SecureStore.setItemAsync("session_id", session.access_token);
      }
    }
  } catch (err) {
    try { console.warn("[auth] SecureStore set failed", (err as Error)?.message); } catch {}
  }
}

async function clearStoredSessions(): Promise<void> {
  try { await SecureStore.deleteItemAsync(SUPABASE_SESSION_KEY); } catch {}
  try { await SecureStore.deleteItemAsync("session_id"); } catch {}
}

async function restoreSupabaseSession(): Promise<void> {
  try {
    const raw = await SecureStore.getItemAsync(SUPABASE_SESSION_KEY);
    if (!raw) return;
    const session = JSON.parse(raw);
    if (session?.access_token && session?.refresh_token) {
      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });
    }
  } catch (err) {
    try { console.warn("[auth] Supabase session restore failed", (err as Error)?.message); } catch {}
  }
}

function assertSupabaseConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase production auth is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY before building.");
  }
}

export async function login(email: string, password: string): Promise<{ user: User; sessionId: string }> {
  assertSupabaseConfigured();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message || "Login failed");
  if (!data.user) throw new Error("Login failed: no user returned");
  await storeSupabaseSession(data.session);
  return { user: mapSupabaseUser(data.user), sessionId: data.session?.access_token || "" };
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
  sport?: string;
  school?: string;
}): Promise<{ user: User; sessionId: string }> {
  assertSupabaseConfigured();
  const { data: result, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
        sport: data.sport,
        school: data.school,
        role: "athlete",
      },
    },
  });
  if (error) throw new Error(error.message || "Registration failed");
  if (!result.user) throw new Error("Registration failed: no user returned");
  await storeSupabaseSession(result.session);
  return { user: mapSupabaseUser(result.user), sessionId: result.session?.access_token || "" };
}

export async function logout(): Promise<void> {
  try { await supabase.auth.signOut(); } catch {}
  await clearStoredSessions();
}

export async function getMe(): Promise<User | null> {
  if (!isSupabaseConfigured) return null;
  await restoreSupabaseSession();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return mapSupabaseUser(data.user);
}
