import { useAdminStore } from "@/src/store/adminStore";
import { colors, statusLabels } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LetterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const allDeliveries = useAdminStore((s) => s.allDeliveries);
  const couriers = useAdminStore((s) => s.couriers);

  const letter = useMemo(
    () => allDeliveries.find((d) => d.id === id),
    [allDeliveries, id]
  );

  const assignedCourier = useMemo(() => {
    if (!letter?.assignedCourierId) return null;
    const courierId = letter.assignedCourierId.replace("COU-", "");
    return couriers.find((c) => c.id === courierId);
  }, [letter, couriers]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
  };

  if (!letter) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Letter not found</Text>
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

  const statusColor =
    letter.status === "delivered"
      ? colors.success
      : letter.status === "returned"
      ? colors.danger
      : colors.warning;

  const priorityColor =
    letter.priority === "URGENT" ? colors.danger : colors.textSecondary;

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
          <Text style={styles.headerTitle}>Letter Details</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Main Info Card */}
        <View style={styles.mainCard}>
          <View style={styles.trackingRow}>
            <Text style={styles.trackingId}>{letter.trackingId}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusText}>
                {statusLabels[letter.status] || letter.status}
              </Text>
            </View>
          </View>

          <Text style={styles.letterTitle}>{letter.title}</Text>

          <View style={styles.priorityRow}>
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: priorityColor + "15" },
              ]}
            >
              <Ionicons
                name={letter.priority === "URGENT" ? "alert-circle" : "flag"}
                size={14}
                color={priorityColor}
              />
              <Text style={[styles.priorityText, { color: priorityColor }]}>
                {letter.priority}
              </Text>
            </View>
            <Text style={styles.scheduleId}>{letter.scheduleId}</Text>
          </View>
        </View>

        {/* Recipient Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipient Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="business" size={18} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Company</Text>
                <Text style={styles.infoValue}>{letter.companyName}</Text>
              </View>
            </View>

            {letter.contactPerson && (
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="person" size={18} color={colors.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Contact Person</Text>
                  <Text style={styles.infoValue}>{letter.contactPerson}</Text>
                </View>
              </View>
            )}

            {letter.contactPhone && (
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="call" size={18} color={colors.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{letter.contactPhone}</Text>
                </View>
              </View>
            )}

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="location" size={18} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{letter.destination}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="map" size={18} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>LGA</Text>
                <Text style={styles.infoValue}>{letter.lga}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Liability Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Liability Details</Text>
          <View style={styles.liabilityCard}>
            <View style={styles.liabilityMain}>
              <Text style={styles.liabilityLabel}>Liability Amount</Text>
              <Text style={styles.liabilityAmount}>
                {formatCurrency(letter.liabilityAmount)}
              </Text>
            </View>
            <View style={styles.liabilityYear}>
              <Text style={styles.yearLabel}>Liability Year</Text>
              <Text style={styles.yearValue}>{letter.liabilityYear}</Text>
            </View>
          </View>
        </View>

        {/* Assigned Courier */}
        {assignedCourier && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assigned Courier</Text>
            <TouchableOpacity
              style={styles.courierCard}
              onPress={() => router.push(`/(admin)/courier/${assignedCourier.id}` as any)}
              activeOpacity={0.7}
            >
              <View style={styles.courierAvatar}>
                <Ionicons name="person" size={24} color={colors.primary} />
              </View>
              <View style={styles.courierInfo}>
                <Text style={styles.courierName}>{assignedCourier.fullName}</Text>
                <Text style={styles.courierDetail}>
                  {assignedCourier.staffId} | {assignedCourier.unit.toUpperCase()} Unit
                </Text>
                {assignedCourier.phone && (
                  <Text style={styles.courierPhone}>{assignedCourier.phone}</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.border} />
            </TouchableOpacity>
          </View>
        )}

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          <View style={styles.timelineCard}>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: colors.textSecondary }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Submitted</Text>
                <Text style={styles.timelineDate}>
                  {formatDate(letter.submittedAt)}
                </Text>
              </View>
            </View>

            <View style={styles.timelineLine} />

            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: colors.info }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Assigned</Text>
                <Text style={styles.timelineDate}>
                  {formatDate(letter.assignedAt)}
                </Text>
              </View>
            </View>

            {letter.pickedUpAt && (
              <>
                <View style={styles.timelineLine} />
                <View style={styles.timelineItem}>
                  <View style={[styles.timelineDot, { backgroundColor: colors.warning }]} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>Picked Up</Text>
                    <Text style={styles.timelineDate}>
                      {formatDate(letter.pickedUpAt)}
                    </Text>
                  </View>
                </View>
              </>
            )}

            {letter.completedAt && (
              <>
                <View style={styles.timelineLine} />
                <View style={styles.timelineItem}>
                  <View
                    style={[
                      styles.timelineDot,
                      {
                        backgroundColor:
                          letter.status === "delivered"
                            ? colors.success
                            : colors.danger,
                      },
                    ]}
                  />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>
                      {letter.status === "delivered" ? "Delivered" : "Returned"}
                    </Text>
                    <Text style={styles.timelineDate}>
                      {formatDate(letter.completedAt)}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Notes */}
        {letter.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesCard}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color={colors.textSecondary}
              />
              <Text style={styles.notesText}>{letter.notes}</Text>
            </View>
          </View>
        )}

        {/* POD Info */}
        {letter.pod && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Proof of Delivery</Text>
            <View style={styles.podCard}>
              <View style={styles.podRow}>
                <Text style={styles.podLabel}>Received By</Text>
                <Text style={styles.podValue}>{letter.pod.recipientName}</Text>
              </View>
              {letter.pod.recipientPhone && (
                <View style={styles.podRow}>
                  <Text style={styles.podLabel}>Phone</Text>
                  <Text style={styles.podValue}>{letter.pod.recipientPhone}</Text>
                </View>
              )}
              <View style={styles.podRow}>
                <Text style={styles.podLabel}>Timestamp</Text>
                <Text style={styles.podValue}>
                  {formatDate(letter.pod.timestamp)}
                </Text>
              </View>
              {letter.pod.notes && (
                <View style={styles.podRow}>
                  <Text style={styles.podLabel}>Notes</Text>
                  <Text style={styles.podValue}>{letter.pod.notes}</Text>
                </View>
              )}
              <View style={styles.podSignature}>
                <Ionicons name="create" size={20} color={colors.success} />
                <Text style={styles.signatureText}>Signature Captured</Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 24 }} />
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
  mainCard: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  trackingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  trackingId: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.white,
  },
  letterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  priorityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "600",
  },
  scheduleId: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
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
  liabilityCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  liabilityMain: {
    flex: 1,
  },
  liabilityLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  liabilityAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary,
  },
  liabilityYear: {
    alignItems: "center",
    paddingLeft: 20,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  yearLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  yearValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  courierCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  courierAvatar: {
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
  courierDetail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  courierPhone: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 2,
  },
  timelineCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  timelineDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  timelineLine: {
    width: 2,
    height: 24,
    backgroundColor: colors.border,
    marginLeft: 5,
    marginVertical: 4,
  },
  notesCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  notesText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  podCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  podRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  podLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  podValue: {
    fontSize: 13,
    color: colors.text,
    fontWeight: "500",
  },
  podSignature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 4,
  },
  signatureText: {
    fontSize: 13,
    color: colors.success,
    fontWeight: "500",
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
