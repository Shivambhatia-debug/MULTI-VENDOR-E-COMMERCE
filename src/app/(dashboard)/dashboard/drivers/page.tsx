"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import {
    Truck,
    Plus,
    Search,
    Phone,
    Star,
    ArrowUpRight,
    User,
    X,
    Trash2,
    Loader2
} from "lucide-react";
import { useMerchant } from "@/context/MerchantContext";

export default function DriversPage() {
    const { activePlan } = useMerchant();
    const [drivers, setDrivers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingDriver, setEditingDriver] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        vehicle: "Car",
        status: "Idle"
    });

    const fetchDrivers = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("golalita_token");
            const response = await fetch("/api/python/merchants/drivers", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setDrivers(data);
            }
        } catch (err) {
            console.error("FETCH_DRIVERS_ERROR:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("golalita_token");
            const response = await fetch("/api/python/orders", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchDrivers();
        fetchOrders();
    }, []);

    const handleOpenModal = (driver: any = null) => {
        if (driver) {
            setEditingDriver(driver);
            setFormData({
                name: driver.name,
                phone: driver.phone,
                vehicle: driver.vehicle,
                status: driver.status
            });
        } else {
            setEditingDriver(null);
            setFormData({
                name: "",
                phone: "",
                vehicle: "Car",
                status: "Idle"
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("golalita_token");
            const url = editingDriver 
                ? `/api/python/merchants/drivers/${editingDriver.id}`
                : "/api/python/merchants/drivers";
            const method = editingDriver ? "PUT" : "POST";

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
                fetchDrivers();
            }
        } catch (err) {
            console.error("SUBMIT_DRIVER_ERROR:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this driver?")) return;
        try {
            const token = localStorage.getItem("golalita_token");
            const response = await fetch(`/api/python/merchants/drivers/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                fetchDrivers();
            }
        } catch (err) {
            console.error("DELETE_DRIVER_ERROR:", err);
        }
    };

    // For demo purposes, we'll allow Basic users to see the functionality but keep the banner
    const isAddonActive = activePlan !== "Basic";

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />

            <main className="flex-1 p-6 lg:p-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Fleet Management</h1>
                        <p className="text-slate-500 text-xs mt-1">Manage your delivery drivers, assignments, and performance.</p>
                    </div>
                </div>

                {/* Add-on Banner for Basic */}
                {activePlan === "Basic" && (
                    <div className="mb-8 p-6 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6 text-center md:text-left">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/30">
                                    <Truck size={32} />
                                </div>
                                <div className="max-w-md">
                                    <h3 className="text-lg font-black tracking-tight mb-2">Efficient Delivery Fleet</h3>
                                    <p className="text-xs text-emerald-50 font-medium leading-relaxed">
                                        The Basic plan includes external logistics only. Activate the **Internal Driver Management** add-on to track your own fleet for just **25 QAR/month**.
                                    </p>
                                </div>
                            </div>
                            <div className="shrink-0">
                                <button className="bg-white text-emerald-600 px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2">
                                    Unlock Fleet mgmt
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
                            <input type="text" placeholder="Search drivers..." className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl text-[11px]" />
                        </div>
                        <button 
                            onClick={() => handleOpenModal()}
                            className="btn-primary py-3 px-6 text-[10px] uppercase font-black flex items-center gap-2"
                        >
                            <Plus size={16} /> Add Driver
                        </button>
                    </div>

                    {isLoading ? (
                         <div className="py-20 text-center opacity-30 animate-pulse">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Tracking Fleet Positions...</p>
                         </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {drivers.length > 0 ? drivers.map((driver) => (
                                <div key={driver.id} className="card-saas p-5 flex flex-col gap-6 group hover:border-blue-200 transition-all">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                                <User size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-900">{driver.name}</h4>
                                                <p className="text-[10px] text-slate-400 mt-1 font-medium">{driver.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                                driver.status === 'On Duty' ? 'bg-emerald-50 text-emerald-600' : 
                                                driver.status === 'Idle' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'
                                            }`}>
                                                {driver.status}
                                            </span>
                                            <button 
                                                onClick={() => handleDelete(driver.id)}
                                                className="p-1 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-slate-50 pt-4">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-1.5">
                                                <Truck size={12} className="text-slate-400" />
                                                <span className="text-[11px] font-black text-slate-700">{driver.vehicle}</span>
                                            </div>
                                            {orders.some(o => o.driver_id === driver.id && o.status === 'Processing') && (
                                                <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-lg">
                                                    <div className="w-1 h-1 bg-amber-500 rounded-full animate-pulse" />
                                                    <span className="text-[9px] font-black text-amber-600 uppercase">Active: #ORD-{orders.find(o => o.driver_id === driver.id && o.status === 'Processing')?.id.slice(-4).toUpperCase()}</span>
                                                </div>
                                            )}
                                        </div>
                                        <button 
                                            onClick={() => handleOpenModal(driver)}
                                            className="text-[10px] font-bold text-blue-600 hover:underline"
                                        >
                                            Edit Info
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full py-20 text-center opacity-30">
                                   <Truck size={48} className="mx-auto mb-4 text-slate-300" />
                                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">No Drivers Registered</p>
                                </div>
                            )}
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
                                {editingDriver ? "Edit Driver" : "Add New Driver"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Driver Name</label>
                                <input 
                                    required
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="e.g. Ahmed Raza"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Phone Number</label>
                                <input 
                                    required
                                    type="text" 
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="+974 0000 0000"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Vehicle Type</label>
                                    <select 
                                        value={formData.vehicle}
                                        onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    >
                                        <option value="Car">Car</option>
                                        <option value="Bike">Bike</option>
                                        <option value="Van">Van</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Status</label>
                                    <select 
                                        value={formData.status}
                                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    >
                                        <option value="Idle">Idle</option>
                                        <option value="On Duty">On Duty</option>
                                        <option value="Off Duty">Off Duty</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-4">
                                <button 
                                    disabled={isSubmitting}
                                    type="submit" 
                                    className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : (editingDriver ? "Update Driver" : "Add Driver")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

