import { DeliveryCard } from "@/src/components/delivery/DeliveryCard";
import { useDeliveryStore } from "@/src/store/deliveryStore";
import { Delivery } from "@/src/types";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

export default function CourierDeliveries() {

  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    setDeliveries(useDeliveryStore.getState().getCourierDeliveries());
  }, []);

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
