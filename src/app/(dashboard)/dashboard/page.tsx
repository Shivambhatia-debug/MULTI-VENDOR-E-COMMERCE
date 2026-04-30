"use client";

import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";
import BasicPlanHeader from "@/components/dashboard/BasicPlanHeader";
// import { stats, products } from "@/lib/data";
import {
    Plus,
    Download,
    MoreHorizontal,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Search,
    Truck,
    Tag,
    UserPlus,
    Package,
    ArrowRight,
    Sparkles
} from "lucide-react";

import { useMerchant } from "@/context/MerchantContext";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const { activePlan, user } = useMerchant();
    const [dashboardStats, setDashboardStats] = useState<any[]>([]);
    const [topProducts, setTopProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('golalita_token');
            if (!token) return;

            try {
                // Fetch Stats
                const statsResponse = await fetch('/api/python/dashboard/stats', {
                    headers: { 'Authorization': `Bearer ${token}` },
                    cache: 'no-store'
                });
                if (statsResponse.ok) {
                    const statsData = await statsResponse.ok ? await statsResponse.json() : [];
                    setDashboardStats(statsData);
                }

                // Fetch Top Products
                const productsResponse = await fetch('/api/python/products', {
                    headers: { 'Authorization': `Bearer ${token}` },
                    cache: 'no-store'
                });
                if (productsResponse.ok) {
                    const productsData = await productsResponse.json();
                    setTopProducts(productsData.slice(0, 5)); // Just top 5
                }
            } catch (err) {
                console.error("DASHBOARD_FETCH_ERROR:", err);
                setError("SESSION EXPIRED OR CONNECTION FAILED");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const productCount = topProducts.length;
    const branchCount = 1; // Assuming 1 for now, or fetch from branches API later

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />

            <main className="flex-1 p-6 lg:p-8">
                {/* Basic Plan Specific Overview */}
                {activePlan === "Basic" && (
                    <BasicPlanHeader
                        plan={activePlan}
                        productCount={productCount}
                        branchCount={branchCount}
                    />
                )}
                {/* Error Banner */}
                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-500 font-bold uppercase tracking-widest text-[10px]">
                        <Sparkles size={16} />
                        {error}
                    </div>
                )}

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tighter">Merchant Overview</h1>
                        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-1 opacity-60">Global Strategy & Operations</p>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <Link href="/dashboard/products" className="bg-white border border-slate-200 text-slate-400 p-2.5 rounded-xl hover:bg-slate-50 hover:text-slate-950 transition-all shadow-sm">
                            <Filter size={18} />
                        </Link>
                        <button className="bg-white border border-slate-200 text-slate-950 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
                            <Download size={16} />
                            <span>Export</span>
                        </button>
                        <Link href="/dashboard/products" className="bg-white border-2 border-slate-950 text-slate-950 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all shadow-sm flex items-center gap-2">
                            <Package size={16} />
                            <span>Inventory</span>
                        </Link>
                        <Link href="/dashboard/products/new" className="bg-slate-950 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg flex items-center gap-2 active:scale-95">
                            <Plus size={16} />
                            <span>New Product</span>
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {dashboardStats.length > 0 ? dashboardStats.map((stat) => (
                        <div key={stat.label} className="card-saas p-6 group cursor-pointer hover:border-slate-400">
                            <div className="flex justify-between items-start mb-6">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                                <div className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-slate-950 group-hover:text-white transition-all duration-500">
                                    <Plus size={14} />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-black text-slate-950 tracking-tight leading-none">{stat.value}</h3>
                                <span className={`text-[10px] font-bold flex items-center ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {stat.change.startsWith('+') ? <ArrowUpRight size={10} className="mr-0.5" /> : <ArrowDownRight size={10} className="mr-0.5" />}
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    )) : (
                        [1, 2, 3, 4].map(i => (
                            <div key={i} className="card-saas p-6 bg-slate-50 animate-pulse h-32"></div>
                        ))
                    )}
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Products Table */}
                    <div className="lg:col-span-2 card-saas overflow-hidden border-slate-200/50 shadow-xl">
                        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white">
                            <div>
                                <h2 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em]">Top Performing Products</h2>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time inventory status</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-xl transition-all"><Search size={16} /></button>
                                <button className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-xl transition-all"><Filter size={16} /></button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-8 py-4">Product Details</th>
                                        <th className="px-8 py-4">Unit Price</th>
                                        <th className="px-8 py-4">Stock</th>
                                        <th className="px-8 py-4 text-center">Status</th>
                                        <th className="px-8 py-4 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 bg-white">
                                    {topProducts.length > 0 ? topProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-slate-50 transition-all group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border border-slate-100 flex-shrink-0">
                                                        <img src={product.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-950 text-[11px] uppercase tracking-tighter leading-none">{product.name}</p>
                                                        <p className="text-[9px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest">{product.category}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 font-black text-slate-950 text-xs">${product.price}</td>
                                            <td className="px-8 py-5 text-[11px] font-bold text-slate-500">{product.stock} units</td>
                                            <td className="px-8 py-5 text-center">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${product.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-950">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-20 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                                {isLoading ? "Synchronizing with Engine..." : "No items found in global inventory"}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-50">
                            <Link href="/dashboard/products" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-950 transition-colors flex items-center gap-2">
                                View all products <ArrowRight size={12} />
                            </Link>
                        </div>
                    </div>

                    {/* Insights & Subscription Panel */}
                    <div className="space-y-6">
                        {/* Subscription Health Card */}
                        <div className="card-saas p-8 border-l-4 border-l-slate-950 relative overflow-hidden group shadow-xl">
                            {/* Abstract Decorative Element */}
                            <div className="absolute -right-4 -top-4 w-32 h-32 bg-slate-50 rounded-full group-hover:scale-110 transition-transform duration-700" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Subscription Health</h3>
                                    <span className="px-3 py-1 rounded-full bg-slate-950 text-white text-[9px] font-black uppercase tracking-widest">
                                        {activePlan}
                                    </span>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                                            <span className="text-slate-400">Product Capacity</span>
                                            <span className="text-slate-950">{productCount} / {activePlan === 'Basic' ? '400' : '1500'}</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                            <div className="h-full bg-slate-950 rounded-full transition-all duration-1000" style={{ width: `${(productCount / (activePlan === 'Basic' ? 400 : 1500)) * 100}%` }} />
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                                            You are currently using <span className="text-slate-950 font-black">{((productCount / (activePlan === 'Basic' ? 400 : 1500)) * 100).toFixed(1)}%</span> of your allowed product listings.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-saas p-8 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-slate-950 text-white rounded-xl"><Sparkles size={16} /></div>
                                <div>
                                    <h2 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.2em]">Market Insights</h2>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">AI-driven analysis</p>
                                </div>
                            </div>
                            <div className="space-y-5">
                                <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-300 transition-all cursor-default">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-950 mt-1.5 flex-shrink-0" />
                                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                                        Welcome to your global command console. Real-time insights will appear here as your store generates traffic.
                                    </p>
                                </div>
                            </div>
                            <button className="btn-secondary w-full text-[10px] mt-8 py-3.5 border-slate-200 hover:bg-slate-950 hover:text-white transition-all shadow-sm">View Detailed Evolution</button>
                        </div>

                        {activePlan === "Basic" && (
                            <div className="bg-slate-950 rounded-[2rem] p-8 text-white shadow-2xl overflow-hidden relative group">
                                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-1000" />

                                <div className="relative z-10">
                                    <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-3">Upgrade to Premium</h3>
                                    <p className="text-[10px] text-slate-400 mb-6 leading-relaxed font-medium">Unlock Loyalty Rewards, Customer Wallet, and expand to 1500+ products.</p>
                                    <Link href="/dashboard/settings" className="bg-white text-slate-950 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all block text-center shadow-lg active:scale-95">
                                        Upgrade Now
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Available Add-ons - Specific for Basic */}
                {activePlan === "Basic" && (
                    <div className="mt-16">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-6 w-1 bg-slate-950 rounded-full"></div>
                            <div>
                                <h2 className="text-xs font-black text-slate-950 uppercase tracking-[0.3em]">Available Add-ons</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Modular expansion capabilities</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: "Drivers Management", icon: Truck, price: "+25 QAR" },
                                { title: "Discount Coupons", icon: Tag, price: "+25 QAR" },
                                { title: "Customer Database", icon: UserPlus, price: "+25 QAR" },
                            ].map((addon) => (
                                <div key={addon.title} className="card-saas p-6 flex items-center justify-between group hover:border-slate-400">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-slate-950 group-hover:text-white transition-all duration-500 border border-slate-100">
                                            <addon.icon size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-[11px] font-black text-slate-950 uppercase tracking-widest leading-none">{addon.title}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">{addon.price}</p>
                                        </div>
                                    </div>
                                    <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-950 hover:text-white transition-all active:scale-90 shadow-sm">
                                        <Plus size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
