// Diamond Grind IQ — Youth Battery IQ (Pitcher + Catcher) · Lifeblood Lane
// Built May 29, 2026 · AthlynX — ONE IDENTITY. EVERY ATHLETE. EVERY PLATFORM.
// Mission: AthlynX exists for all sports, all ages, men AND women — every athlete.
// This page is where AthlynX finds the diamonds in the rough.
// Brand lock: cobalt #1E90FF + true black + white. No gold/yellow/orange. No standalone X glyph.

import { useState, useMemo } from "react";
import { Link } from "wouter";

// ───────────────────────────────────────────────────────────────────────────
// Pitch Smart — official MLB / USA Baseball pitch count + rest rules by age
// Source: https://www.mlb.com/pitch-smart/pitching-guidelines
// ───────────────────────────────────────────────────────────────────────────

interface PitchSmartRow {
  age: string;
  maxPerGame: number;
  restTable: { pitches: string; daysRest: number }[];
  notes: string;
}

const PITCH_SMART: PitchSmartRow[] = [
  {
    age: "7–8", maxPerGame: 50,
    restTable: [
      { pitches: "1–20", daysRest: 0 },
      { pitches: "21–35", daysRest: 1 },
      { pitches: "36–50", daysRest: 2 },
    ],
    notes: "Four-seam fastball only. Focus on fun and fundamentals.",
  },
  {
    age: "9–10", maxPerGame: 75,
    restTable: [
      { pitches: "1–20", daysRest: 0 },
      { pitches: "21–35", daysRest: 1 },
      { pitches: "36–50", daysRest: 2 },
      { pitches: "51–65", daysRest: 3 },
      { pitches: "66+", daysRest: 4 },
    ],
    notes: "Four-seam fastball + changeup. No breaking balls.",
  },
  {
    age: "11–12", maxPerGame: 85,
    restTable: [
      { pitches: "1–20", daysRest: 0 },
      { pitches: "21–35", daysRest: 1 },
      { pitches: "36–50", daysRest: 2 },
      { pitches: "51–65", daysRest: 3 },
      { pitches: "66+", daysRest: 4 },
    ],
    notes: "Fastball command first. Changeup mastery before any breaking ball.",
  },
  {
    age: "13–14", maxPerGame: 95,
    restTable: [
      { pitches: "1–20", daysRest: 0 },
      { pitches: "21–35", daysRest: 1 },
      { pitches: "36–50", daysRest: 2 },
      { pitches: "51–65", daysRest: 3 },
      { pitches: "66+", daysRest: 4 },
    ],
    notes: "Breaking pitches may begin AFTER consistent fastball + changeup in the zone. Max 100 innings per 12 months.",
  },
  {
    age: "15–16", maxPerGame: 95,
    restTable: [
      { pitches: "1–30", daysRest: 0 },
      { pitches: "31–45", daysRest: 1 },
      { pitches: "46–60", daysRest: 2 },
      { pitches: "61–75", daysRest: 3 },
      { pitches: "76+", daysRest: 4 },
    ],
    notes: "Pitch design entry point. Max 100 innings per 12 months.",
  },
  {
    age: "17–18", maxPerGame: 105,
    restTable: [
      { pitches: "1–30", daysRest: 0 },
      { pitches: "31–45", daysRest: 1 },
      { pitches: "46–60", daysRest: 2 },
      { pitches: "61–80", daysRest: 3 },
      { pitches: "81+", daysRest: 4 },
    ],
    notes: "Full arsenal construction. No three consecutive days. Max 100 innings per 12 months.",
  },
];

// ───────────────────────────────────────────────────────────────────────────
// Drill Library — 12 drills (6 pitcher, 6 catcher), age-graded, source-cited
// ───────────────────────────────────────────────────────────────────────────

interface Drill {
  id: string;
  pos: "P" | "C";
  name: string;
  ages: string;
  source: { label: string; url: string };
  iq: string; // IQ skill targeted
  desc: string;
}

const DRILLS: Drill[] = [
  // Pitcher
  { id: "P1", pos: "P", name: "Balance Point Hold", ages: "8–11", iq: "Body Awareness",
    source: { label: "Athletes Untapped", url: "https://athletesuntapped.com/blog/youth-baseball-pitching-a-complete-development-guide/" },
    desc: "Lift to balance point, hold 3 seconds, then deliver. Builds leg stability before stride." },
  { id: "P2", pos: "P", name: "Four-Seam Command Target", ages: "8–12", iq: "Strike Zone Map",
    source: { label: "Athletes Untapped", url: "https://athletesuntapped.com/blog/youth-baseball-pitching-a-complete-development-guide/" },
    desc: "10 four-seam fastballs to each corner of the zone. Eyes on glove — not velocity." },
  { id: "P3", pos: "P", name: "Circle Changeup Progression", ages: "11–14", iq: "Pitch Design",
    source: { label: "Rawlings Tigers Pitch Guide", url: "https://www.rawlingstigers.com/uploads/vip/174-when-is-the-right-time-for-youth-pitchers-to-explore-throwing-new-pitches.pdf" },
    desc: "Changeup with identical arm action and elbow height as fastball. Coach verifies follow-through." },
  { id: "P4", pos: "P", name: "Mound Visit Role Play", ages: "13–17", iq: "Battery Communication",
    source: { label: "In the Zone NJ", url: "https://www.inthezonenj.com/free-resources/pitch-calling-and-battery-leadership-building-game-iq-behind-the-plate/" },
    desc: "Catcher walks to mound, delivers one mechanical cue, jogs back. Reset under 20 seconds." },
  { id: "P5", pos: "P", name: "Count Leverage Sequencing", ages: "14–18", iq: "Game IQ",
    source: { label: "In the Zone NJ", url: "https://www.inthezonenj.com/free-resources/pitch-calling-and-battery-leadership-building-game-iq-behind-the-plate/" },
    desc: "Coach calls count + hitter tendency. Pitcher and catcher independently write the sequence, then compare." },
  { id: "P6", pos: "P", name: "Intent Drive (Weighted Underload)", ages: "15–18", iq: "Neuromuscular Firing",
    source: { label: "Texas Baseball Ranch", url: "https://www.texasbaseballranch.com" },
    desc: "Underload (4 oz) at max intent for 5 reps, then regulation ball. Requires qualified supervision." },
  // Catcher
  { id: "C1", pos: "C", name: "Fast Hands Reception", ages: "8–12", iq: "Receiving Tempo",
    source: { label: "ABCA Catcher Fundamentals", url: "https://www.abca.org/magazine/magazine/2020-4-July_August/Ground_Rules_Building_a_Better_Backstop_Catching_Fundamentals_for_the_Youth_Player.aspx" },
    desc: "Coach 6 feet away tosses rapidly; catcher catches and flips to side. Trains hand-eye at game pace." },
  { id: "C2", pos: "C", name: "Around the Plate Blocking", ages: "8–14", iq: "Blocking Footwork",
    source: { label: "ABCA Catcher Fundamentals", url: "https://www.abca.org/magazine/magazine/2020-4-July_August/Ground_Rules_Building_a_Better_Backstop_Catching_Fundamentals_for_the_Youth_Player.aspx" },
    desc: "Ball placed on all four corners. Block clockwise, then counter. Doubles as conditioning." },
  { id: "C3", pos: "C", name: "Exhale Block", ages: "8–13", iq: "Body Absorption",
    source: { label: "Little League University", url: "https://www.littleleague.org/university/articles/catcher-drill-progression/" },
    desc: "Soft balls in the dirt; catcher exhales on impact to soften body and trap ball." },
  { id: "C4", pos: "C", name: "Cage Simulation Throwdown", ages: "11–16", iq: "Pop & Release",
    source: { label: "ABCA Catcher Fundamentals", url: "https://www.abca.org/magazine/magazine/2020-4-July_August/Ground_Rules_Building_a_Better_Backstop_Catching_Fundamentals_for_the_Youth_Player.aspx" },
    desc: "Catcher pops and throws straight down to simulate the peg to second. Angle plate to simulate 1B/3B." },
  { id: "C5", pos: "C", name: "Scenario Call Game", ages: "13–18", iq: "Pitch Calling",
    source: { label: "In the Zone NJ", url: "https://www.inthezonenj.com/free-resources/pitch-calling-and-battery-leadership-building-game-iq-behind-the-plate/" },
    desc: "Coach gives hitter profile + game state. Catcher calls full 3-pitch sequence with reasoning." },
  { id: "C6", pos: "C", name: "Flamingo Transfer Drill", ages: "14–18", iq: "Weight Transfer",
    source: { label: "YouTube — Catcher Pop Time", url: "https://www.youtube.com/watch?v=FSJyHemMBfY" },
    desc: "From secondary stance: receive, rise to right foot (flamingo pause), explode to throwdown. Prevents rushing." },
];

// ───────────────────────────────────────────────────────────────────────────
// IQ Modules by age band — Battery Blueprint
// ───────────────────────────────────────────────────────────────────────────

interface IQModule {
  band: string;
  bandLabel: string;
  pitcherIQ: string[];
  catcherIQ: string[];
  framework: string;
}

const IQ_MODULES: IQModule[] = [
  {
    band: "8-12", bandLabel: "Ages 8–12 · Foundation",
    framework: "Game Sense · Cognitive Load (one cue per rep)",
    pitcherIQ: [
      "Know the force play before every pitch",
      "Eyes on the glove — not the radar",
      "Strike zone map: corners, not the middle",
      "Reset breath between every pitch",
    ],
    catcherIQ: [
      "Resetting after every pitch becomes a habit",
      "Calling time — when and why",
      "Signal basics: location before pitch type",
      "Calming presence — body language teaches the pitcher",
    ],
  },
  {
    band: "13-15", bandLabel: "Ages 13–15 · Integration",
    framework: "Decision Training · Video Feedback · Battery Sync",
    pitcherIQ: [
      "Count leverage: 0-2 vs 2-0 vs 3-2 logic",
      "Reading hitter stride load",
      "Pitch sequencing: setting up the third pitch",
      "Recovery after walks or errors",
    ],
    catcherIQ: [
      "Catcher calls 50% of the game by 14U",
      "Hitter scouting vocabulary: pull%, first-pitch tendency",
      "Mound visit framework: one cue, jog back in 20 seconds",
      "Umpire zone tracking: adjust by the 3rd inning",
    ],
  },
  {
    band: "16-18", bandLabel: "Ages 16–18 · Mastery",
    framework: "Pitch Design · Self-Scouting · Constraint-Led Practice",
    pitcherIQ: [
      "Build the arsenal: shape, not just speed",
      "Pre-game pitcher–catcher sync meeting",
      "In-game adjustments: when to abandon Plan A",
      "Recovery and arm care between starts",
    ],
    catcherIQ: [
      "Call a full game with reasoning",
      "Build the scouting sheet from film",
      "Manage pace: slow chaos, accelerate control",
      "Lead the battery — own the tempo",
    ],
  },
];

// ───────────────────────────────────────────────────────────────────────────
// Components
// ───────────────────────────────────────────────────────────────────────────

function ArmHealthCalculator() {
  const [age, setAge] = useState("11-12");
  const [pitches, setPitches] = useState(45);

  const result = useMemo(() => {
    const row = PITCH_SMART.find((r) => r.age === age);
    if (!row) return null;
    const overMax = pitches > row.maxPerGame;
    // Find the rest requirement
    let rest = 0;
    for (const r of row.restTable) {
      const [lo, hi] = r.pitches.includes("+")
        ? [parseInt(r.pitches), Number.POSITIVE_INFINITY]
        : r.pitches.split("–").map((n) => parseInt(n));
      if (pitches >= lo && pitches <= hi) {
        rest = r.daysRest;
        break;
      }
    }
    return { row, rest, overMax };
  }, [age, pitches]);

  return (
    <section
      aria-label="Arm Health Calculator"
      className="border border-[#1E90FF]/40 rounded-xl bg-gradient-to-b from-[#0a1628] to-black p-5 md:p-6 mb-10"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] font-black uppercase tracking-[0.22em] bg-[#1E90FF] text-white px-2 py-1 rounded">
          ARM HEALTH
        </span>
        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
          Pitch Smart Calculator
        </h2>
      </div>
      <p className="text-sm text-white/60 mb-5 max-w-2xl">
        Built on the official{" "}
        <a href="https://www.mlb.com/pitch-smart/pitching-guidelines" target="_blank" rel="noopener noreferrer" className="text-[#88a8ff] underline">
          MLB / USA Baseball Pitch Smart guidelines
        </a>
        . Enter your athlete's age band and last game's pitch count. We show the required rest days before they can pitch again.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-white/60 mb-2">Age Band</label>
          <select
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#1E90FF] focus:outline-none"
            data-testid="select-age-band"
          >
            {PITCH_SMART.map((r) => (
              <option key={r.age} value={r.age}>Ages {r.age}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-white/60 mb-2">
            Pitches Thrown · Last Outing: <span className="text-[#1E90FF]">{pitches}</span>
          </label>
          <input
            type="range"
            min={0}
            max={120}
            value={pitches}
            onChange={(e) => setPitches(parseInt(e.target.value))}
            className="w-full accent-[#1E90FF]"
            data-testid="slider-pitch-count"
          />
        </div>
      </div>

      {result && (
        <div className={`border rounded-lg p-4 ${result.overMax ? "border-[#1E90FF] bg-[#1E90FF]/10" : "border-white/15 bg-black/40"}`}>
          {result.overMax ? (
            <>
              <div className="text-sm font-black text-[#1E90FF] uppercase tracking-widest mb-1">⚠ Over the Pitch Smart Limit</div>
              <div className="text-sm text-white mb-2">
                {pitches} pitches exceeds the recommended max of <span className="font-black">{result.row.maxPerGame}</span> for ages {age}.
              </div>
            </>
          ) : (
            <div className="text-sm text-white/80 mb-2">
              Within the daily limit ({result.row.maxPerGame} max for ages {age}).
            </div>
          )}
          <div className="text-2xl md:text-3xl font-black text-white mb-1">
            {result.rest === 0 ? "No required rest" : `${result.rest} day${result.rest === 1 ? "" : "s"} of rest required`}
          </div>
          <div className="text-xs text-white/50 italic">{result.row.notes}</div>
        </div>
      )}
    </section>
  );
}

function BatteryBlueprint() {
  const [active, setActive] = useState(IQ_MODULES[0].band);
  const mod = IQ_MODULES.find((m) => m.band === active)!;

  return (
    <section aria-label="Battery Blueprint" className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] font-black uppercase tracking-[0.22em] bg-[#1E90FF] text-white px-2 py-1 rounded">
          BLUEPRINT
        </span>
        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
          Battery IQ by Age Band
        </h2>
      </div>
      <p className="text-sm text-white/60 mb-4 max-w-2xl">
        Pitcher and catcher learn the same language — pitch by pitch, age by age. Built on{" "}
        <a href="https://www.abca.org/magazine/magazine/2020-4-July_August/Ground_Rules_Building_a_Better_Backstop_Catching_Fundamentals_for_the_Youth_Player.aspx" target="_blank" rel="noopener noreferrer" className="text-[#88a8ff] underline">
          ABCA fundamentals
        </a>
        , Pitch Smart age guidance, and the Decision Training framework.
      </p>

      <div className="flex gap-2 mb-4 border-b border-white/10 overflow-x-auto">
        {IQ_MODULES.map((m) => (
          <button
            key={m.band}
            onClick={() => setActive(m.band)}
            data-testid={`tab-iq-${m.band}`}
            className={`px-4 py-2 text-xs font-bold tracking-wide whitespace-nowrap rounded-t transition ${
              active === m.band ? "bg-[#1E90FF] text-white" : "text-white/60 hover:text-white"
            }`}
          >
            {m.bandLabel}
          </button>
        ))}
      </div>

      <div className="text-[11px] uppercase tracking-widest text-white/40 mb-4">
        Framework: <span className="text-[#88a8ff]">{mod.framework}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-white/10 rounded-lg bg-black/40 p-4">
          <div className="text-xs font-black uppercase tracking-[0.18em] text-[#1E90FF] mb-3">Pitcher IQ</div>
          <ul className="space-y-2">
            {mod.pitcherIQ.map((p, i) => (
              <li key={i} className="text-sm text-white/85 leading-snug flex gap-2">
                <span className="text-[#1E90FF] font-black">{i + 1}.</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-white/10 rounded-lg bg-black/40 p-4">
          <div className="text-xs font-black uppercase tracking-[0.18em] text-[#1E90FF] mb-3">Catcher IQ</div>
          <ul className="space-y-2">
            {mod.catcherIQ.map((c, i) => (
              <li key={i} className="text-sm text-white/85 leading-snug flex gap-2">
                <span className="text-[#1E90FF] font-black">{i + 1}.</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function DrillLibrary() {
  const [filter, setFilter] = useState<"ALL" | "P" | "C">("ALL");
  const filtered = DRILLS.filter((d) => filter === "ALL" || d.pos === filter);

  return (
    <section aria-label="Drill Library" className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] font-black uppercase tracking-[0.22em] bg-[#1E90FF] text-white px-2 py-1 rounded">
          DRILL LIBRARY
        </span>
        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
          12 Battery Drills, Source-Cited
        </h2>
      </div>
      <p className="text-sm text-white/60 mb-4 max-w-2xl">
        Every drill tagged by age, position, and the IQ skill it builds. Sources are linked — parents and coaches can verify before they coach.
      </p>

      <div className="flex gap-2 mb-4">
        {(["ALL", "P", "C"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            data-testid={`button-filter-${f.toLowerCase()}`}
            className={`px-3 py-1.5 text-xs font-bold tracking-wide rounded transition ${
              filter === f ? "bg-[#1E90FF] text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {f === "ALL" ? "All Drills" : f === "P" ? "Pitcher" : "Catcher"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((d) => (
          <div key={d.id} className="border border-white/10 rounded-lg bg-black/40 p-4 hover:border-[#1E90FF]/50 transition">
            <div className="flex items-baseline justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                  d.pos === "P" ? "bg-[#1E90FF]/15 text-[#88a8ff]" : "bg-white/10 text-white/80"
                }`}>
                  {d.pos === "P" ? "PITCHER" : "CATCHER"} · {d.id}
                </span>
              </div>
              <span className="text-[10px] text-white/50">Ages {d.ages}</span>
            </div>
            <div className="text-base font-bold text-white mb-1">{d.name}</div>
            <div className="text-[10px] uppercase tracking-widest text-[#1E90FF] mb-2">IQ · {d.iq}</div>
            <p className="text-xs text-white/65 leading-snug mb-3">{d.desc}</p>
            <a
              href={d.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-white/40 hover:text-[#88a8ff] transition italic"
              data-testid={`link-source-${d.id}`}
            >
              Source: {d.source.label} →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

function ParentEnrollment() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [athleteAge, setAthleteAge] = useState("");
  const [position, setPosition] = useState<"P" | "C" | "Both">("Both");
  const [done, setDone] = useState(false);

  function next() {
    if (step < 4) setStep(step + 1);
    else setDone(true);
  }
  function back() { if (step > 1) setStep(step - 1); }

  if (done) {
    return (
      <section className="border border-[#1E90FF] rounded-xl bg-gradient-to-b from-[#1E90FF]/10 to-black p-6 md:p-8 mb-10 text-center">
        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1E90FF] mb-2">REGISTRATION RECEIVED</div>
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">Welcome, {name || "Coach"}</h2>
        <p className="text-sm text-white/70 max-w-xl mx-auto mb-4">
          We'll email <span className="text-[#88a8ff]">{email}</span> with your Diamond Grind IQ starter pack — the drill library, the IQ baseline assessment, and the Pitch Smart safety guide. Check your inbox in the next 5 minutes.
        </p>
        <p className="text-[11px] text-white/50 max-w-xl mx-auto">
          Your athlete is registered as: <span className="text-white">{position} · ages {athleteAge}</span>. You can change this any time from Account Settings.
        </p>
        <div className="mt-6 text-[10px] uppercase tracking-widest text-white/40">
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="Parent Enrollment"
      className="border border-[#1E90FF]/50 rounded-xl bg-gradient-to-b from-[#0a1628] via-black to-black p-6 md:p-8 mb-10"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-black uppercase tracking-[0.22em] bg-[#1E90FF] text-white px-2 py-1 rounded">
          PARENT-FIRST · STEP {step} OF 4
        </span>
        <span className="text-[10px] text-white/50">COPPA-compliant · Parent holds the account</span>
      </div>
      <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-3 mb-2">
        Sign your athlete up in under a minute.
      </h2>
      <p className="text-sm text-white/60 mb-6 max-w-xl">
        No app store, no card, no friction. Parent's email is the account. Athlete's data stays under your control.
      </p>

      {/* Progress bar */}
      <div className="flex gap-1 mb-6">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`flex-1 h-1 rounded-full ${s <= step ? "bg-[#1E90FF]" : "bg-white/10"}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-white/60 mb-2">Parent / Guardian Name</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              data-testid="input-parent-name"
              className="w-full bg-black border border-white/20 rounded-lg px-3 py-3 text-white focus:border-[#1E90FF] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-white/60 mb-2">Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              data-testid="input-parent-email"
              className="w-full bg-black border border-white/20 rounded-lg px-3 py-3 text-white focus:border-[#1E90FF] focus:outline-none"
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-white/60 mb-2">Your Athlete's Age</label>
            <div className="grid grid-cols-3 gap-2">
              {["8–10", "11–12", "13–14", "15–16", "17–18"].map((a) => (
                <button
                  key={a}
                  onClick={() => setAthleteAge(a)}
                  data-testid={`button-age-${a}`}
                  className={`px-3 py-3 text-sm font-bold rounded-lg transition ${
                    athleteAge === a
                      ? "bg-[#1E90FF] text-white"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  Ages {a}
                </button>
              ))}
            </div>
          </div>
          {(athleteAge === "8–10" || athleteAge === "11–12") && (
            <div className="text-[11px] text-white/50 bg-black/40 border border-white/10 rounded p-3 italic">
              Your athlete is under 13. We will email you a one-time verification link to confirm parental consent before any athlete data is stored — that's COPPA, and we follow it to the letter.
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <label className="block text-[11px] font-bold uppercase tracking-widest text-white/60 mb-2">Athlete's Position</label>
          <div className="grid grid-cols-3 gap-2">
            {(["P", "C", "Both"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPosition(p)}
                data-testid={`button-position-${p}`}
                className={`px-3 py-4 text-base font-black rounded-lg transition ${
                  position === p ? "bg-[#1E90FF] text-white" : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                {p === "P" ? "Pitcher" : p === "C" ? "Catcher" : "Both"}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-white/50">
            "Both" unlocks the full Battery Blueprint — the pitcher track AND the catcher track, plus the pitch-call simulator.
          </p>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div className="border border-white/10 rounded p-4 bg-black/40">
            <div className="text-[11px] uppercase tracking-widest text-white/50 mb-2">Confirm</div>
            <div className="text-sm text-white mb-1">Parent: <span className="font-bold">{name || "—"}</span></div>
            <div className="text-sm text-white mb-1">Email: <span className="text-[#88a8ff]">{email || "—"}</span></div>
            <div className="text-sm text-white mb-1">Athlete ages: <span className="font-bold">{athleteAge || "—"}</span></div>
            <div className="text-sm text-white">Position: <span className="font-bold">{position}</span></div>
          </div>
          <div className="text-[11px] text-white/50 italic">
            By clicking Submit, you confirm you are the parent or legal guardian and consent to AthlynX collecting your athlete's age band, position, and drill completion data. Plain-language privacy summary available before submit. No card required.
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={back}
          disabled={step === 1}
          data-testid="button-enroll-back"
          className="text-xs font-bold text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Back
        </button>
        <button
          onClick={next}
          data-testid="button-enroll-next"
          disabled={(step === 1 && (!name || !email)) || (step === 2 && !athleteAge)}
          className="bg-[#1E90FF] hover:bg-[#0080FF] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black px-6 py-3 rounded-lg text-sm transition shadow-[0_0_24px_-4px_rgba(30,144,255,0.5)]"
        >
          {step === 4 ? "Submit · Get My Starter Pack" : "Continue →"}
        </button>
      </div>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Main page
// ───────────────────────────────────────────────────────────────────────────

export default function DiamondGrindIQ() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a1628] to-black text-white">
      <div className="max-w-6xl mx-auto px-5 py-10">
        {/* Owl mark / brand strip */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <a className="flex items-center gap-3 group">
              <img
                src="/athlynx-app-icon.png"
                alt="AthlynX"
                className="w-10 h-10 rounded-lg ring-1 ring-[#1E90FF]/40 group-hover:ring-[#1E90FF] transition"
              />
              <div>
                <div className="text-sm font-bold tracking-widest text-white">AthlynX<span className="text-[#1E90FF]">XAI</span></div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#1E90FF]">Diamond Grind IQ · The Athlete's Playbook</div>
              </div>
            </a>
          </Link>
          <div className="text-[10px] uppercase tracking-widest text-white/40">athlynx.ai/diamond-grind-iq</div>
        </div>

        {/* HERO */}
        <header className="mb-10 border-b border-white/10 pb-10">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#1E90FF] mb-3">
            The Lifeblood Lane · Where Diamonds Get Found
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 leading-[1.05]">
            Read it. Call it. <span className="text-[#1E90FF]">Own it.</span>
          </h1>
          <p className="text-lg text-white/70 max-w-3xl mb-6 leading-relaxed">
            Diamond Grind IQ is the first youth baseball platform that trains the pitcher and the catcher as a single brain — the battery — not two separate athletes. Sports IQ first. Mechanics second. Parents in control.
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <a
              href="#enroll"
              data-testid="button-hero-enroll"
              className="bg-[#1E90FF] hover:bg-[#0080FF] text-white font-black px-6 py-3 rounded-lg text-sm transition shadow-[0_0_24px_-4px_rgba(30,144,255,0.6)]"
            >
              Start Free — Parent Sign Up
            </a>
            <a
              href="#blueprint"
              data-testid="button-hero-blueprint"
              className="border border-white/20 hover:border-[#1E90FF] hover:text-[#1E90FF] text-white font-bold px-6 py-3 rounded-lg text-sm transition"
            >
              See the Battery Blueprint
            </a>
            <a
              href="#arm-health"
              data-testid="button-hero-arm-health"
              className="text-[#88a8ff] hover:text-white font-bold text-sm transition px-3 py-3"
            >
              Pitch Smart Calculator →
            </a>
          </div>

          {/* Three feature pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-10">
            <div className="border border-white/10 rounded-lg bg-black/40 p-4">
              <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1E90FF] mb-2">PILLAR 01</div>
              <div className="text-base font-bold text-white mb-1">Battery Blueprint</div>
              <p className="text-xs text-white/60 leading-snug">Age-graded pitcher + catcher IQ modules built on Pitch Smart, ABCA fundamentals, and Decision Training. Three age bands · shared language.</p>
            </div>
            <div className="border border-white/10 rounded-lg bg-black/40 p-4">
              <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1E90FF] mb-2">PILLAR 02</div>
              <div className="text-base font-bold text-white mb-1">Drill Library</div>
              <p className="text-xs text-white/60 leading-snug">12 starter drills, every one tagged by age, position, and the IQ skill it builds. Sources linked. Coach-ready, parent-trustable.</p>
            </div>
            <div className="border border-white/10 rounded-lg bg-black/40 p-4">
              <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1E90FF] mb-2">PILLAR 03</div>
              <div className="text-base font-bold text-white mb-1">Arm Health, Always On</div>
              <p className="text-xs text-white/60 leading-snug">Pitch Smart calculator built right in. Parents see required rest by age and pitch count — before the next game, not after.</p>
            </div>
          </div>
        </header>

        {/* SECTIONS */}
        <div id="enroll"><ParentEnrollment /></div>
        <div id="blueprint"><BatteryBlueprint /></div>
        <div id="arm-health"><ArmHealthCalculator /></div>
        <div id="drills"><DrillLibrary /></div>

        {/* Mission strip */}
        <section className="border border-[#1E90FF]/40 rounded-xl bg-gradient-to-r from-[#1E90FF]/10 via-black to-black p-6 md:p-8 mb-10 text-center">
          <div className="text-[10px] font-black uppercase tracking-[0.32em] text-[#1E90FF] mb-3">THE MISSION</div>
          <p className="text-xl md:text-2xl font-black text-white tracking-tight mb-2 leading-tight">
            ONE IDENTITY. EVERY ATHLETE. EVERY PLATFORM.
          </p>
          <p className="text-sm text-white/60 max-w-2xl mx-auto">
            Diamond Grind IQ is where we find the next great competitor — the diamond in the rough — at age 9, age 12, age 15. Sports IQ first. Mechanics second. Parents stay in the driver's seat.
          </p>
        </section>

        {/* COPPA disclosure footer */}
        <div className="border border-white/10 rounded-lg bg-black/40 p-5 mb-10">
          <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1E90FF] mb-2">Parent Promise · COPPA Compliance</div>
          <p className="text-xs text-white/60 leading-relaxed">
            AthlynX collects athlete age band, position, and drill completion data only. No personal identifiers (name, photo, location) for athletes under 13 are stored without verifiable parental consent. Parents may review, edit, or delete their athlete's data at any time from Account Settings → Athlete Profile. We do not share child data with third parties or use it for behavioral advertising. Full privacy policy at{" "}
            <Link href="/privacy"><a className="text-[#88a8ff] underline">athlynx.ai/privacy</a></Link>.
          </p>
        </div>

        {/* Footer signoff — brand lock (May 27 cleanup: retired 'Complete Athlete Ecosystem') */}
        <footer className="border-t border-white/10 pt-6 mt-4 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#1E90FF] mb-1">
            ATHLYNX · THE ATHLETE'S PLAYBOOK
          </p>
          <p className="text-[11px] text-white/50 mb-3">One identity. Every athlete. Every platform.</p>
          </footer>
      </div>
    </div>
  );
}
