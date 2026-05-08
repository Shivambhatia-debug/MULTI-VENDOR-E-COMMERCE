"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Star, ArrowRight, Package, Globe, ShieldCheck, MapPin, Users, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StoresPage() {
    const [stores, setStores] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const res = await fetch("/api/python/public/stores");
                if (res.ok) {
                    const data = await res.json();
                    setStores(data);
                }
            } catch (error) {
                console.error("Failed to fetch stores:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStores();
    }, []);

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
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-blue-600" size={40} />
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading Elite Stores...</p>
                    </div>
                ) : stores.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-slate-200">
                        <Package size={60} className="mx-auto text-slate-100 mb-6" />
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-950 mb-2">No Stores Deployed Yet</h3>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Be the first to launch your masterpiece.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {stores.map((store, idx) => (
                            <motion.div
                                key={store.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700"
                            >
                                {/* Cover & Brand Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={store.hero_image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8"}
                                        alt={store.store_name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0 opacity-80"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                                    <div className="absolute inset-0 p-10 flex flex-col justify-end">
                                        <div className="flex items-center gap-4 mb-4">
                                            {store.logo_url ? (
                                                <img src={store.logo_url} alt="Logo" className="w-16 h-16 object-contain bg-white rounded-2xl border-4 border-white/20 shadow-2xl p-2" />
                                            ) : (
                                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border-4 border-white/20 shadow-2xl" style={{ backgroundColor: store.primary_color }}>
                                                    <Package size={32} className="text-white" />
                                                </div>
                                            )}
                                            <div>
                                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-2">{store.store_name}</h2>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1">
                                                        <Star size={10} className="fill-amber-400 text-amber-400" />
                                                        <span className="text-[10px] font-black text-white">{store.rating ? store.rating.toFixed(1) : '5.0'}</span>
                                                    </div>
                                                    <span className="w-1 h-1 bg-white/30 rounded-full" />
                                                    <span className="text-[9px] font-black text-white uppercase tracking-widest opacity-60">{store.category || 'Retail'} Store</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Store Stats & Entry */}
                                <div className="p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="grid grid-cols-3 gap-8 flex-1">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Inventory</p>
                                            <div className="flex items-center gap-2">
                                                <Package size={14} className="text-blue-500" />
                                                <span className="text-sm font-black text-slate-950 tracking-tight">{store.products_count || 0} Items</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Community</p>
                                            <div className="flex items-center gap-2">
                                                <Users size={14} className="text-indigo-500" />
                                                <span className="text-sm font-black text-slate-950 tracking-tight">{store.reviews || 0} Reviews</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck size={14} className="text-emerald-500" />
                                                <span className="text-sm font-black text-slate-950 tracking-tight">Verified</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/stores/${store.subdomain || store.id}`}
                                        className="w-full md:w-auto px-10 py-4 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl"
                                        style={{ backgroundColor: store.primary_color || '#0f172a' }}
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
                )}
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

        </main>
    );
}
