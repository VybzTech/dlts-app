// src/store/courierStore.ts
import type { Delivery } from "@/src/types";
import { canTransitionStatus } from "@/src/utils/statusGuards";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useAuthStore } from "./authStore";

interface CourierState {
  assignedDeliveries: Delivery[];
  currentDelivery: Delivery | null;
  completedCount: number;

  setAssignedDeliveries: (deliveries: Delivery[]) => void;
  setCurrentDelivery: (delivery: Delivery | null) => void;
  updateDeliveryStatus: (id: string, status: Delivery["status"]) => void;
  getStats: () => { assigned: number; enRoute: number; completed: number };
}

export const useCourierStore = create<CourierState>()(
  persist(
    (set, get) => ({
      assignedDeliveries: [],
      currentDelivery: null,
      completedCount: 0,

      setAssignedDeliveries: (deliveries) =>
        set({
          assignedDeliveries: deliveries,
          completedCount: deliveries.filter((d) => d.status === "delivered")
            .length,
        }),

      setCurrentDelivery: (delivery) => set({ currentDelivery: delivery }),

      // updateDeliveryStatus: (id, status) =>
      //   set((state) => ({
      //     assignedDeliveries: state.assignedDeliveries.map((d) =>
      //       d.id === id ? { ...d, status } : d
      //     ),
      //   })),

      updateDeliveryStatus: (id, status) =>
        set((state) => {
          const user = useAuthStore.getState().user;
          if (!user) return state;

          const delivery = state.assignedDeliveries.find((d) => d.id === id);
          if (!delivery) return state;

          if (!canTransitionStatus(user.role, delivery.status, status)) {
            console.warn("Invalid status transition blocked");
            return state;
          }

          return {
            assignedDeliveries: state.assignedDeliveries.map((d) =>
              d.id === id ? { ...d, status } : d,
            ),
          };
        }),

      getStats: () => {
        const { assignedDeliveries } = get();
        return {
          assigned: assignedDeliveries.filter((d) => d.status === "pending_approval")
            .length,
          enRoute: 0, // No longer used with new status model
          completed: assignedDeliveries.filter((d) =>
            ["delivered", "returned"].includes(d.status),
          ).length,
        };
      },
    }),
    {
      name: "dlts-courier-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
