/**
 * Social Posting Master Kill Switch
 * ----------------------------------------------------------------------------
 * ALL social posting (Buffer, Facebook Graph, Instagram Graph, X/Twitter,
 * LinkedIn, Zapier MCP, etc.) MUST flow through this guard.
 *
 * Default behavior: DISABLED.
 *
 * To enable, the account owner must explicitly set the Vercel env var:
 *   SOCIAL_POSTING_ENABLED=true
 *
 * Any other value (or unset) blocks ALL posting attempts. Even when enabled,
 * publishing is limited to one owner-approved content package per approved
 * destination, with duplicate, platform-format, account-health, and disabled-
 * account safeguards enforced upstream by Social OS.
 *
 * History: An external agent (legacy) wired up multiple auto-posting paths
 * (cron + tRPC mutations + hardcoded Buffer fallback token) without owner
 * authorization. This guard exists so even with valid tokens in env, no
 * post can leave the platform unless the owner has consciously enabled it.
 *
 * Owner: Chad A Dozier — created 2026-05-08
 */

export interface SocialPostingGuardResult {
  allowed: boolean;
  reason?: string;
}

export function isSocialPostingEnabled(): boolean {
  const flag = (process.env.SOCIAL_POSTING_ENABLED || "").toLowerCase().trim();
  return flag === "true" || flag === "1" || flag === "yes";
}

export function checkSocialPostingGuard(): SocialPostingGuardResult {
  if (!isSocialPostingEnabled()) {
    return {
      allowed: false,
      reason:
        "Social posting is disabled by the account owner. Set SOCIAL_POSTING_ENABLED=true only for an owner-approved content package. Automation is one-time per approved destination; duplicates, invalid formats, and disabled accounts must remain blocked.",
    };
  }
  return { allowed: true };
}

export class SocialPostingDisabledError extends Error {
  constructor(message?: string) {
    super(
      message ||
        "Social posting is disabled by the account owner (SOCIAL_POSTING_ENABLED is not true)."
    );
    this.name = "SocialPostingDisabledError";
  }
}
