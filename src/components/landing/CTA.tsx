"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function CTA() {
    const { t, language } = useLanguage();

    return (
        <section className="section-padding py-24">
            <div className="bg-slate-950 rounded-[3rem] p-8 md:p-24 overflow-hidden relative group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] border border-white/5">
                {/* Background effect */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] group-hover:bg-white/10 transition-all duration-1000" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-800/20 rounded-full blur-[100px]" />

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <Sparkles size={12} />
                        <span>{t("noir_design_protocol")}</span>
                    </div>

                    <h2 className="text-4xl md:text-7xl font-black text-white mb-10 max-w-4xl leading-[0.9] tracking-tighter uppercase">
                        {t("launch_empire")} <br />
                        <span className="text-slate-400 font-medium">{t("in_record_time")}</span>
                    </h2>

                    <p className="text-slate-400 text-sm md:text-base mb-12 max-w-xl leading-relaxed font-medium">
                        {t("cta_desc")}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
                        <Link href="/get-started" className="bg-white text-slate-950 px-12 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-2xl hover:bg-slate-100 flex items-center justify-center gap-2">
                            {t("build_your_store")} <ArrowRight size={18} className={language === 'ar' ? 'rotate-180' : ''} />
                        </Link>
                        <Link href="/contact" className="bg-transparent text-white border-2 border-white/20 px-12 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all hover:bg-white/10 flex items-center justify-center">
                            {t("contact_sales")}
                        </Link>
                    </div>

                    <div className="mt-20 pt-10 border-t border-white/5 w-full">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-10">{t("trusted_by")}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                            <div className="text-xl font-black text-white italic tracking-tighter opacity-50 hover:opacity-100 transition-opacity">Luxe.</div>
                            <div className="text-xl font-bold text-white opacity-50 hover:opacity-100 transition-opacity">UrbanDecor</div>
                            <div className="text-xl font-extrabold text-white tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity">Nova</div>
                            <div className="text-xl font-medium text-white tracking-[0.2em] opacity-50 hover:opacity-100 transition-opacity">TECH_CORE</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
