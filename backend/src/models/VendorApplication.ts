import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface IVendorApplication extends Document {
  user: Types.ObjectId;
  fullName: string;
  businessName: string;
  phone: string;
  vehicleCount: number;
  message: string;
  documentUrl: string;
  status: ApplicationStatus;
  rejectionReason?: string;
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
    documentUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

export const VendorApplication: Model<IVendorApplication> =
  mongoose.models.VendorApplication ||
  mongoose.model<IVendorApplication>('VendorApplication', schema);
