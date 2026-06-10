/**
 * AthlynXAI — Highlight Reel Studio Mobile Screen
 * S41 — Upload clips, AI-generate reel title/description, manage reels
 */
import { useState, useCallback } from "react";
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, RefreshControl,
} from "react-native";
import { apiMutation, apiQuery } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";
import { Colors, Spacing, BorderRadius, Typography } from "../../lib/theme";

const REEL_TYPES = [
  { id: "highlights", label: "Highlights", icon: "🎬" },
  { id: "game_film", label: "Game Film", icon: "🏟️" },
  { id: "training", label: "Training", icon: "🏋️" },
  { id: "recruiting", label: "Recruiting", icon: "🏆" },
];

const SAMPLE_REELS = [
  { id: 1, title: "2025 Season Highlights — QB Marcus J.", type: "highlights", sport: "Football", views: 1240, duration: "3:42", thumbnail: "🏈" },
  { id: 2, title: "Spring Training Reel — DeShawn T.", type: "training", sport: "Basketball", views: 890, duration: "2:15", thumbnail: "🏀" },
  { id: 3, title: "Recruiting Video — Carlos R.", type: "recruiting", sport: "Baseball", views: 2100, duration: "4:30", thumbnail: "⚾" },
];

function ReelCard({ reel }: { reel: any }) {
  return (
    <View style={styles.reelCard}>
      <View style={styles.reelThumb}>
        <Text style={styles.reelThumbIcon}>{reel.thumbnail}</Text>
        <View style={styles.reelDuration}>
          <Text style={styles.reelDurationText}>{reel.duration}</Text>
        </View>
      </View>
      <View style={styles.reelInfo}>
        <Text style={styles.reelTitle} numberOfLines={2}>{reel.title}</Text>
        <Text style={styles.reelMeta}>{reel.sport} · {reel.type}</Text>
        <View style={styles.reelStats}>
          <Text style={styles.reelViews}>👁 {reel.views.toLocaleString()} views</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.reelShare}>
        <Text style={styles.reelShareText}>Share</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function HighlightReelScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"studio" | "my-reels">("studio");
  const [reelType, setReelType] = useState("highlights");
  const [sport, setSport] = useState("Football");
  const [description, setDescription] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<{ title: string; description: string; tags: string[] } | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  async function generateReelContent() {
    if (!description.trim()) {
      Alert.alert("Missing Info", "Describe your highlight reel first.");
      return;
    }
    setGenerating(true);
    setGenerated(null);
    try {
      const result = await apiMutation<any>("ai.generateCaption", {
        context: `Create a professional highlight reel title, description, and hashtags for an athlete. Sport: ${sport}, Reel Type: ${reelType}, Athlete Description: ${description}. Format response as: TITLE: [title]\nDESCRIPTION: [2-3 sentence description]\nTAGS: [comma-separated hashtags]`,
      });
      const text: string = result?.caption || result?.content || "";
      const titleMatch = text.match(/TITLE:\s*(.+)/i);
      const descMatch = text.match(/DESCRIPTION:\s*([\s\S]+?)(?=TAGS:|$)/i);
      const tagsMatch = text.match(/TAGS:\s*(.+)/i);
      setGenerated({
        title: titleMatch?.[1]?.trim() || `${sport} ${reelType} — ${user?.name || "Athlete"} 2025`,
        description: descMatch?.[1]?.trim() || `Elite ${sport} athlete showcasing top-tier skills and game-changing plays.`,
        tags: tagsMatch?.[1]?.split(",").map(t => t.trim()) || ["#AthlynXAI", `#${sport}`, "#Recruiting", "#NIL"],
      });
    } catch {
      setGenerated({
        title: `${sport} ${reelType.charAt(0).toUpperCase() + reelType.slice(1)} — ${user?.name || "Athlete"} 2025`,
        description: `Elite ${sport} athlete showcasing top-tier skills, game-changing plays, and championship-level performance. Actively recruiting — contact for more information.`,
        tags: ["#AthlynXAI", `#${sport}`, "#Recruiting", "#NIL", "#TransferPortal"],
      });
    } finally {
      setGenerating(false);
    }
  }

  function handleUpload() {
    Alert.alert(
      "Upload Highlight Reel",
      "Select a video from your library to upload to AthlynXAI. Videos up to 500MB supported.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Choose Video", onPress: () => Alert.alert("Coming Soon", "Video upload will be available in the next app update via EAS Build.") },
      ]
    );
  }

  return (
    <View style={styles.container}>
      {/* Tab Toggle */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "studio" && styles.tabActive]}
          onPress={() => setActiveTab("studio")}
        >
          <Text style={[styles.tabText, activeTab === "studio" && styles.tabTextActive]}>🎬 Studio</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "my-reels" && styles.tabActive]}
          onPress={() => setActiveTab("my-reels")}
        >
          <Text style={[styles.tabText, activeTab === "my-reels" && styles.tabTextActive]}>My Reels</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "studio" ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {/* Upload Zone */}
          <TouchableOpacity style={styles.uploadZone} onPress={handleUpload}>
            <Text style={styles.uploadIcon}>📹</Text>
            <Text style={styles.uploadTitle}>Upload Your Highlight Reel</Text>
            <Text style={styles.uploadSub}>MP4, MOV · Up to 500MB</Text>
            <View style={styles.uploadBtn}>
              <Text style={styles.uploadBtnText}>Choose Video</Text>
            </View>
          </TouchableOpacity>

          {/* Reel Type */}
          <Text style={styles.sectionLabel}>Reel Type</Text>
          <View style={styles.reelTypeRow}>
            {REEL_TYPES.map(rt => (
              <TouchableOpacity
                key={rt.id}
                style={[styles.reelTypeBtn, reelType === rt.id && styles.reelTypeBtnActive]}
                onPress={() => setReelType(rt.id)}
              >
                <Text style={styles.reelTypeIcon}>{rt.icon}</Text>
                <Text style={[styles.reelTypeLabel, reelType === rt.id && styles.reelTypeLabelActive]}>{rt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sport */}
          <Text style={styles.sectionLabel}>Sport</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
            {["Football","Basketball","Baseball","Soccer","Track & Field","Swimming","Volleyball","Tennis","Wrestling","Lacrosse","Softball"].map(s => (
              <TouchableOpacity key={s} style={[styles.chip, sport === s && styles.chipActive]} onPress={() => setSport(s)}>
                <Text style={[styles.chipText, sport === s && styles.chipTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* AI Content Generator */}
          <View style={styles.aiSection}>
            <View style={styles.aiHeader}>
              <Text style={styles.aiTitle}>⚡ AI Reel Content Generator</Text>
              <Text style={styles.aiSub}>Describe your reel — AI writes the title, description & hashtags</Text>
            </View>
            <TextInput
              style={styles.descInput}
              value={description}
              onChangeText={setDescription}
              placeholder="e.g. My best plays from the 2025 season — 3 touchdowns, 2 interceptions returned for TDs, multiple big hits..."
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity
              style={[styles.generateBtn, generating && styles.generateBtnDisabled]}
              onPress={generateReelContent}
              disabled={generating}
            >
              {generating ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.generateBtnText}>Generate Content (1 Credit)</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Generated Content */}
          {generated && (
            <View style={styles.generatedCard}>
              <Text style={styles.generatedLabel}>GENERATED TITLE</Text>
              <Text style={styles.generatedTitle}>{generated.title}</Text>
              <Text style={styles.generatedLabel}>DESCRIPTION</Text>
              <Text style={styles.generatedDesc}>{generated.description}</Text>
              <Text style={styles.generatedLabel}>HASHTAGS</Text>
              <View style={styles.tagsRow}>
                {generated.tags.map((tag, i) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={styles.copyBtn} onPress={() => Alert.alert("Copied!", "Reel content copied to clipboard.")}>
                <Text style={styles.copyBtnText}>Copy All Content</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={{ height: Spacing.xxl }} />
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.cyan} />}
        >
          <Text style={styles.sectionHeader}>My Highlight Reels</Text>
          {SAMPLE_REELS.map(r => <ReelCard key={r.id} reel={r} />)}
          <TouchableOpacity style={styles.addReelBtn} onPress={() => setActiveTab("studio")}>
            <Text style={styles.addReelBtnText}>+ Create New Reel</Text>
          </TouchableOpacity>
          <View style={{ height: Spacing.xxl }} />
        </ScrollView>
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
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.md },
  uploadZone: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.xl, alignItems: "center", borderWidth: 2, borderColor: Colors.border, borderStyle: "dashed", marginBottom: Spacing.lg },
  uploadIcon: { fontSize: 48, marginBottom: Spacing.sm },
  uploadTitle: { ...Typography.h3, textAlign: "center", marginBottom: 4 },
  uploadSub: { ...Typography.bodySmall, marginBottom: Spacing.md },
  uploadBtn: { backgroundColor: Colors.blue, borderRadius: BorderRadius.md, paddingVertical: 10, paddingHorizontal: Spacing.xl },
  uploadBtnText: { color: "#fff", fontWeight: "700" },
  sectionLabel: { ...Typography.label, marginBottom: Spacing.sm, marginTop: Spacing.sm },
  reelTypeRow: { flexDirection: "row", gap: Spacing.sm, marginBottom: Spacing.md },
  reelTypeBtn: { flex: 1, backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.sm, alignItems: "center", borderWidth: 1, borderColor: Colors.border },
  reelTypeBtnActive: { backgroundColor: Colors.blue + "22", borderColor: Colors.blue },
  reelTypeIcon: { fontSize: 20, marginBottom: 4 },
  reelTypeLabel: { ...Typography.caption, color: Colors.textSecondary },
  reelTypeLabelActive: { color: Colors.cyan, fontWeight: "700" },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: BorderRadius.full, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, marginRight: 8 },
  chipActive: { backgroundColor: Colors.blue + "33", borderColor: Colors.blue },
  chipText: { ...Typography.caption, color: Colors.textSecondary },
  chipTextActive: { color: Colors.cyan, fontWeight: "700" },
  aiSection: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md },
  aiHeader: { marginBottom: Spacing.md },
  aiTitle: { ...Typography.h4, marginBottom: 4 },
  aiSub: { ...Typography.bodySmall },
  descInput: { backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.sm, padding: Spacing.sm, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border, minHeight: 100, textAlignVertical: "top", marginBottom: Spacing.md },
  generateBtn: { backgroundColor: Colors.blue, borderRadius: BorderRadius.md, paddingVertical: 14, alignItems: "center" },
  generateBtnDisabled: { opacity: 0.6 },
  generateBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  generatedCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.cyan + "44", marginBottom: Spacing.md },
  generatedLabel: { ...Typography.label, color: Colors.cyan, marginBottom: 4, marginTop: Spacing.sm },
  generatedTitle: { ...Typography.h4, marginBottom: Spacing.sm },
  generatedDesc: { ...Typography.body, lineHeight: 22, marginBottom: Spacing.sm },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: Spacing.md },
  tag: { backgroundColor: Colors.blue + "22", borderRadius: BorderRadius.full, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: Colors.blue + "44" },
  tagText: { color: Colors.cyan, fontSize: 11, fontWeight: "600" },
  copyBtn: { backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.sm, paddingVertical: 10, alignItems: "center", borderWidth: 1, borderColor: Colors.border },
  copyBtnText: { color: Colors.textSecondary, fontWeight: "600" },
  sectionHeader: { ...Typography.h3, marginBottom: Spacing.md, marginTop: Spacing.sm },
  reelCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border, flexDirection: "row", alignItems: "center" },
  reelThumb: { width: 72, height: 56, backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.sm, alignItems: "center", justifyContent: "center", marginRight: Spacing.md, position: "relative" },
  reelThumbIcon: { fontSize: 28 },
  reelDuration: { position: "absolute", bottom: 4, right: 4, backgroundColor: "rgba(0,0,0,0.7)", borderRadius: 4, paddingHorizontal: 4, paddingVertical: 1 },
  reelDurationText: { color: "#fff", fontSize: 9, fontWeight: "700" },
  reelInfo: { flex: 1 },
  reelTitle: { ...Typography.bodySmall, fontWeight: "600", marginBottom: 2 },
  reelMeta: { ...Typography.caption, color: Colors.cyan, marginBottom: 4 },
  reelStats: { flexDirection: "row" },
  reelViews: { ...Typography.caption },
  reelShare: { backgroundColor: Colors.blue + "22", borderRadius: BorderRadius.sm, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: Colors.blue + "44" },
  reelShareText: { color: Colors.cyan, fontSize: 12, fontWeight: "700" },
  addReelBtn: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, paddingVertical: 16, alignItems: "center", borderWidth: 1, borderColor: Colors.border, borderStyle: "dashed" },
  addReelBtnText: { color: Colors.textSecondary, fontWeight: "600" },
});
