"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import { Award, Star, TrendingUp, Users, Zap, Gift } from "lucide-react";
import { useMerchant } from "@/context/MerchantContext";

export default function LoyaltyPage() {
    const { activePlan } = useMerchant();

    if (activePlan === "Basic") {
        return (
            <div className="min-h-screen bg-slate-50 flex">
                <Sidebar />
                <main className="flex-1 p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
                        <Award size={40} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Loyalty Engine Locked</h1>
                    <p className="text-slate-500 max-w-md mb-8">
                        The Loyalty & Rewards Engine is a Premium feature.
                        Retain customers with points, tiered rewards, and automated gifts.
                    </p>
                    <button className="btn-primary px-8 py-3 uppercase tracking-widest text-[10px]">Upgrade to Premium</button>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-8">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Loyalty & Rewards</h1>
                        <p className="text-slate-500 text-xs mt-1">Configure point systems, customer tiers, and rewards.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-100 shadow-sm">
                        <Award size={14} className="fill-current text-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-wider">{activePlan} Feature</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="card-saas p-6">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Total Points Issued</p>
                        <p className="text-2xl font-black tracking-tighter text-slate-900">1.2M</p>
                    </div>
                    <div className="card-saas p-6">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Points Redeemed</p>
                        <p className="text-2xl font-black tracking-tighter text-slate-900">450K</p>
                    </div>
                    <div className="card-saas p-6">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Active Members</p>
                        <p className="text-2xl font-black tracking-tighter text-slate-900">8,420</p>
                    </div>
                    <div className="card-saas p-6">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Retention Rate</p>
                        <p className="text-2xl font-black tracking-tighter text-emerald-600">+12%</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="card-saas p-6">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Zap size={14} className="text-amber-500" />
                            Points Multiplier
                        </h3>
                        <div className="space-y-6">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-500 mb-2">Current Rule</p>
                                <p className="text-sm font-black text-slate-900">1 QAR = 10 Loyalty Points</p>
                            </div>
                            <button className="w-full py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Configure Rule</button>
                        </div>
                    </div>

                    <div className="card-saas p-6">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Gift size={14} className="text-blue-500" />
                            Active Rewards
                        </h3>
                        <div className="space-y-3">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                            <Star size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-900">QAR 50 Discount</p>
                                            <p className="text-[9px] text-slate-400">500 Points Required</p>
                                        </div>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-bold uppercase">Active</span>
                                </div>
                            ))}
                            <button className="w-full py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all">+ New Reward</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
