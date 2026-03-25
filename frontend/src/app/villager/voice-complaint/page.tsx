"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Mic, Loader2, Square, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function VoiceComplaintPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setIsLoading(true);
        stream.getTracks().forEach((track) => track.stop());

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64data = (reader.result as string).split(',')[1];
          try {
            const res = await fetch("/api/complaints", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type: "voice", audioBase64: base64data }),
            });
            const data = await res.json();
            if (res.ok) {
              router.push(`/villager/confirmation?id=${encodeURIComponent(data.id)}&category=${encodeURIComponent(data.category)}&dept=${encodeURIComponent(data.department)}`);
            } else {
              setError(data.error || "Failed to submit Voice issue.");
            }
          } catch (err) {
             setError("Network error processing audio.");
          } finally {
            setIsLoading(false);
          }
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Microphone access denied. Please allow mic permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col p-6 relative">
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-gs-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl w-full mx-auto relative z-10 pt-10">
        <Link href="/villager/dashboard" className="inline-flex items-center gap-2 text-gs-text-muted hover:text-gs-accent transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-black mb-4">Voice Grievance</h1>
          <p className="text-gs-text-muted mb-16">Speak directly into your microphone. Our Whisper AI will transcribe your voice into text and instantly route it to the correct department.</p>

          <div className="flex flex-col items-center justify-center p-12 bg-gs-surface border-2 border-gs-border rounded-3xl relative overflow-hidden">
            {error && <div className="absolute top-4 bg-red-500/10 text-red-500 px-4 py-2 rounded-lg font-medium">{error}</div>}
            
            <div className="relative mb-8">
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1.5 }}
                  transition={{ repeat: Infinity, duration: 1.2, repeatType: "reverse" }}
                  className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl"
                />
              )}
              
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading}
                className={cn(
                  "relative z-10 flex items-center justify-center w-32 h-32 rounded-full border-4 transition-all shadow-[0_0_40px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95",
                  isRecording
                    ? "border-red-500 bg-red-500/10 text-red-500"
                    : "border-gs-accent bg-gs-accent/10 text-gs-accent hover:bg-gs-accent/20",
                  isLoading && "opacity-50 cursor-not-allowed border-gs-text-muted text-gs-text-muted bg-transparent"
                )}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={48} />
                ) : isRecording ? (
                  <Square size={40} className="fill-current" />
                ) : (
                  <Mic size={48} />
                )}
              </button>
            </div>
            
            <p className="text-xl font-bold">
              {isLoading
                ? "Analyzing Audio using AI..."
                : isRecording
                ? "Recording Active... Tap square to stop"
                : "Tap Microphone to Start Recording"}
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
