"use client";

import { useState, useEffect } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import {
    BarChart3,
    TrendingUp,
    Users,
    ShoppingCart,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Download,
    PieChart,
    ChevronDown,
    Sparkles,
    ArrowRight
} from "lucide-react";

export default function AnalyticsPage() {
    const [stats, setStats] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("golalita_token");
                const response = await fetch("/api/python/dashboard/stats", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (err) {
                console.error("FETCH_STATS_ERROR:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Map stats to display format
    const performanceMatrices = [
        { label: "Gross Liquidity", value: stats.find(s => s.label === "Total Sales")?.value || "0 QAR", change: "+0%", trend: "up", icon: DollarSign, color: "text-slate-950", bg: "bg-slate-950 text-white" },
        { label: "Entity Orders", value: stats.find(s => s.label === "Total Orders")?.value || "0", change: "+0%", trend: "up", icon: ShoppingCart, color: "text-emerald-600", bg: "bg-white border border-slate-100" },
        { label: "New Acquisitions", value: stats.find(s => s.label === "New Customers")?.value || "0", change: "+0%", trend: "up", icon: Users, color: "text-indigo-600", bg: "bg-white border border-slate-100" },
        { label: "Active Protocol", value: stats.find(s => s.label === "Active Products")?.value || "0", change: "+0%", trend: "up", icon: TrendingUp, color: "text-rose-600", bg: "bg-white border border-slate-100" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />

            <main className="flex-1 p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                    <div>
                        <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tighter">Growth Analytics</h1>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">Intelligence & Performance Metrics</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-slate-950 uppercase tracking-widest flex items-center gap-3 hover:bg-slate-50 transition-all shadow-sm">
                            <Calendar size={16} className="text-slate-400" />
                            Temporal Window
                            <ChevronDown size={14} className="text-slate-400" />
                        </button>
                        <button className="px-8 py-3.5 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-900 transition-all shadow-xl active:scale-95">
                            <Download size={16} />
                            Export Dataset
                        </button>
                    </div>
                </div>

                {/* Performance Matrices */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                    {performanceMatrices.map((m) => (
                        <div key={m.label} className={`card-saas p-8 flex flex-col justify-between h-40 group ${m.bg === 'bg-slate-950 text-white' ? 'bg-slate-950 text-white border-transparent shadow-2xl' : 'hover:border-slate-400 shadow-xl'}`}>
                            <div className="flex justify-between items-start">
                                <div className={`p-2.5 rounded-xl border border-white/10 ${m.bg === 'bg-slate-950 text-white' ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-950 group-hover:text-white transition-all duration-500'}`}>
                                    <m.icon size={20} />
                                </div>
                                <div className={`flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1.5 rounded-full border ${m.trend === 'up' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                    {m.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                    {m.change}
                                </div>
                            </div>
                            <div>
                                <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-2 ${m.bg === 'bg-slate-950 text-white' ? 'text-slate-400' : 'text-slate-400'}`}>{m.label}</p>
                                <p className="text-2xl font-black tracking-tighter leading-none">{isLoading ? "..." : m.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Analytical Visualizations */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Trajectory (Large) */}
                    <div className="lg:col-span-2 card-saas p-10 shadow-2xl border-slate-100/50">
                        <div className="flex justify-between items-center mb-12">
                            <div>
                                <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.3em] italic">Revenue Trajectory</h3>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 opacity-60">Temporal sales distribution & forecasting</p>
                            </div>
                            <div className="flex gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
                                    <span className="text-[9px] font-black text-slate-950 uppercase tracking-widest">Revenue Alpha</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-slate-200" />
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Order Volume</span>
                                </div>
                            </div>
                        </div>
                        {/* High Fidelity Mock Chart */}
                        <div className="h-72 flex items-end gap-4 px-4">
                            {[45, 60, 40, 85, 70, 95, 110, 80, 120, 100, 140, 130].map((val, i) => (
                                <div key={i} className="flex-1 group relative">
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[9px] font-black px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-xl pointer-events-none z-20">
                                        QAR {val}K
                                    </div>
                                    <div
                                        className="w-full bg-slate-950 opacity-5 rounded-t-2xl group-hover:opacity-100 transition-all cursor-pointer border-t border-slate-950/20"
                                        style={{ height: `${val}%` }}
                                    />
                                    <div className="mt-4 text-center">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">PER-{i + 1}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Channel Intelligence */}
                    <div className="card-saas p-10 flex flex-col shadow-2xl border-slate-100/50">
                        <div>
                            <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.3em] italic">Channel Intelligence</h3>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 opacity-60">Source attribution matrix</p>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center relative py-12">
                            {/* Minimalist Donut Representation */}
                            <div className="w-48 h-48 rounded-[3rem] border-[12px] border-slate-50 relative flex items-center justify-center group">
                                <div className="absolute inset-0 rounded-[3rem] border-[12px] border-slate-950 border-l-transparent border-b-transparent rotate-12 transition-transform duration-1000 group-hover:rotate-45" />
                                <div className="text-center relative z-10">
                                    <p className="text-3xl font-black text-slate-950 tracking-tighter">72<span className="text-sm">%</span></p>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Native App</p>
                                </div>
                            </div>
                            <div className="mt-16 w-full space-y-4">
                                {[
                                    { label: "Native iOS / Android", value: "72.4%", color: "bg-slate-950" },
                                    { label: "Noir Web Portal", value: "18.2%", color: "bg-slate-400" },
                                    { label: "Global Marketplace", value: "9.4%", color: "bg-slate-100" },
                                ].map((item) => (
                                    <div key={item.label} className="flex justify-between items-center group cursor-default">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-2.5 h-2.5 rounded-full ${item.color} group-hover:scale-125 transition-transform`} />
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-950 transition-colors">{item.label}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-950 italic">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button className="mt-8 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-950 transition-colors flex items-center gap-2 justify-center group">
                            Deep Attribution Report <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
