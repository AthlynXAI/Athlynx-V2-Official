import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../contexts/AuthContext";
import { ErrorBoundary } from "../lib/ErrorBoundary";

// Build 36 keeps native launch as safe as possible for TestFlight.
// Previous builds crashed during startup with iOS SIGABRT. This layout avoids
// explicit expo-splash-screen calls during boot and lets Expo auto-manage the
// native splash lifecycle, while React errors still render through ErrorBoundary.
function AppLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#000000" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#000000" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "700", color: "#FFFFFF" },
          contentStyle: { backgroundColor: "#000000" },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
