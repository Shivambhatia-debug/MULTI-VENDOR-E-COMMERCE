"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import {
    Settings,
    Store,
    CreditCard,
    Bell,
    Shield,
    Globe,
    Mail,
    Phone,
    MapPin,
    Save,
    ChevronRight,
    Camera,
    Sparkles,
    ArrowRight,
    Zap
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("store");

    const tabs = [
        { id: "store", label: "Core Identity", icon: Store },
        { id: "billing", label: "Financial Engine", icon: CreditCard },
        { id: "notifications", label: "Alert Protocols", icon: Bell },
        { id: "security", label: "Encryption", icon: Shield },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />

            <main className="flex-1 p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                    <div>
                        <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tighter">System Control</h1>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">Global Configurations & Infrastructure</p>
                    </div>
                    <button className="bg-slate-950 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl active:scale-95 flex items-center gap-3">
                        <Save size={18} className="text-slate-400" />
                        Commit Changes
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Navigation Sidebar */}
                    <div className="w-full lg:w-72 shrink-0 space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all group ${activeTab === tab.id
                                    ? "bg-slate-950 text-white shadow-2xl translate-x-2"
                                    : "text-slate-400 hover:bg-slate-100 hover:text-slate-950"
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <tab.icon size={20} className={activeTab === tab.id ? "text-slate-300" : "text-slate-300 group-hover:text-slate-950 transition-colors"} />
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
                                </div>
                                <ChevronRight size={16} className={activeTab === tab.id ? "opacity-100" : "opacity-0"} />
                            </button>
                        ))}

                        {/* Upgrade CTA in Sidebar */}
                        <div className="mt-12 p-6 bg-slate-100/50 rounded-3xl border border-slate-200 border-dashed">
                            <Zap size={24} className="text-slate-300 mb-3" />
                            <p className="text-[10px] font-black text-slate-950 uppercase tracking-widest mb-1.5 leading-none">Enterprise Upgrade</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed mb-4">Unlock advanced API access & white-labeling.</p>
                            <Link href="/pricing" className="text-[10px] font-black text-slate-950 uppercase tracking-widest hover:underline flex items-center gap-2">Explore Tiers <ArrowRight size={12} /></Link>
                        </div>
                    </div>

                    {/* Command Surface */}
                    <div className="flex-1 max-w-4xl space-y-10">
                        {activeTab === 'store' && (
                            <div className="space-y-10">
                                {/* Identity Matrix */}
                                <div className="card-saas p-10 border-slate-100/50 shadow-2xl bg-white">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="h-6 w-1 bg-slate-950 rounded-full" />
                                        <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.3em] italic">Identity Matrix</h3>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-16">
                                        <div className="flex flex-col items-center gap-5">
                                            <div className="w-40 h-40 bg-slate-50 rounded-[3rem] flex flex-col items-center justify-center border border-slate-200 border-dashed relative group cursor-pointer overflow-hidden shadow-inner">
                                                <Camera size={32} className="text-slate-300 group-hover:scale-110 group-hover:text-slate-950 transition-all duration-500" />
                                                <p className="text-[9px] font-black text-slate-400 uppercase mt-3 tracking-[0.2em]">Deploy Logo</p>
                                                <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                    <span className="text-white text-[10px] font-black uppercase tracking-[0.3em] translate-y-4 group-hover:translate-y-0 transition-transform">Overwrite</span>
                                                </div>
                                            </div>
                                            <p className="text-[9px] text-slate-400 text-center uppercase tracking-[0.2em] font-bold opacity-60">RAW, PNG, WEBP<br />LIMIT 2.0 MB</p>
                                        </div>

                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Entity Name</label>
                                                <input type="text" defaultValue="Golalita Demo Store" className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl text-[11px] font-black text-slate-950 uppercase tracking-widest focus:bg-white focus:border-slate-300 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Market Category</label>
                                                <select className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl text-[11px] font-black text-slate-950 uppercase tracking-widest focus:bg-white focus:border-slate-300 outline-none transition-all appearance-none cursor-pointer">
                                                    <option>Tactical Retail</option>
                                                    <option>Food & Beverage</option>
                                                    <option>Luxury Lifestyle</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-2 space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Store Manifesto</label>
                                                <textarea rows={4} className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl text-[11px] font-black text-slate-950 uppercase tracking-widest focus:bg-white focus:border-slate-300 outline-none transition-all resize-none overflow-hidden" placeholder="Define your brand trajectory..."></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Channel Connectivity */}
                                <div className="card-saas p-10 border-slate-100/50 shadow-2xl bg-white">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="h-6 w-1 bg-slate-950 rounded-full" />
                                        <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.3em] italic">Connectivity Node</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1 flex items-center gap-3">
                                                <Mail size={14} className="text-slate-300" />
                                                Support Protocol
                                            </label>
                                            <input type="email" defaultValue="nexus@golalita.qa" className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl text-[11px] font-black text-slate-950 uppercase tracking-widest focus:bg-white focus:border-slate-300 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1 flex items-center gap-3">
                                                <Phone size={14} className="text-slate-300" />
                                                Operational Line
                                            </label>
                                            <input type="text" defaultValue="+974 NEXUS 001" className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl text-[11px] font-black text-slate-950 uppercase tracking-widest focus:bg-white focus:border-slate-300 outline-none transition-all" />
                                        </div>
                                        <div className="md:col-span-2 space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1 flex items-center gap-3">
                                                <MapPin size={14} className="text-slate-300" />
                                                Global Nexus Location
                                            </label>
                                            <input type="text" defaultValue="Sector 7, Quantum District, Doha Core" className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl text-[11px] font-black text-slate-950 uppercase tracking-widest focus:bg-white focus:border-slate-300 outline-none transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'billing' && (
                            <div className="card-saas p-16 text-center space-y-10 border-slate-100 shadow-2xl relative overflow-hidden group">
                                {/* Abstract Background Decor */}
                                <div className="absolute top-0 left-0 w-full h-full bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />

                                <div className="w-24 h-24 bg-slate-950 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                                    <CreditCard size={44} />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black text-slate-950 tracking-tighter uppercase italic">Premium Infrastructure</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed">
                                        Your entity is deployed on the **Prime Strategy Stack (4,500 QAR/Year)**. Next billing cycle initializes: <span className="text-slate-950">April 2027</span>.
                                    </p>
                                </div>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <button className="px-10 py-4 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl active:scale-95">Download Protocol Invoice</button>
                                    <button className="px-10 py-4 bg-white border border-slate-200 text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-sm">Recalibrate Plan</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
