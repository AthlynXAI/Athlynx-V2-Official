// Build 2 — persistent Coach Lynx chat store, backed by drizzle coach_lynx_messages table.
// Falls back to an in-memory cache when the DB write fails so the chat keeps working in dev.

import { getDb } from "../db";
import {
  coachLynxMessages,
  coachLynxMemory,
  type CoachLynxMessage,
  type CoachLynxMemory,
} from "../../drizzle/schema";
import { asc, desc, eq } from "drizzle-orm";

export type TrainerMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: number;
  contextScreen?: string;
  modelUsed?: string;
};

// In-memory fallback cache. Keyed by userId. Used only if the DB write throws.
const fallbackStore = new Map<number, TrainerMessage[]>();
const MAX_HISTORY = 100;

function pushFallback(userId: number, msg: TrainerMessage): TrainerMessage[] {
  const list = fallbackStore.get(userId) ?? [];
  list.push(msg);
  if (list.length > MAX_HISTORY) list.splice(0, list.length - MAX_HISTORY);
  fallbackStore.set(userId, list);
  return list;
}

export async function getHistory(userId: number): Promise<TrainerMessage[]> {
  try {
    const db = await getDb();
    const rows = await db
      .select()
      .from(coachLynxMessages)
      .where(eq(coachLynxMessages.userId, userId))
      .orderBy(asc(coachLynxMessages.createdAt))
      .limit(MAX_HISTORY);
    return rows.map((r: CoachLynxMessage) => ({
      role: r.role as TrainerMessage["role"],
      content: r.content,
      createdAt:
        r.createdAt instanceof Date ? r.createdAt.getTime() : Date.now(),
      contextScreen: r.contextScreen ?? undefined,
      modelUsed: r.modelUsed ?? undefined,
    }));
  } catch (err) {
    console.warn(
      "[trainerStore] getHistory DB read failed, using fallback:",
      (err as Error).message
    );
    return fallbackStore.get(userId) ?? [];
  }
}

export async function appendMessage(
  userId: number,
  msg: TrainerMessage
): Promise<TrainerMessage[]> {
  try {
    const db = await getDb();
    await db.insert(coachLynxMessages).values({
      userId,
      role: msg.role,
      content: msg.content,
      contextScreen: msg.contextScreen ?? null,
      modelUsed: msg.modelUsed ?? null,
    });
    // also mirror to fallback so we don't lose it if DB goes away mid-session
    pushFallback(userId, msg);
    return await getHistory(userId);
  } catch (err) {
    console.warn(
      "[trainerStore] appendMessage DB write failed, using fallback:",
      (err as Error).message
    );
    return pushFallback(userId, msg);
  }
}

export async function clearHistory(userId: number): Promise<void> {
  fallbackStore.delete(userId);
  try {
    const db = await getDb();
    await db
      .delete(coachLynxMessages)
      .where(eq(coachLynxMessages.userId, userId));
  } catch (err) {
    console.warn(
      "[trainerStore] clearHistory DB delete failed:",
      (err as Error).message
    );
  }
}

// ─── Long-term memory facts ──────────────────────────────────────────────────
export async function rememberFact(
  userId: number,
  fact: string,
  source: string = "chat",
  confidence: number = 1.0
): Promise<void> {
  try {
    const db = await getDb();
    await db
      .insert(coachLynxMemory)
      .values({ userId, fact, source, confidence });
  } catch (err) {
    console.warn("[trainerStore] rememberFact failed:", (err as Error).message);
  }
}

export async function recallFacts(
  userId: number,
  limit: number = 20
): Promise<string[]> {
  try {
    const db = await getDb();
    const rows = await db
      .select()
      .from(coachLynxMemory)
      .where(eq(coachLynxMemory.userId, userId))
      .orderBy(desc(coachLynxMemory.createdAt))
      .limit(limit);
    return rows.map((r: CoachLynxMemory) => r.fact);
  } catch (err) {
    console.warn("[trainerStore] recallFacts failed:", (err as Error).message);
    return [];
  }
}
