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
                <div className="relative mb-12">
                    <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 12, stiffness: 100 }}
                        className="w-32 h-32 bg-slate-950 rounded-[2.5rem] flex items-center justify-center text-white shadow-[0_30px_60px_rgba(0,0,0,0.2)] relative z-10 no-print"
                    >
                        <CheckCircle2 size={64} strokeWidth={2.5} />
                    </motion.div>
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-dashed border-slate-200 rounded-full no-print"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center space-y-4 mb-16"
                >
                    <div className="print-only mb-8">
                        <img src="/web background/web background/logo 2 png.png" alt="Golalita" className="h-12 mx-auto" />
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black text-slate-950 uppercase tracking-tighter italic leading-none">Order Secured.</h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em] max-w-sm mx-auto">
                        Transaction validated • Merchant notified • Logistics initialized
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl">
                    {/* Order Details Card / The Receipt */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-[3rem] p-10 border border-slate-100 flex flex-col justify-between shadow-2xl relative overflow-hidden receipt-container"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] no-print">
                            <Package size={120} className="text-slate-950" />
                        </div>

                        <div className="space-y-8 relative z-10">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 no-print">
                                    <Package size={22} className="text-slate-950" />
                                </div>
                                <div>
                                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Order Identifier</h4>
                                    <p className="text-base font-black text-slate-950 font-mono tracking-wider">{orderId}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 no-print">
                                    <Calendar size={22} className="text-slate-950" />
                                </div>
                                <div>
                                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Expected Arrival</h4>
                                    <p className="text-base font-black text-slate-950">{arrivalDate}, by 6:00 PM</p>
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

                        <div className="pt-12 space-y-3 no-print">
                            <button 
                                onClick={() => window.print()}
                                className="w-full bg-slate-50 text-slate-950 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-3"
                            >
                                <Download size={16} /> Download Protocol Receipt
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
                                className="w-full bg-slate-950 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-3"
                            >
                                <Share2 size={16} /> Share Transaction
                            </button>
                        </div>
                    </motion.div>

                    {/* Next Steps / CTA Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between no-print"
                    >
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Real-time Tracking Active</span>
                            </div>
                            <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-[0.9] mb-6">
                                Monitor Your<br />Asset Flow.
                            </h2>
                            <p className="text-slate-400 text-sm font-bold leading-relaxed mb-8 max-w-xs">
                                Stay updated with live GPS telemetry from our regional hub to your coordinates.
                            </p>
                        </div>

                        <div className="relative z-10 space-y-4">
                            <Link
                                href="/orders"
                                className="w-full bg-white text-slate-950 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-3 group"
                            >
                                <Truck size={18} /> Access Live Tracking <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/products"
                                className="w-full bg-white/5 text-white border border-white/10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                            >
                                <ShoppingBag size={16} /> Continue Shopping
                            </Link>
                        </div>

                        {/* Abstract Decor */}
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
                        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
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
