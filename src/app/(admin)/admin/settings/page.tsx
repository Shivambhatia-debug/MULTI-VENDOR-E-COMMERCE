"use client";

import { Settings, Save, Shield, Globe, Bell, CreditCard, Sliders } from "lucide-react";

export default function AdminSettingsPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tighter italic">Platform Config</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60">Global system parameters</p>
                </div>
                <button className="px-8 py-3.5 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-900 transition-all shadow-xl active:scale-95">
                    <Save size={16} /> Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4">
                    {[
                        { label: "General", icon: Settings, active: true },
                        { label: "Security", icon: Shield },
                        { label: "Payments", icon: CreditCard },
                        { label: "Notifications", icon: Bell },
                        { label: "Region & Localization", icon: Globe },
                    ].map((item, i) => (
                        <button key={i} className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all ${item.active ? 'bg-white border-slate-950 text-slate-950 shadow-xl' : 'bg-transparent border-transparent text-slate-400 hover:bg-white hover:border-slate-100 hover:text-slate-600'}`}>
                            <item.icon size={20} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                        </button>
                    ))}
                </div>

                <div className="lg:col-span-2 card-saas p-10 bg-white shadow-2xl border-slate-100">
                    <div className="space-y-12">
                        <div>
                            <h4 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                                <Sliders size={16} /> Marketplace Constants
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Platform Fee (%)</label>
                                    <input type="text" defaultValue="2.5" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-black outline-none focus:ring-2 focus:ring-slate-950" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Default Currency</label>
                                    <input type="text" defaultValue="QAR" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-black outline-none focus:ring-2 focus:ring-slate-950" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-50">
                            <h4 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.3em] mb-8">System Health</h4>
                            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">All microservices operational</span>
                                </div>
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest italic">Uptime: 99.99%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
