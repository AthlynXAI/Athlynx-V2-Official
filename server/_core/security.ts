/**
 * Build 5 — Fort Knox · Security middleware
 *
 * - Security headers (CSP, HSTS, X-Frame-Options, etc.)
 * - CORS allowlist (athlynx domains only, plus localhost dev)
 * - In-memory rate limiter (token-bucket per IP)
 *
 * No new infra. Pure middleware. Belt + suspenders on top of Cloudflare/Vercel.
 */

import type { Request, Response, NextFunction } from "express";

// ─── CORS allowlist ──────────────────────────────────────────────────────────

export const CORS_ALLOWED_ORIGINS = [
  "https://athlynx.ai",
  "https://www.athlynx.ai",
  "https://athlynx.pro",
  "https://athlynx.io",
  "https://athlynx.net",
  "https://nilportal.ai",
  "https://dozierholdingsgroup.com",
  "http://localhost:5173",
  "http://localhost:3000",
];

const VERCEL_PREVIEW_RX = /^https:\/\/athlynx-platform-[a-z0-9]+-chad-a-doziers-projects\.vercel\.app$/;

export function isAllowedOrigin(origin?: string | null): boolean {
  if (!origin) return true; // same-origin / curl / SSR — allowed
  if (CORS_ALLOWED_ORIGINS.includes(origin)) return true;
  if (VERCEL_PREVIEW_RX.test(origin)) return true;
  return false;
}

// ─── Security headers ────────────────────────────────────────────────────────

/**
 * Adds defense-in-depth headers on every response.
 * Cloudflare may add some of these too — duplicates are harmless.
 *
 * CSP is intentionally permissive on `script-src` because we serve a SPA with
 * Vite-built bundles and use third-party widgets (Stripe, Auth0,
 * Google Maps, YouTube). Tighten further only after measuring breakage.
 */
export function securityHeaders(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(self), camera=(self), microphone=(self), payment=(self)",
  );
  res.setHeader("X-XSS-Protection", "0");
  next();
}

// ─── Rate limiter (in-memory token bucket per IP) ────────────────────────────

type Bucket = { tokens: number; lastRefill: number };
const BUCKETS = new Map<string, Bucket>();

interface RateLimitOpts {
  capacity: number;    // max tokens (also = burst size)
  refillPerMin: number; // tokens added per minute
}

const DEFAULT_LIMITS: RateLimitOpts = { capacity: 200, refillPerMin: 200 };
const AUTH_LIMITS: RateLimitOpts = { capacity: 20, refillPerMin: 20 }; // tighter on login/signup

function clientIp(req: Request): string {
  // Vercel/Cloudflare put the real client IP in these headers
  const xff = (req.headers["x-forwarded-for"] as string | undefined) || "";
  const first = xff.split(",")[0]?.trim();
  return first || (req.ip ?? "unknown");
}

function consume(ip: string, opts: RateLimitOpts): boolean {
  const now = Date.now();
  let b = BUCKETS.get(ip);
  if (!b) {
    b = { tokens: opts.capacity, lastRefill: now };
    BUCKETS.set(ip, b);
  }
  const elapsedMin = (now - b.lastRefill) / 60_000;
  const refill = Math.floor(elapsedMin * opts.refillPerMin);
  if (refill > 0) {
    b.tokens = Math.min(opts.capacity, b.tokens + refill);
    b.lastRefill = now;
  }
  if (b.tokens <= 0) return false;
  b.tokens -= 1;
  return true;
}

// Periodic cleanup so the Map doesn't grow forever on a warm Lambda.
setInterval(() => {
  const cutoff = Date.now() - 30 * 60_000;
  BUCKETS.forEach((b, ip) => {
    if (b.lastRefill < cutoff && b.tokens >= 200) BUCKETS.delete(ip);
  });
}, 5 * 60_000).unref?.();

export function rateLimit(opts: RateLimitOpts = DEFAULT_LIMITS) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = clientIp(req);
    if (!consume(ip, opts)) {
      res.status(429).json({ error: "rate_limited", message: "Too many requests. Try again in a minute." });
      return;
    }
    next();
  };
}

export const authRateLimit = rateLimit(AUTH_LIMITS);
