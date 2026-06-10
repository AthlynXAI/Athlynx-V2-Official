import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../lib/theme";

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    index:         "⚡",
    recruiting:    "🏆",
    nil:           "💰",
    "diamond-grind": "◆",
    brackets:      "▦",
    training:      "🏋️",
    scouting:      "📊",
    media:         "🎙️",
    messages:      "💬",
    notifications: "🔔",
    profile:       "👤",
  };
  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.tabEmoji, focused && styles.tabEmojiActive]}>
        {icons[name] || "•"}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.cyan,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarLabelStyle: styles.tabLabel,
        headerStyle: { backgroundColor: Colors.navyLight },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: { fontWeight: "700", fontSize: 18 },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "X-Factor Feed",
          tabBarLabel: "Feed",
          tabBarIcon: ({ focused }) => <TabIcon name="index" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="recruiting"
        options={{
          title: "Recruiting",
          tabBarLabel: "Recruit",
          tabBarIcon: ({ focused }) => <TabIcon name="recruiting" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="nil"
        options={{
          title: "NIL Deals",
          tabBarLabel: "NIL",
          tabBarIcon: ({ focused }) => <TabIcon name="nil" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="diamond-grind"
        options={{
          title: "Diamond Grind IQ",
          tabBarLabel: "Diamond",
          tabBarIcon: ({ focused }) => <TabIcon name="diamond-grind" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="brackets"
        options={{
          title: "Brackets",
          tabBarLabel: "Brackets",
          tabBarIcon: ({ focused }) => <TabIcon name="brackets" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="training"
        options={{
          title: "Training Hub",
          tabBarLabel: "Train",
          tabBarIcon: ({ focused }) => <TabIcon name="training" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="scouting"
        options={{
          title: "AI Scout",
          tabBarLabel: "Scout",
          tabBarIcon: ({ focused }) => <TabIcon name="scouting" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="media"
        options={{
          title: "Media OS",
          tabBarLabel: "Media",
          tabBarIcon: ({ focused }) => <TabIcon name="media" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarLabel: "Messages",
          tabBarIcon: ({ focused }) => <TabIcon name="messages" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarLabel: "Alerts",
          tabBarIcon: ({ focused }) => <TabIcon name="notifications" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "My Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.navyLight,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    paddingTop: 4,
    paddingBottom: 4,
    height: 62,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: "600",
    marginBottom: 2,
  },
  tabIcon: { alignItems: "center", justifyContent: "center" },
  tabEmoji: { fontSize: 18, opacity: 0.5 },
  tabEmojiActive: { opacity: 1 },
});
