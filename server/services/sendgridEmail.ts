// SendGrid templated email wrapper — Build 1.
// Lazy import keeps the SDK out of cold-start unless actually used.

export async function sendTemplatedEmail(
  to: string,
  templateId: string,
  dynamicData: Record<string, unknown> = {}
): Promise<{ ok: boolean; statusCode?: number }> {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    throw new Error("SENDGRID_API_KEY is not configured");
  }
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || "noreply@athlynx.ai";
  const fromName = process.env.SENDGRID_FROM_NAME || "AthlynX";

  const { default: sgMail } = await import("@sendgrid/mail");
  sgMail.setApiKey(apiKey);

  const [resp] = await sgMail.send({
    to,
    from: { email: fromEmail, name: fromName },
    templateId,
    dynamicTemplateData: dynamicData,
  } as any);

  return { ok: resp.statusCode >= 200 && resp.statusCode < 300, statusCode: resp.statusCode };
}

export async function sendWelcomeEmail(to: string, data: Record<string, unknown> = {}) {
  const templateId = process.env.SENDGRID_WELCOME_TEMPLATE_ID;
  if (!templateId) throw new Error("SENDGRID_WELCOME_TEMPLATE_ID is not configured");
  return sendTemplatedEmail(to, templateId, data);
}

// Telemetry: structured logs via console.error/warn captured by Vercel Log Drains.
// Upgrade path: wire Sentry SDK (server/services/sentry.ts) in Build 2 observability sprint.
