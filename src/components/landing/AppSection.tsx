"use client";

import { Smartphone, Bell, Heart, Star, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AppSection() {
    const { t, language } = useLanguage();

    const appFeatures = [
        { icon: Bell, title: t("real_time_alerts"), sub: t("instant_order_updates") },
        { icon: Heart, title: t("loyalty_engine"), sub: t("manage_customer_rewards") },
        { icon: Star, title: t("insights"), sub: t("customer_sentiment") },
        { icon: Smartphone, title: t("live_support"), sub: t("direct_merchant_chat") },
    ];

    return (
        <section className="section-padding py-32 bg-slate-950 rounded-[3rem] text-white relative overflow-hidden my-24 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full bg-slate-800/10 pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
                <div className={`max-w-2xl px-6 lg:px-0 ${language === 'ar' ? 'text-right' : ''}`}>
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <Smartphone size={12} />
                        <span>{t("merchant_mobile_app")}</span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-10 leading-[0.9] tracking-tighter uppercase">
                        {t("run_your")} <br />
                        <span className="text-slate-400">{t("business_anywhere")}</span>
                    </h2>

                    <p className="text-base text-slate-500 mb-14 leading-relaxed font-medium max-w-xl">
                        {t("app_desc")}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
                        {appFeatures.map((item, i) => (
                            <div key={i} className={`flex items-center gap-4 bg-white/3 border border-white/5 p-5 rounded-2xl hover:bg-white/10 transition-all duration-500 ${language === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white shrink-0">
                                    <item.icon size={20} />
                                </div>
                                <div>
                                    <p className="text-[12px] font-black text-white uppercase tracking-tighter">{item.title}</p>
                                    <p className="text-[10px] text-slate-500 font-medium">{item.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                <div className="relative flex justify-center lg:justify-end">
                    <div className="relative z-10 w-full max-w-[320px]">
                        {/* Compact Mobile Mockup */}
                        <div className="bg-slate-800 rounded-[3rem] p-3 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] border border-slate-700">
                            <div className="bg-white rounded-[2.5rem] aspect-[9/19.5] overflow-hidden relative shadow-inner">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-8">
                                        <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-[10px] font-black">G</span>
                                        </div>
                                        <div className="w-8 h-2 bg-slate-100 rounded-full"></div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t("total_sales")}</p>
                                            <p className="text-xl font-black text-slate-950 tracking-tighter">QAR 12,450.00</p>
                                        </div>

                                        {/* Simple SVG Chart */}
                                        <div className="h-20 w-full bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden p-2">
                                            <svg className="w-full h-full text-blue-600" viewBox="0 0 100 40" fill="none" preserveAspectRatio="none">
                                                <path d="M0 35 C 20 30, 40 10, 60 25 S 80 5, 100 15V40H0Z" fill="currentColor" fillOpacity="0.1" />
                                                <path d="M0 35 C 20 30, 40 10, 60 25 S 80 5, 100 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                <circle cx="100" cy="15" r="3" fill="currentColor" />
                                            </svg>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                                <p className="text-[7px] font-black text-slate-400 uppercase">{t("orders")}</p>
                                                <p className="text-sm font-black text-slate-900">142</p>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                                <p className="text-[7px] font-black text-slate-400 uppercase">{t("visits")}</p>
                                                <p className="text-sm font-black text-slate-900">2.1K</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <p className="text-[7px] font-black text-slate-400 uppercase">{t("recent_activity")}</p>
                                            {[1, 2].map((i) => (
                                                <div key={i} className="flex justify-between items-center p-2 bg-white rounded-lg border border-slate-50 shadow-sm">
                                                    <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-[8px] font-bold">#{840 + i}</div>
                                                    <div className="w-20 h-1.5 bg-slate-100 rounded-full"></div>
                                                    <div className="w-8 h-1.5 bg-emerald-100 rounded-full"></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {/* Mock Navigation */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 flex justify-around">
                                    <div className="w-5 h-5 bg-blue-600 rounded"></div>
                                    <div className="w-5 h-5 bg-slate-100 rounded"></div>
                                    <div className="w-5 h-5 bg-slate-100 rounded"></div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Interaction UI */}
                        <div className={`absolute top-1/2 ${language === 'ar' ? '-right-12' : '-left-12'} bg-white/95 backdrop-blur-xl p-4 rounded-xl shadow-2xl border border-white/20 hidden md:block animate-bounce-slow`}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                                    <CheckCircle2 size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">Order #842</p>
                                    <p className="text-[9px] text-slate-500">{t("shipped_successfully")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
