import { useAdminStore } from "@/src/store/adminStore";
import { FlatList, Text, View } from "react-native";

export default function AdminCouriers() {
  // const users = useAuthStore((s) => s.users || []);
  // const couriers = users.filter((u) => u.role === "courier");
  const { couriers } = useAdminStore();
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
        Courier Riders
      </Text>

      <FlatList
        data={couriers}
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
            <Text style={{ fontWeight: "600" }}>{item.fullName}</Text>
            <Text>{item.email}</Text>
          </View>
        )}
      />
    </View>
  );
}
