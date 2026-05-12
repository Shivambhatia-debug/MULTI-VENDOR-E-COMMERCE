"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Clock, ArrowRight, ShoppingBag, Smartphone, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useMerchant } from "@/context/MerchantContext";

type PaymentStatus = "checking" | "paid" | "pending" | "failed" | "cancelled";

export default function PaymentCallbackPage() {
    const router = useRouter();
    const { refreshUser } = useMerchant();
    const [status, setStatus] = useState<PaymentStatus>("checking");
    const [paymentInfo, setPaymentInfo] = useState<any>(null);

    useEffect(() => {
        const checkPayment = async () => {
            try {
                const pendingData = localStorage.getItem("golalita_pending_payment");
                if (!pendingData) {
                    setStatus("failed");
                    return;
                }

                const { paymentId, transactionId } = JSON.parse(pendingData);

                // Poll for payment status
                let attempts = 0;
                const maxAttempts = 10;

                const poll = async (): Promise<void> => {
                    attempts++;
                    const res = await fetch(`/api/python/payments/status/${paymentId}/`);
                    
                    if (res.ok) {
                        const data = await res.json();
                        setPaymentInfo(data);

                        if (data.status === "paid") {
                            setStatus("paid");
                            await refreshUser();
                            localStorage.removeItem("golalita_pending_payment");
                            return;
                        } else if (data.status === "failed" || data.status === "rejected") {
                            setStatus("failed");
                            localStorage.removeItem("golalita_pending_payment");
                            return;
                        } else if (data.status === "cancelled") {
                            setStatus("cancelled");
                            localStorage.removeItem("golalita_pending_payment");
                            return;
                        } else if (attempts < maxAttempts) {
                            // Wait 2 seconds and try again
                            await new Promise(r => setTimeout(r, 2000));
                            return poll();
                        } else {
                            setStatus("pending");
                        }
                    } else {
                        if (attempts < maxAttempts) {
                            await new Promise(r => setTimeout(r, 2000));
                            return poll();
                        }
                        setStatus("pending");
                    }
                };

                await poll();
            } catch (err) {
                console.error("PAYMENT_CHECK_ERROR:", err);
                setStatus("pending");
            }
        };

        checkPayment();
    }, []);

    return (
        <main className="min-h-screen bg-slate-50">
            <Navbar invert={true} />

            <div className="pt-32 pb-20 section-padding max-w-lg mx-auto text-center">
                {status === "checking" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                            <Loader2 size={40} className="text-blue-600 animate-spin" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tighter">Verifying Payment</h1>
                            <p className="text-sm text-slate-500 font-medium mt-2">Please wait while we confirm your transaction...</p>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                    </motion.div>
                )}

                {status === "paid" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8"
                    >
                        <div className="relative">
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.2 }}
                                className="w-28 h-28 bg-slate-950 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl relative z-10"
                            >
                                <CheckCircle2 size={56} className="text-white" />
                            </motion.div>
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-dashed border-slate-200 rounded-full"
                            />
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-4xl font-black text-slate-950 uppercase tracking-tighter italic">Protocol Authorized.</h1>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest max-w-xs mx-auto">
                                {JSON.parse(localStorage.getItem("golalita_pending_payment") || "{}").type === "subscription" 
                                    ? "Your infrastructure has been upgraded to the new tier. System protocols are now operational."
                                    : "Your transaction has been secured. Our logistics network has been notified."}
                            </p>
                        </div>

                        {paymentInfo && (
                            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-2xl text-left space-y-4 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <BarChart3 size={80} className="text-slate-950" />
                                </div>
                                
                                <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction Value</span>
                                    <span className="text-2xl font-black text-slate-950 italic">QAR {paymentInfo.amount}</span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Node ID</span>
                                        <p className="text-[10px] font-bold text-slate-950 font-mono tracking-tighter truncate">{paymentInfo.transaction_id}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Type</span>
                                        <p className="text-[10px] font-black text-slate-950 uppercase italic">{paymentInfo.payment_type}</p>
                                    </div>
                                </div>

                                {paymentInfo.plan && (
                                    <div className="pt-4 mt-4 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center text-white">
                                                <Smartphone size={16} />
                                            </div>
                                            <span className="text-[11px] font-black text-slate-950 uppercase tracking-tighter">{paymentInfo.plan} Tier Active</span>
                                        </div>
                                        <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[8px] font-black uppercase tracking-widest">Verified</div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col gap-3 pt-4">
                            {JSON.parse(localStorage.getItem("golalita_pending_payment") || "{}").type === "subscription" ? (
                                <>
                                    <Link href="/dashboard" className="w-full bg-slate-950 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-900 transition-all flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.1)] active:scale-95 group">
                                        Initialize Dashboard <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link href="/" className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-950 transition-colors">Return to Hub</Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/products" className="w-full bg-slate-950 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-900 transition-all flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.1)] active:scale-95">
                                        <ShoppingBag size={16} /> Continue Shopping
                                    </Link>
                                    <Link href="/orders" className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-950 transition-colors">Track Your Package</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}

                {status === "pending" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                            <Clock size={40} className="text-amber-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tighter">Payment Processing</h1>
                            <p className="text-sm text-slate-500 font-medium mt-2">
                                Your payment is still being processed. You will receive a confirmation email once completed.
                            </p>
                        </div>
                        <Link href="/products" className="inline-flex items-center gap-2 bg-slate-950 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl active:scale-95">
                            Continue Shopping <ArrowRight size={14} />
                        </Link>
                    </motion.div>
                )}

                {(status === "failed" || status === "cancelled") && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
                            <XCircle size={48} className="text-rose-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tighter">
                                {status === "cancelled" ? "Payment Cancelled" : "Payment Failed"}
                            </h1>
                            <p className="text-sm text-slate-500 font-medium mt-2">
                                {status === "cancelled" 
                                    ? "You cancelled the payment. Your order has not been processed."
                                    : "Something went wrong with your payment. Please try again."}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link href="/cart" className="flex-1 bg-slate-950 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95">
                                <ArrowRight size={14} /> Try Again
                            </Link>
                            <Link href="/products" className="flex-1 bg-white text-slate-950 border-2 border-slate-200 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-95">
                                <ShoppingBag size={14} /> Browse Store
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
