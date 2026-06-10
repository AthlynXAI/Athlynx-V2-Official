import { useState, useEffect } from "react";
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  RefreshControl, ActivityIndicator, Modal, TextInput, Alert
} from "react-native";
import { DollarSign } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NILValuationSnapshot, nilApi } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";
import { Colors, Spacing, BorderRadius, Typography } from "../../lib/theme";

const CATEGORIES = ["All", "Apparel", "Food & Beverage", "Tech", "Sports Equipment", "Media", "Finance", "Health", "Other"];
const STATUS_COLORS: Record<string, string> = {
  active: Colors.success,
  pending: Colors.warning,
  completed: Colors.blue,
  declined: Colors.error,
};

interface NILDeal {
  id: number;
  brandName: string;
  dealValue: number;
  status: string;
  description?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  athleteName?: string;
}

function DealCard({ deal }: { deal: NILDeal }) {
  const statusColor = STATUS_COLORS[deal.status] || Colors.cyan;
  return (
    <View style={styles.dealCard}>
      <View style={styles.dealHeader}>
        <View style={styles.brandIcon}>
          <Text style={styles.brandIconText}>{deal.brandName?.charAt(0) || "B"}</Text>
        </View>
        <View style={styles.dealInfo}>
          <Text style={styles.brandName}>{deal.brandName}</Text>
          {deal.category && <Text style={styles.dealCategory}>{deal.category}</Text>}
        </View>
        <View>
          <Text style={styles.dealValue}>${(deal.dealValue || 0).toLocaleString()}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + "22", borderColor: statusColor }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {deal.status?.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
      {deal.description && (
        <Text style={styles.dealDescription} numberOfLines={2}>{deal.description}</Text>
      )}
      {(deal.startDate || deal.endDate) && (
        <Text style={styles.dealDates}>
          {deal.startDate ? new Date(deal.startDate).toLocaleDateString() : "—"} →{" "}
          {deal.endDate ? new Date(deal.endDate).toLocaleDateString() : "Ongoing"}
        </Text>
      )}
    </View>
  );
}

export default function NILScreen() {
  const { user } = useAuth();
  const [myDeals, setMyDeals] = useState<NILDeal[]>([]);
  const [allDeals, setAllDeals] = useState<NILDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<"mine" | "marketplace">("marketplace");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDeal, setNewDeal] = useState({ brandName: "", dealValue: "", description: "", category: "" });
  const [valuation, setValuation] = useState<NILValuationSnapshot | null>(null);

  useEffect(() => { loadDeals(); }, []);

  async function loadDeals() {
    try {
      const [mine, all, valuationData] = await Promise.all([
        user ? nilApi.getMyDeals() : Promise.resolve([]),
        nilApi.getAllDeals(),
        nilApi.getValuation(),
      ]);
      setMyDeals(mine || []);
      setAllDeals(all || []);
      setValuation(valuationData);
    } catch (err) {
      console.error("NIL error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateDeal() {
    if (!newDeal.brandName || !newDeal.dealValue) {
      Alert.alert("Error", "Brand name and deal value are required");
      return;
    }
    try {
      await nilApi.createDeal({
        brandName: newDeal.brandName,
        dealValue: parseFloat(newDeal.dealValue),
        description: newDeal.description,
        category: newDeal.category,
        status: "pending",
      });
      setShowCreateModal(false);
      setNewDeal({ brandName: "", dealValue: "", description: "", category: "" });
      await loadDeals();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to create deal");
    }
  }

  const filteredDeals = allDeals.filter(d =>
    selectedCategory === "All" || d.category === selectedCategory
  );

  const totalValue = myDeals.reduce((sum, d) => sum + (d.dealValue || 0), 0);

  return (
    <View style={styles.container}>
      {/* Innovation D Live Valuation */}
      <View style={styles.innovationDBanner}>
        <View style={styles.innovationDHeader}>
          <Text style={styles.innovationDLabel}>INNOVATION D</Text>
          <Text style={styles.innovationDStatus}>LIVE NIL SPIKES</Text>
        </View>
        <Text style={styles.innovationDTitle}>Real-Time NIL Valuation Engine</Text>
        <Text style={styles.innovationDValue}>
          ${((valuation?.currentValue ?? totalValue) || 0).toLocaleString()}
        </Text>
        <Text style={styles.innovationDText}>
          {valuation?.spikePercent != null
            ? `${valuation.spikePercent > 0 ? "+" : ""}${valuation.spikePercent}% movement · ${valuation.confidence ?? "live"} confidence`
            : "Live valuation endpoint connected. Deal totals are used as fallback until athlete-specific valuation data is returned."}
        </Text>
        {valuation?.drivers?.length ? (
          <Text style={styles.innovationDDrivers}>{valuation.drivers.slice(0, 3).join(" · ")}</Text>
        ) : null}
      </View>

      {/* NIL Value Summary */}
      {user && (
        <LinearGradient colors={[Colors.navyLight, Colors.surface]} style={styles.valueBanner}>
          <View style={styles.valueLeft}>
            <Text style={styles.valueLabel}>MY NIL VALUE</Text>
            <Text style={styles.valueAmount}>${totalValue.toLocaleString()}</Text>
            <Text style={styles.valueDeals}>{myDeals.length} active deal{myDeals.length !== 1 ? "s" : ""}</Text>
          </View>
          <TouchableOpacity style={styles.createBtn} onPress={() => setShowCreateModal(true)}>
            <Text style={styles.createBtnText}>+ New Deal</Text>
          </TouchableOpacity>
        </LinearGradient>
      )}

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === "marketplace" && styles.tabActive]}
          onPress={() => setTab("marketplace")}
        >
          <Text style={[styles.tabText, tab === "marketplace" && styles.tabTextActive]}>
            Marketplace
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === "mine" && styles.tabActive]}
          onPress={() => setTab("mine")}
        >
          <Text style={[styles.tabText, tab === "mine" && styles.tabTextActive]}>
            My Deals {myDeals.length > 0 ? `(${myDeals.length})` : ""}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      {tab === "marketplace" && (
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterChip, selectedCategory === item && styles.filterChipActive]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={[styles.filterChipText, selectedCategory === item && styles.filterChipTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filterList}
          showsHorizontalScrollIndicator={false}
        />
      )}

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.cyan} />
        </View>
      ) : (
        <FlatList
          data={tab === "mine" ? myDeals : filteredDeals}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => <DealCard deal={item} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={async () => {
              setRefreshing(true);
              await loadDeals();
              setRefreshing(false);
            }} tintColor={Colors.cyan} />
          }
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <DollarSign size={48} color={Colors.textSecondary} style={styles.emptyIcon} />
              <Text style={styles.emptyTitle}>
                {tab === "mine" ? "No deals yet" : "No deals available"}
              </Text>
              <Text style={styles.emptySubtitle}>
                {tab === "mine" ? "Create your first NIL deal" : "Check back soon for new opportunities"}
              </Text>
            </View>
          }
        />
      )}

      {/* Create Deal Modal */}
      <Modal visible={showCreateModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>New NIL Deal</Text>
            <TextInput
              style={styles.modalInput}
              value={newDeal.brandName}
              onChangeText={(v) => setNewDeal(p => ({ ...p, brandName: v }))}
              placeholder="Brand Name *"
              placeholderTextColor={Colors.textMuted}
            />
            <TextInput
              style={styles.modalInput}
              value={newDeal.dealValue}
              onChangeText={(v) => setNewDeal(p => ({ ...p, dealValue: v }))}
              placeholder="Deal Value ($) *"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.modalInput, { height: 80 }]}
              value={newDeal.description}
              onChangeText={(v) => setNewDeal(p => ({ ...p, description: v }))}
              placeholder="Description"
              placeholderTextColor={Colors.textMuted}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowCreateModal(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleCreateDeal}>
                <Text style={styles.modalSubmitText}>Create Deal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  innovationDBanner: {
    margin: Spacing.md,
    marginBottom: 0,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: "#1E90FF",
    backgroundColor: "#050A12",
  },
  innovationDHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  innovationDLabel: { color: "#1E90FF", fontSize: 11, fontWeight: "900", letterSpacing: 1.1 },
  innovationDStatus: { color: "#FFFFFF", fontSize: 10, fontWeight: "900", borderWidth: 1, borderColor: "#1E90FF", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3, overflow: "hidden" },
  innovationDTitle: { color: "#FFFFFF", fontSize: 17, fontWeight: "900", marginBottom: 4 },
  innovationDValue: { color: "#FFFFFF", fontSize: 30, fontWeight: "900" },
  innovationDText: { color: Colors.textSecondary, fontSize: 13, lineHeight: 19, marginTop: 4 },
  innovationDDrivers: { color: "#1E90FF", fontSize: 12, fontWeight: "700", marginTop: 8 },
  valueBanner: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  valueLeft: {},
  valueLabel: { ...Typography.label, color: Colors.textMuted },
  valueAmount: { fontSize: 28, fontWeight: "800", color: Colors.success, marginTop: 2 },
  valueDeals: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  createBtn: {
    backgroundColor: Colors.blue, paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: BorderRadius.md,
  },
  createBtnText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
  tabs: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: Colors.border },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Colors.cyan },
  tabText: { color: Colors.textSecondary, fontWeight: "600", fontSize: 14 },
  tabTextActive: { color: Colors.cyan },
  filterList: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, gap: 8 },
  filterChip: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  filterChipActive: { backgroundColor: Colors.blue, borderColor: Colors.blue },
  filterChipText: { color: Colors.textSecondary, fontSize: 12, fontWeight: "600" },
  filterChipTextActive: { color: "#FFF" },
  list: { padding: Spacing.md, gap: Spacing.sm, paddingBottom: 20 },
  dealCard: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  dealHeader: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.sm, marginBottom: 8 },
  brandIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.navyLight, justifyContent: "center", alignItems: "center",
    borderWidth: 1, borderColor: Colors.border,
  },
  brandIconText: { color: Colors.cyan, fontWeight: "800", fontSize: 18 },
  dealInfo: { flex: 1 },
  brandName: { ...Typography.h4 },
  dealCategory: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  dealValue: { fontSize: 18, fontWeight: "800", color: Colors.success, textAlign: "right" },
  statusBadge: {
    paddingHorizontal: 6, paddingVertical: 3,
    borderRadius: BorderRadius.sm, borderWidth: 1, marginTop: 4, alignSelf: "flex-end",
  },
  statusText: { fontSize: 10, fontWeight: "700" },
  dealDescription: { color: Colors.textSecondary, fontSize: 13, lineHeight: 18, marginBottom: 6 },
  dealDates: { color: Colors.textMuted, fontSize: 12 },
  empty: { alignItems: "center", paddingTop: 60, paddingHorizontal: 40 },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
  emptyTitle: { ...Typography.h3, marginBottom: 8 },
  emptySubtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" },
  modal: {
    backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: Spacing.lg, gap: Spacing.md,
  },
  modalTitle: { ...Typography.h3, marginBottom: 4 },
  modalInput: {
    backgroundColor: Colors.navyLight, borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md, paddingVertical: 12,
    color: Colors.textPrimary, fontSize: 15,
    borderWidth: 1, borderColor: Colors.border,
  },
  modalButtons: { flexDirection: "row", gap: Spacing.md },
  modalCancelBtn: {
    flex: 1, paddingVertical: 14, alignItems: "center",
    borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border,
  },
  modalCancelText: { color: Colors.textSecondary, fontWeight: "600" },
  modalSubmitBtn: {
    flex: 1, paddingVertical: 14, alignItems: "center",
    borderRadius: BorderRadius.md, backgroundColor: Colors.blue,
  },
  modalSubmitText: { color: "#FFF", fontWeight: "700" },
});
