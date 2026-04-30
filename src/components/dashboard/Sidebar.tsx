"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    HelpCircle,
    Store,
    PieChart,
    LogOut,
    Menu,
    X,
    Wallet,
    Award,
    Truck,
    Tag,
    CalendarCheck,
    MapPin,
    BarChart3,
    Smartphone
} from "lucide-react";
import { useState } from "react";
import { useMerchant } from "@/context/MerchantContext";

const menuItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Inventory", icon: Package, href: "/dashboard/products" },
    { label: "Orders", icon: ShoppingCart, href: "/dashboard/orders" },
    { label: "Customers", icon: Users, href: "/dashboard/customers" },
    { label: "Store Builder", icon: Store, href: "/dashboard/customizer" },
    { label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
];

const subMenuItems = [
    {
        group: "Logistics",
        items: [
            { label: "Branches", icon: MapPin, href: "/dashboard/branches" },
            { label: "Drivers", icon: Truck, href: "/dashboard/drivers" },
        ]
    },
    {
        group: "Growth",
        items: [
            { label: "Coupons", icon: Tag, href: "/dashboard/coupons" },
            { label: "Wallet", icon: Wallet, href: "/dashboard/wallet", gated: true },
            { label: "Loyalty", icon: Award, href: "/dashboard/loyalty", gated: true },
        ]
    },
    {
        group: "Mobile Native",
        items: [
            { label: "App Settings", icon: Smartphone, href: "/dashboard/mobile-configs", mobileOnly: true },
        ]
    },
    {
        group: "F&B Services",
        items: [
            { label: "Table Booking", icon: CalendarCheck, href: "/dashboard/bookings" },
        ]
    }
];

const Sidebar = () => {
    const { activePlan, logout, user } = useMerchant();
    const [isOpen, setIsOpen] = useState(true);
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 p-2 bg-white border border-slate-200 rounded-lg md:hidden shadow-sm"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 flex flex-col`}>
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-lg">G</span>
                        </div>
                        <span className="text-xl font-bold text-slate-900 leading-none tracking-tight text-gradient">Golalita</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto scrollbar-hide">
                    {/* Main Menu */}
                    <div className="space-y-1">
                        <p className="px-4 text-[9px] font-black text-slate-400 border-b border-slate-50 pb-2 mb-3 uppercase tracking-[0.2em]">Merchant Console</p>
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`pro-sidebar-item ${isActive ? "pro-sidebar-item-active" : ""}`}
                                >
                                    <item.icon size={17} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Sub Menus */}
                    {subMenuItems.map((group) => {
                        const visibleItems = group.items.filter(item => {
                            // Gated items shown for Premium and Mobile App
                            if ((item as any).gated && activePlan === "Basic") return false;
                            // Mobile only items shown for Mobile App tier
                            if ((item as any).mobileOnly && activePlan !== "Mobile App") return false;
                            return true;
                        });

                        if (visibleItems.length === 0) return null;

                        return (
                            <div key={group.group} className="space-y-1">
                                <p className="px-4 text-[9px] font-black text-slate-400 border-b border-slate-50 pb-2 mb-3 uppercase tracking-[0.2em]">{group.group}</p>
                                {visibleItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            className={`pro-sidebar-item ${isActive ? "pro-sidebar-item-active" : ""}`}
                                        >
                                            <item.icon size={17} />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-white font-black text-[10px]">
                            {user?.name.charAt(0) || "M"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black text-slate-950 uppercase tracking-tighter truncate">{user?.name || "Merchant"}</p>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">{activePlan}</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Link href="/dashboard/settings" className="pro-sidebar-item">
                            <Settings size={18} />
                            <span>Settings</span>
                        </Link>
                        <Link href="/help" className="pro-sidebar-item">
                            <HelpCircle size={18} />
                            <span>Support</span>
                        </Link>
                        <button
                            onClick={() => logout()}
                            className="pro-sidebar-item w-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 mt-2 transition-colors border border-transparent hover:border-rose-100"
                        >
                            <LogOut size={18} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>
            {/* Spacer for fixed sidebar on desktop */}
            <div className="hidden md:block w-64 flex-shrink-0"></div>
        </>
    );
};

export default Sidebar;
