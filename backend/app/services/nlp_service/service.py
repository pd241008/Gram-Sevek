import os
import base64
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

class GeminiNLPService:
    def __init__(self):
        # Initialize the new GenAI client
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("⚠️ WARNING: GEMINI_API_KEY not found in environment variables")
        
        self.client = genai.Client(api_key=api_key)
        
        # Models
        self.stt_model = "gemini-2.0-flash"
        self.tts_model = "gemini-2.0-flash-lite-preview-02-05"

    async def speech_to_text(self, audio_bytes: bytes, mime_type: str = "audio/mp3") -> str:
        """Transcribes audio using Gemini 2.0 Flash."""
        try:
            prompt = "Transcribe this audio exactly as spoken in the original language. Do not translate."
            response = self.client.models.generate_content(
                model=self.stt_model,
                contents=[
                    types.Content(
                        role="user",
                        parts=[
                            types.Part.from_text(text=prompt),
                            types.Part.from_bytes(data=audio_bytes, mime_type=mime_type)
                        ]
                    )
                ]
            )
            # Safe check for response text
            return response.text if response.text else "Transcription failed."
        except Exception as e:
            print(f"STT Error: {str(e)}")
            return f"Error processing audio: {str(e)}"

    # FIX 1: Updated return type hint to allow None (bytes | None)
    async def text_to_speech(self, text: str, lang: str = "Hindi") -> bytes | None:
        """Generates audio using Gemini 2.0 Flash TTS."""
        try:
            prompt = f"Say the following text clearly and naturally in {lang}. Do not add any markdown, just the speech: {text}"
            response = self.client.models.generate_content(
                model=self.tts_model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_modalities=["AUDIO"],
                    speech_config=types.SpeechConfig(
                        voice_config=types.VoiceConfig(
                            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                voice_name="Puck"
                            )
                        )
                    )
                )
            )
            
            # FIX 2: Strict None checks before accessing attributes
            if (response.candidates and 
                response.candidates[0].content and 
                response.candidates[0].content.parts):
                
                for part in response.candidates[0].content.parts:
                    # FIX 3: Check both inline_data AND inline_data.data
                    if part.inline_data and part.inline_data.data:
                        return base64.b64decode(part.inline_data.data)
            
            return None
            
        except Exception as e:
            print(f"TTS Error: {str(e)}")
            return None