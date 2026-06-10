import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
/**
 * AthlynX — Onboarding Page
 * Build 1 Session 2 — June 10 2026
 *
 * New users land here after sign-up to complete their athlete profile.
 * Uses the full AIOnboarding component with all 19 roles.
 *
 * FLOW: /signup → /welcome → /onboarding → /feed (no loop back to /welcome)
 */
import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import AIOnboarding from "@/components/AIOnboarding";

const COLORS = {
  base: "#040c1a",
  cobalt: "#0047AB",
  electricBlue: "#1E90FF",
  stadiumLight: "#00c2ff",
  granite: "#2a3a4a",
};

function OnboardingInner() {
  const { isAuthenticated, loading: isLoading } = useAuth();

  useEffect(() => {
    document.title = "Set Up Your AthlynX Profile — Be The Legacy";
  }, []);

  // Not authenticated → send to sign in, save return path
  if (!isLoading && !isAuthenticated && typeof window !== "undefined") {
    try {
      sessionStorage.setItem("auth_return_to", "/onboarding");
    } catch { /* ignore */ }
    window.location.replace("/signin");
    return null;
  }

  if (isLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${COLORS.base} 0%, #0a1628 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        fontFamily: "system-ui, sans-serif",
      }}>
        {/* Stadium lights top bar */}
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, height: 4,
          background: `linear-gradient(90deg, ${COLORS.cobalt}, ${COLORS.electricBlue}, ${COLORS.stadiumLight}, ${COLORS.electricBlue}, ${COLORS.cobalt})`,
          zIndex: 100,
        }} />
        <div style={{ position: "relative", width: 64, height: 64 }}>
          <div style={{
            position: "absolute", inset: 0,
            borderRadius: "50%",
            border: `2px solid ${COLORS.stadiumLight}20`,
            animation: "axnPing 1.2s ease-out infinite",
          }} />
          <div style={{
            position: "absolute", inset: 8,
            borderRadius: "50%",
            border: `2px solid ${COLORS.stadiumLight}`,
            borderTopColor: "transparent",
            animation: "axnSpin 0.8s linear infinite",
          }} />
        </div>
        <style>{`
          @keyframes axnSpin { to { transform: rotate(360deg); } }
          @keyframes axnPing { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.8); opacity: 0; } }
        `}</style>
        <div style={{ color: COLORS.stadiumLight, fontSize: 15, fontWeight: 700 }}>
          Loading your profile…
        </div>
        <div style={{ color: "#64748b", fontSize: 12 }}>
          AthlynX™ · Be The Legacy
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${COLORS.base} 0%, #071020 50%, ${COLORS.base} 100%)`,
      position: "relative",
    }}>
      {/* Stadium lights top bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 4,
        background: `linear-gradient(90deg, ${COLORS.cobalt}, ${COLORS.electricBlue}, ${COLORS.stadiumLight}, ${COLORS.electricBlue}, ${COLORS.cobalt})`,
        zIndex: 100,
      }} />

      {/* Athlete mural background glow */}
      <div style={{
        position: "fixed", inset: 0,
        background: `radial-gradient(ellipse at 15% 50%, ${COLORS.cobalt}0a 0%, transparent 50%), radial-gradient(ellipse at 85% 50%, ${COLORS.electricBlue}08 0%, transparent 50%)`,
        pointerEvents: "none",
        zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <AIOnboarding
          onComplete={(_data: Record<string, string>) => {
            // Onboarding complete → go straight to /feed. Never loop back to /welcome.
            window.location.href = "/feed";
          }}
          onDismiss={() => {
            // Dismissed → go to /feed anyway. Athlete is in.
            window.location.href = "/feed";
          }}
        />
      </div>

      {/* Dozier legacy watermark */}
      <div style={{
        position: "fixed", bottom: 12, left: 0, right: 0,
        textAlign: "center",
        color: "#1e3a5f",
        fontSize: 10,
        letterSpacing: 1,
        pointerEvents: "none",
        zIndex: 0,
      }}>
        © 2026 AthlynX™ · Chad Allen Dozier Sr. · Be The Legacy
      </div>
    </div>
  );
}

export default function Onboarding() {
  return <RouteErrorBoundary><OnboardingInner /></RouteErrorBoundary>;
}
