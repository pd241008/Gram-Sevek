from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
from app.controllers.prediction_controller import PredictionController

prediction_router = APIRouter()

class TextPredictionRequest(BaseModel):
    text: str

class TextPredictionResponse(BaseModel):
    text: str
    category: str

class VoicePredictionResponse(BaseModel):
    transcribed_text: str
    predicted_category: str

@prediction_router.post("/predict/text", response_model=TextPredictionResponse)
def predict_text(request: TextPredictionRequest):
    """
    Predict the category of a text-based complaint.
    """
    return PredictionController.classify_text(request.text)

@prediction_router.post("/predict/voice", response_model=VoicePredictionResponse)
async def predict_voice(file: UploadFile = File(...)):
    """
    Predict the category of a voice-based complaint.
    Accepts an audio file upload.
    """
    # Accept reasonable audio mime types
    if not file.content_type.startswith("audio/") and file.content_type not in ["application/octet-stream", "video/webm"]:
        pass # allow some flexibility depending on client but preferably check
        
    try:
        content = await file.read()
    except Exception:
        raise HTTPException(status_code=400, detail="Failed to read the uploaded file.")
        
    return PredictionController.classify_voice(content)
