// Delivery Status Types
export type DeliveryStatus =
  | "assigned"
  | "picked_up"
  | "en_route"
  | "arrived"
  | "delivered"
  | "returned";

export type Priority = "NORMAL" | "URGENT";

// Core Data Types
export interface Delivery {
  id: string;
  scheduleId: string;
  companyName: string;
  title: string;
  destination: string;
  lga: string;
  liabilityYear: string;
  status: DeliveryStatus;
  priority: Priority;
  liabilityAmount: number;
  submittedAt: string;
  contactPerson?: string;
  contactPhone?: string;
  assignedCourierId?: string;
  assignedAt: string;
  pickedUpAt?: string;
  completedAt?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  notes?: string;
  pod?: PODData;
}

export interface PODData {
  deliveryId: string;
  recipientName: string;
  recipientPhone?: string;
  signature: string; // base64
  photos: string[]; // base64 array
  notes?: string;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

// User Roles
export type UserRole = "courier" | "admin" | "unit";

export interface User {
  id: string;
  email: string;
  fullName: string;
  staffId: string;
  unit: string;
  role: UserRole;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface LoginResponse {
  user: User;
  token?: string;
}

// Filter Types
export type StatusFilter =
  | "all"
  | "returned"
  | "pending"
  | "in_progress"
  | "completed";
