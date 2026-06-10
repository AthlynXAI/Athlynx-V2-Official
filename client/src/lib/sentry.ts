import * as Sentry from "@sentry/react";

function scrubClientUrl(rawUrl?: string): string | undefined {
  if (!rawUrl) return rawUrl;
  try {
    const parsed = new URL(rawUrl, window.location.origin);
    for (const key of Array.from(parsed.searchParams.keys())) {
      const normalized = key.toLowerCase().replace(/[-_\s]/g, "");
      if (["token", "code", "state", "invitetoken", "session", "key", "secret", "password"].some((part) => normalized.includes(part))) {
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

export function initClientSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE || "production",
    tracesSampleRate: import.meta.env.PROD ? 0.05 : 0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    sendDefaultPii: false,
    initialScope: {
      tags: {
        app: "athlynx-platform",
        runtime: "browser",
      },
    },
    beforeSend(event) {
      event.tags = {
        ...event.tags,
        app: "athlynx-platform",
        runtime: "browser",
      };
      if (event.request) {
        event.request.headers = undefined;
        event.request.cookies = undefined;
        event.request.data = "[Filtered]";
        event.request.query_string = undefined;
        event.request.url = scrubClientUrl(event.request.url);
      }
      event.extra = undefined;
      event.contexts = undefined;
      event.breadcrumbs = event.breadcrumbs?.map((breadcrumb) => ({
        ...breadcrumb,
        data: undefined,
      }));
      return event;
    },
    beforeSendTransaction(event) {
      event.tags = {
        ...event.tags,
        app: "athlynx-platform",
        runtime: "browser",
      };
      if (event.request) {
        event.request.headers = undefined;
        event.request.cookies = undefined;
        event.request.data = "[Filtered]";
        event.request.query_string = undefined;
        event.request.url = scrubClientUrl(event.request.url);
      }
      event.contexts = undefined;
      return event;
    },
  });
}

export { Sentry };
