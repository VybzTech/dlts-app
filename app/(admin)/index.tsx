import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/styles/theme/colors";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { useLetterStore } from "@/store/letterStore";
import { Icon } from "@/src/hooks/useIcons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    letters,
    filteredLetters,
    fetchLetters,
    isLoading,
    setFilter,
    currentFilter,
  } = useLetterStore();
  const [refreshing, setRefreshing] = useState(false);
  const [systemStatus, setSystemStatus] = useState<{
    status: "good" | "slow" | "down" | "error";
    message: string;
    responseTime?: number;
  }>({ status: "good", message: "All operations normal" });

  useEffect(() => {
    loadData();
    checkHealth();
  }, []);

  const checkHealth = async () => {
    const start = Date.now();
    try {
      await fetchLetters(1, "all");
      const duration = Date.now() - start;

      if (duration > 1500) {
        setSystemStatus({
          status: "slow",
          message: "System response is slow",
          responseTime: duration,
        });
      } else {
        setSystemStatus({ status: "good", message: "All systems operational" });
      }
    } catch (e) {
      setSystemStatus({
        status: "down",
        message: "Connection lost or server down",
      });
    }
  };

  const loadData = async () => {
    try {
      await fetchLetters();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadData(), checkHealth()]);
    setRefreshing(false);
  };

  const getStatusColor = () => {
    switch (systemStatus.status) {
      case "good":
        return colors.success;
      case "slow":
        return colors.warning;
      case "down":
        return colors.danger;
      case "error":
        return "#3B82F6";
      default:
        return colors.success;
    }
  };

  const stats = {
    total: letters.length,
    pending: letters.filter((l) =>
      ["Pending_Approval", "Registered", "Approved", "Assigned"].includes(
        l.status,
      ),
    ).length,
    delivered: letters.filter((l) => l.status === "Delivered").length,
    failed: letters.filter((l) => l.status === "Undelivered").length,
  };

  const statCards = [
    {
      label: "Total letters",
      value: stats.total.toString(),
      icon: "mail-outline",
      filter: "all" as const,
      color: colors.primary,
      library: "ionicons" as const,
    },
    {
      label: "Pending",
      value: stats.pending.toString(),
      icon: "time-outline",
      filter: "Pending" as any,
      color: colors.warning,
      library: "ionicons" as const,
    },
    {
      label: "Delivered",
      value: stats.delivered.toString(),
      icon: "checkmark-circle-outline",
      filter: "Delivered" as const,
      color: colors.success,
      library: "ionicons" as const,
    },
    {
      label: "Failed",
      value: stats.failed.toString(),
      icon: "close-circle-outline",
      filter: "Undelivered" as const,
      color: colors.danger,
      library: "ionicons" as const,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.headerGradient}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greetingText}>Administrator</Text>
              <Text style={styles.adminName}>
                {user?.name || "System Admin"}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push("/(admin)/profile")}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.[0]?.toUpperCase() || "A"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* SYSTEM STATUS */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: getStatusColor() },
              ]}
            />
            <Text style={styles.statusText}>{systemStatus.message}</Text>
          </View>
          <Text style={styles.lastUpdate}>
            Last update: {new Date().toLocaleTimeString()}
          </Text>
        </View>
        {/* CARD GRID FILTERS */}
        <View style={styles.statsGrid}>
          {statCards.map((stat, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.statCard,
                currentFilter === (stat as any).filter && styles.statCardActive,
              ]}
              onPress={() => setFilter((stat as any).filter || "all")}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: stat.color + "15" },
                ]}
              >
                <Icon
                  name={stat.icon}
                  size={22}
                  color={stat.color}
                  library={stat.library}
                />
              </View>
              <View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {currentFilter !== "all" && (
          <TouchableOpacity
            style={styles.clearFilterBtn}
            onPress={() => setFilter("all")}
          >
            <Text style={styles.clearFilterText}>
              Click to Clear Filter: {currentFilter.replace("_", " ")}
            </Text>
            <Ionicons name="close-circle" size={16} color={colors.primary} />
          </TouchableOpacity>
        )}

        {/* LETTERS LIST */}
        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {currentFilter === "all"
                ? "Recent Letters"
                : `${currentFilter.replace("_", " ")} Letters`}
            </Text>
          </View>

          <View style={styles.listContainer}>
            {isLoading && filteredLetters.length === 0 ? (
              <ActivityIndicator
                color={colors.primary}
                style={{ marginTop: 20 }}
              />
            ) : filteredLetters.length === 0 ? (
              <Text style={styles.emptyText}>
                No letters found for this filter.
              </Text>
            ) : (
              filteredLetters.slice(0, 20).map((letter) => (
                <TouchableOpacity
                  key={letter.id}
                  style={styles.letterItem}
                  onPress={() => router.push(`/(admin)/letter/${letter.id}`)}
                >
                  <View
                    style={[
                      styles.letterIconBg,
                      {
                        backgroundColor:
                          letter.status === "Delivered"
                            ? colors.success + "15"
                            : letter.status === "Undelivered"
                              ? colors.danger + "15"
                              : colors.primary + "15",
                      },
                    ]}
                  >
                    <Ionicons
                      name="document-text"
                      size={20}
                      color={
                        letter.status === "Delivered"
                          ? colors.success
                          : letter.status === "Undelivered"
                            ? colors.danger
                            : colors.primary
                      }
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.letterSubject} numberOfLines={1}>
                      {letter.subject}
                    </Text>
                    <Text style={styles.letterMeta}>
                      ID: {letter.trackingId} • {letter.status}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.textLight}
                  />
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Management Hub</Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/(admin)/couriers")}
          >
            <LinearGradient
              colors={["#4F46E5", "#4338CA"]}
              style={styles.actionIconBg}
            >
              <Icon
                name="people-outline"
                size={24}
                color={colors.white}
                library="ionicons"
              />
            </LinearGradient>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Courier Riders</Text>
              <Text style={styles.actionDescription}>
                Manage staff, track performance & status
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textLight}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/(admin)/courier/assign")}
          >
            <LinearGradient
              colors={["#0891B2", "#0E7490"]}
              style={styles.actionIconBg}
            >
              <Icon
                name="git-pull-request-outline"
                size={24}
                color={colors.white}
                library="ionicons"
              />
            </LinearGradient>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Manual Allocation</Text>
              <Text style={styles.actionDescription}>
                Assign pending letters to available riders
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textLight}
            />
          </TouchableOpacity>
        </View>

        {/* <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>System Status</Text>
        </View> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  headerGradient: {
    paddingTop: 10,
    paddingBottom: 5,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  greetingText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.2,
  },
  adminName: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.white,
    marginTop: 4,
  },
  profileButton: {
    padding: 2,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: colors.primary, fontSize: 20, fontWeight: "800" },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 15,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    marginTop: 10,
    // marginTop: -20,
    gap: 12,
  },
  statCard: {
    width: "48%",
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: { fontSize: 18, fontWeight: "800", color: colors.text },
  statLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: "600" },
  sectionHeader: { paddingHorizontal: 24, marginTop: 32, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.text },
  actionsContainer: { paddingHorizontal: 20, gap: 12 },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  actionInfo: { flex: 1 },
  actionTitle: { fontSize: 15, fontWeight: "700", color: colors.text },
  actionDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusCard: {
    marginHorizontal: 20,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  statusIndicator: { width: 10, height: 10, borderRadius: 5 },
  statusText: { fontSize: 14, fontWeight: "600", color: colors.text },
  lastUpdate: { fontSize: 11, color: colors.textSecondary, marginTop: 8 },
  statCardActive: { borderColor: colors.primary, borderWidth: 1.5 },
  clearFilterBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    gap: 6,
  },
  clearFilterText: { fontSize: 13, color: colors.primary, fontWeight: "600" },
  listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  letterItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  letterIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  letterSubject: { fontSize: 14, fontWeight: "700", color: colors.text },
  letterMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  emptyText: {
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: 20,
    fontSize: 14,
  },
});
