import { Link } from "wouter";
import UnifiedNav from "@/components/UnifiedNav";
import UnifiedFooter from "@/components/UnifiedFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppWindow, Archive, Bot, ClipboardCheck, Database, Lock, Radio, ShieldCheck, UserCheck, Workflow } from "lucide-react";

const appLayers = [
  {
    title: "Athlete NIL profile",
    icon: UserCheck,
    status: "Live foundation",
    copy: "The athlete profile is the Name, Image, and Likeness record. It starts private, verifies media and facts, then publishes only approved content.",
    route: "/real-athlete-profile-flow",
  },
  {
    title: "Athlete NIL intake",
    icon: ClipboardCheck,
    status: "Live intake",
    copy: "The intake form captures identity, sport, guardian review, consent, media status, and review packet data before public use.",
    route: "/athlete-nil-intake",
  },
  {
    title: "Private media vault",
    icon: Archive,
    status: "Live rules",
    copy: "Photos, videos, screenshots, app proof, documents, and sensitive story notes enter private first and earn public placement only after review.",
    route: "/media-vault-rules",
  },
  {
    title: "Coach onboarding",
    icon: Bot,
    status: "Live prompts",
    copy: "Coach guides athletes through setup, story boundaries, verification, NIL readiness, recruiting, and approved distribution.",
    route: "/coach-onboarding",
  },
  {
    title: "AthlynXAI OS",
    icon: Workflow,
    status: "Live operating layer",
    copy: "The OS ties Founder proof profile, NIL profiles, Coach, media vault, apps inventory, AXN, podcast, and connector proof into one production lane.",
    route: "/athlynxai-os",
  },
  {
    title: "AXN and media distribution",
    icon: Radio,
    status: "Controlled rail",
    copy: "Approved athlete stories, shows, podcast material, recruiting packets, and NIL content can move into distribution only after vault and consent gates pass.",
    route: "/media-os",
  },
];

const privacyRules = [
  "Raw app screenshots are private operational proof. They are not public production assets by default.",
  "Serial numbers, device identifiers, account details, setup screens, QR codes, and private proof values must never appear publicly.",
  "When app proof is needed publicly, AthlynXAI publishes a redacted brand-safe summary, not the raw image.",
  "Every app lane must connect back to the athlete NIL record, the private media vault, and the deployment proof log.",
];

const ecosystemRails = [
  ["Profile rail", "NIL intake, real athlete profile flow, Founder proof profile, public profile publishing states."],
  ["Media rail", "Private vault, highlight film, interviews, podcast, AXN, The Athlete Playbook, approved social distribution."],
  ["Coach rail", "Prompt library, sensitive-story boundaries, verification questions, NIL and recruiting guidance."],
  ["Ops rail", "GitHub commits, Vercel deployments, connector proof, database and storage readiness, live route verification."],
  ["Privacy rail", "Consent, guardian review, redaction, private identifiers, screenshot safety, sensitive-story controls."],
  ["Business rail", "Brand-safe NIL packets, recruiting value, approved partnership material, app ecosystem visibility."],
];

export default function AthlynXAIAppsEcosystem() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white">
      <UnifiedNav />
      <main className="px-4 pb-16 pt-24 md:px-6">
        <section className="mx-auto max-w-6xl">
          <div className="rounded-[2rem] border border-cyan-400/20 bg-white/[0.04] p-6 shadow-2xl shadow-cyan-950/30 md:p-10">
            <Badge className="mb-4 border-cyan-400/30 bg-cyan-400/10 text-cyan-200">
              <AppWindow className="mr-2 h-3.5 w-3.5" /> AthlynXAI apps ecosystem
            </Badge>
            <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
              The apps are real. The public view stays privacy-safe.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
              AthlynXAI OS treats the submitted app screenshots as private app inventory and device-proof references. The public ecosystem page shows the live product rails, not raw screenshots, serial numbers, account details, or private setup images.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/athlynxai-os">
                <Button className="bg-cyan-400 font-black text-slate-950 hover:bg-cyan-300">Open AthlynXAI OS</Button>
              </Link>
              <Link href="/athlete-nil-intake">
                <Button variant="outline" className="border-cyan-400/40 text-cyan-200 hover:bg-cyan-400/10">Start NIL intake</Button>
              </Link>
              <Link href="/media-vault-rules">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">Review vault rules</Button>
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {appLayers.map((app) => {
              const Icon = app.icon;
              return (
                <Card key={app.title} className="border-white/10 bg-white/[0.04]">
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-3 text-cyan-200">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">{app.status}</span>
                    </div>
                    <h2 className="text-2xl font-black text-white">{app.title}</h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-white/65">{app.copy}</p>
                    <Link href={app.route}>
                      <Button variant="outline" className="mt-5 w-full border-cyan-400/35 text-cyan-200 hover:bg-cyan-400/10">Open rail</Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <Card className="border-cyan-400/20 bg-cyan-400/[0.06]">
              <CardContent className="p-6 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <ShieldCheck className="h-7 w-7 text-cyan-300" />
                  <div>
                    <h2 className="text-3xl font-black text-white">Public app proof rules</h2>
                    <p className="text-sm text-white/55">Show product reality without exposing private proof.</p>
                  </div>
                </div>
                <div className="grid gap-3">
                  {privacyRules.map((rule) => (
                    <div key={rule} className="rounded-2xl border border-white/10 bg-slate-950/55 p-4 text-sm leading-relaxed text-white/70">
                      {rule}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.04]">
              <CardContent className="p-6 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Database className="h-7 w-7 text-cyan-300" />
                  <div>
                    <h2 className="text-3xl font-black text-white">Connected rails</h2>
                    <p className="text-sm text-white/55">Each app lane feeds the same operating system.</p>
                  </div>
                </div>
                <div className="grid gap-3">
                  {ecosystemRails.map(([title, copy]) => (
                    <div key={title} className="rounded-2xl border border-white/10 bg-slate-950/55 p-4">
                      <div className="font-black text-cyan-200">{title}</div>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">{copy}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6 border-white/10 bg-white/[0.04]">
            <CardContent className="grid gap-5 p-6 md:grid-cols-3 md:p-8">
              <ProofTile icon={Lock} title="No raw private screenshots" copy="The public page describes app rails and proof states without exposing source captures." />
              <ProofTile icon={Radio} title="Live product map" copy="Each rail links to a deployed route or controlled operating surface." />
              <ProofTile icon={ShieldCheck} title="Serial-safe doctrine" copy="Device proof remains private. Public summaries stay redacted, audited, and brand-safe." />
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
    <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-5">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-200">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-black text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/60">{copy}</p>
    </div>
  );
}
