/**
 * AthlynXAI — Athlete Card (Public Shareable Profile) Mobile Screen
 * S41 — Shareable public athlete profile card with QR code, stats, and social links
 */
import { useState, useEffect } from "react";
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, Share,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { profileApi, aiApi } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";
import { Colors, Spacing, BorderRadius, Typography } from "../../lib/theme";

interface Profile {
  sport?: string;
  position?: string;
  school?: string;
  height?: string;
  weight?: string;
  gpa?: number;
  classYear?: string;
  state?: string;
  bio?: string;
  recruitingStatus?: string;
  nilValue?: number;
  nilVerified?: boolean;
  followers?: number;
  coachViews?: number;
  collegesInterested?: number;
  recruitingScore?: number;
  instagram?: string;
  twitter?: string;
  tiktokHandle?: string;
}

function StatPill({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <View style={styles.statPill}>
      <Text style={[styles.statPillValue, color ? { color } : {}]}>{value}</Text>
      <Text style={styles.statPillLabel}>{label}</Text>
    </View>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon?: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoIcon}>{icon || "•"}</Text>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function AthleteCardScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [xScore, setXScore] = useState<number>(0);
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<"card" | "share">("card");

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [p, x, c] = await Promise.allSettled([
        profileApi.getMyProfile(),
        aiApi.getXFactorScore(),
        aiApi.getCredits(),
      ]);
      if (p.status === "fulfilled") setProfile(p.value);
      if (x.status === "fulfilled") setXScore((x.value as any)?.score || 0);
      if (c.status === "fulfilled") setCredits((c.value as any)?.credits || 0);
    } catch (err) {
      console.error("Athlete card load error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function shareCard() {
    const profileUrl = `https://athlynx.ai/athlete-card/${user?.id || "me"}`;
    try {
      await Share.share({
        title: `${user?.name || "Athlete"} — AthlynXAI Profile`,
        message: `Check out my AthlynXAI athlete profile! ${profileUrl}\n\n${profile?.sport || "Athlete"} · ${profile?.position || ""} · ${profile?.school || ""}\nX-Factor Score: ${xScore} · NIL Value: $${(profile?.nilValue || 0).toLocaleString()}`,
        url: profileUrl,
      });
    } catch (err) {
      Alert.alert("Share", `Profile link: ${profileUrl}`);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.cyan} />
      </View>
    );
  }

  const nilValue = profile?.nilValue || 0;
  const recruitingScore = profile?.recruitingScore || xScore;
  const statusColor = recruitingScore >= 80 ? Colors.success : recruitingScore >= 60 ? Colors.cyan : Colors.warning;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Card Header */}
      <LinearGradient
        colors={["#0D1F3C", "#0A1628"]}
        style={styles.cardHeader}
      >
        {/* X-Factor Ring */}
        <View style={styles.xfRing}>
          <LinearGradient colors={[Colors.blue, Colors.cyan]} style={styles.xfRingGradient}>
            <View style={styles.xfRingInner}>
              <Text style={styles.xfScore}>{recruitingScore}</Text>
              <Text style={styles.xfLabel}>X-FACTOR</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Name & Position */}
        <Text style={styles.athleteName}>{user?.name || "Athlete"}</Text>
        <Text style={styles.athletePosition}>
          {[profile?.position, profile?.sport, profile?.classYear].filter(Boolean).join(" · ") || "Athlete"}
        </Text>
        <Text style={styles.athleteSchool}>{profile?.school || "School not set"}</Text>

        {/* NIL Badge */}
        {nilValue > 0 && (
          <View style={styles.nilBadge}>
            <Text style={styles.nilBadgeText}>💰 NIL Value: ${nilValue.toLocaleString()}</Text>
            {profile?.nilVerified && <Text style={styles.nilVerified}> ✓ Verified</Text>}
          </View>
        )}

        {/* Recruiting Status */}
        <View style={[styles.recruitingBadge, { backgroundColor: statusColor + "22", borderColor: statusColor + "44" }]}>
          <Text style={[styles.recruitingBadgeText, { color: statusColor }]}>
            {profile?.recruitingStatus || "Actively Recruiting"}
          </Text>
        </View>
      </LinearGradient>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatPill label="Followers" value={(profile?.followers || 0).toLocaleString()} color={Colors.cyan} />
        <StatPill label="Coach Views" value={(profile?.coachViews || 0).toLocaleString()} color={Colors.blue} />
        <StatPill label="Schools" value={profile?.collegesInterested || 0} color={Colors.success} />
        <StatPill label="Credits" value={credits.toLocaleString()} color={Colors.gold} />
      </View>

      {/* Profile Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Details</Text>
        {profile?.height && <InfoRow icon="📏" label="Height" value={profile.height} />}
        {profile?.weight && <InfoRow icon="⚖️" label="Weight" value={profile.weight} />}
        {profile?.gpa && <InfoRow icon="📚" label="GPA" value={String(profile.gpa)} />}
        {profile?.state && <InfoRow icon="📍" label="State" value={profile.state} />}
        {profile?.classYear && <InfoRow icon="🎓" label="Class" value={profile.classYear} />}
        {!profile?.height && !profile?.weight && !profile?.gpa && (
          <Text style={styles.emptyText}>Complete your profile to show stats here</Text>
        )}
      </View>

      {/* Bio */}
      {profile?.bio && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bio</Text>
          <Text style={styles.bioText}>{profile.bio}</Text>
        </View>
      )}

      {/* Social Links */}
      {(profile?.instagram || profile?.twitter || profile?.tiktokHandle) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social</Text>
          {profile?.instagram && <InfoRow icon="📸" label="Instagram" value={`@${profile.instagram}`} />}
          {profile?.twitter && <InfoRow icon="𝕏" label="X (Twitter)" value={`@${profile.twitter}`} />}
          {profile?.tiktokHandle && <InfoRow icon="🎵" label="TikTok" value={`@${profile.tiktokHandle}`} />}
        </View>
      )}

      {/* Share Card */}
      <View style={styles.shareSection}>
        <Text style={styles.shareSectionTitle}>Share Your Athlete Card</Text>
        <Text style={styles.shareSectionSub}>Send your profile to coaches, scouts, and brands</Text>
        <TouchableOpacity style={styles.shareBtn} onPress={shareCard}>
          <Text style={styles.shareBtnText}>📤 Share My Athlete Card</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.copyLinkBtn}
          onPress={() => Alert.alert("Link Copied", `https://athlynx.ai/athlete-card/${user?.id || "me"}`)}
        >
          <Text style={styles.copyLinkText}>🔗 Copy Profile Link</Text>
        </TouchableOpacity>
      </View>

      {/* AthlynXAI Branding */}
      <View style={styles.branding}>
        <Text style={styles.brandingText}>⚡ AthlynXAI · The Complete Athlete Platform</Text>
        <Text style={styles.brandingUrl}>athlynx.ai</Text>
      </View>

      <View style={{ height: Spacing.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xxl },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.background },
  cardHeader: { padding: Spacing.xl, alignItems: "center", borderBottomWidth: 1, borderBottomColor: Colors.border },
  xfRing: { width: 100, height: 100, borderRadius: 50, marginBottom: Spacing.md },
  xfRingGradient: { width: 100, height: 100, borderRadius: 50, padding: 3 },
  xfRingInner: { flex: 1, borderRadius: 47, backgroundColor: Colors.background, alignItems: "center", justifyContent: "center" },
  xfScore: { fontSize: 28, fontWeight: "800", color: Colors.cyan },
  xfLabel: { fontSize: 9, fontWeight: "800", color: Colors.textSecondary, letterSpacing: 1.5 },
  athleteName: { ...Typography.h1, textAlign: "center", marginBottom: 4 },
  athletePosition: { ...Typography.body, color: Colors.cyan, textAlign: "center", marginBottom: 4 },
  athleteSchool: { ...Typography.bodySmall, textAlign: "center", marginBottom: Spacing.md },
  nilBadge: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.success + "22", borderRadius: BorderRadius.full, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: Colors.success + "44", marginBottom: Spacing.sm },
  nilBadgeText: { color: Colors.success, fontWeight: "700", fontSize: 13 },
  nilVerified: { color: Colors.success, fontWeight: "700", fontSize: 12 },
  recruitingBadge: { borderRadius: BorderRadius.full, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, marginTop: 4 },
  recruitingBadgeText: { fontWeight: "700", fontSize: 12 },
  statsGrid: { flexDirection: "row", padding: Spacing.md, gap: Spacing.sm },
  statPill: { flex: 1, backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.sm, alignItems: "center", borderWidth: 1, borderColor: Colors.border },
  statPillValue: { fontSize: 18, fontWeight: "800", color: Colors.textPrimary, marginBottom: 2 },
  statPillLabel: { ...Typography.caption },
  section: { marginHorizontal: Spacing.md, marginBottom: Spacing.md, backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  sectionTitle: { ...Typography.label, color: Colors.cyan, marginBottom: Spacing.sm },
  infoRow: { flexDirection: "row", alignItems: "center", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: Colors.border },
  infoIcon: { width: 24, fontSize: 14, textAlign: "center" },
  infoLabel: { ...Typography.bodySmall, flex: 1, marginLeft: Spacing.sm, color: Colors.textSecondary },
  infoValue: { ...Typography.bodySmall, fontWeight: "600", color: Colors.textPrimary },
  emptyText: { ...Typography.bodySmall, textAlign: "center", paddingVertical: Spacing.sm },
  bioText: { ...Typography.body, lineHeight: 22 },
  shareSection: { marginHorizontal: Spacing.md, marginBottom: Spacing.md, backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.blue + "44", alignItems: "center" },
  shareSectionTitle: { ...Typography.h3, textAlign: "center", marginBottom: 4 },
  shareSectionSub: { ...Typography.bodySmall, textAlign: "center", marginBottom: Spacing.lg },
  shareBtn: { backgroundColor: Colors.blue, borderRadius: BorderRadius.md, paddingVertical: 14, paddingHorizontal: Spacing.xl, marginBottom: Spacing.sm, width: "100%", alignItems: "center" },
  shareBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  copyLinkBtn: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, paddingVertical: 12, paddingHorizontal: Spacing.xl, borderWidth: 1, borderColor: Colors.border, width: "100%", alignItems: "center" },
  copyLinkText: { color: Colors.textSecondary, fontWeight: "600" },
  branding: { alignItems: "center", paddingVertical: Spacing.lg },
  brandingText: { ...Typography.caption, color: Colors.textMuted },
  brandingUrl: { ...Typography.caption, color: Colors.cyan, marginTop: 2 },
});
