"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle2, ChevronRight, Search, Clock, Box, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function OrdersPage() {
    const [activeTab, setActiveTab] = useState("all");
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("golalita_token");
                const res = await fetch("/api/python/orders?type=purchases", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    // Sort orders by date descending (newest first)
                    const sortedData = data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    setOrders(sortedData);
                }
            } catch (err) {
                console.error("FETCH_ERROR:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(o => {
        if (activeTab === "active") return o.status === "Processing" || o.status === "Shipped";
        if (activeTab === "completed") return o.status === "Fulfilled";
        return true;
    });

    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            
            <div className="pt-32 pb-20 section-padding max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-slate-950 uppercase tracking-tighter leading-none italic underline decoration-blue-600 decoration-4 underline-offset-8">Purchase History</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3 italic">Track & Manage Your Global Acquisitions</p>
                    </div>
                    
                    <div className="flex bg-slate-100 p-1 rounded-2xl">
                        {["all", "active", "completed"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-slate-950 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {isLoading ? (
                        <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-slate-300" size={32} /></div>
                    ) : filteredOrders.length > 0 ? (
                        filteredOrders.map((order, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={order.id}
                                className="group bg-white border border-slate-100 rounded-[2.5rem] p-6 lg:p-8 hover:shadow-2xl hover:border-slate-200 transition-all"
                            >
                                <div className="flex flex-col lg:flex-row gap-8 items-center">
                                    {/* Order Preview */}
                                    <div className="w-full lg:w-32 aspect-square rounded-[1.5rem] bg-slate-950 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center relative">
                                        {order.items_details?.[0]?.image ? (
                                            <img src={order.items_details[0].image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <Package size={40} className="text-white opacity-20" />
                                        )}
                                    </div>

                                    {/* Order Details */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(order.date).toLocaleDateString()}</span>
                                            <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                            <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest">Order ID: #{order.id.slice(-6).toUpperCase()}</span>
                                        </div>
                                        
                                        <div>
                                            <h3 className="text-xl font-black text-slate-950 uppercase tracking-tighter italic">
                                                {order.items_details?.[0]?.name || `Acquisition of ${order.items} items`}
                                                {order.items > 1 && <span className="text-slate-400 ml-2">+ {order.items - 1} more</span>}
                                            </h3>
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'Processing' ? 'bg-amber-500 animate-pulse' : 'bg-blue-500'}`} />
                                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{order.status}</span>
                                                </div>
                                                <span className="text-lg font-black text-slate-950 uppercase tracking-tighter">{order.total}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-auto">
                                        {order.tracking_id ? (
                                            <div className="flex flex-col gap-2 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                                <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Tracking Active</span>
                                                <span className="text-[10px] font-black text-blue-600 uppercase">{order.tracking_id}</span>
                                            </div>
                                        ) : (
                                            <button 
                                                className="flex-1 lg:w-48 bg-slate-50 border border-slate-200 text-slate-400 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest cursor-not-allowed flex items-center justify-center gap-2"
                                                disabled
                                            >
                                                <Clock size={14} /> Pending Transit
                                            </button>
                                        )}
                                        <button className="flex-1 lg:w-48 bg-white border border-slate-200 text-slate-400 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:border-slate-950 hover:text-slate-950 transition-all flex items-center justify-center gap-2">
                                            Receipt <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                                <Box size={32} className="text-slate-200" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tighter italic">No Acquisitions Detected</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 italic">Start exploring our premium marketplace</p>
                            <Link href="/products" className="inline-flex mt-8 px-10 py-4 bg-slate-950 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                                Go Shopping
                            </Link>
                        </div>
                    )}
                </div>
            </div>

        </main>
    );
}
