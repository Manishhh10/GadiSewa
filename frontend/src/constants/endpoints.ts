// ============================================================
//  ENDPOINTS  — the single source of truth for backend paths.
//  → Maps to the "ENDPOINTS" box in the architecture diagram.
// ============================================================
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    ME: '/api/auth/me',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    SEND_OTP: '/api/auth/send-otp',
    VERIFY_OTP: '/api/auth/verify-otp',
  },
  VEHICLES: {
    LIST: '/api/vehicles',
    CREATE: '/api/vehicles',
    MINE: '/api/vehicles/mine',
    DETAIL: (id: string) => `/api/vehicles/${id}`,
    UPDATE: (id: string) => `/api/vehicles/${id}`,
    DELETE: (id: string) => `/api/vehicles/${id}`,
  },
  BOOKINGS: {
    CREATE: '/api/bookings',
    LIST: '/api/bookings',
    VENDOR: '/api/bookings/vendor',
    DETAIL: (id: string) => `/api/bookings/${id}`,
    ESEWA_INITIATE: (id: string) => `/api/bookings/${id}/esewa/initiate`,
    STATUS: (id: string) => `/api/bookings/${id}/status`,
    CANCEL: (id: string) => `/api/bookings/${id}/cancel`,
  },
  VENDOR: {
    APPLY: '/api/vendor/applications',
    APPLICATIONS: '/api/vendor/applications',
  },
  STATS: {
    OVERVIEW: '/api/stats/overview',
    VENDOR: '/api/stats/vendor',
  },
  ADMIN: {
    APPLICATIONS: '/api/admin/applications',
    APPLICATION: (id: string) => `/api/admin/applications/${id}`,
    VEHICLES: '/api/admin/vehicles',
    VERIFY_VEHICLE: (id: string) => `/api/admin/vehicles/${id}/verify`,
    REVIEWS: '/api/admin/reviews',
    REVIEW: (id: string) => `/api/admin/reviews/${id}`,
    ISSUES: '/api/admin/issues',
    DISPUTES: '/api/admin/disputes',
    DISPUTE: (id: string) => `/api/admin/disputes/${id}`,
  },
  REVIEWS: {
    CREATE: '/api/reviews',
    FOR_VEHICLE: (vehicleId: string) => `/api/vehicles/${vehicleId}/reviews`,
  },
  ISSUES: {
    CREATE: '/api/issues',
  },
  CHECKLIST: (bookingId: string) => `/api/bookings/${bookingId}/checklist`,
} as const;
