"use client";

import { useState, useEffect } from "react";
import { 
    CreditCard, Users, Plus, Edit2, Trash2, CheckCircle2, XCircle, 
    Zap, Shield, Smartphone, Loader2, Save, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Plan {
    id: string;
    name: string;
    price: string;
    features: string[];
    highlight: boolean;
    is_active: boolean;
}

interface Subscription {
    merchant_id: string;
    merchant_name: string;
    merchant_email: string;
    plan: string;
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
                setSubscriptions(Array.isArray(data) ? data : []);
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
                                            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tier</th>
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
                                                        <div className="w-10 h-10 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-lg">
                                                            <Users size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[11px] font-black text-slate-950 uppercase tracking-tight">{sub.merchant_name}</p>
                                                            <p className="text-[9px] text-slate-400 font-bold">{sub.merchant_email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${sub.plan === 'Basic' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'}`}>
                                                            {(() => {
                                                                const Icon = getPlanIcon(sub.plan);
                                                                return <Icon size={12} />;
                                                            })()}
                                                        </div>
                                                        <span className="text-[11px] font-black text-slate-900 uppercase">{sub.plan}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                                sub.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 
                                                                sub.status === 'trial' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'
                                                            }`}>
                                                                {sub.status}
                                                            </span>
                                                        </div>
                                                        {sub.paid_at && (
                                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Since {new Date(sub.paid_at).toLocaleDateString()}</p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    {sub.paid_at ? (
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-950 uppercase tracking-tight">
                                                                {(() => {
                                                                    const start = new Date(sub.paid_at);
                                                                    const diff = Math.floor((new Date().getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                                                                    const remaining = 365 - diff;
                                                                    return (
                                                                        <>
                                                                            <span>{diff} Days Active</span>
                                                                            <span className="text-slate-200">|</span>
                                                                            <span className={remaining < 30 ? 'text-rose-500' : 'text-emerald-500'}>{remaining} Left</span>
                                                                        </>
                                                                    );
                                                                })()}
                                                            </div>
                                                            <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                                <div 
                                                                    className="h-full bg-slate-950 transition-all duration-1000" 
                                                                    style={{ width: `${Math.min(100, (Math.floor((new Date().getTime() - new Date(sub.paid_at).getTime()) / (1000 * 60 * 60 * 24)) / 365) * 100)}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : sub.trial_end ? (
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-tight">
                                                                {(() => {
                                                                    const end = new Date(sub.trial_end);
                                                                    const remaining = Math.ceil((end.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                                                                    return `${remaining > 0 ? remaining : 0} Trial Days Left`;
                                                                })()}
                                                            </p>
                                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Ends {new Date(sub.trial_end).toLocaleDateString()}</p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">No Active Period</span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    {sub.is_paid ? (
                                                        <div className="flex items-center justify-end gap-2 text-emerald-600">
                                                            <CheckCircle2 size={14} />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">PAID</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-end gap-2 text-slate-300">
                                                            <XCircle size={14} />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">UNPAID</span>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {Array.isArray(plans) && plans.map((plan, i) => (
                                    <div key={`${plan.id}-${i}`} className={`card-saas p-8 bg-white shadow-2xl relative overflow-hidden border-2 ${plan.highlight ? 'border-slate-950' : 'border-transparent'}`}>
                                        {plan.highlight && (
                                            <div className="absolute top-4 -right-8 bg-slate-950 text-white text-[8px] font-black uppercase py-1 px-10 rotate-45 shadow-xl">
                                                Highlight
                                            </div>
                                        )}
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${plan.highlight ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-400'}`}>
                                                {(() => {
                                                    const Icon = getPlanIcon(plan.name);
                                                    return <Icon size={24} />;
                                                })()}
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => setEditingPlan(plan)} className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-slate-950">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDeletePlan(plan.id)} className="p-2 hover:bg-rose-50 rounded-xl transition-all text-slate-400 hover:text-rose-600">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <h4 className="text-xl font-black text-slate-950 uppercase tracking-tighter">{plan.name}</h4>
                                        <div className="mt-2 flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-slate-950">{plan.price}</span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">QAR / Year</span>
                                        </div>
                                        
                                        <div className="mt-6 space-y-3">
                                            {Array.isArray(plan.features) && plan.features.map((f, i) => (
                                                <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                                                    <CheckCircle2 size={12} className="text-emerald-500" />
                                                    {f}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                
                                <button 
                                    onClick={() => setEditingPlan({ name: "", price: "", features: [], highlight: false, is_active: true })}
                                    className="border-4 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center p-12 gap-4 hover:border-slate-300 hover:bg-slate-50 transition-all group"
                                >
                                    <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                                        <Plus size={32} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-950 transition-colors">Add New Tier</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            {/* Editing Modal */}
            <AnimatePresence>
                {editingPlan && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setEditingPlan(null)}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-10">
                                <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tighter italic mb-8">
                                    {editingPlan.id ? 'Edit Strategy' : 'Construct New Tier'}
                                </h3>
                                
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Plan Identity</label>
                                        <input 
                                            value={editingPlan.name}
                                            onChange={e => setEditingPlan({...editingPlan, name: e.target.value})}
                                            className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black text-sm uppercase tracking-widest focus:ring-2 focus:ring-slate-950 transition-all"
                                            placeholder="e.g. ULTRA ELITE"
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Valuation (QAR)</label>
                                        <input 
                                            value={editingPlan.price}
                                            onChange={e => setEditingPlan({...editingPlan, price: e.target.value})}
                                            className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black text-sm uppercase tracking-widest focus:ring-2 focus:ring-slate-950 transition-all"
                                            placeholder="5500"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                        <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest">Highlight this plan?</span>
                                        <button 
                                            onClick={() => setEditingPlan({...editingPlan, highlight: !editingPlan.highlight})}
                                            className={`w-12 h-6 rounded-full relative transition-all ${editingPlan.highlight ? 'bg-slate-950' : 'bg-slate-200'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${editingPlan.highlight ? 'left-7' : 'left-1'}`} />
                                        </button>
                                    </div>
                                    
                                    <div className="pt-4 flex gap-4">
                                        <button 
                                            onClick={() => setEditingPlan(null)}
                                            className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={handleSavePlan}
                                            disabled={isSaving}
                                            className="flex-1 py-4 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-slate-950/20 transition-all flex items-center justify-center gap-2"
                                        >
                                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                            {editingPlan.id ? 'Authorize Update' : 'Initialize Plan'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
