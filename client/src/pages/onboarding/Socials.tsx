import { OnboardingShell, ONBOARDING_COLORS as C } from "./_shell";

// TODO: schema table athleteSocialAccounts — wire OAuth tokens once migration lands.

const PLATFORMS: Array<{ id: string; label: string; enabled: boolean; note?: string }> = [
  { id: "tiktok", label: "TikTok", enabled: true },
  { id: "youtube", label: "YouTube", enabled: true },
  { id: "instagram", label: "Instagram", enabled: false, note: "Coming soon" },
  { id: "twitter", label: "X / Twitter", enabled: false, note: "Coming soon" },
  { id: "snapchat", label: "Snapchat", enabled: false, note: "Coming soon" },
];

export default function Socials() {
  return (
    <OnboardingShell
      step="socials"
      title="Link your channels"
      subtitle="Once we have you, you never leave. One Soul Source."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {PLATFORMS.map(p => (
          <button
            key={p.id}
            type="button"
            disabled={!p.enabled}
            onClick={() => {
              if (!p.enabled) return;
              // TODO: kick off OAuth flow for ${p.id}
              alert(`OAuth wiring for ${p.label} ships next.`);
            }}
            style={{
              padding: "14px 16px",
              borderRadius: 10,
              background: p.enabled ? "transparent" : "#101a2f",
              color: p.enabled ? C.white : C.textMuted,
              border: `1px solid ${p.enabled ? C.border : "#1a253f"}`,
              textAlign: "left",
              fontSize: 14,
              fontWeight: 600,
              cursor: p.enabled ? "pointer" : "not-allowed",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{p.label}</span>
            <span style={{ color: C.textMuted, fontSize: 12 }}>{p.enabled ? "Connect" : p.note}</span>
          </button>
        ))}
      </div>
    </OnboardingShell>
  );
}
