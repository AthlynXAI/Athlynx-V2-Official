import { Tabs } from "expo-router";
import { Image, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function TabIcon({ source, focused }: { source: any; focused: boolean }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Image
        source={source}
        style={[styles.icon, { opacity: focused ? 1 : 0.5 }]}
        resizeMode="contain"
      />
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#060b18",
          borderTopColor: "#1a2a4a",
          borderTopWidth: 1,
          height: 62 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#1E90FF",
        tabBarInactiveTintColor: "#3a4a6a",
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: "700",
          letterSpacing: 0.6,
          textTransform: "uppercase",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={require("../../assets/brand/engine-mark-white.png")}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="brackets"
        options={{
          title: "MCWS",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={require("../../assets/brand/diamond-grind-icon-real.png")}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="diamond-grind"
        options={{
          title: "Diamond",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={require("../../assets/brand/diamond-grind-baseball.png")}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="nil"
        options={{
          title: "NIL",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={require("../../assets/brand/nil-portal-icon-real.png")}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="engines"
        options={{
          title: "Engines",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={require("../../assets/brand/athlynxai-icon-real.png")}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={require("../../assets/brand/mobile-app-icon.png")}
              focused={focused}
            />
          ),
        }}
      />
      {/* Hidden from tab bar */}
      <Tabs.Screen name="dashboard" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  iconWrapActive: {
    backgroundColor: "rgba(30, 144, 255, 0.18)",
  },
  icon: {
    width: 22,
    height: 22,
  },
});
