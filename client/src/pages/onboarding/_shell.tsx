import { useLocation } from "wouter";

// 4-step quick onboarding (PR #43). Skip-anytime lands on /welcome.
// Dropped from the active chain (still accessible standalone, surfaced later in portal):
//   welcome, school, measurements, highlight, stats, socials, signing-day.
export const ONBOARDING_STEPS = [
  { id: "sport", path: "/onboarding/sport", label: "Sport" },
  { id: "position-class", path: "/onboarding/position-class", label: "Position" },
  { id: "headshot", path: "/onboarding/headshot", label: "Headshot" },
  { id: "preview", path: "/onboarding/preview", label: "Preview" },
] as const;

// Legacy step IDs are still valid types so the dropped routes typecheck. They
// just no longer appear in the active 4-step chain; the shell shows them as a
// stand-alone screen with no progress index.
export type OnboardingStepId =
  | (typeof ONBOARDING_STEPS)[number]["id"]
  | "welcome"
  | "school"
  | "measurements"
  | "highlight"
  | "stats"
  | "socials"
  | "signing-day";

const COLORS = {
  base: "#0A1628",
  card: "#0F1E36",
  border: "#1F3257",
  blue: "#00A3FF",
  gold: "#D4AF37",
  white: "#FFFFFF",
  textSecondary: "#B7C3D9",
  textMuted: "#6B7A99",
};

export function OnboardingShell({
  step,
  title,
  subtitle,
  children,
  onContinue,
  continueLabel = "Continue",
  continueDisabled,
}: {
  step: OnboardingStepId;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onContinue?: () => void | Promise<void>;
  continueLabel?: string;
  continueDisabled?: boolean;
}) {
  const [, setLocation] = useLocation();
  const rawIdx = ONBOARDING_STEPS.findIndex(s => s.id === step);
  const inChain = rawIdx >= 0;
  const idx = inChain ? rawIdx : 0;
  const total = ONBOARDING_STEPS.length;
  const progress = inChain ? Math.round(((idx + 1) / total) * 100) : 100;

  const goNext = async () => {
    if (onContinue) {
      await onContinue();
    }
    const next = ONBOARDING_STEPS[idx + 1];
    if (next) {
      setLocation(next.path);
    } else {
      // End of chain — hand off back to /welcome two-door selector.
      setLocation("/welcome");
    }
  };
  const goBack = () => {
    const prev = ONBOARDING_STEPS[idx - 1];
    if (prev) setLocation(prev.path);
  };
  const skipAll = () => setLocation("/welcome");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${COLORS.base} 0%, #0d1b3e 50%, ${COLORS.base} 100%)`,
        padding: 24,
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 640 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ color: COLORS.textMuted, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", fontWeight: 700 }}>
            Step {idx + 1} of {total}
          </span>
          <button
            type="button"
            onClick={skipAll}
            style={{
              background: "transparent",
              border: "none",
              color: COLORS.textMuted,
              fontSize: 12,
              letterSpacing: 0.4,
              cursor: "pointer",
              padding: 0,
            }}
          >
            Skip for now
          </button>
        </div>
        <div style={{ height: 6, background: COLORS.card, borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: COLORS.blue, transition: "width 220ms" }} />
        </div>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 640,
          marginTop: 32,
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          padding: 32,
        }}
      >
        <h1
          style={{
            color: COLORS.white,
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 800,
            fontSize: 28,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ color: COLORS.textSecondary, fontSize: 15, lineHeight: 1.5, margin: "10px 0 24px" }}>
            {subtitle}
          </p>
        )}

        <div style={{ marginTop: 16 }}>{children}</div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, gap: 12 }}>
          <button
            type="button"
            onClick={goBack}
            disabled={idx === 0}
            style={{
              padding: "12px 20px",
              borderRadius: 8,
              background: "transparent",
              color: idx === 0 ? COLORS.textMuted : COLORS.textSecondary,
              border: `1px solid ${COLORS.border}`,
              fontSize: 14,
              fontWeight: 600,
              cursor: idx === 0 ? "not-allowed" : "pointer",
            }}
          >
            Back
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={continueDisabled}
            style={{
              padding: "12px 24px",
              borderRadius: 8,
              background: continueDisabled ? "#1c3458" : COLORS.blue,
              color: COLORS.white,
              border: "none",
              fontSize: 14,
              fontWeight: 700,
              cursor: continueDisabled ? "not-allowed" : "pointer",
              minWidth: 140,
            }}
          >
            {continueLabel}
          </button>
        </div>

        <p style={{ color: COLORS.textMuted, fontSize: 12, textAlign: "center", marginTop: 18 }}>
          You can change anything later in Settings.
        </p>
      </div>
    </div>
  );
}

export const onboardingStyles = {
  input: {
    width: "100%",
    padding: "12px 14px",
    background: COLORS.base,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    color: COLORS.white,
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box" as const,
  },
  chip: (active: boolean) => ({
    padding: "10px 16px",
    borderRadius: 999,
    background: active ? COLORS.blue : "transparent",
    color: active ? COLORS.white : COLORS.textSecondary,
    border: `1px solid ${active ? COLORS.blue : COLORS.border}`,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  }),
  label: { color: COLORS.textMuted, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase" as const, fontWeight: 700, marginBottom: 6, display: "block" },
};

export const ONBOARDING_COLORS = COLORS;
