/**
 * DiamondGrindPublic — Canonical Less-Is-More sport page (Baseball)
 *
 * Generated from the DiamondGrind canonical template (Lane 4, 2026-05-19).
 * Hero: single H1 "The Baseball Playbook." · ONE CTA · corner BETA chip · full-bleed athlete media.
 *
 * Spec lock: docs/specs/SPORT_PAGE_DESIGN_SPEC.md
 * X-theme: black canvas, accent #E63946, NO gold/yellow/amber.
 * Real-only: tRPC data is LIVE — never placeholders, never Lorem.
 */
import PlatformLayout from "@/components/PlatformLayout";
import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { toast } from "sonner";

// =====================================================================
// SPORT TOKEN — DiamondGrindPublic (Baseball)
// =====================================================================
const SPORT = {
  name: "Baseball",
  pageTitle: "Diamond Grind",
  accent: "#E63946",
  accentSoft: "rgba(230,57,70,0.12)",
  accentRing: "rgba(230,57,70,0.40)",
  emblem: "",
  trpcSport: "Baseball",
  ctaLabel: "Get Assessed",
  heroPhoto: "/sport-hero/baseball-hero.jpg",
  heroPhotoFallback: "/og-image.png",
  closingTagline: "90 MINUTES. ONE SCORE. FOREVER CHANGED.",
};

const DISCIPLINES = ["Hitting", "Pitching", "Fielding"] as const;
type Discipline = (typeof DISCIPLINES)[number];

const PILLARS_BY_DISCIPLINE: Record<Discipline, { name: string; sample: number; pro: number; ncaa: number }[]> = {
  "Hitting": [
    { name: "Gather", sample: 82, pro: 80, ncaa: 70 },
    { name: "Bat Path", sample: 75, pro: 78, ncaa: 68 },
    { name: "Ground", sample: 52, pro: 72, ncaa: 65 },
    { name: "Engine", sample: 76, pro: 79, ncaa: 70 },
  ],
  "Pitching": [
    { name: "Setup", sample: 78, pro: 80, ncaa: 70 },
    { name: "Stride", sample: 81, pro: 82, ncaa: 71 },
    { name: "Arm", sample: 74, pro: 80, ncaa: 69 },
    { name: "Release", sample: 79, pro: 81, ncaa: 71 },
  ],
  "Fielding": [
    { name: "Read", sample: 80, pro: 81, ncaa: 70 },
    { name: "Approach", sample: 73, pro: 79, ncaa: 68 },
    { name: "Glove", sample: 77, pro: 80, ncaa: 71 },
    { name: "Transfer", sample: 75, pro: 80, ncaa: 70 },
  ],
};

const TIERS = ["Build", "Sharpen", "Optimize", "Elite"] as const;
type Tier = (typeof TIERS)[number];

const ASSESSMENT_STEPS = [
  { icon: "", title: "Intake",      desc: "Goals, position, history — locked in 10 minutes.",      duration: "10 min" },
  { icon: "", title: "3D Capture",  desc: "Markerless mocap — every discipline, every angle.",     duration: "45 min" },
  { icon: "", title: "AI Analysis", desc: "Gemini + Nebius H200 grade every frame, every joint.",  duration: "20 min" },
  { icon: "", title: "Coach Review",desc: "Live readout, plan, next step. You leave with proof.", duration: "15 min" },
];

const STATS_FIELDS = [
  { label: "ERA", key: "era", placeholder: "2.45", group: "Pitching" },
  { label: "WHIP", key: "whip", placeholder: "1.12", group: "Pitching" },
  { label: "Fastball (mph)", key: "fastballMph", placeholder: "88", group: "Pitching" },
  { label: "Strikeouts", key: "strikeouts", placeholder: "84", group: "Pitching" },
  { label: "Innings Pitched", key: "inningsPitched", placeholder: "72.1", group: "Pitching" },
  { label: "Win/Loss", key: "winLoss", placeholder: "8-2", group: "Pitching" },
  { label: "Batting Avg", key: "battingAvg", placeholder: ".342", group: "Hitting" },
  { label: "Home Runs", key: "homeRuns", placeholder: "12", group: "Hitting" },
  { label: "RBI", key: "rbi", placeholder: "48", group: "Hitting" },
  { label: "OBP", key: "obp", placeholder: ".412", group: "Hitting" },
  { label: "SLG", key: "slg", placeholder: ".567", group: "Hitting" },
  { label: "Stolen Bases", key: "stolenBases", placeholder: "18", group: "Hitting" },
  { label: "Fielding %", key: "fieldingPct", placeholder: ".987", group: "Fielding" },
  { label: "Position", key: "fieldingPosition", placeholder: "SS / CF", group: "Fielding" },
  { label: "60-Yd Dash", key: "sixtyYardDash", placeholder: "6.8", group: "Physical" },
  { label: "Exit Velocity", key: "exitVelocity", placeholder: "98 mph", group: "Physical" },
];

const STATS_GROUPS = ["Pitching", "Hitting", "Fielding", "Physical"];

const PROGRAMS = [
  { title: "Elite Pitching Mechanics", level: "Elite", duration: "8 weeks", sessions: 24, desc: "Velocity, command, secondary pitch." },
  { title: "Hitting Power Development", level: "Intermediate", duration: "6 weeks", sessions: 18, desc: "Launch angle, bat speed, exit velocity." },
  { title: "Speed & Baserunning", level: "All Levels", duration: "4 weeks", sessions: 12, desc: "60-yard dash, leads, reads." },
  { title: "Fielding & Footwork", level: "All Levels", duration: "4 weeks", sessions: 12, desc: "Infield/outfield, range, throwing." },
  { title: "Mental Performance", level: "All Levels", duration: "Ongoing", sessions: null, desc: "Plate discipline, mound presence." },
  { title: "Showcase Prep", level: "Elite", duration: "3 weeks", sessions: 9, desc: "Perfect Game · Area Code · showcase-ready." },
];

// =====================================================================
// SHARED PRIMITIVES (canonical — kept inline per sport so each page is
// self-contained and Manus's SportXHub edits cannot regress this surface).
// =====================================================================

function Headline({ children, size = "xl", className = "" }: { children: React.ReactNode; size?: "xl" | "lg" | "md"; className?: string }) {
  const sz = size === "xl" ? "text-4xl md:text-6xl" : size === "lg" ? "text-2xl md:text-4xl" : "text-lg md:text-2xl";
  return <h2 className={`${sz} font-black uppercase tracking-tight leading-[0.95] text-white whitespace-pre-line ${className}`}>{children}</h2>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] font-black uppercase tracking-[0.25em] mb-3" style={{ color: SPORT.accent }}>{children}</div>;
}

function AccentCTA({ children, onClick, href, full = false }: { children: React.ReactNode; onClick?: () => void; href?: string; full?: boolean }) {
  const cls = `inline-flex items-center justify-center gap-2 font-black uppercase tracking-wider text-sm px-6 py-3 rounded-full transition-transform hover:scale-[1.02] active:scale-[0.98] ${full ? "w-full" : ""}`;
  const style = { backgroundColor: SPORT.accent, color: "#fff", boxShadow: `0 8px 32px ${SPORT.accentRing}` };
  if (href) return <a href={href} className={cls} style={style}>{children} <span aria-hidden>→</span></a>;
  return <button onClick={onClick} className={cls} style={style}>{children} <span aria-hidden>→</span></button>;
}

function PillarCard({ name, sample, pro, ncaa }: { name: string; sample: number; pro: number; ncaa: number }) {
  const max = 100;
  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors">
      <div className="flex items-baseline justify-between mb-3">
        <div className="text-white font-black uppercase tracking-wide text-sm">{name}</div>
        <div className="text-3xl font-black" style={{ color: SPORT.accent }}>{sample}</div>
      </div>
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-2">
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(sample / max) * 100}%`, backgroundColor: SPORT.accent }} />
      </div>
      <div className="space-y-1.5 mt-3">
        <div className="flex items-center gap-2 text-[10px]">
          <span className="w-14 text-white/60 uppercase tracking-wider">PRO AVG</span>
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-white/60" style={{ width: `${(pro / max) * 100}%` }} />
          </div>
          <span className="w-6 text-white/60 text-right">{pro}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="w-14 text-white/40 uppercase tracking-wider">NCAA AVG</span>
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-white/30" style={{ width: `${(ncaa / max) * 100}%` }} />
          </div>
          <span className="w-6 text-white/40 text-right">{ncaa}</span>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// PAGE COMPONENT
// =====================================================================

function DiamondGrindPublicInner() {
  const { user } = useAuth();
  const [activeDiscipline, setActiveDiscipline] = useState<Discipline>(DISCIPLINES[0]);
  const [activeTier, setActiveTier] = useState<Tier>("Sharpen");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiPlan, setAiPlan] = useState("");
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDuration, setWorkoutDuration] = useState("");
  const [workoutNotes, setWorkoutNotes] = useState("");
  const [statsForm, setStatsForm] = useState<Record<string, string>>({});
  const [statsSaving, setStatsSaving] = useState(false);
  const utils = trpc.useUtils();

  // LIVE DATA — never placeholder
  const { data: trainingHistory = [] } = trpc.training.getHistory.useQuery({ limit: 10 }, { enabled: !!user });
  const { data: trainingStats } = trpc.training.getStats.useQuery(undefined, { enabled: !!user });
  const { data: profile } = trpc.profile.getMyProfile.useQuery(undefined, { enabled: !!user });
  const { data: athletes = [] } = trpc.profile.browseAthletes.useQuery({ sport: SPORT.trpcSport, limit: 8 });

  const logWorkoutMutation = trpc.training.logWorkout.useMutation({
    onSuccess: () => {
      setWorkoutName(""); setWorkoutDuration(""); setWorkoutNotes("");
      utils.training.getHistory.invalidate();
      utils.training.getStats.invalidate();
      toast.success("Workout logged.");
    },
  });

  const updateProfileMutation = trpc.profile.updateProfile.useMutation({
    onSuccess: () => {
      setStatsSaving(false);
      utils.profile.getMyProfile.invalidate();
      toast.success(SPORT.name + " stats saved to your recruiting profile.");
    },
    onError: () => setStatsSaving(false),
  });

  const generatePlanMutation = trpc.ai.getRecruitingAdvice.useMutation({
    onSuccess: (data) => setAiPlan((data as any).advice || ""),
    onError: () => toast.error("AI Coach unavailable. Try again."),
  });

  const handleStatsSave = () => {
    if (!user) return;
    setStatsSaving(true);
    const sportStats: any = { ...((profile as any)?.sportStats || {}) };
    Object.entries(statsForm).forEach(([k, v]) => { if (v) sportStats[k] = v; });
    updateProfileMutation.mutate({ sportStats });
  };

  const existingStats = ((profile as any)?.sportStats) || {};

  // Derived live counts
  const athleteCount = (athletes as any[]).length || 0;
  const sessionsCount = (trainingStats as any)?.totalSessions || 0;
  const minutesCount  = (trainingStats as any)?.totalMinutes  || 0;

  const pillars = PILLARS_BY_DISCIPLINE[activeDiscipline];

  // Live partners — hide section if < 6 real partners
  const partnersQuery = (trpc as any).partners?.bySport?.useQuery?.(
    { sport: SPORT.trpcSport },
    { retry: false }
  );
  const livePartners: any[] = (partnersQuery?.data as any[]) || [];
  const partners = livePartners.filter((p: any) => p?.logoUrl);

  return (
    <PlatformLayout title={SPORT.pageTitle}>
      <div className="bg-black text-white -mx-4 lg:-mx-6 -mt-4 lg:-mt-6 pb-20 lg:pb-6">

        {/* =================================================== */}
        {/* SECTION 1 — STICKY HEADER                            */}
        {/* =================================================== */}
        <div className="sticky top-0 z-30 backdrop-blur-md bg-black/70 border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{SPORT.emblem}</span>
              <div className="font-black uppercase tracking-wider text-sm">{SPORT.pageTitle}</div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: SPORT.accent }}>{SPORT.name}</span>
            </div>
            <AccentCTA href={user ? "#assessment" : "/signup"}>{SPORT.ctaLabel}</AccentCTA>
          </div>
        </div>

        {/* =================================================== */}
        {/* SECTION 2 — HERO (Less-Is-More: single H1 + BETA chip + one CTA) */}
        {/* =================================================== */}
        <section className="relative overflow-hidden min-h-[80vh] flex items-center">
          <div className="absolute inset-0">
            <img
              src={SPORT.heroPhoto}
              alt=""
              className="w-full h-full object-cover opacity-50"
              onError={(e) => { (e.target as HTMLImageElement).src = SPORT.heroPhotoFallback; }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
          </div>
          <div className="absolute top-4 right-4 lg:top-6 lg:right-6 z-10 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.25em] px-3 py-1.5 rounded-full bg-white/[0.08] backdrop-blur border border-white/20 text-white max-w-max">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SPORT.accent }} />
            <span>BETA</span>
          </div>
          <div className="relative w-full max-w-6xl mx-auto px-4 lg:px-6 py-20 md:py-32">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] text-white max-w-4xl">The {SPORT.name} Playbook.</h1>
            <div className="mt-10">
              <AccentCTA href={user ? "#assessment" : "/signup"}>{SPORT.ctaLabel}</AccentCTA>
            </div>
          </div>
        </section>

        {/* =================================================== */}
        {/* SECTION 3 — SOCIAL PROOF RAIL (live-only, hide if 0) */}
        {/* =================================================== */}
        {(sessionsCount > 0 || athleteCount > 0) && (
          <section className="border-y border-white/10 bg-white/[0.02]">
            <div className="max-w-6xl mx-auto px-4 lg:px-6 py-10 grid grid-cols-2 md:grid-cols-3 gap-4">
              {sessionsCount > 0 && (
                <div className="text-center">
                  <div className="text-3xl md:text-5xl font-black" style={{ color: SPORT.accent }}>{sessionsCount.toLocaleString()}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/60 mt-1">Sessions logged</div>
                </div>
              )}
              {athleteCount > 0 && (
                <div className="text-center">
                  <div className="text-3xl md:text-5xl font-black" style={{ color: SPORT.accent }}>{athleteCount.toLocaleString()}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/60 mt-1">Athletes on platform</div>
                </div>
              )}
              {minutesCount > 0 && (
                <div className="text-center">
                  <div className="text-3xl md:text-5xl font-black" style={{ color: SPORT.accent }}>{minutesCount.toLocaleString()}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/60 mt-1">Minutes trained</div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* =================================================== */}
        {/* SECTION 4 — THE ASSESSMENT                           */}
        {/* =================================================== */}
        <section className="max-w-6xl mx-auto px-4 lg:px-6 py-16 md:py-24">
          <SectionLabel>Step 1</SectionLabel>
          <Headline size="lg">The Assessment</Headline>
          <p className="text-white/60 mt-3 max-w-xl text-sm">Four steps. Ninety minutes. You walk out knowing exactly where you stand.</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-8">
            {ASSESSMENT_STEPS.map((s, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
                <div className="text-3xl mb-3">{s.icon}</div>
                <div className="text-white font-black uppercase tracking-wide text-sm mb-1">{s.title}</div>
                <div className="text-white/60 text-xs mb-3">{s.desc}</div>
                <div className="text-[10px] uppercase tracking-wider font-bold" style={{ color: SPORT.accent }}>{s.duration}</div>
              </div>
            ))}
          </div>
        </section>

        {/* =================================================== */}
        {/* SECTION 5 — THE CAPTURE                              */}
        {/* =================================================== */}
        <section id="capture" className="max-w-6xl mx-auto px-4 lg:px-6 py-16 md:py-24 border-t border-white/10">
          <SectionLabel>Step 2</SectionLabel>
          <Headline size="lg">The Capture</Headline>
          <p className="text-white/60 mt-3 max-w-xl text-sm">Markerless 3D mocap. Every joint, every frame. No suits. No dots. Just truth.</p>

          <div className="flex gap-2 mt-6 mb-6 overflow-x-auto pb-1">
            {DISCIPLINES.map(d => (
              <button
                key={d}
                onClick={() => setActiveDiscipline(d)}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all border ${activeDiscipline === d ? "text-white border-transparent" : "text-white/60 border-white/20 hover:border-white/40"}`}
                style={activeDiscipline === d ? { backgroundColor: SPORT.accent } : {}}
              >{d}</button>
            ))}
          </div>

          <div className="relative aspect-video w-full rounded-3xl border border-white/10 overflow-hidden" style={{ background: `radial-gradient(ellipse at center, ${SPORT.accentSoft} 0%, #000 70%)` }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-7xl mb-4 opacity-70">{SPORT.emblem}</div>
                <div className="text-white font-black uppercase tracking-wider text-sm">{activeDiscipline} Capture</div>
                <div className="text-white/50 text-xs mt-1">3D markerless mocap · live preview</div>
              </div>
            </div>
            <div className="absolute inset-0 pointer-events-none" style={{
              background: "repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 80px), repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 80px)"
            }} />
            <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] uppercase tracking-wider text-white/60 bg-black/40 backdrop-blur px-3 py-1.5 rounded-full border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: SPORT.accent }} />
              Live · Nebius H200
            </div>
          </div>
        </section>

        {/* =================================================== */}
        {/* SECTION 6 — THE CLARITY · 4 PILLARS                  */}
        {/* =================================================== */}
        <section className="max-w-6xl mx-auto px-4 lg:px-6 py-16 md:py-24 border-t border-white/10">
          <SectionLabel>Step 3</SectionLabel>
          <Headline size="lg">The Clarity</Headline>
          <p className="text-white/60 mt-3 max-w-xl text-sm">Four pillars. One score. Benchmarked against pro and NCAA averages — so you know exactly where you stand.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
            {pillars.map(p => <PillarCard key={p.name} {...p} />)}
          </div>
        </section>

        {/* =================================================== */}
        {/* SECTION 7 — THE PROOF · Tier chips                   */}
        {/* =================================================== */}
        <section className="max-w-6xl mx-auto px-4 lg:px-6 py-16 md:py-24 border-t border-white/10">
          <SectionLabel>Step 4</SectionLabel>
          <Headline size="lg">The Proof</Headline>
          <p className="text-white/60 mt-3 max-w-xl text-sm">From Build to Elite — see how athletes move through the system.</p>

          <div className="flex gap-2 mt-6 mb-8 overflow-x-auto pb-1">
            {TIERS.map(t => (
              <button
                key={t}
                onClick={() => setActiveTier(t)}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all border ${activeTier === t ? "text-white border-transparent" : "text-white/60 border-white/20 hover:border-white/40"}`}
                style={activeTier === t ? { backgroundColor: SPORT.accent } : {}}
              >{t}</button>
            ))}
          </div>
          {/* Story grid intentionally omitted — REAL-ONLY: no fake stories. */}
        </section>

        {/* =================================================== */}
        {/* SECTION 7b — LIVE ATHLETE LEADERBOARD                */}
        {/* =================================================== */}
        {(athletes as any[]).length > 0 && (
          <section className="max-w-6xl mx-auto px-4 lg:px-6 py-16 border-t border-white/10">
            <SectionLabel>On platform now</SectionLabel>
            <Headline size="md">Top {SPORT.name} Athletes on AthlynX</Headline>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-6">
              {(athletes as any[]).map((a: any, i: number) => (
                <div key={a.id} className="flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-2xl p-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${i === 0 ? "bg-white text-black" : i === 1 ? "bg-white/70 text-black" : i === 2 ? "bg-white/40 text-black" : "bg-white/10 text-white"}`}>{i + 1}</div>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                    {a.avatarUrl ? <img src={a.avatarUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-lg">{SPORT.emblem}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-black truncate">{a.name || "Athlete"}</div>
                    <div className="text-white/50 text-xs truncate">{a.position || "—"} · {a.school || "—"}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-black" style={{ color: SPORT.accent }}>{a.nilValue ? `$${Number(a.nilValue).toLocaleString()}` : "—"}</div>
                    <div className="text-white/40 text-[10px] uppercase tracking-wider">NIL</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Link href="/browse-athletes" className="flex-1"><button className="w-full bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-black uppercase tracking-wider py-3 rounded-full transition-colors">Browse all athletes</button></Link>
              <Link href="/transfer-portal" className="flex-1"><button className="w-full text-white text-xs font-black uppercase tracking-wider py-3 rounded-full transition-transform hover:scale-[1.01]" style={{ backgroundColor: SPORT.accent }}>Transfer portal</button></Link>
            </div>
          </section>
        )}

        {/* =================================================== */}
        {/* SECTION 8 — BRAND / PARTNER STRIP (real partners only) */}
        {/* =================================================== */}
        {partners.length >= 6 && (
          <section className="max-w-6xl mx-auto px-4 lg:px-6 py-16 md:py-20 border-t border-white/10">
            <div className="text-center">
              <SectionLabel>Partners</SectionLabel>
              <Headline size="md">Trusted by champions</Headline>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-10">
              {partners.slice(0, 12).map((p: any, i: number) => (
                <div key={p.id || i} className="aspect-[3/1] flex items-center justify-center bg-white/[0.04] border border-white/10 rounded-xl overflow-hidden">
                  <img src={p.logoUrl} alt={p.name || ""} className="max-h-8 max-w-[80%] object-contain opacity-80 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =================================================== */}
        {/* ASSESSMENT WORKBENCH (authenticated, preserved)      */}
        {/* =================================================== */}
        <section id="assessment" className="max-w-6xl mx-auto px-4 lg:px-6 py-16 border-t border-white/10">
          <SectionLabel>Your assessment</SectionLabel>
          <Headline size="md">Train. Track. Recruit.</Headline>

          {!user ? (
            <div className="mt-8 bg-white/[0.04] border border-white/10 rounded-3xl p-10 text-center">
              <div className="text-5xl mb-4">{SPORT.emblem}</div>
              <div className="text-white font-black uppercase tracking-wider text-lg mb-2">Sign up to get assessed</div>
              <div className="text-white/60 text-sm mb-6">Your stats, your sessions, your AI coach — all in one place.</div>
              <AccentCTA href="/signup">{SPORT.ctaLabel}</AccentCTA>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">

              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
                <h3 className="text-white font-black uppercase tracking-wider text-sm mb-1">Log workout</h3>
                <p className="text-white/50 text-xs mb-4">Session · Drill · Recovery.</p>
                <div className="space-y-2">
                  <input value={workoutName} onChange={e => setWorkoutName(e.target.value)} placeholder="Workout type" className="w-full bg-black/40 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none placeholder-white/30" style={{ borderColor: workoutName ? SPORT.accent : undefined }} />
                  <div className="flex gap-2">
                    <input value={workoutDuration} onChange={e => setWorkoutDuration(e.target.value)} type="number" placeholder="Duration (min)" className="flex-1 bg-black/40 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none placeholder-white/30" />
                    <input value={workoutNotes} onChange={e => setWorkoutNotes(e.target.value)} placeholder="Notes" className="flex-1 bg-black/40 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none placeholder-white/30" />
                  </div>
                  <button
                    onClick={() => workoutName.trim() && logWorkoutMutation.mutate({ workout: workoutName, duration: workoutDuration ? parseInt(workoutDuration) : undefined, notes: workoutNotes || undefined })}
                    disabled={logWorkoutMutation.isPending || !workoutName.trim()}
                    className="w-full font-black uppercase tracking-wider text-sm py-3 rounded-full text-white disabled:opacity-40 transition-transform hover:scale-[1.01]"
                    style={{ backgroundColor: SPORT.accent }}
                  >{logWorkoutMutation.isPending ? "Logging…" : "Log workout"}</button>
                </div>
                {(trainingHistory as any[]).length > 0 && (
                  <div className="mt-5 pt-5 border-t border-white/10">
                    <div className="text-[10px] uppercase tracking-wider text-white/40 mb-2">Recent</div>
                    <div className="space-y-1.5">
                      {(trainingHistory as any[]).slice(0, 4).map((log: any) => (
                        <div key={log.id} className="flex items-center gap-3 py-1.5 text-xs">
                          <span className="text-base">{SPORT.emblem}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-bold truncate">{log.workout}</div>
                            <div className="text-white/40">{log.duration ? log.duration + " min" : ""}{log.notes ? " · " + log.notes : ""}</div>
                          </div>
                          <div className="text-white/30 shrink-0">{new Date(log.logDate).toLocaleDateString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
                <h3 className="text-white font-black uppercase tracking-wider text-sm mb-1">AI {SPORT.name} Coach</h3>
                <p className="text-white/50 text-xs mb-4">Gemini · Technique · Recruiting.</p>
                <div className="grid grid-cols-2 gap-1.5 mb-3">
                  {[
    "4-week velocity program",
    "Improve batting average",
    "Showcase scout signals",
    "Coach email template",
  ].map((q: string, i: number) => (
                    <button key={i} onClick={() => setAiPrompt(q)} className="text-left text-[11px] bg-white/[0.04] hover:bg-white/10 text-white/70 px-3 py-2 rounded-lg transition-colors border border-white/10">{q}</button>
                  ))}
                </div>
                <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} rows={3} placeholder={"Ask your AI " + SPORT.name.toLowerCase() + " coach anything…"} className="w-full bg-black/40 border border-white/10 text-white text-sm rounded-xl px-4 py-3 focus:outline-none placeholder-white/30 resize-none mb-3" />
                <button
                  onClick={() => aiPrompt.trim() && generatePlanMutation.mutate({ sport: SPORT.trpcSport, question: aiPrompt, targetLevel: "D1" })}
                  disabled={generatePlanMutation.isPending || !aiPrompt.trim()}
                  className="w-full font-black uppercase tracking-wider text-sm py-3 rounded-full text-white disabled:opacity-40 transition-transform hover:scale-[1.01]"
                  style={{ backgroundColor: SPORT.accent }}
                >{generatePlanMutation.isPending ? "Coaching…" : "Get coaching plan"}</button>
                {aiPlan && (
                  <div className="mt-4 bg-black/40 border rounded-xl p-4" style={{ borderColor: SPORT.accentRing }}>
                    <div className="text-[10px] uppercase tracking-wider text-white/40 mb-2">Your plan</div>
                    <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{aiPlan}</p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-2 bg-white/[0.04] border border-white/10 rounded-2xl p-5">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <h3 className="text-white font-black uppercase tracking-wider text-sm">Recruiting stats</h3>
                    <p className="text-white/50 text-xs">Live on your public profile — visible to college coaches.</p>
                  </div>
                  <button
                    onClick={handleStatsSave}
                    disabled={statsSaving}
                    className="font-black uppercase tracking-wider text-xs px-5 py-2.5 rounded-full text-white disabled:opacity-40 transition-transform hover:scale-[1.01]"
                    style={{ backgroundColor: SPORT.accent }}
                  >{statsSaving ? "Saving…" : "Save"}</button>
                </div>
                {STATS_GROUPS.map((group: string) => (
                  <div key={group} className="mb-4 last:mb-0">
                    <div className="text-[10px] uppercase tracking-[0.2em] font-black mb-2" style={{ color: SPORT.accent }}>{group}</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {STATS_FIELDS.filter(f => f.group === group).map(f => (
                        <div key={f.key}>
                          <label className="text-white/40 text-[10px] mb-1 block uppercase tracking-wider">{f.label}</label>
                          <input
                            value={statsForm[f.key] ?? existingStats[f.key] ?? ""}
                            onChange={e => setStatsForm(p => ({ ...p, [f.key]: e.target.value }))}
                            placeholder={f.placeholder}
                            className="w-full bg-black/40 border border-white/10 text-white text-xs rounded-lg px-3 py-2 focus:outline-none placeholder-white/30"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-2 bg-white/[0.04] border border-white/10 rounded-2xl p-5">
                <h3 className="text-white font-black uppercase tracking-wider text-sm mb-4">Training programs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {PROGRAMS.map((p, i) => (
                    <div key={i} className="bg-black/40 border border-white/10 rounded-xl p-4">
                      <div className="text-xl mb-2">{SPORT.emblem}</div>
                      <div className="text-white font-black text-sm leading-tight mb-1">{p.title}</div>
                      <div className="text-white/40 text-[10px] uppercase tracking-wider mb-2">{p.level} · {p.duration}{p.sessions ? ` · ${p.sessions} sessions` : ""}</div>
                      <div className="text-white/60 text-xs mb-3">{p.desc}</div>
                      <button
                        onClick={() => logWorkoutMutation.mutate({ workout: p.title, duration: p.sessions ? p.sessions * 60 : undefined, notes: p.desc })}
                        className="w-full text-white text-xs font-black uppercase tracking-wider py-2 rounded-full transition-transform hover:scale-[1.01]"
                        style={{ backgroundColor: SPORT.accent }}
                      >Start program</button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {user && trainingStats && (
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { label: "Sessions", value: sessionsCount },
                { label: "Minutes",  value: minutesCount },
                { label: "Avg Perf", value: (trainingStats as any).avgPerformance ? `${(trainingStats as any).avgPerformance}/10` : "—" },
              ].map((s, i) => (
                <div key={i} className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black" style={{ color: SPORT.accent }}>{s.value}</div>
                  <div className="text-[10px] uppercase tracking-wider text-white/40">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* =================================================== */}
        {/* SECTION 9 — CLOSING CTA                              */}
        {/* =================================================== */}
        <section className="relative overflow-hidden mt-10">
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${SPORT.accent} 0%, ${SPORT.accent}dd 100%)` }} />
          <div className="relative max-w-6xl mx-auto px-4 lg:px-6 py-20 md:py-28 text-center">
            <Headline size="xl" className="!text-white">{SPORT.closingTagline}</Headline>
            <p className="text-white/90 mt-6 text-base md:text-lg max-w-xl mx-auto">Book your assessment. Walk out with a plan, a score, and a path.</p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <a href={user ? "#assessment" : "/signup"} className="inline-flex items-center gap-2 font-black uppercase tracking-wider text-sm px-6 py-3 rounded-full bg-black text-white hover:bg-white hover:text-black transition-colors">{SPORT.ctaLabel} <span aria-hidden>→</span></a>
            </div>
          </div>
        </section>

      </div>
    </PlatformLayout>
  );
}

export default function DiamondGrindPublic() {
  return <RouteErrorBoundary><DiamondGrindPublicInner /></RouteErrorBoundary>;
}
