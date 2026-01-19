// // app/(mgt)/_layout.tsx
// import { Tabs } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { colors } from "@/src/theme/colors";

// export default function UnitLayout() {
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
//           title: "Dashboard",
//           headerTitle: "My Submissions",
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="home" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="letters"
//         options={{
//           title: "Letters",
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="mail" size={size} color={color} />
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

// import { Stack } from "expo-router";

// export default function MgtLayout() {
//   return <Stack screenOptions={{ headerShown: false }} />;
// }

import { Icon } from "@/src/hooks/useIcons";
import { colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function MgtLayout() {
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
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <Ionicons name="cube-outline" size={22} color={color} />
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
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <Icon name={"mail"} library="ionicons" size={22} color={color} />
            // <Ionicons name="shield-checkmark-outline"  />
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
