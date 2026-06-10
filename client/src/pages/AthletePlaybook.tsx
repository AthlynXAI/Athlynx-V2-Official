/**
 * AthlynX — The Athlete Playbook
 * Your complete guide to boosting recruiting presence, building a media profile,
 * and connecting globally with athletes, coaches, and brands.
 *
 * Required platform section — always present per AthlynXAI_MASTER_REFERENCE.md
 */
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

const PILLARS = [
  {
    icon: "📸",
    title: "Build Your Media Profile",
    desc: "Create a professional digital presence that makes coaches stop scrolling.",
    items: [
      "AI-powered highlight reel creation and optimization",
      "Social media strategy tailored to your sport and position",
      "Content calendar for consistent, on-brand posting",
      "Engagement tactics to grow your athlete following",
      "Platform-specific best practices — TikTok, X, YouTube",
    ],
    color: "from-blue-600 to-cyan-500",
    bg: "bg-blue-900/20 border-blue-700/40",
  },
  {
    icon: "📈",
    title: "Boost Recruiting Visibility",
    desc: "Get seen by the right coaches before your competition does.",
    items: [
      "Optimize your AthlynX profile for recruiter search algorithms",
      "Showcase stats, awards, and achievements in the right format",
      "Create recruiting videos that coaches actually watch",
      "Target schools that match your talent level and academic goals",
      "Follow-up strategies that get real responses from coaches",
    ],
    color: "from-green-600 to-emerald-500",
    bg: "bg-green-900/20 border-green-700/40",
  },
  {
    icon: "🌍",
    title: "Connect Globally",
    desc: "Build a worldwide network of athletes, coaches, and mentors.",
    items: [
      "Join sport-specific global athlete communities on AthlynX",
      "Discuss recruiting strategies with athletes from every country",
      "Compare recruiting timelines and offer patterns worldwide",
      "Connect with athletes already enrolled at your target schools",
      "Build relationships with international scouts and coaches",
    ],
    color: "from-purple-600 to-violet-500",
    bg: "bg-purple-900/20 border-purple-700/40",
  },
  {
    icon: "📅",
    title: "Share Your Schedule",
    desc: "Make it effortless for recruiters to see you compete.",
    items: [
      "Maintain a live competition calendar visible to coaches",
      "Share showcase, camp, and tournament attendance",
      "Invite recruiters to key games with one tap",
      "Post game results and highlights within minutes",
      "Track which coaches viewed your schedule and follow up",
    ],
    color: "from-blue-600 to-blue-400",
    bg: "bg-blue-900/20 border-blue-700/40",
  },
  {
    icon: "⚖️",
    title: "Compare Recruiting Efforts",
    desc: "Benchmark your progress and learn from athletes who made it.",
    items: [
      "Analyze successful recruiting timelines by sport and position",
      "Compare offer patterns across D1, D2, D3, NAIA, and JUCO",
      "Learn from athletes who used the transfer portal successfully",
      "Understand NIL deal structures at every level of competition",
      "Identify gaps in your recruiting strategy before it's too late",
    ],
    color: "from-red-600 to-rose-500",
    bg: "bg-red-900/20 border-red-700/40",
  },
  {
    icon: "💰",
    title: "Maximize Your NIL Value",
    desc: "Your name, image, and likeness are worth more than you think.",
    items: [
      "Calculate your real NIL value using AthlynX's AI engine",
      "Connect with brands that match your sport and audience",
      "Negotiate deals with AI-powered contract analysis",
      "Store and track all NIL contracts in your NIL Vault",
      "Grow your NIL value as your recruiting profile improves",
    ],
    color: "from-blue-500 to-blue-300",
    bg: "bg-blue-900/30/20 border-blue-400/40/40",
  },
];

const GLOBAL_FEATURES = [
  {
    icon: "🏆",
    title: "Global Athlete Rankings",
    desc: "See where you rank against athletes in your sport — by state, region, country, and worldwide.",
  },
  {
    icon: "💬",
    title: "Athlete Discussion Boards",
    desc: "Talk recruiting with athletes from every corner of the world. Share strategies, compare offers, get real advice.",
  },
  {
    icon: "📊",
    title: "Recruiting Intelligence",
    desc: "Real-time data on which schools are recruiting your position, what stats they want, and when they make offers.",
  },
  {
    icon: "🔄",
    title: "Transfer Portal Network",
    desc: "Connect with athletes in the portal. Find out which schools are looking, what they offer, and how to get noticed.",
  },
  {
    icon: "🤝",
    title: "Mentor Matching",
    desc: "Get paired with athletes who've been through the recruiting process at your target schools.",
  },
  {
    icon: "📱",
    title: "Live Schedule Sharing",
    desc: "Share your game schedule globally. Coaches and scouts worldwide can see when and where to find you.",
  },
];

const STATS = [
  { value: "10x", label: "Recruiter Visibility Increase" },
  { value: "50+", label: "Countries Connected" },
  { value: "20+", label: "Integrated Platforms" },
  { value: "92%", label: "Better Recruiting Outcomes" },
];

function AthletePlaybookInner() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <PlatformLayout title="The Athlete Playbook">
        <div className="animate-pulse space-y-4 p-6">
          <div className="h-48 bg-blue-900/30 rounded-xl" />
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-32 bg-blue-900/20 rounded-xl" />)}
          </div>
        </div>
      </PlatformLayout>
    );
  }

  return (
    <PlatformLayout title="The Athlete Playbook">
      <div className="space-y-0">

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a1628] via-[#0f2040] to-[#0a1628] border border-blue-900/40 p-8 md:p-12 mb-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(0,212,255,0.08),_transparent_60%)]" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-cyan-400 text-xs font-bold tracking-widest">THE ATHLETE PLAYBOOK</span>
              <span className="bg-cyan-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">POWERED BY AthlynX</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
              Your Complete<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Athlete Playbook
              </span>
            </h1>
            <p className="text-lg text-blue-200 mb-8 max-w-2xl leading-relaxed">
              Everything you need to boost your recruiting presence, build your media profile,
              and connect with athletes, coaches, and brands across the globe.
              Your roadmap from unrecruited to unstoppable.
            </p>
            <div className="flex flex-wrap gap-4">
              {user ? (
                <Link href="/profile">
                  <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20">
                    Build My Profile →
                  </button>
                </Link>
              ) : (
                <Link href="/signup">
                  <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20">
                    Start Free — 7 Days →
                  </button>
                </Link>
              )}
              <Link href="/transfer-portal">
                <button className="border border-blue-600 text-blue-300 hover:bg-blue-900/40 font-bold px-8 py-3 rounded-xl transition-all">
                  Transfer Portal
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats Bar ─────────────────────────────────────────── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {STATS.map((s, i) => (
            <div key={i} className="bg-[#0f1f3d] border border-blue-900/40 rounded-xl p-5 text-center">
              <div className="text-3xl font-black text-cyan-400 mb-1">{s.value}</div>
              <div className="text-xs text-blue-300 font-medium">{s.label}</div>
            </div>
          ))}
        </section>

        {/* ── Six Pillars ───────────────────────────────────────── */}
        <section className="mb-10">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-white">Six Pillars of Athletic Success</h2>
            <p className="text-blue-300 text-sm mt-1">Actionable strategies you can implement immediately to advance your career.</p>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {PILLARS.map((p, i) => (
              <div key={i} className={`${p.bg} border rounded-xl p-6 space-y-4`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{p.icon}</span>
                  <div>
                    <h3 className="text-white font-black text-base">{p.title}</h3>
                    <p className="text-blue-300 text-xs mt-0.5">{p.desc}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {p.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-blue-200">
                      <span className="text-cyan-400 mt-0.5 flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Global Connect ────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-[#0a1628] to-[#0d1f3c] border border-blue-900/40 rounded-2xl p-8 mb-8">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-1.5 mb-4">
              <span className="text-purple-400 text-xs font-bold tracking-widest">🌍 GLOBAL ATHLETE NETWORK</span>
            </div>
            <h2 className="text-3xl font-black text-white mb-3">Connect With Athletes Worldwide</h2>
            <p className="text-blue-300 max-w-2xl mx-auto text-sm leading-relaxed">
              AthlynX connects athletes across every sport, every country, and every level of competition.
              Share your schedule. Compare recruiting efforts. Build your global brand.
              <strong className="text-cyan-400"> Iron Sharpens Iron.</strong>
            </p>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {GLOBAL_FEATURES.map((f, i) => (
              <div key={i} className="bg-[#0f1f3d]/60 border border-blue-800/30 rounded-xl p-5">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="text-white font-bold text-sm mb-2">{f.title}</h3>
                <p className="text-blue-300 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Transfer Portal + NIL Integration ────────────────── */}
        <section className="grid md:grid-cols-2 gap-5 mb-8">
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-700/40 rounded-xl p-6">
            <div className="text-3xl mb-3">🔄</div>
            <h3 className="text-white font-black text-lg mb-2">Transfer Portal Intelligence</h3>
            <p className="text-green-200 text-sm leading-relaxed mb-4">
              The Athlete Playbook integrates directly with AthlynX's Transfer Portal.
              Athletes from smaller schools use the playbook to improve their profile,
              enter the portal, and land at bigger programs — increasing their NIL value in the process.
            </p>
            <Link href="/transfer-portal">
              <button className="bg-green-600 hover:bg-green-500 text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors">
                Explore Transfer Portal →
              </button>
            </Link>
          </div>
          <div className="bg-gradient-to-br from-blue-500/30 to-blue-400/20 border border-blue-400/40/40 rounded-xl p-6">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-white font-black text-lg mb-2">NIL Marketplace Access</h3>
            <p className="text-blue-300 text-sm leading-relaxed mb-4">
              A stronger recruiting profile means a higher NIL value. The Athlete Playbook
              shows you exactly how to build the brand that brands want to pay for.
              Your name, image, and likeness are your business.
            </p>
            <Link href="/nil-portal">
              <button className="bg-blue-900/30 hover:bg-blue-900/30 text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors">
                Enter NIL Portal →
              </button>
            </Link>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────── */}
        <section className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-black text-white mb-3">Ready to Execute the Playbook?</h2>
          <p className="text-cyan-100 mb-6 max-w-xl mx-auto text-sm">
            Join AthlynX today and get full access to The Athlete Playbook, the Transfer Portal,
            the NIL Marketplace, and every tool you need to go from unrecruited to unstoppable.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {user ? (
              <Link href="/dashboard">
                <button className="bg-white text-blue-700 font-black px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
                  Go to My Dashboard →
                </button>
              </Link>
            ) : (
              <>
                <Link href="/signup">
                  <button className="bg-white text-blue-700 font-black px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
                    Start Free — 7 Days →
                  </button>
                </Link>
                <Link href="/signin">
                  <button className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors">
                    Sign In
                  </button>
                </Link>
              </>
            )}
          </div>
          <p className="text-cyan-200 text-xs mt-4">Iron Sharpens Iron — Proverbs 27:17</p>
        </section>

      </div>
    </PlatformLayout>
  );
}
export default function AthletePlaybook() {
  return <RouteErrorBoundary><AthletePlaybookInner /></RouteErrorBoundary>;
}
