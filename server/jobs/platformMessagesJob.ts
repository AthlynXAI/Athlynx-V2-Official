/**
 * Platform Messages Job
 * 
 * Instead of showing banners, this system:
 * 1. Sends a welcome in-app notification to every new user on first login
 * 2. Sends periodic reminder notifications to users (every 7 days) about key features
 * 
 * All messages go to the user's in-app notification inbox — no banners, no popups.
 */
import { getDb } from "../db";
import { users, notifications } from "../../drizzle/schema";
import { eq, sql, isNull, lt, and } from "drizzle-orm";

// ─── Welcome message sent on first login (called from customAuthRouter) ───────

export async function sendWelcomeNotification(userId: number, userName: string): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await db.insert(notifications).values({
      userId,
      type: "welcome",
      title: "Welcome to AthlynXAI! 🏆",
      message: `Hey ${userName}! Welcome to the most powerful sports platform on the planet. Your personal AI Trainer Bot is ready, your NIL Portal is live, and your recruiting profile is set up. Tap around and explore — this is your home base. We are here to help you win.`,
      link: "/portal",
      priority: "high",
      isRead: "no",
      isDismissed: "no",
      isBroadcast: "no",
    });
    console.log(`[PlatformMessages] ✓ Welcome notification sent to userId=${userId}`);
  } catch (err) {
    console.error(`[PlatformMessages] Failed to send welcome notification to userId=${userId}:`, err);
  }
}

// ─── Periodic reminder messages (runs weekly) ─────────────────────────────────

const REMINDER_MESSAGES = [
  {
    title: "Your AI Trainer Bot is waiting for you",
    message: "Your personal AI Trainer Bot knows your sport, your goals, and your schedule. Ask it anything — training plans, NIL advice, recruiting tips. It never sleeps.",
    link: "/ai-training-bot",
  },
  {
    title: "New NIL deals are available for you",
    message: "Brands are looking for athletes like you right now. Check your NIL Portal to see what deals match your profile and start earning.",
    link: "/nil-portal",
  },
  {
    title: "Update your recruiting profile",
    message: "Coaches check profiles every day. Make sure your highlights, stats, and contact info are up to date so you never miss a recruiting opportunity.",
    link: "/portal",
  },
  {
    title: "Check the Transfer Portal",
    message: "New transfer opportunities are posted daily. If you are exploring your options, the Transfer Portal has everything you need.",
    link: "/transfer-portal",
  },
  {
    title: "Your AthlynXAI community is growing",
    message: "Athletes from across the country are joining every day. Connect with teammates, coaches, and brands in your feed.",
    link: "/feed",
  },
];

export async function runPlatformMessagesJob(): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[PlatformMessages] Database not available, skipping run");
    return;
  }

  const now = new Date();
  // Find users who have NOT received a reminder in the last 7 days
  // We track this by checking the most recent "reminder" notification
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Get all active users
  const allUsers = await db
    .select({ id: users.id, name: users.name, createdAt: users.createdAt })
    .from(users)
    .where(sql`${users.lastSignedIn} IS NOT NULL`);

  let sent = 0;
  for (const user of allUsers) {
    // Check if this user already got a reminder in the last 7 days
    const recentReminder = await db
      .select({ id: notifications.id })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, user.id),
          eq(notifications.type, "reminder"),
          sql`${notifications.createdAt} > ${sevenDaysAgo}`
        )
      )
      .limit(1);

    if (recentReminder.length > 0) continue; // Already got one recently

    // Pick a reminder message based on the user's ID (cycles through the list)
    const msgIndex = user.id % REMINDER_MESSAGES.length;
    const msg = REMINDER_MESSAGES[msgIndex];

    try {
      await db.insert(notifications).values({
        userId: user.id,
        type: "reminder",
        title: msg.title,
        message: msg.message,
        link: msg.link,
        priority: "normal",
        isRead: "no",
        isDismissed: "no",
        isBroadcast: "no",
      });
      sent++;
    } catch (err) {
      console.error(`[PlatformMessages] Failed to send reminder to userId=${user.id}:`, err);
    }
  }

  if (sent > 0) {
    console.log(`[PlatformMessages] ✓ Sent ${sent} reminder notifications`);
  }
}

// ─── Job scheduler ────────────────────────────────────────────────────────────

let platformMessagesInterval: NodeJS.Timeout | null = null;

export function startPlatformMessagesJob(): void {
  if (platformMessagesInterval) return; // Already running

  // Run every 24 hours
  platformMessagesInterval = setInterval(() => {
    runPlatformMessagesJob().catch(err =>
      console.error("[PlatformMessages] Scheduled run error:", err)
    );
  }, 24 * 60 * 60 * 1000);

  console.log("[PlatformMessages] Platform message scheduler started (runs every 24 hours)");
}

export function stopPlatformMessagesJob(): void {
  if (platformMessagesInterval) {
    clearInterval(platformMessagesInterval);
    platformMessagesInterval = null;
  }
}
