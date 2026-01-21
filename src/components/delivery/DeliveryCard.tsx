// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { colors, priorityLabels } from '../../theme/colors';
// import { StatusBadge } from '../common/StatusBadge';
// import type { Delivery } from '../../types';

// interface DeliveryCardProps {
//   delivery: Delivery;
//   onPress: () => void;
// }

// export function DeliveryCard({ delivery, onPress }: DeliveryCardProps) {
//   const priorityColor = colors.priority[delivery.priority] || colors.priority.MINIMAL;

//   return (
//     <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
//       {/* Priority Indicator */}
//       <View style={[styles.priorityBar, { backgroundColor: priorityColor }]} />

//       <View style={styles.content}>
//         {/* Header Row */}
//         <View style={styles.header}>
//           <View style={styles.headerLeft}>
//             <Text style={styles.scheduleId}>{delivery.scheduleId}</Text>
//             <View style={[styles.priorityBadge, { backgroundColor: priorityColor + '20' }]}>
//               <Text style={[styles.priorityText, { color: priorityColor }]}>
//                 {priorityLabels[delivery.priority]}
//               </Text>
//             </View>
//           </View>
//           <StatusBadge status={delivery.status} size="small" />
//         </View>

//         {/* Company Name */}
//         <Text style={styles.companyName} numberOfLines={1}>
//           {delivery.companyName}
//         </Text>

//         {/* Address */}
//         <View style={styles.row}>
//           <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
//           <Text style={styles.address} numberOfLines={1}>
//             {delivery.destination}
//           </Text>
//         </View>

//         {/* Footer Row */}
//         <View style={styles.footer}>
//           <View style={styles.footerItem}>
//             <Ionicons name="business-outline" size={14} color={colors.textSecondary} />
//             <Text style={styles.footerText}>{delivery.lga}</Text>
//           </View>
//           <View style={styles.footerItem}>
//             <Ionicons name="mail-outline" size={14} color={colors.textSecondary} />
//             <Text style={styles.footerText}>{delivery.letterCount} letter{delivery.letterCount > 1 ? 's' : ''}</Text>
//           </View>
//           <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: colors.white,
//     borderRadius: 12,
//     marginBottom: 12,
//     flexDirection: 'row',
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   priorityBar: {
//     width: 4,
//   },
//   content: {
//     flex: 1,
//     padding: 16,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   headerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   scheduleId: {
//     fontSize: 12,
//     color: colors.textSecondary,
//     fontWeight: '500',
//   },
//   priorityBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 4,
//   },
//   priorityText: {
//     fontSize: 10,
//     fontWeight: '600',
//   },
//   companyName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.text,
//     marginBottom: 6,
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     marginBottom: 12,
//   },
//   address: {
//     flex: 1,
//     fontSize: 13,
//     color: colors.textSecondary,
//   },
//   footer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 16,
//   },
//   footerItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   footerText: {
//     fontSize: 12,
//     color: colors.textSecondary,
//   },
// });

import { useAuthStore } from "@/src/store/authStore";
import { useDeliveryStore } from "@/src/store/deliveryStore";
import { Delivery } from "@/src/types";
import { Text, TouchableOpacity, View } from "react-native";
import { StatusBadge } from "./StatusBadge";

export function DeliveryCard({
  id,
  delivery,
}: {
  id: number;
  delivery: Delivery;
}) {
  const { user } = useAuthStore();
  const updateStatus = useDeliveryStore((s) => s.updateDeliveryStatus);

  return (
    <View
      style={{
        padding: 16,
        backgroundColor: "#fff",
        marginBottom: 12,
        borderRadius: 10,
      }}
    >
      <Text style={{ fontWeight: "600" }}>{delivery.companyName}</Text>
      <Text>{delivery.destination}</Text>

      <StatusBadge status={delivery.status} />

      {user?.role === "courier" && delivery.status !== "delivered" && (
        <TouchableOpacity
          onPress={() => updateStatus(delivery.id, "picked_up")}
          style={{
            marginTop: 10,
            backgroundColor: "#0d6efd",
            padding: 10,
            borderRadius: 6,
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center" }}>
            Update Status
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
