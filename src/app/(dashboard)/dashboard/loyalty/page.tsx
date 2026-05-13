"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Award, Star, Zap, Gift, X, Loader2 } from "lucide-react";
import { useMerchant } from "@/context/MerchantContext";

export default function LoyaltyPage() {
    const { activePlan } = useMerchant();
    const [settings, setSettings] = useState<any>({
        points_multiplier: 10,
        rewards: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
    const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newReward, setNewReward] = useState({
        name: "",
        points_required: 500,
        discount_value: 50,
        status: "Active"
    });

    const [multiplier, setMultiplier] = useState(10);

    const fetchLoyalty = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("golalita_token");
            const response = await fetch("/api/python/merchants/loyalty", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setSettings(data);
                setMultiplier(data.points_multiplier || 10);
            }
        } catch (err) {
            console.error("FETCH_LOYALTY_ERROR:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activePlan !== "Basic") {
            fetchLoyalty();
        }
    }, [activePlan]);

    const handleSaveSettings = async (updatedSettings: any) => {
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("golalita_token");
            const response = await fetch("/api/python/merchants/loyalty", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updatedSettings)
            });
            if (response.ok) {
                fetchLoyalty();
                setIsRuleModalOpen(false);
                setIsRewardModalOpen(false);
            }
        } catch (err) {
            console.error("SAVE_LOYALTY_ERROR:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddReward = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedRewards = [...(settings.rewards || []), newReward];
        handleSaveSettings({ ...settings, rewards: updatedRewards });
    };

    const handleUpdateMultiplier = (e: React.FormEvent) => {
        e.preventDefault();
        handleSaveSettings({ ...settings, points_multiplier: multiplier });
    };

    const handleDeleteReward = (index: number) => {
        if (!confirm("Remove this reward?")) return;
        const updatedRewards = [...(settings.rewards || [])];
        updatedRewards.splice(index, 1);
        handleSaveSettings({ ...settings, rewards: updatedRewards });
    };

    if (activePlan === "Basic") {
        return (
            <div className="min-h-screen bg-slate-50 flex">
                <Sidebar />
                <main className="flex-1 p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
                        <Award size={40} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Loyalty Engine Locked</h1>
                    <p className="text-slate-500 max-w-md mb-8">
                        The Loyalty & Rewards Engine is a Premium feature.
                        Retain customers with points, tiered rewards, and automated gifts.
                    </p>
                    <Link href="/pricing" className="btn-primary px-8 py-3 uppercase tracking-widest text-[10px]">Upgrade to Premium</Link>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-8">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Loyalty & Rewards</h1>
                        <p className="text-slate-500 text-xs mt-1">Configure point systems, customer tiers, and rewards.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-100 shadow-sm">
                        <Award size={14} className="fill-current text-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-wider">{activePlan} Feature</span>
                    </div>
                </div>

                {isLoading ? (
                    <div className="py-20 text-center opacity-30 animate-pulse">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Loyalty Matrix...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                            <div className="card-saas p-6">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Total Points Issued</p>
                                <p className="text-2xl font-black tracking-tighter text-slate-900">1.2M</p>
                            </div>
                            <div className="card-saas p-6">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Points Redeemed</p>
                                <p className="text-2xl font-black tracking-tighter text-slate-900">450K</p>
                            </div>
                            <div className="card-saas p-6">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Active Members</p>
                                <p className="text-2xl font-black tracking-tighter text-slate-900">8,420</p>
                            </div>
                            <div className="card-saas p-6">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Retention Rate</p>
                                <p className="text-2xl font-black tracking-tighter text-emerald-600">+12%</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="card-saas p-6">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Zap size={14} className="text-amber-500" />
                                    Points Multiplier
                                </h3>
                                <div className="space-y-6">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-500 mb-2">Current Rule</p>
                                        <p className="text-sm font-black text-slate-900">1 QAR = {settings.points_multiplier} Loyalty Points</p>
                                    </div>
                                    <button 
                                        onClick={() => setIsRuleModalOpen(true)}
                                        className="w-full py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                                    >
                                        Configure Rule
                                    </button>
                                </div>
                            </div>

                            <div className="card-saas p-6">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Gift size={14} className="text-blue-500" />
                                    Active Rewards
                                </h3>
                                <div className="space-y-3">
                                    {(settings.rewards || []).length > 0 ? settings.rewards.map((reward: any, i: number) => (
                                        <div key={i} className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                                    <Star size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-900">{reward.name}</p>
                                                    <p className="text-[9px] text-slate-400">{reward.points_required} Points Required</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleDeleteReward(i)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-300 hover:text-red-500"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )) : (
                                        <p className="text-[10px] text-center text-slate-400 py-4 italic">No rewards configured yet.</p>
                                    )}
                                    <button 
                                        onClick={() => setIsRewardModalOpen(true)}
                                        className="w-full py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
                                    >
                                        + New Reward
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>

            {/* Rule Modal */}
            {isRuleModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Configure Rule</h2>
                            <button onClick={() => setIsRuleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateMultiplier} className="p-6 space-y-6">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Points Per QAR Spent</label>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-black text-slate-900 shrink-0">1 QAR =</span>
                                    <input 
                                        type="number" 
                                        value={multiplier}
                                        onChange={(e) => setMultiplier(parseInt(e.target.value))}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    />
                                    <span className="text-xs font-bold text-slate-400 shrink-0">Points</span>
                                </div>
                            </div>
                            <button 
                                disabled={isSubmitting}
                                type="submit" 
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Update Matrix"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Reward Modal */}
            {isRewardModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">New Loyalty Reward</h2>
                            <button onClick={() => setIsRewardModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddReward} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Reward Name</label>
                                <input 
                                    required
                                    type="text" 
                                    value={newReward.name}
                                    onChange={(e) => setNewReward({...newReward, name: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    placeholder="e.g. QAR 50 Discount"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Points Required</label>
                                    <input 
                                        required
                                        type="number" 
                                        value={newReward.points_required}
                                        onChange={(e) => setNewReward({...newReward, points_required: parseInt(e.target.value)})}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Discount (QAR)</label>
                                    <input 
                                        required
                                        type="number" 
                                        value={newReward.discount_value}
                                        onChange={(e) => setNewReward({...newReward, discount_value: parseFloat(e.target.value)})}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                            </div>
                            <div className="pt-4">
                                <button 
                                    disabled={isSubmitting}
                                    type="submit" 
                                    className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Create Reward"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

