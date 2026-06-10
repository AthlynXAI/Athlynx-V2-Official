import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, layout } from '@/theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showProfile?: boolean;
  onProfilePress?: () => void;
  rightElement?: React.ReactNode;
}

export function ScreenHeader({
  title,
  subtitle,
  showProfile = true,
  onProfilePress,
  rightElement,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.right}>
        {rightElement}
        {showProfile && (
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={onProfilePress}
            activeOpacity={0.7}
          >
            <Ionicons name="person-circle" size={32} color={colors.brand} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.md,
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.bgBorder,
  },
  left: {
    flex: 1,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.bodySm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  profileBtn: {
    padding: 2,
  },
});
