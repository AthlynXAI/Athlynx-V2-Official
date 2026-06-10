import { Platform } from 'react-native';

// ─── Colors ───────────────────────────────────────────────────────────────────

export const colors = {
  // Brand
  brand: '#00D4FF',        // AthlynX cyan
  brandDark: '#0099BB',
  brandLight: '#66E8FF',
  gold: '#FFD700',
  goldDark: '#CC9900',

  // Backgrounds
  bg: '#000000',
  bgCard: '#0D0D0D',
  bgElevated: '#141414',
  bgSurface: '#1A1A1A',
  bgBorder: '#2A2A2A',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textMuted: '#606060',
  textInverse: '#000000',

  // Status
  success: '#00C853',
  warning: '#FFB300',
  error: '#FF3B30',
  info: '#00D4FF',

  // Tab bar
  tabActive: '#00D4FF',
  tabInactive: '#606060',
  tabBar: '#0D0D0D',
  tabBorder: '#1A1A1A',

  // Transparent
  overlay: 'rgba(0,0,0,0.7)',
  overlayLight: 'rgba(0,0,0,0.4)',
  brandAlpha10: 'rgba(0,212,255,0.10)',
  brandAlpha20: 'rgba(0,212,255,0.20)',
  goldAlpha15: 'rgba(255,215,0,0.15)',
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────

const fontFamily = Platform.select({
  ios: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  android: {
    regular: 'Roboto',
    medium: 'Roboto-Medium',
    semibold: 'Roboto-Medium',
    bold: 'Roboto-Bold',
  },
  default: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
})!;

export const typography = {
  // Display
  display: { fontSize: 36, fontWeight: '800' as const, letterSpacing: -0.5, color: colors.textPrimary },
  h1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.3, color: colors.textPrimary },
  h2: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.2, color: colors.textPrimary },
  h3: { fontSize: 18, fontWeight: '600' as const, color: colors.textPrimary },
  h4: { fontSize: 16, fontWeight: '600' as const, color: colors.textPrimary },

  // Body
  bodyLg: { fontSize: 17, fontWeight: '400' as const, lineHeight: 26, color: colors.textPrimary },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22, color: colors.textPrimary },
  bodySm: { fontSize: 13, fontWeight: '400' as const, lineHeight: 19, color: colors.textSecondary },

  // Labels
  label: { fontSize: 12, fontWeight: '600' as const, letterSpacing: 0.5, color: colors.textSecondary },
  labelSm: { fontSize: 10, fontWeight: '600' as const, letterSpacing: 0.8, color: colors.textMuted },

  // Mono
  mono: { fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', color: colors.textPrimary },

  fontFamily,
} as const;

// ─── Shadows ──────────────────────────────────────────────────────────────────

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  brand: {
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

// ─── Layout ───────────────────────────────────────────────────────────────────

export const layout = {
  screenPadding: spacing.base,
  cardPadding: spacing.base,
  tabBarHeight: 84,
  headerHeight: 56,
  maxWidth: 428,
} as const;
