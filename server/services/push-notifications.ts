/**
 * AthlynX — Web Push Notification Service
 * Sends push notifications to subscribed devices via VAPID
 * Badge counts update on the PWA app icon
 */
import webpush from "web-push";
import { getDb } from "../db";
import { sql } from "drizzle-orm";

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_EMAIL = process.env.VAPID_EMAIL ?? "mailto:noreply@athlynx.ai";

let vapidConfigured = false;

function getVapidConfig(): { publicKey: string; privateKey: string; email: string } {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    throw new Error("VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY must be configured in the environment");
  }
  return { publicKey: VAPID_PUBLIC_KEY, privateKey: VAPID_PRIVATE_KEY, email: VAPID_EMAIL };
}

function ensureVapid() {
  if (!vapidConfigured) {
    const config = getVapidConfig();
    webpush.setVapidDetails(config.email, config.publicKey, config.privateKey);
    vapidConfigured = true;
  }
}

export function getVapidPublicKey(): string {
  return getVapidConfig().publicKey;
}

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  tag?: string;
}

/**
 * Send a push notification to a specific user (all their subscribed devices)
 */
export async function sendPushToUser(userId: number, payload: PushPayload): Promise<void> {
  ensureVapid();
  const db = await getDb();
  if (!db) return;

  try {
    const subs = await db.execute(
      sql`SELECT endpoint, "p256dhKey", "authKey" FROM push_subscriptions WHERE "userId" = ${userId}`
    );

    const rows = (subs as any).rows ?? subs ?? [];
    for (const sub of rows) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dhKey, auth: sub.authKey },
          },
          JSON.stringify({
            title: payload.title,
            body: payload.body,
            icon: payload.icon ?? "/athlynx-icon.png",
            badge: payload.badge ?? "/athlynx-icon.png",
            url: payload.url ?? "/portal",
            tag: payload.tag ?? "athlynx",
          })
        );
      } catch (err: any) {
        // Remove expired/invalid subscriptions
        if (err.statusCode === 410 || err.statusCode === 404) {
          await db.execute(sql`DELETE FROM push_subscriptions WHERE endpoint = ${sub.endpoint}`);
        }
      }
    }
  } catch (e) {
    console.warn("[Push] sendPushToUser failed:", e);
  }
}

/**
 * Send a push notification to ALL admin users (role = 'admin')
 */
export async function sendPushToAdmins(payload: PushPayload): Promise<void> {
  ensureVapid();
  const db = await getDb();
  if (!db) return;

  try {
    const subs = await db.execute(
      sql`SELECT ps.endpoint, ps."p256dhKey", ps."authKey" 
          FROM push_subscriptions ps 
          JOIN users u ON u.id = ps."userId" 
          WHERE u.role = 'admin'`
    );

    const rows = (subs as any).rows ?? subs ?? [];
    for (const sub of rows) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dhKey, auth: sub.authKey },
          },
          JSON.stringify({
            title: payload.title,
            body: payload.body,
            icon: payload.icon ?? "/athlynx-icon.png",
            badge: payload.badge ?? "/athlynx-icon.png",
            url: payload.url ?? "/admin",
            tag: payload.tag ?? "athlynx-admin",
          })
        );
      } catch (err: any) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await db.execute(sql`DELETE FROM push_subscriptions WHERE endpoint = ${sub.endpoint}`);
        }
      }
    }
  } catch (e) {
    console.warn("[Push] sendPushToAdmins failed:", e);
  }
}

