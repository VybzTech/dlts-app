import { EmptyState } from "@/src/components/common/EmptyState";
import { LoadingSpinner } from "@/src/components/common/LoadingSpinner";
import { StatsCard } from "@/src/components/courier/StatsCard";
import { DeliveryCard } from "@/src/components/delivery/DeliveryCard";
import { useAuthStore } from "@/src/store";
import { useCourierStore } from "@/src/store/courierStore";
import { deliveryStyles } from "@/src/styles/delivery";
import { colors } from "@/src/theme/colors";
import { FilterType } from "@/src/types/delivery.types";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Main Dashboard Screen
export default function CourierDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { assignedDeliveries, setAssignedDeliveries, getStats } =
    useCourierStore();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");

  // Load deliveries
  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      // const mockData = generateMockDeliveries();
      // setAssignedDeliveries(mockData);
      setAssignedDeliveries(assignedDeliveries);
    } catch (error) {
      Alert.alert("Error", "Failed to load deliveries");
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDeliveries();
    setRefreshing(false);
  }, []);

  const handleDeliveryPress = (id: string) => {
    // router.push(`@/(courier)/${id}`);
    // router.push(`@/(courier)/${id}`);
  };

  // Filter deliveries
  const getFilteredDeliveries = () => {
    switch (filter) {
      case "pending":
        return assignedDeliveries.filter(
          (d) => d.status === "pending_approval",
        );
      case "completed":
        return assignedDeliveries.filter((d) => d.status === "completed");
      case "returned":
        return assignedDeliveries.filter((d) => d.status === "returned");
      default:
        return assignedDeliveries;
    }
  };

  const stats = getStats();
  const filteredDeliveries = getFilteredDeliveries();

  if (isLoading && assignedDeliveries.length === 0) {
    return <LoadingSpinner fullScreen message="Loading deliveries..." />;
  }

  const statsCards = [
    {
      label: "All",
      value: stats.assigned + stats.completed + stats.returned,
      icon: "mail",
      filterKey: "all" as const,
    },
    {
      label: "Pending",
      value: stats.assigned,
      icon: "time-outline",
      filterKey: "pending" as const,
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: "checkmark-circle",
      filterKey: "completed" as const,
    },
    {
      label: "Returned",
      value: stats.returned,
      // icon: "close-circle",
      iconLibrary: "feather",
      // iconLibrary: "fontawesome6",
      icon: "rotate-ccw",
      // icon: "rotate-left",
      filterKey: "returned" as const,
    },
  ];

  return (
    <SafeAreaView style={deliveryStyles.container}>
      <Text style={deliveryStyles.header}>My Letters</Text>
      {/* Stats Summary */}
      <View style={deliveryStyles.statsContainer}>
        {statsCards.map((card) => (
          <StatsCard
            key={card.filterKey}
            label={card.label}
            value={card.value}
            icon={card.icon}
            iconLibrary={card.iconLibrary}
            filterKey={card.filterKey}
            activeFilter={filter}
            onPress={setFilter}
          />
        ))}
      </View>
      {/* Filter Tabs */}
      {/* <View style={deliveryStyles.filterContainer}>
        {(["all", "pending", "completed", "returned"] as const).map((f) => (
          <Pressable
            key={f}
            style={[
              deliveryStyles.filterTab,
              filter === f && deliveryStyles.filterTabActive,
            ]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                deliveryStyles.filterTabText,
                filter === f && deliveryStyles.filterTabTextActive,
              ]}
            >
              {f === "all"
                ? "All"
                : f === "pending"
                  ? "Pending"
                  : f === "completed"
                    ? "Completed"
                    : "Returned"}
            </Text>
          </Pressable>
        ))}
      </View> */}

      {/* Deliveries List */}
      <FlatList
        data={filteredDeliveries}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <DeliveryCard
            id={item.id}
            delivery={item}
            // scheduleId={item.scheduleId}
            // companyName={item.companyName}
            // destination={item.destination}
            // lga={item.lga}
            // priority={item.priority}
            // status={item.status}
            // onPress={() => handleDeliveryPress(item.id)}
          />
        )}
        contentContainerStyle={deliveryStyles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="mail"
            title="No Deliveries"
            message={
              filter === "all"
                ? "You have no assigned deliveries at the moment"
                : `No ${filter.replace("_", " ")} deliveries`
            }
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
