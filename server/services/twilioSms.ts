// Thin Build 1 wrapper around the existing twilio-sms service.
// Pure function exports, lazy init, throws on missing env.
import { sendSMS } from "./twilio-sms";

export async function sendSms(to: string, body: string): Promise<{ ok: boolean }> {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    throw new Error("Twilio is not configured");
  }
  const ok = await sendSMS(to, body);
  return { ok };
}

// Telemetry: structured logs via console.error/warn captured by Vercel Log Drains.
// Upgrade path: wire Sentry SDK (server/services/sentry.ts) in Build 2 observability sprint.
