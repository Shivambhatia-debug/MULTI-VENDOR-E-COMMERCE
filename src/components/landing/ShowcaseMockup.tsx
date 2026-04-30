"use client";

import React, { useState, useEffect } from 'react';
import { Smartphone, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PRESETS = [
    { name: "Modern", color: "#000000", bg: "#ffffff" },
    { name: "Classic", color: "#0f172a", bg: "#f8fafc" },
    { name: "Dark", color: "#ffffff", bg: "#0f172a" },
    { name: "Clean", color: "#1e293b", bg: "#ffffff" }
];

export default function ShowcaseMockup() {
    const [activePreset, setActivePreset] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActivePreset((prev) => (prev + 1) % PRESETS.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const preset = PRESETS[activePreset];

    return (
        <div className="relative group perspective-1000">
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-slate-200/50 rounded-[60px] blur-3xl -z-10 group-hover:bg-slate-300/50 transition-colors duration-1000" />

            <div className="w-[280px] h-[580px] bg-slate-900 rounded-[55px] border-[10px] border-slate-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden relative transition-all duration-700">
                <div
                    className="h-full w-full flex flex-col transition-all duration-1000"
                    style={{ backgroundColor: preset.bg, color: preset.color }}
                >
                    {/* Mock Nav */}
                    <nav className="p-5 flex justify-between items-center bg-transparent">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: activePreset === 2 ? '#3b82f6' : preset.color }}>
                                <Sparkles size={12} />
                            </div>
                            <span className="text-xs font-black tracking-tighter uppercase">GOLALITA.</span>
                        </div>
                        <ShoppingBag size={14} className="opacity-40" />
                    </nav>

                    {/* Mock Hero Content */}
                    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
                        <span className="text-[6px] font-black uppercase tracking-[0.4em] opacity-40">Spring Collection 2026</span>
                        <h3 className="text-2xl font-black tracking-tighter uppercase leading-[0.85]">
                            Design Your <br />
                            <span className={activePreset === 2 ? 'text-white' : 'opacity-40'}>Store.</span>
                        </h3>
                        <div className="w-8 h-px bg-current opacity-20 my-2" />
                    </div>

                    {/* Mock Product Preview */}
                    <div className="p-4 pt-0">
                        <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 relative group/img">
                            <img
                                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400"
                                className="w-full h-full object-cover grayscale-[0.2] group-hover/img:scale-110 transition-transform duration-700"
                                alt="P"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/20 to-transparent">
                                <div className="flex justify-between items-end text-white">
                                    <div className="space-y-0.5">
                                        <p className="text-[6px] font-black uppercase opacity-60">Gear / 01</p>
                                        <p className="text-[10px] font-black uppercase tracking-tighter">Kinetic V1</p>
                                    </div>
                                    <span className="text-[10px] font-black">$299</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Bar Mockup */}
                <div className="absolute top-0 inset-x-0 h-6 bg-transparent flex justify-between items-center px-8 z-50">
                    <span className="text-[8px] font-bold opacity-30">9:41</span>
                    <div className="flex gap-1.5 opacity-30 items-center">
                        <div className="w-3 h-1.5 rounded-sm border border-current" />
                        <div className="w-2.5 h-1.5 bg-current rounded-[1px]" />
                    </div>
                </div>
            </div>

            {/* Floating Layout Tags */}
            <div className="absolute -right-20 top-1/4 flex flex-col gap-3">
                {PRESETS.map((p, i) => (
                    <div
                        key={p.name}
                        className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-500 border ${activePreset === i ? 'bg-slate-900 border-slate-900 text-white shadow-2xl translate-x-3' : 'bg-white/80 backdrop-blur border-slate-200 text-slate-400 opacity-40'
                            }`}
                    >
                        {p.name}
                    </div>
                ))}
            </div>
            {/* Progress Dots Indicator */}
            <div className="flex gap-4 mt-12 justify-center">
                {PRESETS.map((_, i) => (
                    <div key={i} className="w-10 h-0.5 bg-slate-100 rounded-full overflow-hidden">
                        {activePreset === i && (
                            <motion.div
                                className="h-full bg-slate-900"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 3, ease: "linear" }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
