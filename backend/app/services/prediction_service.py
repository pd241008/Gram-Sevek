import joblib
import os
import tempfile
from faster_whisper import WhisperModel

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "model")

class PredictionService:
    _model = None
    _vectorizer = None
    _whisper_model = None

    @classmethod
    def load_models(cls):
        """
        Loads the necessary machine learning models into memory.
        This should be called exactly once during application startup.
        """
        if cls._model is None:
            print("Loading ML Text models...")
            # Try loading complaint_classifier.pkl first, fallback to logistic_regression_model.pkl
            model_path = os.path.join(MODEL_DIR, "text_classification", "complaint_classifier.pkl")
            if not os.path.exists(model_path):
                model_path = os.path.join(MODEL_DIR, "text_classification", "logistic_regression_model.pkl") 
            
            cls._model = joblib.load(model_path)
            
            vec_path = os.path.join(MODEL_DIR, "text_classification", "tfidf_vectorizer.pkl")
            cls._vectorizer = joblib.load(vec_path)

            print("Loading Whisper model...")
            cls._whisper_model = WhisperModel("base", device="cpu", compute_type="int8")
            print("All ML models loaded successfully.")

    @classmethod
    def predict_text(cls, text: str) -> str:
        """
        Predict the category of the given text using the loaded ML models.
        """
        if not text.strip():
            raise ValueError("Input text cannot be empty.")
        
        if cls._model is None or cls._vectorizer is None:
            raise RuntimeError("Text ML models are not loaded. Ensure startup event ran correctly.")

        vec = cls._vectorizer.transform([text.strip()])
        prediction = cls._model.predict(vec)
        return str(prediction[0])

    @classmethod
    def predict_voice(cls, audio_bytes: bytes) -> dict:
        """
        Transcribe voice using Whisper and then predict its category.
        """
        if cls._whisper_model is None:
            raise RuntimeError("Whisper model is not loaded. Ensure startup event ran correctly.")
        
        # Save audio bytes to a temporary file since WhisperModel.transcribe expects a file or numpy array
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
            tmp_file.write(audio_bytes)
            tmp_file_path = tmp_file.name

        try:
            segments, _ = cls._whisper_model.transcribe(tmp_file_path, beam_size=5)
            text = "".join([segment.text for segment in segments]).strip()
            
            if not text:
                raise ValueError("No speech detected in the audio file.")
                
            category = cls.predict_text(text)
            return {
                "transcribed_text": text,
                "predicted_category": category
            }
        finally:
            if os.path.exists(tmp_file_path):
                os.remove(tmp_file_path)
