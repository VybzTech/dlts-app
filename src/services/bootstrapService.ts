import type { Delivery, User, UserRole } from "@/src/types";
import { generateMockDeliveries } from "./api";

export const mockDeliveries: Delivery[] = generateMockDeliveries(100);

// const deliveries = await api.get("/deliveries");
// const couriers = await api.get("/couriers");

export async function fetchInitialData(user: User) {
  // Simulate async delay if needed
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log("Mock deliveries loaded:", mockDeliveries.length);
  
  const couriers: User[] = [
    {
      id: "1",
      email: "beta.courier@lirs.net",
      fullName: "Beta Courier",
      staffId: "CR001",
      unit: "beta",
      role: "courier" as UserRole,
      // password: "password123",
    },
    {
      id: "2",
      email: "john.adebayo@lirs.net",
      fullName: "John Adebayo",
      staffId: "CR002",
      unit: "ikeja",
      role: "courier" as UserRole,
      // // password: "password123",
    },
    {
      id: "3",
      email: "sarah.okeke@lirs.net",
      fullName: "Sarah Okeke",
      staffId: "CR003",
      unit: "alausa",
      role: "courier" as UserRole,
      // // password: "password123",
    },
    {
      id: "4",
      email: "michael.ogundipe@lirs.net",
      fullName: "Michael Ogundipe",
      staffId: "CR004",
      unit: "ikeja",
      role: "courier" as UserRole,
      // // password: "password123",
    },
    {
      id: "5",
      email: "fatima.ibrahim@lirs.net",
      fullName: "Fatima Ibrahim",
      staffId: "CR005",
      unit: "central",
      role: "courier" as UserRole,
      // // password: "password123",
    },
    {
      id: "6",
      email: "david.chukwu@lirs.net",
      fullName: "David Chukwu",
      staffId: "CR006",
      unit: "beta",
      role: "courier" as UserRole,
      // // password: "password123",
    },
    {
      id: "7",
      email: "grace.olumide@lirs.net",
      fullName: "Grace Olumide",
      staffId: "CR007",
      unit: "alimosho",
      role: "courier" as UserRole,
      // // password: "password123",
    },
    {
      id: "8",
      email: "emmanuel.nwosu@lirs.net",
      fullName: "Emmanuel Nwosu",
      staffId: "CR008",
      unit: "ikeja",
      role: "courier" as UserRole,
      // // password: "password123",
    },
    {
      id: "9",
      email: "amina.yusuf@lirs.net",
      fullName: "Amina Yusuf",
      staffId: "CR009",
      unit: "central",
      role: "courier" as UserRole,
      // // password: "password123",
    },
    {
      id: "10",
      email: "tunde.balogun@lirs.net",
      fullName: "Tunde Balogun",
      staffId: "CR010",
      unit: "beta",
      role: "courier" as UserRole,
      // // password: "password123",
    },
  ];

  return {
    mockDeliveries,
    couriers,
  };
}
