/**
 * AWS SNS SMS Service — AthlynXAI
 * Sends SMS messages via AWS SNS using toll-free number +18664502081
 * Toll-free number carrier-approved May 1 2026
 */
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

// Toll-free number — carrier approved May 1, 2026
const TOLL_FREE_NUMBER = process.env.AWS_SNS_ORIGINATION_NUMBER || "+18664502081";

function getSNSClient() {
  return new SNSClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });
}

/**
 * Send an SMS via AWS SNS using toll-free origination number.
 * Returns true on success, false on failure (never throws).
 */
export async function sendSMS(to: string, body: string): Promise<boolean> {
  const accessKey = process.env.AWS_ACCESS_KEY_ID;
  const secretKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKey || !secretKey) {
    console.warn("[AWS SNS] Missing credentials — skipping SMS to", to);
    return false;
  }

  try {
    const formattedPhone = to.startsWith("+") ? to : `+1${to.replace(/\D/g, "")}`;
    const sns = getSNSClient();

    const command = new PublishCommand({
      PhoneNumber: formattedPhone,
      Message: body,
      MessageAttributes: {
        "AWS.SNS.SMS.SMSType": {
          DataType: "String",
          StringValue: "Transactional",
        },
        "AWS.MM.SMS.OriginationNumber": {
          DataType: "String",
          StringValue: TOLL_FREE_NUMBER,
        },
      },
    });

    const result = await sns.send(command);
    console.log(`[AWS SNS] SMS sent to ${formattedPhone} from ${TOLL_FREE_NUMBER} — MessageId: ${result.MessageId}`);
    return true;
  } catch (error) {
    console.error("[AWS SNS Error]", error);
    return false;
  }
}

/**
 * Send welcome SMS to a new user.
 */
export async function sendWelcomeSMS(phone: string, name: string): Promise<boolean> {
  const message = `Welcome to AthlynX, ${name}! Your account is active. Sign in at athlynx.ai. Iron Sharpens Iron. — Chad A. Dozier Sr., Founder`;
  return sendSMS(phone, message);
}

/**
 * Send owner alert when a new user signs up.
 */
export async function sendOwnerSignupSMSAlert(opts: {
  name: string;
  email: string;
  memberNumber?: number;
}): Promise<boolean> {
  const ownerPhone = process.env.OWNER_PHONE ?? "+16014985282";
  const memberStr = opts.memberNumber ? ` #${opts.memberNumber}` : "";
  const message = `[AthlynX] New member${memberStr}: ${opts.name} (${opts.email}) just signed up!`;
  return sendSMS(ownerPhone, message);
}
