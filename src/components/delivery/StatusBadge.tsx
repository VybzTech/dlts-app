import { Text, View } from "react-native";
import { DeliveryStatus } from "@/src/types";

const colorMap: Record<DeliveryStatus, string> = {
  assigned: "#6c757d",
  picked_up: "#0d6efd",
  en_route: "#0dcaf0",
  arrived: "#ffc107",
  delivered: "#198754",
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
