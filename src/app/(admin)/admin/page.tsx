"use client";

import { useState, useEffect } from "react";
import {
    Users, ArrowUpRight, ArrowDownRight, MoreVertical,
    Search, Filter, DollarSign, Building, Store, CreditCard,
    Plus, Loader2
} from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any[]>([]);
    const [merchants, setMerchants] = useState<any[]>([]);
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("golalita_token");
                const headers = { "Authorization": `Bearer ${token}` };

                const [statsRes, merchantsRes, subsRes] = await Promise.all([
                    fetch("/api/python/admin/stats", { headers }),
                    fetch("/api/python/admin/merchants", { headers }),
                    fetch("/api/python/admin/subscriptions", { headers })
                ]);

                if (statsRes.ok) setStats(await statsRes.json());
                if (merchantsRes.ok) setMerchants(await merchantsRes.json());
                if (subsRes.ok) setSubscriptions(await subsRes.json());
            } catch (err) {
                console.error("ADMIN_FETCH_ERROR:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "Active": return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "Pending": return "bg-amber-50 text-amber-700 border-amber-100";
            case "Suspended": return "bg-rose-50 text-rose-700 border-rose-100";
            default: return "bg-slate-50 text-slate-700 border-slate-100";
        }
    };

    const getPlanStyles = (plan: string) => {
        switch (plan) {
            case "Mobile App": return "text-indigo-600 font-bold";
            case "Premium": return "text-blue-600 font-bold";
            default: return "text-slate-500 font-medium";
        }
    };

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
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Marketplace Oversight</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage global merchants and platform-wide subscription health.</p>
                </div>
                <button className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
                    <Plus size={18} />
                    <span>Invite Merchant</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Icon = iconMap[stat.icon] || CreditCard;
                    return (
                        <div key={i} className="card-saas p-6 group hover:border-slate-300 transition-all cursor-default">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-600 group-hover:bg-slate-950 group-hover:text-white transition-all duration-500">
                                    <Icon size={20} />
                                </div>
                                <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.change.startsWith("+") ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                    }`}>
                                    {stat.change}
                                    {stat.change.startsWith("+") ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                </span>
                            </div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-950 leading-none tracking-tight">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Subscription Distribution */}
            <div className="card-saas p-8">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em] italic">Subscription Distribution</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform-wide Breakdown</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {subscriptions.map((sub, i) => (
                        <div key={i} className="flex flex-col gap-5">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{sub.name}</p>
                                    <p className="text-2xl font-black text-slate-950 tracking-tight">{sub.count} <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Merchants</span></p>
                                </div>
                                <p className="text-xs font-black text-blue-600 uppercase italic">{sub.revenue}</p>
                            </div>
                            <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                <div
                                    className={`h-full transition-all duration-1000 ${sub.name === 'Basic' ? 'bg-slate-300' : sub.name === 'Premium' ? 'bg-blue-600' : 'bg-indigo-600'}`}
                                    style={{ width: `${merchants.length ? (sub.count / merchants.length) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Merchant Management */}
            <div className="card-saas overflow-hidden border-slate-100/50 shadow-xl">
                <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
                    <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em] italic">Merchant Directory</h3>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-grow sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search merchants..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-slate-950 transition-all"
                            />
                        </div>
                        <button className="p-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all">
                            <Filter size={16} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Merchant</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Subscription</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Revenue</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Joined</th>
                                <th className="px-8 py-5 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredMerchants.map((merchant) => (
                                <tr key={merchant.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div>
                                            <p className="text-sm font-black text-slate-950 leading-tight tracking-tight">{merchant.name}</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">{merchant.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black border uppercase tracking-widest ${getStatusStyles(merchant.status)}`}>
                                            {merchant.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`text-[10px] uppercase tracking-widest ${getPlanStyles(merchant.plan)}`}>
                                            {merchant.plan}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-xs font-black text-slate-950 italic">
                                        {merchant.revenue}
                                    </td>
                                    <td className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                        {new Date(merchant.joined).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="p-1.5 hover:bg-slate-950 hover:text-white rounded-lg transition-all text-slate-300">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredMerchants.length === 0 && (
                        <div className="py-20 text-center">
                            <Users className="mx-auto text-slate-200 mb-4" size={48} />
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No merchants found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
