import { DeliveryCard } from "@/src/components/delivery/DeliveryCard";
import { useDeliveryStore } from "@/src/store/deliveryStore";
import { Delivery } from "@/src/types";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

export default function ManagementLetters() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    setDeliveries(useDeliveryStore.getState().deliveries);
  }, []);

  // const deliveries = useDeliveryStore((s) => s.deliveries);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
        Letters Overview
      </Text>

      <FlatList
        data={deliveries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DeliveryCard delivery={item} />}
      />
    </View>
  );
}
