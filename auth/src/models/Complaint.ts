import mongoose, { Schema, Types } from 'mongoose';

export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved';

export type ComplaintCategory =
  | 'water'
  | 'road'
  | 'electricity'
  | 'other';

export interface IComplaint {
  _id: Types.ObjectId;
  userId: Types.ObjectId; // Client
  description: string;
  category: ComplaintCategory;
  department: string;
  status: ComplaintStatus;
  complaintId: string; // Public ID (for user tracking)
  isVoice: boolean;
  voiceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema = new Schema<IComplaint>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['water', 'road', 'electricity', 'other'],
      default: 'other',
    },
    department: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'resolved'],
      default: 'pending',
    },
    complaintId: {
      type: String,
      unique: true,
      required: true,
    },
    isVoice: {
      type: Boolean,
      default: false,
    },
    voiceUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const ComplaintModel =
  mongoose.models.Complaint ||
  mongoose.model<IComplaint>('Complaint', ComplaintSchema);
