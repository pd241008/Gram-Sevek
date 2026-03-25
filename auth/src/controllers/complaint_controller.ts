import { Request, Response } from "express";
import * as ComplaintService from "../services/complaint_service";

export const createComplaintHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string; // mock auth

    const complaint = await ComplaintService.createComplaint(userId, req.body);

    res.status(201).json({ success: true, data: complaint });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getComplaintsHandler = async (_req: Request, res: Response) => {
  const data = await ComplaintService.getAllComplaints();
  res.json({ data });
};

export const updateStatusHandler = async (req: Request, res: Response) => {
  try {
    const adminId = req.headers["x-user-id"] as string;

    const { complaintId, status } = req.body;

    const updated = await ComplaintService.updateComplaintStatus(
      complaintId,
      status,
      adminId
    );

    res.json({ data: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
