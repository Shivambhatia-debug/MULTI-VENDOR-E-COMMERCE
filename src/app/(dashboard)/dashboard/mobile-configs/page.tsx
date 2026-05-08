"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import { Smartphone, Layout, Bell, Palette, Upload, CheckCircle2, Lock } from "lucide-react";
import Image from "next/image";
import { useMerchant } from "@/context/MerchantContext";

export default function MobileConfigsPage() {
    const { activePlan } = useMerchant();

    if (activePlan !== "Mobile App") {
        return (
            <div className="min-h-screen bg-slate-50 flex">
                <Sidebar />
                <main className="flex-1 p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
                        <Lock size={40} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Mobile App Tier Required</h1>
                    <p className="text-slate-500 max-w-md mb-8">
                        The Native Mobile App management dashboard is exclusively available for the **Mobile App** plan subscribers.
                        Launch your own brand on iOS and Android with custom splash screens and push alerts.
                    </p>
                    <button className="btn-primary px-8 py-3 uppercase tracking-widest text-[10px]">Upgrade to Mobile App Tier</button>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-8">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Native App Configuration</h1>
                        <p className="text-slate-500 text-xs mt-1">Configure your brand presence on App Store and Google Play.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-950 text-white px-4 py-2 rounded-xl shadow-xl">
                        <Smartphone size={14} className="text-blue-400" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Enterprise Tier</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="space-y-8">
                        {/* App Branding */}
                        <div className="card-saas p-6">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Palette size={14} className="text-blue-500" />
                                Visual Identity
                            </h3>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Primary Color</label>
                                        <div className="flex items-center gap-2 p-3 border border-slate-100 rounded-xl bg-slate-50">
                                            <div className="w-6 h-6 bg-blue-600 rounded-md border border-white shadow-sm" />
                                            <span className="text-[10px] font-bold text-slate-600">#2563EB</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Accent Color</label>
                                        <div className="flex items-center gap-2 p-3 border border-slate-100 rounded-xl bg-slate-50">
                                            <div className="w-6 h-6 bg-slate-900 rounded-md border border-white shadow-sm" />
                                            <span className="text-[10px] font-bold text-slate-600">#0F172A</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Splash Screen Logo</label>
                                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
                                        <Upload size={24} className="text-slate-300 mb-2" />
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Click to re-upload</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Push Notifications */}
                        <div className="card-saas p-6">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Bell size={14} className="text-blue-500" />
                                Push Alerts Service
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 size={18} className="text-emerald-500" />
                                        <div>
                                            <p className="text-[11px] font-black text-slate-900">Notifications Enabled</p>
                                            <p className="text-[9px] text-slate-500">Firebase Cloud Messaging connected</p>
                                        </div>
                                    </div>
                                    <span className="text-[8px] font-black text-emerald-600 bg-white px-2 py-1 rounded shadow-sm border border-emerald-100 uppercase tracking-tighter">Healthy</span>
                                </div>
                                <button className="w-full py-4 bg-slate-950 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10">Send Announcement to All Users</button>
                            </div>
                        </div>
                    </div>

                    {/* App Preview Mockup */}
                    <div className="flex justify-center">
                        <div className="relative w-full max-w-[340px]">
                            <div className="bg-slate-900 rounded-[3.5rem] p-4 shadow-2xl border border-slate-800">
                                <div className="bg-white rounded-[2.8rem] aspect-[9/19] overflow-hidden relative shadow-inner">
                                    <div className="p-8">
                                        <div className="flex justify-between items-center mb-12">
                                            <div className="w-10 h-10 rounded-2xl flex items-center justify-center relative shadow-lg shadow-blue-200">
                                                <Image src="/web background/web background/logo 2 png.png" alt="Golalita" fill className="object-contain p-1" />
                                            </div>
                                            <div className="w-10 h-4 bg-slate-50 border border-slate-100 rounded-full" />
                                        </div>
                                        <div className="space-y-6">
                                            <div className="h-6 w-3/4 bg-slate-100 rounded-full" />
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="aspect-[4/5] bg-slate-50 rounded-3xl border border-slate-100" />
                                                <div className="aspect-[4/5] bg-slate-50 rounded-3xl border border-slate-100" />
                                            </div>
                                            <div className="h-32 w-full bg-slate-950 rounded-3xl p-6 relative overflow-hidden">
                                                <div className="relative z-10 space-y-2">
                                                    <div className="h-2 w-12 bg-blue-500 rounded-full" />
                                                    <div className="h-3 w-2/3 bg-white/20 rounded-full" />
                                                </div>
                                                <Smartphone className="absolute -bottom-4 -right-4 w-20 h-20 text-white/5" />
                                            </div>
                                            <div className="h-4 w-1/2 bg-slate-100 rounded-full" />
                                        </div>
                                    </div>
                                    {/* Tab Bar */}
                                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-slate-50 flex justify-around">
                                        <div className="w-6 h-6 bg-blue-600 rounded-lg shadow-md shadow-blue-100" />
                                        <div className="w-6 h-6 bg-slate-100 rounded-lg" />
                                        <div className="w-6 h-6 bg-slate-100 rounded-lg" />
                                        <div className="w-6 h-6 bg-slate-100 rounded-lg" />
                                    </div>
                                </div>
                            </div>
                            {/* Annotation */}
                            <div className="absolute -right-8 top-1/4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/20 max-w-[120px] animate-bounce-slow">
                                <p className="text-[10px] font-black text-slate-800 uppercase leading-none mb-1">Live Shell</p>
                                <p className="text-[8px] text-slate-400 font-medium leading-tight">Instant preview of your native app build</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
