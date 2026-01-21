// import { DeliveryCard } from "@/src/components/delivery/DeliveryCard";
// import { useDeliveryStore } from "@/src/store/deliveryStore";
// import { useEffect } from "react";
// import { FlatList, Text, View } from "react-native";
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { deliveryStyles } from '@/src/styles/delivery';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBadge } from '@/src/components/common/StatusBadge';
import { EmptyState } from "@/src/components/common/EmptyState";
import { LoadingSpinner } from "@/src/components/common/LoadingSpinner";
import { useAuthStore } from "@/src/store";
import { useCourierStore } from "@/src/store/courierStore";
import { colors } from "@/src/theme/colors";
import { DeliveryCard } from '@/src/components/delivery/DeliveryCard';
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { useState, useEffect, useCallback } from "react";
// import { Alert, View, TouchableOpacity, FlatList, RefreshControl } from "react-native";

// export default function CourierDeliveries() {
//   // Get deliveries directly from the store
//   const deliveries = useDeliveryStore((state) => state.getCourierDeliveries());

//   useEffect(() => {
//     console.log("Courier deliveries:", deliveries.length);
//   }, [deliveries]);

//   return (
//     <View style={{ flex: 1, padding: 16 }}>
//       <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
//         My Assigned Deliveries ({deliveries.length})
//       </Text>

//       <FlatList
//         data={deliveries}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => <DeliveryCard delivery={item} />}
//       />
//     </View>
//   );
// }

// Main Dashboard Screen
export default function CourierDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { assignedDeliveries, setAssignedDeliveries, getStats } = useCourierStore();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  // Mock data generator
  // const generateMockDeliveries = () => {
  //   return [
  //     {
  //       id: '1',
  //       scheduleId: 'SCH-2024-001',
  //       companyName: 'Nestle Nigeria PLC',
  //       destination: '29, Abisogun Street, Ikeja',
  //       lga: 'IKEJA',
  //       contactPerson: 'Mr. Johnson',
  //       contactPhone: '08012345678',
  //       priority: 'URGENT' as const,
  //       status: 'assigned' as const,
  //       assignedAt: new Date().toISOString(),
  //       coordinates: { latitude: 6.6018, longitude: 3.3515 },
  //     },
  //     {
  //       id: '2',
  //       scheduleId: 'SCH-2024-002',
  //       companyName: 'Unilever Nigeria',
  //       destination: '21, Mercy Eneli Street, Surulere',
  //       lga: 'SURULERE',
  //       priority: 'NORMAL' as const,
  //       status: 'picked_up' as const,
  //       assignedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  //       coordinates: { latitude: 6.4969, longitude: 3.3562 },
  //     },
  //     {
  //       id: '3',
  //       scheduleId: 'SCH-2024-003',
  //       companyName: 'GlaxoSmithKline Nigeria',
  //       destination: '5, Industrial Avenue, Lagos Island',
  //       lga: 'LAGOS ISLAND',
  //       priority: 'NORMAL' as const,
  //       status: 'en_route' as const,
  //       assignedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  //       coordinates: { latitude: 6.4578, longitude: 3.4297 },
  //     },
  //     {
  //       id: '4',
  //       scheduleId: 'SCH-2024-004',
  //       companyName: 'First Bank Nigeria',
  //       destination: '35, Marina Street, Lagos Island',
  //       lga: 'LAGOS ISLAND',
  //       priority: 'NORMAL' as const,
  //       status: 'arrived' as const,
  //       assignedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  //       coordinates: { latitude: 6.4578, longitude: 3.4297 },
  //     },
  //     {
  //       id: '5',
  //       scheduleId: 'SCH-2024-005',
  //       companyName: 'Access Bank',
  //       destination: '123, Lekki-Epe Expressway, Lekki',
  //       lga: 'LEKKI',
  //       priority: 'NORMAL' as const,
  //       status: 'delivered' as const,
  //       assignedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  //       completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  //       coordinates: { latitude: 6.4667, longitude: 3.5667 },
  //     },
  //   ];
  // };

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
      Alert.alert('Error', 'Failed to load deliveries');
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
      case 'pending':
        return assignedDeliveries.filter((d) => d.status === 'assigned');
      case 'in_progress':
        return assignedDeliveries.filter((d) =>
          ['picked_up', 'en_route', 'arrived'].includes(d.status)
        );
      case 'completed':
        return assignedDeliveries.filter((d) =>
          ['delivered', 'returned'].includes(d.status)
        );
      default:
        return assignedDeliveries;
    }
  };

  const stats = getStats();
  const filteredDeliveries = getFilteredDeliveries();

  if (isLoading && assignedDeliveries.length === 0) {
    return <LoadingSpinner fullScreen message="Loading deliveries..." />;
  }

  return (
    <SafeAreaView style={deliveryStyles.container}>
      {/* Stats Summary */}
      <View style={deliveryStyles.statsContainer}>
        <View style={deliveryStyles.statCard}>
          <Ionicons name="radio-button-off" size={20} color={colors.warning} />
          <Text style={deliveryStyles.statNumber}>{stats.assigned}</Text>
          <Text style={deliveryStyles.statLabel}>Pending</Text>
        </View>
        <View style={deliveryStyles.statCard}>
          <Ionicons name="car" size={20} color={colors.info} />
          <Text style={deliveryStyles.statNumber}>{stats.enRoute}</Text>
          <Text style={deliveryStyles.statLabel}>In Route</Text>
        </View>
        <View style={deliveryStyles.statCard}>
          <Ionicons name="checkmark-done-circle" size={20} color={colors.success} />
          <Text style={deliveryStyles.statNumber}>{stats.completed}</Text>
          <Text style={deliveryStyles.statLabel}>Done</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={deliveryStyles.filterContainer}>
        {(['all', 'pending', 'in_progress', 'completed'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[deliveryStyles.filterTab, filter === f && deliveryStyles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                deliveryStyles.filterTabText,
                filter === f && deliveryStyles.filterTabTextActive,
              ]}
            >
              {f === 'all'
                ? 'All'
                : f === 'pending'
                ? 'Pending'
                : f === 'in_progress'
                ? 'In Progress'
                : 'Completed'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Deliveries List */}
      <FlatList
        data={filteredDeliveries}
        keyExtractor={(item) => item.id}
        renderItem={({ item ,index}) => (
          <DeliveryCard
            id={item.id}
            scheduleId={item.scheduleId}
            companyName={item.companyName}
            destination={item.destination}
            lga={item.lga}
            priority={item.priority}
            status={item.status}
            onPress={() => handleDeliveryPress(item.id)}
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
              filter === 'all'
                ? 'You have no assigned deliveries at the moment'
                : `No ${filter.replace('_', ' ')} deliveries`
            }
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

