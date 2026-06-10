import { useState } from "react";

const proofItems = [
  "Short position-specific clips",
  "Current GPA and class year",
  "Height, weight, position, and handedness",
  "Verified game stats and season context",
  "Coach-ready profile link",
];

const playbookSections = [
  {
    title: "The Verification Gap",
    body: "Highlights get attention, but organized proof gets evaluated. Parents need a clean way to turn clips, measurables, grades, and timeline into one coach-ready profile.",
  },
  {
    title: "The Asset Vault",
    body: "Build one profile that contains the athlete's clips, stats, academics, measurables, contact rules, and recruiting goals without forcing coaches through scattered links.",
  },
  {
    title: "The Outreach Protocol",
    body: "Send short, useful coach messages that point to verified proof instead of long emails, oversized attachments, and random social feeds.",
  },
  {
    title: "The Parent's Role",
    body: "Track deadlines, update proof, help the athlete stay organized, and keep communication clean without taking over the athlete's voice.",
  },
];

const emailSequence = [
  {
    subject: "Your Baseball Recruiting Playbook is inside",
    timing: "Immediately after opt-in",
    action: "Claim Your Athlete's Profile",
  },
  {
    subject: "Coaches want proof, not mixtapes",
    timing: "3-4 days after delivery",
    action: "Upload First Proof Asset",
  },
  {
    subject: "The Coach-Ready check",
    timing: "7-10 days after delivery",
    action: "Book a Profile Evaluation",
  },
];

export default function BaseballRecruitingPlaybook() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.28),transparent_32%),linear-gradient(135deg,#020817_0%,#071a3f_52%,#020617_100%)]">
        <div className="absolute inset-0 opacity-20" aria-hidden="true">
          <div className="absolute right-[-120px] top-16 h-80 w-80 rounded-full bg-[#1E90FF] blur-3xl" />
          <div className="absolute bottom-[-160px] left-[-120px] h-96 w-96 rounded-full bg-blue-700 blur-3xl" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-[#1E90FF]/30 bg-[#1E90FF]/20 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-[#00C2FF]">
              The Smith Standard Playbook 1.0
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
              High School Baseball Recruiting Playbook for Parents
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100/85">
              A coach-ready guide for turning game clips, grades, stats, and measurables into organized proof. Built for families that need a clear path from visibility to evaluation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#request-playbook" className="rounded-xl bg-cyan-300 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-[#1E90FF]">
                Request the Playbook
              </a>
              <a href="#proof-system" className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-black text-white transition hover:bg-white/15">
                See the Proof System
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="overflow-hidden rounded-[1.5rem] border border-[#1E90FF]/30 bg-[#04152e]">
              <img src="/images/athlete-focus.jpg" alt="Focused athlete preparing for competition" className="h-64 w-full object-cover opacity-90" />
              <div className="p-6">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#00C2FF]">Proof before outreach</p>
                <h2 className="mt-3 text-3xl font-black leading-tight">Coaches need a link they can scan in two minutes.</h2>
                <p className="mt-4 text-sm leading-6 text-blue-100/75">
                  The Playbook turns scattered assets into a clean recruiting profile plan: clips, academics, measurables, schedule, and next action.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="proof-system" className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#00C2FF]">The Smith Standard</p>
            <h2 className="mt-3 text-3xl font-black">No generic recruiting content.</h2>
            <p className="mt-4 text-base leading-7 text-blue-100/75">
              Every AthlynXAI playbook must be athlete-led, proof-based, mobile-first, and tied to one clear action. This page is a lead engine, not a brochure.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {proofItems.map((item) => (
              <div key={item} className="rounded-2xl border border-[#1E90FF]/30 bg-[#061633] p-5">
                <div className="mb-3 h-1.5 w-12 rounded-full bg-cyan-300" />
                <h3 className="font-black text-white">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#00C2FF]">Inside Playbook 1.0</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-black">A parent-friendly path from scattered clips to coach-ready proof.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {playbookSections.map((section) => (
              <article key={section.title} className="rounded-2xl border border-white/10 bg-[#061633] p-5 shadow-xl shadow-black/20">
                <h3 className="text-lg font-black text-[#00C2FF]">{section.title}</h3>
                <p className="mt-3 text-sm leading-6 text-blue-100/75">{section.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="request-playbook" className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-3xl border border-[#1E90FF]/30 bg-gradient-to-br from-[#071b42] to-[#031026] p-6 md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#00C2FF]">Request the Playbook</p>
          <h2 className="mt-3 text-3xl font-black">Start with the proof your athlete already has.</h2>
          <p className="mt-4 text-base leading-7 text-blue-100/75">
            This preview form shows the approved capture path. Live CRM writes and email automation stay behind a separate approval gate.
          </p>

          <form className="mt-8 grid gap-4" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-blue-100/45" placeholder="Parent or athlete name" aria-label="Parent or athlete name" />
              <input className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-blue-100/45" placeholder="Email" aria-label="Email" type="email" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-blue-100/45" placeholder="Role: parent or athlete" aria-label="Role" />
              <input className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-blue-100/45" placeholder="Graduation year" aria-label="Graduation year" />
            </div>
            <button type="submit" className="rounded-xl bg-cyan-300 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-[#1E90FF]">
              Request the Playbook
            </button>
          </form>
          {submitted && (
            <div className="mt-5 rounded-2xl border border-[#1E90FF]/30 bg-[#1E90FF]/20 p-4 text-sm font-bold text-[#00C2FF]">
              Preview captured. Next approved build step: connect this form to CRM tokens and approved follow-up queues.
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#00C2FF]">CRM-ready sequence</p>
          <h2 className="mt-3 text-2xl font-black">One action per message.</h2>
          <div className="mt-6 space-y-4">
            {emailSequence.map((email, index) => (
              <div key={email.subject} className="rounded-2xl border border-white/10 bg-[#061633] p-4">
                <div className="text-sm font-black text-[#00C2FF]">Email {index + 1} · {email.timing}</div>
                <h3 className="mt-2 font-black text-white">{email.subject}</h3>
                <p className="mt-2 text-sm leading-6 text-blue-100/70">CTA: {email.action}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs leading-5 text-blue-100/55">
            Emails are approved as content inputs only. No messages send until Chad approves live automation.
          </p>
        </div>
      </section>
    </main>
  );
}
