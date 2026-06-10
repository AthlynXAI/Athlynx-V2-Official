import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.error("[AthlynXAI] Missing Supabase env vars: EXPO_PUBLIC_SUPABASE_URL and/or EXPO_PUBLIC_SUPABASE_ANON_KEY");
}

// Use a syntactically valid placeholder so release builds do not crash during
// module import if EAS public env values are missing. Auth methods check
// isSupabaseConfigured and return a clear error before any real request.
const safeSupabaseUrl = supabaseUrl || "https://placeholder.supabase.co";
const safeSupabaseAnonKey = supabaseAnonKey || "missing-anon-key";

export const supabase = createClient(safeSupabaseUrl, safeSupabaseAnonKey);
