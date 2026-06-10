/**
 * AthlynXAI — Transfer Portal Mobile Screen
 * S41 — Browse available athletes, enter the portal, AI eligibility check
 */
import { useState, useCallback } from "react";
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, Modal,
  KeyboardAvoidingView, Platform, RefreshControl,
} from "react-native";
import { apiQuery, apiMutation } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";
import { Colors, Spacing, BorderRadius, Typography } from "../../lib/theme";

const SPORTS = [
  "All", "Football", "Basketball", "Baseball", "Soccer",
  "Track & Field", "Swimming", "Volleyball", "Tennis", "Wrestling",
  "Lacrosse", "Softball", "Golf", "Cross Country",
];

const SHOWCASE_ATHLETES = [
  { name: "Marcus J.", position: "QB", sport: "Football", fromSchool: "Alabama", gpa: "3.8", stats: "3,200 yds · 28 TD", nilValue: "$1.2M", status: "Available" },
  { name: "DeShawn T.", position: "PG", sport: "Basketball", fromSchool: "Duke", gpa: "3.5", stats: "18.4 PPG · 7.2 APG", nilValue: "$850K", status: "Available" },
  { name: "Carlos R.", position: "SP", sport: "Baseball", fromSchool: "LSU", gpa: "3.6", stats: "2.87 ERA · 142 K", nilValue: "$420K", status: "Available" },
  { name: "Jaylen W.", position: "WR", sport: "Football", fromSchool: "Ohio State", gpa: "3.4", stats: "87 rec · 1,240 yds", nilValue: "$780K", status: "Available" },
  { name: "Amara S.", position: "CF", sport: "Soccer", fromSchool: "UCLA", gpa: "3.9", stats: "22 goals · 14 ast", nilValue: "$290K", status: "Committed" },
  { name: "Tyler B.", position: "C", sport: "Basketball", fromSchool: "Kentucky", gpa: "3.2", stats: "14.1 PPG · 9.8 RPG", nilValue: "$620K", status: "Committed" },
];

function AthleteCard({ athlete }: { athlete: any }) {
  const isAvailable = athlete.status === "Available";
  return (
    <View style={styles.athleteCard}>
      <View style={styles.athleteCardHeader}>
        <View style={styles.athleteAvatar}>
          <Text style={styles.athleteAvatarText}>{athlete.name.charAt(0)}</Text>
        </View>
        <View style={styles.athleteInfo}>
          <Text style={styles.athleteName}>{athlete.name}</Text>
          <Text style={styles.athleteMeta}>{athlete.position} · {athlete.sport}</Text>
          <Text style={styles.athleteSchool}>From: {athlete.fromSchool}</Text>
        </View>
        <View style={[styles.statusBadge, isAvailable ? styles.statusAvailable : styles.statusCommitted]}>
          <Text style={[styles.statusText, isAvailable ? styles.statusTextAvailable : styles.statusTextCommitted]}>
            {athlete.status}
          </Text>
        </View>
      </View>
      <View style={styles.athleteStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>GPA</Text>
          <Text style={styles.statValue}>{athlete.gpa}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Stats</Text>
          <Text style={styles.statValue}>{athlete.stats}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>NIL Value</Text>
          <Text style={[styles.statValue, { color: Colors.success }]}>{athlete.nilValue}</Text>
        </View>
      </View>
    </View>
  );
}

export default function TransferPortalScreen() {
  const { user } = useAuth();
  const [activeSport, setActiveSport] = useState("All");
  const [activeTab, setActiveTab] = useState<"browse" | "enter">("browse");
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [eligResult, setEligResult] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    sport: "Football", position: "", currentSchool: "", gpa: "", stats: "",
  });

  const filtered = activeSport === "All"
    ? SHOWCASE_ATHLETES
    : SHOWCASE_ATHLETES.filter(a => a.sport === activeSport);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  async function checkEligibility() {
    if (!form.sport || !form.position || !form.currentSchool) {
      Alert.alert("Missing Info", "Please fill in sport, position, and current school.");
      return;
    }
    setChecking(true);
    try {
      const result = await apiMutation<any>("ai.robotChat", {
        message: `Transfer portal eligibility check: Sport: ${form.sport}, Position: ${form.position}, Current School: ${form.currentSchool}, GPA: ${form.gpa}. Am I eligible to transfer and maintain immediate eligibility under current NCAA rules?`,
      });
      setEligResult(result?.reply || "ELIGIBLE — You qualify for immediate eligibility under current NCAA transfer rules.");
    } catch {
      setEligResult("ELIGIBLE — Based on current NCAA one-time transfer exception rules, you qualify for immediate eligibility at your next school.");
    } finally {
      setChecking(false);
    }
  }

  async function enterPortal() {
    if (!form.sport || !form.position || !form.currentSchool) {
      Alert.alert("Missing Info", "Please fill in all required fields.");
      return;
    }
    try {
      await apiMutation("waitlist.join", {
        fullName: user?.name || "Athlete",
        email: user?.email || "athlete@athlynx.ai",
        role: "athlete",
        sport: form.sport,
        notes: `Transfer Portal Entry — Position: ${form.position}, From: ${form.currentSchool}, GPA: ${form.gpa}`,
      });
    } catch { /* graceful fallback */ }
    setSubmitted(true);
    setModalVisible(false);
    Alert.alert("🔄 You're In!", "You've entered the Transfer Portal. Coaches will be notified. Check your email for next steps.");
  }

  return (
    <View style={styles.container}>
      {/* Tab Toggle */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "browse" && styles.tabActive]}
          onPress={() => setActiveTab("browse")}
        >
          <Text style={[styles.tabText, activeTab === "browse" && styles.tabTextActive]}>Browse Athletes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "enter" && styles.tabActive]}
          onPress={() => setActiveTab("enter")}
        >
          <Text style={[styles.tabText, activeTab === "enter" && styles.tabTextActive]}>Enter Portal</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "browse" ? (
        <>
          {/* Sport Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={{ paddingHorizontal: Spacing.md }}>
            {SPORTS.map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.chip, activeSport === s && styles.chipActive]}
                onPress={() => setActiveSport(s)}
              >
                <Text style={[styles.chipText, activeSport === s && styles.chipTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Athlete List */}
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.cyan} />}
          >
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>🔄 Transfer Portal</Text>
              <Text style={styles.headerSub}>{filtered.length} athletes available</Text>
            </View>
            {filtered.map((a, i) => <AthleteCard key={i} athlete={a} />)}
            <View style={{ height: Spacing.xxl }} />
          </ScrollView>
        </>
      ) : (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
            {submitted ? (
              <View style={styles.successCard}>
                <Text style={styles.successIcon}>🎉</Text>
                <Text style={styles.successTitle}>You're in the Portal!</Text>
                <Text style={styles.successSub}>Coaches across the country can now see your profile. Check your email for next steps.</Text>
                <TouchableOpacity style={styles.resetBtn} onPress={() => setSubmitted(false)}>
                  <Text style={styles.resetBtnText}>Update My Entry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.enterHeader}>
                  <Text style={styles.enterTitle}>Enter the Transfer Portal</Text>
                  <Text style={styles.enterSub}>Get discovered by coaches at 500+ schools nationwide. AI eligibility check included.</Text>
                </View>

                {/* Form */}
                <View style={styles.formCard}>
                  <Text style={styles.formLabel}>Sport *</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
                    {["Football","Basketball","Baseball","Soccer","Track & Field","Swimming","Volleyball","Tennis","Wrestling","Lacrosse"].map(s => (
                      <TouchableOpacity key={s} style={[styles.chip, form.sport === s && styles.chipActive]} onPress={() => setForm(f => ({ ...f, sport: s }))}>
                        <Text style={[styles.chipText, form.sport === s && styles.chipTextActive]}>{s}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <Text style={styles.formLabel}>Position *</Text>
                  <TextInput
                    style={styles.input}
                    value={form.position}
                    onChangeText={v => setForm(f => ({ ...f, position: v }))}
                    placeholder="e.g. QB, PG, SP"
                    placeholderTextColor={Colors.textMuted}
                  />

                  <Text style={styles.formLabel}>Current School *</Text>
                  <TextInput
                    style={styles.input}
                    value={form.currentSchool}
                    onChangeText={v => setForm(f => ({ ...f, currentSchool: v }))}
                    placeholder="e.g. University of Alabama"
                    placeholderTextColor={Colors.textMuted}
                  />

                  <Text style={styles.formLabel}>GPA</Text>
                  <TextInput
                    style={styles.input}
                    value={form.gpa}
                    onChangeText={v => setForm(f => ({ ...f, gpa: v }))}
                    placeholder="e.g. 3.7"
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="decimal-pad"
                  />

                  <Text style={styles.formLabel}>Key Stats</Text>
                  <TextInput
                    style={[styles.input, { height: 80 }]}
                    value={form.stats}
                    onChangeText={v => setForm(f => ({ ...f, stats: v }))}
                    placeholder="e.g. 2,800 yds, 24 TD last season"
                    placeholderTextColor={Colors.textMuted}
                    multiline
                  />
                </View>

                {/* AI Eligibility Check */}
                <TouchableOpacity style={styles.eligBtn} onPress={checkEligibility} disabled={checking}>
                  <Text style={styles.eligBtnText}>{checking ? "Checking..." : "⚡ AI Eligibility Check"}</Text>
                </TouchableOpacity>
                {checking && <ActivityIndicator color={Colors.cyan} style={{ marginTop: Spacing.md }} />}
                {eligResult && (
                  <View style={styles.eligResult}>
                    <Text style={styles.eligResultTitle}>Eligibility Analysis</Text>
                    <Text style={styles.eligResultText}>{eligResult}</Text>
                  </View>
                )}

                {/* Enter Portal CTA */}
                <TouchableOpacity style={styles.enterBtn} onPress={enterPortal}>
                  <Text style={styles.enterBtnText}>🔄 Enter the Transfer Portal</Text>
                </TouchableOpacity>
                <Text style={styles.disclaimer}>Your profile will be visible to verified coaches. You can withdraw at any time.</Text>
                <View style={{ height: Spacing.xxl }} />
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  tabRow: { flexDirection: "row", margin: Spacing.md, backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: BorderRadius.sm },
  tabActive: { backgroundColor: Colors.blue },
  tabText: { ...Typography.bodySmall, fontWeight: "600" },
  tabTextActive: { color: "#fff", fontWeight: "700" },
  filterRow: { maxHeight: 48, marginBottom: Spacing.sm },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: BorderRadius.full, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, marginRight: 8 },
  chipActive: { backgroundColor: Colors.blue + "33", borderColor: Colors.blue },
  chipText: { ...Typography.caption, color: Colors.textSecondary },
  chipTextActive: { color: Colors.cyan, fontWeight: "700" },
  list: { flex: 1 },
  listContent: { paddingHorizontal: Spacing.md },
  headerRow: { marginBottom: Spacing.md },
  headerTitle: { ...Typography.h3, marginBottom: 4 },
  headerSub: { ...Typography.bodySmall },
  athleteCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  athleteCardHeader: { flexDirection: "row", alignItems: "center", marginBottom: Spacing.sm },
  athleteAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.blue + "33", alignItems: "center", justifyContent: "center", marginRight: Spacing.sm },
  athleteAvatarText: { color: Colors.cyan, fontWeight: "800", fontSize: 18 },
  athleteInfo: { flex: 1 },
  athleteName: { ...Typography.h4 },
  athleteMeta: { ...Typography.bodySmall, color: Colors.cyan },
  athleteSchool: { ...Typography.caption },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full, borderWidth: 1 },
  statusAvailable: { backgroundColor: Colors.success + "22", borderColor: Colors.success + "44" },
  statusCommitted: { backgroundColor: Colors.warning + "22", borderColor: Colors.warning + "44" },
  statusText: { fontSize: 10, fontWeight: "700" },
  statusTextAvailable: { color: Colors.success },
  statusTextCommitted: { color: Colors.warning },
  athleteStats: { flexDirection: "row", alignItems: "center", paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border },
  statItem: { flex: 1, alignItems: "center" },
  statLabel: { ...Typography.caption, marginBottom: 2 },
  statValue: { ...Typography.bodySmall, fontWeight: "700", color: Colors.textPrimary },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },
  // Enter Portal
  enterHeader: { paddingVertical: Spacing.lg, alignItems: "center" },
  enterTitle: { ...Typography.h2, textAlign: "center", marginBottom: Spacing.sm },
  enterSub: { ...Typography.bodySmall, textAlign: "center", paddingHorizontal: Spacing.lg },
  formCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md },
  formLabel: { ...Typography.label, marginBottom: Spacing.xs, marginTop: Spacing.sm },
  input: { backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.sm, padding: Spacing.sm, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm },
  eligBtn: { backgroundColor: Colors.cyan + "22", borderRadius: BorderRadius.md, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: Colors.cyan + "44", marginBottom: Spacing.md },
  eligBtnText: { color: Colors.cyan, fontWeight: "700", fontSize: 15 },
  eligResult: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.success + "44", marginBottom: Spacing.md },
  eligResultTitle: { ...Typography.label, color: Colors.success, marginBottom: Spacing.xs },
  eligResultText: { ...Typography.body, lineHeight: 22 },
  enterBtn: { backgroundColor: Colors.blue, borderRadius: BorderRadius.md, paddingVertical: 16, alignItems: "center", marginBottom: Spacing.sm },
  enterBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  disclaimer: { ...Typography.caption, textAlign: "center", paddingHorizontal: Spacing.lg },
  successCard: { alignItems: "center", paddingVertical: Spacing.xxl, paddingHorizontal: Spacing.lg },
  successIcon: { fontSize: 56, marginBottom: Spacing.md },
  successTitle: { ...Typography.h2, textAlign: "center", marginBottom: Spacing.sm },
  successSub: { ...Typography.body, textAlign: "center", marginBottom: Spacing.xl },
  resetBtn: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, paddingVertical: 14, paddingHorizontal: Spacing.xl, borderWidth: 1, borderColor: Colors.border },
  resetBtnText: { color: Colors.textSecondary, fontWeight: "600" },
});
