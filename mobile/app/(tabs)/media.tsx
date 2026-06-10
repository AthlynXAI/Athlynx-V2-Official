import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking } from "react-native";
import { Colors, Spacing, BorderRadius, Typography } from "../../lib/theme";

const links = [
  {
    label: "Listen on Spotify",
    description: "Open The Athlete’s Playbook — Episode 1 public Spotify page.",
    url: "https://open.spotify.com/episode/3pBeGKonds1DoM39P2zhlq",
  },
  {
    label: "Suno source track",
    description: "Open Blueprint to Glory, the approved Suno music bed for Episode 1.",
    url: "https://suno.com/song/c9c8c213-b200-4b04-b8fa-e1b9769514a1",
  },
  {
    label: "AthlynXAI OS launch page",
    description: "Open the web launch route that connects Spotify, Suno, AXN, and the OS vault.",
    url: "https://athlynx.ai/the-athletes-playbook/episode-1",
  },
];

async function openUrl(url: string) {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  }
}

export default function MediaScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <Text style={styles.kicker}>AXN • AthlynXAI • The Athlete’s Playbook</Text>
        <Text style={styles.title}>Episode 1 is live</Text>
        <Text style={styles.subtitle}>
          The mobile app now connects athletes directly to the same Episode 1 media stack as the web platform: Spotify distribution, Suno source music, AXN positioning, and AthlynXAI OS continuity.
        </Text>
      </View>

      <View style={styles.statusGrid}>
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Format</Text>
          <Text style={styles.statusValue}>Video</Text>
        </View>
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Length</Text>
          <Text style={styles.statusValue}>01:46</Text>
        </View>
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Voice</Text>
          <Text style={styles.statusValue}>Lee</Text>
        </View>
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Music</Text>
          <Text style={styles.statusValue}>Suno</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Episode 1 continuity links</Text>
        {links.map((link) => (
          <TouchableOpacity key={link.url} style={styles.linkCard} onPress={() => openUrl(link.url)}>
            <View style={styles.linkTextWrap}>
              <Text style={styles.linkTitle}>{link.label}</Text>
              <Text style={styles.linkDescription}>{link.description}</Text>
            </View>
            <Text style={styles.linkArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.doctrineCard}>
        <Text style={styles.sectionTitle}>Why this matters</Text>
        <Text style={styles.body}>
          AthlynXAI OS owns the continuity layer. External platforms create and distribute, but the app keeps athletes connected to the source-of-truth media, recruiting, NIL, profile, messaging, and feedback loops.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: 36, gap: Spacing.md },
  heroCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  kicker: { ...Typography.label, color: Colors.cyan, marginBottom: Spacing.sm },
  title: { ...Typography.h1, marginBottom: Spacing.sm },
  subtitle: { ...Typography.body, color: Colors.textSecondary, lineHeight: 23 },
  statusGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  statusCard: {
    width: "48%",
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  statusLabel: { ...Typography.label, marginBottom: 6 },
  statusValue: { ...Typography.h3, color: Colors.textPrimary },
  section: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  sectionTitle: { ...Typography.h3, marginBottom: Spacing.sm },
  linkCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.navy,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  linkTextWrap: { flex: 1 },
  linkTitle: { ...Typography.h4, marginBottom: 4 },
  linkDescription: { ...Typography.bodySmall, lineHeight: 18 },
  linkArrow: { color: Colors.cyan, fontSize: 34, fontWeight: "300" },
  doctrineCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  body: { ...Typography.body, color: Colors.textSecondary, lineHeight: 23 },
});
