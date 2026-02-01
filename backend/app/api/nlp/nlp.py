from fastapi import APIRouter, UploadFile, File, HTTPException, Body
from fastapi.responses import Response
from app.services.nlp_service.service import GeminiNLPService

router = APIRouter()
nlp_service = GeminiNLPService()

@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    # Read file
    audio_content = await file.read()
    
    # Use content_type from upload, default to audio/mp3 if missing
    mime = file.content_type or "audio/mp3"
    
    text = await nlp_service.speech_to_text(audio_content, mime_type=mime)
    return {"transcription": text}

@router.post("/speak")
async def generate_speech(
    text: str = Body(..., embed=True), 
    language: str = Body("Hindi", embed=True)
):
    audio_bytes = await nlp_service.text_to_speech(text, language)
    
    if not audio_bytes:
        raise HTTPException(status_code=500, detail="Failed to generate audio")

    return Response(content=audio_bytes, media_type="audio/wav")
