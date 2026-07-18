import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type DisputeStatus = 'open' | 'resolved';
export type DisputeResolution = 'refund_renter' | 'side_with_vendor';

export interface IDispute extends Document {
  booking: Types.ObjectId;
  renter: Types.ObjectId;
  vendor?: Types.ObjectId;
  issue: string;
  amount: number;
  status: DisputeStatus;
  resolution?: DisputeResolution;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const disputeSchema = new Schema<IDispute>(
  {
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    renter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vendor: { type: Schema.Types.ObjectId, ref: 'User' },
    issue: { type: String, required: true, trim: true, maxlength: 2000 },
    amount: { type: Number, default: 0 },
    status: { type: String, enum: ['open', 'resolved'], default: 'open' },
    resolution: { type: String, enum: ['refund_renter', 'side_with_vendor'] },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

export const Dispute: Model<IDispute> =
  mongoose.models.Dispute || mongoose.model<IDispute>('Dispute', disputeSchema);
