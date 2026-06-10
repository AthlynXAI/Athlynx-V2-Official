/**
 * AthlynX — Supabase Auth Client
 * Supabase auth.
 * Handles Google OAuth, Apple OAuth, and email/password via Supabase Auth.
 * Project: pgrbkisgwpxgphpqmual.supabase.co
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("[SupabaseAuth] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env vars");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export type SupabaseUser = {
  id: string;
  email?: string;
  name?: string;
  picture?: string;
  provider?: string;
};

/**
 * Sign in with Google OAuth via Supabase.
 * Redirects to Google, then back to /auth/callback.
 */
export async function signInWithGoogle(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
  if (error) throw error;
}

/**
 * Sign in with Apple OAuth via Supabase.
 */
export async function signInWithApple(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "apple",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
}

/**
 * Sign in with Facebook OAuth via Supabase.
 */
export async function signInWithFacebook(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
}

/**
 * Sign in with Twitter/X OAuth via Supabase.
 */
export async function signInWithTwitter(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "twitter",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
}

/**
 * Get the current Supabase session access token.
 * Used to authenticate with the AthlynX backend.
 */
export async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

/**
 * Get current Supabase session user info.
 */
export async function getCurrentUser(): Promise<SupabaseUser | null> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const meta = data.user.user_metadata ?? {};
  return {
    id: data.user.id,
    email: data.user.email,
    name: meta.full_name ?? meta.name ?? "",
    picture: meta.avatar_url ?? meta.picture ?? "",
    provider: data.user.app_metadata?.provider ?? "email",
  };
}

/**
 * Sign out from Supabase.
 */
export async function supabaseSignOut(): Promise<void> {
  await supabase.auth.signOut();
}

// Legacy compatibility — keep these named exports so any remaining
// Legacy compat shim.
export const isFirebaseConfigured = false;
