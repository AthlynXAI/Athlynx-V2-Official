import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "./trpc";
import { getActiveEngine } from "./llm";
import { getDb } from "../db";
import {
  connectorHealthRegistry,
  connectorHealthSelfTest,
  emitConnectorHealthToSentry,
  getConnectorHealthSnapshot,
} from "../services/connectorHealth";

type ConnectorStatus = {
  name: string;
  ok: boolean;
  reason: string;
  lastChecked: number;
};

function envPresent(...keys: string[]): boolean {
  return keys.every(k => !!(process.env[k] && process.env[k]!.trim().length > 0));
}

function envAny(...keys: string[]): boolean {
  return keys.some(k => !!(process.env[k] && process.env[k]!.trim().length > 0));
}

export const systemRouter = router({
  /** Liveness + DB + active engine — for status pages, uptime checks. */
  health: publicProcedure
    .input(z.object({ timestamp: z.number().min(0).optional() }).optional())
    .query(async () => {
      let dbStatus: "connected" | "error" = "error";
      try {
        const db = await getDb();
        dbStatus = db ? "connected" : "error";
      } catch {
        dbStatus = "error";
      }
      return {
        ok: true,
        db: dbStatus,
        activeEngine: getActiveEngine(),
        ts: Date.now(),
      };
    }),

  /** Which LLM engines are configured right now. ADMIN ONLY — reveals which API keys are set. */
  engines: adminProcedure.query(() => {
    return {
      nebius: envPresent("NEBIUS_API_KEY"),
      gemini: envAny("GEMINI_API_KEY", "GOOGLE_AI_API_KEY"),
      claude: envPresent("ANTHROPIC_API_KEY"),
      openai: envPresent("OPENAI_API_KEY"),
      primary: getActiveEngine(),
    };
  }),

  /** Cheap presence check for every connector — env-var presence only. ADMIN ONLY — reveals platform infra. */
  connectors: adminProcedure.query((): { connectors: ConnectorStatus[] } => {
    const ts = Date.now();
    const make = (name: string, ok: boolean, reason: string): ConnectorStatus => ({
      name,
      ok,
      reason,
      lastChecked: ts,
    });
    return {
      connectors: [
        make("nebius", envPresent("NEBIUS_API_KEY"), "NEBIUS_API_KEY"),
        make("gemini", envAny("GEMINI_API_KEY", "GOOGLE_AI_API_KEY"), "GEMINI_API_KEY or GOOGLE_AI_API_KEY"),
        make("claude", envPresent("ANTHROPIC_API_KEY"), "ANTHROPIC_API_KEY"),
        make("openai", envPresent("OPENAI_API_KEY"), "OPENAI_API_KEY"),
        make("twilio", envPresent("TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN"), "TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN"),
        make("sendgrid", envPresent("SENDGRID_API_KEY"), "SENDGRID_API_KEY"),
        make("ses", envAny("AWS_ACCESS_KEY_ID", "AWS_SES_ACCESS_KEY_ID"), "AWS_ACCESS_KEY_ID or AWS_SES_ACCESS_KEY_ID"),
        make("buffer", envPresent("BUFFER_ACCESS_TOKEN"), "BUFFER_ACCESS_TOKEN"),
        make("youtube", envAny("YOUTUBE_HIGHLIGHTS_API_KEY", "YOUTUBE_API_KEY"), "YOUTUBE_HIGHLIGHTS_API_KEY or YOUTUBE_API_KEY"),
        make("gravatar", true, "no API key required"),
        make("r2", envAny("CLOUDFLARE_R2_TOKEN", "R2_ACCESS_KEY_ID"), "CLOUDFLARE_R2_TOKEN or R2_ACCESS_KEY_ID"),
        make("auth0", envPresent("AUTH0_DOMAIN", "AUTH0_M2M_CLIENT_ID", "AUTH0_M2M_CLIENT_SECRET"), "AUTH0_DOMAIN + AUTH0_M2M_CLIENT_ID + AUTH0_M2M_CLIENT_SECRET"),
        make("stripe", envPresent("STRIPE_SECRET_KEY"), "STRIPE_SECRET_KEY"),
      ],
    };
  }),

  /** Public-safe connector registry: names, lanes, doctrine, and proof rules without secrets. */
  connectorRegistry: publicProcedure.query(() => ({
    generatedAt: new Date().toISOString(),
    doctrine: {
      productionRepo: "AthlyXAI/AthlynX-V2-Official",
      productionVercelProject: "chad-a-doziers-projects/athlynx-platform",
      defaultOwnerLane: "chaddozier75@gmail.com",
      secretRule: "Never commit plaintext passwords, tokens, cookies, private keys, or .env values.",
    },
    connectors: connectorHealthRegistry(),
  })),

  /** Admin connector-health sweep: env-backed proof plus same-session OAuth manual-review gates. */
  connectorHealth: adminProcedure.query(() => getConnectorHealthSnapshot()),

  /** Emit a sanitized Sentry breadcrumb/event for the current connector sweep. */
  emitConnectorHealthSentry: adminProcedure.mutation(() => emitConnectorHealthToSentry()),

  /** No-secret synthetic test for the connector-health registry and doctrine gates. */
  connectorHealthSelfTest: publicProcedure.query(() => connectorHealthSelfTest()),

  /** Smoke test: lightweight round-trips per connector. ADMIN ONLY — performs side effects + reveals infra. */
  smokeTest: adminProcedure.mutation(async () => {
    const results: Array<{ name: string; ok: boolean; latencyMs: number; error?: string }> = [];
    const run = async (name: string, fn: () => Promise<void>) => {
      const start = Date.now();
      try {
        await fn();
        results.push({ name, ok: true, latencyMs: Date.now() - start });
      } catch (err) {
        results.push({
          name,
          ok: false,
          latencyMs: Date.now() - start,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    };

    await run("db", async () => {
      const db = await getDb();
      if (!db) throw new Error("getDb returned null");
    });

    await run("nebius", async () => {
      if (!process.env.NEBIUS_API_KEY) throw new Error("NEBIUS_API_KEY missing");
    });

    return { ts: Date.now(), results };
  }),
});
