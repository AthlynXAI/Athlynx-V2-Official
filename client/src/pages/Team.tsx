// /team — AthlynX team page. Founders & Executive Team only.
//  removed 2026-06-10 by Master Admin.
// Brand: cobalt #1E90FF + true black + white. No gold/yellow/orange.

import { Link } from "wouter";
import TeamProfileCard, { ATHLYNX_TEAM } from "@/components/TeamProfileCard";

export default function Team() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a1628] to-black text-white">
      <div className="max-w-6xl mx-auto px-5 py-10">
        {/* Brand strip */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <a className="flex items-center gap-3 group" data-testid="link-team-home">
              <img
                src="/athlynx-app-icon.png"
                alt="AthlynX"
                className="w-10 h-10 rounded-lg ring-1 ring-[#1E90FF]/40 group-hover:ring-[#1E90FF] transition"
              />
              <div>
                <div className="text-sm font-bold tracking-widest text-white">
                  AthlynX<span className="text-[#1E90FF]">XAI</span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#1E90FF]">
                  The Athlete's Playbook
                </div>
              </div>
            </a>
          </Link>
          <div className="text-[10px] uppercase tracking-widest text-white/40">athlynx.ai/team</div>
        </div>

        {/* Hero */}
        <header className="mb-12 border-b border-white/10 pb-10">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#1E90FF] mb-3">
            The People Behind AthlynX
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 leading-[1.05]">
            One team. <span className="text-[#1E90FF]">One mission.</span>
          </h1>
          <p className="text-lg text-white/70 max-w-3xl leading-relaxed">
            AthlynX exists for all sports, all ages, men and women — every athlete.
            The team building it reflects that. Founders, operators, and builders —
            all in the lane.
          </p>
        </header>

        {/* Founders */}
        <section aria-label="Founders" className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white tracking-tight">Founders & Executive Team</h2>
            <span className="text-[10px] uppercase tracking-widest text-white/40">AthlynXAI OS v1</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ATHLYNX_TEAM.map((p) => (
              <TeamProfileCard key={p.slug} profile={p} size="large" />
            ))}
          </div>
        </section>

        {/* Mission strip */}
        <section className="border border-[#1E90FF]/40 rounded-xl bg-gradient-to-r from-[#1E90FF]/10 via-black to-black p-6 md:p-8 mb-12 text-center">
          <div className="text-[10px] font-black uppercase tracking-[0.32em] text-[#1E90FF] mb-3">
            THE MISSION
          </div>
          <p className="text-xl md:text-2xl font-black text-white tracking-tight mb-2 leading-tight">
            ONE IDENTITY. EVERY ATHLETE. EVERY PLATFORM.
          </p>
          <p className="text-sm text-white/60 max-w-2xl mx-auto">
            All sports. All ages. Men and women. Youth through pro. One team — building
            the lane every athlete can travel for life.
          </p>
        </section>

        {/* Footer signoff */}
        <footer className="border-t border-white/10 pt-6 mt-4 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#1E90FF] mb-1">
            ATHLYNX · THE ATHLETE'S PLAYBOOK
          </p>
          <p className="text-[11px] text-white/50 mb-3">
            One identity. Every athlete. Every platform.
          </p>
        </footer>
      </div>
    </div>
  );
}
