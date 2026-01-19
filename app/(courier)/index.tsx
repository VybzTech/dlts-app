import { View, FlatList, Text } from "react-native";
import { useDeliveryStore } from "@/src/store/deliveryStore";
import { DeliveryCard } from "@/src/components/delivery/DeliveryCard";

export default function CourierDeliveries() {
  const deliveries = useDeliveryStore((s) => s.getCourierDeliveries());

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
        My Assigned Deliveries
      </Text>

      <FlatList
        data={deliveries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DeliveryCard delivery={item} />}
      />
    </View>
  );
}
