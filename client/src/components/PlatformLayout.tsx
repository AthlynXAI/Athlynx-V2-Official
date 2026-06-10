import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import AIOnboarding from "./AIOnboarding";
import ExpirationWarningPopup from "./ExpirationWarningPopup";
import { AIAssistantButton } from "./ReverseFunnel";

const APPS = [
  { id: "nil-portal", label: "NIL Portal", icon: "/logos/nil-portal-logo.png", badge: "LIVE", href: "/nil-portal" },
  { id: "messenger", label: "NIL Messenger", icon: "/logos/nil-messenger-logo.png", badge: "LIVE", href: "/messenger" },
  { id: "diamond-grind", label: "Diamond Grind", icon: "/athlynx-app-icon.png", badge: "NEW", href: "/diamond-grind" },
  { id: "warriors-playbook", label: "Warriors Playbook", icon: "/athlynx-app-icon.png", badge: "HOT", href: "/warriors-playbook" },
  { id: "transfer-portal", label: "Transfer Portal", icon: "/athlynx-app-icon.png", badge: "LIVE", href: "/transfer-portal" },
  { id: "nil-vault", label: "NIL Vault", icon: "/athlynx-app-icon.png", badge: "ELITE", href: "/nil-vault" },
  { id: "ai-sales", label: "AI Sales", icon: "/athlynx-app-icon.png", badge: "AI", href: "/ai-sales" },
  { id: "ai-recruiter", label: "AI Recruiter", icon: "/athlynx-app-icon.png", badge: "AI", href: "/ai-recruiter" },
  { id: "ai-content", label: "AI Content", icon: "/athlynx-app-icon.png", badge: "BLEND", href: "/ai-content" },
  { id: "ai-scouting-report", label: "AI Scouting Report", icon: "/athlynx-app-icon.png", badge: "S39", href: "/ai-scouting-report" },
  { id: "highlight-reel-studio", label: "Reel Studio", icon: "/athlynx-app-icon.png", badge: "S39", href: "/highlight-reel-studio" },
  { id: "notification-center", label: "Notifications", icon: "/athlynx-app-icon.png", badge: "S39", href: "/notification-center" },
  { id: "feed", label: "My Feed", icon: "/athlynx-app-icon.png", badge: "", href: "/feed" },
  { id: "reels", label: "Reels", icon: "/athlynx-app-icon.png", badge: "NEW", href: "/reels" },
  { id: "robotics", label: "Robotics", icon: "/athlynx-app-icon.png", badge: "SOON", href: "/robotics" },
  { id: "trainerbot", label: "TrainerBot", icon: "/athlynx-app-icon.png", badge: "NEW", href: "/trainerbot" },
  { id: "infrastructure", label: "Infrastructure", icon: "/athlynx-app-icon.png", badge: "INFRA", href: "/infrastructure" },
  { id: "marketplace", label: "Marketplace", icon: "/athlynx-app-icon.png", badge: "NEW", href: "/marketplace" },
  { id: "podcast", label: "Podcast", icon: "/athlynx-app-icon.png", badge: "NEW", href: "/podcast" },
  { id: "music", label: "Music Platform", icon: "/athlynx-app-icon.png", badge: "NEW", href: "/music" },
  { id: "reel-masters", label: "Reel Masters", icon: "/athlynx-app-icon.png", badge: "NEW", href: "/reel-masters" },
  { id: "social-hub", label: "Social Hub", icon: "/athlynx-app-icon.png", badge: "NEW", href: "/social-hub" },
  { id: "comms-hub", label: "Comms Hub", icon: "/athlynx-app-icon.png", badge: "NEW", href: "/comms-hub" },
  { id: "nil-calculator", label: "NIL Calculator", icon: "/athlynx-app-icon.png", badge: "NEW", href: "/nil-calculator" },
  { id: "nil-marketplace", label: "NIL Marketplace", icon: "/athlynx-app-icon.png", badge: "NEW", href: "/nil-marketplace" },
  { id: "agent-finder", label: "Agent Finder", icon: "/athlynx-app-icon.png", badge: "NEW", href: "/agent-finder" },
  { id: "signing-day", label: "Signing Day", icon: "/athlynx-app-icon.png", badge: "NEW", href: "/signing-day" },
  { id: "court-kings", label: "Court Kings", icon: "/athlynx-app-icon.png", badge: "NEW", href: "/court-kings" },
  { id: "pitch-pulse", label: "Pitch Pulse Soccer", icon: "/athlynx-app-icon.png", badge: "NEW", href: "/pitch-pulse" },
  { id: "fairway-elite", label: "Fairway Elite Golf", icon: "/athlynx-app-icon.png", badge: "NEW", href: "/fairway-elite" },
  { id: "x-factor", label: "X-Factor Feed", icon: "/xfactor-logo-dark.png", badge: "HOT", href: "/x-factor" },
  { id: "nil-jobs", label: "NIL Jobs", icon: "/athlynx-app-icon.png", badge: "NEW", href: "/nil-jobs" },
  { id: "elite-events", label: "Elite Events", icon: "/athlynx-app-icon.png", badge: "NEW", href: "/elite-events" },
  { id: "wellness", label: "Wellness Portal", icon: "/athlynx-app-icon.png", badge: "NEW", href: "/wellness" },
  { id: "investor-hub", label: "Investor Hub", icon: "/athlynx-app-icon.png", badge: "NEW", href: "/investor-hub" },
  { id: "athlete-journey", label: "Athlete Journey", icon: "/athlynx-app-icon.png", badge: "NEW", href: "/athlete-journey" },
  { id: "athlete-legal-hub", label: "Legal & Deals", icon: "/athlynx-app-icon.png", badge: "NEW", href: "/athlete-legal-hub" },
  { id: "athlete-store", label: "Athlete Store", icon: "/athlynx-app-icon.png", badge: "NEW", href: "/athlete-store" },
  { id: "pro-teams", label: "Pro Teams", icon: "/athlynx-app-icon.png", badge: "PRO", href: "/pro-teams" },
  { id: "community-feedback", label: "Talk to Founder", icon: "/athlynx-app-icon.png", badge: "NEW", href: "/community-feedback" },
  { id: "book", label: "Book a Meeting", icon: "/athlynx-app-icon.png", badge: "NEW", href: "/book" },
  { id: "browse-athletes", label: "Browse Athletes", icon: "/athlynx-app-icon.png", badge: "NEW", href: "/browse-athletes" },
  { id: "recruiting-hub", label: "Recruiting Hub", icon: "/athlynx-app-icon.png", badge: "HOT", href: "/recruiting-hub" },
  { id: "data-dashboard", label: "Data Dashboard", icon: "/athlynx-app-icon.png", badge: "LIVE", href: "/data-dashboard" },
  { id: "layer-cake", label: "Layer Cake", icon: "/athlynx-app-icon.png", badge: "AI", href: "/layer-cake" },
  { id: "white-label", label: "White-Label", icon: "/athlynx-app-icon.png", badge: "BIZ", href: "/white-label" },
  { id: "crm", label: "CRM", icon: "/athlynx-app-icon.png", badge: "PRO", href: "/admin/crm" },
  { id: "admin-expiry", label: "Expiry Monitor", icon: "/athlynx-app-icon.png", badge: "ADMIN", href: "/admin/expiry" },
  { id: "agent-ownership", label: "Agent Security", icon: "/athlynx-app-icon.png", badge: "ADMIN", href: "/agent-ownership" },
  { id: "analytics", label: "Analytics", icon: "/athlynx-app-icon.png", badge: "PRO", href: "/analytics" },
  { id: "admin", label: "Admin", icon: "/logos/dhg-crab-logo.png", badge: "ADMIN", href: "/admin" },
  { id: "employee-portal", label: "Team Portal", icon: "/logos/dhg-crab-logo.png", badge: "TEAM", href: "/employee-portal" },
];


const BADGE_COLORS: Record<string, string> = {
  LIVE: "bg-green-600",
  NEW: "bg-blue-600",
  HOT: "bg-red-500",
  ELITE: "bg-blue-700",
  AI: "bg-cyan-600",
  BLEND: "bg-red-600",
  SOON: "bg-gray-600",
  BIZ: "bg-indigo-600",
  PRO: "bg-blue-700",
  ADMIN: "bg-red-700",
  TEAM: "bg-emerald-700",
};

interface PlatformLayoutProps {
  children: React.ReactNode;
  title?: string;
}

// ── Module-level guard — persists across unmount/remount cycles during SPA navigation.
// A useRef inside the component resets to false every time wouter mounts a new page
// component (each page has its own PlatformLayout instance), causing the onboarding
// splash to re-trigger on every "Your Apps" navigation. Moving this outside the
// component ensures it is set once per browser session and never resets.
let _onboardingSessionChecked = false;

function NotificationBell({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data: notifications = [] } = trpc.notifications.getRecent.useQuery(undefined, {
    enabled: !!user,
    refetchInterval: 60000,      // poll every 60s
    retry: false,                // never retry on error — stops the 500 storm
    refetchOnWindowFocus: false, // don't refetch when user switches tabs
    staleTime: 10000,            // treat data as fresh for 10s — prevents immediate refetch on mount
  });
  const utils = trpc.useUtils();
  const markReadMutation = trpc.notifications.markAllRead.useMutation({
    onSuccess: () => utils.notifications.getRecent.invalidate(),
  });

  // isRead is stored as enum 'yes'/'no' in DB — not a boolean
  const unread = (notifications as any[]).filter(n => n.isRead === 'no').length;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => {
          setOpen(!open);
          if (!open && unread > 0) {
            markReadMutation.mutate();
            utils.notifications.getRecent.invalidate();
          }
        }}
        className="p-2 rounded-lg hover:bg-white/5 transition-colors relative"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
        </svg>
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-80 bg-[#0d1b3e] border border-blue-800 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-blue-900">
            <span className="font-bold text-white text-sm">Notifications</span>
            {unread > 0 && (
              <button
                onClick={() => markReadMutation.mutate()}
                className="text-xs text-blue-400 hover:text-white"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {(notifications as any[]).length === 0 ? (
              <div className="p-4 text-center text-blue-400 text-sm">No notifications yet</div>
            ) : (
              (notifications as any[]).map((n: any) => (
                <div key={n.id} className={`px-4 py-3 border-b border-blue-900/50 hover:bg-white/5/30 transition-colors ${!n.isRead ? 'bg-blue-900/20' : ''}`}>
                  <div className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.isRead ? 'bg-blue-400' : 'bg-transparent'}`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-semibold">{n.title}</div>
                      <div className="text-blue-400 text-xs mt-0.5 line-clamp-2">{n.body}</div>
                      <div className="text-blue-600 text-[10px] mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link href="/notifications" onClick={() => setOpen(false)} className="block px-4 py-2 text-center text-xs text-blue-400 hover:text-white border-t border-blue-900 transition-colors">
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}

export default function PlatformLayout({ children, title }: PlatformLayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  const { user, loading: authLoading } = useAuth();

  // Check onboarding status — runs ONCE per session using a ref guard.
  // Never fires on navigation/re-renders to prevent the splash screen loop.
  useEffect(() => {
    if (!user || authLoading || onboardingDismissed || _onboardingSessionChecked) return;
    _onboardingSessionChecked = true;
    const key = `onboarding_done_${user.email || user.id}`;
    const completed = localStorage.getItem(key);
    const legacyCompleted = localStorage.getItem(`onboarding_done_${user.id}`);
    // Check DB onboardingCompleted flag (set to 1 for existing users)
    const dbCompleted = (user as any)?.onboardingCompleted === 1 || (user as any)?.onboardingCompleted === true;
    // Any user with a loginMethod (google, email, seed) is a real returning user — never show splash
    const hasLoginMethod = !!(user as any)?.loginMethod;
    // Admins never see onboarding
    const isAdminUser = (user as any)?.role === 'admin';
    // Partners bypass onboarding splash — same as admin
    const PARTNER_EMAILS_SPLASH = [
      "gtse@dozierholdingsgroup.com", "gtse@athlynx.ai", "lmarshall@athlynx.ai", "tlockey24@athlynx.ai",
    ];
    const isPartnerUser = !!(user as any)?.email && PARTNER_EMAILS_SPLASH.includes(((user as any)?.email ?? "").toLowerCase());
    if (dbCompleted || hasLoginMethod || isAdminUser || isPartnerUser) {
      // Sync localStorage so we don't re-check every time
      localStorage.setItem(key, '1');
      return;
    }
    if (!completed && !legacyCompleted) {
      // Only show onboarding once — never interrupt navigation
      const timer = setTimeout(() => setShowOnboarding(true), 800);
      return () => clearTimeout(timer);
    }
  }, [user, authLoading]);

  const displayName = user?.name || "Athlete";
  // NIL doctrine: real Image required at >=32px; silhouette fallback, never colored initials.
  const SilhouetteSvg = (
    <svg viewBox="0 0 24 24" className="w-3/5 h-3/5 text-slate-400" fill="currentColor" aria-hidden="true">
      <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.3 0-9.8 1.7-9.8 4.9v2.7h19.6v-2.7c0-3.3-6.5-4.9-9.8-4.9z"/>
    </svg>
  );

  // Subscription plan for credits display
  const { data: sub } = trpc.stripe.getSubscription.useQuery(undefined, { enabled: !!user });
  // Live credit balance — refetches after every AI action
  const { data: creditsData } = trpc.ai.getCredits.useQuery(undefined, { enabled: !!user, refetchInterval: 30000 });
  const liveCredits = creditsData?.credits ?? user?.credits ?? 0;
  // Trial state derived from DB user
  const isAdmin = (user as any)?.role === 'admin';
  // Partners have full access — never show trial UI or paywall
  const PARTNER_EMAILS = [
    "gtse@dozierholdingsgroup.com", "gtse@athlynx.ai", "lmarshall@athlynx.ai", "tlockey24@athlynx.ai",
  ];
  const isPartner = !!(user as any)?.email && PARTNER_EMAILS.includes(((user as any)?.email ?? "").toLowerCase());
  const hasFullAccess = isAdmin || isPartner;
  const trialEndsAt = (user as any)?.trialEndsAt ? new Date((user as any).trialEndsAt) : null;
  const _now = new Date();
  const trialDaysLeft = trialEndsAt ? Math.max(0, Math.ceil((trialEndsAt.getTime() - _now.getTime()) / (1000 * 60 * 60 * 24))) : 0;
  // Owner/Partners always have full access — never show trial UI or paywall
  const isInTrial = !hasFullAccess && !!trialEndsAt && trialEndsAt > _now && !(user as any)?.stripeSubscriptionId;
  const trialExpired = !hasFullAccess && !!trialEndsAt && trialEndsAt <= _now && !(user as any)?.stripeSubscriptionId;

  const planLabel = sub?.plan === "athlete_pro" ? "PRO" :
    sub?.plan === "athlete_elite" ? "ELITE" :
    sub?.plan === "nil_vault" ? "NIL VAULT" : "FREE";

  const planColor = sub?.plan === "athlete_pro" ? "#0066ff" :
    sub?.plan === "athlete_elite" ? "#00c2ff" :
    sub?.plan === "nil_vault" ? "#1e3a8a" : "#6b7280";

  return (
    <div
      className="min-h-[100dvh] bg-[#05070f] text-white overflow-x-hidden"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)", background: "radial-gradient(circle at 15% -10%, rgba(251,191,36,0.16), transparent 28%), radial-gradient(circle at 92% 0%, rgba(34,211,238,0.18), transparent 30%), linear-gradient(180deg, #05070f 0%, #081225 42%, #05070f 100%)" }}
    >
      {/* Subscription Expiry Warning Popup — fires when days <= 5 or expired */}
      {user && <ExpirationWarningPopup />}
      {showOnboarding && user && (
        <AIOnboarding onComplete={(_data: Record<string, string>) => {
          localStorage.setItem(`onboarding_done_${user.email || user.id}`, "1");
          localStorage.setItem(`onboarding_done_${user.id}`, "1");
          setShowOnboarding(false);
          setOnboardingDismissed(true);
        }} />
      )}
      {/* Top announcement bar */}
      <div className="border-b border-amber-300/20 bg-gradient-to-r from-[#05070f] via-[#101a32] to-[#05070f] text-center text-[10px] py-1.5 tracking-[0.34em] font-black text-amber-200 shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
        AthlynXAI · THE ATHLETE OPERATING SYSTEM · LIVE
      </div>
      <div className="athlynx-brand-family-ribbon text-center text-[9px] sm:text-[10px] py-1.5 px-3 tracking-[0.26em] font-black uppercase text-white/80">
        AthlynX · AthlynXAI · AXN · AVN · The Athlete Playbook · MSU Alum Loyalty
      </div>

      {/* Trial banner */}
      {user && isInTrial && (
        <div className="bg-gradient-to-r from-[#00c2ff]/20 to-[#0066ff]/20 border-b border-[#00c2ff]/30 text-center py-1.5 px-4 flex items-center justify-center gap-3">
          <span className="text-[#00c2ff] text-xs font-bold">🎯 FREE TRIAL — {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} remaining</span>
          <Link href="/billing" className="text-xs bg-[#00c2ff] text-[#0a0f1e] font-black px-3 py-0.5 rounded-full hover:bg-white transition-colors">
            Upgrade Now
          </Link>
        </div>
      )}
      {/* Trial expired banner */}
      {user && trialExpired && (
        <div className="bg-gradient-to-r from-red-900/40 to-red-900/40 border-b border-red-700/50 text-center py-1.5 px-4 flex items-center justify-center gap-3">
          <span className="text-red-300 text-xs font-bold">⚠️ FREE TRIAL ENDED — Upgrade to keep full access</span>
          <Link href="/billing" className="text-xs bg-red-500 text-white font-black px-3 py-0.5 rounded-full hover:bg-red-400 transition-colors">
            Upgrade Now
          </Link>
        </div>
      )}

      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 border-b border-cyan-300/15 bg-slate-950/86 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src="/athlynx-app-icon.png?v=athlynx-clean-mark-20260526" alt="AthlynX" className="w-9 h-9 rounded-xl object-cover ring-1 ring-cyan-200/35 shadow-[0_0_28px_rgba(34,211,238,0.28)]" />
            <div className="hidden sm:block">
              <div className="text-white font-black text-lg leading-none tracking-wide">AthlynXAI</div>
              <div className="text-amber-200 text-[9px] tracking-[0.24em] leading-none">THE ATHLETE'S PLAYBOOK</div>
            </div>
          </Link>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-xs mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search athletes, teams, deals..."
                className="w-full bg-[#2A0710]/75 text-white text-sm rounded-full px-4 py-2 pl-9 border border-[#5D1725]/70 focus:outline-none focus:border-[#F6C453] placeholder-amber-100/45"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Nav icons */}
          <div className="flex items-center gap-1">
            {/* Plan badge + Credits */}
            {user && (
              <div className="flex items-center gap-1 mr-1">
                <Link href="/billing" className="hidden sm:inline-flex">
                  <span
                    className="inline-flex text-[10px] font-black px-2 py-1 rounded-full cursor-pointer"
                    style={{ backgroundColor: planColor + "22", color: planColor, border: `1px solid ${planColor}44` }}
                  >
                    {planLabel}
                  </span>
                </Link>
                <Link href="/billing">
                  <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-1 rounded-full cursor-pointer transition-colors ${
                    liveCredits < 50
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                      : 'bg-[#0066ff]/10 text-[#00c2ff] border border-[#0066ff]/30 hover:bg-[#0066ff]/20'
                  }`}>
                    ⚡ {liveCredits.toLocaleString()}
                  </span>
                </Link>
              </div>
            )}

            <Link href="/feed" className={`p-2 rounded-lg transition-colors ${location === '/feed' ? 'bg-cyan-300/15 text-cyan-100 ring-1 ring-cyan-300/30' : 'hover:bg-white/5 text-slate-200'}`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </Link>

            <Link href="/messenger" className={`p-2 rounded-lg transition-colors relative ${location === '/messenger' ? 'bg-cyan-300/15 text-cyan-100 ring-1 ring-cyan-300/30' : 'hover:bg-white/5 text-slate-200'}`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
              </svg>
            </Link>

            {user ? (
              <NotificationBell user={user} />
            ) : (
              <button className="p-2 rounded-lg hover:bg-white/5 transition-colors relative">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
              </button>
            )}

            {/* INVESTORS — gold accent, prominent in top nav */}
            <Link
              href="/investor-hub"
              className="hidden sm:inline-flex items-center gap-1 ml-1 text-[10px] font-black px-2.5 py-1.5 rounded-lg transition-all border border-[#0066ff]/50 bg-[#0066ff]/10 text-[#00c2ff] hover:bg-[#0066ff]/20 hover:text-white tracking-widest uppercase whitespace-nowrap"
            >
              💰 INVESTORS
            </Link>

            {user ? (
              <Link href="/profile" className="ml-1 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center hover:ring-2 hover:ring-blue-500 transition-all overflow-hidden shrink-0" title={user.avatarUrl ? displayName : 'Identity pending — add your photo'}>
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : SilhouetteSvg}
              </Link>
            ) : (
              <Link href="/signup" className="ml-1 text-xs bg-gradient-to-r from-amber-300 via-cyan-300 to-violet-400 hover:from-white hover:via-cyan-200 hover:to-amber-200 text-slate-950 shadow-[0_10px_30px_rgba(34,211,238,0.24)] font-bold px-3 py-1.5 rounded-lg transition-colors">
                Sign In / Sign Up
              </Link>
            )}

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-white/5 ml-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu — full-screen overlay, social-first */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-[9999] flex flex-col md:hidden"
            style={{ background: '#07112b' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <img src="/athlynx-app-icon.png?v=athlynx-clean-mark-20260526" alt="AthlynX" className="h-9 w-auto" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">

              {/* User greeting if logged in — NIL doctrine: real photo or silhouette */}
              {user && (
                <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-[#00c2ff] flex items-center justify-center overflow-hidden flex-shrink-0" title={user.avatarUrl ? (user.name ?? '') : 'Identity pending — add your photo'}>
                    {user.avatarUrl
                      ? <img src={user.avatarUrl} alt={user.name ?? ''} className="w-full h-full object-cover" />
                      : <svg viewBox="0 0 24 24" className="w-6 h-6 text-slate-400" fill="currentColor" aria-hidden="true"><path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.3 0-9.8 1.7-9.8 4.9v2.7h19.6v-2.7c0-3.3-6.5-4.9-9.8-4.9z"/></svg>
                    }
                  </div>
                  <div>
                    <div className="text-white font-black text-base">{user.name ?? 'Athlete'}</div>
                    <div className="text-[#00c2ff] text-xs font-semibold">AthlynX Member</div>
                  </div>
                </div>
              )}

              {/* Core nav */}
              <div className="px-5 pt-3 pb-2 flex flex-col">
                {[
                  { href: '/feed',            label: 'Home Feed',        sub: 'Your athlete social feed' },
                  { href: '/nil-portal',      label: 'NIL Portal',       sub: 'Get paid for your name', accent: true },
                  { href: '/transfer-portal', label: 'Transfer Portal',  sub: 'Find your next school' },
                  { href: '/ai-recruiter',    label: 'AI Recruiter',     sub: 'Get discovered by coaches' },
                  { href: '/athlete-playbook',label: 'Athlete Playbook', sub: 'Your recruiting blueprint' },
                  { href: '/x-factor',        label: 'X-Factor Feed',    sub: 'Athlete culture & highlights' },
                  { href: '/messenger',       label: 'Messenger',        sub: 'Direct messages' },
                  { href: '/pricing',         label: 'Pricing' },
                ].map(item => (
                  <Link key={item.href} href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-4 border-b border-white/8 group"
                  >
                    <div>
                      <span className={`text-lg font-bold tracking-tight ${
                        item.accent ? 'text-[#00c2ff]' : 'text-white'
                      }`}>{item.label}</span>
                      {item.sub && <div className="text-white/40 text-xs mt-0.5">{item.sub}</div>}
                    </div>
                    <svg className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>

              {/* Sports */}
              <div className="border-t border-white/10">
                <div className="px-5 py-3">
                  <div className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">Sports</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {[
                      { href: '/gridiron-nexus', label: '🏈 Football' },
                      { href: '/diamond-grind',  label: '⚾ Baseball' },
                      { href: '/court-kings',    label: '🏀 Basketball' },
                      { href: '/net-setters',    label: '🏐 Volleyball' },
                      { href: '/fairway-elite',  label: '⛳ Golf' },
                      { href: '/mat-warriors',   label: '🤼 Wrestling' },
                      { href: '/swim-surge',     label: '🏊 Swimming' },
                      { href: '/track-elite',    label: '🏃 Track & Field' },
                      { href: '/ice-breakers',   label: '🏒 Hockey' },
                      { href: '/reel-masters',   label: '🎣 Fishing' },
                    ].map(s => (
                      <Link key={s.href} href={s.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2.5 text-white/70 hover:text-white text-base font-medium transition-colors">
                        {s.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* All Apps compact grid */}
              <div className="border-t border-white/10 px-5 py-3">
                <div className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">All Apps</div>
                <div className="grid grid-cols-4 gap-2">
                  {APPS.slice(0, 16).map(app => (
                    <Link key={app.id} href={app.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors">
                      <img src={app.icon} alt={app.label} className="w-10 h-10 rounded-xl object-cover shadow"
                        onError={e => { (e.target as HTMLImageElement).src = '/athlynx-app-icon.png?v=athlynx-clean-mark-20260526'; }} />
                      <span className="text-[9px] text-white/50 text-center leading-tight font-medium">{app.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer CTA */}
            <div className="px-5 py-4 border-t border-white/10 flex flex-col gap-3"
              style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
              {user ? (
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center bg-[#1a3a8f] border border-[#00c2ff]/40 text-white font-black py-3.5 rounded-2xl text-base">
                  My Profile →
                </Link>
              ) : (
                <>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center bg-[#00c2ff] hover:bg-[#00a8e0] text-black font-black text-lg py-4 rounded-2xl shadow-lg shadow-[#00c2ff]/20 transition-all">
                    JOIN FREE — 7 DAYS →
                  </Link>
                  <Link href="/signin" onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center border border-white/20 text-white font-bold py-3.5 rounded-2xl hover:bg-white/5 transition-colors">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main layout */}
      <div
        className="max-w-7xl mx-auto px-2 sm:px-4 pt-3 sm:pt-4 pb-[calc(112px+env(safe-area-inset-bottom,0px))] lg:pb-4 flex gap-4"
        style={{
          paddingLeft: "0.5rem",
          paddingRight: "0.5rem",
        }}
      >
        {/* Left Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-3">
          {/* Profile card */}
          <Link href="/profile" className="bg-[#1a3a8f] rounded-xl border border-blue-900 overflow-hidden hover:border-blue-700 transition-colors block">
            <div className="h-16 bg-gradient-to-r from-blue-800 to-blue-600"></div>
            <div className="px-4 pb-4 -mt-8">
              <div className="w-14 h-14 rounded-full bg-slate-800 border-4 border-[#0d1b3e] flex items-center justify-center overflow-hidden" title={user?.avatarUrl ? displayName : 'Identity pending — add your photo'}>
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : SilhouetteSvg}
              </div>
              <div className="mt-1 font-bold text-white">{user ? displayName : "Athlete Profile"}</div>
              <div className="text-blue-400 text-xs">{user ? "View your profile" : "Sign in to continue"}</div>
            </div>
          </Link>

          {/* Sign In CTA — only show when not logged in */}
          {!user && (
            <div className="bg-gradient-to-br from-[#1a3a8f] to-[#0d1b3e] rounded-xl border border-blue-600 p-4 text-center">
              <div className="text-white font-black text-sm mb-1">⚡ Join AthlynX Free</div>
              <div className="text-blue-300 text-xs mb-3">7-day free trial. Card required, not charged until day 8.</div>
              <Link href="/signup" className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-black text-sm py-2.5 rounded-xl transition-all mb-2">
                Start Free Trial →
              </Link>
              <Link href="/signin" className="block w-full text-blue-400 hover:text-white text-xs py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                Already a member? Sign In
              </Link>
            </div>
          )}

          {/* Apps nav */}
          <div className="bg-[#1a3a8f] rounded-xl border border-blue-900 p-3">
            <div className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2 px-1">Your Apps</div>
            {APPS.map(app => (
              <Link key={app.id} href={app.href} className={`flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors group ${location === app.href ? 'bg-blue-900' : ''}`}>
                <img
                  src={app.icon}
                  alt={app.label}
                  className="w-8 h-8 rounded-lg object-cover shrink-0"
                  onError={e => { (e.target as HTMLImageElement).src = "/logos/dhg-crab-logo.png"; }}
                />
                <span className="text-sm text-white group-hover:text-blue-300 flex-1">{app.label}</span>
                {app.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white ${BADGE_COLORS[app.badge] || 'bg-gray-600'}`}>
                    {app.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* DHG link */}
          <Link href="/dhg-empire" className="bg-[#1a3a8f] rounded-xl border border-red-700/40 p-3 flex items-center gap-3 hover:bg-white/5 hover:border-red-500/60 transition-colors">
            <img src="/logos/dhg-crab-logo.png" alt="DHG" className="w-10 h-10 rounded-lg object-cover" />
            <div>
              <div className="text-sm font-bold text-white">DHG Empire</div>
              <div className="text-red-400/70 text-xs">All 20+ Companies</div>
            </div>
          </Link>
          {/* Parent Company external link */}
          <a href="https://dozierholdingsgroup.com" target="_blank" rel="noopener noreferrer" className="bg-[#0d1b3e] rounded-xl border border-blue-900/60 p-2.5 flex items-center gap-2.5 hover:bg-blue-950 hover:border-blue-700 transition-colors">
            <img src="/logos/dhg-crab-logo.png" alt="Dozier Holdings Group" className="w-7 h-7 rounded-md object-cover" />
            <div>
              <div className="text-xs font-bold text-blue-300">Parent Company</div>
              <div className="text-blue-500 text-[10px]">dozierholdingsgroup.com ↗</div>
            </div>
          </a>

          {/* Upgrade CTA for free users */}
          {user && (!sub?.plan || sub.plan === "free") && (
            <Link href="/billing" className="bg-gradient-to-br from-blue-900 to-blue-950 rounded-xl border border-blue-800 p-3 hover:border-blue-600 transition-colors block">
              <div className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">Upgrade to PRO</div>
              <div className="text-white text-sm font-semibold">Unlock all features</div>
              <div className="text-blue-400 text-xs mt-1">NIL Vault, AI tools, and more</div>
              <div className="mt-2 text-center bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold py-1.5 rounded-lg transition-colors">
                View Plans →
              </div>
            </Link>
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {title && (
            <div className="mb-4 px-1">
              <h1 className="text-2xl font-black text-white tracking-wide">{title}</h1>
            </div>
          )}
          {/* PAYWALL GATE — hard block when trial expired and no active subscription */}
          {user && trialExpired ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12">
              <div className="max-w-lg w-full bg-gradient-to-br from-[#0a1628] via-[#1a3a8f] to-[#0a1628] border-2 border-red-500/60 rounded-3xl p-8 text-center shadow-2xl">
                <div className="text-5xl mb-4">🔒</div>
                <div className="text-red-400 text-xs uppercase tracking-widest font-bold mb-2">Trial Ended</div>
                <h2 className="text-white font-black text-2xl mb-3">Your Free Trial Has Expired</h2>
                <p className="text-blue-200 text-sm leading-relaxed mb-6">
                  Your 7-day free trial has ended. Choose a plan to keep full access to all 20+ AthlynX apps — NIL Portal, Transfer Portal, Diamond Grind, Warriors Playbook, and more.
                </p>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {([{name:"STARTER",price:"$9.99",color:"#0066ff",id:"athlete_starter"},{name:"PRO",price:"$49.99",color:"#00c2ff",popular:true,id:"athlete_pro"},{name:"ELITE",price:"$99.99",color:"#7c3aed",id:"athlete_elite"}] as any[]).map((p: any) => (
                    <Link key={p.name} href={`/pricing?plan=${p.id}`} className="rounded-xl border p-3 hover:scale-105 transition-all cursor-pointer block" style={{borderColor: p.color + '44', backgroundColor: p.color + '11'}}>
                      {p.popular && <div className="text-[9px] font-black text-red-400 mb-1">POPULAR</div>}
                      <div className="font-black text-white text-sm">{p.name}</div>
                      <div className="font-black text-lg" style={{color: p.color}}>{p.price}<span className="text-xs text-blue-400">/mo</span></div>
                    </Link>
                  ))}
                </div>
                <Link href="/pricing" className="block w-full bg-gradient-to-r from-red-400 to-red-500 hover:from-red-300 hover:to-red-400 text-black font-black text-lg py-3 rounded-xl transition-all shadow-xl hover:scale-105">
                  CHOOSE YOUR PLAN →
                </Link>
                <div className="mt-4 text-blue-400 text-xs">No contracts. Cancel anytime. Instant access.</div>
              </div>
            </div>
          ) : (
            children
          )}
        </main>

        {/* Right Sidebar */}
        <aside className="hidden xl:flex flex-col w-72 shrink-0 gap-3">
          {/* Platform Stats */}
          <div className="bg-[#1a3a8f] rounded-xl border border-blue-900 p-4">
            <div className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">Platform Stats</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-1 border-b border-blue-900">
                <span className="text-blue-300 text-sm">Apps Available</span>
                <span className="text-white font-bold text-sm">20+</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-blue-900">
                <span className="text-blue-300 text-sm">Sports Covered</span>
                <span className="text-white font-bold text-sm">10+</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-blue-300 text-sm">Status</span>
                <span className="text-green-400 font-bold text-sm">🟢 LIVE NOW</span>
              </div>
            </div>
          </div>

          {/* Countdown */}
          <div className="bg-gradient-to-br from-blue-900 to-[#1530a0] rounded-xl border border-blue-700 p-4 text-center">
            <div className="text-blue-300 text-xs uppercase tracking-widest mb-1">Platform Status</div>
            <div className="text-green-400 font-black text-2xl">🟢 LIVE NOW</div>
            <div className="text-blue-400 text-xs mt-1">Dreams Do Come True</div>
              {user ? (
                <Link href="/billing" className="mt-3 block w-full bg-gradient-to-r from-amber-300 via-cyan-300 to-violet-400 hover:from-white hover:via-cyan-200 hover:to-amber-200 text-slate-950 shadow-[0_10px_30px_rgba(34,211,238,0.24)] text-sm font-bold py-2 rounded-lg transition-colors text-center">
                  View Plans
                </Link>
              ) : (
                <Link href="/signup" className="mt-3 block w-full bg-gradient-to-r from-amber-300 via-cyan-300 to-violet-400 hover:from-white hover:via-cyan-200 hover:to-amber-200 text-slate-950 shadow-[0_10px_30px_rgba(34,211,238,0.24)] text-sm font-bold py-2 rounded-lg transition-colors text-center">
                  Start Free Trial
                </Link>
              )}
          </div>

          {/* About DHG */}
          <div className="bg-[#1a3a8f] rounded-xl border border-blue-900 p-4">
            <div className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">About AthlynX</div>
            <p className="text-blue-200 text-xs leading-relaxed mb-3">Built by Dozier Holdings Group — The Sole Source Provider. Empowering athletes with NIL tools, recruiting intelligence, and AI-powered career management.</p>
            <a href="/dhg" className="block text-center text-xs bg-blue-700 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors font-semibold">
              About DHG
            </a>
          </div>
        </aside>
      </div>

      {/* Mobile bottom nav — Facebook style */}
      <nav
        className="lg:hidden fixed left-0 right-0 z-50 shadow-[0_-24px_80px_rgba(0,0,0,0.62)] backdrop-blur-2xl"
        style={{
          bottom: 'env(safe-area-inset-bottom, 0px)',
          background: 'linear-gradient(180deg, rgba(2,6,23,0.96), rgba(5,10,25,0.98))',
          borderTop: '1px solid rgba(34,211,238,0.18)',
          paddingBottom: '8px',
          paddingLeft: 'env(safe-area-inset-left, 0px)',
          paddingRight: 'env(safe-area-inset-right, 0px)',
        }}
      >
        <div className="flex items-center justify-around py-2 px-2">
          <Link href="/feed" className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl" style={{color:location==='/feed'?'#f8e7a1':'#8aa0c7'}}>
            {location==='/feed'?<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>:<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>}
            <span style={{fontSize:'10px',fontWeight:location==='/feed'?'700':'500'}}>Home</span>
          </Link>
          <Link href="/reels" className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl" style={{color:location==='/reels'?'#f8e7a1':'#8aa0c7'}}>
            {location==='/reels'?<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/></svg>:<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>}
            <span style={{fontSize:'10px',fontWeight:location==='/reels'?'700':'500'}}>Reels</span>
          </Link>
          <Link href="/browse-athletes" className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl" style={{color:location.startsWith('/browse-athletes')?'#f8e7a1':'#8aa0c7'}}>
            <svg className="w-6 h-6" fill={location.startsWith('/browse-athletes')?'currentColor':'none'} stroke={location.startsWith('/browse-athletes')?'none':'currentColor'} strokeWidth="2" viewBox="0 0 24 24">{location.startsWith('/browse-athletes')?<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>:<path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>}</svg>
            <span style={{fontSize:'10px',fontWeight:location.startsWith('/browse-athletes')?'700':'500'}}>Athletes</span>
          </Link>
          <Link href="/nil-portal" className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl" style={{color:location==='/nil-portal'?'#f8e7a1':'#8aa0c7'}}>
            <svg className="w-6 h-6" fill={location==='/nil-portal'?'currentColor':'none'} stroke={location==='/nil-portal'?'none':'currentColor'} strokeWidth="2" viewBox="0 0 24 24">{location==='/nil-portal'?<path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>:<path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>}</svg>
            <span style={{fontSize:'10px',fontWeight:location==='/nil-portal'?'700':'500'}}>NIL</span>
          </Link>
          <Link href="/notifications" className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl" style={{color:location==='/notifications'?'#f8e7a1':'#8aa0c7'}}>
            {location==='/notifications'?<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>:<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>}
            <span style={{fontSize:'10px',fontWeight:location==='/notifications'?'700':'500'}}>Alerts</span>
          </Link>
          <Link href={user?'/profile':'/signin'} className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl" style={{color:location==='/profile'?'#f8e7a1':'#8aa0c7'}}>
            <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center" style={{border:location==='/profile'?'2px solid #00c8ff':'2px solid #6b7db3',background:'#0f172a',flexShrink:0}}>
              {user?.avatarUrl?<img src={user.avatarUrl} alt={user.name||'Profile'} className="w-full h-full object-cover"/>:SilhouetteSvg}
            </div>
            <span style={{fontSize:'10px',fontWeight:location==='/profile'?'700':'500'}}>{user?'Profile':'Sign In'}</span>
          </Link>
        </div>
        {/* Sign In banner for non-logged-in users */}
        {!user && (
          <div className="flex items-center justify-between px-4 py-2 bg-blue-700/30 border-t border-blue-700/50">
            <span className="text-blue-200 text-xs">Already a member?</span>
            <Link href="/signin" className="bg-gradient-to-r from-amber-300 via-cyan-300 to-violet-400 hover:from-white hover:via-cyan-200 hover:to-amber-200 text-slate-950 shadow-[0_10px_30px_rgba(34,211,238,0.24)] text-xs font-bold px-4 py-1.5 rounded-lg transition-colors">
              Sign In
            </Link>
          </div>
        )}
      </nav>

      {/* AI Assistant — always available, everywhere, any device */}
      <AIAssistantButton />
    </div>
  );
}
