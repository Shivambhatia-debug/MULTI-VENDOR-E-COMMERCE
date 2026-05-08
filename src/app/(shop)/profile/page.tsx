"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useMerchant } from "@/context/MerchantContext";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Shield, Package, Heart, LogOut, ChevronRight, Edit2 } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    const { user, logout } = useMerchant();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-sm font-black uppercase tracking-widest text-slate-400">Loading Session...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            
            <div className="pt-32 pb-20 section-padding max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Sidebar */}
                    <div className="space-y-8">
                        <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative overflow-hidden">
                            <div className="w-24 h-24 bg-slate-950 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-2xl relative z-10">
                                <span className="text-3xl font-black text-white">{user.name[0]}</span>
                            </div>
                            <h2 className="text-xl font-black text-slate-950 uppercase tracking-tighter relative z-10">{user.name}</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 relative z-10 italic">{user.role} Account</p>
                            
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-slate-200/20 blur-3xl rounded-full -translate-y-1/2" />
                        </div>

                        <div className="bg-white border border-slate-100 rounded-3xl p-2 space-y-1">
                            {[
                                { name: "My Orders", icon: Package, href: "/orders" },
                                { name: "Wishlist", icon: Heart, href: "/wishlist" },
                                { name: "Account Settings", icon: Shield, href: "/settings" },
                            ].map((item) => (
                                <Link 
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-slate-950 group-hover:text-white transition-all">
                                            <item.icon size={18} />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{item.name}</span>
                                    </div>
                                    <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ))}
                            <button 
                                onClick={logout}
                                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-red-50 transition-all group text-left"
                            >
                                <div className="w-10 h-10 bg-red-50 text-red-400 rounded-xl flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all">
                                    <LogOut size={18} />
                                </div>
                                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Sign Out</span>
                            </button>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tighter italic underline decoration-blue-600 decoration-4 underline-offset-8">Profile Details</h1>
                                <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all">
                                    <Edit2 size={12} /> Edit Profile
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-blue-600">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Full Name</p>
                                            <p className="text-xs font-black text-slate-900">{user.name}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-blue-600">
                                            <Mail size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                                            <p className="text-xs font-black text-slate-900">{user.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-blue-600">
                                            <Calendar size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Member Since</p>
                                            <p className="text-xs font-black text-slate-900">May 2026</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-blue-600">
                                            <Shield size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Account Type</p>
                                            <p className="text-xs font-black text-slate-900 capitalize">{user.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Placeholder */}
                        <div className="bg-slate-950 rounded-[2.5rem] p-10 text-white overflow-hidden relative">
                            <div className="relative z-10">
                                <h3 className="text-lg font-black uppercase tracking-widest italic mb-2">Exclusive Benefits</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8">As a registered {user.role} of Golalita</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-blue-400">
                                            <Heart size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">Priority Wishlist</h4>
                                            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">Get notified when your items are back in stock.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-amber-400">
                                            <Package size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">Rapid Logistics</h4>
                                            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">Accelerated checkout and real-time tracking.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

        </main>
    );
}
