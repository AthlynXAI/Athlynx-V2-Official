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
import { ScreenHeader, Card, Badge, LoadingSpinner, SectionTitle } from '@/components';
import { colors, spacing, typography, radius } from '@/theme';
import { useRemoteData } from '@/hooks/useRemoteData';
import { fetchD1Conferences, fetchMLBDraftProspects } from '@/services/apiClient';

type Tab = 'standings' | 'prospects';

const CONF_TABS = ['SEC', 'ACC', 'Big 12'];

export default function DiamondGrindScreen() {
  const router = useRouter();
  const { data: conferences, loading: loadingConf, refresh: refreshConf } = useRemoteData(fetchD1Conferences);
  const { data: prospects, loading: loadingProspects, refresh: refreshProspects } = useRemoteData(fetchMLBDraftProspects);

  const [activeTab, setActiveTab] = useState<Tab>('standings');
  const [activeConf, setActiveConf] = useState('SEC');

  const loading = loadingConf || loadingProspects;
  const refresh = () => { refreshConf(); refreshProspects(); };

  if (loading && !conferences) return <LoadingSpinner />;

  const selectedConf = conferences?.find((c) => c.abbr === activeConf);

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Diamond Grind"
        subtitle="D1 Baseball · MLB Draft"
        onProfilePress={() => router.push('/profile')}
      />

      {/* Sub-tabs */}
      <View style={styles.tabRow}>
        {(['standings', 'prospects'] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, activeTab === t && styles.tabBtnActive]}
            onPress={() => setActiveTab(t)}
          >
            <Text style={[styles.tabLabel, activeTab === t && styles.tabLabelActive]}>
              {t === 'standings' ? 'Standings' : 'MLB Draft'}
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
        {/* STANDINGS TAB */}
        {activeTab === 'standings' && (
          <>
            {/* Conference selector */}
            <View style={styles.confRow}>
              {CONF_TABS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.confBtn, activeConf === c && styles.confBtnActive]}
                  onPress={() => setActiveConf(c)}
                >
                  <Text style={[styles.confLabel, activeConf === c && styles.confLabelActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedConf && (
              <Card style={styles.standingsCard}>
                {/* Header row */}
                <View style={styles.standingsHeader}>
                  <Text style={[styles.col, styles.colTeam, styles.headerText]}>Team</Text>
                  <Text style={[styles.col, styles.colStat, styles.headerText]}>W</Text>
                  <Text style={[styles.col, styles.colStat, styles.headerText]}>L</Text>
                  <Text style={[styles.col, styles.colStat, styles.headerText]}>Conf</Text>
                  <Text style={[styles.col, styles.colStat, styles.headerText]}>RPI</Text>
                </View>
                {selectedConf.standings.map((team, idx) => (
                  <View key={team.team} style={[styles.standingsRow, idx % 2 === 0 && styles.rowAlt]}>
                    <Text style={[styles.col, styles.colTeam, styles.teamText]} numberOfLines={1}>
                      {team.team}
                    </Text>
                    <Text style={[styles.col, styles.colStat]}>{team.overallWins}</Text>
                    <Text style={[styles.col, styles.colStat]}>{team.overallLosses}</Text>
                    <Text style={[styles.col, styles.colStat]}>
                      {team.conferenceWins}-{team.conferenceLosses}
                    </Text>
                    <Text style={[styles.col, styles.colStat, styles.rpiText]}>
                      {team.rpi.toFixed(3)}
                    </Text>
                  </View>
                ))}
              </Card>
            )}
          </>
        )}

        {/* MLB DRAFT TAB */}
        {activeTab === 'prospects' && (
          <>
            <SectionTitle title="2026 MLB Draft Prospects" subtitle="Top 10 College Players" />
            {prospects?.map((p) => (
              <Card key={p.rank} style={styles.prospectCard}>
                <View style={styles.prospectHeader}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankNum}>{p.rank}</Text>
                  </View>
                  <View style={styles.prospectInfo}>
                    <Text style={styles.prospectName}>{p.name}</Text>
                    <Text style={styles.prospectMeta}>
                      {p.position} · {p.school} · {p.year}
                    </Text>
                  </View>
                  <Badge label={p.position} variant="brand" />
                </View>
                <View style={styles.prospectStats}>
                  <Text style={styles.prospectStat}>B/T: {p.bats}/{p.throws}</Text>
                  <Text style={styles.prospectStat}>{p.height} / {p.weight} lbs</Text>
                </View>
                <Text style={styles.prospectNotes}>{p.notes}</Text>
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
  confRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  confBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.bgBorder,
  },
  confBtnActive: { backgroundColor: colors.brandAlpha20, borderColor: colors.brand },
  confLabel: { ...typography.label, color: colors.textSecondary },
  confLabelActive: { color: colors.brand },
  standingsCard: { padding: 0, overflow: 'hidden' },
  standingsHeader: {
    flexDirection: 'row',
    backgroundColor: colors.bgSurface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  standingsRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  rowAlt: { backgroundColor: colors.bgElevated },
  headerText: { ...typography.labelSm, color: colors.textMuted, fontWeight: '700' },
  col: { ...typography.bodySm, color: colors.textPrimary },
  colTeam: { flex: 2.5 },
  colStat: { flex: 1, textAlign: 'center' },
  teamText: { fontWeight: '600' },
  rpiText: { color: colors.brand },
  prospectCard: { marginBottom: spacing.sm },
  prospectHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.goldAlpha15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNum: { ...typography.label, color: colors.gold, fontWeight: '800' },
  prospectInfo: { flex: 1 },
  prospectName: { ...typography.body, color: colors.textPrimary, fontWeight: '700' },
  prospectMeta: { ...typography.bodySm, color: colors.textSecondary },
  prospectStats: { flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.xs },
  prospectStat: { ...typography.bodySm, color: colors.textSecondary },
  prospectNotes: { ...typography.bodySm, color: colors.brand, fontStyle: 'italic' },
});
