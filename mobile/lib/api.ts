import * as SecureStore from "expo-secure-store";

export const API_URL = "https://athlynx.ai";

async function getHeaders(): Promise<Record<string, string>> {
  const sessionId = await SecureStore.getItemAsync("session_id");
  return {
    "Content-Type": "application/json",
    ...(sessionId ? { Cookie: `app_session_id=${sessionId}` } : {}),
  };
}

async function fetchJson<T>(url: string, init: RequestInit = {}, timeoutMs = 8000): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || err?.message || `API error: ${res.status}`);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function apiQuery<T>(procedure: string, input?: any): Promise<T> {
  const headers = await getHeaders();
  const url = input !== undefined
    ? `${API_URL}/api/trpc/${procedure}?input=${encodeURIComponent(JSON.stringify({ json: input }))}`
    : `${API_URL}/api/trpc/${procedure}`;
  
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error: ${res.status}`);
  }
  const data = await res.json();
  return data?.result?.data?.json as T;
}

export async function apiMutation<T>(procedure: string, input: any): Promise<T> {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/api/trpc/${procedure}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ json: input }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error: ${res.status}`);
  }
  const data = await res.json();
  return data?.result?.data?.json as T;
}

// ─── Live AthlynXAI platform endpoints ──────────────────────────────────────
export type InnovationStatus = "LIVE" | "ACTIVE" | "ROADMAP" | string;

export interface InnovationCardData {
  id: string;
  title: string;
  claim: string;
  status: InnovationStatus;
  stages?: string[];
  model?: string;
  engine?: string;
  proof_endpoint?: string;
}

export interface InnovationsManifest {
  platform: string;
  version: string;
  locked?: string;
  innovations: InnovationCardData[];
  doctrine_tagline?: string;
  platform_doctrine?: string;
  signoff?: string;
}

export interface ComputeManifest {
  os: string;
  version: string;
  hardware?: string;
  nebius_configured?: boolean;
  models?: Record<string, { id?: string; role?: string }>;
  open_model_alignment?: string[];
  ising_readiness?: boolean;
  workload_thesis?: string;
  live?: Record<string, unknown> | null;
  error?: string;
  signoff?: string;
}

export interface NILValuationSnapshot {
  currentValue: number;
  previousValue?: number;
  spikePercent?: number;
  confidence?: number;
  drivers?: string[];
  engine?: string;
  updatedAt?: string;
}

export const platformApi = {
  getInnovations: () => fetchJson<InnovationsManifest>(`${API_URL}/api/innovations`),
  getCompute: (probe = false) => fetchJson<ComputeManifest>(`${API_URL}/api/os/compute${probe ? "?probe=1" : ""}`),
  getNILValuation: async () => {
    const candidates = [
      `${API_URL}/api/nil/valuation`,
      `${API_URL}/api/valuation/nil`,
      `${API_URL}/api/trpc/nil.getValuation`,
    ];
    for (const url of candidates) {
      try {
        return await fetchJson<NILValuationSnapshot>(url, {}, 5000);
      } catch {}
    }
    return null;
  },
};

// ─── Feed ─────────────────────────────────────────────────────────────────────
export const feedApi = {
  getFeed: (limit = 20, offset = 0) =>
    apiQuery<any[]>("feed.getFeed", { limit, offset }),
  createPost: (content: string, postType?: string, mediaUrls?: string[]) =>
    apiMutation("feed.createPost", { content, postType, mediaUrls }),
  likePost: (postId: number) =>
    apiMutation("feed.likePost", { postId }),
  getComments: (postId: number) =>
    apiQuery<any[]>("feed.getComments", { postId }),
  addComment: (postId: number, content: string) =>
    apiMutation("feed.addComment", { postId, content }),
};

// ─── Profile ──────────────────────────────────────────────────────────────────
export const profileApi = {
  getMyProfile: () => apiQuery<any>("profile.getMyProfile"),
  getProfile: (userId: number) => apiQuery<any>("profile.getProfile", { userId }),
  updateProfile: (data: any) => apiMutation("profile.updateProfile", data),
  searchAthletes: (query: string, sport?: string, limit = 20) =>
    apiQuery<any[]>("profile.searchAthletes", { query, sport, limit }),
};

// ─── NIL ──────────────────────────────────────────────────────────────────────
export const nilApi = {
  getMyDeals: () => apiQuery<any[]>("nil.getMyDeals"),
  getAllDeals: (status?: string, category?: string) =>
    apiQuery<any[]>("nil.getAllDeals", { status, category, limit: 20 }),
  createDeal: (data: any) => apiMutation("nil.createDeal", data),
  updateDealStatus: (dealId: number, status: string) =>
    apiMutation("nil.updateDealStatus", { dealId, status }),
  getValuation: () => platformApi.getNILValuation(),
};

// ─── Notifications ────────────────────────────────────────────────────────────
export const notificationsApi = {
  getNotifications: () => apiQuery<any[]>("notifications.getNotifications"),
  markRead: (notificationId: number) =>
    apiMutation("notifications.markRead", { notificationId }),
  markAllRead: () => apiMutation("notifications.markAllRead", {}),
};

// ─── Messaging ────────────────────────────────────────────────────────────────
export const messagingApi = {
  getConversations: () => apiQuery<any[]>("messenger.getConversations"),
  getMessages: (conversationId: number) =>
    apiQuery<any[]>("messenger.getMessages", { conversationId }),
  sendMessage: (conversationId: number, content: string) =>
    apiMutation("messenger.sendMessage", { conversationId, content }),
  startConversation: (userId: number, message: string) =>
    apiMutation("messenger.startConversation", { userId, message }),
};

// ─── Training ─────────────────────────────────────────────────────────────────
export const trainingApi = {
  getStats: () => apiQuery<any>("training.getStats"),
  getHistory: (limit = 30) => apiQuery<any[]>("training.getHistory", { limit }),
  logWorkout: (data: {
    workout: string;
    duration?: number;
    notes?: string;
    performance?: number;
  }) => apiMutation("training.logWorkout", data),
};

// ─── Media / S3 ──────────────────────────────────────────────────────────────
export const mediaApi = {
  getUploadUrl: (data: {
    filename: string;
    contentType: string;
    mediaType: "highlight" | "game_film" | "training" | "profile_photo" | "cover_photo" | "other";
    fileSizeBytes: number;
  }) => apiMutation<{ uploadUrl: string | null; key: string; publicUrl: string; fallback: boolean }>("media.getUploadUrl", data),
  saveMedia: (data: {
    key: string;
    publicUrl: string;
    mediaType: string;
    title?: string;
    sport?: string;
  }) => apiMutation<any>("media.saveMedia", data),
  updateAvatar: (avatarUrl: string) =>
    apiMutation<any>("profile.updateProfile", { avatarUrl }),
};

// ─── AI ───────────────────────────────────────────────────────────────────────
export const aiApi = {
  generateCaption: (context: string) =>
    apiMutation("ai.generateCaption", { context }),
  getXFactorScore: (userId?: number) =>
    apiQuery<any>("ai.getXFactorScore", userId ? { userId } : undefined),
  generateScoutingReport: (data: {
    athleteName: string;
    sport: string;
    position: string;
    school: string;
    year?: string;
    state?: string;
    xScore?: number;
    fortyYd?: string;
    vertical?: string;
    bench?: number;
    gpa?: number;
    offers?: number;
    nilValue?: number;
    highlights?: string;
  }) => apiMutation("ai.generateScoutingReport", data),
  getCredits: () => apiQuery<any>("ai.getCredits"),
};
