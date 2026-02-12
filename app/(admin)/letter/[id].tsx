import { colors } from "@/src/styles/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLetterStore } from "@/store/letterStore";
import { useAdminStore } from "@/store/adminStore";
import { LinearGradient } from "expo-linear-gradient";
import { getFullImageUrl } from "@/src/api/config/axios.config";

export default function AdminLetterDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { letters, fetchLetters, approveLetter, rejectLetter } =
    useLetterStore();
  const { couriers } = useAdminStore();

  const [isActionLoading, setIsActionLoading] = useState(false);

  const letter = useMemo(() => letters.find((l) => l.id === id), [letters, id]);

  const assignedCourier = useMemo(() => {
    if (!letter?.courierId) return null;
    return couriers.find((c) => c.id === letter.courierId);
  }, [letter, couriers]);

  useEffect(() => {
    if (!letter) fetchLetters();
  }, [id]);

  const handleApprove = async () => {
    Alert.alert(
      "Approve Letter",
      "Are you sure you want to approve this letter?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          onPress: async () => {
            setIsActionLoading(true);
            try {
              await approveLetter(id);
              Alert.alert("Success", "Letter has been approved");
            } catch (e) {
              Alert.alert("Error", "Failed to approve letter");
            } finally {
              setIsActionLoading(false);
            }
          },
        },
      ],
    );
  };

  if (!letter) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Fetching letter details...</Text>
      </View>
    );
  }

  const podUrl = getFullImageUrl(letter.podImagePath);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />

      <LinearGradient colors={["#1E3A8A", "#1E40AF"]} style={styles.header}>
        <SafeAreaView edges={["top"]}>
          <View style={styles.navBar}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
            >
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Letter Details</Text>
            <View style={{ width: 40 }} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Status & Priority Badge */}
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor:
                  letter.status === "Delivered"
                    ? colors.success + "15"
                    : letter.status === "Undelivered" ||
                        letter.status === "Rejected"
                      ? colors.danger + "15"
                      : letter.status === "In_Transit"
                        ? colors.warning + "15"
                        : colors.primary + "15",
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  color:
                    letter.status === "Delivered"
                      ? colors.success
                      : letter.status === "Undelivered" ||
                          letter.status === "Rejected"
                        ? colors.danger
                        : letter.status === "In_Transit"
                          ? colors.warning
                          : colors.primary,
                },
              ]}
            >
              {letter.status.replace("_", " ")}
            </Text>
          </View>
          <View
            style={[
              styles.badge,
              {
                backgroundColor:
                  letter.priority === "HIGH"
                    ? colors.danger + "15"
                    : colors.primary + "15",
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  color:
                    letter.priority === "HIGH" ? colors.danger : colors.primary,
                },
              ]}
            >
              {letter.priority} Priority
            </Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoSection}>
            <Text style={styles.sectionLabel}>SENDER INFORMATION</Text>
            <View style={styles.infoRow}>
              <Ionicons
                name="business-outline"
                size={18}
                color={colors.textSecondary}
              />
              <Text style={styles.infoValue}>
                {letter.senderDirectorate?.name || "N/A"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons
                name="person-outline"
                size={18}
                color={colors.textSecondary}
              />
              <Text style={styles.infoValue}>
                {letter.createdBy?.name || "Unknown Sender"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoSection}>
            <Text style={styles.sectionLabel}>RECIPIENT INFORMATION</Text>
            <View style={styles.infoRow}>
              <Ionicons
                name="location-outline"
                size={18}
                color={colors.textSecondary}
              />
              <Text style={styles.infoValue}>{letter.recipientName}</Text>
            </View>
            <Text style={styles.addressText}>{letter.recipientAddress}</Text>
            <Text style={styles.lgaText}>{letter.lgaAddress} LGA</Text>
          </View>
        </View>

        {/* Assignment Card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Assignee Details</Text>
        </View>

        <TouchableOpacity
          style={styles.assignmentCard}
          onPress={() =>
            assignedCourier &&
            router.push(`/(admin)/courier/${assignedCourier.id}`)
          }
        >
          {assignedCourier ? (
            <>
              <View style={styles.courierAvatar}>
                <Text style={styles.avatarText}>
                  {assignedCourier.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.courierInfo}>
                <Text style={styles.courierName}>{assignedCourier.name}</Text>
                <Text style={styles.courierLabel}>Assigned Courier Rider</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textLight}
              />
            </>
          ) : (
            <View style={styles.noCourier}>
              <Ionicons
                name="alert-circle-outline"
                size={24}
                color={colors.warning}
              />
              <Text style={styles.noCourierText}>No courier assigned yet</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* POD Section */}
        {letter.status === "Delivered" && (
          <View style={styles.podSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Proof of Delivery (POD)</Text>
              <View style={styles.successBadge}>
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={colors.success}
                />
                <Text style={styles.successBadgeText}>Verified</Text>
              </View>
            </View>

            <View style={styles.podCard}>
              {podUrl ? (
                <Image
                  source={{ uri: podUrl }}
                  style={styles.podImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.noImagePlaceholder}>
                  <Ionicons
                    name="image-outline"
                    size={48}
                    color={colors.border}
                  />
                  <Text style={styles.noImageText}>
                    POD image not available
                  </Text>
                </View>
              )}
              <View style={styles.podMeta}>
                <Text style={styles.podMetaTitle}>
                  Recipient: {letter.recipientName}
                </Text>
                <Text style={styles.podMetaText}>
                  Delivered on{" "}
                  {letter.deliveredAt
                    ? format(new Date(letter.deliveredAt), "PPP p")
                    : letter.updatedAt
                      ? format(new Date(letter.updatedAt), "PPP p")
                      : "Recently"}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons (For Admin Approval) */}
        {letter.status === "Pending_Approval" && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.approveBtn]}
              onPress={handleApprove}
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={colors.white}
                  />
                  <Text style={styles.btnText}>Approve Letter</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.rejectBtn]}
              onPress={() => {}} // Handle Reject
              disabled={isActionLoading}
            >
              <Ionicons name="close-circle" size={20} color={colors.danger} />
              <Text style={[styles.btnText, { color: colors.danger }]}>
                Reject
              </Text>
            </TouchableOpacity>
          </View>
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
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: colors.textSecondary,
    fontSize: 14,
  },
  header: {
    paddingBottom: 20,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  badgeRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginTop: 20,
    gap: 10,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  infoCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  infoSection: {
    paddingVertical: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textSecondary,
    marginBottom: 16,
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  addressText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 30,
    lineHeight: 20,
  },
  lgaText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
    marginLeft: 30,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },
  assignmentCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  courierAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primary,
  },
  courierInfo: {
    flex: 1,
  },
  courierName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  courierLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  noCourier: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  noCourierText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  podSection: {
    marginTop: 10,
  },
  successBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  successBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.success,
  },
  podCard: {
    marginHorizontal: 20,
    backgroundColor: colors.white,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  podImage: {
    width: "100%",
    height: 250,
  },
  noImagePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  noImageText: {
    marginTop: 12,
    color: colors.textSecondary,
    fontSize: 14,
  },
  podMeta: {
    padding: 20,
    backgroundColor: colors.white,
  },
  podMetaTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },
  podMetaText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 40,
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  approveBtn: {
    backgroundColor: colors.primary,
  },
  rejectBtn: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  btnText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.white,
  },
});
