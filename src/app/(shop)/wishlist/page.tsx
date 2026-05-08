"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { Heart, ShoppingBag, ArrowRight, Loader2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
    const { wishlistItems, isLoading } = useWishlist();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#f8f9fb]">
            <Navbar />
            
            <div className="pt-24 pb-20 section-padding">
                <div className="flex items-center gap-4 mb-10">
                    <Link href="/products" className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black text-slate-950 uppercase tracking-tighter italic">Wishlist</h1>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{wishlistItems.length} Items Saved</p>
                    </div>
                </div>

                {wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                        <AnimatePresence mode="popLayout">
                            {wishlistItems.map((product) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="bg-white rounded-[3rem] p-20 border border-slate-100 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-8 relative">
                            <Heart size={48} className="relative z-10" />
                            <div className="absolute inset-0 bg-red-200/20 blur-2xl rounded-full scale-150" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4 italic">Wishlist is Empty</h2>
                        <p className="text-sm text-slate-400 font-bold leading-relaxed mb-10 max-w-sm">
                            Curate your perfect collection of premium goods. Add items from our marketplace to keep track of what you love.
                        </p>
                        <Link href="/products" className="bg-slate-950 text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-slate-800 transition-all">
                            Explore Catalog
                        </Link>
                    </div>
                )}
            </div>

        </main>
    );
}
