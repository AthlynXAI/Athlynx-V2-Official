/**
 * AthlynX Welcome Screen — v2.0.0
 * Splash: Black background, AthlynX mark + wordmark, stadium hero
 * "The Athlete's Playbook. Be The Legacy."
 */
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { Colors, BorderRadius } from "../../lib/theme";

const { width: W, height: H } = Dimensions.get("window");

export default function WelcomeScreen() {
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
      ]),
      Animated.timing(contentOpacity, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.root}>
      {/* Stadium background with dark overlay */}
      <ImageBackground
        source={require("../../assets/onboarding_hero_bg.png")}
        style={styles.bg}
        imageStyle={styles.bgImage}
      >
        <View style={styles.bgOverlay} />
      </ImageBackground>

      {/* Content */}
      <View style={styles.content}>
        {/* Logo section */}
        <Animated.View style={[styles.logoSection, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
          <Image
            source={require("../../assets/splash_mark_real.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Taglines */}
        <Animated.View style={[styles.taglineSection, { opacity: contentOpacity }]}>
          <Text style={styles.tagline1}>THE ATHLETE'S PLAYBOOK</Text>
          <View style={styles.taglineDivider} />
          <Text style={styles.tagline2}>BE THE LEGACY</Text>

          {/* Feature pills */}
          <View style={styles.pillsRow}>
            {["Recruiting", "NIL Deals", "AI Scout", "Transfer Portal", "Diamond Grind", "Highlights"].map((f) => (
              <View key={f} style={styles.pill}>
                <Text style={styles.pillText}>{f}</Text>
              </View>
            ))}
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>44</Text>
              <Text style={styles.statLabel}>Sports</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>500K+</Text>
              <Text style={styles.statLabel}>Athletes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>$2B+</Text>
              <Text style={styles.statLabel}>NIL Market</Text>
            </View>
          </View>
        </Animated.View>

        {/* CTA Buttons */}
        <Animated.View style={[styles.ctaSection, { opacity: contentOpacity }]}>
          <Pressable
            style={styles.ctaPrimary}
            onPress={() => router.push("/(auth)/register")}
          >
            <Text style={styles.ctaPrimaryText}>Get Started — It's Free</Text>
          </Pressable>
          <Pressable
            style={styles.ctaSecondary}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={styles.ctaSecondaryText}>Sign In</Text>
          </Pressable>
          <Text style={styles.betaNote}>
            Beta · Full launch July 1, 2026
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.black },
  bg: { ...StyleSheet.absoluteFillObject },
  bgImage: {},
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.72)",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 80,
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  logoSection: { alignItems: "center" },
  logo: { width: 200, height: 200 },
  taglineSection: { alignItems: "center", width: "100%" },
  tagline1: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 3.5,
    textTransform: "uppercase",
    textAlign: "center",
  },
  taglineDivider: {
    width: 48,
    height: 2,
    backgroundColor: Colors.electric,
    borderRadius: 1,
    marginVertical: 14,
  },
  tagline2: {
    color: Colors.textPrimary,
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: -0.5,
    textAlign: "center",
    marginBottom: 24,
  },
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  pill: {
    backgroundColor: Colors.electricGlow,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.electricBorder,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  pillText: { color: Colors.electric, fontSize: 12, fontWeight: "600" },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    backgroundColor: Colors.granite800,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.electricBorder,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  stat: { alignItems: "center" },
  statNum: { color: Colors.electric, fontSize: 22, fontWeight: "900" },
  statLabel: { color: Colors.textMuted, fontSize: 11, fontWeight: "600", marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.electricBorder },
  ctaSection: { width: "100%", gap: 12, alignItems: "center" },
  ctaPrimary: {
    width: "100%",
    backgroundColor: Colors.electric,
    borderRadius: BorderRadius.full,
    paddingVertical: 16,
    alignItems: "center",
  },
  ctaPrimaryText: { color: Colors.black, fontSize: 16, fontWeight: "900", letterSpacing: 0.3 },
  ctaSecondary: {
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.electricBorderStrong,
    paddingVertical: 15,
    alignItems: "center",
  },
  ctaSecondaryText: { color: Colors.textPrimary, fontSize: 16, fontWeight: "700" },
  betaNote: { color: Colors.textMuted, fontSize: 12, marginTop: 4 },
});
