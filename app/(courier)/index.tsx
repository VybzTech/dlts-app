import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
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

export default function CourierDashboard() {
  const { user } = useAuthStore();
  const {
    filteredLetters,
    isLoading,
    error,
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

  if (isLoading && filteredLetters.length === 0) {
    return <LoadingSpinner fullScreen message="Loading letters..." />;
  }

  const statFilters = [
    { label: "All", value: "all" as const, count: stats.total },
    { label: "Pending", value: "Allocated" as const, count: stats.pending },
    {
      label: "In Transit",
      value: "InTransit" as const,
      count: stats.inTransit,
    },
    { label: "Delivered", value: "Delivered" as const, count: stats.delivered },
    {
      label: "Undelivered",
      value: "Undelivered" as const,
      count: stats.undelivered,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back, {user?.name}!</Text>
          <Text style={styles.subGreeting}>Manage your letter deliveries</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.[0]?.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Stats Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statsScroll}
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
            <Text
              style={[
                styles.statLabel,
                currentFilter === stat.value && styles.statLabelActive,
              ]}
            >
              {stat.label}
            </Text>
            <Text
              style={[
                styles.statValue,
                currentFilter === stat.value && styles.statValueActive,
              ]}
            >
              {stat.count}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Letters List */}
      {filteredLetters.length === 0 ? (
        <EmptyState
          icon="📭"
          title="No Letters"
          message={
            currentFilter === "all"
              ? "You don't have any assigned letters yet"
              : `No ${currentFilter.toLowerCase()} letters`
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
            />
          )}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState
              icon="📭"
              title="No Letters"
              message="Pull to refresh"
            />
          }
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  greeting: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  subGreeting: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  statsScroll: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  statsContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  statCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    minWidth: 100,
    alignItems: "center",
  },
  statCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  statLabelActive: {
    color: "#fff",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginTop: 4,
  },
  statValueActive: {
    color: "#fff",
  },
  listContent: {
    paddingVertical: 12,
  },
});
