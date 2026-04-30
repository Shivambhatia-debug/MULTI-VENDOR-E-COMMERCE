"use client";

import { adminStats, merchants, subscriptionStats } from "@/lib/data";
import {
    Users,
    ArrowUpRight,
    ArrowDownRight,
    MoreVertical,
    Search,
    Filter,
    DollarSign,
    Building,
    Store,
    CreditCard,
    CheckCircle2,
    Clock,
    AlertCircle,
    Plus
} from "lucide-react";

export default function AdminDashboard() {
    const getStatusStyles = (status: string) => {
        switch (status) {
            case "Active": return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "Pending": return "bg-amber-50 text-amber-700 border-amber-100";
            case "Suspended": return "bg-rose-50 text-rose-700 border-rose-100";
            default: return "bg-slate-50 text-slate-700 border-slate-100";
        }
    };

    const getPlanStyles = (plan: string | undefined) => {
        switch (plan) {
            case "Enterprise": return "text-indigo-600 font-bold";
            case "Professional": return "text-blue-600 font-bold";
            default: return "text-slate-500 font-medium";
        }
    };

    const iconMap: any = {
        DollarSign: DollarSign,
        Building: Building,
        Store: Store,
        CreditCard: CreditCard
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Marketplace Oversight</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage global merchants and platform-wide subscription health.</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Plus size={18} />
                    <span>Invite Merchant</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {adminStats.map((stat, i) => {
                    const Icon = iconMap[stat.icon] || CreditCard;
                    return (
                        <div key={i} className="card-saas p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                                    <Icon size={20} />
                                </div>
                                <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.change.startsWith("+") ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                    }`}>
                                    {stat.change}
                                    {stat.change.startsWith("+") ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                </span>
                            </div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-900 leading-none">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Subscription Distribution */}
            <div className="card-saas p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-6">Subscription Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {subscriptionStats.map((sub, i) => (
                        <div key={i} className="flex flex-col gap-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{sub.name}</p>
                                    <p className="text-xl font-bold text-slate-900">{sub.count} <span className="text-xs font-normal text-slate-500">Merchants</span></p>
                                </div>
                                <p className="text-sm font-bold text-blue-600">{sub.revenue}</p>
                            </div>
                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${sub.color}`}
                                    style={{ width: `${(sub.count / 1240) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Merchant Management */}
            <div className="card-saas overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h3 className="text-sm font-bold text-slate-900">Merchant Directory</h3>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-grow sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search merchants..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-blue-600"
                            />
                        </div>
                        <button className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                            <Filter size={16} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Merchant</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subscription</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Joined</th>
                                <th className="px-6 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {merchants.map((merchant) => (
                                <tr key={merchant.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 leading-tight">{merchant.name}</p>
                                            <p className="text-xs text-slate-500 uppercase tracking-widest text-[9px] mt-0.5">{merchant.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold border ${getStatusStyles(merchant.status)}`}>
                                            {merchant.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs ${getPlanStyles(merchant.plan)}`}>
                                            {merchant.plan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                                        {merchant.revenue}
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-slate-500">
                                        {merchant.joined}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-400 hover:text-slate-600">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
