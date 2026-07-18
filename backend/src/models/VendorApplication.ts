import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface IVendorApplication extends Document {
  user: Types.ObjectId;
  fullName: string;
  businessName: string;
  phone: string;
  vehicleCount: number;
  message: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IVendorApplication>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    businessName: { type: String, required: true },
    phone: { type: String, required: true },
    vehicleCount: { type: Number, default: 1 },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const VendorApplication: Model<IVendorApplication> =
  mongoose.models.VendorApplication ||
  mongoose.model<IVendorApplication>('VendorApplication', schema);
