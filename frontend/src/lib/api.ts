const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function submitComplaintText(text: string) {
  const response = await fetch(`${API_BASE_URL}/api/predictions/text`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit text complaint");
  }

  return response.json();
}

export async function submitComplaintVoice(audioBlob: Blob) {
  const formData = new FormData();
  formData.append("file", audioBlob, "recording.wav");

  const response = await fetch(`${API_BASE_URL}/api/predictions/voice`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to submit voice complaint");
  }

  return response.json();
}
