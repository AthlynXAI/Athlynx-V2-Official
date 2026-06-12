/**
 * AthlynXAI Mobile — Supabase Client (DEPRECATED for auth)
 *
 * ⚠️  Auth system: Auth0/Okta PKCE ONLY — Supabase auth is disabled.
 * This file is kept as a stub to avoid breaking any import that may reference it.
 * Authentication is handled by mobile/lib/auth.ts via the AthlynX server session API.
 * Auth0 Domain: dev-8yqdmei0v8kc3qqy.us.auth0.com
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Auth0/Okta PKCE only — Supabase auth is disabled
export const isSupabaseConfigured = false;

// Supabase auth disabled — using Auth0/Okta PKCE

// Use a syntactically valid placeholder so release builds do not crash during
// module import if EAS public env values are missing. Auth methods check
// isSupabaseConfigured and return a clear error before any real request.
const safeSupabaseUrl = supabaseUrl || "https://placeholder.supabase.co";
const safeSupabaseAnonKey = supabaseAnonKey || "missing-anon-key";

// Stub client — DO NOT use for authentication
export const supabase = createClient(safeSupabaseUrl, safeSupabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
