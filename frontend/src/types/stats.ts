interface BookingCounts {
  total: number;
  pending: number;
  confirmed: number;
  active: number;
  completed: number;
  cancelled: number;
}

/** Admin's platform-wide overview — no revenue, that's a vendor's own concern, not the platform operator's. */
export interface Overview {
  vehicles: number;
  users: number;
  bookings: BookingCounts;
  avgRating: number;
}

/** A vendor's own fleet — includes revenue, which matters to them specifically. */
export interface VendorOverview {
  vehicles: number;
  bookings: BookingCounts;
  revenue: number;
  avgRating: number;
}
