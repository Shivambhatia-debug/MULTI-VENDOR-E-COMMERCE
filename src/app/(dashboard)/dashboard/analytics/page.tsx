"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import {
    BarChart3, TrendingUp, Users, ShoppingCart, DollarSign,
    ArrowUpRight, ArrowDownRight, Calendar, Download,
    PieChart, ChevronDown, Sparkles, ArrowRight
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, Cell, PieChart as RePieChart, Pie
} from "recharts";

export default function AnalyticsPage() {
    const [stats, setStats] = useState<any[]>([]);
    const [analytics, setAnalytics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("golalita_token");
                const [statsRes, analyticsRes] = await Promise.all([
                    fetch("/api/python/dashboard/stats", { headers: { "Authorization": `Bearer ${token}` } }),
                    fetch("/api/python/dashboard/analytics", { headers: { "Authorization": `Bearer ${token}` } })
                ]);

                if (statsRes.ok) setStats(await statsRes.json());
                if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
            } catch (err) {
                console.error("FETCH_ERROR:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const performanceMatrices = [
        { label: "Gross Liquidity", value: stats.find(s => s.label === "Total Sales")?.value || "0 QAR", change: "+12.4%", trend: "up", icon: DollarSign, color: "text-slate-950", bg: "bg-slate-950 text-white" },
        { label: "Entity Orders", value: stats.find(s => s.label === "Total Orders")?.value || "0", change: "+8.2%", trend: "up", icon: ShoppingCart, color: "text-emerald-600", bg: "bg-white" },
        { label: "New Acquisitions", value: stats.find(s => s.label === "New Customers")?.value || "0", change: "+5.1%", trend: "up", icon: Users, color: "text-indigo-600", bg: "bg-white" },
        { label: "Active Protocol", value: stats.find(s => s.label === "Active Products")?.value || "0", change: "-2.4%", trend: "down", icon: TrendingUp, color: "text-rose-600", bg: "bg-white" },
    ];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-950 border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
                    <p className="text-sm font-black text-white">QAR {(payload[0].value / 1000).toFixed(1)}K</p>
                    <p className="text-[9px] font-bold text-emerald-400 uppercase mt-1">↑ 12.4% Growth</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
            <Sidebar />

            <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 lg:mb-12">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-950 uppercase tracking-tighter">Growth Analytics</h1>
                        <p className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">Intelligence & Performance Metrics</p>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        <button className="flex-1 md:flex-none px-4 md:px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[9px] md:text-[10px] font-black text-slate-950 uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-sm">
                            <Calendar size={14} className="text-slate-400" />
                            Temporal Window
                            <ChevronDown size={12} className="text-slate-400" />
                        </button>
                        <button className="flex-1 md:flex-none px-6 md:px-8 py-3 bg-slate-950 text-white rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-900 transition-all shadow-xl active:scale-95">
                            <Download size={14} />
                            Export Dataset
                        </button>
                    </div>
                </div>

                {/* Performance Matrices */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8 lg:mb-12">
                    {performanceMatrices.map((m) => (
                        <div key={m.label} className={`card-saas p-6 md:p-8 flex flex-col justify-between h-36 md:h-40 group transition-all duration-300 ${m.bg === 'bg-slate-950 text-white' ? 'bg-slate-950 text-white border-transparent shadow-2xl scale-[1.02]' : 'hover:border-slate-300 bg-white shadow-lg'}`}>
                            <div className="flex justify-between items-start">
                                <div className={`p-2 rounded-xl border border-white/10 ${m.bg === 'bg-slate-950 text-white' ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-950 group-hover:text-white transition-all duration-500'}`}>
                                    <m.icon size={18} />
                                </div>
                                <div className={`flex items-center gap-1.5 text-[9px] font-black px-2 py-1 rounded-full border ${m.trend === 'up' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                                    {m.trend === 'up' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                    {m.change}
                                </div>
                            </div>
                            <div>
                                <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] mb-1.5 opacity-60 italic">{m.label}</p>
                                <p className="text-xl md:text-2xl font-black tracking-tighter leading-none">{isLoading ? "..." : m.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Analytical Visualizations */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Trajectory (Large) */}
                    <div className="lg:col-span-2 card-saas p-6 md:p-8 lg:p-10 bg-white shadow-xl border-slate-100">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 lg:mb-12">
                            <div>
                                <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.3em] italic">Revenue Trajectory</h3>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 opacity-60">Temporal sales distribution & forecasting</p>
                            </div>
                            <div className="flex gap-4 md:gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-slate-950" />
                                    <span className="text-[8px] md:text-[9px] font-black text-slate-950 uppercase tracking-widest">Revenue</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-slate-200" />
                                    <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Growth</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="h-64 md:h-80 w-full">
                            {analytics && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={analytics.trajectory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#020617" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#020617" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis 
                                            dataKey="month" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} 
                                            dy={10}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} 
                                            tickFormatter={(val) => `${val/1000}K`}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area 
                                            type="monotone" 
                                            dataKey="revenue" 
                                            stroke="#020617" 
                                            strokeWidth={4}
                                            fillOpacity={1} 
                                            fill="url(#colorRevenue)" 
                                            animationDuration={2000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Channel Intelligence */}
                    <div className="card-saas p-6 md:p-8 lg:p-10 flex flex-col bg-white shadow-xl border-slate-100">
                        <div>
                            <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.3em] italic">Channel Intelligence</h3>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 opacity-60">Source attribution matrix</p>
                        </div>
                        
                        <div className="flex-1 flex flex-col items-center justify-center relative py-8 md:py-12">
                            <div className="h-48 md:h-56 w-full relative flex items-center justify-center">
                                {analytics && (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie
                                                data={analytics.channels}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={8}
                                                dataKey="raw"
                                                animationDuration={1500}
                                            >
                                                {analytics.channels.map((entry: any, index: number) => (
                                                    <Cell 
                                                        key={`cell-${index}`} 
                                                        fill={[ '#020617', '#64748b', '#cbd5e1', '#f1f5f9' ][index % 4]} 
                                                        stroke="none"
                                                    />
                                                ))}
                                            </Pie>
                                        </RePieChart>
                                    </ResponsiveContainer>
                                )}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <p className="text-2xl md:text-3xl font-black text-slate-950 tracking-tighter">
                                        {analytics?.channels?.[0]?.value.replace('%', '') || "0"}
                                        <span className="text-sm">%</span>
                                    </p>
                                    <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        {analytics?.channels?.[0]?.label || "Primary"}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 md:mt-12 w-full space-y-3">
                                {analytics?.channels.map((item: any, idx: number) => (
                                    <div key={item.label} className="flex justify-between items-center group cursor-default">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${[ 'bg-slate-950', 'bg-slate-500', 'bg-slate-300', 'bg-slate-100' ][idx % 4]}`} />
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-950 transition-colors">{item.label}</span>
                                        </div>
                                        <span className="text-[9px] font-black text-slate-950 italic">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button className="mt-6 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-950 transition-colors flex items-center gap-2 justify-center group">
                            Deep Attribution Report <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

