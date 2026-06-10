import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { notificationsApi } from "../../lib/api";
import { Colors, Spacing, BorderRadius, Typography } from "../../lib/theme";

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actorName?: string;
}

const TYPE_CONFIG: Record<string, { icon: string; color: string }> = {
  like:       { icon: "⚡", color: Colors.cyan },
  comment:    { icon: "💬", color: Colors.blue },
  follow:     { icon: "👤", color: Colors.success },
  nil_deal:   { icon: "💰", color: Colors.gold },
  message:    { icon: "✉️", color: Colors.cyan },
  recruiting: { icon: "🏆", color: Colors.blue },
  system:     { icon: "🔔", color: Colors.textSecondary },
  default:    { icon: "🔔", color: Colors.textSecondary },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function NotifCard({
  notif,
  onPress,
}: {
  notif: Notification;
  onPress: (id: number) => void;
}) {
  const cfg = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.default;
  return (
    <TouchableOpacity
      style={[styles.card, !notif.isRead && styles.cardUnread]}
      onPress={() => onPress(notif.id)}
      activeOpacity={0.75}
    >
      <View style={[styles.iconWrap, { backgroundColor: cfg.color + "22", borderColor: cfg.color + "44" }]}>
        <Text style={styles.iconText}>{cfg.icon}</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.cardTitle} numberOfLines={1}>{notif.title}</Text>
          <Text style={styles.cardTime}>{timeAgo(notif.createdAt)}</Text>
        </View>
        <Text style={styles.cardMessage} numberOfLines={2}>{notif.message}</Text>
        {notif.actorName ? (
          <Text style={styles.cardActor}>{notif.actorName}</Text>
        ) : null}
      </View>
      {!notif.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      const data = await notificationsApi.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error("Notifications error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadNotifications(); }, [loadNotifications]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadNotifications();
  }, [loadNotifications]);

  async function handleMarkRead(id: number) {
    try {
      await notificationsApi.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Mark read error:", err);
    }
  }

  async function handleMarkAllRead() {
    if (unreadCount === 0) return;
    setMarkingAll(true);
    try {
      await notificationsApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      Alert.alert("Error", "Could not mark all as read.");
    } finally {
      setMarkingAll(false);
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.cyan} />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={styles.headerSub}>{unreadCount} unread</Text>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllBtn}
            onPress={handleMarkAllRead}
            disabled={markingAll}
          >
            {markingAll ? (
              <ActivityIndicator size="small" color={Colors.cyan} />
            ) : (
              <Text style={styles.markAllText}>Mark all read</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyTitle}>All caught up!</Text>
          <Text style={styles.emptySub}>
            You'll see likes, comments, NIL deals, and recruiting activity here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <NotifCard notif={item} onPress={handleMarkRead} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.cyan}
            />
          }
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  loadingText: { ...Typography.bodySmall, marginTop: Spacing.sm },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { ...Typography.h2 },
  headerSub: { ...Typography.bodySmall, color: Colors.cyan, marginTop: 2 },
  markAllBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  markAllText: { color: Colors.cyan, fontSize: 13, fontWeight: "600" },

  list: { paddingVertical: Spacing.sm },
  separator: { height: 1, backgroundColor: Colors.border, marginLeft: 72 },

  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
  },
  cardUnread: { backgroundColor: Colors.navyLight },

  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    marginRight: Spacing.md,
    flexShrink: 0,
  },
  iconText: { fontSize: 20 },

  cardBody: { flex: 1 },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  cardTitle: {
    ...Typography.body,
    fontWeight: "600",
    flex: 1,
    marginRight: Spacing.sm,
  },
  cardTime: { ...Typography.caption, flexShrink: 0 },
  cardMessage: { ...Typography.bodySmall, lineHeight: 18 },
  cardActor: { ...Typography.caption, color: Colors.cyan, marginTop: 3 },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.cyan,
    marginLeft: Spacing.sm,
    marginTop: 6,
    flexShrink: 0,
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: { fontSize: 56, marginBottom: Spacing.md },
  emptyTitle: { ...Typography.h3, marginBottom: Spacing.sm },
  emptySub: { ...Typography.bodySmall, textAlign: "center", lineHeight: 20 },
});
