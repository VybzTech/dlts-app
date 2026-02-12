import { useAdminStore } from "@/store/adminStore";
import { colors } from "@/src/styles/theme/colors";
import { Letter } from "@/src/types/letter.types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLetterStore } from "@/store/letterStore";
import { LinearGradient } from "expo-linear-gradient";
import { LetterCard } from "@/src/components/letter/LetterCard";

export default function CourierDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const couriers = useAdminStore((s) => s.couriers);
  const { letters, fetchLetters, isLoading } = useLetterStore();
  const { selectedCourier, fetchCourierDetail } = useAdminStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    await Promise.all([fetchLetters(), fetchCourierDetail(id)]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const courier = useMemo(
    () => selectedCourier || couriers.find((c) => c.id === id),
    [selectedCourier, couriers, id],
  );

  const courierLetters = useMemo(
    () => letters.filter((l) => l.courierId === id),
    [letters, id],
  );

  const stats = useMemo(() => {
    const delivered = courierLetters.filter((l) => l.status === "Delivered");
    const pending = courierLetters.filter((l) =>
      ["Assigned", "In_Transit"].includes(l.status),
    );

    return {
      total: courierLetters.length,
      delivered: delivered.length,
      pending: pending.length,
      rate:
        courierLetters.length > 0
          ? (delivered.length / courierLetters.length) * 100
          : 0,
      liability: courierLetters.reduce(
        (sum, l) => sum + (Number(l.liabilityValue) || 0),
        0,
      ),
    };
  }, [courierLetters]);

  if (!courier) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Courier profile not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header with Background */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={["top"]}>
          <View style={styles.headerNav}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconBtn}
            >
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Rider Profile</Text>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons
                name="ellipsis-vertical"
                size={20}
                color={colors.white}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{courier.name.charAt(0)}</Text>
              <View style={styles.statusDot} />
            </View>
            <Text style={styles.courierName}>{courier.name}</Text>
            <Text style={styles.courierRole}>
              {courier.staffId} • {courier.unit} Unit
            </Text>

            <View style={styles.contactRow}>
              <TouchableOpacity style={styles.contactBtn}>
                <Ionicons name="call" size={16} color={colors.white} />
                <Text style={styles.contactBtnText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactBtn}>
                <Ionicons name="mail" size={16} color={colors.white} />
                <Text style={styles.contactBtnText}>Email</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Performance Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Letters</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {stats.delivered}
            </Text>
            <Text style={styles.statLabel}>Delivered</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.rate.toFixed(0)}%</Text>
            <Text style={styles.statLabel}>Success</Text>
          </View>
        </View>

        {/* Assigned Letters Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Current Assignments</Text>
          <Text style={styles.letterCount}>{courierLetters.length} active</Text>
        </View>

        {courierLetters.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="documents-outline"
              size={48}
              color={colors.border}
            />
            <Text style={styles.emptyText}>
              No letters currently assigned to this rider
            </Text>
          </View>
        ) : (
          courierLetters.map((letter) => (
            <LetterCard
              key={letter.id}
              letter={letter}
              onPress={() => router.push(`/(admin)/letter/${letter.id}`)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerGradient: {
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  iconBtn: {
    padding: 8,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  profileInfo: {
    alignItems: "center",
    marginTop: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "800",
    color: colors.white,
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#10B981",
    position: "absolute",
    bottom: -4,
    right: -4,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  courierName: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.white,
    marginTop: 16,
  },
  courierRole: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "600",
    marginTop: 4,
  },
  contactRow: {
    flexDirection: "row",
    marginTop: 20,
    gap: 12,
  },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 8,
  },
  contactBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  statsCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    marginTop: -30,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 8,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "600",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#F1F5F9",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  letterCount: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "700",
  },
  emptyState: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  backBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  backBtnText: {
    color: colors.white,
    fontWeight: "700",
  },
});
