import type { Vehicle } from './vehicle';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'active'
  | 'completed'
  | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid';

export interface BookingRenter {
  _id: string;
  fullName?: string;
  username?: string;
  email?: string;
  phone?: string;
}

export interface Booking {
  _id: string;
  /** A plain user id on the renter's own bookings; populated with contact info on vendor bookings. */
  user: string | BookingRenter;
  /** Populated by the backend — null if the listing was since deleted by its owner. */
  vehicle: Vehicle | null;
  pickupDate: string;
  returnDate: string;
  days: number;
  pickupLocation: string;
  baseAmount: number;
  serviceFee: number;
  cleaningFee: number;
  totalAmount: number;
  status: BookingStatus;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  bookingRef: string;
  transactionId?: string;
  damageChecklist?: { key: string; condition: 'none' | 'minor' | 'major' }[];
  checklistCompletedAt?: string;
  createdAt: string;
}

export interface CreateBookingPayload {
  vehicleId: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation?: string;
}
