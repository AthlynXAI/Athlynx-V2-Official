/**
 * AthlynXAI — Supabase Client (Storage + Realtime ONLY)
 *
 * Auth is handled exclusively by Auth0/Okta PKCE via okta.ts.
 * Supabase auth is FULLY DISABLED — no sessions, no tokens, no localStorage.
 * This client is used only for: file storage uploads and realtime channels.
 */
import { createClient } from '@supabase/supabase-js'

const FALLBACK_SUPABASE_URL = 'https://athlynx-supabase-missing.invalid'
const FALLBACK_SUPABASE_ANON_KEY = 'athlynx-supabase-anon-key-missing'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY; storage/realtime features will be unavailable.')
}

export const supabase = createClient(
  supabaseUrl || FALLBACK_SUPABASE_URL,
  supabaseAnonKey || FALLBACK_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storage: undefined,
    },
  },
)
