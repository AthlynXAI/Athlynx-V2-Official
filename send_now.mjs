// send_now.mjs — one-off welcome email/SMS sender
// ────────────────────────────────────────────────────────────────────────────
// Hardcoded AWS IAM access key removed 2026-05-08. The previous key was
// rotated. This script now reads BOTH the access key id and the secret
// from env vars only:
//
//   AWS_ACCESS_KEY_ID=...     (IAM key id)
//   AWS_SECRET_ACCESS_KEY=... (IAM secret)
//   AWS_REGION=us-east-1      (optional, default us-east-1)
//
// Run it ad-hoc when you need to nudge yourself a welcome email/SMS.
// ────────────────────────────────────────────────────────────────────────────
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const KEY = process.env.AWS_ACCESS_KEY_ID;
const SECRET = process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET;
const REGION = process.env.AWS_REGION || 'us-east-1';

if (!KEY || !SECRET) {
  console.error(
    'Missing AWS_ACCESS_KEY_ID and/or AWS_SECRET_ACCESS_KEY. Set them and retry.'
  );
  process.exit(1);
}

console.log('AWS credentials loaded from environment.');

const sesClient = new SESClient({
  region: REGION,
  credentials: { accessKeyId: KEY, secretAccessKey: SECRET }
});

const snsClient = new SNSClient({
  region: REGION,
  credentials: { accessKeyId: KEY, secretAccessKey: SECRET }
});

// Send email
try {
  const emailResult = await sesClient.send(new SendEmailCommand({
    Source: 'cdozier14@athlynx.ai',
    Destination: { ToAddresses: ['cdozier14@athlynx.ai'] },
    Message: {
      Subject: { Data: 'ATHLYNX - Welcome to The Playbook' },
      Body: { Text: { Data: "You just signed in to ATHLYNX. Welcome to The Athlete's Playbook!" } }
    }
  }));
  console.log('Email sent:', emailResult.MessageId);
} catch (err) {
  console.error('Email failed:', err.message);
}

// Send SMS
try {
  const smsResult = await snsClient.send(new PublishCommand({
    PhoneNumber: process.env.OWNER_PHONE || '+16014985282',
    Message: 'ATHLYNX: Welcome to The Athlete\'s Playbook. Your account is active.'
  }));
  console.log('SMS sent:', smsResult.MessageId);
} catch (err) {
  console.error('SMS failed:', err.message);
}
