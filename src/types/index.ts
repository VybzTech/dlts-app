// Delivery Status Types
export type DeliveryStatus =
  | 'assigned'
  | 'picked_up'
  | 'en_route'
  | 'arrived'
  | 'delivered'
  | 'returned';

export type Priority = 'MINIMAL' | 'MEDIUM' | 'HIGH' | 'URGENT';

// Core Data Types
export interface Delivery {
  id: string;
  scheduleId: string;
  companyName: string;
  destination: string;
  lga: string;
  contactPerson?: string;
  contactPhone?: string;
  letterCount: number;
  priority: Priority;
  status: DeliveryStatus;
  assignedAt: string;
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

export interface User {
  id: string;
  username: string;
  fullName: string;
  staffId: string;
  unit: string;
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
export type StatusFilter = 'all' | 'pending' | 'in_progress' | 'completed';
