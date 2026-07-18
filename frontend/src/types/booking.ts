import type { Vehicle } from './vehicle';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'active'
  | 'completed'
  | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid';

export interface Booking {
  _id: string;
  user: string;
  vehicle: Vehicle; // populated by the backend
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
  createdAt: string;
}

export interface CreateBookingPayload {
  vehicleId: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation?: string;
}
