// ============================================================
//  ENDPOINTS  — the single source of truth for backend paths.
//  → Maps to the "ENDPOINTS" box in the architecture diagram.
// ============================================================
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    ME: '/api/auth/me',
  },
  VEHICLES: {
    LIST: '/api/vehicles',
    CREATE: '/api/vehicles',
    DETAIL: (id: string) => `/api/vehicles/${id}`,
  },
  BOOKINGS: {
    CREATE: '/api/bookings',
    LIST: '/api/bookings',
    DETAIL: (id: string) => `/api/bookings/${id}`,
    PAY: (id: string) => `/api/bookings/${id}/pay`,
  },
  VENDOR: {
    APPLY: '/api/vendor/applications',
    APPLICATIONS: '/api/vendor/applications',
  },
  STATS: {
    OVERVIEW: '/api/stats/overview',
  },
  ADMIN: {
    APPLICATIONS: '/api/admin/applications',
    APPLICATION: (id: string) => `/api/admin/applications/${id}`,
    VEHICLES: '/api/admin/vehicles',
    VERIFY_VEHICLE: (id: string) => `/api/admin/vehicles/${id}/verify`,
  },
} as const;
