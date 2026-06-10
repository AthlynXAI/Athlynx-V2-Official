import { Link } from "wouter";
import {
  Activity,
  Award,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock,
  Dumbbell,
  GraduationCap,
  HeartPulse,
  Lock,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";

type SportSeason = {
  sport: string;
  gender: "Men" | "Women" | "Men & Women";
  season: string;
  championship: string;
  hub: string;
  route: string;
};

type JourneyStage = {
  stage: string;
  signal: string;
  data: string;
  action: string;
};

const sportSeasons: SportSeason[] = [
  { sport: "Baseball", gender: "Men", season: "Spring", championship: "Regionals → Super Regionals → Omaha", hub: "Diamond Grind · Road to Omaha", route: "/road-to-omaha" },
  { sport: "Softball", gender: "Women", season: "Spring", championship: "Regionals → Super Regionals → Women's College World Series (OKC)", hub: "Softball Nation · Women's College World Series", route: "/softball" },
  { sport: "Basketball", gender: "Men & Women", season: "Winter / Spring", championship: "Conference tournaments → March Madness", hub: "Court Kings · March Madness", route: "/basketball" },
  { sport: "Football", gender: "Men", season: "Fall / Winter", championship: "Conference titles → College Football Playoff", hub: "Gridiron Nexus · Playoff Chase", route: "/football" },
  { sport: "Soccer", gender: "Men & Women", season: "Fall", championship: "Conference tournaments → NCAA tournament", hub: "Pitch Pulse · College Cup", route: "/soccer" },
  { sport: "Volleyball", gender: "Women", season: "Fall", championship: "Conference titles → NCAA tournament", hub: "Net Setters · Title Chase", route: "/net-setters" },
  { sport: "Track & Field", gender: "Men & Women", season: "Indoor / Outdoor", championship: "Conference → Regionals → NCAA championships", hub: "Track Elite · Championship Lane", route: "/track-elite" },
  { sport: "Swimming", gender: "Men & Women", season: "Winter", championship: "Conference → NCAA championships", hub: "Swim Surge · Championship Lanes", route: "/swim-surge" },
  { sport: "Wrestling", gender: "Men & Women", season: "Winter", championship: "State / Conference → NCAA championships", hub: "Mat Warriors · Bracket Path", route: "/mat-warriors" },
  { sport: "Golf", gender: "Men & Women", season: "Spring", championship: "Regionals → NCAA championships", hub: "Fairway Elite · Championship Course", route: "/golf" },
];

const journeyStages: JourneyStage[] = [
  { stage: "Youth / Amateur", signal: "early skill, love of the game, family support", data: "sport, position, schedule, local awards, training habits", action: "start the athlete record and calendar" },
  { stage: "High School / Club", signal: "varsity role, travel team, state championship path", data: "stats, video, star rating, top schools, coach contact", action: "claim profile and build recruiting presence" },
  { stage: "College / Transfer", signal: "conference role, NIL value, portal options", data: "eligibility, offers, visits, NIL deals, transfer fit", action: "activate NIL Portal and Transfer Portal workflows" },
  { stage: "Pro Path", signal: "draft interest, combines, scouts, private workouts", data: "pro-team interest, agent contact, medical/privacy labels", action: "route verified professionals through AthlynXAI" },
  { stage: "World-Class Elite", signal: "best in sport, five-tool, generational upside", data: "elite classification, brand value, media profile, endorsement readiness", action: "prioritize endorsement, media, NIL, and pro-team workflows" },
];

const profileLayers = [
  "0–5 star rating by sport and position",
  "top school choices with logo and mascot slots",
  "schools actively recruiting the athlete",
  "pro-team, scout, and draft-interest signals",
  "mental and physical health progress labels with privacy controls",
  "schedule, tournament, camp, showcase, and championship calendar",
  "awards, honors, stat milestones, offers, visits, commits, transfers, and media moments",
  "secure communication for verified coaches, scouts, agents, lawyers, financial advisors, and NIL partners",
];

const growthMetrics = [
  { metric: "True accounts", current: "Needs production source-of-truth connection", fix: "Separate account count from public profile count and test the live database path." },
  { metric: "Public athlete profiles", current: "13 returned from the last READY public profile API probe", fix: "Expose this as public profiles, not total users, and reconcile against admin CRM." },
  { metric: "Daily report count", current: "Report showed 14 while the public API returned 13 and one Neon project returned 1 user / 0 profiles", fix: "Label source, database, entity, and timestamp on every report." },
  { metric: "Profile claims", current: "Instrumentation pending", fix: "Track landing CTA, signup start, claim started, claim completed, onboarding completed." },
  { metric: "Activation", current: "Studio opens and returning profiles showed 0 in the report", fix: "Track schedule added, accomplishment added, share card created, feed share, and return visits." },
];

const omahaTimeline = [
  { phase: "Regionals", timing: "May 29–June 1", detail: "16 host sites, four teams per regional, double-elimination brackets, winner advances." },
  { phase: "Super Regionals", timing: "June 5–8", detail: "16 regional winners pair into eight best-of-three Super Regionals for the right to reach Omaha." },
  { phase: "Men’s College World Series", timing: "June 12–22", detail: "Eight teams reach Charles Schwab Field Omaha for the Greatest Show on Grass." },
  { phase: "Women’s College World Series", timing: "May 28–June 4/5", detail: "Eight softball teams battle in Oklahoma City, with Mississippi State making its first WCWS appearance." },
];

const mississippiChampionshipWatch = [
  { label: "Mississippi State Baseball", detail: "No. 14 national seed · Starkville Regional host · Dudy Noble Field", tone: "border-red-300/30 bg-red-950/25" },
  { label: "Southern Miss Baseball", detail: "Hattiesburg Regional host · Pete Taylor Park · Base Burg energy", tone: "border-blue-500/40/30 bg-blue-900/40/10" },
  { label: "Ole Miss Baseball", detail: "Lincoln Regional · Hotty Toddy · Magnolia State in the field", tone: "border-blue-300/30 bg-blue-400/10" },
  { label: "Mississippi State Softball", detail: "Women’s College World Series · first trip to Oklahoma City", tone: "border-pink-300/30 bg-pink-400/10" },
];

const fanCallStats = [
  { label: "Baseball calls", value: "64-team field", pct: 92, detail: "Road to Omaha cards, regional calls, and share prompts" },
  { label: "Softball calls", value: "8-team WCWS", pct: 88, detail: "Road to OKC cards and women’s championship spotlight" },
  { label: "School-pride lane", value: "Free only", pct: 100, detail: "No money or cash prizes — just community calls and badges" },
];

const fanCallFlow = [
  { label: "Call your winner", detail: "Choose who advances for fun, pride, and community badges." },
  { label: "Share to public feed", detail: "Turn the call into a feed post, school-pride badge, or athlete conversation starter." },
  { label: "Message your circle", detail: "Use NIL Messenger to invite teammates, parents, alumni, and fans into the same championship lane." },
  { label: "Track the crowd", detail: "Show percentage of users calling each team, correct-call counts, and yearly history." },
];

const dataSourceModel = [
  { label: "Official", detail: "NCAA.com bracket, scores, automatic qualifiers, host-site release, and selection-show results." },
  { label: "Projection", detail: "D1Baseball America, Warren Nolan, and other projection outlets until NCAA confirms the field." },
  { label: "AthlynXAI OS", detail: "Manual update fallback, timestamped source labels, audit proof, player schedule mapping, and share-card generation." },
];

const bracketBlueprint = [
  { region: "Los Angeles", host: "UCLA", one: "UCLA", two: "Virginia Tech", three: "Cal Poly", four: "Saint Mary’s (CA)", path: "Winner → Super Regional path" },
  { region: "Atlanta", host: "Georgia Tech", one: "Georgia Tech", two: "Oklahoma", three: "The Citadel", four: "UIC", path: "Winner → Super Regional path" },
  { region: "Athens", host: "Georgia", one: "Georgia", two: "Boston College", three: "Liberty", four: "LIU", path: "Winner → Super Regional path" },
  { region: "Auburn", host: "Auburn", one: "Auburn", two: "UCF", three: "NC State", four: "Milwaukee", path: "Winner → Super Regional path" },
  { region: "Chapel Hill", host: "North Carolina", one: "North Carolina", two: "Tennessee", three: "East Carolina", four: "VCU", path: "Winner → Super Regional path" },
  { region: "Austin", host: "Texas", one: "Texas", two: "UC Santa Barbara", three: "Tarleton State", four: "Holy Cross", path: "Winner → Super Regional path" },
  { region: "Tuscaloosa", host: "Alabama", one: "Alabama", two: "Oklahoma State", three: "USC Upstate", four: "Alabama State", path: "Winner → Super Regional path" },
  { region: "Gainesville", host: "Florida", one: "Florida", two: "Miami (FL)", three: "Troy", four: "Rider", path: "Winner → Super Regional path" },
  { region: "Hattiesburg", host: "Southern Miss", one: "Southern Miss", two: "Virginia", three: "Jacksonville State", four: "Little Rock", path: "Winner → Super Regional path" },
  { region: "Tallahassee", host: "Florida State", one: "Florida State", two: "Coastal Carolina", three: "NIU", four: "St. John’s (NY)", path: "Winner → Super Regional path" },
  { region: "Eugene", host: "Oregon", one: "Oregon", two: "Oregon State", three: "Washington State", four: "Yale", path: "Winner → Super Regional path" },
  { region: "College Station", host: "Texas A&M", one: "Texas A&M", two: "Southern California", three: "Texas State", four: "Lamar", path: "Winner → Super Regional path" },
  { region: "Lincoln", host: "Nebraska", one: "Nebraska", two: "Ole Miss", three: "Arizona State", four: "South Dakota State", path: "Winner → Super Regional path" },
  { region: "Starkville", host: "Mississippi State", one: "Mississippi State", two: "Cincinnati", three: "Louisiana", four: "Lipscomb", path: "Winner → Super Regional path" },
  { region: "Lawrence", host: "Kansas", one: "Kansas", two: "Arkansas", three: "Missouri State", four: "Northeastern", path: "Winner → Super Regional path" },
  { region: "Morgantown", host: "West Virginia", one: "West Virginia", two: "Wake Forest", three: "Kentucky", four: "Binghamton", path: "Winner → Super Regional path" },
];

const wcwsBracket = [
  { game: "Game 1", matchup: "Texas Tech vs Mississippi State", time: "May 28 · Noon ET · ESPN", lane: "Winner to Game 7 · loser to Game 5" },
  { game: "Game 2", matchup: "Tennessee vs Texas", time: "May 28 · 2:30 p.m. ET · ESPN", lane: "Winner to Game 7 · loser to Game 5" },
  { game: "Game 3", matchup: "Alabama vs UCLA", time: "May 28 · 7 p.m. ET · ESPN2", lane: "Winner to Game 8 · loser to Game 6" },
  { game: "Game 4", matchup: "Arkansas vs Nebraska", time: "May 28 · 9:30 p.m. ET · ESPN2", lane: "Winner to Game 8 · loser to Game 6" },
  { game: "Championship Finals", matchup: "Best-of-three national championship series", time: "June 3–5 · ESPN", lane: "Road to OKC champion" },
];

export default function AthlynXAISeasonEngine() {
  return (
    <main className="min-h-screen bg-[#030814] text-white">
      <section className="relative overflow-hidden border-b border-cyan-400/20 bg-gradient-to-br from-[#020617] via-[#061b3a] to-[#071a52] px-4 py-16">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 10%, rgba(0,194,255,0.35), transparent 28%), radial-gradient(circle at 80% 0%, rgba(37,99,235,0.3), transparent 32%)" }} />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-cyan-200">
            <Sparkles className="h-4 w-4" /> AthlynXAI OS · Season Engine · CRM
          </div>
          <h1 className="max-w-5xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
            Every sport runs in seasons. Every athlete has a journey. AthlynXAI tracks both.
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-relaxed text-blue-100 md:text-xl">
            This is the operating layer for true user growth, player development, recruiting intelligence, NIL readiness, transfer paths, pro-team interest, and championship-season activation across men’s and women’s sports. Baseball and softball are the immediate acquisition window: Road to Omaha, Road to OKC, Diamond Grind, public feed moments, NIL Messenger sharing, and free school-pride fan calls.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className="rounded-2xl bg-cyan-400 px-6 py-3 font-black text-[#03122d] shadow-lg shadow-cyan-500/20 transition hover:bg-white">
              Claim an athlete profile
            </Link>
            <Link href="/crm" className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 font-black text-white transition hover:bg-white/20">
              Open CRM command center
            </Link>
            <Link href="/road-to-omaha" className="rounded-2xl border border-blue-300/30 bg-blue-500/20 px-6 py-3 font-black text-blue-100 transition hover:bg-blue-500/30">
              Diamond Grind Road to Omaha
            </Link>
          </div>
        </div>
      </section>


      <section className="border-y border-cyan-400/20 bg-[#020713] px-4 py-12">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-cyan-200">
              <TrendingUp className="h-4 w-4" /> Free fan calls · school pride only
            </div>
            <h2 className="mt-5 text-3xl font-black leading-tight md:text-5xl">Let fans make the call, then show the crowd.</h2>
            <p className="mt-5 max-w-3xl text-base font-semibold leading-relaxed text-blue-100/80">
              This is free school-pride engagement: call winners, earn badges, compare the crowd, share to the public feed, and invite teammates or family through NIL Messenger. The yearly data becomes a championship study AthlynXAI can offer every season, without money or cash prizes.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {fanCallFlow.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <h3 className="font-black text-white">{item.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-blue-200">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-cyan-300/20 bg-[#07142c] p-6 shadow-2xl shadow-blue-950/40">
            <div className="mb-5 flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-cyan-300" />
              <div>
                <div className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Fan-call analytics</div>
                <h3 className="text-2xl font-black">What the chart tracks</h3>
              </div>
            </div>
            <div className="space-y-4">
              {fanCallStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-black text-white">{stat.label}</p>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-200">{stat.value}</p>
                    </div>
                    <span className="text-lg font-black text-white">{stat.pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${stat.pct}%` }} />
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-blue-200">{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 lg:grid-cols-3">
        <div className="rounded-3xl border border-cyan-400/20 bg-[#07142c] p-6 shadow-2xl shadow-blue-950/40">
          <BarChart3 className="mb-4 h-8 w-8 text-cyan-300" />
          <h2 className="text-2xl font-black">True growth source of truth</h2>
          <p className="mt-3 text-sm leading-relaxed text-blue-200">
            The daily report must stop mixing entity types. AthlynXAI needs separate counts for accounts, athlete profiles, public profiles, profile claims, onboarding completion, activation, and returning athletes.
          </p>
        </div>
        <div className="rounded-3xl border border-blue-500/40/20 bg-[#07142c] p-6 shadow-2xl shadow-blue-950/40">
          <Trophy className="mb-4 h-8 w-8 text-blue-400" />
          <h2 className="text-2xl font-black">Elite and five-tool classification</h2>
          <p className="mt-3 text-sm leading-relaxed text-blue-200">
            Each sport gets 0–5 star classification, plus an elite category for world-class, pro-ready, five-tool, and generational athletes who should be routed to NIL, endorsement, scouting, and pro workflows.
          </p>
        </div>
        <div className="rounded-3xl border border-emerald-300/20 bg-[#07142c] p-6 shadow-2xl shadow-blue-950/40">
          <HeartPulse className="mb-4 h-8 w-8 text-emerald-300" />
          <h2 className="text-2xl font-black">Mental and physical health</h2>
          <p className="mt-3 text-sm leading-relaxed text-blue-200">
            Athlete development includes the body and the mind. Health-related signals must be privacy-aware, clearly labeled, and protected from public sharing unless the athlete and proper permissions allow it.
          </p>
        </div>
      </section>

      <section className="border-y border-blue-900/70 bg-[#061126] px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">All sports · men’s and women’s seasons</div>
              <h2 className="mt-2 text-3xl font-black md:text-4xl">Seasonal championship hubs and app-marketing windows</h2>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-blue-200">
              Baseball and women’s softball are the immediate Diamond Grind window, but the engine repeats every season: MCWS, WCWS, football playoff, March Madness, and every men’s and women’s championship lane.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sportSeasons.map((item) => (
              <Link key={`${item.sport}-${item.gender}`} href={item.route} className="group rounded-3xl border border-white/10 bg-[#0a1a3c] p-5 transition hover:-translate-y-1 hover:border-cyan-300/50 hover:bg-[#0d2455]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">{item.gender} · {item.season}</div>
                    <h3 className="mt-2 text-xl font-black text-white">{item.sport}</h3>
                  </div>
                  <Trophy className="h-6 w-6 text-blue-400" />
                </div>
                <p className="mt-4 text-sm font-semibold text-blue-100">{item.championship}</p>
                <p className="mt-2 text-sm text-blue-300">{item.hub}</p>
                <div className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-white/60 group-hover:text-cyan-200">Open hub →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-blue-700/50 bg-[#07142c] p-6">
            <div className="mb-6 flex items-center gap-3">
              <Activity className="h-8 w-8 text-cyan-300" />
              <div>
                <div className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Athletic journey CRM</div>
                <h2 className="text-3xl font-black">From youth to world-class elite</h2>
              </div>
            </div>
            <div className="space-y-4">
              {journeyStages.map((stage) => (
                <div key={stage.stage} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-black text-white">{stage.stage}</h3>
                    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-cyan-200">{stage.action}</span>
                  </div>
                  <p className="mt-3 text-sm text-blue-200"><span className="font-bold text-white">Signal:</span> {stage.signal}</p>
                  <p className="mt-1 text-sm text-blue-200"><span className="font-bold text-white">Data:</span> {stage.data}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-blue-500/40/30 bg-gradient-to-br from-[#18110a] to-[#07142c] p-6">
            <div className="mb-6 flex items-center gap-3">
              <Star className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-xs font-black uppercase tracking-[0.25em] text-blue-400">Profile money layer</div>
                <h2 className="text-3xl font-black">Recruiting, NIL, transfer, and pro value</h2>
              </div>
            </div>
            <div className="grid gap-3">
              {profileLayers.map((layer) => (
                <div key={layer} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-blue-100">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-300" />
                  <span>{layer}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-cyan-200"><MessageSquare className="h-4 w-4" /> verified communication</div>
              <p className="mt-2 text-sm leading-relaxed text-blue-200">
                College coaches, scouts, agents, lawyers, financial advisors, brands, and approved pro/team contacts should communicate through verified AthlynXAI lanes so the athlete, family, and organization keep a clean record.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-cyan-400/10 bg-[#07142c] px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center gap-3">
            <Target className="h-8 w-8 text-cyan-300" />
            <div>
              <div className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Growth recovery</div>
              <h2 className="text-3xl font-black">Stop guessing. Count the funnel correctly.</h2>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-blue-700/60">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-blue-950/80 text-xs uppercase tracking-[0.18em] text-cyan-200">
                <tr>
                  <th className="p-4">Metric</th>
                  <th className="p-4">Current finding</th>
                  <th className="p-4">Required fix</th>
                </tr>
              </thead>
              <tbody>
                {growthMetrics.map((row) => (
                  <tr key={row.metric} className="border-t border-blue-800/70 bg-[#081a3a] align-top">
                    <td className="p-4 font-black text-white">{row.metric}</td>
                    <td className="p-4 text-blue-200">{row.current}</td>
                    <td className="p-4 text-blue-200">{row.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-y border-blue-500/40/20 bg-gradient-to-br from-[#0a1224] via-[#07142c] to-[#150f08] px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/40/40 bg-blue-900/40/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-blue-400">
                <Trophy className="h-4 w-4" /> Diamond Grind · Road to Omaha
              </div>
              <h2 className="mt-4 max-w-4xl text-3xl font-black md:text-5xl">Regionals. Super Regionals. Omaha. OKC. Free fan calls. Championship data every year.</h2>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-blue-100">
Diamond Grind and Softball Nation are the seasonal front doors right now. The page uses original bracket cards and source links instead of screenshot graphics, then turns fan calls into public feed engagement, NIL Messenger sharing, and year-over-year championship data.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {omahaTimeline.map((item, index) => (
              <div key={item.phase} className="rounded-3xl border border-white/10 bg-black/25 p-5 shadow-xl shadow-black/20">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-black text-cyan-200">0{index + 1}</span>
                  <Clock className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-black text-white">{item.phase}</h3>
                <div className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-blue-400">{item.timing}</div>
                <p className="mt-3 text-sm leading-relaxed text-blue-200">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-blue-500/40/20 bg-black/25 p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.22em] text-blue-400">Mississippi championship watch</div>
                  <h3 className="mt-2 text-2xl font-black">The Magnolia State is all over the hunt</h3>
                </div>
                <span className="rounded-full bg-blue-900/40/10 px-3 py-1 text-[11px] font-black uppercase text-blue-400">Respect all · pull for all</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {mississippiChampionshipWatch.map((team) => (
                  <div key={team.label} className={`rounded-2xl border ${team.tone} p-4 text-sm text-blue-100`}>
                    <h4 className="font-black text-white">{team.label}</h4>
                    <p className="mt-2 text-blue-200">{team.detail}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-cyan-300/20 bg-black/25 p-5">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">WCWS Road to OKC</div>
              <h3 className="mt-2 text-2xl font-black">Women’s softball belongs at the top.</h3>
              <div className="mt-4 space-y-3">
                {wcwsBracket.map((item) => (
                  <div key={item.game} className="rounded-2xl border border-white/10 bg-[#0a1a3c] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="font-black text-white">{item.game}</h4>
                      <span className="text-[10px] font-black uppercase tracking-[0.14em] text-pink-200">WCWS</span>
                    </div>
                    <p className="mt-2 text-sm font-bold text-blue-100">{item.matchup}</p>
                    <p className="mt-1 text-xs text-blue-300">{item.time}</p>
                    <p className="mt-1 text-xs text-blue-300">{item.lane}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {dataSourceModel.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-[#081a3a] p-4">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">{item.label} data lane</div>
                <p className="mt-2 text-sm leading-relaxed text-blue-200">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-cyan-300/20 bg-[#061126] p-5">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Field of 64 bracket board</div>
                <h3 className="mt-2 text-2xl font-black">16 Regionals → 8 Super Regionals → 8-team College World Series in Omaha → championship series</h3>
              </div>
              <span className="rounded-full border border-blue-500/40/40 bg-blue-900/40/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-400">Official links · original cards</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {bracketBlueprint.map((slot) => (
                <div key={slot.region} className="rounded-2xl border border-white/10 bg-[#0a1a3c] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-black text-white">{slot.region}</h4>
                    <span className="rounded-full bg-blue-500/20 px-2 py-1 text-[10px] font-black uppercase text-blue-100">{slot.host}</span>
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    {[slot.one, slot.two, slot.three, slot.four].map((seed) => (
                      <div key={seed} className="flex items-center justify-between rounded-xl border border-blue-900/70 bg-black/20 px-3 py-2 text-blue-100">
                        <span>{seed}</span>
                        <span className="text-xs text-blue-400">Fan call</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-cyan-200">{slot.path}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4">
                <h4 className="font-black text-emerald-100">Selection committee watch</h4>
                <p className="mt-2 text-sm text-emerald-50/80">Track national seeds, 16 host sites, bubble teams, first in, first out, automatic bids, and at-large pressure.</p>
              </div>
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4">
                <h4 className="font-black text-cyan-100">Player journey tie-in</h4>
                <p className="mt-2 text-sm text-cyan-50/80">Every athlete can connect schedule, awards, stats, school interest, pro interest, and Road to Omaha content to their profile.</p>
              </div>
              <div className="rounded-2xl border border-blue-500/40/20 bg-blue-900/40/10 p-4">
                <h4 className="font-black text-blue-400">Feed and share cards</h4>
                <p className="mt-2 text-sm text-blue-400/80">Regional wins, Super Regional clinches, Omaha appearances, honors, and highlight moments become cross-share assets.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 lg:grid-cols-3">
        <div className="rounded-3xl border border-cyan-400/20 bg-[#07142c] p-6 lg:col-span-2">
          <div className="mb-4 flex items-center gap-3">
            <Trophy className="h-8 w-8 text-blue-400" />
            <h2 className="text-3xl font-black">Diamond Grind Road to Omaha activation</h2>
          </div>
          <p className="text-sm leading-relaxed text-blue-200">
NCAA Baseball Regionals, Super Regionals, the Men’s College World Series in Omaha, the Women’s College World Series in Oklahoma City, and the Mississippi championship hunt are the immediate growth window. Baseball and softball athletes should be driven into profile claims, schedule calendars, accomplishment cards, five-tool classification, top school tracking, pro-interest signals, bracket share cards, free fan calls, NIL Messenger threads, and public feed moments.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {["Claim baseball or softball profile", "Add schedule and awards", "Share Road to Omaha / OKC fan-call card"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-black text-white">{item}</div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-blue-300/20 bg-[#07142c] p-6">
          <div className="mb-4 flex items-center gap-3">
            <Trophy className="h-8 w-8 text-pink-300" />
            <h2 className="text-2xl font-black">TikTok LIVE Studio</h2>
          </div>
          <p className="text-sm leading-relaxed text-blue-200">
            LIVE access must be used and verified before the 14-day revocation-risk window closes. The OS should store first-use deadline, first-live checklist, proof URL, content calendar, and reminders.
          </p>
          <Link href="/social-command-center" className="mt-5 inline-flex rounded-2xl bg-pink-500 px-5 py-3 text-sm font-black text-white transition hover:bg-pink-400">
            Open social command
          </Link>
        </div>
      </section>

      <section className="bg-[#030814] px-4 py-12">
        <div className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-gradient-to-r from-blue-950 to-slate-950 p-6">
          <div className="grid gap-6 md:grid-cols-4">
            <div className="flex gap-3"><ShieldCheck className="h-6 w-6 text-emerald-300" /><div><h3 className="font-black">Privacy first</h3><p className="mt-1 text-sm text-blue-200">Health, family, and recruiting-sensitive data require access labels.</p></div></div>
            <div className="flex gap-3"><Lock className="h-6 w-6 text-cyan-300" /><div><h3 className="font-black">Verified access</h3><p className="mt-1 text-sm text-blue-200">Professionals must be verified before communicating with athletes.</p></div></div>
            <div className="flex gap-3"><CalendarDays className="h-6 w-6 text-blue-400" /><div><h3 className="font-black">Calendar drives growth</h3><p className="mt-1 text-sm text-blue-200">Schedules, championships, visits, and camps create repeat usage.</p></div></div>
            <div className="flex gap-3"><Video className="h-6 w-6 text-pink-300" /><div><h3 className="font-black">Shareable media</h3><p className="mt-1 text-sm text-blue-200">Every achievement can become feed content and outside-platform traffic.</p></div></div>
          </div>
        </div>
      </section>
    </main>
  );
}
