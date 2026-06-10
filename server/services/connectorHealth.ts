import { Sentry } from "../_core/sentry";

export type ConnectorTier = "critical" | "high" | "standard";
export type ConnectorKind = "env" | "oauth" | "webhook" | "public" | "manual";
export type ConnectorLane =
  | "owner"
  | "athlynxai"
  | "dozier-holdings"
  | "social"
  | "payments"
  | "storage"
  | "database"
  | "deployment"
  | "monitoring";

export type ConnectorHealthStatus = "ok" | "degraded" | "blocked" | "manual_review";

export type ConnectorHealthDefinition = {
  id: string;
  label: string;
  lane: ConnectorLane;
  kind: ConnectorKind;
  tier: ConnectorTier;
  requiredEnv?: string[];
  anyEnv?: string[];
  ownerAccount: string;
  safeCheck: string;
  recoveryAction: string;
  sentryTag: string;
};

export type ConnectorHealthResult = ConnectorHealthDefinition & {
  status: ConnectorHealthStatus;
  ok: boolean;
  configured: boolean;
  checkedAt: string;
  missingEnv: string[];
  reason: string;
};

export type ConnectorHealthSnapshot = {
  ok: boolean;
  generatedAt: string;
  summary: {
    total: number;
    ok: number;
    degraded: number;
    blocked: number;
    manualReview: number;
    criticalBlocked: number;
  };
  connectors: ConnectorHealthResult[];
  doctrine: {
    productionRepo: string;
    productionVercelProject: string;
    defaultOwnerLane: string;
    secretRule: string;
  };
};

const hasEnv = (key: string): boolean => Boolean(process.env[key]?.trim());

const CONNECTORS: ConnectorHealthDefinition[] = [
  {
    id: "github",
    label: "GitHub Source Control",
    lane: "deployment",
    kind: "oauth",
    tier: "critical",
    anyEnv: ["GITHUB_TOKEN", "GH_TOKEN"],
    ownerAccount: "chaddozier75@gmail.com / AthlyXAI",
    safeCheck: "Verify repo visibility and latest commit through GitHub integration before push.",
    recoveryAction: "Reconnect GitHub OAuth or rotate a scoped token; do not switch repositories.",
    sentryTag: "github",
  },
  {
    id: "vercel",
    label: "Vercel Production Deployment",
    lane: "deployment",
    kind: "oauth",
    tier: "critical",
    anyEnv: ["VERCEL_TOKEN", "VERCEL_PROJECT_ID"],
    ownerAccount: "AthlynXChad / chaddozier75-cmd",
    safeCheck: "List deployments for athlynx-platform and verify the latest production commit.",
    recoveryAction: "Reconnect Vercel, fix commit email identity, or redeploy the canonical repo only.",
    sentryTag: "vercel",
  },
  {
    id: "sentry",
    label: "Sentry Error Monitoring",
    lane: "monitoring",
    kind: "env",
    tier: "critical",
    requiredEnv: ["SENTRY_DSN"],
    ownerAccount: "AthlynXAI production monitoring lane",
    safeCheck: "Confirm SENTRY_DSN presence only; proof events send sanitized summary counts and connector IDs, never secret values.",
    recoveryAction: "Verify Sentry by checking DSN presence in secure runtime env and emitting sanitized proof; never commit DSN secrets.",
    sentryTag: "sentry",
  },
  {
    id: "nebius",
    label: "Nebius AI / H200 Compute Rail",
    lane: "athlynxai",
    kind: "env",
    tier: "critical",
    requiredEnv: ["NEBIUS_API_KEY"],
    ownerAccount: "cdozier14@athlynx.ai business lane",
    safeCheck: "Check key presence and run a no-data model/account probe when enabled.",
    recoveryAction: "Rotate or restore NEBIUS_API_KEY through secure environment management.",
    sentryTag: "nebius",
  },
  {
    id: "openai",
    label: "OpenAI Compute Rail",
    lane: "athlynxai",
    kind: "env",
    tier: "high",
    requiredEnv: ["OPENAI_API_KEY"],
    ownerAccount: "AthlynXAI business lane",
    safeCheck: "Check key presence and use minimal model metadata probes only.",
    recoveryAction: "Rotate or restore OPENAI_API_KEY through the approved secret manager.",
    sentryTag: "openai",
  },
  {
    id: "gemini",
    label: "Google Gemini Rail",
    lane: "athlynxai",
    kind: "env",
    tier: "high",
    anyEnv: ["GEMINI_API_KEY", "GOOGLE_AI_API_KEY"],
    ownerAccount: "Google Workspace / AI lane",
    safeCheck: "Check key presence and use minimal no-content model probes only.",
    recoveryAction: "Restore Gemini key through Vercel env or Google connector settings.",
    sentryTag: "gemini",
  },
  {
    id: "anthropic",
    label: "Anthropic Claude Rail",
    lane: "athlynxai",
    kind: "env",
    tier: "high",
    requiredEnv: ["ANTHROPIC_API_KEY"],
    ownerAccount: "AthlynXAI business lane",
    safeCheck: "Check key presence and perform only low-risk model capability checks.",
    recoveryAction: "Restore ANTHROPIC_API_KEY securely; never write it into repo files.",
    sentryTag: "anthropic",
  },
  {
    id: "gmail_workspace",
    label: "Google Workspace / Gmail",
    lane: "owner",
    kind: "oauth",
    tier: "critical",
    ownerAccount: "chaddozier75@gmail.com by default; business mailbox only by context",
    safeCheck: "Run read-only label/profile/search proof through connector before mailbox work.",
    recoveryAction: "Reconnect Gmail OAuth; if browser and connector identity disagree, stop.",
    sentryTag: "gmail_workspace",
  },
  {
    id: "google_calendar",
    label: "Google Calendar",
    lane: "owner",
    kind: "oauth",
    tier: "high",
    ownerAccount: "Correct organizer account for the business context",
    safeCheck: "Read-only calendar list/current-user proof before invite creation or updates.",
    recoveryAction: "Reconnect Calendar OAuth and verify organizer before any mutation.",
    sentryTag: "google_calendar",
  },
  {
    id: "stripe",
    label: "Stripe Payments",
    lane: "payments",
    kind: "env",
    tier: "critical",
    requiredEnv: ["STRIPE_SECRET_KEY"],
    ownerAccount: "AthlynXAI payments lane",
    safeCheck: "Read-only account/balance proof; no charges or product mutations without approval.",
    recoveryAction: "Restore Stripe connector or rotate STRIPE_SECRET_KEY in secure env store.",
    sentryTag: "stripe",
  },
  {
    id: "neon_database",
    label: "Neon PostgreSQL Runtime DB",
    lane: "database",
    kind: "env",
    tier: "critical",
    anyEnv: ["DATABASE_URL", "POSTGRES_URL"],
    ownerAccount: "Vercel runtime DATABASE_URL is authoritative",
    safeCheck: "Confirm runtime host through Vercel env before any DB write or migration.",
    recoveryAction: "Restore runtime DB env through Vercel; never infer from console names.",
    sentryTag: "neon_database",
  },
  {
    id: "supabase",
    label: "Supabase Realtime / Storage",
    lane: "storage",
    kind: "env",
    tier: "high",
    requiredEnv: ["SUPABASE_URL", "SUPABASE_KEY"],
    ownerAccount: "Realtime/storage rail only unless runtime proof says otherwise",
    safeCheck: "Read-only project/storage proof before any table or bucket mutation.",
    recoveryAction: "Restore Supabase env/connector; keep DB authority separate from Neon.",
    sentryTag: "supabase",
  },
  {
    id: "cloudflare_r2",
    label: "Cloudflare R2 / Edge Storage",
    lane: "storage",
    kind: "env",
    tier: "standard",
    anyEnv: ["CLOUDFLARE_R2_TOKEN", "R2_ACCESS_KEY_ID"],
    ownerAccount: "AthlynXAI storage lane",
    safeCheck: "Read-only bucket/list proof before upload or public URL changes.",
    recoveryAction: "Restore R2 credentials through the secure environment store.",
    sentryTag: "cloudflare_r2",
  },
  {
    id: "buffer",
    label: "Buffer Social Queue",
    lane: "social",
    kind: "env",
    tier: "high",
    requiredEnv: ["BUFFER_ACCESS_TOKEN"],
    ownerAccount: "Approved social publishing connector lane",
    safeCheck: "Read-only profile/channel proof before scheduling or posting.",
    recoveryAction: "Reconnect Buffer OAuth/token; never post while channel identity is uncertain.",
    sentryTag: "buffer",
  },
  {
    id: "twilio",
    label: "Twilio SMS",
    lane: "social",
    kind: "env",
    tier: "standard",
    requiredEnv: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN"],
    ownerAccount: "AthlynXAI notification lane",
    safeCheck: "Read-only account proof before SMS sends.",
    recoveryAction: "Restore Twilio env; do not send SMS without approval and recipient proof.",
    sentryTag: "twilio",
  },
  {
    id: "sendgrid",
    label: "SendGrid Email",
    lane: "athlynxai",
    kind: "env",
    tier: "standard",
    requiredEnv: ["SENDGRID_API_KEY"],
    ownerAccount: "AthlynXAI outbound email rail",
    safeCheck: "Key presence and sender-domain proof before any send.",
    recoveryAction: "Restore SendGrid key in secure env and verify sender domain.",
    sentryTag: "sendgrid",
  },
  {
    id: "aws_ses_sns",
    label: "AWS SES/SNS",
    lane: "athlynxai",
    kind: "env",
    tier: "standard",
    anyEnv: ["AWS_ACCESS_KEY_ID", "AWS_SES_ACCESS_KEY_ID"],
    ownerAccount: "AthlynXAI transactional messaging lane",
    safeCheck: "Read-only identity/topic proof before sends.",
    recoveryAction: "Restore least-privilege AWS credentials through secure env only.",
    sentryTag: "aws_ses_sns",
  },
  {
    id: "gravatar",
    label: "Gravatar Profile Rail",
    lane: "owner",
    kind: "public",
    tier: "standard",
    ownerAccount: "Public profile enrichment lane",
    safeCheck: "Public profile fetch only; no account mutation.",
    recoveryAction: "If profile fetch fails, mark degraded but do not block core OS.",
    sentryTag: "gravatar",
  },
];

function evaluateConnector(def: ConnectorHealthDefinition, checkedAt: string): ConnectorHealthResult {
  const requiredMissing = (def.requiredEnv ?? []).filter((key) => !hasEnv(key));
  const anyMissing = def.anyEnv && def.anyEnv.length > 0 && !def.anyEnv.some((key) => hasEnv(key)) ? [...def.anyEnv] : [];
  const missingEnv = [...requiredMissing, ...anyMissing];
  const needsEnv = Boolean(def.requiredEnv?.length || def.anyEnv?.length);
  const configured = !needsEnv || missingEnv.length === 0;

  let status: ConnectorHealthStatus = "ok";
  let reason = "Proof rail configured or public/no-secret check available.";

  if (def.kind === "oauth" || def.kind === "manual") {
    status = configured ? "manual_review" : "manual_review";
    reason = "Same-session proof required: OAuth/manual connectors cannot be guaranteed by env presence. Run the harmless read-only connector capability check or rely on the cron watchdog to flag blocked proof.";
  } else if (!configured) {
    status = def.tier === "critical" ? "blocked" : "degraded";
    reason = `Missing secure configuration proof: ${missingEnv.join(" or ")}`;
  }

  return {
    ...def,
    status,
    ok: status === "ok" || status === "manual_review",
    configured,
    checkedAt,
    missingEnv,
    reason,
  };
}

export function getConnectorHealthSnapshot(): ConnectorHealthSnapshot {
  const checkedAt = new Date().toISOString();
  const connectors = CONNECTORS.map((def) => evaluateConnector(def, checkedAt));
  const summary = connectors.reduce(
    (acc, c) => {
      acc.total += 1;
      if (c.status === "ok") acc.ok += 1;
      if (c.status === "degraded") acc.degraded += 1;
      if (c.status === "blocked") acc.blocked += 1;
      if (c.status === "manual_review") acc.manualReview += 1;
      if (c.tier === "critical" && c.status === "blocked") acc.criticalBlocked += 1;
      return acc;
    },
    { total: 0, ok: 0, degraded: 0, blocked: 0, manualReview: 0, criticalBlocked: 0 },
  );

  return {
    ok: summary.criticalBlocked === 0,
    generatedAt: checkedAt,
    summary,
    connectors,
    doctrine: {
      productionRepo: "AthlyXAI/AthlynX-V2-Official",
      productionVercelProject: "chad-a-doziers-projects/athlynx-platform",
      defaultOwnerLane: "chaddozier75@gmail.com",
      secretRule: "Never commit plaintext passwords, tokens, cookies, private keys, or .env values.",
    },
  };
}

export function emitConnectorHealthToSentry(snapshot = getConnectorHealthSnapshot()) {
  const severity = snapshot.summary.criticalBlocked > 0 ? "error" : snapshot.summary.blocked > 0 ? "warning" : "info";
  Sentry.addBreadcrumb({
    category: "connector-health",
    level: severity,
    message: `Connector sweep: ${snapshot.summary.ok}/${snapshot.summary.total} ok, ${snapshot.summary.blocked} blocked`,
    data: {
      total: snapshot.summary.total,
      ok: snapshot.summary.ok,
      blocked: snapshot.summary.blocked,
      degraded: snapshot.summary.degraded,
      manualReview: snapshot.summary.manualReview,
      criticalBlocked: snapshot.summary.criticalBlocked,
    },
  });

  if (snapshot.summary.criticalBlocked > 0) {
    Sentry.captureMessage("AthlynXAI connector health critical blocker detected", {
      level: "error",
      tags: { subsystem: "connector-health", app: "athlynx-platform" },
      extra: {
        summary: snapshot.summary,
        blocked: snapshot.connectors
          .filter((c) => c.status === "blocked")
          .map((c) => ({ id: c.id, label: c.label, tier: c.tier, lane: c.lane, missingEnv: c.missingEnv })),
      },
    });
  }

  return {
    emitted: true,
    severity,
    ts: Date.now(),
    proof: {
      channel: "sentry-sanitized-telemetry",
      payload: "summary-counts-and-connector-ids-only",
      secretsIncluded: false,
    },
  };
}

export function connectorHealthSelfTest() {
  const snapshot = getConnectorHealthSnapshot();
  const checks = [
    { name: "registry has critical connectors", pass: snapshot.connectors.some((c) => c.tier === "critical") },
    { name: "secret rule is present", pass: snapshot.doctrine.secretRule.includes("Never commit") },
    { name: "oauth connectors require same-session proof", pass: snapshot.connectors.some((c) => c.kind === "oauth" && c.status === "manual_review") },
    { name: "summary counts match registry", pass: snapshot.summary.total === snapshot.connectors.length },
    { name: "sentry connector registered", pass: snapshot.connectors.some((c) => c.id === "sentry") },
  ];
  return {
    ok: checks.every((c) => c.pass),
    checks,
    snapshot: {
      generatedAt: snapshot.generatedAt,
      summary: snapshot.summary,
      doctrine: snapshot.doctrine,
    },
  };
}

export function connectorHealthRegistry() {
  return CONNECTORS.map(({ requiredEnv, anyEnv, ...safe }) => ({
    ...safe,
    requiredEnvCount: requiredEnv?.length ?? 0,
    anyEnvCount: anyEnv?.length ?? 0,
  }));
}
