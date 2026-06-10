/**
 * Twilio SMS Service — AthlynX
 * Sends SMS messages via Twilio REST API.
 * Uses Messaging Service SID for A2P 10DLC compliance.
 * Uses fetch — no SDK dependency required.
 */

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID ?? "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN ?? "";
// A2P 10DLC campaign-registered Messaging Service SID
const TWILIO_MESSAGING_SERVICE_SID =
  process.env.TWILIO_MESSAGING_SERVICE_SID ?? "MGd107063da3402db3bd7e1ef57a5db20e";

/**
 * Send an SMS via Twilio REST API using the campaign-registered Messaging Service.
 * Returns true on success, false on failure (never throws).
 */
export async function sendSMS(to: string, body: string): Promise<boolean> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    console.warn("[Twilio] Missing credentials — skipping SMS to", to);
    return false;
  }

  // Ensure E.164 format
  const toFormatted = to.startsWith("+") ? to : `+1${to.replace(/\D/g, "")}`;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  const credentials = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        MessagingServiceSid: TWILIO_MESSAGING_SERVICE_SID,
        To: toFormatted,
        Body: body,
      }).toString(),
    });

    const data = (await response.json()) as any;

    if (response.ok && data?.sid) {
      console.log(`[Twilio] SMS sent to ${toFormatted} — SID: ${data.sid}`);
      return true;
    } else {
      console.warn(`[Twilio] SMS failed to ${toFormatted}:`, data?.message ?? JSON.stringify(data));
      return false;
    }
  } catch (err: any) {
    console.warn(`[Twilio] SMS error to ${toFormatted}:`, err?.message);
    return false;
  }
}

/**
 * Send the AthlynX welcome SMS to a new user.
 * Safe to call fire-and-forget — never throws.
 */
export async function sendWelcomeSMS(
  phone: string,
  name: string,
  memberNumber?: number
): Promise<boolean> {
  const memberStr = memberNumber ? ` #${memberNumber}` : "";
  const message =
    `🏆 Welcome to AthlynX${memberStr}, ${name}! ` +
    `Your athlete platform is live. Login at https://athlynx.ai ` +
    `— AI Recruiter, NIL Portal, Transfer Portal & more await. Let's go! 🚀`;

  return sendSMS(phone, message);
}

/**
 * Send an SMS alert to the owner when a new user signs up.
 * Safe to call fire-and-forget — never throws.
 */
export async function sendOwnerSignupSMSAlert(opts: {
  name: string;
  email: string;
  memberNumber?: number;
}): Promise<boolean> {
  const ownerPhone = process.env.OWNER_PHONE ?? "+16014985282";
  if (!ownerPhone) return false;

  const memberStr = opts.memberNumber ? ` #${opts.memberNumber}` : "";
  const message =
    `[AthlynX] New member${memberStr}: ${opts.name} (${opts.email}) just signed up! 🏆`;

  return sendSMS(ownerPhone, message);
}
