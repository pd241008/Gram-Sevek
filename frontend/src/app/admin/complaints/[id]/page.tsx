"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Building2, Tag, Loader2, Save, FileText, Calendar } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import { Complaint } from "@/lib/db";

export default function ComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<string>("Pending");

  useEffect(() => {
    fetchComplaint();
  }, [resolvedParams.id]);

  const fetchComplaint = async () => {
    try {
      const res = await fetch(`/api/status?id=${encodeURIComponent(resolvedParams.id)}`);
      const data = await res.json();
      if (res.ok) {
        setComplaint(data);
        setStatus(data.status);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: complaint?.id, status }),
      });
      if (res.ok) {
        alert("Status successfully updated!");
        fetchComplaint(); // Refresh data
      } else {
        alert("Failed to update status.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 size={48} className="animate-spin text-gs-accent" /></div>;
  }

  if (!complaint) {
    return <div className="min-h-screen flex items-center justify-center">Complaint not found.</div>;
  }

  return (
    <main className="min-h-screen flex flex-col p-6 relative bg-gs-bg">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-gs-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto relative z-10 pt-10">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-gs-text-muted hover:text-gs-accent transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black mb-2 font-mono">{complaint.id}</h1>
            <p className="text-gs-text-muted text-lg">AI Generated Grievance Report</p>
          </div>
          
          <div className="bg-gs-surface p-4 rounded-xl border border-gs-border flex flex-col gap-3 min-w-[250px]">
            <label className="text-sm font-bold text-gs-text-muted uppercase tracking-wider">Update Status</label>
            <div className="flex gap-2">
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="flex-1 bg-gs-bg text-white border border-gs-border rounded-lg p-2 outline-none focus:border-gs-accent"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <button 
                onClick={handleStatusUpdate}
                disabled={isSaving || status === complaint.status}
                className="bg-gs-accent hover:bg-amber-400 text-gs-bg px-4 py-2 rounded-lg font-bold disabled:opacity-50 transition-colors"
              >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gs-surface p-6 rounded-2xl border border-gs-border">
            <div className="flex items-center gap-2 text-gs-text-muted mb-2 text-sm uppercase font-semibold tracking-wider">
              <Tag size={16} /> Predicted Category
            </div>
            <p className="font-bold text-2xl mb-1">{complaint.category}</p>
            <span className="text-xs bg-gs-primary/20 text-gs-primary px-2 py-1 rounded font-mono">Confidence: High</span>
          </div>
          
          <div className="bg-gs-surface p-6 rounded-2xl border border-gs-border">
            <div className="flex items-center gap-2 text-gs-text-muted mb-2 text-sm uppercase font-semibold tracking-wider">
              <Building2 size={16} /> Auto-Assigned Department
            </div>
            <p className="font-bold text-xl">{complaint.department}</p>
          </div>
        </div>

        <div className="bg-gs-surface p-8 rounded-2xl border border-gs-border shadow-xl">
           <div className="flex items-center gap-2 text-gs-text-muted mb-6 text-sm uppercase font-semibold tracking-wider">
              <FileText size={16} /> Input Source ({complaint.type})
            </div>
            <p className="text-xl text-white font-medium leading-relaxed mb-8 italic relative">
              <span className="text-4xl absolute -top-4 -left-4 text-gs-border opacity-50">"</span>
              {complaint.content}
              <span className="text-4xl absolute -bottom-6 text-gs-border opacity-50">"</span>
            </p>
            
            <div className="flex items-center gap-2 text-gs-text-muted text-sm pt-6 border-t border-gs-border mt-auto">
              <Calendar size={14} /> Logged on {new Date(complaint.createdAt).toLocaleString()}
            </div>
        </div>
      </div>
    </main>
  );
}
