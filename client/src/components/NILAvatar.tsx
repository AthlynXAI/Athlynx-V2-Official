/**
 * NILAvatar — NIL-First Identity component.
 *
 * Doctrine (see docs/policies/nil-first-identity-doctrine.md):
 *  - Name. Image. Likeness. The athlete owns it; the platform must show it.
 *  - Resolution chain when no explicit `src` is provided:
 *      1. Uploaded avatar (`src` prop / `user.avatarUrl`) — preferred.
 *      2. Showcase photo (`showcaseSrc` prop, consented at signup).
 *      3. Gravatar (server-side md5 lookup via `email`, never exposed client-side).
 *      4. Neutral silhouette + "Identity pending" tooltip at >= 32px.
 *      5. Small initials chip at < 32px (mention pings, dense lists).
 *  - The blue "C" placeholder is forbidden everywhere.
 */
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

export type NILAvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const PX: Record<NILAvatarSize, number> = {
  xs: 24, // < 32px — initials allowed
  sm: 28, // < 32px — initials allowed
  md: 40,
  lg: 56,
  xl: 96,
};

const CLASS: Record<NILAvatarSize, string> = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-7 h-7 text-[11px]",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-24 h-24 text-2xl",
};

function getInitials(name?: string | null): string {
  if (!name) return "·";
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function SilhouetteIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.3 0-9.8 1.7-9.8 4.9v2.7h19.6v-2.7c0-3.3-6.5-4.9-9.8-4.9z" />
    </svg>
  );
}

interface NILAvatarProps {
  /** Tier 1: explicitly uploaded avatar URL. Preferred. */
  src?: string | null;
  /** Tier 2: consented showcase photo URL (used only when src is missing). */
  showcaseSrc?: string | null;
  /** Tier 3: email — triggers server-side Gravatar lookup when src and showcaseSrc are missing. */
  email?: string | null;
  /** Display name — used for tooltip + initials fallback. */
  name?: string | null;
  size?: NILAvatarSize;
  className?: string;
  /** Visual override: force a square (e.g. card hero) instead of circle. */
  shape?: "circle" | "rounded";
}

export function NILAvatar({
  src,
  showcaseSrc,
  email,
  name,
  size = "md",
  className = "",
  shape = "circle",
}: NILAvatarProps) {
  const [broken, setBroken] = useState(false);
  const px = PX[size];
  const allowInitials = px < 32;
  const radius = shape === "circle" ? "rounded-full" : "rounded-2xl";

  // Tier 3: Gravatar lookup — only if tier 1 and tier 2 are both empty.
  // Email is sent to our own server; the md5 hash never leaves the server.
  const shouldQueryGravatar = !src && !showcaseSrc && !!email;
  const gravatarQuery = trpc.social.getGravatarUrl.useQuery(
    { email: email ?? "" },
    { enabled: shouldQueryGravatar, staleTime: 60 * 60 * 1000, retry: false },
  );
  const gravatarSrc = shouldQueryGravatar ? gravatarQuery.data?.url ?? null : null;

  // Reset broken flag if the resolved src changes (e.g. user uploads after Gravatar).
  useEffect(() => {
    setBroken(false);
  }, [src, showcaseSrc, gravatarSrc]);

  // Pick the first non-empty image src in priority order.
  const resolvedSrc = src || showcaseSrc || gravatarSrc;

  // Tier 1 / 2 / 3: render whichever real image resolved.
  if (resolvedSrc && !broken) {
    return (
      <div
        className={`${CLASS[size]} ${radius} overflow-hidden shrink-0 bg-slate-800 ${className}`}
        title={name || undefined}
      >
        <img
          src={resolvedSrc}
          alt={name || "Athlete"}
          className="w-full h-full object-cover"
          onError={() => setBroken(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // Tier 5: small system contexts may use initials.
  if (allowInitials) {
    return (
      <div
        className={`${CLASS[size]} ${radius} bg-slate-700 text-slate-200 flex items-center justify-center font-bold shrink-0 ${className}`}
        title={name || "Identity pending"}
        aria-label={name ? `${name} (no photo)` : "Identity pending"}
      >
        {getInitials(name)}
      </div>
    );
  }

  // Tier 4: default fallback at >= 32px: neutral silhouette + identity-pending hint.
  return (
    <div
      className={`relative ${CLASS[size]} ${radius} bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 ${className}`}
      title="Identity pending — add your headshot"
      aria-label="Identity pending"
    >
      <SilhouetteIcon className="w-3/5 h-3/5 text-slate-500" />
      <span className="sr-only">Identity pending</span>
    </div>
  );
}

export default NILAvatar;
