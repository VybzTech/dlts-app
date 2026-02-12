import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { useLetterStore } from "@/store/letterStore";
import { useAuthStore } from "@/store";
import { LetterCard } from "@/src/components/letter/LetterCard";
import {
  DeliveryModal,
  DeclineModal,
  InTransitModal,
} from "@/src/components/letter/ActionModals";
import { LoadingSpinner } from "@/src/components/common/LoadingSpinner";
import { EmptyState } from "@/src/components/common/EmptyState";
import { colors } from "@/src/styles/theme/colors";
import { LetterStatus } from "@/src/types/letter.types";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "@/src/hooks/useIcons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CourierDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    filteredLetters,
    isLoading,
    fetchLetters,
    setFilter,
    currentFilter,
    markAsInTransit,
    markAsDelivered,
    markAsUndelivered,
    getStats,
  } = useLetterStore();

  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null);

  // Modal states
  const [showInTransitModal, setShowInTransitModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);

  // Load letters on mount
  useEffect(() => {
    loadLetters();
  }, []);

  const loadLetters = async () => {
    try {
      await fetchLetters(1, "all");
    } catch (error) {
      Alert.alert("Error", "Failed to load letters");
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchLetters(1, currentFilter);
    } catch (error) {
      Alert.alert("Error", "Failed to refresh letters");
    } finally {
      setRefreshing(false);
    }
  }, [currentFilter, fetchLetters]);

  const handleFilterChange = (filter: LetterStatus | "all") => {
    setFilter(filter);
  };

  // Action handlers
  const handleMarkInTransit = (letterId: string) => {
    setSelectedLetterId(letterId);
    setShowInTransitModal(true);
  };

  const handleMarkDelivered = (letterId: string) => {
    setSelectedLetterId(letterId);
    setShowDeliveryModal(true);
  };

  const handleMarkUndelivered = (letterId: string) => {
    setSelectedLetterId(letterId);
    setShowDeclineModal(true);
  };

  const handleNavigateToDetail = (letterId: string) => {
    router.push(`/(courier)/letter/${letterId}`);
  };

  // Modal submit handlers
  const handleInTransitSubmit = async () => {
    if (!selectedLetterId) return;
    setActionLoading(true);
    try {
      await markAsInTransit(selectedLetterId);
      setShowInTransitModal(false);
      Alert.alert("Success", "Letter marked as in transit");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update letter");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeliverySubmit = async (data: any) => {
    if (!selectedLetterId) return;
    setActionLoading(true);
    try {
      await markAsDelivered(selectedLetterId, data);
      setShowDeliveryModal(false);
      Alert.alert("Success", "Letter marked as delivered");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update letter");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeclineSubmit = async (data: any) => {
    if (!selectedLetterId) return;
    setActionLoading(true);
    try {
      await markAsUndelivered(selectedLetterId, data.reason);
      setShowDeclineModal(false);
      Alert.alert("Success", "Letter marked as undelivered");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update letter");
    } finally {
      setActionLoading(false);
    }
  };

  const stats = getStats();

  const statFilters = [
    {
      label: "All",
      value: "all" as const,
      count: stats.total,
      icon: "cube-outline",
      library: "ionicons" as const,
    },
    {
      label: "Pending",
      value: "Pending" as any,
      count: stats.pending,
      icon: "time-outline",
      library: "ionicons" as const,
    },
    {
      label: "Transit",
      value: "In_Transit" as const,
      count: stats.inTransit,
      icon: "bicycle-outline",
      library: "ionicons" as const,
    },
    {
      label: "Delivered",
      value: "Delivered" as const,
      count: stats.delivered,
      icon: "checkmark-circle-outline",
      library: "ionicons" as const,
    },
    {
      label: "Failed",
      value: "Undelivered" as const,
      count: stats.undelivered,
      icon: "close-circle-outline",
      library: "ionicons" as const,
    },
  ];

  console.log(user);
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Premium Header */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.headerGradient}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greetingText}>Welcome back,</Text>
              <Text style={styles.courierName}>{user?.name || "Courier"}</Text>
            </View>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push("/(courier)/profile")}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.[0]?.toUpperCase() || "C"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Stats Section */}
      <View style={styles.statsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsContainer}
        >
          {statFilters.map((stat) => (
            <TouchableOpacity
              key={stat.value}
              style={[
                styles.statCard,
                currentFilter === stat.value && styles.statCardActive,
              ]}
              onPress={() => handleFilterChange(stat.value)}
            >
              <View
                style={[
                  styles.iconBg,
                  currentFilter === stat.value
                    ? styles.iconBgActive
                    : { backgroundColor: colors.background },
                ]}
              >
                <Icon
                  name={stat.icon}
                  size={20}
                  color={
                    currentFilter === stat.value ? colors.white : colors.primary
                  }
                  library={stat.library}
                />
              </View>
              <Text
                style={[
                  styles.statValue,
                  currentFilter === stat.value && styles.statValueActive,
                ]}
              >
                {stat.count}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  currentFilter === stat.value && styles.statLabelActive,
                ]}
              >
                {stat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content Section */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>
          {currentFilter === "all"
            ? "All Deliveries"
            : `${currentFilter} Letters`}
        </Text>
        <Text style={styles.listSubtitle}>
          {filteredLetters.length} items found
        </Text>
      </View>

      {isLoading && filteredLetters.length === 0 ? (
        <View style={styles.loadingContainer}>
          <LoadingSpinner message="Updating records..." />
        </View>
      ) : filteredLetters.length === 0 ? (
        <EmptyState
          icon="cube-outline"
          title="No Letters Found"
          message={
            currentFilter === "all"
              ? "You don't have any assigned letters yet"
              : `There are no letters marked as ${currentFilter.toLowerCase()}`
          }
        />
      ) : (
        <FlatList
          data={filteredLetters}
          renderItem={({ item }) => (
            <LetterCard
              letter={item}
              isLoading={actionLoading}
              onMarkInTransit={() => handleMarkInTransit(item.id)}
              onMarkDelivered={() => handleMarkDelivered(item.id)}
              onMarkUndelivered={() => handleMarkUndelivered(item.id)}
              onPress={() => handleNavigateToDetail(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Modals */}
      <InTransitModal
        visible={showInTransitModal}
        onClose={() => setShowInTransitModal(false)}
        onSubmit={handleInTransitSubmit}
        isLoading={actionLoading}
      />

      <DeliveryModal
        visible={showDeliveryModal}
        onClose={() => setShowDeliveryModal(false)}
        onSubmit={handleDeliverySubmit}
        isLoading={actionLoading}
      />

      <DeclineModal
        visible={showDeclineModal}
        onClose={() => setShowDeclineModal(false)}
        onSubmit={handleDeclineSubmit}
        isLoading={actionLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerGradient: {
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    marginTop: 10,
  },
  greetingText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
  courierName: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.white,
    marginTop: 4,
    // fontFamily: 'SpaceGrotesk-Bold', // Example of custom font if available
  },
  profileButton: {
    padding: 2,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "800",
  },
  statsWrapper: {
    marginTop: -40,
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 11,
  },
  statCard: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 20,
    backgroundColor: colors.white,
    minWidth: 110,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },
  statCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  iconBgActive: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  statLabelActive: {
    color: "rgba(255, 255, 255, 0.9)",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 2,
  },
  statValueActive: {
    color: colors.white,
  },
  listHeader: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  listSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
