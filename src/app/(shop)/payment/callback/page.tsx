"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Clock, ArrowRight, ShoppingBag } from "lucide-react";
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
                        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-100">
                            <CheckCircle2 size={48} className="text-emerald-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tighter">Payment Successful!</h1>
                            <p className="text-sm text-slate-500 font-medium mt-2">Your order has been confirmed and is being processed.</p>
                        </div>
                        {paymentInfo && (
                            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-left space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount Paid</span>
                                    <span className="text-lg font-black text-slate-950">QAR {paymentInfo.amount}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</span>
                                    <span className="text-[10px] font-bold text-slate-600 font-mono">{paymentInfo.transaction_id?.slice(0, 16)}...</span>
                                </div>
                            </div>
                        )}
                        <div className="flex flex-col sm:flex-row gap-3">
                            {JSON.parse(localStorage.getItem("golalita_pending_payment") || "{}").type === "subscription" ? (
                                <Link href="/dashboard" className="flex-1 bg-slate-950 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95">
                                    <CheckCircle2 size={16} /> Go to Dashboard
                                </Link>
                            ) : (
                                <Link href="/products" className="flex-1 bg-slate-950 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95">
                                    <ShoppingBag size={16} /> Continue Shopping
                                </Link>
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
