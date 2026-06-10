import { Link } from "wouter";
import UnifiedNav from "@/components/UnifiedNav";
import UnifiedFooter from "@/components/UnifiedFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Archive, FileCheck, Lock, ShieldCheck, UserCheck, Video, Database, EyeOff } from "lucide-react";

const assetClasses = [
  {
    title: "Athlete media",
    icon: Video,
    rule: "Photos, highlight film, practice clips, interviews, voice notes, game documents, and family-submitted material enter the vault as source evidence first.",
    publicUse: "May become public only after athlete or guardian consent, source review, and placement approval.",
  },
  {
    title: "Screenshots and app proof",
    icon: Archive,
    rule: "Screenshots prove workflow state, app inventory, device setup, or platform evidence. They are not public production assets by default.",
    publicUse: "If needed publicly, rebuild as a redacted branded graphic with private identifiers removed.",
  },
  {
    title: "Private identifiers",
    icon: EyeOff,
    rule: "Serial numbers, device IDs, account IDs, license keys, QR codes, medical identifiers, and private contact details stay private.",
    publicUse: "Never publish raw values. Use privacy-safe language such as Private Serial Redacted or Device-Proof Reference.",
  },
  {
    title: "Sensitive athlete truth",
    icon: Lock,
    rule: "Injuries, pressure, alcohol, drugs, gambling, burnout, recovery, family context, and mental health notes belong in controlled privacy tiers.",
    publicUse: "Public use requires explicit athlete or guardian approval and must never sensationalize the athlete.",
  },
];

const workflow = [
  ["Receive", "Source enters AthlynXAI OS as private evidence with owner, athlete, source type, and received date."],
  ["Classify", "The vault labels the asset as public-ready, private-only, needs consent, needs redaction, or verified data needed."],
  ["Verify", "Coach or an approved operator checks identity, rights, facts, sport context, guardian status, and private identifiers."],
  ["Approve", "The athlete, guardian when required, Chad, or the assigned operator approves public placement before use."],
  ["Publish", "Approved assets may feed athlete profiles, NIL packets, recruiting cards, AXN, The Athlete Playbook, and social distribution."],
  ["Prove", "The OS records route, timestamp, commit, deployment, consent state, and audit proof for every public use."],
];

const vaultStatuses = [
  { status: "Private source evidence", meaning: "Stored for proof and review only. Not public." },
  { status: "Needs redaction", meaning: "Contains private identifiers, faces, account data, device data, or sensitive context requiring cleanup." },
  { status: "Consent required", meaning: "Cannot be published until athlete or guardian approval is recorded." },
  { status: "Verified data needed", meaning: "Claim or stat exists, but source proof has not been uploaded or reviewed." },
  { status: "Approved for profile", meaning: "May appear on the athlete NIL profile in the approved context." },
  { status: "Approved for distribution", meaning: "May be packaged for AXN, The Athlete Playbook, social, recruiting, or NIL outreach after final review." },
];

const proofFields = [
  "Athlete or owner name",
  "Asset source and received date",
  "Sport, team, era, and profile placement",
  "Consent and guardian status",
  "Private identifier scan status",
  "Verification status and reviewer",
  "Approved route or distribution channel",
  "Commit, deployment, URL, and audit timestamp",
];

export default function PrivateMediaVaultRules() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white">
      <UnifiedNav />
      <main className="px-4 pb-16 pt-24 md:px-6">
        <section className="mx-auto max-w-6xl">
          <div className="rounded-[2rem] border border-cyan-400/20 bg-white/[0.04] p-6 shadow-2xl shadow-cyan-950/30 md:p-10">
            <Badge className="mb-4 border-cyan-400/30 bg-cyan-400/10 text-cyan-200">
              <ShieldCheck className="mr-2 h-3.5 w-3.5" /> Private media vault rules
            </Badge>
            <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
              Real athlete media enters private first, then earns public placement.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
              AthlynXAI OS treats every photo, video, screenshot, document, app proof, and athlete story as source evidence before it becomes public content. The vault protects private identifiers, consent, minors, sensitive truth, and the athlete’s Name, Image, and Likeness record.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/athlete-nil-intake">
                <Button className="bg-cyan-400 font-black text-slate-950 hover:bg-cyan-300">Start NIL intake</Button>
              </Link>
              <Link href="/athlynxai-os">
                <Button variant="outline" className="border-cyan-400/40 text-cyan-200 hover:bg-cyan-400/10">Open AthlynXAI OS</Button>
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {assetClasses.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="border-white/10 bg-white/[0.04]">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-3 text-cyan-200">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h2 className="text-2xl font-black text-white">{item.title}</h2>
                    </div>
                    <p className="text-sm leading-relaxed text-white/70">{item.rule}</p>
                    <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] p-4 text-sm leading-relaxed text-cyan-100">
                      {item.publicUse}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="mt-6 border-white/10 bg-white/[0.04]">
            <CardContent className="p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <FileCheck className="h-7 w-7 text-cyan-300" />
                <div>
                  <h2 className="text-3xl font-black text-white">Vault workflow</h2>
                  <p className="text-sm text-white/55">Every asset moves through a controlled proof path before public use.</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {workflow.map(([step, copy], index) => (
                  <div key={step} className="rounded-2xl border border-white/10 bg-slate-950/55 p-5">
                    <div className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-cyan-300">{String(index + 1).padStart(2, "0")}</div>
                    <h3 className="text-xl font-black text-white">{step}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">{copy}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <Card className="border-cyan-400/20 bg-cyan-400/[0.06]">
              <CardContent className="p-6 md:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <Database className="h-7 w-7 text-cyan-300" />
                  <h2 className="text-3xl font-black text-white">Required proof fields</h2>
                </div>
                <div className="grid gap-3">
                  {proofFields.map((field) => (
                    <div key={field} className="rounded-xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm font-semibold text-white/75">
                      {field}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.04]">
              <CardContent className="p-6 md:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <UserCheck className="h-7 w-7 text-cyan-300" />
                  <h2 className="text-3xl font-black text-white">Vault statuses</h2>
                </div>
                <div className="grid gap-3">
                  {vaultStatuses.map((item) => (
                    <div key={item.status} className="rounded-xl border border-white/10 bg-slate-950/55 p-4">
                      <div className="font-black text-cyan-200">{item.status}</div>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">{item.meaning}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <UnifiedFooter />
    </div>
  );
}
