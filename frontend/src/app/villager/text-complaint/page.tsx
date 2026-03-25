"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TextComplaintPage() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "text", text }),
      });
      const data = await res.json();
      
      if (res.ok) {
        router.push(`/villager/confirmation?id=${encodeURIComponent(data.id)}&category=${encodeURIComponent(data.category)}&dept=${encodeURIComponent(data.department)}`);
      } else {
        alert(data.error || "Failed to submit grievance.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col p-6 relative">
      <div className="max-w-3xl w-full mx-auto relative z-10 pt-10">
        <Link href="/villager/dashboard" className="inline-flex items-center gap-2 text-gs-text-muted hover:text-gs-primary transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-black mb-4">Register Written Complaint</h1>
          <p className="text-gs-text-muted mb-8">Describe your issue in detail. Our AI will automatically categorize it and route it to the correct department.</p>

          <form onSubmit={handleTextSubmit} className="flex flex-col gap-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., The street light near the panchayat office has been broken for 3 days..."
              className="w-full h-48 p-5 rounded-2xl border-2 border-gs-border bg-gs-surface text-gs-text placeholder:text-gs-text-muted focus:border-gs-primary focus:outline-none focus:ring-4 focus:ring-gs-primary/20 resize-none transition-all text-lg"
              disabled={isLoading}
            />
            
            <button
              disabled={isLoading || !text.trim()}
              className="self-end flex items-center gap-2 bg-gs-primary hover:bg-gs-primary-hover text-gs-bg px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-transparent hover:border-gs-bg shadow-[4px_4px_0px_rgba(255,255,255,0.1)] active:translate-y-1 active:shadow-none text-lg mt-4"
            >
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
              Submit to Gram Panchayat
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
