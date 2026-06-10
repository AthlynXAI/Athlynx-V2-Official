/**
 * AthlynXAI — Trial Expired / Payment Wall
 * Shown when a user's 7-day free trial has ended and they have no active subscription.
 * Clean, branded, easy — like Netflix/Spotify upgrade screens.
 */
import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

const PLANS = [
  {
    id: "athlete_starter",
    name: "Starter",
    price: "$9.99",
    period: "/month",
    color: "#0099ff",
    features: ["Athlete Profile", "NIL Discovery", "Community Feed", "Transfer Portal", "AI Trainer (10 msgs/day)"],
    popular: false,
  },
  {
    id: "athlete_pro",
    name: "Pro",
    price: "$19.99",
    period: "/month",
    color: "#00c2ff",
    features: ["Everything in Starter", "AI Recruiter Tools", "NIL Marketplace", "Warriors Playbook", "AI Trainer (50 msgs/day)", "Priority Support"],
    popular: true,
  },
  {
    id: "athlete_elite",
    name: "Elite",
    price: "$39.99",
    period: "/month",
    color: "#7c3aed",
    features: ["Everything in Pro", "NIL Vault", "Brand Deal AI", "Dedicated Manager", "Unlimited AI Trainer", "API Access"],
    popular: false,
  },
];

function TrialExpiredInner() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const createCheckout = trpc.stripe.createSubscriptionCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url;
    },
    onError: (err: { message?: string }) => {
      setError(err.message || "Could not start checkout. Please try again.");
      setLoading(null);
    },
  });

  const handleSelectPlan = (planId: string) => {
    setLoading(planId);
    setError("");
    createCheckout.mutate({
      planId,
      interval: "month",
      origin: window.location.origin,
    });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 50%, #0a1628 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "system-ui, sans-serif",
      padding: "20px",
    }}>
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <img src="/athlynxai-icon.png" alt="AthlynXAI" style={{ width: 64, height: 64, borderRadius: 16, marginBottom: 16 }} />
        <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: "900", margin: "0 0 8px" }}>
          Your Free Trial Has Ended
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "16px", margin: 0 }}>
          {user?.name ? `${user.name}, choose` : "Choose"} a plan to keep your full access to AthlynXAI.
        </p>
      </div>

      {/* Plans */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
        maxWidth: "480px",
      }}>
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            style={{
              background: plan.popular ? "rgba(0,194,255,0.08)" : "rgba(255,255,255,0.04)",
              border: `2px solid ${plan.popular ? plan.color : "rgba(255,255,255,0.1)"}`,
              borderRadius: "16px",
              padding: "24px",
              position: "relative",
            }}
          >
            {plan.popular && (
              <div style={{
                position: "absolute",
                top: "-12px",
                left: "50%",
                transform: "translateX(-50%)",
                background: plan.color,
                color: "#fff",
                fontSize: "11px",
                fontWeight: "800",
                padding: "4px 16px",
                borderRadius: "20px",
                letterSpacing: "1px",
              }}>
                MOST POPULAR
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <div style={{ color: "#fff", fontSize: "20px", fontWeight: "800" }}>{plan.name}</div>
                <div style={{ color: "#94a3b8", fontSize: "13px" }}>Billed monthly · Cancel anytime</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ color: plan.color, fontSize: "28px", fontWeight: "900" }}>{plan.price}</span>
                <span style={{ color: "#94a3b8", fontSize: "13px" }}>{plan.period}</span>
              </div>
            </div>
            <ul style={{ margin: "0 0 20px", padding: "0", listStyle: "none" }}>
              {plan.features.map((f, i) => (
                <li key={i} style={{ color: "#cbd5e1", fontSize: "14px", padding: "4px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: plan.color, fontSize: "16px" }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSelectPlan(plan.id)}
              disabled={loading === plan.id}
              style={{
                width: "100%",
                padding: "14px",
                background: "#0066ff",
                border: "none",
                borderRadius: "10px",
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
                cursor: loading === plan.id ? "wait" : "pointer",
                opacity: loading && loading !== plan.id ? 0.5 : 1,
              }}
            >
              {loading === plan.id ? "Loading..." : `Start ${plan.name} — ${plan.price}/mo`}
            </button>
          </div>
        ))}
      </div>

      {error && (
        <p style={{ color: "#f87171", marginTop: "16px", fontSize: "14px", textAlign: "center" }}>{error}</p>
      )}

      <p style={{ color: "#475569", fontSize: "12px", marginTop: "24px", textAlign: "center" }}>
        Secure payment via Stripe · Cancel anytime · No hidden fees
      </p>
    </div>
  );
}

export default function TrialExpired() {
  return <RouteErrorBoundary><TrialExpiredInner /></RouteErrorBoundary>;
}
