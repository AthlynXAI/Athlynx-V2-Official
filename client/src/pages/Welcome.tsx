import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import NILAvatar from "@/components/NILAvatar";

/**
 * Welcome.tsx — Post-signup two-door handoff.
 * Build 1 Session 2 — June 10 2026
 *
 * FLOW:
 *   New user  (pct < 60)  → shows two-door screen → web → /onboarding
 *   Returning (pct >= 60) → auto-redirects to /portal immediately (no two-door)
 *   Signed-out            → /signup
 *
 * Per Chad's locked decisions:
 *   • iOS  → TestFlight link (until App Store live)
 *   • Android → Play internal testing (until Play live)
 *   • Footer: "Change anytime"
 *   • Brand: Cobalt · Granite · Electric Blue · Stadium Lights. NO yellow/gold/amber/orange.
 *   • landingPreference stored in localStorage
 */

const COLORS = {
  base: "#040c1a",
  surface: "#0a1628",
  border: "#0d1e3c",
  cobalt: "#0047AB",
  electricBlue: "#1E90FF",
  stadiumLight: "#00c2ff",
  granite: "#2a3a4a",
  white: "#ffffff",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
};

const TESTFLIGHT_URL = "https://testflight.apple.com/join/athlynx";
const PLAY_INTERNAL_URL = "https://play.google.com/apps/internaltest/athlynxai";

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
  if (pct >= 80) return `Your athlete identity is ${pct}% complete. Finish the last details when you are ready.`;
  if (pct >= 40) return `Your athlete identity is ${pct}% complete. Add your face and proof to stand out.`;
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

interface DoorCardProps {
  title: string;
  subtitle: string;
  firstTimeMicrocopy: string;
  primaryLabel: string;
  secondaryLabel?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
  highlight?: boolean;
}

function DoorCard({ title, subtitle, firstTimeMicrocopy, primaryLabel, secondaryLabel, onPrimary, onSecondary, highlight }: DoorCardProps) {
  return (
    <div style={{
      background: highlight ? `linear-gradient(135deg, ${COLORS.cobalt}22, ${COLORS.electricBlue}11)` : COLORS.surface,
      border: `1px solid ${highlight ? COLORS.electricBlue : COLORS.border}`,
      borderRadius: 16,
      padding: "24px 20px",
      marginBottom: 16,
      boxShadow: highlight ? `0 0 32px ${COLORS.electricBlue}22` : "none",
    }}>
      <div style={{ fontWeight: 800, fontSize: 18, color: COLORS.white, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 4 }}>{subtitle}</div>
      <div style={{ fontSize: 12, color: COLORS.stadiumLight, marginBottom: 16, fontStyle: "italic" }}>{firstTimeMicrocopy}</div>
      <button onClick={onPrimary} style={{
        width: "100%",
        padding: "14px",
        background: highlight ? `linear-gradient(90deg, ${COLORS.cobalt}, ${COLORS.electricBlue})` : COLORS.granite,
        color: COLORS.white,
        border: "none",
        borderRadius: 10,
        fontSize: 15,
        fontWeight: 800,
        cursor: "pointer",
        marginBottom: secondaryLabel ? 8 : 0,
        letterSpacing: 0.5,
        boxShadow: highlight ? `0 4px 20px ${COLORS.electricBlue}44` : "none",
      }}>{primaryLabel}</button>
      {secondaryLabel && onSecondary && (
        <button onClick={onSecondary} style={{
          width: "100%",
          padding: "11px",
          background: "transparent",
          color: COLORS.textSecondary,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
        }}>{secondaryLabel}</button>
      )}
    </div>
  );
}

function WelcomeInner() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    staleTime: 15_000,
  });
  const [platform] = useState<Platform>(() => detectPlatform());
  const [remember, setRemember] = useState(false);
  const [autoRedirecting, setAutoRedirecting] = useState(false);

  useEffect(() => {
    document.title = "Welcome to AthlynX";
  }, []);

  // Signed-out users → /signup
  if (!isLoading && !user && typeof window !== "undefined") {
    window.location.replace("/signup");
    return null;
  }

  if (isLoading || !user) {
    return (
      <div style={{
        minHeight: "100vh",
        background: COLORS.base,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}>
        <div style={{
          width: 52,
          height: 52,
          border: `3px solid ${COLORS.border}`,
          borderTopColor: COLORS.stadiumLight,
          borderRadius: "50%",
          animation: "athlynxSpin 0.8s linear infinite",
        }} />
        <style>{`@keyframes athlynxSpin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ color: COLORS.textMuted, fontSize: 14 }}>Loading your profile…</div>
      </div>
    );
  }

  const u: any = user;

  // Tombstone guard
  const rawName = typeof u.name === "string" ? u.name : "";
  const isTombstone = rawName.trim().startsWith("[retired");
  if (isTombstone && typeof console !== "undefined") {
    console.warn("[Welcome] retired user session detected; falling back to email/displayName", { id: u.id, email: u.email });
  }
  const nameSource = isTombstone
    ? (u.displayName || u.email?.split("@")[0] || "athlete")
    : (rawName || u.displayName || u.email?.split("@")[0] || "athlete");
  const firstName = String(nameSource).split(" ")[0];
  const pct = computeIdentityPercent(u);

  // ─── AUTO-REDIRECT: Returning users with complete enough profile skip the two-door screen ───
  // pct >= 60 means they've been here before and have a real profile. Send them straight to /portal.
  useEffect(() => {
    if (!isLoading && user && pct >= 60 && !autoRedirecting) {
      setAutoRedirecting(true);
      // Small delay so they see the "Welcome back" flash
      const t = setTimeout(() => {
        setLocation("/portal");
      }, 800);
      return () => clearTimeout(t);
    }
  }, [isLoading, user, pct, autoRedirecting, setLocation]);

  if (autoRedirecting || pct >= 60) {
    return (
      <div style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${COLORS.base} 0%, #0a1628 50%, ${COLORS.base} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        fontFamily: "system-ui, sans-serif",
      }}>
        {/* Stadium lights effect */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 4,
          background: `linear-gradient(90deg, ${COLORS.cobalt}, ${COLORS.electricBlue}, ${COLORS.stadiumLight}, ${COLORS.electricBlue}, ${COLORS.cobalt})`,
        }} />
        <div style={{ fontSize: 40 }}>⚡</div>
        <div style={{ fontWeight: 900, fontSize: 28, color: COLORS.white, letterSpacing: 2, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          AthlynX
        </div>
        <div style={{ fontWeight: 800, fontSize: 22, color: COLORS.white }}>
          Welcome back, {firstName}.
        </div>
        <div style={{ color: COLORS.stadiumLight, fontSize: 14 }}>Taking you to your platform…</div>
        <div style={{
          width: 48,
          height: 48,
          border: `3px solid ${COLORS.cobalt}`,
          borderTopColor: COLORS.stadiumLight,
          borderRadius: "50%",
          animation: "athlynxSpin 0.8s linear infinite",
          marginTop: 8,
        }} />
        <style>{`@keyframes athlynxSpin { to { transform: rotate(360deg); } }`}</style>
        {/* Dozier legacy watermark */}
        <div style={{ position: "absolute", bottom: 24, color: COLORS.textMuted, fontSize: 11, letterSpacing: 1 }}>
          © 2026 AthlynX™ · Chad Allen Dozier Sr. · Be The Legacy
        </div>
      </div>
    );
  }

  // ─── NEW USER TWO-DOOR SCREEN ───
  function rememberAndSave(choice: "app" | "web") {
    try {
      if (remember) {
        localStorage.setItem("athlynx_landing_preference", choice);
        localStorage.setItem("athlynx_landing_chosen_at", new Date().toISOString());
      }
    } catch { /* ignore */ }
  }

  function openApp() {
    rememberAndSave("app");
    if (platform === "ios") {
      window.location.href = TESTFLIGHT_URL;
    } else if (platform === "android") {
      window.location.href = PLAY_INTERNAL_URL;
    } else {
      window.location.href = "/install";
    }
  }

  function openWeb() {
    rememberAndSave("web");
    // New user → onboarding. Returning (pct >= 60) already handled above.
    setLocation("/onboarding");
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${COLORS.base} 0%, #0a1628 60%, ${COLORS.base} 100%)`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 20px",
      fontFamily: "system-ui, sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Stadium lights top bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 4,
        background: `linear-gradient(90deg, ${COLORS.cobalt}, ${COLORS.electricBlue}, ${COLORS.stadiumLight}, ${COLORS.electricBlue}, ${COLORS.cobalt})`,
      }} />

      {/* Athlete mural watermark */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 20% 50%, ${COLORS.cobalt}08 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, ${COLORS.electricBlue}06 0%, transparent 60%)`,
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 900,
            fontSize: 32,
            color: COLORS.white,
            letterSpacing: 3,
            textShadow: `0 0 40px ${COLORS.electricBlue}66`,
          }}>AthlynX</div>
          <div style={{ color: COLORS.stadiumLight, fontSize: 12, letterSpacing: 2, marginTop: 4, textTransform: "uppercase" }}>
            The Athlete's Playbook
          </div>
        </div>

        {/* Avatar + identity */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <NILAvatar src={u.avatarUrl} email={u.email} name={u.name} size="lg" />
          <div style={{ fontWeight: 800, fontSize: 22, color: COLORS.white, marginTop: 12 }}>
            Welcome, {firstName}. 🏆
          </div>
          <div style={{ color: COLORS.textSecondary, fontSize: 14, marginTop: 4 }}>
            {identityCaption(pct)}
          </div>
          {/* Identity progress bar */}
          <div style={{ margin: "12px auto 0", maxWidth: 280, height: 6, background: COLORS.granite, borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${COLORS.cobalt}, ${COLORS.stadiumLight})`,
              borderRadius: 3,
              transition: "width 0.8s ease",
            }} />
          </div>
          <div style={{ color: COLORS.textMuted, fontSize: 11, marginTop: 4 }}>{pct}% complete</div>
        </div>

        {/* Two-door cards */}
        <DoorCard
          key="web"
          title="Start on Web Now"
          subtitle="Full platform. Zero download. Works on any device."
          firstTimeMicrocopy="First time here? Start here. Complete your profile in 2 minutes."
          primaryLabel="Enter AthlynX Platform →"
          onPrimary={openWeb}
          highlight={true}
        />

        <DoorCard
          key="app"
          title="Install the App"
          subtitle="Native iOS & Android experience. Available now on TestFlight."
          firstTimeMicrocopy="You can install the app anytime. Start on web first."
          primaryLabel={
            platform === "ios" ? "Open TestFlight (iOS)" :
            platform === "android" ? "Join Android Beta" :
            "Get App Install Link"
          }
          onPrimary={openApp}
          highlight={false}
        />

        {/* Remember choice */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginTop: 8, marginBottom: 20 }}>
          <input
            type="checkbox"
            id="remember"
            checked={remember}
            onChange={e => setRemember(e.target.checked)}
            style={{ accentColor: COLORS.electricBlue, width: 14, height: 14 }}
          />
          <label htmlFor="remember" style={{ color: COLORS.textMuted, fontSize: 12, cursor: "pointer" }}>
            Remember my choice
          </label>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", borderTop: `1px solid ${COLORS.border}`, paddingTop: 16 }}>
          <p style={{ color: COLORS.textMuted, fontSize: 11, margin: "0 0 8px" }}>
            Need help?{" "}
            <a href="mailto:team@athlynx.ai" style={{ color: COLORS.stadiumLight, textDecoration: "none" }}>team@athlynx.ai</a>
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <a href="/account/switch" style={{ color: COLORS.textMuted, fontSize: 11, textDecoration: "none" }}>Switch account</a>
            <a href="/logout" style={{ color: COLORS.textMuted, fontSize: 11, textDecoration: "none" }}>Sign out</a>
          </div>
          <div style={{ color: COLORS.textMuted, fontSize: 10, marginTop: 12, letterSpacing: 0.5 }}>
            © 2026 AthlynX™ · Chad Allen Dozier Sr. · Be The Legacy · Change anytime
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Welcome() {
  return <RouteErrorBoundary><WelcomeInner /></RouteErrorBoundary>;
}
