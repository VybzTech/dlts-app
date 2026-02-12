// app/_layout.tsx
import { useAuthStore } from "@/store/authStore";
import { colors } from "@/src/styles/theme/colors";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import AppBootstrap from "./bootstrap";
import NavigationHandler from "@/src/components/common/NavigationHandler";

export default function RootLayout() {
  const { isHydrated, isLoading } = useAuthStore();

  AppBootstrap();

  // Show loading screen while hydrating or loading
  if (!isHydrated || isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Main app navigation
  return (
    <>
      <NavigationHandler />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="(auth)"
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="(courier)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(admin)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(mgt)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
