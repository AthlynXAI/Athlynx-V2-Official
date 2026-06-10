import { useState, useEffect } from "react";
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  TextInput, RefreshControl, ActivityIndicator
} from "react-native";
import { profileApi } from "../../lib/api";
import { Colors, Spacing, BorderRadius, Typography } from "../../lib/theme";

const SPORTS = ["All", "Football", "Basketball", "Baseball", "Soccer", "Track & Field", "Swimming", "Tennis", "Other"];
const LEVELS = ["All", "D1", "D2", "D3", "NAIA", "JUCO", "High School"];

interface Athlete {
  id: number;
  userId: number;
  name: string;
  sport: string;
  position?: string;
  school?: string;
  classYear?: string;
  state?: string;
  height?: string;
  weight?: string;
  gpa?: number;
  recruitingStatus?: string;
  nilValue?: number;
  nilVerified?: boolean;
  followers?: number;
  avatarUrl?: string;
}

function AthleteCard({ athlete }: { athlete: Athlete }) {
  const statusColor = {
    "committed": Colors.success,
    "open": Colors.cyan,
    "transfer": Colors.warning,
    "signed": Colors.blue,
  }[athlete.recruitingStatus?.toLowerCase() || "open"] || Colors.cyan;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {athlete.name?.charAt(0)?.toUpperCase() || "A"}
          </Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.athleteName}>{athlete.name}</Text>
          <Text style={styles.athleteDetails}>
            {[athlete.sport, athlete.position, athlete.classYear].filter(Boolean).join(" · ")}
          </Text>
          {athlete.school && (
            <Text style={styles.athleteSchool}>🏫 {athlete.school}</Text>
          )}
        </View>
        <View style={[styles.statusBadge, { borderColor: statusColor }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {athlete.recruitingStatus || "Open"}
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        {athlete.height && (
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{athlete.height}</Text>
            <Text style={styles.statLabel}>Height</Text>
          </View>
        )}
        {athlete.weight && (
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{athlete.weight}</Text>
            <Text style={styles.statLabel}>Weight</Text>
          </View>
        )}
        {athlete.gpa && (
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{athlete.gpa.toFixed(1)}</Text>
            <Text style={styles.statLabel}>GPA</Text>
          </View>
        )}
        {athlete.nilValue && (
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.success }]}>
              ${(athlete.nilValue / 1000).toFixed(0)}K
            </Text>
            <Text style={styles.statLabel}>NIL Value</Text>
          </View>
        )}
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>View Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSecondary]}>
          <Text style={styles.actionBtnTextSecondary}>Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function RecruitingScreen() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedSport, setSelectedSport] = useState("All");

  useEffect(() => { loadAthletes(); }, [selectedSport]);

  async function loadAthletes() {
    try {
      const sport = selectedSport === "All" ? undefined : selectedSport;
      const data = await profileApi.searchAthletes(search, sport, 20);
      setAthletes(data || []);
    } catch (err) {
      console.error("Recruiting error:", err);
      setAthletes([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={loadAthletes}
          placeholder="Search athletes, schools..."
          placeholderTextColor={Colors.textMuted}
          returnKeyType="search"
        />
      </View>

      {/* Sport Filter */}
      <FlatList
        horizontal
        data={SPORTS}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterChip, selectedSport === item && styles.filterChipActive]}
            onPress={() => setSelectedSport(item)}
          >
            <Text style={[styles.filterChipText, selectedSport === item && styles.filterChipTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.filterList}
        showsHorizontalScrollIndicator={false}
      />

      {/* Stats Banner */}
      <View style={styles.statsBanner}>
        <Text style={styles.statsBannerText}>
          ⚡ 520K+ Athletes · 44 Sports · D1 through JUCO
        </Text>
      </View>

      {/* Athletes List */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.cyan} />
        </View>
      ) : (
        <FlatList
          data={athletes}
          keyExtractor={(item) => item.id?.toString() || item.userId?.toString()}
          renderItem={({ item }) => <AthleteCard athlete={item} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={async () => {
              setRefreshing(true);
              await loadAthletes();
              setRefreshing(false);
            }} tintColor={Colors.cyan} />
          }
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🏆</Text>
              <Text style={styles.emptyTitle}>No athletes found</Text>
              <Text style={styles.emptySubtitle}>Try a different search or sport filter</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  searchBar: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.surface,
    margin: Spacing.md, borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md, paddingVertical: 10,
    borderWidth: 1, borderColor: Colors.border, gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, color: Colors.textPrimary, fontSize: 15 },
  filterList: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm, gap: 8 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  filterChipActive: { backgroundColor: Colors.blue, borderColor: Colors.blue },
  filterChipText: { color: Colors.textSecondary, fontSize: 13, fontWeight: "600" },
  filterChipTextActive: { color: "#FFF" },
  statsBanner: {
    backgroundColor: Colors.navyLight, paddingVertical: 8,
    paddingHorizontal: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  statsBannerText: { color: Colors.cyan, fontSize: 12, fontWeight: "600", textAlign: "center" },
  list: { padding: Spacing.md, gap: Spacing.sm, paddingBottom: 20 },
  card: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.sm, marginBottom: Spacing.sm },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.blue, justifyContent: "center", alignItems: "center",
  },
  avatarText: { color: "#FFF", fontWeight: "700", fontSize: 20 },
  cardInfo: { flex: 1 },
  athleteName: { ...Typography.h4 },
  athleteDetails: { color: Colors.textSecondary, fontSize: 13, marginTop: 2 },
  athleteSchool: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  statusBadge: {
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: BorderRadius.sm, borderWidth: 1,
  },
  statusText: { fontSize: 11, fontWeight: "700", textTransform: "uppercase" },
  statsRow: {
    flexDirection: "row", gap: Spacing.md,
    paddingVertical: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border,
    borderBottomWidth: 1, borderBottomColor: Colors.border, marginBottom: Spacing.sm,
  },
  statItem: { alignItems: "center" },
  statValue: { ...Typography.h4, fontSize: 15, color: Colors.cyan },
  statLabel: { ...Typography.caption, marginTop: 2 },
  cardActions: { flexDirection: "row", gap: Spacing.sm },
  actionBtn: {
    flex: 1, paddingVertical: 10, alignItems: "center",
    backgroundColor: Colors.blue, borderRadius: BorderRadius.md,
  },
  actionBtnSecondary: { backgroundColor: "transparent", borderWidth: 1, borderColor: Colors.border },
  actionBtnText: { color: "#FFF", fontWeight: "700", fontSize: 13 },
  actionBtnTextSecondary: { color: Colors.textSecondary, fontWeight: "600", fontSize: 13 },
  empty: { alignItems: "center", paddingTop: 60, paddingHorizontal: 40 },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
  emptyTitle: { ...Typography.h3, marginBottom: 8 },
  emptySubtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: "center" },
});
