"use client";

import { motion } from "framer-motion";
import { Mic, FileText, Activity, LogOut, PieChart as PieChartIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VillagerDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem("userRole");
    if (role !== "villager") {
      router.push("/");
    }
  }, [router]);

  if (!mounted) return null;

  return (
    <main className="flex-1 overflow-hidden relative min-h-screen pb-10">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gs-primary/20 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Header */}
      <nav className="w-full p-6 flex justify-between items-center relative z-10 border-b border-gs-border bg-gs-bg/50 backdrop-blur-md">
        <h1 className="text-2xl font-black tracking-tight text-white">Gram<span className="text-gs-primary">Sevak</span></h1>
        <div className="flex items-center gap-6">
          <Link href="/analytics" className="flex items-center gap-2 text-gs-text-muted hover:text-white transition-colors font-medium">
            <PieChartIcon size={18} /> Analytics
          </Link>
          <button 
            onClick={() => { localStorage.removeItem("userRole"); router.push("/"); }}
            className="flex items-center gap-2 text-gs-text-muted hover:text-red-400 transition-colors font-medium"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">Welcome, Villager!</h2>
          <p className="text-gs-text-muted text-lg">How can the Gram Panchayat assist you today?</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
        >
          <Link href="/villager/text-complaint" className="group p-8 rounded-2xl bg-gs-surface border border-gs-border hover:border-gs-primary transition-all flex flex-col items-center text-center hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] active:scale-95">
            <div className="w-16 h-16 rounded-full bg-gs-primary/10 flex items-center justify-center text-gs-primary mb-6 group-hover:scale-110 transition-transform">
              <FileText size={32} />
            </div>
            <h3 className="font-bold text-xl mb-2">Text Complaint</h3>
            <p className="text-gs-text-muted text-sm">Write down your issue in detail.</p>
          </Link>

          <Link href="/villager/voice-complaint" className="group p-8 rounded-2xl bg-gs-surface border border-gs-border hover:border-gs-accent transition-all flex flex-col items-center text-center hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] active:scale-95">
            <div className="w-16 h-16 rounded-full bg-gs-accent/10 flex items-center justify-center text-gs-accent mb-6 group-hover:scale-110 transition-transform">
              <Mic size={32} />
            </div>
            <h3 className="font-bold text-xl mb-2">Voice Complaint</h3>
            <p className="text-gs-text-muted text-sm">Record audio for rapid AI transcription.</p>
          </Link>

          <Link href="/villager/status" className="group p-8 rounded-2xl bg-gs-surface border border-gs-border hover:border-blue-500 transition-all flex flex-col items-center text-center hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] active:scale-95">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
              <Activity size={32} />
            </div>
            <h3 className="font-bold text-xl mb-2">Check Status</h3>
            <p className="text-gs-text-muted text-sm">Track the progress of your requests.</p>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
