import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card, Badge, StatRow, SectionTitle } from '@/components';
import { colors, spacing, typography, radius } from '@/theme';
import type { AthleteProfile } from '@/types';

// Demo profile — replace with real auth/data
const DEMO_PROFILE: AthleteProfile = {
  id: 'demo-1',
  name: 'Chad Dozier',
  sport: 'Baseball',
  position: 'RHP',
  school: 'AthlynXAI University',
  year: 'Sr.',
  gpa: 3.8,
  stats: {
    ERA: '2.14',
    'K/9': '12.4',
    WHIP: '0.91',
    W: 11,
    L: 2,
    IP: '84.1',
  },
  nilValue: 125000,
  socialFollowers: 48200,
};

const formatCurrency = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${(n / 1_000).toFixed(0)}K`;

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const p = DEMO_PROFILE;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-down" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Athlete Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + Identity */}
        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color={colors.brand} />
          </View>
          <Text style={styles.name}>{p.name}</Text>
          <Text style={styles.meta}>
            {p.position} · {p.sport} · {p.year}
          </Text>
          <Text style={styles.school}>{p.school}</Text>
          <View style={styles.badges}>
            <Badge label={p.sport} variant="brand" />
            <Badge label={`GPA ${p.gpa}`} variant="gold" />
          </View>
        </View>

        {/* NIL Value */}
        <Card branded style={styles.nilCard}>
          <Text style={styles.nilLabel}>Estimated NIL Value</Text>
          <Text style={styles.nilValue}>{formatCurrency(p.nilValue)}</Text>
          <Text style={styles.nilSub}>
            {p.socialFollowers.toLocaleString()} social followers · {p.sport}
          </Text>
        </Card>

        {/* Stats */}
        <SectionTitle title="2026 Season Stats" />
        <Card>
          {Object.entries(p.stats).map(([key, val]) => (
            <StatRow key={key} label={key} value={val} highlight={key === 'ERA' || key === 'K/9'} />
          ))}
        </Card>

        {/* Quick Actions */}
        <SectionTitle title="Tools" />
        <View style={styles.actions}>
          {[
            { label: 'NIL Valuator', icon: 'trending-up' as const },
            { label: 'Recruit Radar', icon: 'search' as const },
            { label: 'Media Engine', icon: 'film' as const },
            { label: 'Brand Builder', icon: 'star' as const },
          ].map((a) => (
            <TouchableOpacity key={a.label} style={styles.actionBtn} activeOpacity={0.7}>
              <Ionicons name={a.icon} size={20} color={colors.brand} />
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: spacing['3xl'] }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.bgBorder,
  },
  backBtn: { width: 40, alignItems: 'flex-start' },
  headerTitle: { ...typography.h4, color: colors.textPrimary },
  scroll: { flex: 1 },
  content: { padding: spacing.base },
  identity: { alignItems: 'center', marginBottom: spacing.xl },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
    backgroundColor: colors.brandAlpha10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.brand,
    marginBottom: spacing.md,
  },
  name: { ...typography.h1, color: colors.textPrimary, textAlign: 'center' },
  meta: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  school: { ...typography.bodySm, color: colors.textMuted, marginTop: 2 },
  badges: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  nilCard: { marginBottom: spacing.base, alignItems: 'center' },
  nilLabel: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.xs },
  nilValue: { ...typography.display, color: colors.brand },
  nilSub: { ...typography.bodySm, color: colors.textMuted, marginTop: spacing.xs },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  actionBtn: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.bgBorder,
  },
  actionLabel: { ...typography.bodySm, color: colors.textPrimary, fontWeight: '600' },
});
