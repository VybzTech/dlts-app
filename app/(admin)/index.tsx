import { useAdminStore } from "@/src/store/adminStore";
import { colors, statusLabels } from "@/src/theme/colors";
import { Delivery } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const filterLabels: Record<string, string> = {
  all: "All",
  pending_approval: "Pending",
  delivered: "Delivered",
  returned: "Returned",
};

export default function AdminLetters() {
  const router = useRouter();
  const allDeliveries = useAdminStore((s) => s.allDeliveries);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filters = ["all", "pending_approval", "delivered", "returned"];

  useEffect(() => {
    setDeliveries(allDeliveries);
  }, [allDeliveries]);

  const filteredDeliveries =
    selectedFilter === "all"
      ? deliveries
      : deliveries.filter((d) => d.status === selectedFilter);

  const getFilterCount = (filter: string) => {
    if (filter === "all") return deliveries.length;
    return deliveries.filter((d) => d.status === filter).length;
  };

  const handleLetterPress = (letter: Delivery) => {
    router.push(`/(admin)/letter/${letter.id}` as any);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const renderLetterCard = ({ item }: { item: Delivery }) => {
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
        <View style={styles.cardHeader}>
          <View style={styles.trackingContainer}>
            <Text style={styles.trackingId}>{item.trackingId}</Text>
            <View style={[styles.priorityBadge, {
              backgroundColor: item.priority === "URGENT" ? colors.danger + "15" : colors.textSecondary + "15"
            }]}>
              <Text style={[styles.priorityText, {
                color: item.priority === "URGENT" ? colors.danger : colors.textSecondary
              }]}>
                {item.priority}
              </Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>
              {statusLabels[item.status] || item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.letterTitle} numberOfLines={1}>
          {item.title}
        </Text>

        <View style={styles.companyRow}>
          <Ionicons name="business-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.companyName} numberOfLines={1}>
            {item.companyName}
          </Text>
        </View>

        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.addressText} numberOfLines={1}>
            {item.destination}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.footerLeft}>
            <View style={styles.lgaBadge}>
              <Text style={styles.lgaText}>{item.lga}</Text>
            </View>
            <Text style={styles.yearText}>{item.liabilityYear}</Text>
          </View>
          <View style={styles.footerRight}>
            <Text style={styles.liabilityAmount}>
              {formatCurrency(item.liabilityAmount)}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.border} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Letters</Text>
        <Text style={styles.headerSubtitle}>
          {deliveries.length} total letters
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setSelectedFilter(filter)}
            style={[
              styles.filterTab,
              selectedFilter === filter && styles.filterTabActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive,
              ]}
            >
              {filterLabels[filter]} ({getFilterCount(filter)})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredDeliveries}
        keyExtractor={(item) => item.id}
        renderItem={renderLetterCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="mail-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No letters found</Text>
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
    paddingBottom: 12,
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
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.white,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  letterCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  trackingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  trackingId: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "600",
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
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  companyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  companyName: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  addressText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  lgaBadge: {
    backgroundColor: colors.primary + "15",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  lgaText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.primary,
  },
  yearText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  liabilityAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
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
