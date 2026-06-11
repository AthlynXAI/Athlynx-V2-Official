import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import AthletePageBackground from "@/components/AthletePageBackground";

// ─────────────────────────────────────────────
// ATHLYNXAI OS — MCWS ROAD TO OMAHA BROADCAST
// The Greatest Show on Grass · Charles Schwab Field · Omaha, Nebraska
// June 12–22, 2026 · 8 Teams · 1 Champion
// ─────────────────────────────────────────────

// ── Types ──────────────────────────────────────────────────────────────────

interface ESPNGame {
  id: string;
  status: "pre" | "in" | "post";
  shortDetail: string;
  homeTeam: string;
  homeScore: string;
  awayTeam: string;
  awayScore: string;
  network?: string;
}

interface Player {
  name: string;
  position: string;
  year: string;
  stat: string;
  nilTier: "Elite" | "High" | "Rising";
  draftStatus?: string;
}

interface Team {
  id: string;
  name: string;
  shortName: string;
  seed: number | null;
  natlSeed: number | null;
  record: string;
  bracket: "bracket1" | "bracket2";
  conference: string;
  coach: string;
  coachYears: string;
  stadium: string;
  city: string;
  color: string;
  accent: string;
  fanBase: string;
  fanChant: string;
  fanIdentity: string;
  story: string;
  players: Player[];
  podcastAngle: string;
  youtubeQuery: string;
}

// ── 2026 CWS 8-Team Data ───────────────────────────────────────────────────

const TEAMS: Team[] = [
  {
    id: "georgia",
    name: "Georgia Bulldogs",
    shortName: "Georgia",
    seed: 1,
    natlSeed: 3,
    record: "51-12",
    bracket: "bracket2",
    conference: "SEC",
    coach: "Wes Johnson",
    coachYears: "First CWS as head coach",
    stadium: "Foley Field",
    city: "Athens, GA",
    color: "#BA0C2F",
    accent: "#000000",
    fanBase: "Bulldog Nation",
    fanChant: "GO DAWGS · SIC 'EM",
    fanIdentity: "The most passionate fan base in the SEC. Athens turns red on game day. Bulldog Nation travels everywhere.",
    story: "First CWS since 2008. Won SEC regular season AND tournament for first time ever. 24 runs and 9 home runs in the Athens Super Regional. The hottest team in the country.",
    players: [
      { name: "Tre' Morgan", position: "1B", year: "Jr", stat: ".342 AVG · 14 HR · 67 RBI", nilTier: "Elite", draftStatus: "Top 10 MLB Draft Pick" },
      { name: "Caleb Aoki", position: "SP", year: "Jr", stat: "9-2 · 2.87 ERA · 112 K", nilTier: "High" },
      { name: "Justin Byrd", position: "RP", year: "So", stat: "8 SV · 1.24 ERA", nilTier: "Rising" },
    ],
    podcastAngle: "First CWS in 18 years — what changed under Wes Johnson and why Georgia is built to win it all",
    youtubeQuery: "Georgia Bulldogs baseball 2026 CWS highlights",
  },
  {
    id: "oklahoma",
    name: "Oklahoma Sooners",
    shortName: "Oklahoma",
    seed: 2,
    natlSeed: null,
    record: "37-22",
    bracket: "bracket2",
    conference: "SEC",
    coach: "Skip Johnson",
    coachYears: "10th season",
    stadium: "L. Dale Mitchell Park",
    city: "Norman, OK",
    color: "#841617",
    accent: "#FDF9D8",
    fanBase: "Sooner Nation",
    fanChant: "BOOMER SOONER",
    fanIdentity: "One of the most storied programs in college baseball. Sooner Nation never counts Oklahoma out — ever.",
    story: "Unranked and written off after losing 6 of 8 in May. Skip Johnson changed the rotation, found new arms, and the Sooners got hot at exactly the right time. Never sleep on Oklahoma.",
    players: [
      { name: "Xander Mercurius", position: "SP", year: "Jr", stat: "7-3 · 3.21 ERA", nilTier: "High" },
      { name: "Nick Wesloski", position: "SP", year: "Sr", stat: "First start of season vs Citadel — dominant", nilTier: "Rising" },
      { name: "Jackson Cleveland", position: "RP", year: "Jr", stat: "Clutch in 10-inning thriller vs Georgia Tech", nilTier: "Rising" },
    ],
    podcastAngle: "The resurrection story — how Skip Johnson rebuilt Oklahoma's rotation in 30 days",
    youtubeQuery: "Oklahoma Sooners baseball 2026 CWS Omaha",
  },
  {
    id: "north-carolina",
    name: "North Carolina Tar Heels",
    shortName: "North Carolina",
    seed: 1,
    natlSeed: 5,
    record: "50-12-1",
    bracket: "bracket1",
    conference: "ACC",
    coach: "Scott Forbes",
    coachYears: "3rd season",
    stadium: "Boshamer Stadium",
    city: "Chapel Hill, NC",
    color: "#4B9CD3",
    accent: "#FFFFFF",
    fanBase: "Tar Heel Nation",
    fanChant: "GO HEELS",
    fanIdentity: "Chapel Hill bleeds Carolina Blue. Tar Heel Nation is loyal, loud, and everywhere. Second CWS in three years.",
    story: "Survived the best pitching staff in the field (USC) on a walk-off by Owen Hull. Battle-tested, experienced, and they don't fold under pressure. The only team returning to Omaha in this span.",
    players: [
      { name: "Liam Doyle", position: "SP", year: "Jr", stat: "11-1 · 2.14 ERA · 134 K", nilTier: "Elite", draftStatus: "Projected Top 5 Pick" },
      { name: "Owen Hull", position: "OF", year: "Jr", stat: "Walk-off hero vs USC · .318 AVG · 4 2B in G3", nilTier: "High" },
      { name: "Gavin Gallaher", position: "SS", year: "Sr", stat: "Veteran leader · 2024 CWS experience", nilTier: "High" },
    ],
    podcastAngle: "Liam Doyle — the most dominant pitcher in college baseball and why he's the Omaha favorite",
    youtubeQuery: "North Carolina Tar Heels baseball 2026 CWS Liam Doyle",
  },
  {
    id: "ole-miss",
    name: "Ole Miss Rebels",
    shortName: "Ole Miss",
    seed: 2,
    natlSeed: null,
    record: "41-21",
    bracket: "bracket1",
    conference: "SEC",
    coach: "Mike Bianco",
    coachYears: "25th season",
    stadium: "Swayze Field",
    city: "Oxford, MS",
    color: "#CE1126",
    accent: "#14213D",
    fanBase: "Rebel Nation",
    fanChant: "HOTTY TODDY",
    fanIdentity: "Hotty Toddy. Oxford is one of the greatest college towns in America. Rebel Nation shows up everywhere. The Grove doesn't stop at football.",
    story: "Beat Arizona State twice, took out host Nebraska, then swept #4 Auburn in the Super Regional. Cade Townsend, Taylor Rabe, and Elliott Hunter form one of the toughest pitching trios in the field.",
    players: [
      { name: "Cade Townsend", position: "SP", year: "Jr", stat: "8-2 · 2.98 ERA · 108 K", nilTier: "Elite" },
      { name: "Taylor Rabe", position: "SP", year: "So", stat: "7-1 · 3.12 ERA", nilTier: "High" },
      { name: "Walker Hooks", position: "RP", year: "Sr", stat: "12 SV · 1.89 ERA", nilTier: "High" },
      { name: "Landon Waters", position: "RP", year: "Jr", stat: "1-2 bullpen punch with Hooks", nilTier: "Rising" },
    ],
    podcastAngle: "Mike Bianco's 25th season — the Ole Miss pitching machine and why Hotty Toddy is built for June",
    youtubeQuery: "Ole Miss Rebels baseball 2026 CWS highlights",
  },
  {
    id: "texas",
    name: "Texas Longhorns",
    shortName: "Texas",
    seed: 2,
    natlSeed: 6,
    record: "45-13",
    bracket: "bracket2",
    conference: "SEC",
    coach: "Jim Schlossnagle",
    coachYears: "4th season",
    stadium: "UFCU Disch-Falk Field",
    city: "Austin, TX",
    color: "#BF5700",
    accent: "#FFFFFF",
    fanBase: "Longhorn Nation",
    fanChant: "TEXAS FIGHT · HOOK 'EM HORNS",
    fanIdentity: "Texas is Texas. The biggest brand in college athletics. Longhorn Nation fills every stadium. Hook 'Em never stops.",
    story: "Back in Omaha after a 3-year drought. Dispatched Oregon in supers. Sam Cozart is the freshman phenom of the tournament. Schlossnagle is one of the best coaches in the country in high-pressure situations.",
    players: [
      { name: "Sam Cozart", position: "RP/SP", year: "Fr", stat: "Freshman phenom · 6-0 · 2.11 ERA", nilTier: "Elite", draftStatus: "Future Top Draft Pick" },
      { name: "Dylan Volantis", position: "SP", year: "Jr", stat: "9-2 · 3.44 ERA", nilTier: "High" },
      { name: "Jace LaViolette", position: "OF", year: "Jr", stat: ".331 AVG · 18 HR · 72 RBI", nilTier: "Elite", draftStatus: "Top 5 MLB Draft Pick" },
    ],
    podcastAngle: "Hook 'Em is back — Schlossnagle, Sam Cozart, and why Texas is always dangerous in June",
    youtubeQuery: "Texas Longhorns baseball 2026 CWS Omaha highlights",
  },
  {
    id: "west-virginia",
    name: "West Virginia Mountaineers",
    shortName: "West Virginia",
    seed: 1,
    natlSeed: 16,
    record: "45-15",
    bracket: "bracket1",
    conference: "Big 12",
    coach: "Randy Mazey",
    coachYears: "13th season",
    stadium: "Monongalia County Ballpark",
    city: "Morgantown, WV",
    color: "#002855",
    accent: "#EAAA00",
    fanBase: "Mountaineer Nation",
    fanChant: "TAKE ME HOME COUNTRY ROADS",
    fanIdentity: "The most electric fan base in Omaha. When WVU plays, the whole stadium sings Take Me Home Country Roads. First-ever CWS appearance and the crowd is already theirs.",
    story: "First CWS appearance in program history. Obliterated Cal Poly in Morgantown. Armani Guzman threw a 5-HR shutout. The Mountaineers are the Cinderella story of 2026 — and they have the bats to go deep.",
    players: [
      { name: "Armani Guzman", position: "SP", year: "Jr", stat: "10-2 · 2.67 ERA · 5-HR shutout in supers", nilTier: "High" },
      { name: "Ben Lumsden", position: "OF", year: "Jr", stat: ".308 AVG · 16 HR · Power bat", nilTier: "High" },
      { name: "Jake Sabol", position: "C", year: "Sr", stat: "Veteran leader · .291 AVG", nilTier: "Rising" },
    ],
    podcastAngle: "Take Me Home Country Roads — the WVU story that has all of Omaha rooting for them",
    youtubeQuery: "West Virginia Mountaineers baseball 2026 CWS first appearance",
  },
  {
    id: "alabama",
    name: "Alabama Crimson Tide",
    shortName: "Alabama",
    seed: 3,
    natlSeed: 7,
    record: "41-19",
    bracket: "bracket2",
    conference: "SEC",
    coach: "Brad Bohannon",
    coachYears: "5th season",
    stadium: "Sewell-Thomas Stadium",
    city: "Tuscaloosa, AL",
    color: "#9E1B32",
    accent: "#FFFFFF",
    fanBase: "Crimson Tide Nation",
    fanChant: "ROLL TIDE",
    fanIdentity: "Roll Tide never stops. Alabama fans travel in packs. Tuscaloosa baseball is on the rise and the Tide faithful are all in.",
    story: "Outhit Oklahoma State to get out of a tough region. A grand slam broke open Game 2 vs St. John's. Tanner Hall is the ace they need to go deep. The question: can Alabama get deep into games?",
    players: [
      { name: "Tanner Hall", position: "SP", year: "Jr", stat: "8-3 · 3.18 ERA · SEC tournament ace", nilTier: "High" },
      { name: "Will Porterfield", position: "OF", year: "Sr", stat: ".297 AVG · 12 HR", nilTier: "Rising" },
      { name: "Davis Sharpe", position: "1B", year: "Jr", stat: "Grand slam vs St. John's · .281 AVG", nilTier: "Rising" },
    ],
    podcastAngle: "Roll Tide baseball — Brad Bohannon building Alabama into an SEC power and what it means for the program",
    youtubeQuery: "Alabama Crimson Tide baseball 2026 CWS Omaha",
  },
  {
    id: "troy",
    name: "Troy Trojans",
    shortName: "Troy",
    seed: 4,
    natlSeed: null,
    record: "38-30",
    bracket: "bracket1",
    conference: "Sun Belt",
    coach: "Skylar Meade",
    coachYears: "2nd season",
    stadium: "Riddle-Pace Field",
    city: "Troy, AL",
    color: "#8B0000",
    accent: "#C0C0C0",
    fanBase: "Trojan Nation",
    fanChant: "T-R-O-Y · TROY TROY TROY",
    fanIdentity: "The ultimate underdog story. Troy, Alabama to Omaha, Nebraska. First-ever CWS appearance as the first 30-loss team to ever make it. The whole country is rooting for them.",
    story: "The greatest underdog story in 2026 college baseball. 29-loss Sun Belt team makes the tournament. Thumped Florida twice. Beat Little Rock 19-4 combined. First-ever CWS appearance. This is why we watch.",
    players: [
      { name: "Cade Winstead", position: "SP", year: "Jr", stat: "Led Troy to upset of Florida", nilTier: "Rising" },
      { name: "Brayden Theriot", position: "OF", year: "Sr", stat: "Hot bat in super regionals", nilTier: "Rising" },
      { name: "Jake Rucker", position: "SS", year: "Jr", stat: "Team leader · .278 AVG", nilTier: "Rising" },
    ],
    podcastAngle: "Troy, Alabama to Omaha — the impossible story of the 2026 College World Series Cinderella",
    youtubeQuery: "Troy Trojans baseball 2026 CWS first appearance underdog",
  },
];

const BRACKET_MATCHUPS = [
  { game: 1, bracket: "bracket1", team1: "West Virginia", team2: "Troy", date: "Fri Jun 13", time: "1:00 PM CT", network: "ESPN", result: null },
  { game: 2, bracket: "bracket1", team1: "North Carolina", team2: "Ole Miss", date: "Fri Jun 13", time: "6:00 PM CT", network: "ESPN", result: null },
  { game: 3, bracket: "bracket2", team1: "Alabama", team2: "Oklahoma", date: "Sat Jun 14", time: "2:00 PM CT", network: "ESPN", result: null },
  { game: 4, bracket: "bracket2", team1: "Georgia", team2: "Texas", date: "Sat Jun 14", time: "7:00 PM CT", network: "ESPN", result: null },
];

// ── ESPN Live Scoreboard Hook ───────────────────────────────────────────────

function useESPNScoreboard() {
  const [games, setGames] = useState<ESPNGame[]>([]);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchScoreboard = useCallback(async () => {
    try {
      const res = await fetch("https://site.api.espn.com/apis/site/v2/sports/baseball/college-baseball/scoreboard");
      if (!res.ok) throw new Error(`ESPN API ${res.status}`);
      const data = await res.json();
      const events = (data?.events ?? []) as any[];
      const parsed: ESPNGame[] = events.map((e) => {
        const comp = e?.competitions?.[0];
        const home = comp?.competitors?.find((c: any) => c?.homeAway === "home");
        const away = comp?.competitors?.find((c: any) => c?.homeAway === "away");
        const stateRaw = comp?.status?.type?.state as string | undefined;
        const state: ESPNGame["status"] = stateRaw === "in" ? "in" : stateRaw === "post" ? "post" : "pre";
        return {
          id: e?.id,
          status: state,
          shortDetail: comp?.status?.type?.shortDetail ?? "",
          homeTeam: home?.team?.shortDisplayName ?? home?.team?.displayName ?? "—",
          homeScore: home?.score ?? "—",
          awayTeam: away?.team?.shortDisplayName ?? away?.team?.displayName ?? "—",
          awayScore: away?.score ?? "—",
          network: comp?.broadcasts?.[0]?.names?.[0] ?? "ESPN",
        };
      });
      setGames(parsed);
      setUpdatedAt(new Date());
      setError(null);
    } catch (err: any) {
      setError(err?.message ?? "Live scores temporarily unavailable");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScoreboard();
    const interval = setInterval(fetchScoreboard, 60_000);
    return () => clearInterval(interval);
  }, [fetchScoreboard]);

  return { games, updatedAt, error, loading, refetch: fetchScoreboard };
}

// ── Sub-components ─────────────────────────────────────────────────────────

function LivePulse() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-[#1E90FF] animate-pulse" />
      <span className="text-[10px] font-black tracking-widest uppercase text-[#1E90FF]">LIVE</span>
    </span>
  );
}

function StatusBadge({ status }: { status: ESPNGame["status"] }) {
  if (status === "in") return (
    <span className="text-[9px] font-black tracking-widest uppercase text-white bg-[#1E90FF] px-2 py-0.5 rounded-full animate-pulse">● LIVE</span>
  );
  if (status === "post") return (
    <span className="text-[9px] font-black tracking-widest uppercase text-white/60 bg-white/10 px-2 py-0.5 rounded-full">FINAL</span>
  );
  return (
    <span className="text-[9px] font-black tracking-widest uppercase text-white/40 bg-white/5 px-2 py-0.5 rounded-full">UPCOMING</span>
  );
}

function NILBadge({ tier }: { tier: Player["nilTier"] }) {
  const styles = {
    Elite: "bg-[#1E90FF]/20 text-[#1E90FF] border border-[#1E90FF]/30",
    High: "bg-white/10 text-white/70 border border-white/20",
    Rising: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  };
  return (
    <span className={`text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded ${styles[tier]}`}>
      {tier === "Elite" ? "⚡ ELITE NIL" : tier === "High" ? "★ HIGH VALUE" : "↑ RISING"}
    </span>
  );
}

// ── Live Score Strip ────────────────────────────────────────────────────────

function LiveScoreStrip() {
  const { games, updatedAt, error, loading, refetch } = useESPNScoreboard();
  const liveGames = games.filter((g) => g.status === "in");
  const display = liveGames.length > 0 ? liveGames : games.slice(0, 4);

  return (
    <div className="bg-black/60 border border-[#1E90FF]/20 rounded-xl p-4 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <LivePulse />
          <span className="text-xs font-black tracking-widest uppercase text-white/80">Scoreboard · Charles Schwab Field · Omaha</span>
        </div>
        <div className="flex items-center gap-3">
          {updatedAt && (
            <span className="text-[10px] text-white/30">
              Updated {updatedAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Chicago" })} CT
            </span>
          )}
          <button onClick={refetch} className="text-[10px] text-[#1E90FF]/60 hover:text-[#1E90FF] transition-colors">↻ REFRESH</button>
        </div>
      </div>

      {loading && (
        <div className="text-xs text-white/30 italic animate-pulse">Connecting to ESPN live feed…</div>
      )}
      {error && !loading && (
        <div className="text-xs text-white/40 italic">
          Live scores appear at first pitch · June 13 at 1 PM CT · ESPN
        </div>
      )}
      {!loading && !error && display.length === 0 && (
        <div className="text-xs text-white/40 italic">No games on the wire right now — first pitch June 13 at 1 PM CT</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {display.map((g) => (
          <div key={g.id} className="bg-black/40 border border-white/10 rounded-lg p-3 hover:border-[#1E90FF]/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <StatusBadge status={g.status} />
              <span className="text-[9px] text-white/30">{g.network}</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{g.awayTeam}</span>
                <span className="text-sm font-black text-white">{g.awayScore}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{g.homeTeam}</span>
                <span className="text-sm font-black text-white">{g.homeScore}</span>
              </div>
            </div>
            <div className="mt-2 text-[9px] text-white/30">{g.shortDetail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Bracket Tree ────────────────────────────────────────────────────────────

function BracketView({ onTeamClick }: { onTeamClick: (id: string) => void }) {
  const bracket1 = TEAMS.filter((t) => t.bracket === "bracket1");
  const bracket2 = TEAMS.filter((t) => t.bracket === "bracket2");

  const BracketTeam = ({ team }: { team: Team }) => (
    <button
      onClick={() => onTeamClick(team.id)}
      className="w-full flex items-center justify-between bg-black/40 border border-white/10 rounded-lg px-3 py-2 hover:border-[#1E90FF]/50 hover:bg-[#1E90FF]/5 transition-all group"
    >
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white/60 border border-white/20">
          {team.natlSeed ?? "—"}
        </div>
        <span className="text-xs font-bold text-white group-hover:text-[#1E90FF] transition-colors">{team.shortName}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-white/40">{team.record}</span>
        <span className="text-[9px] text-[#1E90FF]/60 group-hover:text-[#1E90FF] transition-colors">→</span>
      </div>
    </button>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {[{ label: "BRACKET 1", teams: bracket1, games: BRACKET_MATCHUPS.filter(m => m.bracket === "bracket1") },
        { label: "BRACKET 2", teams: bracket2, games: BRACKET_MATCHUPS.filter(m => m.bracket === "bracket2") }].map(({ label, teams, games }) => (
        <div key={label} className="bg-black/40 border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-black tracking-widest uppercase text-[#1E90FF]/70">{label}</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <div className="space-y-2 mb-5">
            {teams.map((t) => <BracketTeam key={t.id} team={t} />)}
          </div>
          <div className="space-y-2">
            {games.map((g) => (
              <div key={g.game} className="bg-black/30 border border-white/5 rounded-lg px-3 py-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-black tracking-widest uppercase text-white/30">GAME {g.game}</span>
                  <span className="text-[9px] text-[#1E90FF]/60">{g.network}</span>
                </div>
                <div className="text-xs font-bold text-white/80">{g.team1} <span className="text-white/30">vs</span> {g.team2}</div>
                <div className="text-[9px] text-white/40 mt-0.5">{g.date} · {g.time}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Team Card (Expanded) ────────────────────────────────────────────────────

function TeamCard({ team, onClose }: { team: Team; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"story" | "players" | "fanbase" | "podcast">("story");

  const tabs = [
    { id: "story" as const, label: "STORY" },
    { id: "players" as const, label: "PLAYERS" },
    { id: "fanbase" as const, label: "FAN BASE" },
    { id: "podcast" as const, label: "PODCAST" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-2xl bg-[#0a0a0f] border border-white/20 rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 pb-4" style={{ borderBottom: `1px solid ${team.color}30` }}>
          <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(ellipse at top left, ${team.color}, transparent)` }} />
          <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white text-xl transition-colors">✕</button>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black" style={{ background: `${team.color}20`, border: `1px solid ${team.color}40`, color: team.color }}>
              {team.shortName[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {team.natlSeed && <span className="text-[9px] font-black tracking-widest uppercase text-white/40 bg-white/10 px-2 py-0.5 rounded-full">#{team.natlSeed} NATIONAL SEED</span>}
                <span className="text-[9px] font-black tracking-widest uppercase text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{team.conference}</span>
              </div>
              <h2 className="text-xl font-black text-white">{team.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-white/60">{team.record}</span>
                <span className="text-white/20">·</span>
                <span className="text-sm text-white/60">{team.coach}</span>
                <span className="text-white/20">·</span>
                <span className="text-sm text-white/60">{team.stadium}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-[10px] font-black tracking-widest uppercase transition-colors ${
                activeTab === tab.id
                  ? "text-[#1E90FF] border-b-2 border-[#1E90FF]"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "story" && (
            <div className="space-y-4">
              <p className="text-sm text-white/80 leading-relaxed">{team.story}</p>
              <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                <div className="text-[9px] font-black tracking-widest uppercase text-white/30 mb-2">COACHING STAFF</div>
                <div className="text-sm font-bold text-white">{team.coach}</div>
                <div className="text-xs text-white/50">{team.coachYears}</div>
              </div>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(team.youtubeQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-red-600/10 border border-red-600/20 rounded-xl p-4 hover:bg-red-600/20 transition-colors group"
              >
                <span className="text-red-500 text-lg">▶</span>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">Watch Highlights on YouTube</div>
                  <div className="text-[9px] text-white/30">{team.youtubeQuery}</div>
                </div>
              </a>
            </div>
          )}

          {activeTab === "players" && (
            <div className="space-y-3">
              {team.players.map((p) => (
                <div key={p.name} className="bg-black/40 border border-white/10 rounded-xl p-4 hover:border-[#1E90FF]/20 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-sm font-black text-white">{p.name}</div>
                      <div className="text-[10px] text-white/40">{p.position} · {p.year}</div>
                    </div>
                    <NILBadge tier={p.nilTier} />
                  </div>
                  <div className="text-xs text-white/60">{p.stat}</div>
                  {p.draftStatus && (
                    <div className="mt-2 text-[9px] font-bold text-[#1E90FF]/70 bg-[#1E90FF]/5 border border-[#1E90FF]/10 rounded-lg px-2 py-1">
                      🎯 {p.draftStatus}
                    </div>
                  )}
                </div>
              ))}
              <Link href="/nil-portal">
                <a className="block text-center text-[10px] font-black tracking-widest uppercase text-[#1E90FF]/60 hover:text-[#1E90FF] transition-colors py-3 border border-[#1E90FF]/10 rounded-xl hover:border-[#1E90FF]/30">
                  → VIEW NIL PORTAL FOR ALL ATHLETES
                </a>
              </Link>
            </div>
          )}

          {activeTab === "fanbase" && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className="text-2xl font-black tracking-widest text-white mb-1" style={{ color: team.color }}>{team.fanChant}</div>
                <div className="text-xs text-white/40 font-bold tracking-widest uppercase">{team.fanBase}</div>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">{team.fanIdentity}</p>
              <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                <div className="text-[9px] font-black tracking-widest uppercase text-white/30 mb-2">HOME VENUE</div>
                <div className="text-sm font-bold text-white">{team.stadium}</div>
                <div className="text-xs text-white/50">{team.city}</div>
              </div>
            </div>
          )}

          {activeTab === "podcast" && (
            <div className="space-y-4">
              <div className="bg-[#1E90FF]/5 border border-[#1E90FF]/20 rounded-xl p-5">
                <div className="text-[9px] font-black tracking-widest uppercase text-[#1E90FF]/60 mb-3">🎙 ATHLYNXAI PODCAST ANGLE</div>
                <p className="text-sm text-white/80 leading-relaxed font-medium">"{team.podcastAngle}"</p>
              </div>
              <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                <div className="text-[9px] font-black tracking-widest uppercase text-white/30 mb-2">CONNECT WITH THIS STORY</div>
                <p className="text-xs text-white/50 leading-relaxed">
                  AthlynXAI OS connects athletes, coaches, and fans through their stories — not just their stats. 
                  The journey from youth to pro is what we broadcast.
                </p>
              </div>
              <Link href="/create-profile">
                <a className="block text-center bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white text-xs font-black tracking-widest uppercase py-3 rounded-xl transition-colors">
                  CREATE YOUR ATHLETE PROFILE → FREE
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Team Grid ───────────────────────────────────────────────────────────────

function TeamGrid({ onTeamClick }: { onTeamClick: (id: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {TEAMS.map((team) => (
        <button
          key={team.id}
          onClick={() => onTeamClick(team.id)}
          className="group bg-black/40 border border-white/10 rounded-xl p-4 text-left hover:border-[#1E90FF]/40 hover:bg-[#1E90FF]/5 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black" style={{ background: `${team.color}20`, border: `1px solid ${team.color}40`, color: team.color }}>
              {team.shortName[0]}
            </div>
            <div className="flex items-center gap-1">
              {team.natlSeed && (
                <span className="text-[9px] font-black text-white/30 bg-white/5 px-1.5 py-0.5 rounded">#{team.natlSeed}</span>
              )}
              <span className="text-[9px] font-black text-white/20 bg-white/5 px-1.5 py-0.5 rounded">{team.conference}</span>
            </div>
          </div>
          <div className="text-sm font-black text-white group-hover:text-[#1E90FF] transition-colors mb-1">{team.shortName}</div>
          <div className="text-[10px] text-white/40 mb-2">{team.record} · {team.coach}</div>
          <div className="text-[9px] text-white/30 leading-relaxed line-clamp-2">{team.story.split(".")[0]}.</div>
          <div className="mt-3 text-[9px] font-black tracking-widest uppercase text-[#1E90FF]/40 group-hover:text-[#1E90FF]/70 transition-colors">
            TAP FOR FULL BREAKDOWN →
          </div>
        </button>
      ))}
    </div>
  );
}

// ── Subscribe Banner ────────────────────────────────────────────────────────

function SubscribeBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#1E90FF]/10 via-black/60 to-[#1E90FF]/5 border border-[#1E90FF]/20 rounded-2xl p-8 mb-8 text-center">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_#1E90FF,_transparent)]" />
      <div className="relative">
        <div className="text-[10px] font-black tracking-widest uppercase text-[#1E90FF]/60 mb-3">ATHLYNXAI OS · THE NETWORK</div>
        <h3 className="text-2xl font-black text-white mb-2">
          "The people crazy enough to think they can change the world<br />
          <span className="text-[#1E90FF]">are the ones who actually do."</span>
        </h3>
        <p className="text-sm text-white/50 mb-6 max-w-xl mx-auto">
          AthlynXAI OS is the first AI-native sports network. Live scores. Live brackets. Every athlete. Every journey. From youth to pro to retirement. Fair and balanced. Men. Women. Every sport.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/create-profile">
            <a className="bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white text-xs font-black tracking-widest uppercase px-8 py-3 rounded-xl transition-colors">
              CREATE FREE PROFILE · 30 SECONDS
            </a>
          </Link>
          <Link href="/subscribe">
            <a className="border border-[#1E90FF]/30 hover:border-[#1E90FF] text-[#1E90FF] text-xs font-black tracking-widest uppercase px-8 py-3 rounded-xl transition-colors">
              ATHLYNXAI OS PRO →
            </a>
          </Link>
        </div>
        <div className="mt-4 text-[9px] text-white/20 tracking-widest uppercase">
          Powered by Nebius H200 NVIDIA · Full AI Automation · Fair Pricing
        </div>
      </div>
    </div>
  );
}

// ── WCWS Champions Banner ───────────────────────────────────────────────────

function WCWSChampionsBanner() {
  return (
    <div className="bg-gradient-to-r from-[#BF5700]/10 via-black/60 to-[#BF5700]/5 border border-[#BF5700]/30 rounded-xl px-5 py-4 mb-6 flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🏆</span>
        <div>
          <div className="text-[9px] font-black tracking-widest uppercase text-[#BF5700]/70">WCWS 2026 · DEVON PARK · OKC · COMPLETE</div>
          <div className="text-sm font-black text-white">Texas Longhorns · Back-to-Back National Champions · 2025 & 2026</div>
        </div>
      </div>
      <div className="text-[10px] font-black tracking-widest uppercase text-white/30">
        HOOK 'EM HORNS · CONGRATULATIONS
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function Brackets() {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [activeView, setActiveView] = useState<"bracket" | "teams">("bracket");

  const handleTeamClick = (id: string) => {
    const team = TEAMS.find((t) => t.id === id);
    if (team) setSelectedTeam(team);
  };

  return (
    <div className="relative min-h-screen text-white">
      <AthletePageBackground />
      <div className="relative z-10 min-h-screen text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">

          {/* Network Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <LivePulse />
              <span className="text-[10px] font-black tracking-widest uppercase text-white/40">ATHLYNXAI OS · SPORTS NETWORK · LIVE BROADCAST</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-2">
              ROAD TO <span className="text-[#1E90FF]">OMAHA</span>
            </h1>
            <div className="text-sm font-black tracking-widest uppercase text-white/40 mb-1">
              THE GREATEST SHOW ON GRASS
            </div>
            <div className="text-xs text-white/30">
              2026 Men's College World Series · Charles Schwab Field · Omaha, Nebraska · June 13–22
            </div>
            <div className="flex items-center justify-center gap-4 mt-3 text-[10px] font-black tracking-widest uppercase text-white/30">
              <span>8 TEAMS</span>
              <span className="text-white/10">·</span>
              <span>1 CHAMPION</span>
              <span className="text-white/10">·</span>
              <span>ESPN · ABC</span>
              <span className="text-white/10">·</span>
              <span>JUNE 13–22</span>
            </div>
          </div>

          {/* WCWS Champions */}
          <WCWSChampionsBanner />

          {/* Live Scores */}
          <LiveScoreStrip />

          {/* View Toggle */}
          <div className="flex items-center gap-2 mb-6">
            {[{ id: "bracket" as const, label: "BRACKET VIEW" }, { id: "teams" as const, label: "TEAM BREAKDOWN" }].map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveView(v.id)}
                className={`text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded-lg transition-colors ${
                  activeView === v.id
                    ? "bg-[#1E90FF] text-white"
                    : "bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10"
                }`}
              >
                {v.label}
              </button>
            ))}
            <div className="flex-1" />
            <a
              href="https://www.espn.com/college-sports/baseball/ncaa/bracket"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-black tracking-widest uppercase text-[#1E90FF]/50 hover:text-[#1E90FF] transition-colors"
            >
              FULL NCAA BRACKET ↗
            </a>
          </div>

          {/* Bracket or Team Grid */}
          {activeView === "bracket" ? (
            <BracketView onTeamClick={handleTeamClick} />
          ) : (
            <TeamGrid onTeamClick={handleTeamClick} />
          )}

          {/* Subscribe Banner */}
          <SubscribeBanner />

          {/* Bottom Nav */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-black tracking-widest uppercase text-white/20 pt-4 border-t border-white/5">
            <Link href="/"><a className="hover:text-[#1E90FF] transition-colors">← BACK TO OS</a></Link>
            <span className="text-white/10">·</span>
            <Link href="/nil-portal"><a className="hover:text-[#1E90FF] transition-colors">NIL PORTAL</a></Link>
            <span className="text-white/10">·</span>
            <Link href="/create-profile"><a className="hover:text-[#1E90FF] transition-colors">CREATE PROFILE</a></Link>
            <span className="text-white/10">·</span>
            <a href="https://www.espn.com/college-sports/baseball/ncaa/bracket" target="_blank" rel="noopener noreferrer" className="hover:text-[#1E90FF] transition-colors">NCAA BRACKET ↗</a>
          </div>

        </div>
      </div>

      {/* Team Modal */}
      {selectedTeam && (
        <div className="relative z-10">
          <TeamCard team={selectedTeam} onClose={() => setSelectedTeam(null)} />
        </div>
      )}
    </div>
  );
}
