import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Spacing, BorderRadius, Typography } from "../../lib/theme";
import { useAuth } from "../../contexts/AuthContext";

const SPORTS = [
  "Football", "Basketball", "Baseball", "Soccer", "Track & Field",
  "Swimming", "Tennis", "Golf", "Volleyball", "Softball",
  "Wrestling", "Lacrosse", "Hockey", "Cross Country", "Other"
];

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sport, setSport] = useState("");
  const [showSports, setShowSports] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    try {
      await signUp({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        sport,
      });
      router.replace("/(tabs)");
    } catch (err: any) {
      const message = err?.message || "Please try again";
      setErrorMessage(message);
      Alert.alert("Registration Failed", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>A</Text>
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join 520K+ athletes on AthlynXAI</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>FULL NAME *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Chad Dozier"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="athlete@example.com"
              placeholderTextColor={Colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>PASSWORD *</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Min. 8 characters"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>SPORT</Text>
            <TouchableOpacity
              style={[styles.input, styles.selectInput]}
              onPress={() => setShowSports(!showSports)}
            >
              <Text style={sport ? styles.selectValue : styles.selectPlaceholder}>
                {sport || "Select your sport"}
              </Text>
              <Text style={styles.selectArrow}>{showSports ? "▲" : "▼"}</Text>
            </TouchableOpacity>
            {showSports && (
              <View style={styles.sportsList}>
                {SPORTS.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.sportItem, sport === s && styles.sportItemActive]}
                    onPress={() => { setSport(s); setShowSports(false); }}
                  >
                    <Text style={[styles.sportItemText, sport === s && styles.sportItemTextActive]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
          >
            <LinearGradient
              colors={[Colors.blue, Colors.cyan]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.registerButtonText}>Create Account</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.terms}>
            By creating an account, you agree to our{" "}
            <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={styles.loginLinkText}>
              Already have an account? <Text style={styles.loginLinkHighlight}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingBottom: 40 },
  header: { alignItems: "center", paddingTop: 60, paddingBottom: 32 },
  backBtn: { alignSelf: "flex-start", marginBottom: 24 },
  backText: { color: Colors.cyan, fontSize: 16 },
  logoCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.blue, justifyContent: "center",
    alignItems: "center", marginBottom: Spacing.md,
  },
  logoText: { fontSize: 32, fontWeight: "900", color: "#FFF" },
  title: { ...Typography.h2, marginBottom: 8 },
  subtitle: { ...Typography.body, color: Colors.textSecondary },
  form: { gap: Spacing.md },
  inputGroup: { gap: 6 },
  label: { ...Typography.label },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    color: Colors.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectInput: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  selectValue: { color: Colors.textPrimary, fontSize: 16 },
  selectPlaceholder: { color: Colors.textMuted, fontSize: 16 },
  selectArrow: { color: Colors.textMuted, fontSize: 12 },
  sportsList: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    marginTop: 4,
  },
  sportItem: { paddingHorizontal: Spacing.md, paddingVertical: 12 },
  sportItemActive: { backgroundColor: Colors.blue },
  sportItemText: { color: Colors.textSecondary, fontSize: 15 },
  sportItemTextActive: { color: "#FFF", fontWeight: "600" },
  registerButton: { borderRadius: BorderRadius.md, overflow: "hidden", marginTop: 8 },
  gradientButton: { paddingVertical: 16, alignItems: "center" },
  registerButtonText: { fontSize: 17, fontWeight: "700", color: "#FFF" },
  errorText: { color: "#FF6B6B", fontSize: 14, textAlign: "center", lineHeight: 20 },
  terms: { fontSize: 12, color: Colors.textMuted, textAlign: "center", lineHeight: 18 },
  termsLink: { color: Colors.cyan },
  loginLink: { alignItems: "center" },
  loginLinkText: { fontSize: 14, color: Colors.textSecondary },
  loginLinkHighlight: { color: Colors.cyan, fontWeight: "600" },
});
