// import { DeliveryCard } from "@/src/components/delivery/DeliveryCard";
// import { useCourierStore } from "@/src/store/courierStore";
// import { Delivery } from "@/src/types";
// import { useEffect, useState } from "react";
// import { FlatList } from "react-native";

// export function MyDeliveries() {
//   const [deliveries, setDeliveries] = useState<Delivery[]>([]);
//   useEffect(
//     () => setDeliveries(useCourierStore.getState().assignedDeliveries),
//     [],
//   );

//   // const deliveries = useCourierStore((s) => s.assignedDeliveries);

//   return (
//     <FlatList
//       data={deliveries}
//       keyExtractor={(d) => d.id}
//       renderItem={({ item }) => <DeliveryCard delivery={item} />}
//     />
//   );
// }

// COURIER DASHBOARD - Main Screen
// ============================================================================
// app/(courier)/index.tsx

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCourierStore } from "@/store/courierStore";
import { colors } from "@/src/styles/theme/colors";
import type { Delivery } from "@/src/types";

// Mock data for courier
const MOCK_COURIER_DELIVERIES: Delivery[] = [
  {
    id: "1",
    scheduleId: "SCH-2024-001",
    companyName: "Nestle Nigeria PLC",
    title: "Document Delivery",
    destination: "29, Abisogun Street, Ikeja",
    lga: "IKEJA",
    liabilityYear: "2024",
    liabilityAmount: 50000,
    status: "assigned",
    priority: "URGENT",
    submittedAt: new Date().toISOString(),
    assignedAt: new Date().toISOString(),
    contactPerson: "Mr. Johnson",
    contactPhone: "08012345678",
    coordinates: { latitude: 6.6018, longitude: 3.3515 },
  },
  {
    id: "2",
    scheduleId: "SCH-2024-002",
    companyName: "Unilever Nigeria",
    title: "Liability Documents",
    destination: "21, Mercy Eneli Street, Surulere",
    lga: "SURULERE",
    liabilityYear: "2024",
    liabilityAmount: 75000,
    status: "assigned",
    priority: "NORMAL",
    submittedAt: new Date().toISOString(),
    assignedAt: new Date().toISOString(),
    contactPerson: "Mrs. Adeyemi",
    contactPhone: "08098765432",
    coordinates: { latitude: 6.4969, longitude: 3.3562 },
  },
  {
    id: "3",
    scheduleId: "SCH-2024-003",
    companyName: "MTN Nigeria Communications",
    title: "Annual Report",
    destination: "1, Tayo Aderinokun Street, Victoria Island",
    lga: "LAGOS ISLAND",
    liabilityYear: "2024",
    liabilityAmount: 100000,
    status: "en_route",
    priority: "URGENT",
    submittedAt: new Date().toISOString(),
    assignedAt: new Date(Date.now() - 3600000).toISOString(),
    pickedUpAt: new Date(Date.now() - 1800000).toISOString(),
    contactPerson: "Mr. Okonkwo",
    contactPhone: "08056789012",
    coordinates: { latitude: 6.4281, longitude: 3.4278 },
  },
  {
    id: "4",
    scheduleId: "SCH-2024-004",
    companyName: "Access Bank Nigeria",
    title: "Financial Documents",
    destination: "5, Ladoke Akintola Street, Lekki",
    lga: "LEKKI",
    liabilityYear: "2024",
    liabilityAmount: 120000,
    status: "delivered",
    priority: "NORMAL",
    submittedAt: new Date().toISOString(),
    assignedAt: new Date(Date.now() - 7200000).toISOString(),
    completedAt: new Date(Date.now() - 1800000).toISOString(),
    coordinates: { latitude: 6.4469, longitude: 3.5789 },
  },
];

type StatusFilter = "all" | "pending" | "in_progress" | "completed";

export default function CourierDashboard() {
  const router = useRouter();
  const { assignedDeliveries, setAssignedDeliveries, getStats } =
    useCourierStore();
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load mock data on mount
    loadDeliveries();
  }, []);

  const loadDeliveries = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAssignedDeliveries(MOCK_COURIER_DELIVERIES);
    } catch (error) {
      console.error("Failed to load deliveries:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setAssignedDeliveries]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDeliveries();
    setRefreshing(false);
  }, [loadDeliveries]);

  const getFilteredDeliveries = (): Delivery[] => {
    switch (filter) {
      case "pending":
        return assignedDeliveries.filter((d) => d.status === "assigned");
      case "in_progress":
        return assignedDeliveries.filter((d) =>
          ["picked_up", "en_route", "arrived"].includes(d.status),
        );
      case "completed":
        return assignedDeliveries.filter((d) =>
          ["delivered", "returned"].includes(d.status),
        );
      default:
        return assignedDeliveries;
    }
  };

  const stats = getStats();
  const filteredDeliveries = getFilteredDeliveries();

  const renderDeliveryCard = ({ item }: { item: Delivery }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/(courier)/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.scheduleInfo}>
          <Text style={styles.scheduleId}>{item.scheduleId}</Text>
          <Text style={styles.companyName}>{item.companyName}</Text>
        </View>
        <View
          style={[
            styles.priorityBadge,
            {
              backgroundColor:
                item.priority === "URGENT"
                  ? colors.danger + "20"
                  : colors.warning + "20",
            },
          ]}
        >
          <Text
            style={[
              styles.priorityText,
              {
                color:
                  item.priority === "URGENT" ? colors.danger : colors.warning,
              },
            ]}
          >
            {item.priority}
          </Text>
        </View>
      </View>

      <View style={styles.destination}>
        <Ionicons name="location" size={14} color={colors.textSecondary} />
        <Text style={styles.destinationText} numberOfLines={1}>
          {item.destination}
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.lgaBadge}>
          <Text style={styles.lgaText}>{item.lga}</Text>
        </View>
        <View style={styles.statusIndicator}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  item.status === "assigned"
                    ? colors.warning
                    : item.status === "delivered"
                      ? colors.success
                      : colors.primary,
              },
            ]}
          />
          <Text style={styles.statusText}>
            {item.status === "assigned"
              ? "Pending"
              : item.status === "delivered"
                ? "Delivered"
                : "In Progress"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cube-outline" size={64} color={colors.textLight} />
      <Text style={styles.emptyTitle}>No Deliveries</Text>
      <Text style={styles.emptyText}>
        {filter === "all"
          ? "You have no assigned deliveries at the moment"
          : `No ${filter} deliveries`}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="list" size={24} color={colors.warning} />
          <Text style={styles.statNumber}>{stats.assigned}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="car" size={24} color={colors.primary} />
          <Text style={styles.statNumber}>{stats.enRoute}</Text>
          <Text style={styles.statLabel}>In Transit</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={24} color={colors.success} />
          <Text style={styles.statNumber}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {(["all", "pending", "in_progress", "completed"] as StatusFilter[]).map(
          (f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterTab, filter === f && styles.filterTabActive]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filter === f && styles.filterTabTextActive,
                ]}
              >
                {f === "all"
                  ? "All"
                  : f === "pending"
                    ? "Pending"
                    : f === "in_progress"
                      ? "In Progress"
                      : "Completed"}
              </Text>
            </TouchableOpacity>
          ),
        )}
      </View>

      {/* Delivery List */}
      <FlatList
        data={filteredDeliveries}
        keyExtractor={(item) => item.id}
        renderItem={renderDeliveryCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterTabText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  filterTabTextActive: {
    color: colors.white,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleId: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  companyName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginTop: 2,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "600",
  },
  destination: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  destinationText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lgaBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  lgaText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: "600",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
});
