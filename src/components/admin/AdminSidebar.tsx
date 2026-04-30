"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Store,
    Settings,
    Bell,
    ShieldCheck,
    BarChart3,
    LogOut
} from "lucide-react";

const menuItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/admin" },
    { label: "Merchants", icon: Users, href: "/admin/merchants" },
    { label: "Global Stores", icon: Store, href: "/admin/stores" },
    { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
    { label: "Verification", icon: ShieldCheck, href: "/admin/verification" },
    { label: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col">
            <div className="p-6">
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">G</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900">Admin</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`pro-sidebar-item ${isActive ? "pro-sidebar-item-active" : ""}`}
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button className="pro-sidebar-item w-full text-red-600 hover:bg-red-50 hover:text-red-700">
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
