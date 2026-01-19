// src/store/courierStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Delivery } from "@/src/types";

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
          completedCount: deliveries.filter((d) => d.status === "delivered").length,
        }),

      setCurrentDelivery: (delivery) => set({ currentDelivery: delivery }),

      updateDeliveryStatus: (id, status) =>
        set((state) => ({
          assignedDeliveries: state.assignedDeliveries.map((d) =>
            d.id === id ? { ...d, status } : d
          ),
        })),

      getStats: () => {
        const { assignedDeliveries } = get();
        return {
          assigned: assignedDeliveries.filter((d) => d.status === "assigned").length,
          enRoute: assignedDeliveries.filter((d) =>
            ["picked_up", "en_route", "arrived"].includes(d.status)
          ).length,
          completed: assignedDeliveries.filter((d) =>
            ["delivered", "returned"].includes(d.status)
          ).length,
        };
      },
    }),
    {
      name: "dlts-courier-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
