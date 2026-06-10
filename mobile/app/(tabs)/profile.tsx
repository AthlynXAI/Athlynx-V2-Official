import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const PROFILE_LINKS = [
  { label: "My Athlete Profile", sub: "View & edit your public profile", href: "/profile", icon: require("../../assets/brand/mobile-app-icon.png") },
  { label: "NIL Dashboard", sub: "Deals, contracts & earnings", href: "/nil-portal", icon: require("../../assets/brand/nil-portal-lane.png") },
  { label: "Recruiting Profile", sub: "Coach views, messages & offers", href: "/transfer-portal", icon: require("../../assets/brand/transfer-portal-lane.png") },
  { label: "FUEL Bot Settings", sub: "Training, nutrition & recovery AI", href: "/fuel-bots", icon: require("../../assets/brand/fuelbots-lane.png") },
  { label: "Social Hub", sub: "Connect Instagram, TikTok & more", href: "/feed", icon: require("../../assets/brand/ai-recruiter.png") },
  { label: "Settings & Privacy", sub: "Account, notifications & security", href: "/settings", icon: require("../../assets/brand/marketplace-lane.png") },
];

const PLATFORM_LINKS = [
  { label: "About AthlynXAI", href: "/about" },
  { label: "Pricing & Plans", href: "/pricing" },
  { label: "Partner Portal", href: "/partner-portal" },
  { label: "Legal & Privacy", href: "/legal" },
  { label: "Contact Support", href: "/contact" },
  { label: "The Playbook (Podcast)", href: "/podcast" },
];

export default function ProfileTab() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile Hero */}
        <LinearGradient colors={["#0a1628", "#000000"]} style={styles.profileHero}>
          <View style={styles.avatarWrap}>
            <Image
              source={require("../../assets/brand/engine-mark-white.png")}
              style={styles.avatar}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.profileName}>Athlete Profile</Text>
          <Text style={styles.profileHandle}>@athlynxai</Text>
          <View style={styles.profileBadges}>
            <View style={styles.profileBadge}>
              <Text style={styles.profileBadgeText}>Verified Athlete</Text>
            </View>
            <View style={[styles.profileBadge, styles.profileBadgePro]}>
              <Text style={[styles.profileBadgeText, { color: "#cc66ff" }]}>Pro Plan</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => Linking.openURL("https://athlynx.ai/profile")}
          >
            <Text style={styles.editProfileText}>Edit Profile on AthlynX</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { num: "1,247", label: "Profile Views" },
            { num: "48.2K", label: "Social Reach" },
            { num: "94", label: "Recruit Score" },
          ].map((stat, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statNum}>{stat.num}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Profile Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Account</Text>
          {PROFILE_LINKS.map((link, i) => (
            <TouchableOpacity
              key={i}
              style={styles.linkRow}
              onPress={() => Linking.openURL("https://athlynx.ai" + link.href)}
              activeOpacity={0.7}
            >
              <Image source={link.icon} style={styles.linkIcon} resizeMode="contain" />
              <View style={styles.linkText}>
                <Text style={styles.linkLabel}>{link.label}</Text>
                <Text style={styles.linkSub}>{link.sub}</Text>
              </View>
              <Text style={styles.linkArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Platform Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AthlynX Platform</Text>
          <View style={styles.platformGrid}>
            {PLATFORM_LINKS.map((link, i) => (
              <TouchableOpacity
                key={i}
                style={styles.platformLink}
                onPress={() => Linking.openURL("https://athlynx.ai" + link.href)}
              >
                <Text style={styles.platformLinkText}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Brand Footer */}
        <View style={styles.brandFooter}>
          <Image
            source={require("../../assets/brand/engine-mark-white.png")}
            style={styles.footerLogo}
            resizeMode="contain"
          />
          <Text style={styles.footerWordmark}>
            Athlynx<Text style={{ color: "#00b4ff" }}>XAI</Text>
          </Text>
          <Text style={styles.footerTagline}>YOUTH TO PRO TO RETIREMENT. EVERY SPORT. EVERY LEVEL.</Text>
          <Text style={styles.footerSub}>Built in Mississippi. For every athlete.</Text>
          <Text style={styles.footerVersion}>v1.0.2 · AthlynXAI OS</Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  scroll: { flex: 1 },
  profileHero: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 28,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#0d1b3e",
  },
  avatarWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0a1628",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#00b4ff",
    marginBottom: 14,
  },
  avatar: { width: 48, height: 48 },
  profileName: { fontSize: 22, fontWeight: "900", color: "#ffffff", marginBottom: 4 },
  profileHandle: { fontSize: 13, color: "#4a5a7a", marginBottom: 12 },
  profileBadges: { flexDirection: "row", gap: 8, marginBottom: 16 },
  profileBadge: {
    backgroundColor: "#0a2a1a",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#00ff88",
  },
  profileBadgePro: { backgroundColor: "#1a0a2a", borderColor: "#cc66ff" },
  profileBadgeText: { fontSize: 11, fontWeight: "700", color: "#00ff88" },
  editProfileBtn: {
    backgroundColor: "#0066cc",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  editProfileText: { fontSize: 13, fontWeight: "800", color: "#ffffff" },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    backgroundColor: "#050a14",
    borderBottomWidth: 1,
    borderBottomColor: "#0d1b3e",
  },
  statItem: { alignItems: "center" },
  statNum: { fontSize: 20, fontWeight: "900", color: "#00b4ff", marginBottom: 2 },
  statLabel: { fontSize: 11, color: "#6a7a9a", fontWeight: "600" },
  section: { paddingHorizontal: 16, paddingTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: "#ffffff", marginBottom: 14 },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#0d1b3e",
    gap: 12,
  },
  linkIcon: { width: 36, height: 36, borderRadius: 8 },
  linkText: { flex: 1 },
  linkLabel: { fontSize: 14, fontWeight: "700", color: "#ffffff", marginBottom: 2 },
  linkSub: { fontSize: 12, color: "#6a7a9a" },
  linkArrow: { fontSize: 22, color: "#2a3a5a", fontWeight: "300" },
  platformGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  platformLink: {
    backgroundColor: "#080d1a",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#1a2540",
  },
  platformLinkText: { fontSize: 12, fontWeight: "700", color: "#8a9ab8" },
  brandFooter: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#0d1b3e",
  },
  footerLogo: { width: 40, height: 40, opacity: 0.6, marginBottom: 10 },
  footerWordmark: { fontSize: 20, fontWeight: "900", color: "#ffffff", marginBottom: 8 },
  footerTagline: {
    fontSize: 10,
    fontWeight: "700",
    color: "#4a5a7a",
    letterSpacing: 1.5,
    textAlign: "center",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  footerSub: { fontSize: 12, color: "#4a5a7a", marginBottom: 8 },
  footerVersion: { fontSize: 11, color: "#2a3a5a", fontWeight: "600" },
});
