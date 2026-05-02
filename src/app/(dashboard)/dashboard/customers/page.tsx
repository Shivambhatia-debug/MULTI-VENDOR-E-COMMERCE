"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import {
    Users,
    Search,
    Filter,
    MoreHorizontal,
    UserPlus,
    Mail,
    Phone,
    ArrowUpRight,
    Lock,
    Sparkles,
    ArrowRight
} from "lucide-react";
import Link from "next/link";

import { useMerchant } from "@/context/MerchantContext";

export default function CustomersPage() {
    const { activePlan } = useMerchant();
    const [customers, setCustomers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("golalita_token");
                const response = await fetch("/api/python/customers", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setCustomers(data);
                }
            } catch (err) {
                console.error("FETCH_CUSTOMERS_ERROR:", err);
                setError("Failed to sync customer intelligence");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    const isAddonActive = false; // Mock state

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />

            <main className="flex-1 p-6 lg:p-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                    <div>
                        <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tighter">Customer CRM</h1>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">Identity & Loyalty Intelligence</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        {isAddonActive || activePlan !== "Basic" ? (
                            <button className="bg-slate-950 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95 grow md:grow-0">
                                <UserPlus size={18} />
                                Add New Entity
                            </button>
                        ) : (
                            <div className="flex items-center gap-4 bg-white border border-slate-200 px-6 py-3.5 rounded-2xl shadow-sm grow md:grow-0">
                                <Lock size={16} className="text-slate-400" />
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Add-on Locked</span>
                                    <Link href="/dashboard/settings" className="text-[10px] font-black uppercase text-slate-950 hover:underline flex items-center gap-1">+25 QAR / Month <ArrowRight size={12} /></Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Growth Accelerator Banner for Basic */}
                {activePlan === "Basic" && !isAddonActive && (
                    <div className="mb-12 p-10 bg-slate-950 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group border border-white/5">
                        {/* Abstract Decor */}
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-white/10 transition-all duration-1000" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                            <div className="flex items-center gap-8 text-center md:text-left">
                                <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/10 group-hover:scale-110 transition-transform duration-700 shadow-2xl">
                                    <Users size={36} className="text-slate-300" />
                                </div>
                                <div className="max-w-xl">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-3 leading-none italic">Intelligence Unlocked</h3>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed opacity-80">
                                        Activate the full **Customer Data Infrastructure** to monitor profiles, track loyalty velocity, and deploy precision marketing.
                                    </p>
                                </div>
                            </div>
                            <div className="shrink-0">
                                <button className="bg-white text-slate-950 px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest shadow-2xl hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-3">
                                    Activate Growth Engine
                                    <ArrowUpRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tactical Controls */}
                <div className="card-saas p-6 mb-12 flex flex-col md:flex-row gap-4 shadow-lg border-slate-100/50">
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-950 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Locate profiles by name, email, or device link..."
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:bg-white focus:border-slate-300 outline-none transition-all"
                        />
                    </div>
                    <button className="w-full md:w-auto px-10 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 hover:text-slate-950 flex items-center justify-center gap-3 transition-all shadow-sm">
                        <Filter size={18} />
                        CRM Filters
                    </button>
                </div>

                {/* Intelligence Table */}
                <div className="card-saas overflow-hidden border-slate-200/50 shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-50">
                                    <th className="p-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Entity Signature</th>
                                    <th className="p-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Orders</th>
                                    <th className="p-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Lifetime Value</th>
                                    <th className="p-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Last Interaction</th>
                                    <th className="p-8 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 bg-white">
                                {customers.length > 0 ? customers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-slate-50 transition-all group">
                                        <td className="p-8">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black text-slate-950 uppercase tracking-tighter group-hover:italic transition-all">{customer.name}</span>
                                                <div className="flex gap-6 mt-3">
                                                    <span className="flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                                        <Mail size={12} className="text-slate-300" />
                                                        {customer.email}
                                                    </span>
                                                    <span className="flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                                        <Phone size={12} className="text-slate-300" />
                                                        {customer.phone}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8 text-center">
                                            <span className="text-[11px] font-black text-slate-950 tracking-tighter">{customer.orders}</span>
                                        </td>
                                        <td className="p-8 text-center">
                                            <span className="text-xs font-black text-slate-950 underline decoration-slate-200 decoration-2 underline-offset-4">{customer.totalSpent}</span>
                                        </td>
                                        <td className="p-8 text-center">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{customer.lastOrder}</span>
                                        </td>
                                        <td className="p-8 text-right">
                                            <button className="p-3 hover:bg-white hover:shadow-lg border border-transparent hover:border-slate-100 rounded-2xl text-slate-400 hover:text-slate-950 transition-all">
                                                <MoreHorizontal size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="p-32 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-30">
                                                <Users size={48} className="text-slate-300" />
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                                    {isLoading ? "Synchronizing Entity Streams..." : "No Customer Data in Registry"}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
