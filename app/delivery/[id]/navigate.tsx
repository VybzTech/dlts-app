import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useDeliveryStore } from '../../../src/store/deliveryStore';
import { api } from '../../../src/services/api';
import { LoadingSpinner } from '../../../src/components/common/LoadingSpinner';
import { colors } from '../../../src/theme/colors';
import type { Delivery } from '../../../src/types';

export default function NavigateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { deliveries, updateDeliveryStatus } = useDeliveryStore();
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const found = deliveries.find((d) => d.id === id);
    if (found) {
      setDelivery(found);
    }
  }, [id, deliveries]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required for navigation');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  useEffect(() => {
    if (currentLocation && delivery?.coordinates) {
      const dist = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        delivery.coordinates.latitude,
        delivery.coordinates.longitude
      );
      setDistance(dist);
    }
  }, [currentLocation, delivery]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (deg: number): number => deg * (Math.PI / 180);

  const openGoogleMaps = () => {
    if (!delivery?.coordinates) {
      Alert.alert('Error', 'Delivery coordinates not available');
      return;
    }

    const { latitude, longitude } = delivery.coordinates;
    const url = Platform.select({
      ios: `maps://app?daddr=${latitude},${longitude}`,
      android: `google.navigation:q=${latitude},${longitude}`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
    });

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Fallback to web URL
        Linking.openURL(
          `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
        );
      }
    });
  };

  const handleArrived = async () => {
    if (!delivery) return;

    setIsLoading(true);
    try {
      await api.updateDeliveryStatus(delivery.id, 'arrived');
      updateDeliveryStatus(delivery.id, 'arrived');
      router.push(`/delivery/${id}/pod`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  if (!delivery) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  const estimatedTime = distance ? Math.round((distance / 30) * 60) : null; // Assuming 30 km/h average

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Navigate',
        }}
      />
      <View style={styles.container}>
        {/* Map Placeholder */}
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={80} color={colors.textLight} />
          <Text style={styles.mapPlaceholderText}>
            Map View{'\n'}(Tap "Open Maps" for navigation)
          </Text>
        </View>

        {/* Info Panel */}
        <View style={styles.infoPanel}>
          {/* Destination Info */}
          <View style={styles.destinationCard}>
            <View style={styles.destinationIcon}>
              <Ionicons name="location" size={24} color={colors.white} />
            </View>
            <View style={styles.destinationContent}>
              <Text style={styles.destinationLabel}>Destination</Text>
              <Text style={styles.destinationName}>{delivery.companyName}</Text>
              <Text style={styles.destinationAddress}>{delivery.destination}</Text>
            </View>
          </View>

          {/* Distance & ETA */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="navigate-circle" size={28} color={colors.primary} />
              <Text style={styles.statValue}>
                {distance ? `${distance.toFixed(1)} km` : '--'}
              </Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="time" size={28} color={colors.warning} />
              <Text style={styles.statValue}>
                {estimatedTime ? `${estimatedTime} min` : '--'}
              </Text>
              <Text style={styles.statLabel}>Est. Time</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.mapsButton} onPress={openGoogleMaps}>
              <Ionicons name="navigate" size={24} color={colors.white} />
              <Text style={styles.mapsButtonText}>Open in Google Maps</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.arrivedButton}
              onPress={handleArrived}
              disabled={isLoading}
            >
              <Ionicons name="checkmark-circle" size={24} color={colors.white} />
              <Text style={styles.arrivedButtonText}>
                {isLoading ? 'Updating...' : "I've Arrived"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Contact Info */}
          {delivery.contactPhone && (
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => Linking.openURL(`tel:${delivery.contactPhone}`)}
            >
              <Ionicons name="call" size={20} color={colors.primary} />
              <Text style={styles.contactButtonText}>
                Call {delivery.contactPerson || 'Contact'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  mapPlaceholderText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  infoPanel: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  destinationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  destinationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  destinationContent: {
    flex: 1,
    marginLeft: 12,
  },
  destinationLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  destinationName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  destinationAddress: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  actions: {
    gap: 12,
  },
  mapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4285F4', // Google Maps blue
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  mapsButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  arrivedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  arrivedButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginTop: 12,
    gap: 8,
  },
  contactButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});
