import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, statusLabels } from "../../styles/theme/colors";
import { DeliveryStatus } from "@/src/types/delivery.types";

interface StatusBadgeProps {
  status: DeliveryStatus;
  size?: "small" | "medium" | "large";
}

export function StatusBadge({ status, size = "medium" }: StatusBadgeProps) {
  const backgroundColor = colors.status[status] || colors.status.assigned;
  const label = statusLabels[status] || status;

  const sizeStyles = {
    small: { paddingHorizontal: 8, paddingVertical: 2, fontSize: 10 },
    medium: { paddingHorizontal: 10, paddingVertical: 4, fontSize: 12 },
    large: { paddingHorizontal: 14, paddingVertical: 6, fontSize: 14 },
  };

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor },
        {
          paddingHorizontal: sizeStyles[size].paddingHorizontal,
          paddingVertical: sizeStyles[size].paddingVertical,
        },
      ]}
    >
      <Text style={[styles.text, { fontSize: sizeStyles[size].fontSize }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  text: {
    color: colors.white,
    fontWeight: "600",
  },
});
