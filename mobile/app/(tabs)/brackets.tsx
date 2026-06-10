import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BorderRadius, Colors, Spacing, Typography } from "../../lib/theme";
import { CWS_2026_TEAMS } from "../../lib/seedData";

const COBALT = "#1E90FF";
const ESPN_BASEBALL = "https://site.api.espn.com/apis/site/v2/sports/baseball/college-baseball/scoreboard";
const ESPN_SOFTBALL = "https://site.api.espn.com/apis/site/v2/sports/softball/college-softball/scoreboard";

type Sport = "baseball" | "softball";
type GameState = "pre" | "in" | "post";

type ESPNTeam = {
  homeAway: "home" | "away";
  score?: string;
  curatedRank?: { current?: number };
  team?: { shortDisplayName?: string; abbreviation?: string };
};

type ESPNEvent = {
  id: string;
  date: string;
  competitions?: Array<{
    status?: { type?: { state?: string; shortDetail?: string } };
    competitors?: ESPNTeam[];
    notes?: Array<{ headline?: string }>;
  }>;
};

type Game = {
  id: string;
  state: GameState;
  detail: string;
  date: string;
  ctTimeLabel: string;
  ctDateLabel: string;
  bracketTail: string;
  home: { name: string; rank?: number; score?: string };
  away: { name: string; rank?: number; score?: string };
  winner?: "home" | "away";
};

type Regional = { name: string; games: Game[] };
type Slots = Record<"game1" | "game2" | "game3" | "game4" | "game5" | "game6" | "game7", Game | null>;

function yyyymmdd(d: Date) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

function parseRegionalName(note: string) {
  const parts = note.split(" - ").map((s) => s.trim());
  const regional = parts.find((p) => /Regional/i.test(p)) ?? "";
  const tail = regional ? parts.slice(parts.indexOf(regional) + 1).join(" - ") : "";
  return { regional, tail };
}

function mapEvent(e: ESPNEvent): { regional: string; game: Game } | null {
  const comp = e.competitions?.[0] ?? {};
  const status = comp.status?.type ?? {};
  const teams = comp.competitors ?? [];
  const home = teams.find((t) => t.homeAway === "home");
  const away = teams.find((t) => t.homeAway === "away");
  const note = comp.notes?.[0]?.headline ?? "";
  if (!/Regional/i.test(note)) return null;
  const { regional, tail } = parseRegionalName(note);
  const dt = new Date(e.date);
  const ctDateLabel = dt.toLocaleDateString("en-US", { timeZone: "America/Chicago", weekday: "short", month: "short", day: "numeric" });
  const ctTimeLabel = dt.toLocaleTimeString("en-US", { timeZone: "America/Chicago", hour: "numeric", minute: "2-digit", hour12: true });
  const state = ((status.state as GameState) || "pre") as GameState;
  const homeScore = home?.score;
  const awayScore = away?.score;
  const winner = state === "post" && homeScore != null && awayScore != null
    ? Number(homeScore) > Number(awayScore) ? "home" : "away"
    : undefined;
  return {
    regional,
    game: {
      id: e.id,
      state,
      detail: status.shortDetail ?? "",
      date: e.date,
      ctTimeLabel,
      ctDateLabel,
      bracketTail: tail,
      home: {
        name: home?.team?.shortDisplayName ?? home?.team?.abbreviation ?? "TBD",
        rank: home?.curatedRank?.current && home.curatedRank.current < 99 ? home.curatedRank.current : undefined,
        score: homeScore,
      },
      away: {
        name: away?.team?.shortDisplayName ?? away?.team?.abbreviation ?? "TBD",
        rank: away?.curatedRank?.current && away.curatedRank.current < 99 ? away.curatedRank.current : undefined,
        score: awayScore,
      },
      winner,
    },
  };
}

async function fetchDay(sport: Sport, date: string) {
  const base = sport === "baseball" ? ESPN_BASEBALL : ESPN_SOFTBALL;
  try {
    const res = await fetch(`${base}?dates=${date}&limit=100`);
    if (!res.ok) return [];
    const data = await res.json();
    const events: ESPNEvent[] = data.events ?? [];
    return events.map(mapEvent).filter((x): x is { regional: string; game: Game } => x != null);
  } catch {
    return [];
  }
}

function assignSlots(regional: Regional): Slots {
  const sorted = [...regional.games].sort((a, b) => a.date.localeCompare(b.date));
  const result: Slots = { game1: null, game2: null, game3: null, game4: null, game5: null, game6: null, game7: null };
  const byDay: Record<string, Game[]> = { Fri: [], Sat: [], Sun: [], Mon: [], other: [] };
  for (const g of sorted) {
    const day = new Date(g.date).toLocaleDateString("en-US", { timeZone: "America/Chicago", weekday: "short" });
    (byDay[day] ?? byDay.other).push(g);
  }
  if (byDay.Fri[0]) result.game1 = byDay.Fri[0];
  if (byDay.Fri[1]) result.game2 = byDay.Fri[1];
  for (const g of byDay.Sat) {
    if (/Elimination/i.test(g.bracketTail) && !result.game4) result.game4 = g;
    else if (!result.game3) result.game3 = g;
    else if (!result.game4) result.game4 = g;
  }
  for (const g of byDay.Sun) {
    if (/Elimination/i.test(g.bracketTail) && !result.game5) result.game5 = g;
    else if (/Final/i.test(g.bracketTail) && !result.game6) result.game6 = g;
    else if (!result.game5) result.game5 = g;
    else if (!result.game6) result.game6 = g;
  }
  if (byDay.Mon[0]) result.game7 = byDay.Mon[0];
  return result;
}

function TeamRow({ team, winner }: { team: Game["home"]; winner: boolean }) {
  return (
    <View style={styles.teamRow}>
      <Text style={[styles.teamName, winner && styles.winner]} numberOfLines={1}>
        {team.rank ? <Text style={styles.rank}>#{team.rank} </Text> : null}{team.name}
      </Text>
      <Text style={[styles.score, winner && styles.winner]}>{team.score ?? "–"}</Text>
    </View>
  );
}

function GameSlot({ label, slotDay, game }: { label: string; slotDay: string; game: Game | null }) {
  return (
    <View style={styles.gameSlot}>
      <View style={styles.gameHeader}>
        <Text style={styles.gameLabel}>{label}</Text>
        <Text style={[styles.statePill, game?.state === "in" && styles.livePill]}>
          {game ? (game.state === "post" ? "FINAL" : game.state === "in" ? `LIVE ${game.detail}` : game.detail || "SCHEDULED") : "TBD"}
        </Text>
      </View>
      {game ? (
        <>
          <TeamRow team={game.away} winner={game.winner === "away"} />
          <TeamRow team={game.home} winner={game.winner === "home"} />
          {game.state === "pre" ? <Text style={styles.timeText}>{game.ctDateLabel} · {game.ctTimeLabel} CT</Text> : null}
        </>
      ) : (
        <>
          <Text style={styles.tbdText}>TBD</Text>
          <Text style={styles.tbdText}>TBD</Text>
          <Text style={styles.timeText}>{slotDay}</Text>
        </>
      )}
    </View>
  );
}

function RegionalCard({ regional, sport }: { regional: Regional; sport: Sport }) {
  const slots = useMemo(() => assignSlots(regional), [regional]);
  const shortName = regional.name.replace(/Regional$/i, "").trim();
  return (
    <View style={styles.regionalCard}>
      <View style={styles.regionalHeader}>
        <Text style={styles.roadLabel}>{sport === "baseball" ? "ROAD TO OMAHA" : "ROAD TO OKC"}</Text>
        <Text style={styles.regionalTitle}>{shortName} Regional</Text>
        <Text style={styles.elimLabel}>7-game double-elimination</Text>
      </View>
      <GameSlot label="Game 1 · Opening" slotDay="Fri" game={slots.game1} />
      <GameSlot label="Game 2 · Opening" slotDay="Fri" game={slots.game2} />
      <GameSlot label="Game 3 · Winners 1-0" slotDay="Sat" game={slots.game3} />
      <GameSlot label="Game 4 · Elimination" slotDay="Sat" game={slots.game4} />
      <GameSlot label="Game 5 · Elimination" slotDay="Sun" game={slots.game5} />
      <GameSlot label="Game 6 · Regional Final" slotDay="Sun" game={slots.game6} />
      <GameSlot label="Game 7 · If Necessary" slotDay="Mon" game={slots.game7} />
    </View>
  );
}

export default function BracketsScreen() {
  const [sport, setSport] = useState<Sport>("baseball");
  const [regionals, setRegionals] = useState<Regional[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeCWSBracket, setActiveCWSBracket] = useState<1 | 2>(1);

  const load = useCallback(async () => {
    const now = new Date();
    const days = [-1, 0, 1, 2].map((offset) => yyyymmdd(new Date(now.getTime() + offset * 24 * 60 * 60 * 1000)));
    const results = await Promise.all(days.map((day) => fetchDay(sport, day)));
    const byRegional = new Map<string, Regional>();
    const seenIds = new Set<string>();
    for (const { regional, game } of results.flat()) {
      if (!regional || seenIds.has(game.id)) continue;
      seenIds.add(game.id);
      if (!byRegional.has(regional)) byRegional.set(regional, { name: regional, games: [] });
      byRegional.get(regional)!.games.push(game);
    }
    setRegionals(Array.from(byRegional.values()).sort((a, b) => a.name.localeCompare(b.name)));
    setLastUpdated(new Date());
    setLoading(false);
  }, [sport]);

  useEffect(() => {
    let mounted = true;
    const run = async () => { if (mounted) await load(); };
    run();
    const id = setInterval(run, 60_000);
    return () => { mounted = false; clearInterval(id); };
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const cwsTeams = CWS_2026_TEAMS.filter((t) => t.bracket === activeCWSBracket);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COBALT} />}
    >
      {/* ── CWS OMAHA HERO ─────────────────────────────── */}
      <LinearGradient colors={["#000000", "#050d1e", "#000000"]} style={styles.cwsHero}>
        <View style={styles.stadiumLightLeft} />
        <View style={styles.stadiumLightRight} />
        <View style={styles.heroBadgeRow}>
          <View style={styles.heroBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.heroBadgeText}>2026 MEN'S COLLEGE WORLD SERIES</Text>
          </View>
        </View>
        <Text style={styles.cwsHeroTitle}>Road to Omaha</Text>
        <Text style={styles.cwsHeroDate}>Charles Schwab Field · Omaha, NE · June 12–24, 2026</Text>

        {/* CWS Bracket Toggle */}
        <View style={styles.cwsBracketToggle}>
          <TouchableOpacity
            style={[styles.cwsBToggle, activeCWSBracket === 1 && styles.cwsBToggleActive]}
            onPress={() => setActiveCWSBracket(1)}
          >
            <Text style={[styles.cwsBToggleText, activeCWSBracket === 1 && styles.cwsBToggleTextActive]}>BRACKET 1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.cwsBToggle, activeCWSBracket === 2 && styles.cwsBToggleActive]}
            onPress={() => setActiveCWSBracket(2)}
          >
            <Text style={[styles.cwsBToggleText, activeCWSBracket === 2 && styles.cwsBToggleTextActive]}>BRACKET 2</Text>
          </TouchableOpacity>
        </View>

        {/* CWS Team Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
        >
          {cwsTeams.map((team) => (
            <View key={team.school} style={[styles.cwsMiniCard, { borderColor: team.primaryColorHex + "66" }]}>
              <View style={[styles.cwsMiniBar, { backgroundColor: team.primaryColorHex }]} />
              <View style={{ padding: 10 }}>
                {team.nationalSeed ? (
                  <Text style={[styles.cwsMiniSeed, { color: team.primaryColorHex }]}>#{team.nationalSeed}</Text>
                ) : (
                  <Text style={[styles.cwsMiniSeed, { color: "#666" }]}>–</Text>
                )}
                <Text style={styles.cwsMiniName}>{team.school}</Text>
                <Text style={styles.cwsMiniMascot}>{team.mascot}</Text>
                <Text style={styles.cwsMiniRecord}>{team.overallRecord}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.cwsFullBracketBtn}
          onPress={() => Linking.openURL("https://athlynx.ai/brackets")}
          activeOpacity={0.85}
        >
          <Text style={styles.cwsFullBracketText}>FULL CWS BRACKET ON ATHLYNX.AI →</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* ── LIVE REGIONAL FEED ─────────────────────────── */}
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>LIVE REGIONAL BRACKETS</Text>
        <Text style={styles.title}>{sport === "baseball" ? "Men · Road to Omaha" : "Women · Road to OKC"}</Text>
        <Text style={styles.subtitle}>Direct ESPN scoreboard feed · 60-second refresh · regional double-elimination tree.</Text>
      </View>

      <View style={styles.toggleRow}>
        <TouchableOpacity style={[styles.toggle, sport === "baseball" && styles.toggleActive]} onPress={() => { setLoading(true); setSport("baseball"); }}>
          <Text style={[styles.toggleText, sport === "baseball" && styles.toggleTextActive]}>MEN · OMAHA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggle, sport === "softball" && styles.toggleActive]} onPress={() => { setLoading(true); setSport("softball"); }}>
          <Text style={[styles.toggleText, sport === "softball" && styles.toggleTextActive]}>WOMEN · OKC</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.lastUpdated}>{lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : "Loading live bracket feed"}</Text>

      {loading ? (
        <View style={styles.centered}><ActivityIndicator color={COBALT} size="large" /></View>
      ) : regionals.length ? (
        regionals.map((regional) => <RegionalCard key={regional.name} regional={regional} sport={sport} />)
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>CWS Begins June 12</Text>
          <Text style={styles.emptyText}>The Men's College World Series opens at Charles Schwab Field in Omaha on June 12, 2026. Live scores will appear here at first pitch.</Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => Linking.openURL("https://athlynx.ai/brackets")}
            activeOpacity={0.85}
          >
            <Text style={styles.emptyBtnText}>VIEW BRACKET ON ATHLYNX.AI →</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  content: { paddingBottom: 40, gap: Spacing.md },

  // CWS Hero
  cwsHero: { padding: 20, paddingTop: 24, paddingBottom: 20, position: "relative", overflow: "hidden" },
  stadiumLightLeft: { position: "absolute", top: 0, left: "20%", width: 1, height: "70%", backgroundColor: COBALT, opacity: 0.3, transform: [{ rotate: "-12deg" }] },
  stadiumLightRight: { position: "absolute", top: 0, right: "20%", width: 1, height: "70%", backgroundColor: COBALT, opacity: 0.3, transform: [{ rotate: "12deg" }] },
  heroBadgeRow: { flexDirection: "row", marginBottom: 10 },
  heroBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: COBALT + "22", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: COBALT + "55" },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#00ff88" },
  heroBadgeText: { color: COBALT, fontSize: 10, fontWeight: "900", letterSpacing: 1.5 },
  cwsHeroTitle: { fontSize: 30, fontWeight: "900", color: "#ffffff", letterSpacing: -0.5, marginBottom: 4 },
  cwsHeroDate: { fontSize: 12, color: "#6a8aaa", marginBottom: 16 },
  cwsBracketToggle: { flexDirection: "row", gap: 8, marginBottom: 12 },
  cwsBToggle: { flex: 1, borderRadius: 8, borderWidth: 1, borderColor: "#1a2a4a", paddingVertical: 8, alignItems: "center", backgroundColor: "#060d1a" },
  cwsBToggleActive: { backgroundColor: COBALT, borderColor: COBALT },
  cwsBToggleText: { color: "#6a8aaa", fontSize: 11, fontWeight: "900", letterSpacing: 1 },
  cwsBToggleTextActive: { color: "#ffffff" },
  cwsMiniCard: { width: 130, backgroundColor: "#060d1a", borderRadius: 12, overflow: "hidden", borderWidth: 1 },
  cwsMiniBar: { height: 3, width: "100%" },
  cwsMiniSeed: { fontSize: 11, fontWeight: "900", marginBottom: 4 },
  cwsMiniName: { fontSize: 13, fontWeight: "900", color: "#ffffff", marginBottom: 1 },
  cwsMiniMascot: { fontSize: 10, color: "#6a8aaa", marginBottom: 4 },
  cwsMiniRecord: { fontSize: 11, fontWeight: "800", color: COBALT },
  cwsFullBracketBtn: { marginTop: 14, alignSelf: "flex-start", backgroundColor: COBALT, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  cwsFullBracketText: { color: "#ffffff", fontWeight: "900", fontSize: 10, letterSpacing: 1.2 },

  // Live Feed
  hero: { borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: `${COBALT}66`, backgroundColor: "#050A12", padding: Spacing.lg },
  eyebrow: { ...Typography.label, color: COBALT, marginBottom: 8 },
  title: { color: "#FFFFFF", fontSize: 28, fontWeight: "900" },
  subtitle: { color: Colors.textSecondary, marginTop: 8, lineHeight: 21 },
  toggleRow: { flexDirection: "row", gap: Spacing.sm },
  toggle: { flex: 1, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, paddingVertical: 12, alignItems: "center", backgroundColor: "#070707" },
  toggleActive: { backgroundColor: COBALT, borderColor: COBALT },
  toggleText: { color: Colors.textSecondary, fontSize: 12, fontWeight: "900" },
  toggleTextActive: { color: "#FFFFFF" },
  lastUpdated: { color: Colors.textMuted, fontSize: 11, textAlign: "right" },
  centered: { padding: 40, alignItems: "center" },
  regionalCard: { borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: `${COBALT}44`, backgroundColor: "#050505", padding: Spacing.md, gap: Spacing.sm },
  regionalHeader: { marginBottom: 4 },
  roadLabel: { alignSelf: "flex-start", backgroundColor: COBALT, color: "#FFFFFF", fontSize: 10, fontWeight: "900", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, overflow: "hidden", marginBottom: 8 },
  regionalTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "900" },
  elimLabel: { color: Colors.textMuted, fontSize: 11, marginTop: 3, textTransform: "uppercase" },
  gameSlot: { borderRadius: BorderRadius.md, borderWidth: 1, borderColor: "rgba(255,255,255,0.10)", backgroundColor: "#090909", padding: Spacing.sm },
  gameHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: Spacing.sm, marginBottom: 6 },
  gameLabel: { color: "#88A8FF", fontSize: 10, fontWeight: "900", flex: 1 },
  statePill: { color: Colors.textMuted, fontSize: 9, fontWeight: "900", borderWidth: 1, borderColor: "rgba(255,255,255,0.20)", borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2, overflow: "hidden" },
  livePill: { color: "#FFFFFF", backgroundColor: COBALT, borderColor: COBALT },
  teamRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: Spacing.sm, marginVertical: 1 },
  teamName: { color: Colors.textSecondary, fontSize: 13, flex: 1, fontWeight: "700" },
  rank: { color: COBALT, fontWeight: "900" },
  score: { color: Colors.textSecondary, fontSize: 13, fontWeight: "900" },
  winner: { color: "#FFFFFF" },
  timeText: { color: Colors.textMuted, fontSize: 10, marginTop: 5 },
  tbdText: { color: Colors.textMuted, fontSize: 13, marginVertical: 1 },
  emptyCard: { borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.border, backgroundColor: "#060d1a", padding: Spacing.lg, alignItems: "center" },
  emptyTitle: { color: "#FFFFFF", fontWeight: "900", fontSize: 18, marginBottom: 8 },
  emptyText: { color: Colors.textSecondary, textAlign: "center", lineHeight: 22, marginBottom: 16 },
  emptyBtn: { backgroundColor: COBALT, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10 },
  emptyBtnText: { color: "#ffffff", fontWeight: "900", fontSize: 11, letterSpacing: 1 },
});
