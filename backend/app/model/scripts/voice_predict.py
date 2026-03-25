import sounddevice as sd
import numpy as np
from faster_whisper import WhisperModel
import joblib

# Load trained ML model and vectorizer
model = joblib.load("logistic_regression_model.pkl")
vectorizer = joblib.load("tfidf_vectorizer.pkl")

# Load Whisper speech-to-text model (CPU mode)
whisper_model = WhisperModel(
    "base",
    device="cpu",
    compute_type="int8"
)

# Recording settings
samplerate = 16000
duration = 5

print("🎤 Recording will start...")
print("Speak your complaint now!")

# Record audio
audio = sd.rec(int(duration * samplerate),
               samplerate=samplerate,
               channels=1)
sd.wait()

print("✅ Recording finished")
print("🧠 Converting speech to text...")

# Convert speech → text
segments, info = whisper_model.transcribe(
    audio.flatten(),
    beam_size=5
)

text = ""
for segment in segments:
    text += segment.text

text = text.strip()

print("Recognized text:", text)

# Handle empty speech
if text == "":
    print("⚠ No speech detected. Please try again.")
    exit()

# Vectorize text
vec = vectorizer.transform([text])

# Predict complaint category
prediction = model.predict(vec)

print("📂 Predicted Category:", prediction[0])