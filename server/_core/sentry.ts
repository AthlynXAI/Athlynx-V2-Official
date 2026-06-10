import * as Sentry from "@sentry/node";

const SENSITIVE_KEY_PARTS = [
  "authorization",
  "cookie",
  "set-cookie",
  "x-api-key",
  "stripe-signature",
  "x-vercel-oidc-token",
  "password",
  "newpassword",
  "token",
  "secret",
  "apikey",
  "api_key",
  "session",
  "stripe",
  "airtable",
  "database",
  "databaseurl",
  "openai",
  "anthropic",
  "gemini",
  "nebius",
  "aws",
  "cloudflare",
  "twilio",
];

const SENSITIVE_QUERY_PARTS = [
  "token",
  "code",
  "state",
  "invitetoken",
  "session",
  "key",
  "secret",
  "password",
];

function isSensitiveKey(key: string): boolean {
  const normalized = key.toLowerCase().replace(/[-_\s]/g, "");
  return SENSITIVE_KEY_PARTS.some((part) => normalized.includes(part.replace(/[-_\s]/g, "")));
}

function scrubValue(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === "string") return value.length > 0 ? "[Filtered]" : value;
  if (typeof value === "number" || typeof value === "boolean") return "[Filtered]";
  return "[Filtered]";
}

export function scrubObject<T = unknown>(value: T, depth = 0): T {
  if (value === null || value === undefined) return value;
  if (depth > 5) return "[Filtered]" as T;
  if (Array.isArray(value)) {
    return value.map((item) => scrubObject(item, depth + 1)) as T;
  }
  if (typeof value !== "object") return value;

  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    if (isSensitiveKey(key)) {
      result[key] = scrubValue(val);
    } else {
      result[key] = scrubObject(val, depth + 1);
    }
  }
  return result as T;
}

export function scrubUrl(rawUrl?: string): string | undefined {
  if (!rawUrl) return rawUrl;
  try {
    const parsed = new URL(rawUrl, "https://athlynx.ai");
    for (const key of Array.from(parsed.searchParams.keys())) {
      const normalized = key.toLowerCase().replace(/[-_\s]/g, "");
      if (SENSITIVE_QUERY_PARTS.some((part) => normalized.includes(part))) {
        parsed.searchParams.set(key, "[Filtered]");
      }
    }
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return rawUrl.replace(
      /(token|code|state|inviteToken|session|key|secret|password)=([^&]+)/gi,
      "$1=[Filtered]"
    );
  }
}

export function initServerSentry(): void {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.VERCEL_ENV || process.env.NODE_ENV || "production",
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0,
    sendDefaultPii: false,
    initialScope: {
      tags: {
        app: "athlynx-platform",
        runtime: "server",
      },
    },
    beforeSend(event) {
      event.tags = {
        ...event.tags,
        app: "athlynx-platform",
        runtime: "server",
      };
      if (event.request) {
        event.request.headers = scrubObject(event.request.headers);
        event.request.cookies = undefined;
        event.request.data = scrubObject(event.request.data);
        event.request.url = scrubUrl(event.request.url);
        event.request.query_string = undefined;
      }
      event.extra = scrubObject(event.extra);
      event.contexts = scrubObject(event.contexts);
      event.breadcrumbs = event.breadcrumbs?.map((breadcrumb) => ({
        ...breadcrumb,
        data: scrubObject(breadcrumb.data),
      }));
      return event;
    },
    beforeSendTransaction(event) {
      event.tags = {
        ...event.tags,
        app: "athlynx-platform",
        runtime: "server",
      };
      if (event.request) {
        event.request.headers = scrubObject(event.request.headers);
        event.request.cookies = undefined;
        event.request.data = scrubObject(event.request.data);
        event.request.url = scrubUrl(event.request.url);
        event.request.query_string = undefined;
      }
      event.contexts = scrubObject(event.contexts);
      return event;
    },
  });
}

export { Sentry };
