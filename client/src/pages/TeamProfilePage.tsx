/**
 * /team/:slug \u2014 individual team-member profile page.
 *
 * Renders one TeamProfileCard at full width (large size) so deep-links like
 * /team/tony-locey resolve to a real page instead of 404'ing. Pulls from
 * the canonical ATHLYNX_TEAM roster so any roster edit on /team flows
 * straight through here.
 *
 * Brand-locked: cobalt #1E90FF + true black + white. No gold/yellow/orange.
 * Signoff: 
 */

import { Link, useRoute } from "wouter";
import { useEffect } from "react";
import TeamProfileCard, { ATHLYNX_TEAM } from "@/components/TeamProfileCard";

export default function TeamProfilePage() {
  const [, params] = useRoute<{ slug: string }>("/team/:slug");
  const slug = (params?.slug ?? "").toLowerCase();
  const profile = ATHLYNX_TEAM.find((p) => p.slug.toLowerCase() === slug);

  useEffect(() => {
    if (profile) {
      document.title = `${profile.name} \u2014 AthlynX Team`;
    }
  }, [profile]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a1628] to-black text-white">
      <div className="mx-auto max-w-3xl px-5 py-10">
        {/* Brand strip */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/team" className="group flex items-center gap-3"
              data-testid="link-team-profile-back">
              <img
                src="/athlynx-icon-neon.jpg"
                alt="AthlynX"
                className="h-10 w-10 rounded-lg ring-1 ring-[#1E90FF]/40 transition group-hover:ring-[#1E90FF]"
              />
              <div>
                <div className="text-sm font-bold tracking-widest text-white">
                  AthlynX<span className="text-[#1E90FF]">XAI</span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#1E90FF]">
                  The Athlete's Playbook
                </div>
              </div>
            </Link>
          <div className="text-[10px] uppercase tracking-widest text-white/40">
            athlynx.ai/team/{slug || "\u2026"}
          </div>
        </div>

        {!profile ? (
          <div
            className="rounded-2xl border border-white/10 bg-black/60 p-8 text-center"
            data-testid="team-profile-not-found"
          >
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#1E90FF]">
              Team Member
            </div>
            <h1 className="mt-2 text-3xl font-black text-white">Not on the roster</h1>
            <p className="mt-3 text-sm text-white/65">
              We don't have a public profile for{" "}
              <span className="font-bold text-white">{slug || "this slug"}</span>.
              Head back to the team page to see the canonical roster.
            </p>
            <Link href="/team" className="mt-5 inline-block rounded-xl bg-[#1E90FF] px-5 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white hover:bg-[#0080FF]">
                View Full Team \u2192
              </Link>
          </div>
        ) : (
          <>
            <header className="mb-6">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#1E90FF] mb-2">
                AthlynX Team
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.05]">
                {profile.name}
              </h1>
              <p className="mt-2 text-sm text-white/60">{profile.tagline}</p>
            </header>

            <TeamProfileCard profile={profile} size="large" />

            <div className="mt-8 text-center">
              <Link href="/team" className="text-[11px] font-black uppercase tracking-[0.18em] text-white/60 hover:text-[#1E90FF]">
                  \u2190 Back to Full Team
                </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
