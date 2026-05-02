"use client";

import { ShieldCheck, Clock, Search, MoreVertical, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useState } from "react";

export default function AdminVerificationPage() {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tighter italic">Entity Verification</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60">Compliance & KYC queue</p>
            </div>

            <div className="card-saas p-8 bg-white shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 border border-emerald-100">
                        <ShieldCheck size={32} />
                    </div>
                    <div>
                        <p className="text-xl font-black text-slate-950 tracking-tight leading-none">99.2% Verified</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Platform compliance status</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <p className="text-sm font-black text-slate-950 leading-none">12 Pending</p>
                        <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mt-1">Action Required</p>
                    </div>
                </div>
            </div>

            <div className="card-saas overflow-hidden bg-white shadow-2xl border-slate-100">
                <div className="p-8 border-b border-slate-50">
                    <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em] italic">Pending Review Queue</h3>
                </div>
                <div className="p-20 text-center">
                    <Clock className="mx-auto text-slate-100 mb-6" size={64} />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Queue is currently empty</p>
                </div>
            </div>
        </div>
    );
}
