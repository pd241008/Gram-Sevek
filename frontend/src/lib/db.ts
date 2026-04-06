import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), "complaints_db.json");

export type ComplaintStatus = "Pending" | "In Progress" | "Resolved";

export interface Complaint {
  id: string;
  type: "text" | "voice";
  content: string;
  category: string;
  department: string;
  status: ComplaintStatus;
  createdAt: string;
}

export async function getComplaints(): Promise<Complaint[]> {
  try {
    const response = await fetch("http://localhost:5000/api/complaints");
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Auth Service Error: ${response.status} - ${errText}`);
    }
    const json = await response.json();
    const statusMap: Record<string, ComplaintStatus> = {
      "pending": "Pending",
      "in_progress": "In Progress",
      "resolved": "Resolved"
    };

    return (json.data || []).map((c: any) => ({
      id: c.complaintId || c._id,
      type: c.isVoice ? "voice" : "text",
      content: c.description,
      category: c.category,
      department: c.department,
      status: statusMap[c.status as string] || "Pending",
      createdAt: c.createdAt || new Date().toISOString()
    }));
  } catch (e) {
    console.error("Fetch DB Error:", e);
    return [];
  }
}

export async function saveComplaint(complaint: Complaint) {
  const response = await fetch("http://localhost:5000/api/complaints", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": "507f1f77bcf86cd799439011", // Valid ObjectId format
    },
    body: JSON.stringify({
      description: complaint.content,
      category: complaint.category,
      department: complaint.department,
      isVoice: complaint.type === "voice",
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to save to MongoDB via Auth Service: ${err}`);
  }
}

export async function updateComplaintStatus(id: string, status: ComplaintStatus) {
  const reverseStatusMap: Record<string, string> = {
    "Pending": "pending",
    "In Progress": "in_progress",
    "Resolved": "resolved"
  };

  const response = await fetch("http://localhost:5000/api/complaints/status", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": "507f1f77bcf86cd799439012", // Valid Admin ObjectId format
    },
    body: JSON.stringify({
      complaintId: id,
      status: reverseStatusMap[status] || "pending",
    }),
  });

  return response.ok;
}

export async function getComplaint(id: string) {
  const complaints = await getComplaints();
  return complaints.find((c) => c.id === id) || null;
}
