import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISpec {
  icon: string; // Material Symbols icon name
  label: string; // e.g. "7 Seats", "Manual", "350cc"
}

export interface IHost {
  name: string;
  avatarUrl: string;
  verified: boolean;
  memberSince: string;
  responseRate: number; // %
  bookings: number;
}

export type VehicleType = 'Bike' | 'Car' | 'SUV' | 'Truck' | 'Van';

export interface IVehicle extends Document {
  name: string;
  type: VehicleType;
  imageUrl: string;
  images: string[];
  rating: number;
  reviewsCount: number;
  conditionScore: number; // out of 10
  dailyRate: number; // in NPR
  verified: boolean;
  featured: boolean;
  description: string;
  specs: ISpec[];
  location: string;
  host?: IHost;
  owner?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const specSchema = new Schema<ISpec>(
  { icon: { type: String, required: true }, label: { type: String, required: true } },
  { _id: false }
);

const hostSchema = new Schema<IHost>(
  {
    name: { type: String, required: true },
    avatarUrl: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    memberSince: { type: String, default: '' },
    responseRate: { type: Number, default: 0 },
    bookings: { type: Number, default: 0 },
  },
  { _id: false }
);

const vehicleSchema = new Schema<IVehicle>(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['Bike', 'Car', 'SUV', 'Truck', 'Van'],
      required: true,
    },
    imageUrl: { type: String, default: '' },
    images: { type: [String], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    conditionScore: { type: Number, default: 0, min: 0, max: 10 },
    dailyRate: { type: Number, required: true, min: 0 },
    verified: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    description: { type: String, default: '' },
    specs: { type: [specSchema], default: [] },
    location: { type: String, default: 'Kathmandu' },
    host: { type: hostSchema, default: undefined },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Vehicle: Model<IVehicle> =
  mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', vehicleSchema);
