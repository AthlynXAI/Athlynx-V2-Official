/**
 * Owner Notification Service — AthlynX
 * Sends owner alerts via SendGrid email and optionally Twilio SMS.
 * NO notification endpoints. NO forgeApiUrl. NO forgeApiKey.
 */

export type NotificationPayload = {
  title: string;
  content: string;
};

const TITLE_MAX_LENGTH = 1200;
const CONTENT_MAX_LENGTH = 20000;

const trimValue = (value: string): string => value.trim();
const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const validatePayload = (input: NotificationPayload): NotificationPayload => {
  if (!isNonEmptyString(input.title)) {
    throw new Error("Notification title is required.");
  }
  if (!isNonEmptyString(input.content)) {
    throw new Error("Notification content is required.");
  }

  const title = trimValue(input.title);
  const content = trimValue(input.content);

  if (title.length > TITLE_MAX_LENGTH) {
    throw new Error(`Notification title must be at most ${TITLE_MAX_LENGTH} characters.`);
  }

  if (content.length > CONTENT_MAX_LENGTH) {
    throw new Error(`Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`);
  }

  return { title, content };
};

/**
 * Notify the platform owner via SendGrid email.
 * Returns true if delivered, false on failure.
 * Replaces the old WebDevService/SendNotification endpoint.
 */
export async function notifyOwner(
  payload: NotificationPayload
): Promise<boolean> {
  const { title, content } = validatePayload(payload);

  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || "noreply@athlynx.ai";
  const ownerEmail = process.env.OWNER_EMAIL || "cdozier14@athlynx.ai";

  if (!apiKey) {
    console.warn("[Notification] SENDGRID_API_KEY not set — skipping owner notification");
    return false;
  }

  try {
    const { default: sgMail } = await import("@sendgrid/mail");
    sgMail.setApiKey(apiKey);

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a1628;color:#fff;padding:32px;border-radius:12px;">
        <div style="font-size:24px;font-weight:900;letter-spacing:2px;color:#00d4ff;margin-bottom:8px;">AthlynX</div>
        <div style="font-size:11px;letter-spacing:3px;color:#94a3b8;margin-bottom:24px;">PLATFORM NOTIFICATION</div>
        <h2 style="color:#fff;font-size:18px;margin:0 0 16px;">${title}</h2>
        <div style="background:#0d2b5e;border-radius:8px;padding:20px;white-space:pre-wrap;font-size:14px;line-height:1.6;color:#cbd5e1;">${content}</div>
        <p style="color:#475569;font-size:12px;margin-top:24px;">Sent by AthlynX Platform · ${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })} CST</p>
      </div>
    `;

    await sgMail.send({
      to: ownerEmail,
      from: { email: fromEmail, name: "AthlynX Platform" },
      subject: `[AthlynX] ${title}`,
      html,
      text: `${title}\n\n${content}`,
    });

    console.log(`[Notification] Owner notified: "${title}"`);
    return true;
  } catch (error) {
    console.warn("[Notification] SendGrid owner notification failed:", error);
    return false;
  }
}
