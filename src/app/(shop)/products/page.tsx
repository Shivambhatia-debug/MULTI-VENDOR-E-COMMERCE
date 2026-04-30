"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { products, merchants } from "@/lib/data";
import { Search, SlidersHorizontal, Package, ArrowRight, Zap, Target, Sparkles, Star, ShieldCheck, ChevronRight, Smartphone, Clock, Award, Flame, BarChart3 } from "lucide-react";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import HorizontalScroller from "@/components/product/HorizontalScroller";

export default function ProductsPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const categories = [
        { name: "All", ar: "الكل", icon: Sparkles },
        { name: "Electronics", ar: "إلكترونيات", icon: Smartphone },
        { name: "Apparel", ar: "ملابس", icon: ShieldCheck },
        { name: "Home & Living", ar: "المنزل", icon: Target },
        { name: "Accessories", ar: "إكسسوارات", icon: Zap }
    ];

    // Filtered products for specific category view
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    const trendingProducts = products.filter((_, i) => i < 10);
    const electronicsProducts = products.filter(p => p.category === "Electronics");
    const fashionProducts = products.filter(p => p.category === "Apparel");

    // Internal components for clean layout
    const CategoryGridCard = ({ title, items, linkText }: { title: string, items: { name: string, image: string, href: string }[], linkText: string }) => (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter mb-4 italic leading-tight">{title}</h3>
            <div className="grid grid-cols-2 gap-4 flex-1">
                {items.map((item, i) => (
                    <Link key={i} href={item.href} className="group/item flex flex-col gap-2">
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 border border-slate-50">
                            <Image src={item.image} alt={item.name} fill className="object-cover group-hover/item:scale-110 transition-transform duration-500" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 line-clamp-1">{item.name}</span>
                    </Link>
                ))}
            </div>
            <Link href="/products" className="mt-6 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline inline-flex items-center gap-2">
                {linkText} <ArrowRight size={12} />
            </Link>
        </div>
    );

    return (
        <main className="min-h-screen bg-[#f1f3f6]">
            <Navbar />

            {/* Sub-Navbar / Quick Category Bar (Flipkart Style) */}
            <div className="pt-16 bg-white border-b border-slate-100 shadow-sm sticky top-0 z-40">
                <div className="section-padding py-2 overflow-x-auto no-scrollbar">
                    <div className="flex items-center justify-between gap-6 min-w-max mx-auto max-w-6xl">
                        {categories.map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`flex flex-col items-center gap-1.5 group transition-all ${selectedCategory === cat.name ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedCategory === cat.name ? "bg-blue-600 text-white shadow-lg" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"}`}>
                                    <cat.icon size={18} strokeWidth={selectedCategory === cat.name ? 2.5 : 2} />
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest ${selectedCategory === cat.name ? "text-blue-600" : "text-slate-500"}`}>{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="section-padding py-8">
                <AnimatePresence mode="wait">
                    {selectedCategory === "All" && searchQuery === "" ? (
                        /* DISCOVERY VIEW (Amazon/Flipkart Style) */
                        <motion.div
                            key="home"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-8"
                        >
                            {/* Hero & Category Cards Hybrid Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                {/* Main Hero Slider */}
                                <div className="lg:col-span-3 bg-white rounded-2xl relative overflow-hidden group shadow-xl h-[400px]">
                                    <div className="absolute inset-0 z-10 p-12 flex flex-col justify-center max-w-lg">
                                        <motion.span
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-2"
                                        >
                                            <Sparkles size={12} className="fill-blue-600" /> New Collection 2026
                                        </motion.span>
                                        <motion.h2
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="text-5xl font-black text-slate-950 tracking-tighter uppercase leading-[0.9] mb-8 italic"
                                        >
                                            Upgrade your<br />
                                            <span className="text-blue-600">Digital Life</span>
                                        </motion.h2>
                                        <div className="flex gap-4">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                className="bg-slate-950 text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl"
                                            >
                                                Shop the Hub
                                            </motion.button>
                                            <motion.button
                                                className="bg-slate-100 text-slate-900 px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                                            >
                                                View Catalog
                                            </motion.button>
                                        </div>
                                    </div>
                                    {/* Abstract background elements for premium feel */}
                                    <div className="absolute right-0 top-0 w-1/2 h-full bg-slate-50" />
                                    <div className="absolute -right-20 bottom-0 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px]" />
                                    <div className="absolute right-20 top-20 text-slate-100 transform rotate-12 opacity-50">
                                        <Package size={200} />
                                    </div>
                                </div>

                                {/* Quick Shop Card */}
                                <div className="lg:col-span-1">
                                    <CategoryGridCard
                                        title="Pick up where you left off"
                                        linkText="See your full history"
                                        items={[
                                            { name: "Tech", image: products[0].image, href: "/products/1" },
                                            { name: "Style", image: products[1].image, href: "/products/2" },
                                            { name: "Living", image: products[2].image, href: "/products/3" },
                                            { name: "Wear", image: products[3].image, href: "/products/4" }
                                        ]}
                                    />
                                </div>
                            </div>

                            {/* Multi-Grid Category Row (Amazon Style) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <CategoryGridCard
                                    title="Most-Loved Styles"
                                    linkText="Explore Fashion"
                                    items={fashionProducts.slice(0, 4).map(p => ({
                                        name: p.name,
                                        image: p.image,
                                        href: `/products/${p.id}`
                                    }))}
                                />
                                <CategoryGridCard
                                    title="Gaming & Pro Tech"
                                    linkText="Upgrade Now"
                                    items={electronicsProducts.slice(0, 4).map(p => ({
                                        name: p.name,
                                        image: p.image,
                                        href: `/products/${p.id}`
                                    }))}
                                />
                                <div className="bg-[#fb641b] rounded-2xl p-8 flex flex-col justify-between text-white shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer">
                                    <div>
                                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                                            <Flame size={20} className="fill-white" />
                                        </div>
                                        <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-3 italic">Flash<br />Deals</h3>
                                        <p className="text-[10px] text-white/70 font-black uppercase tracking-[0.2em]">Limited Inventory</p>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div className="text-4xl font-black italic tracking-tighter">70% OFF</div>
                                        <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                                    </div>
                                    <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                                </div>
                                <CategoryGridCard
                                    title="Home Decor & More"
                                    linkText="Refresh Home"
                                    items={products.filter(p => p.category === "Home & Living").slice(0, 4).map(p => ({
                                        name: p.name,
                                        image: p.image,
                                        href: `/products/${p.id}`
                                    }))}
                                />
                            </div>

                            {/* Horizontal Product Scroller (Best Sellers) */}
                            <HorizontalScroller
                                title="Best Sellers of 2026"
                                subtitle="Top performing items from verified merchants"
                            >
                                {trendingProducts.map(p => (
                                    <div key={p.id} className="w-[280px] shrink-0">
                                        <ProductCard product={p} />
                                    </div>
                                ))}
                            </HorizontalScroller>

                            {/* Row 2: Storefronts Spotlight */}
                            <section className="py-12 overflow-hidden bg-white -mx-6 px-10 rounded-[2rem] sm:rounded-[4rem] relative shadow-2xl border border-slate-100">
                                <div className="relative z-10">
                                    <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8 text-center md:text-left">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                                <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.4em]">Verified Logistics</span>
                                            </div>
                                            <h2 className="text-4xl md:text-5xl font-black text-slate-950 uppercase tracking-tighter leading-none italic">Partner Stores</h2>
                                        </div>
                                        <div className="flex flex-col items-center md:items-end gap-4">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-xs md:text-right">
                                                Discover stores with express delivery and world-class support.
                                            </p>
                                            <Link href="/stores" className="px-8 py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl flex items-center gap-2">
                                                View All Stores <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar">
                                        {merchants.map((m, i) => (
                                            <Link
                                                key={i}
                                                href={`/stores/${m.id}`}
                                                className="min-w-[280px] bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 group hover:bg-white hover:shadow-xl transition-all cursor-pointer block"
                                            >
                                                <div className="w-16 h-16 bg-white rounded-[1.5rem] mb-6 flex items-center justify-center shadow-sm">
                                                    <Package className="text-blue-600" size={32} />
                                                </div>
                                                <h4 className="text-lg font-black text-slate-950 uppercase tracking-tight mb-2 group-hover:text-blue-600">{m.name}</h4>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Star size={10} className="fill-amber-400 text-amber-400" />
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Top Rated Store</span>
                                                    </div>
                                                    <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 transition-all group-hover:translate-x-1" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
                            </section>

                            {/* Hot Deals Scroller */}
                            <HorizontalScroller
                                title="Deals on Gadgets"
                                subtitle="Upgrade your setup with these price cuts"
                            >
                                {electronicsProducts.map(p => (
                                    <div key={p.id} className="w-[300px] shrink-0">
                                        <ProductCard product={p} />
                                    </div>
                                ))}
                            </HorizontalScroller>
                        </motion.div>
                    ) : (
                        /* GRID SEARCH VIEW */
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm min-h-[600px]"
                        >
                            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">
                                        {selectedCategory} <span className="text-slate-300">Catalog</span>
                                    </h2>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Showing {filteredProducts.length} Results</p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                                    <div className="relative w-full sm:w-80">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search items..."
                                            className="w-full bg-slate-50 border-none rounded-full pl-12 pr-6 py-4 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-slate-950 transition-all shadow-inner placeholder:uppercase placeholder:tracking-widest"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                                            <SlidersHorizontal size={14} />
                                            <span>Filters</span>
                                        </button>
                                        <button onClick={() => setSelectedCategory("All")} className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 transition-all">
                                            <Package size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {filteredProducts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                                    {filteredProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-24 text-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                                        <Package size={40} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">No Items Found</h3>
                                    <p className="text-sm text-slate-400 font-bold max-w-xs mx-auto">Try a different keyword or category.</p>
                                    <button onClick={() => { setSelectedCategory("All"); setSearchQuery("") }} className="mt-8 px-8 py-3 bg-slate-950 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Clear Search</button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Banner Pairs (Marketplace Experience) */}
            <section className="section-padding py-0 mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
                    <div className="bg-[#fb641b] rounded-3xl p-10 relative overflow-hidden group cursor-pointer shadow-xl">
                        <div className="relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full mb-6 inline-block">Flash Deals</span>
                            <h3 className="text-4xl font-black uppercase tracking-tighter italic mb-4 leading-none">Summer Fashion<br />Stock Clearance</h3>
                            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white pb-1 group-hover:gap-4 transition-all">Shop Now <ArrowRight size={14} /></button>
                        </div>
                        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
                    </div>
                    <div className="bg-[#2874f0] rounded-3xl p-10 relative overflow-hidden group cursor-pointer shadow-xl">
                        <div className="relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full mb-6 inline-block">Daily Pick</span>
                            <h3 className="text-4xl font-black uppercase tracking-tighter italic mb-4 leading-none">Smart Home<br />Essentials 2026</h3>
                            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white pb-1 group-hover:gap-4 transition-all">Explore <ArrowRight size={14} /></button>
                        </div>
                        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
                    </div>
                </div>
            </section>

            {/* Quality Commitment Section */}
            <section className="py-24 bg-white border-t border-slate-100">
                <div className="section-padding py-0">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        {[
                            { title: "Global Logistics", desc: "Express delivery powered by Logis infrastructure.", icon: Clock },
                            { title: "Verified Brands", desc: "Every merchant undergoes rigorous quality checks.", icon: Award },
                            { title: "Real-time Tracking", desc: "Follow your order from warehouse to doorstep.", icon: BarChart3 },
                            { title: "Safe Payments", desc: "PCI-DSS compliant encrypted transactions.", icon: ShieldCheck },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col gap-4">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-950">
                                    <item.icon size={24} />
                                </div>
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.title}</h4>
                                <p className="text-xs text-slate-500 font-bold">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
