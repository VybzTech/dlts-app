import { View, Text, FlatList } from "react-native";
import { useDeliveryStore } from "@/src/store/deliveryStore";

export default function ManagementHistory() {
  const deliveries = useDeliveryStore((s) =>
    s.deliveries.filter((d) => d.status === "delivered" || d.status === "returned")
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
        Delivery History
      </Text>

      <FlatList
        data={deliveries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              backgroundColor: "#fff",
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            <Text>{item.companyName}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}
