import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const API_URL = "https://athlynx.ai";
const COBALT = "#1E90FF";
const CARD = "#07111F";
const BORDER = "rgba(30,144,255,0.42)";
const TEXT_MUTED = "rgba(255,255,255,0.68)";
const TEXT_SOFT = "rgba(255,255,255,0.82)";

type InnovationStatus = "LIVE" | "ACTIVE" | "ROADMAP" | string;

type InnovationCardData = {
  id: string;
  title: string;
  claim: string;
  status: InnovationStatus;
  stages?: string[];
  model?: string;
  engine?: string;
  proof_endpoint?: string;
};

type InnovationsManifest = {
  platform: string;
  version: string;
  innovations: InnovationCardData[];
  doctrine_tagline?: string;
  platform_doctrine?: string;
  signoff?: string;
};

type ComputeManifest = {
  os: string;
  version: string;
  hardware?: string;
  nebius_configured?: boolean;
  models?: Record<string, { id?: string; role?: string }>;
  workload_thesis?: string;
  live?: Record<string, unknown> | null;
  error?: string;
};

type HighlightItem = {
  videoId: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  thumbnail?: string;
};

type HomeState = {
  innovations: InnovationCardData[];
  compute: ComputeManifest | null;
  highlights: HighlightItem[];
};

const SAFE_FALLBACK: HomeState = {
  innovations: [
    {
      id: "F",
      title: "Lifetime Athlete Identity",
      claim: "One athlete identity from youth sports to post-career media, recruiting, NIL, and ownership.",
      status: "LIVE",
      proof_endpoint: "/api/innovations",
    },
    {
      id: "B",
      title: "AI Recruiting Concierge",
      claim: "A native-ready recruiting command center designed to guide each athlete through the next best step.",
      status: "ACTIVE",
      proof_endpoint: "/api/os/compute",
    },
    {
      id: "D",
      title: "Real-Time NIL Valuation Spikes",
      claim: "Athlete performance, media moments, and recruiting momentum flow into the NIL operating layer.",
      status: "ACTIVE",
    },
  ],
  compute: {
    os: "AthlynXAI OS",
    version: "mobile-safe-home",
    hardware: "NVIDIA-class compute manifest",
    nebius_configured: false,
    workload_thesis: "Live data falls back safely when a public endpoint is unavailable.",
  },
  highlights: [
    {
      videoId: "QDKXVmbEcsg",
      title: "S1E2: The Athlete Leap Is Here",
      channelTitle: "AthlynXAI",
      publishedAt: new Date().toISOString(),
    },
  ],
};

function withTimeout<T>(promise: Promise<T>, timeoutMs = 7000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Live data request timed out")), timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timeout);
        resolve(value);
      },
      (error) => {
        clearTimeout(timeout);
        reject(error);
      }
    );
  });
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await withTimeout(fetch(`${API_URL}${path}`, { headers: { Accept: "application/json" } }));
  if (!res.ok) throw new Error(`${path} returned ${res.status}`);
  return (await res.json()) as T;
}

function statusColor(status: InnovationStatus) {
  if (status === "LIVE") return "#16D17A";
  if (status === "ACTIVE") return COBALT;
  return "#B8C7DA";
}

function formatTime(date: Date | null) {
  if (!date) return "Waiting for live refresh";
  return `Updated ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
}

function InnovationCard({ item }: { item: InnovationCardData }) {
  const meta = item.model || item.engine || item.stages?.join(" · ") || item.proof_endpoint || "AthlynXAI OS";
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.id}</Text>
        </View>
        <View style={styles.cardTitleWrap}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardMeta} numberOfLines={1}>{meta}</Text>
        </View>
        <View style={[styles.statusPill, { borderColor: statusColor(item.status) }]}>
          <Text style={[styles.statusText, { color: statusColor(item.status) }]}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.cardBody}>{item.claim}</Text>
    </View>
  );
}

function ComputeCard({ compute }: { compute: ComputeManifest | null }) {
  const model = compute?.models?.nvidia_nemotron?.id || compute?.hardware || "Live compute manifest";
  const ready = compute?.nebius_configured === true;
  return (
    <View style={styles.computeCard}>
      <View style={styles.computeDot} />
      <View style={styles.computeText}>
        <Text style={styles.computeLabel}>Live AthlynXAI Data</Text>
        <Text style={styles.computeValue} numberOfLines={2}>{model}</Text>
      </View>
      <Text style={styles.computeState}>{ready ? "LIVE" : "READY"}</Text>
    </View>
  );
}

function HighlightRow({ item }: { item: HighlightItem }) {
  const openVideo = useCallback(() => {
    Linking.openURL(`https://www.youtube.com/watch?v=${item.videoId}`).catch(() => undefined);
  }, [item.videoId]);

  return (
    <TouchableOpacity activeOpacity={0.82} style={styles.highlightRow} onPress={openVideo}>
      <View style={styles.playBadge}>
        <Text style={styles.playText}>▶</Text>
      </View>
      <View style={styles.highlightTextWrap}>
        <Text style={styles.highlightTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.highlightMeta} numberOfLines={1}>{item.channelTitle || "AthlynXAI live feed"}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function App() {
  const [data, setData] = useState<HomeState>(SAFE_FALLBACK);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const priorityInnovations = useMemo(
    () => data.innovations.filter((item) => ["F", "B", "D"].includes(item.id)).slice(0, 3),
    [data.innovations]
  );

  const load = useCallback(async () => {
    setError("");
    try {
      const [innovations, compute, highlights] = await Promise.all([
        fetchJson<InnovationsManifest>("/api/innovations"),
        fetchJson<ComputeManifest>("/api/os/compute"),
        fetchJson<{ items?: HighlightItem[] }>("/api/youtube/highlights?q=AthlynXAI%20athlete%20highlights&max=4"),
      ]);
      setData({
        innovations: innovations.innovations?.length ? innovations.innovations : SAFE_FALLBACK.innovations,
        compute: compute || SAFE_FALLBACK.compute,
        highlights: highlights.items?.length ? highlights.items.slice(0, 4) : SAFE_FALLBACK.highlights,
      });
      setLastUpdated(new Date());
    } catch (err) {
      setData(SAFE_FALLBACK);
      setError(err instanceof Error ? err.message : "Live data is temporarily unavailable.");
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

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <ScrollView
        style={styles.scroller}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COBALT} />}
      >
        <View style={styles.hero}>
          <Image source={require("./assets/app-icon.png")} style={styles.logo} resizeMode="contain" />
          <Text style={styles.eyebrow}>ONE IDENTITY · EVERY ATHLETE</Text>
          <Text style={styles.title}>AthlynXAI Home</Text>
          <Text style={styles.subtitle}>
            The app is back past native-only diagnostics with a safe live Home layer: no auth, no Supabase, no WebView, no Sentry startup path.
          </Text>
          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>{loading ? "Loading live data" : formatTime(lastUpdated)}</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={COBALT} />
            <Text style={styles.loadingText}>Loading AthlynXAI live proof</Text>
          </View>
        ) : null}

        {error ? (
          <View style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>Live data fallback active</Text>
            <Text style={styles.noticeText}>{error}</Text>
          </View>
        ) : null}

        <ComputeCard compute={data.compute} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Innovation Proof</Text>
          <Text style={styles.sectionMeta}>F · B · D</Text>
        </View>
        {priorityInnovations.map((item) => <InnovationCard key={item.id} item={item} />)}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Live Highlights</Text>
          <Text style={styles.sectionMeta}>YouTube proxy</Text>
        </View>
        {data.highlights.map((item) => <HighlightRow key={item.videoId} item={item} />)}

        <View style={styles.footerCard}>
          <Text style={styles.footerTitle}>The Athlete Playbook</Text>
          <Text style={styles.footerText}>
            Build presence, compare recruiting momentum, share schedules, and route every media moment back to the athlete-owned platform.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000000" },
  scroller: { flex: 1, backgroundColor: "#000000" },
  content: { paddingHorizontal: 18, paddingTop: 22, paddingBottom: 36, gap: 14 },
  hero: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#050A12",
    padding: 22,
    alignItems: "flex-start",
  },
  logo: { width: 86, height: 86, borderRadius: 22, marginBottom: 18, alignSelf: "center" },
  eyebrow: { color: COBALT, fontSize: 12, fontWeight: "900", letterSpacing: 1.4, marginBottom: 8 },
  title: { color: "#FFFFFF", fontSize: 34, fontWeight: "900", letterSpacing: -0.7 },
  subtitle: { color: TEXT_SOFT, fontSize: 15, lineHeight: 23, marginTop: 10 },
  liveRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 18 },
  liveDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#16D17A" },
  liveText: { color: TEXT_MUTED, fontSize: 12, fontWeight: "800" },
  loadingCard: { borderRadius: 18, borderWidth: 1, borderColor: BORDER, padding: 18, alignItems: "center", backgroundColor: CARD },
  loadingText: { color: TEXT_SOFT, marginTop: 10, fontWeight: "800" },
  noticeCard: { borderRadius: 18, borderWidth: 1, borderColor: "rgba(255,195,0,0.45)", padding: 15, backgroundColor: "rgba(255,195,0,0.08)" },
  noticeTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "900", marginBottom: 5 },
  noticeText: { color: TEXT_MUTED, fontSize: 13, lineHeight: 19 },
  computeCard: { flexDirection: "row", alignItems: "center", borderRadius: 18, borderWidth: 1, borderColor: BORDER, backgroundColor: CARD, padding: 15, gap: 12 },
  computeDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COBALT },
  computeText: { flex: 1 },
  computeLabel: { color: "#FFFFFF", fontSize: 13, fontWeight: "900", letterSpacing: 0.7, textTransform: "uppercase" },
  computeValue: { color: TEXT_MUTED, fontSize: 12, lineHeight: 17, marginTop: 3 },
  computeState: { color: COBALT, fontSize: 11, fontWeight: "900" },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6 },
  sectionTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "900" },
  sectionMeta: { color: TEXT_MUTED, fontSize: 12, fontWeight: "800" },
  card: { borderRadius: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.11)", backgroundColor: "#070707", padding: 15 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  badge: { width: 38, height: 38, borderRadius: 19, backgroundColor: COBALT, alignItems: "center", justifyContent: "center" },
  badgeText: { color: "#FFFFFF", fontSize: 17, fontWeight: "900" },
  cardTitleWrap: { flex: 1 },
  cardTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "900" },
  cardMeta: { color: TEXT_MUTED, fontSize: 11, marginTop: 2 },
  statusPill: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  statusText: { fontSize: 10, fontWeight: "900" },
  cardBody: { color: TEXT_SOFT, fontSize: 14, lineHeight: 21 },
  highlightRow: { flexDirection: "row", alignItems: "center", borderRadius: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", backgroundColor: "#080E18", padding: 14, gap: 12 },
  playBadge: { width: 44, height: 44, borderRadius: 22, backgroundColor: COBALT, alignItems: "center", justifyContent: "center" },
  playText: { color: "#FFFFFF", fontSize: 18, fontWeight: "900", marginLeft: 2 },
  highlightTextWrap: { flex: 1 },
  highlightTitle: { color: "#FFFFFF", fontSize: 14, fontWeight: "900", lineHeight: 19 },
  highlightMeta: { color: TEXT_MUTED, fontSize: 12, marginTop: 4 },
  footerCard: { borderRadius: 20, backgroundColor: "#050A12", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", padding: 16, marginTop: 4 },
  footerTitle: { color: "#FFFFFF", fontSize: 17, fontWeight: "900", marginBottom: 7 },
  footerText: { color: TEXT_SOFT, fontSize: 14, lineHeight: 21 },
});
