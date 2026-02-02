import { DeliveryCard } from "@/src/components/delivery/DeliveryCard";
import { useMgtStore } from "@/store/mgtStore";
import { colors } from "@/src/styles/theme/colors";
import { StatusFilter } from "@/src/types";
import { useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const filterOptions: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  { label: "Returned", value: "returned" },
];

export default function ManagementLetters() {
  const deliveries = useMgtStore((s) => s.submittedLetters);
  const stats = useMgtStore((s) => s.getStats());
  const [filter, setFilter] = useState<StatusFilter>("all");

  const filteredDeliveries = deliveries.filter((d) => {
    switch (filter) {
      case "pending":
        return d.status === "pending_approval";
      case "completed":
        return d.status === "delivered";
      case "returned":
        return d.status === "returned";
      default:
        return true;
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Letters Overview</Text>
        <Text style={styles.headerSubtitle}>
          All submitted letters and their status
        </Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View
          style={[styles.statCard, { backgroundColor: colors.primary + "15" }]}
        >
          <Text style={[styles.statNumber, { color: colors.primary }]}>
            {stats.submitted}
          </Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View
          style={[styles.statCard, { backgroundColor: colors.warning + "15" }]}
        >
          <Text style={[styles.statNumber, { color: colors.warning }]}>
            {stats.pending}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View
          style={[styles.statCard, { backgroundColor: colors.success + "15" }]}
        >
          <Text style={[styles.statNumber, { color: colors.success }]}>
            {stats.completed}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.filterTab,
              filter === option.value && styles.filterTabActive,
            ]}
            onPress={() => setFilter(option.value)}
          >
            <Text
              style={[
                styles.filterText,
                filter === option.value && styles.filterTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Deliveries List */}
      <FlatList
        data={filteredDeliveries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DeliveryCard delivery={item} id={Number(item.id)} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
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
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
