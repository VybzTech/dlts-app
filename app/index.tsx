// app/index.tsx
// This file handles the initial route and prevents Expo Router from auto-navigating
// The actual navigation logic is in _layout.tsx
import { useAuthStore } from "@/store/authStore";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { colors } from "@/src/styles/theme/colors";

export default function Index() {
  const { isHydrated } = useAuthStore();

  // The actual navigation logic is now handled globally by NavigationHandler
  // in the root _layout.tsx. This file just ensures we have a valid entry point.
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
