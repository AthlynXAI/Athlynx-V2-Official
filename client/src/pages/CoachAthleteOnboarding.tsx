import { Link } from "wouter";
import UnifiedNav from "@/components/UnifiedNav";
import UnifiedFooter from "@/components/UnifiedFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ClipboardCheck, FileCheck, Lock, MessageSquare, ShieldCheck, Target, UserCheck, Workflow } from "lucide-react";

const coachPrinciples = [
  {
    title: "Ask before using the story",
    copy: "Coach must treat every athlete story as private until the athlete or guardian approves public use. Sensitive context is not entertainment or marketing bait.",
  },
  {
    title: "Separate facts from feelings",
    copy: "Coach helps athletes record verified facts, media, stats, and school data separately from personal notes about pressure, injury, recovery, alcohol, drugs, gambling, burnout, and purpose.",
  },
  {
    title: "Build the profile in layers",
    copy: "Coach moves the athlete from intake to vault, verification, profile approval, NIL readiness, recruiting packet, and distribution only when each gate is clean.",
  },
  {
    title: "Keep the athlete in control",
    copy: "Coach never publishes, pitches, or distributes private material without the athlete’s approved Name, Image, and Likeness consent path.",
  },
];

const promptGroups = [
  {
    title: "Start the athlete record",
    icon: UserCheck,
    prompts: [
      "What name should appear publicly on your athlete profile, and what legal name should remain in the private review record?",
      "Which sport, position, school, class year, and team details should Coach verify first?",
      "Are you a minor, and if so, who must review and approve the public profile?",
    ],
  },
  {
    title: "Collect media safely",
    icon: ClipboardCheck,
    prompts: [
      "Upload the photo, highlight film, game clip, or document you want reviewed. Coach will keep it private until approval.",
      "Does this media include another person, private device information, account details, or anything that needs redaction before public use?",
      "Should this asset be profile-ready, recruiting-only, NIL-only, private-only, or held for later review?",
    ],
  },
  {
    title: "Handle hard parts with respect",
    icon: Lock,
    prompts: [
      "Is there part of your athlete journey involving injury, pressure, alcohol, drugs, gambling, burnout, or recovery that Coach should understand but keep private?",
      "If you want to share a hard part publicly, what exact words are approved and what must stay private?",
      "What helped you find purpose again, and how should Coach frame that without making you the story in a way you did not approve?",
    ],
  },
  {
    title: "Verify the profile",
    icon: FileCheck,
    prompts: [
      "Which stats, measurements, positions, awards, school details, or offers have source proof?",
      "Which claims should be marked verified, pending, private, or removed before public profile approval?",
      "What should a coach, scout, brand, or parent know first when they open your profile?",
    ],
  },
  {
    title: "Prepare NIL and recruiting use",
    icon: Target,
    prompts: [
      "What brand categories fit your values, sport, location, and family boundaries?",
      "What recruiting or NIL opportunities should Coach prepare without sending anything publicly yet?",
      "Should this profile be approved for profile only, recruiting packet, NIL outreach, AXN, The Athlete Playbook, or social distribution?",
    ],
  },
];

const coachActions = [
  ["Intake Coach", "Walks the athlete through identity, sport, position, school, guardian, and consent fields."],
  ["Vault Coach", "Classifies media as private, needs redaction, consent pending, verified, or distribution approved."],
  ["Story Coach", "Helps athletes talk about the full truth without exposing private or sensitive details without permission."],
  ["NIL Coach", "Turns approved profile facts into NIL positioning, brand-fit language, and outreach-ready copy."],
  ["Recruiting Coach", "Prepares verified coach packets, school-fit notes, film context, and profile summary language."],
  ["Distribution Coach", "Routes only approved content into profile, recruiting, AXN, The Athlete Playbook, and social lanes."],
];

export default function CoachAthleteOnboarding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white">
      <UnifiedNav />
      <main className="px-4 pb-16 pt-24 md:px-6">
        <section className="mx-auto max-w-6xl">
          <div className="rounded-[2rem] border border-cyan-400/20 bg-white/[0.04] p-6 shadow-2xl shadow-cyan-950/30 md:p-10">
            <Badge className="mb-4 border-cyan-400/30 bg-cyan-400/10 text-cyan-200">
              <MessageSquare className="mr-2 h-3.5 w-3.5" /> Coach onboarding prompts
            </Badge>
            <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
              Coach guides the athlete from private truth to approved public profile.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
              Coach is the built-in AthlynXAI assistant for athlete setup. It helps every athlete build a real Name, Image, and Likeness record, protect sensitive parts of the story, verify media and facts, and move only approved content into public profile, recruiting, NIL, and media lanes.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/athlete-nil-intake">
                <Button className="bg-cyan-400 font-black text-slate-950 hover:bg-cyan-300">Start NIL intake</Button>
              </Link>
              <Link href="/real-athlete-profile-flow">
                <Button variant="outline" className="border-cyan-400/40 text-cyan-200 hover:bg-cyan-400/10">View profile flow</Button>
              </Link>
              <Link href="/media-vault-rules">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">Review vault rules</Button>
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {coachPrinciples.map((item) => (
              <Card key={item.title} className="border-white/10 bg-white/[0.04]">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-3 text-cyan-200">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-black text-white">{item.title}</h2>
                  </div>
                  <p className="text-sm leading-relaxed text-white/70">{item.copy}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6 border-white/10 bg-white/[0.04]">
            <CardContent className="p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <BookOpen className="h-7 w-7 text-cyan-300" />
                <div>
                  <h2 className="text-3xl font-black text-white">Prompt library</h2>
                  <p className="text-sm text-white/55">Coach prompts are direct, consent-first, and built for real athlete records.</p>
                </div>
              </div>
              <div className="grid gap-5">
                {promptGroups.map((group) => {
                  const Icon = group.icon;
                  return (
                    <div key={group.title} className="rounded-2xl border border-white/10 bg-slate-950/55 p-5">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-2 text-cyan-200">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-black text-white">{group.title}</h3>
                      </div>
                      <div className="grid gap-3 md:grid-cols-3">
                        {group.prompts.map((prompt) => (
                          <div key={prompt} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-white/70">
                            {prompt}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 border-cyan-400/20 bg-cyan-400/[0.06]">
            <CardContent className="p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <Workflow className="h-7 w-7 text-cyan-300" />
                <div>
                  <h2 className="text-3xl font-black text-white">Coach action lanes</h2>
                  <p className="text-sm text-white/55">Each lane is a controlled step in the athlete profile operating system.</p>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {coachActions.map(([title, copy]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-slate-950/55 p-5">
                    <div className="font-black text-cyan-200">{title}</div>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">{copy}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      <UnifiedFooter />
    </div>
  );
}
