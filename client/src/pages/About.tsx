/**
 * AthlynX — ABOUT PAGE
 * Clean, professional, eye-popping. Real photos. No yellow. No gold.
 * Colors: #050d1a navy, #0066ff blue, #00c2ff cyan.
 * Real team photos from /images/team/
 *
 * Updated: S39 — May 6, 2026
 */
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Link } from "wouter";

const TEAM = [
  {
    name: "Chad A. Dozier Sr.",
    title: "Founder, CEO & Chairman",
    photo: "/images/team/chad-dozier-headshot.png",
    bio: "Founder and visionary leader behind AthlynXAI and the Dozier Holdings Group ecosystem, building an athlete-first operating system rooted in ownership, opportunity, and disciplined execution.",
    email: "contact@athlynx.ai",
    tag: "FOUNDER",
    tagColor: "bg-[#0066ff]",
  },
  {
    name: "Lee Marshall",
    title: "Co-Host · VP Sales & Partnerships · Business Partner",
    photo: "/team/lee-marshall.jpg",
    bio: "Lee leads sales, partnerships, athlete outreach, and The Athlete’s Playbook momentum, connecting the platform to athletes, families, brands, and real-world relationships.",
    email: "lmarshall@athlynx.ai",
    tag: "PARTNER",
    tagColor: "bg-[#0066ff]/80",
  },
  {
    name: "Glenn Tse",
    title: "Co-Founder · CFO & COO",
    photo: "/team/glenn-tse.jpg",
    bio: "Co-founder and financial architect of Dozier Holdings Group. Glenn brings the operating discipline that helps turn the vision into shipping software and controlled growth.",
    email: "gtse@dozierholdingsgroup.com",
    tag: "CO-FOUNDER",
    tagColor: "bg-[#00c2ff] text-[#050d1a]",
  },
];

const STATS = [
  { value: "44", label: "Sports Covered" },
  { value: "213+", label: "Platform Features" },
  { value: "4", label: "AI Engines" },
  { value: "$135B", label: "Market Opportunity" },
];

function AboutInner() {
  return (
    <div className="min-h-screen bg-[#050d1a] text-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0a1628] to-[#050d1a] px-5 pt-20 pb-16 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,102,255,0.10),transparent_70%)]" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#0066ff]/10 border border-[#0066ff]/30 rounded-full px-5 py-2 mb-8">
            <span className="w-2 h-2 bg-[#00c2ff] rounded-full animate-pulse" />
            <span className="text-sm font-bold text-[#00c2ff] tracking-wider">AthlynX · HOUSTON, TX · FOUNDED NOVEMBER 2024</span>
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#00c2ff]/70 mb-3">
            The Athlete's Playbook
          </p>
          <h1 className="text-5xl sm:text-7xl font-black leading-none tracking-tighter mb-4">
            <span className="text-white">BE THE</span><br />
            <span className="text-[#0066ff]">LEGACY.</span>
          </h1>
          {/* North-star positioning. Locked in OWNERSHIP.md — do not edit
              the wording without Chad's written approval. */}
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#00c2ff] mb-3" data-testid="about-northstar">
            AthlynXAI™ · We help the athletes — <span className="text-white">Name, Image &amp; Likeness, hyped up on AI.</span>
          </p>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-white/30 mb-6">
            Youth to Pro · Every Sport · Every Journey · Houston, TX
          </p>
          <p className="text-xl text-[#8ba3c7] max-w-2xl mx-auto leading-relaxed mb-10">
            AthlynX was built from the ground up with one purpose — to give every athlete, at every level, the tools, connections, and opportunities they deserve. We are founder-led, faith-forward, different by design, and not a me-too company. NIL. Recruiting. Transfer Portal. AI. All in one category-defining platform.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {STATS.map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center backdrop-blur">
                <p className="text-[#0066ff] font-black text-3xl">{s.value}</p>
                <p className="text-[#8ba3c7] text-xs font-semibold mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDING STORY */}
      <section className="py-20 px-5 bg-[#050d1a]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#0066ff] text-sm font-black uppercase tracking-[0.3em] mb-3">The Origin</p>
            <h2 className="text-4xl font-black text-white">Iron Sharpens Iron</h2>
            <p className="text-[#8ba3c7] text-lg mt-4 max-w-2xl mx-auto">
              Two men in Houston, Texas, November 2024. One had a vision. One had the technical skill to build it. Together, they built AthlynXAI.
            </p>
          </div>
          <div className="bg-gradient-to-r from-[#0066ff]/10 to-[#00c2ff]/5 border border-[#0066ff]/20 rounded-3xl p-8 md:p-12 text-center">
            <blockquote className="text-2xl md:text-3xl font-black text-white leading-snug mb-4">
              "Houston, Texas, November 2024. Two people with a shared vision and the determination to build something that would change how athletes navigate their careers forever. We were not chosen to copy the market. We were chosen to build The Company."
            </blockquote>
            <p className="text-[#00c2ff] font-bold">— Chad A. Dozier Sr., Founder · CEO · Chairman</p>
            <p className="text-[#8ba3c7] text-sm mt-1">Iron Sharpens Iron — Proverbs 27:17</p>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-20 px-5 bg-[#040c1a]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#00c2ff] text-sm font-black uppercase tracking-[0.3em] mb-3">The People Behind It</p>
            <h2 className="text-4xl font-black text-white">The Team</h2>
            <p className="text-[#8ba3c7] text-lg mt-4 max-w-xl mx-auto">
              Built by people who believe every athlete deserves a complete support system.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEAM.map((member, i) => (
              <div key={i} className="bg-[#0a1628] border border-[#0066ff]/20 rounded-3xl overflow-hidden hover:border-[#0066ff]/60 transition-all duration-300 group">
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/images/logos/athlynx-main-logo.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/10 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className={`text-white text-[10px] font-black px-3 py-1.5 rounded-full tracking-widest uppercase ${member.tagColor}`}>
                      {member.tag}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-white font-black text-xl mb-1">{member.name}</h3>
                  <p className="text-[#00c2ff] text-sm font-bold uppercase tracking-wider mb-4">{member.title}</p>
                  <p className="text-[#8ba3c7] text-sm leading-relaxed mb-4">{member.bio}</p>
                  <a href={`mailto:${member.email}`} className="text-[#0066ff] text-xs font-bold hover:text-[#00c2ff] transition-colors">
                    {member.email} →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-20 px-5 bg-[#050d1a]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#0066ff] text-sm font-black uppercase tracking-[0.3em] mb-3">Why We Built This</p>
          <h2 className="text-4xl font-black text-white mb-6">The Mission</h2>
          <p className="text-xl text-[#8ba3c7] max-w-3xl mx-auto leading-relaxed mb-12">
            Every athlete — from the unrecruited kid at a small school to the pro managing their brand — deserves a complete support system. AthlynX brings together the tools, the people, and the opportunities to make that possible.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
            {[
              { emoji: "🏈", label: "High School Recruiting" },
              { emoji: "🎓", label: "College NIL Deals" },
              { emoji: "🔄", label: "Transfer Portal" },
              { emoji: "🏆", label: "Pro Career & Beyond" },
            ].map((item, i) => (
              <div key={i} className="bg-[#0a1628] border border-[#0066ff]/20 rounded-2xl p-6 text-center hover:border-[#0066ff]/50 transition-all">
                <div className="text-4xl mb-3">{item.emoji}</div>
                <p className="text-white text-sm font-bold">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <button className="bg-[#0066ff] hover:bg-[#0052cc] text-white font-black text-lg px-10 py-4 rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-[#0066ff]/30">
                JOIN FREE — 7 DAYS →
              </button>
            </Link>
            <Link href="/portal">
              <button className="bg-white/5 hover:bg-white/10 text-white font-bold text-lg px-10 py-4 rounded-2xl border border-white/20 transition-all">
                ENTER THE PLATFORM
              </button>
            </Link>
          </div>
        </div>
      </section>

      <div className="bg-[#030810] border-t border-[#0066ff]/10 py-8 px-5 text-center">
        <p className="text-[#4a6080] text-sm">
          © 2026 AthlynXAI Corporation · A Dozier Holdings Group Company · Houston, TX · EIN 42-2183569
        </p>
        <p className="text-[#4a6080] text-xs mt-1">Iron Sharpens Iron — Proverbs 27:17 · Founded November 2024</p>
      </div>

      <MobileBottomNav />
    </div>
  );
}

export default function About() {
  return <RouteErrorBoundary><AboutInner /></RouteErrorBoundary>;
}
