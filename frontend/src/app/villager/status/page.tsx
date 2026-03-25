"use client";

import { motion } from "framer-motion";
import { Search, ArrowLeft, Loader2, CheckCircle, Clock, AlertCircle, Building2, Tag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type ComplaintStatus = "Pending" | "In Progress" | "Resolved";
interface ComplaintData {
  id: string;
  type: string;
  content: string;
  category: string;
  department: string;
  status: ComplaintStatus;
  createdAt: string;
}

export default function StatusPage() {
  const [complaintId, setComplaintId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ComplaintData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintId.trim()) return;
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/status?id=${encodeURIComponent(complaintId)}`);
      if (res.ok) {
        setData(await res.json());
      } else {
        setError("Grievance ID not found. Please verify the 8-character ID (e.g., GS-123456).");
      }
    } catch {
      setError("System error while fetching status.");
    } finally {
      setIsLoading(false);
    }
  };

  const StatusIcon = ({ status }: { status: ComplaintStatus }) => {
    switch (status) {
      case "Pending":
        return <Clock className="text-amber-500" size={32} />;
      case "In Progress":
        return <Loader2 className="text-blue-500 animate-spin" size={32} />;
      case "Resolved":
        return <CheckCircle className="text-gs-primary" size={32} />;
    }
  };

  const statusColors = {
    "Pending": "text-amber-500 bg-amber-500/10 border-amber-500/20",
    "In Progress": "text-blue-500 bg-blue-500/10 border-blue-500/20",
    "Resolved": "text-gs-primary bg-gs-primary/10 border-gs-primary/20",
  };

  return (
    <main className="min-h-screen flex flex-col p-6 relative">
      <div className="max-w-3xl w-full mx-auto relative z-10 pt-10">
        <Link href="/villager/dashboard" className="inline-flex items-center gap-2 text-gs-text-muted hover:text-blue-400 transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        
        <h1 className="text-4xl font-black mb-4">Track Status</h1>
        <p className="text-gs-text-muted mb-8 text-lg">Enter your unique Complaint ID to check the real-time resolution progress of your issue.</p>

        <form onSubmit={handleSearch} className="flex gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gs-text-muted" size={20} />
            <input
              type="text"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value.toUpperCase())}
              placeholder="e.g. GS-842910"
              className="w-full bg-gs-surface border-2 border-gs-border rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gs-text-muted focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all text-lg font-mono uppercase"
            />
          </div>
          <button 
            disabled={isLoading || !complaintId.trim()}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 rounded-xl font-bold transition-all border-2 border-transparent hover:border-white shadow-[4px_4px_0px_rgba(255,255,255,0.1)] active:translate-y-1 active:shadow-none disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Search"}
          </button>
        </form>

        {error && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 flex items-center gap-3">
            <AlertCircle size={20} /> {error}
          </motion.div>
        )}

        {data && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gs-surface border-2 border-gs-border rounded-2xl p-8 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-8 border-b border-gs-border">
              <div>
                <p className="text-gs-text-muted uppercase text-sm font-bold tracking-widest mb-1">Grievance ID</p>
                <h2 className="text-2xl font-mono font-black">{data.id}</h2>
                <p className="text-sm text-gs-text-muted mt-2">Submitted on {new Date(data.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div className={`flex items-center gap-3 px-6 py-3 rounded-full border-2 ${statusColors[data.status]}`}>
                <StatusIcon status={data.status} />
                <span className="font-bold text-lg tracking-wide">{data.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gs-bg p-5 rounded-xl border border-gs-border">
                 <div className="flex items-center gap-2 text-gs-text-muted mb-2 text-sm uppercase font-semibold">
                  <Tag size={16} /> AI Category
                </div>
                <p className="font-bold text-lg">{data.category}</p>
              </div>
              
              <div className="bg-gs-bg p-5 rounded-xl border border-gs-border">
                 <div className="flex items-center gap-2 text-gs-text-muted mb-2 text-sm uppercase font-semibold">
                  <Building2 size={16} /> Department
                </div>
                <p className="font-bold text-lg">{data.department}</p>
              </div>
            </div>

            <div>
              <p className="text-gs-text-muted uppercase text-sm font-bold tracking-widest mb-3">Original Complaint</p>
              <div className="bg-gs-bg p-5 rounded-xl border border-gs-border text-gs-text font-medium leading-relaxed italic">
                "{data.content}"
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
