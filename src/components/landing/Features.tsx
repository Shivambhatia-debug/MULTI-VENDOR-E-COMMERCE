"use client";

import {
    Zap,
    Globe,
    BarChart3,
    CreditCard,
    Layout,
    Smartphone
} from "lucide-react";

const features = [
    {
        title: "Store Builder",
        description: "High-fidelity editorial layouts with real-time visual anchoring.",
        icon: Layout,
        preview: "bg-slate-100 rounded-xl h-24 mb-6 relative overflow-hidden"
    },
    {
        title: "Merchant Console",
        description: "Unified commerce engine for inventory, orders, and branch logic.",
        icon: Smartphone,
        preview: "bg-slate-900 rounded-xl h-24 mb-6 relative overflow-hidden"
    },
    {
        title: "Marketplace Synergy",
        description: "Automatic synchronization with the global Golalita consumer network.",
        icon: Globe,
        preview: "bg-indigo-50/50 rounded-xl h-24 mb-6 relative overflow-hidden"
    },
    {
        title: "Noir Analytics",
        description: "Predictive data models and performance metrics at a glance.",
        icon: BarChart3,
        preview: "bg-slate-50 border border-slate-100 rounded-xl h-24 mb-6 relative overflow-hidden"
    },
    {
        title: "Global Payments",
        description: "Secure, multi-currency processing for 140+ countries.",
        icon: CreditCard,
        preview: "bg-slate-100/50 rounded-xl h-24 mb-6 relative overflow-hidden"
    },
    {
        title: "24h Launch",
        description: "Accelerated onboarding protocol for immediate market entry.",
        icon: Zap,
        preview: "bg-slate-50/80 rounded-xl h-24 mb-6 relative overflow-hidden"
    }
];

export default function Features() {
    return (
        <section id="features" className="section-padding py-32 bg-slate-50/40">
            <div className="text-center max-w-2xl mx-auto mb-24">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Core Infrastructure</h2>
                <p className="text-4xl lg:text-5xl font-black text-slate-950 tracking-tighter mb-6 uppercase">Powerful tools, <br /> zero complexity.</p>
                <div className="w-12 h-1 bg-slate-900 mx-auto mb-8" />
                <p className="text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
                    Golalita provides a unified engine designed for the next generation of global brands.
                    Experience the precision of the Noir Design Protocol.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="p-8 bg-white border border-slate-100 rounded-[32px] group hover:border-slate-300 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                    >
                        {/* FEATURE PREVIEW BLOCK */}
                        <div className={feature.preview}>
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-400 to-transparent" />
                            <div className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-500">
                                <feature.icon size={16} />
                            </div>
                            <div className="absolute bottom-4 right-4 flex gap-1 items-end pointer-events-none opacity-20">
                                <div className="w-1 h-3 bg-slate-900 rounded-full" />
                                <div className="w-1 h-6 bg-slate-900 rounded-full" />
                                <div className="w-1 h-2 bg-slate-900 rounded-full" />
                            </div>
                        </div>

                        <h3 className="text-sm font-black text-slate-900 mb-2 uppercase tracking-tight">{feature.title}</h3>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
