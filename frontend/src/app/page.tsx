"use client";

import { motion } from "framer-motion";
import { User, ShieldUser } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RoleSelectionPage() {
  const router = useRouter();

  const selectRole = (role: "villager" | "admin") => {
    localStorage.setItem("userRole", role);
    router.push(`/${role}/dashboard`);
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gs-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gs-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl flex flex-col items-center relative z-10"
      >
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-center">Gram Complaint Management</h1>
        <p className="text-gs-text-muted mb-12 text-center text-lg">Select your portal to continue.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <button
            onClick={() => selectRole("villager")}
            className="group flex flex-col items-center justify-center gap-4 p-10 bg-gs-surface border-2 border-gs-border rounded-2xl hover:border-gs-primary transition-all hover:shadow-[0_0_50px_rgba(16,185,129,0.15)] active:scale-95 text-left"
          >
            <div className="w-20 h-20 rounded-full bg-gs-primary/10 text-gs-primary flex items-center justify-center group-hover:bg-gs-primary group-hover:text-gs-bg transition-colors">
              <User size={40} />
            </div>
            <div className="text-center mt-2">
              <h2 className="text-2xl font-bold mb-2">Villager</h2>
              <p className="text-gs-text-muted text-sm leading-relaxed">File complaints, record voice requests, and track resolution status.</p>
            </div>
          </button>

          <button
            onClick={() => selectRole("admin")}
            className="group flex flex-col items-center justify-center gap-4 p-10 bg-gs-surface border-2 border-gs-border rounded-2xl hover:border-gs-accent transition-all hover:shadow-[0_0_50px_rgba(245,158,11,0.15)] active:scale-95 text-left"
          >
            <div className="w-20 h-20 rounded-full bg-gs-accent/10 text-gs-accent flex items-center justify-center group-hover:bg-gs-accent group-hover:text-gs-bg transition-colors">
              <ShieldUser size={40} />
            </div>
            <div className="text-center mt-2">
              <h2 className="text-2xl font-bold mb-2">Gram Sevak</h2>
              <p className="text-gs-text-muted text-sm leading-relaxed">Manage issues, update request statuses, and monitor AI triaging.</p>
            </div>
          </button>
        </div>
      </motion.div>
    </main>
  );
}
