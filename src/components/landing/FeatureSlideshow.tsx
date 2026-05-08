"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function FeatureSlideshow() {
    const [current, setCurrent] = useState(0);
    const { t, language } = useLanguage();

    const slides = [
        {
            title: t("slide_store_builder"),
            desc: t("slide_store_builder_desc"),
            image: "/noir_store_builder_mockup.png",
            accent: "bg-slate-950"
        },
        {
            title: t("slide_sell_everywhere"),
            desc: t("slide_sell_everywhere_desc"),
            image: "/marketplace_hero.png",
            accent: "bg-slate-950"
        },
        {
            title: t("slide_manage_store"),
            desc: t("slide_manage_store_desc"),
            image: "/merchant_console_hero.png",
            accent: "bg-slate-950"
        },
        {
            title: t("slide_choose_plan"),
            desc: t("slide_choose_plan_desc"),
            image: "/logistics_hero.png",
            accent: "bg-slate-950"
        },
        {
            title: t("slide_merchant_app"),
            desc: t("slide_merchant_app_desc"),
            image: "/mobile_app_hero.png",
            accent: "bg-slate-950"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const next = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <section className="relative h-screen w-full overflow-hidden bg-black flex items-center pt-20">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 1.2, ease: "circOut" }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src={slides[current].image}
                        alt={slides[current].title}
                        fill
                        className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                </motion.div>
            </AnimatePresence>

            <div className={`section-padding relative z-10 w-full mb-32 ${language === 'ar' ? 'text-right' : ''}`}>
                <div className={`max-w-4xl ${language === 'ar' ? 'mr-auto' : ''}`}>
                    <motion.div
                        key={`title-${current}`}
                        initial={{ opacity: 0, x: language === 'ar' ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6 block">{t("feature_spotlight")}</span>
                        <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-[7rem] font-black text-white leading-[0.8] tracking-tighter mb-8 uppercase">
                            {slides[current].title}
                        </h2>
                        <p className="text-xl text-slate-400 font-medium max-w-2xl mb-12 leading-relaxed">
                            {slides[current].desc}
                        </p>

                        <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 ${language === 'ar' ? 'sm:flex-row-reverse' : ''}`}>
                            <button className="bg-white text-black px-12 py-5 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-slate-100 transition-all shadow-2xl w-full sm:w-auto justify-center">
                                {t("explore_detail")} <ArrowRight size={18} className={language === 'ar' ? 'rotate-180' : ''} />
                            </button>
                            <div className="flex items-center gap-4">
                                <button onClick={prev} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                                    <ChevronLeft size={20} />
                                </button>
                                <button onClick={next} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Slider Indicator */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-4 z-20">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-1 rounded-full transition-all duration-500 ${current === i ? "w-20 bg-white" : "w-8 bg-white/20"}`}
                    />
                ))}
            </div>
        </section>
    );
}
