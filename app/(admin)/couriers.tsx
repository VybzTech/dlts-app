import { useAdminStore } from "@/store/adminStore";
import { colors } from "@/src/styles/theme/colors";
import { User } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  RefreshControl,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLetterStore } from "@/store/letterStore";

export default function AdminCouriers() {
  const router = useRouter();
  const { letters, fetchLetters } = useLetterStore();
  const {
    couriers,
    fetchCouriers,
    isLoading: couriersLoading,
  } = useAdminStore();
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([fetchLetters(), fetchCouriers()]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getCourierStats = (courierId: string) => {
    const courierLetters = letters.filter(
      (l) => l.courierId === courierId.toString(),
    );
    const delivered = courierLetters.filter(
      (l) => l.status === "Delivered",
    ).length;
    const pending = courierLetters.filter((l) =>
      ["Assigned", "In_Transit"].includes(l.status),
    ).length;

    return {
      total: courierLetters.length,
      delivered,
      pending,
      rate:
        courierLetters.length > 0
          ? (delivered / courierLetters.length) * 100
          : 0,
    };
  };

  const filteredCouriers = couriers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search)),
  );

  const renderCourierCard = ({ item }: { item: User }) => {
    const stats = getCourierStats(item.id);

    return (
      <TouchableOpacity
        style={styles.courierCard}
        onPress={() => router.push(`/(admin)/courier/${item.id}`)}
        activeOpacity={0.8}
      >
        <View style={styles.cardTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.unitRow}>
              <Ionicons name="business" size={12} color={colors.primary} />
              <Text style={styles.unit}>{item.unit} Unit</Text>
            </View>
          </View>
          <View style={styles.rateChip}>
            <Text style={styles.rateText}>{stats.rate.toFixed(0)}%</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statVal}>{stats.total}</Text>
            <Text style={styles.statLabel}>Assigned</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={[styles.statVal, { color: colors.warning }]}>
              {stats.pending}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={[styles.statVal, { color: colors.success }]}>
              {stats.delivered}
            </Text>
            <Text style={styles.statLabel}>Success</Text>
          </View>
          <View style={styles.chevron}>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textLight}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <SafeAreaView edges={["top"]} style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>Courier Team</Text>
          <Text style={styles.subtitle}>
            {couriers.length} registered personnel
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, email or phone..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={colors.textLight}
          />
        </View>

        <FlatList
          data={filteredCouriers}
          keyExtractor={(item) => item.id}
          renderItem={renderCourierCard}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="people-outline" size={64} color={colors.border} />
              <Text style={styles.emptyText}>
                No couriers matching your search
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  searchContainer: {
    marginHorizontal: 24,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    borderRadius: 16,
    height: 52,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: colors.text,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  courierCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.primary,
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
  },
  unitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  unit: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },
  rateChip: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  rateText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.success,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 16,
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statVal: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: "700",
    marginTop: 2,
    textTransform: "uppercase",
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "#F1F5F9",
  },
  chevron: {
    paddingLeft: 10,
  },
  empty: {
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 20,
  },
});
