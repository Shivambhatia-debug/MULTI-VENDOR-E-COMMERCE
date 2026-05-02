"use client";

import { useState, useEffect } from "react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie
} from "recharts";
import { 
    Activity, TrendingUp, Users, DollarSign, 
    ArrowUpRight, ArrowDownRight, Loader2, Globe,
    Wallet, ShieldCheck, Zap, Sparkles
} from "lucide-react";

export default function AdminAnalyticsPage() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("golalita_token");
                const headers = { "Authorization": `Bearer ${token}` };
                const res = await fetch("/api/python/admin/stats", { headers });
                if (res.ok) setStats(await res.json());
            } catch (err) {
                console.error("ANALYTICS_FETCH_ERROR:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const trajectory = [
        { month: "Jan", revenue: 120000, fee: 18000, payout: 102000 },
        { month: "Feb", revenue: 150000, fee: 22500, payout: 127500 },
        { month: "Mar", revenue: 180000, fee: 27000, payout: 153000 },
        { month: "Apr", revenue: 220000, fee: 33000, payout: 187000 },
        { month: "May", revenue: 280000, fee: 42000, payout: 238000 },
        { month: "Jun", revenue: 340000, fee: 51000, payout: 289000 },
    ];

    const planDistribution = [
        { name: 'Basic', value: 45, color: '#94a3b8' },
        { name: 'Premium', value: 30, color: '#3b82f6' },
        { name: 'Mobile App', value: 25, color: '#4f46e5' },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-950 uppercase tracking-tighter italic leading-none">Financial Intelligence</h1>
                    <p className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-widest opacity-60">Macro-economic ecosystem performance & yield</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                    <span className="text-[10px] font-black uppercase tracking-widest px-4 text-slate-400">Timeframe</span>
                    <div className="flex bg-slate-50 p-1 rounded-xl">
                        {['7D', '30D', '1Y', 'ALL'].map(t => (
                            <button key={t} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${t === '30D' ? 'bg-slate-950 text-white shadow-lg' : 'text-slate-400 hover:text-slate-950'}`}>{t}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Core Yield Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card-saas p-8 bg-white shadow-xl relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wallet size={64} className="text-slate-950" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Gross Platform Volume</p>
                    <p className="text-3xl font-black text-slate-950 tracking-tighter italic">4.2M <span className="text-[12px] font-bold text-slate-300 ml-1">QAR</span></p>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">+18.4%</span>
                        <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">VS Last Month</span>
                    </div>
                </div>

                <div className="card-saas p-8 bg-slate-950 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10">
                        <TrendingUp size={64} className="text-white" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Net Platform Revenue</p>
                    <p className="text-3xl font-black text-white tracking-tighter italic">648K <span className="text-[12px] font-bold text-slate-600 ml-1">QAR</span></p>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-[9px] font-black text-blue-400 bg-white/5 px-2 py-0.5 rounded-full">+12.1%</span>
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest italic">Take Rate: 15.4%</span>
                    </div>
                </div>

                <div className="card-saas p-8 bg-white shadow-xl relative overflow-hidden">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Active Merchants</p>
                    <p className="text-3xl font-black text-slate-950 tracking-tighter italic">1,248 <span className="text-[12px] font-bold text-slate-300 ml-1">NODES</span></p>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">+42</span>
                        <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">New Entities</span>
                    </div>
                </div>

                <div className="card-saas p-8 bg-white shadow-xl relative overflow-hidden">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Yield per Merchant</p>
                    <p className="text-3xl font-black text-slate-950 tracking-tighter italic">519 <span className="text-[12px] font-bold text-slate-300 ml-1">QAR</span></p>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-[9px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">-2.4%</span>
                        <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Efficiency Dip</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Velocity Chart */}
                <div className="lg:col-span-2 card-saas p-10 bg-white shadow-2xl border-slate-100">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.3em] italic">Revenue Velocity Profile</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Platform Settlement History</p>
                        </div>
                        <div className="flex gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-600" />
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Platform Fee</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-slate-200" />
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Merchant Payout</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-96 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trajectory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorFee" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#94a3b8'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#94a3b8'}} tickFormatter={(v) => `${v/1000}K`} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="payout" stackId="1" stroke="#e2e8f0" strokeWidth={2} fill="#f8fafc" />
                                <Area type="monotone" dataKey="fee" stackId="1" stroke="#2563eb" strokeWidth={4} fill="url(#colorFee)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sub Yield Distribution */}
                <div className="card-saas p-10 bg-white shadow-2xl border-slate-100 flex flex-col">
                    <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.3em] mb-12 italic">Tier Saturation</h3>
                    <div className="h-64 w-full relative mb-12">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={planDistribution}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {planDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <p className="text-[20px] font-black text-slate-950 tracking-tighter leading-none italic">84%</p>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Retention</p>
                        </div>
                    </div>
                    <div className="space-y-6 mt-auto">
                        {planDistribution.map((plan, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: plan.color }} />
                                    <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest">{plan.name}</span>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 italic">{plan.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Protocol Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card-saas p-8 bg-blue-50 border-blue-100 group relative overflow-hidden">
                    <Zap className="text-blue-600 mb-6 group-hover:scale-125 transition-transform duration-500" size={24} />
                    <h4 className="text-[11px] font-black text-blue-900 uppercase tracking-widest mb-3">Acceleration Alert</h4>
                    <p className="text-[10px] text-blue-700 leading-relaxed font-bold">
                        Mobile App tier adoption is up <span className="text-blue-950">400%</span> since last cycle. Consider introducing a "Mobile Ultra" protocol.
                    </p>
                </div>

                <div className="card-saas p-8 bg-emerald-50 border-emerald-100 group relative overflow-hidden">
                    <ShieldCheck className="text-emerald-600 mb-6 group-hover:scale-125 transition-transform duration-500" size={24} />
                    <h4 className="text-[11px] font-black text-emerald-900 uppercase tracking-widest mb-3">Compliance Secure</h4>
                    <p className="text-[10px] text-emerald-700 leading-relaxed font-bold">
                        KYC verification velocity has increased. <span className="text-emerald-950">99.8%</span> of merchants are operating within legal framework.
                    </p>
                </div>

                <div className="card-saas p-8 bg-slate-950 text-white shadow-2xl group relative overflow-hidden">
                     <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <Sparkles className="text-blue-400 mb-6" size={24} />
                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-3">Macro Strategy</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                        Platform net yield is projected to hit <span className="text-white">1M QAR</span> by Q4. Expansion to regional nodes is recommended.
                    </p>
                </div>
            </div>
        </div>
    );
}
