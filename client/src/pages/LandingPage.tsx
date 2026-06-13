/**
 * AthlynXAI — Official Landing Page
 * Version: S36 — May 6, 2026
 * Author: Chad A. Dozier Sr. — Founder · CEO · Chairman, AthlynXAI Corporation
 *
 * Design System:
 * - Background: #050d1a (deep navy black)
 * - Primary: #0066ff (AthlynXAI blue)
 * - Accent: #00c2ff (electric cyan)
 * - Text: #ffffff (white) / #8ba3c7 (muted blue-grey)
 * - NO yellow. NO generic. 100% original AthlynXAI.
 *
 * Flow: athlynx.ai/landing → athlynx.ai (full platform)
 */

import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";

//  Hero Video (CDN) 
const HERO_VIDEO = "https://pub-e4ffb4c8e08a4770a064090220a8e31d.r2.dev/videos/SyHtmDgqKAycRzBN.mp4";

//  Platform Screenshots (real athlynx.ai UI) 
const SCREENS = {
  feed:       "/brand/athlynx-app-screen-1.png",
  diamond:    "/brand/app-screen-2.png",
  messenger:  "/brand/app-screen-3.png",
  epx:        "/brand/app-screen-4.png",
  cfactor:    "/brand/app-screen-5.png",
  calendar:   "/brand/app-screen-6.png",
  rankings:   "/brand/app-screen-7.png",
  nilportal:  "/brand/app-screen-8.png",
  transfer:   "/brand/app-screen-9.png",
  warriors:   "/brand/app-screen-10.png",
  profile:    "/brand/app-screen-11.png",
  recruiting: "/brand/app-screen-12.png",
  screen1:    "/brand/app-screen-13.png",
  screen2:    "/brand/app-screen-14.png",
};

const ECOSYSTEM_IMAGES = [
  {
    src: "/brand/uploads-permanent/athlynx-hero-horizontal-stadium.PNG",
    title: "AthlynXAI",
    subtitle: "Recruiting · NIL · Brand tools for the modern athlete",
  },
  {
    src: "/brand/uploads-permanent/athlynx-hero-vertical-stadium.JPG",
    title: "AthlynX",
    subtitle: "Parent athlete OS and sports identity layer",
  },
  {
    src: "/brand/uploads-permanent/owl-watermark-stadium-approved.JPG",
    title: "AXN / AVN",
    subtitle: "Athlete network, media, video, and vision layer",
  },
];

const ECOSYSTEM_LEGS = [
  { code: "AthlynX", title: "Parent Athlete OS", desc: "Recruiting, NIL, profiles, sports identity, athlete lifecycle, and family access." },
  { code: "AthlynXAI", title: "AI Operating Core", desc: "Agents, automation, intelligence, BioSignal OS, connectors, and data vaults." },
  { code: "AXN", title: "Athlete Network", desc: "Media, podcasts, athlete storytelling, live channels, and partner distribution." },
  { code: "AVN", title: "Athlete Vision Network", desc: "Video, computer vision, highlights, film, clips, and visual athlete intelligence." },
];

//  Sports — Men's & Women's 
const SPORTS = [
  // Men's
  { gender:"Men's", sport:"Football",     img:"/sports/football.png", href:"/gridiron-nexus",   badge:"LIVE" },
  { gender:"Men's", sport:"Basketball",   img:"/landing/IMG_2046.JPG", href:"/court-kings",      badge:"LIVE" },
  { gender:"Men's", sport:"Baseball",     img:"/landing/IMG_2047.JPG", href:"/diamond-grind",    badge:"NEW"  },
  { gender:"Men's", sport:"Soccer",       img:"/landing/IMG_2048.JPG", href:"/pitch-pulse",      badge:"LIVE" },
  { gender:"Men's", sport:"Track & Field",img:"/landing/IMG_2049.JPG", href:"/epx",         badge:"HOT"  },
  { gender:"Men's", sport:"Wrestling",    img:"/landing/IMG_2050.JPG", href:"/warriors-playbook",badge:"HOT"  },
  { gender:"Men's", sport:"Swimming",     img:"/landing/IMG_2051.JPG", href:"/swim-surge",       badge:"LIVE" },
  { gender:"Men's", sport:"Tennis",       img:"/landing/IMG_2052.JPG", href:"/racket-kings",     badge:"LIVE" },
  { gender:"Men's", sport:"Golf",         img:"/landing/IMG_2053.JPG", href:"/fairway-elite",    badge:"LIVE" },
  { gender:"Men's", sport:"Volleyball",   img:"/landing/IMG_2054.JPG", href:"/net-setters",      badge:"LIVE" },
  { gender:"Men's", sport:"Gymnastics",   img:"/landing/IMG_2055.JPG", href:"/gymnastics",       badge:"LIVE" },
  { gender:"Men's", sport:"Rugby",        img:"/landing/IMG_2057.JPG", href:"/rugby-elite",      badge:"LIVE" },
  { gender:"Men's", sport:"Lacrosse",     img:"/landing/IMG_2058.JPG", href:"/lacrosse",         badge:"LIVE" },
  { gender:"Men's", sport:"Hockey",       img:"/landing/IMG_2060.JPG", href:"/hockey",           badge:"LIVE" },
  { gender:"Men's", sport:"Softball",     img:"/landing/IMG_2061.JPG", href:"/softball-nation",  badge:"LIVE" },
  { gender:"Men's", sport:"Rowing",       img:"/landing/IMG_2062.JPG", href:"/rowing-elite",     badge:"LIVE" },
  { gender:"Men's", sport:"Cycling",      img:"/landing/IMG_2063.JPG", href:"/cycling",          badge:"LIVE" },
  { gender:"Men's", sport:"Boxing",       img:"/landing/IMG_2065.JPG", href:"/boxing",           badge:"LIVE" },
  { gender:"Men's", sport:"MMA",          img:"/landing/IMG_2066.JPG", href:"/mma",              badge:"LIVE" },
  // Women's
  { gender:"Women's", sport:"Basketball",   img:"/landing/IMG_2046.JPG", href:"/court-kings",      badge:"LIVE" },
  { gender:"Women's", sport:"Soccer",       img:"/landing/IMG_2048.JPG", href:"/pitch-pulse",      badge:"LIVE" },
  { gender:"Women's", sport:"Volleyball",   img:"/landing/IMG_2054.JPG", href:"/net-setters",      badge:"LIVE" },
  { gender:"Women's", sport:"Softball",     img:"/landing/IMG_2061.JPG", href:"/softball-nation",  badge:"LIVE" },
  { gender:"Women's", sport:"Gymnastics",   img:"/landing/IMG_2055.JPG", href:"/gymnastics",       badge:"LIVE" },
  { gender:"Women's", sport:"Track & Field",img:"/landing/IMG_2049.JPG", href:"/epx",         badge:"HOT"  },
  { gender:"Women's", sport:"Swimming",     img:"/landing/IMG_2051.JPG", href:"/swim-surge",       badge:"LIVE" },
  { gender:"Women's", sport:"Tennis",       img:"/landing/IMG_2052.JPG", href:"/racket-kings",     badge:"LIVE" },
  { gender:"Women's", sport:"Lacrosse",     img:"/landing/IMG_2058.JPG", href:"/lacrosse",         badge:"LIVE" },
  { gender:"Women's", sport:"Rowing",       img:"/landing/IMG_2062.JPG", href:"/rowing-elite",     badge:"LIVE" },
  { gender:"Women's", sport:"Golf",         img:"/landing/IMG_2053.JPG", href:"/fairway-elite",    badge:"LIVE" },
  { gender:"Women's", sport:"Hockey",       img:"/landing/IMG_2060.JPG", href:"/hockey",           badge:"LIVE" },
  { gender:"Women's", sport:"Rugby",        img:"/landing/IMG_2057.JPG", href:"/rugby-elite",      badge:"LIVE" },
  { gender:"Women's", sport:"Wrestling",    img:"/landing/IMG_2050.JPG", href:"/warriors-playbook",badge:"HOT"  },
  { gender:"Women's", sport:"Boxing",       img:"/landing/IMG_2065.JPG", href:"/boxing",           badge:"LIVE" },
  { gender:"Women's", sport:"MMA",          img:"/landing/IMG_2066.JPG", href:"/mma",              badge:"LIVE" },
  { gender:"Women's", sport:"Football",     img:"/sports/football.png", href:"/gridiron-nexus",   badge:"LIVE" },
  { gender:"Women's", sport:"Baseball",     img:"/landing/IMG_2047.JPG", href:"/diamond-grind",    badge:"NEW"  },
  { gender:"Women's", sport:"Cycling",      img:"/landing/IMG_2063.JPG", href:"/cycling",          badge:"LIVE" },
];

//  Platform Features 
const FEATURES = [
  {
    icon: "",
    name: "EPX™",
    tagline: "STOP WAITING TO BE DISCOVERED.",
    desc: "Your EPX score (0–100) is your AI-powered athlete rating — built from combine metrics, game film, stats, recruiting interest, and intangibles. It grows as you perform. 90–100 is Elite Pro Prospect. Coaches see it. Brands pay for it.",
    cta: "Get Your EPX Score",
    href: "/epx",
    color: "#0066ff",
  },
  {
    icon: "",
    name: "C-Factor Hub™",
    tagline: "THE OPERATING SYSTEM OF YOUR SPORTS LIFE.",
    desc: "C-Factor is your daily command center — NIL opportunities, recruiting pulse, today's agenda, film room, podcast, vendor marketplace, and your complete athlete intelligence dashboard. Everything you need to manage your career in one place. Mobile-first. Built for champions.",
    cta: "Open C-Factor Hub",
    href: "/cfactor",
    color: "#00c2ff",
  },
  {
    icon: "",
    name: "NIL Portal™",
    tagline: "YOUR NAME. YOUR BRAND. YOUR MONEY.",
    desc: "Connect directly with brands, negotiate deals, sign contracts, and track your NIL income — all inside AthlynXAI. No agents required. No middlemen. From local car dealerships to national sponsorships. Your NIL value grows with your EPX score.",
    cta: "Open NIL Portal",
    href: "/nil-portal",
    color: "#0066ff",
  },
  {
    icon: "",
    name: "Transfer Portal™",
    tagline: "FIND YOUR NEXT SCHOOL. LEVEL UP.",
    desc: "The AthlynXAI Transfer Portal guides athletes from smaller programs to bigger opportunities. Build your profile, get discovered by D1 coaches, compare scholarship offers, and make the move that maximizes your NIL value. The journey from small school to big stage starts here.",
    cta: "Enter Transfer Portal",
    href: "/transfer-portal",
    color: "#00c2ff",
  },
  {
    icon: "",
    name: "Diamond Grind™",
    tagline: "ELITE BASEBALL. BUILT DIFFERENT.",
    desc: "Programs, Stats, Tracker, Leaderboard, and AI Coach — all purpose-built for baseball and softball athletes. Velocity tracking, exit velocity, fielding metrics, showcase prep for Perfect Game and Area Code. The most complete baseball platform ever built.",
    cta: "Enter Diamond Grind",
    href: "/diamond-grind",
    color: "#0066ff",
  },
  {
    icon: "",
    name: "Warriors Playbook™",
    tagline: "PLAYS. FILM. STRATEGY. AI COACH.",
    desc: "The complete football intelligence platform — playbook library, film study, team management, and an AI coach that analyzes your film and gives you a personalized improvement plan. For players, coaches, and programs at every level.",
    cta: "Open Warriors Playbook",
    href: "/warriors-playbook",
    color: "#00c2ff",
  },
];

const CHAMPIONSHIP_SPOTLIGHTS = [
  {
    title: "Road To Omaha",
    eyebrow: "Men's College World Series · LIVE NOW · ESPN",
    desc: "8 teams. 1 champion. Charles Schwab Field, Omaha, Nebraska. June 13–22, 2026. Georgia, North Carolina, West Virginia, Ole Miss, Texas, Oklahoma, Alabama, and Troy battle for the national title. Watch on ESPN, Apple TV, Amazon Prime, and Apple Sports. The Greatest Show on Grass.",
    accent: "#00c2ff",
    href: "/brackets",
  },
  {
    title: "🏆 Texas Back-to-Back",
    eyebrow: "WCWS Champions · 2025 & 2026 · Congratulations",
    desc: "CONGRATULATIONS to the Texas Longhorns — BACK-TO-BACK Women's College World Series National Champions! Texas swept Texas Tech in the 2026 WCWS Finals. Back-to-back MOP Teagan Kavan. Hook 'Em Horns. The legacy is built. 🤘",
    accent: "#BF5700",
    href: "/diamond-grind",
  },
  {
    title: "Diamond Grind™",
    eyebrow: "Baseball & Softball · AI Training Platform",
    desc: "The most complete baseball and softball platform ever built. Velocity tracking, exit velocity, fielding metrics, AI coach, showcase prep for Perfect Game and Area Code. Built for every level — youth to pro.",
    accent: "#0066ff",
    href: "/diamond-grind",
  },
];

// 2026 CWS — 8 teams in Omaha, June 13-22
const CWS_TEAMS = [
  { seed: 3,  name: "Georgia",        record: "51-12",   bracket: "B2", conference: "SEC",      color: "#BA0C2F" },
  { seed: 5,  name: "North Carolina", record: "50-12-1", bracket: "B1", conference: "ACC",      color: "#7BAFD4" },
  { seed: 16, name: "West Virginia",  record: "45-15",   bracket: "B1", conference: "Big 12",   color: "#002855" },
  { seed: null, name: "Ole Miss",     record: "41-21",   bracket: "B1", conference: "SEC",      color: "#CE1126" },
  { seed: 6,  name: "Texas",          record: "45-13",   bracket: "B2", conference: "SEC",      color: "#BF5700" },
  { seed: null, name: "Oklahoma",     record: "37-22",   bracket: "B2", conference: "SEC",      color: "#841617" },
  { seed: 7,  name: "Alabama",        record: "41-19",   bracket: "B2", conference: "SEC",      color: "#9E1B32" },
  { seed: null, name: "Troy",         record: "38-30",   bracket: "B1", conference: "Sun Belt", color: "#8B0000" },
];

const CWS_MATCHUPS = [
  { game: 1, bracket: "B1", team1: "West Virginia", team2: "Troy",          date: "Fri Jun 13", time: "1:00 PM CT",  network: "ESPN" },
  { game: 2, bracket: "B1", team1: "North Carolina", team2: "Ole Miss",     date: "Fri Jun 13", time: "6:00 PM CT",  network: "ESPN" },
  { game: 3, bracket: "B2", team1: "Alabama",        team2: "Oklahoma",     date: "Sat Jun 14", time: "2:00 PM CT",  network: "ESPN" },
  { game: 4, bracket: "B2", team1: "Georgia",        team2: "Texas",        date: "Sat Jun 14", time: "7:00 PM CT",  network: "ESPN" },
];

//  Sport Card Component 
function SportCard({ sport, gender, img, href, badge, size = "md" }: {
  sport: string; gender: string; img: string; href: string; badge: string; size?: "lg" | "md" | "sm";
}) {
  const h = size === "lg" ? "h-80" : size === "sm" ? "h-40" : "h-56";
  const textSize = size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-xl";
  return (
    <Link href={href}>
      <div className={`relative ${h} rounded-2xl overflow-hidden cursor-pointer group hover:scale-[1.02] transition-all duration-300`}>
        <img src={img} alt={`${gender} ${sport}`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050d1a]/90 via-[#050d1a]/20 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-[#0066ff] text-white text-xs font-black px-2 py-1 rounded-full tracking-wider">{badge}</span>
          <span className="bg-white/10 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded-full">{gender}</span>
        </div>
        <div className="absolute bottom-0 left-0 p-4">
          <p className={`text-white font-black ${textSize} leading-tight drop-shadow-lg`}>{sport}</p>
        </div>
      </div>
    </Link>
  );
}

//  Screen Mockup Component 
function ScreenMockup({ title, badge, img, href, color }: {
  title: string; badge: string; img: string; href: string; color: string;
}) {
  return (
    <Link href={href}>
      <div className="w-56 h-[440px] rounded-[2.5rem] border-2 border-[#0066ff]/40 shadow-2xl overflow-hidden cursor-pointer hover:border-[#00c2ff] hover:scale-[1.02] transition-all duration-300 flex-shrink-0 bg-[#050d1a] relative group">
        <img src={img} alt={title} className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050d1a]/80 via-transparent to-transparent" />
        <div className="absolute top-3 right-3">
          <span className="text-xs font-black px-2 py-1 rounded-full" style={{ backgroundColor: color, color: '#fff' }}>{badge}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white font-black text-sm">{title}</p>
          <p className="text-[#8ba3c7] text-xs">athlynx.ai →</p>
        </div>
      </div>
    </Link>
  );
}

//  Main Landing Page 
function LandingPageInner() {
  const [genderFilter, setGenderFilter] = useState<"All" | "Men's" | "Women's">("All");
  const [headline, setHeadline] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const headlines = [
    "EVERY ATHLETE. EVERY SPORT.",
    "NIL DEALS. TRANSFER PORTAL.",
    "X-FACTOR. C-FACTOR.",
    "MEN'S. WOMEN'S. ALL LEVELS.",
    "YOUR CAREER. YOUR PLATFORM.",
  ];

  useEffect(() => {
    const t = setInterval(() => setHeadline(h => (h + 1) % headlines.length), 3000);
    return () => clearInterval(t);
  }, []);

  const filteredSports = SPORTS.filter(s => genderFilter === "All" || s.gender === genderFilter);

  return (
    <div className="min-h-screen bg-[#050d1a] text-white overflow-x-hidden" style={{ fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif" }}>

      {/*  BETA ANNOUNCEMENT BANNER  */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-[#0066ff] via-[#0044cc] to-[#00c2ff] text-white text-center py-2 px-4 text-xs font-bold tracking-widest uppercase">
        <span className="inline-flex items-center gap-2">
          <span className="animate-pulse w-2 h-2 rounded-full bg-white inline-block"></span>
          Beta Testing Now Open — Full Platform Launch July 1, 2026
          <span className="mx-3 opacity-50">|</span>
          <Link href="/investor-hub"><span className="underline underline-offset-2 hover:text-white/80 cursor-pointer">Investor Access →</span></Link>
        </span>
      </div>

      {/*  NAV  */}
      <nav className="fixed top-8 left-0 right-0 z-50 bg-[#050d1a]/95 backdrop-blur-xl border-b border-[#0066ff]/20">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src="/brand/athlynx-watermark.PNG" alt="AthlynXAI" className="w-9 h-9 rounded-xl" onError={e => (e.currentTarget.style.display = 'none')} />
              <div>
                <span className="text-white font-black text-lg tracking-tight">AthlynXAI</span>
                <span className="ml-2 text-[#0066ff] text-xs font-bold">™</span>
              </div>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#8ba3c7]">
            <Link href="/epx"><span className="hover:text-white transition-colors cursor-pointer">EPX</span></Link>
            <Link href="/cfactor"><span className="hover:text-white transition-colors cursor-pointer">C-Factor</span></Link>
            <Link href="/nil-portal"><span className="hover:text-white transition-colors cursor-pointer">NIL Portal</span></Link>
            <Link href="/diamond-grind"><span className="hover:text-white transition-colors cursor-pointer">Diamond Grind</span></Link>
            <Link href="/investor-hub"><span className="hover:text-white text-[#00c2ff] transition-colors cursor-pointer font-black">Investors</span></Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/signin">
              <button className="text-[#8ba3c7] hover:text-white text-sm font-semibold px-4 py-2 transition-colors hidden sm:block">Sign In</button>
            </Link>
            <Link href="/signup">
              <button className="bg-[#0066ff] hover:bg-[#0052cc] text-white font-black text-sm px-5 py-2 rounded-full transition-all hover:scale-105 shadow-lg shadow-[#0066ff]/30">
                Join Free
              </button>
            </Link>
            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-2 ml-1"
              onClick={() => setMobileMenuOpen(o => !o)}
              aria-label="Menu"
            >
              <span className={`block w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#050d1a]/98 border-t border-[#0066ff]/20 px-5 py-4 flex flex-col gap-4 text-sm font-semibold text-[#8ba3c7]">
            <Link href="/epx" onClick={() => setMobileMenuOpen(false)}><span className="block hover:text-white py-1">EPX</span></Link>
            <Link href="/cfactor" onClick={() => setMobileMenuOpen(false)}><span className="block hover:text-white py-1">C-Factor</span></Link>
            <Link href="/nil-portal" onClick={() => setMobileMenuOpen(false)}><span className="block hover:text-white py-1">NIL Portal</span></Link>
            <Link href="/diamond-grind" onClick={() => setMobileMenuOpen(false)}><span className="block hover:text-white py-1">Diamond Grind</span></Link>
            <Link href="/investor-hub" onClick={() => setMobileMenuOpen(false)}><span className="block text-[#00c2ff] font-black py-1">Investors</span></Link>
            <Link href="/signin" onClick={() => setMobileMenuOpen(false)}><span className="block hover:text-white py-1">Sign In</span></Link>
          </div>
        )}
      </nav>

      {/*  HERO VIDEO BANNER  */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden">
        {/* Video background */}
        <video
          ref={videoRef}
          src={HERO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050d1a]/60 via-[#050d1a]/40 to-[#050d1a]" />
        {/* Blue glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,102,255,0.08),transparent_70%)]" />

        <div className="relative z-10 text-center max-w-5xl mx-auto px-5 py-20">
                    {/* AthlynX — the star. The brand. The belief. */}
          <div className="inline-flex items-center gap-2 bg-[#0066ff]/10 border border-[#0066ff]/30 rounded-full px-5 py-2 mb-8">
            <span className="w-2 h-2 bg-[#00c2ff] rounded-full animate-pulse" />
            <span className="text-sm font-bold text-[#00c2ff] tracking-wider">ATHLYNXAI OS · THE NETWORK · LIVE NOW</span>
          </div>
          {/* Main headline — AthlynX is the name they need to know */}
          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black leading-none tracking-tighter mb-6">
            <span className="text-white">AthlynX</span>
            <span className="text-[#0066ff]">AI</span>
          </h1>
          {/* The belief — not features, not specs */}
          <div className="mb-8 max-w-3xl mx-auto">
            <p className="text-2xl sm:text-4xl font-black text-white leading-tight mb-4">
              The athletes crazy enough to think<br />they can change the world<br />
              <span className="text-[#0066ff]">are the ones who actually do.</span>
            </p>
            <p className="text-base sm:text-lg text-[#8ba3c7] leading-relaxed mb-2">
              AthlynX is not an app. It is a belief — that every athlete, at every level,
              from youth to pro to retirement, deserves the same intelligence,
              the same tools, and the same opportunity.
            </p>
            <p className="text-base font-black text-white tracking-wide">IQ before talent. Men. Women. Every sport. Fair. Balanced. Real. 24/7/365.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/portal">
              <button className="bg-[#0066ff] hover:bg-[#0052cc] text-white font-black text-xl px-12 py-5 rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-[#0066ff]/40">
                ENTER THE PLATFORM →
              </button>
            </Link>
            <Link href="/signup">
              <button className="bg-white/5 hover:bg-white/10 text-white font-bold text-xl px-12 py-5 rounded-2xl border border-white/20 transition-all">
                START FREE — 7 DAYS
              </button>
            </Link>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { n: "44", l: "Sports Covered" },
              { n: "213+", l: "Platform Features" },
              { n: "4", l: "AI Engines" },
              { n: "$135B", l: "Market Opportunity" },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur">
                <p className="text-white font-black text-2xl">{s.n}</p>
                <p className="text-[#8ba3c7] text-xs font-semibold mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE HIGHLIGHTS — 4 clean cards, each to their own page */}
      <section className="relative bg-[#020713] px-5 py-16">
        <div className="relative z-10 mx-auto max-w-7xl">

          {/* Section header */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <p className="text-xs font-black uppercase tracking-[0.34em] text-red-400">AXN · AthlynX Network · Live Now</p>
            </div>
            <h2 className="text-4xl font-black text-white">What’s Live Right Now</h2>
          </div>

          {/* 4 highlight cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {/* 1 — MCWS */}
            <Link href="/brackets">
              <div className="group relative h-72 rounded-[2rem] overflow-hidden cursor-pointer border border-[#00c2ff]/20 hover:border-[#00c2ff]/60 transition-all hover:scale-[1.02]">
                <img src="/landing/IMG_7116.PNG" alt="Men's College World Series" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020713] via-[#020713]/50 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="flex items-center gap-1.5 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />LIVE
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#00c2ff] mb-1">Men’s College World Series</p>
                  <h3 className="text-xl font-black text-white leading-tight mb-3">Road to Omaha</h3>
                  <span className="inline-block bg-[#00c2ff] text-[#050d1a] text-xs font-black px-4 py-1.5 rounded-xl group-hover:bg-white transition-colors">Full Bracket →</span>
                </div>
              </div>
            </Link>

            {/* 2 — FIFA */}
            <Link href="/world-cup">
              <div className="group relative h-72 rounded-[2rem] overflow-hidden cursor-pointer border border-[#00c2ff]/20 hover:border-[#00c2ff]/60 transition-all hover:scale-[1.02]">
                <img src="/landing/IMG_7119.PNG" alt="FIFA World Cup 2026" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020713] via-[#020713]/50 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="flex items-center gap-1.5 bg-[#0066ff] text-white text-[10px] font-black px-2.5 py-1 rounded-full tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />LIVE
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#00c2ff] mb-1">FIFA World Cup 2026</p>
                  <h3 className="text-xl font-black text-white leading-tight mb-3">USA · Mexico · Canada</h3>
                  <span className="inline-block bg-[#0066ff] text-white text-xs font-black px-4 py-1.5 rounded-xl group-hover:bg-[#00c2ff] group-hover:text-[#050d1a] transition-colors">World Cup Coverage →</span>
                </div>
              </div>
            </Link>

            {/* 3 — NBA Finals */}
            <Link href="/court-kings">
              <div className="group relative h-72 rounded-[2rem] overflow-hidden cursor-pointer border border-[#00c2ff]/20 hover:border-[#00c2ff]/60 transition-all hover:scale-[1.02]">
                <img src="/landing/IMG_7115.PNG" alt="NBA Finals 2026" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020713] via-[#020713]/50 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="flex items-center gap-1.5 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />TONIGHT
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#00c2ff] mb-1">NBA Finals · Game 5 · 8:30 PM ET</p>
                  <h3 className="text-xl font-black text-white leading-tight mb-3">Knicks vs Spurs</h3>
                  <span className="inline-block bg-white/10 border border-white/20 text-white text-xs font-black px-4 py-1.5 rounded-xl group-hover:bg-[#00c2ff] group-hover:text-[#050d1a] group-hover:border-[#00c2ff] transition-colors">NBA Coverage →</span>
                </div>
              </div>
            </Link>

            {/* 4 — Diamond Grind */}
            <Link href="/diamond-grind">
              <div className="group relative h-72 rounded-[2rem] overflow-hidden cursor-pointer border border-[#0066ff]/20 hover:border-[#00c2ff]/60 transition-all hover:scale-[1.02]">
                <img src="/brand/baseball_watermark.png" alt="Diamond Grind" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020713] via-[#020713]/60 to-[#020713]/20" />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#0066ff] text-white text-[10px] font-black px-2.5 py-1 rounded-full tracking-widest">PLATFORM</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#00c2ff] mb-1">Diamond Grind™</p>
                  <h3 className="text-xl font-black text-white leading-tight mb-3">Elite Baseball. Built Different.</h3>
                  <span className="inline-block bg-[#0066ff] text-white text-xs font-black px-4 py-1.5 rounded-xl group-hover:bg-[#00c2ff] group-hover:text-[#050d1a] transition-colors">Enter Diamond Grind →</span>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>


      {/*  AthlynX ECOSYSTEM BRAND WALL  */}
      <section className="relative overflow-hidden bg-[#020713] px-5 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(0,194,255,0.18),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(0,102,255,0.24),transparent_35%)]" />
        <div className="absolute -right-24 top-10 h-80 w-80 rounded-full border border-[#00c2ff]/20 bg-[#0066ff]/10 blur-2xl" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="mb-4 text-sm font-black uppercase tracking-[0.32em] text-[#00c2ff]">Branded Ecosystem View</p>
              <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
                AthlynX · AthlynXAI · AXN · AVN
              </h2>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#8ba3c7]">
                This is the new brand stack: AthlynX as the athlete OS, AthlynXAI as the intelligence layer, AXN as the athlete network, and AVN as the video and vision layer. The look stays dark, cinematic, watermark-driven, and built to stand out on mobile.
              </p>
            </div>
            <div className="rounded-[2rem] border border-[#00c2ff]/25 bg-white/[0.03] p-5 shadow-2xl shadow-[#0066ff]/20 backdrop-blur">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {ECOSYSTEM_LEGS.map((leg) => (
                  <div key={leg.code} className="rounded-2xl border border-white/10 bg-[#07152a]/80 p-4">
                    <p className="text-xl font-black text-white">{leg.code}</p>
                    <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-[#00c2ff]">{leg.title}</p>
                    <p className="mt-3 text-xs leading-relaxed text-[#8ba3c7]">{leg.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {ECOSYSTEM_IMAGES.map((asset) => (
              <article key={asset.src} className="group relative min-h-[360px] overflow-hidden rounded-[2rem] border border-[#0066ff]/25 bg-[#050d1a] shadow-2xl shadow-black/40">
                <img src={asset.src} alt={asset.title} className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020713] via-[#020713]/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-4xl font-black tracking-tight text-white drop-shadow-2xl">{asset.title}</p>
                  <p className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-[#00c2ff]">{asset.subtitle}</p>
                </div>
                <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur">
                  Official Brand Lane
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/*  X-FACTOR & C-FACTOR HERO FEATURES  */}
      <section className="py-24 px-5 bg-[#050d1a]">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#0066ff] text-sm font-black uppercase tracking-[0.3em] text-center mb-3">AthlynXAI Originals</p>
          <h2 className="text-4xl lg:text-6xl font-black text-white text-center mb-4 tracking-tight">
            BUILT FOR THE <span className="text-[#00c2ff]">NEXT LEVEL</span>
          </h2>
          <p className="text-[#8ba3c7] text-center text-lg mb-16 max-w-2xl mx-auto">
            Two proprietary systems that no other platform has. Exclusively AthlynXAI.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            {FEATURES.slice(0, 2).map((f, i) => (
              <Link key={i} href={f.href}>
                <div className="bg-gradient-to-br from-[#0a1628] to-[#050d1a] border border-[#0066ff]/20 rounded-3xl p-8 hover:border-[#00c2ff]/60 transition-all cursor-pointer group">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-4xl">{f.icon}</span>
                    <div>
                      <p className="text-[#00c2ff] text-xs font-black tracking-[0.3em] uppercase mb-1">{f.tagline}</p>
                      <h3 className="text-white font-black text-2xl group-hover:text-[#00c2ff] transition-colors">{f.name}</h3>
                    </div>
                  </div>
                  <p className="text-[#8ba3c7] text-sm leading-relaxed mb-6">{f.desc}</p>
                  <div className="flex items-center gap-2 text-[#0066ff] font-bold text-sm group-hover:gap-4 transition-all">
                    <span>{f.cta}</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Remaining 4 features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.slice(2).map((f, i) => (
              <Link key={i} href={f.href}>
                <div className="bg-[#0a1628] border border-[#0066ff]/15 rounded-2xl p-6 hover:border-[#0066ff]/50 transition-all cursor-pointer group">
                  <span className="text-3xl mb-3 block">{f.icon}</span>
                  <h3 className="text-white font-black text-lg mb-2 group-hover:text-[#00c2ff] transition-colors">{f.name}</h3>
                  <p className="text-[#8ba3c7] text-xs leading-relaxed mb-4 line-clamp-3">{f.desc}</p>
                  <span className="text-[#0066ff] text-xs font-bold">Open →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/*  PLATFORM SCREENS  */}
      <section className="py-24 px-5 bg-[#030810]">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#0066ff] text-sm font-black uppercase tracking-[0.3em] text-center mb-3">The Full Platform</p>
          <h2 className="text-4xl lg:text-6xl font-black text-white text-center mb-4 tracking-tight">
            EVERY SCREEN. <span className="text-[#00c2ff]">LIVE.</span>
          </h2>
          <p className="text-[#8ba3c7] text-center text-lg mb-16 max-w-2xl mx-auto">
            This is what you get when you log in. Built from scratch. 100% original. Zero compromises.
          </p>
          <div className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
            {[
              { title:"The Feed",        badge:"LIVE",  img:SCREENS.feed,      href:"/portal",          color:"#22c55e" },
              { title:"EPX™",       badge:"HOT",   img:SCREENS.epx,   href:"/epx",        color:"#0066ff" },
              { title:"C-Factor Hub™",   badge:"NEW",   img:SCREENS.cfactor,   href:"/cfactor",         color:"#00c2ff" },
              { title:"Diamond Grind™",  badge:"NEW",   img:SCREENS.diamond,   href:"/diamond-grind",   color:"#0066ff" },
              { title:"NIL Messenger™",  badge:"LIVE",  img:SCREENS.messenger, href:"/messenger",       color:"#22c55e" },
              { title:"Athlete Calendar",badge:"LIVE",  img:SCREENS.calendar,  href:"/athlete-calendar",color:"#22c55e" },
              { title:"Rankings Hub™",   badge:"NEW",   img:SCREENS.rankings,  href:"/rankings-hub",    color:"#0066ff" },
              { title:"NIL Portal™",     badge:"LIVE",  img:SCREENS.nilportal, href:"/nil-portal",      color:"#22c55e" },
              { title:"Transfer Portal™",badge:"LIVE",  img:SCREENS.transfer,  href:"/transfer-portal", color:"#22c55e" },
              { title:"Warriors Playbook",badge:"HOT",  img:SCREENS.warriors,  href:"/warriors-playbook",color:"#ef4444" },
              { title:"Athlete Profile™",badge:"LIVE",  img:SCREENS.profile,   href:"/profile",         color:"#22c55e" },
              { title:"Recruiting Hub™", badge:"HOT",   img:SCREENS.recruiting,href:"/recruiting-hub",  color:"#0066ff" },
            ].map((s, i) => (
              <div key={i} className="snap-center flex-shrink-0 flex flex-col items-center gap-3">
                <ScreenMockup {...s} />
                <p className="text-[#8ba3c7] text-xs font-bold text-center">{s.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  MEN'S & WOMEN'S SPORTS  */}
      <section className="py-24 px-5 bg-[#050d1a]">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#0066ff] text-sm font-black uppercase tracking-[0.3em] text-center mb-3">Every Sport. Every Level.</p>
          <h2 className="text-4xl lg:text-6xl font-black text-white text-center mb-4 tracking-tight">
            MEN'S <span className="text-[#00c2ff]">&</span> WOMEN'S
          </h2>
          <p className="text-[#8ba3c7] text-center text-lg mb-10 max-w-2xl mx-auto">
            44 sports. Both genders. Youth through Pro. AthlynXAI covers every athlete at every level.
          </p>

          {/* Gender filter */}
          <div className="flex justify-center gap-3 mb-12">
            {(["All", "Men's", "Women's"] as const).map(g => (
              <button
                key={g}
                onClick={() => setGenderFilter(g)}
                className={`px-8 py-3 rounded-full font-black text-sm transition-all ${
                  genderFilter === g
                    ? "bg-[#0066ff] text-white shadow-lg shadow-[#0066ff]/30"
                    : "bg-white/5 text-[#8ba3c7] border border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Sport grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredSports.map((s, i) => (
              <SportCard key={i} {...s} size={i < 2 ? "lg" : i < 6 ? "md" : "sm"} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/portal">
              <button className="bg-[#0066ff] hover:bg-[#0052cc] text-white font-black text-xl px-14 py-5 rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-[#0066ff]/40">
                ENTER THE FULL PLATFORM →
              </button>
            </Link>
            <p className="text-[#8ba3c7] text-sm mt-3">athlynx.ai · All 44 Sports · Men's & Women's · Free 7-Day Trial</p>
          </div>
        </div>
      </section>

      {/*  ATHLYNXAI OS NETWORK BROADCAST SHOWCASE  */}
      <section className="relative overflow-hidden bg-[#020713] px-5 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,194,255,0.12),transparent_50%)]" />
        <div className="absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#00c2ff] to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#00c2ff]/10 border border-[#00c2ff]/30 rounded-full px-5 py-2 mb-6">
              <span className="w-2 h-2 bg-[#00c2ff] rounded-full animate-pulse" />
              <span className="text-[#00c2ff] text-xs font-black tracking-[0.3em] uppercase">AthlynXAI OS Network · Live 24/7/365</span>
            </div>
            <h2 className="text-4xl lg:text-7xl font-black text-white tracking-tight mb-4">
              THE NETWORK THAT <span className="text-[#00c2ff]">NEVER SLEEPS</span>
            </h2>
            <p className="text-[#8ba3c7] text-lg max-w-3xl mx-auto">
              Real scores. Real brackets. Real athletes. Real weather. Nothing fake. Right down the middle.
              AthlynXAI OS is your sports network — all day, all night, every season.
            </p>
          </div>

          {/* 3 Network Pillars */}
          <div className="grid gap-6 lg:grid-cols-3 mb-12">

            {/* Pillar 1: Landing / Network Home */}
            <div className="rounded-[2rem] border border-[#0066ff]/30 bg-[#06142a]/90 p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#0066ff]/20 border border-[#0066ff]/30 flex items-center justify-center">
                  <span className="text-lg">🏠</span>
                </div>
                <div>
                  <p className="text-[9px] font-black tracking-widest uppercase text-[#0066ff]/60">Network Home</p>
                  <p className="text-sm font-black text-white">AthlynXAI OS</p>
                </div>
              </div>
              <p className="text-xs text-[#8ba3c7] leading-relaxed mb-4 flex-1">
                The front door of the network. Every sport. Every season. Live scores ticker, current champions, active tournaments, and your athlete dashboard — all in one place. Updates automatically as the sports calendar moves.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {["Live Score Ticker", "Season Calendar", "Champions Board", "Weather + Conditions"].map(f => (
                  <div key={f} className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0066ff]" />
                    <span className="text-[10px] font-bold text-white/70">{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/">
                <button className="w-full bg-[#0066ff]/10 hover:bg-[#0066ff]/20 border border-[#0066ff]/30 text-[#00c2ff] font-black text-xs py-2.5 rounded-xl transition-all tracking-widest uppercase">
                  Enter Network Home →
                </button>
              </Link>
            </div>

            {/* Pillar 2: Broadcast Room */}
            <div className="rounded-[2rem] border border-[#00c2ff]/40 bg-[#06142a]/90 p-6 flex flex-col shadow-2xl shadow-[#00c2ff]/10 relative">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1.5 bg-[#00c2ff]/10 border border-[#00c2ff]/30 rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 bg-[#00c2ff] rounded-full animate-pulse" />
                  <span className="text-[9px] font-black text-[#00c2ff] tracking-widest uppercase">Live</span>
                </span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#00c2ff]/20 border border-[#00c2ff]/30 flex items-center justify-center">
                  <span className="text-lg">📺</span>
                </div>
                <div>
                  <p className="text-[9px] font-black tracking-widest uppercase text-[#00c2ff]/60">Broadcast Room</p>
                  <p className="text-sm font-black text-white">MCWS Road to Omaha</p>
                </div>
              </div>
              <p className="text-xs text-[#8ba3c7] leading-relaxed mb-4 flex-1">
                The full sportscast experience. Live ESPN scores, interactive bracket, team broadcast cards with player spotlights, coach callouts, fan base culture, YouTube highlights, and podcast integration. Better than SportsCenter. Built for the next generation.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {["Live ESPN Scores", "Interactive Bracket", "Team Broadcast Cards", "Player Spotlights", "Coach Callouts", "Fan Base Culture", "Highlight Reels", "Podcast Network"].map(f => (
                  <div key={f} className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00c2ff]" />
                    <span className="text-[10px] font-bold text-white/70">{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/brackets">
                <button className="w-full bg-[#00c2ff] hover:bg-[#00a8e0] text-[#050d1a] font-black text-xs py-2.5 rounded-xl transition-all tracking-widest uppercase">
                  Open Broadcast Room → Live Now
                </button>
              </Link>
            </div>

            {/* Pillar 3: Diamond Grind */}
            <div className="rounded-[2rem] border border-[#0066ff]/30 bg-[#06142a]/90 p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#0066ff]/20 border border-[#0066ff]/30 flex items-center justify-center">
                  <span className="text-lg">⚾</span>
                </div>
                <div>
                  <p className="text-[9px] font-black tracking-widest uppercase text-[#0066ff]/60">Training Platform</p>
                  <p className="text-sm font-black text-white">Diamond Grind™</p>
                </div>
              </div>
              <p className="text-xs text-[#8ba3c7] leading-relaxed mb-4 flex-1">
                The broadcast feeds directly into the training platform. Watch a CWS player hit 112 mph exit velocity — then train for it. AI coach, velocity tracker, showcase prep, leaderboard. From tee-ball to the MLB draft. The cycle never stops.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {["AI Coach", "Velocity Tracker", "Exit Velocity", "Fielding Metrics", "Showcase Prep", "Leaderboard"].map(f => (
                  <div key={f} className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0066ff]" />
                    <span className="text-[10px] font-bold text-white/70">{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/diamond-grind">
                <button className="w-full bg-[#0066ff]/10 hover:bg-[#0066ff]/20 border border-[#0066ff]/30 text-[#00c2ff] font-black text-xs py-2.5 rounded-xl transition-all tracking-widest uppercase">
                  Enter Diamond Grind →
                </button>
              </Link>
            </div>
          </div>

          {/* Network Manifesto Banner */}
          <div className="rounded-[2rem] border border-[#00c2ff]/20 bg-gradient-to-r from-[#06142a] via-[#050d1a] to-[#06142a] p-8 text-center">
            <p className="text-[9px] font-black tracking-[0.4em] uppercase text-[#00c2ff]/50 mb-3">AthlynXAI OS · The Network Manifesto</p>
            <h3 className="text-2xl lg:text-4xl font-black text-white mb-3">
              "The people who are crazy enough to think they can change the world<br className="hidden lg:block" />
              <span className="text-[#00c2ff]"> are the ones who actually do."</span>
            </h3>
            <p className="text-[#8ba3c7] text-sm mb-6 max-w-2xl mx-auto">
              — Steve Jobs. That's every athlete who ever laced up. AthlynXAI OS exists for them. From youth to pro to retirement.
              Fair. Balanced. Real. 24/7/365.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/brackets">
                <button className="bg-[#00c2ff] hover:bg-[#00a8e0] text-[#050d1a] font-black text-sm px-8 py-3 rounded-xl transition-all hover:scale-105">
                  WATCH LIVE → MCWS BROADCAST
                </button>
              </Link>
              <Link href="/portal">
                <button className="bg-white/5 hover:bg-white/10 text-white font-bold text-sm px-8 py-3 rounded-xl border border-white/20 transition-all">
                  ENTER THE PLATFORM
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/*  SIGNUP  */}
      <section className="py-24 px-5 bg-[#030810]">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 bg-[#0066ff]/10 border border-[#0066ff]/30 rounded-full px-5 py-2">
              <span className="w-2 h-2 bg-[#00c2ff] rounded-full animate-pulse" />
              <span className="text-[#00c2ff] text-sm font-bold tracking-wider">FREE 7-DAY ACCESS — NOT CHARGED UNTIL DAY 8</span>
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white text-center mb-2 tracking-tight">
            JOIN <span className="text-[#0066ff]">AthlynXAI</span>
          </h2>
          <p className="text-[#8ba3c7] text-center mb-10">Thousands of athletes are already building their careers here.</p>

          <form
            onSubmit={e => {
              e.preventDefault();
              const f = new FormData(e.currentTarget as HTMLFormElement);
              window.location.href = `/signup?email=${encodeURIComponent(f.get('email') as string)}&firstName=${encodeURIComponent(f.get('firstName') as string)}&lastName=${encodeURIComponent(f.get('lastName') as string)}`;
            }}
            className="bg-[#0a1628] border border-[#0066ff]/20 rounded-3xl p-8 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#8ba3c7] text-xs font-bold mb-2 block uppercase tracking-wider">First Name *</label>
                <input name="firstName" type="text" required placeholder="Chad"
                  className="w-full bg-[#050d1a] border border-[#0066ff]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a6080] focus:outline-none focus:border-[#0066ff] transition-colors" />
              </div>
              <div>
                <label className="text-[#8ba3c7] text-xs font-bold mb-2 block uppercase tracking-wider">Last Name *</label>
                <input name="lastName" type="text" required placeholder="Dozier"
                  className="w-full bg-[#050d1a] border border-[#0066ff]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a6080] focus:outline-none focus:border-[#0066ff] transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-[#8ba3c7] text-xs font-bold mb-2 block uppercase tracking-wider">Email *</label>
              <input name="email" type="email" required placeholder="you@email.com"
                className="w-full bg-[#050d1a] border border-[#0066ff]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a6080] focus:outline-none focus:border-[#0066ff] transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#8ba3c7] text-xs font-bold mb-2 block uppercase tracking-wider">Sport(s)</label>
                <input name="sport" type="text" placeholder="Football, Baseball..."
                  className="w-full bg-[#050d1a] border border-[#0066ff]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a6080] focus:outline-none focus:border-[#0066ff] transition-colors" />
              </div>
              <div>
                <label className="text-[#8ba3c7] text-xs font-bold mb-2 block uppercase tracking-wider">School / Team</label>
                <input name="school" type="text" placeholder="LSU, Houston Texans..."
                  className="w-full bg-[#050d1a] border border-[#0066ff]/20 rounded-xl px-4 py-3 text-white placeholder-[#4a6080] focus:outline-none focus:border-[#0066ff] transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-[#8ba3c7] text-xs font-bold mb-2 block uppercase tracking-wider">I Am A...</label>
              <select name="role" className="w-full bg-[#050d1a] border border-[#0066ff]/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#0066ff] transition-colors">
                {["Athlete", "Parent", "Coach", "Brand / Sponsor", "Agent", "Investor"].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <button type="submit"
              className="w-full bg-[#0066ff] hover:bg-[#0052cc] text-white font-black text-lg py-4 rounded-xl transition-all hover:scale-[1.02] shadow-xl shadow-[#0066ff]/30">
              JOIN FREE — START MY 7 DAYS →
            </button>
            <p className="text-center text-[#4a6080] text-xs">Credit card required · Not charged until day 8 · Cancel anytime</p>
          </form>
        </div>
      </section>

      {/*  FOOTER  */}
      <footer className="bg-[#030810] border-t border-[#0066ff]/10 py-12 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <img src="/athlynx-icon.png" alt="AthlynXAI" className="w-10 h-10 rounded-xl" onError={e => (e.currentTarget.style.display = 'none')} />
              <div>
                <p className="font-black text-lg text-white">AthlynXAI<span className="text-[#0066ff]">™</span></p>
                <p className="text-[#4a6080] text-xs">The Athlete's Playbook</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-[#4a6080]">
              <a href="https://athlynx.ai" className="hover:text-white transition-colors">athlynx.ai</a>
              <a href="https://dozierholdingsgroup.com" className="hover:text-white transition-colors">dozierholdingsgroup.com</a>
              <a href="https://nilportals.com" className="hover:text-white transition-colors">nilportals.com</a>
            </div>
          </div>
          <div className="border-t border-[#0066ff]/10 pt-6 text-center text-[#4a6080] text-xs space-y-1">
            <p>© 2026 AthlynXAI Corporation · A Dozier Holdings Group Company · Houston, TX · EIN 42-2183569</p>
            <p>Iron Sharpens Iron — Proverbs 27:17 · Founded November 2024 · Chad A. Dozier Sr. & Glenn Tse</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function LandingPage() {
  return <RouteErrorBoundary><LandingPageInner /></RouteErrorBoundary>;
}
