"use client";

import Navbar from "@/components/layout/Navbar";
import { products } from "@/lib/data";
import {
    ChevronLeft,
    ShieldCheck,
    CreditCard,
    Wallet,
    MapPin,
    Truck,
    CheckCircle2,
    Lock,
    Tag,
    Package,
    ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useMerchant } from "@/context/MerchantContext";

export default function CheckoutPage() {
    const router = useRouter();
    const { cartItems, subtotal, clearCart } = useCart();
    const { user, isAuthenticated } = useMerchant();
    const [selectedPayment, setSelectedPayment] = useState("skipcash");
    const [couponCode, setCouponCode] = useState("");
    const [isCouponApplied, setIsCouponApplied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
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

    useEffect(() => {
        const token = localStorage.getItem("golalita_token");
        if (!token) {
            router.push("/login");
        } else {
            setIsCheckingAuth(false);
        }
    }, [router]);

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 3));
    const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const token = localStorage.getItem("golalita_token");
            
            const merchants = Array.from(new Set(cartItems.map(item => item.product.merchant_id)));
            const orderIds: string[] = [];
            
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
                    status: selectedPayment === "cod" ? "Processing" : "Pending Payment",
                    payment_status: selectedPayment === "cod" ? "cod" : "pending",
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
                const orderResult = await res.json();
                if (orderResult.id) orderIds.push(orderResult.id);
            }

            // For SkipCash payment, redirect to payment gateway
            if (selectedPayment === "skipcash") {
                const paymentRes = await fetch("/api/python/payments/create", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        amount: total.toFixed(2),
                        first_name: formData.fullName || user?.name || "Customer",
                        email: user?.email || "customer@golalita.com",
                        phone: formData.phone || "+97400000000",
                        order_id: orderIds[0] || "",
                        description: `Golalita Order - ${cartItems.length} items`,
                        return_url: `${window.location.origin}/payment/callback/`,
                        payment_type: "marketplace"
                    })
                });

                if (!paymentRes.ok) {
                    const errData = await paymentRes.json();
                    throw new Error(errData.detail || "Payment creation failed");
                }

                const paymentData = await paymentRes.json();
                
                // Store order info for callback
                localStorage.setItem("golalita_pending_payment", JSON.stringify({
                    paymentId: paymentData.paymentId,
                    transactionId: paymentData.transactionId,
                    orderIds: orderIds
                }));

                // Redirect to SkipCash payment page
                clearCart();
                window.location.href = paymentData.payUrl;
                return;
            }

            // For COD, go directly to success
            clearCart();
            router.push("/payment/success");
        } catch (err) {
            console.error("ORDER_PLACEMENT_ERROR:", err);
            alert("Failed to place order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isCheckingAuth) {
        return (
            <main className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Verifying session...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 pb-12">
            <Navbar invert={true} />

            <div className="pt-20 sm:pt-24 pb-20 section-padding max-w-4xl mx-auto">
                <div className="flex items-center gap-3 sm:gap-4 mb-10 sm:mb-16">
                    <button 
                        onClick={() => currentStep > 1 ? handlePrev() : router.push("/cart")} 
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-black text-slate-950 uppercase tracking-tighter italic">Checkout</h1>
                        <p className="text-[8px] sm:text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Step {currentStep} of 3</p>
                    </div>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center mb-12 sm:mb-16 relative w-full px-2 sm:px-12">
                    <div className="absolute top-1/2 left-6 right-6 sm:left-16 sm:right-16 h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-6 sm:left-16 h-0.5 bg-slate-950 -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `calc(${((currentStep - 1) / 2) * 100}% - ${currentStep === 1 ? '0px' : currentStep === 3 ? '48px' : '24px'})` }}></div>
                    
                    <div className="flex justify-between w-full">
                        {[
                            { step: 1, title: "Address", icon: MapPin },
                            { step: 2, title: "Order", icon: Package },
                            { step: 3, title: "Payment", icon: CreditCard }
                        ].map((s) => (
                            <div key={s.step} className="flex flex-col items-center gap-2 sm:gap-3">
                                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep >= s.step ? "bg-slate-950 text-white shadow-xl scale-110" : "bg-white border-2 border-slate-200 text-slate-300"}`}>
                                    <s.icon size={16} className="sm:w-6 sm:h-6" />
                                </div>
                                <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-widest ${currentStep >= s.step ? "text-slate-950" : "text-slate-400"}`}>{s.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Container */}
                <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 border border-slate-100 shadow-sm min-h-[400px] relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-900 text-white rounded-lg sm:rounded-xl flex items-center justify-center">
                                        <MapPin size={16} />
                                    </div>
                                    <h2 className="text-lg sm:text-xl font-black uppercase tracking-tighter italic">Shipping Destination</h2>
                                </div>
                                
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
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
                                        <label className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Delivery Address</label>
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
                                    <div className="md:col-span-2 pt-6 mt-2 border-t border-slate-100 flex justify-end">
                                        <button type="submit" className="w-full sm:w-auto bg-slate-950 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-3 group active:scale-95">
                                            Review Order <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-900 text-white rounded-lg sm:rounded-xl flex items-center justify-center">
                                        <Package size={16} />
                                    </div>
                                    <h2 className="text-lg sm:text-xl font-black uppercase tracking-tighter italic">Order Summary</h2>
                                </div>
                                
                                <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
                                    {cartItems.map((item) => (
                                        <div key={item.product.id} className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 relative bg-slate-100">
                                                <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-tight line-clamp-1">{item.product.name}</h4>
                                                <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Qty: {item.quantity}</p>
                                                <p className="text-sm sm:text-base font-black mt-2 text-slate-900">QAR {(item.product.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {cartItems.length === 0 && (
                                        <div className="text-center py-8 text-slate-400 font-bold text-sm">Your cart is empty.</div>
                                    )}
                                </div>

                                <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <button onClick={handlePrev} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors w-full sm:w-auto text-center py-3">
                                        Back to Address
                                    </button>
                                    <button onClick={handleNext} disabled={cartItems.length === 0} className="w-full sm:w-auto bg-slate-950 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-3 group active:scale-95 disabled:opacity-50">
                                        Proceed to Payment <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
                                    {/* Payment Methods */}
                                    <div>
                                        <div className="flex items-center gap-3 mb-6 sm:mb-8">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 text-white rounded-lg sm:rounded-xl flex items-center justify-center">
                                                <CreditCard size={16} />
                                            </div>
                                            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tighter italic">Payment Protocol</h2>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                            {[
                                                { id: "skipcash", name: "SkipCash", desc: "Card / Digital Wallet", icon: CreditCard },
                                                { id: "cod", name: "Cash on Delivery", desc: "Pay when received", icon: Wallet },
                                            ].map((method) => (
                                                <button
                                                    key={method.id}
                                                    onClick={() => setSelectedPayment(method.id)}
                                                    className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${selectedPayment === method.id ? "border-blue-600 bg-blue-50/50 shadow-lg" : "border-slate-100 hover:border-slate-200"}`}
                                                >
                                                    <method.icon size={24} className={selectedPayment === method.id ? "text-blue-600" : "text-slate-400"} />
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedPayment === method.id ? "text-blue-600" : "text-slate-500"}`}>{method.name}</span>
                                                    <span className="text-[8px] font-bold text-slate-400">{method.desc}</span>
                                                </button>
                                            ))}
                                        </div>

                                        {selectedPayment === "skipcash" && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <ShieldCheck size={18} className="text-blue-600" />
                                                    <span className="text-[10px] font-black text-blue-800 uppercase tracking-widest">Secure Payment via SkipCash</span>
                                                </div>
                                                <p className="text-[10px] text-blue-600 font-bold leading-relaxed">
                                                    You will be redirected to SkipCash&apos;s secure payment page to complete your transaction. Supports Visa, Mastercard &amp; NAPS Debit Cards.
                                                </p>
                                            </motion.div>
                                        )}

                                        {selectedPayment === "cod" && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className="bg-amber-50 border border-amber-100 rounded-2xl p-5 space-y-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Truck size={18} className="text-amber-600" />
                                                    <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Cash on Delivery</span>
                                                </div>
                                                <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                                                    Pay in cash when your order arrives. Please keep exact change ready for the delivery agent.
                                                </p>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Final Summary & Confirmation */}
                                    <div>
                                        <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
                                            <h3 className="text-lg font-black uppercase tracking-tighter mb-6 italic">Final Details</h3>
                                            
                                            <div className="space-y-4 mb-6 relative z-10">
                                                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <span>Subtotal</span>
                                                    <span className="text-white">QAR {subtotal.toFixed(2)}</span>
                                                </div>

                                                {/* Coupon Section */}
                                                <div className="py-4 border-y border-white/5 space-y-3">
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={couponCode}
                                                            onChange={(e) => setCouponCode(e.target.value)}
                                                            placeholder="Coupon Code"
                                                            className="flex-1 bg-white/5 border-none rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest focus:ring-1 focus:ring-blue-500 placeholder:text-white/20"
                                                        />
                                                        <button
                                                            onClick={() => setIsCouponApplied(true)}
                                                            className="px-4 py-3 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all"
                                                        >
                                                            Apply
                                                        </button>
                                                    </div>
                                                    {isCouponApplied && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            className="flex items-center justify-between bg-blue-600/20 text-blue-400 p-3 rounded-xl border border-blue-600/30"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Tag size={12} />
                                                                <span className="text-[9px] font-black uppercase tracking-[0.2em]">SAV20 Applied</span>
                                                            </div>
                                                            <button onClick={() => setIsCouponApplied(false)} className="text-xs font-black">×</button>
                                                        </motion.div>
                                                    )}
                                                </div>

                                                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <span>Delivery</span>
                                                    <span className="text-green-400 font-black italic">{shipping === 0 ? 'FREE' : `QAR ${shipping.toFixed(2)}`}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <span>Tax (15%)</span>
                                                    <span className="text-white">QAR {tax.toFixed(2)}</span>
                                                </div>
                                                <div className="pt-6 mt-4 border-t border-white/10 flex justify-between items-center">
                                                    <span className="text-xs font-black uppercase tracking-[0.2em]">Payable</span>
                                                    <span className="text-3xl font-black tracking-tighter">QAR {total.toFixed(2)}</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handlePayment}
                                                disabled={isSubmitting}
                                                className="w-full bg-blue-600 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 group active:scale-95 disabled:opacity-50 relative z-10"
                                            >
                                                {isSubmitting ? (
                                                    <span className="animate-pulse">Processing...</span>
                                                ) : (
                                                    <><Lock size={16} /> Confirm & Pay</>
                                                )}
                                            </button>

                                            {/* Decorative */}
                                            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
                                        </div>
                                        
                                        <div className="mt-4 flex justify-center">
                                            <button onClick={handlePrev} className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors py-2">
                                                Back to Order Review
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}
