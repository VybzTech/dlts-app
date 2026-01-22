import { useAdminStore } from "@/src/store/adminStore";
import { useMgtStore } from "@/src/store/mgtStore";
import { colors } from "@/src/theme/colors";
import { User } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ManagementCouriers() {
  const couriers = useAdminStore((s) => s.couriers);
  const deliveries = useMgtStore((s) => s.submittedLetters);

  const getCourierStats = (courierId: string) => {
    const courierDeliveries = deliveries.filter(
      (d) => d.assignedCourierId === `COU-${courierId}`
    );
    return {
      total: courierDeliveries.length,
      delivered: courierDeliveries.filter((d) => d.status === "delivered").length,
      pending: courierDeliveries.filter((d) => d.status === "pending_approval").length,
    };
  };

  const renderCourierCard = ({ item }: { item: User }) => {
    const stats = getCourierStats(item.id);

    return (
      <View style={styles.courierCard}>
        <View style={styles.courierHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={24} color={colors.primary} />
          </View>
          <View style={styles.courierInfo}>
            <Text style={styles.courierName}>{item.fullName}</Text>
            <Text style={styles.courierUnit}>{item.unit.toUpperCase()} Unit</Text>
            <Text style={styles.courierEmail}>{item.email}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {stats.total}
            </Text>
            <Text style={styles.statLabel}>Assigned</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.warning }]}>
              {stats.pending}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {stats.delivered}
            </Text>
            <Text style={styles.statLabel}>Delivered</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Courier Performance</Text>
        <Text style={styles.headerSubtitle}>
          {couriers.length} active couriers
        </Text>
      </View>

      <FlatList
        data={couriers}
        keyExtractor={(item) => item.id}
        renderItem={renderCourierCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No couriers found</Text>
          </View>
        }
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  courierCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  courierHeader: {
    flexDirection: "row",
    marginBottom: 16,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  courierInfo: {
    flex: 1,
  },
  courierName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  courierUnit: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "500",
    marginTop: 2,
  },
  courierEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
  },
});
