export const Colors = {
  // Primary brand colors
  navy: "#0A1628",
  navyLight: "#0D1F3C",
  blue: "#0066FF",
  cyan: "#00C2FF",
  
  // UI colors
  background: "#0A1628",
  surface: "#0D1F3C",
  surfaceLight: "#162444",
  border: "#1E3A5F",
  
  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "#8BA3C7",
  textMuted: "#4A6A8A",
  
  // Status
  success: "#00C851",
  warning: "#FFB300",
  error: "#FF4444",
  
  // Accent
  gold: "#F5C518",
  
  // Tab bar
  tabActive: "#00C2FF",
  tabInactive: "#4A6A8A",
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Typography = {
  h1: { fontSize: 32, fontWeight: "700" as const, color: Colors.textPrimary },
  h2: { fontSize: 24, fontWeight: "700" as const, color: Colors.textPrimary },
  h3: { fontSize: 20, fontWeight: "600" as const, color: Colors.textPrimary },
  h4: { fontSize: 17, fontWeight: "600" as const, color: Colors.textPrimary },
  body: { fontSize: 15, fontWeight: "400" as const, color: Colors.textPrimary },
  bodySmall: { fontSize: 13, fontWeight: "400" as const, color: Colors.textSecondary },
  caption: { fontSize: 11, fontWeight: "400" as const, color: Colors.textMuted },
  label: { fontSize: 12, fontWeight: "600" as const, color: Colors.textSecondary, textTransform: "uppercase" as const, letterSpacing: 0.8 },
};
