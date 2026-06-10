/**
 * /tiers — Build 4 tiered subscription + credit pack purchase page.
 *
 * Chad's locked words: "Payments have to be perfect and tiered services
 * with credits are crucial to our survival."
 */
import React from "react";
import { trpc } from "@/lib/trpc";

const GOLD = "#D4AF37";
const INK = "#0E0E0E";
const PAPER = "#F7F4EC";
const MUTED = "#6B6B6B";

function fmtUsd(cents: number) {
  const n = Number(cents) || 0;
  return "$" + (n / 100).toFixed(n % 100 === 0 ? 0 : 2);
}

export default function TiersBilling() {
  const tiers = trpc.billing.listTiers.useQuery();
  const packs = trpc.billing.listCreditPacks.useQuery();
  const status = trpc.billing.myStatus.useQuery();
  const startSub = trpc.billing.startSubscriptionCheckout.useMutation();
  const startPack = trpc.billing.startPackCheckout.useMutation();
  const openPortal = trpc.billing.openBillingPortal.useMutation();

  async function buyTier(key: string, cadence: "monthly" | "yearly") {
    try {
      const r = await startSub.mutateAsync({ tierKey: key, cadence, returnPath: "/tiers" });
      if ((r as any)?.url) window.location.href = (r as any).url;
    } catch (e: any) {
      alert(e?.message ?? "Checkout failed");
    }
  }
  async function buyPack(key: string) {
    try {
      const r = await startPack.mutateAsync({ packKey: key, returnPath: "/tiers" });
      if ((r as any)?.url) window.location.href = (r as any).url;
    } catch (e: any) {
      alert(e?.message ?? "Pack checkout failed");
    }
  }
  async function manage() {
    try {
      const r = await openPortal.mutateAsync({ returnPath: "/tiers" });
      if ((r as any)?.url) window.location.href = (r as any).url;
    } catch (e: any) {
      alert(e?.message ?? "Portal failed");
    }
  }

  const s: any = status.data ?? {};
  const creditBalance = Number(s?.balances?.credits ?? 0);
  const tierName = s?.subscription?.tier_name ?? "Backyard (free)";

  return (
    <div style={{ background: PAPER, color: INK, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px 80px" }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: 3,
            color: GOLD,
            textTransform: "uppercase",
            fontWeight: 800,
          }}
        >
          Tiered Services — AthlynX
        </div>
        <h1
          style={{
            fontSize: 44,
            fontWeight: 800,
            margin: "8px 0 6px",
            letterSpacing: -1,
            lineHeight: 1.1,
          }}
        >
          ONE IDENTITY.
          <br />
          EVERY ATHLETE. EVERY PLATFORM.
        </h1>
        <p style={{ color: MUTED, fontSize: 18, maxWidth: 720, margin: 0 }}>
          Start where you are. Earn what you use. Credits stack while your plan
          is active. Values gate runs on every post.
        </p>

        <div
          style={{
            marginTop: 28,
            padding: 16,
            border: `1px solid ${INK}`,
            borderRadius: 8,
            background: "#FFF",
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, color: MUTED, fontWeight: 700 }}>
              YOUR ACCOUNT
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>
              {tierName}
            </div>
            <div style={{ color: MUTED, fontSize: 14 }}>
              {creditBalance.toLocaleString()} credits available
            </div>
          </div>
          <button
            onClick={manage}
            style={{
              background: INK,
              color: PAPER,
              border: "none",
              padding: "10px 16px",
              borderRadius: 6,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Manage Billing
          </button>
        </div>

        <h2 style={{ marginTop: 48, fontSize: 22, fontWeight: 800 }}>Plans</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
            marginTop: 14,
          }}
        >
          {((tiers.data as any[]) ?? []).map((t: any) => {
            const monthly = Number(t.monthly_price_cents);
            const yearly = Number(t.yearly_price_cents);
            const free = monthly === 0 && yearly === 0;
            return (
              <div
                key={t.key}
                style={{
                  border: `1px solid ${INK}`,
                  background: "#FFF",
                  borderRadius: 8,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 18 }}>{t.name}</div>
                <div
                  style={{
                    color: MUTED,
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                  }}
                >
                  {t.audience}
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, marginTop: 12 }}>
                  {free ? "Free" : fmtUsd(monthly)}
                  {!free ? (
                    <span style={{ fontSize: 14, fontWeight: 500, color: MUTED }}>/mo</span>
                  ) : null}
                </div>
                {!free ? (
                  <div style={{ fontSize: 12, color: MUTED }}>
                    or {fmtUsd(yearly)}/yr
                  </div>
                ) : null}
                <ul style={{ fontSize: 13, marginTop: 12, paddingLeft: 18, color: INK }}>
                  <li>{Number(t.monthly_credits).toLocaleString()} credits / mo</li>
                  <li>{Number(t.bonus_credits).toLocaleString()} bonus credits on signup</li>
                  <li>{Number(t.ai_credits_monthly).toLocaleString()} AI credits / mo</li>
                </ul>
                <div style={{ flex: 1 }} />
                <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                  <button
                    onClick={() => buyTier(t.key, "monthly")}
                    disabled={free}
                    style={{
                      flex: 1,
                      background: free ? "#EEE" : INK,
                      color: free ? MUTED : PAPER,
                      border: "none",
                      padding: "8px 10px",
                      borderRadius: 4,
                      fontWeight: 700,
                      cursor: free ? "not-allowed" : "pointer",
                    }}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => buyTier(t.key, "yearly")}
                    disabled={free}
                    style={{
                      flex: 1,
                      background: free ? "#EEE" : "transparent",
                      color: free ? MUTED : INK,
                      border: `1px solid ${INK}`,
                      padding: "8px 10px",
                      borderRadius: 4,
                      fontWeight: 700,
                      cursor: free ? "not-allowed" : "pointer",
                    }}
                  >
                    Yearly
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <h2 style={{ marginTop: 56, fontSize: 22, fontWeight: 800 }}>Credit Packs</h2>
        <p style={{ color: MUTED, fontSize: 14, margin: "4px 0 14px" }}>
          One-time top-ups. Useful when a campaign goes hot.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
          }}
        >
          {((packs.data as any[]) ?? []).map((p: any) => (
            <div
              key={p.key}
              style={{
                border: `1px solid ${INK}`,
                background: "#FFF",
                borderRadius: 8,
                padding: 16,
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 16 }}>{p.name}</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>
                {fmtUsd(p.price_cents)}
              </div>
              <div style={{ color: MUTED, fontSize: 13 }}>
                {Number(p.credits).toLocaleString()} credits
                {p.bonus_credits
                  ? ` + ${Number(p.bonus_credits).toLocaleString()} bonus`
                  : ""}
              </div>
              <button
                onClick={() => buyPack(p.key)}
                style={{
                  width: "100%",
                  marginTop: 12,
                  background: GOLD,
                  color: INK,
                  border: "none",
                  padding: "10px 12px",
                  borderRadius: 4,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Buy Pack
              </button>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 56,
            padding: 20,
            border: `1px solid ${INK}`,
            borderRadius: 8,
            background: INK,
            color: PAPER,
          }}
        >
          <div style={{ fontSize: 11, letterSpacing: 3, color: GOLD, fontWeight: 800 }}>
            VALUES FIRST
          </div>
          <div style={{ fontSize: 18, marginTop: 6, fontWeight: 700 }}>
            People remember meaning, not features.
          </div>
          <div style={{ color: "#BFBFBF", fontSize: 13, marginTop: 4 }}>
            Iron Sharpens Iron — Proverbs 27:17.
          </div>
        </div>
      </div>
    </div>
  );
}
