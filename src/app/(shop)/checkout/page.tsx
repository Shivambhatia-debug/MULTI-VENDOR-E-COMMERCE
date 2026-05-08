"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { products } from "@/lib/data";
import {
    ChevronLeft,
    ShieldCheck,
    CreditCard,
    Wallet,
    Smartphone,
    MapPin,
    Truck,
    CheckCircle2,
    Lock,
    Tag,
    Ticket
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useMerchant } from "@/context/MerchantContext";

export default function CheckoutPage() {
    const router = useRouter();
    const { cartItems, subtotal, clearCart } = useCart();
    const { user } = useMerchant();
    const [selectedPayment, setSelectedPayment] = useState("card");
    const [couponCode, setCouponCode] = useState("");
    const [isCouponApplied, setIsCouponApplied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "Doha",
        zip: ""
    });

    const shipping = subtotal > 500 ? 0 : 25;
    const tax = subtotal * 0.15;
    const discount = isCouponApplied ? subtotal * 0.2 : 0;
    const total = subtotal + shipping + tax - discount;

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const token = localStorage.getItem("golalita_token");
            
            // Group items by merchant_id to create separate orders if needed
            // For now, we create one order per merchant represented in the cart
            const merchants = Array.from(new Set(cartItems.map(item => item.product.merchant_id)));
            
            for (const mId of merchants) {
                const merchantItems = cartItems.filter(item => item.product.merchant_id === mId);
                const merchantSubtotal = merchantItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
                
                const orderData = {
                    customer_name: formData.fullName || user?.name || "Guest Customer",
                    customer_email: user?.email || "guest@golalita.com",
                    customer_phone: formData.phone || user?.phone || "N/A",
                    shipping_address: formData.address,
                    city: formData.city,
                    zip_code: formData.zip,
                    items: merchantItems.reduce((acc, item) => acc + item.quantity, 0),
                    items_details: merchantItems.map(item => ({
                        id: item.product.id,
                        name: item.product.name,
                        image: item.product.image,
                        price: item.product.price,
                        quantity: item.quantity
                    })),
                    total: `QAR ${merchantSubtotal.toFixed(2)}`,
                    status: "Processing",
                    method: selectedPayment.toUpperCase(),
                    merchant_id: mId,
                    delivery_estimate: new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
                };

                const res = await fetch("/api/python/orders", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(orderData)
                });
                
                if (!res.ok) throw new Error("Order creation failed");
            }

            clearCart();
            router.push("/payment/success");
        } catch (err) {
            console.error("ORDER_PLACEMENT_ERROR:", err);
            alert("Failed to place order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 pb-12">
            <Navbar invert={true} />

            <div className="pt-20 sm:pt-24 pb-20 section-padding">
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
                    <Link href="/cart" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                        <ChevronLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-black text-slate-950 uppercase tracking-tighter italic">Checkout</h1>
                        <p className="text-[8px] sm:text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Finalize your purchase</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12">
                    {/* Left: Forms */}
                    <div className="lg:col-span-8 space-y-6 sm:space-y-8">
                        {/* Shipping Info */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-10 border border-slate-100 shadow-sm"
                        >
                            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-900 text-white rounded-lg sm:rounded-xl flex items-center justify-center">
                                    <MapPin size={16} />
                                </div>
                                <h2 className="text-lg sm:text-xl font-black uppercase tracking-tighter italic">Shipping Destination</h2>
                            </div>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="Shivalik" 
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                        className="w-full bg-slate-50 border-none rounded-xl sm:rounded-2xl p-3 sm:p-4 text-[11px] sm:text-xs font-bold focus:ring-2 focus:ring-blue-600 transition-all" 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="+974 0000 0000" 
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="w-full bg-slate-50 border-none rounded-xl sm:rounded-2xl p-3 sm:p-4 text-[11px] sm:text-xs font-bold focus:ring-2 focus:ring-blue-600 transition-all" 
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">delivery Address</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="Doha, Qatar - West Bay, Tower 4, Apt 402" 
                                        value={formData.address}
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                        className="w-full bg-slate-50 border-none rounded-xl sm:rounded-2xl p-3 sm:p-4 text-[11px] sm:text-xs font-bold focus:ring-2 focus:ring-blue-600 transition-all" 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="Doha" 
                                        value={formData.city}
                                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                                        className="w-full bg-slate-50 border-none rounded-xl sm:rounded-2xl p-3 sm:p-4 text-[11px] sm:text-xs font-bold focus:ring-2 focus:ring-blue-600 transition-all" 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Zip / Postal Code</label>
                                    <input 
                                        type="text" 
                                        placeholder="00000" 
                                        value={formData.zip}
                                        onChange={(e) => setFormData({...formData, zip: e.target.value})}
                                        className="w-full bg-slate-50 border-none rounded-xl sm:rounded-2xl p-3 sm:p-4 text-[11px] sm:text-xs font-bold focus:ring-2 focus:ring-blue-600 transition-all" 
                                    />
                                </div>
                            </form>
                        </motion.section>

                        {/* Payment Method */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-10 border border-slate-100 shadow-sm"
                        >
                            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 text-white rounded-lg sm:rounded-xl flex items-center justify-center">
                                    <CreditCard size={16} />
                                </div>
                                <h2 className="text-lg sm:text-xl font-black uppercase tracking-tighter italic">Payment Protocol</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                                {[
                                    { id: "card", name: "Credit Card", icon: CreditCard },
                                    { id: "apple", name: "Apple Pay", icon: Smartphone },
                                    { id: "qpay", name: "QPay Qatar", icon: Wallet },
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setSelectedPayment(method.id)}
                                        className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all flex flex-row md:flex-col items-center justify-center gap-3 ${selectedPayment === method.id ? "border-blue-600 bg-blue-50/50" : "border-slate-50 hover:border-slate-100"}`}
                                    >
                                        <method.icon size={20} className={selectedPayment === method.id ? "text-blue-600" : "text-slate-400"} />
                                        <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${selectedPayment === method.id ? "text-blue-600" : "text-slate-400"}`}>{method.name}</span>
                                    </button>
                                ))}
                            </div>

                            {selectedPayment === "card" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="space-y-4 sm:space-y-6 pt-2"
                                >
                                    <div className="space-y-1.5">
                                        <label className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Number</label>
                                        <input type="text" placeholder="**** **** **** 1234" className="w-full bg-slate-50 border-none rounded-xl sm:rounded-2xl p-3 sm:p-4 text-[11px] sm:text-xs font-bold focus:ring-2 focus:ring-blue-600 transition-all font-mono" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry</label>
                                            <input type="text" placeholder="MM/YY" className="w-full bg-slate-50 border-none rounded-xl sm:rounded-2xl p-3 sm:p-4 text-[11px] sm:text-xs font-bold focus:ring-2 focus:ring-blue-600 transition-all" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CVV</label>
                                            <input type="text" placeholder="***" className="w-full bg-slate-50 border-none rounded-xl sm:rounded-2xl p-3 sm:p-4 text-[11px] sm:text-xs font-bold focus:ring-2 focus:ring-blue-600 transition-all" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.section>
                    </div>

                    {/* Right: Order Summary Sticky */}
                    <div className="lg:col-span-4">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-slate-950 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-10 text-white shadow-2xl sticky top-24"
                        >
                            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter mb-6 sm:mb-8 italic">Review Order</h2>

                            <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10 max-h-[250px] sm:max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item.product.id} className="flex gap-3 sm:gap-4">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden bg-white/10 shrink-0 relative">
                                            <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-[9px] sm:text-[10px] font-black uppercase tracking-tight line-clamp-1">{item.product.name}</h4>
                                            <p className="text-[8px] sm:text-[9px] text-slate-500 font-bold uppercase mt-0.5">Qty: {item.quantity}</p>
                                            <p className="text-xs font-black mt-1">QAR {(item.product.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 border-t border-white/10 pt-6 sm:pt-8">
                                <div className="flex justify-between items-center text-[9px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span className="text-white">QAR {subtotal.toFixed(2)}</span>
                                </div>

                                {/* Coupon Section */}
                                <div className="py-3 sm:py-4 border-y border-white/5 space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder="Coupon"
                                            className="flex-1 bg-white/5 border-none rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest focus:ring-1 focus:ring-blue-500 placeholder:text-white/20"
                                        />
                                        <button
                                            onClick={() => setIsCouponApplied(true)}
                                            className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg sm:rounded-xl text-[8px] sm:text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    {isCouponApplied && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex items-center justify-between bg-blue-600/20 text-blue-400 p-2 rounded-lg sm:rounded-xl border border-blue-600/30"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Tag size={10} />
                                                <span className="text-[8px] font-black uppercase tracking-[0.2em]">SAV20 Applied</span>
                                            </div>
                                            <button onClick={() => setIsCouponApplied(false)} className="text-xs font-black">×</button>
                                        </motion.div>
                                    )}
                                </div>

                                <div className="flex justify-between items-center text-[9px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    <span>Delivery</span>
                                    <span className="text-green-400 font-black italic">FREE</span>
                                </div>
                                <div className="flex justify-between items-center text-[9px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    <span>Tax</span>
                                    <span className="text-white">QAR {tax.toFixed(2)}</span>
                                </div>
                                <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-white/10 flex justify-between items-center">
                                    <span className="text-[10px] sm:text-sm font-black uppercase tracking-[0.2em]">Payable</span>
                                    <span className="text-2xl sm:text-3xl font-black tracking-tighter">QAR {total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                className="w-full bg-blue-600 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 group active:scale-95"
                            >
                                <Lock size={14} /> Confirm & Pay
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-3 opacity-20">
                                <div className="px-2 py-1 bg-white rounded text-[5px] font-black text-slate-900">VISA</div>
                                <div className="px-2 py-1 bg-white rounded text-[5px] font-black text-slate-900">MASTER</div>
                                <div className="px-2 py-1 bg-white rounded text-[5px] font-black text-slate-900">AMEX</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </main>
    );
}
