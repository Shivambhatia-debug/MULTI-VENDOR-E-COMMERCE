"use client";

import { AlertCircle, ArrowUpRight, CheckCircle2, Lock, Sparkles } from "lucide-react";
import Link from "next/link";

interface BasicPlanHeaderProps {
    plan: string;
    productCount: number;
    branchCount: number;
}

export default function BasicPlanHeader({ plan, productCount, branchCount }: BasicPlanHeaderProps) {
    const productLimit = 400;
    const branchLimit = 1;
    const productUsage = (productCount / productLimit) * 100;

    return (
        <div className="space-y-6 mb-8">
            {/* Plan Alert Bar */}
            <div className="bg-slate-950 rounded-2xl p-4 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-4 border border-slate-800 relative overflow-hidden group">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700" />

                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10">
                        <Sparkles size={20} className="text-slate-300" />
                    </div>
                    <div>
                        <h2 className="text-xs font-black uppercase tracking-widest leading-none text-slate-100">{plan} Plan Active</h2>
                        <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Upgrade to Premium to unlock Wallet, Loyalty & support for 1500+ products.</p>
                    </div>
                </div>
                <Link
                    href="/dashboard/settings"
                    className="bg-white text-slate-950 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 shadow-lg whitespace-nowrap relative z-10"
                >
                    Upgrade Now
                </Link>
            </div>

            {/* Limits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Limit Card */}
                <div className="card-saas p-5 flex flex-col justify-between border-l-4 border-l-slate-900">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Product Inventory</p>
                            <h3 className="text-lg font-black text-slate-950">{productCount} <span className="text-slate-400 font-medium text-xs">/ {productLimit}</span></h3>
                        </div>
                        <div className={`p-2 rounded-lg ${productUsage > 90 ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-400'}`}>
                            <AlertCircle size={16} />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ${productUsage > 90 ? 'bg-rose-500' : 'bg-slate-950'}`}
                                style={{ width: `${productUsage}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                            {productUsage > 90 ? 'Critical: You are almost at your product limit.' : 'You have plenty of space for more products.'}
                        </p>
                    </div>
                </div>

                {/* Branch Limit Card */}
                <div className="card-saas p-5 flex flex-col justify-between border-l-4 border-l-emerald-600">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Store Branches</p>
                            <h3 className="text-lg font-black text-slate-950">{branchCount} <span className="text-slate-400 font-medium text-xs">/ {branchLimit}</span></h3>
                        </div>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <CheckCircle2 size={16} />
                        </div>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-3.5 flex justify-between items-center group cursor-pointer hover:bg-slate-100 transition-colors border border-slate-100">
                        <div className="flex items-center gap-2">
                            <Lock size={12} className="text-slate-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Buy additional branches</span>
                        </div>
                        <ArrowUpRight size={14} className="text-slate-400 group-hover:text-slate-950 transition-colors" />
                    </div>
                </div>
            </div>
        </div>
    );
}
