import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../contexts/AuthContext";
import { Colors, Spacing, BorderRadius, Typography } from "../../lib/theme";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter your email and password");
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim().toLowerCase(), password);
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Login Failed", err.message || "Invalid email or password");
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>A</Text>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your AthlynXAI account</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL</Text>
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
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            <LinearGradient
              colors={[Colors.blue, Colors.cyan]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => router.push("/(auth)/register")}
          >
            <Text style={styles.registerButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingBottom: 40 },
  header: { alignItems: "center", paddingTop: 60, paddingBottom: 40 },
  backBtn: { alignSelf: "flex-start", marginBottom: 30 },
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
  forgotBtn: { alignSelf: "flex-end" },
  forgotText: { color: Colors.cyan, fontSize: 14 },
  loginButton: { borderRadius: BorderRadius.md, overflow: "hidden", marginTop: 8 },
  gradientButton: { paddingVertical: 16, alignItems: "center" },
  loginButtonText: { fontSize: 17, fontWeight: "700", color: "#FFF" },
  divider: { flexDirection: "row", alignItems: "center", gap: Spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { color: Colors.textMuted, fontSize: 14 },
  registerButton: {
    paddingVertical: 16, alignItems: "center",
    borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border,
  },
  registerButtonText: { fontSize: 17, fontWeight: "600", color: Colors.textSecondary },
});
