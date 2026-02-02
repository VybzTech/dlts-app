import { create } from "zustand";
import type { Delivery ,User} from "@/src/types";

interface AdminState {
  allDeliveries: Delivery[];
  couriers: User[];
  selectedCourier: User | null;
  
  setAllDeliveries: (deliveries: Delivery[]) => void;
  setCouriers: (couriers: User[]) => void;
  setSelectedCourier: (courier: User | null) => void;
  getDeliveryStats: () => { total: number; delivered: number; pending: number };
  getCourierStats: (courierId: string) => { assigned: number; completed: number };
}

export const useAdminStore = create<AdminState>((set, get) => ({
  allDeliveries: [],
  couriers: [],
  selectedCourier: null,

  setAllDeliveries: (deliveries) => set({ allDeliveries: deliveries }),
  setCouriers: (couriers) => set({ couriers }),
  setSelectedCourier: (courier) => set({ selectedCourier: courier }),

  getDeliveryStats: () => {
    const { allDeliveries } = get();
    return {
      total: allDeliveries.length,
      delivered: allDeliveries.filter((d) => d.status === "completed").length,
      pending: allDeliveries.filter((d) => d.status === "pending_approval").length,
    };
  },

  getCourierStats: (courierId: string) => {
    const { allDeliveries } = get();
    const courierDeliveries = allDeliveries.filter(
      (d) => d.assignedCourierId === courierId
    );
    return {
      assigned: courierDeliveries.length,
      completed: courierDeliveries.filter((d) =>
        ["delivered", "returned"].includes(d.status)
      ).length,
    };
  },
}));