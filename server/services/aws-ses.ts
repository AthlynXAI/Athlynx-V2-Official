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

export async function sendWelcomeEmail(to: string, name: string, memberNumber?: number, tempPassword?: string): Promise<boolean> {
  const memberNum = memberNumber ? String(memberNumber).padStart(4, "0") : null;
  const signedUpStr = new Date().toLocaleString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", timeZone: "America/Chicago", timeZoneName: "short",
  });
  // Brand colors: Cobalt #0047CC | Electric Blue #00AAFF | Granite #1C1C2E | White #FFFFFF
  // NO purple, NO gold/yellow, NO emojis in feature titles
  const STADIUM_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663729815473/LpqlOpkuxEDvIsVU.JPG";
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Welcome to AthlynX</title></head>
<body style="margin:0;padding:0;background:#F0F4F8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4F8;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<!-- HEADER: Stadium image -->
<tr><td style="border-radius:16px 16px 0 0;overflow:hidden;padding:0;margin:0;">
  <img src="${STADIUM_IMG}" alt="AthlynX — The Athlete's Playbook" width="600" style="display:block;width:100%;max-width:600px;height:auto;border-radius:16px 16px 0 0;" />
</td></tr>

<!-- COBALT BRAND BAR -->
<tr><td style="background:#0047CC;padding:16px 40px;text-align:center;">
  <span style="color:#FFFFFF;font-size:10px;font-weight:900;letter-spacing:4px;text-transform:uppercase;">WELCOME TO THE PLATFORM</span>
</td></tr>

<!-- WELCOME SECTION -->
<tr><td style="background:#FFFFFF;padding:40px 40px 32px;border-left:1px solid #CBD5E0;border-right:1px solid #CBD5E0;">
  <h1 style="color:#1C1C2E;font-size:26px;font-weight:900;margin:0 0 10px;line-height:1.3;">Welcome to AthlynX, ${name}.</h1>
  <p style="color:#0047CC;font-size:14px;margin:0 0 24px;font-style:italic;font-weight:600;">&ldquo;Those who wait on the Lord shall renew their strength.&rdquo; &mdash; Isaiah 40:31</p>
  ${memberNum ? `<div style="text-align:center;margin-bottom:28px;"><div style="display:inline-block;background:linear-gradient(135deg,#0047CC,#00AAFF);border-radius:12px;padding:18px 40px;"><div style="color:rgba(255,255,255,0.8);font-size:9px;letter-spacing:4px;text-transform:uppercase;margin-bottom:6px;">Member Number</div><div style="color:#FFFFFF;font-size:38px;font-weight:900;letter-spacing:5px;">#${memberNum}</div></div></div>` : ""}
  <p style="color:#4A5568;font-size:15px;line-height:1.75;margin:0;">Your AthlynX account is live. You now have access to the most powerful athlete platform ever built &mdash; <strong style="color:#0047CC;">44 sports, 213+ features, 4 AI engines</strong>, and a $135B market opportunity. Your 7-day free trial starts today.</p>
</td></tr>

<!-- CREDENTIALS BLOCK -->
<tr><td style="background:#F7FAFC;padding:32px 40px;border-left:1px solid #CBD5E0;border-right:1px solid #CBD5E0;">
  <div style="border:1.5px solid #CBD5E0;border-radius:12px;overflow:hidden;background:#FFFFFF;">
    <div style="background:#0047CC;padding:14px 20px;">
      <span style="color:#FFFFFF;font-size:10px;font-weight:900;letter-spacing:3px;text-transform:uppercase;">Your Account Credentials</span>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:14px 20px;border-bottom:1px solid #EDF2F7;">
        <div style="color:#718096;font-size:10px;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">Login URL</div>
        <div style="color:#0047CC;font-size:14px;font-weight:700;"><a href="https://athlynx.ai/signin" style="color:#0047CC;text-decoration:none;">athlynx.ai/signin</a></div>
      </td></tr>
      <tr><td style="padding:14px 20px;border-bottom:1px solid #EDF2F7;">
        <div style="color:#718096;font-size:10px;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">Your Email</div>
        <div style="color:#1C1C2E;font-size:14px;font-weight:700;">${to}</div>
      </td></tr>
      <tr><td style="padding:14px 20px;border-bottom:1px solid #EDF2F7;">
        <div style="color:#718096;font-size:10px;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">Sign In Method</div>
        <div style="color:#1C1C2E;font-size:14px;">${tempPassword ? "Email + Password (see temporary password below)" : "Use the same social login you signed up with — Google, Apple, Facebook, LinkedIn, Twitter, or Email."}</div>
      </td></tr>
      <tr><td style="padding:14px 20px;border-bottom:1px solid #EDF2F7;">
        <div style="color:#718096;font-size:10px;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">Member Since</div>
        <div style="color:#0047CC;font-size:13px;font-weight:700;">${signedUpStr}</div>
      </td></tr>
      <tr><td style="padding:14px 20px;">
        <div style="color:#718096;font-size:10px;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">Free Trial</div>
        <div style="color:#00AAFF;font-size:13px;font-weight:700;">7 days FREE &mdash; no charge until day 8. Cancel anytime.</div>
      </td></tr>
    </table>
  </div>
</td></tr>

${tempPassword ? `<!-- TEMP PASSWORD BLOCK -->
<tr><td style="background:#FFFFFF;padding:0 40px 32px;border-left:1px solid #CBD5E0;border-right:1px solid #CBD5E0;">
  <div style="border:2px solid #0047CC;border-radius:12px;overflow:hidden;background:#EBF4FF;">
    <div style="background:#0047CC;padding:14px 20px;">
      <span style="color:#FFFFFF;font-size:10px;font-weight:900;letter-spacing:3px;text-transform:uppercase;">Temporary Password &mdash; Action Required</span>
    </div>
    <div style="padding:20px 24px;">
      <p style="color:#1C1C2E;font-size:14px;margin:0 0 12px;line-height:1.6;">A temporary password has been assigned to your account. Set a permanent password before your first login.</p>
      <div style="background:#FFFFFF;border:1.5px solid #0047CC;border-radius:8px;padding:14px 20px;margin-bottom:16px;text-align:center;">
        <div style="color:#718096;font-size:10px;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">Temporary Password</div>
        <div style="color:#0047CC;font-size:18px;font-weight:900;letter-spacing:3px;font-family:monospace;">${tempPassword}</div>
      </div>
      <div style="text-align:center;">
        <a href="https://athlynx.ai/set-password" style="display:inline-block;background:linear-gradient(135deg,#0047CC,#00AAFF);color:#FFFFFF;font-weight:900;font-size:14px;padding:14px 40px;border-radius:50px;text-decoration:none;letter-spacing:2px;text-transform:uppercase;">Set Your Password</a>
      </div>
      <p style="color:#718096;font-size:11px;margin:12px 0 0;text-align:center;">This temporary password expires in 24 hours. Do not share it with anyone.</p>
    </div>
  </div>
</td></tr>` : ""}

<!-- FEATURES -->
<tr><td style="background:#FFFFFF;padding:36px 40px;border-left:1px solid #CBD5E0;border-right:1px solid #CBD5E0;">
  <h2 style="color:#1C1C2E;font-size:16px;font-weight:900;margin:0 0 20px;letter-spacing:1px;text-transform:uppercase;">What's Inside Your Platform</h2>
  <div style="border:1px solid #CBD5E0;border-left:4px solid #0047CC;border-radius:8px;padding:16px 18px;margin-bottom:12px;background:#F7FAFC;">
    <div style="color:#0047CC;font-size:12px;font-weight:900;letter-spacing:1px;text-transform:uppercase;margin-bottom:5px;">LYNX AI Companion</div>
    <div style="color:#4A5568;font-size:13px;line-height:1.6;">Powered by Nebius H200 GPUs &mdash; your personal AI coach for game film analysis, training plans, nutrition, mental performance, and real-time sport strategy.</div>
  </div>
  <div style="border:1px solid #CBD5E0;border-left:4px solid #00AAFF;border-radius:8px;padding:16px 18px;margin-bottom:12px;background:#F7FAFC;">
    <div style="color:#0047CC;font-size:12px;font-weight:900;letter-spacing:1px;text-transform:uppercase;margin-bottom:5px;">NIL Portal</div>
    <div style="color:#4A5568;font-size:13px;line-height:1.6;">Connect directly with brands, negotiate deals, and manage your Name, Image and Likeness rights. AI-powered valuation shows you exactly what you are worth.</div>
  </div>
  <div style="border:1px solid #CBD5E0;border-left:4px solid #0047CC;border-radius:8px;padding:16px 18px;margin-bottom:12px;background:#F7FAFC;">
    <div style="color:#0047CC;font-size:12px;font-weight:900;letter-spacing:1px;text-transform:uppercase;margin-bottom:5px;">AI Recruiter</div>
    <div style="color:#4A5568;font-size:13px;line-height:1.6;">Get discovered by college coaches and pro scouts nationwide. Your AI-built profile is automatically matched to programs that fit your stats, GPA, and goals.</div>
  </div>
  <div style="border:1px solid #CBD5E0;border-left:4px solid #00AAFF;border-radius:8px;padding:16px 18px;margin-bottom:12px;background:#F7FAFC;">
    <div style="color:#0047CC;font-size:12px;font-weight:900;letter-spacing:1px;text-transform:uppercase;margin-bottom:5px;">Transfer Portal</div>
    <div style="color:#4A5568;font-size:13px;line-height:1.6;">Navigate the transfer market with confidence. AI-powered program matching, eligibility tracking, and direct coach communication &mdash; all in one place.</div>
  </div>
  <div style="border:1px solid #CBD5E0;border-left:4px solid #0047CC;border-radius:8px;padding:16px 18px;margin-bottom:12px;background:#F7FAFC;">
    <div style="color:#0047CC;font-size:12px;font-weight:900;letter-spacing:1px;text-transform:uppercase;margin-bottom:5px;">Athlete Messenger</div>
    <div style="color:#4A5568;font-size:13px;line-height:1.6;">Secure, verified messaging with athletes, agents, coaches, and brands. Build your network. Close deals. Stay connected.</div>
  </div>
  <div style="border:1px solid #CBD5E0;border-left:4px solid #00AAFF;border-radius:8px;padding:16px 18px;background:#F7FAFC;">
    <div style="color:#0047CC;font-size:12px;font-weight:900;letter-spacing:1px;text-transform:uppercase;margin-bottom:5px;">Athlete Profile + Media Hub</div>
    <div style="color:#4A5568;font-size:13px;line-height:1.6;">Your verified athlete profile &mdash; stats, highlights, game film, awards, and social links &mdash; all in one shareable link.</div>
  </div>
</td></tr>

<!-- STATS BAR -->
<tr><td style="background:#0047CC;padding:24px 40px;">
  <table width="100%" cellpadding="0" cellspacing="0"><tr>
    <td style="text-align:center;padding:0 8px;">
      <div style="color:#FFFFFF;font-size:24px;font-weight:900;">44</div>
      <div style="color:rgba(255,255,255,0.7);font-size:9px;letter-spacing:2px;text-transform:uppercase;margin-top:2px;">Sports</div>
    </td>
    <td style="text-align:center;padding:0 8px;border-left:1px solid rgba(255,255,255,0.25);">
      <div style="color:#FFFFFF;font-size:24px;font-weight:900;">213+</div>
      <div style="color:rgba(255,255,255,0.7);font-size:9px;letter-spacing:2px;text-transform:uppercase;margin-top:2px;">Features</div>
    </td>
    <td style="text-align:center;padding:0 8px;border-left:1px solid rgba(255,255,255,0.25);">
      <div style="color:#FFFFFF;font-size:24px;font-weight:900;">4</div>
      <div style="color:rgba(255,255,255,0.7);font-size:9px;letter-spacing:2px;text-transform:uppercase;margin-top:2px;">AI Engines</div>
    </td>
    <td style="text-align:center;padding:0 8px;border-left:1px solid rgba(255,255,255,0.25);">
      <div style="color:#FFFFFF;font-size:24px;font-weight:900;">$135B</div>
      <div style="color:rgba(255,255,255,0.7);font-size:9px;letter-spacing:2px;text-transform:uppercase;margin-top:2px;">Market</div>
    </td>
  </tr></table>
</td></tr>

<!-- CTA -->
<tr><td style="background:#FFFFFF;padding:40px;text-align:center;border-left:1px solid #CBD5E0;border-right:1px solid #CBD5E0;">
  <p style="color:#4A5568;font-size:15px;margin:0 0 28px;line-height:1.6;">Your platform is ready. Complete your athlete profile and unlock everything AthlynX has to offer.</p>
  <a href="https://athlynx.ai/onboarding" style="display:inline-block;background:linear-gradient(135deg,#0047CC,#00AAFF);color:#FFFFFF;font-weight:900;font-size:15px;padding:18px 52px;border-radius:50px;text-decoration:none;letter-spacing:2px;text-transform:uppercase;">Enter the Platform</a>
  <p style="color:#A0AEC0;font-size:12px;margin:20px 0 0;">Or sign in anytime at <a href="https://athlynx.ai/signin" style="color:#0047CC;text-decoration:none;font-weight:600;">athlynx.ai/signin</a></p>
</td></tr>

<!-- FOOTER -->
<tr><td style="background:#1C1C2E;padding:28px 40px;text-align:center;border-radius:0 0 16px 16px;">
  <p style="color:#718096;font-size:11px;margin:0 0 6px;">AthlynX &mdash; A Dozier Holdings Group Company</p>
  <p style="color:#718096;font-size:11px;margin:0 0 6px;">Questions? <a href="mailto:cdozier14@athlynx.ai" style="color:#00AAFF;text-decoration:none;">cdozier14@athlynx.ai</a></p>
  <p style="color:#4A5568;font-size:11px;margin:12px 0 0;font-style:italic;">Isaiah 40:31 &mdash; Dreams Do Come True 2026</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  return sendEmail({
    to,
    subject: memberNum ? `Welcome to AthlynX, ${name} — Member #${memberNum}` : `Welcome to AthlynX — Your Platform is Ready, ${name}`,
    html,
    text: `Welcome to AthlynX, ${name}.${memberNum ? ` Member #${memberNum}.` : ""} Login: ${to}. Joined: ${signedUpStr}.${tempPassword ? ` Temporary password: ${tempPassword} — set your permanent password at https://athlynx.ai/set-password` : ""} Complete your setup at https://athlynx.ai/onboarding — 7 days free, no charge until day 8. Isaiah 40:31 · Dreams Do Come True 2026`,
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
