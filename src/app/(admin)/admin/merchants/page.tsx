"use client";

import { useState, useEffect } from "react";
import {
    Users, Search, Filter, MoreVertical, ChevronRight,
    Mail, Calendar, Building, CreditCard, ArrowUpRight,
    Loader2, ShieldCheck, UserX, UserCheck
} from "lucide-react";

export default function AdminMerchantsPage() {
    const [merchants, setMerchants] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchMerchants = async () => {
            try {
                const token = localStorage.getItem("golalita_token");
                const response = await fetch("/api/python/admin/merchants", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) setMerchants(await response.json());
            } catch (err) {
                console.error("MERCHANTS_FETCH_ERROR:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMerchants();
    }, []);

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
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tighter italic">Merchant Network</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60">Global ecosystem management</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-slate-950 uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
                        <Filter size={16} /> Filter List
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Active Nodes", value: merchants.filter(m => m.status === 'Active').length, icon: UserCheck, color: "text-emerald-500" },
                    { label: "Pending Verification", value: merchants.filter(m => m.status === 'Pending').length, icon: ShieldCheck, color: "text-amber-500" },
                    { label: "Suspended", value: merchants.filter(m => m.status === 'Suspended').length, icon: UserX, color: "text-rose-500" },
                    { label: "Enterprise Tier", value: merchants.filter(m => m.plan === 'Mobile App').length, icon: Building, color: "text-indigo-500" },
                ].map((stat, i) => (
                    <div key={i} className="card-saas p-6 bg-white shadow-lg border-slate-100/50">
                        <div className="flex justify-between items-center mb-3">
                            <stat.icon size={18} className={stat.color} />
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Live Metrics</span>
                        </div>
                        <p className="text-2xl font-black text-slate-950 tracking-tighter leading-none">{stat.value}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="card-saas overflow-hidden bg-white shadow-2xl border-slate-100">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-xl sticky top-0 z-10">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="SEARCH BY NAME, EMAIL OR ENTITY ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-[10px] font-black tracking-widest uppercase outline-none focus:ring-2 focus:ring-slate-950 transition-all placeholder:text-slate-300"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Merchant Profile</th>
                                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Operational Status</th>
                                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Subscription Plan</th>
                                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Protocol Revenue</th>
                                <th className="px-10 py-6 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredMerchants.map((m) => (
                                <tr key={m.id} className="hover:bg-slate-50/30 transition-all group cursor-pointer">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-white font-black text-sm shadow-xl group-hover:scale-110 transition-transform">
                                                {m.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-950 tracking-tighter uppercase">{m.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-0.5">{m.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-2 h-2 rounded-full ${m.status === 'Active' ? 'bg-emerald-500 animate-pulse' : m.status === 'Suspended' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                                            <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest">{m.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${m.plan === 'Mobile App' ? 'text-indigo-600' : m.plan === 'Premium' ? 'text-blue-600' : 'text-slate-400'}`}>
                                                {m.plan}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold">
                                                <Calendar size={10} /> Joined {new Date(m.joined).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div>
                                            <p className="text-sm font-black text-slate-950 italic">{m.revenue}</p>
                                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-0.5 flex items-center gap-1">
                                                <ArrowUpRight size={10} /> Profitable
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 hover:bg-slate-950 hover:text-white transition-all shadow-sm">
                                                <MoreVertical size={16} />
                                            </button>
                                            <button className="p-3 bg-slate-950 text-white rounded-xl shadow-xl hover:bg-slate-800 transition-all">
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredMerchants.length === 0 && (
                        <div className="py-32 text-center">
                            <Users className="mx-auto text-slate-100 mb-6" size={64} />
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">No Merchant nodes detected</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
