import mongoose, { Schema, Types } from 'mongoose';

export interface IStatusHistory {
  _id: Types.ObjectId;
  complaintId: Types.ObjectId;
  updatedBy: Types.ObjectId; // Admin
  oldStatus: string;
  newStatus: string;
  note?: string;
  updatedAt: Date;
}

const StatusHistorySchema = new Schema<IStatusHistory>(
  {
    complaintId: {
      type: Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    oldStatus: {
      type: String,
    },
    newStatus: {
      type: String,
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const StatusHistoryModel =
  mongoose.models.StatusHistory ||
  mongoose.model<IStatusHistory>(
    'StatusHistory',
    StatusHistorySchema
  );
