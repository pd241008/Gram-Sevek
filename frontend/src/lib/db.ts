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
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return []; // Return empty array if file doesn't exist yet
  }
}

export async function saveComplaint(complaint: Complaint) {
  const complaints = await getComplaints();
  complaints.unshift(complaint); // Add to beginning
  await fs.writeFile(DB_PATH, JSON.stringify(complaints, null, 2));
}

export async function updateComplaintStatus(id: string, status: ComplaintStatus) {
  const complaints = await getComplaints();
  const index = complaints.findIndex((c) => c.id === id);
  if (index !== -1) {
    complaints[index].status = status;
    await fs.writeFile(DB_PATH, JSON.stringify(complaints, null, 2));
    return true;
  }
  return false;
}

export async function getComplaint(id: string) {
  const complaints = await getComplaints();
  return complaints.find((c) => c.id === id) || null;
}
