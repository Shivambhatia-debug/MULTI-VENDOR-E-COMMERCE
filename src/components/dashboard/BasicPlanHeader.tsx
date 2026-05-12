"use client";

import { AlertCircle, ArrowUpRight, CheckCircle2, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useMerchant } from "@/context/MerchantContext";

interface BasicPlanHeaderProps {
    plan: string;
    productCount: number;
    branchCount: number;
}

export default function BasicPlanHeader({ plan, productCount, branchCount }: BasicPlanHeaderProps) {
    const { t, language } = useLanguage();
    const { isTrialActive, trialRemainingDays, subscriptionStatus } = useMerchant();
    const isRtl = language === 'ar';
    const productLimit = plan === "Basic" ? 400 : 1500;
    const branchLimit = plan === "Basic" ? 1 : 3;
    const productUsage = (productCount / productLimit) * 100;

    const isTrial = subscriptionStatus === "trial" && plan === "Basic";

    return (
        <div className="space-y-6 mb-8">
            {/* Plan Alert Bar */}
            <div className={`bg-slate-950 rounded-2xl p-4 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-4 border border-slate-800 relative overflow-hidden group ${isRtl ? 'md:flex-row-reverse' : ''}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700" />

                <div className={`flex items-center gap-4 relative z-10 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10">
                        <Sparkles size={20} className="text-slate-300" />
                    </div>
                    <div className={isRtl ? 'text-right' : ''}>
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] leading-none text-slate-100 italic">
                            {isTrial ? `FREE TRIAL: ${trialRemainingDays} DAYS REMAINING` : `${plan} Infrastructure Authorized`}
                        </h2>
                        <p className="text-[10px] text-slate-400 mt-1.5 font-bold uppercase tracking-widest">
                            {isTrial 
                                ? "Initialize your store architecture during the free period." 
                                : plan === "Mobile App" 
                                    ? "Enterprise-grade connectivity with iOS & Android Native support."
                                    : "Advanced marketplace protocols and expanded operational limits."}
                        </p>
                    </div>
                </div>
                {plan === "Basic" && (
                    <Link
                        href="/packages"
                        className="bg-white text-slate-950 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 shadow-lg whitespace-nowrap relative z-10"
                    >
                        {t("upgrade_now")}
                    </Link>
                )}
                {plan !== "Basic" && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl relative z-10 no-print">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Status: Optimal</span>
                    </div>
                )}
            </div>

            {/* Limits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Limit Card */}
                <div className={`card-saas p-5 flex flex-col justify-between ${isRtl ? 'border-r-4 border-r-slate-900' : 'border-l-4 border-l-slate-900'}`}>
                    <div className={`flex justify-between items-start mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <div className={isRtl ? 'text-right' : ''}>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t("product_inventory")}</p>
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
                        <p className={`text-[10px] text-slate-500 font-medium leading-relaxed ${isRtl ? 'text-right' : ''}`}>
                            {productUsage > 90 ? 'Critical: You are almost at your product limit.' : t("space_for_more")}
                        </p>
                    </div>
                </div>

                {/* Branch Limit Card */}
                <div className={`card-saas p-5 flex flex-col justify-between ${isRtl ? 'border-r-4 border-r-emerald-600' : 'border-l-4 border-l-emerald-600'}`}>
                    <div className={`flex justify-between items-start mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <div className={isRtl ? 'text-right' : ''}>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t("store_branches")}</p>
                            <h3 className="text-lg font-black text-slate-950">{branchCount} <span className="text-slate-400 font-medium text-xs">/ {branchLimit}</span></h3>
                        </div>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <CheckCircle2 size={16} />
                        </div>
                    </div>
                    <div className={`bg-slate-50 rounded-2xl p-3.5 flex justify-between items-center group cursor-pointer hover:bg-slate-100 transition-colors border border-slate-100 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <Lock size={12} className="text-slate-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t("buy_additional_branches")}</span>
                        </div>
                        <ArrowUpRight size={14} className={`text-slate-400 group-hover:text-slate-950 transition-colors ${isRtl ? 'rotate-90' : ''}`} />
                    </div>
                </div>
            </div>
        </div>
    );
}
