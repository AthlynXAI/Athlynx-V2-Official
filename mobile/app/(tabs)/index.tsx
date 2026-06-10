import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Linking,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COBALT = "#1E90FF";
const COBALT_DARK = "#0a1628";

const TICKER_ITEMS = [
  "MEN'S COLLEGE WORLD SERIES · ROAD TO OMAHA",
  "DIAMOND GRIND · BASEBALL + SOFTBALL IQ",
  "NIL PORTAL · DEALS LIVE",
  "TRANSFER PORTAL · ACTIVE",
  "INTELLIGENCE OS · LIVE",
  "GRIDIRON NEXUS · SEASON PREP",
  "COURT KINGS · RECRUITING OPEN",
  "THE ATHLETE'S PLAYBOOK · NEW EPISODES",
  "PLATFORM v1.0 · BETA · FULL LAUNCH JULY 1",
  "FREE PROFILE · 30 SECONDS",
  "NO GAMBLING · ATHLETE-FIRST · BE THE LEGACY",
];

const MCWS_REGIONALS = [
  { site: "Morgantown, WV", home: "West Virginia", away: "Cal Poly", status: "FINAL", homeScore: "12", awayScore: "2", seriesNote: "WVU leads 1-0" },
  { site: "Chapel Hill, NC", home: "North Carolina", away: "USC", status: "LIVE", homeScore: "0", awayScore: "0", seriesNote: "USC leads 1-0" },
  { site: "Athens, GA", home: "Georgia", away: "Mississippi St", status: "TODAY", homeScore: "—", awayScore: "—", seriesNote: "Series: Sat–Mon" },
  { site: "Auburn, AL", home: "Auburn", away: "Ole Miss", status: "LIVE", homeScore: "—", awayScore: "—", seriesNote: "Ole Miss leads 1-0" },
  { site: "Austin, TX", home: "Texas", away: "Oregon", status: "TODAY", homeScore: "—", awayScore: "—", seriesNote: "Series: Sat–Mon" },
  { site: "Lawrence, KS", home: "Kansas", away: "Oklahoma", status: "TODAY", homeScore: "—", awayScore: "—", seriesNote: "Series: Sat–Mon" },
  { site: "Tuscaloosa, AL", home: "Alabama", away: "St. John's", status: "TODAY", homeScore: "—", awayScore: "—", seriesNote: "Series: Sat–Mon" },
  { site: "Troy, AL", home: "Troy", away: "Little Rock", status: "LIVE", homeScore: "—", awayScore: "—", seriesNote: "Series: 0-0" },
];

const CREATOR_INTEGRATIONS = [
  { label: "YouTube", sub: "AthlynX Channel · Highlights", badge: "LIVE", color: "#FF0000", href: "https://youtube.com/@athlynxai" },
  { label: "Spotify", sub: "The Athlete's Playbook Podcast", badge: "AUDIO", color: "#1DB954", href: "https://open.spotify.com" },
  { label: "Vimeo", sub: "Pro Highlight Reels · Film", badge: "PRO", color: "#1AB7EA", href: "https://vimeo.com" },
  { label: "Suno AI", sub: "Athlete Pump-Up Music", badge: "AI", color: "#8B5CF6", href: "https://suno.com" },
  { label: "Shopify", sub: "AthlynX Store · ICC-USA Gear", badge: "SHOP", color: "#96BF48", href: "https://athlynx.ai/commerce" },
  { label: "Creators", sub: "Meta Creator Marketplace · NIL", badge: "NIL", color: "#0866FF", href: "https://athlynx.ai/nil-portal" },
];

function LiveTicker() {
  const scrollX = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const totalWidth = TICKER_ITEMS.join("  ·  ").length * 7.5;
    const animation = Animated.loop(
      Animated.timing(scrollX, {
        toValue: -totalWidth / 2,
        duration: 35000,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, []);
  const fullText = [...TICKER_ITEMS, ...TICKER_ITEMS].join("  ·  ");
  return (
    <View style={styles.tickerContainer}>
      <View style={styles.tickerLiveDot} />
      <Animated.Text
        style={[styles.tickerText, { transform: [{ translateX: scrollX }] }]}
        numberOfLines={1}
      >
        {fullText}
      </Animated.Text>
    </View>
  );
}

function MCWSCard({ game }: { game: typeof MCWS_REGIONALS[0] }) {
  const isLive = game.status === "LIVE";
  const isFinal = game.status === "FINAL";
  const statusColor = isLive ? "#00ff88" : isFinal ? "#6b7a99" : COBALT;
  return (
    <View style={styles.mcwsCard}>
      <View style={styles.mcwsCardHeader}>
        <View style={[styles.statusPill, { borderColor: statusColor, backgroundColor: statusColor + "18" }]}>
          {isLive && <View style={styles.livePulse} />}
          <Text style={[styles.statusPillText, { color: statusColor }]}>{game.status}</Text>
        </View>
        <Text style={styles.mcwsSite}>{game.site}</Text>
      </View>
      <View style={styles.mcwsTeamRow}>
        <Text style={styles.mcwsTeam}>{game.home}</Text>
        <Text style={[styles.mcwsScore, isFinal && styles.mcwsScoreWin]}>{game.homeScore}</Text>
      </View>
      <View style={styles.mcwsTeamRow}>
        <Text style={styles.mcwsTeam}>{game.away}</Text>
        <Text style={styles.mcwsScore}>{game.awayScore}</Text>
      </View>
      <Text style={styles.mcwsSeriesNote}>{game.seriesNote}</Text>
    </View>
  );
}

export default function HomeTab() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/brand/engine-mark-white.png")}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <Text style={styles.headerWordmark}>
          Athlynx<Text style={styles.headerXAI}>XAI</Text>
        </Text>
        <View style={styles.betaBadge}>
          <Text style={styles.betaText}>BETA</Text>
        </View>
      </View>

      {/* Live Ticker */}
      <LiveTicker />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COBALT} />}
      >
        {/* ── MCWS HERO ─────────────────────────────────────── */}
        <LinearGradient colors={["#000000", "#0a1628", "#000d1f"]} style={styles.mcwsHero}>
          <View style={styles.mcwsHeroHeader}>
            <Image
              source={require("../../assets/brand/diamond-grind-icon-real.png")}
              style={styles.mcwsHeroIcon}
              resizeMode="contain"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.mcwsHeroEyebrow}>ROAD TO OMAHA · LIVE</Text>
              <Text style={styles.mcwsHeroTitle}>Men's College{"\n"}World Series</Text>
              <Text style={styles.mcwsHeroSub}>Super Regionals · June 6–9, 2026</Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mcwsScoreScroll}
          >
            {MCWS_REGIONALS.map((game, i) => (
              <MCWSCard key={i} game={game} />
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.mcwsFullBracketBtn}
            onPress={() => router.push("/(tabs)/brackets")}
            activeOpacity={0.85}
          >
            <View style={styles.mcwsFullBracketInner}>
              <View style={styles.liveDot} />
              <Text style={styles.mcwsFullBracketText}>FULL BRACKET + LIVE SCORES →</Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>

        {/* ── DIAMOND GRIND SHOWCASE ────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionLabel}>FEATURED ENGINE</Text>
              <Text style={styles.sectionTitle}>Diamond Grind</Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/(tabs)/diamond-grind")}>
              <Text style={styles.seeAll}>OPEN →</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.diamondCard}
            onPress={() => router.push("/(tabs)/diamond-grind")}
            activeOpacity={0.88}
          >
            <LinearGradient colors={["#050f1e", "#091428", "#000000"]} style={styles.diamondCardGradient}>
              <View style={styles.diamondCardTop}>
                <Image
                  source={require("../../assets/brand/diamond-grind-icon-real.png")}
                  style={styles.diamondCardIcon}
                  resizeMode="contain"
                />
                <View style={styles.diamondCardBadges}>
                  <View style={styles.diamondBadge}>
                    <Text style={styles.diamondBadgeText}>BASEBALL</Text>
                  </View>
                  <View style={[styles.diamondBadge, { backgroundColor: "#ff6b9d22", borderColor: "#ff6b9d44" }]}>
                    <Text style={[styles.diamondBadgeText, { color: "#ff6b9d" }]}>SOFTBALL</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.diamondCardTitle}>Baseball + Softball IQ</Text>
              <Text style={styles.diamondCardBody}>
                Pitcher IQ · Catcher IQ · Arm Care · Diamond Grind Path · Road to Omaha · Youth to Pro
              </Text>
              <View style={styles.diamondCardCTA}>
                <View style={styles.liveDot} />
                <Text style={styles.diamondCardCTAText}>ENTER DIAMOND GRIND →</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ── BE THE LEGACY / BRAND HERO ────────────────────── */}
        <TouchableOpacity
          style={styles.legacyCard}
          onPress={() => Linking.openURL("https://athlynx.ai")}
          activeOpacity={0.9}
        >
          <LinearGradient colors={["#000000", "#050d1e", "#000000"]} style={styles.legacyGradient}>
            <View style={styles.stadiumLightLeft} />
            <View style={styles.stadiumLightRight} />
            <Image
              source={require("../../assets/brand/athlynx-official-real.png")}
              style={styles.legacyOwl}
              resizeMode="contain"
            />
            <Text style={styles.legacyWordmark}>AthlynX</Text>
            <Text style={styles.legacyTagline}>THE ATHLETE'S PLAYBOOK</Text>
            <Text style={styles.legacyMotto}>BE THE LEGACY</Text>
            <Text style={styles.legacyBody}>
              Youth to Pro to Retirement. Every Sport. Every Level.{"\n"}
              One Identity. One Platform. One Mission.
            </Text>
            <View style={styles.legacyCTA}>
              <View style={styles.liveDot} />
              <Text style={styles.legacyCTAText}>ENTER THE PORTAL →</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* ── CREATOR & MEDIA INTEGRATIONS ─────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionLabel}>CREATOR ECOSYSTEM</Text>
              <Text style={styles.sectionTitle}>Media & Commerce</Text>
            </View>
          </View>
          <View style={styles.creatorGrid}>
            {CREATOR_INTEGRATIONS.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={styles.creatorCard}
                onPress={() => Linking.openURL(item.href)}
                activeOpacity={0.8}
              >
                <View style={[styles.creatorDot, { backgroundColor: item.color }]} />
                <Text style={styles.creatorLabel}>{item.label}</Text>
                <Text style={styles.creatorSub}>{item.sub}</Text>
                <View style={[styles.creatorBadge, { backgroundColor: item.color + "22" }]}>
                  <Text style={[styles.creatorBadgeText, { color: item.color }]}>{item.badge}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── PLATFORM STATS ───────────────────────────────── */}
        <View style={styles.statsRow}>
          {[
            { num: "50+", label: "Engine\nLanes" },
            { num: "13", label: "Sport\nPlatforms" },
            { num: "1M+", label: "Lines of\nCode" },
            { num: "∞", label: "Athlete\nPotential" },
          ].map((s, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statNum}>{s.num}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── ENTER THE PORTAL CTA ─────────────────────────── */}
        <TouchableOpacity
          style={styles.portalCTA}
          onPress={() => Linking.openURL("https://athlynx.ai/signup")}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[COBALT, "#0055cc", "#003399"]}
            style={styles.portalCTAGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.liveDot} />
            <Text style={styles.portalCTAText}>ENTER THE PORTAL →</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#000000",
    borderBottomWidth: 1,
    borderBottomColor: "#0d1b3e",
  },
  headerLogo: { width: 32, height: 32 },
  headerWordmark: { fontSize: 18, fontWeight: "900", color: "#ffffff", letterSpacing: -0.5 },
  headerXAI: { color: COBALT },
  betaBadge: {
    marginLeft: "auto",
    backgroundColor: COBALT + "22",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: COBALT + "66",
  },
  betaText: { fontSize: 10, fontWeight: "800", color: COBALT, letterSpacing: 1 },

  tickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COBALT_DARK,
    paddingVertical: 7,
    overflow: "hidden",
    borderBottomWidth: 1,
    borderBottomColor: "#1a2a4a",
  },
  tickerLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#00ff88",
    marginLeft: 12,
    marginRight: 8,
    flexShrink: 0,
  },
  tickerText: {
    color: COBALT,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    width: 9999,
  },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  // MCWS Hero
  mcwsHero: { padding: 20, paddingBottom: 16 },
  mcwsHeroHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 18,
  },
  mcwsHeroIcon: { width: 56, height: 56, borderRadius: 12 },
  mcwsHeroEyebrow: {
    fontSize: 10,
    fontWeight: "800",
    color: COBALT,
    letterSpacing: 2,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  mcwsHeroTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#ffffff",
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  mcwsHeroSub: { fontSize: 12, color: "#6a8aaa", fontWeight: "600", marginTop: 2 },
  mcwsScoreScroll: { gap: 10, paddingRight: 16 },
  mcwsCard: {
    width: 170,
    backgroundColor: "#060d1a",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#1a2a4a",
  },
  mcwsCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
  },
  livePulse: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: "#00ff88" },
  statusPillText: { fontSize: 9, fontWeight: "800", letterSpacing: 0.8 },
  mcwsSite: { fontSize: 10, color: "#4a6a8a", fontWeight: "600" },
  mcwsTeamRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 3,
  },
  mcwsTeam: { fontSize: 13, color: "#c0d0e0", fontWeight: "700", flex: 1 },
  mcwsScore: { fontSize: 16, color: "#c0d0e0", fontWeight: "900", minWidth: 28, textAlign: "right" },
  mcwsScoreWin: { color: "#ffffff" },
  mcwsSeriesNote: {
    fontSize: 10,
    color: COBALT,
    fontWeight: "700",
    marginTop: 8,
    letterSpacing: 0.5,
  },
  mcwsFullBracketBtn: {
    marginTop: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COBALT + "66",
    backgroundColor: COBALT + "18",
  },
  mcwsFullBracketInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  mcwsFullBracketText: {
    color: COBALT,
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 1.5,
  },

  section: { paddingHorizontal: 16, paddingTop: 28 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: COBALT,
    letterSpacing: 2,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  sectionTitle: { fontSize: 22, fontWeight: "900", color: "#ffffff" },
  seeAll: { fontSize: 12, fontWeight: "800", color: COBALT },

  // Diamond Grind
  diamondCard: { borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: "#1a2a4a" },
  diamondCardGradient: { padding: 20 },
  diamondCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  diamondCardIcon: { width: 52, height: 52, borderRadius: 12 },
  diamondCardBadges: { flexDirection: "row", gap: 6 },
  diamondBadge: {
    backgroundColor: COBALT + "22",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COBALT + "44",
  },
  diamondBadgeText: { fontSize: 9, fontWeight: "800", color: COBALT, letterSpacing: 1 },
  diamondCardTitle: { fontSize: 20, fontWeight: "900", color: "#ffffff", marginBottom: 8 },
  diamondCardBody: { fontSize: 13, color: "#6a8aaa", lineHeight: 20, marginBottom: 16 },
  diamondCardCTA: { flexDirection: "row", alignItems: "center", gap: 8 },
  diamondCardCTAText: { fontSize: 12, fontWeight: "800", color: COBALT, letterSpacing: 1.5 },

  // Be The Legacy
  legacyCard: {
    marginHorizontal: 16,
    marginTop: 28,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1a2a4a",
  },
  legacyGradient: { padding: 32, alignItems: "center" },
  stadiumLightLeft: {
    position: "absolute",
    top: 0,
    left: "20%",
    width: 1,
    height: "55%",
    backgroundColor: COBALT,
    opacity: 0.2,
    transform: [{ rotate: "-12deg" }],
  },
  stadiumLightRight: {
    position: "absolute",
    top: 0,
    right: "20%",
    width: 1,
    height: "55%",
    backgroundColor: COBALT,
    opacity: 0.2,
    transform: [{ rotate: "12deg" }],
  },
  legacyOwl: { width: 80, height: 80, marginBottom: 16 },
  legacyWordmark: { fontSize: 32, fontWeight: "900", color: "#ffffff", letterSpacing: -1, marginBottom: 4 },
  legacyTagline: {
    fontSize: 11,
    fontWeight: "800",
    color: COBALT,
    letterSpacing: 3,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  legacyMotto: {
    fontSize: 24,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 2,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  legacyBody: {
    fontSize: 13,
    color: "#6a8aaa",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  legacyCTA: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COBALT,
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  legacyCTAText: { fontSize: 13, fontWeight: "900", color: "#ffffff", letterSpacing: 1.5 },

  // Creator Grid
  creatorGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  creatorCard: {
    width: (SCREEN_WIDTH - 42) / 2,
    backgroundColor: "#060d1a",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1a2a4a",
  },
  creatorDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 8 },
  creatorLabel: { fontSize: 15, fontWeight: "900", color: "#ffffff", marginBottom: 4 },
  creatorSub: { fontSize: 11, color: "#4a6a8a", lineHeight: 16, marginBottom: 10 },
  creatorBadge: { alignSelf: "flex-start", borderRadius: 4, paddingHorizontal: 7, paddingVertical: 3 },
  creatorBadgeText: { fontSize: 9, fontWeight: "800", letterSpacing: 0.8 },

  // Stats
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginTop: 28,
    paddingVertical: 20,
    backgroundColor: "#060d1a",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1a2a4a",
  },
  statItem: { alignItems: "center" },
  statNum: { fontSize: 22, fontWeight: "900", color: COBALT, marginBottom: 4 },
  statLabel: { fontSize: 10, color: "#4a6a8a", textAlign: "center", lineHeight: 14, fontWeight: "600" },

  // Portal CTA
  portalCTA: { marginHorizontal: 16, marginTop: 24, borderRadius: 30, overflow: "hidden" },
  portalCTAGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 10,
  },
  portalCTAText: { color: "#ffffff", fontWeight: "900", fontSize: 14, letterSpacing: 2 },

  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#00ff88" },
});
