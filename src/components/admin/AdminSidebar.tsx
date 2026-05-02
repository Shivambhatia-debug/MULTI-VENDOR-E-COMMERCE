"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Users, Store, Settings,
    Bell, ShieldCheck, BarChart3, LogOut, Menu, X, Sparkles
} from "lucide-react";
import { useState } from "react";

const menuItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/admin" },
    { label: "Merchants", icon: Users, href: "/admin/merchants" },
    { label: "Global Stores", icon: Store, href: "/admin/stores" },
    { label: "Marketplace", icon: Sparkles, href: "/admin/marketplace" },
    { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
    { label: "Verification", icon: ShieldCheck, href: "/admin/verification" },
    { label: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Toggle */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-white border border-slate-200 rounded-xl shadow-xl text-slate-950"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-[50] lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`fixed lg:sticky top-0 left-0 z-[55] w-72 bg-white border-r border-slate-100 h-screen transition-transform duration-500 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 flex flex-col`}>
                <div className="p-8">
                    <Link href="/admin" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-slate-950 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                            <span className="text-white font-black text-xl italic">G</span>
                        </div>
                        <div>
                            <span className="text-lg font-black text-slate-950 tracking-tighter block leading-none">Admin</span>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Marketplace OS</span>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto scrollbar-hide">
                    <p className="px-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Core Infrastructure</p>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                                    isActive 
                                    ? "bg-slate-950 text-white shadow-2xl shadow-slate-950/20" 
                                    : "text-slate-400 hover:text-slate-950 hover:bg-slate-50"
                                }`}
                            >
                                <item.icon size={18} className={isActive ? "text-white" : "group-hover:scale-110 transition-transform"} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-slate-50 bg-slate-50/30">
                    <button className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all font-black text-[10px] uppercase tracking-widest">
                        <LogOut size={18} />
                        <span>Terminate Session</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
