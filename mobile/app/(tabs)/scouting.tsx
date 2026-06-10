import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { aiApi } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";
import { Colors, Spacing, BorderRadius, Typography } from "../../lib/theme";

const SPORTS = [
  "Football", "Basketball", "Baseball", "Soccer", "Track & Field",
  "Swimming", "Volleyball", "Tennis", "Wrestling", "Lacrosse",
  "Softball", "Golf", "Cross Country", "Multi-Sport",
];

const YEARS = ["2025", "2026", "2027", "2028", "2029"];

interface ScoutingForm {
  athleteName: string;
  sport: string;
  position: string;
  school: string;
  year: string;
  state: string;
  gpa: string;
  offers: string;
  fortyYd: string;
  vertical: string;
  bench: string;
  nilValue: string;
  highlights: string;
}

const EMPTY_FORM: ScoutingForm = {
  athleteName: "", sport: "", position: "", school: "",
  year: "2027", state: "", gpa: "", offers: "",
  fortyYd: "", vertical: "", bench: "", nilValue: "", highlights: "",
};

function SectionHeader({ title, icon }: { title: string; icon: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionIcon}>{icon}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function ReportSection({ content }: { content: string }) {
  const sections = content.split(/\n## /).filter(Boolean);
  return (
    <>
      {sections.map((section, i) => {
        const lines = section.split("\n");
        const heading = lines[0].replace(/^## /, "").trim();
        const body = lines.slice(1).join("\n").trim();
        return (
          <View key={i} style={styles.reportSection}>
            <Text style={styles.reportHeading}>{heading}</Text>
            <Text style={styles.reportBody}>{body}</Text>
          </View>
        );
      })}
    </>
  );
}

export default function ScoutingScreen() {
  const { user } = useAuth();
  const [form, setForm] = useState<ScoutingForm>(EMPTY_FORM);
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<{ report: string; athleteName: string; generatedAt: string } | null>(null);
  const [step, setStep] = useState<"form" | "report">("form");

  function update(key: keyof ScoutingForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleGenerate() {
    if (!form.athleteName.trim() || !form.sport || !form.position.trim() || !form.school.trim()) {
      Alert.alert("Missing Info", "Please fill in Name, Sport, Position, and School.");
      return;
    }
    setGenerating(true);
    try {
      const result = await aiApi.generateScoutingReport({
        athleteName: form.athleteName.trim(),
        sport: form.sport,
        position: form.position.trim(),
        school: form.school.trim(),
        year: form.year || undefined,
        state: form.state.trim() || undefined,
        gpa: form.gpa ? parseFloat(form.gpa) : undefined,
        offers: form.offers ? parseInt(form.offers) : undefined,
        fortyYd: form.fortyYd.trim() || undefined,
        vertical: form.vertical.trim() || undefined,
        bench: form.bench ? parseInt(form.bench) : undefined,
        nilValue: form.nilValue ? parseInt(form.nilValue) : undefined,
        highlights: form.highlights.trim() || undefined,
      });
      setReport(result as { report: string; athleteName: string; generatedAt: string });
      setStep("report");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to generate report. Check your credits.");
    } finally {
      setGenerating(false);
    }
  }

  function handleReset() {
    setReport(null);
    setForm(EMPTY_FORM);
    setStep("form");
  }

  if (step === "report" && report) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Report Header */}
        <View style={styles.reportHeader}>
          <View style={styles.reportBadge}>
            <Text style={styles.reportBadgeText}>AI SCOUTING REPORT</Text>
          </View>
          <Text style={styles.reportAthleteTitle}>{report.athleteName}</Text>
          <Text style={styles.reportMeta}>
            Generated {new Date(report.generatedAt).toLocaleDateString("en-US", {
              month: "long", day: "numeric", year: "numeric"
            })} · Powered by Nebius AI
          </Text>
        </View>

        {/* Report Content */}
        <View style={styles.reportContent}>
          <ReportSection content={report.report} />
        </View>

        {/* Actions */}
        <View style={styles.reportActions}>
          <TouchableOpacity style={styles.newReportBtn} onPress={handleReset}>
            <Text style={styles.newReportBtnText}>Generate New Report</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AI Scouting Report</Text>
          <Text style={styles.headerSub}>
            D1-level scouting intelligence. Powered by Nebius Llama-3.3-70B.
          </Text>
          <View style={styles.creditBadge}>
            <Text style={styles.creditBadgeText}>⚡ 10 credits</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>

          <SectionHeader title="Athlete Info" icon="🏃" />

          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Marcus Johnson"
            placeholderTextColor={Colors.textMuted}
            value={form.athleteName}
            onChangeText={(v) => update("athleteName", v)}
          />

          <Text style={styles.label}>Sport *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {SPORTS.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.chip, form.sport === s && styles.chipActive]}
                onPress={() => update("sport", s)}
              >
                <Text style={[styles.chipText, form.sport === s && styles.chipTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>Position *</Text>
              <TextInput
                style={styles.input}
                placeholder="QB, PG, SS..."
                placeholderTextColor={Colors.textMuted}
                value={form.position}
                onChangeText={(v) => update("position", v)}
              />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>Class Year</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {YEARS.map((y) => (
                  <TouchableOpacity
                    key={y}
                    style={[styles.chip, form.year === y && styles.chipActive, { marginRight: 6 }]}
                    onPress={() => update("year", y)}
                  >
                    <Text style={[styles.chipText, form.year === y && styles.chipTextActive]}>{y}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <Text style={styles.label}>School *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Westbrook High School"
            placeholderTextColor={Colors.textMuted}
            value={form.school}
            onChangeText={(v) => update("school", v)}
          />

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>State</Text>
              <TextInput
                style={styles.input}
                placeholder="TX"
                placeholderTextColor={Colors.textMuted}
                value={form.state}
                onChangeText={(v) => update("state", v)}
                maxLength={2}
                autoCapitalize="characters"
              />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>GPA</Text>
              <TextInput
                style={styles.input}
                placeholder="3.8"
                placeholderTextColor={Colors.textMuted}
                keyboardType="decimal-pad"
                value={form.gpa}
                onChangeText={(v) => update("gpa", v)}
              />
            </View>
          </View>

          <SectionHeader title="Performance Metrics" icon="📊" />

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>40-Yard Dash (s)</Text>
              <TextInput
                style={styles.input}
                placeholder="4.4"
                placeholderTextColor={Colors.textMuted}
                keyboardType="decimal-pad"
                value={form.fortyYd}
                onChangeText={(v) => update("fortyYd", v)}
              />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>Vertical (in)</Text>
              <TextInput
                style={styles.input}
                placeholder="36"
                placeholderTextColor={Colors.textMuted}
                keyboardType="decimal-pad"
                value={form.vertical}
                onChangeText={(v) => update("vertical", v)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>Bench Reps</Text>
              <TextInput
                style={styles.input}
                placeholder="22"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                value={form.bench}
                onChangeText={(v) => update("bench", v)}
              />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>College Offers</Text>
              <TextInput
                style={styles.input}
                placeholder="12"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                value={form.offers}
                onChangeText={(v) => update("offers", v)}
              />
            </View>
          </View>

          <Text style={styles.label}>NIL Value ($)</Text>
          <TextInput
            style={styles.input}
            placeholder="50000"
            placeholderTextColor={Colors.textMuted}
            keyboardType="numeric"
            value={form.nilValue}
            onChangeText={(v) => update("nilValue", v)}
          />

          <SectionHeader title="Additional Notes" icon="📝" />

          <TextInput
            style={[styles.input, styles.inputMulti]}
            placeholder="Film highlights, accolades, injuries, combine results..."
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={4}
            value={form.highlights}
            onChangeText={(v) => update("highlights", v)}
          />

          <TouchableOpacity
            style={[styles.generateBtn, generating && styles.generateBtnDisabled]}
            onPress={handleGenerate}
            disabled={generating}
          >
            {generating ? (
              <View style={styles.generateBtnInner}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.generateBtnText}>  Generating Report...</Text>
              </View>
            ) : (
              <Text style={styles.generateBtnText}>⚡ Generate Scouting Report</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Powered by Nebius AI (Llama-3.3-70B). Reports are AI-generated and intended for informational use.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTitle: { ...Typography.h2 },
  headerSub: { ...Typography.bodySmall, marginTop: 4, marginBottom: Spacing.sm },
  creditBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.blue + "22",
    borderRadius: BorderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.blue + "44",
  },
  creditBadgeText: { color: Colors.cyan, fontSize: 12, fontWeight: "700" },

  form: { paddingHorizontal: Spacing.md },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionIcon: { fontSize: 18, marginRight: 8 },
  sectionTitle: { ...Typography.h4, color: Colors.cyan },

  label: { ...Typography.label, marginBottom: 6, marginTop: Spacing.sm },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    fontSize: 15,
  },
  inputMulti: { minHeight: 100, textAlignVertical: "top", paddingTop: 10 },
  row: { flexDirection: "row", gap: Spacing.sm },
  half: { flex: 1 },

  chipScroll: { marginBottom: Spacing.sm },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  chipActive: { backgroundColor: Colors.blue + "33", borderColor: Colors.blue },
  chipText: { ...Typography.caption, color: Colors.textSecondary },
  chipTextActive: { color: Colors.cyan, fontWeight: "700" },

  generateBtn: {
    backgroundColor: Colors.blue,
    borderRadius: BorderRadius.md,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  generateBtnDisabled: { opacity: 0.6 },
  generateBtnInner: { flexDirection: "row", alignItems: "center" },
  generateBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  disclaimer: {
    ...Typography.caption,
    textAlign: "center",
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
  },

  // Report styles
  reportHeader: {
    padding: Spacing.lg,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  reportBadge: {
    backgroundColor: Colors.cyan + "22",
    borderRadius: BorderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.cyan + "44",
    marginBottom: Spacing.sm,
  },
  reportBadgeText: { color: Colors.cyan, fontSize: 11, fontWeight: "800", letterSpacing: 1.5 },
  reportAthleteTitle: { ...Typography.h2, textAlign: "center", marginBottom: 4 },
  reportMeta: { ...Typography.caption, textAlign: "center" },

  reportContent: { padding: Spacing.md },
  reportSection: {
    marginBottom: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reportHeading: {
    ...Typography.h4,
    color: Colors.cyan,
    marginBottom: Spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  reportBody: { ...Typography.body, lineHeight: 22 },

  reportActions: { paddingHorizontal: Spacing.md },
  newReportBtn: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  newReportBtnText: { color: Colors.textSecondary, fontWeight: "600" },
});
