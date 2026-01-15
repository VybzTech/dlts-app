import {
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import { useAuthStore } from "../src/store/authStore";
import { colors } from "../src/theme/colors";

// Auth protection hook
function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [hasNavigated, setHasNavigated] = useState(false);

  const rootNavigation = useRootNavigationState();

  useEffect(() => {
    // Wait for navigation to be ready
    if (!rootNavigation?.key) return;

    const inAuthGroup = segments[0] === "(auth)";

    // Prevent multiple navigations
    if (hasNavigated) return;

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      setHasNavigated(true);
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home if authenticated and on auth screen
      setHasNavigated(true);
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, segments, rootNavigation?.key]);

  // Reset navigation flag when auth state changes
  useEffect(() => {
    setHasNavigated(false);
  }, [isAuthenticated]);
}

export default function RootLayout() {
  const { isLoading } = useAuthStore();

  useProtectedRoute();

  if (isLoading) {
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

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="delivery/[id]/index"
          options={{
            headerShown: true,
            title: "Delivery Details",
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.white,
          }}
        />
        <Stack.Screen
          name="delivery/[id]/navigate"
          options={{
            headerShown: true,
            title: "Navigation",
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.white,
          }}
        />
        <Stack.Screen
          name="delivery/[id]/pod"
          options={{
            headerShown: true,
            title: "Proof of Delivery",
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.white,
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
