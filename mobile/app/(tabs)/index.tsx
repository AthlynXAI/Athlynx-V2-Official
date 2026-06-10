/**
 * AthlynX Home Screen — v2.0.0
 * "The Athlete's Playbook. Be The Legacy."
 *
 * Sections:
 * 1. Beta banner
 * 2. Live ticker (MCWS)
 * 3. Header (AthlynX XAI logo + search)
 * 4. WCWS Texas Back-to-Back Champions congrats banner
 * 5. MCWS Road to Omaha hero + bracket
 * 6. Diamond Grind IQ showcase
 * 7. AthlynX hero — logo, tagline, branded gear
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Trophy,
  Activity,
  Zap,
  ChevronRight,
  Star,
  Target,
  TrendingUp,
  Search,
  Bell,
  Menu,
  Circle,
} from "lucide-react-native";
import { Colors, Spacing, BorderRadius, Typography } from "../../lib/theme";

const { width: SCREEN_W } = Dimensions.get("window");

// ─── MCWS 2026 DATA ───────────────────────────────────────────────────────────
const MCWS_TEAMS = [
  { seed: 3,  name: "Georgia",        abbr: "UGA",  record: "47-16", status: "OMAHA" },
  { seed: 5,  name: "North Carolina", abbr: "UNC",  record: "45-17", status: "OMAHA" },
  { seed: 6,  name: "Texas",          abbr: "TEX",  record: "44-18", status: "OMAHA" },
  { seed: 7,  name: "Alabama",        abbr: "ALA",  record: "43-19", status: "OMAHA" },
  { seed: 16, name: "West Virginia",  abbr: "WVU",  record: "42-20", status: "OMAHA" },
  { seed: 0,  name: "Troy",           abbr: "TROY", record: "40-22", status: "OMAHA" },
  { seed: 0,  name: "Ole Miss",       abbr: "MISS", record: "41-21", status: "OMAHA" },
  { seed: 0,  name: "Oklahoma",       abbr: "OU",   record: "43-19", status: "OMAHA" },
];

const MCWS_BRACKET = [
  { game: 1, date: "Fri Jun 12", time: "2pm ET",  team1: "WVU",  seed1: 16, team2: "TROY", seed2: 0, status: "UPCOMING" },
  { game: 2, date: "Fri Jun 12", time: "7pm ET",  team1: "UNC",  seed1: 5,  team2: "MISS", seed2: 0, status: "UPCOMING" },
  { game: 3, date: "Sat Jun 13", time: "3pm ET",  team1: "ALA",  seed1: 7,  team2: "OU",   seed2: 0, status: "UPCOMING" },
  { game: 4, date: "Sat Jun 13", time: "8pm ET",  team1: "UGA",  seed1: 3,  team2: "TEX",  seed2: 6, status: "UPCOMING" },
];

const TICKER_ITEMS = [
  "⚾ MCWS ROAD TO OMAHA · JUNE 12–22 · CHARLES SCHWAB FIELD",
  "🏆 WCWS: TEXAS BACK-TO-BACK CHAMPIONS · TEAGAN KAVAN MOP",
  "⚾ GAME 1: WVU vs TROY · FRI JUN 12 · 2PM ET · ESPN",
  "⚾ GAME 4: #3 GEORGIA vs #6 TEXAS · SAT JUN 13 · 8PM ET · ESPN",
  "💎 DIAMOND GRIND IQ · MCWS ANALYTICS LIVE",
];

// ─── TICKER ──────────────────────────────────────────────────────────────────
function LiveTicker() {
  const [idx, setIdx] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        setIdx((i) => (i + 1) % TICKER_ITEMS.length);
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.ticker}>
      <View style={styles.tickerLiveDot} />
      <Animated.Text style={[styles.tickerText, { opacity: fadeAnim }]} numberOfLines={1}>
        {TICKER_ITEMS[idx]}
      </Animated.Text>
    </View>
  );
}

// ─── BETA BANNER ─────────────────────────────────────────────────────────────
function BetaBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <View style={styles.betaBanner}>
      <View style={styles.betaPill}><Text style={styles.betaPillText}>BETA</Text></View>
      <Text style={styles.betaText}>
        AthlynXAI is in Beta — updated daily. Full launch{" "}
        <Text style={styles.betaDate}>July 1, 2026</Text>. Features may change.
      </Text>
      <Pressable onPress={() => setVisible(false)} style={styles.betaClose}>
        <Text style={styles.betaCloseText}>✕</Text>
      </Pressable>
    </View>
  );
}

// ─── HEADER ──────────────────────────────────────────────────────────────────
function AppHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Image source={require("../../assets/logo_compact.png")} style={styles.headerLogo} />
        <Text style={styles.headerXAI}>XAI</Text>
      </View>
      <View style={styles.headerRight}>
        <Pressable style={styles.headerIcon}><Search size={20} color={Colors.electric} strokeWidth={2} /></Pressable>
        <Pressable style={styles.headerIcon}><Bell size={20} color={Colors.textSecondary} strokeWidth={2} /></Pressable>
        <Pressable style={styles.headerIcon}><Menu size={20} color={Colors.textSecondary} strokeWidth={2} /></Pressable>
      </View>
    </View>
  );
}

// ─── WCWS CONGRATS BANNER ────────────────────────────────────────────────────
function WCWSCongratsCard() {
  return (
    <View style={styles.wcwsCard}>
      <View style={styles.wcwsLeft}>
        <Text style={styles.wcwsEmoji}>🏆🏆</Text>
      </View>
      <View style={styles.wcwsContent}>
        <Text style={styles.wcwsLabel}>WCWS 2026 · BACK-TO-BACK CHAMPIONS</Text>
        <Text style={styles.wcwsTeam}>Texas Longhorns</Text>
        <Text style={styles.wcwsMop}>Teagan Kavan · Back-to-Back MOP</Text>
      </View>
    </View>
  );
}

// ─── MCWS BRACKET CARD ───────────────────────────────────────────────────────
function MCWSMatchupCard({ game }: { game: typeof MCWS_BRACKET[0] }) {
  const isUpcoming = game.status === "UPCOMING";
  return (
    <View style={styles.matchupCard}>
      <View style={styles.matchupHeader}>
        <Text style={styles.matchupGame}>GAME {game.game}</Text>
        <Text style={styles.matchupTime}>{game.date} · {game.time}</Text>
        <View style={[styles.matchupStatus, isUpcoming && styles.matchupStatusUpcoming]}>
          <Text style={[styles.matchupStatusText, isUpcoming && styles.matchupStatusTextUpcoming]}>
            {game.status}
          </Text>
        </View>
      </View>
      <View style={styles.matchupTeams}>
        <View style={styles.matchupTeam}>
          {game.seed1 > 0 && <Text style={styles.matchupSeed}>#{game.seed1}</Text>}
          <Text style={styles.matchupTeamName}>{game.team1}</Text>
        </View>
        <View style={styles.matchupVS}>
          <Text style={styles.matchupVSText}>VS</Text>
        </View>
        <View style={[styles.matchupTeam, styles.matchupTeamRight]}>
          {game.seed2 > 0 && <Text style={styles.matchupSeed}>#{game.seed2}</Text>}
          <Text style={styles.matchupTeamName}>{game.team2}</Text>
        </View>
      </View>
    </View>
  );
}

// ─── MCWS HERO SECTION ───────────────────────────────────────────────────────
function MCWSSection({ onViewAll }: { onViewAll: () => void }) {
  return (
    <View style={styles.section}>
      {/* Section header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>ROAD TO OMAHA</Text>
        </View>
        <Pressable onPress={onViewAll} style={styles.sectionViewAll}>
          <Text style={styles.sectionViewAllText}>Full Bracket</Text>
          <ChevronRight size={14} color={Colors.electric} />
        </Pressable>
      </View>

      {/* MCWS Hero Image */}
      <ImageBackground
        source={require("../../assets/stadium_hero_bg.png")}
        style={styles.mcwsHero}
        imageStyle={styles.mcwsHeroImage}
      >
        <View style={styles.mcwsHeroOverlay}>
          <View style={styles.mcwsHeroBadge}>
            <Text style={styles.mcwsHeroBadgeText}>⚾ LIVE · MCWS 2026</Text>
          </View>
          <Text style={styles.mcwsHeroTitle}>MEN'S COLLEGE{"\n"}WORLD SERIES</Text>
          <Text style={styles.mcwsHeroSub}>Charles Schwab Field · Omaha, NE</Text>
          <Text style={styles.mcwsHeroDates}>June 12 – 22, 2026</Text>
          <View style={styles.mcwsHeroTeamCount}>
            <Text style={styles.mcwsHeroTeamCountText}>8 TEAMS · 1 CHAMPION</Text>
          </View>
        </View>
      </ImageBackground>

      {/* Bracket matchups */}
      <Text style={styles.bracketLabel}>OPENING ROUND MATCHUPS</Text>
      {MCWS_BRACKET.map((game) => (
        <MCWSMatchupCard key={game.game} game={game} />
      ))}

      {/* Teams grid */}
      <Text style={styles.bracketLabel}>ALL 8 TEAMS IN OMAHA</Text>
      <View style={styles.teamsGrid}>
        {MCWS_TEAMS.map((team) => (
          <View key={team.abbr} style={styles.teamChip}>
            {team.seed > 0 && <Text style={styles.teamChipSeed}>#{team.seed}</Text>}
            <Text style={styles.teamChipName}>{team.abbr}</Text>
            <Text style={styles.teamChipRecord}>{team.record}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── DIAMOND GRIND IQ SECTION ─────────────────────────────────────────────────
function DiamondGrindSection({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.diamondSection}>
      <ImageBackground
        source={require("../../assets/diamond_grind_bg.png")}
        style={styles.diamondHero}
        imageStyle={styles.diamondHeroImage}
      >
        <View style={styles.diamondOverlay}>
          <View style={styles.diamondBadge}>
            <Text style={styles.diamondBadgeText}>💎 DIAMOND GRIND IQ</Text>
          </View>
          <Text style={styles.diamondTitle}>Where Baseball Intelligence Lives</Text>
          <Text style={styles.diamondSub}>MCWS Analytics · Scouting Reports · Pitching Metrics</Text>
          <View style={styles.diamondCTA}>
            <Text style={styles.diamondCTAText}>Explore Diamond Grind IQ</Text>
            <ChevronRight size={16} color={Colors.black} />
          </View>
        </View>
      </ImageBackground>

      {/* Stats row */}
      <View style={styles.diamondStats}>
        {[
          { label: "ERA Leaders", value: "MCWS", icon: "⚾" },
          { label: "K Leaders", value: "LIVE", icon: "🔥" },
          { label: "OPS Leaders", value: "LIVE", icon: "📊" },
        ].map((stat) => (
          <View key={stat.label} style={styles.diamondStat}>
            <Text style={styles.diamondStatIcon}>{stat.icon}</Text>
            <Text style={styles.diamondStatValue}>{stat.value}</Text>
            <Text style={styles.diamondStatLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

// ─── ATHLYNX HERO SECTION ────────────────────────────────────────────────────
function AthlynXHeroSection() {
  return (
    <View style={styles.heroSection}>
      <ImageBackground
        source={require("../../assets/athlete_hero_bg.png")}
        style={styles.heroBackground}
        imageStyle={styles.heroBackgroundImage}
      >
        <View style={styles.heroOverlay}>
          {/* Logo */}
          <Image
            source={require("../../assets/logo_full.png")}
            style={styles.heroLogo}
            resizeMode="contain"
          />
          {/* Taglines */}
          <Text style={styles.heroTagline1}>THE ATHLETE'S PLAYBOOK</Text>
          <View style={styles.heroTaglineDivider} />
          <Text style={styles.heroTagline2}>BE THE LEGACY</Text>

          {/* Branded gear preview */}
          <Image
            source={require("../../assets/branded_gear_hero.png")}
            style={styles.heroGear}
            resizeMode="cover"
          />
          <Text style={styles.heroGearCaption}>AthlynX Gear · Diamond Grind Collection</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.electric}
            colors={[Colors.electric]}
          />
        }
      >
        <BetaBanner />
        <LiveTicker />
        <AppHeader />

        {/* Search bar */}
        <Pressable style={styles.searchBar}>
          <Search size={16} color={Colors.textMuted} />
          <Text style={styles.searchPlaceholder}>Search the AthlynX engine — ATHLYNX.AI</Text>
        </Pressable>

        {/* WCWS Congrats */}
        <WCWSCongratsCard />

        {/* MCWS Road to Omaha */}
        <MCWSSection onViewAll={() => router.push("/(tabs)/brackets")} />

        {/* Diamond Grind IQ */}
        <DiamondGrindSection onPress={() => router.push("/(tabs)/diamond-grind")} />

        {/* AthlynX Hero */}
        <AthlynXHeroSection />

        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.granite950 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },

  // Ticker
  ticker: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cobalt,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  tickerLiveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    opacity: 0.9,
  },
  tickerText: {
    ...Typography.ticker,
    flex: 1,
  },

  // Beta banner
  betaBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.granite900,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.electricBorder,
  },
  betaPill: {
    backgroundColor: Colors.cobalt,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 1,
  },
  betaPillText: { color: "#FFF", fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  betaText: { flex: 1, color: Colors.textPrimary, fontSize: 13, lineHeight: 18 },
  betaDate: { color: Colors.electric, fontWeight: "700" },
  betaClose: { padding: 4 },
  betaCloseText: { color: Colors.textMuted, fontSize: 16 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.granite950,
    borderBottomWidth: 1,
    borderBottomColor: Colors.electricBorder,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerLogo: { width: 40, height: 40, borderRadius: 8 },
  headerXAI: { color: Colors.electric, fontSize: 22, fontWeight: "900", letterSpacing: -0.5 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  headerIcon: { padding: 8 },

  // Search
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: Colors.granite800,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.electricBorder,
  },
  searchPlaceholder: { color: Colors.textMuted, fontSize: 14, flex: 1 },

  // WCWS
  wcwsCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Colors.goldDim,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gold,
    padding: 14,
    gap: 12,
  },
  wcwsLeft: { alignItems: "center", justifyContent: "center" },
  wcwsEmoji: { fontSize: 28 },
  wcwsContent: { flex: 1 },
  wcwsLabel: { color: Colors.gold, fontSize: 10, fontWeight: "800", letterSpacing: 1.2, textTransform: "uppercase" },
  wcwsTeam: { color: Colors.textPrimary, fontSize: 18, fontWeight: "800", marginTop: 2 },
  wcwsMop: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },

  // Section
  section: { marginBottom: 8 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  sectionAccent: { width: 3, height: 20, backgroundColor: Colors.electric, borderRadius: 2 },
  sectionTitle: { color: Colors.textPrimary, fontSize: 16, fontWeight: "800", letterSpacing: 0.5 },
  sectionViewAll: { flexDirection: "row", alignItems: "center", gap: 4 },
  sectionViewAllText: { color: Colors.electric, fontSize: 13, fontWeight: "600" },

  // MCWS Hero
  mcwsHero: {
    marginHorizontal: 16,
    height: 220,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    marginBottom: 16,
  },
  mcwsHeroImage: { borderRadius: BorderRadius.xl },
  mcwsHeroOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: 20,
    justifyContent: "flex-end",
  },
  mcwsHeroBadge: {
    backgroundColor: Colors.cobalt,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  mcwsHeroBadgeText: { color: "#FFF", fontSize: 11, fontWeight: "800", letterSpacing: 0.8 },
  mcwsHeroTitle: { color: "#FFF", fontSize: 26, fontWeight: "900", letterSpacing: -0.5, lineHeight: 30 },
  mcwsHeroSub: { color: Colors.electricDim, fontSize: 13, marginTop: 4 },
  mcwsHeroDates: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  mcwsHeroTeamCount: {
    marginTop: 10,
    backgroundColor: Colors.electricGlow,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: Colors.electricBorder,
  },
  mcwsHeroTeamCountText: { color: Colors.electric, fontSize: 11, fontWeight: "700", letterSpacing: 1 },

  // Bracket label
  bracketLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    paddingHorizontal: 16,
    marginBottom: 8,
    marginTop: 4,
  },

  // Matchup card
  matchupCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: Colors.granite800,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.electricBorder,
    padding: 14,
  },
  matchupHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  matchupGame: { color: Colors.electric, fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  matchupTime: { color: Colors.textSecondary, fontSize: 12, flex: 1 },
  matchupStatus: {
    backgroundColor: Colors.granite700,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  matchupStatusUpcoming: { backgroundColor: Colors.electricGlow, borderWidth: 1, borderColor: Colors.electricBorder },
  matchupStatusText: { color: Colors.textMuted, fontSize: 10, fontWeight: "700" },
  matchupStatusTextUpcoming: { color: Colors.electric },
  matchupTeams: { flexDirection: "row", alignItems: "center" },
  matchupTeam: { flex: 1, flexDirection: "row", alignItems: "center", gap: 6 },
  matchupTeamRight: { justifyContent: "flex-end" },
  matchupSeed: { color: Colors.electric, fontSize: 11, fontWeight: "700" },
  matchupTeamName: { color: Colors.textPrimary, fontSize: 20, fontWeight: "900" },
  matchupVS: { paddingHorizontal: 16 },
  matchupVSText: { color: Colors.textMuted, fontSize: 12, fontWeight: "700" },

  // Teams grid
  teamsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 8,
  },
  teamChip: {
    backgroundColor: Colors.granite800,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.electricBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
    minWidth: (SCREEN_W - 56) / 4,
  },
  teamChipSeed: { color: Colors.electric, fontSize: 10, fontWeight: "700" },
  teamChipName: { color: Colors.textPrimary, fontSize: 14, fontWeight: "800" },
  teamChipRecord: { color: Colors.textMuted, fontSize: 10, marginTop: 2 },

  // Diamond Grind
  diamondSection: { marginBottom: 8 },
  diamondHero: {
    marginHorizontal: 16,
    height: 200,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    marginBottom: 0,
  },
  diamondHeroImage: { borderRadius: BorderRadius.xl },
  diamondOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
    justifyContent: "flex-end",
  },
  diamondBadge: {
    backgroundColor: "rgba(0,194,255,0.2)",
    borderRadius: BorderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: "flex-start",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.electricBorder,
  },
  diamondBadgeText: { color: Colors.electric, fontSize: 11, fontWeight: "800", letterSpacing: 0.8 },
  diamondTitle: { color: "#FFF", fontSize: 22, fontWeight: "900", lineHeight: 26 },
  diamondSub: { color: Colors.textSecondary, fontSize: 12, marginTop: 4 },
  diamondCTA: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.electric,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: "flex-start",
    marginTop: 12,
    gap: 4,
  },
  diamondCTAText: { color: Colors.black, fontSize: 13, fontWeight: "800" },
  diamondStats: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 1,
    backgroundColor: Colors.granite800,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.electricBorder,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: "hidden",
  },
  diamondStat: { flex: 1, alignItems: "center", paddingVertical: 14, gap: 4 },
  diamondStatIcon: { fontSize: 20 },
  diamondStatValue: { color: Colors.electric, fontSize: 13, fontWeight: "800" },
  diamondStatLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: "600" },

  // AthlynX Hero
  heroSection: { marginTop: 16, marginHorizontal: 16, borderRadius: BorderRadius.xl, overflow: "hidden", marginBottom: 8 },
  heroBackground: { width: "100%", minHeight: 480 },
  heroBackgroundImage: { borderRadius: BorderRadius.xl },
  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  heroLogo: { width: 200, height: 200, marginBottom: 24 },
  heroTagline1: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 3,
    textTransform: "uppercase",
    textAlign: "center",
  },
  heroTaglineDivider: {
    width: 40,
    height: 2,
    backgroundColor: Colors.electric,
    borderRadius: 1,
    marginVertical: 12,
  },
  heroTagline2: {
    color: Colors.textPrimary,
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  heroGear: {
    width: SCREEN_W - 80,
    height: 200,
    borderRadius: BorderRadius.xl,
    marginTop: 24,
    overflow: "hidden",
  },
  heroGearCaption: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 10,
    textAlign: "center",
  },

  bottomPad: { height: 32 },
});
