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
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();
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
    <View style={styles.container}>
      {/* <StatusBar barStyle="light-content" /> */}

      {/* Profile Header with Gradient */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.headerGradient}
      >
        <SafeAreaView>
          {/* 
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>My Profile</Text>
            <View style={{ width: 24 }} /> 
          </View>
            */}

          <View style={styles.profileInfo}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0) || "U"}
                </Text>
              </View>
              <TouchableOpacity style={styles.editAvatarBtn}>
                <Ionicons name="camera" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.nameText}>{user?.name || "User Name"}</Text>
            <Text style={styles.roleText}>
              {user?.role?.toUpperCase()} ACCOUNT
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Account Settings */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Account Information</Text>
        </View>

        <View style={styles.settingsCard}>
          <View style={styles.infoRow}>
            <View style={[styles.iconBg, { backgroundColor: "#EEF2FF" }]}>
              <Ionicons name="mail" size={20} color="#4F46E5" />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>{user?.email || "N/A"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={[styles.iconBg, { backgroundColor: "#ECFDF5" }]}>
              <Ionicons name="business" size={20} color="#10B981" />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Directorate / Unit</Text>
              <Text style={styles.infoValue}>
                {user?.directorate?.description || "Administration"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={[styles.iconBg, { backgroundColor: "#FFF7ED" }]}>
              <Ionicons name="finger-print" size={20} color="#F59E0B" />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Staff / User ID</Text>
              <Text style={styles.infoValue}>{user?.id || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Security / Preferences */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Security & Support</Text>
        </View>

        <View style={styles.settingsCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/(common)/change-password")}
          >
            <View style={[styles.iconBg, { backgroundColor: "#F1F5F9" }]}>
              <Ionicons name="lock-closed" size={20} color={colors.text} />
            </View>
            <Text style={styles.menuText}>Change Password</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textLight}
            />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/(common)/help")}
          >
            <View style={[styles.iconBg, { backgroundColor: "#F1F5F9" }]}>
              <Ionicons name="help-circle" size={20} color={colors.text} />
            </View>
            <Text style={styles.menuText}>Help & Support</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textLight}
            />
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.menuItem}>
            <View style={[styles.iconBg, { backgroundColor: "#F1F5F9" }]}>
              <Ionicons
                name="information-circle"
                size={20}
                color={colors.text}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuText}>App Version</Text>
              <Text style={styles.versionText}>1.0.0 (Production)</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerGradient: {
    paddingBottom: 10,
    borderBottomLeftRadius: 38,
    borderBottomRightRadius: 38,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "flex-start",
    // justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  backButton: {
    elevation: 10,
    alignSelf: "flex-start",
    padding: 10,
    marginLeft: 14,
    marginBottom: -20,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  profileInfo: {
    alignItems: "center",
    marginTop: 14,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "800",
    color: colors.primary,
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.white,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  nameText: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.white,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 4,
    letterSpacing: 1.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    marginTop: 32,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  settingsCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 16,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "600",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: colors.text,
    fontWeight: "700",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  versionText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 0,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    paddingVertical: 18,
    backgroundColor: "#FEF2F2",
    borderRadius: 24,
    gap: 10,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.danger,
  },
});
