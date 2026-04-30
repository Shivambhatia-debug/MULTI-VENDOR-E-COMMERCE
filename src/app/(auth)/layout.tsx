"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-900/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <div className="flex flex-col items-center mb-10">
                    <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
                        <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center shadow-2xl shadow-slate-900/20 border border-white/10">
                            <span className="text-white font-black text-xl">G</span>
                        </div>
                        <span className="text-2xl font-black tracking-tighter uppercase text-slate-950">
                            Golalita
                        </span>
                    </Link>
                </div>

                {/* Auth Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white border border-slate-200 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] p-10"
                >
                    {children}
                </motion.div>

                {/* Footer Links */}
                <div className="mt-8 text-center px-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                        Professional SaaS Infrastructure <br />
                        © 2024 Golalita OS. All Rights Reserved.
                    </p>
                </div>
            </div>
        </main>
    );
}
