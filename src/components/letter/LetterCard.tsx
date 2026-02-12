import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Letter, LetterStatus } from "@/src/types/letter.types";
import { colors } from "@/src/styles/theme/colors";

interface LetterCardProps {
  letter: Letter;
  onMarkInTransit?: () => void;
  onMarkDelivered?: () => void;
  onMarkUndelivered?: () => void;
  onPress?: () => void;
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
      return colors.danger; // Fixed from .error
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
  onPress,
  isLoading = false,
}) => {
  const statusColor = getStatusColor(letter.status);
  const statusLabel = getStatusLabel(letter.status);
  const availableActions = getAvailableActions(letter.status);

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={styles.header}>
          <View style={styles.trackingSection}>
            <Text style={styles.trackingId}>{letter.trackingId}</Text>
            <Text style={styles.priority}>{letter.priority}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColor + "18", borderColor: statusColor },
            ]}
          >
            <Text style={[styles.statusText, { color: statusColor }]}>
              {statusLabel}
            </Text>
          </View>
        </View>
        <Text style={styles.subject}>{letter.subject}</Text>

        {/* <View style={styles.content}>
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
        </View> */}
      </TouchableOpacity>

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
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    fontWeight: "700",
    color: colors.text,
    // marginBottom: 4,
  },
  priority: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  content: {
    marginBottom: 12,
  },
  subject: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 3,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
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
    fontSize: 13,
    color: colors.text,
    fontWeight: "600",
  },
  notesContainer: {
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
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
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    minWidth: "45%",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
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
    backgroundColor: colors.danger, // Fixed from .error
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
});
