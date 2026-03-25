"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Type, UserCheck, Activity } from "lucide-react";

export function LandingPage() {
  return (
    <main className="flex-1 overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gs-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gs-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32 relative z-10 flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gs-primary/30 bg-gs-primary/10 text-gs-primary text-sm font-semibold mb-6">
            <ShieldCheck size={16} /> Gram Sevak Beta
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
            Governance, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gs-primary to-emerald-300">
              Powered by AI.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gs-text-muted leading-relaxed">
            Empowering citizens by instantly categorizing and routing complaints using cutting-edge text and voice intelligence. Speak up or write down—we handle the rest.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full relative flex justify-center mt-4"
        >
          <a href="/submit" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gs-primary text-gs-bg text-lg font-bold rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(16,185,129,0.4)]">
            <span className="relative z-10">File a Complaint</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right relative z-10 group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full max-w-5xl"
        >
          {[
            { icon: Type, title: "Text Analysis", desc: "NLP-powered categorization of written issues." },
            { icon: Activity, title: "Voice Precision", desc: "Whisper AI integration for accurate transcription." },
            { icon: UserCheck, title: "Seamless Routing", desc: "Automated triaging to the right department." },
          ].map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-6 rounded-2xl bg-gs-surface border border-gs-border hover:border-gs-primary transition-colors">
              <div className="w-12 h-12 rounded-full bg-gs-primary/10 flex items-center justify-center text-gs-primary mb-4">
                <feature.icon size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-gs-text-muted text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
