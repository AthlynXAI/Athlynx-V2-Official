import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  LIVE:    { bg: "#0a2a1a", text: "#00ff88" },
  NEW:     { bg: "#0a1a3a", text: "#00b4ff" },
  HOT:     { bg: "#2a1a0a", text: "#ff8c00" },
  ELITE:   { bg: "#2a0a3a", text: "#cc66ff" },
  AI:      { bg: "#0a2a2a", text: "#00cccc" },
  BLEND:   { bg: "#2a0a1a", text: "#ff66aa" },
  SOON:    { bg: "#1a1a1a", text: "#6a7a9a" },
  BIZ:     { bg: "#0a0a2a", text: "#6666ff" },
  PRO:     { bg: "#1a0a2a", text: "#aa66ff" },
  OPEN:    { bg: "#0a2a1a", text: "#00ff88" },
  FOOTBALL:{ bg: "#2a1a0a", text: "#ff8c00" },
  SOCCER:  { bg: "#0a2a1a", text: "#00ff88" },
  HOOPS:   { bg: "#2a0a0a", text: "#ff4444" },
  FISHING: { bg: "#0a1a2a", text: "#00b4ff" },
  SHOP:    { bg: "#1a0a2a", text: "#cc66ff" },
  PERSONAL:{ bg: "#0a1a2a", text: "#00b4ff" },
  VOICE:   { bg: "#1a1a0a", text: "#cccc00" },
  BETA:    { bg: "#1a0a0a", text: "#ff6666" },
  TECH:    { bg: "#0a1a1a", text: "#00ccaa" },
};

const ALL_ENGINES = [
  {
    category: "NIL & Money",
    lanes: [
      { label: "NIL Portal", sub: "Deals · Contracts · Earnings", icon: require("../../assets/brand/nil-portal-lane.png"), badge: "LIVE", href: "/nil-portal" },
      { label: "NIL Vault", sub: "Secure your NIL assets", icon: require("../../assets/brand/nil-vault-lane.png"), badge: "ELITE", href: "/nil-vault" },
      { label: "NIL Messenger", sub: "Brand · Agent · Direct", icon: require("../../assets/brand/nil-portal-lane.png"), badge: "LIVE", href: "/messenger" },
      { label: "Marketplace", sub: "Athlete gear & deals", icon: require("../../assets/brand/marketplace-lane.png"), badge: "SHOP", href: "/marketplace" },
    ],
  },
  {
    category: "Sports Platforms",
    lanes: [
      { label: "Diamond Grind", sub: "Baseball · Softball · Road to Omaha", icon: require("../../assets/brand/diamond-grind-lane.png"), badge: "NEW", href: "/diamond-grind" },
      { label: "Gridiron Nexus", sub: "Football · Recruiting · Analytics", icon: require("../../assets/brand/gridiron-nexus-icon.png"), badge: "FOOTBALL", href: "/gridiron-nexus" },
      { label: "Court Kings", sub: "Basketball · AAU · NIL", icon: require("../../assets/brand/court-kings-icon.png"), badge: "HOOPS", href: "/court-kings" },
      { label: "Pitch Pulse", sub: "Soccer · Recruiting · Stats", icon: require("../../assets/brand/pitch-pulse-lane.png"), badge: "SOCCER", href: "/pitch-pulse" },
      { label: "Warriors Playbook", sub: "Coaching · Film · Strategy", icon: require("../../assets/brand/warriors-playbook-lane.png"), badge: "HOT", href: "/warriors-playbook" },
      { label: "Reel Masters", sub: "Fishing · Tournaments · Gear", icon: require("../../assets/brand/reel-masters-lane.png"), badge: "FISHING", href: "/reel-masters" },
    ],
  },
  {
    category: "AI Engines",
    lanes: [
      { label: "Intelligence OS", sub: "AI Analytics · Scouting · Framework", icon: require("../../assets/brand/fuelbots-lane.png"), badge: "AI", href: "/intelligence" },
      { label: "AI Recruiter", sub: "Find coaches · Get recruited", icon: require("../../assets/brand/ai-recruiter-lane.png"), badge: "AI", href: "/ai-recruiter" },
      { label: "FUEL Bots", sub: "Training · Nutrition · Recovery", icon: require("../../assets/brand/fuelbots-icon.png"), badge: "AI", href: "/fuel-bots" },
      { label: "AI Content", sub: "Brand · Social · Video", icon: require("../../assets/brand/ai-recruiter.png"), badge: "BLEND", href: "/ai-content" },
    ],
  },
  {
    category: "Portal & Transfer",
    lanes: [
      { label: "Transfer Portal", sub: "Find your next school", icon: require("../../assets/brand/transfer-portal-lane.png"), badge: "LIVE", href: "/transfer-portal" },
      { label: "My Dashboard", sub: "Profile · Stats · Activity", icon: require("../../assets/brand/mobile-app-icon.png"), badge: "PERSONAL", href: "/athlete-dashboard" },
    ],
  },
  {
    category: "Creator & Media",
    lanes: [
      { label: "YouTube", sub: "AthlynX Channel · Highlights · Podcast", icon: require("../../assets/brand/athletes-playbook-banner.png"), badge: "LIVE", href: "https://youtube.com/@athlynxai" },
      { label: "Spotify", sub: "The Athlete's Playbook Podcast", icon: require("../../assets/brand/podcast-banner.png"), badge: "LIVE", href: "https://open.spotify.com" },
      { label: "Vimeo", sub: "Pro Highlight Reels · Film Room", icon: require("../../assets/brand/mobile-app-icon.png"), badge: "PRO", href: "https://vimeo.com" },
      { label: "Suno AI", sub: "Athlete Pump-Up Music · AI Generated", icon: require("../../assets/brand/fuelbots-icon.png"), badge: "AI", href: "https://suno.com" },
      { label: "Shopify Store", sub: "AthlynX Gear · ICC-USA Merchandise", icon: require("../../assets/brand/marketplace-lane.png"), badge: "SHOP", href: "/commerce" },
      { label: "Meta Creators", sub: "NIL Brand Deals · Creator Marketplace", icon: require("../../assets/brand/nil-portal-lane.png"), badge: "NIL", href: "/nil-portal" },
    ],
  },
];

const CATEGORIES = ["All", "NIL & Money", "Sports Platforms", "AI Engines", "Portal & Transfer", "Creator & Media"];

export default function EnginesTab() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? ALL_ENGINES
    : ALL_ENGINES.filter(g => g.category === activeCategory);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/brand/engine-mark-white.png")}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.headerTitle}>ENGINE LANES</Text>
          <Text style={styles.headerSub}>Where do you want to go?</Text>
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterRowContent}
      >
        {CATEGORIES.map((cat, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.filterBtn, activeCategory === cat && styles.filterBtnActive]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text style={[styles.filterBtnText, activeCategory === cat && styles.filterBtnTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {filtered.map((group, gi) => (
          <View key={gi} style={styles.group}>
            <Text style={styles.groupTitle}>{group.category}</Text>
            <View style={styles.lanesGrid}>
              {group.lanes.map((lane, li) => {
                const badgeStyle = BADGE_COLORS[lane.badge] || BADGE_COLORS.NEW;
                return (
                  <TouchableOpacity
                    key={li}
                    style={styles.laneCard}
                    onPress={() => Linking.openURL(lane.href.startsWith('http') ? lane.href : "https://athlynx.ai" + lane.href)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.laneCardTop}>
                      <Image source={lane.icon} style={styles.laneIcon} resizeMode="contain" />
                      <View style={[styles.badge, { backgroundColor: badgeStyle.bg }]}>
                        <Text style={[styles.badgeText, { color: badgeStyle.text }]}>{lane.badge}</Text>
                      </View>
                    </View>
                    <Text style={styles.laneLabel}>{lane.label}</Text>
                    <Text style={styles.laneSub}>{lane.sub}</Text>
                    <Text style={styles.laneOpen}>OPEN →</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* Enter the Portal CTA */}
        <TouchableOpacity
          style={styles.portalCTA}
          onPress={() => Linking.openURL("https://athlynx.ai/signup")}
          activeOpacity={0.9}
        >
          <View style={styles.portalCTAInner}>
            <View style={styles.portalDot} />
            <Text style={styles.portalCTAText}>ENTER THE PORTAL →</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
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
    paddingVertical: 12,
    backgroundColor: "#000000",
    borderBottomWidth: 1,
    borderBottomColor: "#0d1b3e",
  },
  headerLogo: { width: 32, height: 32 },
  headerTitle: { fontSize: 13, fontWeight: "900", color: "#ffffff", letterSpacing: 2 },
  headerSub: { fontSize: 11, color: "#4a5a7a", fontWeight: "600" },
  filterRow: { borderBottomWidth: 1, borderBottomColor: "#0d1b3e" },
  filterRowContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#080d1a",
    borderWidth: 1,
    borderColor: "#1a2540",
  },
  filterBtnActive: { backgroundColor: "#0a2a4a", borderColor: "#00b4ff" },
  filterBtnText: { fontSize: 12, fontWeight: "700", color: "#6a7a9a" },
  filterBtnTextActive: { color: "#00b4ff" },
  scroll: { flex: 1 },
  group: { paddingHorizontal: 16, paddingTop: 24 },
  groupTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#00b4ff",
    letterSpacing: 2,
    marginBottom: 14,
    textTransform: "uppercase",
  },
  lanesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  laneCard: {
    width: (SCREEN_WIDTH - 44) / 2,
    backgroundColor: "#080d1a",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1a2540",
  },
  laneCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  laneIcon: { width: 44, height: 44, borderRadius: 10 },
  badge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },
  laneLabel: { fontSize: 14, fontWeight: "900", color: "#ffffff", marginBottom: 4 },
  laneSub: { fontSize: 11, color: "#6a7a9a", lineHeight: 16, marginBottom: 10 },
  laneOpen: { fontSize: 11, fontWeight: "800", color: "#00b4ff", letterSpacing: 0.5 },
  portalCTA: {
    marginHorizontal: 16,
    marginTop: 28,
    borderRadius: 30,
    backgroundColor: "#0066cc",
    overflow: "hidden",
  },
  portalCTAInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 10,
  },
  portalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    opacity: 0.8,
  },
  portalCTAText: { color: "#ffffff", fontWeight: "900", fontSize: 15, letterSpacing: 2 },
});
