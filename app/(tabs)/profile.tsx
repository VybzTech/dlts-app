import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { useDeliveryStore } from '../../src/store/deliveryStore';
import { colors } from '../../src/theme/colors';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { deliveries } = useDeliveryStore();

  // Calculate stats
  const totalDeliveries = deliveries.length;
  const deliveredCount = deliveries.filter((d) => d.status === 'delivered').length;
  const returnedCount = deliveries.filter((d) => d.status === 'returned').length;
  const pendingCount = deliveries.filter((d) =>
    !['delivered', 'returned'].includes(d.status)
  ).length;
  const successRate = totalDeliveries > 0
    ? Math.round((deliveredCount / (deliveredCount + returnedCount)) * 100) || 0
    : 0;

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.fullName?.charAt(0) || 'C'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.fullName || 'Courier'}</Text>
        <Text style={styles.unit}>{user?.unit || 'Dispatch Unit'}</Text>
        <View style={styles.staffIdBadge}>
          <Ionicons name="id-card-outline" size={14} color={colors.primary} />
          <Text style={styles.staffIdText}>{user?.staffId || 'N/A'}</Text>
        </View>
      </View>

      {/* Stats Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Performance Overview</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="cube" size={20} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>{totalDeliveries}</Text>
            <Text style={styles.statLabel}>Total Assigned</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.successLight }]}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            </View>
            <Text style={styles.statValue}>{deliveredCount}</Text>
            <Text style={styles.statLabel}>Delivered</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.dangerLight }]}>
              <Ionicons name="close-circle" size={20} color={colors.danger} />
            </View>
            <Text style={styles.statValue}>{returnedCount}</Text>
            <Text style={styles.statLabel}>Returned</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.warningLight }]}>
              <Ionicons name="hourglass" size={20} color={colors.warning} />
            </View>
            <Text style={styles.statValue}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Success Rate */}
        <View style={styles.successRateContainer}>
          <View style={styles.successRateHeader}>
            <Text style={styles.successRateLabel}>Success Rate</Text>
            <Text style={styles.successRateValue}>{successRate}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${successRate}%`,
                  backgroundColor: successRate >= 80 ? colors.success : successRate >= 60 ? colors.warning : colors.danger,
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Account Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account Information</Text>

        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Username</Text>
            <Text style={styles.infoValue}>{user?.username || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="business-outline" size={20} color={colors.textSecondary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Unit</Text>
            <Text style={styles.infoValue}>{user?.unit || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="id-card-outline" size={20} color={colors.textSecondary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Staff ID</Text>
            <Text style={styles.infoValue}>{user?.staffId || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>About</Text>

        <View style={styles.infoRow}>
          <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>App Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.textSecondary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>MVP</Text>
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color={colors.danger} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>LIRS Document & Logistics Tracking System</Text>
        <Text style={styles.footerSubtext}>Courier Mobile App</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  unit: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 12,
  },
  staffIdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  staffIdText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    width: '47%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  successRateContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  successRateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  successRateLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  successRateValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dangerLight,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.danger,
  },
  footer: {
    alignItems: 'center',
    padding: 24,
    marginTop: 8,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  footerSubtext: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 4,
  },
});
