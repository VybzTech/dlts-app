// import { useAdminStore } from "@/store/adminStore";
// import { colors, statusLabels } from "@/src/theme/colors";
// import { Delivery } from "@/src/types";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { useEffect, useState } from "react";
// import {
//   FlatList,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// const filterLabels: Record<string, string> = {
//   all: "All",
//   pending_approval: "Pending",
//   delivered: "Delivered",
//   returned: "Returned",
// };

// export default function AdminLetters() {
//   const router = useRouter();
//   const allDeliveries = useAdminStore((s) => s.allDeliveries);
//   const [deliveries, setDeliveries] = useState<Delivery[]>([]);
//   const [selectedFilter, setSelectedFilter] = useState<string>("all");

//   const filters = ["all", "pending_approval", "delivered", "returned"];

//   useEffect(() => {
//     setDeliveries(allDeliveries);
//   }, [allDeliveries]);

//   const filteredDeliveries =
//     selectedFilter === "all"
//       ? deliveries
//       : deliveries.filter((d) => d.status === selectedFilter);

//   const getFilterCount = (filter: string) => {
//     if (filter === "all") return deliveries.length;
//     return deliveries.filter((d) => d.status === filter).length;
//   };

//   const handleLetterPress = (letter: Delivery) => {
//     router.push(`/(admin)/letter/${letter.id}` as any);
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-NG", {
//       style: "currency",
//       currency: "NGN",
//       minimumFractionDigits: 0,
//     }).format(amount);
//   };

//   const renderLetterCard = ({ item }: { item: Delivery }) => {
//     const statusColor =
//       item.status === "delivered"
//         ? colors.success
//         : item.status === "returned"
//         ? colors.danger
//         : colors.warning;

//     return (
//       <TouchableOpacity
//         style={styles.letterCard}
//         onPress={() => handleLetterPress(item)}
//         activeOpacity={0.7}
//       >
//         <View style={styles.cardHeader}>
//           <View style={styles.trackingContainer}>
//             <Text style={styles.trackingId}>{item.trackingId}</Text>
//             <View style={[styles.priorityBadge, {
//               backgroundColor: item.priority === "URGENT" ? colors.danger + "15" : colors.textSecondary + "15"
//             }]}>
//               <Text style={[styles.priorityText, {
//                 color: item.priority === "URGENT" ? colors.danger : colors.textSecondary
//               }]}>
//                 {item.priority}
//               </Text>
//             </View>
//           </View>
//           <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
//             <Text style={styles.statusText}>
//               {statusLabels[item.status] || item.status}
//             </Text>
//           </View>
//         </View>

//         <Text style={styles.letterTitle} numberOfLines={1}>
//           {item.title}
//         </Text>

//         <View style={styles.companyRow}>
//           <Ionicons name="business-outline" size={14} color={colors.textSecondary} />
//           <Text style={styles.companyName} numberOfLines={1}>
//             {item.companyName}
//           </Text>
//         </View>

//         <View style={styles.addressRow}>
//           <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
//           <Text style={styles.addressText} numberOfLines={1}>
//             {item.destination}
//           </Text>
//         </View>

//         <View style={styles.cardFooter}>
//           <View style={styles.footerLeft}>
//             <View style={styles.lgaBadge}>
//               <Text style={styles.lgaText}>{item.lga}</Text>
//             </View>
//             <Text style={styles.yearText}>{item.liabilityYear}</Text>
//           </View>
//           <View style={styles.footerRight}>
//             <Text style={styles.liabilityAmount}>
//               {formatCurrency(item.liabilityAmount)}
//             </Text>
//             <Ionicons name="chevron-forward" size={18} color={colors.border} />
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>All Letters</Text>
//         <Text style={styles.headerSubtitle}>
//           {deliveries.length} total letters
//         </Text>
//       </View>

//       {/* Filter Tabs */}
//       <View style={styles.filterContainer}>
//         {filters.map((filter) => (
//           <TouchableOpacity
//             key={filter}
//             onPress={() => setSelectedFilter(filter)}
//             style={[
//               styles.filterTab,
//               selectedFilter === filter && styles.filterTabActive,
//             ]}
//           >
//             <Text
//               style={[
//                 styles.filterText,
//                 selectedFilter === filter && styles.filterTextActive,
//               ]}
//             >
//               {filterLabels[filter]} ({getFilterCount(filter)})
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <FlatList
//         data={filteredDeliveries}
//         keyExtractor={(item) => item.id}
//         renderItem={renderLetterCard}
//         contentContainerStyle={styles.listContent}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Ionicons name="mail-outline" size={48} color={colors.textSecondary} />
//             <Text style={styles.emptyText}>No letters found</Text>
//           </View>
//         }
//       />
//     </SafeAreaView>
//   );
// }

// app/(admin)/index.tsx - Admin Dashboard
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/styles/theme/colors";

export default function AdminDashboard() {
  const stats = [
    {
      label: "Total Deliveries",
      value: "247",
      icon: "mail",
      color: colors.primary,
    },
    { label: "Pending", value: "34", icon: "hourglass", color: colors.warning },
    {
      label: "Delivered",
      value: "195",
      icon: "checkmark-done-circle",
      color: colors.success,
    },
    {
      label: "Failed",
      value: "18",
      icon: "close-circle",
      color: colors.danger,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>System Overview</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, idx) => (
            <View key={idx} style={styles.statCard}>
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: stat.color + "20" },
                ]}
              >
                <Ionicons
                  name={stat.icon as any}
                  size={24}
                  color={stat.color}
                />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="people-outline" size={24} color={colors.primary} />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Manage Couriers</Text>
              <Text style={styles.actionSubtitle}>
                Assign deliveries & track performance
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.border} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="mail-outline" size={24} color={colors.success} />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>View All Letters</Text>
              <Text style={styles.actionSubtitle}>
                Monitor all submissions & deliveries
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.border} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="analytics-outline" size={24} color={colors.info} />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>View Analytics</Text>
              <Text style={styles.actionSubtitle}>
                Detailed performance metrics
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.border} />
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {[1, 2, 3].map((_, idx) => (
            <View key={idx} style={styles.activityCard}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.success}
              />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>
                  Delivery SCH-2024-{String(idx + 1).padStart(3, "0")} completed
                </Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
          ))}
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
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 12,
  },
  statCard: {
    width: "48%",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  actionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: "500",
  },
  activityTime: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  courierCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  courierAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  courierAvatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
  },
  courierContent: {
    flex: 1,
  },
  courierName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  courierStats: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },
  courierStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  courierStatText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  letterCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  letterLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  letterContent: {
    flex: 1,
  },
  letterSchedule: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  letterCompany: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "600",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  placeholderSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginTop: 12,
  },
  placeholderText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 28,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.white,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  staffId: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.danger,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.danger,
  },
});
