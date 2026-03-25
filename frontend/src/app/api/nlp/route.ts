import { NextResponse } from "next/server";
import { submitComplaintText, submitComplaintVoice } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const { type, text, audioBase64 } = await req.json();

    if (type === "text" && text) {
      const result = await submitComplaintText(text);
      return NextResponse.json(result);
    } 
    
    if (type === "voice" && audioBase64) {
      const byteCharacters = atob(audioBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "audio/wav" });
      
      const result = await submitComplaintVoice(blob);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  } catch (error) {
    console.error("NLP error:", error);
    return NextResponse.json({ error: "Failed to process NLP" }, { status: 500 });
  }
}
