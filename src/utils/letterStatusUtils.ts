import { LetterStatus } from "@/src/types/letter.types";

/**
 * Letter Status Utilities
 * Provides helper functions for letter status management
 */

// Status hierarchy for validation
const statusHierarchy: Record<LetterStatus, number> = {
  Registered: 0,
  Approved: 1,
  Allocated: 2,
  InTransit: 3,
  Delivered: 4,
  Undelivered: 4, // Terminal state
  Rejected: 1, // Terminal state
};

// Valid status transitions for couriers
const validCourierTransitions: Record<LetterStatus, LetterStatus[]> = {
  Registered: [],
  Approved: [],
  Allocated: ["InTransit"], // Courier can start transit
  InTransit: ["Delivered", "Undelivered"], // Courier can complete or fail
  Delivered: [], // Terminal
  Undelivered: [], // Terminal
  Rejected: [], // Terminal
};

/**
 * Check if a status transition is valid for courier
 */
export const canCourierTransition = (
  currentStatus: LetterStatus,
  newStatus: LetterStatus,
): boolean => {
  return validCourierTransitions[currentStatus]?.includes(newStatus) ?? false;
};

/**
 * Get available actions for a letter status
 */
export const getAvailableActions = (status: LetterStatus) => {
  const actions = [];

  if (
    status === "Allocated" ||
    status === "Registered" ||
    status === "Approved"
  ) {
    actions.push({
      type: "inTransit",
      label: "Start Transit",
      color: "primary",
    });
  }

  if (status === "InTransit") {
    actions.push({
      type: "delivered",
      label: "Mark Delivered",
      color: "success",
    });
    actions.push({
      type: "undelivered",
      label: "Decline",
      color: "error",
    });
  }

  return actions;
};

/**
 * Get display label for status
 */
export const getStatusLabel = (status: LetterStatus): string => {
  const labels: Record<LetterStatus, string> = {
    Registered: "Registered",
    Approved: "Approved",
    Allocated: "Allocated",
    InTransit: "In Transit",
    Delivered: "Delivered",
    Undelivered: "Undelivered",
    Rejected: "Rejected",
  };
  return labels[status] || status;
};

/**
 * Get color for status badge
 */
export const getStatusColor = (
  status: LetterStatus,
): "primary" | "success" | "error" | "warning" | "info" => {
  const colors: Record<
    LetterStatus,
    "primary" | "success" | "error" | "warning" | "info"
  > = {
    Registered: "warning",
    Approved: "warning",
    Allocated: "info",
    InTransit: "info",
    Delivered: "success",
    Undelivered: "error",
    Rejected: "error",
  };
  return colors[status] || "primary";
};

/**
 * Check if letter is in a terminal state
 */
export const isTerminalStatus = (status: LetterStatus): boolean => {
  return ["Delivered", "Undelivered", "Rejected"].includes(status);
};

/**
 * Check if letter can be edited
 */
export const canEditLetter = (status: LetterStatus): boolean => {
  return !isTerminalStatus(status);
};

/**
 * Get status progression percentage (0-100)
 */
export const getStatusProgress = (status: LetterStatus): number => {
  const progress: Record<LetterStatus, number> = {
    Registered: 20,
    Approved: 40,
    Allocated: 60,
    InTransit: 80,
    Delivered: 100,
    Undelivered: 50,
    Rejected: 10,
  };
  return progress[status] || 0;
};

/**
 * Common decline reasons for undelivered letters
 */
export const DECLINE_REASONS = [
  "Address not found",
  "Recipient unavailable",
  "Recipient refused",
  "Invalid address",
  "No access to location",
  "Recipient deceased",
  "Number not in use",
  "Business closed",
  "Wrong location",
  "Other",
];

/**
 * Format letter tracking ID
 */
export const formatTrackingId = (id: string): string => {
  // Already formatted, just return as-is
  return id;
};

/**
 * Get next suggested action for a letter
 */
export const getNextAction = (status: LetterStatus): string | null => {
  const nextActions: Record<LetterStatus, string | null> = {
    Registered: "Awaiting approval",
    Approved: "Awaiting allocation",
    Allocated: "Ready to pick up - Start transit",
    InTransit: "Complete delivery or mark undelivered",
    Delivered: "Completed",
    Undelivered: "Requires follow-up",
    Rejected: "Letter rejected",
  };
  return nextActions[status] || null;
};

/**
 * Get status summary for stats
 */
export type StatusCategory =
  | "pending"
  | "inTransit"
  | "delivered"
  | "undelivered";

export const categorizeStatus = (status: LetterStatus): StatusCategory => {
  if (["Registered", "Approved", "Allocated"].includes(status))
    return "pending";
  if (status === "InTransit") return "inTransit";
  if (status === "Delivered") return "delivered";
  if (["Undelivered", "Rejected"].includes(status)) return "undelivered";
  return "pending";
};

/**
 * Validate letter action data
 */
export interface ActionValidation {
  valid: boolean;
  errors: string[];
}

export const validateDeliveryData = (data: any): ActionValidation => {
  const errors: string[] = [];

  if (!data.recipientName?.trim()) {
    errors.push("Recipient name is required");
  }

  // POD image validation can be added here if needed
  // if (!data.podImage) {
  //   errors.push("POD image is required");
  // }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateDeclineData = (data: any): ActionValidation => {
  const errors: string[] = [];

  if (!data.reason?.trim()) {
    errors.push("Decline reason is required");
  }

  if (data.reason?.length < 5) {
    errors.push("Reason must be at least 5 characters");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
