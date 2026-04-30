"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import {
    Tag,
    Plus,
    Search,
    Filter,
    Calendar,
    ArrowUpRight,
    Lock,
    Percent
} from "lucide-react";
import Link from "next/link";

import { useMerchant } from "@/context/MerchantContext";

export default function CouponsPage() {
    const { activePlan } = useMerchant();
    const coupons = [
        { id: "v1", code: "WELCOME10", type: "Percentage", value: "10%", usage: "124", expiry: "2026-12-31", status: "Active" },
        { id: "v2", code: "RAMADAN25", type: "Fixed Amount", value: "25 QAR", usage: "450", expiry: "2026-05-10", status: "Expired" },
    ];

    const isAddonActive = false;

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />

            <main className="flex-1 p-6 lg:p-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Discount Coupons</h1>
                        <p className="text-slate-500 text-xs mt-1">Create marketing campaigns with discount codes and flash sales.</p>
                    </div>
                </div>

                {/* Add-on Banner for Basic */}
                {activePlan === "Basic" && !isAddonActive && (
                    <div className="mb-8 p-6 bg-gradient-to-r from-rose-600 to-pink-700 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6 text-center md:text-left">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/30">
                                    <Tag size={32} />
                                </div>
                                <div className="max-w-md">
                                    <h3 className="text-lg font-black tracking-tight mb-2">Drive More Sales</h3>
                                    <p className="text-xs text-rose-50 font-medium leading-relaxed">
                                        The Basic plan includes standard pricing. Unlock the **Advanced Coupons & Promotions** add-on to create unlimited codes and flash sales for just **25 QAR/month**.
                                    </p>
                                </div>
                            </div>
                            <div className="shrink-0">
                                <button className="bg-white text-rose-600 px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2">
                                    Unlock Promotions
                                    <ArrowUpRight size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
                    </div>
                )}

                {/* Content Grid (Gated) */}
                <div className={`space-y-6 ${!isAddonActive && activePlan === 'Basic' ? 'opacity-40 pointer-events-none' : ''}`}>
                    <div className="card-saas p-4 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input type="text" placeholder="Search coupon codes..." className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl text-[11px]" disabled />
                        </div>
                        <button className="btn-primary py-3 px-6 text-[10px] uppercase font-black flex items-center gap-2">
                            <Plus size={16} /> Create Coupon
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {coupons.map((coupon) => (
                            <div key={coupon.id} className="card-saas overflow-hidden flex flex-col">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                                            <Percent size={20} />
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${coupon.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                                            }`}>
                                            {coupon.status}
                                        </span>
                                    </div>
                                    <h4 className="text-lg font-black text-slate-900 tracking-tighter mb-1">{coupon.code}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{coupon.type} · {coupon.value}</p>
                                </div>
                                <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center mt-auto">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Calendar size={12} />
                                        <span className="text-[10px] font-bold">Exp: {coupon.expiry}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-black text-slate-700">{coupon.usage} Uses</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
