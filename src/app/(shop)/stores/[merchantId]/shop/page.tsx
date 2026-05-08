"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { Search, SlidersHorizontal, Package, LayoutGrid, ArrowLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";

export default function MerchantShopPage() {
    const params = useParams();
    const router = useRouter();
    const merchantId = params.merchantId as string;

    const [storeData, setStoreData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const res = await fetch(`/api/python/public/stores/${merchantId}`);
                if (res.ok) {
                    const data = await res.json();
                    setStoreData(data);
                }
            } catch (error) {
                console.error("Failed to fetch store data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStoreData();
    }, [merchantId]);

    const merchantProducts = useMemo(() => {
        if (!storeData || !storeData.products) return [];
        return storeData.products.filter((p: any) => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        });
    }, [storeData, searchQuery]);

    if (isLoading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-white">
                <Loader2 className="animate-spin text-slate-950 mb-4" size={40} />
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Curating Catalog...</p>
            </div>
        );
    }

    if (!storeData || storeData.error) return <div>Store not found</div>;

    return (
        <main className="min-h-screen bg-[#f1f3f6]">
            <Navbar invert={true} />

            {/* Shop Header / Breadcrumbs */}
            <div className="pt-32 pb-8 bg-white border-b border-slate-100">
                <div className="section-padding py-0">
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.back()}
                                className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-950 transition-all"
                            >
                                <ArrowLeft size={18} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tighter italic leading-none">{storeData.config.store_name} Catalog</h1>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Direct Brand Access</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative hidden md:block">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search in store..."
                                    className="bg-slate-50 border-none rounded-full pl-10 pr-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-950 focus:ring-2 focus:ring-slate-950 transition-all w-64 shadow-inner"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-950 transition-all">
                                <SlidersHorizontal size={14} />
                                <span>Sort</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Catalog Grid */}
            <div className="section-padding py-16">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: storeData.config.primary_color }}>
                        <LayoutGrid size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">All Collections</h2>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Showing {merchantProducts.length} Premium Results</p>
                    </div>
                    <div className="h-px flex-1 bg-slate-200 ml-6 opacity-30"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {merchantProducts.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {merchantProducts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                            <Package size={40} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">No Items Found</h3>
                        <p className="text-sm text-slate-400 font-bold max-w-xs mx-auto">This merchant currently has no items matching your search or collection.</p>
                        <button onClick={() => setSearchQuery("")} className="mt-8 px-8 py-3 bg-slate-950 text-white rounded-full text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: storeData.config.primary_color }}>Clear Filters</button>
                    </div>
                )}
            </div>

        </main>
    );
}
