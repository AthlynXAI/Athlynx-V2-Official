/**
 * Sent.dm Messaging Service — AthlynXAI OS v1
 * Multi-channel messaging: WhatsApp-first → SMS → RCS fallback
 * API: https://api.sent.dm/v3/messages
 * Auth: x-api-key header
 *
 * Custom templates (post-KYC approval):
 *   OTP: 184a8f3d-d342-427a-9db8-615f73bb36e3
 *     Body: *{{var_1}}* is your verification code.
 *     var_1 = the 6-digit code
 *
 * Set SENT_TEMPLATE_OTP env var to override. Other templates use
 * the same ID as fallback until custom ones are created.
 *
 * Use cases:
 *  - sendOTP           : Login / signup verification codes
 *  - sendWelcome       : New athlete onboarding welcome
 *  - sendConsentConfirm: HIPAA + waiver signed confirmation
 *  - sendNILAlert      : NIL deal offer / update notification
 *  - sendScoreAlert    : Live game score update
 *  - sendScheduleAlert : Upcoming game / practice reminder
 *  - sendBroadcast     : Coach / agent mass message to roster
 *  - sendTransferAlert : Transfer portal activity notification
 *  - sendEndorsementAlert: Brand deal / endorsement notification
 *  - sendOwnerAlert    : Notify Chad Dozier of key platform events
 */

const SENT_API_BASE = "https://api.sent.dm/v3";

function getSentApiKey(): string | null {
  return process.env.SENT_API_KEY ?? null;
}

interface SentMessagePayload {
  to: string[];
  template: {
    id: string;
    parameters?: Record<string, string>;
  };
  channel?: ("sms" | "whatsapp" | "rcs")[];
  sandbox?: boolean;
}

interface SentRecipient {
  message_id: string;
  to: string;
  channel: string;
}

interface SentResponse {
  success: boolean;
  data?: {
    status: string;
    template_id: string;
    recipients: SentRecipient[];
  };
  error?: string | { code: string; message: string; doc_url?: string } | null;
  meta?: {
    request_id: string;
    timestamp: string;
    version: string;
  };
}

let _idempotencyCounter = 0;
function makeIdempotencyKey(prefix: string): string {
  _idempotencyCounter++;
  return `${prefix}_${Date.now()}_${_idempotencyCounter}`;
}

/**
 * Core send function — posts to Sent API v3
 */
async function sendMessage(
  payload: SentMessagePayload,
  idempotencyKey?: string
): Promise<{ ok: boolean; messageIds?: string[]; error?: string }> {
  const apiKey = getSentApiKey();
  if (!apiKey) {
    console.warn("[Sent] SENT_API_KEY not configured — skipping message");
    return { ok: false, error: "SENT_API_KEY not configured" };
  }

  const iKey = idempotencyKey ?? makeIdempotencyKey("req_athlynx");

  try {
    const res = await fetch(`${SENT_API_BASE}/messages`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Idempotency-Key": iKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json: SentResponse = await res.json();

    if (!res.ok || !json.success) {
      const errMsg = typeof json.error === "object" && json.error !== null
        ? json.error.message
        : (json.error as string) ?? `HTTP ${res.status}`;
      console.error(`[Sent] API error ${res.status}:`, errMsg);
      return { ok: false, error: errMsg };
    }

    const messageIds = json.data?.recipients.map((r) => r.message_id) ?? [];
    console.log(
      `[Sent] ✅ Message queued — ${messageIds.length} recipient(s), ` +
      `status: ${json.data?.status}, request: ${json.meta?.request_id}`
    );
    return { ok: true, messageIds };
  } catch (err) {
    console.error("[Sent] Network error:", err);
    return { ok: false, error: err instanceof Error ? err.message : "Network error" };
  }
}

/**
 * Format phone to E.164 (+1XXXXXXXXXX)
 */
function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (phone.startsWith("+")) return phone;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return `+${digits}`;
}

// ─── Template IDs ────────────────────────────────────────────────────────────
// Sent.dm uses template `id` (UUID) in the API payload for custom templates.
// OTP template approved: 184a8f3d-d342-427a-9db8-615f73bb36e3
// Other templates: use the same OTP template as fallback until custom ones created.
const OTP_TEMPLATE_ID = "184a8f3d-d342-427a-9db8-615f73bb36e3";
const TEMPLATES = {
  OTP:               process.env.SENT_TEMPLATE_OTP               ?? OTP_TEMPLATE_ID,
  WELCOME:           process.env.SENT_TEMPLATE_WELCOME           ?? OTP_TEMPLATE_ID,
  CONSENT_CONFIRM:   process.env.SENT_TEMPLATE_CONSENT           ?? OTP_TEMPLATE_ID,
  NIL_ALERT:         process.env.SENT_TEMPLATE_NIL               ?? OTP_TEMPLATE_ID,
  SCORE_ALERT:       process.env.SENT_TEMPLATE_SCORE             ?? OTP_TEMPLATE_ID,
  SCHEDULE_ALERT:    process.env.SENT_TEMPLATE_SCHEDULE          ?? OTP_TEMPLATE_ID,
  BROADCAST:         process.env.SENT_TEMPLATE_BROADCAST         ?? OTP_TEMPLATE_ID,
  TRANSFER_ALERT:    process.env.SENT_TEMPLATE_TRANSFER          ?? OTP_TEMPLATE_ID,
  ENDORSEMENT_ALERT: process.env.SENT_TEMPLATE_ENDORSEMENT       ?? OTP_TEMPLATE_ID,
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Send a one-time password / verification code
 * WhatsApp-first, SMS fallback
 * Template: 184a8f3d-d342-427a-9db8-615f73bb36e3
 * Body: *{var_1}* is your verification code.
 */
export async function sendOTP(
  phone: string,
  code: string,
  _name?: string
): Promise<boolean> {
  const result = await sendMessage({
    to: [formatPhone(phone)],
    template: {
      id: TEMPLATES.OTP,
      parameters: { var_1: code },
    },
    channel: ["whatsapp", "sms"],
  }, makeIdempotencyKey("otp"));
  return result.ok;
}

/**
 * Send welcome message to new athlete on signup
 * Uses Verify_Code_1 until custom welcome template is approved
 */
export async function sendWelcomeSent(
  phone: string,
  _name: string
): Promise<boolean> {
  // Post-KYC: replace with custom welcome template name
  // For now, send a Verify_Code_1 as a placeholder ping
  const result = await sendMessage({
    to: [formatPhone(phone)],
    template: {
      id: TEMPLATES.WELCOME,
      parameters: { var_1: "Welcome to AthlynXAI — Be The Legacy" },
    },
    channel: ["whatsapp", "sms"],
  }, makeIdempotencyKey("welcome"));
  return result.ok;
}

/**
 * Confirm HIPAA + AthlynX Medical Data Waiver signed
 */
export async function sendConsentConfirmation(
  phone: string,
  _name: string,
  _signedAt: Date
): Promise<boolean> {
  const result = await sendMessage({
    to: [formatPhone(phone)],
    template: {
      id: TEMPLATES.CONSENT_CONFIRM,
      parameters: { var_1: "HIPAA + AthlynX Waiver signed. Be The Legacy." },
    },
    channel: ["whatsapp", "sms"],
  }, makeIdempotencyKey("consent"));
  return result.ok;
}

/**
 * Alert athlete of a new NIL deal offer or update
 */
export async function sendNILAlert(
  phone: string,
  _name: string,
  brandName: string,
  dealValue: string,
  action: "new_offer" | "counter" | "signed" | "expired"
): Promise<boolean> {
  const actionText: Record<string, string> = {
    new_offer: `NIL offer from ${brandName}: ${dealValue}`,
    counter:   `${brandName} countered: ${dealValue}`,
    signed:    `NIL deal with ${brandName} signed! ${dealValue}`,
    expired:   `NIL offer from ${brandName} expired`,
  };
  const result = await sendMessage({
    to: [formatPhone(phone)],
    template: {
      id: TEMPLATES.NIL_ALERT,
      parameters: { var_1: actionText[action] ?? `NIL update from ${brandName}` },
    },
    channel: ["whatsapp", "sms"],
  }, makeIdempotencyKey("nil"));
  return result.ok;
}

/**
 * Send live score alert
 */
export async function sendScoreAlert(
  phones: string[],
  homeTeam: string,
  awayTeam: string,
  homeScore: number,
  awayScore: number,
  status: string
): Promise<boolean> {
  const result = await sendMessage({
    to: phones.map(formatPhone),
    template: {
      id: TEMPLATES.SCORE_ALERT,
      parameters: {
        var_1: `${homeTeam} ${homeScore} - ${awayScore} ${awayTeam} | ${status}`,
      },
    },
    channel: ["whatsapp", "sms"],
  }, makeIdempotencyKey("score"));
  return result.ok;
}

/**
 * Send schedule reminder (game, practice, camp, tournament)
 */
export async function sendScheduleAlert(
  phone: string,
  _name: string,
  eventName: string,
  eventDate: string,
  location: string,
  eventType: "game" | "practice" | "camp" | "tournament" | "combine"
): Promise<boolean> {
  const result = await sendMessage({
    to: [formatPhone(phone)],
    template: {
      id: TEMPLATES.SCHEDULE_ALERT,
      parameters: {
        var_1: `${eventType.toUpperCase()}: ${eventName} — ${eventDate} @ ${location}`,
      },
    },
    channel: ["whatsapp", "sms"],
  }, makeIdempotencyKey("schedule"));
  return result.ok;
}

/**
 * Coach / agent broadcast message to entire roster
 * Sends to multiple recipients in a single API call (up to 100 per chunk)
 */
export async function sendBroadcast(
  phones: string[],
  _senderName: string,
  message: string,
  _subject?: string
): Promise<{ ok: boolean; sent: number; failed: number }> {
  if (phones.length === 0) return { ok: false, sent: 0, failed: 0 };

  const CHUNK_SIZE = 100;
  let totalSent = 0;
  let totalFailed = 0;

  for (let i = 0; i < phones.length; i += CHUNK_SIZE) {
    const chunk = phones.slice(i, i + CHUNK_SIZE).map(formatPhone);
    const result = await sendMessage({
      to: chunk,
      template: {
        id: TEMPLATES.BROADCAST,
        parameters: { var_1: message.substring(0, 160) },
      },
      channel: ["whatsapp", "sms"],
    }, makeIdempotencyKey(`broadcast_chunk_${i}`));
    if (result.ok) {
      totalSent += chunk.length;
    } else {
      totalFailed += chunk.length;
    }
  }

  return { ok: totalFailed === 0, sent: totalSent, failed: totalFailed };
}

/**
 * Transfer portal activity alert
 */
export async function sendTransferAlert(
  phone: string,
  _name: string,
  action: "entered" | "offer_received" | "committed" | "withdrawn",
  schoolName?: string
): Promise<boolean> {
  const actionText: Record<string, string> = {
    entered:        "You've entered the Transfer Portal — AthlynXAI",
    offer_received: `Transfer offer from ${schoolName ?? "a school"} — AthlynXAI`,
    committed:      `Committed to ${schoolName ?? "a new school"} — AthlynXAI`,
    withdrawn:      "Withdrawn from the Transfer Portal — AthlynXAI",
  };
  const result = await sendMessage({
    to: [formatPhone(phone)],
    template: {
      id: TEMPLATES.TRANSFER_ALERT,
      parameters: { var_1: actionText[action] },
    },
    channel: ["whatsapp", "sms"],
  }, makeIdempotencyKey("transfer"));
  return result.ok;
}

/**
 * Endorsement / brand deal alert
 */
export async function sendEndorsementAlert(
  phone: string,
  _name: string,
  brandName: string,
  dealType: string,
  value: string
): Promise<boolean> {
  const result = await sendMessage({
    to: [formatPhone(phone)],
    template: {
      id: TEMPLATES.ENDORSEMENT_ALERT,
      parameters: {
        var_1: `${dealType} deal with ${brandName}: ${value} — AthlynXAI`,
      },
    },
    channel: ["whatsapp", "sms"],
  }, makeIdempotencyKey("endorsement"));
  return result.ok;
}

/**
 * Owner alert — notify Chad Dozier of key platform events
 */
export async function sendOwnerAlert(
  eventType: string,
  details: Record<string, string>
): Promise<boolean> {
  const ownerPhone = process.env.OWNER_PHONE ?? process.env.ADMIN_PHONE;
  if (!ownerPhone) return false;

  const detailStr = Object.entries(details)
    .map(([k, v]) => `${k}: ${v}`)
    .join(" | ");

  const result = await sendMessage({
    to: [formatPhone(ownerPhone)],
    template: {
      id: TEMPLATES.BROADCAST,
      parameters: { var_1: `[${eventType}] ${detailStr}`.substring(0, 160) },
    },
    channel: ["whatsapp", "sms"],
  }, makeIdempotencyKey("owner_alert"));
  return result.ok;
}
