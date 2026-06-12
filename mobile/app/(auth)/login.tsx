/**
 * AthlynXAI — Login Screen
 * Auth0 PKCE ONLY. One button. Opens Auth0 Universal Login.
 * No email/password form. No Supabase. No Firebase.
 */
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { Colors } from "../../lib/theme";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (loading) return;
    setLoading(true);
    try {
      await signIn();
      router.replace("/(tabs)");
    } catch (err: any) {
      if (err?.message !== "Login cancelled") {
        Alert.alert("Sign In Failed", err?.message || "Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoSection}>
        <Image
          source={require("../../assets/splash_mark_real.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.wordmark}>ATHLYNXAI</Text>
        <Text style={styles.tagline}>The Athlete's Playbook</Text>
      </View>

      {/* Auth Button */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={styles.authButton}
          onPress={handleSignIn}
          disabled={loading}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[Colors.blue ?? "#0066FF", Colors.cyan ?? "#00CCFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.buttonText}>Continue with AthlynXAI</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          By continuing, you agree to AthlynXAI's Terms of Service and Privacy Policy.
          New users will be prompted to create an account.
        </Text>
      </View>

      {/* Back */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 48,
  },
  logoSection: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  wordmark: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 4,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: "#888888",
    letterSpacing: 1,
  },
  buttonSection: {
    gap: 16,
  },
  authButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  gradient: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  disclaimer: {
    color: "#555555",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
  },
  backBtn: {
    position: "absolute",
    top: 48,
    left: 24,
    padding: 8,
  },
  backText: {
    color: "#888888",
    fontSize: 14,
  },
});
