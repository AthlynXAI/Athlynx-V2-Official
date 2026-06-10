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
  feed:       "/landing/IMG_7176.PNG",
  diamond:    "/landing/IMG_7148.PNG",
  messenger:  "/landing/IMG_7147.PNG",
  epx:    "/landing/IMG_7120.PNG",
  cfactor:    "/landing/IMG_7134.PNG",
  calendar:   "/landing/IMG_7136.PNG",
  rankings:   "/landing/IMG_7135.PNG",
  nilportal:  "/landing/IMG_7115.PNG",
  transfer:   "/landing/IMG_7116.PNG",
  warriors:   "/landing/IMG_7119.PNG",
  profile:    "/landing/IMG_7178.PNG",
  recruiting: "/landing/IMG_7118.PNG",
  screen1:    "/landing/IMG_7153.PNG",
  screen2:    "/landing/IMG_7177.PNG",
};

const ECOSYSTEM_IMAGES = [
  {
    src: "/landing/ecosystem/athlynxai-source-based-cover.png",
    title: "AthlynXAI",
    subtitle: "Recruiting · NIL · Brand tools for the modern athlete",
  },
  {
    src: "/landing/ecosystem/athlynx-team-walkout.png",
    title: "AthlynX",
    subtitle: "Parent athlete OS and sports identity layer",
  },
  {
    src: "/landing/ecosystem/athlynxai-playbook-team.png",
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
  { gender:"Men's", sport:"Basketball",   img:"/landing/IMG_4073.PNG", href:"/court-kings",      badge:"LIVE" },
  { gender:"Men's", sport:"Baseball",     img:"/landing/IMG_4074.PNG", href:"/diamond-grind",    badge:"NEW"  },
  { gender:"Men's", sport:"Soccer",       img:"/landing/IMG_4075.PNG", href:"/pitch-pulse",      badge:"LIVE" },
  { gender:"Men's", sport:"Track & Field",img:"/landing/IMG_4077.PNG", href:"/epx",         badge:"HOT"  },
  { gender:"Men's", sport:"Wrestling",    img:"/landing/IMG_4079.PNG", href:"/warriors-playbook",badge:"HOT"  },
  { gender:"Men's", sport:"Swimming",     img:"/landing/IMG_4080.PNG", href:"/swim-surge",       badge:"LIVE" },
  { gender:"Men's", sport:"Tennis",       img:"/landing/IMG_4081.PNG", href:"/racket-kings",     badge:"LIVE" },
  { gender:"Men's", sport:"Golf",         img:"/landing/IMG_4084.PNG", href:"/fairway-elite",    badge:"LIVE" },
  { gender:"Men's", sport:"Volleyball",   img:"/landing/IMG_4088.PNG", href:"/net-setters",      badge:"LIVE" },
  { gender:"Men's", sport:"Gymnastics",   img:"/landing/IMG_4089.PNG", href:"/gymnastics",       badge:"LIVE" },
  { gender:"Men's", sport:"Rugby",        img:"/landing/IMG_4090.PNG", href:"/rugby-elite",      badge:"LIVE" },
  { gender:"Men's", sport:"Lacrosse",     img:"/landing/IMG_4091.PNG", href:"/lacrosse",         badge:"LIVE" },
  { gender:"Men's", sport:"Hockey",       img:"/landing/IMG_4092.PNG", href:"/hockey",           badge:"LIVE" },
  { gender:"Men's", sport:"Softball",     img:"/landing/IMG_4093.PNG", href:"/softball-nation",  badge:"LIVE" },
  { gender:"Men's", sport:"Rowing",       img:"/landing/IMG_4094.PNG", href:"/rowing-elite",     badge:"LIVE" },
  { gender:"Men's", sport:"Cycling",      img:"/landing/IMG_4095.PNG", href:"/cycling",          badge:"LIVE" },
  { gender:"Men's", sport:"Boxing",       img:"/landing/IMG_4098.PNG", href:"/boxing",           badge:"LIVE" },
  { gender:"Men's", sport:"MMA",          img:"/landing/IMG_4099.PNG", href:"/mma",              badge:"LIVE" },
  // Women's
  { gender:"Women's", sport:"Basketball",   img:"/landing/IMG_4073.PNG", href:"/court-kings",      badge:"LIVE" },
  { gender:"Women's", sport:"Soccer",       img:"/landing/IMG_4075.PNG", href:"/pitch-pulse",      badge:"LIVE" },
  { gender:"Women's", sport:"Volleyball",   img:"/landing/IMG_4088.PNG", href:"/net-setters",      badge:"LIVE" },
  { gender:"Women's", sport:"Softball",     img:"/landing/IMG_4093.PNG", href:"/softball-nation",  badge:"LIVE" },
  { gender:"Women's", sport:"Gymnastics",   img:"/landing/IMG_4089.PNG", href:"/gymnastics",       badge:"LIVE" },
  { gender:"Women's", sport:"Track & Field",img:"/landing/IMG_4077.PNG", href:"/epx",         badge:"HOT"  },
  { gender:"Women's", sport:"Swimming",     img:"/landing/IMG_4080.PNG", href:"/swim-surge",       badge:"LIVE" },
  { gender:"Women's", sport:"Tennis",       img:"/landing/IMG_4081.PNG", href:"/racket-kings",     badge:"LIVE" },
  { gender:"Women's", sport:"Lacrosse",     img:"/landing/IMG_4091.PNG", href:"/lacrosse",         badge:"LIVE" },
  { gender:"Women's", sport:"Rowing",       img:"/landing/IMG_4094.PNG", href:"/rowing-elite",     badge:"LIVE" },
  { gender:"Women's", sport:"Golf",         img:"/landing/IMG_4084.PNG", href:"/fairway-elite",    badge:"LIVE" },
  { gender:"Women's", sport:"Hockey",       img:"/landing/IMG_4092.PNG", href:"/hockey",           badge:"LIVE" },
  { gender:"Women's", sport:"Rugby",        img:"/landing/IMG_4090.PNG", href:"/rugby-elite",      badge:"LIVE" },
  { gender:"Women's", sport:"Wrestling",    img:"/landing/IMG_4079.PNG", href:"/warriors-playbook",badge:"HOT"  },
  { gender:"Women's", sport:"Boxing",       img:"/landing/IMG_4098.PNG", href:"/boxing",           badge:"LIVE" },
  { gender:"Women's", sport:"MMA",          img:"/landing/IMG_4099.PNG", href:"/mma",              badge:"LIVE" },
  { gender:"Women's", sport:"Football",     img:"/sports/football.png", href:"/gridiron-nexus",   badge:"LIVE" },
  { gender:"Women's", sport:"Baseball",     img:"/landing/IMG_4074.PNG", href:"/diamond-grind",    badge:"NEW"  },
  { gender:"Women's", sport:"Cycling",      img:"/landing/IMG_4095.PNG", href:"/cycling",          badge:"LIVE" },
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
    eyebrow: "Men's College Baseball",
    desc: "The 2026 NCAA baseball field is set: 64 teams, 16 regionals, and one road to Omaha. Mississippi State hosts in Starkville, Southern Miss hosts in Hattiesburg, and Ole Miss heads to Lincoln.",
    accent: "#00c2ff",
  },
  {
    title: "Road To OKC",
    eyebrow: "Women's College Softball",
    desc: "Women's College Softball gets the same stage. Mississippi State made history by reaching its first-ever Women's College World Series, and the full field deserves national respect.",
    accent: "#ff4fd8",
  },
  {
    title: "Every Sport Counts",
    eyebrow: "Men's and Women's Championships",
    desc: "Football, basketball, baseball, softball, soccer, track, volleyball, tennis, golf, wrestling, swimming, lacrosse, and every athlete chasing a championship belong on the same platform.",
    accent: "#0066ff",
  },
];

const BASEBALL_REGIONALS = [
  { region: "Los Angeles", teams: ["UCLA", "Virginia Tech", "Cal Poly", "Saint Mary's (CA)"] },
  { region: "Atlanta", teams: ["Georgia Tech", "Oklahoma", "The Citadel", "UIC"] },
  { region: "Athens", teams: ["Georgia", "Boston College", "Liberty", "LIU"] },
  { region: "Auburn", teams: ["Auburn", "UCF", "NC State", "Milwaukee"] },
  { region: "Chapel Hill", teams: ["North Carolina", "Tennessee", "East Carolina", "VCU"] },
  { region: "Austin", teams: ["Texas", "UC Santa Barbara", "Tarleton State", "Holy Cross"] },
  { region: "Tuscaloosa", teams: ["Alabama", "Oklahoma State", "USC Upstate", "Alabama State"] },
  { region: "Gainesville", teams: ["Florida", "Miami (FL)", "Troy", "Rider"] },
  { region: "Hattiesburg", teams: ["Southern Miss", "Virginia", "Jacksonville State", "Little Rock"] },
  { region: "Tallahassee", teams: ["Florida State", "Coastal Carolina", "NIU", "St. John's (NY)"] },
  { region: "Eugene", teams: ["Oregon", "Oregon State", "Washington State", "Yale"] },
  { region: "College Station", teams: ["Texas A&M", "Southern California", "Texas State", "Lamar"] },
  { region: "Lincoln", teams: ["Nebraska", "Ole Miss", "Arizona State", "South Dakota State"] },
  { region: "Starkville", teams: ["Mississippi State", "Cincinnati", "Louisiana", "Lipscomb"] },
  { region: "Lawrence", teams: ["Kansas", "Arkansas", "Missouri State", "Northeastern"] },
  { region: "Morgantown", teams: ["West Virginia", "Wake Forest", "Kentucky", "Binghamton"] },
];

const NATIONAL_SEEDS = [
  "UCLA", "Georgia Tech", "Georgia", "Auburn", "North Carolina", "Texas", "Alabama", "Florida",
  "Southern Miss", "Florida State", "Oregon", "Texas A&M", "Nebraska", "Mississippi State", "Kansas", "West Virginia",
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

      {/*  NAV  */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050d1a]/95 backdrop-blur-xl border-b border-[#0066ff]/20">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src="/athlynx-icon.png" alt="AthlynXAI" className="w-9 h-9 rounded-xl" onError={e => (e.currentTarget.style.display = 'none')} />
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
          </div>
          <div className="flex items-center gap-3">
            <Link href="/signin">
              <button className="text-[#8ba3c7] hover:text-white text-sm font-semibold px-4 py-2 transition-colors">Sign In</button>
            </Link>
            <Link href="/signup">
              <button className="bg-[#0066ff] hover:bg-[#0052cc] text-white font-black text-sm px-6 py-2.5 rounded-full transition-all hover:scale-105 shadow-lg shadow-[#0066ff]/30">
                Join Free
              </button>
            </Link>
          </div>
        </div>
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
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-[#0066ff]/10 border border-[#0066ff]/30 rounded-full px-5 py-2 mb-8">
            <span className="w-2 h-2 bg-[#00c2ff] rounded-full animate-pulse" />
            <span className="text-sm font-bold text-[#00c2ff] tracking-wider">PLATFORM v1.0 · LIVE NOW · FREE 7-DAY TRIAL</span>
          </div>

          {/* Main headline */}
          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black leading-none tracking-tighter mb-4">
            <span className="text-white">AthlynX</span>
            <span className="text-[#0066ff]">AI</span>
          </h1>

          {/* Rotating subheadline */}
          <div className="h-12 mb-6 overflow-hidden">
            <p className="text-xl sm:text-2xl font-bold text-[#8ba3c7] tracking-wide">{headlines[headline]}</p>
          </div>

          <p className="text-lg text-[#8ba3c7] mb-10 max-w-2xl mx-auto leading-relaxed">
            The first and only complete athlete empowerment platform. NIL deals, transfer portal, AI recruiting, EPX scoring, C-Factor intelligence — all in one login. Built by athletes. Built for athletes.
          </p>

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

      {/*  CHAMPIONSHIP ROAD: ALL SPORTS SUPPORT  */}
      <section className="relative overflow-hidden bg-[#020713] px-5 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(0,194,255,0.20),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(255,79,216,0.16),transparent_30%),linear-gradient(135deg,rgba(0,102,255,0.10),transparent_55%)]" />
        <div className="absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#00c2ff] to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-12 overflow-hidden rounded-[2.25rem] border border-[#00c2ff]/30 bg-[#06142a]/90 shadow-2xl shadow-[#0066ff]/20">
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:p-10">
              <div>
                <p className="mb-4 text-sm font-black uppercase tracking-[0.34em] text-[#00c2ff]">Championship Spotlight</p>
                <h2 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-8xl">
                  Road To <span className="text-[#00c2ff]">Championships</span>
                </h2>
                <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#8ba3c7]">
                  This platform supports the full championship road: men, women, every sport, and every team that earned the right to keep playing. Road To Omaha gets the baseball spotlight, Road To OKC gets the softball spotlight, and every championship athlete gets respect.
                </p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-black/25 p-5 backdrop-blur">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff4fd8]">Mississippi State Women</p>
                <h3 className="mt-3 text-3xl font-black text-white">Women's College Softball History</h3>
                <p className="mt-4 text-sm leading-relaxed text-[#c9d8f2]">
                  Mississippi State softball made program history by reaching its first-ever Women's College World Series. That deserves a true championship-stage highlight right beside the men's baseball Road To Omaha coverage.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-12 grid gap-5 lg:grid-cols-3">
            {CHAMPIONSHIP_SPOTLIGHTS.map((item) => (
              <article key={item.title} className="rounded-[2rem] border border-white/10 bg-[#07152a]/80 p-6 shadow-xl shadow-black/30">
                <div className="mb-5 h-1.5 w-24 rounded-full" style={{ backgroundColor: item.accent }} />
                <p className="text-xs font-black uppercase tracking-[0.24em]" style={{ color: item.accent }}>{item.eyebrow}</p>
                <h3 className="mt-3 text-3xl font-black text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-[#8ba3c7]">{item.desc}</p>
              </article>
            ))}
          </div>

          <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-[2rem] border border-[#0066ff]/25 bg-[#050d1a]/90 p-6">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-[#00c2ff]">National Top 16 Seeds</p>
              <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {NATIONAL_SEEDS.map((team, index) => (
                  <div key={team} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0066ff] text-xs font-black text-white">{index + 1}</span>
                    <span className="text-sm font-bold text-white">{team}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#00c2ff]/20 bg-[#050d1a]/90 p-6">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.28em] text-[#00c2ff]">Road To Omaha</p>
                  <h3 className="text-3xl font-black text-white">2026 NCAA Baseball Field</h3>
                </div>
                <p className="text-sm font-bold text-[#8ba3c7]">64 teams · 16 regionals</p>
              </div>
              <div className="grid max-h-[560px] gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
                {BASEBALL_REGIONALS.map((regional) => (
                  <article key={regional.region} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <h4 className="mb-3 text-base font-black text-white">{regional.region} Regional</h4>
                    <div className="grid gap-2">
                      {regional.teams.map((team, index) => (
                        <div key={team} className="flex items-center gap-2 text-sm text-[#c9d8f2]">
                          <span className="text-xs font-black text-[#00c2ff]">{index + 1}</span>
                          <span>{team}</span>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
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
