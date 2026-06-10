/**
 * AthlynXAI Mobile — Tab Layout
 * Matches the web platform's MobileBottomNav exactly:
 * Home | Reels | Athletes | NIL | Alerts | Profile
 * Active color: #1E90FF (dodger blue) — same as web
 */
import { Tabs } from "expo-router";
import { View, StyleSheet, Image } from "react-native";
import {
  Home,
  Film,
  Users,
  CircleDollarSign,
  Bell,
  User,
  Trophy,
  MessageCircle,
  Dumbbell,
  BarChart2,
  Mic2,
  LayoutGrid,
  GraduationCap,
} from "lucide-react-native";
import { useAuth } from "../../contexts/AuthContext";
import { Colors } from "../../lib/theme";

// Web platform active color: #1E90FF
const ACTIVE_COLOR = "#1E90FF";
const INACTIVE_COLOR = "#9aa8c7";

type IconProps = { size: number; color: string; strokeWidth?: number };

function TabIcon({
  Icon,
  focused,
}: {
  Icon: React.ComponentType<IconProps>;
  focused: boolean;
}) {
  return (
    <View style={styles.tabIcon}>
      <Icon
        size={22}
        color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
        strokeWidth={focused ? 2.5 : 1.8}
      />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarLabelStyle: styles.tabLabel,
        headerStyle: {
          backgroundColor: "#000000",
          borderBottomColor: "rgba(30,144,255,0.28)",
          borderBottomWidth: 1,
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "700", fontSize: 18 },
        headerShadowVisible: false,
      }}
    >
      {/* 1 — Home / Feed */}
      <Tabs.Screen
        name="index"
        options={{
          title: "X-Factor Feed",
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => <TabIcon Icon={Home} focused={focused} />,
        }}
      />

      {/* 2 — Highlight Reels */}
      <Tabs.Screen
        name="highlight-reel"
        options={{
          title: "Highlight Reels",
          tabBarLabel: "Reels",
          tabBarIcon: ({ focused }) => <TabIcon Icon={Film} focused={focused} />,
        }}
      />

      {/* 3 — Browse Athletes / Recruiting */}
      <Tabs.Screen
        name="recruiting"
        options={{
          title: "Athletes",
          tabBarLabel: "Athletes",
          tabBarIcon: ({ focused }) => <TabIcon Icon={Users} focused={focused} />,
        }}
      />

      {/* 4 — NIL Portal */}
      <Tabs.Screen
        name="nil"
        options={{
          title: "NIL Portal",
          tabBarLabel: "NIL",
          tabBarIcon: ({ focused }) => <TabIcon Icon={CircleDollarSign} focused={focused} />,
        }}
      />

      {/* 5 — Notifications */}
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarLabel: "Alerts",
          tabBarIcon: ({ focused }) => <TabIcon Icon={Bell} focused={focused} />,
        }}
      />

      {/* 6 — Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "My Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => <TabIcon Icon={User} focused={focused} />,
        }}
      />

      {/* Hidden tabs — accessible via deep links / navigation, not shown in tab bar */}
      <Tabs.Screen
        name="training"
        options={{
          title: "Training Hub",
          href: null,
        }}
      />
      <Tabs.Screen
        name="scouting"
        options={{
          title: "AI Scout",
          href: null,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          href: null,
        }}
      />
      <Tabs.Screen
        name="transfer-portal"
        options={{
          title: "Transfer Portal",
          href: null,
        }}
      />
      <Tabs.Screen
        name="athlete-card"
        options={{
          title: "Athlete",
          href: null,
        }}
      />
      <Tabs.Screen
        name="diamond-grind"
        options={{
          title: "Diamond Grind IQ",
          href: null,
        }}
      />
      <Tabs.Screen
        name="brackets"
        options={{
          title: "Brackets",
          href: null,
        }}
      />
      <Tabs.Screen
        name="media"
        options={{
          title: "Media OS",
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "rgba(0,0,0,0.98)",
    borderTopColor: "rgba(30,144,255,0.28)",
    borderTopWidth: 1,
    paddingTop: 6,
    paddingBottom: 6,
    height: 64,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -24 },
    shadowOpacity: 0.62,
    shadowRadius: 40,
    elevation: 24,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "500",
    marginBottom: 2,
  },
  tabIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
});
