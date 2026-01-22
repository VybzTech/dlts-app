import { useAdminStore } from "@/src/store/adminStore";
import { colors } from "@/src/theme/colors";
import { Delivery, User } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CourierDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const couriers = useAdminStore((s) => s.couriers);
  const allDeliveries = useAdminStore((s) => s.allDeliveries);

  const courier = useMemo(
    () => couriers.find((c) => c.id === id),
    [couriers, id]
  );

  const courierDeliveries = useMemo(
    () => allDeliveries.filter((d) => d.assignedCourierId === `COU-${id}`),
    [allDeliveries, id]
  );

  const stats = useMemo(() => {
    const delivered = courierDeliveries.filter((d) => d.status === "delivered");
    const returned = courierDeliveries.filter((d) => d.status === "returned");
    const pending = courierDeliveries.filter((d) => d.status === "pending_approval");
    const totalLiability = courierDeliveries.reduce(
      (sum, d) => sum + (d.liabilityAmount || 0),
      0
    );
    const deliveredLiability = delivered.reduce(
      (sum, d) => sum + (d.liabilityAmount || 0),
      0
    );
    const returnedLiability = returned.reduce(
      (sum, d) => sum + (d.liabilityAmount || 0),
      0
    );

    // Get unique LGAs
    const locations = [...new Set(courierDeliveries.map((d) => d.lga))];

    // Calculate delivery rate (delivered / total completed)
    const completed = delivered.length + returned.length;
    const deliveryRate = completed > 0 ? (delivered.length / completed) * 100 : 0;

    return {
      total: courierDeliveries.length,
      delivered: delivered.length,
      returned: returned.length,
      pending: pending.length,
      totalLiability,
      deliveredLiability,
      returnedLiability,
      locations,
      deliveryRate,
    };
  }, [courierDeliveries]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleLetterPress = (letter: Delivery) => {
    router.push(`/(admin)/letter/${letter.id}` as any);
  };

  if (!courier) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Courier not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderLetterItem = ({ item }: { item: Delivery }) => {
    const statusColor =
      item.status === "delivered"
        ? colors.success
        : item.status === "returned"
        ? colors.danger
        : colors.warning;

    return (
      <TouchableOpacity
        style={styles.letterCard}
        onPress={() => handleLetterPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.letterHeader}>
          <Text style={styles.trackingId}>{item.trackingId}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>
              {item.status === "pending_approval"
                ? "Pending"
                : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
        <Text style={styles.letterTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.letterCompany} numberOfLines={1}>
          {item.companyName}
        </Text>
        <View style={styles.letterFooter}>
          <Text style={styles.letterLiability}>
            {formatCurrency(item.liabilityAmount)}
          </Text>
          <View style={styles.priorityBadge}>
            <Text
              style={[
                styles.priorityText,
                { color: item.priority === "URGENT" ? colors.danger : colors.textSecondary },
              ]}
            >
              {item.priority}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Courier Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Ionicons name="person" size={40} color={colors.primary} />
          </View>
          <Text style={styles.courierName}>{courier.fullName}</Text>
          <Text style={styles.staffId}>{courier.staffId}</Text>

          <View style={styles.contactRow}>
            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={16} color={colors.primary} />
              <Text style={styles.contactText}>{courier.phone || "N/A"}</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={16} color={colors.primary} />
              <Text style={styles.contactText}>{courier.email}</Text>
            </View>
          </View>

          <View style={styles.locationBadge}>
            <Ionicons name="location" size={14} color={colors.white} />
            <Text style={styles.locationText}>
              {courier.unit.toUpperCase()} Unit
            </Text>
          </View>
        </View>

        {/* Delivery Rate Card */}
        <View style={styles.rateCard}>
          <Text style={styles.sectionTitle}>Delivery Performance</Text>
          <View style={styles.rateRow}>
            <View style={styles.rateCircle}>
              <Text style={styles.ratePercent}>
                {stats.deliveryRate.toFixed(0)}%
              </Text>
              <Text style={styles.rateLabel}>Success Rate</Text>
            </View>
            <View style={styles.rateStats}>
              <View style={styles.rateStat}>
                <Text style={[styles.rateStatValue, { color: colors.success }]}>
                  {stats.delivered}
                </Text>
                <Text style={styles.rateStatLabel}>Delivered</Text>
              </View>
              <View style={styles.rateStat}>
                <Text style={[styles.rateStatValue, { color: colors.danger }]}>
                  {stats.returned}
                </Text>
                <Text style={styles.rateStatLabel}>Returned</Text>
              </View>
              <View style={styles.rateStat}>
                <Text style={[styles.rateStatValue, { color: colors.warning }]}>
                  {stats.pending}
                </Text>
                <Text style={styles.rateStatLabel}>Pending</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Ionicons name="documents-outline" size={24} color={colors.primary} />
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Letters</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="location-outline" size={24} color={colors.info} />
            <Text style={styles.statValue}>{stats.locations.length}</Text>
            <Text style={styles.statLabel}>Locations</Text>
          </View>
        </View>

        {/* Liability Section */}
        <View style={styles.liabilityCard}>
          <Text style={styles.sectionTitle}>Liability Overview</Text>
          <View style={styles.liabilityRow}>
            <View style={styles.liabilityItem}>
              <Text style={styles.liabilityLabel}>Total Assigned</Text>
              <Text style={styles.liabilityValue}>
                {formatCurrency(stats.totalLiability)}
              </Text>
            </View>
          </View>
          <View style={styles.liabilityBreakdown}>
            <View style={[styles.liabilityBox, { backgroundColor: colors.success + "15" }]}>
              <Text style={[styles.liabilityBoxLabel, { color: colors.success }]}>
                Delivered
              </Text>
              <Text style={[styles.liabilityBoxValue, { color: colors.success }]}>
                {formatCurrency(stats.deliveredLiability)}
              </Text>
            </View>
            <View style={[styles.liabilityBox, { backgroundColor: colors.danger + "15" }]}>
              <Text style={[styles.liabilityBoxLabel, { color: colors.danger }]}>
                Returned
              </Text>
              <Text style={[styles.liabilityBoxValue, { color: colors.danger }]}>
                {formatCurrency(stats.returnedLiability)}
              </Text>
            </View>
          </View>
        </View>

        {/* Assigned Locations */}
        <View style={styles.locationsCard}>
          <Text style={styles.sectionTitle}>Assigned Locations</Text>
          <View style={styles.locationsList}>
            {stats.locations.length > 0 ? (
              stats.locations.map((loc, index) => (
                <View key={index} style={styles.locationChip}>
                  <Text style={styles.locationChipText}>{loc}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No locations assigned</Text>
            )}
          </View>
        </View>

        {/* Letters List */}
        <View style={styles.lettersSection}>
          <Text style={styles.sectionTitle}>
            Managed Letters ({courierDeliveries.length})
          </Text>
          {courierDeliveries.length > 0 ? (
            <FlatList
              data={courierDeliveries}
              keyExtractor={(item) => item.id}
              renderItem={renderLetterItem}
              scrollEnabled={false}
              contentContainerStyle={styles.lettersList}
            />
          ) : (
            <View style={styles.emptyLetters}>
              <Ionicons
                name="mail-outline"
                size={48}
                color={colors.textSecondary}
              />
              <Text style={styles.emptyText}>No letters assigned</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  profileCard: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  courierName: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  staffId: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  contactRow: {
    width: "100%",
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: colors.text,
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  locationText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.white,
  },
  rateCard: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  rateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rateCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  ratePercent: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.primary,
  },
  rateLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  rateStats: {
    flex: 1,
  },
  rateStat: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  rateStatValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  rateStatLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: "row",
    marginHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  liabilityCard: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  liabilityRow: {
    marginBottom: 12,
  },
  liabilityItem: {
    alignItems: "center",
  },
  liabilityLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  liabilityValue: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary,
  },
  liabilityBreakdown: {
    flexDirection: "row",
    gap: 12,
  },
  liabilityBox: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  liabilityBoxLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  liabilityBoxValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  locationsCard: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  locationsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  locationChip: {
    backgroundColor: colors.primary + "15",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  locationChipText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "500",
  },
  noDataText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  lettersSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  lettersList: {
    gap: 10,
  },
  letterCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
  },
  letterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  trackingId: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.white,
  },
  letterTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 4,
  },
  letterCompany: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  letterFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  letterLiability: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: colors.background,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "600",
  },
  emptyLetters: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: colors.white,
    fontWeight: "600",
  },
});
