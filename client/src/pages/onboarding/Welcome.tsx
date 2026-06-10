import { useEffect } from "react";
import { useLocation } from "wouter";
import { ONBOARDING_COLORS as C } from "./_shell";

/**
 * Legacy /onboarding/welcome step (Coach Lynx splash).
 * PR #43: this step was dropped from the 4-step chain. The route stays so old links
 * don't 404, but it auto-forwards to /onboarding/sport. The splash content is kept
 * below as a brief loading state in case the redirect is slow.
 */
export default function Welcome() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    const t = setTimeout(() => setLocation("/onboarding/sport"), 50);
    return () => clearTimeout(t);
  }, [setLocation]);
  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${C.base} 0%, #0d1b3e 50%, ${C.base} 100%)`,
        padding: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 960,
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          padding: 32,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
          alignItems: "center",
        }}
        className="onboarding-welcome-grid"
      >
        <div>
          <div
            style={{
              color: C.blue,
              fontSize: 12,
              letterSpacing: 1.8,
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            Your Trainer
          </div>
          <h1
            style={{
              color: C.white,
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 36,
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Hey, I'm Coach Lynx.
          </h1>
          <p style={{ color: C.textSecondary, fontSize: 16, lineHeight: 1.6, marginTop: 16 }}>
            Your trainer. I'll help you build your profile in about eight minutes, then I stay with you
            for everything else. Practice plan, college list, what to post tonight. Whatever you need.
          </p>
          <p style={{ color: C.textSecondary, fontSize: 16, lineHeight: 1.6, marginTop: 12 }}>
            Let's go to work.
          </p>
          <button
            type="button"
            onClick={() => setLocation("/onboarding/sport")}
            style={{
              marginTop: 28,
              padding: "14px 28px",
              borderRadius: 10,
              background: C.blue,
              color: C.white,
              border: "none",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Let's build it.
          </button>
        </div>
        <div
          className="aspect-square rounded-2xl bg-gradient-to-br from-navy-900 to-blue-600"
          style={{
            aspectRatio: "1 / 1",
            borderRadius: 16,
            background: `linear-gradient(135deg, ${C.base} 0%, ${C.blue} 100%)`,
          }}
        />
      </div>
    </div>
  );
}
