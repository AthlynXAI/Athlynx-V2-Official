import { useState, useEffect } from "react";
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Camera, Medal, MapPin, School, GraduationCap, BookOpen,
  Scale, Target, Music2, Trophy, DollarSign, Zap, MessageCircle, Link2
} from "lucide-react-native";
import { profileApi, mediaApi } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";
import { Colors, Spacing, BorderRadius, Typography } from "../../lib/theme";
import * as ImagePicker from "expo-image-picker";

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

function StatBox({ value, label, color }: { value: string | number; label: string; color?: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statBoxValue, color ? { color } : {}]}>{value}</Text>
      <Text style={styles.statBoxLabel}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => { loadProfile(); }, []);

  async function loadProfile() {
    try {
      const data = await profileApi.getMyProfile();
      setProfile(data);
    } catch (err) {
      console.error("Profile error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handlePhotoUpload() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please allow photo access in Settings to update your profile photo.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    setUploadingPhoto(true);
    try {
      const filename = `avatar_${user?.id || "me"}_${Date.now()}.jpg`;
      const { uploadUrl, publicUrl, fallback } = await mediaApi.getUploadUrl({
        filename,
        contentType: "image/jpeg",
        mediaType: "profile_photo",
        fileSizeBytes: asset.fileSize || 500000,
      });
      if (!fallback && uploadUrl) {
        // Upload directly to S3
        const photoData = await fetch(asset.uri);
        const blob = await photoData.blob();
        await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": "image/jpeg" },
          body: blob,
        });
      }
      await mediaApi.updateAvatar(publicUrl);
      await loadProfile();
      Alert.alert("Success", "Profile photo updated!");
    } catch (err) {
      Alert.alert("Upload Failed", "Could not upload photo. Please try again or use athlynx.ai on your browser.");
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleSignOut() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/(auth)/welcome");
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.cyan} />
      </View>
    );
  }

  const xFactorScore = profile?.recruitingScore || 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <LinearGradient colors={[Colors.navyLight, Colors.background]} style={styles.header}>
        {/* X-Factor Score Ring */}
        <View style={styles.xfactorRing}>
          <View style={styles.xfactorInner}>
            <Text style={styles.xfactorScore}>{xFactorScore}</Text>
            <Text style={styles.xfactorLabel}>X-FACTOR</Text>
          </View>
        </View>

        {/* Photo Upload Button */}
        <TouchableOpacity style={styles.photoUploadBtn} onPress={handlePhotoUpload} disabled={uploadingPhoto}>
          <View style={styles.photoCircle}>
            <Text style={styles.photoInitial}>{(user?.name || "A").charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.photoCameraIcon}>
            {uploadingPhoto
              ? <ActivityIndicator size="small" color={Colors.cyan} />
              : <Camera size={16} color={Colors.cyan} />
            }
          </View>
        </TouchableOpacity>
        <Text style={styles.userName}>{user?.name || "Athlete"}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>

        {profile && (
          <Text style={styles.userDetails}>
            {[profile.sport, profile.position, profile.school].filter(Boolean).join(" · ")}
          </Text>
        )}

        {profile?.bio && (
          <Text style={styles.bio}>{profile.bio}</Text>
        )}

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatBox value={profile?.followers || 0} label="Followers" />
          <View style={styles.statDivider} />
          <StatBox value={profile?.coachViews || 0} label="Coach Views" color={Colors.cyan} />
          <View style={styles.statDivider} />
          <StatBox value={profile?.collegesInterested || 0} label="Colleges" color={Colors.success} />
        </View>
      </LinearGradient>

      {/* NIL Value Card */}
      {profile?.nilValue !== undefined && (
        <View style={styles.nilCard}>
          <View style={styles.nilLeft}>
            <Text style={styles.nilLabel}>NIL VALUE</Text>
            <Text style={styles.nilValue}>${(profile.nilValue || 0).toLocaleString()}</Text>
          </View>
          {profile.nilVerified && (
            <View style={styles.nilVerified}>
              <Text style={styles.nilVerifiedText}>✓ NIL Verified</Text>
            </View>
          )}
        </View>
      )}

      {/* Profile Details */}
      {profile && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ATHLETE INFO</Text>
          <View style={styles.detailsGrid}>
            {profile.sport && <DetailRow Icon={Medal} label="Sport" value={profile.sport} />}
            {profile.position && <DetailRow Icon={MapPin} label="Position" value={profile.position} />}
            {profile.school && <DetailRow Icon={School} label="School" value={profile.school} />}
            {profile.classYear && <DetailRow Icon={GraduationCap} label="Class" value={profile.classYear} />}
            {profile.state && <DetailRow Icon={MapPin} label="State" value={profile.state} />}
            {profile.height && <DetailRow Icon={Scale} label="Height" value={profile.height} />}
            {profile.weight && <DetailRow Icon={Scale} label="Weight" value={profile.weight} />}
            {profile.gpa && <DetailRow Icon={BookOpen} label="GPA" value={profile.gpa.toFixed(2)} />}
            {profile.recruitingStatus && (
              <DetailRow Icon={Target} label="Status" value={profile.recruitingStatus} highlight />
            )}
          </View>
        </View>
      )}

      {/* Social Links */}
      {(profile?.instagram || profile?.twitter || profile?.tiktokHandle) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SOCIAL</Text>
          <View style={styles.socialRow}>
            {profile.instagram && (
              <View style={styles.socialChip}>
                <Link2 size={16} color={Colors.textSecondary} />
                <Text style={styles.socialHandle}>@{profile.instagram}</Text>
              </View>
            )}
            {profile.twitter && (
              <View style={styles.socialChip}>
                <Text style={styles.socialIcon}>𝕏</Text>
                <Text style={styles.socialHandle}>@{profile.twitter}</Text>
              </View>
            )}
            {profile.tiktokHandle && (
              <View style={styles.socialChip}>
                <Music2 size={16} color={Colors.textSecondary} />
                <Text style={styles.socialHandle}>@{profile.tiktokHandle}</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Quick Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PLATFORM</Text>
        <View style={styles.quickLinks}>
          {[
            { Icon: Trophy,         label: "Recruiting Hub", route: "/(tabs)/recruiting" },
            { Icon: DollarSign,     label: "NIL Deals",      route: "/(tabs)/nil" },
            { Icon: Zap,            label: "X-Factor Feed",  route: "/(tabs)" },
            { Icon: MessageCircle,  label: "Messages",       route: "/(tabs)/messages" },
          ].map((link) => (
            <TouchableOpacity
              key={link.label}
              style={styles.quickLink}
              onPress={() => router.push(link.route as any)}
            >
              <link.Icon size={18} color={Colors.cyan} />
              <Text style={styles.quickLinkLabel}>{link.label}</Text>
              <Text style={styles.quickLinkArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sign Out */}
      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        AthlynXAI Corporation · Houston, TX{"\n"}
        Iron Sharpens Iron — Proverbs 27:17
      </Text>
    </ScrollView>
  );
}

function DetailRow({ Icon, label, value, highlight }: { Icon: React.ComponentType<{ size: number; color: string }>; label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.detailRow}>
      <Icon size={14} color={Colors.textSecondary} />
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, highlight && { color: Colors.cyan }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 40 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.background },
  header: {
    alignItems: "center", paddingTop: 30, paddingBottom: 24,
    paddingHorizontal: Spacing.lg, gap: 8,
  },
  xfactorRing: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 3, borderColor: Colors.cyan,
    justifyContent: "center", alignItems: "center",
    marginBottom: 8,
    shadowColor: Colors.cyan, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 12, elevation: 8,
  },
  xfactorInner: { alignItems: "center" },
  xfactorScore: { fontSize: 32, fontWeight: "900", color: Colors.cyan },
  xfactorLabel: { fontSize: 9, fontWeight: "700", color: Colors.textSecondary, letterSpacing: 1 },
  userName: { ...Typography.h2, marginTop: 4 },
  userEmail: { color: Colors.textSecondary, fontSize: 13 },
  userDetails: { color: Colors.textSecondary, fontSize: 14, textAlign: "center" },
  bio: { color: Colors.textSecondary, fontSize: 14, textAlign: "center", lineHeight: 20, paddingHorizontal: 20 },
  statsRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    paddingVertical: 14, paddingHorizontal: 24,
    borderWidth: 1, borderColor: Colors.border,
    gap: Spacing.lg, marginTop: 8,
  },
  statBox: { alignItems: "center" },
  statBoxValue: { fontSize: 20, fontWeight: "800", color: Colors.textPrimary },
  statBoxLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: Colors.border },
  nilCard: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: Colors.surface, marginHorizontal: Spacing.md, marginTop: Spacing.md,
    borderRadius: BorderRadius.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.success + "44",
  },
  nilLeft: {},
  nilLabel: { ...Typography.label, color: Colors.textMuted },
  nilValue: { fontSize: 24, fontWeight: "800", color: Colors.success, marginTop: 2 },
  nilVerified: {
    backgroundColor: Colors.success + "22", paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.success,
  },
  nilVerifiedText: { color: Colors.success, fontWeight: "700", fontSize: 12 },
  section: { marginHorizontal: Spacing.md, marginTop: Spacing.lg },
  sectionTitle: { ...Typography.label, marginBottom: Spacing.sm },
  detailsGrid: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, overflow: "hidden",
  },
  detailRow: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: Spacing.md, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  detailIcon: { fontSize: 16, width: 24 },
  detailLabel: { color: Colors.textSecondary, fontSize: 14, flex: 1 },
  detailValue: { color: Colors.textPrimary, fontSize: 14, fontWeight: "600" },
  socialRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  socialChip: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.surface, borderRadius: BorderRadius.full,
    paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: Colors.border, gap: 6,
  },
  socialIcon: { fontSize: 14 },
  socialHandle: { color: Colors.textSecondary, fontSize: 13 },
  quickLinks: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, overflow: "hidden",
  },
  quickLink: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: Spacing.md, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  quickLinkIcon: { fontSize: 18, width: 28 },
  quickLinkLabel: { flex: 1, color: Colors.textPrimary, fontSize: 15 },
  quickLinkArrow: { color: Colors.textMuted, fontSize: 20 },
  signOutBtn: {
    marginHorizontal: Spacing.md, marginTop: Spacing.xl,
    paddingVertical: 14, alignItems: "center",
    borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.error + "44",
  },
  signOutText: { color: Colors.error, fontWeight: "600", fontSize: 15 },
  footer: {
    fontSize: 11, color: Colors.textMuted, textAlign: "center",
    lineHeight: 18, marginTop: Spacing.xl, paddingHorizontal: Spacing.lg,
  },
  photoUploadBtn: { position: "relative", marginBottom: 4 },
  photoCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.blue + "33", borderWidth: 2, borderColor: Colors.cyan,
    alignItems: "center", justifyContent: "center",
  },
  photoInitial: { fontSize: 28, fontWeight: "800", color: Colors.cyan },
  photoCameraIcon: {
    position: "absolute", bottom: 0, right: 0,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.navyLight, borderWidth: 1, borderColor: Colors.border,
    alignItems: "center", justifyContent: "center",
  },
  photoCameraText: { fontSize: 12 },
});
