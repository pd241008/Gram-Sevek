import { NextResponse } from "next/server";
import { getComplaint } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Complaint ID is required" }, { status: 400 });
    }

    const complaint = await getComplaint(id);
    
    if (!complaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    return NextResponse.json(complaint);
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
