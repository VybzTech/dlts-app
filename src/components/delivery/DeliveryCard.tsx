import { useAuthStore } from "@/src/store/authStore";
import { useDeliveryStore } from "@/src/store/deliveryStore";
import { Delivery } from "@/src/types";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { StatusBadge } from "./StatusBadge";
import { colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { cardStyles } from "@/src/styles/delivery";

export function DeliveryCard({
  id,
  delivery,
}: {
  id: string; // Changed from number to string
  delivery: Delivery;
}) {
  const { user } = useAuthStore();
  const updateStatus = useDeliveryStore((s) => s.updateDeliveryStatus);

  if (!delivery)
    return (
      <View style={cardStyles.container}>
        <Text style={cardStyles.errorText}>Delivery details Not Found</Text>
      </View>
    );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return "checkmark-circle";
      case "returned":
        return "close-circle";
      case "pending_approval":
        return "time-outline";
      default:
        return "mail";
    }
  };

  const getStatusIconColor = (status: string) => {
    switch (status) {
      case "delivered":
        return colors.success;
      case "returned":
        return colors.danger;
      case "pending_approval":
        return colors.warning;
      default:
        return colors.primary;
    }
  };

  return (
    <View style={cardStyles.card}>
      {/* Card Header */}
      <View style={cardStyles.header}>
        <View style={cardStyles.headerLeft}>
          <Ionicons
            name={getStatusIcon(delivery.status) as any}
            size={24}
            color={getStatusIconColor(delivery.status)}
          />
          <View style={cardStyles.headerContent}>
            <Text style={cardStyles.scheduleId}>{delivery?.scheduleId}</Text>
            <Text style={cardStyles.companyName} numberOfLines={1}>
              {delivery.companyName}
            </Text>
          </View>
        </View>
        <StatusBadge status={delivery.status} />
      </View>

      {/* Card Body */}
      <View style={cardStyles.body}>
        <View style={cardStyles.addressRow}>
          <Ionicons
            name="location-outline"
            size={14}
            color={colors.textSecondary}
          />
          <Text style={cardStyles.address} numberOfLines={1}>
            {delivery.destination}
          </Text>
        </View>

        <View style={cardStyles.footer}>
          <View style={cardStyles.lgaBadge}>
            <Text style={cardStyles.lgaText}>{delivery.lga}</Text>
          </View>
          <View
            style={[
              cardStyles.priorityBadge,
              {
                backgroundColor:
                  delivery.priority === "URGENT"
                    ? colors.danger + "20"
                    : colors.info + "20",
              },
            ]}
          >
            <Text
              style={[
                cardStyles.priorityText,
                {
                  color:
                    delivery.priority === "URGENT" ? colors.danger : colors.info,
                },
              ]}
            >
              {delivery.priority}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Button */}
      {user?.role === "courier" && delivery.status === "pending_approval" && (
        <TouchableOpacity
          onPress={() => updateStatus(delivery.id, "delivered")}
          style={cardStyles.actionButton}
        >
          <Ionicons name="checkmark" size={18} color={colors.white} />
          <Text style={cardStyles.actionButtonText}>Mark as Delivered</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
