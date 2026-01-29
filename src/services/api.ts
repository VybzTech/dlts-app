import type {
  ApiResponse,
  Delivery,
  User
} from "../types";
import { DeliveryStatus } from "../types/delivery.types";

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

import { authService } from "../api/services/auth.service";
import { deliveryService } from "../api/services/delivery.service";
import { podService } from "../api/services/pod.service";

// Real API Service
export const api = {
  // Authentication
  login: authService.login,
  signup: authService.signup,

  // Deliveries
  getDeliveries: deliveryService.getDeliveries,
  getDeliveryById: deliveryService.getDeliveryById,
  
  getCourierDeliveries: async (courierId: number): Promise<Delivery[]> => {
    // If the backend has a specific courier endpoint, use it. 
    // Otherwise filter from all deliveries for now.
    const all = await deliveryService.getDeliveries();
    return all.filter(d => d.assignedCourierId === `COU-${courierId}`);
  },

  updateDeliveryStatus: deliveryService.updateDeliveryStatus,

  // POD Submission
  submitPOD: podService.submitPOD,

  // Mark delivery as returned/failed
  markReturned: async (
    id: string,
    reason: string,
  ): Promise<ApiResponse<null>> => {
    return deliveryService.updateDeliveryStatus(id, "returned" as DeliveryStatus, reason);
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
