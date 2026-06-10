/**
 * AthlynX Design System — Cobalt Granite Electric Blue
 * v2.0.0 — "The Athlete's Playbook. Be The Legacy."
 */

export const Colors = {
  // BASE SHELL
  black: "#000000",
  granite950: "#0A0A0F",
  granite900: "#111118",
  granite800: "#1A1A24",
  granite700: "#252535",
  granite600: "#303045",

  // BRAND BLUES
  cobalt: "#1E4FD8",
  cobaltLight: "#2E6AFF",
  electric: "#00C2FF",
  electricDim: "rgba(0,194,255,0.6)",
  electricGlow: "rgba(0,194,255,0.15)",
  electricBorder: "rgba(0,194,255,0.2)",
  electricBorderStrong: "rgba(0,194,255,0.4)",

  // TEXT
  textPrimary: "#FFFFFF",
  textSecondary: "#8899BB",
  textMuted: "#4A5A7A",
  textDisabled: "#2A3A5A",

  // STATUS
  success: "#00E676",
  successDim: "rgba(0,230,118,0.15)",
  warning: "#FFB300",
  warningDim: "rgba(255,179,0,0.15)",
  error: "#FF4444",
  errorDim: "rgba(255,68,68,0.15)",
  gold: "#F5C518",
  goldDim: "rgba(245,197,24,0.15)",

  // LEGACY ALIASES
  background: "#0A0A0F",
  surface: "#111118",
  surfaceElevated: "#1A1A24",
  border: "#252535",
  primary: "#00C2FF",
  primaryDark: "#1E4FD8",
  secondary: "#8899BB",
  accent: "#00C2FF",
  tabActive: "#00C2FF",
  tabInactive: "#4A5A7A",
  navy: "#0A0A0F",
  navyLight: "#111118",
  blue: "#1E4FD8",
  cyan: "#00C2FF",
  surfaceLight: "#1A1A24",
  textSecon: "#8899BB",
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};

export const Typography = {
  hero: { fontSize: 42, fontWeight: "900" as const, color: "#FFFFFF", letterSpacing: -1, lineHeight: 46 },
  h1: { fontSize: 32, fontWeight: "800" as const, color: "#FFFFFF", letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: "700" as const, color: "#FFFFFF" },
  h3: { fontSize: 18, fontWeight: "600" as const, color: "#FFFFFF" },
  h4: { fontSize: 15, fontWeight: "600" as const, color: "#FFFFFF" },
  body: { fontSize: 15, fontWeight: "400" as const, color: "#FFFFFF", lineHeight: 22 },
  bodySmall: { fontSize: 13, fontWeight: "400" as const, color: "#8899BB", lineHeight: 18 },
  caption: { fontSize: 11, fontWeight: "400" as const, color: "#4A5A7A" },
  label: { fontSize: 11, fontWeight: "700" as const, color: "#4A5A7A", textTransform: "uppercase" as const, letterSpacing: 1.2 },
  stat: { fontSize: 28, fontWeight: "800" as const, color: "#FFFFFF", letterSpacing: -0.5 },
  statSmall: { fontSize: 20, fontWeight: "700" as const, color: "#FFFFFF" },
  ticker: { fontSize: 12, fontWeight: "700" as const, color: "#FFFFFF", letterSpacing: 0.5 },
};

export const Shadows = {
  electric: {
    shadowColor: "#00C2FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  tabBar: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 16,
  },
};
