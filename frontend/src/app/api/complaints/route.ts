import { NextResponse } from "next/server";
import { saveComplaint, Complaint } from "@/lib/db";
import { submitComplaintText, submitComplaintVoice } from "@/lib/api"; // Old API funcs calling FastAPI

// Helper to assign mock departments based on category
function getDepartmentForCategory(category: string) {
  const mappings: Record<string, string> = {
    "Water": "Water & Sanitation Dept (Pani Samiti)",
    "Electricity": "MSEB / Power Distribution",
    "Roads": "Public Works Department (PWD)",
    "Health": "Gram Panchayat Health Clinic",
    "Education": "Zilla Parishad Education Board"
  };
  return mappings[category] || "General Gram Panchayat Office";
}

export async function GET() {
  const { getComplaints } = await import("@/lib/db");
  try {
    const complaints = await getComplaints();
    return NextResponse.json(complaints);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch complaints" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, text, audioBase64 } = body;

    let predictionResult;
    let finalContent = text;

    if (type === "text") {
      const result = await submitComplaintText(text);
      // FastAPI returns 'category' and 'text'. Normalize to 'predicted_category'
      predictionResult = { 
        predicted_category: result.category || "General",
        transcribed_text: result.text || text
      };
    } else if (type === "voice" && audioBase64) {
      // Decode base64 to Blob
      const byteCharacters = atob(audioBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "audio/wav" });
      
      predictionResult = await submitComplaintVoice(blob);
      finalContent = predictionResult.transcribed_text || "[Audio Transcription Failed]";
    } else {
      return NextResponse.json({ error: "Invalid input type" }, { status: 400 });
    }

    const category = (predictionResult.predicted_category || "other").toLowerCase();
    
    // Normalize to exact enum values allowed by Mongoose
    let finalCategory = "other";
    if (["water", "road", "electricity"].includes(category)) {
      finalCategory = category;
    }

    // Generate Complaint Payload
    const newComplaint: Complaint = {
      id: "GS-" + Math.floor(100000 + Math.random() * 900000).toString(),
      type,
      content: finalContent,
      category: finalCategory,
      department: getDepartmentForCategory(predictionResult.predicted_category || "General"),
      status: "Pending",
      createdAt: new Date().toISOString()
    };

    await saveComplaint(newComplaint);

    return NextResponse.json(newComplaint, { status: 201 });

  } catch (error: any) {
    console.error("Error creating complaint:", error);
    return NextResponse.json({ 
      error: "Failed to create complaint",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
