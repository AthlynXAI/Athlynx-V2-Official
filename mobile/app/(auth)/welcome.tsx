import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Spacing, BorderRadius, Typography } from "../../lib/theme";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={["#0A1628", "#0D1F3C", "#0A1628"]}
      style={styles.container}
    >
      {/* Engine Mark — horned owl, blue/gold infinity, circuit substrate */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/intro-hero-engine-mark.png")}
          style={styles.engineMark}
          resizeMode="contain"
          accessibilityLabel="AthlynXAI Engine Mark"
        />
        <Text style={styles.appName}>AthlynXAI</Text>
        <Text style={styles.tagline}>The Complete Athlete Platform</Text>
      </View>

      {/* Feature Pills */}
      <View style={styles.features}>
        {[
          { icon: "🏆", label: "Recruiting" },
          { icon: "💰", label: "NIL Deals" },
          { icon: "⚡", label: "X-Factor" },
          { icon: "🔄", label: "Transfer Portal" },
          { icon: "🤖", label: "AI Coaching" },
          { icon: "💬", label: "Messaging" },
        ].map((f) => (
          <View key={f.label} style={styles.featurePill}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <Text style={styles.featureLabel}>{f.label}</Text>
          </View>
        ))}
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>44</Text>
          <Text style={styles.statLabel}>Sports</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>180+</Text>
          <Text style={styles.statLabel}>Features</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>$47B</Text>
          <Text style={styles.statLabel}>Market</Text>
        </View>
      </View>

      {/* CTA Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/(auth)/register")}
        >
          <LinearGradient
            colors={[Colors.blue, Colors.cyan]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.primaryButtonText}>Get Started Free</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.secondaryButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        AthlynXAI Corporation · Houston, TX{"\n"}
        Iron Sharpens Iron — Proverbs 27:17
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 60,
    paddingHorizontal: Spacing.lg,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  engineMark: {
    width: 160,
    height: 160,
    marginBottom: Spacing.md,
    shadowColor: Colors.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 24,
    elevation: 12,
  },
  appName: {
    fontSize: 36,
    fontWeight: "900",
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 6,
    letterSpacing: 0.5,
  },
  features: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: Spacing.md,
  },
  featurePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  featureIcon: { fontSize: 14 },
  featureLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.lg,
  },
  stat: { alignItems: "center" },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.cyan,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
  },
  buttons: {
    width: "100%",
    gap: Spacing.md,
  },
  primaryButton: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  footer: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 18,
  },
});
