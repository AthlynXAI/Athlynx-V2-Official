/**
 * ProTeams — AthlynX Pro Teams Access
 * Dedicated page for NFL, NBA, MLB, NHL, MLS, WNBA, Pro Soccer, Pro Baseball organizations.
 * Roster management, contract tracking, scouting, training, and brand deals.
 */
import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Link } from "wouter";
import PlatformLayout from "@/components/PlatformLayout";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const LEAGUES = [
  { name: "NFL", icon: "🏈", teams: 32, sport: "Football" },
  { name: "NBA", icon: "🏀", teams: 30, sport: "Basketball" },
  { name: "MLB", icon: "⚾", teams: 30, sport: "Baseball" },
  { name: "NHL", icon: "🏒", teams: 32, sport: "Hockey" },
  { name: "MLS", icon: "⚽", teams: 29, sport: "Soccer" },
  { name: "WNBA", icon: "🏀", teams: 13, sport: "Basketball" },
  { name: "Pro Soccer", icon: "⚽", teams: 50, sport: "Soccer" },
  { name: "Pro Baseball", icon: "⚾", teams: 30, sport: "Baseball" },
];

const FEATURES = [
  {
    icon: "👥",
    title: "Roster Management",
    desc: "Full 53-man roster tracking with position depth charts, injury reports, and practice squad management. Real-time updates synced across coaching staff.",
    badge: "CORE",
    color: "border-blue-500/40 bg-blue-500/5",
  },
  {
    icon: "📋",
    title: "Contract Tracking",
    desc: "Track every contract, bonus, incentive clause, and cap hit. Automatic alerts for upcoming renewals, voidable years, and dead cap calculations.",
    badge: "FINANCE",
    color: "border-green-500/40 bg-green-500/5",
  },
  {
    icon: "🔭",
    title: "AI Scouting Intelligence",
    desc: "AI-powered scouting reports on college and pro prospects. Combine data, game film analysis, and predictive performance modeling.",
    badge: "AI",
    color: "border-cyan-500/40 bg-cyan-500/5",
  },
  {
    icon: "🏋️",
    title: "Training & Performance",
    desc: "Athlete training logs, performance metrics, recovery tracking, and AI-generated workout plans tailored to each player's position and goals.",
    badge: "TRAINING",
    color: "border-purple-500/40 bg-purple-500/5",
  },
  {
    icon: "💼",
    title: "Brand Deals & NIL",
    desc: "Manage team-wide brand partnerships, player NIL deals, and sponsorship activations. Full deal pipeline from outreach to signed contract.",
    badge: "NIL",
    color: "border-yellow-500/40 bg-yellow-500/5",
  },
  {
    icon: "📊",
    title: "Analytics Dashboard",
    desc: "Team-wide performance analytics, win probability models, opponent tendencies, and custom reports for front office and coaching staff.",
    badge: "DATA",
    color: "border-red-500/40 bg-red-500/5",
  },
  {
    icon: "📱",
    title: "Player Communication Hub",
    desc: "Secure team messaging, broadcast announcements, schedule management, and meeting coordination — all in one encrypted platform.",
    badge: "COMMS",
    color: "border-indigo-500/40 bg-indigo-500/5",
  },
  {
    icon: "🤖",
    title: "AI Front Office Assistant",
    desc: "Ask the AI anything — trade value analysis, salary cap scenarios, draft pick projections, and free agent market comparisons.",
    badge: "AI",
    color: "border-cyan-500/40 bg-cyan-500/5",
  },
];

const PRICING_TIERS: Array<{
  name: string; price: string; priceNote: string; features: string[];
  color: string; badge: string; badgeColor: string; highlight?: boolean; stripeId?: string;
}> = [
  {
    name: "Pro Teams Starter",
    price: "$2,500/mo",
    priceNote: "per organization",
    stripeId: "price_1TSnkERjBH07kRLYYlitSqLm",
    features: [
      "Up to 100 roster slots",
      "Contract tracking (basic)",
      "Team messaging",
      "Training logs",
      "Standard analytics",
      "Email support",
    ],
    color: "border-blue-500/40",
    badge: "STARTER",
    badgeColor: "bg-blue-600",
  },
  {
    name: "Pro Teams Pro",
    price: "$7,500/mo",
    priceNote: "per organization",
    stripeId: "price_1TSnkMRjBH07kRLYf8UZwzKf",
    features: [
      "Unlimited roster slots",
      "Full contract + cap tracking",
      "AI Scouting Intelligence",
      "Brand deals & NIL management",
      "Advanced analytics dashboard",
      "Dedicated account manager",
      "API access",
    ],
    color: "border-red-400/60",
    badge: "MOST POPULAR",
    badgeColor: "bg-red-500",
    highlight: true,
  },
  {
    name: "Pro Teams Enterprise",
    price: "Custom",
    priceNote: "contact us",
    features: [
      "Everything in Pro",
      "Multi-team organization",
      "Custom integrations",
      "White-label platform",
      "On-site training",
      "SLA guarantee",
      "Executive reporting",
    ],
    color: "border-yellow-400/40",
    badge: "ENTERPRISE",
    badgeColor: "bg-yellow-600",
  },
];

const STATS = [
  { value: "4,500+", label: "Pro Athletes (US)", sub: "NFL · NBA · MLB · NHL · MLS" },
  { value: "213", label: "Pro Teams Nationwide", sub: "All major leagues" },
  { value: "$4.2B", label: "Athlete Mgmt Market", sub: "by 2030 · 13.5% CAGR" },
  { value: "$135B", label: "Sports Tech TAM", sub: "by 2035 · 21.9% CAGR" },
];

function ProTeamsInner() {
  const [activeLeague, setActiveLeague] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const checkoutMutation = trpc.stripe.createSubscriptionCheckout.useMutation({
    onSuccess: (data) => { if (data.url) window.location.href = data.url; },
    onError: () => setCheckoutLoading(null),
    onSettled: () => setCheckoutLoading(null),
  });
  const handleCheckout = (stripeId: string, planName: string) => {
    if (!user) { window.location.href = '/signup'; return; }
    setCheckoutLoading(stripeId);
    checkoutMutation.mutate({ planId: stripeId, interval: 'month', origin: window.location.origin });
  };

  return (
    <PlatformLayout title="Pro Teams">
      <div className="min-h-screen bg-[#040c1a] text-white">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-[#040c1a] to-blue-950/30 pointer-events-none" />
          <div className="max-w-6xl mx-auto px-4 py-20 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-400/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span className="text-red-400 text-xs font-black tracking-widest uppercase">Pro Teams — Now Available</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-white mb-4 leading-tight">
              The Platform Built for<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400">
                Professional Sports
              </span>
            </h1>
            <p className="text-xl text-white/60 max-w-3xl mx-auto mb-4">
              From the practice field to the front office — AthlynX gives pro teams the AI-powered tools to manage rosters, track contracts, scout talent, and close brand deals.
            </p>
            <p className="text-red-400 font-bold text-lg mb-10">
              Youth → High School → College → Pro → Retired — Every Level, Every Sport
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:contact@athlynx.ai?subject=Pro Teams Access Request"
                className="bg-red-500 hover:bg-red-400 text-white font-black px-8 py-4 rounded-2xl text-lg transition-all shadow-lg shadow-red-500/30"
              >
                Request Pro Teams Access
              </a>
              <Link href="/pricing">
                <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all">
                  View All Plans
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map(s => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <div className="text-3xl font-black text-red-400">{s.value}</div>
                <div className="text-white font-bold text-sm mt-1">{s.label}</div>
                <div className="text-white/40 text-xs mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── LEAGUES ── */}
        <section className="max-w-6xl mx-auto px-4 py-10">
          <div className="text-center mb-8">
            <p className="text-red-400 text-xs font-black tracking-widest uppercase mb-2">Supported Leagues</p>
            <h2 className="text-3xl font-black text-white">Every Major League. Every Sport.</h2>
            <p className="text-white/50 mt-2">AthlynX Pro Teams supports all major professional sports organizations nationwide.</p>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {LEAGUES.map(l => (
              <button
                key={l.name}
                onClick={() => setActiveLeague(activeLeague === l.name ? null : l.name)}
                className={`rounded-2xl p-4 text-center border transition-all ${
                  activeLeague === l.name
                    ? "bg-red-500/20 border-red-400/60"
                    : "bg-white/5 border-white/10 hover:border-white/30"
                }`}
              >
                <div className="text-3xl mb-1">{l.icon}</div>
                <div className="text-white font-black text-xs">{l.name}</div>
                <div className="text-white/40 text-[10px] mt-0.5">{l.teams} teams</div>
              </button>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="max-w-6xl mx-auto px-4 py-10">
          <div className="text-center mb-10">
            <p className="text-red-400 text-xs font-black tracking-widest uppercase mb-2">Platform Features</p>
            <h2 className="text-4xl font-black text-white">Everything a Pro Organization Needs</h2>
            <p className="text-white/50 mt-2 max-w-2xl mx-auto">
              One platform. Every tool your front office, coaching staff, and players need — from day one of training camp to the championship.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className={`rounded-2xl border p-6 ${f.color}`}>
                <div className="text-3xl mb-3">{f.icon}</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white font-black text-sm">{f.title}</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/10 text-white/60">{f.badge}</span>
                </div>
                <p className="text-white/50 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRICING ── */}
        <section className="max-w-6xl mx-auto px-4 py-10">
          <div className="text-center mb-10">
            <p className="text-red-400 text-xs font-black tracking-widest uppercase mb-2">Pro Teams Pricing</p>
            <h2 className="text-4xl font-black text-white">Built for Organizations, Priced for ROI</h2>
            <p className="text-white/50 mt-2">All plans include a 30-day onboarding period with dedicated support.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PRICING_TIERS.map(t => (
              <div key={t.name} className={`rounded-3xl border-2 p-8 ${t.color} ${t.highlight ? "bg-red-400/5 scale-105 shadow-xl shadow-red-500/20" : "bg-white/5"}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full text-white ${t.badgeColor}`}>{t.badge}</span>
                </div>
                <h3 className="text-xl font-black text-white mb-1">{t.name}</h3>
                <div className="text-3xl font-black text-red-400 mb-0.5">{t.price}</div>
                <div className="text-white/40 text-xs mb-5">{t.priceNote}</div>
                <ul className="space-y-2 mb-6">
                  {t.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                      <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                {t.stripeId ? (
                  <button
                    onClick={() => handleCheckout(t.stripeId!, t.name)}
                    disabled={checkoutLoading === t.stripeId}
                    className={`block w-full text-center py-3 rounded-xl font-black text-sm transition-all disabled:opacity-60 ${
                      t.highlight
                        ? "bg-red-500 hover:bg-red-400 text-white"
                        : "bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                    }`}
                  >
                    {checkoutLoading === t.stripeId ? "Loading..." : t.highlight ? "Subscribe Now →" : "Get Started →"}
                  </button>
                ) : (
                  <a
                    href="mailto:contact@athlynx.ai?subject=Pro Teams Enterprise Request"
                    className="block w-full text-center py-3 rounded-xl font-black text-sm transition-all bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                  >
                    Contact Us
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="max-w-6xl mx-auto px-4 py-10 pb-20">
          <div className="bg-gradient-to-r from-red-500/20 via-red-400/10 to-red-500/20 border-2 border-red-400/50 rounded-3xl p-12 text-center">
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="text-4xl font-black text-white mb-3">Ready to Bring AthlynX to Your Organization?</h2>
            <p className="text-white/60 text-lg mb-2">
              Join the platform that covers every level — Youth, High School, College, Pro, and Retired.
            </p>
            <p className="text-red-400 font-bold mb-8">
              One platform. Every athlete. Every sport. Every level.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:contact@athlynx.ai?subject=Pro Teams Demo Request"
                className="bg-red-500 hover:bg-red-400 text-white font-black px-8 py-4 rounded-2xl text-lg transition-all shadow-lg shadow-red-500/30"
              >
                Schedule a Demo
              </a>
              <a
                href="/book"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all"
              >
                📞 Book a call
              </a>
            </div>
            <p className="text-white/30 text-xs mt-6">
              contact@athlynx.ai · Dozier Holdings Group · Houston, TX
            </p>
          </div>
        </section>

      <MobileBottomNav />
    </div>
    </PlatformLayout>
  );
}

export default function ProTeams() {
  return <RouteErrorBoundary><ProTeamsInner /></RouteErrorBoundary>;
}
