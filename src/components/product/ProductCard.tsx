"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, Truck, ShieldCheck, Zap, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
    product: {
        id: number | string;
        name: string;
        price: number;
        originalPrice?: number;
        category: string;
        image: string;
        merchantName?: string;
        merchantRating?: number;
        deliveryTime?: string;
    };
}

const ProductCard = ({ product }: ProductCardProps) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isFavorite = isInWishlist(product.id.toString());

    const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    return (
        <motion.div
            layout
            whileHover={{ y: -4 }}
            className="group bg-white rounded-2xl overflow-hidden border border-slate-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col h-full"
        >
            <div className="relative aspect-[4/5] overflow-hidden bg-slate-50 group">
                <Link href={`/products/${product.id}`} className="block w-full h-full">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Discount Badge */}
                    {discount > 0 && (
                        <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg z-10">
                            {discount}% OFF
                        </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(product);
                        }}
                        className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
                            isFavorite ? "bg-rose-500 text-white shadow-rose-200" : "bg-white text-slate-400 hover:text-rose-500"
                        } shadow-lg`}
                    >
                        <Heart size={14} className={isFavorite ? "fill-white" : ""} />
                    </button>
                </Link>

                {/* Quick Add Overlay */}
                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4 z-20 pointer-events-none group-hover:pointer-events-auto">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart(product, 1);
                        }}
                        className="flex-1 bg-white text-slate-950 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 pointer-events-auto"
                    >
                        <ShoppingCart size={14} /> Add
                    </button>
                    <Link href="/checkout" className="w-12 h-12 bg-white text-slate-950 rounded-xl flex items-center justify-center shadow-xl hover:bg-slate-50 transition-all text-blue-600 pointer-events-auto">
                        <Zap size={16} className="fill-blue-600" />
                    </Link>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-5 flex flex-col flex-1">
                {/* Merchant & Tag */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest px-2 py-0.5 bg-blue-50 rounded italic">
                        {product.merchantName || "Verified Store"}
                    </span>
                    <div className="flex items-center gap-1">
                        <Star size={10} className="fill-amber-400 text-amber-400" />
                        <span className="text-[10px] font-black text-slate-900">{product.merchantRating || "4.5"}</span>
                    </div>
                </div>

                <Link href={`/products/${product.id}`}>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight line-clamp-2 leading-snug mb-4 group-hover:text-blue-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Logistics Preview */}
                <div className="mt-auto space-y-3">
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-slate-950">QAR {product.price}</span>
                        {product.originalPrice && (
                            <span className="text-xs font-bold text-slate-400 line-through">QAR {product.originalPrice}</span>
                        )}
                    </div>

                    <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-slate-400">
                            <Truck size={12} strokeWidth={2.5} />
                            <span className="text-[9px] font-black uppercase tracking-widest">{product.deliveryTime || "2-3 Days"}</span>
                        </div>
                        <ShieldCheck size={12} className="text-blue-500" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
