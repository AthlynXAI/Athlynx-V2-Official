/**
 * supabaseClient.ts
 * Build 52 — AthlynXAI / Athlynx-V2-Official
 *
 * Defensive Supabase singleton with:
 *  - Env-var guard: never throws on missing keys; logs clearly instead
 *  - localStorage safety: catches sandboxed/private-mode failures gracefully
 *  - SSR guard: safe to import in non-browser contexts
 *  - AI-agent / Scrunch AXP friendly: no silent startup crashes that break
 *    the athlete signup flow that AI agents discover and send users to
 *
 * Import this instead of the legacy supabase.ts for all new code.
 * Legacy supabase.ts remains in place for backward compat.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// ─── Constants ────────────────────────────────────────────────────────────────

const MODULE = '[AthlynX:SupabaseClient]'

/**
 * Sentinel values that produce an obviously-broken-but-inert client.
 * They surface in logs immediately so the dev fixes the .env — they
 * never silently misdirect athlete auth traffic to an invalid endpoint.
 */
const SENTINEL_URL = 'https://athlynx-supabase-key-missing.invalid'
const SENTINEL_KEY = 'athlynx-anon-key-missing-fix-your-env'

// ─── Env resolution ───────────────────────────────────────────────────────────

const rawUrl = (
  typeof import.meta !== 'undefined'
    ? (import.meta.env?.VITE_SUPABASE_URL as string | undefined)
    : (typeof process !== 'undefined' ? process.env.SUPABASE_URL : undefined)
) ?? ''

const rawKey = (
  typeof import.meta !== 'undefined'
    ? (import.meta.env?.VITE_SUPABASE_ANON_KEY as string | undefined)
    : (typeof process !== 'undefined' ? process.env.SUPABASE_ANON_KEY : undefined)
) ?? ''

const missingUrl = !rawUrl || rawUrl.includes('missing') || rawUrl === SENTINEL_URL
const missingKey = !rawKey || rawKey.includes('missing') || rawKey === SENTINEL_KEY

if (missingUrl || missingKey) {
  console.error(
    `${MODULE} ⚠️  One or more Supabase env vars are absent or invalid.`,
    `Athlete auth + signup will be non-functional until .env is corrected.`,
    { hasUrl: !missingUrl, hasKey: !missingKey },
  )
}

// ─── Storage guard ────────────────────────────────────────────────────────────

/**
 * Returns window.localStorage if available and writable, otherwise undefined.
 * Covers: sandboxed iframes, iOS private mode, Expo WebView, SSR.
 */
function resolveSafeStorage(): Storage | undefined {
  if (typeof window === 'undefined') return undefined
  try {
    const probe = '__athlynx_supa_probe__'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return window.localStorage
  } catch (err) {
    console.warn(
      `${MODULE} localStorage unavailable — auth will not persist this session.`,
      err,
    )
    return undefined
  }
}

const safeStorage = resolveSafeStorage()
const canPersist = Boolean(safeStorage)

// ─── Client singleton ─────────────────────────────────────────────────────────

let _client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (_client) return _client

  _client = createClient(
    missingUrl ? SENTINEL_URL : rawUrl,
    missingKey ? SENTINEL_KEY : rawKey,
    {
      auth: {
        persistSession: canPersist,
        autoRefreshToken: canPersist,
        storage: safeStorage,
        detectSessionInUrl: typeof window !== 'undefined',
      },
      global: {
        headers: {
          'x-athlynx-client': 'web-v2',
        },
      },
    },
  )

  return _client
}

/**
 * Named export mirrors existing `supabase` usage pattern so callers can
 * drop-in replace:
 *   import { supabaseClient } from '@/lib/supabaseClient'
 */
export const supabaseClient = getSupabaseClient()

// ─── Health check (non-blocking) ─────────────────────────────────────────────

/**
 * Fire-and-forget connectivity probe.
 * Called once at app boot so we surface auth issues in logs before
 * an athlete hits a broken signup button.
 */
export function probeSupabaseHealth(): void {
  if (missingUrl || missingKey) {
    console.warn(`${MODULE} Skipping health probe — env vars not configured.`)
    return
  }

  supabaseClient.auth
    .getSession()
    .then(({ error }) => {
      if (error) {
        console.error(`${MODULE} Health probe failed:`, error.message)
      } else {
        console.info(`${MODULE} ✅ Supabase reachable — auth session probe OK`)
      }
    })
    .catch((err: unknown) => {
      console.error(`${MODULE} Health probe threw:`, err)
    })
}
