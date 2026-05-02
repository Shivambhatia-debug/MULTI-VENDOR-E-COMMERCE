"use client";

import { useState, useEffect } from "react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, Cell
} from "recharts";
import { 
    Activity, TrendingUp, Users, DollarSign, 
    ArrowUpRight, ArrowDownRight, Loader2, Globe
} from "lucide-react";

export default function AdminAnalyticsPage() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("golalita_token");
                const headers = { "Authorization": `Bearer ${token}` };
                
                // For now reuse stats but we can expand this
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

    // Mock trajectory for admin
    const trajectory = [
        { month: "Jan", revenue: 120000, merchants: 800 },
        { month: "Feb", revenue: 150000, merchants: 920 },
        { month: "Mar", revenue: 180000, merchants: 1050 },
        { month: "Apr", revenue: 220000, merchants: 1180 },
        { month: "May", revenue: 280000, merchants: 1248 },
        { month: "Jun", revenue: 340000, merchants: 1400 },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tighter italic">Platform Analytics</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60">Macro-economic ecosystem performance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats?.map((s: any, i: number) => (
                    <div key={i} className="card-saas p-6 bg-white shadow-lg">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{s.label}</p>
                        <p className="text-2xl font-black text-slate-950 tracking-tighter">{s.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card-saas p-8 bg-white shadow-2xl border-slate-100">
                    <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em] mb-8 italic">Revenue Velocity</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trajectory}>
                                <defs>
                                    <linearGradient id="colorAdminRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900}} tickFormatter={(v) => `${v/1000}K`} />
                                <Tooltip />
                                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorAdminRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card-saas p-8 bg-white shadow-2xl border-slate-100">
                    <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em] mb-8 italic">Merchant Acquisition</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trajectory}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900}} />
                                <Tooltip />
                                <Bar dataKey="merchants" radius={[10, 10, 0, 0]}>
                                    {trajectory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === trajectory.length - 1 ? '#0f172a' : '#e2e8f0'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
