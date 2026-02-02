// TEMP PROFILE SCREEN THAT SHOWS DETAILS DEPENDING ON USER PROFILE

import { useAuthStore, useDeliveryStore } from "@/store";
import { profileStyles } from "@/src/styles/profile";
import { colors } from "@/src/styles/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { deliveries } = useDeliveryStore();

  // Calculate stats - only if user exists
  const totalDeliveries = deliveries?.length || 0;
  const deliveredCount =
    deliveries?.filter((d) => d.status === "delivered")?.length || 0;
  const returnedCount =
    deliveries?.filter((d) => d.status === "returned")?.length || 0;
  const pendingCount =
    deliveries?.filter((d) => !["delivered", "returned"].includes(d.status))
      ?.length || 0;

  const successRate =
    totalDeliveries > 0 && deliveredCount + returnedCount > 0
      ? Math.round((deliveredCount / (deliveredCount + returnedCount)) * 100)
      : 0;

  // Use useCallback to prevent function recreation on every render
  const handleLogout = useCallback(() => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          // Simply call logout - the useProtectedRoute hook in RootLayout
          // will handle navigation when isAuthenticated becomes false
          logout();
        },
      },
    ]);
  }, [logout]);

  return (
    <ScrollView style={profileStyles.container}>
      {/* Profile Header */}
      <View style={profileStyles.header}>
        <View style={profileStyles.avatar}>
          <Text style={profileStyles.avatarText}>
            {user?.fullName?.charAt(0) || "C"}
          </Text>
        </View>
        <Text style={profileStyles.name}>{user?.fullName || "Courier"}</Text>
        <Text style={profileStyles.unit}>{user?.unit || "Dispatch Unit"}</Text>
        <View style={profileStyles.staffIdBadge}>
          <Ionicons name="id-card-outline" size={14} color={colors.primary} />
          <Text style={profileStyles.staffIdText}>
            {user?.staffId || "N/A"}
          </Text>
        </View>
      </View>

      {/* Stats Card */}
      <View style={profileStyles.card}>
        <Text style={profileStyles.cardTitle}>Performance Overview</Text>

        <View style={profileStyles.statsGrid}>
          <View style={profileStyles.statItem}>
            <View
              style={[
                profileStyles.statIcon,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <Ionicons name="cube" size={20} color={colors.primary} />
            </View>
            <Text style={profileStyles.statValue}>{totalDeliveries}</Text>
            <Text style={profileStyles.statLabel}>Total Assigned</Text>
          </View>

          <View style={profileStyles.statItem}>
            <View
              style={[
                profileStyles.statIcon,
                { backgroundColor: colors.successLight },
              ]}
            >
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.success}
              />
            </View>
            <Text style={profileStyles.statValue}>{deliveredCount}</Text>
            <Text style={profileStyles.statLabel}>Delivered</Text>
          </View>

          <View style={profileStyles.statItem}>
            <View
              style={[
                profileStyles.statIcon,
                { backgroundColor: colors.dangerLight },
              ]}
            >
              <Ionicons name="close-circle" size={20} color={colors.danger} />
            </View>
            <Text style={profileStyles.statValue}>{returnedCount}</Text>
            <Text style={profileStyles.statLabel}>Returned</Text>
          </View>

          <View style={profileStyles.statItem}>
            <View
              style={[
                profileStyles.statIcon,
                { backgroundColor: colors.warningLight },
              ]}
            >
              <Ionicons name="hourglass" size={20} color={colors.warning} />
            </View>
            <Text style={profileStyles.statValue}>{pendingCount}</Text>
            <Text style={profileStyles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Success Rate */}
        <View style={profileStyles.successRateContainer}>
          <View style={profileStyles.successRateHeader}>
            <Text style={profileStyles.successRateLabel}>Success Rate</Text>
            <Text style={profileStyles.successRateValue}>{successRate}%</Text>
          </View>
          <View style={profileStyles.progressBar}>
            <View
              style={[
                profileStyles.progressFill,
                {
                  width: `${successRate}%`,
                  backgroundColor:
                    successRate >= 80
                      ? colors.success
                      : successRate >= 60
                        ? colors.warning
                        : colors.danger,
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Account Info */}
      <View style={profileStyles.card}>
        <Text style={profileStyles.cardTitle}>Account Information</Text>

        <View style={profileStyles.infoRow}>
          <Ionicons
            name="mail-outline"
            size={20}
            color={colors.textSecondary}
          />
          <View style={profileStyles.infoContent}>
            <Text style={profileStyles.infoLabel}>Email</Text>
            <Text style={profileStyles.infoValue}>{user?.email || "N/A"}</Text>
          </View>
        </View>

        <View style={profileStyles.infoRow}>
          <Ionicons
            name="shield-outline"
            size={20}
            color={colors.textSecondary}
          />
          <View style={profileStyles.infoContent}>
            <Text style={profileStyles.infoLabel}>Role</Text>
            <Text
              style={[profileStyles.infoValue, { textTransform: "capitalize" }]}
            >
              {user?.role || "N/A"}
            </Text>
          </View>
        </View>

        <View style={profileStyles.infoRow}>
          <Ionicons
            name="business-outline"
            size={20}
            color={colors.textSecondary}
          />
          <View style={profileStyles.infoContent}>
            <Text style={profileStyles.infoLabel}>Unit</Text>
            <Text style={profileStyles.infoValue}>{user?.unit || "N/A"}</Text>
          </View>
        </View>

        <View style={profileStyles.infoRow}>
          <Ionicons
            name="id-card-outline"
            size={20}
            color={colors.textSecondary}
          />
          <View style={profileStyles.infoContent}>
            <Text style={profileStyles.infoLabel}>Staff ID</Text>
            <Text style={profileStyles.infoValue}>
              {user?.staffId || "N/A"}
            </Text>
          </View>
        </View>
      </View>

      {/* App Info */}
      <View style={profileStyles.card}>
        <Text style={profileStyles.cardTitle}>About</Text>

        <View style={profileStyles.infoRow}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.textSecondary}
          />
          <View style={profileStyles.infoContent}>
            <Text style={profileStyles.infoLabel}>App Version</Text>
            <Text style={profileStyles.infoValue}>1.0.0</Text>
          </View>
        </View>

        <View style={profileStyles.infoRow}>
          <Ionicons
            name="shield-checkmark-outline"
            size={20}
            color={colors.textSecondary}
          />
          <View style={profileStyles.infoContent}>
            <Text style={profileStyles.infoLabel}>Build</Text>
            <Text style={profileStyles.infoValue}>MVP</Text>
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={profileStyles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color={colors.danger} />
        <Text style={profileStyles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={profileStyles.footer}>
        <Text style={profileStyles.footerText}>
          LIRS Document & Logistics Tracking System
        </Text>
        <Text style={profileStyles.footerSubtext}>Courier Mobile App</Text>
      </View>
    </ScrollView>
  );
}
