export type LetterStatus =
  | "Pending_Approval"
  | "Approved"
  | "Assigned"
  | "In_Transit"
  | "Delivered"
  | "Undelivered"
  | "Rejected"
  | "Allocated"
  | "InTransit"
  | "Pending"
  | "Registered";

export type LetterPriority = "NORMAL" | "HIGH";

export interface LetterTimeline {
  id: string;
  letterId: string;
  status: LetterStatus;
  description: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
  };
}

export interface Directorate {
  id: string;
  name: string;
  code: string;
}

export interface Courier {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Letter {
  id: string;
  trackingId: string;
  senderDirectorateId: string;
  createdById: string;
  approvedById?: string;
  courierId?: string;
  recipientName: string;
  recipientAddress: string;
  lgaAddress: string;
  subject: string;
  status: LetterStatus;
  priority: LetterPriority;
  liabilityValue: number;
  liabilityYear: string;
  notes?: string;
  podImage?: string;
  deliveredAt?: string;
  receivedBy?: string;
  podImagePath?: string;
  assignedAt?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  senderDirectorate?: Directorate;
  createdBy?: User;
  approvedBy?: User;
  courier?: Courier;
  timelines?: LetterTimeline[];
}

export interface LetterListResponse {
  letters: Letter[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LetterActionPayload {
  reason?: string;
  notes?: string;
  podImage?: string;
  podImageUri?: string;
  recipientName?: string;
}
