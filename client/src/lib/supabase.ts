import { createClient } from '@supabase/supabase-js'

const FALLBACK_SUPABASE_URL = 'https://athlynx-supabase-missing.invalid'
const FALLBACK_SUPABASE_ANON_KEY = 'athlynx-supabase-anon-key-missing'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

function getSafeLocalStorage() {
  if (typeof window === 'undefined') return undefined

  try {
    const testKey = '__athlynx_supabase_storage_test__'
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    return window.localStorage
  } catch (error) {
    console.warn('[Supabase] localStorage unavailable; auth persistence disabled for this session.', error)
    return undefined
  }
}

const storage = getSafeLocalStorage()

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY; using non-production fallback to avoid startup crash.', {
    hasUrl: Boolean(supabaseUrl),
    hasAnonKey: Boolean(supabaseAnonKey),
  })
}

export const supabase = createClient(
  supabaseUrl || FALLBACK_SUPABASE_URL,
  supabaseAnonKey || FALLBACK_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: Boolean(storage),
      autoRefreshToken: Boolean(storage),
      storage,
    },
  },
)
