"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, ArrowRight, User, LogOut, LayoutDashboard, Heart, Package, Search, Settings, Globe, Award } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useMerchant } from "@/context/MerchantContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ invert = false }: { invert?: boolean }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, isAuthenticated, logout } = useMerchant();
    const { cartItems } = useCart();
    const { language, toggleLanguage, t } = useLanguage();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isMenuOpen]);

    const isLight = isScrolled || invert;

    const navLinks = [
        { name: t("marketplace"), href: "/products", icon: Package },
        { name: t("stores"), href: "/stores", icon: LayoutDashboard },
        { name: t("packages"), href: "#pricing", icon: Award },
        { name: t("support"), href: "/support", icon: Globe },
    ];

    // Role-based links for dropdown
    const getRoleLinks = () => {
        if (!user) return [];
        switch (user.role) {
            case "admin":
                return [
                    { name: t("admin_panel"), href: "/admin", icon: LayoutDashboard },
                    { name: t("settings"), href: "/admin/settings", icon: Settings },
                ];
            case "merchant":
                return [
                    { name: t("store_dashboard"), href: "/dashboard", icon: LayoutDashboard },
                    { name: t("my_products"), href: "/dashboard/products", icon: Package },
                    { name: t("settings"), href: "/dashboard/settings", icon: Settings },
                ];
            default: // Customer/User
                return [
                    { name: t("my_profile"), href: "/profile", icon: User },
                    { name: t("my_orders"), href: "/orders", icon: Package },
                    { name: t("wishlist"), href: "/wishlist", icon: Heart },
                    { name: t("track_order"), href: "/track-order", icon: Search },
                ];
        }
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center transition-all px-4 sm:px-6 lg:px-8 border-b ${isLight ? "bg-white/90 backdrop-blur-md border-slate-200/60 shadow-sm" : "bg-transparent border-transparent shadow-none"}`}>
            <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-all duration-300 relative">
                        <Image 
                            src={isLight ? "/web background/web background/logo 2 png.png" : "/web background/web background/logo 3 png.png"} 
                            alt="Golalita" 
                            fill 
                            sizes="40px"
                            className="object-contain" 
                        />
                    </div>
                    <span className={`text-lg sm:text-xl font-black tracking-tighter flex items-center gap-1 uppercase transition-colors ${isLight ? "text-slate-950" : "text-white"}`}>
                        Golalita
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-12">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name}
                            href={link.href} 
                            className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:scale-105 ${isLight ? "text-slate-500 hover:text-slate-950" : "text-slate-400 hover:text-white"}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {isAuthenticated && user?.role === 'merchant' && (
                        <Link href="/dashboard" className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:scale-105 ${isLight ? "text-slate-500 hover:text-slate-950" : "text-slate-400 hover:text-white"}`}>{t("dashboard")}</Link>
                    )}
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-6">
                    {/* Language Switcher */}
                    <button 
                        onClick={toggleLanguage}
                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${isLight ? "text-slate-500 hover:text-slate-950" : "text-slate-400 hover:text-white"}`}
                    >
                        <Globe size={16} />
                        <span>{language === 'en' ? 'AR' : 'EN'}</span>
                    </button>

                    <div className="w-px h-4 bg-slate-200/20 mx-1"></div>

                    <Link href="/cart" className={`p-2 transition-colors relative ${isLight ? "text-slate-400 hover:text-slate-950" : "text-slate-400 hover:text-white"}`}>
                        <ShoppingCart size={18} />
                        {cartItems.length > 0 && (
                            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-slate-950 text-[8px] font-black text-white flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in duration-300">
                                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                            </span>
                        )}
                    </Link>
                    
                    <div className="w-px h-4 bg-slate-200/20 mx-1"></div>

                    {isAuthenticated ? (
                        <div className="relative" ref={dropdownRef}>
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className={`flex items-center gap-3 pl-2 pr-1 py-1 rounded-full border transition-all ${isLight ? "border-slate-200 hover:border-slate-950 bg-slate-50" : "border-white/10 hover:border-white bg-white/5"}`}
                            >
                                <span className={`text-[10px] font-black uppercase tracking-widest hidden lg:block ${isLight ? "text-slate-950" : "text-white"}`}>
                                    {user?.name?.split(' ')[0] || "Account"}
                                </span>
                                <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center border border-white/20 shadow-lg">
                                    <User size={14} className="text-white" />
                                </div>
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className={`absolute ${language === 'ar' ? 'left-0' : 'right-0'} mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 z-[60]`}
                                    >
                                        <div className="px-4 py-4 border-b border-slate-50 mb-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{t("signed_in_as")}</p>
                                            <p className="text-xs font-black text-slate-950 truncate">{user?.email}</p>
                                            <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 text-slate-500 text-[8px] font-black uppercase tracking-widest rounded-md border border-slate-200">
                                                {user?.role} {t("account")}
                                            </span>
                                        </div>

                                        <div className="space-y-1">
                                            {getRoleLinks().map((link) => (
                                                <Link 
                                                    key={link.name}
                                                    href={link.href}
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 hover:text-slate-950 transition-all"
                                                >
                                                    <link.icon size={14} />
                                                    {link.name}
                                                </Link>
                                            ))}
                                        </div>

                                        <div className="mt-2 pt-2 border-t border-slate-50">
                                            <button 
                                                onClick={() => {
                                                    logout();
                                                    setIsProfileOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 transition-all"
                                            >
                                                <LogOut size={14} />
                                                {t("sign_out")}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 transition-colors ${isLight ? "text-slate-500 hover:text-slate-950" : "text-slate-400 hover:text-white"}`}>{t("login")}</Link>
                            <Link href="/get-started" className={`px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl hover:shadow-2xl active:scale-95 ${isLight ? "bg-slate-950 text-white hover:bg-slate-900" : "bg-white text-slate-950 hover:bg-slate-100"}`}>
                                {t("get_started")} <ArrowRight size={14} className={language === 'ar' ? 'rotate-180' : ''} />
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Actions & Toggle */}
                <div className="flex md:hidden items-center gap-2">
                    <button 
                        onClick={toggleLanguage}
                        className={`p-2 transition-colors flex items-center gap-1 ${isLight ? "text-slate-950" : "text-white"}`}
                    >
                        <Globe size={18} />
                        <span className="text-[10px] font-black">{language === 'en' ? 'AR' : 'EN'}</span>
                    </button>
                    <Link href="/cart" className={`p-2 transition-colors relative ${isLight ? "text-slate-950" : "text-white"}`}>
                        <ShoppingCart size={20} />
                        {cartItems.length > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-slate-950 text-[8px] font-black text-white flex items-center justify-center rounded-full border-2 border-white">
                                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                            </span>
                        )}
                    </Link>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`p-2 transition-colors ${isLight ? "text-slate-950" : "text-white"}`}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <div className="md:hidden fixed inset-0 z-[100] font-sans">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ x: language === 'ar' ? '-100%' : '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: language === 'ar' ? '-100%' : '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className={`absolute top-0 ${language === 'ar' ? 'left-0' : 'right-0'} w-[85%] max-w-[320px] h-[100dvh] bg-white shadow-2xl flex flex-col`}
                        >
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 relative">
                                        <Image src="/web background/web background/logo 2 png.png" alt="Golalita" fill sizes="32px" className="object-contain" />
                                    </div>
                                    <span className="text-sm font-black uppercase tracking-widest text-slate-900">Menu</span>
                                </div>
                                <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full bg-white text-slate-400 hover:text-slate-900 shadow-sm border border-slate-100">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                                <div className="space-y-2">
                                    {navLinks.map((link) => (
                                        <Link 
                                            key={link.name}
                                            href={link.href} 
                                            className="flex items-center gap-4 px-4 py-4 rounded-2xl text-[11px] font-black text-slate-700 uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100 group" 
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors text-slate-400 group-hover:text-blue-600">
                                                <link.icon size={18} />
                                            </div>
                                            <span className="flex-1">{link.name || link.href.replace("/", "")}</span>
                                            <ArrowRight size={16} className={`text-slate-300 group-hover:text-blue-600 transition-all ${language === 'ar' ? 'rotate-180' : ''}`} />
                                        </Link>
                                    ))}
                                </div>

                                {isAuthenticated && (
                                    <div className="pt-6 border-t border-slate-100 space-y-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">{t("account") || "Account"}</p>
                                        {getRoleLinks().map((link) => (
                                            <Link 
                                                key={link.name}
                                                href={link.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center gap-4 px-4 py-4 rounded-2xl text-[11px] font-black text-slate-700 uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100 group"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors text-slate-400 group-hover:text-blue-600">
                                                    <link.icon size={18} />
                                                </div>
                                                <span className="flex-1">{link.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-5 bg-white border-t border-slate-100 space-y-3">
                                {isAuthenticated ? (
                                    <button 
                                        onClick={() => {
                                            logout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full bg-red-50 text-red-600 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
                                    >
                                        <LogOut size={16} /> {t("sign_out") || "Sign Out"}
                                    </button>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link href="/login" className="w-full bg-slate-50 text-slate-900 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center border border-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center" onClick={() => setIsMenuOpen(false)}>
                                            {t("login") || "Log In"}
                                        </Link>
                                        <Link href="/get-started" className="w-full bg-slate-950 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center shadow-lg hover:bg-slate-800 transition-colors flex items-center justify-center" onClick={() => setIsMenuOpen(false)}>
                                            {t("get_started") || "Get Started"}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;

