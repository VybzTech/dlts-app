import { usePermission } from "@/src/hooks/usePermission";
import { colors } from "@/src/styles/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function AdminLayout() {
  // Protect this entire admin route - only admin users can access
  usePermission({
    requiredRoles: ["admin"],
    requireAuth: true,
  });

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          height: 100,
          paddingBottom: 18,
          paddingTop: 8,
        },
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Letters",
          tabBarIcon: ({ color }) => (
            <Ionicons name="layers-outline" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="couriers"
        options={{
          title: "Couriers",
          tabBarIcon: ({ color }) => (
            <Ionicons name="shield-checkmark-outline" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
