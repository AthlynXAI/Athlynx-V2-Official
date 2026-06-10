/**
 * AthlynX Tab Layout — v2.0.0
 * Cobalt Granite Electric Blue — X-style dark shell
 * 6 primary tabs: Home | Reels | Athletes | NIL | Alerts | Profile
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
} from "lucide-react-native";
import { Colors } from "../../lib/theme";

const ACTIVE = Colors.electric;   // #00C2FF
const INACTIVE = Colors.tabInactive; // #4A5A7A

type IconProps = { size: number; color: string; strokeWidth?: number };

function TabIcon({ Icon, focused }: { Icon: React.ComponentType<IconProps>; focused: boolean }) {
  return (
    <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
      <Icon size={22} color={focused ? ACTIVE : INACTIVE} strokeWidth={focused ? 2.5 : 1.8} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarLabelStyle: styles.tabLabel,
        headerStyle: {
          backgroundColor: Colors.granite950,
          borderBottomColor: Colors.electricBorder,
          borderBottomWidth: 1,
        },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: { fontWeight: "800", fontSize: 17, letterSpacing: -0.3 },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "AthlynX",
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => <TabIcon Icon={Home} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="highlight-reel"
        options={{
          title: "Highlight Reels",
          tabBarLabel: "Reels",
          tabBarIcon: ({ focused }) => <TabIcon Icon={Film} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="recruiting"
        options={{
          title: "Athletes",
          tabBarLabel: "Athletes",
          tabBarIcon: ({ focused }) => <TabIcon Icon={Users} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="nil"
        options={{
          title: "NIL Portal",
          tabBarLabel: "NIL",
          tabBarIcon: ({ focused }) => <TabIcon Icon={CircleDollarSign} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Alerts",
          tabBarLabel: "Alerts",
          tabBarIcon: ({ focused }) => <TabIcon Icon={Bell} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "My Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => <TabIcon Icon={User} focused={focused} />,
        }}
      />
      {/* Hidden tabs */}
      <Tabs.Screen name="training"       options={{ href: null, title: "Training Hub" }} />
      <Tabs.Screen name="scouting"       options={{ href: null, title: "AI Scout" }} />
      <Tabs.Screen name="messages"       options={{ href: null, title: "Messages" }} />
      <Tabs.Screen name="transfer-portal" options={{ href: null, title: "Transfer Portal" }} />
      <Tabs.Screen name="athlete-card"   options={{ href: null, title: "Athlete" }} />
      <Tabs.Screen name="diamond-grind"  options={{ href: null, title: "Diamond Grind IQ" }} />
      <Tabs.Screen name="brackets"       options={{ href: null, title: "MCWS Brackets" }} />
      <Tabs.Screen name="media"          options={{ href: null, title: "Media OS" }} />
      <Tabs.Screen name="home"           options={{ href: null, title: "Home" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "rgba(0,0,0,0.97)",
    borderTopColor: Colors.electricBorder,
    borderTopWidth: 1,
    paddingTop: 6,
    paddingBottom: 6,
    height: 64,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.7,
    shadowRadius: 24,
    elevation: 24,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginBottom: 2,
  },
  tabIcon: {
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  tabIconActive: {
    backgroundColor: Colors.electricGlow,
  },
});
