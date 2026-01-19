// import { DeliveryCard } from "@/src/components/delivery/DeliveryCard";
// import { useDeliveryStore } from "@/src/store/deliveryStore";
// import { FlatList, View } from "react-native";

// export default function AdminHome() {
//   const deliveries = useDeliveryStore((s) => s.deliveries);

//   return (
//     <View style={{ flex: 1, padding: 16 }}>
//       <FlatList
//         data={deliveries}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => <DeliveryCard delivery={item} />}
//       />
//     </View>
//   );
// }

import { DeliveryCard } from "@/src/components/delivery/DeliveryCard";
import { useDeliveryStore } from "@/src/store/deliveryStore";
import { FlatList, Text, View } from "react-native";

import { Delivery } from "@/src/types";
import { useEffect, useState } from "react";

export default function AdminLetters() {

  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  useEffect(() => {
    setDeliveries(useDeliveryStore.getState().getCourierDeliveries());
  }, []);

  // const deliveries = useDeliveryStore((s) => s.deliveries);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
        All Letters / Parcels
      </Text>

      <FlatList
        data={deliveries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DeliveryCard delivery={item} />}
      />
    </View>
  );
}
