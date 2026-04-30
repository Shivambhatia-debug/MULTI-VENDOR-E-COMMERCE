"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import {
    Truck,
    Plus,
    Search,
    Filter,
    Phone,
    Star,
    ArrowUpRight,
    Lock,
    User
} from "lucide-react";
import Link from "next/link";

import { useMerchant } from "@/context/MerchantContext";

export default function DriversPage() {
    const { activePlan } = useMerchant();
    const drivers = [
        { id: "d1", name: "Khalid Mansour", phone: "+974 5500 1122", rating: 4.9, activeOrders: 2, status: "On Duty" },
        { id: "d2", name: "Omar Farooq", phone: "+974 3300 4455", rating: 4.7, activeOrders: 0, status: "Idle" },
    ];

    const isAddonActive = false;

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />

            <main className="flex-1 p-6 lg:p-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Fleet Management</h1>
                        <p className="text-slate-500 text-xs mt-1">Manage your delivery drivers, assignments, and performance.</p>
                    </div>
                </div>

                {/* Add-on Banner for Basic */}
                {activePlan === "Basic" && !isAddonActive && (
                    <div className="mb-8 p-6 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6 text-center md:text-left">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/30">
                                    <Truck size={32} />
                                </div>
                                <div className="max-w-md">
                                    <h3 className="text-lg font-black tracking-tight mb-2">Efficient Delivery Fleet</h3>
                                    <p className="text-xs text-emerald-50 font-medium leading-relaxed">
                                        The Basic plan includes external logistics only. Activate the **Internal Driver Management** add-on to track your own fleet for just **25 QAR/month**.
                                    </p>
                                </div>
                            </div>
                            <div className="shrink-0">
                                <button className="bg-white text-emerald-600 px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2">
                                    Unlock Fleet mgmt
                                    <ArrowUpRight size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
                    </div>
                )}

                {/* Content Grid (Gated) */}
                <div className={`space-y-6 ${!isAddonActive && activePlan === 'Basic' ? 'opacity-40 pointer-events-none' : ''}`}>
                    <div className="card-saas p-4 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input type="text" placeholder="Search drivers..." className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl text-[11px]" disabled />
                        </div>
                        <button className="btn-primary py-3 px-6 text-[10px] uppercase font-black flex items-center gap-2">
                            <Plus size={16} /> Add Driver
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {drivers.map((driver) => (
                            <div key={driver.id} className="card-saas p-5 flex flex-col gap-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-900">{driver.name}</h4>
                                            <p className="text-[10px] text-slate-400 mt-1 font-medium">{driver.phone}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${driver.status === 'On Duty' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                                        }`}>
                                        {driver.status}
                                    </span>
                                </div>
                                <div className="flex justify-between border-t border-slate-50 pt-4">
                                    <div className="flex items-center gap-1.5">
                                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-[11px] font-black text-slate-700">{driver.rating}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">Active Orders</p>
                                        <p className="text-[11px] font-black text-slate-700">{driver.activeOrders}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
