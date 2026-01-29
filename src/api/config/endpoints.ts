export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
  },
  COURIER: {
    CREATE: '/courier/',
    ASSIGN: '/courier/assign',
    ACKNOWLEDGE_POD: '/courier/acknowledge-pod',
  },
  SCHEDULES: {
    LIST: '/schedules/',
    CREATE: '/schedules/create',
    SUBMIT: '/schedules/submit',
    VIEW: (id: string) => `/schedules/${id}`,
    VERIFY: (id: string) => `/schedules/${id}/verify`,
    REJECT: (id: string) => `/schedules/${id}/reject`,
    UPDATE: (id: string) => `/schedules/${id}`,
  },
};
