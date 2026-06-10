import { Link } from "wouter";

const pillars = [
  {
    title: "Universal Sports Search",
    body: "A single search entry point for athletes, schools, teams, film, NIL opportunities, schedules, camps, and transfer-readiness signals.",
  },
  {
    title: "AthlynXAI Assist",
    body: "A visible AI mode that explains recruiting gaps, summarizes profile evidence, prepares coach-ready packets, and keeps the user in control.",
  },
  {
    title: "Evidence Labels",
    body: "Role-based provenance for athlete self-reports, parent or guardian information, coach notes, verified school data, public stats, film evidence, trainers, and platform AI summaries.",
  },
  {
    title: "Recruiting Discovery Feed",
    body: "A practical discovery layer for film drops, offers, camps, NIL readiness, school interest, schedule activity, and transfer-readiness updates.",
  },
];

const labels = [
  ["Athlete Self-Reported", "Profile details, goals, bio, interests, and preferred position."],
  ["Parent / Guardian", "Youth-athlete approvals, contact rules, and family-controlled preferences."],
  ["Verified School", "Roster, eligibility, enrollment, and approved school or team data."],
  ["Coach Note", "Coach evaluations, contact history, interest level, and recruiting context."],
  ["Public Stat", "Publicly available stats, schedules, rankings, and measurable performance."],
  ["Film Evidence", "Uploaded or embedded recruiting video, highlights, and position-specific plays."],
  ["Platform AI Summary", "AthlynXAI-generated explanation tied back to visible supporting evidence."],
  ["Admin Verified", "Identity, legitimacy, and sensitive corrections reviewed by platform operations."],
];

const roadmap = [
  ["Phase 1", "Launch Universal Search Hub, Evidence Label chips, and AthlynXAI Assist toggle."],
  ["Phase 2", "Add Recruiting Consensus panels, Vimeo-backed film evidence cards, and profile gap reports."],
  ["Phase 3", "Add coach packet sharing, discovery topic cards, NIL readiness, and transfer-readiness flows."],
];

export default function AthlynXAITrustSearchBlueprint() {
  return (
    <main className="min-h-screen bg-[#030817] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.35),transparent_35%),linear-gradient(135deg,#030817_0%,#061a3d_52%,#020617_100%)]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="mb-6 inline-flex rounded-full border border-[#1E90FF]/30 bg-[#1E90FF]/20 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-[#00C2FF]">
            AthlynXAI Trust Search Blueprint
          </div>
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            AI recruiting intelligence built around search, evidence, and athlete opportunity.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100/85">
            AthlynXAI is moving toward a trust-first discovery model: athletes, families, coaches, and partners can search, compare, verify, and act from one connected platform. The approach borrows the useful architecture of search-first discovery and applies it strictly to sports, recruiting, film, NIL, schedules, and transfer readiness.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/browse-athletes">
              <a className="rounded-xl bg-[#1E90FF] px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-[#1E90FF]">
                Browse Athletes
              </a>
            </Link>
            <Link href="/ai-recruiter">
              <a className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15">
                Open AI Recruiter
              </a>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-4 md:grid-cols-4">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20">
              <h2 className="text-lg font-black text-[#00C2FF]">{pillar.title}</h2>
              <p className="mt-3 text-sm leading-6 text-blue-100/75">{pillar.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#00C2FF]">The trust rule</p>
            <h2 className="mt-3 text-3xl font-black">If AthlynXAI says it, the user should be able to see what supports it.</h2>
            <p className="mt-4 text-base leading-7 text-blue-100/75">
              AI can summarize, but evidence must stay visible. AthlynXAI should show whether a claim came from an athlete, parent, coach, school, public source, film upload, trainer, platform AI, or admin review.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {labels.map(([title, body]) => (
              <div key={title} className="rounded-xl border border-white/10 bg-[#061633] p-4">
                <h3 className="font-black text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-blue-100/70">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="rounded-3xl border border-blue-400/20 bg-gradient-to-br from-[#071b42] to-[#031026] p-6 md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#00C2FF]">Build path</p>
          <h2 className="mt-3 text-3xl font-black">From blueprint to product without disrupting the store cycle.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {roadmap.map(([phase, body]) => (
              <div key={phase} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="text-sm font-black text-[#00C2FF]">{phase}</div>
                <p className="mt-3 text-sm leading-6 text-blue-100/75">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black">Non-political boundary</h2>
          <p className="mt-3 text-base leading-7 text-blue-100/75">
            This strategy does not copy political labels, partisan framing, culture-war topics, or ideology scoring. It translates the proven product architecture of search, AI explanation, source transparency, and discovery into athlete recruiting intelligence.
          </p>
        </div>
      </section>
    </main>
  );
}
