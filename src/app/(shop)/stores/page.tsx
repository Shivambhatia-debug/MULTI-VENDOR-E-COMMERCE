"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { merchants } from "@/lib/data";
import { Star, ArrowRight, Package, Globe, ShieldCheck, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function StoresPage() {
    return (
        <main className="min-h-screen bg-[#f1f3f6]">
            <Navbar invert={true} />

            {/* Premium Header */}
            <header className="pt-32 pb-20 bg-white border-b border-slate-100 overflow-hidden relative">
                <div className="section-padding py-0">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 mb-6"
                        >
                            <span className="h-px w-8 bg-blue-600"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Elite Ecosystem</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl sm:text-7xl font-black text-slate-950 tracking-tighter leading-[0.9] uppercase mb-8"
                        >
                            Explore<br />
                            <span className="text-slate-300">Global Stores</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-sm font-bold text-slate-500 uppercase tracking-widest max-w-xl leading-relaxed"
                        >
                            Connect directly with verified merchants powered by Golalita Logis. Premium shopping experiences, localized for you.
                        </motion.p>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/30 -skew-x-12 translate-x-1/2 pointer-events-none" />
            </header>

            {/* Stores Grid */}
            <div className="section-padding py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {merchants.map((merchant, idx) => (
                        <motion.div
                            key={merchant.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700"
                        >
                            {/* Cover & Brand Image */}
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={merchant.coverImage || ""}
                                    alt={merchant.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0 opacity-80"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border-4 border-white/20 shadow-2xl">
                                            <Package size={32} className="text-slate-950" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-2">{merchant.name}</h2>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    <Star size={10} className="fill-amber-400 text-amber-400" />
                                                    <span className="text-[10px] font-black text-white">{merchant.rating}</span>
                                                </div>
                                                <span className="w-1 h-1 bg-white/30 rounded-full" />
                                                <span className="text-[9px] font-black text-white uppercase tracking-widest opacity-60">{merchant.category} Store</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Store Stats & Entry */}
                            <div className="p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="grid grid-cols-3 gap-8 flex-1">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Rank</p>
                                        <div className="flex items-center gap-2">
                                            <Globe size={14} className="text-blue-500" />
                                            <span className="text-sm font-black text-slate-950 tracking-tight">Top 1%</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Community</p>
                                        <div className="flex items-center gap-2">
                                            <Users size={14} className="text-indigo-500" />
                                            <span className="text-sm font-black text-slate-950 tracking-tight">{merchant.reviews}+</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Verified</p>
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck size={14} className="text-emerald-500" />
                                            <span className="text-sm font-black text-slate-950 tracking-tight">Level 5</span>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href={`/stores/${merchant.id}`}
                                    className="w-full md:w-auto px-10 py-4 bg-slate-950 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl"
                                >
                                    Enter Store <ArrowRight size={16} />
                                </Link>
                            </div>

                            {/* Fancy Hover Overlay Tag */}
                            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-2">
                                    <MapPin size={10} className="text-white" />
                                    <span className="text-[8px] font-black text-white uppercase tracking-widest">Open Now</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Platform USP - Stores Specific */}
            <section className="py-24 bg-slate-950 text-white overflow-hidden relative">
                <div className="section-padding py-0 relative z-10 text-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.6em] text-blue-400 mb-6 block">The Storefront Standard</span>
                    <h2 className="text-5xl font-black uppercase tracking-tighter italic mb-12">Every Store. A Masterpiece.</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                        <div>
                            <div className="text-3xl font-black text-blue-500 mb-2">01</div>
                            <h4 className="text-sm font-black uppercase tracking-widest mb-2">Integrated Payments</h4>
                            <p className="text-xs text-slate-400 font-bold leading-relaxed px-4">Accept 100+ local payment methods out of the box.</p>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-indigo-500 mb-2">02</div>
                            <h4 className="text-sm font-black uppercase tracking-widest mb-2">Global Logistics</h4>
                            <p className="text-xs text-slate-400 font-bold leading-relaxed px-4">Ships from 12 regional hubs with express delivery.</p>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-emerald-500 mb-2">03</div>
                            <h4 className="text-sm font-black uppercase tracking-widest mb-2">Real-time Data</h4>
                            <p className="text-xs text-slate-400 font-bold leading-relaxed px-4">Every store visitor, every click, tracked and optimized.</p>
                        </div>
                    </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
            </section>

            <Footer />
        </main>
    );
}
