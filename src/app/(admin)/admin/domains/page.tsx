"use client";

import { useState, useEffect } from "react";
import {
    Globe, Loader2, CheckCircle2, XCircle, Search,
    ShieldCheck, Clock, AlertTriangle, ExternalLink, Wifi
} from "lucide-react";

export default function AdminDomainsPage() {
    const [domains, setDomains] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);
    const [dnsResults, setDnsResults] = useState<Record<string, any>>({});

    const fetchDomains = async () => {
        try {
            const token = localStorage.getItem("golalita_token");
            const res = await fetch("/api/python/admin/domains/pending", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setDomains(data);
                } else {
                    console.error("EXPECTED_ARRAY_BUT_GOT:", JSON.stringify(data));
                    setDomains([]);
                }
            }
        } catch (err) {
            console.error("FETCH_DOMAINS_ERROR:", err);
            setDomains([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchDomains(); }, []);

    const handleCheckDns = async (storeId: string) => {
        setProcessing(storeId);
        try {
            const token = localStorage.getItem("golalita_token");
            const res = await fetch(`/api/python/admin/domains/check-dns/${storeId}`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const result = await res.json();
                setDnsResults(prev => ({ ...prev, [storeId]: result }));
                if (result.all_verified) {
                    setDomains(prev => prev.map(d => d.id === storeId ? { ...d, domain_status: "dns_verified" } : d));
                }
            }
        } catch (err) { console.error(err); }
        finally { setProcessing(null); }
    };

    const handleDeploy = async (storeId: string) => {
        setProcessing(storeId);
        try {
            const token = localStorage.getItem("golalita_token");
            const res = await fetch(`/api/python/admin/domains/deploy/${storeId}`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const result = await res.json();
                alert(result.message);
                setDomains(prev => prev.filter(d => d.id !== storeId));
            } else {
                const err = await res.json();
                alert(err.detail || "Deploy failed");
            }
        } catch (err) { console.error(err); }
        finally { setProcessing(null); }
    };

    const handleReject = async (storeId: string) => {
        const reason = prompt("Rejection reason:", "DNS records not properly configured");
        if (!reason) return;
        setProcessing(storeId);
        try {
            const token = localStorage.getItem("golalita_token");
            await fetch(`/api/python/admin/domains/reject/${storeId}?reason=${encodeURIComponent(reason)}`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });
            setDomains(prev => prev.filter(d => d.id !== storeId));
        } catch (err) { console.error(err); }
        finally { setProcessing(null); }
    };

    const statusBadge = (status: string) => {
        const map: Record<string, { bg: string; text: string; label: string }> = {
            pending_dns: { bg: "bg-amber-50", text: "text-amber-600", label: "Pending DNS" },
            dns_verified: { bg: "bg-blue-50", text: "text-blue-600", label: "DNS Verified" },
            deploying: { bg: "bg-indigo-50", text: "text-indigo-600", label: "Deploying" },
            active: { bg: "bg-emerald-50", text: "text-emerald-600", label: "Active" },
            failed: { bg: "bg-rose-50", text: "text-rose-600", label: "Failed" },
        };
        const s = map[status] || map.pending_dns;
        return <span className={`${s.bg} ${s.text} text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full`}>{s.label}</span>;
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
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tighter italic">Domain Control</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60">Custom Domain Verification & Deployment</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-saas p-8 bg-white shadow-xl border-l-4 border-l-amber-500">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                            <Clock size={28} />
                        </div>
                        <div>
                            <p className="text-xl font-black text-slate-950 tracking-tight leading-none">
                                {domains.filter(d => d.domain_status === "pending_dns").length}
                            </p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Pending DNS</p>
                        </div>
                    </div>
                </div>
                <div className="card-saas p-8 bg-white shadow-xl border-l-4 border-l-blue-500">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <p className="text-xl font-black text-slate-950 tracking-tight leading-none">
                                {domains.filter(d => d.domain_status === "dns_verified").length}
                            </p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Ready to Deploy</p>
                        </div>
                    </div>
                </div>
                <div className="card-saas p-8 bg-slate-950 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3">Total Queue</p>
                        <p className="text-lg font-bold leading-tight">{domains.length} Domain{domains.length !== 1 ? 's' : ''} in Pipeline</p>
                    </div>
                </div>
            </div>

            {/* Domain Table */}
            <div className="card-saas overflow-hidden bg-white shadow-2xl border-slate-100">
                <div className="p-8 border-b border-slate-50">
                    <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em] italic">Domain Verification Queue</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Store / Domain</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Merchant</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">DNS Check</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {domains.map((d) => (
                                <tr key={d.id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-lg">
                                                <Globe size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-slate-950 uppercase tracking-tight">{d.store_name}</p>
                                                <p className="text-[10px] text-blue-500 font-bold mt-0.5 flex items-center gap-1">
                                                    {d.custom_domain} <ExternalLink size={10} />
                                                </p>
                                                <p className="text-[9px] text-slate-400 font-bold">{d.subdomain}.golalita.qa</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-[11px] font-black text-slate-950 uppercase tracking-tight">{d.merchant_name}</p>
                                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">{d.merchant_email}</p>
                                    </td>
                                    <td className="px-8 py-6">{statusBadge(d.domain_status)}</td>
                                    <td className="px-8 py-6">
                                        {dnsResults[d.id] ? (
                                            <div className="space-y-1">
                                                {dnsResults[d.id].checks?.map((c: any, i: number) => (
                                                    <div key={i} className={`text-[8px] font-bold flex items-center gap-1.5 ${c.verified ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                        {c.verified ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                                                        <span>{c.type}: {c.found}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-[9px] text-slate-300 font-bold">Not checked</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleCheckDns(d.id)}
                                                disabled={!!processing}
                                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all disabled:opacity-50 flex items-center gap-1.5"
                                            >
                                                {processing === d.id ? <Loader2 size={10} className="animate-spin" /> : <Wifi size={10} />}
                                                Check DNS
                                            </button>
                                            <button
                                                onClick={() => handleDeploy(d.id)}
                                                disabled={!!processing || d.domain_status === "pending_dns"}
                                                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-lg flex items-center gap-1.5"
                                            >
                                                <Globe size={10} /> Deploy
                                            </button>
                                            <button
                                                onClick={() => handleReject(d.id)}
                                                disabled={!!processing}
                                                className="px-4 py-2 bg-rose-50 text-rose-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all disabled:opacity-50"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {domains.length === 0 && (
                        <div className="py-32 text-center">
                            <CheckCircle2 className="mx-auto text-emerald-100 mb-6" size={64} />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">No pending domain requests</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
