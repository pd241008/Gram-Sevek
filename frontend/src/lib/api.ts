const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function submitComplaintText(text: string) {
  const response = await fetch(`${API_BASE_URL}/api/predictions/predict/text`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    console.error("Backend Error Details:", errorDetails);
    throw new Error(`Failed to submit text complaint. Status: ${response.status}. Details: ${errorDetails}`);
  }

  return response.json();
}

export async function submitComplaintVoice(audioBlob: Blob) {
  const formData = new FormData();
  formData.append("file", audioBlob, "recording.wav");

  const response = await fetch(`${API_BASE_URL}/api/predictions/predict/voice`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    console.error("Backend Error Details:", errorDetails);
    throw new Error(`Failed to submit voice complaint. Status: ${response.status}. Details: ${errorDetails}`);
  }

  return response.json();
}
