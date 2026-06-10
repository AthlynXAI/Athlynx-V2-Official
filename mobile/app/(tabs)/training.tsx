import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from "react-native";
import { trainingApi } from "../../lib/api";
import { Colors, Spacing, BorderRadius, Typography } from "../../lib/theme";

interface TrainingStats {
  totalSessions: number;
  totalMinutes: number;
  avgPerformance: number;
  streak: number;
}

interface WorkoutLog {
  id: number;
  workout: string;
  duration?: number;
  notes?: string;
  performance?: number;
  logDate: string;
}

const WORKOUT_TYPES = [
  "Weight Training", "Cardio", "Speed & Agility", "Position Drills",
  "Film Study", "Recovery", "Plyometrics", "Flexibility", "Team Practice", "Game",
];

function StatCard({ value, label, icon, color }: {
  value: string | number;
  label: string;
  icon: string;
  color?: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, color ? { color } : {}]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function PerformanceBar({ value }: { value: number }) {
  const pct = Math.min(Math.max(value / 10, 0), 1);
  const color = pct >= 0.8 ? Colors.success : pct >= 0.5 ? Colors.cyan : Colors.warning;
  return (
    <View style={styles.perfBarBg}>
      <View style={[styles.perfBarFill, { width: `${pct * 100}%` as any, backgroundColor: color }]} />
    </View>
  );
}

export default function TrainingScreen() {
  const [stats, setStats] = useState<TrainingStats | null>(null);
  const [history, setHistory] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Log form state
  const [workout, setWorkout] = useState("");
  const [duration, setDuration] = useState("");
  const [performance, setPerformance] = useState("7");
  const [notes, setNotes] = useState("");
  const [logging, setLogging] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  const loadData = useCallback(async () => {
    try {
      const [s, h] = await Promise.all([
        trainingApi.getStats(),
        trainingApi.getHistory(20),
      ]);
      setStats(s);
      setHistory(h || []);
    } catch (err) {
      console.error("Training load error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  async function handleLog() {
    const w = selectedType || workout.trim();
    if (!w) {
      Alert.alert("Missing Info", "Please select or enter a workout type.");
      return;
    }
    setLogging(true);
    try {
      await trainingApi.logWorkout({
        workout: w,
        duration: duration ? parseInt(duration) : undefined,
        performance: performance ? parseInt(performance) : undefined,
        notes: notes.trim() || undefined,
      });
      setModalVisible(false);
      setWorkout(""); setDuration(""); setPerformance("7"); setNotes(""); setSelectedType("");
      await loadData();
      Alert.alert("⚡ Logged!", "Workout recorded. Keep grinding.");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to log workout.");
    } finally {
      setLogging(false);
    }
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function formatDuration(mins?: number) {
    if (!mins) return "—";
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.cyan} />
        <Text style={styles.loadingText}>Loading training data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.cyan} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Training Hub</Text>
            <Text style={styles.headerSub}>Track every rep. Build your legacy.</Text>
          </View>
          <TouchableOpacity style={styles.logBtn} onPress={() => setModalVisible(true)}>
            <Text style={styles.logBtnText}>+ Log</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            value={stats?.totalSessions ?? 0}
            label="Sessions"
            icon="🏋️"
            color={Colors.cyan}
          />
          <StatCard
            value={formatDuration(stats?.totalMinutes)}
            label="Total Time"
            icon="⏱️"
            color={Colors.blue}
          />
          <StatCard
            value={stats?.avgPerformance ? `${stats.avgPerformance}/10` : "—"}
            label="Avg Rating"
            icon="⚡"
            color={Colors.gold}
          />
          <StatCard
            value={stats?.streak ? `${stats.streak}d` : "0d"}
            label="Streak"
            icon="🔥"
            color={Colors.success}
          />
        </View>

        {/* Streak Banner */}
        {(stats?.streak ?? 0) >= 3 && (
          <View style={styles.streakBanner}>
            <Text style={styles.streakBannerText}>
              🔥 {stats!.streak}-day streak! You're locked in.
            </Text>
          </View>
        )}

        {/* Recent Sessions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
          {history.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🏃</Text>
              <Text style={styles.emptyText}>No sessions logged yet.</Text>
              <Text style={styles.emptySubtext}>Tap "+ Log" to record your first workout.</Text>
            </View>
          ) : (
            history.map((log) => (
              <View key={log.id} style={styles.logCard}>
                <View style={styles.logCardTop}>
                  <View style={styles.logCardLeft}>
                    <Text style={styles.logWorkout}>{log.workout}</Text>
                    <Text style={styles.logDate}>{formatDate(log.logDate)}</Text>
                  </View>
                  <View style={styles.logCardRight}>
                    <Text style={styles.logDuration}>{formatDuration(log.duration)}</Text>
                    {log.performance != null && (
                      <Text style={styles.logPerf}>{log.performance}/10</Text>
                    )}
                  </View>
                </View>
                {log.performance != null && (
                  <PerformanceBar value={log.performance} />
                )}
                {log.notes ? (
                  <Text style={styles.logNotes}>{log.notes}</Text>
                ) : null}
              </View>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Log Workout Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Log Workout</Text>

            {/* Quick select workout type */}
            <Text style={styles.inputLabel}>Workout Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
              {WORKOUT_TYPES.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeChip, selectedType === t && styles.typeChipActive]}
                  onPress={() => { setSelectedType(t); setWorkout(""); }}
                >
                  <Text style={[styles.typeChipText, selectedType === t && styles.typeChipTextActive]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.inputLabel}>Or Custom</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 40-yard dash drills"
              placeholderTextColor={Colors.textMuted}
              value={workout}
              onChangeText={(v) => { setWorkout(v); setSelectedType(""); }}
            />

            <View style={styles.inputRow}>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>Duration (min)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="60"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="numeric"
                  value={duration}
                  onChangeText={setDuration}
                />
              </View>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>Performance (1-10)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="7"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="numeric"
                  value={performance}
                  onChangeText={setPerformance}
                />
              </View>
            </View>

            <Text style={styles.inputLabel}>Notes (optional)</Text>
            <TextInput
              style={[styles.input, styles.inputMulti]}
              placeholder="How'd it go? Any PRs?"
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={3}
              value={notes}
              onChangeText={setNotes}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitBtn, logging && styles.submitBtnDisabled]}
                onPress={handleLog}
                disabled={logging}
              >
                {logging ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitBtnText}>Log It ⚡</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.background },
  loadingText: { ...Typography.bodySmall, marginTop: Spacing.sm },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTitle: { ...Typography.h2 },
  headerSub: { ...Typography.bodySmall, marginTop: 2 },
  logBtn: {
    backgroundColor: Colors.blue,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  logBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: "44%",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIcon: { fontSize: 24, marginBottom: 4 },
  statValue: { ...Typography.h3, color: Colors.cyan },
  statLabel: { ...Typography.caption, marginTop: 2 },

  streakBanner: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: "#FF6B0020",
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: "#FF6B0040",
  },
  streakBannerText: { color: Colors.warning, fontWeight: "700", fontSize: 14, textAlign: "center" },

  section: { paddingHorizontal: Spacing.md },
  sectionTitle: { ...Typography.h4, marginBottom: Spacing.md },

  emptyState: { alignItems: "center", paddingVertical: Spacing.xxl },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
  emptyText: { ...Typography.body, marginBottom: 4 },
  emptySubtext: { ...Typography.bodySmall },

  logCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logCardTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  logCardLeft: { flex: 1 },
  logCardRight: { alignItems: "flex-end" },
  logWorkout: { ...Typography.body, fontWeight: "600" },
  logDate: { ...Typography.caption, marginTop: 2 },
  logDuration: { ...Typography.bodySmall, color: Colors.cyan },
  logPerf: { ...Typography.caption, color: Colors.gold, marginTop: 2 },
  logNotes: { ...Typography.caption, marginTop: 6, fontStyle: "italic" },

  perfBarBg: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: "hidden",
  },
  perfBarFill: { height: 4, borderRadius: 2 },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalSheet: {
    backgroundColor: Colors.navyLight,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    maxHeight: "90%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: Spacing.md,
  },
  modalTitle: { ...Typography.h3, marginBottom: Spacing.md },
  inputLabel: { ...Typography.label, marginBottom: 6, marginTop: Spacing.sm },
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
  inputMulti: { minHeight: 80, textAlignVertical: "top", paddingTop: 10 },
  inputRow: { flexDirection: "row", gap: Spacing.sm },
  inputHalf: { flex: 1 },
  typeScroll: { marginBottom: Spacing.sm },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  typeChipActive: { backgroundColor: Colors.blue + "33", borderColor: Colors.blue },
  typeChipText: { ...Typography.caption, color: Colors.textSecondary },
  typeChipTextActive: { color: Colors.cyan, fontWeight: "700" },

  modalActions: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.lg },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelBtnText: { color: Colors.textSecondary, fontWeight: "600" },
  submitBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.blue,
    alignItems: "center",
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
