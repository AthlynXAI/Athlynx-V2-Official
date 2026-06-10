/**
 * AthlynX MCWS Brackets Screen — v2.0.0
 * Full Road to Omaha bracket, schedule, and team info
 */
import React, { useState } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors, BorderRadius, Typography, Spacing } from "../../lib/theme";

const BRACKET_1 = [
  { game: 1, date: "Fri Jun 12", time: "2pm ET", team1: { abbr: "WVU",  name: "West Virginia", seed: 16, record: "42-20" }, team2: { abbr: "TROY", name: "Troy",          seed: 0,  record: "40-22" }, status: "UPCOMING", channel: "ESPN" },
  { game: 2, date: "Fri Jun 12", time: "7pm ET", team1: { abbr: "UNC",  name: "North Carolina", seed: 5,  record: "45-17" }, team2: { abbr: "MISS", name: "Ole Miss",       seed: 0,  record: "41-21" }, status: "UPCOMING", channel: "ESPN" },
];
const BRACKET_2 = [
  { game: 3, date: "Sat Jun 13", time: "3pm ET", team1: { abbr: "ALA",  name: "Alabama",        seed: 7,  record: "43-19" }, team2: { abbr: "OU",   name: "Oklahoma",      seed: 0,  record: "43-19" }, status: "UPCOMING", channel: "ESPN" },
  { game: 4, date: "Sat Jun 13", time: "8pm ET", team1: { abbr: "UGA",  name: "Georgia",        seed: 3,  record: "47-16" }, team2: { abbr: "TEX",  name: "Texas",         seed: 6,  record: "44-18" }, status: "UPCOMING", channel: "ESPN" },
];

const CHAMPIONSHIP_SCHEDULE = [
  { label: "Championship Game 1", date: "Sat Jun 20", time: "8pm ET",   channel: "ESPN" },
  { label: "Championship Game 2", date: "Sun Jun 21", time: "2:30pm ET", channel: "ABC"  },
  { label: "Championship Game 3", date: "Mon Jun 22", time: "7pm ET",   channel: "ESPN", note: "if necessary" },
];

const HOW_THEY_GOT_HERE = [
  { abbr: "UGA",  seed: 3,  how: "Athens Regional champs → def. Mississippi State (10 HR slugfest)" },
  { abbr: "UNC",  seed: 5,  how: "Chapel Hill Regional champs → def. USC in wild walk-off Game 3" },
  { abbr: "TEX",  seed: 6,  how: "Austin Regional champs → swept Oregon (6-5 dramatic clincher)" },
  { abbr: "ALA",  seed: 7,  how: "Advanced through super regional" },
  { abbr: "WVU",  seed: 16, how: "Swept Cal Poly: 12-2, 17-1 — dominant super regional run" },
  { abbr: "TROY", seed: 0,  how: "Cinderella story — unseeded team in Omaha" },
  { abbr: "MISS", seed: 0,  how: "def. Auburn 2-0, 5-3 in super regional" },
  { abbr: "OU",   seed: 0,  how: "Atlanta Regional champs → def. Georgia Tech 8-7 in 10 innings" },
];

function GameCard({ game }: { game: typeof BRACKET_1[0] }) {
  const isUpcoming = game.status === "UPCOMING";
  return (
    <View style={styles.gameCard}>
      <View style={styles.gameCardTop}>
        <View style={styles.gameNum}>
          <Text style={styles.gameNumText}>GAME {game.game}</Text>
        </View>
        <Text style={styles.gameDateTime}>{game.date} · {game.time}</Text>
        <View style={styles.gameChannel}>
          <Text style={styles.gameChannelText}>{game.channel}</Text>
        </View>
      </View>
      <View style={styles.gameTeams}>
        <View style={styles.gameTeam}>
          {game.team1.seed > 0 && <Text style={styles.gameSeed}>#{game.team1.seed}</Text>}
          <View>
            <Text style={styles.gameTeamAbbr}>{game.team1.abbr}</Text>
            <Text style={styles.gameTeamName}>{game.team1.name}</Text>
            <Text style={styles.gameTeamRecord}>{game.team1.record}</Text>
          </View>
        </View>
        <View style={styles.gameVS}>
          <Text style={styles.gameVSText}>VS</Text>
        </View>
        <View style={[styles.gameTeam, styles.gameTeamRight]}>
          {game.team2.seed > 0 && <Text style={styles.gameSeed}>#{game.team2.seed}</Text>}
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.gameTeamAbbr}>{game.team2.abbr}</Text>
            <Text style={styles.gameTeamName}>{game.team2.name}</Text>
            <Text style={styles.gameTeamRecord}>{game.team2.record}</Text>
          </View>
        </View>
      </View>
      <View style={[styles.gameStatus, isUpcoming && styles.gameStatusUpcoming]}>
        <Text style={[styles.gameStatusText, isUpcoming && styles.gameStatusTextUpcoming]}>
          {isUpcoming ? "⏰ UPCOMING" : game.status}
        </Text>
      </View>
    </View>
  );
}

export default function BracketsScreen() {
  const [tab, setTab] = useState<"bracket" | "schedule" | "teams">("bracket");

  return (
    <View style={styles.root}>
      {/* Hero */}
      <ImageBackground
        source={require("../../assets/stadium_hero_bg.png")}
        style={styles.hero}
        imageStyle={styles.heroImage}
      >
        <View style={styles.heroOverlay}>
          <Text style={styles.heroLabel}>⚾ MCWS 2026</Text>
          <Text style={styles.heroTitle}>ROAD TO OMAHA</Text>
          <Text style={styles.heroSub}>Charles Schwab Field · June 12–22, 2026</Text>
          <View style={styles.heroStats}>
            <View style={styles.heroStat}><Text style={styles.heroStatNum}>8</Text><Text style={styles.heroStatLabel}>Teams</Text></View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}><Text style={styles.heroStatNum}>11</Text><Text style={styles.heroStatLabel}>Days</Text></View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}><Text style={styles.heroStatNum}>1</Text><Text style={styles.heroStatLabel}>Champion</Text></View>
          </View>
        </View>
      </ImageBackground>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(["bracket", "schedule", "teams"] as const).map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.tabBtn, tab === t && styles.tabBtnActive]}>
            <Text style={[styles.tabBtnText, tab === t && styles.tabBtnTextActive]}>
              {t === "bracket" ? "Bracket" : t === "schedule" ? "Schedule" : "Teams"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {tab === "bracket" && (
          <View style={styles.content}>
            <Text style={styles.bracketGroupLabel}>BRACKET 1</Text>
            {BRACKET_1.map((g) => <GameCard key={g.game} game={g} />)}
            <Text style={[styles.bracketGroupLabel, { marginTop: 16 }]}>BRACKET 2</Text>
            {BRACKET_2.map((g) => <GameCard key={g.game} game={g} />)}
            <View style={styles.champSection}>
              <Text style={styles.champLabel}>🏆 CHAMPIONSHIP SERIES</Text>
              {CHAMPIONSHIP_SCHEDULE.map((c) => (
                <View key={c.label} style={styles.champRow}>
                  <View style={styles.champRowLeft}>
                    <Text style={styles.champRowLabel}>{c.label}</Text>
                    {c.note && <Text style={styles.champRowNote}>({c.note})</Text>}
                  </View>
                  <View style={styles.champRowRight}>
                    <Text style={styles.champRowDate}>{c.date}</Text>
                    <Text style={styles.champRowTime}>{c.time} · {c.channel}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {tab === "schedule" && (
          <View style={styles.content}>
            {[
              { day: "Fri Jun 12", games: ["Game 1: WVU vs Troy · 2pm ET", "Game 2: UNC vs Ole Miss · 7pm ET"] },
              { day: "Sat Jun 13", games: ["Game 3: Alabama vs Oklahoma · 3pm ET", "Game 4: Georgia vs Texas · 8pm ET"] },
              { day: "Sun Jun 14", games: ["Game 5: L1 vs L2 · 2pm ET", "Game 6: W1 vs W2 · 7pm ET"] },
              { day: "Mon Jun 15", games: ["Game 7: L3 vs L4 · 2pm ET", "Game 8: W3 vs W4 · 7pm ET"] },
              { day: "Tue Jun 16", games: ["Game 9: W5 vs L6 · 2pm ET", "Game 10: W7 vs L8 · 8pm ET"] },
              { day: "Wed Jun 17", games: ["Game 11: W6 vs W9 · 2pm ET", "Game 12: W8 vs W10 · 7pm ET"] },
              { day: "Sat Jun 20", games: ["Championship Game 1 · 8pm ET · ESPN"] },
              { day: "Sun Jun 21", games: ["Championship Game 2 · 2:30pm ET · ABC"] },
              { day: "Mon Jun 22", games: ["Championship Game 3 · 7pm ET · ESPN (if needed)"] },
            ].map((day) => (
              <View key={day.day} style={styles.scheduleDay}>
                <Text style={styles.scheduleDayLabel}>{day.day}</Text>
                {day.games.map((g) => (
                  <View key={g} style={styles.scheduleGame}>
                    <View style={styles.scheduleGameDot} />
                    <Text style={styles.scheduleGameText}>{g}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {tab === "teams" && (
          <View style={styles.content}>
            {HOW_THEY_GOT_HERE.map((team) => (
              <View key={team.abbr} style={styles.teamRow}>
                <View style={styles.teamRowLeft}>
                  <Text style={styles.teamRowAbbr}>{team.abbr}</Text>
                  {team.seed > 0 && <Text style={styles.teamRowSeed}>#{team.seed}</Text>}
                </View>
                <Text style={styles.teamRowHow}>{team.how}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.granite950 },
  hero: { height: 200 },
  heroImage: {},
  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
    justifyContent: "flex-end",
  },
  heroLabel: { color: Colors.electric, fontSize: 11, fontWeight: "800", letterSpacing: 1.2, marginBottom: 4 },
  heroTitle: { color: "#FFF", fontSize: 28, fontWeight: "900", letterSpacing: -0.5 },
  heroSub: { color: Colors.textSecondary, fontSize: 13, marginTop: 4 },
  heroStats: { flexDirection: "row", alignItems: "center", marginTop: 12, gap: 16 },
  heroStat: { alignItems: "center" },
  heroStatNum: { color: Colors.electric, fontSize: 22, fontWeight: "900" },
  heroStatLabel: { color: Colors.textMuted, fontSize: 11, fontWeight: "600" },
  heroStatDivider: { width: 1, height: 30, backgroundColor: Colors.electricBorder },
  tabs: {
    flexDirection: "row",
    backgroundColor: Colors.granite900,
    borderBottomWidth: 1,
    borderBottomColor: Colors.electricBorder,
  },
  tabBtn: { flex: 1, paddingVertical: 14, alignItems: "center" },
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: Colors.electric },
  tabBtnText: { color: Colors.textMuted, fontSize: 13, fontWeight: "600" },
  tabBtnTextActive: { color: Colors.electric },
  scroll: { flex: 1 },
  content: { padding: 16 },
  bracketGroupLabel: {
    color: Colors.electric,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  gameCard: {
    backgroundColor: Colors.granite800,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.electricBorder,
    padding: 16,
    marginBottom: 10,
  },
  gameCardTop: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  gameNum: { backgroundColor: Colors.cobalt, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  gameNumText: { color: "#FFF", fontSize: 10, fontWeight: "800" },
  gameDateTime: { flex: 1, color: Colors.textSecondary, fontSize: 12 },
  gameChannel: { backgroundColor: Colors.granite700, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  gameChannelText: { color: Colors.textMuted, fontSize: 10, fontWeight: "700" },
  gameTeams: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  gameTeam: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  gameTeamRight: { justifyContent: "flex-end" },
  gameSeed: { color: Colors.electric, fontSize: 12, fontWeight: "700" },
  gameTeamAbbr: { color: Colors.textPrimary, fontSize: 22, fontWeight: "900" },
  gameTeamName: { color: Colors.textSecondary, fontSize: 11 },
  gameTeamRecord: { color: Colors.textMuted, fontSize: 10 },
  gameVS: { paddingHorizontal: 16 },
  gameVSText: { color: Colors.textMuted, fontSize: 12, fontWeight: "700" },
  gameStatus: { backgroundColor: Colors.granite700, borderRadius: BorderRadius.full, paddingHorizontal: 12, paddingVertical: 5, alignSelf: "flex-start" },
  gameStatusUpcoming: { backgroundColor: Colors.electricGlow, borderWidth: 1, borderColor: Colors.electricBorder },
  gameStatusText: { color: Colors.textMuted, fontSize: 11, fontWeight: "700" },
  gameStatusTextUpcoming: { color: Colors.electric },
  champSection: { marginTop: 24, backgroundColor: Colors.goldDim, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.gold, padding: 16 },
  champLabel: { color: Colors.gold, fontSize: 13, fontWeight: "800", letterSpacing: 0.5, marginBottom: 12 },
  champRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingVertical: 8, borderTopWidth: 1, borderTopColor: "rgba(245,197,24,0.2)" },
  champRowLeft: { flex: 1 },
  champRowLabel: { color: Colors.textPrimary, fontSize: 13, fontWeight: "600" },
  champRowNote: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  champRowRight: { alignItems: "flex-end" },
  champRowDate: { color: Colors.gold, fontSize: 13, fontWeight: "700" },
  champRowTime: { color: Colors.textSecondary, fontSize: 11, marginTop: 2 },
  scheduleDay: { marginBottom: 16 },
  scheduleDayLabel: { color: Colors.electric, fontSize: 13, fontWeight: "800", marginBottom: 8 },
  scheduleGame: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 6 },
  scheduleGameDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.electric },
  scheduleGameText: { color: Colors.textPrimary, fontSize: 14 },
  teamRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.electricBorder },
  teamRowLeft: { width: 52, alignItems: "center" },
  teamRowAbbr: { color: Colors.electric, fontSize: 16, fontWeight: "900" },
  teamRowSeed: { color: Colors.textMuted, fontSize: 11, fontWeight: "600" },
  teamRowHow: { flex: 1, color: Colors.textSecondary, fontSize: 13, lineHeight: 18 },
});
