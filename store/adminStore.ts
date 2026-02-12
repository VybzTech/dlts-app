import { create } from "zustand";
import type { Delivery, User } from "@/src/types";
import { courierService } from "@/src/api/services/courier.service";

interface AdminState {
  allDeliveries: Delivery[];
  couriers: User[];
  selectedCourier: User | null;
  isLoading: boolean;
  error: string | null;

  setAllDeliveries: (deliveries: Delivery[]) => void;
  setCouriers: (couriers: User[]) => void;
  setSelectedCourier: (courier: User | null) => void;
  fetchCouriers: () => Promise<void>;
  fetchCourierDetail: (id: string) => Promise<void>;
  getDeliveryStats: () => { total: number; delivered: number; pending: number };
}

export const useAdminStore = create<AdminState>((set, get) => ({
  allDeliveries: [],
  couriers: [],
  selectedCourier: null,
  isLoading: false,
  error: null,

  setAllDeliveries: (deliveries) => set({ allDeliveries: deliveries }),
  setCouriers: (couriers) => set({ couriers }),
  setSelectedCourier: (courier) => set({ selectedCourier: courier }),

  fetchCouriers: async () => {
    set({ isLoading: true, error: null });
    try {
      const couriers = await courierService.getCouriers();
      set({ couriers, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchCourierDetail: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const courier = await courierService.getCourierById(id);
      set({ selectedCourier: courier, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  getDeliveryStats: () => {
    const { allDeliveries } = get();
    return {
      total: allDeliveries.length,
      delivered: allDeliveries.filter((d) => d.status === "Delivered").length,
      pending: allDeliveries.filter((d) =>
        ["Pending_Approval", "Approved", "Assigned", "In_Transit"].includes(
          d.status,
        ),
      ).length,
    };
  },
}));
