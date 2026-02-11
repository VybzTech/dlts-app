import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useLetterStore } from "@/store/letterStore";
import { colors } from "@/src/styles/theme/colors";
import { LoadingSpinner } from "@/src/components/common/LoadingSpinner";
import { Letter, LetterStatus } from "@/src/types/letter.types";

export default function LetterDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { letters, markAsInTransit, markAsDelivered, markAsUndelivered } =
    useLetterStore();
  const [letter, setLetter] = useState<Letter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id && typeof id === "string") {
      const found = letters.find((l) => l.id === id);
      setLetter(found || null);
      setIsLoading(false);
    }
  }, [id, letters]);

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading letter..." />;
  }

  if (!letter) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Letter not found</Text>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getStatusColor = (status: LetterStatus) => {
    const statusColorMap: Record<LetterStatus, string> = {
      Registered: colors.warning,
      Approved: colors.warning,
      Allocated: colors.info,
      InTransit: colors.info,
      Delivered: colors.success,
      Undelivered: colors.error,
      Rejected: colors.error,
    };
    return statusColorMap[status] || colors.text;
  };

  const getStatusLabel = (status: LetterStatus): string => {
    const labels: Record<LetterStatus, string> = {
      Registered: "Registered",
      Approved: "Approved",
      Allocated: "Allocated",
      InTransit: "In Transit",
      Delivered: "Delivered",
      Undelivered: "Undelivered",
      Rejected: "Rejected",
    };
    return labels[status] || status;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backIcon}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Letter Details</Text>
          <View style={{ width: 50 }} />
        </View>

        {/* Status Badge */}
        <View style={styles.statusSection}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: getStatusColor(letter.status) + "20",
                borderColor: getStatusColor(letter.status),
              },
            ]}
          >
            <Text
              style={[
                styles.statusLabel,
                { color: getStatusColor(letter.status) },
              ]}
            >
              {getStatusLabel(letter.status)}
            </Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Tracking ID and Priority */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Identification</Text>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Tracking ID</Text>
              <Text style={styles.value}>{letter.trackingId}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Priority</Text>
              <Text style={styles.value}>{letter.priority}</Text>
            </View>
          </View>

          {/* Recipient Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recipient Information</Text>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{letter.recipientName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>{letter.recipientAddress}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>LGA</Text>
              <Text style={styles.value}>{letter.lgaAddress}</Text>
            </View>
          </View>

          {/* Letter Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Letter Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Subject</Text>
              <Text style={styles.value}>{letter.subject}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Liability Value</Text>
              <Text style={styles.value}>₦{letter.liabilityValue}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Liability Year</Text>
              <Text style={styles.value}>{letter.liabilityYear}</Text>
            </View>
          </View>

          {/* Notes */}
          {letter.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <View style={styles.notesBox}>
                <Text style={styles.notesText}>{letter.notes}</Text>
              </View>
            </View>
          )}

          {/* Timeline */}
          {letter.timelines && letter.timelines.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Timeline</Text>
              {letter.timelines.map((timeline, idx) => (
                <View key={idx} style={styles.timelineItem}>
                  <View style={styles.timelineMarker} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.timelineStatus}>{timeline.status}</Text>
                    <Text style={styles.timelineDesc}>
                      {timeline.description}
                    </Text>
                    <Text style={styles.timelineUser}>
                      by {timeline.user?.name}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backIcon: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  statusSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    alignSelf: "flex-start",
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "600",
    flex: 1,
  },
  value: {
    fontSize: 13,
    color: colors.text,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  notesBox: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.info,
  },
  notesText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  timelineMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginTop: 4,
    marginRight: 12,
  },
  timelineStatus: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 2,
  },
  timelineDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  timelineUser: {
    fontSize: 11,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    fontWeight: "600",
    marginBottom: 16,
  },
  backBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  backBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
