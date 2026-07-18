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
