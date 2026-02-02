// app/_layout.tsx
import { useAuthStore } from "@/store/authStore";
import { colors } from "@/src/styles/theme/colors";
import {
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AppBootstrap from "./bootstrap";

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [hasNavigated, setHasNavigated] = useState(false);
  const rootNavigation = useRootNavigationState();

  function useProtectedRoute() {
    useEffect(() => {
      if (!rootNavigation?.key) return;
      if (hasNavigated) return;

      const inAuthGroup = segments[0] === "(auth)";
      if (!isAuthenticated && !inAuthGroup) {
        setHasNavigated(true);
        setTimeout(() => router.replace("/(auth)/login"), 500);
      } else if (isAuthenticated && inAuthGroup) {
        setHasNavigated(true);
        // Route based on user role
        const roleRoutes = {
          courier: "/(courier)",
          // admin: "/(admin)",
          // mgt: "/(mgt)",
        };
        const route =
          roleRoutes[user?.role as keyof typeof roleRoutes] || "/(auth)/login";
        console.log(user, route);
        setTimeout(() => router.replace(route as any), 500);
      }
    }, [isAuthenticated, segments, rootNavigation?.key]); //, user?.role

    useEffect(() => {
      setHasNavigated(false);
    }, [isAuthenticated]);
  }

  const { isLoading, isHydrated } = useAuthStore();
  useProtectedRoute();
  AppBootstrap();

  console.log(isLoading || !isHydrated || !rootNavigation?.key);

  if (isLoading || !isHydrated || !rootNavigation?.key) {
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
        {/*
          <Stack.Screen name="(courier)" />
          <Stack.Screen name="(admin)" />
          <Stack.Screen name="(mgt)" />
          */}
      </Stack>
      {/* <StatusBar style="auto" /> */}
    </>
  );
}
