"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import {
    Plus,
    MapPin,
    MoreHorizontal,
    Phone,
    Clock,
    Lock,
    ExternalLink,
    X,
    Trash2,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { useMerchant } from "@/context/MerchantContext";

export default function BranchesPage() {
    const { activePlan, planLimits } = useMerchant();
    const [branches, setBranches] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingBranch, setEditingBranch] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: "",
        city: "",
        address: "",
        phone: "",
        hours: "09:00 AM - 10:00 PM",
        status: "Active"
    });

    const fetchBranches = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("golalita_token");
            const response = await fetch("/api/python/merchants/branches", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setBranches(data);
            }
        } catch (err) {
            console.error("FETCH_BRANCHES_ERROR:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    const branchLimit = planLimits.branches || 1;
    const isLimitReached = branches.length >= branchLimit;

    const handleOpenModal = (branch: any = null) => {
        if (branch) {
            setEditingBranch(branch);
            setFormData({
                name: branch.name,
                city: branch.city,
                address: branch.address,
                phone: branch.phone,
                hours: branch.hours,
                status: branch.status
            });
        } else {
            setEditingBranch(null);
            setFormData({
                name: "",
                city: "",
                address: "",
                phone: "",
                hours: "09:00 AM - 10:00 PM",
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
            const url = editingBranch 
                ? `/api/python/merchants/branches/${editingBranch.id}`
                : "/api/python/merchants/branches";
            const method = editingBranch ? "PUT" : "POST";

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
                fetchBranches();
            }
        } catch (err) {
            console.error("SUBMIT_BRANCH_ERROR:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this branch?")) return;
        try {
            const token = localStorage.getItem("golalita_token");
            const response = await fetch(`/api/python/merchants/branches/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                fetchBranches();
            }
        } catch (err) {
            console.error("DELETE_BRANCH_ERROR:", err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />

            <main className="flex-1 p-6 lg:p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Branch Management</h1>
                        <p className="text-slate-500 text-xs mt-1">Manage your physical store locations and pickup points.</p>
                    </div>
                    {isLimitReached ? (
                        <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-xl border border-amber-100 shadow-sm">
                            <Lock size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Limit Reached</span>
                            <Link href="/pricing" className="ml-2 text-blue-600 hover:underline font-bold">Upgrade</Link>
                        </div>
                    ) : (
                        <button 
                            onClick={() => handleOpenModal()}
                            className="btn-primary flex items-center justify-center gap-2 text-[10px] py-2 px-4 uppercase tracking-widest"
                        >
                            <Plus size={16} />
                            <span>Add New Branch</span>
                        </button>
                    )}
                </div>

                {/* Capacity Card */}
                <div className="mb-6 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">{activePlan} Plan Limit: {branchLimit} Branch{branchLimit > 1 ? 'es' : ''}</span>
                    </div>
                    {activePlan === "Basic" && (
                        <p className="text-[10px] text-slate-400 font-medium">To manage multiple locations, upgrade to <span className="text-blue-600 font-bold">Premium</span>.</p>
                    )}
                </div>

                {/* Branch Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {branches.length > 0 ? branches.map((branch) => (
                        <div key={branch.id} className="card-saas p-6 group transition-all hover:border-blue-200">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                    <MapPin size={24} />
                                </div>
                                <div className="flex gap-1">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${branch.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                        {branch.status}
                                    </span>
                                    <button 
                                        onClick={() => handleDelete(branch.id)}
                                        className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-sm font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{branch.name}</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-slate-500">
                                    <div className="w-4 h-4 flex items-center justify-center"><Phone size={12} /></div>
                                    <span className="text-[11px] font-medium">{branch.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 text-wrap">
                                    <div className="w-4 h-4 flex items-center justify-center shrink-0"><MapPin size={12} /></div>
                                    <span className="text-[11px] font-medium truncate">{branch.address}, {branch.city}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500">
                                    <div className="w-4 h-4 flex items-center justify-center"><Clock size={12} /></div>
                                    <span className="text-[11px] font-medium">{branch.hours}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 border-t border-slate-50 pt-4">
                                <button 
                                    onClick={() => handleOpenModal(branch)}
                                    className="flex-1 py-1.5 rounded-lg border border-slate-100 text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                                >
                                    Edit Details
                                </button>
                                <button className="flex-1 py-1.5 rounded-lg bg-slate-900 text-white text-[10px] font-bold hover:bg-slate-800 transition-all">
                                    Live View
                                </button>
                            </div>
                        </div>
                    )) : !isLoading && (
                        <div className="col-span-full py-20 text-center opacity-30">
                           <MapPin size={48} className="mx-auto mb-4 text-slate-300" />
                           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">No Active Branches in Registry</p>
                        </div>
                    )}

                    {isLoading && (
                         <div className="col-span-full py-20 text-center opacity-30 animate-pulse">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Spatial Data...</p>
                         </div>
                    )}

                    {/* Locked Placeholder for Basic */}
                    {activePlan === "Basic" && branches.length < 2 && (
                        <div className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 transition-all group">
                            <div className="w-10 h-10 bg-white border border-slate-200 text-slate-300 rounded-full flex items-center justify-center mb-4 group-hover:text-amber-400 group-hover:border-amber-200 transition-colors">
                                <Lock size={18} />
                            </div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Second Branch Locked</h4>
                            <p className="text-[10px] text-slate-400 leading-relaxed max-w-[160px] mx-auto mb-4">You can only manage one branch on the Basic plan.</p>
                            <Link href="/pricing" className="text-[10px] font-bold text-blue-600 hover:underline">Get more branches</Link>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">
                                {editingBranch ? "Edit Branch" : "Add New Branch"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Branch Name</label>
                                <input 
                                    required
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="e.g. Downtown Store"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">City</label>
                                    <input 
                                        required
                                        type="text" 
                                        value={formData.city}
                                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        placeholder="Doha"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Phone</label>
                                    <input 
                                        required
                                        type="text" 
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        placeholder="+974 4444 0000"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Address</label>
                                <input 
                                    required
                                    type="text" 
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="Street 123, Zone 45"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Operating Hours</label>
                                <input 
                                    required
                                    type="text" 
                                    value={formData.hours}
                                    onChange={(e) => setFormData({...formData, hours: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="09:00 AM - 10:00 PM"
                                />
                            </div>
                            <div className="pt-4">
                                <button 
                                    disabled={isSubmitting}
                                    type="submit" 
                                    className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : (editingBranch ? "Update Branch" : "Create Branch")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

