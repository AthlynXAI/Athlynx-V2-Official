/**
 * AthlynXAI — Register Screen
 * Registration is handled by Auth0 Universal Login.
 * This screen redirects to login.tsx which opens Auth0.
 */
import { useEffect } from "react";
import { router } from "expo-router";

export default function RegisterScreen() {
  useEffect(() => {
    // Auth0 Universal Login handles both sign in and sign up.
    // Redirect to login screen immediately.
    router.replace("/(auth)/login");
  }, []);
  return null;
}
