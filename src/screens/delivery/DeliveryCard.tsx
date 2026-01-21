import { StatusBadge } from "@/src/components/common/StatusBadge";
import { deliveryStyles } from "@/src/styles/delivery";
import { colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface DeliveryCardProps {
  id: string;
  scheduleId: string;
  companyName: string;
  destination: string;
  lga: string;
  priority: "NORMAL" | "URGENT";
  status: string;
  onPress: () => void;
}

// Delivery Card Component
export const DeliveryCard: React.FC<DeliveryCardProps> = ({
  scheduleId,
  companyName,
  destination,
  lga,
  priority,
  status,
  onPress,
}) => {
  const getPriorityColor = (p: string) => {
    switch (p) {
      case "URGENT":
        return colors.danger;
      case "NORMAL":
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (s: string) => {
    switch (s) {
      case "assigned":
        return "radio-button-off";
      case "picked_up":
        return "checkmark-circle";
      case "en_route":
        return "car";
      case "arrived":
        return "location";
      case "delivered":
        return "checkmark-done-circle";
      case "returned":
        return "close-circle";
      default:
        return "help-circle";
    }
  };

  return (
    <TouchableOpacity
      style={deliveryStyles.deliveryCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={deliveryStyles.cardHeader}>
        <View style={deliveryStyles.headerLeft}>
          <Ionicons
            name={getStatusIcon(status) as any}
            size={24}
            color={
              status === "delivered"
                ? colors.success
                : status === "returned"
                  ? colors.danger
                  : colors.primary
            }
          />
          <View style={deliveryStyles.headerTextContent}>
            <Text style={deliveryStyles.scheduleId}>{scheduleId}</Text>
            <Text style={deliveryStyles.companyName} numberOfLines={1}>
              {companyName}
            </Text>
          </View>
        </View>
        <StatusBadge status={status as any} size="small" />
      </View>

      <View style={deliveryStyles.cardBody}>
        <View style={deliveryStyles.addressRow}>
          <Ionicons
            name="location-outline"
            size={14}
            color={colors.textSecondary}
          />
          <Text style={deliveryStyles.address} numberOfLines={1}>
            {destination}
          </Text>
        </View>

        <View style={deliveryStyles.cardFooter}>
          <View style={deliveryStyles.lgaBadge}>
            <Ionicons
              name="business-outline"
              size={12}
              color={colors.textSecondary}
            />
            <Text style={deliveryStyles.lgaText}>{lga}</Text>
          </View>
          <View
            style={[
              deliveryStyles.priorityBadge,
              { backgroundColor: getPriorityColor(priority) + "20" },
            ]}
          >
            <Text
              style={[
                deliveryStyles.priorityText,
                { color: getPriorityColor(priority) },
              ]}
            >
              {priority}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
