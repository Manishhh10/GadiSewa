export interface Overview {
  vehicles: number;
  users: number;
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    active: number;
    completed: number;
    cancelled: number;
  };
  revenue: number;
  avgRating: number;
}

/** Same shape minus `users` — a vendor doesn't get a platform-wide user count. */
export type VendorOverview = Omit<Overview, 'users'>;
