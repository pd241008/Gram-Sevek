"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, Type, Loader2, AlertCircle, CheckCircle2, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitComplaintText, submitComplaintVoice } from "@/lib/api";

type CategoryResult = {
  transcribed_text?: string;
  predicted_category: string;
};

export function ComplaintForm() {
  const [inputType, setInputType] = useState<"text" | "voice">("text");
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CategoryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartRecording = async () => {
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
        try {
          const res = await submitComplaintVoice(audioBlob);
          setResult(res);
        } catch (err) {
          setError("Failed to process voice. Our servers might be busy.");
        } finally {
          setIsLoading(false);
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
      setResult(null);
    } catch (err) {
      console.error(err);
      setError("Microphone access denied or not available.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const predictedCategory = await submitComplaintText(text);
      setResult({ predicted_category: String(predictedCategory.predicted_category || predictedCategory) });
    } catch (err) {
      setError("Failed to process complaint. Our servers might be busy.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl border-2 border-gs-border bg-gs-surface p-6 shadow-[8px_8px_0px_rgba(51,65,85,1)] transition-all">
      <div className="flex items-center gap-4 mb-8 border-b border-gs-border pb-4">
        <button
          onClick={() => setInputType("text")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
            inputType === "text"
              ? "bg-gs-primary text-gs-bg"
              : "text-gs-text-muted hover:text-gs-text hover:bg-gs-surface-hover"
          )}
        >
          <Type size={18} /> Text
        </button>
        <button
          onClick={() => setInputType("voice")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
            inputType === "voice"
              ? "bg-gs-primary text-gs-bg"
              : "text-gs-text-muted hover:text-gs-text hover:bg-gs-surface-hover"
          )}
        >
          <Mic size={18} /> Voice
        </button>
      </div>

      <AnimatePresence mode="wait">
        {inputType === "text" ? (
          <motion.form
            key="text-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleTextSubmit}
            className="flex flex-col gap-4"
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Describe your issue or request in detail..."
              className="w-full h-32 p-4 rounded-xl border-2 border-gs-border bg-gs-bg text-gs-text placeholder:text-gs-text-muted focus:border-gs-primary focus:outline-none focus:ring-4 focus:ring-gs-primary/20 resize-none transition-all"
            />
            <button
              disabled={isLoading || !text.trim()}
              className="self-end flex items-center gap-2 bg-gs-primary hover:bg-gs-primary-hover text-gs-bg px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-transparent hover:border-gs-bg shadow-[4px_4px_0px_rgba(255,255,255,0.1)] active:translate-y-1 active:shadow-none"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              Submit Complaint
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="voice-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center py-8 gap-6"
          >
            <div className="relative">
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1.2 }}
                  transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
                  className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"
                />
              )}
              <button
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                disabled={isLoading}
                className={cn(
                  "relative z-10 flex items-center justify-center w-24 h-24 rounded-full border-4 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)]",
                  isRecording
                    ? "border-red-500 bg-red-500/10 text-red-500 hover:bg-red-500/20"
                    : "border-gs-primary bg-gs-primary/10 text-gs-primary hover:bg-gs-primary/20",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={40} />
                ) : isRecording ? (
                  <Square size={32} className="fill-current" />
                ) : (
                  <Mic size={40} />
                )}
              </button>
            </div>
            
            <p className="text-lg font-medium text-gs-text-muted">
              {isLoading
                ? "Analyzing audio..."
                : isRecording
                ? "Recording... Tap to stop"
                : "Tap microphone to dictate complaint"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 flex items-start gap-3 p-4 bg-red-500/10 border-2 border-red-500/50 rounded-xl text-red-400"
          >
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <p>{error}</p>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 flex flex-col gap-3 p-5 bg-gs-primary/10 border-2 border-gs-primary/50 rounded-xl overflow-hidden"
          >
            <div className="flex items-center gap-3 text-gs-primary">
              <CheckCircle2 className="shrink-0" size={24} />
              <h3 className="font-bold text-lg">Analysis Complete</h3>
            </div>
            {result.transcribed_text && (
              <div className="bg-gs-bg/50 p-3 rounded-lg border border-gs-border/50 text-sm text-gs-text-muted italic">
                "{result.transcribed_text}"
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-gs-text-muted">Predicted Category:</span>
              <span className="bg-gs-primary text-gs-bg px-3 py-1 rounded-md font-bold text-sm">
                {result.predicted_category || "Unknown"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
