/**
 * AthlynX — Gravatar Service
 * Fetches verified avatar URLs and full profile data from Gravatar.
 *
 * Updated 2026-04-29:
 *  - Switched primary hashing to SHA256 (Gravatar's modern standard).
 *  - Kept MD5 as a legacy fallback for profiles that haven't migrated.
 *  - Added `getGravatarProfile()` for full profile JSON (bio, verified accounts, links).
 *
 * Credentials (set in Vercel env):
 *   GRAVATAR_API_KEY       — secret key for server-side API calls (format "8729:gk-...")
 *   GRAVATAR_CLIENT_ID     — OAuth client ID (optional, for user-consent flows)
 *   GRAVATAR_CLIENT_SECRET — OAuth client secret (optional, for user-consent flows)
 */
import crypto from "crypto";

const GRAVATAR_API_KEY = process.env.GRAVATAR_API_KEY ?? "";

/** Returns an SHA256 hash of a lowercase, trimmed email — used by modern Gravatar. */
export function emailSha256(email: string): string {
  return crypto
    .createHash("sha256")
    .update(email.trim().toLowerCase())
    .digest("hex");
}

/** Returns an MD5 hash of a lowercase, trimmed email — legacy Gravatar format. */
export function emailMd5(email: string): string {
  return crypto
    .createHash("md5")
    .update(email.trim().toLowerCase())
    .digest("hex");
}

/** Gravatar profile shape returned by the v3 REST API. */
export type GravatarProfile = {
  hash: string;
  display_name?: string;
  profile_url?: string;
  avatar_url?: string;
  avatar_alt_text?: string;
  location?: string;
  description?: string;
  job_title?: string;
  company?: string;
  verified_accounts?: Array<{
    service_type: string;
    service_label: string;
    service_icon?: string;
    url: string;
    is_hidden?: boolean;
  }>;
  number_verified_accounts?: number;
  first_name?: string;
  last_name?: string;
  last_profile_edit?: string | null;
  registration_date?: string;
};

async function tryFetchProfile(hash: string): Promise<GravatarProfile | null> {
  if (!GRAVATAR_API_KEY) return null;
  try {
    const res = await fetch(`https://api.gravatar.com/v3/profiles/${hash}`, {
      headers: {
        Authorization: `Bearer ${GRAVATAR_API_KEY}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as GravatarProfile & { error?: string };
    if (data?.error) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Fetches the full Gravatar profile for an email.
 * Tries SHA256 first (modern), falls back to MD5 (legacy).
 * Returns null if no Gravatar exists.
 */
export async function getGravatarProfile(email: string): Promise<GravatarProfile | null> {
  if (!email) return null;
  const sha = emailSha256(email);
  const md5 = emailMd5(email);
  // Prefer SHA256; fall back to MD5 only if that fails.
  const profile = (await tryFetchProfile(sha)) ?? (await tryFetchProfile(md5));
  return profile;
}

/**
 * Fetches the Gravatar profile avatar URL for an email.
 * Returns the URL string if a Gravatar exists, or null if not found.
 */
export async function getGravatarUrl(email: string): Promise<string | null> {
  if (!email) return null;

  // 1. Authenticated API path (preferred — returns high-quality CDN URL)
  const profile = await getGravatarProfile(email);
  if (profile?.avatar_url) return profile.avatar_url;

  // 2. Fallback: construct standard CDN URL with HEAD probe (SHA256 then MD5)
  const sha = emailSha256(email);
  const md5 = emailMd5(email);
  for (const hash of [sha, md5]) {
    const cdnUrl = `https://www.gravatar.com/avatar/${hash}?s=400&d=404`;
    try {
      const check = await fetch(cdnUrl, { method: "HEAD" });
      if (check.ok) return `https://www.gravatar.com/avatar/${hash}?s=400`;
    } catch {
      // Network error — try next hash
    }
  }

  return null;
}

/**
 * Convenience: build a direct Gravatar avatar URL for a given email at a given size,
 * without any API call. Useful for client-side fallback rendering.
 */
export function buildGravatarAvatarUrl(email: string, size = 200): string {
  const hash = emailSha256(email);
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=mp`;
}
