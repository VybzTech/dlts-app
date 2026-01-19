import { useDeliveryStore } from "@/src/store/deliveryStore";
import { Delivery } from "@/src/types";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

export default function ManagementHistory() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    setDeliveries(
      useDeliveryStore
        .getState()
        .deliveries.filter(
          (d) => d?.status === "delivered" || d?.status === "returned",
        ),
    );
  }, []);
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
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#888", marginTop: 40 }}>
            No completed deliveries yet
          </Text>
        }
      />
    </View>
  );
}
