import { NextResponse } from "next/server";
import { updateComplaintStatus } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { id, status } = await req.json();
    
    if (!id || !status) {
      return NextResponse.json({ error: "ID and Status are required" }, { status: 400 });
    }

    const success = await updateComplaintStatus(id, status);
    
    if (!success) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Updated to ${status}` });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
