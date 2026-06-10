/**
 * AthlynXAI OS — Real-Time Communications Webhook Intake
 *
 * Endpoints:
 *   POST /api/webhooks/comms/gmail       Gmail / Google Workspace push notifications
 *   POST /api/webhooks/comms/sms         SMS provider inbound (Twilio/Telnyx-compatible shell)
 *   POST /api/webhooks/comms/outlook     Outlook Graph webhook
 *
 * Build 31 hotfix: persist/classify before response so serverless execution does
 * not end before DB writes and logs complete. Auto-send remains disabled.
 */

import type { Express, Request, Response } from "express";
import { persistCommunicationEvent } from "../services/communicationsOsService";

function asErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error ?? "unknown error");
}

async function handleGmailPush(req: Request, res: Response): Promise<void> {
  try {
    const envelope = req.body ?? {};
    const messageData = envelope?.message?.data;
    let decoded: Record<string, unknown> = {};

    if (typeof messageData === "string") {
      try {
        decoded = JSON.parse(Buffer.from(messageData, "base64").toString("utf8"));
      } catch (decodeErr) {
        decoded = { decodeError: asErrorMessage(decodeErr) };
      }
    }

    const providerMessageId = String(
      envelope?.message?.messageId ?? decoded.historyId ?? decoded.emailAddress ?? `gmail-${Date.now()}`,
    );

    const result = await persistCommunicationEvent({
      provider: "gmail",
      providerMessageId,
      providerThreadId: String(decoded.historyId ?? providerMessageId),
      direction: "inbound",
      fromAddress: String(decoded.emailAddress ?? "gmail-push@googleapis.com"),
      toAddress: String(decoded.emailAddress ?? "chaddozier75@gmail.com"),
      subject: "Gmail / Workspace push notification",
      bodyText: `Gmail history update received for ${decoded.emailAddress ?? "unknown mailbox"}`,
      rawPayload: envelope,
    });

    console.log("[comms/gmail] push persisted", {
      hasData: !!messageData,
      providerMessageId,
      eventId: result.ok ? result.eventId : null,
      skipped: result.ok ? false : result.skipped,
      reason: result.ok ? null : result.reason,
      timestamp: new Date().toISOString(),
    });

    res.status(200).json({ received: true, persisted: result.ok, autoSendEnabled: false });
  } catch (err) {
    console.error("[comms/gmail] handler error", err);
    res.status(200).json({ received: true, persisted: false, autoSendEnabled: false, error: asErrorMessage(err) });
  }
}

async function handleSmsInbound(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body ?? {};
    const from = body.From ?? body?.data?.payload?.from?.phone_number ?? "unknown-sms-sender";
    const to = body.To ?? body?.data?.payload?.to?.[0]?.phone_number ?? "+16014985282";
    const text = body.Body ?? body?.data?.payload?.text ?? "";
    const providerId = body.MessageSid ?? body?.data?.payload?.id ?? `sms-${Date.now()}`;

    const result = await persistCommunicationEvent({
      provider: "sms",
      providerMessageId: String(providerId),
      providerThreadId: String(from),
      direction: "inbound",
      fromAddress: String(from),
      toAddress: String(to),
      subject: "Inbound SMS",
      bodyText: String(text),
      rawPayload: body,
    });

    console.log("[comms/sms] inbound persisted", {
      from,
      to,
      providerId,
      eventId: result.ok ? result.eventId : null,
      skipped: result.ok ? false : result.skipped,
      reason: result.ok ? null : result.reason,
      bodyLength: String(text).length,
      timestamp: new Date().toISOString(),
    });

    res.status(200).type("text/xml").send("<Response></Response>");
  } catch (err) {
    console.error("[comms/sms] handler error", err);
    res.status(200).type("text/xml").send("<Response></Response>");
  }
}

async function handleOutlookWebhook(req: Request, res: Response): Promise<void> {
  const validationToken = req.query.validationToken;
  if (typeof validationToken === "string") {
    res.status(200).type("text/plain").send(validationToken);
    return;
  }

  try {
    const notifications = req.body?.value ?? [];
    let persisted = 0;

    for (const notification of notifications) {
      const providerId = String(notification?.resourceData?.id ?? notification?.resource ?? `outlook-${Date.now()}`);
      const result = await persistCommunicationEvent({
        provider: "outlook",
        providerMessageId: providerId,
        providerThreadId: String(notification?.subscriptionId ?? providerId),
        direction: "inbound",
        fromAddress: "outlook-webhook@microsoft-graph",
        toAddress: "chad.dozier@icloud.com",
        subject: "Outlook notification",
        bodyText: String(notification?.changeType ?? "Outlook message change received"),
        rawPayload: notification,
      });
      if (result.ok) persisted += 1;
    }

    console.log("[comms/outlook] notifications persisted", {
      count: notifications.length,
      persisted,
      timestamp: new Date().toISOString(),
    });

    res.status(202).json({ received: true, persisted, autoSendEnabled: false });
  } catch (err) {
    console.error("[comms/outlook] handler error", err);
    res.status(202).json({ received: true, persisted: false, autoSendEnabled: false, error: asErrorMessage(err) });
  }
}

export function registerCommsInboundWebhooks(app: Express): void {
  app.post("/api/webhooks/comms/gmail", handleGmailPush);
  app.post("/api/webhooks/comms/sms", handleSmsInbound);
  app.post("/api/webhooks/comms/outlook", handleOutlookWebhook);

  console.log("[comms/webhooks] registered LIVE awaited endpoints: /api/webhooks/comms/{gmail,sms,outlook}");
}
