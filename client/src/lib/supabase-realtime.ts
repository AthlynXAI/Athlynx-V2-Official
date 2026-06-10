/**
 * Supabase Real-Time & Storage Service
 * Powers: Live messaging, notifications, file/media uploads, avatar storage
 * Architecture: Neon/PostgreSQL = primary data via Vercel runtime DB URL | Supabase = real-time + storage
 */
import { createClient } from '@supabase/supabase-js';

const FALLBACK_SUPABASE_URL = 'https://athlynx-supabase-missing.invalid';
const FALLBACK_SUPABASE_ANON_KEY = 'athlynx-supabase-anon-key-missing';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

function getSafeLocalStorage() {
  if (typeof window === 'undefined') return undefined;

  try {
    const testKey = '__athlynx_supabase_realtime_storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch (error) {
    console.warn('[Supabase Realtime] localStorage unavailable; auth persistence disabled for this session.', error);
    return undefined;
  }
}

const storage = getSafeLocalStorage();

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase Realtime] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY; using non-production fallback to avoid startup crash.', {
    hasUrl: Boolean(supabaseUrl),
    hasAnonKey: Boolean(supabaseAnonKey),
  });
}

export const supabase = createClient(
  supabaseUrl || FALLBACK_SUPABASE_URL,
  supabaseAnonKey || FALLBACK_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: Boolean(storage),
      autoRefreshToken: Boolean(storage),
      storage,
    },
    realtime: {
      params: { eventsPerSecond: 10 },
    },
  },
);

//  Storage Buckets 
export const BUCKETS = {
  AVATARS: 'avatars',
  MEDIA: 'media',
  MESSAGES: 'message-attachments',
  DOCUMENTS: 'documents',
  NIL_DEALS: 'nil-deal-assets',
} as const;

//  File Upload 
export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  options?: { upsert?: boolean }
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: options?.upsert ?? true, cacheControl: '3600' });
  if (error) {
    console.error('[Supabase Storage] Upload error:', error.message);
    return null;
  }
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return urlData.publicUrl;
}

export async function uploadAvatar(userId: number, file: File): Promise<string | null> {
  const ext = file.name.split('.').pop();
  const path = `user-${userId}/avatar.${ext}`;
  return uploadFile(BUCKETS.AVATARS, path, file, { upsert: true });
}

export async function uploadMessageAttachment(
  conversationId: number,
  file: File
): Promise<string | null> {
  const ext = file.name.split('.').pop();
  const path = `conv-${conversationId}/${Date.now()}-${file.name}`;
  return uploadFile(BUCKETS.MESSAGES, path, file);
}

export async function uploadNILAsset(dealId: number, file: File): Promise<string | null> {
  const path = `deal-${dealId}/${Date.now()}-${file.name}`;
  return uploadFile(BUCKETS.NIL_DEALS, path, file);
}

export async function uploadDocument(userId: number, file: File): Promise<string | null> {
  const path = `user-${userId}/${Date.now()}-${file.name}`;
  return uploadFile(BUCKETS.DOCUMENTS, path, file);
}

//  Real-Time Messaging 
export function subscribeToMessages(
  conversationId: number,
  onNewMessage: (msg: any) => void
) {
  const channel = supabase
    .channel(`messages:conv:${conversationId}`)
    .on('broadcast', { event: 'new_message' }, (payload) => {
      onNewMessage(payload.payload);
    })
    .subscribe();
  return () => supabase.removeChannel(channel);
}

export async function broadcastMessage(conversationId: number, message: any) {
  await supabase.channel(`messages:conv:${conversationId}`).send({
    type: 'broadcast',
    event: 'new_message',
    payload: message,
  });
}

//  Real-Time Notifications 
export function subscribeToNotifications(
  userId: number,
  onNotification: (notif: any) => void
) {
  const channel = supabase
    .channel(`notifications:user:${userId}`)
    .on('broadcast', { event: 'notification' }, (payload) => {
      onNotification(payload.payload);
    })
    .subscribe();
  return () => supabase.removeChannel(channel);
}

export async function broadcastNotification(userId: number, notification: any) {
  await supabase.channel(`notifications:user:${userId}`).send({
    type: 'broadcast',
    event: 'notification',
    payload: notification,
  });
}

//  Real-Time Presence (Online Status) 
export function trackUserPresence(userId: number, userName: string) {
  const channel = supabase.channel('online-users', {
    config: { presence: { key: `user-${userId}` } },
  });
  channel
    .on('presence', { event: 'sync' }, () => {})
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ userId, userName, online_at: new Date().toISOString() });
      }
    });
  return channel;
}

//  Real-Time Feed Updates 
export function subscribeToFeed(onUpdate: (post: any) => void) {
  const channel = supabase
    .channel('global:feed')
    .on('broadcast', { event: 'new_post' }, (payload) => {
      onUpdate(payload.payload);
    })
    .subscribe();
  return () => supabase.removeChannel(channel);
}

export async function broadcastFeedPost(post: any) {
  await supabase.channel('global:feed').send({
    type: 'broadcast',
    event: 'new_post',
    payload: post,
  });
}

//  Real-Time Transfer Portal Updates 
export function subscribeToTransferPortal(onUpdate: (entry: any) => void) {
  const channel = supabase
    .channel('transfer-portal:updates')
    .on('broadcast', { event: 'portal_update' }, (payload) => {
      onUpdate(payload.payload);
    })
    .subscribe();
  return () => supabase.removeChannel(channel);
}

//  Real-Time NIL Deal Updates 
export function subscribeToNILDeals(onUpdate: (deal: any) => void) {
  const channel = supabase
    .channel('nil-deals:updates')
    .on('broadcast', { event: 'nil_update' }, (payload) => {
      onUpdate(payload.payload);
    })
    .subscribe();
  return () => supabase.removeChannel(channel);
}

export default supabase;
