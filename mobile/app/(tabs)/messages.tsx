import { useState, useEffect } from "react";
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  RefreshControl, ActivityIndicator, TextInput
} from "react-native";
import { router } from "expo-router";
import { messagingApi } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";
import { Colors, Spacing, BorderRadius, Typography } from "../../lib/theme";

interface Conversation {
  id: number;
  participantName?: string;
  participantAvatar?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  participantId?: number;
}

function ConversationItem({ conv }: { conv: Conversation }) {
  const timeAgo = (date?: string) => {
    if (!date) return "";
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  return (
    <TouchableOpacity style={styles.convItem}>
      <View style={styles.convAvatar}>
        <Text style={styles.convAvatarText}>
          {conv.participantName?.charAt(0)?.toUpperCase() || "?"}
        </Text>
        {(conv.unreadCount || 0) > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{conv.unreadCount}</Text>
          </View>
        )}
      </View>
      <View style={styles.convContent}>
        <View style={styles.convHeader}>
          <Text style={styles.convName}>{conv.participantName || "Unknown"}</Text>
          <Text style={styles.convTime}>{timeAgo(conv.lastMessageAt)}</Text>
        </View>
        <Text style={styles.convPreview} numberOfLines={1}>
          {conv.lastMessage || "No messages yet"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function MessagesScreen() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => { loadConversations(); }, []);

  async function loadConversations() {
    try {
      const data = await messagingApi.getConversations();
      setConversations(data || []);
    } catch (err) {
      console.error("Messages error:", err);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = conversations.filter(c =>
    !search || c.participantName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search messages..."
          placeholderTextColor={Colors.textMuted}
        />
      </View>

      {/* New Message Button */}
      <TouchableOpacity style={styles.newMsgBtn}>
        <Text style={styles.newMsgIcon}>✏️</Text>
        <Text style={styles.newMsgText}>New Message</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.cyan} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => <ConversationItem conv={item} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={async () => {
              setRefreshing(true);
              await loadConversations();
              setRefreshing(false);
            }} tintColor={Colors.cyan} />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>💬</Text>
              <Text style={styles.emptyTitle}>No messages yet</Text>
              <Text style={styles.emptySubtitle}>
                Connect with coaches, athletes, and brands
              </Text>
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
  newMsgBtn: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md, marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.blue, gap: 8,
  },
  newMsgIcon: { fontSize: 16 },
  newMsgText: { color: Colors.blue, fontWeight: "600", fontSize: 15 },
  convItem: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: Spacing.md, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  convAvatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.navyLight, justifyContent: "center", alignItems: "center",
    borderWidth: 1, borderColor: Colors.border,
  },
  convAvatarText: { color: Colors.cyan, fontWeight: "700", fontSize: 20 },
  unreadBadge: {
    position: "absolute", top: -2, right: -2,
    backgroundColor: Colors.blue, borderRadius: 10,
    minWidth: 18, height: 18, justifyContent: "center", alignItems: "center",
    paddingHorizontal: 4,
  },
  unreadText: { color: "#FFF", fontSize: 10, fontWeight: "700" },
  convContent: { flex: 1 },
  convHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  convName: { ...Typography.h4, fontSize: 15 },
  convTime: { ...Typography.caption },
  convPreview: { color: Colors.textSecondary, fontSize: 13 },
  empty: { alignItems: "center", paddingTop: 80, paddingHorizontal: 40 },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
  emptyTitle: { ...Typography.h3, marginBottom: 8 },
  emptySubtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: "center" },
});
