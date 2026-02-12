import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  RefreshControl,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/styles/theme/colors";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { useLetterStore } from "@/store/letterStore";
import { LetterCard } from "@/src/components/letter/LetterCard";
import { Icon } from "@/src/hooks/useIcons";
import { EmptyState } from "@/src/components/common/EmptyState";

export default function ManagementDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    fetchLetters,
    filteredLetters,
    isLoading,
    getStats,
    currentFilter,
    setFilter,
  } = useLetterStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await fetchLetters(1, "all");
    } catch (error) {
      console.error("Failed to load management data", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const stats = getStats();

  const filterOptions = [
    {
      label: "All",
      value: "all" as const,
      count: stats.total,
      icon: "list-outline",
    },
    {
      label: "Pending",
      value: "Pending_Approval" as const,
      count: stats.pending,
      icon: "time-outline",
    },
    {
      label: "Delivered",
      value: "Delivered" as const,
      count: stats.delivered,
      icon: "checkmark-done-outline",
    },
    {
      label: "Failed",
      value: "Undelivered" as const,
      count: stats.undelivered,
      icon: "alert-circle-outline",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Premium Header */}
      <LinearGradient
        colors={["#0F172A", "#1E293B"]}
        style={styles.headerGradient}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greetingText}>Registry Overview</Text>
              <Text style={styles.userName}>{user?.name || "Management"}</Text>
            </View>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push("/(mgt)/profile")}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.[0]?.toUpperCase() || "M"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Stats / Filters Bar */}
      <View style={styles.filtersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {filterOptions.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.filterCard,
                currentFilter === opt.value && styles.filterCardActive,
              ]}
              onPress={() => setFilter(opt.value)}
            >
              <View
                style={[
                  styles.filterIconBg,
                  currentFilter === opt.value
                    ? styles.filterIconBgActive
                    : { backgroundColor: "#F1F5F9" },
                ]}
              >
                <Ionicons
                  name={opt.icon as any}
                  size={18}
                  color={
                    currentFilter === opt.value
                      ? colors.white
                      : colors.textSecondary
                  }
                />
              </View>
              <Text
                style={[
                  styles.filterCount,
                  currentFilter === opt.value && styles.filterTextActive,
                ]}
              >
                {opt.count}
              </Text>
              <Text
                style={[
                  styles.filterLabel,
                  currentFilter === opt.value && styles.filterTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Submitted Letters</Text>
        <Text style={styles.listSubtitle}>
          {filteredLetters.length} items found
        </Text>
      </View>

      {filteredLetters.length === 0 && !isLoading ? (
        <EmptyState
          icon="mail-outline"
          title="No Records"
          message="No letters found for this category"
        />
      ) : (
        <FlatList
          data={filteredLetters}
          renderItem={({ item }) => (
            <LetterCard
              letter={item}
              onPress={() => router.push(`/(mgt)/letter/${item.id}`)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}
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
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  greetingText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  userName: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.white,
    marginTop: 2,
  },
  profileButton: {
    padding: 2,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#1E293B",
    fontSize: 18,
    fontWeight: "800",
  },
  filtersWrapper: {
    marginTop: -30,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    gap: 12,
  },
  filterCard: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    minWidth: 100,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },
  filterCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterIconBg: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  filterIconBgActive: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  filterCount: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSecondary,
    marginTop: 2,
  },
  filterTextActive: {
    color: colors.white,
  },
  listHeader: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  listSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  listContent: {
    paddingBottom: 40,
  },
});
