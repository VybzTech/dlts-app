import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDeliveryStore } from '../../src/store/deliveryStore';
import { api } from '../../src/services/api';
import { DeliveryCard } from '../../src/components/delivery/DeliveryCard';
import { EmptyState } from '../../src/components/common/EmptyState';
import { LoadingSpinner } from '../../src/components/common/LoadingSpinner';
import { colors } from '../../src/theme/colors';
import type { StatusFilter, Delivery } from '../../src/types';

const filterOptions: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
];

export default function DashboardScreen() {
  const router = useRouter();
  const {
    deliveries,
    filter,
    isLoading,
    setDeliveries,
    setFilter,
    setLoading,
    getFilteredDeliveries,
    getPendingCount,
  } = useDeliveryStore();

  const [refreshing, setRefreshing] = useState(false);

  const loadDeliveries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getDeliveries();
      setDeliveries(data);
    } catch (error) {
      console.error('Failed to load deliveries:', error);
    } finally {
      setLoading(false);
    }
  }, [setDeliveries, setLoading]);
  
  const loadCourierDeliveries = useCallback(async (id:string) => {
    setLoading(true);
    try {
      const data = await api.getCourierDeliveries(id);
      setDeliveries(data);
    } catch (error) {
      console.error('Failed to load deliveries:', error);
    } finally {
      setLoading(false);
    }
  }, [setDeliveries, setLoading]);

  useEffect(() => {
    loadDeliveries();
  }, [loadDeliveries]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDeliveries();
    setRefreshing(false);
  }, [loadDeliveries]);

  const handleDeliveryPress = (delivery: Delivery) => {
    router.push(`/delivery/${delivery.id}`);
  };

  const filteredDeliveries = getFilteredDeliveries();
  const pendingCount = getPendingCount();

  // Filter out completed deliveries from main dashboard view
  const activeDeliveries = filteredDeliveries.filter(
    (d) => !['delivered', 'returned'].includes(d.status) || filter === 'completed' || filter === 'all'
  );

  if (isLoading && deliveries.length === 0) {
    return <LoadingSpinner fullScreen message="Loading deliveries..." />;
  }

  console.log(deliveries)
  return (
    <View style={dashboardStyles.container}>
      {/* Stats Summary */}
      <View style={dashboardStyles.statsContainer}>
        <View style={dashboardStyles.statCard}>
          <Ionicons name="time-outline" size={24} color={colors.warning} />
          <Text style={dashboardStyles.statNumber}>{pendingCount}</Text>
          <Text style={dashboardStyles.statLabel}>Pending</Text>
        </View>
        <View style={dashboardStyles.statCard}>
          <Ionicons name="checkmark-circle-outline" size={24} color={colors.success} />
          <Text style={dashboardStyles.statNumber}>
            {deliveries.filter((d) => d.status === 'delivered').length}
          </Text>
          <Text style={dashboardStyles.statLabel}>Delivered</Text>
        </View>
        <View style={dashboardStyles.statCard}>
          <Ionicons name="return-down-back-outline" size={24} color={colors.danger} />
          <Text style={dashboardStyles.statNumber}>
            {deliveries.filter((d) => d.status === 'returned').length}
          </Text>
          <Text style={dashboardStyles.statLabel}>Returned</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={dashboardStyles.filterContainer}>
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              dashboardStyles.filterTab,
              filter === option.key && dashboardStyles.filterTabActive,
            ]}
            onPress={() => setFilter(option.key)}
          >
            <Text
              style={[
                dashboardStyles.filterTabText,
                filter === option.key && dashboardStyles.filterTabTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Delivery List */}
      <FlatList
        data={activeDeliveries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DeliveryCard delivery={item} onPress={() => handleDeliveryPress(item)} />
        )}
        contentContainerStyle={dashboardStyles.listContent}
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
    </View>
  );
}

const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: colors.white,
  },
  listContent: {
    padding: 16,
    paddingTop: 4,
  },
});
