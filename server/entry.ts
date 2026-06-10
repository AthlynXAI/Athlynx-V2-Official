import "dotenv/config";
import express, { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import { registerStripeWebhook } from "../server/stripe/webhook";
import { registerJotformWaitlistWebhook } from "../server/webhooks/jotformWaitlist";
import { registerGameChangerWebhook } from "../server/webhooks/gameChangerFinalScore";
import { registerCommsInboundWebhooks } from "../server/webhooks/commsInbound";
import { runMigrations } from "../server/migrate";
import { runDualMigrations } from "../server/migrate-dual";
import { securityHeaders, isAllowedOrigin, rateLimit, authRateLimit } from "../server/_core/security";
import { restShimsRouter } from "../server/routes/rest-shims";
import { registerGlucoAthleteRoutes } from "../server/routes/glucoathlete";
import { registerBioSignalRoutes } from "../server/routes/biosignal";
import { assertServerEnv } from "../server/_core/env";
import { initServerSentry } from "../server/_core/sentry";
import { connectorHealthRegistry, connectorHealthSelfTest, getConnectorHealthSnapshot } from "../server/services/connectorHealth";

initServerSentry();
assertServerEnv();

const app = express();
app.disable("x-powered-by");

// Build 5 — Fort Knox · trust the Vercel/Cloudflare proxy so req.ip is correct.
app.set("trust proxy", true);

// Build 5 — Fort Knox · defense-in-depth response headers on every request.
app.use(securityHeaders);

// Build 5 — Fort Knox · CORS allowlist (athlynx domains + Vercel previews + localhost).
app.use(cors({
  origin: (origin, cb) => {
    if (isAllowedOrigin(origin)) return cb(null, true);
    return cb(new Error(`CORS: origin not allowed (${origin})`));
  },
  credentials: true,
}));

// Stripe webhook MUST be before json middleware (needs raw body)
registerStripeWebhook(app);

// Body parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Cookie parser — required for reading/writing session cookies
app.use(cookieParser());

// JotForm waitlist webhook — registered after body parsers so urlencoded payload is parsed
registerJotformWaitlistWebhook(app);

// Build 27.1 Phase 2.3b — GameChanger final-score auto-ingest webhook
// Registered after express.json() so we can read the parsed JSON body, and
// uses HMAC-SHA256 verification against GAMECHANGER_WEBHOOK_SECRET.
registerGameChangerWebhook(app);

// Build 28 — Comms OS inbound webhooks (Gmail / SMS / Outlook)
// Registered after express.json() so JSON payloads are parsed. Routes:
//   POST /api/webhooks/comms/gmail
//   POST /api/webhooks/comms/sms
//   POST /api/webhooks/comms/outlook
// All inbound events land in communication_events with autoSendEnabled:false
// per the 3-Address Sender Rule (Option B) — no auto-replies until Rules Manager UI.
registerCommsInboundWebhooks(app);

// Legacy mobile/auth compatibility probes.
// Cached mobile browsers and older client bundles may call these paths before the tRPC auth hook.
// Return a clean unauthenticated state instead of a 404 so the app can choose the correct public or login route.
app.get("/api/auth/me", (_req: Request, res: Response) => {
  res.json({ authenticated: false, user: null, source: "legacy-auth-compat", ts: new Date().toISOString() });
});

app.get("/api/me", (_req: Request, res: Response) => {
  res.json({ authenticated: false, user: null, source: "legacy-auth-compat", ts: new Date().toISOString() });
});

// Sanitized Connector Health OS REST probes for uptime checks and dashboard fallback.
// These endpoints never expose secret values, cookies, tokens, mailbox contents, or raw env values.
app.get("/api/system/connector-health", (_req: Request, res: Response) => {
  const selfTest = connectorHealthSelfTest();
  res.json({
    ok: selfTest.ok,
    generatedAt: selfTest.snapshot.generatedAt,
    summary: selfTest.snapshot.summary,
    doctrine: selfTest.snapshot.doctrine,
    publicNote: "Sanitized probe only. OAuth/session connectors still require same-session read-only proof.",
  });
});

app.get("/api/system/connector-health/registry", (_req: Request, res: Response) => {
  res.json({ connectors: connectorHealthRegistry() });
});

app.get("/api/system/connector-health/snapshot", (_req: Request, res: Response) => {
  const snapshot = getConnectorHealthSnapshot();
  res.json({
    ok: snapshot.ok,
    generatedAt: snapshot.generatedAt,
    summary: snapshot.summary,
    doctrine: snapshot.doctrine,
    connectors: snapshot.connectors.map(({ missingEnv, ...connector }) => ({
      ...connector,
      missingEnvCount: missingEnv.length,
      missingEnv: undefined,
    })),
    publicNote: "Sanitized snapshot. Missing environment variable names and secret values are not exposed by this endpoint.",
  });
});

// Build 5 — Fort Knox · tighter rate-limit on auth-style endpoints.
app.use("/api/trpc/auth", authRateLimit);
app.use("/api/trpc/waitlist", authRateLimit);

// Build 5 — Fort Knox · default rate-limit on all tRPC traffic (200/min/IP, burst 200).
app.use("/api/trpc", rateLimit());

// tRPC API
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Build 23 — REST shim routes (proxy legacy REST paths to tRPC / DB)
app.use("/api", restShimsRouter);

// GlucoAthlete OS — read-only Libre connected-app test API + MCP-style route.
registerGlucoAthleteRoutes(app);

// Athlete BioSignal OS — parent-OS multi-sensor registry, lifecycle, business-leg and MCP routes.
registerBioSignalRoutes(app);

// Build 26.7 — AthlynXAI Engine (Nebius-backed) — Manus to re-land in next pass (Build 27.1)
// Removed temporarily: server/engine/engineRoutes.ts referenced ../db + ../../shared/schema
// which do not exist in this repo layout; broke CI typecheck on Build 27 doctrine push.

// Build 27 — AthlynXAI Doctrine (Layer Cake + Tokenization + Sport Matrix + Autonomous OS + 4.5★ Bar)
// Served from /docs/specs and committed to git. Permanently baked.
import("./routes/doctrine").then(({ registerDoctrineRoutes }) => {
  registerDoctrineRoutes(app);
  console.log("[doctrine] AthlynXAI Doctrine routes registered: /api/doctrine, /api/doctrine/:spec_id");
}).catch((err) => console.error("[doctrine] failed to register doctrine routes", err));

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    platform: "AthlynX",
    version: "1.0.11-inbox-oauth-guardrails",
    build: "Build 27 Inbox + OAuth Guardrail Bake-In",
    doctrine: "/api/doctrine",
    timestamp: new Date().toISOString(),
  });
});

// Run DB migrations on first cold-start (non-blocking — errors are logged, not thrown)
// DATABASE_URL is available in the Vercel runtime env but NOT during the build step,
// which is why we run migrations here rather than in the build:vercel script.
// Run migrations on both TiDB (primary) and PlanetScale (backup) on every cold-start
runDualMigrations().catch((err) =>
  console.error("[entry] runDualMigrations unexpected error:", err)
);

// ESM default export — esbuild --format=cjs wraps this correctly for Vercel's Node runtime.
export default app;
