import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, shadow, spacing } from '@/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
  branded?: boolean;
}

export function Card({ children, style, elevated = false, branded = false }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        elevated && styles.elevated,
        branded && styles.branded,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.bgBorder,
  },
  elevated: {
    ...shadow.md,
  },
  branded: {
    borderColor: colors.brand,
    borderWidth: 1,
    backgroundColor: colors.bgElevated,
  },
});
