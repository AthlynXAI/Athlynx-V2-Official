/**
 * Slack alerter — fires on critical build signals if SLACK_WEBHOOK_URL is set.
 * Optionally falls back to email via SES if SES is configured and BUILD_ALERT_EMAIL is set.
 *
 * No-op (returns sent: false) if neither destination is configured. Never throws.
 */

import { sendEmail } from "./aws-ses";

function envOrEmpty(k: string): string {
  return (process.env[k] ?? "").trim();
}

export type AlertPayload = {
  title: string;
  body: string;
  buildId?: string;
  severity: "critical" | "high" | "medium" | "low";
};

export function alerterConfigSummary() {
  return {
    hasSlack: !!envOrEmpty("SLACK_WEBHOOK_URL"),
    hasEmail: !!envOrEmpty("BUILD_ALERT_EMAIL"),
  };
}

async function postSlack(url: string, payload: AlertPayload): Promise<boolean> {
  const text = `*[${payload.severity.toUpperCase()}] ${payload.title}*\n${payload.body}${
    payload.buildId ? `\nBuild: ${payload.buildId}` : ""
  }`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    return res.ok;
  } catch (err) {
    console.warn("[slackAlerter] postSlack failed:", err);
    return false;
  }
}

export async function sendBuildAlert(payload: AlertPayload): Promise<{ slack: boolean; email: boolean }> {
  const slackUrl = envOrEmpty("SLACK_WEBHOOK_URL");
  const alertEmail = envOrEmpty("BUILD_ALERT_EMAIL");

  let slack = false;
  let email = false;
  if (slackUrl) slack = await postSlack(slackUrl, payload);
  if (alertEmail) {
    try {
      await sendEmail({
        to: alertEmail,
        subject: `[AthlynX BUILD ${payload.severity.toUpperCase()}] ${payload.title}`,
        html: `<p><b>${payload.title}</b></p><pre>${payload.body
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")}</pre>${
          payload.buildId ? `<p>Build: ${payload.buildId}</p>` : ""
        }`,
      });
      email = true;
    } catch (err) {
      console.warn("[slackAlerter] email send failed:", err);
    }
  }
  return { slack, email };
}
