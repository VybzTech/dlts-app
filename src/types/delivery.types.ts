export type DeliveryStatus =
  | "Pending_Approval"
  | "Delivered"
  | "Undelivered"
  | "pending_approval"
  | "completed"
  | "returned";

export type FilterType = "all" | "pending" | "completed" | "returned";
