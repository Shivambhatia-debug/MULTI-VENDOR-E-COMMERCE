"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { products, merchants } from "@/lib/data";
import * as Icons from "lucide-react";
import { Search, SlidersHorizontal, Package, ArrowRight, Sparkles, Star, ShieldCheck, ChevronRight, Clock, Award, Flame, BarChart3, Loader2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import HorizontalScroller from "@/components/product/HorizontalScroller";

export default function ProductsPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [settings, setSettings] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [merchantsList, setMerchantsList] = useState<any[]>([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch settings
                const settingsRes = await fetch("/api/python/public/marketplace/settings");
                if (settingsRes.ok) {
                    const data = await settingsRes.json();
                    setSettings(data);
                }

                // Fetch products
                const productsRes = await fetch("/api/python/public/products");
                if (productsRes.ok) {
                    const data = await productsRes.json();
                    setAllProducts(data);
                }

                // Fetch stores
                const storesRes = await fetch("/api/python/public/stores");
                if (storesRes.ok) {
                    const data = await storesRes.json();
                    setMerchantsList(data);
                }
            } catch (err) {
                console.error("INITIAL_DATA_FETCH_ERROR:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const categories = useMemo(() => {
        const base = [{ name: "All", ar: "الكل", icon: "Sparkles" }];
        if (settings?.categories && settings.categories.length > 0) {
            return [...base, ...settings.categories];
        }
        // Fallbacks
        return [
            ...base,
            { name: "Electronics", ar: "إلكترونيات", icon: "Smartphone" },
            { name: "Apparel", ar: "ملابس", icon: "ShieldCheck" },
            { name: "Home & Living", ar: "المنزل", icon: "Target" },
            { name: "Accessories", ar: "إكسسوارات", icon: "Zap" }
        ];
    }, [settings]);

    const banners = useMemo(() => {
        if (settings?.banners && settings.banners.length > 0) {
            return settings.banners;
        }
        return [
            {
                title: "Upgrade your Digital Life",
                subtitle: "New Collection 2026",
                image_url: null,
                link: "/products"
            }
        ];
    }, [settings]);

    const filteredProducts = useMemo(() => {
        return allProducts.filter(p => {
            const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery, allProducts]);

    const trendingProducts = allProducts.filter((_, i) => i < 10);
    const electronicsProducts = allProducts.filter(p => p.category === "Electronics");
    const fashionProducts = allProducts.filter(p => p.category === "Apparel");

    const CategoryGridCard = ({ title, items, linkText }: { title: string, items: { name: string, image: string, href: string }[], linkText: string }) => (
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full hover:border-blue-600/20 transition-all">
            <h3 className="text-[11px] sm:text-sm font-black text-slate-900 uppercase tracking-tighter mb-2 sm:mb-4 italic leading-tight flex items-center gap-2">
                <Sparkles size={12} className="text-blue-600" /> {title}
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-4 flex-1">
                {items.map((item, i) => (
                    <Link key={i} href={item.href} className="group/item flex flex-col gap-1.5">
                        <div className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-slate-50 border border-slate-50">
                            <Image src={item.image} alt={item.name} fill className="object-cover group-hover/item:scale-110 transition-transform duration-500" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 line-clamp-1">{item.name}</span>
                    </Link>
                ))}
            </div>
            <Link href="/products" className="mt-4 sm:mt-6 text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline inline-flex items-center gap-2">
                {linkText} <ArrowRight size={10} />
            </Link>
        </div>
    );

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f1f3f6]">
                <div className="text-center">
                    <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={40} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Initializing Marketplace...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#f1f3f6]">
            <Navbar invert={true} />

            {/* Announcement Ticker */}
            {settings?.announcement_ticker && (
                <div className="pt-16 sm:pt-20 bg-slate-950 text-white py-1 sm:py-2 overflow-hidden">
                    <div className="whitespace-nowrap animate-marquee flex items-center gap-10">
                        {Array(5).fill(0).map((_, i) => (
                            <span key={i} className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-4">
                                <Sparkles size={10} className="text-blue-400" />
                                {settings.announcement_ticker}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Sub-Navbar / Quick Category Bar */}
            <div className={`${!settings?.announcement_ticker ? 'pt-16' : ''} bg-white border-b border-slate-100 shadow-sm sticky top-0 z-40`}>
                <div className="section-padding py-2 overflow-x-auto no-scrollbar">
                    <div className="flex items-center justify-between gap-6 min-w-max mx-auto max-w-6xl">
                        {categories.map((cat: any) => {
                            const Icon = (Icons as any)[cat.icon] || Icons.Package;
                            return (
                                <button
                                    key={cat.name}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className={`flex flex-col items-center gap-1 sm:gap-1.5 group transition-all ${selectedCategory === cat.name ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
                                >
                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all ${selectedCategory === cat.name ? "bg-blue-600 text-white shadow-lg" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"}`}>
                                        <Icon size={14} className="sm:w-[18px] sm:h-[18px]" strokeWidth={selectedCategory === cat.name ? 2.5 : 2} />
                                    </div>
                                    <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest ${selectedCategory === cat.name ? "text-blue-600" : "text-slate-500"}`}>{cat.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="section-padding py-8">
                <AnimatePresence mode="wait">
                    {selectedCategory === "All" && searchQuery === "" ? (
                        <motion.div
                            key="home"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-8"
                        >
                            {/* Hero Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                <div className="lg:col-span-4 bg-white rounded-2xl relative overflow-hidden group shadow-xl h-[300px] sm:h-[400px] lg:h-[500px]">
                                    {banners[0].image_url ? (
                                        <div className="absolute inset-0">
                                            <Image 
                                                src={banners[0].image_url} 
                                                alt={banners[0].title} 
                                                fill 
                                                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                            />
                                            <div className="absolute inset-0 bg-slate-950/40" />
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white" />
                                    )}
                                    
                                    <div className="absolute inset-0 z-10 p-6 sm:p-12 lg:p-20 flex flex-col justify-center max-w-2xl">
                                        <motion.span
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`${banners[0].image_url ? 'text-blue-400' : 'text-blue-600'} text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-2`}
                                        >
                                            <Sparkles size={14} className="fill-current" /> {banners[0].subtitle || "New Collection 2026"}
                                        </motion.span>
                                        <motion.h2
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className={`text-3xl sm:text-5xl lg:text-7xl font-black ${banners[0].image_url ? 'text-white' : 'text-slate-950'} tracking-tighter uppercase leading-[0.85] mb-6 sm:mb-10 italic`}
                                        >
                                            {banners[0].title}
                                        </motion.h2>
                                        <div className="flex gap-4">
                                            <Link 
                                                href={banners[0].link || "/products"}
                                                className="bg-white text-slate-950 px-6 sm:px-12 py-3 sm:py-5 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-2xl hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                                            >
                                                Explore Collection
                                            </Link>
                                        </div>
                                    </div>
                                    
                                    {/* Abstract background elements if no image */}
                                    {!banners[0].image_url && (
                                        <>
                                            <div className="absolute right-0 top-0 w-1/2 h-full bg-slate-50" />
                                            <div className="absolute -right-20 bottom-0 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px]" />
                                            <div className="absolute right-20 top-20 text-slate-100 transform rotate-12 opacity-50">
                                                <Package size={200} />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Rest of the discovery view remains largely the same but uses dynamic categories if available */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {categories.filter(c => c.name !== "All").slice(0, 4).map((cat, i) => (
                                    <CategoryGridCard
                                        key={i}
                                        title={`${cat.name} Showcase`}
                                        linkText={`Explore ${cat.name}`}
                                        items={allProducts.filter(p => p.category === cat.name).slice(0, 4).map(p => ({
                                            name: p.name,
                                            image: p.image,
                                            href: `/products/${p.id}`
                                        }))}
                                    />
                                ))}

                                {categories.length <= 4 && (
                                    <div className="bg-[#fb641b] rounded-2xl p-8 flex flex-col justify-between text-white shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer">
                                        <div>
                                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                                                <Icons.Flame size={20} className="fill-white" />
                                            </div>
                                            <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-3 italic">Flash<br />Deals</h3>
                                            <p className="text-[10px] text-white/70 font-black uppercase tracking-[0.2em]">Limited Inventory</p>
                                        </div>
                                        <div className="flex items-end justify-between">
                                            <div className="text-4xl font-black italic tracking-tighter">70% OFF</div>
                                            <Icons.ArrowRight className="group-hover:translate-x-2 transition-transform" />
                                        </div>
                                        <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                                    </div>
                                )}
                            </div>

                            <HorizontalScroller
                                title="Best Sellers of 2026"
                                subtitle="Top performing items from verified merchants"
                            >
                                {trendingProducts.map(p => (
                                    <div key={p.id} className="w-[180px] sm:w-[280px] shrink-0">
                                        <ProductCard product={p} />
                                    </div>
                                ))}
                            </HorizontalScroller>

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
                                        {(merchantsList.length > 0 ? merchantsList : []).map((m, i) => (
                                            <Link
                                                key={i}
                                                href={`/stores/${m.subdomain || m.id}`}
                                                className="min-w-[280px] bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 group hover:bg-white hover:shadow-xl transition-all cursor-pointer block"
                                            >
                                                <div className="w-16 h-16 bg-white rounded-[1.5rem] mb-6 flex items-center justify-center shadow-sm overflow-hidden">
                                                    {m.logo_url ? (
                                                        <img src={m.logo_url} className="w-full h-full object-cover" alt="" />
                                                    ) : (
                                                        <Package className="text-blue-600" size={32} />
                                                    )}
                                                </div>
                                                <h4 className="text-lg font-black text-slate-950 uppercase tracking-tight mb-2 group-hover:text-blue-600 line-clamp-1">{m.store_name}</h4>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Star size={10} className="fill-amber-400 text-amber-400" />
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{m.category || "Verified Merchant"}</span>
                                                    </div>
                                                    <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 transition-all group-hover:translate-x-1" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
                            </section>

                            <HorizontalScroller
                                title="Deals on Gadgets"
                                subtitle="Upgrade your setup with these price cuts"
                            >
                                {electronicsProducts.map(p => (
                                    <div key={p.id} className="w-[180px] sm:w-[300px] shrink-0">
                                        <ProductCard product={p} />
                                    </div>
                                ))}
                            </HorizontalScroller>
                        </motion.div>
                    ) : (
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
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 sm:gap-x-6 gap-y-6 sm:gap-y-10">
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

            <section className="section-padding py-0 mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
                    {(settings?.promotions || []).map((promo: any, i: number) => (
                        <div 
                            key={i} 
                            style={{ backgroundColor: promo.color || '#fb641b' }}
                            className="rounded-3xl p-10 relative overflow-hidden group cursor-pointer shadow-xl transition-transform hover:scale-[1.02]"
                        >
                            <div className="relative z-10">
                                <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full mb-6 inline-block">Special Offer</span>
                                <h3 className="text-4xl font-black uppercase tracking-tighter italic mb-4 leading-none">{promo.title}</h3>
                                <p className="text-2xl font-black italic mb-6">{promo.subtitle}</p>
                                <Link href={promo.link || "/products"} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white pb-1 group-hover:gap-4 transition-all w-fit">
                                    Shop Now <Icons.ArrowRight size={14} />
                                </Link>
                            </div>
                            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
                        </div>
                    ))}
                    {(settings?.promotions || []).length === 0 && (
                        <>
                            <div className="bg-[#fb641b] rounded-3xl p-10 relative overflow-hidden group cursor-pointer shadow-xl">
                                <div className="relative z-10">
                                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full mb-6 inline-block">Flash Deals</span>
                                    <h3 className="text-4xl font-black uppercase tracking-tighter italic mb-4 leading-none">Summer Fashion<br />Stock Clearance</h3>
                                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white pb-1 group-hover:gap-4 transition-all">Shop Now <Icons.ArrowRight size={14} /></button>
                                </div>
                                <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
                            </div>
                            <div className="bg-[#2874f0] rounded-3xl p-10 relative overflow-hidden group cursor-pointer shadow-xl">
                                <div className="relative z-10">
                                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full mb-6 inline-block">Daily Pick</span>
                                    <h3 className="text-4xl font-black uppercase tracking-tighter italic mb-4 leading-none">Smart Home<br />Essentials 2026</h3>
                                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white pb-1 group-hover:gap-4 transition-all">Explore <Icons.ArrowRight size={14} /></button>
                                </div>
                                <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
                            </div>
                        </>
                    )}
                </div>
            </section>



            <Footer />
        </main>
    );
}
