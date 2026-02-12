export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
  },
  COURIER: {
    LIST: "/courier",
    CREATE: "/courier/",
    ASSIGN: "/courier/assign",
    ACKNOWLEDGE_POD: "/courier/acknowledge-pod",
    VIEW: (id: string) => `/courier/${id}`,
  },
  SCHEDULES: {
    LIST: "/schedules/",
    CREATE: "/schedules/create",
    SUBMIT: "/schedules/submit",
    VIEW: (id: string) => `/schedules/${id}`,
    VERIFY: (id: string) => `/schedules/${id}/verify`,
    REJECT: (id: string) => `/schedules/${id}/reject`,
    UPDATE: (id: string) => `/schedules/${id}`,
  },
  LETTERS: {
    LIST: "/letter/",
    VIEW: (id: string) => `/letter/${id}`,
    IN_TRANSIT: (id: string) => `/letter/${id}/in-transit`,
    DELIVERED: (id: string) => `/letter/${id}/delivered`,
    UNDELIVERED: (id: string) => `/letter/${id}/undelivered`,
    APPROVE: (id: string) => `/letter/${id}/approve`,
    REJECT: (id: string) => `/letter/${id}/reject`,
    ALLOCATE: (id: string, courierId: string) =>
      `/letter/${id}/allocate/${courierId}`,
    AUTO_ALLOCATE: "/letter/auto-allocate",
  },
};
