import { usePermission } from "@/src/hooks/usePermission";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/styles/theme/colors";

export default function CourierLayout() {
  // Protect this entire courier route - only courier users can access
  usePermission({
    requiredRoles: ["courier"],
    requireAuth: true,
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "My Deliveries",
          tabBarIcon: ({ color }) => (
            <Ionicons name="cube-outline" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
