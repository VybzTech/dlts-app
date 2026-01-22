// Letter/Delivery Status Types
export type DeliveryStatus =
  | "pending_approval"
  | "delivered"
  | "returned";

export type Priority = "NORMAL" | "URGENT";

// Core Data Types
export interface Delivery {
  id: string;
  trackingId: string; // e.g. LTR-2026-007
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
export type UserRole = "courier" | "admin" | "mgt";

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
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
  | "pending"
  | "completed"
  | "returned";
