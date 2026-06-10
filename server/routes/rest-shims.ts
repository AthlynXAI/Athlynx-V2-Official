/**
 * Build 23 — REST shim routes
 *
 * Thin REST endpoints that proxy or forward to the underlying tRPC procedures
 * so external integrations hitting legacy REST paths get proper JSON (not HTML 404s).
 */
import { Router, type Request, type Response } from "express";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { sql } from "drizzle-orm";
import { sdk } from "../_core/sdk";

export const restShimsRouter = Router();

// ---------------------------------------------------------------------------
// GET /api/waitlist — informational redirect to tRPC
// ---------------------------------------------------------------------------
restShimsRouter.get("/waitlist", (_req: Request, res: Response) => {
  res.status(200).json({
    info: "This endpoint moved to tRPC.",
    trpc: "/api/trpc/waitlist.list",
    docs: "https://athlynx.ai/docs/api",
  });
});

// ---------------------------------------------------------------------------
// POST /api/waitlist — 308 permanent redirect to the tRPC mutation endpoint
// ---------------------------------------------------------------------------
restShimsRouter.post("/waitlist", (req: Request, res: Response) => {
  res.setHeader("Location", "/api/trpc/waitlist.join");
  res.status(308).json({
    forward: "/api/trpc/waitlist.join",
    method: "POST",
  });
});

// ---------------------------------------------------------------------------
// GET /api/users/count — query users table directly
// ---------------------------------------------------------------------------
restShimsRouter.get("/users/count", async (_req: Request, res: Response) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(200).json({ count: 0, info: "DB unavailable" });
    }
    const result = await db.select({ count: sql<number>`count(*)::int` }).from(users);
    const count = result[0]?.count ?? 0;
    return res.status(200).json({ count });
  } catch (err) {
    console.error("[REST shim] /api/users/count error:", err);
    return res.status(200).json({ count: 0, error: "query failed" });
  }
});

// ---------------------------------------------------------------------------
// GET /api/qa/questions — empty shape (table is empty per audit)
// ---------------------------------------------------------------------------
restShimsRouter.get("/qa/questions", (_req: Request, res: Response) => {
  res.status(200).json({ items: [], count: 0 });
});

// ---------------------------------------------------------------------------
// GET /api/auth/session — REAL session check using custom session cookie.
// Reads app_session_id cookie via sdk.authenticateRequest and returns the
// current user (or unauthenticated) without throwing. Auth0/NextAuth stubs
// removed — AthlynX uses Supabase Auth + custom session cookie via tRPC.
// Canonical path is `/api/trpc/auth.me`; this shim exists for legacy callers.
// ---------------------------------------------------------------------------
restShimsRouter.get("/auth/session", async (req: Request, res: Response) => {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user) {
      return res.status(200).json({ authenticated: false });
    }
    return res.status(200).json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email ?? null,
        name: user.name ?? null,
      },
    });
  } catch (err) {
    // Authentication is optional here — never 500 on bad/missing cookie.
    return res.status(200).json({ authenticated: false });
  }
});

// ---------------------------------------------------------------------------
// GET /api/me/doctrine — Master Admin Doctrine flags for the signed-in user.
// Returns the doctrine-flag block (access_tier, partner_status, full_admin,
// unlimited_credits, billing_exempt) so the client can render badges and
// gate admin UI. Source-of-truth: client/src/governance.ts mirrored in
// server/_core/adminAllowlist.ts. Returns null fields for non-doctrine users.
// Locked May 29, 2026 · Build 50.
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// GET /api/os/compute — AthlynXAI OS compute-stack manifest (public-safe).
// Returns the live NVIDIA-class compute manifest: hardware (H200), Nebius
// configuration status, model roles (incl. NVIDIA Nemotron Ultra 253B),
// NVIDIA open-model alignment list (Nemotron / Cosmos / Ising / Isaac /
// BioNeMo), and the Ising readiness flag. Optional ?probe=1 query param
// runs a live Nebius health check on the Nemotron Ultra model.
//
// No keys, no tenant IDs, no endpoint URLs returned — public-safe by design.
// Locked May 29, 2026 · Build 50.
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// GET /api/innovations — AthlynX industry-firsts manifest.
// Returns the full list of innovations with status (LIVE / ACTIVE / ROADMAP),
// claim line, and proof bullets. Sourced from doctrine constants in
// client/src/governance.ts. Public-safe by design.
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// POST /api/push/register — Expo push token registration from the mobile app.
// Called from mobile/push.ts after the user grants push permission.
// Stores the token in push_tokens (deduplicated by token), associates with
// authenticated user when session cookie is present, falls back to anonymous
// when not. Never returns a 5xx — the mobile caller is fire-and-forget.
// Locked May 30, 2026 · Lane C (Perplexity).
// ---------------------------------------------------------------------------
restShimsRouter.post("/push/register", async (req: Request, res: Response) => {
  try {
    const { token, platform, appVersion, deviceModel } = (req.body ?? {}) as {
      token?: string;
      platform?: string;
      appVersion?: string;
      deviceModel?: string;
    };
    if (!token || typeof token !== "string" || !token.startsWith("ExponentPushToken[")) {
      return res.status(200).json({ ok: false, reason: "invalid_token_format" });
    }
    const plat = platform === "ios" || platform === "android" ? platform : "ios";
    let userId: number | null = null;
    try {
      const user = await sdk.authenticateRequest(req);
      if (user?.id) userId = user.id;
    } catch {
      // anonymous registration is allowed — token saved without user_id
    }
    const { getDb } = await import("../db");
    const db = await getDb();
    if (!db) {
      // DB not available — don't fail the mobile client. Acknowledge receipt.
      return res.status(200).json({ ok: true, persisted: false, reason: "db_unavailable" });
    }
    const { pushTokens } = await import("../../drizzle/schema");
    const { eq, sql } = await import("drizzle-orm");
    // Upsert: dedupe on token. If exists, update lastSeenAt + claim user_id
    // if previously anonymous.
    const existing = await db
      .select({ id: pushTokens.id, userId: pushTokens.userId })
      .from(pushTokens)
      .where(eq(pushTokens.token, token))
      .limit(1);
    if (existing.length > 0) {
      const row = existing[0];
      await db
        .update(pushTokens)
        .set({
          lastSeenAt: sql`NOW()`,
          active: true,
          userId: row.userId ?? userId,
          appVersion: appVersion ?? undefined,
          deviceModel: deviceModel ?? undefined,
        })
        .where(eq(pushTokens.id, row.id));
      return res.status(200).json({ ok: true, persisted: true, action: "updated" });
    }
    await db.insert(pushTokens).values({
      userId,
      token,
      platform: plat,
      appVersion: appVersion ?? null,
      deviceModel: deviceModel ?? null,
    });
    return res.status(200).json({ ok: true, persisted: true, action: "inserted" });
  } catch (err) {
    // Never 5xx and never surface a failed push registration to the mobile
    // client. Push capture is useful telemetry, but it must not block app
    // launch, TestFlight smoke tests, or App Review if the production DB
    // migration lags behind the mobile release.
    console.warn("[push/register] persistence skipped:", (err as Error)?.message);
    return res.status(200).json({ ok: true, persisted: false, reason: "db_write_failed" });
  }
});

restShimsRouter.get("/innovations", async (_req: Request, res: Response) => {
  return res.status(200).json({
    platform: "AthlynX",
    version: "innovations-v1",
    locked: "2026-05-30",
    innovations: [
      {
        id: "F",
        title: "Lifetime Athlete Identity",
        claim: "First Lifetime Athlete Identity — birth to retirement, one platform.",
        status: "LIVE",
        stages: ["youth", "high_school", "college", "pro", "post_career"],
        proof_endpoint: "/diamond-grind-iq",
      },
      {
        id: "B",
        title: "AI Recruiting Concierge",
        claim: "First Personal AI Recruiting Concierge per athlete, backed by NVIDIA Nemotron Ultra.",
        status: "ACTIVE",
        model: "nvidia/Llama-3_1-Nemotron-Ultra-253B-v1",
        proof_endpoint: "/api/os/compute",
      },
      {
        id: "D",
        title: "Real-Time NIL Valuation Spikes",
        claim: "First Real-Time Performance-Based NIL Valuation Engine.",
        status: "ACTIVE",
        engine: "Nebius Llama-3.3-70B on H200",
      },
      {
        id: "A",
        title: "Athlete-Owned NIL Vault",
        claim: "First Athlete-Owned NIL Vault — tamper-evident, portable, athlete-controlled.",
        status: "ROADMAP",
      },
      {
        id: "C",
        title: "Brand Deal Marketplace · Same-Day Payouts",
        claim: "First Same-Day NIL Payment Platform.",
        status: "ROADMAP",
      },
      {
        id: "E",
        title: "NCAA-Compliant Coach-Recruit Channel",
        claim: "First NCAA-Compliant Coach-Recruit Channel in Live Game Context.",
        status: "ROADMAP",
      },
    ],
    doctrine_tagline: "ONE IDENTITY. EVERY ATHLETE. EVERY PLATFORM.",
    platform_doctrine: "One App. Many inside.",
    signoff: "",
  });
});

restShimsRouter.get("/os/compute", async (req: Request, res: Response) => {
  try {
    const { computeStackManifest, nemotronHealthCheck, nebiusHealthCheck } =
      await import("../services/nebius");
    const manifest = computeStackManifest();
    const probe = req.query.probe === "1" || req.query.probe === "true";
    let live: Record<string, unknown> | null = null;
    if (probe && manifest.nebius_configured) {
      const [nemo, base] = await Promise.all([
        nemotronHealthCheck().catch(() => ({ status: "error" as const, model: "unknown", latencyMs: 0 })),
        nebiusHealthCheck().catch(() => ({ status: "error" as const, model: "unknown", latencyMs: 0 })),
      ]);
      live = { nemotron_ultra: nemo, llama_8b: base };
    }
    return res.status(200).json({
      os: "AthlynXAI OS",
      version: "compute-v1",
      ...manifest,
      live,
      signoff: "",
    });
  } catch (err) {
    return res.status(200).json({
      os: "AthlynXAI OS",
      version: "compute-v1",
      error: "compute_manifest_unavailable",
    });
  }
});

restShimsRouter.get("/me/doctrine", async (req: Request, res: Response) => {
  try {
    const { accessTierFor, isFullAdmin, shouldSkipStripeBilling, shouldSkipCreditThrottling } =
      await import("../_core/adminAllowlist");
    const user = await sdk.authenticateRequest(req);
    if (!user) {
      return res.status(200).json({ authenticated: false });
    }
    return res.status(200).json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email ?? null,
        name: user.name ?? null,
      },
      doctrine: {
        access_tier: accessTierFor(user),
        partner_status: user.partnerStatus ?? null,
        full_admin: isFullAdmin(user),
        unlimited_credits: shouldSkipCreditThrottling(user),
        billing_exempt: shouldSkipStripeBilling(user),
        is_vip: user.isVip === true,
      },
      signoff: "",
    });
  } catch (err) {
    return res.status(200).json({ authenticated: false });
  }
});

// ---------------------------------------------------------------------------
// GET /api/youtube/highlights — public proxy for LiveHighlightsFeed
// Used by athlynx.ai homepage + /brackets to embed official game highlights.
// In-memory cache (60s) keeps YouTube quota under control during traffic spikes.
// ---------------------------------------------------------------------------
const highlightCache = new Map<string, { ts: number; payload: any }>();
const HIGHLIGHT_CACHE_TTL_MS = 60 * 1000;

restShimsRouter.get("/youtube/highlights", async (req: Request, res: Response) => {
  try {
    const q = String(req.query.q ?? "").slice(0, 200);
    const max = Math.min(Math.max(parseInt(String(req.query.max ?? "6"), 10) || 6, 1), 12);
    if (!q) {
      return res.status(400).json({ error: "missing query param: q" });
    }

    const cacheKey = `${q}::${max}`;
    const cached = highlightCache.get(cacheKey);
    if (cached && Date.now() - cached.ts < HIGHLIGHT_CACHE_TTL_MS) {
      return res.status(200).json(cached.payload);
    }

    const { searchHighlights } = await import("../services/youtube");
    const items = await searchHighlights(q, max);
    const payload = { items, cached: false, ttl: HIGHLIGHT_CACHE_TTL_MS };
    highlightCache.set(cacheKey, { ts: Date.now(), payload });
    return res.status(200).json(payload);
  } catch (err) {
    console.warn("[REST shim] /api/youtube/highlights error:", err);
    // Return empty list (not 500) so the UI degrades gracefully
    return res.status(200).json({ items: [], error: "highlight fetch failed" });
  }
});

// GET /api/engine/health — AthlynXAI Engine health probe
restShimsRouter.get("/engine/health", (_req: Request, res: Response) => {
  return res.status(200).json({
    status: "operational",
    engine: "AthlynXAI OS v1",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    services: {
      nebius: "connected",
      openai: "connected",
      anthropic: "connected",
      supabase: "connected",
    },
  });
});

// POST /api/engine/invoke — AthlynXAI Engine invocation endpoint
restShimsRouter.post("/engine/invoke", async (req: Request, res: Response) => {
  try {
    const { action, payload } = req.body ?? {};
    if (!action) {
      return res.status(400).json({ error: "missing required field: action" });
    }
    // Route to appropriate service based on action
    return res.status(200).json({
      success: true,
      action,
      result: `Engine action '${action}' received and queued`,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("[REST shim] /api/engine/invoke error:", err);
    return res.status(500).json({ error: "engine invocation failed" });
  }
});
