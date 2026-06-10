/**
 * stripeInit.ts
 * Build 52 — AthlynXAI / Athlynx-V2-Official
 *
 * Defensive Stripe.js initializer with:
 *  - Env-var guard: never throws on missing publishable key; logs + returns null
 *  - Lazy singleton: Stripe.js only loaded when first requested (saves ~80 KB
 *    from initial athlete landing-page bundle — critical for AI-agent crawl speed)
 *  - Test/live key detection: warns loudly if test key reaches production build
 *  - SSR guard: safe to import server-side
 *
 * This file directly supports the athlete signup conversion funnel.
 * A broken Stripe init = zero paid NIL sign-ups.
 */

import { loadStripe, type Stripe } from '@stripe/stripe-js'

// ─── Constants ────────────────────────────────────────────────────────────────

const MODULE = '[AthlynX:StripeInit]'

// ─── Env resolution ───────────────────────────────────────────────────────────

const rawKey = (
  typeof import.meta !== 'undefined'
    ? (import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined)
    : (typeof process !== 'undefined' ? process.env.STRIPE_PUBLISHABLE_KEY : undefined)
) ?? ''

const isMissingKey = !rawKey || rawKey.length < 20
const isTestKey = rawKey.startsWith('pk_test_')
const isLiveKey = rawKey.startsWith('pk_live_')

if (isMissingKey) {
  console.error(
    `${MODULE} ⚠️  VITE_STRIPE_PUBLISHABLE_KEY is missing or invalid.`,
    `Athlete subscription + NIL payment flows will be non-functional.`,
  )
}

const isProd =
  typeof import.meta !== 'undefined'
    ? import.meta.env?.PROD === true
    : process.env.NODE_ENV === 'production'

if (isProd && isTestKey) {
  console.error(
    `${MODULE} 🚨 TEST Stripe key detected in a PRODUCTION build!`,
    `Real athlete payments will be refused. Switch to pk_live_* immediately.`,
  )
}

if (!isProd && isLiveKey) {
  console.warn(
    `${MODULE} 🟡 LIVE Stripe key detected in a non-production build.`,
    `This may result in real charges during development/testing.`,
  )
}

// ─── Lazy singleton ───────────────────────────────────────────────────────────

let _stripePromise: Promise<Stripe | null> | null = null

/**
 * Returns a memoised Stripe.js promise.
 * Calling multiple times is safe — loads only once.
 * Returns null (with a warning) if the key is absent.
 */
export function getStripe(): Promise<Stripe | null> {
  if (typeof window === 'undefined') {
    // SSR — never load Stripe on the server
    return Promise.resolve(null)
  }

  if (isMissingKey) {
    console.warn(`${MODULE} getStripe() called with no publishable key — returning null.`)
    return Promise.resolve(null)
  }

  if (!_stripePromise) {
    _stripePromise = loadStripe(rawKey).catch((err: unknown) => {
      console.error(`${MODULE} loadStripe() failed:`, err)
      _stripePromise = null // allow retry on next call
      return null
    })
  }

  return _stripePromise
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const stripeKeyMeta = {
  present: !isMissingKey,
  mode: isMissingKey ? 'none' : isLiveKey ? 'live' : 'test',
} as const

/**
 * Call at app boot to surface key-configuration issues early.
 * Non-blocking — logs only.
 */
export function logStripeStatus(): void {
  console.info(
    `${MODULE} Key status:`,
    stripeKeyMeta.mode,
    `| present: ${stripeKeyMeta.present}`,
    `| isProd: ${isProd}`,
  )
}
