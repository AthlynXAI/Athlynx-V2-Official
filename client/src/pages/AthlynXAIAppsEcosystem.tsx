// AthlynXAI — Complete Apps Ecosystem
// All 50+ apps with owl-mark watermarks, cobalt icons, logos, and direct links.
// Brand: cobalt #1E90FF + true black + white. BE THE LEGACY.

import { Link } from "wouter";

//  OWL MARK SVG WATERMARK 
function OwlMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="13" cy="18" r="8" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="27" cy="18" r="8" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="13" cy="18" r="3" fill="currentColor" />
      <circle cx="27" cy="18" r="3" fill="currentColor" />
      <path d="M10 10 L13 5 L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 10 L27 5 L30 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

//  APP DEFINITIONS 
interface AppDef {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  category: string;
  status: "LIVE" | "BETA" | "COMING SOON";
  route: string;
  description: string;
  features: string[];
  ios?: string;
  android?: string;
  isAI?: boolean;
  isFlagship?: boolean;
}

const APPS: AppDef[] = [
  //  FLAGSHIP 
  {
    id: "athlynx-main",
    name: "AthlynX",
    tagline: "The Athlete's Playbook",
    icon: "",
    category: "Flagship",
    status: "LIVE",
    route: "/",
    description: "The all-in-one platform. Profiles, recruiting, NIL, training, and AI tools.",
    features: ["Athlete Profiles", "AI Coaching", "NIL Marketplace", "Recruiting", "Messaging"],
    ios: "https://apps.apple.com/us/app/athlynx/id6742985965",
    android: "https://play.google.com/store/apps/details?id=ai.athlynx.app",
    isFlagship: true,
  },
  {
    id: "athlynxai-os",
    name: "AthlynXAI OS v1",
    tagline: "The Operating System",
    icon: "",
    category: "Flagship",
    status: "LIVE",
    route: "/athlynxai-os",
    description: "The first autonomous athlete OS. Nebius H200 powered. 1 man. 1 AI. $1B.",
    features: ["Connector Health", "AI Engine", "Cron Jobs", "API Gateway", "Ledger"],
    isFlagship: true,
    isAI: true,
  },
  {
    id: "athlynx-mobile",
    name: "AthlynX Mobile",
    tagline: "iOS & Android",
    icon: "",
    category: "Flagship",
    status: "LIVE",
    route: "/mobile-app",
    description: "Native iOS and Android app. Push notifications, offline mode, Stripe payments.",
    features: ["iOS App", "Android App", "Push Notifications", "Offline Mode", "Biometric Auth"],
    ios: "https://apps.apple.com/us/app/athlynx/id6742985965",
    android: "https://play.google.com/store/apps/details?id=ai.athlynx.app",
    isFlagship: true,
  },

  //  SPORTS BRANDS 
  {
    id: "diamond-grind",
    name: "Diamond Grind",
    tagline: "Elite Baseball Platform",
    icon: "",
    category: "Sports",
    status: "LIVE",
    route: "/diamond-grind",
    description: "The #1 baseball app for rankings, recruiting, tournaments, and training.",
    features: ["Player Rankings", "Tournament Finder", "Video Analysis", "Recruiting DB"],
    ios: "https://apps.apple.com/us/app/athlynx/id6742985965",
    android: "https://play.google.com/store/apps/details?id=ai.athlynx.app",
  },
  {
    id: "diamond-grind-iq",
    name: "Diamond Grind IQ",
    tagline: "Baseball Analytics",
    icon: "",
    category: "Sports",
    status: "LIVE",
    route: "/diamond-grind-iq",
    description: "Position-specific baseball analytics, pitch tracking, and arm health.",
    features: ["Pitch Tracking", "Arm Health", "Exit Velocity", "Spin Rate", "Film Room"],
    isAI: true,
  },
  {
    id: "gridiron-nexus",
    name: "Gridiron Nexus",
    tagline: "Football Excellence",
    icon: "",
    category: "Sports",
    status: "LIVE",
    route: "/gridiron-nexus",
    description: "Football recruiting, film analysis, and combine prep.",
    features: ["Prospect Rankings", "Film Room", "Combine Training", "Recruiting Board"],
    ios: "https://apps.apple.com/us/app/athlynx/id6742985965",
    android: "https://play.google.com/store/apps/details?id=ai.athlynx.app",
  },
  {
    id: "warriors-playbook",
    name: "Warriors Playbook",
    tagline: "Football Coaching OS",
    icon: "",
    category: "Sports",
    status: "LIVE",
    route: "/warriors-playbook",
    description: "Coaching playbooks, film, game planning, and athlete development.",
    features: ["Play Designer", "Film Room", "Game Planning", "Athlete Dev", "Scouting"],
    isAI: true,
  },
  {
    id: "court-kings",
    name: "Court Kings",
    tagline: "Basketball Dominance",
    icon: "",
    category: "Sports",
    status: "LIVE",
    route: "/court-kings",
    description: "Basketball recruiting, training, and exposure platform.",
    features: ["Hoops Rankings", "Camp Finder", "Highlight Reels", "College Connections"],
    ios: "https://apps.apple.com/us/app/athlynx/id6742985965",
    android: "https://play.google.com/store/apps/details?id=ai.athlynx.app",
  },
  {
    id: "pitch-pulse",
    name: "Pitch Pulse",
    tagline: "Soccer Intelligence",
    icon: "",
    category: "Sports",
    status: "LIVE",
    route: "/pitch-pulse",
    description: "Soccer recruiting, club connections, and international opportunities.",
    features: ["Club Finder", "International Scouts", "Training Programs", "Showcase Events"],
    ios: "https://apps.apple.com/us/app/athlynx/id6742985965",
    android: "https://play.google.com/store/apps/details?id=ai.athlynx.app",
  },
  {
    id: "softball-nation",
    name: "Softball Nation",
    tagline: "Women's Softball Platform",
    icon: "",
    category: "Sports",
    status: "LIVE",
    route: "/softball-nation",
    description: "The complete women's softball recruiting and NIL platform.",
    features: ["Recruiting", "NIL Deals", "Tournament Finder", "Highlight Reels"],
  },
  {
    id: "racket-kings",
    name: "Racket Kings",
    tagline: "Tennis & Racquet Sports",
    icon: "",
    category: "Sports",
    status: "LIVE",
    route: "/racket-kings",
    description: "Tennis, pickleball, and racquet sports recruiting and rankings.",
    features: ["Rankings", "Tournament Finder", "Coaching", "Recruiting"],
  },
  {
    id: "track-elite",
    name: "Track Elite",
    tagline: "Track & Field Platform",
    icon: "",
    category: "Sports",
    status: "LIVE",
    route: "/track-elite",
    description: "Track & field, cross country, and endurance sports platform.",
    features: ["Performance Tracking", "Recruiting", "Meet Finder", "PR Tracker"],
  },
  {
    id: "swim-surge",
    name: "Swim Surge",
    tagline: "Aquatics Platform",
    icon: "",
    category: "Sports",
    status: "LIVE",
    route: "/swim-surge",
    description: "Swimming, water polo, and aquatics recruiting and analytics.",
    features: ["Split Tracking", "Recruiting", "Meet Finder", "Technique Analysis"],
  },
  {
    id: "fairway-elite",
    name: "Fairway Elite",
    tagline: "Golf Excellence",
    icon: "",
    category: "Sports",
    status: "LIVE",
    route: "/fairway-elite",
    description: "Golf handicap tracking, course finder, and tournament play.",
    features: ["Handicap Tracker", "Course Finder", "Tee Times", "Tournament Entry"],
    ios: "https://apps.apple.com/us/app/athlynx/id6742985965",
    android: "https://play.google.com/store/apps/details?id=ai.athlynx.app",
  },
  {
    id: "reel-masters",
    name: "Reel Masters",
    tagline: "Fishing Community",
    icon: "",
    category: "Sports",
    status: "LIVE",
    route: "/reel-masters",
    description: "Find fishing spots, log catches, and compete in tournaments.",
    features: ["Spot Finder", "Catch Log", "Tournaments", "Gear Reviews"],
    ios: "https://apps.apple.com/us/app/athlynx/id6742985965",
    android: "https://play.google.com/store/apps/details?id=ai.athlynx.app",
  },
  {
    id: "hunt-pro",
    name: "Hunt Pro",
    tagline: "Hunting & Outdoors",
    icon: "",
    category: "Sports",
    status: "LIVE",
    route: "/hunt-pro",
    description: "Hunting spots, season tracking, and outdoor sports community.",
    features: ["Spot Finder", "Season Tracker", "Gear Reviews", "Community"],
  },
  {
    id: "mat-warriors",
    name: "Mat Warriors",
    tagline: "Combat Sports",
    icon: "",
    category: "Sports",
    status: "LIVE",
    route: "/mat-warriors",
    description: "Wrestling, boxing, MMA, and combat sports recruiting.",
    features: ["Rankings", "Recruiting", "Training Plans", "Tournament Finder"],
  },
  {
    id: "net-setters",
    name: "Net Setters",
    tagline: "Volleyball & Net Sports",
    icon: "",
    category: "Sports",
    status: "LIVE",
    route: "/net-setters",
    description: "Volleyball, beach volleyball, and net sports platform.",
    features: ["Rankings", "Recruiting", "Camp Finder", "Highlight Reels"],
  },
  {
    id: "cheer-elite",
    name: "Cheer Elite",
    tagline: "Cheer & Dance",
    icon: "",
    category: "Sports",
    status: "LIVE",
    route: "/cheer-elite",
    description: "Cheer, dance, and spirit sports recruiting and competition.",
    features: ["Rankings", "Recruiting", "Competition Finder", "Highlight Reels"],
  },
  {
    id: "gymnastics-vault",
    name: "Gymnastics Vault",
    tagline: "Gymnastics Platform",
    icon: "",
    category: "Sports",
    status: "LIVE",
    route: "/gymnastics-vault",
    description: "Gymnastics recruiting, skills tracking, and competition platform.",
    features: ["Skills Tracker", "Recruiting", "Meet Finder", "Video Analysis"],
  },
  {
    id: "ice-breakers",
    name: "Ice Breakers",
    tagline: "Ice Hockey Platform",
    icon: "",
    category: "Sports",
    status: "LIVE",
    route: "/ice-breakers",
    description: "Ice hockey recruiting, stats, and development platform.",
    features: ["Stats Tracking", "Recruiting", "Camp Finder", "Film Room"],
  },

  //  AI TOOLS 
  {
    id: "ai-recruiter",
    name: "AI Recruiter",
    tagline: "Prospect Matching Engine",
    icon: "",
    category: "AI Tools",
    status: "LIVE",
    route: "/ai-recruiter",
    description: "AI-driven prospect matching. Find the right school, the right coach, the right deal.",
    features: ["School Matching", "Coach Finder", "Offer Tracker", "Letter Generator"],
    isAI: true,
  },
  {
    id: "trainer-bot",
    name: "Trainer Bot",
    tagline: "AI Personal Trainer",
    icon: "",
    category: "AI Tools",
    status: "LIVE",
    route: "/trainer-bot",
    description: "Position-specific AI training plans, film breakdowns, and performance tracking.",
    features: ["Training Plans", "Film Breakdown", "Performance Tracking", "Nutrition"],
    isAI: true,
  },
  {
    id: "ai-scouting",
    name: "AI Scouting Report",
    tagline: "Automated Scout",
    icon: "",
    category: "AI Tools",
    status: "LIVE",
    route: "/ai-scouting-report",
    description: "AI-generated scouting reports for any athlete in any sport.",
    features: ["Auto Reports", "Strengths/Weaknesses", "Comp Analysis", "Export PDF"],
    isAI: true,
  },
  {
    id: "epx",
    name: "EPX",
    tagline: "Competitive Edge Engine",
    icon: "",
    category: "AI Tools",
    status: "LIVE",
    route: "/epx",
    description: "Identify and amplify your competitive edge with AI analysis.",
    features: ["Edge Analysis", "Performance Gaps", "Improvement Plan", "Benchmarking"],
    isAI: true,
  },
  {
    id: "athlynx-engine",
    name: "AthlynX Engine",
    tagline: "Nebius H200 AI Core",
    icon: "",
    category: "AI Tools",
    status: "LIVE",
    route: "/athlynx-engine",
    description: "The Nebius H200 NVIDIA-powered AI engine running AthlynXAI OS v1.",
    features: ["H200 GPUs", "Multi-Model", "Real-time", "OpenAI + Gemini + Claude"],
    isAI: true,
  },

  //  NIL & RECRUITING 
  {
    id: "nil-portal",
    name: "NIL Portal",
    tagline: "Name. Image. Likeness.",
    icon: "",
    category: "NIL & Recruiting",
    status: "LIVE",
    route: "/nil-portal",
    description: "Full NIL marketplace — brands, deals, contracts, and payouts.",
    features: ["Brand Marketplace", "Deal Tracker", "Contract Builder", "Payout Engine"],
  },
  {
    id: "nil-vault",
    name: "NIL Vault",
    tagline: "Deal Management",
    icon: "",
    category: "NIL & Recruiting",
    status: "LIVE",
    route: "/nil-vault",
    description: "Manage NIL deals, deliverables, and payments in one secure vault.",
    features: ["Deal Storage", "Deliverable Tracker", "Payment History", "Tax Docs"],
  },
  {
    id: "nil-calculator",
    name: "NIL Calculator",
    tagline: "Valuation Engine",
    icon: "",
    category: "NIL & Recruiting",
    status: "LIVE",
    route: "/nil-calculator",
    description: "AI-powered NIL valuation based on sport, school, social reach, and performance.",
    features: ["Valuation Model", "Comparables", "Growth Projections", "Report Export"],
    isAI: true,
  },
  {
    id: "recruiting-hub",
    name: "Recruiting Hub",
    tagline: "College Recruiting Center",
    icon: "",
    category: "NIL & Recruiting",
    status: "LIVE",
    route: "/recruiting-hub",
    description: "Every school, every coach, every offer — all in one place.",
    features: ["School Database", "Coach Contacts", "Offer Tracker", "Visit Scheduler"],
  },
  {
    id: "transfer-portal",
    name: "Transfer Portal",
    tagline: "Portal Intelligence",
    icon: "",
    category: "NIL & Recruiting",
    status: "LIVE",
    route: "/transfer-portal",
    description: "Every portal entry, every school, every offer. Transfer with confidence.",
    features: ["Portal Tracker", "School Finder", "Offer Comparison", "Timeline"],
  },
  {
    id: "signing-day",
    name: "Signing Day",
    tagline: "Commitment Tracker",
    icon: "",
    category: "NIL & Recruiting",
    status: "LIVE",
    route: "/signing-day",
    description: "Track commitments, signing days, and early signing periods.",
    features: ["Commitment Tracker", "Signing Calendar", "Class Rankings", "Alerts"],
  },

  //  MEDIA & CONTENT 
  {
    id: "highlight-studio",
    name: "Highlight Studio",
    tagline: "Auto-Cut Highlights",
    icon: "",
    category: "Media",
    status: "LIVE",
    route: "/highlight-reel-studio",
    description: "Auto-cut, captioned, and distribution-ready highlight reels.",
    features: ["Auto-Cut", "Captions", "Music", "Multi-Platform Export"],
    isAI: true,
  },
  {
    id: "media-os",
    name: "Media OS",
    tagline: "Content Command Center",
    icon: "",
    category: "Media",
    status: "LIVE",
    route: "/media-os",
    description: "Full media distribution OS — social, podcast, video, and press.",
    features: ["Social Scheduler", "Podcast Studio", "Press Kit", "Analytics"],
  },
  {
    id: "social-hub",
    name: "Social Hub",
    tagline: "Social Command Center",
    icon: "",
    category: "Media",
    status: "LIVE",
    route: "/social-hub",
    description: "Manage all social channels from one command center.",
    features: ["Multi-Platform", "Scheduler", "Analytics", "AI Captions"],
    isAI: true,
  },
  {
    id: "founder-podcast",
    name: "Founder Podcast",
    tagline: "AXN Audio Network",
    icon: "",
    category: "Media",
    status: "LIVE",
    route: "/founder-podcast",
    description: "The AthlynXAI founder podcast — athlete stories, NIL, and the future.",
    features: ["Episodes", "Transcripts", "Guest Booking", "Distribution"],
  },
  {
    id: "athlynx-network",
    name: "AthlynX Network",
    tagline: "AXN Broadcast",
    icon: "",
    category: "Media",
    status: "LIVE",
    route: "/athlynx-network",
    description: "The AthlynX athlete media network. Live streams, highlights, and shows.",
    features: ["Live Stream", "Highlights", "Shows", "Athlete Channels"],
  },

  //  CALENDARS & SCHEDULING 
  {
    id: "athlete-calendar",
    name: "Athlete Calendar",
    tagline: "Schedule Everything",
    icon: "",
    category: "Scheduling",
    status: "LIVE",
    route: "/athlete-calendar",
    description: "Calendly + Google Calendar integration. Book coaches, scouts, and brands.",
    features: ["Calendly Integration", "Google Calendar", "Coach Booking", "Brand Meetings"],
  },
  {
    id: "booking-hub",
    name: "Booking Hub",
    tagline: "Appointment Engine",
    icon: "",
    category: "Scheduling",
    status: "LIVE",
    route: "/booking-hub",
    description: "Book camps, showcases, training sessions, and recruiting visits.",
    features: ["Camp Booking", "Showcase Finder", "Training Sessions", "Visit Scheduling"],
  },

  //  CRM & BACK-OFFICE 
  {
    id: "crm-command",
    name: "CRM Command Center",
    tagline: "Athlete CRM",
    icon: "",
    category: "CRM",
    status: "LIVE",
    route: "/crm",
    description: "Full CRM for athletes, coaches, brands, and agents.",
    features: ["Contact Management", "Deal Pipeline", "Email Sequences", "Analytics"],
  },
  {
    id: "admin-dashboard",
    name: "Admin Dashboard",
    tagline: "Back-Office OS",
    icon: "",
    category: "CRM",
    status: "LIVE",
    route: "/admin",
    description: "Full back-office — users, billing, connectors, and system health.",
    features: ["User Management", "Billing", "Connector Health", "System Logs"],
  },
  {
    id: "partner-portal",
    name: "Partner Portal",
    tagline: "Brand & Agent Portal",
    icon: "",
    category: "CRM",
    status: "LIVE",
    route: "/partner-portal",
    description: "Brand and agent portal for NIL deals, recruiting, and partnerships.",
    features: ["Deal Submissions", "Athlete Discovery", "Contract Tools", "Analytics"],
  },

  //  FINANCE & LEGAL 
  {
    id: "athlete-financial",
    name: "Athlete Financial",
    tagline: "Money Management",
    icon: "",
    category: "Finance",
    status: "LIVE",
    route: "/athlete-financial",
    description: "Track NIL income, expenses, taxes, and financial planning.",
    features: ["Income Tracker", "Expense Log", "Tax Prep", "Financial Planning"],
  },
  {
    id: "contracts",
    name: "Contracts",
    tagline: "Legal Document Engine",
    icon: "",
    category: "Finance",
    status: "LIVE",
    route: "/contracts",
    description: "AI-powered contract generation, review, and e-signature.",
    features: ["Contract Builder", "AI Review", "E-Signature", "Storage"],
    isAI: true,
  },
  {
    id: "token-factory",
    name: "Token Factory",
    tagline: "Athlete Tokenization",
    icon: "",
    category: "Finance",
    status: "LIVE",
    route: "/token-factory",
    description: "Tokenize athlete equity, NIL rights, and brand value on-chain.",
    features: ["Token Creation", "Equity Splits", "Smart Contracts", "Marketplace"],
  },

  //  HEALTH & WELLNESS 
  {
    id: "athlete-health",
    name: "Athlete Health",
    tagline: "Performance Health",
    icon: "",
    category: "Health",
    status: "LIVE",
    route: "/athlete-health",
    description: "Health monitoring, injury prevention, and recovery tracking.",
    features: ["Health Monitoring", "Injury Prevention", "Recovery Plans", "Medical Records"],
  },
  {
    id: "gluco-athlete",
    name: "GlucoAthlete OS",
    tagline: "Metabolic Performance",
    icon: "",
    category: "Health",
    status: "LIVE",
    route: "/gluco-athlete-os",
    description: "Glucose monitoring and metabolic performance for elite athletes.",
    features: ["Glucose Tracking", "Nutrition Plans", "Performance Correlation", "Alerts"],
    isAI: true,
  },
  {
    id: "wellness-portal",
    name: "Wellness Portal",
    tagline: "Mind & Body",
    icon: "",
    category: "Health",
    status: "LIVE",
    route: "/wellness-portal",
    description: "Mental health, mindset training, and holistic wellness for athletes.",
    features: ["Mindset Training", "Sleep Tracking", "Stress Management", "Journaling"],
  },

  //  COMMERCE 
  {
    id: "athlete-store",
    name: "AthlynX Store",
    tagline: "Athlete Merch & Gear",
    icon: "",
    category: "Commerce",
    status: "LIVE",
    route: "/store",
    description: "Official AthlynX gear, athlete merch, and branded apparel.",
    features: ["Apparel", "Gear", "NIL Merch", "Custom Branding"],
  },
  {
    id: "vendor-marketplace",
    name: "Vendor Marketplace",
    tagline: "Partner Commerce",
    icon: "",
    category: "Commerce",
    status: "LIVE",
    route: "/commerce",
    description: "ICC-USA and partner vendor marketplace for athlete gear and equipment.",
    features: ["Vendor Directory", "Product Catalog", "Deal Pipeline", "Fulfillment"],
  },

  //  INFRASTRUCTURE 
  {
    id: "connector-health",
    name: "Connector Health OS",
    tagline: "18 Live Connectors",
    icon: "",
    category: "Infrastructure",
    status: "LIVE",
    route: "/connector-health",
    description: "Real-time health monitoring for all 18 AthlynXAI OS connectors.",
    features: ["Health Dashboard", "Uptime Monitoring", "Alert System", "Auto-Repair"],
  },
  {
    id: "seo-dashboard",
    name: "SEO Command Center",
    tagline: "Search Intelligence",
    icon: "",
    category: "Infrastructure",
    status: "LIVE",
    route: "/seo",
    description: "Full SEO dashboard — keywords, crawler access, sitemaps, and analytics.",
    features: ["Keyword Strategy", "Crawler Access", "Sitemap", "Google Search Console"],
  },
  {
    id: "brackets",
    name: "Brackets",
    tagline: "Live Tournament Tracker",
    icon: "",
    category: "Infrastructure",
    status: "LIVE",
    route: "/brackets",
    description: "Live brackets for every NCAA tournament, super regional, and championship.",
    features: ["Live Scores", "Bracket Builder", "Predictions", "Highlights"],
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(APPS.map((a) => a.category)))];

const STATUS_COLORS: Record<AppDef["status"], string> = {
  LIVE: "bg-[#00C2FF]/20 text-[#00C2FF] border-[#00C2FF]/30",
  BETA: "bg-[#1E90FF]/20 text-white border-[#1E90FF]/30",
  "COMING SOON": "bg-white/10 text-white/50 border-white/20",
};

function AppCard({ app }: { app: AppDef }) {
  return (
    <Link
      href={app.route}
      className="group relative block rounded-2xl border border-white/10 bg-gradient-to-br from-black via-[#07111F] to-black p-5 transition-all hover:border-blue-500/60 hover:shadow-xl hover:shadow-blue-500/15 hover:scale-[1.02] overflow-hidden cursor-pointer"
    >
      {/* Owl Mark Watermark */}
      <OwlMark className="absolute bottom-3 right-3 w-8 h-8 text-white/5 group-hover:text-white/10 transition-colors" />

      {/* Flagship glow */}
      {app.isFlagship && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none rounded-2xl" />
      )}

      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{app.icon}</span>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${STATUS_COLORS[app.status]}`}>
            {app.status}
          </span>
          {app.isAI && (
            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
              AI
            </span>
          )}
        </div>
      </div>

      <h3 className="text-base font-black text-white mb-0.5 group-hover:text-blue-400 transition-colors leading-tight">
        {app.name}
      </h3>
      <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500 mb-2">{app.tagline}</p>
      <p className="text-xs text-white/60 leading-snug mb-3 line-clamp-2">{app.description}</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {app.features.slice(0, 3).map((f) => (
          <span key={f} className="text-[9px] font-bold text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
            {f}
          </span>
        ))}
      </div>

      {(app.ios || app.android) && (
        <div className="flex gap-2 mt-2">
          {app.ios && (
            <a
              href={app.ios}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 text-center text-[10px] font-black uppercase tracking-wider py-1.5 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 rounded-lg transition-all text-white/70"
            >
               iOS
            </a>
          )}
          {app.android && (
            <a
              href={app.android}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 text-center text-[10px] font-black uppercase tracking-wider py-1.5 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 rounded-lg transition-all text-white/70"
            >
               Android
            </a>
          )}
        </div>
      )}
    </Link>
  );
}

import { useState, useMemo } from "react";

export default function AthlynXAIAppsEcosystem() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showAIOnly, setShowAIOnly] = useState(false);

  const filtered = useMemo(() => {
    let list = APPS;
    if (activeCategory !== "All") list = list.filter((a) => a.category === activeCategory);
    if (showAIOnly) list = list.filter((a) => a.isAI);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((a) =>
        a.name.toLowerCase().includes(q) ||
        a.tagline.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCategory, search, showAIOnly]);

  const liveCount = APPS.filter((a) => a.status === "LIVE").length;
  const aiCount = APPS.filter((a) => a.isAI).length;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative px-6 pt-20 pb-12 border-b border-white/10 bg-gradient-to-b from-[#0a1a3a] via-black to-black overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <OwlMark className="w-10 h-10 text-blue-500" />
            <p className="text-xs font-black tracking-widest uppercase text-blue-500">AthlynXAI OS v1</p>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-4 leading-none">
            Apps Ecosystem
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mb-6">
            Every app. Every tool. Every sport. Built on Nebius H200 NVIDIA infrastructure. The first 1-man, 1-AI, $1B autonomous athlete platform.
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <span className="w-2 h-2 bg-[#00C2FF] rounded-full animate-pulse" />
              <span className="text-sm font-black text-white">{liveCount} Live Apps</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <span className="text-sm font-black text-blue-400">{aiCount} AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <span className="text-sm font-black text-white">{APPS.length} Total Apps</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <span className="text-sm font-black text-[#00C2FF]">iOS + Android</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-0 z-40 px-6 py-4 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowAIOnly(!showAIOnly)}
              className={`text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl transition-all ${
                showAIOnly ? "bg-blue-500 text-black" : "border border-white/20 text-white/70 hover:border-blue-500/50"
              }`}
            >
               AI Only
            </button>
          </div>
          <input
            type="text"
            placeholder="Search apps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/15 text-white placeholder-white/30 text-sm font-bold px-4 py-2 rounded-xl focus:outline-none focus:border-blue-500/60 w-full md:w-64"
          />
        </div>
        <div className="max-w-6xl mx-auto mt-3 flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex-shrink-0 ${
                activeCategory === cat
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Flagship Apps */}
      {activeCategory === "All" && !search && !showAIOnly && (
        <section className="px-6 py-10 border-b border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black uppercase tracking-wide">Flagship Apps</h2>
              <span className="text-xs font-black uppercase tracking-widest text-blue-500">AthlynXAI Core</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {APPS.filter((a) => a.isFlagship).map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Apps Grid */}
      <section className="px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black uppercase tracking-wide">
              {filtered.length} App{filtered.length !== 1 ? "s" : ""}
              {activeCategory !== "All" && <span className="ml-2 text-blue-400">— {activeCategory}</span>}
            </h2>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/40 text-lg font-bold">No apps found.</p>
              <button
                onClick={() => { setSearch(""); setActiveCategory("All"); setShowAIOnly(false); }}
                className="mt-4 text-blue-400 text-sm font-black hover:text-blue-300"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Download CTA */}
      <section className="px-6 py-16 bg-gradient-to-t from-[#0a1628] to-black border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <OwlMark className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <p className="text-xs font-black tracking-widest uppercase text-blue-500 mb-3">First of Its Kind</p>
          <h2 className="text-4xl font-black uppercase tracking-tight mb-4">BE THE LEGACY</h2>
          <p className="text-white/60 text-lg mb-8">
            1 man. 1 AI. $1B. The first fully autonomous athlete platform running on Nebius H200 NVIDIA infrastructure.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://apps.apple.com/us/app/athlynx/id6742985965"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white text-black font-black text-sm px-8 py-4 rounded-2xl uppercase tracking-wider transition-all hover:bg-gray-100 shadow-lg"
            >
               Download on iOS
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=ai.athlynx.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-blue-500 hover:bg-blue-400 text-black font-black text-sm px-8 py-4 rounded-2xl uppercase tracking-wider transition-all shadow-lg shadow-blue-500/30"
            >
               Download on Android
            </a>
            <Link
              href="/signup"
              className="border border-white/20 hover:border-blue-500 text-white font-black text-sm px-8 py-4 rounded-2xl uppercase tracking-wider transition-colors"
            >
              Enter the Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
