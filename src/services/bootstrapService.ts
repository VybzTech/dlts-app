import type { User } from "@/src/types";
import { mockDeliveries, mockCouriers } from "./mockData";

export { mockDeliveries };

export async function fetchInitialData(user: User) {
  await new Promise(resolve => setTimeout(resolve, 500));

  console.log("Mock deliveries loaded:", mockDeliveries.length);

  return {
    mockDeliveries,
    couriers: mockCouriers,
  };
}
