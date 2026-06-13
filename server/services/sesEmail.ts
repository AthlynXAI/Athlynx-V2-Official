// AWS SES wrapper — Build 1. Wraps the existing aws-ses service file with the
// mandate-named function signature.
import { sendEmail } from "./aws-ses";

export async function sendSesEmail(to: string, subject: string, body: string): Promise<{ ok: boolean }> {
  if (!process.env.AWS_ACCESS_KEY_ID && !process.env.AWS_SES_ACCESS_KEY_ID && !process.env.SENDGRID_API_KEY) {
    throw new Error("AWS SES is not configured (and no SendGrid fallback present)");
  }
  const ok = await sendEmail({ to, subject, html: body, text: body });
  return { ok };
}

// Telemetry: structured logs via console.error/warn captured by Vercel Log Drains.
// Upgrade path: wire Sentry SDK (server/services/sentry.ts) in Build 2 observability sprint.
