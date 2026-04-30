"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Users, Zap } from "lucide-react";
import { useMerchant } from "@/context/MerchantContext";

export default function WalletPage() {
    const { activePlan } = useMerchant();

    if (activePlan === "Basic") {
        return (
            <div className="min-h-screen bg-slate-50 flex">
                <Sidebar />
                <main className="flex-1 p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
                        <WalletIcon size={40} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Wallet System Restricted</h1>
                    <p className="text-slate-500 max-w-md mb-8">
                        The Customer Wallet system is available on **Premium** and **Mobile App** plans.
                        Enable digital balances and automated refunds for your customers.
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
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Customer Wallets</h1>
                        <p className="text-slate-500 text-xs mt-1">Manage digital credits, refunds, and balance history.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-100 shadow-sm">
                        <Zap size={14} className="fill-current" />
                        <span className="text-[10px] font-black uppercase tracking-wider">{activePlan} Feature</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="card-saas p-6 bg-slate-950 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Total Floating Balance</p>
                            <p className="text-3xl font-black tracking-tighter">QAR 48,250.00</p>
                        </div>
                        <WalletIcon className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5" />
                    </div>
                    <div className="card-saas p-6 border-l-4 border-emerald-500">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Active Wallets</p>
                        <p className="text-3xl font-black tracking-tighter text-slate-900">1,240</p>
                    </div>
                    <div className="card-saas p-6 border-l-4 border-blue-500">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Refunds MTD</p>
                        <p className="text-3xl font-black tracking-tighter text-slate-900">QAR 1,420</p>
                    </div>
                </div>

                <div className="card-saas overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Recent Transactions</h3>
                        <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">View All</button>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${i % 2 === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {i % 2 === 0 ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-slate-900">Customer #{840 + i}</p>
                                        <p className="text-[9px] text-slate-400 font-medium">Oct 12, 2024 • 14:20 PM</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-[11px] font-black ${i % 2 === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                                        {i % 2 === 0 ? '+' : '-'} QAR {200 + (i * 50)}.00
                                    </p>
                                    <p className="text-[9px] text-slate-400 font-medium lowercase italic">
                                        {i % 2 === 0 ? 'Topup' : 'Order Refund'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
