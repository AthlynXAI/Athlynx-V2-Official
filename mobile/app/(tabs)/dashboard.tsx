import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const STATS = [
  { icon: require("../../assets/brand/analytics-logo.png"), value: "1,247", label: "Profile Views", delta: "+18%", deltaColor: "#00ff88" },
  { icon: require("../../assets/brand/nil-portal-lane.png"), value: "$32,500", label: "NIL Earnings", delta: "+$5K", deltaColor: "#00ff88" },
  { icon: require("../../assets/brand/fuelbots-lane.png"), value: "94/100", label: "Recruiting Score", delta: "+3pts", deltaColor: "#00ff88" },
  { icon: require("../../assets/brand/mobile-app-icon.png"), value: "48.2K", label: "Social Reach", delta: "+2.1K", deltaColor: "#00ff88" },
];

const FUEL_INSIGHTS = [
  {
    tag: "FUEL Bot Insight",
    title: "Speed Training Alert",
    body: "Your 40-time can improve 0.05s with targeted drills",
    cta: "View Plan",
    href: "/training",
    color: "#1a0a2a",
    border: "#4a1a7a",
  },
  {
    tag: "FUEL Bot Insight",
    title: "Recruiting Window Open",
    body: "3 D1 coaches viewed your profile this week. Follow up now.",
    cta: "View Coaches",
    href: "/transfer-portal",
    color: "#0a1a2a",
    border: "#1a4a7a",
  },
  {
    tag: "FUEL Bot Insight",
    title: "NIL Opportunity",
    body: "New local brand deal available — $1,200 for 2 social posts",
    cta: "View Deal",
    href: "/nil-portal",
    color: "#0a2a1a",
    border: "#1a5a2a",
  },
];

const UPCOMING = [
  { event: "Nike EYBL Peach Jam", date: "Jul 8 · Tournament", status: "Registered", statusColor: "#00b4ff" },
  { event: "Coach Williams Call", date: "Apr 18 · Recruiting", status: "Scheduled", statusColor: "#00ff88" },
  { event: "Brand Deal Deadline", date: "Apr 20 · NIL", status: "Action Needed", statusColor: "#ff6b35" },
  { event: "Film Review Session", date: "Apr 22 · Training", status: "Upcoming", statusColor: "#6a7a9a" },
];

const QUICK_ACTIONS = [
  { label: "Update Profile", icon: require("../../assets/brand/mobile-app-icon.png"), href: "/profile" },
  { label: "Browse NIL Deals", icon: require("../../assets/brand/nil-portal-lane.png"), href: "/nil-portal" },
  { label: "Find Tournaments", icon: require("../../assets/brand/diamond-grind-lane.png"), href: "/diamond-grind" },
  { label: "AI Recruiter", icon: require("../../assets/brand/ai-recruiter-lane.png"), href: "/ai-recruiter" },
  { label: "Film Review", icon: require("../../assets/brand/warriors-playbook-lane.png"), href: "/warriors-playbook" },
  { label: "Social Hub", icon: require("../../assets/brand/fuelbots-lane.png"), href: "/feed" },
];

const TABS = ["Overview", "NIL Activity", "Recruiting", "Training"];

export default function DashboardTab() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require("../../assets/brand/engine-mark-white.png")}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.headerTitle}>ATHLETE DASHBOARD</Text>
            <Text style={styles.headerSub}>Powered by AthlynX</Text>
          </View>
        </View>
        <View style={styles.verifiedBadge}>
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Welcome Banner */}
        <LinearGradient colors={["#0a1628", "#050a14"]} style={styles.welcomeBanner}>
          <View style={styles.welcomeLeft}>
            <Text style={styles.welcomeTitle}>Welcome back, Athlete</Text>
            <Text style={styles.welcomeSub}>Your platform is working for you 24/7. Here's your update.</Text>
          </View>
          <View style={styles.welcomeStats}>
            <View style={styles.welcomeStat}>
              <Text style={styles.welcomeStatNum}>2</Text>
              <Text style={styles.welcomeStatLabel}>Active Deals</Text>
            </View>
            <View style={[styles.welcomeStat, styles.welcomeStatGreen]}>
              <Text style={[styles.welcomeStatNum, { color: "#00ff88" }]}>$32K</Text>
              <Text style={styles.welcomeStatLabel}>NIL Earned</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STATS.map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <View style={styles.statCardTop}>
                <Image source={stat.icon} style={styles.statIcon} resizeMode="contain" />
                <Text style={[styles.statDelta, { color: stat.deltaColor }]}>{stat.delta}</Text>
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Tab Switcher */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabRow} contentContainerStyle={styles.tabRowContent}>
          {TABS.map((tab, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.tabBtn, activeTab === i && styles.tabBtnActive]}
              onPress={() => setActiveTab(i)}
            >
              <Text style={[styles.tabBtnText, activeTab === i && styles.tabBtnTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* FUEL Bot Insights */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Image source={require("../../assets/brand/fuelbots-lane.png")} style={styles.sectionIcon} resizeMode="contain" />
            <Text style={styles.sectionTitle}>FUEL Bot Insights</Text>
          </View>
          {FUEL_INSIGHTS.map((insight, i) => (
            <View key={i} style={[styles.insightCard, { backgroundColor: insight.color, borderColor: insight.border }]}>
              <Text style={styles.insightTag}>{insight.tag}</Text>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightBody}>{insight.body}</Text>
              <TouchableOpacity
                style={styles.insightCTA}
                onPress={() => Linking.openURL("https://athlynx.ai" + insight.href)}
              >
                <Text style={styles.insightCTAText}>{insight.cta}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
          {UPCOMING.map((item, i) => (
            <View key={i} style={styles.upcomingRow}>
              <View style={styles.upcomingLeft}>
                <Text style={styles.upcomingEvent}>{item.event}</Text>
                <Text style={styles.upcomingDate}>{item.date}</Text>
              </View>
              <View style={[styles.upcomingStatus, { borderColor: item.statusColor + "44" }]}>
                <Text style={[styles.upcomingStatusText, { color: item.statusColor }]}>{item.status}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickGrid}>
            {QUICK_ACTIONS.map((action, i) => (
              <TouchableOpacity
                key={i}
                style={styles.quickCard}
                onPress={() => Linking.openURL("https://athlynx.ai" + action.href)}
                activeOpacity={0.8}
              >
                <Image source={action.icon} style={styles.quickIcon} resizeMode="contain" />
                <Text style={styles.quickLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#000000",
    borderBottomWidth: 1,
    borderBottomColor: "#0d1b3e",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerLogo: { width: 32, height: 32 },
  headerTitle: { fontSize: 13, fontWeight: "900", color: "#ffffff", letterSpacing: 1.5 },
  headerSub: { fontSize: 10, color: "#4a5a7a", fontWeight: "600" },
  verifiedBadge: {
    backgroundColor: "#0a2a1a",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#00ff88",
  },
  verifiedText: { fontSize: 11, fontWeight: "700", color: "#00ff88" },
  scroll: { flex: 1 },
  welcomeBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1a2540",
  },
  welcomeLeft: { flex: 1, marginRight: 12 },
  welcomeTitle: { fontSize: 20, fontWeight: "900", color: "#ffffff", marginBottom: 4 },
  welcomeSub: { fontSize: 12, color: "#6a7a9a", lineHeight: 18 },
  welcomeStats: { flexDirection: "row", gap: 8 },
  welcomeStat: {
    backgroundColor: "#0a1a3a",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    minWidth: 60,
    borderWidth: 1,
    borderColor: "#1a3a6a",
  },
  welcomeStatGreen: { backgroundColor: "#0a2a1a", borderColor: "#1a5a2a" },
  welcomeStatNum: { fontSize: 18, fontWeight: "900", color: "#00b4ff" },
  welcomeStatLabel: { fontSize: 9, color: "#6a7a9a", textAlign: "center", fontWeight: "600" },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 10,
  },
  statCard: {
    width: (SCREEN_WIDTH - 42) / 2,
    backgroundColor: "#080d1a",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1a2540",
  },
  statCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  statIcon: { width: 28, height: 28, borderRadius: 6 },
  statDelta: { fontSize: 11, fontWeight: "700" },
  statValue: { fontSize: 20, fontWeight: "900", color: "#ffffff", marginBottom: 2 },
  statLabel: { fontSize: 11, color: "#6a7a9a", fontWeight: "600" },
  tabRow: { marginTop: 16 },
  tabRowContent: { paddingHorizontal: 16, gap: 8 },
  tabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#080d1a",
    borderWidth: 1,
    borderColor: "#1a2540",
  },
  tabBtnActive: { backgroundColor: "#0a2a4a", borderColor: "#00b4ff" },
  tabBtnText: { fontSize: 12, fontWeight: "700", color: "#6a7a9a" },
  tabBtnTextActive: { color: "#00b4ff" },
  section: { paddingHorizontal: 16, paddingTop: 24 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  sectionIcon: { width: 24, height: 24, borderRadius: 6 },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: "#ffffff", marginBottom: 14 },
  insightCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  insightTag: { fontSize: 10, fontWeight: "700", color: "#6a7a9a", letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" },
  insightTitle: { fontSize: 16, fontWeight: "900", color: "#ffffff", marginBottom: 6 },
  insightBody: { fontSize: 13, color: "#8a9ab8", lineHeight: 20, marginBottom: 12 },
  insightCTA: {
    alignSelf: "flex-start",
    backgroundColor: "#0066cc",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  insightCTAText: { fontSize: 12, fontWeight: "800", color: "#ffffff" },
  upcomingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#0d1b3e",
  },
  upcomingLeft: { flex: 1 },
  upcomingEvent: { fontSize: 14, fontWeight: "700", color: "#ffffff", marginBottom: 2 },
  upcomingDate: { fontSize: 12, color: "#6a7a9a" },
  upcomingStatus: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  upcomingStatusText: { fontSize: 11, fontWeight: "700" },
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  quickCard: {
    width: (SCREEN_WIDTH - 52) / 3,
    backgroundColor: "#080d1a",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1a2540",
  },
  quickIcon: { width: 36, height: 36, borderRadius: 8, marginBottom: 8 },
  quickLabel: { fontSize: 10, fontWeight: "700", color: "#c0cce0", textAlign: "center", lineHeight: 14 },
});
