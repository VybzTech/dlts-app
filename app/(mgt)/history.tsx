// import { useDeliveryStore } from "@/src/store/deliveryStore";
// import { Delivery } from "@/src/types";
// import { useEffect, useState } from "react";
// import { FlatList, Text, View } from "react-native";

// export default function ManagementHistory() {
//   const [deliveries, setDeliveries] = useState<Delivery[]>([]);

//   useEffect(() => {
//     setDeliveries(
//       useDeliveryStore
//         .getState()
//         .deliveries.filter(
//           (d) => d?.status === "delivered" || d?.status === "returned",
//         ),
//     );
//   }, []);
//   return (
//     <View style={{ flex: 1, padding: 16 }}>
//       <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
//         Delivery History
//       </Text>

//       <FlatList
//         data={deliveries}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View
//             style={{
//               padding: 12,
//               backgroundColor: "#fff",
//               borderRadius: 8,
//               marginBottom: 10,
//             }}
//           >
//             <Text>{item.companyName}</Text>
//             <Text>Status: {item.status}</Text>
//           </View>
//         )}
//         ListEmptyComponent={
//           <Text style={{ textAlign: "center", color: "#888", marginTop: 40 }}>
//             No completed deliveries yet
//           </Text>
//         }
//       />
//     </View>
//   );
// }

// COURIER HISTORY SCREEN (app/(courier)/history.tsx)
// ============================================================================

import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/theme/colors';
import { EmptyState } from '@/src/components/common/EmptyState';
import { historyStyles } from '@/src/styles/history';

const CourierHistory=()=> {
  const [historyData] = useState([
    {
      id: '1',
      scheduleId: 'SCH-2024-001',
      companyName: 'Sample Company',
      status: 'delivered',
      completedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  return (
    <SafeAreaView style={historyStyles.container}>
      <View style={historyStyles.header}>
        <Text style={historyStyles.headerTitle}>Delivery History</Text>
        <Text style={historyStyles.headerSubtitle}>Your completed deliveries</Text>
      </View>

      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={historyStyles.historyCard} activeOpacity={0.7}>
            <View style={historyStyles.historyLeft}>
              <Ionicons
                name={item.status === 'delivered' ? 'checkmark-circle' : 'close-circle'}
                size={28}
                color={item.status === 'delivered' ? colors.success : colors.danger}
              />
              <View style={historyStyles.historyText}>
                <Text style={historyStyles.historySchedule}>{item.scheduleId}</Text>
                <Text style={historyStyles.historyCompany}>{item.companyName}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.border} />
          </TouchableOpacity>
        )}
        contentContainerStyle={historyStyles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="time-outline"
            title="No History"
            message="Your completed deliveries will appear here"
          />
        }
      />
    </SafeAreaView>
  );
}


export default CourierHistory;