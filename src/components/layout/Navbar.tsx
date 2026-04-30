"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = ({ invert = false }: { invert?: boolean }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isLight = isScrolled || invert;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center transition-all px-4 sm:px-6 lg:px-8 border-b ${isLight ? "bg-white/90 backdrop-blur-md border-slate-200/60 shadow-sm" : "bg-transparent border-transparent shadow-none"}`}>
            <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 bg-slate-950 rounded-lg flex items-center justify-center shadow-lg shadow-slate-900/10 group-hover:scale-105 transition-all duration-300 border border-white/10">
                        <span className="text-white font-black text-lg leading-none">G</span>
                    </div>
                    <span className={`text-xl font-black tracking-tighter flex items-center gap-1 uppercase transition-colors ${isLight ? "text-slate-950" : "text-white"}`}>
                        Golalita
                        <span className="text-[9px] bg-white text-slate-950 px-1.5 py-0.5 rounded font-black border border-slate-200">OS</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-12">
                    <Link href="/products" className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:scale-105 ${isLight ? "text-slate-500 hover:text-slate-950" : "text-slate-400 hover:text-white"}`}>Marketplace</Link>
                    <Link href="/stores" className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:scale-105 ${isLight ? "text-slate-500 hover:text-slate-950" : "text-slate-400 hover:text-white"}`}>Stores</Link>
                    <Link href="/dashboard" className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:scale-105 ${isLight ? "text-slate-500 hover:text-slate-950" : "text-slate-400 hover:text-white"}`}>Merchant</Link>
                    <Link href="#pricing" className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:scale-105 ${isLight ? "text-slate-500 hover:text-slate-950" : "text-slate-400 hover:text-white"}`}>Packages</Link>
                    <Link href="/support" className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:scale-105 ${isLight ? "text-slate-500 hover:text-slate-950" : "text-slate-400 hover:text-white"}`}>Support</Link>
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-6">
                    <button className={`p-2 transition-colors relative ${isLight ? "text-slate-400 hover:text-slate-950" : "text-slate-400 hover:text-white"}`}>
                        <ShoppingCart size={18} />
                        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-slate-950 text-[8px] font-black text-white flex items-center justify-center rounded-full border-2 border-white">2</span>
                    </button>
                    <div className="w-px h-4 bg-slate-200/20 mx-1"></div>
                    <Link href="/login" className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 transition-colors ${isLight ? "text-slate-500 hover:text-slate-950" : "text-slate-400 hover:text-white"}`}>Log In</Link>
                    <Link href="/get-started" className={`px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isLight ? "bg-slate-950 text-white hover:bg-slate-900" : "bg-white text-slate-950 hover:bg-slate-100"}`}>
                        Get Started <ArrowRight size={14} />
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`md:hidden p-2 transition-colors ${isLight ? "text-slate-950" : "text-white"}`}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 top-16 bg-white z-50 p-6 space-y-6 flex flex-col">
                    <div className="flex flex-col gap-6">
                        <Link href="/products" className="text-xl font-black text-slate-900 flex items-center justify-between uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>
                            Marketplace <ArrowRight size={18} className="text-slate-300" />
                        </Link>
                        <Link href="/stores" className="text-xl font-black text-slate-900 flex items-center justify-between uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>
                            Stores <ArrowRight size={18} className="text-slate-300" />
                        </Link>
                        <Link href="/dashboard" className="text-xl font-black text-slate-900 flex items-center justify-between uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>
                            Merchant <ArrowRight size={18} className="text-slate-300" />
                        </Link>
                        <Link href="#pricing" className="text-xl font-black text-slate-900 flex items-center justify-between uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>
                            Packages <ArrowRight size={18} className="text-slate-300" />
                        </Link>
                        <Link href="/support" className="text-xl font-black text-slate-900 flex items-center justify-between uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>
                            Support <ArrowRight size={18} className="text-slate-300" />
                        </Link>
                    </div>
                    <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-4">
                        <Link href="/login" className="btn-secondary text-center py-4 text-sm font-bold" onClick={() => setIsMenuOpen(false)}>Developer Log In</Link>
                        <Link href="/get-started" className="btn-primary text-center py-4 text-sm font-bold" onClick={() => setIsMenuOpen(false)}>Create Your Store</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
