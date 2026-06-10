import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { registerStripeWebhook } from "../stripe/webhook";
import { startWeeklyReportJob } from "../jobs/weeklyReport";
import { startSubscriptionExpiryJob } from "../jobs/subscriptionExpiryJob";
import { startPlatformMessagesJob } from "../jobs/platformMessagesJob";
import { connectorHealthRegistry, connectorHealthSelfTest, getConnectorHealthSnapshot } from "../services/connectorHealth";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  app.disable("x-powered-by");
  const server = createServer(app);
  // Register Stripe webhook BEFORE json middleware (needs raw body for signature verification)
  registerStripeWebhook(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Legacy mobile/auth compatibility probes.
  // Cached mobile browsers and older client bundles may call these paths before the tRPC auth hook.
  // Return a clean unauthenticated state instead of a 404 so the app can choose the correct public or login route.
  app.get("/api/auth/me", (_req, res) => {
    res.json({ authenticated: false, user: null, source: "legacy-auth-compat", ts: new Date().toISOString() });
  });

  app.get("/api/me", (_req, res) => {
    res.json({ authenticated: false, user: null, source: "legacy-auth-compat", ts: new Date().toISOString() });
  });

  // Sanitized public connector-health probes for uptime checks and dashboard fallbacks.
  // These never expose secret values, raw env values, cookies, tokens, or mailbox contents.
  app.get("/api/system/connector-health", (_req, res) => {
    const selfTest = connectorHealthSelfTest();
    res.json({
      ok: selfTest.ok,
      generatedAt: selfTest.snapshot.generatedAt,
      summary: selfTest.snapshot.summary,
      doctrine: selfTest.snapshot.doctrine,
      publicNote: "Sanitized probe only. OAuth/session connectors still require same-session read-only proof.",
    });
  });

  app.get("/api/system/connector-health/registry", (_req, res) => {
    res.json({ connectors: connectorHealthRegistry() });
  });

  app.get("/api/system/connector-health/snapshot", (_req, res) => {
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

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);

// Schedule weekly signup report (every Sunday 8:00 AM CST)
startWeeklyReportJob();

// Schedule subscription expiry email job (runs every hour)
startSubscriptionExpiryJob();
// Schedule platform in-app reminder messages (runs every 24 hours — no banners)
startPlatformMessagesJob();
