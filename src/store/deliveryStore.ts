import { create } from "zustand";
import type { Delivery, DeliveryStatus, PODData, StatusFilter } from "../types";
import { useAuthStore } from "./authStore";

interface DeliveryState {
  deliveries: Delivery[];
  selectedDelivery: Delivery | null;
  filter: StatusFilter;
  isLoading: boolean;
  error: string | null;

  // Actions
  setDeliveries: (deliveries: Delivery[]) => void;
  selectDelivery: (delivery: Delivery | null) => void;
  updateDeliveryStatus: (id: string, status: DeliveryStatus) => void;
  addPODToDelivery: (id: string, pod: PODData) => void;
  setFilter: (filter: StatusFilter) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getCourierDeliveries: () => Delivery[];
  // Computed
  getFilteredDeliveries: () => Delivery[];
  getPendingCount: () => number;
  getCompletedCount: () => number;
}

export const useDeliveryStore = create<DeliveryState>((set, get) => ({
  deliveries: [],
  selectedDelivery: null,
  filter: "all",
  isLoading: false,
  error: null,

  setDeliveries: (deliveries) => set({ deliveries, error: null }),

  selectDelivery: (delivery) => set({ selectedDelivery: delivery }),

  updateDeliveryStatus: (id, status) =>
    set((state) => ({
      deliveries: state.deliveries.map((d) =>
        d.id === id
          ? {
              ...d,
              status,
              completedAt:
                status === "delivered" || status === "returned"
                  ? new Date().toISOString()
                  : d.completedAt,
            }
          : d,
      ),
      selectedDelivery:
        state.selectedDelivery?.id === id
          ? { ...state.selectedDelivery, status }
          : state.selectedDelivery,
    })),

  addPODToDelivery: (id, pod) =>
    set((state) => ({
      deliveries: state.deliveries.map((d) =>
        d.id === id ? { ...d, pod, status: "delivered" as DeliveryStatus } : d,
      ),
    })),

  setFilter: (filter) => set({ filter }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  // getCourierDeliveries: () => {
  //   const user = useAuthStore.getState().user;
  //   return get().deliveries.filter((d) => d.assignedCourierId === user?.id);
  // },

  getCourierDeliveries: () => {
  const user = useAuthStore.getState().user;
  if (!user) return [];
  
  // The assignedCourierId format is "COU-1", so we need to match it with user.id
  return get().deliveries.filter((d) => d.assignedCourierId === `COU-${user.id}`);
},

  getFilteredDeliveries: () => {
    const { deliveries, filter } = get();
    switch (filter) {
      case "pending":
        return deliveries.filter((d) => d.status === "assigned");
      case "in_progress":
        return deliveries.filter((d) =>
          ["picked_up", "en_route", "arrived"].includes(d.status),
        );
      case "completed":
        return deliveries.filter((d) =>
          ["delivered", "returned"].includes(d.status),
        );
      default:
        return deliveries;
    }
  },

  getPendingCount: () => {
    const { deliveries } = get();
    return deliveries.filter(
      (d) => !["delivered", "returned"].includes(d.status),
    ).length;
  },

  getCompletedCount: () => {
    const { deliveries } = get();
    return deliveries.filter((d) =>
      ["delivered", "returned"].includes(d.status),
    ).length;
  },
}));
