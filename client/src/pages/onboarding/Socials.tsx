import { useState } from "react";
import { OnboardingShell, ONBOARDING_COLORS as C } from "./_shell";

// Social account OAuth wiring — TikTok and YouTube enabled for Build 1.
// Instagram, X (Twitter), and Snapchat are pending OAuth app approval and will
// be enabled in Build 2 once the athleteSocialAccounts migration lands.

const PLATFORMS: Array<{ id: string; label: string; enabled: boolean; note?: string }> = [
  { id: "tiktok",    label: "TikTok",    enabled: true },
  { id: "youtube",   label: "YouTube",   enabled: true },
  { id: "instagram", label: "Instagram", enabled: false, note: "Coming in Build 2" },
  { id: "twitter",   label: "X (Twitter)", enabled: false, note: "Coming in Build 2" },
  { id: "snapchat",  label: "Snapchat",  enabled: false, note: "Coming in Build 2" },
];

export default function Socials() {
  const [connecting, setConnecting] = useState<string | null>(null);

  function handleConnect(p: typeof PLATFORMS[number]) {
    if (!p.enabled) return;
    setConnecting(p.id);
    // OAuth redirect — Build 2 will replace this with a real OAuth flow
    // routed through /api/oauth/:platform/start
    window.location.href = `/api/oauth/${p.id}/start`;
  }

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
            disabled={!p.enabled || connecting === p.id}
            onClick={() => handleConnect(p)}
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
              opacity: connecting === p.id ? 0.6 : 1,
            }}
          >
            <span>{p.label}</span>
            <span style={{ color: C.textMuted, fontSize: 12 }}>
              {connecting === p.id ? "Connecting…" : p.enabled ? "Connect" : p.note}
            </span>
          </button>
        ))}
      </div>
    </OnboardingShell>
  );
}
