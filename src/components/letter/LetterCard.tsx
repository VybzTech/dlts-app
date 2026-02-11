import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Letter, LetterStatus } from "@/src/types/letter.types";
import { colors } from "@/src/styles/theme/colors";

interface LetterCardProps {
  letter: Letter;
  onMarkInTransit?: () => void;
  onMarkDelivered?: () => void;
  onMarkUndelivered?: () => void;
  isLoading?: boolean;
}

const getStatusColor = (status: LetterStatus) => {
  switch (status) {
    case "Registered":
    case "Approved":
      return colors.warning;
    case "Allocated":
    case "InTransit":
      return colors.info;
    case "Delivered":
      return colors.success;
    case "Undelivered":
    case "Rejected":
      return colors.error;
    default:
      return colors.text;
  }
};

const getStatusLabel = (status: LetterStatus): string => {
  switch (status) {
    case "Registered":
      return "Registered";
    case "Approved":
      return "Approved";
    case "Allocated":
      return "Allocated";
    case "InTransit":
      return "In Transit";
    case "Delivered":
      return "Delivered";
    case "Undelivered":
      return "Undelivered";
    case "Rejected":
      return "Rejected";
    default:
      return status;
  }
};

const getAvailableActions = (status: LetterStatus) => {
  const actions = [];
  if (
    status === "Allocated" ||
    status === "Registered" ||
    status === "Approved"
  ) {
    actions.push("inTransit");
  }
  if (status === "InTransit") {
    actions.push("delivered", "undelivered");
  }
  return actions;
};

export const LetterCard: React.FC<LetterCardProps> = ({
  letter,
  onMarkInTransit,
  onMarkDelivered,
  onMarkUndelivered,
  isLoading = false,
}) => {
  const statusColor = getStatusColor(letter.status);
  const statusLabel = getStatusLabel(letter.status);
  const availableActions = getAvailableActions(letter.status);

  return (
    <View style={styles.card}>
      {/* Header with Tracking ID and Status */}
      <View style={styles.header}>
        <View style={styles.trackingSection}>
          <Text style={styles.trackingId}>{letter.trackingId}</Text>
          <Text style={styles.priority}>{letter.priority}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColor + "20", borderColor: statusColor },
          ]}
        >
          <Text style={[styles.statusText, { color: statusColor }]}>
            {statusLabel}
          </Text>
        </View>
      </View>

      {/* Subject and Details */}
      <View style={styles.content}>
        <Text style={styles.subject}>{letter.subject}</Text>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Recipient</Text>
            <Text style={styles.detailValue}>{letter.recipientName}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>LGA</Text>
            <Text style={styles.detailValue}>{letter.lgaAddress}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Liability</Text>
            <Text style={styles.detailValue}>₦{letter.liabilityValue}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Year</Text>
            <Text style={styles.detailValue}>{letter.liabilityYear}</Text>
          </View>
        </View>

        {letter.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{letter.notes}</Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      {availableActions.length > 0 && (
        <View style={styles.actions}>
          {availableActions.includes("inTransit") && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.primaryBtn]}
              onPress={onMarkInTransit}
              disabled={isLoading}
            >
              <Text style={styles.actionBtnText}>Start Transit</Text>
            </TouchableOpacity>
          )}
          {availableActions.includes("delivered") && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.successBtn]}
              onPress={onMarkDelivered}
              disabled={isLoading}
            >
              <Text style={styles.actionBtnText}>Mark Delivered</Text>
            </TouchableOpacity>
          )}
          {availableActions.includes("undelivered") && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.dangerBtn]}
              onPress={onMarkUndelivered}
              disabled={isLoading}
            >
              <Text style={styles.actionBtnText}>Decline</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  trackingSection: {
    flex: 1,
  },
  trackingId: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  priority: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    marginBottom: 16,
  },
  subject: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  detailItem: {
    width: "50%",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "500",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 12,
    color: colors.text,
    fontWeight: "600",
  },
  notesContainer: {
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.info,
  },
  notesLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "500",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 16,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    minWidth: "48%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtn: {
    backgroundColor: colors.primary,
  },
  successBtn: {
    backgroundColor: colors.success,
  },
  dangerBtn: {
    backgroundColor: colors.error,
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
