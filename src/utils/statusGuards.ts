import type { DeliveryStatus, UserRole } from "@/src/types";
import { ROLE_PERMISSIONS } from "./permissions";

export function canTransitionStatus(
  role: UserRole,
  current: DeliveryStatus,
  next: DeliveryStatus
): boolean {
  const transitions =
    ROLE_PERMISSIONS[role]?.statusTransitions?.[current];

  return transitions?.includes(next) ?? false;
}
