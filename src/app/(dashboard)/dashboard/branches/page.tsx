"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import { stats } from "@/lib/data";
import {
    Plus,
    MapPin,
    MoreHorizontal,
    Phone,
    Clock,
    Lock,
    ExternalLink
} from "lucide-react";
import Link from "next/link";

import { useMerchant } from "@/context/MerchantContext";

export default function BranchesPage() {
    const { activePlan, planLimits } = useMerchant();
    const branches = [
        { id: "b1", name: "Main Store - Doha", city: "Doha", address: "Al Corniche St, Doha, Qatar", phone: "+974 4444 0000", hours: "9:00 AM - 10:00 PM", status: "Active" },
    ];

    const branchLimit = planLimits.branches;
    const isLimitReached = branches.length >= branchLimit;

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />

            <main className="flex-1 p-6 lg:p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Branch Management</h1>
                        <p className="text-slate-500 text-xs mt-1">Manage your physical store locations and pickup points.</p>
                    </div>
                    {isLimitReached ? (
                        <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-xl border border-amber-100 shadow-sm">
                            <Lock size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Limit Reached</span>
                            <Link href="/pricing" className="ml-2 text-blue-600 hover:underline font-bold">Upgrade</Link>
                        </div>
                    ) : (
                        <button className="btn-primary flex items-center justify-center gap-2 text-[10px] py-2 px-4 uppercase tracking-widest">
                            <Plus size={16} />
                            <span>Add New Branch</span>
                        </button>
                    )}
                </div>

                {/* Capacity Card */}
                <div className="mb-6 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">{activePlan} Plan Limit: {branchLimit} Branch{branchLimit > 1 ? 'es' : ''}</span>
                    </div>
                    {activePlan === "Basic" && (
                        <p className="text-[10px] text-slate-400 font-medium">To manage multiple locations, upgrade to <span className="text-blue-600 font-bold">Premium</span>.</p>
                    )}
                </div>

                {/* Branch Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {branches.map((branch) => (
                        <div key={branch.id} className="card-saas p-6 group transition-all hover:border-blue-200">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                    <MapPin size={24} />
                                </div>
                                <div className="flex gap-1">
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">
                                        {branch.status}
                                    </span>
                                    <button className="p-1.5 hover:bg-slate-50 text-slate-400 rounded-lg transition-colors">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-sm font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{branch.name}</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-slate-500">
                                    <div className="w-4 h-4 flex items-center justify-center"><Phone size={12} /></div>
                                    <span className="text-[11px] font-medium">{branch.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 text-wrap">
                                    <div className="w-4 h-4 flex items-center justify-center shrink-0"><MapPin size={12} /></div>
                                    <span className="text-[11px] font-medium truncate">{branch.address}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500">
                                    <div className="w-4 h-4 flex items-center justify-center"><Clock size={12} /></div>
                                    <span className="text-[11px] font-medium">{branch.hours}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 border-t border-slate-50 pt-4">
                                <button className="flex-1 py-1.5 rounded-lg border border-slate-100 text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                                    <ExternalLink size={12} />
                                    Map View
                                </button>
                                <button className="flex-1 py-1.5 rounded-lg bg-slate-900 text-white text-[10px] font-bold hover:bg-slate-800 transition-all">
                                    Live View
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Locked Placeholder for Basic */}
                    {activePlan === "Basic" && (
                        <div className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 transition-all group">
                            <div className="w-10 h-10 bg-white border border-slate-200 text-slate-300 rounded-full flex items-center justify-center mb-4 group-hover:text-amber-400 group-hover:border-amber-200 transition-colors">
                                <Lock size={18} />
                            </div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Second Branch Locked</h4>
                            <p className="text-[10px] text-slate-400 leading-relaxed max-w-[160px] mx-auto mb-4">You can only manage one branch on the Basic plan.</p>
                            <Link href="/pricing" className="text-[10px] font-bold text-blue-600 hover:underline">Get more branches</Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
