/**
 * ExpirationWarningPopup
 * Mandatory modal that fires on every authenticated page load when:
 *   - daysRemaining <= 5 (can be snoozed 24h)
 *   - expired (cannot be dismissed — only Renew or Logout)
 *
 * Wired into PlatformLayout so it fires on every protected page.
 */
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

const SNOOZE_KEY = "expiry_popup_snoozed_until";

function getSnoozeUntil(): Date | null {
  try {
    const raw = localStorage.getItem(SNOOZE_KEY);
    if (!raw) return null;
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

function snooze24h() {
  const until = new Date(Date.now() + 24 * 60 * 60 * 1000);
  localStorage.setItem(SNOOZE_KEY, until.toISOString());
}

function clearSnooze() {
  localStorage.removeItem(SNOOZE_KEY);
}

export default function ExpirationWarningPopup() {
  const { user, logout } = useAuth();
  const [visible, setVisible] = useState(false);

  const trialEndsAt = (user as any)?.trialEndsAt ? new Date((user as any).trialEndsAt) : null;
  const stripeSubscriptionId = (user as any)?.stripeSubscriptionId ?? null;
  const now = new Date();

  const daysRemaining = trialEndsAt
    ? Math.max(0, Math.ceil((trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  const isAdmin = (user as any)?.role === 'admin';
  // Partners have full access — same bypass as admin for expiry popup
  const PARTNER_EMAILS = [
    "gtse@dozierholdingsgroup.com", "gtse@athlynx.ai", "lmarshall@athlynx.ai",
  ];
  const isPartner = !!user?.email && PARTNER_EMAILS.includes(user.email.toLowerCase());
  const hasFullAccess = isAdmin || isPartner;
  const isExpired = !hasFullAccess && !!trialEndsAt && trialEndsAt <= now && !stripeSubscriptionId;
  const isWarning = !hasFullAccess && !!trialEndsAt && trialEndsAt > now && !stripeSubscriptionId && daysRemaining !== null && daysRemaining <= 5;

  useEffect(() => {
    if (!user) return;
    if (hasFullAccess) return; // owner/partner — always full access, never show expiry popup
    if (stripeSubscriptionId) return; // paid user — never show

    if (isExpired) {
      clearSnooze(); // expired users can never snooze
      setVisible(true);
      return;
    }

    if (isWarning) {
      const snoozeUntil = getSnoozeUntil();
      if (snoozeUntil && snoozeUntil > now) {
        setVisible(false); // still snoozed
      } else {
        setVisible(true);
      }
    }
  }, [user, isExpired, isWarning, stripeSubscriptionId]);

  if (!visible) return null;

  const expiryDate = trialEndsAt
    ? trialEndsAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "—";

  const expiryTime = trialEndsAt
    ? trialEndsAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZoneName: "short" })
    : "—";

  const handleSnooze = () => {
    snooze24h();
    setVisible(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className={`w-full max-w-md rounded-3xl border-2 p-8 shadow-2xl ${
        isExpired
          ? "bg-[#1a0000] border-red-500 shadow-red-500/30"
          : "bg-[#040c1a] border-blue-400 shadow-blue-400/20"
      }`}>

        {/* Icon */}
        <div className="text-center mb-5">
          <div className={`text-6xl mb-3 ${isExpired ? "animate-pulse" : ""}`}>
            {isExpired ? "🔒" : "⚠️"}
          </div>
          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black tracking-widest uppercase ${
            isExpired
              ? "bg-red-500/20 border border-red-500/40 text-red-400"
              : "bg-blue-400/10 border border-blue-400/30 text-sky-400"
          }`}>
            <span className={`w-2 h-2 rounded-full ${isExpired ? "bg-red-400" : "bg-blue-400"} animate-pulse`} />
            {isExpired ? "Account Suspended" : `${daysRemaining} Day${daysRemaining !== 1 ? "s" : ""} Remaining`}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-black text-white text-center mb-2">
          {isExpired ? "Your Trial Has Ended" : "Your Trial Is Expiring Soon"}
        </h2>

        {/* Expiry info */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-5 text-center">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
            {isExpired ? "Expired On" : "Expires On"}
          </p>
          <p className="text-white font-black text-lg">{expiryDate}</p>
          <p className="text-white/50 text-sm">{expiryTime}</p>
        </div>

        {/* Message */}
        <p className="text-white/60 text-sm text-center leading-relaxed mb-6">
          {isExpired
            ? "Your 7-day free trial has ended. Upgrade now to restore full access to AthlynX — NIL deals, AI recruiting, training, and more."
            : `You have ${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} left on your free trial. Upgrade now to keep uninterrupted access to the full AthlynX platform.`}
        </p>

        {/* Pricing hint */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { name: "Starter", price: "$9.99/mo", color: "border-blue-500/40 text-blue-400" },
            { name: "Pro", price: "$19.99/mo", color: "border-cyan-500/40 text-cyan-400", highlight: true },
            { name: "Elite", price: "$39.99/mo", color: "border-purple-500/40 text-purple-400" },
          ].map(p => (
            <div key={p.name} className={`rounded-xl border p-2 text-center ${p.color} ${p.highlight ? "bg-white/5" : ""}`}>
              <div className="font-black text-xs">{p.name}</div>
              <div className="text-white/50 text-[10px] mt-0.5">{p.price}</div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Link href="/billing">
            <button
              className={`w-full py-4 rounded-2xl font-black text-base transition-all ${
                isExpired
                  ? "bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/30"
                  : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/30"
              }`}
              onClick={() => setVisible(false)}
            >
              🚀 Upgrade Now — Keep Full Access
            </button>
          </Link>

          {/* Snooze (warning only) or Logout (expired only) */}
          {isExpired ? (
            <button
              onClick={logout}
              className="w-full py-3 rounded-2xl font-semibold text-sm text-white/40 hover:text-white/60 border border-white/10 hover:border-white/20 transition-all"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleSnooze}
              className="w-full py-3 rounded-2xl font-semibold text-sm text-white/40 hover:text-white/60 border border-white/10 hover:border-white/20 transition-all"
            >
              Remind Me Tomorrow (snooze 24h)
            </button>
          )}
        </div>

        {/* Fine print */}
        <p className="text-white/20 text-[10px] text-center mt-4">
          AthlynX · Dozier Holdings Group · contact@athlynx.ai · Book a call
        </p>
      </div>
    </div>
  );
}
