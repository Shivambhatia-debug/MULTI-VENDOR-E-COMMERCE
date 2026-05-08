"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Store, Camera, Globe, Clock, ArrowRight } from "lucide-react";

export default function StoreSetupPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <section className="pt-32 pb-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Store size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Build Your Store</h1>
                        <p className="text-slate-500">Let's get your business online. Setup takes less than 5 minutes.</p>
                    </div>

                    <div className="bg-white border-2 border-slate-50 rounded-[2.5rem] shadow-xl shadow-slate-100 overflow-hidden">
                        <div className="p-8 md:p-12">
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Store Branding</label>
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 group hover:border-blue-300 hover:bg-white transition-all cursor-pointer">
                                            <Camera size={24} className="mb-2" />
                                            <span className="text-[10px] font-bold">Upload Logo</span>
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder="Enter your store name"
                                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-lg focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Business Type</label>
                                        <select className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 appearance-none focus:ring-2 focus:ring-blue-600 transition-all outline-none cursor-pointer">
                                            <option>Retail & E-commerce</option>
                                            <option>Restaurant & Cafe</option>
                                            <option>Professional Services</option>
                                            <option>Digital Products</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Currency</label>
                                        <select className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 appearance-none focus:ring-2 focus:ring-blue-600 transition-all outline-none cursor-pointer">
                                            <option>USD - US Dollar</option>
                                            <option>EUR - Euro</option>
                                            <option>GBP - British Pound</option>
                                            <option>SAR - Saudi Riyal</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Global Shipping</label>
                                    <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                < Globe className="text-blue-600" size={20} />
                                                <span className="font-medium text-slate-700">Enable worldwide delivery?</span>
                                            </div>
                                            <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full btn-primary py-5 text-xl flex items-center justify-center gap-2">
                                    Complete Setup <ArrowRight size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-6 flex items-center justify-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100">
                            <div className="flex items-center gap-2"><Clock size={14} /> 24h Approval</div>
                            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                            <div className="flex items-center gap-2"><Globe size={14} /> Custom Domain</div>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}
