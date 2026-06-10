import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Link } from "wouter";

const lanes = [
  {
    name: "The Athlete’s Playbook Podcast",
    owner: "Chad Allen Dozier Sr.",
    operator: "Lee",
    proof: "Spotify for Creators show exists under contact@athlynx.ai",
    status: "Canonical podcast lane",
    rails: "Spotify, Spotify for Creators, RSS, AXN clips, social cuts",
  },
  {
    name: "Suno Music + Beds",
    owner: "Chad Allen Dozier Sr.",
    operator: "Lee",
    proof: "Suno profile @chaddozier75 with AthlynXAI / Athlete’s Playbook branding",
    status: "Music-generation lane",
    rails: "Podcast beds, reel beds, AXN intros, social soundtrack packages",
  },
  {
    name: "AXN Streaming Network",
    owner: "Chad Allen Dozier Sr.",
    operator: "Lee",
    proof: "Owned network layer for shows, seasons, episodes, clips, athletes, and sports categories",
    status: "Streaming-network lane",
    rails: "AXN show pages, episode pages, clips, athlete stories, multi-sport programming",
  },
  {
    name: "Social Distribution",
    owner: "Chad Allen Dozier Sr.",
    operator: "Lee",
    proof: "Connector checkpoint required before every external post or upload",
    status: "Queue-first distribution lane",
    rails: "LinkedIn, Instagram, Facebook, TikTok, YouTube, Buffer/Zapier fallback only",
  },
  {
    name: "Free Entry + Credits",
    owner: "Chad Allen Dozier Sr.",
    operator: "Lee",
    proof: "No athlete denied basic access; tiers and credits fund premium OS services",
    status: "Access and monetization lane",
    rails: "Free profiles, paid tiers, AI/media credits, B2B licensing, premium campaigns",
  },
];

const layers = [
  ["Create", "Lee prepares video, audio, Suno prompts, captions, thumbnails, show notes, and post copy."],
  ["Vault", "Every master, draft, transcript, caption, thumbnail, Suno export, and episode package gets a durable source-of-truth record."],
  ["Quality Gate", "Video, audio, diversity, accessibility, metadata, rights, brand voice, and platform-readiness are checked before approval."],
  ["Approval", "Lee submits. Chad approves, rejects, requests revisions, or triggers emergency hold."],
  ["Queue", "Draft, pending review, approved, scheduled, posting, posted, failed, retrying, and manual-intervention states are visible."],
  ["Connector Check", "No external publishing, upload, automation, or sync happens until the exact connector is visibly ON and passes a harmless live check."],
  ["Distribute", "Spotify, Spotify for Creators, AXN, social networks, Buffer, and Zapier are rails. AthlynXAI OS remains the brain."],
  ["Proof", "Published URLs, platform IDs, screenshots, analytics snapshots, proof links, and operator notes are recorded."],
  ["Watchdog", "The system flags stale proofs, failed posts, stuck approvals, missing analytics, dropped media, or connector failures."],
  ["Access", "Athletes enter free; premium tiers and credits activate advanced AI, media, recruiting, analytics, and service workflows."],
];

const qualityGates = [
  "Audio mastered near -16 LUFS stereo; echo and room noise removed before approval.",
  "Video uses professional sports-documentary pacing, clean captions, strong thumbnails, and platform-specific aspect ratios.",
  "Every video and podcast package represents the full multi-sport ecosystem and diverse athletes where visuals are used.",
  "Suno tracks require prompt, version, rights note, export type, reuse notes, and Chad approval before production use.",
  "Spotify and Spotify for Creators updates require episode metadata, artwork, show notes, transcript, release date, and proof URL tracking.",
  "Investor, legal, private founder, or strategic-partner-sensitive content cannot enter public distribution without explicit review.",
];

const queueStates = ["Draft", "Lee Review", "Needs Fix", "Pending Chad", "Approved", "Scheduled", "Connector Blocked", "Posted", "Failed", "Retrying", "Manual Intervention"];

export default function MediaOS() {
  return (
    <PlatformLayout>
      <main className="min-h-screen bg-[#061426] text-white pb-24">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          <div className="rounded-3xl border border-cyan-400/25 bg-gradient-to-br from-[#071d36] via-[#0b2a55] to-[#071426] p-6 sm:p-8 shadow-2xl shadow-cyan-950/40">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
              <div>
                <p className="text-cyan-300 text-xs font-black tracking-[0.25em] uppercase">AthlynXAI OS</p>
                <h1 className="mt-3 text-3xl sm:text-5xl font-black leading-tight">Full-Stack Media Layer Cake</h1>
                <p className="mt-4 max-w-3xl text-blue-100 text-base sm:text-lg leading-relaxed">
                  The owned operating system for The Athlete’s Playbook Podcast, Spotify for Creators, Suno music, AXN streaming, fail-proof social distribution, and the free-entry plus tiers/credits model. External platforms are rails. AthlynXAI OS is the source of truth.
                </p>
              </div>
              <div className="rounded-2xl bg-black/25 border border-white/10 p-4 min-w-[260px]">
                <div className="text-xs uppercase tracking-wide text-blue-300 font-bold">Control Model</div>
                <div className="mt-2 text-sm text-white/85 leading-relaxed">
                  <strong>Lee:</strong> primary day-to-day operator.<br />
                  <strong>Chad:</strong> owner, final approver, emergency override.
                </div>
              </div>
            </div>
          </div>

          <section className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {lanes.map((lane) => (
              <article key={lane.name} className="rounded-2xl border border-blue-500/25 bg-[#0c2444] p-5 shadow-xl">
                <div className="text-cyan-300 text-xs font-black uppercase tracking-widest">{lane.status}</div>
                <h2 className="mt-2 text-xl font-black">{lane.name}</h2>
                <p className="mt-3 text-sm text-blue-100 leading-relaxed">{lane.proof}</p>
                <div className="mt-4 space-y-2 text-xs text-blue-200">
                  <div><span className="text-white font-bold">Operator:</span> {lane.operator}</div>
                  <div><span className="text-white font-bold">Owner:</span> {lane.owner}</div>
                  <div><span className="text-white font-bold">Rails:</span> {lane.rails}</div>
                </div>
              </article>
            ))}
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#081a31] p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <h2 className="text-2xl font-black">No-Drop Workflow</h2>
                <p className="text-sm text-blue-300 mt-1">Create → Vault → Quality → Approval → Queue → Connector Check → Distribution → Proof → Watchdog.</p>
              </div>
              <Link href="/social-os">
                <span className="inline-flex rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#04111f] font-black px-4 py-3 cursor-pointer">Open Social OS</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {layers.map(([title, body], index) => (
                <div key={title} className="rounded-2xl bg-white/[0.04] border border-white/10 p-4">
                  <div className="text-cyan-300 text-xs font-black">Layer {index + 1}</div>
                  <div className="text-lg font-black mt-1">{title}</div>
                  <p className="text-sm text-blue-100 mt-2 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="rounded-3xl border border-white/10 bg-[#0c2444] p-5 sm:p-6">
              <h2 className="text-2xl font-black">Professional Quality Gates</h2>
              <div className="mt-4 space-y-3">
                {qualityGates.map((gate) => (
                  <div key={gate} className="rounded-xl bg-black/20 border border-white/10 p-3 text-sm text-blue-100 leading-relaxed">{gate}</div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#0c2444] p-5 sm:p-6">
              <h2 className="text-2xl font-black">Queue States</h2>
              <p className="text-sm text-blue-300 mt-2">Every item must be visible. Nothing should disappear between production, approval, posting, and proof.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {queueStates.map((state) => (
                  <span key={state} className="rounded-full border border-cyan-400/25 bg-cyan-400/10 text-cyan-100 px-3 py-2 text-xs font-bold">{state}</span>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-red-950/30 border border-red-400/25 p-4">
                <div className="text-red-200 font-black">External Action Gate</div>
                <p className="text-sm text-red-100/90 mt-2 leading-relaxed">No Spotify upload, Suno publish, Buffer/Zapier action, social post, storage sync, or automation runs unless that exact connector is visibly ON, authenticated, and verified with a harmless live check.</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-[#08213f] to-[#061426] p-5 sm:p-6">
            <h2 className="text-2xl font-black">Free Access + Premium OS Model</h2>
            <p className="mt-3 text-blue-100 leading-relaxed max-w-4xl">
              AthlynXAI is designed so athletes can enter the network without being denied access because of cost. Free profiles and discovery build the athlete community, while paid OS tiers and credits unlock premium media production, AI tools, recruiting intelligence, NIL campaign workflows, analytics, brand kits, and service-heavy work. Free builds the crowd; tiers and credits monetize the machine.
            </p>
          </section>

          <section className="rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-[#08213f] to-[#061426] p-5 sm:p-6">
            <h2 className="text-2xl font-black">AXN Network Positioning</h2>
            <p className="mt-3 text-blue-100 leading-relaxed max-w-4xl">
              AXN is the media-network layer of the stack. It organizes shows, seasons, episodes, clips, athletes, sports categories, and live or recorded programming. The Athlete’s Playbook is the first anchor lane, while Suno provides soundtrack and music-bed capacity and Spotify for Creators provides the podcast distribution lane.
            </p>
          </section>
        </section>
        <MobileBottomNav />
      </main>
    </PlatformLayout>
  );
}
