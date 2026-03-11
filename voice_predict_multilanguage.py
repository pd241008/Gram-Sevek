import sounddevice as sd
import numpy as np
from faster_whisper import WhisperModel
import joblib

print("Program started")

# Load model
print("Loading ML model...")
model = joblib.load("logistic_regression_model.pkl")
vectorizer = joblib.load("tfidf_vectorizer.pkl")

print("Loading Whisper model...")
whisper_model = WhisperModel(
    "small",
    device="cpu",
    compute_type="int8"
)

samplerate = 16000
duration = 5

print("🎤 Recording will start in 2 seconds...")
import time
time.sleep(2)

print("🎤 Speak now!")

audio = sd.rec(int(duration * samplerate),
               samplerate=samplerate,
               channels=1)

sd.wait()

print("✅ Recording finished")
print("Audio shape:", audio.shape)

print("🧠 Running speech recognition...")

segments, info = whisper_model.transcribe(
    audio.flatten(),
    beam_size=5,
    task="translate"
)

text = ""

for segment in segments:
    print("Segment:", segment.text)
    text += segment.text

text = text.strip()

print("Detected language:", info.language)
print("Translated text:", text)

if text == "":
    print("⚠ No speech detected")
    exit()

vec = vectorizer.transform([text])

prediction = model.predict(vec)

print("📂 Predicted Category:", prediction[0])