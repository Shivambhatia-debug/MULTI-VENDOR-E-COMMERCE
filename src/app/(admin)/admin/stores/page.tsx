"use client";

import { useState, useEffect } from "react";
import {
    Store, Search, Filter, MoreVertical, Globe, 
    ExternalLink, Calendar, User, ArrowUpRight,
    Loader2, ShieldCheck, Activity
} from "lucide-react";

export default function AdminStoresPage() {
    const [stores, setStores] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const token = localStorage.getItem("golalita_token");
                const response = await fetch("/api/python/admin/stores", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) setStores(await response.json());
            } catch (err) {
                console.error("STORES_FETCH_ERROR:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStores();
    }, []);

    const filteredStores = stores.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.merchant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.subdomain.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tighter italic">Global Storefronts</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60">Network edge oversight</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl flex items-center gap-2">
                        <Activity size={16} /> Monitor Traffic
                    </button>
                </div>
            </div>

            <div className="card-saas overflow-hidden bg-white shadow-2xl border-slate-100">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-xl">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="SEARCH BY STORE NAME OR MERCHANT..."
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
                                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Storefront Entity</th>
                                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Associated Merchant</th>
                                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Routing Protocol</th>
                                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Deployment Status</th>
                                <th className="px-10 py-6 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredStores.map((s) => (
                                <tr key={s.id} className="hover:bg-slate-50/30 transition-all group cursor-pointer">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-950 group-hover:text-white transition-all duration-500 shadow-sm">
                                                <Store size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-950 tracking-tighter uppercase">{s.name}</p>
                                                <p className="text-[10px] text-blue-600 font-black tracking-widest mt-0.5 flex items-center gap-1">
                                                    <Globe size={10} /> {s.subdomain}.golalita.com
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-950 uppercase tracking-widest">{s.merchant_name}</p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{s.merchant_email}</p>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest flex items-center gap-2">
                                                <ShieldCheck size={12} className="text-emerald-500" /> SSL SECURE
                                            </span>
                                            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                                Edge Node: DXB-01
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest">Live & Operational</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 hover:bg-slate-950 hover:text-white transition-all">
                                                <MoreVertical size={16} />
                                            </button>
                                            <a 
                                                href={`https://${s.subdomain}.golalita.com`} 
                                                target="_blank" 
                                                className="p-3 bg-slate-950 text-white rounded-xl shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2"
                                            >
                                                <ExternalLink size={16} />
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredStores.length === 0 && (
                        <div className="py-32 text-center">
                            <Store className="mx-auto text-slate-100 mb-6" size={64} />
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">No store nodes detected</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
