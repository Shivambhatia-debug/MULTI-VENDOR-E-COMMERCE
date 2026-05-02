"use client";

import { useState, useEffect } from "react";
import {
    Users, ArrowUpRight, ArrowDownRight, MoreVertical,
    Search, Filter, DollarSign, Building, Store, CreditCard,
    Plus, Loader2, Sparkles, Activity, ShieldAlert, ChevronRight,
    CheckCircle2, Clock
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any[]>([]);
    const [merchants, setMerchants] = useState<any[]>([]);
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [pendingStores, setPendingStores] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("golalita_token");
                const headers = { "Authorization": `Bearer ${token}` };

                const [statsRes, merchantsRes, subsRes, pendingRes] = await Promise.all([
                    fetch("/api/python/admin/stats", { headers }),
                    fetch("/api/python/admin/merchants", { headers }),
                    fetch("/api/python/admin/subscriptions", { headers }),
                    fetch("/api/python/admin/verification/pending", { headers })
                ]);

                if (statsRes.ok) setStats(await statsRes.json());
                if (merchantsRes.ok) setMerchants(await merchantsRes.json());
                if (subsRes.ok) setSubscriptions(await subsRes.json());
                if (pendingRes.ok) setPendingStores(await pendingRes.json());
            } catch (err) {
                console.error("ADMIN_FETCH_ERROR:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const iconMap: any = {
        DollarSign: DollarSign,
        Building: Building,
        Store: Store,
        CreditCard: CreditCard
    };

    const filteredMerchants = merchants.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
            {/* Glassmorphism Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">System Online • Marketplace Node 01</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-950 uppercase tracking-tighter italic leading-none">Marketplace Oversight</h1>
                    <p className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-widest opacity-60">Global Strategy & Entity Compliance Console</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-slate-950 uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2">
                        <Activity size={16} /> Status
                    </button>
                    <button className="flex-1 md:flex-none px-8 py-4 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl flex items-center justify-center gap-2 active:scale-95">
                        <Plus size={18} /> Invite Merchant
                    </button>
                </div>
            </div>

            {/* Platform Core Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Icon = iconMap[stat.icon] || CreditCard;
                    return (
                        <div key={i} className="card-saas p-8 group relative overflow-hidden bg-white hover:border-slate-400 transition-all">
                            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50" />
                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-slate-950 group-hover:text-white transition-all duration-500 shadow-sm">
                                        <Icon size={22} />
                                    </div>
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 ${stat.change.startsWith("+") ? "text-emerald-500 bg-emerald-50" : "text-rose-500 bg-rose-50"}`}>
                                        {stat.change} {stat.change.startsWith("+") ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                    </span>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                                <p className="text-3xl font-black text-slate-950 tracking-tighter italic">{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Deployment Radar (Left/Top) */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="card-saas bg-white shadow-2xl overflow-hidden border-slate-100">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-xl">
                            <div>
                                <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em] italic">Deployment Radar</h3>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Pending Store Verifications</p>
                            </div>
                            <Link href="/admin/verification" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                                View Full Queue <ChevronRight size={12} />
                            </Link>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {pendingStores.length > 0 ? pendingStores.slice(0, 3).map((store) => (
                                <div key={store.id} className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform">
                                            <Store size={22} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-slate-950 uppercase tracking-widest">{store.store_name}</p>
                                            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter italic">Merchant: {store.merchant_name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="hidden md:block text-right">
                                            <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Awaiting Approval</p>
                                            <p className="text-[8px] text-slate-300 font-bold mt-0.5">REQ ID: #{store.id.slice(-6).toUpperCase()}</p>
                                        </div>
                                        <Link href="/admin/verification" className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-slate-950 hover:text-white transition-all">
                                            <ShieldAlert size={18} />
                                        </Link>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-20 text-center">
                                    <CheckCircle2 className="mx-auto text-emerald-100 mb-4" size={48} />
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">All deployment channels clear</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Merchant Directory */}
                    <div className="card-saas overflow-hidden bg-white shadow-2xl border-slate-100">
                        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                            <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em] italic">Merchant Directory</h3>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                <input
                                    type="text"
                                    placeholder="SEARCH NODES..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-11 pr-4 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-slate-950 transition-all"
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Entity</th>
                                        <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Protocol</th>
                                        <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Revenue</th>
                                        <th className="px-8 py-5 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredMerchants.slice(0, 5).map((m) => (
                                        <tr key={m.id} className="hover:bg-slate-50/50 transition-all group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-950 text-xs">
                                                        {m.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-black text-slate-950 uppercase tracking-tighter">{m.name}</p>
                                                        <p className="text-[9px] text-slate-400 font-bold tracking-widest mt-0.5">{m.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${m.plan === 'Mobile App' ? 'text-indigo-600' : 'text-slate-500'}`}>
                                                    {m.plan}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-xs font-black text-slate-950 italic">{m.revenue}</td>
                                            <td className="px-8 py-6 text-right">
                                                <button className="p-2 text-slate-300 hover:text-slate-950 transition-all"><MoreVertical size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Performance Insights (Right Panel) */}
                <div className="space-y-8">
                    <div className="card-saas p-8 bg-slate-950 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-white/10 rounded-xl"><Sparkles size={16} className="text-blue-400" /></div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Platform Evolution</h3>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                                        <span className="text-slate-400">Total Merchants</span>
                                        <span>{merchants.length} Nodes</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[65%]" />
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                                    The marketplace is currently operating at <span className="text-white">84% efficiency</span>. New merchant acquisitions are up 12.5% this week.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card-saas p-8 bg-white shadow-xl">
                        <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em] italic mb-8">Subscription Yield</h3>
                        <div className="space-y-8">
                            {subscriptions.map((sub, i) => (
                                <div key={i} className="flex flex-col gap-3">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{sub.name}</p>
                                            <p className="text-xl font-black text-slate-950 tracking-tight leading-none">{sub.count} <span className="text-[9px] font-bold text-slate-300 ml-1">MNC</span></p>
                                        </div>
                                        <p className="text-[10px] font-black text-emerald-500 italic">{sub.revenue}</p>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                        <div 
                                            className={`h-full transition-all duration-1000 ${sub.name === 'Basic' ? 'bg-slate-300' : 'bg-slate-950'}`}
                                            style={{ width: `${(sub.count / (merchants.length || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card-saas p-8 bg-emerald-50 border-emerald-100 text-emerald-800 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <Activity size={18} className="text-emerald-600" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest">Protocol Status</h3>
                        </div>
                        <p className="text-[10px] font-bold leading-relaxed">
                            Global Payment Engine is synchronized. All settlement protocols are operating within normal parameters.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
