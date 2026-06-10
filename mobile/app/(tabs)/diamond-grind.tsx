import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BorderRadius, Colors, Spacing, Typography } from "../../lib/theme";

const COBALT = "#1E90FF";

const modules = [
  {
    title: "Parent Gate First",
    label: "COPPA-SAFE",
    body: "Youth coaching content is locked until a parent or guardian confirms this device is being used with adult permission.",
  },
  {
    title: "Pitcher IQ",
    label: "ARM CARE",
    body: "Age-aware pitch counts, rest windows, warm-up rhythm, and mechanics notes are organized before any competitive workload guidance.",
  },
  {
    title: "Catcher IQ",
    label: "FIELD GENERAL",
    body: "Receiving, blocking, framing, game-calling, and leadership cues are packaged as simple player-first learning cards.",
  },
  {
    title: "Diamond Grind Path",
    label: "FUTURE READY",
    body: "The native path mirrors the web Diamond Grind IQ concept while keeping athlete safety, parent consent, and brand clarity first.",
  },
];

function ModuleCard({ title, label, body }: { title: string; label: string; body: string }) {
  return (
    <View style={styles.moduleCard}>
      <View style={styles.moduleHeader}>
        <Text style={styles.moduleLabel}>{label}</Text>
      </View>
      <Text style={styles.moduleTitle}>{title}</Text>
      <Text style={styles.moduleBody}>{body}</Text>
    </View>
  );
}

export default function DiamondGrindScreen() {
  const [parentConfirmed, setParentConfirmed] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>DIAMOND GRIND IQ</Text>
        <Text style={styles.title}>Baseball + Softball IQ</Text>
        <Text style={styles.subtitle}>
          Native athlete education for pitcher, catcher, and diamond-sport development.
        </Text>
      </View>

      {!parentConfirmed ? (
        <View style={styles.gateCard}>
          <Text style={styles.gateLabel}>PARENT / GUARDIAN GATE</Text>
          <Text style={styles.gateTitle}>Adult confirmation required</Text>
          <Text style={styles.gateText}>
            This screen contains youth sports coaching concepts. A parent or guardian must confirm access before coaching content is shown.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => setParentConfirmed(true)}>
            <Text style={styles.primaryButtonText}>I am a parent or guardian</Text>
          </TouchableOpacity>
          <Text style={styles.disclaimer}>
            AthlynXAI keeps youth development safety-first. This is not medical advice.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.unlockedBanner}>
            <Text style={styles.unlockedTitle}>Parent gate confirmed</Text>
            <Text style={styles.unlockedText}>Coaching modules are now visible on this device.</Text>
          </View>
          {modules.map((item) => (
            <ModuleCard key={item.title} {...item} />
          ))}
          <View style={styles.signoffCard}>
            <Text style={styles.signoffTitle}>ONE IDENTITY · EVERY ATHLETE</Text>
            <Text style={styles.signoffText}>Diamond Grind IQ is part of the Lifetime Athlete Identity path inside AthlynXAI.</Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  content: { padding: Spacing.md, paddingBottom: 36, gap: Spacing.md },
  hero: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: `${COBALT}66`,
    backgroundColor: "#050A12",
    padding: Spacing.lg,
  },
  eyebrow: { ...Typography.label, color: COBALT, marginBottom: 8 },
  title: { color: "#FFFFFF", fontSize: 30, fontWeight: "900", letterSpacing: -0.4 },
  subtitle: { color: Colors.textSecondary, fontSize: 15, lineHeight: 22, marginTop: 8 },
  gateCard: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: `${COBALT}88`,
    backgroundColor: "#070707",
    padding: Spacing.lg,
  },
  gateLabel: { color: COBALT, fontSize: 11, fontWeight: "900", letterSpacing: 1.2, marginBottom: 10 },
  gateTitle: { color: "#FFFFFF", fontSize: 22, fontWeight: "900", marginBottom: 8 },
  gateText: { color: Colors.textSecondary, fontSize: 15, lineHeight: 23, marginBottom: Spacing.lg },
  primaryButton: {
    backgroundColor: COBALT,
    borderRadius: BorderRadius.md,
    paddingVertical: 15,
    alignItems: "center",
  },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },
  disclaimer: { color: Colors.textMuted, fontSize: 12, lineHeight: 18, marginTop: Spacing.md, textAlign: "center" },
  unlockedBanner: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: `${COBALT}66`,
    backgroundColor: "#061425",
    padding: Spacing.md,
  },
  unlockedTitle: { color: "#FFFFFF", fontWeight: "900", fontSize: 16 },
  unlockedText: { color: Colors.textSecondary, marginTop: 4 },
  moduleCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "#070707",
    padding: Spacing.md,
  },
  moduleHeader: { alignSelf: "flex-start", borderRadius: BorderRadius.full, borderWidth: 1, borderColor: COBALT, paddingHorizontal: 9, paddingVertical: 4, marginBottom: 10 },
  moduleLabel: { color: COBALT, fontSize: 10, fontWeight: "900" },
  moduleTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "900", marginBottom: 7 },
  moduleBody: { color: Colors.textSecondary, fontSize: 14, lineHeight: 21 },
  signoffCard: { borderRadius: BorderRadius.lg, backgroundColor: "#050A12", padding: Spacing.md, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  signoffTitle: { color: COBALT, fontWeight: "900", fontSize: 12, letterSpacing: 1 },
  signoffText: { color: Colors.textSecondary, lineHeight: 20, marginTop: 6 },
});
