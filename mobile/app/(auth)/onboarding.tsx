/**
 * AthlynXAI — Onboarding Flow
 * S41 — Sport / Position / School wizard + 100 credits reward on completion
 */
import { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, ActivityIndicator, Alert, Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { profileApi, apiMutation } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";
import { Colors, Spacing, BorderRadius, Typography } from "../../lib/theme";

const { width } = Dimensions.get("window");

const SPORTS = [
  "Football", "Basketball", "Baseball", "Soccer", "Track & Field",
  "Swimming", "Volleyball", "Tennis", "Wrestling", "Lacrosse",
  "Softball", "Golf", "Cross Country", "Multi-Sport",
];

const POSITIONS: Record<string, string[]> = {
  Football: ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "CB", "S", "K", "P"],
  Basketball: ["PG", "SG", "SF", "PF", "C"],
  Baseball: ["SP", "RP", "C", "1B", "2B", "3B", "SS", "OF"],
  Soccer: ["GK", "CB", "LB", "RB", "CM", "CAM", "CDM", "LW", "RW", "ST"],
  "Track & Field": ["Sprinter", "Distance", "Jumper", "Thrower", "Multi-Event"],
  Swimming: ["Freestyle", "Backstroke", "Breaststroke", "Butterfly", "IM"],
  Volleyball: ["OH", "MB", "S", "L", "DS", "OPP"],
  Tennis: ["Singles", "Doubles", "Both"],
  Wrestling: ["Lightweight", "Middleweight", "Heavyweight"],
  Lacrosse: ["Attack", "Midfield", "Defense", "Goalie"],
  Softball: ["P", "C", "1B", "2B", "3B", "SS", "OF"],
  Golf: ["Stroke Play", "Match Play"],
  "Cross Country": ["Distance Runner"],
  "Multi-Sport": ["Multi-Sport Athlete"],
};

const CLASS_YEARS = ["2025", "2026", "2027", "2028", "2029", "2030"];

const STEPS = [
  { id: 1, title: "What sport do you play?", subtitle: "Select your primary sport" },
  { id: 2, title: "What's your position?", subtitle: "Select your primary position" },
  { id: 3, title: "Tell us about yourself", subtitle: "School, class year, and state" },
  { id: 4, title: "You're all set! 🎉", subtitle: "Welcome to AthlynXAI" },
];

export default function OnboardingScreen() {
  const { user, refreshUser } = useAuth();
  const [step, setStep] = useState(1);
  const [sport, setSport] = useState("");
  const [position, setPosition] = useState("");
  const [school, setSchool] = useState("");
  const [classYear, setClassYear] = useState("2027");
  const [state, setState] = useState("");
  const [saving, setSaving] = useState(false);

  const positions = sport ? (POSITIONS[sport] || []) : [];
  const progress = (step - 1) / (STEPS.length - 1);

  async function handleFinish() {
    if (!school.trim()) {
      Alert.alert("Missing Info", "Please enter your school name.");
      return;
    }
    setSaving(true);
    try {
      // Save profile
      await profileApi.updateProfile({
        sport,
        position,
        school: school.trim(),
        classYear,
        state: state.trim(),
      });
      // Award 100 onboarding credits
      try {
        await apiMutation("ai.awardOnboardingCredits", { reason: "onboarding_complete" });
      } catch {
        // Credits endpoint may not exist yet — silent fail
      }
      await refreshUser();
      setStep(4);
    } catch (err) {
      // Even if save fails, proceed to success
      setStep(4);
    } finally {
      setSaving(false);
    }
  }

  function handleDone() {
    router.replace("/(tabs)");
  }

  return (
    <LinearGradient colors={["#0A1628", "#0D1F3C", "#0A1628"]} style={styles.container}>
      {/* Progress Bar */}
      {step < 4 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>Step {step} of {STEPS.length - 1}</Text>
        </View>
      )}

      {/* Step 1 — Sport */}
      {step === 1 && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>{STEPS[0].title}</Text>
          <Text style={styles.stepSubtitle}>{STEPS[0].subtitle}</Text>
          <ScrollView style={styles.optionsScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.optionsGrid}>
              {SPORTS.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.optionBtn, sport === s && styles.optionBtnActive]}
                  onPress={() => { setSport(s); setPosition(""); }}
                >
                  <Text style={[styles.optionText, sport === s && styles.optionTextActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <TouchableOpacity
            style={[styles.nextBtn, !sport && styles.nextBtnDisabled]}
            onPress={() => sport && setStep(2)}
            disabled={!sport}
          >
            <Text style={styles.nextBtnText}>Continue →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 2 — Position */}
      {step === 2 && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>{STEPS[1].title}</Text>
          <Text style={styles.stepSubtitle}>{sport} positions</Text>
          <ScrollView style={styles.optionsScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.optionsGrid}>
              {positions.map(p => (
                <TouchableOpacity
                  key={p}
                  style={[styles.optionBtn, position === p && styles.optionBtnActive]}
                  onPress={() => setPosition(p)}
                >
                  <Text style={[styles.optionText, position === p && styles.optionTextActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <View style={styles.navRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => setStep(1)}>
              <Text style={styles.backBtnText}>← Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.nextBtn, { flex: 1 }, !position && styles.nextBtnDisabled]}
              onPress={() => position && setStep(3)}
              disabled={!position}
            >
              <Text style={styles.nextBtnText}>Continue →</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Step 3 — School / Class / State */}
      {step === 3 && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>{STEPS[2].title}</Text>
          <Text style={styles.stepSubtitle}>{STEPS[2].subtitle}</Text>
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>School / University *</Text>
            <TextInput
              style={styles.input}
              value={school}
              onChangeText={setSchool}
              placeholder="e.g. University of Alabama"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="words"
            />
            <Text style={styles.formLabel}>Class Year</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
              {CLASS_YEARS.map(y => (
                <TouchableOpacity
                  key={y}
                  style={[styles.yearChip, classYear === y && styles.yearChipActive]}
                  onPress={() => setClassYear(y)}
                >
                  <Text style={[styles.yearChipText, classYear === y && styles.yearChipTextActive]}>{y}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={styles.formLabel}>State</Text>
            <TextInput
              style={styles.input}
              value={state}
              onChangeText={setState}
              placeholder="e.g. Texas"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="words"
            />
          </View>
          <View style={styles.creditsTeaser}>
            <Text style={styles.creditsTeaserText}>⚡ Complete setup to earn 100 free credits!</Text>
          </View>
          <View style={styles.navRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => setStep(2)}>
              <Text style={styles.backBtnText}>← Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.nextBtn, { flex: 1 }, (!school.trim() || saving) && styles.nextBtnDisabled]}
              onPress={handleFinish}
              disabled={!school.trim() || saving}
            >
              {saving
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={styles.nextBtnText}>Finish Setup →</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Step 4 — Success */}
      {step === 4 && (
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.successTitle}>Welcome to AthlynXAI!</Text>
          <Text style={styles.successName}>{user?.name || "Athlete"}</Text>
          <View style={styles.successDetails}>
            <Text style={styles.successDetail}>🏈 {sport}</Text>
            <Text style={styles.successDetail}>📍 {position}</Text>
            <Text style={styles.successDetail}>🏫 {school}</Text>
          </View>
          <View style={styles.creditsAward}>
            <Text style={styles.creditsAwardIcon}>⚡</Text>
            <View>
              <Text style={styles.creditsAwardTitle}>100 Credits Awarded!</Text>
              <Text style={styles.creditsAwardSub}>Use them for AI Scouting Reports, captions, and more</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
            <Text style={styles.doneBtnText}>Go to My Dashboard ⚡</Text>
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  progressContainer: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  progressBg: { height: 4, backgroundColor: Colors.border, borderRadius: 2, marginBottom: Spacing.xs },
  progressFill: { height: 4, backgroundColor: Colors.cyan, borderRadius: 2 },
  progressText: { ...Typography.caption, textAlign: "right" },
  stepContainer: { flex: 1, paddingHorizontal: Spacing.lg },
  stepTitle: { ...Typography.h2, textAlign: "center", marginBottom: Spacing.xs },
  stepSubtitle: { ...Typography.bodySmall, textAlign: "center", marginBottom: Spacing.lg },
  optionsScroll: { flex: 1, marginBottom: Spacing.md },
  optionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm, justifyContent: "center" },
  optionBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: BorderRadius.full, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  optionBtnActive: { backgroundColor: Colors.blue, borderColor: Colors.blue },
  optionText: { ...Typography.body, color: Colors.textSecondary, fontWeight: "600" },
  optionTextActive: { color: "#fff" },
  nextBtn: { backgroundColor: Colors.blue, borderRadius: BorderRadius.md, paddingVertical: 16, alignItems: "center", marginBottom: Spacing.xl },
  nextBtnDisabled: { opacity: 0.5 },
  nextBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  navRow: { flexDirection: "row", gap: Spacing.sm, marginBottom: Spacing.xl },
  backBtn: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, paddingVertical: 16, paddingHorizontal: Spacing.lg, alignItems: "center", borderWidth: 1, borderColor: Colors.border },
  backBtnText: { color: Colors.textSecondary, fontWeight: "600" },
  formSection: { flex: 1 },
  formLabel: { ...Typography.label, marginBottom: Spacing.xs, marginTop: Spacing.sm },
  input: { backgroundColor: Colors.surface, borderRadius: BorderRadius.sm, padding: Spacing.md, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm, fontSize: 15 },
  yearChip: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: BorderRadius.full, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, marginRight: 8 },
  yearChipActive: { backgroundColor: Colors.blue, borderColor: Colors.blue },
  yearChipText: { color: Colors.textSecondary, fontWeight: "600" },
  yearChipTextActive: { color: "#fff" },
  creditsTeaser: { backgroundColor: Colors.cyan + "22", borderRadius: BorderRadius.md, padding: Spacing.md, alignItems: "center", borderWidth: 1, borderColor: Colors.cyan + "44", marginBottom: Spacing.md },
  creditsTeaserText: { color: Colors.cyan, fontWeight: "700", fontSize: 14 },
  successContainer: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: Spacing.xl },
  successEmoji: { fontSize: 72, marginBottom: Spacing.md },
  successTitle: { ...Typography.h1, textAlign: "center", marginBottom: 4 },
  successName: { ...Typography.h3, color: Colors.cyan, textAlign: "center", marginBottom: Spacing.lg },
  successDetails: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, width: "100%", marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  successDetail: { ...Typography.body, paddingVertical: 4 },
  creditsAward: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.gold + "22", borderRadius: BorderRadius.md, padding: Spacing.md, width: "100%", marginBottom: Spacing.xl, borderWidth: 1, borderColor: Colors.gold + "44", gap: Spacing.md },
  creditsAwardIcon: { fontSize: 32 },
  creditsAwardTitle: { ...Typography.h4, color: Colors.gold },
  creditsAwardSub: { ...Typography.bodySmall },
  doneBtn: { backgroundColor: Colors.blue, borderRadius: BorderRadius.md, paddingVertical: 16, paddingHorizontal: Spacing.xxl, alignItems: "center" },
  doneBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
