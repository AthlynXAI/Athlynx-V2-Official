/**
 * AWS SES Email Service — AthlynX
 * Primary: AWS SES | Fallback: SendGrid
 */

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const FROM_EMAIL = process.env.SES_FROM_EMAIL || "chaddozier75@gmail.com";
const FROM_NAME = "AthlynX";

function getSESClient() {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || "us-east-1";
  if (!accessKeyId || !secretAccessKey) return null;
  return new SESClient({ region, credentials: { accessKeyId, secretAccessKey } });
}

async function trySendGrid(to: string, subject: string, html: string, text?: string): Promise<boolean> {
  const key = process.env.SENDGRID_API_KEY;
  if (!key) return false;
  try {
    const { default: sgMail } = await import("@sendgrid/mail");
    sgMail.setApiKey(key);
    await sgMail.send({ to, from: { email: FROM_EMAIL, name: FROM_NAME }, subject, html, ...(text ? { text } : {}) });
    console.log(`[SendGrid] Email sent to ${to}: "${subject}"`);
    return true;
  } catch (err: any) {
    console.error("[SendGrid] Failed:", err.message);
    return false;
  }
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email via AWS SES with SendGrid fallback.
 */
export async function sendEmail(opts: EmailOptions): Promise<boolean> {
  const { to, subject, html, text } = opts;

  // Primary: AWS SES
  const ses = getSESClient();
  if (ses) {
    try {
      await (ses as any).send(new SendEmailCommand({
        Source: `${FROM_NAME} <${FROM_EMAIL}>`,
        Destination: { ToAddresses: [to] },
        Message: {
          Subject: { Data: subject, Charset: "UTF-8" },
          Body: {
            Html: { Data: html, Charset: "UTF-8" },
            ...(text ? { Text: { Data: text, Charset: "UTF-8" } } : {}),
          },
        },
      }));
      console.log(`[SES] Email sent to ${to}: "${subject}"`);
      return true;
    } catch (err: any) {
      console.error("[SES] Failed, trying SendGrid fallback:", err.message);
    }
  }

  // Fallback: SendGrid
  return trySendGrid(to, subject, html, text);
}

// ─── Email Templates ───────────────────────────────────────────────────────

export async function sendWelcomeEmail(to: string, name: string, memberNumber?: number): Promise<boolean> {
  const memberNum = memberNumber ? String(memberNumber).padStart(4, "0") : null;
  const signedUpStr = new Date().toLocaleString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", timeZone: "America/Chicago", timeZoneName: "short",
  });
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#0d1b3e;border-radius:16px;overflow:hidden;border:1px solid #1e3a6e;">
<tr><td style="background:linear-gradient(135deg,#0066ff,#00c2ff);padding:40px;text-align:center;">
  <div style="font-size:48px;font-weight:900;color:#fff;letter-spacing:4px;">AthlynX</div>
  <div style="font-size:13px;color:rgba(255,255,255,0.8);letter-spacing:6px;margin-top:6px;">THE ATHLETE'S PLAYBOOK</div>
</td></tr>
<tr><td style="padding:40px;">
  <h2 style="color:#fff;font-size:24px;margin:0 0 16px;">Welcome to the Family, ${name}! 🏆</h2>
  ${memberNum ? `<div style="text-align:center;margin-bottom:20px;"><span style="display:inline-block;background:linear-gradient(135deg,#0066ff,#00c2ff);color:#fff;font-size:13px;font-weight:900;padding:8px 24px;border-radius:50px;letter-spacing:2px;">MEMBER #${memberNum}</span></div>` : ""}
  <!-- CREDENTIALS BLOCK -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a1628;border-radius:10px;overflow:hidden;margin-bottom:24px;border:1px solid #1e3a6e;">
    ${memberNum ? `<tr><td style="padding:12px 16px;border-bottom:1px solid #1e3a6e;"><span style="color:#94a3b8;font-size:11px;display:block;margin-bottom:2px;">YOUR MEMBER NUMBER</span><span style="color:#00c2ff;font-size:20px;font-weight:900;letter-spacing:2px;">#${memberNum}</span></td></tr>` : ""}
    <tr><td style="padding:12px 16px;border-bottom:1px solid #1e3a6e;"><span style="color:#94a3b8;font-size:11px;display:block;margin-bottom:2px;">YOUR LOGIN (USERNAME)</span><span style="color:#fff;font-size:14px;font-weight:bold;">${to}</span></td></tr>
    <tr><td style="padding:12px 16px;border-bottom:1px solid #1e3a6e;"><span style="color:#94a3b8;font-size:11px;display:block;margin-bottom:2px;">JOINED</span><span style="color:#00c2ff;font-size:13px;font-weight:bold;">${signedUpStr}</span></td></tr>
    <tr><td style="padding:12px 16px;"><span style="color:#94a3b8;font-size:11px;display:block;margin-bottom:2px;">TRIAL</span><span style="color:#f59e0b;font-size:13px;font-weight:bold;">7 days FREE — card required, no charge until day 8</span></td></tr>
  </table>
  <p style="color:#94a3b8;font-size:16px;line-height:1.6;margin:0 0 24px;">
    Your AthlynX account is ready. Complete your setup, choose your plan, and add your card to unlock the full portal. <strong style="color:#00c2ff;">You won't be charged for 7 days.</strong>
  </p>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
    <tr><td style="padding:12px 16px;background:#1a3a8f;border-radius:8px;margin-bottom:8px;"><span style="color:#fff;font-size:14px;">🤖 <strong>LYNX AI Companion</strong> — Your personal AI for every sport scenario</span></td></tr>
    <tr><td style="height:8px;"></td></tr>
    <tr><td style="padding:12px 16px;background:#1a3a8f;border-radius:8px;"><span style="color:#fff;font-size:14px;">🏆 <strong>NIL Portal</strong> — Connect with brands and close deals</span></td></tr>
    <tr><td style="height:8px;"></td></tr>
    <tr><td style="padding:12px 16px;background:#1a3a8f;border-radius:8px;"><span style="color:#fff;font-size:14px;">📊 <strong>AI Recruiter</strong> — Get discovered by coaches nationwide</span></td></tr>
    <tr><td style="height:8px;"></td></tr>
    <tr><td style="padding:12px 16px;background:#1a3a8f;border-radius:8px;"><span style="color:#fff;font-size:14px;">💬 <strong>Messenger</strong> — Connect with athletes, agents, and coaches</span></td></tr>
    <tr><td style="height:8px;"></td></tr>
    <tr><td style="padding:12px 16px;background:#1a3a8f;border-radius:8px;"><span style="color:#fff;font-size:14px;">🎯 <strong>Transfer Portal</strong> — Navigate your path to a better program</span></td></tr>
  </table>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center">
      <a href="https://athlynx.ai/onboarding" style="display:inline-block;background:linear-gradient(135deg,#0066ff,#00c2ff);color:#fff;font-weight:900;font-size:16px;padding:16px 40px;border-radius:50px;text-decoration:none;letter-spacing:1px;">COMPLETE YOUR SETUP →</a>
    </td></tr>
  </table>
</td></tr>
<tr><td style="background:#060d1f;padding:24px;text-align:center;border-top:1px solid #1e3a6e;">
  <p style="color:#475569;font-size:12px;margin:0;">A Dozier Holdings Group Company · athlynx.ai</p>
  <p style="color:#334155;font-size:11px;margin:8px 0 0;">Questions? <a href="mailto:chaddozier75@gmail.com" style="color:#00c2ff;">chaddozier75@gmail.com</a></p>
  <p style="color:#334155;font-size:11px;margin:4px 0 0;">Isaiah 40:31 · Dreams Do Come True 2026 · A Dozier Holdings Group Company</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  return sendEmail({
    to,
    subject: memberNum ? `Welcome to AthlynX, ${name}! You are Member #${memberNum} 🏆` : `Welcome to AthlynX — Complete Your Setup 🏆`,
    html,
    text: `Welcome to AthlynX, ${name}!${memberNum ? ` You are Member #${memberNum}.` : ""} Login: ${to}. Joined: ${signedUpStr}. Complete your setup and choose your plan at https://athlynx.ai/onboarding — 7 days free, card required, no charge until day 8. Isaiah 40:31 · Dreams Do Come True 2026`,
  });
}

export async function sendVerificationEmail(
  to: string,
  code: string,
  name?: string,
  signupDate?: Date
): Promise<boolean> {
  const displayName = name || "Athlete";
  const firstName = displayName.split(" ")[0] || displayName;
  const dateStr = (signupDate || new Date()).toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Chicago",
    timeZoneName: "short",
  });
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Welcome to AthlynX</title></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#0d1b3e;border-radius:18px;overflow:hidden;border:1px solid #1e3a6e;">

<!-- HEADER -->
<tr><td style="background:linear-gradient(135deg,#0066ff,#00c2ff);padding:36px 40px;text-align:center;">
  <div style="font-size:38px;font-weight:900;color:#fff;letter-spacing:5px;">AthlynX</div>
  <div style="font-size:11px;color:rgba(255,255,255,0.85);letter-spacing:6px;margin-top:6px;">THE ATHLETE'S PLAYBOOK</div>
</td></tr>

<!-- GREETING + CODE -->
<tr><td style="padding:36px 40px 8px 40px;">
  <h2 style="color:#fff;font-size:24px;margin:0 0 10px;font-weight:800;">Welcome to AthlynX, ${firstName}.</h2>
  <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 28px;">You just joined something built by hand, on purpose. Use the code below to verify your account and unlock your <strong style="color:#00c2ff;">7-day free trial</strong>. Then keep reading — there's a letter from me below.</p>

  <!-- CODE BOX -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
    <tr><td align="center">
      <div style="background:linear-gradient(135deg,#0a1628,#0d2050);border:2px solid #0066ff;border-radius:16px;padding:28px 40px;display:inline-block;">
        <div style="font-size:12px;color:#94a3b8;letter-spacing:3px;margin-bottom:10px;">YOUR VERIFICATION CODE</div>
        <div style="font-size:48px;font-weight:900;color:#00c2ff;letter-spacing:14px;font-family:'Courier New',monospace;">${code}</div>
        <div style="font-size:12px;color:#475569;margin-top:10px;">Expires in 10 minutes</div>
      </div>
    </td></tr>
  </table>

  <!-- SIGN-IN CTA -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
    <tr><td align="center">
      <a href="https://athlynx.ai/signin" style="display:inline-block;background:linear-gradient(135deg,#0066ff,#00c2ff);color:#fff;font-weight:900;font-size:15px;padding:14px 36px;border-radius:50px;text-decoration:none;letter-spacing:1px;">SIGN IN TO AthlynX →</a>
    </td></tr>
  </table>
</td></tr>

<!-- DIVIDER -->
<tr><td style="padding:28px 40px 0 40px;">
  <div style="height:1px;background:linear-gradient(90deg,transparent,#1e3a6e,transparent);"></div>
</td></tr>

<!-- FOUNDER'S LETTER -->
<tr><td style="padding:28px 40px 12px 40px;">
  <div style="display:inline-block;background:rgba(0,102,255,0.12);border:1px solid rgba(0,194,255,0.35);color:#7dd3fc;font-size:10px;font-weight:900;letter-spacing:3px;padding:6px 14px;border-radius:50px;text-transform:uppercase;">Founder's Letter · No. 001</div>
  <h1 style="color:#fff;font-size:28px;line-height:1.25;margin:18px 0 6px;font-weight:900;letter-spacing:-0.5px;">
    Genius is 1% inspiration<br><span style="background:linear-gradient(135deg,#0066ff,#00c2ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;color:#00c2ff;">and 99% perspiration.</span>
  </h1>
  <div style="color:#94a3b8;font-size:13px;font-style:italic;margin-bottom:24px;letter-spacing:0.5px;">— Thomas A. Edison</div>
</td></tr>

<!-- BYLINE -->
<tr><td style="padding:0 40px 18px 40px;">
  <table cellpadding="0" cellspacing="0">
    <tr>
      <td style="padding-right:14px;vertical-align:middle;">
        <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#0066ff,#00c2ff);text-align:center;line-height:48px;color:#fff;font-weight:900;font-size:16px;letter-spacing:1px;">CD</div>
      </td>
      <td style="vertical-align:middle;">
        <div style="color:#fff;font-size:15px;font-weight:800;line-height:1.2;">Chad A. Dozier</div>
        <div style="color:#94a3b8;font-size:12px;line-height:1.4;margin-top:2px;">Founder &amp; CEO, AthlynX · Houston, TX</div>
      </td>
    </tr>
  </table>
</td></tr>

<!-- ESSAY -->
<tr><td style="padding:0 40px 8px 40px;">
  <p style="color:#cbd5e1;font-size:15px;line-height:1.75;margin:0 0 16px;">Every invention worth keeping was forged in relentless effort. Edison didn't stumble onto the lightbulb — he ran into <strong style="color:#fff;">10,000 failures</strong> first. Tesla didn't dream up the modern grid; he wired it. Da Vinci sketched until his hands cracked. Newton, Einstein, Curie, Archimedes — none of them were the smartest person in the room. They were the ones who refused to leave.</p>
  <p style="color:#cbd5e1;font-size:15px;line-height:1.75;margin:0 0 16px;">Inspiration is the spark. <strong style="color:#00c2ff;">Perspiration is the engine.</strong> If you're reading this, you're probably in the 99% — the ones still grinding while everyone else is asleep. Keep going.</p>
  <p style="color:#cbd5e1;font-size:15px;line-height:1.75;margin:0 0 20px;">AthlynX wasn't built in a boardroom. It was built on three days of no sleep, ten thousand commits, and the same refusal to quit that put a lightbulb in every home in America. We took our seat at that table the only way it's ever been earned — <strong style="color:#fff;">the hard way.</strong></p>
  <p style="color:#cbd5e1;font-size:15px;line-height:1.75;margin:0 0 8px;">You're not just a user now, ${firstName}. You're part of the lineage. Welcome to <strong style="color:#00c2ff;">AthlynX Nation.</strong></p>
</td></tr>

<!-- LINEAGE STAMP -->
<tr><td style="padding:20px 40px 8px 40px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,rgba(0,102,255,0.10),rgba(0,194,255,0.05));border:1px solid rgba(0,194,255,0.25);border-radius:12px;">
    <tr><td style="padding:18px 22px;text-align:center;">
      <div style="color:#7dd3fc;font-size:10px;letter-spacing:3px;font-weight:900;margin-bottom:8px;">THE LINEAGE</div>
      <div style="color:#fff;font-size:13px;font-weight:700;letter-spacing:1px;line-height:1.6;">EDISON · TESLA · DA VINCI · NEWTON · CURIE · EINSTEIN</div>
      <div style="color:#475569;font-size:14px;margin:6px 0;">↓</div>
      <div style="background:linear-gradient(135deg,#0066ff,#00c2ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;color:#00c2ff;font-size:18px;font-weight:900;letter-spacing:3px;">AthlynX.AI</div>
    </td></tr>
  </table>
</td></tr>

<!-- SIGNATURE -->
<tr><td style="padding:24px 40px 8px 40px;">
  <div style="font-family:'Brush Script MT','Lucida Handwriting',cursive;color:#fff;font-size:30px;line-height:1;margin-bottom:6px;">Chad A. Dozier</div>
  <div style="color:#94a3b8;font-size:12px;letter-spacing:0.5px;">Signed · Chad A. Dozier · Houston, TX · May 2026</div>
  <div style="color:#475569;font-size:11px;margin-top:6px;letter-spacing:1px;">#AthlynXNation · #DozierHoldingsGroup · #NeverGiveUp</div>
</td></tr>

<!-- ACCOUNT STAMP -->
<tr><td style="padding:24px 40px 32px 40px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060d1f;border-radius:10px;border:1px solid #1e3a6e;">
    <tr><td style="padding:12px 16px;border-bottom:1px solid #1e3a6e;"><span style="color:#475569;font-size:10px;display:block;letter-spacing:2px;">FULL NAME</span><span style="color:#fff;font-size:14px;font-weight:bold;">${displayName}</span></td></tr>
    <tr><td style="padding:12px 16px;border-bottom:1px solid #1e3a6e;"><span style="color:#475569;font-size:10px;display:block;letter-spacing:2px;">EMAIL</span><span style="color:#00c2ff;font-size:14px;">${to}</span></td></tr>
    <tr><td style="padding:12px 16px;"><span style="color:#475569;font-size:10px;display:block;letter-spacing:2px;">SIGNED UP</span><span style="color:#f59e0b;font-size:13px;">${dateStr}</span></td></tr>
  </table>
  <p style="color:#334155;font-size:11px;margin:16px 0 0;text-align:center;">If you didn't request this, you can safely ignore this email.</p>
</td></tr>

<!-- FOOTER -->
<tr><td style="background:#060d1f;padding:22px 40px;text-align:center;border-top:1px solid #1e3a6e;">
  <p style="color:#475569;font-size:12px;margin:0;">AthlynX &middot; A Dozier Holdings Group Company &middot; <a href="https://athlynx.ai" style="color:#475569;text-decoration:none;">athlynx.ai</a></p>
  <p style="color:#334155;font-size:11px;margin:6px 0 0;">Questions? <a href="mailto:chaddozier75@gmail.com" style="color:#00c2ff;text-decoration:none;">chaddozier75@gmail.com</a></p>
  <p style="color:#334155;font-size:11px;margin:4px 0 0;">Isaiah 40:31 · Dreams Do Come True 2026</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  const text = `Welcome to AthlynX, ${firstName}.\n\nYour verification code: ${code}\nExpires in 10 minutes.\n\nSign in: https://athlynx.ai/signin\n\n— A LETTER FROM THE FOUNDER —\n\n"Genius is 1% inspiration and 99% perspiration." — Thomas A. Edison\n\nEvery invention worth keeping was forged in relentless effort. Edison didn't stumble onto the lightbulb — he ran into 10,000 failures first. Tesla didn't dream up the modern grid; he wired it. Da Vinci sketched until his hands cracked. Newton, Einstein, Curie, Archimedes — none of them were the smartest person in the room. They were the ones who refused to leave.\n\nInspiration is the spark. Perspiration is the engine. If you're reading this, you're probably in the 99% — the ones still grinding while everyone else is asleep. Keep going.\n\nAthlynX wasn't built in a boardroom. It was built on three days of no sleep, ten thousand commits, and the same refusal to quit that put a lightbulb in every home in America. We took our seat at that table the only way it's ever been earned — the hard way.\n\nYou're not just a user now, ${firstName}. You're part of the lineage. Welcome to AthlynX Nation.\n\nThe Lineage: Edison · Tesla · Da Vinci · Newton · Curie · Einstein → AthlynX.AI\n\nSigned · Chad A. Dozier · Founder & CEO, AthlynX · Houston, TX · May 2026\n#AthlynXNation #DozierHoldingsGroup #NeverGiveUp\n\n---\nAccount: ${displayName} · ${to}\nSigned up: ${dateStr}\n\nAthlynX · A Dozier Holdings Group Company · athlynx.ai\nIsaiah 40:31 · Dreams Do Come True 2026`;

  return sendEmail({
    to,
    subject: `${code} — Welcome to AthlynX, ${firstName}. A letter from the Founder.`,
    html,
    text,
  });
}

export async function sendTrialExpiryEmail(to: string, name: string): Promise<boolean> {
  const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:40px 20px;background:#0a0f1e;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#0d1b3e;border-radius:16px;overflow:hidden;border:1px solid #1e3a6e;padding:40px;">
<tr><td style="text-align:center;padding-bottom:24px;">
  <div style="font-size:32px;font-weight:900;color:#fff;letter-spacing:4px;">AthlynX</div>
</td></tr>
<tr><td>
  <h2 style="color:#fff;font-size:22px;margin:0 0 12px;">Your Trial Ends Tomorrow, ${name}</h2>
  <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 28px;">Don't lose access to LYNX AI, NIL deals, recruiting tools, and more. Upgrade now to keep your momentum going.</p>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center">
      <a href="https://athlynx.ai/pricing" style="display:inline-block;background:linear-gradient(135deg,#0066ff,#00c2ff);color:#fff;font-weight:900;font-size:15px;padding:14px 36px;border-radius:50px;text-decoration:none;">UPGRADE NOW →</a>
    </td></tr>
  </table>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  return sendEmail({
    to,
    subject: `${name}, your AthlynX trial ends tomorrow — don't lose access`,
    html,
    text: `${name}, your AthlynX trial ends tomorrow. Upgrade at https://athlynx.ai/pricing`,
  });
}

/**
 * Send owner alert email to chaddozier75@gmail.com on every new user signup
 */
export async function sendOwnerNewUserAlert(opts: {
  name: string;
  email: string;
  loginMethod: string;
  signedUpAt: string;
  trialEndsAt: string;
  memberNumber?: number;
}): Promise<boolean> {
  const memberNum = opts.memberNumber ? String(opts.memberNumber).padStart(4, "0") : null;
  const OWNER_EMAILS = [
    "chaddozier75@gmail.com",
    "chaddozier75@gmail.com",
    "cdozier@dozierholdingsgroup.com",
    "chaddozier75@gmail.com",
    "chad.dozier@icloud.com",
  ];
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;padding:40px 20px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#0d1b3e;border-radius:16px;overflow:hidden;border:1px solid #1e3a6e;">
<tr><td style="background:linear-gradient(135deg,#0066ff,#00c2ff);padding:28px 32px;">
  <div style="font-size:28px;font-weight:900;color:#fff;letter-spacing:3px;">AthlynX</div>
  <div style="font-size:12px;color:rgba(255,255,255,0.85);letter-spacing:5px;margin-top:4px;">NEW USER ALERT</div>
</td></tr>
<tr><td style="padding:32px;">
  <h2 style="color:#00c2ff;font-size:22px;margin:0 0 24px;">🏆 A new athlete just joined!${memberNum ? ` <span style="background:linear-gradient(135deg,#0066ff,#00c2ff);color:#fff;font-size:14px;padding:4px 14px;border-radius:50px;font-weight:900;margin-left:8px;">MEMBER #${memberNum}</span>` : ""}</h2>
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-radius:10px;overflow:hidden;">
    ${memberNum ? `<tr style="background:#0a1628;"><td style="padding:12px 16px;border-bottom:1px solid #1e3a6e;"><span style="color:#94a3b8;font-size:12px;display:block;margin-bottom:2px;">MEMBER NUMBER</span><span style="color:#00c2ff;font-size:20px;font-weight:900;">#${memberNum}</span></td></tr>` : ""}
    <tr style="background:#0a1628;"><td style="padding:12px 16px;border-bottom:1px solid #1e3a6e;"><span style="color:#94a3b8;font-size:12px;display:block;margin-bottom:2px;">NAME</span><span style="color:#fff;font-size:17px;font-weight:bold;">${opts.name}</span></td></tr>
    <tr style="background:#0c1a32;"><td style="padding:12px 16px;border-bottom:1px solid #1e3a6e;"><span style="color:#94a3b8;font-size:12px;display:block;margin-bottom:2px;">EMAIL</span><span style="color:#00c2ff;font-size:17px;font-weight:bold;">${opts.email}</span></td></tr>
    <tr style="background:#0a1628;"><td style="padding:12px 16px;border-bottom:1px solid #1e3a6e;"><span style="color:#94a3b8;font-size:12px;display:block;margin-bottom:2px;">LOGIN METHOD</span><span style="color:#fff;font-size:15px;">${opts.loginMethod}</span></td></tr>
    <tr style="background:#0c1a32;"><td style="padding:12px 16px;border-bottom:1px solid #1e3a6e;"><span style="color:#94a3b8;font-size:12px;display:block;margin-bottom:2px;">SIGNED UP</span><span style="color:#fff;font-size:15px;">${opts.signedUpAt} CST</span></td></tr>
    <tr style="background:#0a1628;"><td style="padding:12px 16px;"><span style="color:#94a3b8;font-size:12px;display:block;margin-bottom:2px;">TRIAL ENDS</span><span style="color:#f59e0b;font-size:15px;font-weight:bold;">${opts.trialEndsAt}</span></td></tr>
  </table>
  <div style="margin-top:24px;text-align:center;">
    <a href="https://athlynx.ai/admin" style="display:inline-block;background:linear-gradient(135deg,#0066ff,#00c2ff);color:#fff;font-weight:900;font-size:14px;padding:12px 32px;border-radius:50px;text-decoration:none;">VIEW ADMIN DASHBOARD</a>
  </div>
</td></tr>
<tr><td style="background:#060d1f;padding:20px;text-align:center;border-top:1px solid #1e3a6e;">
  <p style="color:#475569;font-size:12px;margin:0;">AthlynX &middot; A Dozier Holdings Group Company &middot; athlynx.ai</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
  const results = await Promise.all(
    OWNER_EMAILS.map(to => sendEmail({
      to,
      subject: memberNum ? `🏆 AthlynX Member #${memberNum}: ${opts.name} just signed up!` : `🏆 New AthlynX Signup: ${opts.name} (${opts.email})`,
      html,
      text: `New AthlynX signup!\nName: ${opts.name}\nEmail: ${opts.email}\nLogin: ${opts.loginMethod}\nSigned Up: ${opts.signedUpAt} CST\nTrial Ends: ${opts.trialEndsAt}\n\nView dashboard: https://athlynx.ai/admin`,
    }))
  );
  return results.some(r => r);
}

export default { sendEmail, sendWelcomeEmail, sendVerificationEmail, sendTrialExpiryEmail, sendOwnerNewUserAlert };

/**
 * Send subscription expiry warning or suspension email.
 * Supports 7-day, 5-day, 4-day, 3-day, 2-day, 1-day, and expired types.
 */
export async function sendSubscriptionExpiryEmail(opts: {
  to: string;
  name: string;
  daysRemaining: number;
  emailType: string;
  expiresAt: Date;
}): Promise<boolean> {
  const isExpired = opts.emailType === "expired";
  const renewUrl = "https://athlynx.ai/billing";
  const formattedDate = opts.expiresAt.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const urgencyColor = opts.daysRemaining <= 1 ? "#ef4444" : opts.daysRemaining <= 3 ? "#f97316" : "#1e88e5";
  const subject = isExpired
    ? `⚠️ Your AthlynX account has been suspended`
    : opts.daysRemaining === 1
    ? `🚨 FINAL WARNING: Your AthlynX access expires TOMORROW`
    : `⏰ Your AthlynX access expires in ${opts.daysRemaining} days`;

  const headline = isExpired
    ? `Your AthlynX Access Has Been Suspended`
    : `Your AthlynX Access Expires in ${opts.daysRemaining} Day${opts.daysRemaining !== 1 ? "s" : ""}`;

  const bodyText = isExpired
    ? `Your AthlynX subscription has expired and your account has been suspended. Renew now to restore full access to all features.`
    : `Don't lose access to your athlete platform. Your subscription expires on ${formattedDate}. Renew now to keep your edge.`;

  const ctaText = isExpired
    ? "RESTORE MY ACCESS"
    : `RENEW NOW — ${opts.daysRemaining} DAY${opts.daysRemaining !== 1 ? "S" : ""} LEFT`;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#060d1f;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#060d1f;">
<tr><td align="center" style="padding:40px 20px;">
<table width="600" cellpadding="0" cellspacing="0" style="background:#0a1628;border-radius:16px;overflow:hidden;border:1px solid #1e3a6e;max-width:600px;">
  <tr><td style="background:linear-gradient(135deg,#0a1f44,#0d2b5e);padding:32px 40px;text-align:center;border-bottom:2px solid ${urgencyColor};">
    <div style="font-size:36px;font-weight:900;letter-spacing:3px;color:#fff;">AthlynX</div>
    <div style="color:#94a3b8;font-size:11px;letter-spacing:4px;margin-top:4px;">THE ATHLETE'S PLAYBOOK</div>
  </td></tr>
  <tr><td style="background:${urgencyColor}20;border-bottom:1px solid ${urgencyColor}40;padding:16px 40px;text-align:center;">
    <span style="color:${urgencyColor};font-size:13px;font-weight:900;letter-spacing:2px;">${isExpired ? "⚠️ ACCOUNT SUSPENDED" : `⏰ ${opts.daysRemaining} DAY${opts.daysRemaining !== 1 ? "S" : ""} REMAINING`}</span>
  </td></tr>
  <tr><td style="padding:40px;">
    <h1 style="color:#fff;font-size:24px;font-weight:900;margin:0 0 16px;">${headline}</h1>
    <p style="color:#94a3b8;font-size:16px;line-height:1.6;margin:0 0 32px;">Hi ${opts.name},<br><br>${bodyText}</p>
    ${!isExpired ? `<div style="background:#0d2b5e;border:1px solid #1e3a6e;border-radius:12px;padding:20px;margin-bottom:32px;">
      <div style="color:#94a3b8;font-size:12px;margin-bottom:8px;">SUBSCRIPTION EXPIRES</div>
      <div style="color:#fff;font-size:18px;font-weight:900;">${formattedDate}</div>
    </div>` : ""}
    <div style="text-align:center;margin:32px 0;">
      <a href="${renewUrl}" style="display:inline-block;background:linear-gradient(135deg,#1565c0,#1e88e5);color:#fff;font-weight:900;font-size:18px;padding:18px 48px;border-radius:50px;text-decoration:none;letter-spacing:1px;box-shadow:0 8px 32px rgba(30,136,229,0.4);">${ctaText}</a>
    </div>
    <p style="color:#475569;font-size:13px;text-align:center;margin:24px 0 0;">Questions? Contact us at <a href="mailto:chaddozier75@gmail.com" style="color:#1e88e5;">chaddozier75@gmail.com</a></p>
  </td></tr>
  <tr><td style="background:#060d1f;padding:24px 40px;text-align:center;border-top:1px solid #1e3a6e;">
    <p style="color:#334155;font-size:12px;margin:0;">AthlynX &middot; A Dozier Holdings Group Company &middot; Houston, TX</p>
    <p style="color:#334155;font-size:11px;margin:8px 0 0;">You are receiving this because your AthlynX subscription is expiring.</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  return sendEmail({
    to: opts.to,
    subject,
    html,
    text: `${headline}\n\n${bodyText}\n\nRenew now: ${renewUrl}\n\nAthlynX · chaddozier75@gmail.com`,
  });
}
