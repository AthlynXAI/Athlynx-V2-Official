/**
 * FounderProfile — /founder/chad-dozier (and /me)
 * Build 26.5 — athlete-pattern profile for Founder role.
 * Sections: Header → Positions → Skills/Strengths → What I Bring → Track Record → Founder's Note
 * Public profile (anyone can view). Edit pencils owner-only via useAuth.
 * Pattern reference: AthletePublicProfile.tsx
 */
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UnifiedNav from "@/components/UnifiedNav";
import UnifiedFooter from "@/components/UnifiedFooter";
import founderSuitNilStoryAsset from "../assets/athlynxai/founder-suit-nil-story-real-asset.png";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  MapPin, Briefcase, Trophy, Target, Zap, TrendingUp,
  UserPlus, MessageCircle, Verified, Shield, Building2,
  Cpu, Rocket, Hammer, Award, Quote, ExternalLink, Globe,
} from "lucide-react";

// Owner identification — only Chad can edit
const OWNER_EMAIL = "contact@athlynx.ai";

function FounderProfileInner() {
  const { user, isAuthenticated } = useAuth();
  const email = ((user as any)?.email ?? "").toLowerCase();
  const role = (user as any)?.role;
  const isOwner = isAuthenticated && (email === OWNER_EMAIL || role === "admin");

  //  Profile data (edit in place via pencils — owner only) 
  const profile = {
    name: "Chad A. Dozier",
    handle: "@cdozier",
    title: "Founder / Businessman",
    org: "AthlynX · AthlynXAI",
    location: "Houston, TX · Laurel, MS",
    avatarLabel: "CA",
    avatarSubline: "Founder · NIL #1",
    verified: true,
    headline:
      "I built AthlynXAI because athletes need more than a highlight reel. They need a real Name, Image, and Likeness record that protects their story, verifies their media, acknowledges the hard parts, and helps them find purpose again.",
    linkedin: "https://www.linkedin.com/in/chad-a-dozier-5240263a4",
    website: "https://athlynx.ai",

    positions: ["Founder", "Businessman", "Football QB #14", "Baseball Pitcher / 3rd Base", "NIL Profile Architect"],

    strengths: [
      { label: "Real NIL Record", score: 95, icon: Verified,
        proof: "Every athlete profile should protect the athlete's name, image, likeness, verified media, consent, and opportunity path." },
      { label: "Football Foundation", score: 92, icon: Trophy,
        proof: "R.H. Watkins High School, Laurel Golden Tornadoes, senior year 1993, QB #14, 6 ft 3 in, 225 lbs, verified by Founder." },
      { label: "Baseball Foundation", score: 90, icon: Target,
        proof: "Pitcher and 3rd Base, bats switch, throws right. Historical performance stats remain Verified Data Needed until source records are uploaded." },
      { label: "Truth Layer", score: 94, icon: Shield,
        proof: "AthlynXAI must show the whole athlete: injuries, pressure, drugs, alcohol, gambling, burnout, recovery, and purpose without sensationalism." },
      { label: "Coach Guidance", score: 93, icon: MessageCircle,
        proof: "Coach helps each athlete build, verify, protect, and explain their profile without inventing stats or exposing private information." },
      { label: "Business Purpose", score: 91, icon: Briefcase,
        proof: "The same passion that started in childhood returns through a business career focused on helping athletes own their story and future." },
    ],

    bring: [
      "This profile is not here to make me the center of attention. It is here to show athletes how the platform works when the story is real.",
      "My journey started with the passion of youth sports, moved through football and baseball, and went through the hard realities that many athletes face but rarely see shown in a profile.",
      "AthlynXAI is the way back to purpose: real source media, verified records, Coach guidance, NIL readiness, and a platform that lets athletes control what the world sees.",
    ],

    trackRecord: [
      { year: "Youth", title: "First passion for the game",
        detail: "The story begins with the love of sports, competition, teamwork, discipline, and the feeling athletes spend the rest of their lives trying to protect." },
      { year: "1993", title: "R.H. Watkins High School, Laurel Golden Tornadoes",
        detail: "Senior-year football anchor: QB #14, 6 ft 3 in, 225 lbs. Baseball identity: Pitcher, 3rd Base, bats switch, throws right. Historical stats require source verification." },
      { year: "College / Early Adult Life", title: "Transition, pressure, and lessons",
        detail: "The athlete identity moves into adult life, work, responsibility, setbacks, wrong turns, and the hard realities that do not fit inside a highlight reel." },
      { year: "Today", title: "Founder / Businessman, AthlynXAI",
        detail: "Business career and lived experience become a platform where athletes can protect their Name, Image, Likeness, verified media, truth, and future opportunity." },
    ],

    quote: {
      text: "Sports gave me passion when I was young. Life took me through wins, injuries, wrong turns, and hard lessons. AthlynXAI is how I found that same passion again and turned it into something that can help the next athlete.",
      attribution: "— Chad A. Dozier",
    },
  };

  const initials = profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <UnifiedNav />

      {/*  Hero / Header  */}
      <section className="relative pt-20 pb-10 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#1E90FF]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#1E90FF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative px-4 md:px-5">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
              {/* Founder identity mark */}
              <div className="relative">
                <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden border-2 border-[#1E90FF]/30 bg-gradient-to-br from-slate-950 via-blue-950 to-[#0a1628] flex flex-col items-center justify-center shadow-2xl shadow-cyan-500/10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,rgba(34,211,238,0.30),transparent_34%),radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.24),transparent_38%)]" />
                  <div className="relative text-5xl md:text-6xl font-black tracking-tight text-white">{profile.avatarLabel}</div>
                  <div className="relative mt-2 px-3 py-1 rounded-full border border-[#1E90FF]/30 bg-[#1E90FF]/20 text-[10px] md:text-xs font-bold uppercase tracking-[0.18em] text-[#00C2FF]">{profile.avatarSubline}</div>
                  <div className="relative mt-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-white/45">AthlynXAI</div>
                </div>
                {profile.verified && (
                  <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-[#1E90FF] border-2 border-slate-950 flex items-center justify-center">
                    <Verified className="w-5 h-5 text-slate-950" />
                  </div>
                )}
              </div>

              {/* Identity */}
              <div className="flex-1 text-center md:text-left">
                <Badge className="bg-[#1E90FF]/20 text-[#1E90FF] border-[#1E90FF]/30 mb-3">
                  <Shield className="w-3 h-3 mr-1" /> REAL NIL PROOF PROFILE
                </Badge>
                <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-1">
                  {profile.name}
                </h1>
                <p className="text-[#00C2FF] text-sm md:text-base mb-2">{profile.handle}</p>
                <p className="text-white/90 font-semibold mb-1">
                  {profile.title} · <span className="text-white/70">{profile.org}</span>
                </p>
                <p className="text-white/60 text-sm flex items-center justify-center md:justify-start gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {profile.location}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap justify-center">
                {!isOwner && (
                  <>
                    <Button className="bg-[#1E90FF] hover:bg-[#1E90FF] text-slate-950 font-bold">
                      <UserPlus className="w-4 h-4 mr-2" /> Follow
                    </Button>
                    <Link href="/messages">
                      <Button variant="outline" className="border-[#1E90FF]/30 text-[#00C2FF] hover:bg-[#1E90FF]/20">
                        <MessageCircle className="w-4 h-4 mr-2" /> Message
                      </Button>
                    </Link>
                  </>
                )}
                {isOwner && (
                  <Badge className="bg-[#1E90FF]/20 text-[#00C2FF] border-[#1E90FF]/30 px-3 py-2">
                    Your profile · edit in place
                  </Badge>
                )}
              </div>
            </div>

            {/* Headline */}
            <Card className="bg-white/5 border-[#1E90FF]/30">
              <CardContent className="p-5 md:p-6">
                <p className="text-white/90 text-base md:text-lg leading-relaxed">
                  {profile.headline}
                </p>
                <div className="flex gap-3 mt-4 text-sm">
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
                    className="text-[#00C2FF] hover:text-[#00C2FF] inline-flex items-center gap-1">
                    <ExternalLink className="w-4 h-4" /> LinkedIn
                  </a>
                  <a href={profile.website} target="_blank" rel="noopener noreferrer"
                    className="text-[#00C2FF] hover:text-[#00C2FF] inline-flex items-center gap-1">
                    <Globe className="w-4 h-4" /> athlynx.ai
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-5 bg-white/5 border-[#1E90FF]/30 overflow-hidden">
              <img
                src={founderSuitNilStoryAsset}
                alt="AthlynXAI real NIL profile and Founder Story source asset"
                className="w-full h-auto block"
              />
              <CardContent className="p-4 md:p-5">
                <p className="text-white/70 text-sm leading-relaxed">
                  Real suit-source detail is used as a supporting Founder Story asset. The platform does not use screenshots as production proof, does not reconstruct blurred facial detail, and keeps the focus on the athlete NIL record.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/*  Positions  */}
      <section className="container px-4 md:px-5 pb-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#00C2FF]" /> Profile Roles
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.positions.map((p) => (
              <Badge key={p} className="bg-[#1E90FF]/20 text-[#00C2FF] border-[#1E90FF]/30 text-sm px-3 py-1.5">
                {p}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/*  Skills / Strengths  */}
      <section className="container px-4 md:px-5 pb-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#00C2FF]" /> NIL Profile Pillars
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {profile.strengths.map((s) => {
              const Icon = s.icon;
              return (
                <Card key={s.label} className="bg-white/5 border-white/10 hover:border-[#1E90FF]/30 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-[#00C2FF]" />
                        <span className="text-white font-bold">{s.label}</span>
                      </div>
                      <span className="text-[#00C2FF] font-black text-lg">{s.score}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-gradient-to-r from-[#1E90FF] to-blue-500 rounded-full"
                        style={{ width: `${s.score}%` }}
                      />
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed">{s.proof}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/*  What I Bring (scouting report)  */}
      <section className="container px-4 md:px-5 pb-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <Hammer className="w-5 h-5 text-[#00C2FF]" /> Founder Story
          </h2>
          <Card className="bg-gradient-to-br from-[#1E90FF]/20 to-blue-500/5 border-[#1E90FF]/30">
            <CardContent className="p-6 md:p-8 space-y-4">
              {profile.bring.map((para, i) => (
                <p key={i} className="text-white/85 leading-relaxed">
                  {para}
                </p>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/*  Track Record  */}
      <section className="container px-4 md:px-5 pb-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#00C2FF]" /> Journey Record
          </h2>
          <div className="space-y-3">
            {profile.trackRecord.map((item, i) => (
              <Card key={i} className="bg-white/5 border-white/10">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-start gap-3">
                    <Badge className="bg-[#1E90FF]/20 text-[#00C2FF] border-[#1E90FF]/30 shrink-0 self-start">
                      {item.year}
                    </Badge>
                    <div className="flex-1">
                      <h3 className="text-white font-bold mb-1">{item.title}</h3>
                      <p className="text-white/70 text-sm leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/*  Founder's Note  */}
      <section className="container px-4 md:px-5 pb-16">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-[#1E90FF]/30">
            <CardContent className="p-6 md:p-10">
              <Quote className="w-8 h-8 text-[#00C2FF] mb-4" />
              <p className="text-white/90 text-base md:text-lg italic leading-relaxed mb-3">
                "{profile.quote.text}"
              </p>
              <p className="text-[#00C2FF] font-bold text-sm">{profile.quote.attribution}</p>
              <p className="text-white/40 text-xs mt-6 tracking-widest uppercase">
                Name, Image, Likeness, Truth, and Purpose
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <UnifiedFooter />
    </div>
  );
}

export default function FounderProfile() {
  return (
    <RouteErrorBoundary>
      <FounderProfileInner />
    </RouteErrorBoundary>
  );
}
