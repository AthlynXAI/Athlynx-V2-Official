import { z } from "zod";

/**
 * Environment configuration — AthlynX
 * All values sourced from Vercel environment variables.
 * NO forge API keys. NO OAuth server URL.
 */
export const ENV = {
  // App identity
  appId: process.env.VITE_APP_ID ?? "athlynx",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.NEON_DATABASE_URL ?? process.env.DATABASE_URL ?? "",
  isProduction: process.env.NODE_ENV === "production",

  // Owner identity (for admin checks and notifications)
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  ownerEmail: process.env.OWNER_EMAIL ?? "chaddozier75@gmail.com",

  // Firebase Admin (server-side token verification)
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID ?? "athlynxai",

  // SendGrid
  sendgridApiKey: process.env.SENDGRID_API_KEY ?? "",
  sendgridFromEmail: process.env.SENDGRID_FROM_EMAIL ?? "noreply@athlynx.ai",
  sendgridWelcomeTemplateId: process.env.SENDGRID_WELCOME_TEMPLATE_ID ?? "",

  // Twilio
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID ?? "",
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN ?? "",
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER ?? "",

  // Stripe
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",

  // Airtable — AthlynXAI OS
  airtableApiKey: process.env.AIRTABLE_API_KEY ?? "",
  airtableBaseId: process.env.AIRTABLE_BASE_ID ?? "",

  // AWS S3 (for file storage)
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  awsRegion: process.env.AWS_REGION ?? "us-east-1",
  awsS3Bucket: process.env.AWS_S3_BUCKET ?? "",

  // Anthropic Claude — third AI engine (deep reasoning, contract analysis, NIL evaluation)
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
};

const serverEnvSchema = z.object({
  AIRTABLE_API_KEY: z
    .string()
    .trim()
    .min(1, "Airtable API token is required for AthlynXAI OS"),
  AIRTABLE_BASE_ID: z
    .string()
    .trim()
    .min(1, "Airtable Base ID is required for AthlynXAI OS")
    .regex(/^app[A-Za-z0-9]+$/, "Airtable Base ID must start with app"),
  STRIPE_SECRET_KEY: z
    .string()
    .trim()
    .min(1, "Stripe secret key is required for production billing"),
  STRIPE_WEBHOOK_SECRET: z
    .string()
    .trim()
    .min(1, "Stripe webhook secret is required for production billing"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function assertServerEnv(env: NodeJS.ProcessEnv = process.env): ServerEnv {
  const parsed = serverEnvSchema.safeParse(env);

  if (!parsed.success) {
    const missing = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "ENV"}: ${issue.message}`)
      .join("; ");

    throw new Error(`[Build 27 fail-fast env gate] ${missing}`);
  }

  return parsed.data;
}

export function hasRequiredServerEnv(env: NodeJS.ProcessEnv = process.env): boolean {
  return serverEnvSchema.safeParse(env).success;
}
