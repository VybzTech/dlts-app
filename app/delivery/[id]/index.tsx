import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDeliveryStore } from '../../../src/store/deliveryStore';
import { api, failureReasons } from '../../../src/services/api';
import { StatusBadge } from '../../../src/components/common/StatusBadge';
import { LoadingSpinner } from '../../../src/components/common/LoadingSpinner';
import { colors, priorityLabels, statusLabels } from '../../../src/theme/colors';
import type { Delivery, DeliveryStatus } from '../../../src/types';

export default function DeliveryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { deliveries, updateDeliveryStatus } = useDeliveryStore();
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const found = deliveries.find((d) => d.id === id);
    if (found) {
      setDelivery(found);
    } else {
      // Fetch from API if not in store
      api.getDeliveryById(id).then((data) => {
        if (data) setDelivery(data);
      });
    }
  }, [id, deliveries]);

  const handleStatusUpdate = async (newStatus: DeliveryStatus) => {
    if (!delivery) return;

    setIsLoading(true);
    try {
      await api.updateDeliveryStatus(delivery.id, newStatus);
      updateDeliveryStatus(delivery.id, newStatus);
      setDelivery({ ...delivery, status: newStatus });
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkReturned = () => {
    Alert.alert(
      'Mark as Returned',
      'Select reason for return:',
      failureReasons.map((reason) => ({
        text: reason,
        onPress: async () => {
          setIsLoading(true);
          try {
            await api.markReturned(delivery!.id, reason);
            updateDeliveryStatus(delivery!.id, 'returned');
            router.back();
          } catch (error) {
            Alert.alert('Error', 'Failed to mark as returned');
          } finally {
            setIsLoading(false);
          }
        },
      })),
      { cancelable: true }
    );
  };

  const handleNavigate = () => {
    router.push(`/delivery/${id}/navigate`);
  };

  const handleCapturePOD = () => {
    router.push(`/delivery/${id}/pod`);
  };

  const openInMaps = () => {
    if (delivery?.coordinates) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${delivery.coordinates.latitude},${delivery.coordinates.longitude}`;
      Linking.openURL(url);
    }
  };

  const callContact = () => {
    if (delivery?.contactPhone) {
      Linking.openURL(`tel:${delivery.contactPhone}`);
    }
  };

  if (!delivery) {
    return <LoadingSpinner fullScreen message="Loading delivery details..." />;
  }

  const priorityColor = colors.priority[delivery.priority];
  const isCompleted = ['delivered', 'returned'].includes(delivery.status);

  return (
    <>
      <Stack.Screen
        options={{
          title: delivery.scheduleId,
        }}
      />
      <ScrollView style={styles.container}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <StatusBadge status={delivery.status} size="large" />
            <View style={[styles.priorityBadge, { backgroundColor: priorityColor + '20' }]}>
              <Text style={[styles.priorityText, { color: priorityColor }]}>
                {priorityLabels[delivery.priority]} Priority
              </Text>
            </View>
          </View>
          <Text style={styles.companyName}>{delivery.companyName}</Text>
          <Text style={styles.scheduleId}>{delivery.scheduleId}</Text>
        </View>

        {/* Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery Details</Text>

          <View style={styles.detailRow}>
            <Ionicons name="location" size={20} color={colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Destination</Text>
              <Text style={styles.detailValue}>{delivery.destination}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="business" size={20} color={colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>LGA</Text>
              <Text style={styles.detailValue}>{delivery.lga}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="mail" size={20} color={colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Letter Count</Text>
              <Text style={styles.detailValue}>{delivery.letterCount} letter(s)</Text>
            </View>
          </View>

          {delivery.contactPerson && (
            <View style={styles.detailRow}>
              <Ionicons name="person" size={20} color={colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Contact Person</Text>
                <Text style={styles.detailValue}>{delivery.contactPerson}</Text>
              </View>
            </View>
          )}

          {delivery.contactPhone && (
            <TouchableOpacity style={styles.detailRow} onPress={callContact}>
              <Ionicons name="call" size={20} color={colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Phone</Text>
                <Text style={[styles.detailValue, styles.linkText]}>{delivery.contactPhone}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
            </TouchableOpacity>
          )}

          {delivery.notes && (
            <View style={styles.detailRow}>
              <Ionicons name="document-text" size={20} color={colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Notes</Text>
                <Text style={styles.detailValue}>{delivery.notes}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        {!isCompleted && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickAction} onPress={openInMaps}>
                <View style={[styles.quickActionIcon, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="navigate" size={24} color={colors.primary} />
                </View>
                <Text style={styles.quickActionText}>Open Maps</Text>
              </TouchableOpacity>

              {delivery.contactPhone && (
                <TouchableOpacity style={styles.quickAction} onPress={callContact}>
                  <View style={[styles.quickActionIcon, { backgroundColor: colors.successLight }]}>
                    <Ionicons name="call" size={24} color={colors.success} />
                  </View>
                  <Text style={styles.quickActionText}>Call</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Status Timeline */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Status Timeline</Text>
          <View style={styles.timeline}>
            {(['assigned', 'picked_up', 'en_route', 'arrived', 'delivered'] as DeliveryStatus[]).map(
              (status, index) => {
                const isActive = getStatusIndex(delivery.status) >= index;
                const isCurrent = delivery.status === status;
                return (
                  <View key={status} style={styles.timelineItem}>
                    <View
                      style={[
                        styles.timelineDot,
                        isActive && styles.timelineDotActive,
                        isCurrent && styles.timelineDotCurrent,
                      ]}
                    >
                      {isActive && <Ionicons name="checkmark" size={12} color={colors.white} />}
                    </View>
                    {index < 4 && (
                      <View
                        style={[
                          styles.timelineLine,
                          isActive && styles.timelineLineActive,
                        ]}
                      />
                    )}
                    <Text
                      style={[
                        styles.timelineLabel,
                        isActive && styles.timelineLabelActive,
                      ]}
                    >
                      {statusLabels[status]}
                    </Text>
                  </View>
                );
              }
            )}
          </View>
        </View>

        {/* Action Buttons */}
        {!isCompleted && (
          <View style={styles.actions}>
            {delivery.status === 'assigned' && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                onPress={() => handleStatusUpdate('picked_up')}
                disabled={isLoading}
              >
                <Ionicons name="cube" size={20} color={colors.white} />
                <Text style={styles.actionButtonText}>Mark as Picked Up</Text>
              </TouchableOpacity>
            )}

            {delivery.status === 'picked_up' && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.warning }]}
                onPress={() => handleStatusUpdate('en_route')}
                disabled={isLoading}
              >
                <Ionicons name="car" size={20} color={colors.white} />
                <Text style={styles.actionButtonText}>Start Delivery (En Route)</Text>
              </TouchableOpacity>
            )}

            {delivery.status === 'en_route' && (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.primary }]}
                  onPress={handleNavigate}
                >
                  <Ionicons name="navigate" size={20} color={colors.white} />
                  <Text style={styles.actionButtonText}>Navigate to Location</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.info }]}
                  onPress={() => handleStatusUpdate('arrived')}
                  disabled={isLoading}
                >
                  <Ionicons name="flag" size={20} color={colors.white} />
                  <Text style={styles.actionButtonText}>Mark as Arrived</Text>
                </TouchableOpacity>
              </>
            )}

            {delivery.status === 'arrived' && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.success }]}
                onPress={handleCapturePOD}
              >
                <Ionicons name="create" size={20} color={colors.white} />
                <Text style={styles.actionButtonText}>Capture Proof of Delivery</Text>
              </TouchableOpacity>
            )}

            {/* Return Button - Available for all non-completed statuses */}
            <TouchableOpacity
              style={[styles.actionButton, styles.returnButton]}
              onPress={handleMarkReturned}
              disabled={isLoading}
            >
              <Ionicons name="return-down-back" size={20} color={colors.danger} />
              <Text style={[styles.actionButtonText, { color: colors.danger }]}>
                Unable to Deliver
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Completed Status */}
        {isCompleted && (
          <View style={[styles.card, styles.completedCard]}>
            <Ionicons
              name={delivery.status === 'delivered' ? 'checkmark-circle' : 'close-circle'}
              size={48}
              color={delivery.status === 'delivered' ? colors.success : colors.danger}
            />
            <Text style={styles.completedText}>
              {delivery.status === 'delivered' ? 'Delivery Completed' : 'Delivery Returned'}
            </Text>
            {delivery.completedAt && (
              <Text style={styles.completedDate}>
                {new Date(delivery.completedAt).toLocaleString()}
              </Text>
            )}
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </>
  );
}

function getStatusIndex(status: DeliveryStatus): number {
  const statuses: DeliveryStatus[] = ['assigned', 'picked_up', 'en_route', 'arrived', 'delivered'];
  return statuses.indexOf(status);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  statusCard: {
    backgroundColor: colors.white,
    padding: 20,
    marginBottom: 12,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  companyName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  scheduleId: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.white,
    padding: 20,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailContent: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    color: colors.text,
  },
  linkText: {
    color: colors.primary,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 16,
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  timeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  timelineItem: {
    alignItems: 'center',
    flex: 1,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDotActive: {
    backgroundColor: colors.success,
  },
  timelineDotCurrent: {
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.primaryLight,
  },
  timelineLine: {
    position: 'absolute',
    top: 11,
    left: '50%',
    width: '100%',
    height: 2,
    backgroundColor: colors.border,
    zIndex: -1,
  },
  timelineLineActive: {
    backgroundColor: colors.success,
  },
  timelineLabel: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
  timelineLabelActive: {
    color: colors.text,
    fontWeight: '500',
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  returnButton: {
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  completedCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  completedText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
  },
  completedDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  bottomSpacer: {
    height: 32,
  },
});
