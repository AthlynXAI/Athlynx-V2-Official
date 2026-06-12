/**
 * Server-side Supabase Service
 * Used by API routes to broadcast real-time events after DB writes
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

let _client: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseKey) return null;
  if (!_client) {
    _client = createClient(supabaseUrl, supabaseKey);
  }
  return _client;
}

export async function broadcastNewMessage(conversationId: number, message: any) {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    await client.channel(`messages:conv:${conversationId}`).send({
      type: 'broadcast',
      event: 'new_message',
      payload: message,
    });
  } catch (e) {
    console.warn('[Supabase] Broadcast failed:', e);
  }
}

export async function broadcastNotification(userId: number, notification: any) {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    await client.channel(`notifications:user:${userId}`).send({
      type: 'broadcast',
      event: 'notification',
      payload: notification,
    });
  } catch (e) {
    console.warn('[Supabase] Notification broadcast failed:', e);
  }
}

export async function broadcastFeedPost(post: any) {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    await client.channel('global:feed').send({
      type: 'broadcast',
      event: 'new_post',
      payload: post,
    });
  } catch (e) {
    console.warn('[Supabase] Feed broadcast failed:', e);
  }
}
