import React, { useState } from 'react';
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
import { ScreenHeader, Card, Badge, LoadingSpinner, SectionTitle } from '@/components';
import { colors, spacing, typography, radius } from '@/theme';
import { useRemoteData } from '@/hooks/useRemoteData';
import { fetchCWSBracket } from '@/services/apiClient';
import type { CWSTeam, CWSGame } from '@/types';

type Tab = 'bracket' | 'schedule' | 'teams';

export default function CWSScreen() {
  const router = useRouter();
  const { data: bracket, loading, refresh } = useRemoteData(fetchCWSBracket);
  const [activeTab, setActiveTab] = useState<Tab>('bracket');

  if (loading && !bracket) return <LoadingSpinner />;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'bracket', label: 'Bracket' },
    { key: 'schedule', label: 'Schedule' },
    { key: 'teams', label: 'Teams' },
  ];

  const getTeam = (id: string): CWSTeam | undefined =>
    bracket?.teams.find((t) => t.id === id);

  const statusColor = (status: CWSGame['status']) => {
    if (status === 'live') return colors.success;
    if (status === 'final') return colors.textMuted;
    return colors.textSecondary;
  };

  const statusLabel = (status: CWSGame['status']) => {
    if (status === 'live') return 'LIVE';
    if (status === 'final') return 'FINAL';
    return 'UPCOMING';
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="CWS 2026"
        subtitle="College World Series · Omaha"
        onProfilePress={() => router.push('/profile')}
      />

      {/* Sub-tabs */}
      <View style={styles.tabRow}>
        {tabs.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabBtn, activeTab === t.key && styles.tabBtnActive]}
            onPress={() => setActiveTab(t.key)}
          >
            <Text style={[styles.tabLabel, activeTab === t.key && styles.tabLabelActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.brand} />
        }
      >
        {/* BRACKET TAB */}
        {activeTab === 'bracket' && (
          <>
            <SectionTitle title="Bracket 1" subtitle="Games 1–4" />
            {bracket?.games.slice(0, 2).map((game) => {
              const home = getTeam(game.homeTeamId);
              const away = getTeam(game.awayTeamId);
              return (
                <Card key={game.id} style={styles.gameCard}>
                  <View style={styles.gameHeader}>
                    <Badge
                      label={statusLabel(game.status)}
                      variant={game.status === 'live' ? 'success' : 'muted'}
                    />
                    <Text style={styles.venue} numberOfLines={1}>{game.venue}</Text>
                  </View>
                  <View style={styles.matchup}>
                    <View style={styles.teamCol}>
                      <Text style={styles.seed}>#{away?.seed}</Text>
                      <Text style={styles.teamName}>{away?.shortName}</Text>
                      <Text style={styles.record}>{away?.record}</Text>
                    </View>
                    <View style={styles.scoreCol}>
                      {game.status !== 'scheduled' ? (
                        <Text style={styles.scoreText}>
                          {game.awayScore} – {game.homeScore}
                        </Text>
                      ) : (
                        <Text style={styles.vsText}>vs</Text>
                      )}
                    </View>
                    <View style={[styles.teamCol, styles.teamColRight]}>
                      <Text style={styles.seed}>#{home?.seed}</Text>
                      <Text style={styles.teamName}>{home?.shortName}</Text>
                      <Text style={styles.record}>{home?.record}</Text>
                    </View>
                  </View>
                </Card>
              );
            })}

            <SectionTitle title="Bracket 2" subtitle="Games 5–8" />
            {bracket?.games.slice(2).map((game) => {
              const home = getTeam(game.homeTeamId);
              const away = getTeam(game.awayTeamId);
              return (
                <Card key={game.id} style={styles.gameCard}>
                  <View style={styles.gameHeader}>
                    <Badge
                      label={statusLabel(game.status)}
                      variant={game.status === 'live' ? 'success' : 'muted'}
                    />
                    <Text style={styles.venue} numberOfLines={1}>{game.venue}</Text>
                  </View>
                  <View style={styles.matchup}>
                    <View style={styles.teamCol}>
                      <Text style={styles.seed}>#{away?.seed}</Text>
                      <Text style={styles.teamName}>{away?.shortName}</Text>
                      <Text style={styles.record}>{away?.record}</Text>
                    </View>
                    <View style={styles.scoreCol}>
                      {game.status !== 'scheduled' ? (
                        <Text style={styles.scoreText}>
                          {game.awayScore} – {game.homeScore}
                        </Text>
                      ) : (
                        <Text style={styles.vsText}>vs</Text>
                      )}
                    </View>
                    <View style={[styles.teamCol, styles.teamColRight]}>
                      <Text style={styles.seed}>#{home?.seed}</Text>
                      <Text style={styles.teamName}>{home?.shortName}</Text>
                      <Text style={styles.record}>{home?.record}</Text>
                    </View>
                  </View>
                </Card>
              );
            })}
          </>
        )}

        {/* SCHEDULE TAB */}
        {activeTab === 'schedule' && (
          <>
            <SectionTitle title="Full Schedule" />
            {bracket?.games.map((game) => {
              const home = getTeam(game.homeTeamId);
              const away = getTeam(game.awayTeamId);
              const dt = new Date(game.scheduledAt);
              return (
                <Card key={game.id} style={styles.scheduleCard}>
                  <View style={styles.scheduleRow}>
                    <View style={styles.scheduleLeft}>
                      <Text style={styles.scheduleDate}>
                        {dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Text>
                      <Text style={styles.scheduleTime}>
                        {dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </Text>
                    </View>
                    <View style={styles.scheduleCenter}>
                      <Text style={styles.scheduleMatchup}>
                        {away?.shortName} vs {home?.shortName}
                      </Text>
                      <Text style={styles.scheduleConf}>
                        {away?.conference} · {home?.conference}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[styles.scheduleStatus, { color: statusColor(game.status) }]}>
                        {statusLabel(game.status)}
                      </Text>
                    </View>
                  </View>
                </Card>
              );
            })}
          </>
        )}

        {/* TEAMS TAB */}
        {activeTab === 'teams' && (
          <>
            <SectionTitle title="All 8 Teams" />
            {bracket?.teams.map((team) => (
              <Card key={team.id} style={styles.teamCard}>
                <View style={styles.teamRow}>
                  <View style={styles.seedBadge}>
                    <Text style={styles.seedNum}>{team.seed}</Text>
                  </View>
                  <View style={styles.teamInfo}>
                    <Text style={styles.teamFullName}>{team.name}</Text>
                    <Text style={styles.teamMeta}>{team.conference} · {team.record}</Text>
                  </View>
                  {team.eliminated && <Badge label="OUT" variant="error" />}
                </View>
              </Card>
            ))}
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
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.bgBorder,
    backgroundColor: colors.bg,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: { borderBottomColor: colors.brand },
  tabLabel: { ...typography.label, color: colors.textMuted },
  tabLabelActive: { color: colors.brand },
  gameCard: { marginBottom: spacing.sm },
  gameHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  venue: { ...typography.labelSm, color: colors.textMuted, flex: 1, textAlign: 'right' },
  matchup: { flexDirection: 'row', alignItems: 'center' },
  teamCol: { flex: 1, alignItems: 'flex-start' },
  teamColRight: { alignItems: 'flex-end' },
  seed: { ...typography.labelSm, color: colors.textMuted },
  teamName: { ...typography.h4, color: colors.textPrimary },
  record: { ...typography.bodySm, color: colors.textSecondary },
  scoreCol: { flex: 0.8, alignItems: 'center' },
  scoreText: { ...typography.h2, color: colors.brand },
  vsText: { ...typography.body, color: colors.textMuted },
  scheduleCard: { marginBottom: spacing.xs },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  scheduleLeft: { width: 52 },
  scheduleDate: { ...typography.label, color: colors.textPrimary },
  scheduleTime: { ...typography.labelSm, color: colors.textMuted },
  scheduleCenter: { flex: 1 },
  scheduleMatchup: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  scheduleConf: { ...typography.labelSm, color: colors.textMuted },
  scheduleStatus: { ...typography.label },
  teamCard: { marginBottom: spacing.xs },
  teamRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  seedBadge: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.brandAlpha10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seedNum: { ...typography.h4, color: colors.brand },
  teamInfo: { flex: 1 },
  teamFullName: { ...typography.body, color: colors.textPrimary, fontWeight: '700' },
  teamMeta: { ...typography.bodySm, color: colors.textSecondary },
});
