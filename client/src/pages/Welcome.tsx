import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import NILAvatar from "@/components/NILAvatar";

/**
 * Welcome.tsx — Post-signup two-door handoff.
 *
 * Per Manus spec 01-Welcome-Screen.md and Chad's 7 locked decisions:
 *   • iOS  → TestFlight link (until App Store live)
 *   • Android → Play internal testing (until Play live)
 *   • Footer: "Change anytime" (not Cancel anytime)
 *   • Brand: AthlynX navy + blue-cyan gradient. NO yellow / gold / amber / orange.
 *   • Signed-out users are sent to /signup (handled by useAuth check below).
 *   • landingPreference stored in localStorage (cookie/schema in PR #44).
 */

const COLORS = {
  base: "#040c1a",
  surface: "#0a1628",
  border: "#0d1e3c",
  blueStart: "#3b82f6",
  blueEnd: "#06b6d4",
  white: "#ffffff",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
};

const TESTFLIGHT_URL = "https://testflight.apple.com/join/athlynx";
const PLAY_INTERNAL_URL =
  "https://play.google.com/apps/internaltest/athlynxai";

type Platform = "ios" | "android" | "desktop";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  return "desktop";
}

function identityCaption(pct: number): string {
  if (pct >= 100) return "Your athlete identity is complete. You are ready to move.";
  if (pct >= 80)
    return `Your athlete identity is ${pct}% complete. Finish the last details when you are ready.`;
  if (pct >= 40)
    return `Your athlete identity is ${pct}% complete. Add your face and proof to stand out.`;
  return `Your athlete identity is ${pct}% complete. Add the basics to unlock your profile.`;
}

function computeIdentityPercent(user: any): number {
  if (!user) return 0;
  let score = 20; // account exists
  if (user.avatarUrl) score += 25;
  if (user.name && user.name.trim().length > 1) score += 15;
  if (user.email) score += 10;
  if (user.dob || user.birthDate) score += 10;
  if (user.sport || user.athleteProfile?.sport) score += 10;
  if (user.athleteProfile?.school || user.school) score += 10;
  return Math.min(100, score);
}

function WelcomeInner() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    staleTime: 15_000,
  });

  const [platform] = useState<Platform>(() => detectPlatform());
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    document.title = "Welcome to AthlynX";
  }, []);

  // Signed-out users: synchronous redirect during render. Using window.location.replace
  // updates the URL bar AND removes /welcome from history so Back doesn't loop.
  if (!isLoading && !user && typeof window !== "undefined") {
    window.location.replace("/signup");
    return null;
  }

  if (isLoading || !user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: COLORS.base,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: `3px solid ${COLORS.border}`,
            borderTopColor: COLORS.blueEnd,
            borderRadius: "50%",
            animation: "athlynxSpin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes athlynxSpin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const u: any = user;
  // Tombstone guard: retired/merged accounts carry a name like
  // "[retired - merged into 1884 - was chaddozier75]". A stale session on a
  // retired row must never render "Welcome, [retired." — fall back to a clean
  // identity source and signal the dev console so we can spot stuck sessions.
  const rawName = typeof u.name === "string" ? u.name : "";
  const isTombstone = rawName.trim().startsWith("[retired");
  if (isTombstone && typeof console !== "undefined") {
    console.warn(
      "[Welcome] retired user session detected; falling back to email/displayName",
      { id: u.id, email: u.email },
    );
  }
  const nameSource = isTombstone
    ? (u.displayName || u.email?.split("@")[0] || "athlete")
    : (rawName || u.displayName || u.email?.split("@")[0] || "athlete");
  const firstName = String(nameSource).split(" ")[0];
  const pct = computeIdentityPercent(u);

  function rememberAndSave(choice: "app" | "web") {
    try {
      if (remember) {
        localStorage.setItem("athlynx_landing_preference", choice);
        localStorage.setItem("athlynx_landing_chosen_at", new Date().toISOString());
      }
    } catch {
      /* localStorage may be unavailable; ignore */
    }
  }

  function openApp() {
    rememberAndSave("app");
    if (platform === "ios") {
      window.location.href = TESTFLIGHT_URL;
    } else if (platform === "android") {
      window.location.href = PLAY_INTERNAL_URL;
    } else {
      // Desktop: open install instructions in same tab so user can scan QR on phone.
      window.location.href = "/install";
    }
  }

  function openWeb() {
    rememberAndSave("web");
    // First-time users (low identity) → finish quick onboarding; otherwise straight to portal.
    if (pct < 60) {
      setLocation("/onboarding");
    } else {
      setLocation("/portal");
    }
  }

  // Easy-login rule: web/portal is always first so the app-install prompt never blocks sign-in.
  const appFirst = false;

  const appCard = (
    <DoorCard
      key="app"
      title="Install the app later"
      subtitle="Optional app install. Start on web first, then install anytime."
      firstTimeMicrocopy="First time here? Continue on web now. You can install the app later."
      primaryLabel={
        platform === "ios"
          ? "Open App Store (TestFlight)"
          : platform === "android"
          ? "Open Google Play (internal testing)"
          : "Show install options"
      }
      onPrimary={openApp}
      secondaryLabel="Already installed? Open AthlynX."
      onSecondary={() => {
        rememberAndSave("app");
        window.location.href = "athlynx://open";
      }}
    />
  );

  const webCard = (
    <DoorCard
      key="web"
      title="Easy login"
      subtitle="Continue straight to AthlynX in your browser. Works on any device."
      firstTimeMicrocopy="First time here? Start on web now. You can install the app later."
      primaryLabel="Open AthlynX now"
      onPrimary={openWeb}
    />
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${COLORS.base} 0%, #061226 50%, ${COLORS.base} 100%)`,
        color: COLORS.white,
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "24px 14px",
        overflowX: "hidden",
      }}
    >
      <div style={{ maxWidth: 880, margin: "0 auto", width: "100%" }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 900,
              fontSize: 26,
              letterSpacing: 2.5,
              color: COLORS.white,
            }}
          >
            AthlynX
          </div>
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 36,
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Welcome, {firstName}.
          </h1>
          <p
            style={{
              color: COLORS.textSecondary,
              fontSize: 17,
              marginTop: 8,
              marginBottom: 0,
            }}
          >
            Where do you want to be?
          </p>
        </div>

        {/* Identity strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            padding: 16,
            marginBottom: 24,
          }}
        >
          <NILAvatar
            src={u.avatarUrl ?? null}
            showcaseSrc={u.showcasePhotoUrl ?? null}
            email={u.email ?? null}
            name={u.name ?? firstName}
            size="xl"
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 1.1,
                textTransform: "uppercase",
                color: COLORS.textMuted,
                marginBottom: 6,
              }}
            >
              Identity · {pct}%
            </div>
            <div
              style={{
                height: 8,
                background: COLORS.border,
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${COLORS.blueStart}, ${COLORS.blueEnd})`,
                  transition: "width 320ms",
                }}
              />
            </div>
            <p
              style={{
                color: COLORS.textSecondary,
                fontSize: 13,
                lineHeight: 1.45,
                margin: "8px 0 0",
              }}
            >
              {identityCaption(pct)}
            </p>
          </div>
        </div>

        {/* Doors */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: 16,
          }}
        >
          {appFirst ? [appCard, webCard] : [webCard, appCard]}
        </div>

        {/* Remember */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            marginTop: 24,
            color: COLORS.textSecondary,
            fontSize: 14,
          }}
        >
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{ accentColor: COLORS.blueEnd, width: 16, height: 16 }}
            />
            Remember my choice on this account.
          </label>
          <span style={{ color: COLORS.textMuted }}>or</span>
          <span>Ask every time.</span>
        </div>

        {/* Footer */}
        <p
          style={{
            color: COLORS.textMuted,
            fontSize: 12,
            textAlign: "center",
            marginTop: 24,
            lineHeight: 1.6,
          }}
        >
          Sign in on any device · Your data syncs · Change anytime
          <br />
          Need help? <a href="mailto:team@athlynx.ai" style={{ color: COLORS.blueEnd, textDecoration: "none" }}>team@athlynx.ai</a>
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 18,
            marginTop: 12,
            fontSize: 12,
            color: COLORS.textMuted,
          }}
        >
          <a href="/account/switch" style={{ color: COLORS.textMuted, textDecoration: "none" }}>
            Switch account
          </a>
          <span>·</span>
          <a href="/logout" style={{ color: COLORS.textMuted, textDecoration: "none" }}>
            Sign out
          </a>
        </div>
      </div>
    </div>
  );
}

function DoorCard({
  title,
  subtitle,
  firstTimeMicrocopy,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: {
  title: string;
  subtitle: string;
  firstTimeMicrocopy: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  return (
    <div
      style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div>
        <h2
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 800,
            fontSize: 20,
            margin: 0,
            color: COLORS.white,
          }}
        >
          {title}
        </h2>
        <p style={{ color: COLORS.textSecondary, fontSize: 14, marginTop: 6, marginBottom: 0 }}>
          {subtitle}
        </p>
      </div>
      <button
        type="button"
        onClick={onPrimary}
        style={{
          marginTop: 4,
          padding: "13px 18px",
          background: `linear-gradient(90deg, ${COLORS.blueStart}, ${COLORS.blueEnd})`,
          color: COLORS.white,
          border: "none",
          borderRadius: 10,
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        {primaryLabel}
      </button>
      {secondaryLabel && onSecondary && (
        <button
          type="button"
          onClick={onSecondary}
          style={{
            padding: "10px 18px",
            background: "transparent",
            color: COLORS.textSecondary,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {secondaryLabel}
        </button>
      )}
      <p style={{ color: COLORS.textMuted, fontSize: 12, margin: 0 }}>{firstTimeMicrocopy}</p>
    </div>
  );
}

export default function Welcome() {
  return (
    <RouteErrorBoundary>
      <WelcomeInner />
    </RouteErrorBoundary>
  );
}
