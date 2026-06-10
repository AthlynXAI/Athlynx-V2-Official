import { useState } from "react";
import {
  Dimensions,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BorderRadius, Colors, Spacing, Typography } from "../../lib/theme";
import { CWS_2026_TEAMS, D1_BASEBALL_CONFERENCES_2026 } from "../../lib/seedData";

const COBALT = "#1E90FF";
const SCREEN_WIDTH = Dimensions.get("window").width;

const MLB_PROSPECTS_2026 = [
  { name: "Ethan Petry", school: "Arkansas", pos: "OF", projRound: "1st Round" },
  { name: "Trey Yesavage", school: "NC State", pos: "RHP", projRound: "1st Round" },
  { name: "Jac Caglianone", school: "Florida", pos: "LHP/1B", projRound: "1st Round" },
  { name: "Chase Burns", school: "Wake Forest", pos: "RHP", projRound: "1st Round" },
  { name: "Travis Sykora", school: "Texas", pos: "RHP", projRound: "1st Round" },
];

const modules = [
  {
    title: "Pitcher IQ",
    label: "ARM CARE",
    body: "Age-aware pitch counts, rest windows, warm-up rhythm, and mechanics notes organized before any competitive workload guidance.",
  },
  {
    title: "Catcher IQ",
    label: "FIELD GENERAL",
    body: "Receiving, blocking, framing, game-calling, and leadership cues packaged as simple player-first learning cards.",
  },
  {
    title: "Arm Care Protocol",
    label: "INJURY PREVENTION",
    body: "Pre-game warm-up sequences, post-game recovery, and long-toss progression designed for youth through college arms.",
  },
  {
    title: "Recruiting Timeline",
    label: "FUTURE READY",
    body: "Grade-by-grade recruiting milestones from 8th grade through senior year. Know when coaches are watching.",
  },
  {
    title: "Diamond Grind Path",
    label: "LIFETIME IDENTITY",
    body: "The native path mirrors the web Diamond Grind IQ concept while keeping athlete safety, parent consent, and brand clarity first.",
  },
];

function ModuleCard({ title, label, body }: { title: string; label: string; body: string }) {
  return (
    <View style={styles.moduleCard}>
      <View style={styles.moduleHeader}>
        <Text style={styles.moduleLabel}>{label}</Text>
      </View>
      <Text style={styles.moduleTitle}>{title}</Text>
      <Text style={styles.moduleBody}>{body}</Text>
    </View>
  );
}

export default function DiamondGrindScreen() {
  const [parentConfirmed, setParentConfirmed] = useState(false);
  const [activeBracket, setActiveBracket] = useState<1 | 2>(1);
  const bracketTeams = CWS_2026_TEAMS.filter((t) => t.bracket === activeBracket);
  const secConf = D1_BASEBALL_CONFERENCES_2026.find((c) => c.abbr === "SEC");

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <LinearGradient colors={["#000000", "#050d1e", "#000000"]} style={styles.hero}>
        <View style={styles.stadiumLightLeft} />
        <View style={styles.stadiumLightRight} />
        <View style={styles.heroEyebrowRow}>
          <View style={styles.eyebrowBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.eyebrowText}>DIAMOND GRIND · BASEBALL + SOFTBALL IQ</Text>
          </View>
        </View>
        <Text style={styles.heroTitle}>Diamond Grind</Text>
        <Text style={styles.heroSubtitle}>
          The premier baseball and softball intelligence engine. Road to Omaha, MLB Draft, NIL, recruiting — all in one lane.
        </Text>
        <TouchableOpacity
          style={styles.heroCTA}
          onPress={() => Linking.openURL("https://athlynx.ai/diamond-grind")}
          activeOpacity={0.85}
        >
          <Text style={styles.heroCTAText}>ENTER DIAMOND GRIND →</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* ── ROAD TO OMAHA ────────────────────────────────── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>2026 MEN'S COLLEGE WORLD SERIES</Text>
        <Text style={styles.sectionTitle}>Road to Omaha</Text>
      </View>

      <View style={styles.bracketToggle}>
        <TouchableOpacity
          style={[styles.bToggle, activeBracket === 1 && styles.bToggleActive]}
          onPress={() => setActiveBracket(1)}
        >
          <Text style={[styles.bToggleText, activeBracket === 1 && styles.bToggleTextActive]}>BRACKET 1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bToggle, activeBracket === 2 && styles.bToggleActive]}
          onPress={() => setActiveBracket(2)}
        >
          <Text style={[styles.bToggleText, activeBracket === 2 && styles.bToggleTextActive]}>BRACKET 2</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 4 }}
      >
        {bracketTeams.map((team) => (
          <View key={team.school} style={[styles.cwsTeamCard, { borderColor: team.primaryColorHex + "66" }]}>
            <View style={[styles.cwsColorBar, { backgroundColor: team.primaryColorHex }]} />
            <View style={{ padding: 12 }}>
              {team.nationalSeed ? (
                <View style={[styles.seedBadge, { backgroundColor: team.primaryColorHex + "22", borderColor: team.primaryColorHex + "66" }]}>
                  <Text style={[styles.seedText, { color: team.primaryColorHex }]}>#{team.nationalSeed} SEED</Text>
                </View>
              ) : (
                <View style={[styles.seedBadge, { backgroundColor: "#ffffff11", borderColor: "#ffffff22" }]}>
                  <Text style={[styles.seedText, { color: "#888888" }]}>UNSEEDED</Text>
                </View>
              )}
              <Text style={styles.cwsTeamName}>{team.school}</Text>
              <Text style={styles.cwsMascot}>{team.mascot}</Text>
              <Text style={styles.cwsRecord}>{team.overallRecord}</Text>
              <Text style={styles.cwsResult}>{team.superRegionalResult}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ── SEC STANDINGS ────────────────────────────────── */}
      {secConf && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>TOP CONFERENCE · 2026</Text>
            <Text style={styles.sectionTitle}>SEC Baseball Standings</Text>
          </View>
          <View style={styles.standingsCard}>
            <View style={styles.standingsHeaderRow}>
              <Text style={[styles.standingsCol, { flex: 3 }]}>TEAM</Text>
              <Text style={styles.standingsCol}>CONF</Text>
              <Text style={styles.standingsCol}>OVERALL</Text>
            </View>
            {secConf.standings.slice(0, 8).map((t, i) => (
              <View key={t.team} style={[styles.standingsRow, i % 2 === 0 && { backgroundColor: "#060d1a" }]}>
                <Text style={[styles.standingsTeam, { flex: 3 }]}>{t.team}</Text>
                <Text style={styles.standingsData}>{t.conferenceRecord}</Text>
                <Text style={styles.standingsData}>{t.overallWins}-{t.overallLosses}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* ── MLB DRAFT PROSPECTS ──────────────────────────── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>2026 MLB DRAFT</Text>
        <Text style={styles.sectionTitle}>Top College Prospects</Text>
      </View>
      {MLB_PROSPECTS_2026.map((p, i) => (
        <View key={p.name} style={styles.prospectRow}>
          <View style={styles.prospectRankBadge}>
            <Text style={styles.prospectRankText}>{i + 1}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.prospectName}>{p.name}</Text>
            <Text style={styles.prospectSub}>{p.school} · {p.pos}</Text>
          </View>
          <View style={styles.prospectRoundPill}>
            <Text style={styles.prospectRoundText}>{p.projRound}</Text>
          </View>
        </View>
      ))}

      {/* ── PARENT GATE + IQ MODULES ─────────────────────── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>IQ MODULES</Text>
        <Text style={styles.sectionTitle}>Coaching Intelligence</Text>
      </View>

      {!parentConfirmed ? (
        <View style={styles.gateCard}>
          <Text style={styles.gateLabel}>PARENT / GUARDIAN GATE</Text>
          <Text style={styles.gateTitle}>Adult confirmation required</Text>
          <Text style={styles.gateText}>
            This section contains youth sports coaching concepts. A parent or guardian must confirm access before coaching content is shown.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => setParentConfirmed(true)}>
            <Text style={styles.primaryButtonText}>I am a parent or guardian</Text>
          </TouchableOpacity>
          <Text style={styles.disclaimer}>
            AthlynXAI keeps youth development safety-first. This is not medical advice.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.unlockedBanner}>
            <Text style={styles.unlockedTitle}>Parent gate confirmed</Text>
            <Text style={styles.unlockedText}>Coaching modules are now visible on this device.</Text>
          </View>
          {modules.map((item) => (
            <ModuleCard key={item.title} {...item} />
          ))}
          <View style={styles.signoffCard}>
            <Text style={styles.signoffTitle}>ONE IDENTITY · EVERY ATHLETE</Text>
            <Text style={styles.signoffText}>Diamond Grind IQ is part of the Lifetime Athlete Identity path inside AthlynXAI.</Text>
          </View>
        </>
      )}

      {/* ── BOTTOM CTA ───────────────────────────────────── */}
      <TouchableOpacity
        style={styles.enterCTA}
        onPress={() => Linking.openURL("https://athlynx.ai/diamond-grind")}
        activeOpacity={0.85}
      >
        <LinearGradient colors={[COBALT, "#0060cc"]} style={styles.enterCTAGradient}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#00ff88" }} />
          <Text style={styles.enterCTAText}>FULL DIAMOND GRIND PLATFORM →</Text>
        </LinearGradient>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  content: { paddingBottom: 40, gap: 0 },

  // Hero
  hero: { padding: 24, paddingTop: 28, paddingBottom: 28, position: "relative", overflow: "hidden" },
  stadiumLightLeft: { position: "absolute", top: 0, left: "20%", width: 1, height: "60%", backgroundColor: COBALT, opacity: 0.25, transform: [{ rotate: "-12deg" }] },
  stadiumLightRight: { position: "absolute", top: 0, right: "20%", width: 1, height: "60%", backgroundColor: COBALT, opacity: 0.25, transform: [{ rotate: "12deg" }] },
  heroEyebrowRow: { flexDirection: "row", marginBottom: 12 },
  eyebrowBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: COBALT + "22", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: COBALT + "55" },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#00ff88" },
  eyebrowText: { color: COBALT, fontSize: 10, fontWeight: "900", letterSpacing: 1.5 },
  heroTitle: { fontSize: 34, fontWeight: "900", color: "#ffffff", letterSpacing: -1, marginBottom: 8 },
  heroSubtitle: { fontSize: 14, color: "#6a8aaa", lineHeight: 22, marginBottom: 20 },
  heroCTA: { alignSelf: "flex-start", backgroundColor: COBALT, borderRadius: 30, paddingHorizontal: 20, paddingVertical: 10 },
  heroCTAText: { color: "#ffffff", fontWeight: "900", fontSize: 12, letterSpacing: 1.5 },

  // Section
  sectionHeader: { paddingHorizontal: 16, paddingTop: 28, paddingBottom: 12 },
  sectionLabel: { fontSize: 10, fontWeight: "800", color: COBALT, letterSpacing: 2, marginBottom: 4 },
  sectionTitle: { fontSize: 22, fontWeight: "900", color: "#ffffff" },

  // Bracket toggle
  bracketToggle: { flexDirection: "row", gap: 8, paddingHorizontal: 16, marginBottom: 12 },
  bToggle: { flex: 1, borderRadius: 10, borderWidth: 1, borderColor: "#1a2a4a", paddingVertical: 10, alignItems: "center", backgroundColor: "#060d1a" },
  bToggleActive: { backgroundColor: COBALT, borderColor: COBALT },
  bToggleText: { color: "#6a8aaa", fontSize: 11, fontWeight: "900", letterSpacing: 1 },
  bToggleTextActive: { color: "#ffffff" },

  // CWS Team Cards
  cwsTeamCard: { width: 155, backgroundColor: "#060d1a", borderRadius: 14, overflow: "hidden", borderWidth: 1 },
  cwsColorBar: { height: 4, width: "100%" },
  seedBadge: { alignSelf: "flex-start", borderRadius: 5, paddingHorizontal: 7, paddingVertical: 3, borderWidth: 1, marginBottom: 8 },
  seedText: { fontSize: 9, fontWeight: "900", letterSpacing: 0.5 },
  cwsTeamName: { fontSize: 14, fontWeight: "900", color: "#ffffff", marginBottom: 2 },
  cwsMascot: { fontSize: 11, color: "#6a8aaa", marginBottom: 6 },
  cwsRecord: { fontSize: 12, fontWeight: "800", color: COBALT, marginBottom: 4 },
  cwsResult: { fontSize: 10, color: "#4a6a8a", lineHeight: 14 },

  // Standings
  standingsCard: { marginHorizontal: 16, backgroundColor: "#060d1a", borderRadius: 14, overflow: "hidden", borderWidth: 1, borderColor: "#1a2a4a" },
  standingsHeaderRow: { flexDirection: "row", paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#1a2a4a" },
  standingsCol: { flex: 1, fontSize: 9, fontWeight: "900", color: COBALT, letterSpacing: 1 },
  standingsRow: { flexDirection: "row", paddingHorizontal: 14, paddingVertical: 10 },
  standingsTeam: { fontSize: 13, fontWeight: "700", color: "#ffffff" },
  standingsData: { flex: 1, fontSize: 12, color: "#6a8aaa", textAlign: "center" },

  // Prospects
  prospectRow: { flexDirection: "row", alignItems: "center", gap: 12, marginHorizontal: 16, marginBottom: 8, backgroundColor: "#060d1a", borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#1a2a4a" },
  prospectRankBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: COBALT + "22", borderWidth: 1, borderColor: COBALT + "66", alignItems: "center", justifyContent: "center" },
  prospectRankText: { fontSize: 14, fontWeight: "900", color: COBALT },
  prospectName: { fontSize: 15, fontWeight: "900", color: "#ffffff", marginBottom: 2 },
  prospectSub: { fontSize: 11, color: "#6a8aaa" },
  prospectRoundPill: { backgroundColor: "#00ff8822", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: "#00ff8844" },
  prospectRoundText: { fontSize: 10, fontWeight: "900", color: "#00ff88" },

  // Gate
  gateCard: { marginHorizontal: 16, borderRadius: 16, borderWidth: 1, borderColor: `${COBALT}88`, backgroundColor: "#060d1a", padding: Spacing.lg },
  gateLabel: { color: COBALT, fontSize: 11, fontWeight: "900", letterSpacing: 1.2, marginBottom: 10 },
  gateTitle: { color: "#FFFFFF", fontSize: 22, fontWeight: "900", marginBottom: 8 },
  gateText: { color: Colors.textSecondary, fontSize: 15, lineHeight: 23, marginBottom: Spacing.lg },
  primaryButton: { backgroundColor: COBALT, borderRadius: BorderRadius.md, paddingVertical: 15, alignItems: "center" },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },
  disclaimer: { color: Colors.textMuted, fontSize: 12, lineHeight: 18, marginTop: Spacing.md, textAlign: "center" },

  // Unlocked
  unlockedBanner: { marginHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: `${COBALT}66`, backgroundColor: "#061425", padding: Spacing.md },
  unlockedTitle: { color: "#FFFFFF", fontWeight: "900", fontSize: 16 },
  unlockedText: { color: Colors.textSecondary, marginTop: 4 },

  // Modules
  moduleCard: { marginHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", backgroundColor: "#060d1a", padding: Spacing.md },
  moduleHeader: { alignSelf: "flex-start", borderRadius: BorderRadius.full, borderWidth: 1, borderColor: COBALT, paddingHorizontal: 9, paddingVertical: 4, marginBottom: 10 },
  moduleLabel: { color: COBALT, fontSize: 10, fontWeight: "900" },
  moduleTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "900", marginBottom: 7 },
  moduleBody: { color: Colors.textSecondary, fontSize: 14, lineHeight: 21 },

  // Sign off
  signoffCard: { marginHorizontal: 16, borderRadius: 12, backgroundColor: "#050A12", padding: Spacing.md, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  signoffTitle: { color: COBALT, fontWeight: "900", fontSize: 12, letterSpacing: 1 },
  signoffText: { color: Colors.textSecondary, lineHeight: 20, marginTop: 6 },

  // Enter CTA
  enterCTA: { marginHorizontal: 16, marginTop: 24, borderRadius: 30, overflow: "hidden" },
  enterCTAGradient: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16, gap: 8 },
  enterCTAText: { color: "#ffffff", fontWeight: "900", fontSize: 13, letterSpacing: 1.5 },
});
