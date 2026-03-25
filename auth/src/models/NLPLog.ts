import mongoose, { Schema, Types } from 'mongoose';

export interface INLPLog {
  _id: Types.ObjectId;
  complaintId: Types.ObjectId;
  extractedKeywords: string[];
  confidenceScore: number;
  rawText: string;
  createdAt: Date;
}

const NLPLogSchema = new Schema<INLPLog>(
  {
    complaintId: {
      type: Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true,
    },
    extractedKeywords: [
      {
        type: String,
      },
    ],
    confidenceScore: {
      type: Number,
    },
    rawText: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const NLPLogModel =
  mongoose.models.NLPLog ||
  mongoose.model<INLPLog>('NLPLog', NLPLogSchema);
