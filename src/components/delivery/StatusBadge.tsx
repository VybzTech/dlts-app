import { DeliveryStatus } from "@/src/types/delivery.types";
import { Text, View } from "react-native";

const colorMap: Record<DeliveryStatus, string> = {
  // assigned: "#6c757d",
  // pending_approval: "#0d6efd",
  // en_route: "#0dcaf0",
  // arrived: "#ffc107",
  completed: "#198754",
  returned: "#dc3545",
};

export function StatusBadge({ status }: { status: DeliveryStatus }) {
  return (
    <View
      style={{
        alignSelf: "flex-start",
        backgroundColor: colorMap[status],
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginTop: 6,
      }}
    >
      <Text style={{ color: "#fff", fontSize: 12 }}>{status}</Text>
    </View>
  );
}
