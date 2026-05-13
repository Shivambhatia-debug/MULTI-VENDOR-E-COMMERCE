"use client";

import React, { useState, useEffect } from 'react';
import { Smartphone, Sparkles, ShoppingBag, ArrowRight, Zap, Home, Plus, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const SCREENS = [
    { id: 'splash', label: 'Launch' },
    { id: 'home', label: 'Storefront' },
    { id: 'shop', label: 'Marketplace' }
];

export default function ShowcaseMockup() {
    const [activeScreen, setActiveScreen] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveScreen((prev) => (prev + 1) % SCREENS.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative group perspective-1000">
            {/* Ambient Glow */}
            <div className="absolute -inset-20 bg-blue-500/5 rounded-[100px] blur-[120px] -z-10 group-hover:bg-blue-500/10 transition-colors duration-1000" />

            <div className="w-[280px] h-[580px] bg-slate-950 rounded-[55px] border-[10px] border-slate-950 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden relative transition-all duration-700 ring-1 ring-slate-800">
                {/* Internal UI Shell */}
                <div className="h-full w-full bg-white relative overflow-hidden">
                    
                    {/* Screen 0: SPLASH */}
                    {activeScreen === 0 && (
                        <motion.div 
                            key="splash"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-blue-600 flex flex-col items-center justify-center p-8 text-center"
                        >
                            <div className="w-20 h-20 bg-white rounded-3xl shadow-2xl flex items-center justify-center p-4 relative overflow-hidden mb-6">
                                <Sparkles size={32} className="text-blue-600" />
                            </div>
                            <h3 className="text-white text-lg font-black uppercase tracking-tighter">GOLALITA.</h3>
                            <div className="mt-8 w-12 h-1 bg-white/20 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-white"
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 4, ease: "linear" }}
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Screen 1: HOME */}
                    {activeScreen === 1 && (
                        <motion.div 
                            key="home"
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="absolute inset-0 bg-white flex flex-col"
                        >
                            <div className="pt-12 px-5 pb-3 flex justify-between items-center bg-white/90 backdrop-blur-md">
                                <div className="w-6 h-6 rounded-lg bg-slate-950 flex items-center justify-center text-white"><Sparkles size={12} /></div>
                                <div className="flex gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><ShoppingBag size={10} /></div>
                                </div>
                            </div>
                            <div className="p-5 space-y-6 overflow-y-auto no-scrollbar">
                                <div className="h-32 w-full rounded-[2rem] bg-slate-950 p-5 relative overflow-hidden">
                                    <div className="absolute right-0 top-0 w-24 h-24 bg-blue-600 rounded-full blur-3xl opacity-30" />
                                    <div className="relative z-10 h-full flex flex-col justify-between">
                                        <p className="text-[6px] font-black text-white/40 uppercase tracking-widest">New Collection</p>
                                        <h4 className="text-sm font-black text-white uppercase tracking-tighter leading-none">Design Your<br/>Storefront.</h4>
                                        <div className="px-3 py-1 bg-blue-600 rounded-full text-[6px] font-black text-white uppercase w-fit">Shop Now</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {['New', 'Sale', 'Hot', 'Top'].map((c, i) => (
                                        <div key={i} className="flex flex-col items-center gap-1.5">
                                            <div className="w-full aspect-square rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                                {i === 0 ? <Sparkles size={12} /> : i === 1 ? <Zap size={12} /> : i === 2 ? <ArrowRight size={12} /> : <ShoppingBag size={12} />}
                                            </div>
                                            <span className="text-[6px] font-black text-slate-400 uppercase">{c}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="aspect-[4/3] w-full rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden relative">
                                    <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400" className="w-full h-full object-cover" alt="P" />
                                    <div className="absolute bottom-3 left-3">
                                        <p className="text-[8px] font-black text-white uppercase drop-shadow-md">Kinetic v1</p>
                                        <p className="text-[6px] font-bold text-white/80 uppercase">299 QAR</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Screen 2: SHOP */}
                    {activeScreen === 2 && (
                        <motion.div 
                            key="shop"
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="absolute inset-0 bg-slate-50 flex flex-col"
                        >
                            <div className="pt-12 px-5 pb-5 bg-white border-b border-slate-100">
                                <h4 className="text-xs font-black text-slate-950 uppercase tracking-tighter mb-3">Marketplace</h4>
                                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                    {['All', 'Hot', 'New'].map((t, i) => (
                                        <div key={i} className={`px-4 py-1.5 rounded-full text-[6px] font-black uppercase ${i === 0 ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-400'}`}>{t}</div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-4 grid grid-cols-2 gap-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                                        <div className="aspect-square bg-slate-50 rounded-xl relative overflow-hidden">
                                            <img src={`https://images.unsplash.com/photo-${i === 1 ? '1542291026-7eec264c27ff' : i === 2 ? '1523275335684-37898b6baf30' : i === 3 ? '1505740420928-5e560c06d30e' : '1572635196237-14b3f281503f'}?q=80&w=200`} className="w-full h-full object-cover" alt="P" />
                                        </div>
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-[7px] font-black text-slate-950 uppercase truncate">Item {i}</span>
                                            <Plus size={8} className="text-blue-600" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Global Tab Bar Mockup */}
                    {activeScreen !== 0 && (
                        <div className="absolute bottom-0 inset-x-0 p-5 bg-white/90 backdrop-blur-md border-t border-slate-50 flex justify-between items-center">
                            {[Home, ShoppingBag, Sparkles, UserCircle].map((Icon, i) => (
                                <div key={i} className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${i === (activeScreen === 1 ? 0 : 1) ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-300'}`}>
                                    <Icon size={activeScreen === 0 ? 12 : 14} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Notch/Status Bar */}
                    <div className="absolute top-0 inset-x-0 h-6 flex justify-between items-center px-8 z-50">
                        <span className={`text-[8px] font-bold ${activeScreen === 0 ? 'text-white/40' : 'text-slate-300'}`}>9:41</span>
                        <div className={`flex gap-1.5 items-center ${activeScreen === 0 ? 'text-white/40' : 'text-slate-300'}`}>
                            <div className="w-3 h-1.5 rounded-sm border border-current" />
                            <div className="w-2.5 h-1.5 bg-current rounded-[1px]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Indicators */}
            <div className="hidden lg:flex absolute -right-24 top-1/4 flex-col gap-3">
                {SCREENS.map((s, i) => (
                    <div
                        key={s.id}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-500 border ${activeScreen === i ? 'bg-slate-950 border-slate-950 text-white shadow-2xl translate-x-3' : 'bg-white/80 backdrop-blur border-slate-100 text-slate-400 opacity-40'}`}
                    >
                        {s.label}
                    </div>
                ))}
            </div>

            {/* Progress Dots */}
            <div className="flex gap-4 mt-12 justify-center">
                {SCREENS.map((_, i) => (
                    <div key={i} className="w-12 h-0.5 bg-slate-100 rounded-full overflow-hidden">
                        {activeScreen === i && (
                            <motion.div
                                className="h-full bg-slate-950"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 4, ease: "linear" }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
