import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';

type BadgeVariant = 'brand' | 'success' | 'warning' | 'error' | 'muted' | 'gold';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  brand: { bg: colors.brandAlpha20, text: colors.brand },
  success: { bg: 'rgba(0,200,83,0.15)', text: colors.success },
  warning: { bg: 'rgba(255,179,0,0.15)', text: colors.warning },
  error: { bg: 'rgba(255,59,48,0.15)', text: colors.error },
  muted: { bg: colors.bgSurface, text: colors.textSecondary },
  gold: { bg: colors.goldAlpha15, text: colors.gold },
};

export function Badge({ label, variant = 'brand' }: BadgeProps) {
  const vs = variantStyles[variant];
  return (
    <View style={[styles.badge, { backgroundColor: vs.bg }]}>
      <Text style={[styles.text, { color: vs.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.labelSm,
    textTransform: 'uppercase',
  },
});
