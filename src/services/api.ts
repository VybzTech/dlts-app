import type {
  ApiResponse,
  Delivery,
  
  LoginResponse,
  PODData,
  User,
} from "../types";
import { DeliveryStatus } from "../types/delivery.types";
import { mockDeliveries } from "./mockData";

// Simulated delay for mock API calls
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock Users Database - 3 user profiles
const mockUsers: { email: string; password: string; user: User }[] = [
  {
    email: "beta.courier@lirs.net",
    password: "password123",
    user: {
      id: "1",
      email: "beta.courier@lirs.net",
      fullName: "Beta Courier",
      staffId: "CR001",
      unit: "DISPATCH",
      role: "courier",
    },
  },
  {
    email: "rasheed.admin@lirs.net",
    password: "password123",
    user: {
      id: "2",
      email: "rasheed.admin@lirs.net",
      fullName: "Rasheed Adeyemi",
      staffId: "AD001",
      unit: "ADMIN",
      role: "admin",
    },
  },
  {
    email: "david.it@lirs.net",
    password: "password123",
    user: {
      id: "4",
      email: "david.it@lirs.net",
      fullName: "David Okonkwo",
      staffId: "IT001",
      unit: "IT",
      role: "mgt",
    },
  },
  {
    email: "sarah.okeke@lirs.net",
    password: "password123",
    user: {
      id: "3",
      email: "sarah.okeke@lirs.net",
      fullName: "David Okonkwo",
      staffId: "IT001",
      unit: "IT",
      role: "mgt",
    },
  },
];

// Mock API Service
export const api = {
  // Authentication
  login: async (email: string, password: string): Promise<LoginResponse> => {
    await delay(1000);

    // Find user by email (case-insensitive)
    const foundUser = mockUsers.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );

    if (foundUser) {
      return { user: foundUser.user };
    }

    throw new Error("Invalid email or password");
  },

  // Deliveries
  getDeliveries: async (): Promise<Delivery[]> => {
    await delay(800);
    return [...mockDeliveries];
  },

  getDeliveryById: async (id: string): Promise<Delivery | undefined> => {
    await delay(300);
    return mockDeliveries.find((d) => d.id === id);
  },

  // Deliveries
  getCourierDeliveries: async (courierId: number): Promise<Delivery[]> => {
    await delay(800);
    return [
      ...mockDeliveries.filter(
        (d) => d?.assignedCourierId === `COU-${courierId}`,
      ),
    ];
  },

  updateDeliveryStatus: async (
    id: string,
    status: DeliveryStatus,
    notes?: string,
  ): Promise<ApiResponse<null>> => {
    await delay(500);

    const delivery = mockDeliveries.find((d) => d.id === id);
    if (delivery) {
      delivery.status = status;
      if (notes) delivery.notes = notes;
      if (status === "completed" || status === "returned") {
        delivery.completedAt = new Date().toISOString();
      }
    }

    return { success: true, message: "Status updated successfully" };
  },

  // POD Submission
  submitPOD: async (pod: PODData): Promise<ApiResponse<null>> => {
    await delay(1500);

    const delivery = mockDeliveries.find((d) => d.id === pod.deliveryId);
    if (delivery) {
      delivery.pod = pod;
      delivery.status = "completed";
      delivery.completedAt = new Date().toISOString();
    }

    return { success: true, message: "POD submitted successfully" };
  },

  // Mark delivery as returned/failed
  markReturned: async (
    id: string,
    reason: string,
  ): Promise<ApiResponse<null>> => {
    await delay(500);

    const delivery = mockDeliveries.find((d) => d.id === id);
    if (delivery) {
      delivery.status = "returned";
      delivery.notes = reason;
      delivery.completedAt = new Date().toISOString();
    }

    return { success: true, message: "Delivery marked as returned" };
  },
};

// Return failure reasons
export const failureReasons = [
  "Recipient not available",
  "Wrong address",
  "Office/Business closed",
  "Refused to accept",
  "Moved to new location",
  "Unable to locate address",
  "Security restriction",
  "Other",
];
