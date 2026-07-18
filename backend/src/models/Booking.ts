import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'active'
  | 'completed'
  | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid';

export interface IBooking extends Document {
  user: Types.ObjectId;
  vehicle: Types.ObjectId;
  pickupDate: Date;
  returnDate: Date;
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
  esewaTransactionUuid?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    days: { type: Number, required: true, min: 1 },
    pickupLocation: { type: String, default: 'Kathmandu' },
    baseAmount: { type: Number, required: true },
    serviceFee: { type: Number, default: 0 },
    cleaningFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: { type: String, default: 'esewa' },
    paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
    bookingRef: { type: String, required: true, unique: true },
    transactionId: { type: String },
    esewaTransactionUuid: { type: String },
  },
  { timestamps: true }
);

export const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);
