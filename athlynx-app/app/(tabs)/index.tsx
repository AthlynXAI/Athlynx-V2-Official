import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader, Card, Badge, SectionTitle } from '@/components';
import { colors, spacing, typography, radius } from '@/theme';
import { useRemoteData } from '@/hooks/useRemoteData';
import { fetchCWSBracket } from '@/services/apiClient';

export default function HomeScreen() {
  const router = useRouter();
  const { data: bracket, loading, refresh } = useRemoteData(fetchCWSBracket);

  const liveGames = bracket?.games.filter((g) => g.status === 'live') ?? [];
  const upcomingGames = bracket?.games.filter((g) => g.status === 'scheduled').slice(0, 2) ?? [];

  const quickLinks = [
    { label: 'CWS Bracket', icon: 'trophy' as const, route: '/(tabs)/cws' },
    { label: 'Diamond Grind', icon: 'baseball' as const, route: '/(tabs)/diamond-grind' },
    { label: 'NIL Market', icon: 'trending-up' as const, route: '/(tabs)/nil' },
    { label: 'AI Engines', icon: 'flash' as const, route: '/(tabs)/more' },
  ];

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="AthlynX"
        subtitle="College Baseball Intelligence"
        onProfilePress={() => router.push('/profile')}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.brand} />
        }
      >
        {/* Hero Banner */}
        <Card branded style={styles.heroBanner}>
          <Badge label="LIVE NOW" variant="success" />
          <Text style={styles.heroTitle}>2026 College World Series</Text>
          <Text style={styles.heroSub}>Omaha, NE · Charles Schwab Field</Text>
          <TouchableOpacity
            style={styles.heroBtn}
            onPress={() => router.push('/(tabs)/cws')}
            activeOpacity={0.8}
          >
            <Text style={styles.heroBtnText}>View Full Bracket</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.textInverse} />
          </TouchableOpacity>
        </Card>

        {/* Quick Links */}
        <SectionTitle title="Quick Access" />
        <View style={styles.quickGrid}>
          {quickLinks.map((ql) => (
            <TouchableOpacity
              key={ql.label}
              style={styles.quickCard}
              onPress={() => router.push(ql.route as never)}
              activeOpacity={0.7}
            >
              <View style={styles.quickIcon}>
                <Ionicons name={ql.icon} size={22} color={colors.brand} />
              </View>
              <Text style={styles.quickLabel}>{ql.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Live Games */}
        {liveGames.length > 0 && (
          <>
            <SectionTitle title="Live Games" />
            {liveGames.map((game) => {
              const home = bracket?.teams.find((t) => t.id === game.homeTeamId);
              const away = bracket?.teams.find((t) => t.id === game.awayTeamId);
              return (
                <Card key={game.id} style={styles.gameCard}>
                  <Badge label="LIVE" variant="success" />
                  <View style={styles.gameRow}>
                    <Text style={styles.teamName}>{away?.shortName ?? '—'}</Text>
                    <Text style={styles.score}>{game.awayScore ?? 0}</Text>
                    <Text style={styles.vs}>vs</Text>
                    <Text style={styles.score}>{game.homeScore ?? 0}</Text>
                    <Text style={styles.teamName}>{home?.shortName ?? '—'}</Text>
                  </View>
                  {game.inning && (
                    <Text style={styles.inning}>Inning {game.inning}</Text>
                  )}
                </Card>
              );
            })}
          </>
        )}

        {/* Upcoming Games */}
        {upcomingGames.length > 0 && (
          <>
            <SectionTitle title="Upcoming Games" />
            {upcomingGames.map((game) => {
              const home = bracket?.teams.find((t) => t.id === game.homeTeamId);
              const away = bracket?.teams.find((t) => t.id === game.awayTeamId);
              const dt = new Date(game.scheduledAt);
              const timeStr = dt.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              });
              return (
                <Card key={game.id} style={styles.gameCard}>
                  <View style={styles.gameRow}>
                    <Text style={styles.teamName}>{away?.shortName ?? '—'}</Text>
                    <Text style={styles.vsCenter}>vs</Text>
                    <Text style={styles.teamName}>{home?.shortName ?? '—'}</Text>
                  </View>
                  <Text style={styles.gameTime}>{timeStr}</Text>
                </Card>
              );
            })}
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
  heroBanner: { marginBottom: spacing.sm },
  heroTitle: { ...typography.h2, marginTop: spacing.sm, color: colors.textPrimary },
  heroSub: { ...typography.bodySm, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.md },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  heroBtnText: { ...typography.label, color: colors.textInverse, textTransform: 'uppercase' },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm },
  quickCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.bgBorder,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.brandAlpha10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: { ...typography.bodySm, color: colors.textPrimary, textAlign: 'center', fontWeight: '600' },
  gameCard: { marginBottom: spacing.sm },
  gameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  teamName: { ...typography.body, color: colors.textPrimary, fontWeight: '700', flex: 1 },
  score: { ...typography.h3, color: colors.brand, minWidth: 28, textAlign: 'center' },
  vs: { ...typography.bodySm, color: colors.textMuted, marginHorizontal: spacing.xs },
  vsCenter: { ...typography.bodySm, color: colors.textMuted, flex: 1, textAlign: 'center' },
  inning: { ...typography.labelSm, color: colors.textMuted, marginTop: spacing.xs },
  gameTime: { ...typography.bodySm, color: colors.textSecondary, marginTop: spacing.xs },
});
