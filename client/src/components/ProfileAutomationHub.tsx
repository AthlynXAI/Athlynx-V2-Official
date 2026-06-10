/**
 * ProfileAutomationHub — Layer Cake control panel.
 * Owner-only. Lives on /profile.
 *
 * Real Me. Real AI Me.
 * Chad's words, locked: "Make sure my profile page is automated...
 * Private automation and collaboration providers
 * and all socials. Real me. Real AI Me."
 */
import React, { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";

type Provider =
  | "buffer"
  | "zapier"
  | "gravatar"
  | "jira"
  | "confluence"
  | "atlassian"
  | "alignable"
  | "linkedin"
  | "x"
  | "facebook"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "google_business";

const PROVIDERS: { key: Provider; label: string; tagline: string }[] = [
  { key: "buffer",         label: "Publishing",         tagline: "Schedule across 10 channels" },
  { key: "zapier",         label: "Automation",         tagline: "Approved automations" },
  { key: "gravatar",       label: "Avatar",       tagline: "Profile identity" },
  { key: "jira",           label: "Planning",           tagline: "Tickets become posts" },
  { key: "confluence",     label: "Docs",     tagline: "Pages become posts" },
  { key: "atlassian",      label: "Workspace",      tagline: "Workspace plumbing" },
  { key: "alignable",      label: "Business Network",      tagline: "Local business graph" },
  { key: "linkedin",       label: "LinkedIn",       tagline: "Professional voice" },
  { key: "x",              label: "X",              tagline: "Short form heat" },
  { key: "facebook",       label: "Facebook",       tagline: "Community reach" },
  { key: "instagram",      label: "Instagram",      tagline: "Visual layer" },
  { key: "tiktok",         label: "TikTok",         tagline: "Short video layer" },
  { key: "youtube",        label: "YouTube",        tagline: "Long form layer" },
  { key: "google_business",label: "Google Business",tagline: "Map presence" },
];

const GOLD = "#D4AF37";
const INK = "#0E0E0E";
const PAPER = "#F7F4EC";
const MUTED = "#6B6B6B";
const LINE = "#1F1F1F";

export default function ProfileAutomationHub() {
  const automation = trpc.layerCake.getAutomation.useQuery();
  const accountsQ = trpc.layerCake.listConnectedAccounts.useQuery();

  const upsertAuto = trpc.layerCake.upsertAutomation.useMutation({
    onSuccess: () => automation.refetch(),
  });
  const connectAcct = trpc.layerCake.connectAccount.useMutation({
    onSuccess: () => accountsQ.refetch(),
  });
  const toggleAcct = trpc.layerCake.toggleAccount.useMutation({
    onSuccess: () => accountsQ.refetch(),
  });
  const disconnectAcct = trpc.layerCake.disconnectAccount.useMutation({
    onSuccess: () => accountsQ.refetch(),
  });
  const ownerPreempt = trpc.layerCake.ownerPreempt.useMutation();

  const [draft, setDraft] = useState("");
  const [voice, setVoice] = useState<"real_me" | "real_ai">("real_me");

  const accounts = (accountsQ.data as any[]) ?? [];

  const accountsByProvider = useMemo(() => {
    const m: Record<string, any> = {};
    for (const a of accounts || []) m[a.provider] = a;
    return m;
  }, [accounts]);

  const auto: any = automation.data ?? {};
  const enabledChannels: string[] = Array.isArray(auto.channels)
    ? auto.channels
    : (() => {
        try { return JSON.parse(auto.channels ?? "[]"); } catch { return []; }
      })();

  async function handleConnect(p: Provider) {
    try {
      await connectAcct.mutateAsync({ provider: p });
    } catch (e: any) {
      alert(e?.message ?? "Connect failed");
    }
  }

  async function handleToggle(acctId: number, isActive: boolean) {
    try {
      await toggleAcct.mutateAsync({ accountId: acctId, isActive });
    } catch (e: any) {
      alert(e?.message ?? "Toggle failed");
    }
  }

  async function handleDisconnect(acctId: number) {
    if (!confirm("Disconnect this account?")) return;
    try {
      await disconnectAcct.mutateAsync({ accountId: acctId });
    } catch (e: any) {
      alert(e?.message ?? "Disconnect failed");
    }
  }

  async function handleSaveAutomation(nextEnabled?: boolean) {
    try {
      await upsertAuto.mutateAsync({
        enabled: typeof nextEnabled === "boolean" ? nextEnabled : !!auto.enabled,
        dailyTargetCount: Number(auto.daily_target_count ?? 1),
        defaultVoice: voice,
        brandVoiceNote: "man on a porch telling the truth",
        channels: accounts.filter((a) => a.is_active).map((a) => a.provider),
      });
    } catch (e: any) {
      alert(e?.message ?? "Save failed");
    }
  }

  async function handlePreempt() {
    if (!draft.trim()) {
      alert("Write something first.");
      return;
    }
    const channels = accounts.filter((a) => a.is_active).map((a) => a.provider);
    if (channels.length === 0) {
      alert("Connect and enable at least one channel first.");
      return;
    }
    try {
      const res = await ownerPreempt.mutateAsync({
        body: draft,
        channels,
        sourceNote: "Owner preempt from /profile",
      });
      alert("Sent to the cake. ID " + (res as any)?.id);
      setDraft("");
    } catch (e: any) {
      alert(e?.message ?? "Preempt failed");
    }
  }

  return (
    <div
      style={{
        background: PAPER,
        color: INK,
        border: `1px solid ${LINE}`,
        borderRadius: 8,
        padding: 24,
        marginTop: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 8,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 2,
              color: GOLD,
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Layer Cake — Owner Only
          </div>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              margin: "4px 0 0",
              letterSpacing: -0.3,
            }}
          >
            Real Me. Real AI Me.
          </h2>
          <p style={{ color: MUTED, margin: "6px 0 0", maxWidth: 640 }}>
            One control panel for every channel. Connect, toggle, and let the
            cake do the work. Every post passes the values gate before it ships.
          </p>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => handleSaveAutomation(!auto.enabled)}
            style={{
              background: auto.enabled ? INK : "transparent",
              color: auto.enabled ? PAPER : INK,
              border: `1px solid ${INK}`,
              padding: "8px 14px",
              borderRadius: 6,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Automation {auto.enabled ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 10,
          marginTop: 20,
        }}
      >
        {PROVIDERS.map((p) => {
          const acct = accountsByProvider[p.key];
          const connected = !!acct;
          const enabled = !!acct?.is_active;
          return (
            <div
              key={p.key}
              style={{
                border: `1px solid ${connected ? INK : "#D8D5CC"}`,
                background: connected ? "#FFF" : "transparent",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ fontWeight: 700 }}>{p.label}</div>
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 1.2,
                    color: connected ? (enabled ? "#1f7a3a" : GOLD) : MUTED,
                    fontWeight: 700,
                  }}
                >
                  {connected ? (enabled ? "LIVE" : "PAUSED") : "OFF"}
                </div>
              </div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>
                {p.tagline}
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                {!connected ? (
                  <button
                    onClick={() => handleConnect(p.key)}
                    style={{
                      flex: 1,
                      background: INK,
                      color: PAPER,
                      border: "none",
                      padding: "6px 8px",
                      borderRadius: 4,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Connect
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleToggle(acct.id, !enabled)}
                      style={{
                        flex: 1,
                        background: enabled ? "transparent" : INK,
                        color: enabled ? INK : PAPER,
                        border: `1px solid ${INK}`,
                        padding: "6px 8px",
                        borderRadius: 4,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {enabled ? "Pause" : "Resume"}
                    </button>
                    <button
                      onClick={() => handleDisconnect(acct.id)}
                      title="Disconnect"
                      style={{
                        background: "transparent",
                        color: MUTED,
                        border: `1px solid ${MUTED}`,
                        padding: "6px 8px",
                        borderRadius: 4,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 24,
          padding: 16,
          border: `1px solid ${INK}`,
          borderRadius: 6,
          background: "#FFF",
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: 2,
            color: GOLD,
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Owner Preempt — bypass the queue, post now
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => setVoice("real_me")}
            style={{
              padding: "6px 10px",
              border: `1px solid ${INK}`,
              background: voice === "real_me" ? INK : "transparent",
              color: voice === "real_me" ? PAPER : INK,
              borderRadius: 4,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Real Me
          </button>
          <button
            onClick={() => setVoice("real_ai")}
            style={{
              padding: "6px 10px",
              border: `1px solid ${INK}`,
              background: voice === "real_ai" ? INK : "transparent",
              color: voice === "real_ai" ? PAPER : INK,
              borderRadius: 4,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Real AI Me
          </button>
        </div>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Speak plain. Values first. Meaning before features."
          rows={4}
          style={{
            width: "100%",
            marginTop: 10,
            padding: 10,
            border: `1px solid ${LINE}`,
            borderRadius: 4,
            fontFamily: "inherit",
            fontSize: 14,
            resize: "vertical",
          }}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button
            onClick={handlePreempt}
            style={{
              background: GOLD,
              color: INK,
              border: "none",
              padding: "10px 16px",
              borderRadius: 4,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Send to the Cake
          </button>
          <button
            onClick={() => handleSaveAutomation()}
            style={{
              background: "transparent",
              color: INK,
              border: `1px solid ${INK}`,
              padding: "10px 16px",
              borderRadius: 4,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Save Defaults
          </button>
          <div style={{ alignSelf: "center", color: MUTED, fontSize: 12 }}>
            {enabledChannels.length} channel(s) live
          </div>
        </div>
      </div>
    </div>
  );
}
