import { useMgtStore } from "@/store/mgtStore";
import { colors } from "@/src/styles/theme/colors";
import { Delivery } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ManagementHistory() {
  const deliveries = useMgtStore((s) => s.submittedLetters);

  const completedDeliveries = deliveries
    .filter((d) => ["delivered", "returned"].includes(d.status))
    .sort((a, b) => {
      const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return dateB - dateA;
    });

  const renderHistoryCard = ({ item }: { item: Delivery }) => {
    const isDelivered = item.status === "delivered";

    return (
      <TouchableOpacity style={styles.historyCard} activeOpacity={0.7}>
        <View style={styles.cardLeft}>
          <View
            style={[
              styles.statusIcon,
              {
                backgroundColor: isDelivered
                  ? colors.success + "15"
                  : colors.danger + "15",
              },
            ]}
          >
            <Ionicons
              name={isDelivered ? "checkmark-circle" : "close-circle"}
              size={24}
              color={isDelivered ? colors.success : colors.danger}
            />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.scheduleId}>{item.scheduleId}</Text>
            <Text style={styles.companyName} numberOfLines={1}>
              {item.companyName}
            </Text>
            <Text style={styles.destination} numberOfLines={1}>
              {item.destination}
            </Text>
            {item.completedAt && (
              <Text style={styles.completedDate}>
                {format(new Date(item.completedAt), "MMM d, yyyy 'at' h:mm a")}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.cardRight}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: isDelivered ? colors.success : colors.danger },
            ]}
          >
            <Text style={styles.statusText}>
              {isDelivered ? "Delivered" : "Returned"}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.border} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Delivery History</Text>
        <Text style={styles.headerSubtitle}>
          {completedDeliveries.length} completed deliveries
        </Text>
      </View>

      <FlatList
        data={completedDeliveries}
        keyExtractor={(item) => item.id}
        renderItem={renderHistoryCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="time-outline"
              size={48}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyTitle}>No History</Text>
            <Text style={styles.emptyText}>
              Completed deliveries will appear here
            </Text>
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
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statusIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  scheduleId: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  companyName: {
    fontSize: 13,
    color: colors.text,
    marginTop: 2,
  },
  destination: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  completedDate: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 4,
  },
  cardRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.white,
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
