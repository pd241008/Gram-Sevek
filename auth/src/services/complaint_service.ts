import { ComplaintModel } from "../models/Complaint";
import { generateComplaintId } from "../utils/generateId";
import { categorizeComplaint } from "../utils/nlp";

export const createComplaint = async (userId: string, data: any) => {
  const { category, dept } = categorizeComplaint(data.description);

  const complaint = await ComplaintModel.create({
    userId,
    description: data.description,
    category,
    department: dept,
    complaintId: generateComplaintId(),
    isVoice: data.isVoice || false,
  });

  return complaint;
};

export const getAllComplaints = async () => {
  return await ComplaintModel.find().populate("userId", "username email");
};

export const updateComplaintStatus = async (
  complaintId: string,
  status: string,
  adminId: string
) => {
  const complaint = await ComplaintModel.findById(complaintId);

  if (!complaint) throw new Error("Complaint not found");

  const oldStatus = complaint.status;

  complaint.status = status;
  await complaint.save();

  // Log history
  await import("../models/StatusHistory").then(({ StatusHistoryModel }) =>
    StatusHistoryModel.create({
      complaintId: complaint._id,
      updatedBy: adminId,
      oldStatus,
      newStatus: status,
    })
  );

  return complaint;
};
