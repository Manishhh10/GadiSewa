import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type IssueStatus = 'open' | 'resolved';

export interface IIssue extends Document {
  user: Types.ObjectId;
  bookingRef: string;
  category: string;
  description: string;
  status: IssueStatus;
  createdAt: Date;
  updatedAt: Date;
}

const issueSchema = new Schema<IIssue>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookingRef: { type: String, default: '' },
    category: { type: String, required: true },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    status: { type: String, enum: ['open', 'resolved'], default: 'open' },
  },
  { timestamps: true }
);

export const Issue: Model<IIssue> =
  mongoose.models.Issue || mongoose.model<IIssue>('Issue', issueSchema);
