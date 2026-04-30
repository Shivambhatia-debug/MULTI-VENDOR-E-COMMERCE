"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { merchants, products } from "@/lib/data";
import { Star, ShieldCheck, Zap, ArrowRight, Truck, Award, Globe, ShoppingBag, Info, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function MerchantLandingPage() {
    const params = useParams();
    const merchantId = params.merchantId as string;

    const merchant = merchants.find(m => m.id === merchantId);
    const featuredProducts = products.filter(p => p.merchantName === merchant?.name).slice(0, 3);

    if (!merchant) return <div>Store not found</div>;

    const storeFeatures = [
        { title: "Authentic Goods", desc: "Every item in our store is verified for 100% authenticity.", icon: ShieldCheck },
        { title: "Same Day Dispatch", desc: "Orders placed before 2 PM are dispatched within the same day.", icon: Truck },
        { title: "Global Warranty", desc: "Premium protection plans available for internal technology.", icon: Award },
        { title: "Concierge Support", desc: "Direct access to our brand experts for any assistance.", icon: Globe },
    ];

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Cinematic Hero Section */}
            <section className="relative h-screen flex items-center overflow-hidden">
                <Image
                    src={merchant.coverImage || ""}
                    alt={merchant.name}
                    fill
                    className="object-cover scale-105 group-hover:scale-100 transition-transform duration-[2000ms]"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
                <div className="absolute inset-0 bg-slate-950/20" />

                <div className="section-padding relative z-10 w-full">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-10 shadow-2xl border-4 border-white/20"
                        >
                            <ShoppingBag size={40} className="text-slate-950" />
                        </motion.div>

                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-[10px] font-black uppercase tracking-[0.6em] text-blue-400 mb-6 block"
                        >
                            Official Merchant Store
                        </motion.span>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-7xl sm:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-8 italic"
                        >
                            {merchant.name}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl font-medium text-slate-300 uppercase tracking-[0.2em] mb-12 leading-relaxed"
                        >
                            {merchant.slogan}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center gap-6"
                        >
                            <Link
                                href={`/stores/${merchant.id}/shop`}
                                className="w-full sm:w-auto px-12 py-5 bg-white text-slate-950 rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 border-b-4 border-slate-200 hover:border-blue-700"
                            >
                                Enter Official Store <ArrowRight size={20} />
                            </Link>
                            <div className="flex items-center gap-4 px-8 py-5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 text-white">
                                <div className="flex items-center gap-1.5 font-black">
                                    <Star size={16} className="fill-amber-400 text-amber-400" />
                                    <span>{merchant.rating}</span>
                                </div>
                                <span className="w-px h-4 bg-white/20" />
                                <span className="text-[10px] uppercase font-black tracking-widest">{merchant.reviews} Verified Reviews</span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/40 animate-bounce">
                    <span className="text-[8px] font-black uppercase tracking-[0.3em]">Scroll for Experience</span>
                    <ChevronRight size={14} className="rotate-90" />
                </div>
            </section>

            {/* Merchant Experience - Feature Swiper */}
            <section className="py-32 bg-slate-50 relative overflow-hidden">
                <div className="section-padding py-0 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {storeFeatures.map((feat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:shadow-xl transition-all group"
                            >
                                <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <feat.icon size={28} />
                                </div>
                                <h3 className="text-lg font-black text-slate-950 uppercase tracking-tighter mb-4">{feat.title}</h3>
                                <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-wider">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Collection Preview (Editor's Choice) */}
            <section className="py-32 bg-white">
                <div className="section-padding py-0">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                        <div className="max-w-2xl">
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-600 mb-4 block">Curated Excellence</span>
                            <h2 className="text-5xl font-black text-slate-950 uppercase tracking-tighter italic leading-none">The Artisan’s Selection</h2>
                        </div>
                        <Link href={`/stores/${merchant.id}/shop`} className="text-[10px] font-black uppercase tracking-widest text-slate-950 border-b-2 border-slate-950 pb-1 hover:text-blue-600 hover:border-blue-600 transition-all">
                            View Full Catalog
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {featuredProducts.map((p, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -12 }}
                                className="relative aspect-[4/5] rounded-[3rem] overflow-hidden group cursor-pointer shadow-2xl"
                            >
                                <Image src={p.image} alt={p.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-85" />
                                <div className="absolute inset-0 p-10 flex flex-col justify-end text-white">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">{p.category}</p>
                                    </div>
                                    <h4 className="text-3xl font-black uppercase tracking-tighter mb-4 leading-none">{p.name}</h4>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-black tracking-tight">QAR {p.price}</span>
                                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-slate-950 transition-all duration-500">
                                            <ArrowRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Merchant Story / Philosophy */}
            <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
                <div className="section-padding py-0 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="w-16 h-1 bg-blue-600 mx-auto mb-12" />
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic mb-10 leading-[0.9]">
                            We believe in delivering excellence to your doorstep.
                        </h2>
                        <p className="text-sm md:text-base font-bold text-slate-400 uppercase tracking-widest leading-loose max-w-2xl mx-auto mb-16">
                            Founded in 2024, {merchant.name} has been at the forefront of {merchant.category.toLowerCase()} innovation. Every product we list is part of a legacy of quality and precision. Trusted by over {merchant.reviews} individuals globally.
                        </p>
                        <Link
                            href={`/stores/${merchant.id}/shop`}
                            className="inline-flex items-center gap-4 px-12 py-5 bg-white text-slate-950 rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-blue-600/20 shadow-2xl active:scale-95"
                        >
                            Start Shopping <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
                {/* Abstract Background Element */}
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
            </section>

            <Footer />
        </main>
    );
}
