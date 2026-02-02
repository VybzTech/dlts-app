// // ROLE-BASED NAVIGATION LAYOUTS
// // ============================================================================

// // app/(courier)/_layout.tsx
// import { Tabs } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { colors } from "@/src/theme/colors";

// export default function CourierLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: colors.primary,
//         tabBarInactiveTintColor: colors.textSecondary,
//         tabBarStyle: {
//           backgroundColor: colors.white,
//           borderTopColor: colors.border,
//           height: 100,
//           paddingBottom: 18,
//           paddingTop: 8,
//         },
//         headerStyle: { backgroundColor: colors.primary },
//         headerTintColor: colors.white,
//         headerTitleStyle: { fontWeight: "600" },
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: "Deliveries",
//           headerTitle: "My Deliveries",
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="cube" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="history"
//         options={{
//           title: "History",
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="time" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: "Profile",
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="person" size={size} color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/styles/theme/colors";

export default function CourierLayout() {
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
