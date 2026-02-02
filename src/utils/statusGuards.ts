import type { UserRole } from "@/src/types";
import { ROLE_PERMISSIONS } from "./permissions";
import { DeliveryStatus } from "../types/delivery.types";

export function canTransitionStatus(
  role: UserRole,
  current: DeliveryStatus,
  next: DeliveryStatus
): boolean {
  const statusTransitions = ROLE_PERMISSIONS[role]?.statusTransitions;
  
  if (!statusTransitions || !(current in statusTransitions)) {
    return false;
  }

  const transitions = statusTransitions[current as keyof typeof statusTransitions];

  return transitions?.includes(next) ?? false;
}
