/**
 * /tony-locey — Tony Locey Business & Partner Profile
 * ---------------------------------------------------------------------------
 * Separate from /partner/tony-locey (athlete career stats page).
 * This page covers:
 *   • AthlynXAI role: Partner, Founding Athlete, Strategic Advisor
 *   • Business ventures: NexPhase (Managing Partner), TL Sod Company (Owner)
 *   • Strategic fit and AthlynXAI mission alignment
 *   • Contact / connect CTA
 *
 * Brand: cobalt #1E90FF · cyan #00C2FF · true black · white.
 * No LinkedIn styling. No third-party chrome.
 */
import { useEffect } from "react";
import { Link } from "wouter";

export default function TonyLoceyBusiness() {
  useEffect(() => {
    document.title = "Tony Locey — Partner · AthlynXAI";
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-5 py-8 md:py-14">

        {/* ── Brand strip ── */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <img
              src="/athlynx-icon-neon.jpg"
              alt="AthlynX"
              className="h-9 w-9 rounded-lg ring-1 ring-[#1E90FF]/40 transition group-hover:ring-[#1E90FF]"
            />
            <div className="leading-tight">
              <div className="text-sm font-black tracking-widest text-white">
                AthlynX<span className="text-[#1E90FF]">XAI</span>
              </div>
              <div className="text-[9px] uppercase tracking-[0.22em] text-[#1E90FF]">
                The Athlete's Playbook
              </div>
            </div>
          </Link>
          <div className="hidden md:block text-[10px] uppercase tracking-widest text-white/35">
            athlynx.ai/tony-locey
          </div>
        </div>

        {/* ── Role badges ── */}
        <div className="mb-5 flex flex-wrap gap-2">
          <span className="inline-block bg-[#00C2FF] text-black text-[10px] font-black uppercase tracking-[0.22em] px-3 py-1 rounded">
            Partner of AthlynXAI
          </span>
          <span className="inline-block border border-[#1E90FF]/50 text-[#1E90FF] text-[10px] font-black uppercase tracking-[0.22em] px-3 py-1 rounded">
            Founding Athlete
          </span>
          <span className="inline-block border border-white/20 text-white/70 text-[10px] font-black uppercase tracking-[0.22em] px-3 py-1 rounded">
            Strategic Advisor
          </span>
        </div>

        {/* ── Hero ── */}
        <div className="mb-10 rounded-2xl bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-black border border-[#1E90FF]/20 p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Photo placeholder / initials */}
            <div className="flex-shrink-0">
              <div className="h-24 w-24 md:h-32 md:w-32 rounded-2xl bg-gradient-to-br from-[#1E90FF]/30 to-[#00C2FF]/10 border border-[#1E90FF]/30 flex items-center justify-center">
                <span className="text-3xl md:text-4xl font-black text-[#1E90FF]">TL</span>
              </div>
            </div>

            {/* Identity block */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-1">
                Tony Locey
              </h1>
              <p className="text-[#1E90FF] font-bold text-sm md:text-base uppercase tracking-widest mb-3">
                Partner of AthlynXAI / AthlynX.ai · Founding Athlete · Strategic Advisor
              </p>
              <p className="text-white/60 text-sm leading-relaxed max-w-xl">
                University of Georgia Baseball · Former Professional Baseball Pitcher ·
                2019 St. Louis Cardinals 3rd-Round Draft Pick · Managing Partner, NexPhase ·
                Owner, TL Sod Company
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/partner/tony-locey"
                  className="inline-flex items-center gap-2 bg-[#1E90FF] hover:bg-[#1a7fe0] text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg transition"
                >
                  View Athlete Profile →
                </Link>
                <Link
                  href="/team"
                  className="inline-flex items-center gap-2 border border-white/20 hover:border-[#1E90FF]/60 text-white/70 hover:text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg transition"
                >
                  Full Team
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── AthlynXAI Role ── */}
        <section className="mb-10">
          <h2 className="text-xs font-black uppercase tracking-[0.25em] text-[#1E90FF] mb-4">
            AthlynXAI Role
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Partner of AthlynXAI / AthlynX.ai",
                body:
                  "Tony is a confirmed Partner of AthlynXAI and AthlynX.ai — a founding voice in the platform's direction, athlete experience, and network strategy.",
              },
              {
                title: "Founding Athlete",
                body:
                  "As AthlynXAI's First Athlete Partner, Tony brings the lived experience of the recruiting journey, professional grind, and the transition into business and leadership.",
              },
              {
                title: "Strategic Advisor",
                body:
                  "Tony advises on athlete-facing product decisions, Georgia/SEC network development, and the platform's core mission: helping athletes prepare for what's next.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl bg-white/[0.03] border border-white/10 p-5"
              >
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#00C2FF] mb-2">
                  {item.title}
                </div>
                <p className="text-white/65 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Business Ventures ── */}
        <section className="mb-10">
          <h2 className="text-xs font-black uppercase tracking-[0.25em] text-[#1E90FF] mb-4">
            Business Ventures
          </h2>
          <div className="space-y-4">
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="text-white font-black text-lg">NexPhase</div>
                  <div className="text-[#1E90FF] text-xs font-bold uppercase tracking-widest">
                    Managing Partner
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/30 border border-white/10 px-2 py-1 rounded">
                  Infrastructure · AI Compute
                </span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                NexPhase is positioned around scalable power and infrastructure for data-intensive
                and AI-compute workloads. Tony brings the same competitor mindset from the mound
                to building infrastructure that powers the next generation of technology.
              </p>
            </div>

            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="text-white font-black text-lg">TL Sod Company</div>
                  <div className="text-[#1E90FF] text-xs font-bold uppercase tracking-widest">
                    Owner
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/30 border border-white/10 px-2 py-1 rounded">
                  Entrepreneurship
                </span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                TL Sod Company reflects Tony's post-playing-career operator mindset — building
                real businesses from the ground up with the same discipline and resilience that
                defined his baseball career.
              </p>
            </div>
          </div>
        </section>

        {/* ── Why Tony / Strategic Fit ── */}
        <section className="mb-10">
          <h2 className="text-xs font-black uppercase tracking-[0.25em] text-[#1E90FF] mb-4">
            Why Tony Fits AthlynXAI
          </h2>
          <div className="rounded-xl bg-gradient-to-br from-[#0a1628] to-black border border-[#1E90FF]/20 p-6 md:p-8">
            <blockquote className="text-white/80 text-base md:text-lg leading-relaxed italic mb-6 border-l-2 border-[#00C2FF] pl-4">
              "I have a bulldog mentality. I want to attack every hitter, every time."
            </blockquote>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Tony Locey's story speaks to three athlete groups at once. For young athletes, he
              represents the value of being coachable, learning the mental IQ of the sport, and
              understanding that talent alone is not the whole journey. For current college and
              professional athletes, his record shows what it takes to compete at Georgia, get
              drafted, and survive the business side of professional baseball.
            </p>
            <p className="text-white/60 text-sm leading-relaxed">
              For athletes facing transition, Tony supports the central AthlynXAI message:
              there is still a next chapter after the last game. His post-playing path as a
              partner and operator validates AthlynXAI's life-after-sports mission.
            </p>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Sport IQ", value: "Georgia Bulldog" },
                { label: "Draft", value: "3rd Round · 2019" },
                { label: "Pro Career", value: "Cardinals · Rockies · Rays" },
                { label: "What's Next", value: "NexPhase · AthlynXAI" },
              ].map((tile) => (
                <div
                  key={tile.label}
                  className="rounded-lg bg-white/[0.04] border border-white/10 p-3 text-center"
                >
                  <div className="text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">
                    {tile.label}
                  </div>
                  <div className="text-white font-black text-xs">{tile.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Athlete Profile CTA ── */}
        <section className="mb-10">
          <div className="rounded-xl bg-gradient-to-r from-[#1E90FF]/10 to-[#00C2FF]/5 border border-[#1E90FF]/30 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-white font-black text-base mb-1">
                Full Athlete Career Stats
              </div>
              <div className="text-white/55 text-sm">
                Georgia career · Cape Cod · Pro timeline · Transactions · Draft history
              </div>
            </div>
            <Link
              href="/partner/tony-locey"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-[#1E90FF] hover:bg-[#1a7fe0] text-white text-xs font-black uppercase tracking-widest px-5 py-3 rounded-lg transition"
            >
              View Athlete Profile →
            </Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-[10px] uppercase tracking-widest text-white/30">
            AthlynXAI · athlynx.ai/tony-locey
          </div>
          <div className="flex gap-4 text-[10px] uppercase tracking-widest text-white/30">
            <Link href="/" className="hover:text-white/60 transition">Home</Link>
            <Link href="/team" className="hover:text-white/60 transition">Team</Link>
            <Link href="/partner/tony-locey" className="hover:text-white/60 transition">Athlete Profile</Link>
            <Link href="/partners" className="hover:text-white/60 transition">Partners</Link>
          </div>
        </footer>

      </div>
    </div>
  );
}
