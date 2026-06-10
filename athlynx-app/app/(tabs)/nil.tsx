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
import { fetchNILDeals, fetchNILValuations } from '@/services/apiClient';

type Tab = 'market' | 'deals';

const formatCurrency = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `$${(n / 1_000).toFixed(0)}K`
    : `$${n}`;

const trendIcon = (trend: 'up' | 'down' | 'flat') => {
  if (trend === 'up') return 'trending-up';
  if (trend === 'down') return 'trending-down';
  return 'remove';
};

const trendColor = (trend: 'up' | 'down' | 'flat') => {
  if (trend === 'up') return colors.success;
  if (trend === 'down') return colors.error;
  return colors.textMuted;
};

export default function NILScreen() {
  const router = useRouter();
  const { data: deals, loading: loadingDeals, refresh: refreshDeals } = useRemoteData(fetchNILDeals);
  const { data: valuations, loading: loadingVal, refresh: refreshVal } = useRemoteData(fetchNILValuations);

  const [activeTab, setActiveTab] = useState<Tab>('market');

  const loading = loadingDeals || loadingVal;
  const refresh = () => { refreshDeals(); refreshVal(); };

  if (loading && !deals) return <LoadingSpinner />;

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="NIL Market"
        subtitle="Name · Image · Likeness"
        onProfilePress={() => router.push('/profile')}
      />

      {/* Sub-tabs */}
      <View style={styles.tabRow}>
        {(['market', 'deals'] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, activeTab === t && styles.tabBtnActive]}
            onPress={() => setActiveTab(t)}
          >
            <Text style={[styles.tabLabel, activeTab === t && styles.tabLabelActive]}>
              {t === 'market' ? 'Market Snapshot' : 'Recent Deals'}
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
        {/* MARKET SNAPSHOT TAB */}
        {activeTab === 'market' && (
          <>
            <SectionTitle title="NIL Valuations by Sport" subtitle="2026 Season" />
            {valuations?.map((v) => (
              <Card key={v.sport} style={styles.valuationCard}>
                <View style={styles.valRow}>
                  <View style={styles.valLeft}>
                    <Text style={styles.sport}>{v.sport}</Text>
                    <Text style={styles.dealCount}>{v.dealCount.toLocaleString()} deals</Text>
                  </View>
                  <View style={styles.valCenter}>
                    <Text style={styles.avgLabel}>AVG</Text>
                    <Text style={styles.avgValue}>{formatCurrency(v.avgValue)}</Text>
                  </View>
                  <View style={styles.valRight}>
                    <Text style={styles.topLabel}>TOP</Text>
                    <Text style={styles.topValue}>{formatCurrency(v.topValue)}</Text>
                  </View>
                  <View style={styles.trendCol}>
                    <Ionicons name={trendIcon(v.trend)} size={18} color={trendColor(v.trend)} />
                    <Text style={[styles.trendPct, { color: trendColor(v.trend) }]}>
                      {v.trend !== 'flat' ? `${v.trendPct > 0 ? '+' : ''}${v.trendPct}%` : '—'}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </>
        )}

        {/* RECENT DEALS TAB */}
        {activeTab === 'deals' && (
          <>
            <SectionTitle title="Recent NIL Deals" subtitle="Last 30 days" />
            {deals?.map((deal) => (
              <Card key={deal.id} style={styles.dealCard}>
                <View style={styles.dealRow}>
                  <View style={styles.dealLeft}>
                    <Text style={styles.dealBrand}>{deal.brand}</Text>
                    <Text style={styles.dealMeta}>
                      {deal.sport} · {deal.athleteType} · {deal.platform}
                    </Text>
                  </View>
                  <View style={styles.dealRight}>
                    <Text style={styles.dealValue}>{formatCurrency(deal.value)}</Text>
                    <Badge label={deal.category} variant="muted" />
                  </View>
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
  valuationCard: { marginBottom: spacing.xs },
  valRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  valLeft: { flex: 2 },
  sport: { ...typography.body, color: colors.textPrimary, fontWeight: '700' },
  dealCount: { ...typography.bodySm, color: colors.textMuted },
  valCenter: { flex: 1, alignItems: 'center' },
  avgLabel: { ...typography.labelSm, color: colors.textMuted },
  avgValue: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  valRight: { flex: 1, alignItems: 'center' },
  topLabel: { ...typography.labelSm, color: colors.textMuted },
  topValue: { ...typography.body, color: colors.gold, fontWeight: '700' },
  trendCol: { alignItems: 'center', width: 44 },
  trendPct: { ...typography.labelSm },
  dealCard: { marginBottom: spacing.xs },
  dealRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dealLeft: { flex: 1 },
  dealBrand: { ...typography.body, color: colors.textPrimary, fontWeight: '700' },
  dealMeta: { ...typography.bodySm, color: colors.textSecondary },
  dealRight: { alignItems: 'flex-end', gap: spacing.xs },
  dealValue: { ...typography.h4, color: colors.brand },
});
