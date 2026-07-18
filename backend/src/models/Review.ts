import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IReview extends Document {
  booking: Types.ObjectId;
  vehicle: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  comment: string;
  hidden: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '', trim: true, maxlength: 1000 },
    hidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);
