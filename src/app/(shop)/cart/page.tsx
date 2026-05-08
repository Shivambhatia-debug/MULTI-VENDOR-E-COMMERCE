"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { products } from "@/lib/data";
import {
    Trash2,
    Plus,
    Minus,
    ArrowRight,
    ShoppingBag,
    ChevronLeft,
    ShieldCheck,
    Truck,
    CreditCard,
    Ticket,
    Tag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, subtotal, isLoading } = useCart();

    const [couponCode, setCouponCode] = useState("");
    const [isCouponApplied, setIsCouponApplied] = useState(false);

    const shipping = subtotal > 500 ? 0 : 25;
    const tax = subtotal * 0.15; // 15% VAT
    const discount = isCouponApplied ? subtotal * 0.2 : 0; // 20% discount
    const total = subtotal + shipping + tax - discount;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                        <h1 className="text-4xl font-black text-slate-950 uppercase tracking-tighter italic">Your Bag</h1>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{cartItems.length} Items Selected</p>
                    </div>
                </div>

                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-6">
                            <AnimatePresence mode="popLayout">
                                {cartItems.map((item) => (
                                    <motion.div
                                        key={item.product.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-6 relative group"
                                    >
                                        <div className="w-full sm:w-40 aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 relative">
                                            <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                                        </div>

                                        <div className="flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest block mb-1 italic">{item.product.category}</span>
                                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{item.product.name}</h3>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.product.id)}
                                                    className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>

                                            <p className="text-xs text-slate-400 font-bold mb-6 line-clamp-1">Sold by {item.product.merchantName}</p>

                                            <div className="mt-auto flex items-center justify-between">
                                                <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                        className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-950 transition-all disabled:opacity-30"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-sm font-black text-slate-950 w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                        className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-950 transition-all"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <span className="text-sm text-slate-400 font-bold block mb-0.5">QAR {item.product.price} each</span>
                                                    <span className="text-xl font-black text-slate-950 tracking-tighter">QAR {item.product.price * item.quantity}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-slate-950 rounded-[2.5rem] p-10 text-white shadow-2xl sticky top-24">
                                <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 italic">Order Summary</h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        <span>Subtotal</span>
                                        <span className="text-white">QAR {subtotal.toFixed(2)}</span>
                                    </div>

                                    {/* Coupon Section */}
                                    <div className="py-4 border-y border-white/5 space-y-4">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                placeholder="Coupon Code"
                                                className="flex-1 bg-white/5 border-none rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest focus:ring-1 focus:ring-blue-500 placeholder:text-white/20"
                                            />
                                            <button
                                                onClick={() => setIsCouponApplied(true)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                        {isCouponApplied && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="flex items-center justify-between bg-blue-600/20 text-blue-400 p-2 rounded-xl border border-blue-600/30"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Tag size={12} />
                                                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">SAV20 Applied (-20%)</span>
                                                </div>
                                                <button onClick={() => setIsCouponApplied(false)} className="text-xs font-black">×</button>
                                            </motion.div>
                                        )}
                                    </div>

                                    {isCouponApplied && (
                                        <div className="flex justify-between items-center text-xs font-bold text-blue-400 uppercase tracking-widest">
                                            <span>Discount</span>
                                            <span>- QAR {discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        <span>Estimated Shipping</span>
                                        <span className="text-white">{shipping === 0 ? "FREE" : `QAR ${shipping.toFixed(2)}`}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        <span>Estimated Tax (15%)</span>
                                        <span className="text-white">QAR {tax.toFixed(2)}</span>
                                    </div>
                                    <div className="pt-6 mt-6 border-t border-white/10 flex justify-between items-center">
                                        <span className="text-sm font-black uppercase tracking-[0.2em]">Total</span>
                                        <span className="text-3xl font-black tracking-tighter">QAR {total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="w-full bg-blue-600 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 group"
                                >
                                    Proceed to Checkout <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <div className="mt-10 space-y-4">
                                    <div className="flex items-center gap-4 text-white/40">
                                        <ShieldCheck size={16} className="text-blue-500" />
                                        <span className="text-[9px] font-black uppercase tracking-widest italic">Encrypted Secure Checkout</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-white/40">
                                        <Truck size={16} className="text-green-500" />
                                        <span className="text-[9px] font-black uppercase tracking-widest italic">Fast & Reliable Delivery</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-white/40">
                                        <CreditCard size={16} className="text-amber-500" />
                                        <span className="text-[9px] font-black uppercase tracking-widest italic">Multiple Payment Methods</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-[3rem] p-20 border border-slate-100 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-8">
                            <ShoppingBag size={48} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4 italic">Your Bag is Empty</h2>
                        <p className="text-sm text-slate-400 font-bold leading-relaxed mb-10 max-w-sm">
                            Looks like you haven't added anything to your cart yet. Explore our marketplace for the latest trends.
                        </p>
                        <Link href="/products" className="bg-slate-950 text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-slate-800 transition-all">
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
