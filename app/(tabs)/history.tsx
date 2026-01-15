import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDeliveryStore } from '../../src/store/deliveryStore';
import { EmptyState } from '../../src/components/common/EmptyState';
import { StatusBadge } from '../../src/components/common/StatusBadge';
import { colors, priorityLabels } from '../../src/theme/colors';
import type { Delivery } from '../../src/types';
import { format } from 'date-fns';

type HistoryFilter = 'all' | 'delivered' | 'returned';

export default function HistoryScreen() {
  const router = useRouter();
  const { deliveries } = useDeliveryStore();
  const [filter, setFilter] = useState<HistoryFilter>('all');

  // Get completed deliveries only
  const completedDeliveries = deliveries.filter((d) =>
    ['delivered', 'returned'].includes(d.status)
  );

  // Apply filter
  const filteredDeliveries = completedDeliveries.filter((d) => {
    if (filter === 'all') return true;
    return d.status === filter;
  });

  // Sort by completion date (most recent first)
  const sortedDeliveries = [...filteredDeliveries].sort((a, b) => {
    const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
    const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
    return dateB - dateA;
  });

  const handleDeliveryPress = (delivery: Delivery) => {
    router.push(`/delivery/${delivery.id}`);
  };

  const renderItem = ({ item }: { item: Delivery }) => {
    const priorityColor = colors.priority[item.priority];

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleDeliveryPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons
              name={item.status === 'delivered' ? 'checkmark-circle' : 'close-circle'}
              size={24}
              color={item.status === 'delivered' ? colors.success : colors.danger}
            />
            <View style={styles.headerText}>
              <Text style={styles.scheduleId}>{item.scheduleId}</Text>
              {item.completedAt && (
                <Text style={styles.date}>
                  {format(new Date(item.completedAt), 'MMM d, yyyy • h:mm a')}
                </Text>
              )}
            </View>
          </View>
          <StatusBadge status={item.status} size="small" />
        </View>

        <Text style={styles.companyName}>{item.companyName}</Text>

        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.address} numberOfLines={1}>
            {item.destination}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.footerItem}>
            <Ionicons name="business-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.footerText}>{item.lga}</Text>
          </View>
          <View style={[styles.priorityBadge, { backgroundColor: priorityColor + '20' }]}>
            <Text style={[styles.priorityText, { color: priorityColor }]}>
              {priorityLabels[item.priority]}
            </Text>
          </View>
        </View>

        {item.status === 'returned' && item.notes && (
          <View style={styles.notesContainer}>
            <Ionicons name="alert-circle" size={14} color={colors.danger} />
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        )}

        {item.pod && (
          <View style={styles.podIndicator}>
            <Ionicons name="document-text" size={14} color={colors.success} />
            <Text style={styles.podText}>POD captured</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Summary Stats */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{completedDeliveries.length}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: colors.success }]}>
            {completedDeliveries.filter((d) => d.status === 'delivered').length}
          </Text>
          <Text style={styles.summaryLabel}>Delivered</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: colors.danger }]}>
            {completedDeliveries.filter((d) => d.status === 'returned').length}
          </Text>
          <Text style={styles.summaryLabel}>Returned</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {(['all', 'delivered', 'returned'] as HistoryFilter[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={sortedDeliveries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="time-outline"
            title="No History"
            message="Your completed deliveries will appear here"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  summary: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 20,
    marginBottom: 12,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 20,
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
  list: {
    padding: 16,
    paddingTop: 4,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerText: {},
  scheduleId: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  date: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  address: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.dangerLight,
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  notesText: {
    flex: 1,
    fontSize: 12,
    color: colors.danger,
  },
  podIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  podText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
  },
});
