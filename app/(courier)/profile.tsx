// import { View } from "react-native";
// import ProfileScreen  from "@/src/screens/auth/ProfileScreen";

// export default function CourierProfile() {
//   return <ProfileScreen />;
// }

// COURIER PROFILE SCREEN (app/(courier)/profile.tsx)
// ============================================================================

import { useAuthStore } from "@/store/authStore";
import { colors } from "@/src/styles/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function CourierProfile() {
  const { user, logout } = useAuthStore();

  const handleLogout = useCallback(() => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => logout(),
      },
    ]);
  }, [logout]);

  return (
    <SafeAreaView style={profileStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={profileStyles.profileHeader}>
          <View style={profileStyles.avatar}>
            <Text style={profileStyles.avatarText}>
              {user?.fullName?.charAt(0) || "C"}
            </Text>
          </View>
          <Text style={profileStyles.name}>{user?.fullName || "Courier"}</Text>
          <Text style={profileStyles.staffId}>{user?.staffId || "N/A"}</Text>
        </View>

        {/* Profile Info Card */}
        <View style={profileStyles.card}>
          <Text style={profileStyles.cardTitle}>Account Information</Text>

          <View style={profileStyles.infoRow}>
            <Ionicons name="mail-outline" size={20} color={colors.primary} />
            <View style={profileStyles.infoContent}>
              <Text style={profileStyles.infoLabel}>Email</Text>
              <Text style={profileStyles.infoValue}>
                {user?.email || "N/A"}
              </Text>
            </View>
          </View>

          <View style={profileStyles.divider} />

          <View style={profileStyles.infoRow}>
            <Ionicons
              name="business-outline"
              size={20}
              color={colors.primary}
            />
            <View style={profileStyles.infoContent}>
              <Text style={profileStyles.infoLabel}>Unit</Text>
              <Text style={profileStyles.infoValue}>{user?.unit || "N/A"}</Text>
            </View>
          </View>

          <View style={profileStyles.divider} />

          <View style={profileStyles.infoRow}>
            <Ionicons name="shield-outline" size={20} color={colors.primary} />
            <View style={profileStyles.infoContent}>
              <Text style={profileStyles.infoLabel}>Role</Text>
              <Text
                style={[
                  profileStyles.infoValue,
                  { textTransform: "capitalize" },
                ]}
              >
                {user?.role || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* App Version */}
        <View style={profileStyles.card}>
          <View style={profileStyles.infoRow}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={colors.primary}
            />
            <View style={profileStyles.infoContent}>
              <Text style={profileStyles.infoLabel}>App Version</Text>
              <Text style={profileStyles.infoValue}>1.0.0</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={profileStyles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={profileStyles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 28,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.white,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  staffId: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.danger,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.danger,
  },
});

export default CourierProfile;
