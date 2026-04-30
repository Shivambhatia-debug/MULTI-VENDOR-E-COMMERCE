"use client";

import Link from "next/link";
import { ArrowRight, Play, Zap, ShieldCheck, Sparkles, Orbit } from "lucide-react";
import { motion } from "framer-motion";
import ShowcaseMockup from "./ShowcaseMockup";

export default function Hero() {
    return (
        <section className="relative pt-40 pb-32 overflow-hidden bg-white">
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <div className="section-padding py-0 relative z-10 flex flex-col items-center text-center">
                {/* Noir Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="inline-flex items-center gap-3 px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-12 shadow-sm"
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-pulse" />
                    <span>E-Commerce Store Builder v3.0</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "anticipate" }}
                    className="text-6xl lg:text-[8rem] font-black text-slate-950 leading-[0.85] mb-12 tracking-tighter max-w-7xl uppercase"
                >
                    The New Standard for <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-900">Modern Selling</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-base lg:text-xl text-slate-500 mb-16 leading-relaxed font-medium max-w-3xl"
                >
                    Create a beautiful online store in minutes. One platform for all your products, <br className="hidden lg:block" />
                    payments, and global customers.
                </motion.p>

                <div className="flex flex-col sm:flex-row gap-6 mb-24">
                    <Link href="/products" className="btn-primary px-12 py-5 text-[11px] shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
                        Browse Marketplace
                    </Link>
                    <Link href="/get-started" className="btn-secondary px-12 py-5 text-[11px]">
                        Create Your Store
                    </Link>
                </div>

                {/* Showcase Mockup Visual */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 1 }}
                    className="relative w-full max-w-4xl flex flex-col items-center mt-10"
                >
                    <ShowcaseMockup />

                    {/* Visual Props */}
                    <div className="absolute top-1/2 -left-32 -translate-y-1/2 hidden xl:flex flex-col gap-12 items-end">
                        <motion.div
                            whileHover={{ x: 10 }}
                            className="space-y-3 text-right group cursor-help"
                        >
                            <div className="p-4 bg-white/80 backdrop-blur-md shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] rounded-2xl border border-slate-100 flex items-center justify-center text-slate-900 group-hover:bg-slate-950 group-hover:text-white transition-all duration-500"><Orbit size={24} /></div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-950 transition-colors">Global Infrastructure</p>
                        </motion.div>
                        <div className="h-24 w-px bg-slate-100 mr-6" />
                        <motion.div
                            whileHover={{ x: 10 }}
                            className="space-y-3 text-right group cursor-help"
                        >
                            <div className="p-4 bg-white/80 backdrop-blur-md shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] rounded-2xl border border-slate-100 flex items-center justify-center text-slate-900 group-hover:bg-slate-950 group-hover:text-white transition-all duration-500"><ShieldCheck size={24} /></div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-950 transition-colors">Secure Protocol</p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Proof Line */}
                <div className="mt-32 w-full max-w-5xl border-t border-slate-100 pt-16 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    <div className="space-y-2">
                        <p className="text-3xl font-black text-slate-950">5K+</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">Happy <br /> Merchants</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-3xl font-black text-slate-950">99.9%</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">Uptime <br /> Guaranteed</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-3xl font-black text-slate-950">140+</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">Global <br /> Markets</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-3xl font-black text-slate-950">24/7</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">Expert <br /> Support</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
