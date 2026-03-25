import logging
from fastapi import HTTPException
from app.services.prediction_service import PredictionService

logger = logging.getLogger(__name__)

class PredictionController:
    @staticmethod
    def classify_text(text: str) -> dict:
        """
        Business logic to validate Data, call PredictionService, and handle domain errors.
        """
        try:
            category = PredictionService.predict_text(text)
            return {
                "text": text,
                "category": category
            }
        except ValueError as ve:
            logger.error(f"Validation error in classify_text: {str(ve)}")
            raise HTTPException(status_code=400, detail=str(ve))
        except RuntimeError as re:
            logger.error(f"Service error in classify_text: {str(re)}")
            raise HTTPException(status_code=500, detail="Prediction models are currently unavailable.")
        except Exception as e:
            logger.error(f"Unexpected error in classify_text: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error during text prediction.")

    @staticmethod
    def classify_voice(audio_bytes: bytes) -> dict:
        """
        Business logic for voice classification.
        """
        try:
            result = PredictionService.predict_voice(audio_bytes)
            return result
        except ValueError as ve:
            logger.error(f"Validation error in classify_voice: {str(ve)}")
            raise HTTPException(status_code=400, detail=str(ve))
        except RuntimeError as re:
            logger.error(f"Service error in classify_voice: {str(re)}")
            raise HTTPException(status_code=500, detail="Prediction models are currently unavailable.")
        except Exception as e:
            logger.error(f"Unexpected error in classify_voice: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error during voice prediction.")
