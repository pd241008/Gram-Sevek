"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Copy, ArrowRight, Building2, Tag, Hash } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "Unknown ID";
  const category = searchParams.get("category") || "General";
  const dept = searchParams.get("dept") || "General Office";
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl bg-gs-surface border-2 border-gs-primary rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.15)]"
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-gs-primary" />
      
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-20 h-20 bg-gs-primary/20 text-gs-primary rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-3xl md:text-4xl font-black mb-4">Registration Successful!</h1>
        <p className="text-gs-text-muted text-lg">Your grievance has been securely logged and analyzed by our AI system.</p>
      </div>

      <div className="bg-gs-bg border border-gs-border rounded-2xl p-6 mb-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gs-text-muted">
            <Hash size={20} /> <span className="font-semibold text-sm uppercase tracking-wider">Complaint ID</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-white tracking-widest">{id}</span>
            <button onClick={copyId} className="p-2 hover:bg-gs-surface rounded-md transition-colors text-gs-primary relative">
              <Copy size={18} />
              {copied && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-2 py-1 rounded font-bold">Copied!</span>}
            </button>
          </div>
        </div>

        <div className="h-[1px] w-full bg-gs-border" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 text-gs-text-muted mb-2 text-sm uppercase font-semibold">
              <Tag size={16} /> AI Category
            </div>
            <p className="font-bold text-lg text-gs-accent">{category}</p>
          </div>
          <div>
             <div className="flex items-center gap-2 text-gs-text-muted mb-2 text-sm uppercase font-semibold">
              <Building2 size={16} /> Assigned Department
            </div>
            <p className="font-bold text-lg text-white">{dept}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Link href="/villager/dashboard" className="inline-flex items-center gap-2 bg-gs-border hover:bg-gs-text text-white hover:text-black px-6 py-3 rounded-xl font-bold transition-all">
          Return to Dashboard <ArrowRight size={18} />
        </Link>
      </div>
    </motion.div>
  );
}

export default function ConfirmationPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Suspense fallback={<div className="text-xl font-bold animate-pulse text-gs-primary">Finalizing Request...</div>}>
        <ConfirmationContent />
      </Suspense>
    </main>
  );
}
