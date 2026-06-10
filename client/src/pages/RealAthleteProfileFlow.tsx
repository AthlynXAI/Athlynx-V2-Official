import { Link } from "wouter";
import UnifiedNav from "@/components/UnifiedNav";
import UnifiedFooter from "@/components/UnifiedFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ClipboardCheck, FileCheck, Lock, Radio, ShieldCheck, UserCheck, Workflow, Eye, Send, Database } from "lucide-react";

const profileSections = [
  {
    title: "Identity and eligibility",
    status: "Consent locked",
    fields: ["Legal name", "Public display name", "Age band", "Guardian review if minor", "School or team", "Contact lane"],
  },
  {
    title: "Sport and position record",
    status: "Verification required",
    fields: ["Primary sport", "Positions", "Class year", "Height", "Weight", "Bats and throws when applicable", "Team or club"],
  },
  {
    title: "Media and story record",
    status: "Vault first",
    fields: ["Approved profile image", "Highlight film", "Practice clips", "Interview or story notes", "Sensitive topics privacy tier", "Public captions"],
  },
  {
    title: "NIL and recruiting value",
    status: "Review packet",
    fields: ["Name Image Likeness authorization", "Brand categories", "Recruiting status", "Offer or interest notes", "Distribution approvals", "Coach summary"],
  },
];

const lifecycle = [
  ["Intake", "Athlete, parent, coach, or operator starts the record through the real NIL intake form."],
  ["Vault", "Photos, videos, screenshots, documents, stats, and story notes enter private source control first."],
  ["Verify", "AthlynXAI checks consent, guardian status, identifiers, sport data, media rights, and sensitive-story boundaries."],
  ["Publish", "Only approved fields and assets become visible on the athlete profile, recruiting packet, or NIL profile."],
  ["Distribute", "Approved profile content can feed Coach, recruiting, NIL, AXN, The Athlete Playbook, and social distribution."],
  ["Audit", "Every public use keeps proof of route, source, consent, deployment, reviewer, and timestamp."],
];

const verificationStates = [
  { label: "Draft intake", meaning: "The athlete record exists only as a review packet. It is not public." },
  { label: "Consent pending", meaning: "The profile cannot publish until athlete and guardian requirements are satisfied." },
  { label: "Media review", meaning: "Source files are being checked for ownership, quality, private identifiers, and public suitability." },
  { label: "Stats review", meaning: "Sport claims and measurements need source confirmation or coach verification." },
  { label: "Profile approved", meaning: "The profile can appear publicly with approved fields, images, story sections, and NIL language." },
  { label: "Distribution approved", meaning: "The profile can move into recruiting packets, NIL outreach, Coach prompts, AXN, and The Athlete Playbook." },
];

const publicRules = [
  "A public athlete profile must never publish raw serial numbers, device identifiers, private account details, or unapproved screenshots.",
  "A public athlete profile must separate verified facts from athlete story notes, Coach guidance, and private recovery context.",
  "A public athlete profile must show the athlete as a whole person, not only as a highlight reel or stat sheet.",
  "A public athlete profile must keep the athlete in control of Name, Image, and Likeness use through consent and audit proof.",
];

export default function RealAthleteProfileFlow() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white">
      <UnifiedNav />
      <main className="px-4 pb-16 pt-24 md:px-6">
        <section className="mx-auto max-w-6xl">
          <div className="rounded-[2rem] border border-[#1E90FF]/30 bg-white/[0.04] p-6 shadow-2xl shadow-cyan-950/30 md:p-10">
            <Badge className="mb-4 border-[#1E90FF]/30 bg-[#1E90FF]/20 text-[#00C2FF]">
              <Workflow className="mr-2 h-3.5 w-3.5" /> Reusable NIL profile flow
            </Badge>
            <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
              One athlete record moves from private intake to verified public profile.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
              AthlynXAI uses one reusable profile flow for every athlete. The platform starts private, verifies the athlete’s Name, Image, and Likeness record, protects sensitive truth, and only publishes approved profile content after the correct consent and proof gates pass.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/athlete-nil-intake">
                <Button className="bg-[#1E90FF] font-black text-slate-950 hover:bg-[#1E90FF]">Start NIL intake</Button>
              </Link>
              <Link href="/media-vault-rules">
                <Button variant="outline" className="border-[#1E90FF]/30 text-[#00C2FF] hover:bg-[#1E90FF]/20">Review vault rules</Button>
              </Link>
              <Link href="/founder/chad-dozier">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">View proof profile</Button>
              </Link>
            </div>
          </div>

          <Card className="mt-6 border-white/10 bg-white/[0.04]">
            <CardContent className="p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <Database className="h-7 w-7 text-[#00C2FF]" />
                <div>
                  <h2 className="text-3xl font-black text-white">Profile data sections</h2>
                  <p className="text-sm text-white/55">Every public profile is built from the same verified record structure.</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {profileSections.map((section) => (
                  <div key={section.title} className="rounded-2xl border border-white/10 bg-slate-950/55 p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-xl font-black text-white">{section.title}</h3>
                      <span className="rounded-full border border-[#1E90FF]/30 bg-[#1E90FF]/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#00C2FF]">{section.status}</span>
                    </div>
                    <div className="grid gap-2">
                      {section.fields.map((field) => (
                        <div key={field} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/65">{field}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <Card className="border-white/10 bg-white/[0.04]">
              <CardContent className="p-6 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <ClipboardCheck className="h-7 w-7 text-[#00C2FF]" />
                  <h2 className="text-3xl font-black text-white">Lifecycle</h2>
                </div>
                <div className="grid gap-3">
                  {lifecycle.map(([stage, copy], index) => (
                    <div key={stage} className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/55 p-4 md:grid-cols-[4rem_1fr]">
                      <div className="text-xs font-black uppercase tracking-[0.22em] text-[#00C2FF]">{String(index + 1).padStart(2, "0")}</div>
                      <div>
                        <h3 className="text-lg font-black text-white">{stage}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-white/60">{copy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#1E90FF]/30 bg-[#1E90FF]/[0.06]">
              <CardContent className="p-6 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <ShieldCheck className="h-7 w-7 text-[#00C2FF]" />
                  <h2 className="text-3xl font-black text-white">Verification states</h2>
                </div>
                <div className="grid gap-3">
                  {verificationStates.map((state) => (
                    <div key={state.label} className="rounded-xl border border-white/10 bg-slate-950/55 p-4">
                      <div className="font-black text-[#00C2FF]">{state.label}</div>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">{state.meaning}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6 border-white/10 bg-white/[0.04]">
            <CardContent className="p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <Eye className="h-7 w-7 text-[#00C2FF]" />
                <div>
                  <h2 className="text-3xl font-black text-white">Public profile publishing rules</h2>
                  <p className="text-sm text-white/55">The profile is real only when the athlete record is protected, verified, and approved.</p>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {publicRules.map((rule) => (
                  <div key={rule} className="rounded-2xl border border-white/10 bg-slate-950/55 p-5 text-sm leading-relaxed text-white/70">
                    {rule}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 border-[#1E90FF]/30 bg-slate-950/70">
            <CardContent className="grid gap-5 p-6 md:grid-cols-4 md:p-8">
              <ProofTile icon={Lock} title="Private first" copy="Nothing public until the vault and consent gates pass." />
              <ProofTile icon={UserCheck} title="Athlete owned" copy="The athlete controls Name, Image, and Likeness use." />
              <ProofTile icon={FileCheck} title="Verified facts" copy="Stats, positions, school, media, and story claims are labeled by proof state." />
              <ProofTile icon={Send} title="Ready to distribute" copy="Approved profiles can feed recruiting, NIL, Coach, AXN, and The Athlete Playbook." />
            </CardContent>
          </Card>
        </section>
      </main>
      <UnifiedFooter />
    </div>
  );
}

function ProofTile({ icon: Icon, title, copy }: { icon: any; title: string; copy: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-[#1E90FF]/30 bg-[#1E90FF]/20 text-[#00C2FF]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-black text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/60">{copy}</p>
    </div>
  );
}
