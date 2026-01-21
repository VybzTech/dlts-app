import type { UserRole, DeliveryStatus } from "@/src/types";

export const ROLE_PERMISSIONS = {
  courier: {
    screens: ["courier.deliveries", "courier.profile"],
    actions: ["delivery.view.own", "delivery.update_status", "pod.submit"],
    statusTransitions: {
      assigned: ["picked_up"],
      picked_up: ["en_route"],
      en_route: ["arrived"],
      arrived: ["delivered", "returned"],
    },
  },

  admin: {
    screens: ["admin.letters", "admin.couriers", "admin.profile"],
    actions: ["delivery.view.all", "pod.review", "schedule.complete"],
    statusTransitions: {}, // admin does NOT move courier statuses directly
  },

  mgt: {
    screens: [
      "mgt.letters",
      "mgt.couriers",
      "mgt.history",
      "mgt.profile",
    ],
    actions: ["delivery.view.all", "metrics.view"],
    statusTransitions: {}, // read-only
  },
} satisfies Record<UserRole, any>;
