"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Complaint } from "@/lib/db";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

export default function AnalyticsDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem("userRole");
    if (!role) {
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

  // Process Data for Pie Chart (Status Distribution)
  const statusCounts = complaints.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  const COLORS = {
    "Pending": "#f59e0b", // amber-500
    "In Progress": "#3b82f6", // blue-500
    "Resolved": "#10b981", // primary green (tailwind emerald-500 approx)
  };

  // Process Data for Bar Chart (Category Distribution)
  const categoryCounts = complaints.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.entries(categoryCounts).map(([name, count]) => ({ name, count }));

  return (
    <main className="flex-1 overflow-auto relative min-h-screen bg-gs-bg pb-10">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gs-primary/20 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Header */}
      <nav className="w-full p-6 flex justify-between items-center relative z-10 border-b border-gs-border bg-gs-surface sticky top-0 backdrop-blur-md bg-gs-bg/50">
        <h1 className="text-2xl font-black tracking-tight text-white">Gram<span className="text-gs-primary">Analytics</span></h1>
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gs-text-muted hover:text-white transition-colors bg-gs-surface border border-gs-border px-4 py-2 rounded-lg font-bold"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="mb-12">
          <h2 className="text-4xl font-black mb-2">Complaint Statistics</h2>
          <p className="text-gs-text-muted text-lg">Detailed breakdown and analytics of village grievances.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-20">
            <Loader2 className="animate-spin text-gs-primary" size={48} />
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center p-20 bg-gs-surface border border-gs-border rounded-2xl">
            <p className="text-gs-text-muted text-lg">No data available for analytics.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Status Pie Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gs-surface border border-gs-border rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-6 text-center">Status Distribution</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={{ stroke: '#52525b', strokeWidth: 1 }}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || "#8b5cf6"} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Category Bar Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gs-surface border border-gs-border rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-6 text-center">Complaints by Category</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#8b5cf6" 
                      tick={{ fill: '#a1a1aa' }} 
                      tickLine={{ stroke: '#27272a' }}
                      axisLine={{ stroke: '#27272a' }}
                    />
                    <YAxis 
                      stroke="#8b5cf6" 
                      tick={{ fill: '#a1a1aa' }}
                      tickLine={{ stroke: '#27272a' }}
                      axisLine={{ stroke: '#27272a' }}
                      allowDecimals={false}
                    />
                    <RechartsTooltip 
                      cursor={{ fill: '#27272a', opacity: 0.4 }}
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}
