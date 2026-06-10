import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader, Card, Badge, SectionTitle } from '@/components';
import { colors, spacing, typography, radius } from '@/theme';
import { AI_ENGINES } from '@/data/enginesData';
import type { AIEngine } from '@/types';

const categoryLabel: Record<AIEngine['category'], string> = {
  nil: 'NIL',
  recruiting: 'Recruiting',
  analytics: 'Analytics',
  media: 'Media',
  coaching: 'Coaching',
};

const statusVariant: Record<AIEngine['status'], 'success' | 'warning' | 'muted'> = {
  live: 'success',
  beta: 'warning',
  coming_soon: 'muted',
};

const statusLabel: Record<AIEngine['status'], string> = {
  live: 'Live',
  beta: 'Beta',
  coming_soon: 'Coming Soon',
};

export default function MoreScreen() {
  const router = useRouter();

  const liveEngines = AI_ENGINES.filter((e) => e.status === 'live');
  const betaEngines = AI_ENGINES.filter((e) => e.status === 'beta');
  const comingEngines = AI_ENGINES.filter((e) => e.status === 'coming_soon');

  const renderEngine = (engine: AIEngine) => (
    <Card key={engine.id} style={styles.engineCard} elevated>
      <View style={styles.engineRow}>
        <View style={styles.engineIcon}>
          <Ionicons
            name={engine.iconName as keyof typeof Ionicons.glyphMap}
            size={22}
            color={engine.status === 'coming_soon' ? colors.textMuted : colors.brand}
          />
        </View>
        <View style={styles.engineInfo}>
          <View style={styles.engineTitleRow}>
            <Text style={[styles.engineName, engine.status === 'coming_soon' && styles.engineNameMuted]}>
              {engine.name}
            </Text>
            <Badge label={statusLabel[engine.status]} variant={statusVariant[engine.status]} />
          </View>
          <Text style={styles.engineDesc}>{engine.description}</Text>
          <Badge label={categoryLabel[engine.category]} variant="muted" />
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="AI Engines"
        subtitle="AthlynXAI Platform"
        onProfilePress={() => router.push('/profile')}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile shortcut */}
        <TouchableOpacity
          style={styles.profileShortcut}
          onPress={() => router.push('/profile')}
          activeOpacity={0.8}
        >
          <View style={styles.profileIcon}>
            <Ionicons name="person-circle" size={36} color={colors.brand} />
          </View>
          <View style={styles.profileText}>
            <Text style={styles.profileName}>My Athlete Profile</Text>
            <Text style={styles.profileSub}>View stats, NIL value & more</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {liveEngines.length > 0 && (
          <>
            <SectionTitle title="Live Engines" />
            {liveEngines.map(renderEngine)}
          </>
        )}

        {betaEngines.length > 0 && (
          <>
            <SectionTitle title="Beta" />
            {betaEngines.map(renderEngine)}
          </>
        )}

        {comingEngines.length > 0 && (
          <>
            <SectionTitle title="Coming Soon" />
            {comingEngines.map(renderEngine)}
          </>
        )}

        <View style={{ height: spacing['3xl'] }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.base },
  profileShortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.brand,
    marginBottom: spacing.base,
    gap: spacing.md,
  },
  profileIcon: {},
  profileText: { flex: 1 },
  profileName: { ...typography.h4, color: colors.textPrimary },
  profileSub: { ...typography.bodySm, color: colors.textSecondary },
  engineCard: { marginBottom: spacing.sm },
  engineRow: { flexDirection: 'row', gap: spacing.md },
  engineIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.brandAlpha10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  engineInfo: { flex: 1, gap: spacing.xs },
  engineTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  engineName: { ...typography.h4, color: colors.textPrimary, flex: 1 },
  engineNameMuted: { color: colors.textMuted },
  engineDesc: { ...typography.bodySm, color: colors.textSecondary },
});
