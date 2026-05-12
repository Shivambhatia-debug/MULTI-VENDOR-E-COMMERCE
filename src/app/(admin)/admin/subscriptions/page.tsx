"use client";

import { useState, useEffect } from "react";
import { 
    CreditCard, Users, Plus, Edit2, Trash2, CheckCircle2, XCircle, 
    Zap, Shield, Smartphone, Loader2, Save, RefreshCw,
    Info, Layers, Globe, Lock, Headphones, Award, ShoppingBag, BarChart3, ChevronRight, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Plan {
    id: string;
    name: string;
    price: string;
    description?: string;
    max_products?: number;
    max_orders?: number;
    support_type?: string;
    has_custom_domain?: boolean;
    has_ssl?: boolean;
    has_mobile_app?: boolean;
    badge?: string;
    features: string[];
    highlight: boolean;
    is_active: boolean;
}

interface Subscription {
    merchant_id: string;
    merchant_name: string;
    merchant_email: string;
    plan: string;
    plan_price: string;
    plan_features: string[];
    status: string;
    paid_at: string | null;
    trial_end: string | null;
    is_paid: boolean;
}

export default function AdminSubscriptionsPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [activeTab, setActiveTab] = useState<"plans" | "merchants">("merchants");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Partial<Plan> | null>(null);
    const [featureInput, setFeatureInput] = useState("");

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("golalita_token");
                const [plansRes, subsRes] = await Promise.all([
                    fetch("/api/python/admin/plans", { headers: { "Authorization": `Bearer ${token}` } }),
                    fetch("/api/python/admin/merchant-subscriptions", { headers: { "Authorization": `Bearer ${token}` } })
                ]);

            if (plansRes.ok) {
                const data = await plansRes.json();
                setPlans(Array.isArray(data) ? data : []);
            }
            if (subsRes.ok) {
                const data = await subsRes.json();
                console.log("SUBS_DATA_RECEIVED:", data);
                setSubscriptions(Array.isArray(data) ? data : []);
            } else {
                console.error("SUBS_FETCH_FAILED:", subsRes.status);
            }
        } catch (err) {
            console.error("FETCH_ERROR:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSavePlan = async () => {
        if (!editingPlan?.name || !editingPlan?.price) return;
        setIsSaving(true);
        try {
            const token = localStorage.getItem("golalita_token");
            const url = editingPlan.id 
                ? `/api/python/admin/plans/${editingPlan.id}` 
                : "/api/python/admin/plans";
            const method = editingPlan.id ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(editingPlan)
            });

            if (res.ok) {
                setEditingPlan(null);
                fetchData();
            }
        } catch (err) {
            console.error("SAVE_PLAN_ERROR:", err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeletePlan = async (id: string) => {
        if (!confirm("Are you sure? This may affect existing subscriptions.")) return;
        try {
            const token = localStorage.getItem("golalita_token");
            await fetch(`/api/python/admin/plans/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            fetchData();
        } catch (err) {
            console.error("DELETE_PLAN_ERROR:", err);
        }
    };

    const addFeature = () => {
        if (!featureInput.trim() || !editingPlan) return;
        const currentFeatures = editingPlan.features || [];
        setEditingPlan({
            ...editingPlan,
            features: [...currentFeatures, featureInput.trim()]
        });
        setFeatureInput("");
    };
    
    const removeFeature = (index: number) => {
        if (!editingPlan) return;
        const currentFeatures = editingPlan.features || [];
        setEditingPlan({
            ...editingPlan,
            features: currentFeatures.filter((_, i) => i !== index)
        });
    };

    const getPlanIcon = (name?: string) => {
        if (!name) return Smartphone;
        if (name.includes("Basic")) return Zap;
        if (name.includes("Premium")) return Shield;
        return Smartphone;
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tighter italic">Subscription Hub</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60">Manage plans and monitor merchant revenue</p>
                </div>
                
                <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-xl">
                    <button 
                        onClick={() => setActiveTab("merchants")}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "merchants" ? "bg-slate-950 text-white shadow-xl shadow-slate-950/20" : "text-slate-400 hover:text-slate-600"}`}
                    >
                        Merchants
                    </button>
                    <button 
                        onClick={() => setActiveTab("plans")}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "plans" ? "bg-slate-950 text-white shadow-xl shadow-slate-950/20" : "text-slate-400 hover:text-slate-600"}`}
                    >
                        Plan Management
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <Loader2 className="animate-spin text-slate-950" size={40} />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Subscription Data...</p>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    {activeTab === "merchants" ? (
                        <motion.div 
                            key="merchants"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="card-saas overflow-hidden bg-white shadow-2xl border-slate-100"
                        >
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                                <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em] italic">Merchant Subscription Matrix</h3>
                                <button onClick={fetchData} className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-slate-950">
                                    <RefreshCw size={16} />
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50/50">
                                        <tr>
                                            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Merchant</th>
                                            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tier & Valuation</th>
                                            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Status</th>
                                            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Activation Timeline</th>
                                            <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Compliance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {Array.isArray(subscriptions) && subscriptions.map((sub, i) => (
                                            <tr key={`${sub.merchant_id}-${i}`} className="hover:bg-slate-50/50 transition-all group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-all">
                                                            <Users size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[11px] font-black text-slate-950 uppercase tracking-tight">{sub.merchant_name}</p>
                                                            <p className="text-[9px] text-slate-400 font-bold">{sub.merchant_email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${sub.plan === 'Basic' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'}`}>
                                                                {(() => {
                                                                    const Icon = getPlanIcon(sub.plan);
                                                                    return <Icon size={14} />;
                                                                })()}
                                                            </div>
                                                            <span className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">{sub.plan}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 ml-9">
                                                            <ShoppingBag size={10} className="text-slate-300" />
                                                            <p className="text-[10px] font-black text-slate-950">{sub.plan_price} <span className="text-slate-400">QAR/YR</span></p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${
                                                                sub.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                                                                sub.status === 'trial' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-100 text-slate-400'
                                                            }`}>
                                                                <div className={`w-1.5 h-1.5 rounded-full ${sub.status === 'active' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                                                                {sub.status}
                                                            </span>
                                                        </div>
                                                        {sub.paid_at && (
                                                            <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                                                <RefreshCw size={10} /> {new Date(sub.paid_at).toLocaleDateString()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    {sub.paid_at ? (
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between text-[10px] font-black text-slate-950 uppercase tracking-tight">
                                                                {(() => {
                                                                    const start = new Date(sub.paid_at);
                                                                    const diff = Math.floor((new Date().getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                                                                    const remaining = 365 - diff;
                                                                    return (
                                                                        <>
                                                                            <span>{diff}D Active</span>
                                                                            <span className={remaining < 30 ? 'text-rose-500' : 'text-emerald-500'}>{remaining}D Left</span>
                                                                        </>
                                                                    );
                                                                })()}
                                                            </div>
                                                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                                <motion.div 
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${Math.min(100, (Math.floor((new Date().getTime() - new Date(sub.paid_at).getTime()) / (1000 * 60 * 60 * 24)) / 365) * 100)}%` }}
                                                                    className="h-full bg-slate-950 transition-all" 
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : sub.trial_end ? (
                                                        <div className="space-y-2">
                                                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-tight flex items-center gap-2">
                                                                <Info size={12} />
                                                                {(() => {
                                                                    const end = new Date(sub.trial_end);
                                                                    const remaining = Math.ceil((end.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                                                                    return `${remaining > 0 ? remaining : 0} Days Trial Left`;
                                                                })()}
                                                            </p>
                                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-5">Expires {new Date(sub.trial_end).toLocaleDateString()}</p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
                                                            <XCircle size={14} /> No Activity
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex flex-col items-end gap-2">
                                                        {sub.is_paid ? (
                                                            <div className="flex items-center justify-end gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                                                                <CheckCircle2 size={12} />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Compliant</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-end gap-2 text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                                                <XCircle size={12} />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Pending</span>
                                                            </div>
                                                        )}
                                                        <button className="text-[8px] font-black text-slate-400 hover:text-slate-950 uppercase tracking-[0.2em] transition-all flex items-center gap-1 group/btn">
                                                            Audit Node <ChevronRight size={10} className="group-hover/btn:translate-x-1 transition-transform" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {(!subscriptions || subscriptions.length === 0) && (
                                    <div className="flex flex-col items-center justify-center py-32 bg-slate-50/30">
                                        <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-300 mb-6">
                                            <CreditCard size={40} />
                                        </div>
                                        <p className="text-sm font-black text-slate-950 uppercase tracking-tighter italic">No Active Subscription Nodes</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">The merchant network is currently operating on base protocols</p>
                                        <button onClick={fetchData} className="mt-8 px-8 py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-950/20 hover:scale-105 transition-all">
                                            Re-Sync Matrix
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="plans"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {Array.isArray(plans) && plans.map((plan, i) => (
                                    <motion.div 
                                        key={`${plan.id}-${i}`}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`group relative flex flex-col bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-2 transition-all hover:translate-y-[-8px] hover:shadow-slate-200 ${plan.highlight ? 'border-slate-950 ring-4 ring-slate-950/5' : 'border-slate-50'}`}
                                    >
                                        {/* Premium Badge */}
                                        {plan.badge && (
                                            <div className="absolute top-6 left-6 z-10">
                                                <span className="bg-slate-950 text-white text-[8px] font-black uppercase py-1.5 px-4 rounded-full shadow-lg flex items-center gap-2">
                                                    <Award size={10} className="text-emerald-400" />
                                                    {plan.badge}
                                                </span>
                                            </div>
                                        )}

                                        {/* Action Bar */}
                                        <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setEditingPlan(plan)} className="w-10 h-10 bg-white border border-slate-100 shadow-xl rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-950 hover:border-slate-950 transition-all">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDeletePlan(plan.id)} className="w-10 h-10 bg-white border border-slate-100 shadow-xl rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        <div className="p-10 pt-16">
                                            {/* Header */}
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all group-hover:scale-110 ${plan.highlight ? 'bg-slate-950 text-white shadow-2xl shadow-slate-950/20' : 'bg-slate-50 text-slate-400'}`}>
                                                    {(() => {
                                                        const Icon = getPlanIcon(plan.name);
                                                        return <Icon size={32} />;
                                                    })()}
                                                </div>
                                                <div>
                                                    <h4 className="text-2xl font-black text-slate-950 uppercase tracking-tighter italic">{plan.name}</h4>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-3xl font-black text-slate-950 tracking-tighter">{plan.price}</span>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">QAR / YEAR</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            {plan.description && (
                                                <p className="text-[11px] font-bold text-slate-500 leading-relaxed mb-8 italic">
                                                    {plan.description}
                                                </p>
                                            )}

                                            {/* Operational Limits */}
                                            <div className="grid grid-cols-2 gap-4 mb-8">
                                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Scale Limit</p>
                                                    <p className="text-[11px] font-black text-slate-950 uppercase">{plan.max_products || '400'} SKUs</p>
                                                </div>
                                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Volume</p>
                                                    <p className="text-[11px] font-black text-slate-950 uppercase">{plan.max_orders || '1k'} Orders</p>
                                                </div>
                                            </div>

                                            {/* Capabilities List */}
                                            <div className="space-y-3 pb-8 border-b border-slate-50">
                                                <div className="flex items-center gap-3 text-[10px] font-black text-slate-950 uppercase">
                                                    <Headphones size={14} className="text-slate-400" />
                                                    {plan.support_type || 'Email Support'}
                                                </div>
                                                {Array.isArray(plan.features) && plan.features.map((f, i) => (
                                                    <div key={i} className="flex items-center gap-3 text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                                                        <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                                            <CheckCircle2 size={10} className="text-emerald-500" />
                                                        </div>
                                                        {f}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Tech Flags */}
                                            <div className="pt-8 flex flex-wrap gap-2">
                                                {plan.has_custom_domain && (
                                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100">
                                                        <Globe size={10} /> Custom Domain
                                                    </div>
                                                )}
                                                {plan.has_ssl && (
                                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-100">
                                                        <Lock size={10} /> SSL Encrypted
                                                    </div>
                                                )}
                                                {plan.has_mobile_app && (
                                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-amber-100">
                                                        <Smartphone size={10} /> Native Apps
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                
                                <motion.button 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: (plans?.length || 0) * 0.1 }}
                                    onClick={() => setEditingPlan({ 
                                        name: "", 
                                        price: "", 
                                        description: "",
                                        max_products: 400,
                                        max_orders: 1000,
                                        support_type: "Email Support",
                                        features: [], 
                                        highlight: false, 
                                        is_active: true,
                                        has_custom_domain: false,
                                        has_ssl: true,
                                        has_mobile_app: false
                                    })}
                                    className="border-4 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center p-12 gap-4 hover:border-slate-300 hover:bg-slate-50 transition-all group min-h-[500px]"
                                >
                                    <div className="w-20 h-20 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:bg-slate-950 group-hover:text-white transition-all duration-500 shadow-xl group-hover:shadow-slate-950/20">
                                        <Plus size={40} />
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-950 transition-colors">Add New Tier</span>
                                        <span className="block text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1 group-hover:text-slate-400">Expand Platform Capability</span>
                                    </div>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            {/* Editing Modal */}
            <AnimatePresence>
                {editingPlan && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setEditingPlan(null)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 40 }}
                            className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="p-8 md:p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tighter italic">
                                        {editingPlan.id ? 'Refine Strategy' : 'Architect New Tier'}
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Configure plan parameters and operational limits</p>
                                </div>
                                <button onClick={() => setEditingPlan(null)} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-950 transition-all shadow-sm">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="overflow-y-auto p-8 md:p-10 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {/* Left Column: Basic Info & Details */}
                                    <div className="space-y-8">
                                        <div className="section-group space-y-4">
                                            <h4 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <Info size={12} /> Core Identity
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Plan Name</label>
                                                    <input 
                                                        value={editingPlan.name}
                                                        onChange={e => setEditingPlan({...editingPlan, name: e.target.value})}
                                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black text-xs uppercase tracking-widest focus:ring-2 focus:ring-slate-950 transition-all"
                                                        placeholder="E.G. PRO"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (QAR/YR)</label>
                                                    <input 
                                                        value={editingPlan.price}
                                                        onChange={e => setEditingPlan({...editingPlan, price: e.target.value})}
                                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black text-xs uppercase tracking-widest focus:ring-2 focus:ring-slate-950 transition-all"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Promotion Badge</label>
                                                <input 
                                                    value={editingPlan.badge}
                                                    onChange={e => setEditingPlan({...editingPlan, badge: e.target.value})}
                                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black text-xs uppercase tracking-widest focus:ring-2 focus:ring-slate-950 transition-all"
                                                    placeholder="E.G. BEST VALUE"
                                                />
                                            </div>
                                        </div>

                                        <div className="section-group space-y-4">
                                            <h4 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <BarChart3 size={12} /> Operational Limits
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Max Products</label>
                                                    <input 
                                                        type="number"
                                                        value={editingPlan.max_products}
                                                        onChange={e => setEditingPlan({...editingPlan, max_products: parseInt(e.target.value)})}
                                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black text-xs uppercase tracking-widest focus:ring-2 focus:ring-slate-950 transition-all"
                                                        placeholder="400"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Max Orders</label>
                                                    <input 
                                                        type="number"
                                                        value={editingPlan.max_orders}
                                                        onChange={e => setEditingPlan({...editingPlan, max_orders: parseInt(e.target.value)})}
                                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black text-xs uppercase tracking-widest focus:ring-2 focus:ring-slate-950 transition-all"
                                                        placeholder="1000"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Support Level</label>
                                                <select 
                                                    value={editingPlan.support_type}
                                                    onChange={e => setEditingPlan({...editingPlan, support_type: e.target.value})}
                                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black text-[10px] uppercase tracking-widest focus:ring-2 focus:ring-slate-950 transition-all appearance-none"
                                                >
                                                    <option value="Email Support">Email Support</option>
                                                    <option value="Priority Email">Priority Email</option>
                                                    <option value="24/7 Priority">24/7 Priority</option>
                                                    <option value="Dedicated Manager">Dedicated Manager</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="section-group space-y-4">
                                            <h4 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <Layers size={12} /> Infrastructure Flags
                                            </h4>
                                            <div className="grid grid-cols-1 gap-2">
                                                {[
                                                    { key: 'highlight', label: 'Feature on Platform', icon: Award },
                                                    { key: 'has_custom_domain', label: 'Custom Domain Access', icon: Globe },
                                                    { key: 'has_ssl', label: 'Managed SSL/Security', icon: Lock },
                                                    { key: 'has_mobile_app', label: 'iOS/Android Native App', icon: Smartphone },
                                                ].map((flag) => (
                                                    <button 
                                                        key={flag.key}
                                                        onClick={() => setEditingPlan({...editingPlan, [flag.key]: !editingPlan[flag.key as keyof Plan]})}
                                                        className={`flex items-center justify-between p-4 rounded-2xl transition-all border ${editingPlan[flag.key as keyof Plan] ? 'bg-slate-950 text-white border-slate-950' : 'bg-slate-50 text-slate-400 border-transparent hover:border-slate-200'}`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <flag.icon size={14} />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">{flag.label}</span>
                                                        </div>
                                                        <div className={`w-8 h-4 rounded-full relative transition-all ${editingPlan[flag.key as keyof Plan] ? 'bg-emerald-400' : 'bg-slate-300'}`}>
                                                            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${editingPlan[flag.key as keyof Plan] ? 'left-4.5' : 'left-0.5'}`} />
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Features & Description */}
                                    <div className="space-y-8">
                                        <div className="section-group space-y-4">
                                            <h4 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <Info size={12} /> Strategic Description
                                            </h4>
                                            <textarea 
                                                value={editingPlan.description}
                                                onChange={e => setEditingPlan({...editingPlan, description: e.target.value})}
                                                rows={3}
                                                className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-xs text-slate-600 focus:ring-2 focus:ring-slate-950 transition-all resize-none"
                                                placeholder="Describe the target merchant and value proposition..."
                                            />
                                        </div>

                                        <div className="section-group space-y-4">
                                            <h4 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <CheckCircle2 size={12} /> Feature Manifest
                                            </h4>
                                            <div className="flex gap-2">
                                                <input 
                                                    value={featureInput}
                                                    onChange={e => setFeatureInput(e.target.value)}
                                                    onKeyPress={e => e.key === 'Enter' && addFeature()}
                                                    className="flex-1 bg-slate-50 border-none rounded-2xl p-4 font-bold text-xs focus:ring-2 focus:ring-slate-950 transition-all"
                                                    placeholder="Add new feature capability..."
                                                />
                                                <button 
                                                    onClick={addFeature}
                                                    className="w-14 h-14 bg-slate-950 text-white rounded-2xl flex items-center justify-center hover:scale-105 transition-all shadow-xl shadow-slate-950/20"
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                                {editingPlan.features?.map((f, i) => (
                                                    <motion.div 
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        key={i} 
                                                        className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl group hover:border-slate-950 transition-all"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-2 h-2 rounded-full bg-slate-950" />
                                                            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight">{f}</span>
                                                        </div>
                                                        <button 
                                                            onClick={() => removeFeature(i)}
                                                            className="text-slate-300 hover:text-rose-500 transition-colors"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </motion.div>
                                                ))}
                                                {(!editingPlan.features || editingPlan.features.length === 0) && (
                                                    <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No features defined yet</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 md:p-10 bg-slate-50/50 border-t border-slate-100 flex gap-4">
                                <button 
                                    onClick={() => setEditingPlan(null)}
                                    className="px-8 py-5 bg-white text-slate-400 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-slate-950 hover:border-slate-950 transition-all"
                                >
                                    Abort
                                </button>
                                <button 
                                    onClick={handleSavePlan}
                                    disabled={isSaving}
                                    className="flex-1 py-5 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-slate-950/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    {editingPlan.id ? 'Authorize Protocol Update' : 'Initialize Strategy Deployment'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
