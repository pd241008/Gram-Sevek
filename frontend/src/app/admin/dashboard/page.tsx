"use client";

import { motion } from "framer-motion";
import { LogOut, Eye, Filter, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Complaint } from "@/lib/db";

export default function AdminDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem("userRole");
    if (role !== "admin") {
      router.push("/");
    } else {
      fetchComplaints();
    }
  }, [router]);

  const fetchComplaints = async () => {
    try {
      const res = await fetch("/api/complaints");
      const data = await res.json();
      setComplaints(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  const filteredComplaints = complaints.filter(c => statusFilter === "All" || c.status === statusFilter);

  const statusColors: Record<string, string> = {
    "Pending": "text-amber-500 bg-amber-500/10 border-amber-500/20",
    "In Progress": "text-blue-500 bg-blue-500/10 border-blue-500/20",
    "Resolved": "text-gs-primary bg-gs-primary/10 border-gs-primary/20",
  };

  return (
    <main className="flex-1 overflow-auto relative min-h-screen bg-gs-bg pb-10">
      {/* Header */}
      <nav className="w-full p-6 flex justify-between items-center relative z-10 border-b border-gs-border bg-gs-surface sticky top-0">
        <h1 className="text-2xl font-black tracking-tight text-gs-accent">Gram<span className="text-white">Sevak Admin</span></h1>
        <button 
          onClick={() => { localStorage.removeItem("userRole"); router.push("/"); }}
          className="flex items-center gap-2 text-gs-text-muted hover:text-red-400 transition-colors"
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-black mb-2">Issue Management</h2>
            <p className="text-gs-text-muted">Review, triaged, and resolve citizen grievances.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-gs-surface p-2 rounded-xl border border-gs-border">
            <Filter size={18} className="text-gs-text-muted ml-2" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-white border-none focus:ring-0 outline-none text-sm pr-4 font-bold cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-20">
            <Loader2 className="animate-spin text-gs-accent" size={48} />
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center p-20 bg-gs-surface border border-gs-border rounded-2xl">
            <p className="text-gs-text-muted text-lg">No complaints found matching this criteria.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto rounded-2xl border border-gs-border bg-gs-surface shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gs-border bg-gs-bg/50 text-gs-text-muted text-sm uppercase tracking-wider">
                  <th className="p-5 font-bold">Grievance ID</th>
                  <th className="p-5 font-bold">Category</th>
                  <th className="p-5 font-bold">Department</th>
                  <th className="p-5 font-bold">Date</th>
                  <th className="p-5 font-bold">Status</th>
                  <th className="p-5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gs-border">
                {filteredComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-gs-surface-hover transition-colors">
                    <td className="p-5 font-mono font-bold">{c.id}</td>
                    <td className="p-5 font-medium">{c.category}</td>
                    <td className="p-5 text-gs-text-muted max-w-xs truncate">{c.department}</td>
                    <td className="p-5 text-sm text-gs-text-muted">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <Link href={`/admin/complaints/${c.id}`} className="inline-flex items-center gap-2 text-gs-accent hover:text-white transition-colors text-sm font-bold bg-gs-accent/10 px-4 py-2 rounded-lg">
                        <Eye size={16} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
