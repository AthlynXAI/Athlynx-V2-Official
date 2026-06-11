// v1.5.0 - May 5 2026 - Smart routing, full stack layer cake, all TS errors fixed
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { ReverseFunnel } from "@/components/ReverseFunnel";
import { trpc } from "@/lib/trpc";
import { captureGrowthAttribution, getGrowthAttribution } from "@/lib/growthTracking";
import SeasonalHeroStrip from "@/components/SeasonalHeroStrip";
import { RoadToOmahaHero } from "@/components/RoadToOmahaHero";
import LiveHighlightsFeed from "@/components/LiveHighlightsFeed";
import ChampionshipBracketsTop from "@/components/ChampionshipBracketsTop";
import LiveGamesStrip from "@/components/LiveGamesStrip";
import BracketBannerStrip from "@/components/BracketBannerStrip";
import SovereigntyManifesto from "@/components/SovereigntyManifesto";
import TeamProfileCard, { ATHLYNX_TEAM } from "@/components/TeamProfileCard";

// Smart routing: logged-in users go to /feed, new visitors go to /signup
// Uses the real server-side cookie name: app_session_id
function getPortalDestination(): string {
  try {
    const hasSession =
      document.cookie.includes('app_session_id') ||
      !!localStorage.getItem('athlynx_user_token') ||
      !!localStorage.getItem('athlynx_session');
    return hasSession ? '/feed' : '/signup';
  } catch {
    return '/signup';
  }
}

function EnterPortalToggle() {
  const [dest, setDest] = useState('/signup');
  useEffect(() => {
    setDest(getPortalDestination());
  }, []);
  return (
    <a
      href={dest}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-[#0a1628] hover:from-[#1E90FF] hover:to-blue-600 text-white font-black text-xs sm:text-sm px-3 py-2.5 sm:px-5 sm:py-3.5 rounded-xl sm:rounded-2xl shadow-2xl shadow-blue-500/40 transition-all duration-300 hover:scale-105 active:scale-95 opacity-90"
      aria-label="Enter the Portal"
      data-testid="floating-enter-portal"
    >
      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
      ENTER THE PORTAL
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
    </a>
  );
}

/**
 * AthleteEntryBanner — the very first thing every visitor sees on athlynx.ai.
 * Renders ABOVE the championship brackets so athletes can bypass scores/games
 * and jump straight to the platform with zero confusion.
 */
function AthleteEntryBanner() {
  const [dest, setDest] = useState('/signup');
  useEffect(() => {
    setDest(getPortalDestination());
  }, []);
  return (
    <section
      className="relative border-b border-[#1E90FF]/40 bg-gradient-to-r from-black via-[#0a1628] to-black"
      data-testid="athlete-entry-banner"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 md:flex-row md:py-3">
        <div className="flex flex-col items-center gap-1 text-center md:flex-row md:items-baseline md:gap-3 md:text-left">
          <span className="rounded-full border border-[#1E90FF]/60 bg-[#1E90FF]/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#1E90FF]">
            Athletes
          </span>
          <span className="text-[13px] font-black uppercase tracking-[0.14em] text-white md:text-sm">
            Skip the brackets. Go straight to your platform.
          </span>
          <span className="hidden text-[11px] uppercase tracking-widest text-white/55 md:inline">
            Free profile · 30 seconds · No card required
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Link
            href={dest}
            data-testid="banner-enter-platform"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#1E90FF] to-[#00C2FF] px-5 py-2.5 text-[12px] font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-[#1E90FF]/30 transition hover:scale-[1.02] hover:from-[#0080FF] hover:to-[#1E90FF] active:scale-95"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-white"></span>
            Enter the Platform
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/signup"
            data-testid="banner-create-profile"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/5 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.18em] text-white/85 transition hover:border-[#1E90FF]/60 hover:bg-white/10 hover:text-white"
          >
            Create Free Profile
          </Link>
        </div>
      </div>
    </section>
  );
}
// InstallAppModal replaced by slim PWAInstallBanner auto-shown at bottom

const APPS = [
  { id: "nil-portal", label: "NIL Portal™", icon: "/logos/nil-portal-logo.png", badge: "LIVE", href: "/nil-portal", desc: "Manage your NIL deals" },
  { id: "messenger", label: "Messenger™", icon: "/logos/nil-messenger-logo.png", badge: "LIVE", href: "/messenger", desc: "Connect with coaches & brands" },
  { id: "diamond-grind", label: "Diamond Grind™", icon: "/diamond-grind-baseball-icon.png", badge: "SEASON", href: "/diamond-grind", desc: "Baseball · softball · championship hub" },
  { id: "season-engine", label: "Season Engine™", icon: "/athlynxai-icon.png", badge: "CALLS", href: "/season-engine", desc: "Free fan calls · brackets · season CRM" },
  { id: "warriors-playbook", label: "Warriors Playbook™", icon: "/warriors-playbook-icon.png", badge: "HOT", href: "/warriors-playbook", desc: "Plays, film & strategy" },
  { id: "transfer-portal", label: "Transfer Portal™", icon: "/transfer-portal-icon.png", badge: "LIVE", href: "/transfer-portal", desc: "Find your next school" },
  { id: "nil-vault", label: "NIL Vault™", icon: "/nil-vault-icon.png", badge: "ELITE", href: "/nil-vault", desc: "Secure your contracts" },
  { id: "ai-sales", label: "AI Sales™", icon: "/ai-sales.png", badge: "AI", href: "/ai-sales", desc: "Close brand deals with AI" },
  { id: "faith", label: "Faith™", icon: "/faith-icon.png", badge: "FAITH", href: "/faith", desc: "Daily athlete devotionals" },
  { id: "ai-recruiter", label: "AI Recruiter™", icon: "/ai-recruiter.png", badge: "AI", href: "/ai-recruiter", desc: "Optimize your recruiting" },
  { id: "ai-content", label: "AI Content™", icon: "/ai-content.png", badge: "BLEND", href: "/ai-content", desc: "Create viral content" },
  { id: "infrastructure", label: "Infrastructure™", icon: "/economic-vision.png", badge: "TECH", href: "/infrastructure", desc: "Data centers & AI tech" },
  { id: "gridiron-nexus", label: "Gridiron Nexus™", icon: "/gridiron-nexus-icon.png", badge: "FOOTBALL", href: "/gridiron-nexus", desc: "Elite football platform" },
  { id: "pitch-pulse", label: "Pitch Pulse™", icon: "/pitch-pulse-icon.png", badge: "SOCCER", href: "/pitch-pulse", desc: "Global soccer ecosystem" },
  { id: "court-kings", label: "Court Kings™", icon: "/court-kings-icon.png", badge: "HOOPS", href: "/court-kings", desc: "Basketball AAU & NIL" },
  { id: "reel-masters", label: "Reel Masters™", icon: "/reel-masters-icon.png", badge: "FISHING", href: "/reel-masters", desc: "Ultimate fishing platform" },
  { id: "marketplace", label: "Marketplace™", icon: "/athlynx-app-icon.png", badge: "SHOP", href: "/marketplace", desc: "Athlete gear & deals" },
  { id: "cfactor", label: "C-Factor Hub™", icon: "/athlynxai-icon.png", badge: "HOT", href: "/cfactor", desc: "The operating system of your sports life" },
  { id: "rankings-hub", label: "Rankings Hub™", icon: "/diamond-grind-icon.png", badge: "NEW", href: "/rankings-hub", desc: "Top 25 · Mock Draft · Live Events" },
  { id: "athlete-dashboard", label: "My Dashboard™", icon: "/professional-athlete-dashboard.png", badge: "PERSONAL", href: "/athlete-dashboard", desc: "Your athlete command center" },
  { id: "community-feedback", label: "Community™", icon: "/fuelbots-icon.png", badge: "VOICE", href: "/community-feedback", desc: "Shape the platform" },
  { id: "mobile-app", label: "Mobile App™", icon: "/images/logos/mobile-app-icon.png", badge: "BETA", href: "/mobile-app", desc: "AthlynX in your pocket" },
];

const BADGE_COLORS: Record<string, string> = {
  LIVE: "bg-[#00C2FF]",
  NEW: "bg-blue-600",
  HOT: "bg-[#1E90FF]",
  ELITE: "bg-blue-700",
  AI: "bg-[#1565C0]",
  BLEND: "bg-[#1E90FF]",
  SOON: "bg-[#1E90FF]",
  TECH: "bg-[#1E90FF]",
  FOOTBALL: "bg-[#1E90FF]",
  SOCCER: "bg-[#00C2FF]",
  HOOPS: "bg-blue-800",
  FISHING: "bg-cyan-700",
  SHOP: "bg-blue-700",
  PERSONAL: "bg-[#1E90FF]",
  VOICE: "bg-[#1E90FF]",
  BETA: "bg-[#1E90FF]",
  SEASON: "bg-[#1565C0]",
  CALLS: "bg-blue-600",
};

const ECOSYSTEM_BRAND_IMAGES = [
  {
    src: "/brand/engine-mark-white.png?v=tightcrop-c409778",
    title: "AthlynX",
    label: "Approved owl/lynx + wordmark",
  },
  {
    src: "/brand/engine-mark-white.png?v=tightcrop-c409778",
    title: "AthlynXAI",
    label: "Official OS watermark only",
  },
  {
    src: "/brand/engine-mark-white.png?v=tightcrop-c409778",
    title: "AXN / AVN",
    label: "Streaming · podcast · network lane",
  },
];

const ECOSYSTEM_BRAND_STACK = [
  { code: "AthlynX", name: "Parent Athlete OS", tone: "from-blue-500/25 to-[#0a1628]/10" },
  { code: "AthlynXAI", name: "AI Operating Core", tone: "from-[#1E90FF]/20 to-blue-500/10" },
  { code: "AXN", name: "Athlete Network", tone: "from-[#1E90FF]/25 to-[#0a1628]/10" },
  { code: "AVN", name: "Athlete Vision Network", tone: "from-[#1E90FF]/25 to-blue-500/10" },
];

const DEMO_VIDEO_URL = "https://pub-e4ffb4c8e08a4770a064090220a8e31d.r2.dev/videos/kmXGpMmslwPdeWYO.mp4";

const CRAB_LOGO_VIDEO = "/media/podcast/episode-2/athlynxai-episode2-final-fullscreen-voice-music-no-echo.mp4";

const VIDEOS = [
  { file: "https://pub-e4ffb4c8e08a4770a064090220a8e31d.r2.dev/videos/SyHtmDgqKAycRzBN.mp4", title: "AthlynX — The Multi-Sport Empire", badge: "HOT" },
  { file: "https://pub-e4ffb4c8e08a4770a064090220a8e31d.r2.dev/videos/ImBnRmTCxfoaENos.mp4", title: "NIL Portal Baseball", badge: "HOT" },
  { file: "https://pub-e4ffb4c8e08a4770a064090220a8e31d.r2.dev/videos/SNHQDsOUVYFJwfUT.mp4", title: "NIL Portal Football", badge: "LIVE" },
  { file: "https://pub-e4ffb4c8e08a4770a064090220a8e31d.r2.dev/videos/exlwMUmNOQhJjidX.mp4", title: "Diamond Grind Baseball", badge: "NEW" },
  { file: "https://pub-e4ffb4c8e08a4770a064090220a8e31d.r2.dev/videos/ZfMgzTWXcpwXcMCt.mp4", title: "Softmor AI", badge: "AI" },
  { file: "https://pub-e4ffb4c8e08a4770a064090220a8e31d.r2.dev/videos/SwXAovMVYCnPjnZu.mp4", title: "Softmor — The Future", badge: "AI" },
  { file: "https://pub-e4ffb4c8e08a4770a064090220a8e31d.r2.dev/videos/RdxGMXGkDjZBeGeL.mp4", title: "DHG Empire", badge: "ELITE" },
  { file: "https://pub-e4ffb4c8e08a4770a064090220a8e31d.r2.dev/videos/eGLqGNCLommoTHsR.mp4", title: "DHG Empire II", badge: "ELITE" },
];

//  Mobile Nav Menu 
type MobileSection = { label: string; links: { href: string; label: string }[] };
const MOBILE_NAV_SECTIONS: MobileSection[] = [
  {
    label: "Platform",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/feed", label: "My Feed" },
      { href: "/athlete-playbook", label: "Athlete Playbook" },
      { href: "/athlete-journey", label: "Athlete Journey" },
      { href: "/season-engine", label: "Season Engine CRM" },
      { href: "/growth-crm", label: "Growth CRM" },
      { href: "/athlete-dashboard", label: "Athlete Dashboard" },
      { href: "/nil-portal", label: "NIL Portal" },
      { href: "/nil-calculator", label: "NIL Calculator" },
      { href: "/nil-vault", label: "NIL Vault" },
      { href: "/transfer-portal", label: "Transfer Portal" },
      { href: "/nil-marketplace", label: "Marketplace" },
    ],
  },
  {
    label: "AI Bots",
    links: [
      { href: "/wizard-hub", label: "Wizard Hub" },
      { href: "/ai-sales", label: "AI Sales Bot" },
      { href: "/ai-recruiter", label: "AI Recruiter" },
      { href: "/ai-content", label: "AI Content" },
      { href: "/ai-training-bot", label: "Training Bot" },
      { href: "/fuel-bots", label: "Fuel Bots" },
      { href: "/team-bots", label: "Team Bots" },
    ],
  },
  {
    label: "Sports",
    links: [
      { href: "/gridiron-nexus", label: "Gridiron Nexus" },
      { href: "/diamond-grind", label: "Diamond Grind" },
      { href: "/road-to-omaha", label: "Road to Omaha" },
      { href: "/softball", label: "Women’s Softball" },
      { href: "/season-engine", label: "Fan Calls + Brackets" },
      { href: "/all-sports-season-hubs", label: "All Sports Season Hubs" },
      { href: "/court-kings", label: "Court Kings" },
      { href: "/net-setters", label: "Net Setters" },
      { href: "/fairway-elite", label: "Fairway Elite" },
      { href: "/mat-warriors", label: "Mat Warriors" },
      { href: "/swim-surge", label: "Swim Surge" },
      { href: "/track-elite", label: "Track Elite" },
      { href: "/reel-masters", label: "Reel Masters" },
      { href: "/ice-breakers", label: "Ice Breakers" },
    ],
  },
  {
    label: "Business",
    links: [
      { href: "/crm", label: "CRM" },
      { href: "/comms-hub", label: "Comms Hub" },
      { href: "/social", label: "AthlynX Social" },
      { href: "/network", label: "AXN Network" },
      { href: "/social-hub", label: "Social Hub" },
      { href: "/studio", label: "Studio" },
      { href: "/podcast", label: "Podcast" },
      { href: "/legal-hub", label: "Legal Hub" },
      { href: "/contracts", label: "Contracts" },
      { href: "/faith", label: "Faith" },
    ],
  },
  {
    label: "Companies",
    links: [
      { href: "/dhg", label: "Dozier Holdings Group" },
      { href: "/softmor", label: "Softmor Inc" },
      { href: "/dhg-empire", label: "DHG Empire" },
      { href: "/dhg-home", label: "DHG Home" },
      { href: "/empire-vision", label: "Empire Vision" },
      { href: "/warriors-playbook", label: "Warriors Playbook" },
      { href: "/pitch-pulse", label: "Pitch Pulse" },
      { href: "/white-label", label: "White Label" },
      { href: "/partner-portal", label: "Partner Portal" },
      { href: "/dozier-legacy", label: "Dozier Legacy" },
    ],
  },
  {
    label: "Investors",
    links: [
      { href: "/investor-hub", label: "AthlynX Investor Hub" },
      { href: "/investor-deck", label: "Investor Deck" },
      { href: "/dhg", label: "DHG — Investor Page" },
      { href: "/softmor", label: "Softmor — Investor Page" },
      { href: "/manus-partnership", label: "AthlynXAI — Partnership" },
      { href: "/build-decisions", label: "Build Decisions — The Truth" },
      { href: "/icc-usa", label: "ICC-USA — Partner" },
      { href: "/partners", label: "Partnerships & Platform" },
      { href: "/infrastructure", label: "Platform Vision" },
      { href: "/infrastructure-manager", label: "Operations Manager" },
      { href: "/empire-vision", label: "Growth Vision" },
    ],
  },
  {
    label: "Tech Partners",
    links: [
      { href: "/manus-partnership", label: "AthlynXAI" },
      { href: "/what-we-stand-for", label: "What We Stand For" },
      { href: "/icc-usa", label: "ICC-USA Hardware" },
      { href: "/partners", label: "Platform Partnerships" },
      { href: "/partners", label: "Secure Operations" },
      { href: "/partners", label: "Live Deployment" },
      { href: "/partners", label: "Protected Data" },
      { href: "/partners", label: "Commerce Ready" },
      { href: "/partners", label: "Athlete Intelligence" },
      { href: "/partners", label: "Partner Inquiry" },
    ],
  },
];

function MobileNavMenu({ onClose, onInstall }: { onClose: () => void; onInstall: () => void }) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  return (
    // Full-screen overlay — fixed, covers entire viewport
    <div
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{ background: '#07112b' }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <img src="/brand/engine-mark-white.png?v=tightcrop-c409778" alt="AthlynX owl lynx mark" className="h-10 w-auto drop-shadow-[0_0_18px_rgba(0,194,255,0.35)]" />
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close menu"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable nav body */}
      <div className="flex-1 overflow-y-auto">
        {/* Primary links */}
        <div className="px-5 pt-4 pb-2 flex flex-col">
          {[
            { href: '/', label: 'Home' },
            { href: '/feed', label: 'Enter Platform', accent: true },
            { href: '/pricing', label: 'Pricing' },
            { href: '/nil-portal', label: 'NIL Portal', sub: 'Get paid for your name' },
            { href: '/transfer-portal', label: 'Transfer Portal', sub: 'Find your next school' },
            { href: '/ai-recruiter', label: 'AI Recruiter', sub: 'Get discovered by coaches' },
            { href: '/founders', label: 'About Us' },
            { href: '/contact', label: 'Contact' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center justify-between py-4 border-b border-white/8 group"
            >
              <div>
                <span className={`text-xl font-bold tracking-tight ${
                  item.accent ? 'text-[#00c2ff]' : 'text-white'
                }`}>{item.label}</span>
                {item.sub && <div className="text-white/40 text-xs mt-0.5">{item.sub}</div>}
              </div>
              <svg className="w-5 h-5 text-white/20 group-hover:text-white/60 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        {/* Sports section — collapsible */}
        <div className="border-t border-white/10">
          <button
            onClick={() => setOpenSection(openSection === 'Sports' ? null : 'Sports')}
            className="w-full flex items-center justify-between px-5 py-4 text-white"
          >
            <span className="text-xl font-bold tracking-tight">Sports</span>
            <svg className={`w-5 h-5 text-white/40 transition-transform duration-200 ${openSection === 'Sports' ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          {openSection === 'Sports' && (
            <div className="px-5 pb-4 grid grid-cols-2 gap-x-4 gap-y-1">
              {[
                { href: '/gridiron-nexus', label: ' Football' },
                { href: '/diamond-grind', label: ' Baseball' },
                { href: '/softball', label: ' Softball' },
                { href: '/season-engine', label: ' Fan Calls' },
                { href: '/court-kings', label: ' Basketball' },
                { href: '/net-setters', label: ' Volleyball' },
                { href: '/fairway-elite', label: ' Golf' },
                { href: '/mat-warriors', label: ' Wrestling' },
                { href: '/swim-surge', label: ' Swimming' },
                { href: '/track-elite', label: ' Track' },
                { href: '/reel-masters', label: ' Fishing' },
                { href: '/ice-breakers', label: ' Hockey' },
              ].map(s => (
                <Link key={s.href} href={s.href} onClick={onClose}
                  className="py-2.5 text-white/70 hover:text-white text-base font-medium transition-colors">
                  {s.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Solutions section — collapsible */}
        <div className="border-t border-white/10">
          <button
            onClick={() => setOpenSection(openSection === 'Solutions' ? null : 'Solutions')}
            className="w-full flex items-center justify-between px-5 py-4 text-white"
          >
            <span className="text-xl font-bold tracking-tight">Solutions</span>
            <svg className={`w-5 h-5 text-white/40 transition-transform duration-200 ${openSection === 'Solutions' ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          {openSection === 'Solutions' && (
            <div className="px-5 pb-4 flex flex-col gap-0">
              {[
                { href: '/nil-marketplace', label: 'NIL Marketplace' },
                { href: '/nil-vault', label: 'NIL Vault' },
                { href: '/ai-content', label: 'AI Content' },
                { href: '/ai-training-bot', label: 'AI Training Bot' },
                { href: '/elite-events', label: 'Elite Events' },
                { href: '/pro-teams', label: 'Pro Teams' },
                { href: '/store', label: 'Athlete Store' },
              ].map(s => (
                <Link key={s.href} href={s.href} onClick={onClose}
                  className="py-3 text-white/70 hover:text-white text-base font-medium border-b border-white/5 transition-colors">
                  {s.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer CTA — always visible at bottom */}
      <div className="px-5 py-5 border-t border-white/10 flex flex-col gap-3" style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
        <Link href="/signup" onClick={onClose}
          className="flex items-center justify-center bg-[#00c2ff] hover:bg-[#00a8e0] text-black font-black text-lg py-4 rounded-2xl transition-all shadow-lg shadow-[#00c2ff]/20">
          JOIN FREE — 7 DAYS →
        </Link>
        <div className="flex gap-3">
          <Link href="/signin" onClick={onClose}
            className="flex-1 flex items-center justify-center border border-white/20 text-white font-bold text-sm py-3 rounded-xl hover:bg-white/5 transition-colors">
            Sign In
          </Link>
          <button onClick={onInstall}
            className="flex-1 flex items-center justify-center border border-white/20 text-white/60 font-bold text-sm py-3 rounded-xl hover:bg-white/5 transition-colors">
            Install Ecosystem
          </button>
        </div>
        <p className="text-white/20 text-xs text-center">AthlynX · Dozier Holdings Group · Houston, TX</p>
      </div>
    </div>
  );
}

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [targetDate]);
  return timeLeft;
}

const AthlynX_LOGO = "/brand/engine-mark-white.png?v=tightcrop-c409778";

function VideoCard({ video }: { video: { file: string; title: string; badge: string } }) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement | null>(null);

  const handlePlay = () => {
    if (ref.current) {
      ref.current.play();
      setPlaying(true);
    }
  };

  return (
    <div className="group bg-[#1a3a8f] rounded-xl overflow-hidden border border-blue-700 hover:border-blue-400 transition-all duration-200 shadow-lg hover:shadow-blue-900/60">
      {/* Thumbnail / video area */}
      <div className="relative aspect-video bg-[#0d1b3e] flex items-center justify-center overflow-hidden">
        {/* AthlynX logo thumbnail — always visible until play */}
        {!playing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1a3a8f] to-[#0d1b3e] z-10">
            <img
              src={AthlynX_LOGO}
              alt="AthlynX"
              className="w-20 h-20 rounded-2xl shadow-2xl mb-3 object-cover"
            />
            <div className="text-white font-black text-base tracking-wide">AthlynX</div>
            <div className="text-blue-300 text-[10px] tracking-widest mt-0.5">THE ATHLETE'S PLAYBOOK</div>
          </div>
        )}
        <video
          ref={ref}
          className="w-full h-full object-cover"
          muted
          playsInline
          controls={playing}
          onEnded={() => setPlaying(false)}
        >
          <source src={video.file} />
        </video>
        {/* Play button overlay */}
        {!playing && (
          <button
            onClick={handlePlay}
            className="absolute z-20 w-14 h-14 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 hover:scale-110"
            aria-label="Play video"
          >
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}
      </div>
      {/* Card footer */}
      <div className="px-4 py-3 bg-[#1a3a8f] flex items-center justify-between">
        <div>
          <div className="text-white font-bold text-sm leading-tight">{video.title}</div>
          <div className="text-blue-400 text-[10px] mt-0.5">Click to play</div>
        </div>
        <span className={`text-[9px] font-black px-2 py-1 rounded-full text-white ${BADGE_COLORS[video.badge] ?? 'bg-blue-700'}`}>{video.badge}</span>
      </div>
    </div>
  );
}

const LAUNCH_TARGET_DATE = new Date("2026-07-01T00:00:00");

function HeroVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;
    vid.playsInline = true;
    const tryPlay = () => {
      vid.play().catch(() => {
        // Retry once after a short delay (handles iOS timing)
        setTimeout(() => vid.play().catch(() => {}), 500);
      });
    };
    if (vid.readyState >= 3) {
      tryPlay();
    } else {
      vid.addEventListener('canplay', tryPlay, { once: true });
    }
    return () => vid.removeEventListener('canplay', tryPlay);
  }, [src]);
  return (
    <video
      ref={videoRef}
      className="w-full h-full absolute inset-0 object-cover"
      style={{ minHeight: '500px' }}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

function HeroSignupForm() {
  return (
    <div className="flex flex-col gap-3">
      <a href="/signup" className="inline-flex items-center justify-center gap-2 bg-[#00c2ff] hover:bg-[#00a8e0] text-white font-bold py-3.5 px-8 rounded-xl transition-all duration-150 shadow-lg">Get Started Free</a>
      <p className="text-white/30 text-xs text-center">A Dozier Holdings Group Company · Houston, TX</p>
    </div>
  );
}

function HomeInner() {
  const countdown = useCountdown(LAUNCH_TARGET_DATE);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const trackGrowthMutation = trpc.crm.trackGrowthEvent.useMutation();
  // installOpen removed — PWAInstallBanner shows automatically as slim bottom bar

  useEffect(() => {
    if (typeof window !== 'undefined') captureGrowthAttribution();
  }, []);

  function trackLandingCta(cta: string) {
    if (typeof window === 'undefined') return;
    trackGrowthMutation.mutate({
      eventType: "landing_signup_cta_click",
      path: `${window.location.pathname}${window.location.search}`,
      metadata: getGrowthAttribution({ cta }),
    });
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20 sm:pb-0">
      {/*  CHAMPIONSHIP BRACKETS · TOP OF PAGE · ABOVE DIAMOND GRIND 
           Both MCWS (men) + WCWS (women) with live ESPN data. WCWS is
           already underway. Regionals end Mon Jun 1; Super Regionals start
           Fri Jun 5 — same components auto-roll. Diamond Grind covers both
           sports below. Locked by Chad 2026-05-31. */}
      {/*  BRACKET BANNERS — premium AthlynX-branded MCWS + WCWS art at the very top.
           Locked by Chad 2026-06-01 06:01 CDT: "All I want is the bracket banners live and at top."
           "Brand it for AthlynX. Best them at their own game."  */}
      <BracketBannerStrip />

      {/*  ATHLETE ENTRY BANNER — right under the brackets so athletes can skip straight to the platform. Locked by Chad 2026-06-01.  */}
      <AthleteEntryBanner />
      <LiveGamesStrip />
      <ChampionshipBracketsTop />

      {/*  ROAD TO OMAHA HERO — live regional bracket + Diamond Grind IQ launch. Locked May 29, 2026.  */}
      <RoadToOmahaHero />

      {/*  LIVE HIGHLIGHTS FEED — official WCWS/MCWS clips + AthlynX originals. Auto-refreshes. Added May 31, 2026 for S1E2 launch weekend.  */}
      <LiveHighlightsFeed mode="auto" />

      {/*  SOVEREIGNTY MANIFESTO — AthlynX Doctrine. Chad Dozier's response to HUMAIN. Added June 2026.  */}
      <SovereigntyManifesto />

      {/*  SEASONAL HERO STRIP — rotates with the championship season. All sports. All ages. Men & women.  */}
      <SeasonalHeroStrip />

      {/*  ATHLETE-FIRST ACQUISITION BAR  */}
      <div className="relative overflow-hidden border-b border-[#1E90FF]/30 bg-black">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <span className="rounded-full border border-[#1E90FF]/60 bg-[#1E90FF]/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-[#1E90FF]">BETA</span>
              <span className="text-[10px] font-black uppercase tracking-[0.28em] text-white/70">Full launch <span className="text-[#1E90FF]">July 1, 2026</span></span>
            </div>
            <div className="mt-1 text-sm font-bold text-white">Claim your free athlete profile in 30 seconds. No card required.</div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <a href="/signup?source=home_top_google" onClick={() => trackLandingCta("top_google_signup")} className="rounded-xl bg-white px-4 py-2 text-xs font-black text-black transition hover:bg-[#1E90FF] hover:text-white">Continue with Google</a>
            <a href="/signup?source=home_top_apple" onClick={() => trackLandingCta("top_apple_signup")} className="rounded-xl bg-black px-4 py-2 text-xs font-black text-white ring-1 ring-white/25 transition hover:bg-white hover:text-black">Continue with Apple</a>
            <a href="/signup?source=home_top_facebook" onClick={() => trackLandingCta("top_facebook_signup")} className="rounded-xl bg-[#1E90FF] px-4 py-2 text-xs font-black text-white transition hover:bg-[#0080FF]">Continue with Facebook</a>
            <a href="/investor-hub" onClick={() => trackLandingCta("top_investor_secondary")} className="rounded-xl border border-[#1E90FF]/40 px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1E90FF]/15">Investor info</a>
          </div>
        </div>
      </div>
      {/* Announcement bar */}
      <div className="bg-[#0a1628] text-center text-xs py-1.5 tracking-widest font-semibold text-white border-b border-[#1E90FF]/25">
        <span className="text-[#1E90FF] font-black">BE THE LEGACY</span> · 1 MAN · 1 AI · $1B · <span className="text-[#00C2FF]">FIRST AUTONOMOUS ATHLETE OS</span> · NEBIUS H200 · ATHLYNXAI OS v1
      </div>

      {/* Header */}
      <header className="bg-black/95 border-b border-[#1E90FF]/25 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20 md:h-20">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <img src="/brand/engine-mark-white.png?v=tightcrop-c409778" alt="AthlynX owl lynx mark and AthlynX wordmark" className="h-16 w-auto max-w-[185px] object-contain drop-shadow-[0_0_24px_rgba(30,144,255,0.50)] md:h-16 md:max-w-[235px]" />
            <span className="text-3xl md:text-4xl font-black tracking-tight text-[#1E90FF] drop-shadow-[0_0_18px_rgba(30,144,255,0.35)]">XAI</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-blue-400">
            <Link href="/dhg" className="hover:text-white transition-colors">PARENT COMPANY: DOZIER HOLDINGS GROUP</Link>
          </div>
          {/* Desktop nav buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/demo" className="text-xs border border-[#1E90FF] text-[#1E90FF] hover:bg-[#1E90FF] px-3 py-1.5 rounded-lg transition-colors font-bold">
              HOW IT WORKS
            </Link>
            <Link href="/pricing" className="text-xs border border-blue-700 text-blue-300 hover:bg-blue-800 px-3 py-1.5 rounded-lg transition-colors">
              PRICING
            </Link>
            <Link href="/founders" className="text-xs border border-blue-700 text-blue-300 hover:bg-blue-800 px-3 py-1.5 rounded-lg transition-colors">
              FOUNDERS
            </Link>
            <Link href="/signup" onClick={() => trackLandingCta("header_join_free")} className="text-xs bg-[#1E90FF] hover:bg-[#0080FF] text-white px-4 py-1.5 rounded-lg font-black transition-all shadow-lg shadow-[#1E90FF]/30 hover:scale-105">
              JOIN FREE — 7 DAYS
            </Link>
            <Link href="/signin" className="text-xs bg-[#0a1628] hover:bg-[#0080FF] text-white px-3 py-1.5 rounded-lg font-bold transition-colors border border-[#1E90FF]/35">
              SIGN IN
            </Link>
              <button
                onClick={() => { localStorage.removeItem('athlynx_pwa_dismissed_v3_brand_ecosystem'); window.dispatchEvent(new Event('athlynx-show-pwa')); }}
                className="text-xs bg-[#1E90FF] hover:bg-[#0080FF] text-white px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> Install Ecosystem
              </button>
          </div>
          {/* Mobile hamburger button */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-11 h-11 gap-1.5 rounded-xl hover:bg-blue-800 transition-colors border border-blue-700"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className={`block w-5 h-0.5 bg-white transition-all duration-200 origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-white transition-all duration-200 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-white transition-all duration-200 origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
        {/* Mobile dropdown menu */}
        {menuOpen && (
          <MobileNavMenu onClose={() => setMenuOpen(false)} onInstall={() => { localStorage.removeItem('athlynx_pwa_dismissed_v3_brand_ecosystem'); setMenuOpen(false); window.dispatchEvent(new Event('athlynx-show-pwa')); }} />
        )}
      </header>

      {/* Status bar */}
      <div className="bg-[#0a1628] border-b border-[#1E90FF]/25 py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-6 text-xs">
          <span className="flex items-center gap-1.5 text-[#00C2FF]"><span className="w-2 h-2 bg-[#00C2FF] rounded-full animate-pulse"></span>LIVE PLATFORM</span>
          <span className="text-[#1E90FF]">|</span>
          <span className="text-white/80">HIPAA-ALIGNED</span>
          <span className="text-[#1E90FF]">|</span>
          <span className="text-white/80">BUILT FOR PERFORMANCE</span>
        </div>
      </div>

      {/* Version banner */}
      <div className="bg-black text-center py-1.5 text-xs font-bold tracking-widest text-white border-b border-[#1E90FF]/25">
        PLATFORM v1.0 &nbsp;·&nbsp; <span className="text-[#1E90FF]">LIVE NOW</span> &nbsp;·&nbsp; 7-DAY FREE TRIAL
      </div>


      {/*  SEASONAL WORLD SERIES BRACKETS FIRST  */}
      <section className="relative overflow-hidden border-y border-[#1E90FF]/30 bg-black px-4 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(30,144,255,0.28),transparent_32%),radial-gradient(circle_at_88%_18%,rgba(0,128,255,0.18),transparent_34%)]" />
        <img src="/brand/engine-mark-white.png?v=tightcrop-c409778" alt="" aria-hidden="true" className="pointer-events-none absolute -right-16 top-6 hidden w-[520px] opacity-[0.075] drop-shadow-[0_0_46px_rgba(30,144,255,0.55)] lg:block" />
        <div className="absolute inset-y-0 right-0 hidden w-1/2 opacity-25 lg:block">
          <img src="/media/championship-brand/episode-2/scene01-multisport-walkout.png" alt="AthlynX World Series athletes" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20" />
        </div>
        <div className="relative z-10 mx-auto grid max-w-7xl gap-7 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#1E90FF]/50 bg-[#1E90FF]/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#1E90FF]">
              FOR THE ATHLETES CRAZY ENOUGH TO THINK THEY CAN CHANGE THE GAME.
            </div>
            <div className="mb-5 flex items-center gap-4">
              <img src="/brand/engine-mark-white.png?v=tightcrop-c409778" alt="AthlynX owl lynx mark and AthlynX wordmark" className="h-12 w-auto max-w-[170px] object-contain drop-shadow-[0_0_28px_rgba(30,144,255,0.45)]" />
              <span className="text-3xl font-black tracking-tight text-[#1E90FF] drop-shadow-[0_0_18px_rgba(30,144,255,0.45)]">XAI</span>
            </div>
            <h2 className="max-w-5xl text-4xl font-black uppercase leading-none tracking-tight text-white md:text-6xl">
              THIS IS FOR THEM.
            </h2>
            <p className="mt-3 text-sm font-black uppercase tracking-[0.22em] text-[#1E90FF]">
              Youth to pro to retirement. Every sport. Every level. One identity that travels with you for life.
            </p>
            <p className="mt-5 max-w-3xl text-base font-semibold leading-relaxed text-white/78 md:text-lg">
              Every athlete on this road is one of them. The 64-team bracket is treated with no favorites, no shortcuts, and no preferential spotlight — proof that AthlynX is built for every athlete, at every school, in every sport.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/brackets/mcws" className="rounded-2xl bg-[#1E90FF] px-5 py-3 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-[#1E90FF]/25 transition hover:bg-[#0080FF]">Follow The Road</Link>
              <Link href="/ncaa-baseball-regionals" className="rounded-2xl border border-[#1E90FF]/40 bg-[#0a1628] px-5 py-3 text-sm font-black uppercase tracking-wider text-white transition hover:bg-[#1E90FF]/20">See Every Regional</Link>
              <Link href="/softball" className="rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-black uppercase tracking-wider text-white transition hover:bg-white/20">Honor Every Path</Link>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-black/45 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1E90FF]">Every Athlete On This Road Counts</p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { k: '01', site: 'Athens, Georgia', host: 'Georgia' },
                  { k: '02', site: 'Atlanta, Georgia', host: 'Georgia Tech' },
                  { k: '03', site: 'Auburn, Alabama', host: 'Auburn' },
                  { k: '04', site: 'Austin, Texas', host: 'Texas' },
                  { k: '05', site: 'Chapel Hill, North Carolina', host: 'North Carolina' },
                  { k: '06', site: 'College Station, Texas', host: 'Texas A&M' },
                  { k: '07', site: 'Eugene, Oregon', host: 'Oregon' },
                  { k: '08', site: 'Gainesville, Florida', host: 'Florida' },
                  { k: '09', site: 'Hattiesburg, Mississippi', host: 'Southern Mississippi' },
                  { k: '10', site: 'Lawrence, Kansas', host: 'Kansas' },
                  { k: '11', site: 'Lincoln, Nebraska', host: 'Nebraska' },
                  { k: '12', site: 'Los Angeles, California', host: 'UCLA' },
                  { k: '13', site: 'Morgantown, West Virginia', host: 'West Virginia' },
                  { k: '14', site: 'Starkville, Mississippi', host: 'Mississippi State' },
                  { k: '15', site: 'Tallahassee, Florida', host: 'Florida State' },
                  { k: '16', site: 'Tuscaloosa, Alabama', host: 'Alabama' },
                ].map((regional) => (
                  <div key={regional.k} className="rounded-xl border border-white/10 bg-[#020617] px-3 py-3 text-xs font-black uppercase tracking-wider text-white">
                    <p><span className="mr-2 text-[#1E90FF]">{regional.k}</span>{regional.site}</p>
                    <p className="mt-1 text-[10px] leading-snug text-white/70">{regional.host}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-[#1E90FF]/25 bg-black/55 p-5 text-sm font-bold leading-relaxed text-white/76">
              <p className="font-black uppercase tracking-[0.18em] text-[#1E90FF]">Founder line</p>
              <p className="mt-3">Built in Mississippi by an athlete who believes the ones who think they can, do.</p>
              <p className="mt-3 text-white">— Chad A. Dozier Sr., Founder</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero — AthlynX XAI v2.2: walkout image, black/cobalt brand system */}
      <section className="relative min-h-[720px] overflow-hidden bg-black md:min-h-[780px]">
        <img
          src="/media/championship-brand/episode-2/scene01-multisport-walkout.png"
          alt="AthlynX athletes walking out of the stadium tunnel"
          className="absolute inset-0 h-full w-full object-cover object-[50%_38%] md:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/62 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(30,144,255,0.22),transparent_34%)]" />
        <div className="relative z-10 mx-auto flex min-h-[720px] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center md:min-h-[780px]">
          <div className="mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <img src="/brand/engine-mark-white.png?v=tightcrop-c409778" alt="AthlynX owl lynx mark and AthlynX wordmark" className="h-auto w-[min(78vw,390px)] object-contain drop-shadow-[0_0_42px_rgba(30,144,255,0.55)]" />
            <span className="text-5xl md:text-7xl font-black tracking-tight text-[#1E90FF] drop-shadow-[0_0_24px_rgba(30,144,255,0.45)]">XAI</span>
          </div>
          <div className="text-xs font-black uppercase tracking-[0.42em] text-white md:text-sm">THE ATHLETE'S PLAYBOOK</div>
          <h1 className="mt-8 max-w-5xl text-4xl font-black uppercase leading-[0.95] tracking-tight text-white drop-shadow-2xl md:text-7xl">
            ONE IDENTITY. EVERY ATHLETE. EVERY PLATFORM.
          </h1>
          <div className="mt-4 inline-flex items-center gap-3">
            <span className="text-2xl md:text-4xl font-black uppercase tracking-widest text-[#1E90FF] drop-shadow-[0_0_24px_rgba(30,144,255,0.6)]">BE THE LEGACY</span>
            <span className="text-white/30 text-2xl">·</span>
            <span className="text-sm md:text-base font-black uppercase tracking-widest text-white/60">ENTER THE PORTAL</span>
          </div>

          {/*  RECOGNITION & COMPUTE PARTNERS  */}
          <div className="mt-10 w-full max-w-5xl">
            <div className="text-[10px] font-black uppercase tracking-[0.45em] text-[#1E90FF]">Recognition &amp; Compute Partners</div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {/* Nebius — FEATURED SEMIFINALIST */}
              <div className="rounded-2xl border-2 border-[#1E90FF] bg-gradient-to-br from-[#0a1628] to-black px-4 py-4 text-left backdrop-blur-sm shadow-[0_0_28px_-4px_rgba(30,144,255,0.55)] transition hover:shadow-[0_0_40px_-4px_rgba(30,144,255,0.75)] hover:bg-[#0d1f40]">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1E90FF] animate-pulse"></span>
                  <div className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1E90FF]">Nebius AI</div>
                </div>
                <div className="text-sm font-black uppercase tracking-tight text-white md:text-base">Semifinalist</div>
                <div className="mt-0.5 text-[10px] font-black uppercase tracking-wider text-[#00C2FF]">AI Discovery Award</div>
                <div className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-white/55">Digital Health · London · Jul 1, 2026</div>
              </div>
              {/* Google ADK Hackathon — FEATURED */}
              <div className="rounded-2xl border-2 border-[#1E90FF]/60 bg-gradient-to-br from-[#0a1628] to-black px-4 py-4 text-left backdrop-blur-sm shadow-[0_0_20px_-4px_rgba(30,144,255,0.35)] transition hover:border-[#1E90FF] hover:shadow-[0_0_32px_-4px_rgba(30,144,255,0.55)]">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00C2FF] animate-pulse"></span>
                  <div className="text-[9px] font-black uppercase tracking-[0.3em] text-[#00C2FF]">Google</div>
                </div>
                <div className="text-sm font-black uppercase tracking-tight text-white md:text-base">ADK Hackathon</div>
                <div className="mt-0.5 text-[10px] font-black uppercase tracking-wider text-[#00C2FF]">Agent Dev Kit</div>
                <div className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-white/55">Cloud Run · AI Agents · Live</div>
              </div>
              {/* NVIDIA H200 */}
              <div className="rounded-2xl border border-[#1E90FF]/30 bg-black/55 px-4 py-4 text-left backdrop-blur-sm transition hover:border-[#1E90FF] hover:bg-black/75">
                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1E90FF]">NVIDIA</div>
                <div className="mt-1.5 text-sm font-black uppercase tracking-tight text-white md:text-base">H200 GPUs</div>
                <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-white/75">Hopper · HBM3e · 141 GB</div>
              </div>
              {/* OpenAI */}
              <div className="rounded-2xl border border-[#1E90FF]/30 bg-black/55 px-4 py-4 text-left backdrop-blur-sm transition hover:border-[#1E90FF] hover:bg-black/75">
                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1E90FF]">OpenAI</div>
                <div className="mt-1.5 text-sm font-black uppercase tracking-tight text-white md:text-base">Startup Fund</div>
                <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-white/75">Application Submitted</div>
              </div>
            </div>
          </div>
          <p className="mx-auto mt-5 max-w-2xl text-base font-bold leading-relaxed text-white/82 md:text-xl">
            Claim your free athlete profile in 30 seconds. No card required.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <a href={typeof window !== 'undefined' ? getPortalDestination() : '/signup'} onClick={() => trackLandingCta("hero_claim_profile")} className="inline-block rounded-xl bg-[#1E90FF] px-8 py-4 text-lg font-black text-white shadow-2xl shadow-[#1E90FF]/35 transition-all hover:scale-105 hover:bg-[#0080FF]">
              Claim Your Free Profile →
            </a>
            <div className="flex flex-wrap justify-center gap-2 text-xs font-black">
              <a href="/signup?source=hero_google" onClick={() => trackLandingCta("hero_google_signup")} className="rounded-full bg-white px-4 py-2 text-black transition hover:bg-[#1E90FF] hover:text-white">Google</a>
              <a href="/signup?source=hero_apple" onClick={() => trackLandingCta("hero_apple_signup")} className="rounded-full bg-black/85 px-4 py-2 text-white ring-1 ring-white/25 transition hover:bg-white hover:text-black">Apple</a>
              <a href="/signup?source=hero_facebook" onClick={() => trackLandingCta("hero_facebook_signup")} className="rounded-full bg-[#1E90FF] px-4 py-2 text-white transition hover:bg-[#0080FF]">Facebook</a>
            </div>
          </div>
        </div>
      </section>

      {/*  AthlynX ECOSYSTEM BRAND WALL  */}
      <section className="relative overflow-hidden bg-[#020713] px-4 py-14 border-y border-[#1E90FF]/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(0,194,255,0.22),transparent_32%),radial-gradient(circle_at_85%_0%,rgba(30,75,184,0.35),transparent_38%)]" />
        <div className="absolute -right-20 top-6 h-72 w-72 rounded-full border border-[#1E90FF]/30 bg-blue-500/10 blur-2xl" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#1E90FF]/30 bg-[#1E90FF]/20 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#00C2FF]">
                Official Branded Ecosystem
              </div>
              <h2 className="mt-5 text-4xl md:text-6xl font-black text-white tracking-tight leading-none">
                AthlynX · AthlynXAI<br />AXN · AVN
              </h2>
              <p className="mt-5 max-w-2xl text-base md:text-lg font-semibold leading-relaxed text-blue-100/80">
                One parent athlete OS, one AI operating core, one athlete network, and one vision/video lane. This replaces the weak mobile prompt with a premium branded view built for the entire platform.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {ECOSYSTEM_BRAND_STACK.map((item) => (
                  <div key={item.code} className={`rounded-2xl border border-white/10 bg-gradient-to-br ${item.tone} p-4 shadow-xl shadow-black/20`}>
                    <p className="text-xl font-black text-white">{item.code}</p>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#00C2FF]">{item.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {ECOSYSTEM_BRAND_IMAGES.map((asset) => (
                <article key={asset.title} className="group relative min-h-[300px] overflow-hidden rounded-[2rem] border border-[#1E90FF]/35 bg-black shadow-2xl shadow-blue-950/50">
                  <div className="absolute inset-0 flex items-center justify-center bg-black p-8"><img src={asset.src} alt={`${asset.title} approved AthlynX watermark`} className="max-h-[78%] max-w-[92%] object-contain opacity-95 drop-shadow-[0_0_28px_rgba(30,144,255,0.35)] transition duration-700 group-hover:scale-105" /></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-transparent" />
                  <div className="absolute left-0 right-0 bottom-0 p-5">
                    <p className="text-3xl font-black tracking-tight text-white drop-shadow-2xl">{asset.title}</p>
                    <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-[#00C2FF]">{asset.label}</p>
                  </div>
                  <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/45 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-white backdrop-blur">
                    Approved Mark
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/*  AthlynX Medical / LIBRE LINK PROOF  */}
      <section className="relative overflow-hidden bg-[#061226] px-4 py-12 border-y border-[#1E90FF]/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(0,194,255,0.18),transparent_34%),radial-gradient(circle_at_90%_10%,rgba(30,75,184,0.35),transparent_36%)]" />
        <div className="absolute -left-20 bottom-0 text-[9rem] md:text-[13rem] font-black tracking-tight text-white/[0.025] select-none">AthlynX Medical</div>
        <div className="relative z-10 max-w-7xl mx-auto grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1E90FF]/30 bg-[#1E90FF]/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#00C2FF]">
              Founder-Tested · Libre Link Proof Path
            </div>
            <h2 className="mt-5 text-4xl md:text-6xl font-black tracking-tight leading-none text-white">
              AthlynX Medical<br />Medical BioSignal OS
            </h2>
            <p className="mt-5 max-w-3xl text-base md:text-lg font-semibold leading-relaxed text-blue-100/80">
              Built from a founder-tested Libre workflow and designed as a privacy-safe athlete monitoring and early-warning layer. The public product language stays focused on monitoring, alerts, escalation, and clinician-guided care boundaries.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { title: "Libre Link", desc: "LibreView / LibreLinkUp / Data Share proof path", tone: "border-[#1E90FF]/30 bg-[#1E90FF]/10" },
              { title: "BioSignal Channel", desc: "Glucose, oxygen, cardiac, hydration, brain, heat, and recovery signals", tone: "border-[#1E90FF]/30 bg-[#1E90FF]/20" },
              { title: "IP Protected", desc: "Founder-owned proprietary concept, code, strategy, and evidence trail", tone: "border-blue-300/30 bg-blue-400/10" },
            ].map((card) => (
              <div key={card.title} className={`rounded-3xl border ${card.tone} p-5 shadow-2xl shadow-black/20 backdrop-blur`}>
                <p className="text-xl font-black text-white">{card.title}</p>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-blue-100/75">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  SCROLLING TICKER  */}
      <div className="bg-[#0066ff] overflow-hidden py-4">
        <div className="flex animate-[marquee_40s_linear_infinite] whitespace-nowrap" style={{gap: '3rem'}}>
          {[
            "EVERY SPORT", "NIL DEALS", "TRANSFER PORTAL", "AI TRAINER",
            "RECRUITING", "DIAMOND GRIND", "WOMEN'S SOFTBALL", "ROAD TO OMAHA",
            "ROAD TO OKC", "FREE FAN CALLS", "NO GAMBLING", "PUBLIC FEED",
            "NIL MESSENGER", "COURT KINGS", "X-FACTOR", "AI TRAINER",
            "RECRUITING", "DIAMOND GRIND", "COURT KINGS", "X-FACTOR",
          ].map((item, i) => (
            <span key={i} className="text-white font-black text-base tracking-[0.15em] uppercase flex items-center shrink-0" style={{marginRight: '2rem'}}>
              {item}&nbsp;&nbsp;<span className="text-white/60 text-lg"></span>
            </span>
          ))}
        </div>
      </div>


      {/*  AthlynXAI INTRODUCTION  */}
      <section className="bg-[#040c1a] py-14 px-4 border-b border-[#0066ff]/20">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#0066ff]/10 border border-[#0066ff]/30 rounded-full px-5 py-2 mb-6">
              <span className="w-2 h-2 bg-[#00c2ff] rounded-full animate-pulse" />
              <span className="text-[#00c2ff] text-xs font-black tracking-[0.2em] uppercase">Platform v1.0 · Live Now</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter mb-4">
              Built for the <span className="text-[#0066ff]">team</span> behind the <span className="text-[#00c2ff]">athlete</span>.
            </h2>
            <p className="text-[#8ba3c7] text-lg max-w-2xl mx-auto leading-relaxed">
              Coaches, parents, and athletes use AthlynXAI to handle the work between games — lineups, graphics, recruiting, scores. One login. Made in Houston by a founder who grew up on these fields, chosen to build differently instead of copying the market.
            </p>
          </div>

          {/* Live Platform Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { value: "44", label: "Sports Covered", sub: "Every level. Both genders.", color: "text-[#0066ff]" },
              { value: "213+", label: "Platform Features", sub: "Built from scratch", color: "text-[#00c2ff]" },
              { value: "$135B", label: "Market Opportunity", sub: "Sports tech TAM by 2035 · 21.9% CAGR", color: "text-[#00C2FF]" },
              { value: "4", label: "AI Engines", sub: "Private multi-engine architecture", color: "text-[#1E90FF]" },
            ].map((s, i) => (
              <div key={i} className="bg-[#0a1628] border border-[#0066ff]/20 rounded-2xl p-5 text-center hover:border-[#0066ff]/50 transition-all">
                <div className={`font-black text-4xl md:text-5xl ${s.color} mb-1`}>{s.value}</div>
                <div className="text-white font-black text-sm mb-1">{s.label}</div>
                <div className="text-[#4a6080] text-xs">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* EPX Demo Scores */}
          <div className="bg-[#0a1628] border border-[#0066ff]/20 rounded-3xl p-6 mb-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[#00c2ff] text-xs font-black uppercase tracking-widest mb-1">EPX™ — Demo Preview</div>
                <div className="text-white font-black text-xl">Sample Top Prospects</div>
                <div className="text-[#4a6080] text-[10px] mt-1">Illustrative example · not real users · live leaderboard launches with public release</div>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-white text-xs font-black">DEMO</span>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { name: "Marcus Williams", sport: "Football · QB", school: "Westlake HS, TX", score: 98, nil: "$85K", offers: 24, trend: "+3" },
                { name: "Aaliyah Thompson", sport: "Basketball · PG", school: "Cy-Fair HS, TX", score: 96, nil: "$62K", offers: 22, trend: "+1" },
                { name: "Jordan Davis", sport: "Baseball · RHP", school: "The Woodlands HS, TX", score: 94, nil: "$41K", offers: 12, trend: "+2" },
                { name: "Keisha Moore", sport: "Football · WR", school: "North Shore HS, GA", score: 93, nil: "$38K", offers: 19, trend: "+4" },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-3 bg-[#040c1a] rounded-2xl px-4 py-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 ${
                    i === 0 ? "bg-gradient-to-br from-[#0066ff] to-[#00c2ff]" :
                    i === 1 ? "bg-gradient-to-br from-[#0066ff] to-[#0a1628]" :
                    "bg-gradient-to-br from-[#0a1628] to-[#0066ff]"
                  }`}>
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-black text-sm truncate">{a.name}</div>
                    <div className="text-[#4a6080] text-xs truncate">{a.sport} · {a.school}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[#00c2ff] font-black text-xl">{a.score}</div>
                    <div className="text-[#00C2FF] text-xs font-bold">{a.trend} this week</div>
                  </div>
                  <div className="text-right shrink-0 hidden sm:block">
                    <div className="text-[#00C2FF] font-black text-sm">{a.nil}</div>
                    <div className="text-[#4a6080] text-xs">NIL Value</div>
                  </div>
                  <div className="text-right shrink-0 hidden sm:block">
                    <div className="text-white font-black text-sm">{a.offers}</div>
                    <div className="text-[#4a6080] text-xs">Offers</div>
                  </div>
                </div>
              ))}
            </div>
            <a href="/rankings-hub" className="block mt-4 text-center text-[#0066ff] text-sm font-black hover:text-[#00c2ff] transition-colors">
              View Full Leaderboard →
            </a>
          </div>

          {/* Platform Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              {
                icon: "",
                title: "NIL Deals",
                stat: "$2.1B+",
                statLabel: "Total NIL market tracked",
                desc: "Connect with brands, manage contracts, track earnings. The complete NIL ecosystem in one place.",
                color: "border-[#00C2FF]/30 hover:border-[#00C2FF]/60",
                statColor: "text-[#00C2FF]",
              },
              {
                icon: "",
                title: "Transfer Portal",
                stat: "847",
                statLabel: "Athletes in portal today",
                desc: "Find your next school, connect with coaches, check eligibility. The most powerful transfer tool in sports.",
                color: "border-[#0066ff]/30 hover:border-[#0066ff]/60",
                statColor: "text-[#00c2ff]",
              },
              {
                icon: "",
                title: "EPX Score",
                stat: "0–100",
                statLabel: "AI-powered athlete rating",
                desc: "Your EPX score grows as you perform. Coaches see it. Scouts track it. Brands pay for it.",
                color: "border-[#1E90FF]/30 hover:border-[#1E90FF]/60",
                statColor: "text-[#1E90FF]",
              },
            ].map((p, i) => (
              <div key={i} className={`bg-[#0a1628] border rounded-2xl p-6 transition-all ${p.color}`}>
                <div className="text-4xl mb-3">{p.icon}</div>
                <div className="text-white font-black text-lg mb-1">{p.title}</div>
                <div className={`font-black text-3xl ${p.statColor} mb-1`}>{p.stat}</div>
                <div className="text-[#4a6080] text-xs mb-3">{p.statLabel}</div>
                <p className="text-[#8ba3c7] text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <a href="/signup" className="inline-block bg-[#0066ff] hover:bg-[#0052cc] text-white font-black text-xl px-12 py-5 rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-[#0066ff]/30 mr-4">
              START FREE — 7 DAYS →
            </a>
            <a href="/portal" className="inline-block bg-white/5 hover:bg-white/10 text-white font-bold text-xl px-12 py-5 rounded-2xl border border-white/20 transition-all">
              ENTER PLATFORM
            </a>
          </div>

        </div>
      </section>

      {/*  SPORT CARDS — EVERY SPORT COVERED  */}
      <section className="bg-[#040c1a] py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <div className="text-[#00c2ff] text-xs uppercase tracking-widest font-black mb-1">Every Sport. Every Tool.</div>
            <h2 className="text-3xl md:text-4xl font-black text-white">YOUR SPORT IS HERE</h2>
          </div>
          <div className="flex flex-col gap-4">
            {[
              {
                sport: "Basketball",
                tag: "NIL Deals",
                tagColor: "bg-[#00C2FF] text-white",
                href: "/court-kings",
                img: "/media/site-theme/exact-episode2/03-IMG_0130.JPG",
                desc: "Court Kings™ — AAU, NIL, Recruiting"
              },
              {
                sport: "Football",
                tag: "Transfer Portal",
                tagColor: "bg-[#1E90FF] text-white",
                href: "/gridiron-nexus",
                img: "/media/site-theme/exact-episode2/21-IMG_0246.JPG",
                desc: "Gridiron Nexus™ — Elite Football Platform"
              },
              {
                sport: "Baseball",
                tag: "Diamond Grind",
                tagColor: "bg-[#0066ff] text-white",
                href: "/diamond-grind",
                img: "/media/site-theme/exact-episode2/04-IMG_0129.JPG",
                desc: "Diamond Grind™ — Baseball & Softball"
              },
              {
                sport: "Soccer",
                tag: "Pitch Pulse",
                tagColor: "bg-[#00c2ff] text-[#050d1a]",
                href: "/pitch-pulse",
                img: "/media/site-theme/exact-episode2/05-IMG_0131.JPG",
                desc: "Pitch Pulse™ — Global Soccer Ecosystem"
              },
              {
                sport: "Track & Field",
                tag: "EPX",
                tagColor: "bg-[#00c2ff] text-[#050d1a]",
                href: "/epx",
                img: "/media/site-theme/exact-episode2/06-IMG_0132.JPG",
                desc: "EPX™ — Performance Analytics"
              },
              {
                sport: "Wrestling",
                tag: "Warriors Playbook",
                tagColor: "bg-[#1E90FF] text-white",
                href: "/warriors-playbook",
                img: "/media/site-theme/exact-episode2/07-IMG_0133.JPG",
                desc: "Warriors Playbook™ — Plays, Film & Strategy"
              },
            ].map((card) => (
              <a key={card.sport} href={card.href}
                className="relative rounded-2xl overflow-hidden block group cursor-pointer" style={{ height: '280px' }}>
                <img src={card.img} alt={card.sport}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className={`text-xs font-black px-3 py-1.5 rounded-full ${card.tagColor}`}>{card.tag}</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-white font-black text-3xl mb-1">{card.sport}</div>
                  <div className="text-white/70 text-sm">{card.desc}</div>
                </div>
                <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full group-hover:bg-white/20 transition-colors">
                  ENTER →
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/*  PRIVATE AthlynXAI OS INFRASTRUCTURE  */}
      <section className="bg-[#060e24] border-t border-blue-900 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-[#00c2ff] text-xs uppercase tracking-widest font-black mb-1">The Infrastructure</div>
            <h2 className="text-3xl font-black text-white">AthlynXAI OS</h2>
            <p className="text-blue-300 text-sm mt-2">The CERN of US sports tech — revolutionary by design, with the operating blueprint protected by inquiry only.</p>
          </div>
          <div className="space-y-3">
            {[
              { layer: "Intelligence", name: "Athlete Intelligence", desc: "Recruiting, NIL, training, and career tools working together in one secure platform", color: "from-blue-600 to-[#0a1628]", icon: "" },
              { layer: "Experience", name: "Unified Athlete OS", desc: "Profiles, media, messaging, recruiting, and monetization connected in one flow", color: "from-[#1E90FF] to-indigo-600", icon: "" },
              { layer: "Reliability", name: "Production-Ready Platform", desc: "Built for uptime, fast access, secure routing, and long-term scale", color: "from-[#00C2FF] to-teal-600", icon: "" },
              { layer: "Data", name: "Secure Data Foundation", desc: "Athlete information, content, and business records protected behind controlled access", color: "from-blue-700 to-blue-900", icon: "" },
              { layer: "Commerce", name: "Payments & Licensing Ready", desc: "Designed for memberships, credits, licensing, and brand partnerships", color: "from-[#1E90FF] to-violet-700", icon: "" },
              { layer: "Communication", name: "Messaging & Alerts", desc: "Built to keep athletes, teams, parents, brands, and operators connected", color: "from-blue-600 to-[#0a1628]", icon: "" },
              { layer: "Media", name: "Video, Profiles & Content", desc: "A home for athlete stories, highlights, recruiting material, and media presence", color: "from-[#0066ff] to-[#00c2ff]", icon: "" },
              { layer: "Operations", name: "Automation-Ready Workflows", desc: "Internal systems support intake, follow-up, reporting, and platform operations", color: "from-[#0066ff] to-[#00c2ff]", icon: "" },
              { layer: "Security", name: "Protected Architecture", desc: "The revolutionary system is visible; the blueprint stays confidential", color: "from-gray-700 to-gray-900", icon: "" },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-4 bg-[#0d1b3e] border border-blue-900 rounded-xl px-4 py-3 hover:border-blue-600 transition-colors">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-lg shrink-0`}>{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 text-[10px] uppercase tracking-widest font-bold">{item.layer}</span>
                  </div>
                  <div className="text-white font-black text-sm">{item.name}</div>
                  <div className="text-blue-400 text-xs truncate">{item.desc}</div>
                </div>
                <div className="w-2 h-2 bg-[#00C2FF] rounded-full animate-pulse shrink-0"></div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#00C2FF]/30 border border-[#00C2FF] text-[#00C2FF] text-xs font-black px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-[#00C2FF] rounded-full animate-pulse"></span>
              REVOLUTIONARY PLATFORM LIVE — BLUEPRINT PROTECTED
            </div>
            <div>
              <a href="/contact" className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-5 py-2 rounded-full transition-colors">
                ASK ABOUT AthlynXAI OS
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* === FOUR ACCESS PORTALS — ONE PLACE === */}
      <section className="bg-gradient-to-b from-[#060e24] to-[#0d1b3e] py-12 px-4 border-b border-blue-900">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#1E90FF]/20 border border-[#1E90FF] text-[#1E90FF] text-xs font-black px-4 py-1.5 rounded-full mb-4 tracking-widest">
            <span className="w-2 h-2 bg-[#1E90FF] rounded-full animate-pulse"></span>
            FREE 7-DAY ACCESS — NOT CHARGED UNTIL DAY 8
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">ACCESS THE PLATFORM</h2>
          <p className="text-blue-300 text-base mb-8">Choose your portal below. All in one platform.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Users — Athletes, Parents, Coaches, Brands */}
            <a href="/feed" className="flex flex-col items-center gap-2 bg-gradient-to-br from-blue-600 to-[#0a1628] hover:from-[#1E90FF] hover:to-blue-600 text-white font-bold text-base py-5 px-4 rounded-2xl transition-all shadow-lg shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] border-2 border-[#1E90FF]/30">
              <span className="text-2xl"></span>
              <span className="font-black text-lg">ENTER THE PORTAL</span>
              <span className="text-blue-100 text-xs font-normal">Athletes · Parents · Coaches · Brands</span>
            </a>
            {/* Founders / Investors */}
            <a href="/investor-hub" className="flex flex-col items-center gap-2 bg-[#1a3a8f] hover:bg-[#1e4aaa] text-white font-bold text-base py-5 px-4 rounded-2xl transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] border border-blue-400/30">
              <span className="text-2xl"></span>
              <span className="font-black text-lg">Founders</span>
              <span className="text-blue-200 text-xs font-normal">Investors · Partners · DHG Team</span>
            </a>
            {/* Portal — White Label / Partner */}
            <a href="/portal" className="flex flex-col items-center gap-2 bg-[#0d2151] hover:bg-[#112d6b] text-white font-bold text-base py-5 px-4 rounded-2xl transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] border border-blue-400/30">
              <span className="text-2xl"></span>
              <span className="font-black text-lg">Portal</span>
              <span className="text-blue-200 text-xs font-normal">White Label · Partner Access</span>
            </a>
            {/* CRM — Internal Team */}
            <a href="/crm" className="flex flex-col items-center gap-2 bg-[#0a1628] hover:bg-[#0d1e3a] text-white font-bold text-base py-5 px-4 rounded-2xl transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] border border-blue-400/30">
              <span className="text-2xl"></span>
              <span className="font-black text-lg">CRM</span>
              <span className="text-blue-200 text-xs font-normal">Internal Team · Admin</span>
            </a>
          </div>
          <p className="text-blue-700 text-xs text-center mt-5">A Dozier Holdings Group Company · Houston, TX</p>
        </div>
      </section>

      {/* DHG Heavyweight Champion section */}
      <section className="bg-[#1a3a8f] border-y border-blue-900 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dhg">
              <img src="/images/logos/dhg-logo.png" alt="Dozier Holdings Group" className="w-16 h-16 rounded-xl object-cover hover:opacity-85 transition-opacity cursor-pointer" />
            </Link>
            <div>
              <div className="text-blue-400 text-xs uppercase tracking-widest">Heavyweight Champion</div>
              <Link href="/dhg" className="text-white font-black text-xl hover:text-blue-200 transition-colors block">DOZIER HOLDINGS GROUP</Link>
              <div className="text-blue-300 text-sm">The empire behind the platform</div>
            </div>
          </div>
          <Link href="/dhg" className="text-sm border border-blue-600 text-blue-300 hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors">
            Visit Dozier Holdings Group →
          </Link>
        </div>
      </section>

      {/* 10 Apps Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-blue-400 text-xs uppercase tracking-widest mb-1">The Ecosystem</div>
            <h2 className="text-3xl font-black text-white">THE FULL ECOSYSTEM</h2>
            <p className="text-blue-300 mt-2">20 platforms. One mission. Built from 4 years of vision.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {APPS.map(app => (
              <Link key={app.id} href={app.href} className="group bg-[#1a3a8f] hover:bg-[#1a3a8f] border border-blue-900 hover:border-blue-600 rounded-xl p-4 flex flex-col items-center gap-3 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-blue-900/50">
                <div className="relative">
                  <img src={app.icon} alt={app.label} className="w-16 h-16 rounded-2xl object-cover shadow-lg" />
                  {app.badge && (
                    <span className={`absolute -top-1.5 -right-1.5 text-[9px] font-black px-1.5 py-0.5 rounded-full text-white ${BADGE_COLORS[app.badge]}`}>
                      {app.badge}
                    </span>
                  )}
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-sm leading-tight">{app.label}</div>
                  <div className="text-blue-400 text-[10px] mt-0.5 leading-tight">{app.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Video Grid */}
      <section className="py-12 px-4 bg-[#0d1b3e]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-blue-400 text-xs uppercase tracking-widest mb-1">See It In Action</div>
            <h2 className="text-3xl font-black text-white">PLATFORM HIGHLIGHTS</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VIDEOS.map((video, i) => (
              <VideoCard key={i} video={video} />
            ))}
          </div>
        </div>
      </section>

      {/* Platform Live CTA */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#1a3a8f] to-[#1530a0]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-blue-400 text-xs uppercase tracking-widest mb-2">Platform Status</div>
          <h2 className="text-4xl font-black text-[#00C2FF] mb-4"> WE ARE LIVE</h2>
          <p className="text-blue-200 text-lg mb-8">The platform is open. Join thousands of athletes building their careers.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup" className="bg-gradient-to-r from-blue-600 to-[#0a1628] hover:from-[#1E90FF] hover:to-blue-600 text-white font-black text-lg px-8 py-4 rounded-xl transition-all shadow-xl hover:scale-105">
              Start Free Trial
            </a>
            <a href="/pricing" className="bg-[#1a3a8f] border border-blue-600 hover:bg-blue-800 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all">
              View Pricing
            </a>
          </div>
          <p className="text-blue-400 text-xs mt-4">Dreams Do Come True · A Dozier Holdings Group Company</p>
        </div>
      </section>

      {/* The Vision Section */}
      <section className="py-16 px-4 bg-[#0a1020] border-t border-blue-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-blue-400 text-xs uppercase tracking-widest mb-2">The Story</div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">BUILT WHEN NO ONE ELSE BELIEVED</h2>
            <p className="text-blue-300 text-lg max-w-3xl mx-auto leading-relaxed">
              AthlynX was built on a simple idea — athletes deserve more tools, more opportunities, and more control over their own careers. 
              Founded by Chad A. Dozier and Glenn Tse in Houston, Texas in November 2024, 
              this platform represents years of relentless work to build what the sports world had never seen.
            </p>
          </div>

          {/*  FOUNDER'S MANIFESTO — The Grinder's Creed  */}
          <article className="max-w-3xl mx-auto mb-14 relative scroll-mt-24" aria-labelledby="grinders-creed-title" style={{ scrollMarginTop: '6rem' }}>
            <div className="relative rounded-3xl overflow-hidden border border-[#1E90FF]/30 shadow-2xl shadow-blue-950/60 ring-1 ring-cyan-400/10" style={{ background: 'linear-gradient(160deg, #0a1c4d 0%, #0d2a8a 45%, #0a1c4d 100%)' }}>
              {/* corner registration marks — echo of the original card's design language */}
              <span aria-hidden className="absolute top-3 left-3 w-3 h-3 rounded-full border border-[#1E90FF]/30" />
              <span aria-hidden className="absolute top-3 right-3 w-3 h-3 rounded-full border border-[#1E90FF]/30" />
              <span aria-hidden className="absolute bottom-3 left-3 w-3 h-3 rounded-full border border-[#1E90FF]/30" />
              <span aria-hidden className="absolute bottom-3 right-3 w-3 h-3 rounded-full border border-[#1E90FF]/30" />
              <span aria-hidden className="absolute top-5 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#1E90FF]/40 to-transparent" />
              <span aria-hidden className="absolute bottom-5 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#1E90FF]/40 to-transparent" />

              {/* Author byline */}
              <header className="relative px-6 sm:px-10 pt-14 sm:pt-16 pb-6 flex items-center gap-4 border-b border-[#1E90FF]/30">
                <img
                  src="/images/team/chad-dozier-headshot.png"
                  alt="Chad A. Dozier"
                  className="w-16 h-16 rounded-full object-cover object-top border-2 border-[#1E90FF]/30 shadow-lg shadow-cyan-500/20 flex-shrink-0"
                  style={{ minWidth: '64px', minHeight: '64px' }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="flex-1">
                  <div className="text-white font-black text-base leading-tight">Chad A. Dozier</div>
                  <div className="text-[#00C2FF] text-[11px] tracking-widest uppercase">Founder · CEO · Chairman · AthlynX</div>
                </div>
                <div className="hidden sm:flex flex-col items-end text-[10px] tracking-widest uppercase text-blue-300/70">
                  <span>A Founder's Letter</span>
                  <span className="text-[#00C2FF]/80">No. 001</span>
                </div>
              </header>

              {/* Pull quote — the headline */}
              <div className="relative px-6 sm:px-10 pt-10 pb-2 text-center">
                {/* lightbulb glyph */}
                <div className="mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'radial-gradient(circle at 50% 40%, rgba(186,230,253,0.95) 0%, rgba(56,189,248,0.4) 45%, rgba(8,47,112,0) 75%)' }}>
                  <svg viewBox="0 0 24 24" className="w-9 h-9 text-white drop-shadow-[0_0_8px_rgba(125,211,252,0.8)]" fill="currentColor" aria-hidden>
                    <path d="M9 21h6v-1H9v1zm3-19a7 7 0 00-4 12.74V17a1 1 0 001 1h6a1 1 0 001-1v-2.26A7 7 0 0012 2z" />
                  </svg>
                </div>
                <p className="text-[#00C2FF]/80 text-[11px] tracking-[0.3em] uppercase mb-3">The Grinder's Creed</p>
                <h3 id="grinders-creed-title" className="text-white font-black leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(1.75rem, 4.2vw, 2.75rem)' }}>
                  Genius is <span className="text-[#00C2FF]">1%</span> inspiration<br/>and <span className="text-[#00C2FF]">99%</span> perspiration.
                </h3>
                <p className="text-blue-300/80 text-sm mt-3 italic">— Thomas A. Edison</p>
              </div>

              {/* The essay */}
              <div className="relative px-6 sm:px-10 py-8 text-blue-100/95 text-[15px] sm:text-base leading-[1.75] space-y-4">
                <p>
                  Every great invention the world has ever seen wasn't born from a lightning bolt of brilliance alone. It was forged in the fire of relentless effort, failed experiments, sleepless nights, and the refusal to quit.
                </p>
                <p>
                  Edison failed 10,000 times before the lightbulb worked. Tesla rewired the way the world thought about electricity — obsessively, tirelessly. Da Vinci filled thousands of pages with sketches before a single masterpiece emerged. Newton, Einstein, Curie, Archimedes — every one of them outworked the room.
                </p>
                <p className="text-white font-bold text-lg leading-tight pt-2">
                  Inspiration is the spark.<br/>
                  <span className="text-[#00C2FF]">Perspiration is the engine.</span>
                </p>
                <p>
                  So the next time you feel stuck, tired, or ready to give up — remember: you're probably in the 99%. Keep going. That's where greatness is made.
                </p>
                <p className="text-blue-200/90 italic">
                  AthlynX wasn't built in a boardroom. It was built on three days of no sleep, ten thousand commits, and the same refusal to quit that put a lightbulb in every home in America. We took our seat at that table the only way it's ever been earned — the hard way.
                </p>
              </div>

              {/* Lineage stamp */}
              <footer className="relative px-6 sm:px-10 pb-10 pt-2">
                <div className="border-t border-[#1E90FF]/30 pt-6 text-center">
                  <p className="text-blue-300/70 text-[10px] tracking-[0.3em] uppercase mb-3">The Lineage</p>
                  <p className="text-white font-bold text-sm sm:text-base tracking-wide">
                    Edison <span className="text-[#00C2FF]">·</span> Tesla <span className="text-[#00C2FF]">·</span> Da Vinci <span className="text-[#00C2FF]">·</span> Newton <span className="text-[#00C2FF]">·</span> Curie <span className="text-[#00C2FF]">·</span> Einstein
                  </p>
                  <p className="text-[#00C2FF] font-black text-lg sm:text-xl tracking-[0.2em] mt-2">AthlynX.AI</p>
                  <p className="text-blue-400/60 text-[10px] tracking-widest uppercase mt-4">
                    Signed · Chad A. Dozier · Houston, TX · May 2026
                  </p>
                </div>
              </footer>
            </div>
            <p className="text-center text-blue-400/70 text-[11px] tracking-[0.25em] uppercase mt-5">#AthlynXNation · #DozierHoldingsGroup · #NeverGiveUp</p>
          </article>

          {/* Live Platform Stats — Eye-Popping Numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { value: "44", label: "Sports Covered", sub: "Every sport. Every level.", color: "text-[#00C2FF]", icon: "" },
              { value: "213+", label: "Platform Routes", sub: "Features & tools built", color: "text-[#00C2FF]", icon: "" },
              { value: "4", label: "AI Engines", sub: "Private multi-engine architecture", color: "text-[#1E90FF]", icon: "" },
              { value: "$135B", label: "Market Opportunity", sub: "Sports tech TAM by 2035 · 21.9% CAGR", color: "text-[#00c2ff]", icon: "" },
            ].map((stat, i) => (
              <div key={i} className="bg-gradient-to-br from-[#0d1b3e] to-[#1a3a8f] border border-blue-800 rounded-2xl p-5 text-center hover:border-blue-600 transition-all">
                <div className="text-3xl mb-1">{stat.icon}</div>
                <div className={`text-3xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-white font-bold text-xs uppercase tracking-wider mb-1">{stat.label}</div>
                <div className="text-blue-400 text-[10px]">{stat.sub}</div>
              </div>
            ))}
          </div>
          {/* Athlete Showcase Row */}
          <div className="mb-8">
            <div className="text-center mb-4">
              <div className="text-blue-400 text-xs uppercase tracking-widest mb-1"> Featured Athletes</div>
              <h3 className="text-white font-black text-xl">REAL ATHLETES. REAL RESULTS.</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: "Marcus Johnson", sport: "Football", pos: "QB", school: "UT", score: 94, nil: "$85K", status: "Available", statusColor: "text-[#00C2FF]", photo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&q=80" },
                { name: "Destiny Williams", sport: "Basketball", pos: "PG", school: "LSU", score: 91, nil: "$62K", status: "Committed", statusColor: "text-blue-400", photo: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=200&h=200&fit=crop&q=80" },
                { name: "Isaiah Carter", sport: "Basketball", pos: "SF", school: "Duke", score: 97, nil: "$210K", status: "Available", statusColor: "text-[#00C2FF]", photo: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=200&h=200&fit=crop&q=80" },
                { name: "Aaliyah Torres", sport: "Soccer", pos: "FW", school: "Stanford", score: 92, nil: "$38K", status: "Committed", statusColor: "text-blue-400", photo: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=200&fit=crop&q=80" },
              ].map((a, i) => (
                <a key={i} href="/browse-athletes" className="block bg-[#0d1b3e] border border-blue-800 rounded-2xl overflow-hidden hover:border-[#1E90FF]/30 hover:shadow-lg hover:shadow-cyan-500/10 transition-all group">
                  <div className="relative h-28 overflow-hidden bg-gradient-to-br from-blue-950 via-slate-900 to-[#0a1628]">
                    <img
                      src={a.photo}
                      alt={a.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b3e] via-transparent to-transparent" />
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5">
                      <span className="text-white text-[9px] font-black">{a.sport}</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="text-white font-black text-sm mb-0.5">{a.name}</div>
                    <div className="text-blue-400 text-[10px] mb-2">{a.pos} · {a.school}</div>
                    <div className="grid grid-cols-3 gap-1">
                      <div className="text-center"><div className="text-[#00C2FF] font-black text-xs">{a.score}</div><div className="text-white/30 text-[8px]">SCORE</div></div>
                      <div className="text-center"><div className="text-[#00C2FF] font-black text-xs">{a.nil}</div><div className="text-white/30 text-[8px]">NIL</div></div>
                      <div className="text-center"><div className={`font-black text-[9px] ${a.statusColor}`}>{a.status}</div><div className="text-white/30 text-[8px]">STATUS</div></div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            <div className="text-center mt-4">
              <a href="/browse-athletes" className="inline-block bg-gradient-to-r from-[#1E90FF] to-blue-600 text-white font-black px-8 py-3 rounded-xl text-sm hover:opacity-90 transition-all">
                Browse All Athletes →
              </a>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0d1b3e] border border-blue-900 rounded-2xl p-6">
              <div className="text-blue-400 text-xs uppercase tracking-widest mb-3">The Athlete Playbook</div>
              <h3 className="text-white font-black text-xl mb-3">YOUR CAREER. YOUR BRAND. YOUR FUTURE.</h3>
              <p className="text-blue-300 text-sm leading-relaxed">
                AthlynX gives athletes the tools to boost their recruiting presence, build their media profile, 
                connect globally with other athletes, compare recruiting efforts, and share schedules across every sport and season. 
                From youth leagues to the pros — this is your playbook.
              </p>
            </div>
            <div className="bg-[#0d1b3e] border border-blue-900 rounded-2xl p-6">
              <div className="text-blue-400 text-xs uppercase tracking-widest mb-3">The NIL Revolution</div>
              <h3 className="text-white font-black text-xl mb-3">MONETIZE YOUR NAME, IMAGE & LIKENESS</h3>
              <p className="text-blue-300 text-sm leading-relaxed">
                The NIL Portal at <a href="https://nilportals.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-white underline">nilportals.com</a> and <a href="https://nilportal.ai" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-white underline">nilportal.ai</a> connects 
                athletes with brands, secures contracts, and guides the journey from small school to big opportunity through the Transfer Portal — 
                all in one seamless, integrated platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Network Section */}
      <section className="py-12 px-4 bg-[#0a1020] border-t border-blue-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-blue-400 text-xs uppercase tracking-widest mb-1">The DHG Network</div>
            <h2 className="text-2xl font-black text-white">OUR FULL ECOSYSTEM</h2>
            <p className="text-blue-400 text-sm mt-1">Every platform. One empire.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Dozier Holdings Group", url: "/dhg", tag: "PARENT CO", color: "border-[#1E90FF] text-[#1E90FF]", tagColor: "bg-[#1E90FF]", domain: "dozierholdingsgroup.com" },
              { label: "AthlynX Platform", url: "/portal", tag: "LIVE", color: "border-[#0066ff] text-[#00c2ff]", tagColor: "bg-[#0066ff]", domain: "athlynx.ai" },
              { label: "AthlynX Pro", url: "/pro-teams", tag: "LIVE", color: "border-[#0066ff] text-[#00c2ff]", tagColor: "bg-[#0066ff]", domain: "athlynx.pro" },
              { label: "AthlynX Net", url: "/portal", tag: "LIVE", color: "border-[#0066ff] text-[#00c2ff]", tagColor: "bg-[#0066ff]", domain: "athlynx.net" },
              { label: "AthlynX IO", url: "/portal", tag: "LIVE", color: "border-[#0066ff] text-[#00c2ff]", tagColor: "bg-[#0066ff]", domain: "athlynx.io" },
              { label: "NIL Portal", url: "/nil-portal", tag: "LIVE", color: "border-[#00C2FF] text-[#00C2FF]", tagColor: "bg-[#00C2FF]", domain: "nilportals.com" },
              { label: "NIL Portal AI", url: "/nil-portal", tag: "LIVE", color: "border-[#00C2FF] text-[#00C2FF]", tagColor: "bg-[#00C2FF]", domain: "nilportal.ai" },
              { label: "NIL Gateway", url: "/nil-marketplace", tag: "LIVE", color: "border-[#00C2FF] text-[#00C2FF]", tagColor: "bg-[#00C2FF]", domain: "nilgateway.com" },
              { label: "NIL Gateway Org", url: "/nil-marketplace", tag: "LIVE", color: "border-[#00C2FF] text-[#00C2FF]", tagColor: "bg-[#00C2FF]", domain: "nilgateway.org" },
              { label: "Transfer Portal", url: "/transfer-portal", tag: "LIVE", color: "border-[#00c2ff] text-[#00c2ff]", tagColor: "bg-[#0066ff]", domain: "transferportal.live" },
              { label: "Transfer Portal 360", url: "/transfer-portal", tag: "LIVE", color: "border-[#00c2ff] text-[#00c2ff]", tagColor: "bg-[#0066ff]", domain: "transferportal360.com" },
            ].map((site) => site.url.startsWith('/') ? (
                <Link
                  key={site.url}
                  href={site.url}
                  className={`group bg-[#0d1a35] border ${site.color} rounded-xl p-4 flex flex-col gap-2 hover:bg-[#1a3a8f] transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-900/40`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full text-white ${site.tagColor}`}>{site.tag}</span>
                    <span className="text-blue-600 group-hover:text-blue-400 text-xs transition-colors">→</span>
                  </div>
                  <div className={`font-bold text-sm leading-tight ${site.color.split(' ')[1]}`}>{site.label}</div>
                  <div className="text-blue-600 text-[10px] truncate">{site.domain}</div>
                </Link>
              ) : (
                <a
                  key={site.url}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group bg-[#0d1a35] border ${site.color} rounded-xl p-4 flex flex-col gap-2 hover:bg-[#1a3a8f] transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-900/40`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full text-white ${site.tagColor}`}>{site.tag}</span>
                    <span className="text-blue-600 group-hover:text-blue-400 text-xs transition-colors">↗</span>
                  </div>
                  <div className={`font-bold text-sm leading-tight ${site.color.split(' ')[1]}`}>{site.label}</div>
                  <div className="text-blue-600 text-[10px] truncate">{site.domain}</div>
                </a>
              )
            )}
          </div>
        </div>
      </section>

      {/*  UNIFIED TEAM BAND — 4 profiles, equal billing for founders, Tony as   */}
      <section className="py-16 px-4 bg-gradient-to-b from-black via-[#0a1628] to-black border-t border-[#1E90FF]/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-[10px] uppercase tracking-[0.32em] text-[#1E90FF] font-black mb-3">THE TEAM</div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">One team. One mission.</h2>
            <p className="text-white/60 text-sm mt-3 max-w-2xl mx-auto">The founders and operators behind AthlynXAI OS v1.</p>
          </div>

          {/* Founders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {ATHLYNX_TEAM.filter((p) => !['','','',''].includes(p.slug)).map((p) => (
              <TeamProfileCard key={p.slug} profile={p} size="default" />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/team" className="inline-block border border-[#1E90FF]/40 hover:border-[#1E90FF] text-white hover:text-[#1E90FF] px-6 py-3 rounded-xl text-sm font-bold transition" data-testid="link-meet-team">
              Meet the Full Team →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== APP STORE + GOOGLE PLAY COMING SOON ===== */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#080d1a] to-[#0a1020] border-t border-blue-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#1E90FF]/20 border border-[#1E90FF] text-[#1E90FF] text-xs font-black px-4 py-1.5 rounded-full mb-6 tracking-widest">
            <span className="w-2 h-2 bg-[#1E90FF] rounded-full animate-pulse"></span>
APP STORE + GOOGLE PLAY TESTING
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight">
            AthlynX ON YOUR PHONE
          </h2>
          <p className="text-blue-300 text-base md:text-lg mb-10 max-w-2xl mx-auto">
            AthlynX native apps are moving through Apple TestFlight and Google Play testing. The app-store download logo is the black and white A/X mark, and the mobile preview below uses the approved store-promo artwork.
          </p>

          <div className="mb-10 flex justify-center">
            <img
              src="/athlynx-mobile-store-promo.png"
              alt="AthlynXAI mobile app store preview"
              className="w-full max-w-sm rounded-3xl border border-blue-700 shadow-2xl shadow-blue-900/50 object-contain bg-black/40"
            />
          </div>

          {/* App Icons + Store Badges */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-10">
            {/* iOS / App Store */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src="/images/logos/mobile-app-icon.png"
                  alt="AthlynX iOS App"
                  className="w-28 h-28 rounded-3xl shadow-2xl shadow-blue-900/60 object-contain border-2 border-blue-700"
                />
                <div className="absolute -top-2 -right-2 bg-[#007AFF] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg">iOS</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-white font-black text-sm">App Store</div>
                <div className="flex items-center gap-2 bg-black border border-white/20 rounded-xl px-5 py-3 opacity-60 cursor-not-allowed select-none">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-white/60 text-[9px] leading-none">Coming soon to</div>
                    <div className="text-white font-black text-sm leading-tight">App Store</div>
                  </div>
                </div>
                <div className="text-[#00C2FF] text-xs font-bold tracking-widest">TESTFLIGHT BUILD 19 LIVE</div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-40 bg-blue-800"></div>

            {/* Android / Google Play */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src="/images/logos/mobile-app-icon.png"
                  alt="AthlynX Android App"
                  className="w-28 h-28 rounded-3xl shadow-2xl shadow-blue-900/60 object-contain border-2 border-blue-700"
                />
                <div className="absolute -top-2 -right-2 bg-[#34A853] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg">Android</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-white font-black text-sm">Google Play</div>
                <div className="flex items-center gap-2 bg-black border border-white/20 rounded-xl px-5 py-3 opacity-70 cursor-not-allowed select-none">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                    <path d="M3.18 23.76c.3.16.64.2.97.12l11.4-11.4L12 9l-8.82 14.76z" fill="#EA4335"/>
                    <path d="M20.82 10.5l-2.88-1.65L14.55 12l3.39 3.39 2.88-1.65c.82-.47.82-1.77 0-2.24z" fill="#FBBC04"/>
                    <path d="M3.18.24C2.88.4 2.67.73 2.67 1.2v21.6c0 .47.21.8.51.96L15.12 12 3.18.24z" fill="#4285F4"/>
                    <path d="M3.18 23.76l11.37-11.37L12 9.49 3.18 23.76z" fill="#34A853"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-white/60 text-[9px] leading-none">In testing on</div>
                    <div className="text-white font-black text-sm leading-tight">Google Play</div>
                  </div>
                </div>
                <div className="text-[#00C2FF] text-xs font-bold tracking-widest">CLOSED TESTING IN REVIEW</div>
              </div>
            </div>
          </div>

          {/* PWA Install CTA */}
          <div className="bg-[#1a3a8f]/60 border border-blue-700 rounded-2xl p-6 max-w-xl mx-auto">
            <div className="text-[#00C2FF] text-xs uppercase tracking-widest mb-2">Available Right Now</div>
            <h3 className="text-white font-black text-xl mb-2">Install the AthlynX Ecosystem</h3>
            <p className="text-blue-300 text-sm mb-4">Add AthlynX, AthlynXAI, AXN, AVN, and AthlynX Medical to your home screen with the new branded app prompt. Native feel. Watermark look. One OS.</p>
            <button
              onClick={() => { localStorage.removeItem('athlynx_pwa_dismissed_v3_brand_ecosystem'); window.dispatchEvent(new Event('athlynx-show-pwa')); }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00D4FF] to-blue-500 text-[#0a1628] font-black text-base px-8 py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:opacity-90 transition-opacity"
            >
              <span className="text-lg"></span>
              Install Ecosystem Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#080d1a] border-t border-blue-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/brand/engine-mark-white.png?v=tightcrop-c409778" alt="AthlynX owl lynx mark and AthlynX wordmark" className="h-16 w-auto max-w-[210px] object-contain" />
              <div>
                <div className="sr-only">AthlynX — THE ATHLETE'S PLAYBOOK</div>
                <div className="text-blue-400 text-xs">A Dozier Holdings Group Company</div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-blue-400">
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="/billing" className="hover:text-white transition-colors">Billing</Link>
              <Link href="/founders" className="hover:text-white transition-colors">Founders</Link>
              <Link href="/dhg" className="hover:text-white transition-colors">DHG Corporate</Link>
              <Link href="/nil-portal" className="hover:text-white transition-colors">NIL Portal</Link>
              <Link href="/digital-health" className="hover:text-white transition-colors">Digital Health</Link>
              <Link href="/feed" className="hover:text-white transition-colors">Platform</Link>
              <Link href="/demo" className="hover:text-white transition-colors">How It Works</Link>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
              <a href="https://nilportals.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">nilportals.com</a>
              <a href="https://nilportal.ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">nilportal.ai</a>
              <a href="https://transferportal.ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">transferportal.ai</a>
              <a href="https://athlynx.ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">athlynx.ai</a>
              <Link href="/gridiron-nexus" className="hover:text-white transition-colors">Gridiron Nexus</Link>
              <Link href="/pitch-pulse" className="hover:text-white transition-colors">Pitch Pulse</Link>
              <Link href="/court-kings" className="hover:text-white transition-colors">Court Kings</Link>
              <Link href="/reel-masters" className="hover:text-white transition-colors">Reel Masters</Link>
              <Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
              <Link href="/athlete-dashboard" className="hover:text-white transition-colors">My Dashboard</Link>
              <Link href="/community-feedback" className="hover:text-white transition-colors">Community</Link>
              <Link href="/mobile-app" className="hover:text-white transition-colors">Mobile App</Link>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-[#1E90FF]/30 bg-[#1E90FF]/20 p-4 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#00C2FF]">Copyright · Trademark · Proprietary IP Notice</p>
            <p className="mt-2 text-xs leading-relaxed text-blue-200">
              © 2026 Chad A. Dozier Sr. and affiliated Dozier Holdings Group / AthlynX entities. All rights reserved. AthlynX™, AthlynXAI™, AXN™, AVN™, AthlynX Medical™, Medical BioSignal OS™, GlucoAthlete OS™, BioSignal Channel™, and related names, logos, source code, workflows, product concepts, founder-tested Libre Link proof paths, and evidence packages are proprietary intellectual property. Formal trademark and copyright filings may be handled by counsel; this notice preserves public claim, authorship, ownership, and evidence of use.
            </p>
          </div>

          {/* AthlynXAI Credit */}
          <div className="mt-6 pt-5 border-t border-blue-900/40 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-[#1E90FF] to-[#0a1628] rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-black">M</span>
              </div>
              <p className="text-slate-400 text-xs">
                Proudly built with{" "}
                <a href="https://manus.im" target="_blank" rel="noopener noreferrer" className="text-[#1E90FF] hover:text-[#1E90FF] font-bold transition-colors">AthlynXAI</a>
                {" "}— a development partner on the early platform. Full receipts on{" "}
                <a href="/build-decisions" className="text-white/80 hover:text-white font-bold transition-colors underline">Build Decisions</a>.
              </p>
            </div>
          </div>
          <div className="mt-4 text-center text-blue-600 text-xs">
            © 2026 Chad A. Dozier Sr. / Dozier Holdings Group™ / AthlynX™. All rights reserved. AthlynX™, AthlynXAI™, AXN™, AVN™, AthlynX Medical™, Medical BioSignal OS™, GlucoAthlete OS™, BioSignal Channel™, The Athlete's Playbook™, NIL Portal™, Diamond Grind™, Gridiron Nexus™, Pitch Pulse™, Court Kings™, Reel Masters™, Warriors Playbook™, NIL Vault™, Transfer Portal™, and Fuel Bots™ are proprietary marks and platform assets. Dreams Do Come True 2026.
          </div>
        </div>
      </footer>

      {/* PWAInstallBanner renders globally in App.tsx */}

      {/*  STICKY FLOATING ENTER THE PORTAL BUTTON  */}
      <EnterPortalToggle />

      {/*  REVERSE FUNNEL — Exit-intent + time-based lead capture  */}
      <ReverseFunnel trigger="exit-intent" source="homepage" variant="athlete" />
    </div>
  );
}
// deploy-1776539237
export default function Home() {
  return <RouteErrorBoundary><HomeInner /></RouteErrorBoundary>;
}
