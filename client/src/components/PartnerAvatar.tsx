/**
 * PartnerAvatar — Build 26.6
 * Renders the correct headshot for Master Admin (Chad) and Admin Users (partners).
 * Priority: explicit src prop → email map → DB profilePicture → initials.
 * All headshot images live at /images/team/*.png (already deployed to prod).
 */
import { useState } from "react";

// Email → headshot URL map. Source of truth for partner headshots.
// Master Admin (Chad) + named active operators (Glenn, Lee, Tony).
// Real headshots live in client/public/team/*.jpg (served at /team/*.jpg) when available.
export const PARTNER_HEADSHOTS: Record<string, string> = {
  // Master Admin / owner lane required for platform access.
  "chaddozier75@gmail.com": "/team/chad-dozier.jpg",
  // Public-safe active operator lane.
  "contact@athlynx.ai": "/team/chad-dozier.jpg",
  "gtse@athlynx.ai": "/team/glenn-tse.jpg",
  "lmarshall@athlynx.ai": "/team/lee-marshall.jpg",
};

export const MASTER_ADMIN_EMAIL = "chaddozier75@gmail.com";

export function isMasterAdmin(email?: string | null): boolean {
  return !!email && email.toLowerCase() === MASTER_ADMIN_EMAIL;
}

export function resolveHeadshot(email?: string | null, dbAvatar?: string | null): string | null {
  if (dbAvatar) return dbAvatar;
  if (!email) return null;
  const mapped = PARTNER_HEADSHOTS[email.toLowerCase()];
  return mapped && mapped.length > 0 ? mapped : null;
}

interface PartnerAvatarProps {
  email?: string | null;
  name?: string | null;
  dbAvatar?: string | null; // user.profilePicture or similar from DB
  src?: string | null;       // explicit override
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  ring?: boolean;            // cyan ring for master admin / verified partners
}

const SIZE_MAP = {
  xs: "w-7 h-7 text-[10px]",
  sm: "w-9 h-9 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-16 h-16 text-base",
};

export default function PartnerAvatar({
  email,
  name,
  dbAvatar,
  src,
  size = "sm",
  className = "",
  ring = false,
}: PartnerAvatarProps) {
  const resolved = src ?? resolveHeadshot(email, dbAvatar);
  const [errored, setErrored] = useState(false);

  const initials =
    (name ?? email ?? "?")
      .split(/\s+|@/)
      .filter(Boolean)
      .map((s) => s[0]?.toUpperCase() ?? "")
      .slice(0, 2)
      .join("") || "?";

  const sizeClasses = SIZE_MAP[size];
  const ringClasses = ring ? "ring-2 ring-cyan-400/60 ring-offset-2 ring-offset-slate-950" : "";

  if (resolved && !errored) {
    return (
      <img
        src={resolved}
        alt={name ?? email ?? "user"}
        className={`${sizeClasses} rounded-full object-cover bg-slate-800 ${ringClasses} ${className}`}
        onError={() => setErrored(true)}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} rounded-full bg-gradient-to-br from-[#1E90FF]/20 to-blue-500/30 border border-[#1E90FF]/30 flex items-center justify-center font-bold text-white ${ringClasses} ${className}`}
      aria-label={name ?? email ?? "user"}
    >
      {initials}
    </div>
  );
}
