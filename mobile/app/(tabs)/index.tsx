import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ComputeManifest, InnovationCardData, platformApi } from "../../lib/api";
import { BorderRadius, Colors, Spacing, Typography } from "../../lib/theme";

const COBALT = "#1E90FF";
const TARGET_INNOVATIONS = new Set(["F", "B", "D"]);

function statusColor(status: string) {
  if (status === "LIVE") return Colors.success;
  if (status === "ACTIVE") return COBALT;
  return Colors.textMuted;
}

function InnovationCard({ item }: { item: InnovationCardData }) {
  const meta = item.model || item.engine || item.stages?.join(" · ") || item.proof_endpoint || "AthlynXAI OS";
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.innovationId}>
          <Text style={styles.innovationIdText}>{item.id}</Text>
        </View>
        <View style={styles.cardTitleWrap}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardMeta} numberOfLines={1}>{meta}</Text>
        </View>
        <View style={[styles.statusPill, { borderColor: statusColor(item.status) }]}>
          <Text style={[styles.statusText, { color: statusColor(item.status) }]}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.claim}>{item.claim}</Text>
      {item.proof_endpoint ? <Text style={styles.proof}>Proof: {item.proof_endpoint}</Text> : null}
    </View>
  );
}

function ComputePill({ compute }: { compute: ComputeManifest | null }) {
  const configured = compute?.nebius_configured === true;
  const model = compute?.models?.nvidia_nemotron?.id || "NVIDIA Nemotron Ultra";
  return (
    <View style={styles.computePill}>
      <View style={styles.computeDot} />
      <View style={styles.computeTextWrap}>
        <Text style={styles.computeLabel}>NVIDIA H200 Compute</Text>
        <Text style={styles.computeValue} numberOfLines={2}>
          {configured ? `${compute?.hardware || "H200 GPU cluster"} · ${model}` : "Compute manifest connected"}
        </Text>
      </View>
      <Text style={styles.computeState}>{configured ? "LIVE" : "READY"}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const [innovations, setInnovations] = useState<InnovationCardData[]>([]);
  const [compute, setCompute] = useState<ComputeManifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const priorityInnovations = useMemo(
    () => innovations.filter((item) => TARGET_INNOVATIONS.has(item.id)),
    [innovations]
  );

  const load = useCallback(async () => {
    setError("");
    try {
      const [innovationData, computeData] = await Promise.all([
        platformApi.getInnovations(),
        platformApi.getCompute(false),
      ]);
      setInnovations(innovationData.innovations || []);
      setCompute(computeData);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err?.message || "Live AthlynXAI data is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COBALT} />
        <Text style={styles.loadingText}>Loading AthlynXAI OS</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COBALT} />}
    >
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>ONE IDENTITY · EVERY ATHLETE</Text>
        <Text style={styles.title}>AthlynXAI Native Home</Text>
        <Text style={styles.subtitle}>
          Live F + B + D innovation proof, wired directly to AthlynXAI OS.
        </Text>
      </View>

      <ComputePill compute={compute} />

      {error ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Live data paused</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Innovation Proof</Text>
        <Text style={styles.sectionMeta}>{lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : "Live"}</Text>
      </View>

      {priorityInnovations.map((item) => (
        <InnovationCard key={item.id} item={item} />
      ))}

      <View style={styles.footerCard}>
        <Text style={styles.footerTitle}>Platform doctrine</Text>
        <Text style={styles.footerText}>One App. Many inside. Athlete-first, native-ready, and source-of-truth aligned.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  content: { padding: Spacing.md, paddingBottom: 32, gap: Spacing.md },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000000" },
  loadingText: { color: Colors.textSecondary, marginTop: Spacing.md, fontWeight: "700" },
  hero: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: `${COBALT}66`,
    backgroundColor: "#050A12",
    padding: Spacing.lg,
  },
  eyebrow: { ...Typography.label, color: COBALT, marginBottom: 8 },
  title: { fontSize: 30, fontWeight: "900", color: "#FFFFFF", letterSpacing: -0.5 },
  subtitle: { color: Colors.textSecondary, fontSize: 15, lineHeight: 22, marginTop: 8 },
  computePill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: `${COBALT}88`,
    backgroundColor: "#07111F",
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  computeDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COBALT },
  computeTextWrap: { flex: 1 },
  computeLabel: { color: "#FFFFFF", fontSize: 13, fontWeight: "900", textTransform: "uppercase", letterSpacing: 0.8 },
  computeValue: { color: Colors.textSecondary, fontSize: 12, marginTop: 3, lineHeight: 17 },
  computeState: { color: COBALT, fontSize: 11, fontWeight: "900" },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  sectionTitle: { ...Typography.h3, color: "#FFFFFF" },
  sectionMeta: { color: Colors.textMuted, fontSize: 11 },
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "#070707",
    padding: Spacing.md,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: Spacing.sm, marginBottom: Spacing.sm },
  innovationId: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COBALT,
    alignItems: "center",
    justifyContent: "center",
  },
  innovationIdText: { color: "#FFFFFF", fontSize: 18, fontWeight: "900" },
  cardTitleWrap: { flex: 1 },
  cardTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },
  cardMeta: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  statusPill: { borderWidth: 1, borderRadius: BorderRadius.full, paddingHorizontal: 8, paddingVertical: 4 },
  statusText: { fontSize: 10, fontWeight: "900" },
  claim: { color: Colors.textSecondary, fontSize: 14, lineHeight: 21 },
  proof: { color: COBALT, fontSize: 12, fontWeight: "800", marginTop: Spacing.sm },
  errorCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.error,
    backgroundColor: "rgba(255,68,68,0.08)",
    padding: Spacing.md,
  },
  errorTitle: { color: "#FFFFFF", fontWeight: "900", marginBottom: 4 },
  errorText: { color: Colors.textSecondary, lineHeight: 20 },
  footerCard: {
    borderRadius: BorderRadius.lg,
    backgroundColor: "#050A12",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: Spacing.md,
  },
  footerTitle: { color: "#FFFFFF", fontWeight: "900", marginBottom: 6 },
  footerText: { color: Colors.textSecondary, lineHeight: 20 },
});
