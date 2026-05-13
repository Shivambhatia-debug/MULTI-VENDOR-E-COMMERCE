"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import {
    Tag,
    Plus,
    Search,
    Calendar,
    ArrowUpRight,
    Lock,
    Percent,
    X,
    Trash2,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { useMerchant } from "@/context/MerchantContext";

export default function CouponsPage() {
    const { activePlan } = useMerchant();
    const [coupons, setCoupons] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<any>(null);

    const [formData, setFormData] = useState({
        code: "",
        type: "Fixed",
        value: 0,
        expiry: "",
        status: "Active"
    });

    const fetchCoupons = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("golalita_token");
            const response = await fetch("/api/python/merchants/coupons", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCoupons(data);
            }
        } catch (err) {
            console.error("FETCH_COUPONS_ERROR:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleOpenModal = (coupon: any = null) => {
        if (coupon) {
            setEditingCoupon(coupon);
            setFormData({
                code: coupon.code,
                type: coupon.type,
                value: coupon.value,
                expiry: coupon.expiry,
                status: coupon.status
            });
        } else {
            setEditingCoupon(null);
            setFormData({
                code: "",
                type: "Fixed",
                value: 0,
                expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: "Active"
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("golalita_token");
            const url = editingCoupon 
                ? `/api/python/merchants/coupons/${editingCoupon.id}`
                : "/api/python/merchants/coupons";
            const method = editingCoupon ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsModalOpen(false);
                fetchCoupons();
            }
        } catch (err) {
            console.error("SUBMIT_COUPON_ERROR:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this coupon?")) return;
        try {
            const token = localStorage.getItem("golalita_token");
            const response = await fetch(`/api/python/merchants/coupons/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                fetchCoupons();
            }
        } catch (err) {
            console.error("DELETE_COUPON_ERROR:", err);
        }
    };

    const isAddonActive = activePlan !== "Basic";

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />

            <main className="flex-1 p-6 lg:p-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Discount Coupons</h1>
                        <p className="text-slate-500 text-xs mt-1">Create marketing campaigns with discount codes and flash sales.</p>
                    </div>
                </div>

                {/* Add-on Banner for Basic */}
                {activePlan === "Basic" && (
                    <div className="mb-8 p-6 bg-gradient-to-r from-rose-600 to-pink-700 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6 text-center md:text-left">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/30">
                                    <Tag size={32} />
                                </div>
                                <div className="max-w-md">
                                    <h3 className="text-lg font-black tracking-tight mb-2">Drive More Sales</h3>
                                    <p className="text-xs text-rose-50 font-medium leading-relaxed">
                                        The Basic plan includes standard pricing. Unlock the **Advanced Coupons & Promotions** add-on to create unlimited codes and flash sales for just **25 QAR/month**.
                                    </p>
                                </div>
                            </div>
                            <div className="shrink-0">
                                <button className="bg-white text-rose-600 px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2">
                                    Unlock Promotions
                                    <ArrowUpRight size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
                    </div>
                )}

                {/* Content Grid */}
                <div className={`space-y-6 ${!isAddonActive && activePlan === 'Basic' ? 'opacity-40 pointer-events-none' : ''}`}>
                    <div className="card-saas p-4 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input type="text" placeholder="Search coupon codes..." className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl text-[11px]" />
                        </div>
                        <button 
                            onClick={() => handleOpenModal()}
                            className="btn-primary py-3 px-6 text-[10px] uppercase font-black flex items-center gap-2"
                        >
                            <Plus size={16} /> Create Coupon
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {coupons.length > 0 ? coupons.map((coupon) => (
                            <div key={coupon.id} className="card-saas overflow-hidden flex flex-col group hover:border-rose-200 transition-all">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                                            <Percent size={20} />
                                        </div>
                                        <div className="flex gap-1">
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${coupon.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                                                }`}>
                                                {coupon.status}
                                            </span>
                                            <button 
                                                onClick={() => handleDelete(coupon.id)}
                                                className="p-1 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <h4 className="text-lg font-black text-slate-900 tracking-tighter mb-1">{coupon.code}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{coupon.type} · {coupon.value} {coupon.type === 'Percentage' ? '%' : 'QAR'}</p>
                                    <button 
                                        onClick={() => handleOpenModal(coupon)}
                                        className="mt-4 text-[10px] font-bold text-blue-600 hover:underline"
                                    >
                                        Edit Coupon
                                    </button>
                                </div>
                                <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center mt-auto">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Calendar size={12} />
                                        <span className="text-[10px] font-bold">Exp: {coupon.expiry}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-black text-slate-700">{coupon.usage || 0} Uses</span>
                                    </div>
                                </div>
                            </div>
                        )) : !isLoading && (
                            <div className="col-span-full py-20 text-center opacity-30">
                               <Tag size={48} className="mx-auto mb-4 text-slate-300" />
                               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">No active promotions in registry</p>
                            </div>
                        )}

                        {isLoading && (
                            <div className="col-span-full py-20 text-center opacity-30 animate-pulse">
                               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Fetching Promotion Streams...</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">
                                {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Coupon Code</label>
                                <input 
                                    required
                                    type="text" 
                                    value={formData.code}
                                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all uppercase"
                                    placeholder="e.g. SUMMER50"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Discount Type</label>
                                    <select 
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    >
                                        <option value="Fixed">Fixed Amount</option>
                                        <option value="Percentage">Percentage</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Value</label>
                                    <input 
                                        required
                                        type="number" 
                                        value={formData.value}
                                        onChange={(e) => setFormData({...formData, value: parseFloat(e.target.value)})}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Expiry Date</label>
                                <input 
                                    required
                                    type="date" 
                                    value={formData.expiry}
                                    onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div className="pt-4">
                                <button 
                                    disabled={isSubmitting}
                                    type="submit" 
                                    className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : (editingCoupon ? "Update Coupon" : "Create Coupon")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

