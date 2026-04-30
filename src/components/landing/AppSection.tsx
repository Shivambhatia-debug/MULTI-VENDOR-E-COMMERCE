"use client";

import { Smartphone, Bell, Heart, Star, CheckCircle2 } from "lucide-react";

export default function AppSection() {
    const appFeatures = [
        { icon: Bell, title: "Real-time Alerts", sub: "Instant order updates" },
        { icon: Heart, title: "Loyalty Engine", sub: "Manage customer rewards" },
        { icon: Star, title: "Insights", sub: "Customer sentiment analysis" },
        { icon: Smartphone, title: "Live Support", sub: "Direct merchant chat" },
    ];

    return (
        <section className="section-padding py-32 bg-slate-950 rounded-[3rem] text-white relative overflow-hidden my-24 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full bg-slate-800/10 pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
                <div className="max-w-2xl px-6 lg:px-0">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12">
                        <Smartphone size={12} />
                        <span>Merchant Mobile App</span>
                    </div>

                    <h2 className="text-4xl lg:text-7xl font-black mb-10 leading-[0.9] tracking-tighter uppercase">
                        Run Your <br />
                        <span className="text-slate-400">Business Anywhere.</span>
                    </h2>

                    <p className="text-base text-slate-500 mb-14 leading-relaxed font-medium max-w-xl">
                        Our merchant app puts your entire store in your pocket.
                        Manage products, track orders, and see your sales in real-time, from any location.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
                        {appFeatures.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 bg-white/3 border border-white/5 p-5 rounded-2xl hover:bg-white/10 transition-all duration-500 border-white/5">
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white">
                                    <item.icon size={20} />
                                </div>
                                <div>
                                    <p className="text-[12px] font-black text-white uppercase tracking-tighter">{item.title}</p>
                                    <p className="text-[10px] text-slate-500 font-medium">{item.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                <div className="relative flex justify-center lg:justify-end">
                    <div className="relative z-10 w-full max-w-[320px]">
                        {/* Compact Mobile Mockup */}
                        <div className="bg-slate-800 rounded-[3rem] p-3 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] border border-slate-700">
                            <div className="bg-white rounded-[2.5rem] aspect-[9/19.5] overflow-hidden relative shadow-inner">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-8">
                                        <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-[10px] font-black">G</span>
                                        </div>
                                        <div className="w-8 h-2 bg-slate-100 rounded-full"></div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Sales</p>
                                            <p className="text-xl font-black text-slate-950 tracking-tighter">QAR 12,450.00</p>
                                        </div>

                                        {/* Simple SVG Chart */}
                                        <div className="h-20 w-full bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden p-2">
                                            <svg className="w-full h-full text-blue-600" viewBox="0 0 100 40" fill="none" preserveAspectRatio="none">
                                                <path d="M0 35 C 20 30, 40 10, 60 25 S 80 5, 100 15V40H0Z" fill="currentColor" fillOpacity="0.1" />
                                                <path d="M0 35 C 20 30, 40 10, 60 25 S 80 5, 100 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                <circle cx="100" cy="15" r="3" fill="currentColor" />
                                            </svg>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                                <p className="text-[7px] font-black text-slate-400 uppercase">Orders</p>
                                                <p className="text-sm font-black text-slate-900">142</p>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                                <p className="text-[7px] font-black text-slate-400 uppercase">Visits</p>
                                                <p className="text-sm font-black text-slate-900">2.1K</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <p className="text-[7px] font-black text-slate-400 uppercase">Recent Activity</p>
                                            {[1, 2].map((i) => (
                                                <div key={i} className="flex justify-between items-center p-2 bg-white rounded-lg border border-slate-50 shadow-sm">
                                                    <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-[8px] font-bold">#{840 + i}</div>
                                                    <div className="w-20 h-1.5 bg-slate-100 rounded-full"></div>
                                                    <div className="w-8 h-1.5 bg-emerald-100 rounded-full"></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {/* Mock Navigation */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 flex justify-around">
                                    <div className="w-5 h-5 bg-blue-600 rounded"></div>
                                    <div className="w-5 h-5 bg-slate-100 rounded"></div>
                                    <div className="w-5 h-5 bg-slate-100 rounded"></div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Interaction UI */}
                        <div className="absolute top-1/2 -left-12 bg-white/95 backdrop-blur-xl p-4 rounded-xl shadow-2xl border border-white/20 hidden md:block animate-bounce-slow">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                                    <CheckCircle2 size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">Order #842</p>
                                    <p className="text-[9px] text-slate-500">Shipped successfully</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
