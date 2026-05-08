"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
    CheckCircle2,
    ArrowRight,
    ShoppingBag,
    Download,
    Truck,
    Share2,
    Calendar,
    Package
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
    const [orderId, setOrderId] = useState("");
    const [arrivalDate, setArrivalDate] = useState("");

    useEffect(() => {
        setOrderId("GL-" + Math.random().toString(36).substring(2, 9).toUpperCase());
        const date = new Date();
        date.setDate(date.getDate() + 3); // 3 days from now
        setArrivalDate(date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }));
    }, []);

    return (
        <main className="min-h-screen bg-white">
            <style jsx global>{`
                @media print {
                    nav, footer, .no-print {
                        display: none !important;
                    }
                    .print-only {
                        display: block !important;
                    }
                    body {
                        background: white !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .section-padding {
                        padding: 0 !important;
                    }
                    .receipt-container {
                        border: 2px solid #f1f5f9 !important;
                        border-radius: 2rem !important;
                        padding: 3rem !important;
                        max-width: 100% !important;
                        width: 100% !important;
                        margin: 0 !important;
                        box-shadow: none !important;
                        background: white !important;
                    }
                    .pt-32 {
                        padding-top: 2rem !important;
                    }
                }
                .print-only {
                    display: none;
                }
            `}</style>

            <div className="no-print">
                <Navbar invert={true} />
            </div>

            <div className="pt-32 pb-24 section-padding flex flex-col items-center">
                {/* Success Animation */}
                <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12, stiffness: 100 }}
                    className="w-32 h-32 bg-green-500 rounded-[2.5rem] flex items-center justify-center text-white shadow-[0_20px_50px_rgba(34,197,94,0.3)] mb-10 no-print"
                >
                    <CheckCircle2 size={64} strokeWidth={2.5} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center space-y-4 mb-16"
                >
                    <div className="print-only mb-8">
                        <img src="/web background/web background/logo 2 png.png" alt="Golalita" className="h-12 mx-auto" />
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-black text-slate-950 uppercase tracking-tighter italic">Order Secured.</h1>
                    <p className="text-sm text-slate-500 font-bold max-w-sm mx-auto">
                        Your transaction was successful. We've notified the merchant and your package is being prepared for transit.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl">
                    {/* Order Details Card / The Receipt */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100 flex flex-col justify-between receipt-container"
                    >
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100 no-print">
                                    <Package size={20} className="text-slate-900" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Identifier</h4>
                                    <p className="text-sm font-black text-slate-950 font-mono tracking-wider">{orderId}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100 no-print">
                                    <Calendar size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected Arrival</h4>
                                    <p className="text-sm font-black text-slate-950">{arrivalDate}, by 6:00 PM</p>
                                </div>
                            </div>

                            <div className="print-only pt-8 mt-8 border-t border-slate-100">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Official Receipt</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500">Date</span>
                                        <span className="font-bold">{new Date().toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500">Status</span>
                                        <span className="font-bold text-green-600">PAID</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500">Gateway</span>
                                        <span className="font-bold uppercase">Secured Protocol</span>
                                    </div>
                                </div>
                                <div className="mt-12 text-center">
                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]">Thank you for choosing Golalita</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 space-y-4 no-print">
                            <button 
                                onClick={() => window.print()}
                                className="w-full bg-white border border-slate-200 text-slate-950 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                            >
                                <Download size={16} /> Download Receipt
                            </button>
                            <button 
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: 'GOLALITA Purchase',
                                            text: `I just secured an order ${orderId} on GOLALITA!`,
                                            url: window.location.origin
                                        });
                                    } else {
                                        alert("Share protocol not supported on this device");
                                    }
                                }}
                                className="w-full bg-slate-950 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
                            >
                                <Share2 size={16} /> Share Purchase
                            </button>
                        </div>
                    </motion.div>

                    {/* Next Steps / CTA Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-blue-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between no-print"
                    >
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                <span className="text-[9px] font-black text-blue-100 uppercase tracking-[0.4em]">Real-time Tracking</span>
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none mb-4">
                                Follow Your<br />Package.
                            </h2>
                            <p className="text-blue-100/60 text-sm font-bold leading-relaxed mb-8">
                                Stay updated with live GPS tracking from our warehouse to your doorstep.
                            </p>
                        </div>

                        <div className="relative z-10 space-y-4">
                            <Link
                                href="/orders"
                                className="w-full bg-white text-blue-600 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-3 group"
                            >
                                <Truck size={18} /> Track Delivery <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/products"
                                className="w-full bg-blue-700 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-800 transition-all flex items-center justify-center gap-3"
                            >
                                <ShoppingBag size={16} /> Continue Shopping
                            </Link>
                        </div>

                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-20 flex items-center gap-8 opacity-30 no-print"
                >
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">PCI Compliant</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Verified Merchant</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Insured Delivery</span>
                    </div>
                </motion.div>
            </div>

        </main>
    );
}
