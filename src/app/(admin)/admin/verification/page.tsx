"use client";

import { useState, useEffect } from "react";
import { 
    ShieldCheck, Clock, Search, MoreVertical, CheckCircle2, 
    XCircle, Loader2, Store, ExternalLink, AlertCircle
} from "lucide-react";

export default function AdminVerificationPage() {
    const [pendingStores, setPendingStores] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    const fetchPending = async () => {
        try {
            const token = localStorage.getItem("golalita_token");
            const res = await fetch("/api/python/admin/verification/pending", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) setPendingStores(await res.json());
        } catch (err) {
            console.error("VERIFICATION_FETCH_ERROR:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        setIsProcessing(id);
        try {
            const token = localStorage.getItem("golalita_token");
            const res = await fetch(`/api/python/admin/verification/${action}/${id}`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setPendingStores(prev => prev.filter(s => s.id !== id));
            }
        } catch (err) {
            console.error("ACTION_ERROR:", err);
        } finally {
            setIsProcessing(null);
        }
    };

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
                    <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tighter italic">Protocol Compliance</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60">Entity verification & deployment queue</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-saas p-8 bg-white shadow-xl border-l-4 border-l-emerald-500">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <p className="text-xl font-black text-slate-950 tracking-tight leading-none">99.2% Healthy</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Compliance Rating</p>
                        </div>
                    </div>
                </div>

                <div className="card-saas p-8 bg-white shadow-xl border-l-4 border-l-amber-500">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                            <Clock size={28} />
                        </div>
                        <div>
                            <p className="text-xl font-black text-slate-950 tracking-tight leading-none">{pendingStores.length} Pending</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Awaiting Protocol Review</p>
                        </div>
                    </div>
                </div>

                <div className="card-saas p-8 bg-slate-950 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3">System Root</p>
                        <p className="text-lg font-bold leading-tight">Verification Engine is Live & Filtering Traffic</p>
                    </div>
                </div>
            </div>

            {/* Queue Table */}
            <div className="card-saas overflow-hidden bg-white shadow-2xl border-slate-100">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em] italic">Deployment Request Queue</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                            ))}
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Auditors</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Entity Profile</th>
                                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Associated Merchant</th>
                                <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Timestamp</th>
                                <th className="px-10 py-6 text-right">Action Protocol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {pendingStores.map((store) => (
                                <tr key={store.id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500">
                                                <Store size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-950 tracking-tighter uppercase">{store.store_name}</p>
                                                <p className="text-[10px] text-blue-500 font-bold tracking-widest mt-1 italic flex items-center gap-1">
                                                    {store.subdomain}.golalita.com <ExternalLink size={10} />
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div>
                                            <p className="text-[11px] font-black text-slate-950 uppercase tracking-tight">{store.merchant_name}</p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{store.merchant_email}</p>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Clock size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-tighter">
                                                {new Date(store.requested_at).toLocaleString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button 
                                                onClick={() => handleAction(store.id, 'reject')}
                                                disabled={!!isProcessing}
                                                className="px-5 py-2.5 bg-rose-50 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
                                            >
                                                Reject
                                            </button>
                                            <button 
                                                onClick={() => handleAction(store.id, 'approve')}
                                                disabled={!!isProcessing}
                                                className="px-5 py-2.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {isProcessing === store.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                                                Approve
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {pendingStores.length === 0 && (
                        <div className="py-32 text-center">
                            <CheckCircle2 className="mx-auto text-emerald-100 mb-6" size={64} />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">All deployment protocols cleared</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
