"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, Truck, MapPin, Package, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState("");
    const [isTracking, setIsTracking] = useState(false);

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        setIsTracking(true);
    };

    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            
            <div className="pt-32 pb-20 section-padding max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-black text-slate-950 uppercase tracking-tighter leading-none italic underline decoration-blue-600 decoration-4 underline-offset-8 mb-4">Logistics Tracking</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Real-time surveillance of your premium acquisitions</p>
                </div>

                <div className="bg-slate-50 rounded-[3rem] p-8 lg:p-12 border border-slate-100 shadow-xl mb-12">
                    <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-950 transition-colors" size={18} />
                            <input 
                                type="text"
                                placeholder="ENTER ORDER ID (E.G. GOL-TXN-9821)"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-[1.5rem] py-5 pl-16 pr-6 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-slate-950 transition-all shadow-sm"
                            />
                        </div>
                        <button 
                            type="submit"
                            className="bg-slate-950 text-white px-10 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                        >
                            Surveillance
                        </button>
                    </form>
                </div>

                <AnimatePresence>
                    {isTracking && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {/* Tracking Status Card */}
                            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                                <div className="flex flex-wrap items-center justify-between gap-6 mb-10 pb-10 border-b border-slate-50 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                                            <Truck size={32} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-slate-950 uppercase tracking-tighter italic">{orderId || "GOL-TXN-9821"}</h2>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Status: In Transit (Express)</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Estimated Arrival</p>
                                        <p className="text-xl font-black text-slate-950 uppercase tracking-tighter">May 08, 2026</p>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="relative space-y-12 pl-10 z-10">
                                    <div className="absolute left-[20px] top-4 bottom-4 w-1 bg-slate-100 rounded-full" />
                                    
                                    {[
                                        { title: "Dispatch Processed", desc: "Global Logistics Center, Doha", time: "Today, 10:45 AM", icon: CheckCircle2, active: true },
                                        { title: "Quality Verification", desc: "Merchant Warehouse, Al Khor", time: "Yesterday, 04:30 PM", icon: ShieldCheck, active: true },
                                        { title: "Order Confirmed", desc: "Payment Engine Verified", time: "May 02, 09:12 AM", icon: Package, active: true },
                                    ].map((step, i) => (
                                        <div key={i} className="relative">
                                            <div className={`absolute -left-[30px] w-6 h-6 rounded-full border-4 border-white shadow-lg flex items-center justify-center transition-colors z-10 ${step.active ? 'bg-blue-600' : 'bg-slate-200'}`} />
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className={`text-xs font-black uppercase tracking-widest ${step.active ? 'text-slate-950' : 'text-slate-400'}`}>{step.title}</h3>
                                                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter italic">{step.time}</span>
                                                </div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em]">{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Footer />
        </main>
    );
}
