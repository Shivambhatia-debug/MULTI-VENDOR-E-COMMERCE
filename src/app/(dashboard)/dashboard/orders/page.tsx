"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import {
    ShoppingCart,
    Search,
    Filter,
    MoreHorizontal,
    Phone,
    MapPin,
    Eye,
    Clock,
    CheckCircle2,
    Truck,
    Package,
    ArrowRight,
    Plus
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMerchant } from "@/context/MerchantContext";


export default function OrdersPage() {
    const router = useRouter();
    const { activePlan } = useMerchant();
    const [searchQuery, setSearchQuery] = useState("");
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [drivers, setDrivers] = useState<any[]>([]);
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem("golalita_token");
                const response = await fetch("/api/python/merchants/orders", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                }
            } catch (err) {
                setError("Failed to fetch orders");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchDrivers = async () => {
            try {
                const token = localStorage.getItem("golalita_token");
                const response = await fetch("/api/python/merchants/drivers", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setDrivers(data);
                }
            } catch (err) { console.error(err); }
        };

        fetchOrders();
        fetchDrivers();
    }, [router]);

    const stats = {
        incoming: orders.length,
        processing: orders.filter(o => o.status === "Processing").length,
        fulfilled: orders.filter(o => o.status === "Fulfilled").length,
        pending: orders.filter(o => o.status === "Pending").length,
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />

            <main className="flex-1 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                    <div>
                        <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tighter">Order Hub</h1>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">Logistics & Fulfilment Control</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="bg-white border border-slate-200 text-slate-950 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
                            <Plus className="text-slate-400" size={16} />
                            Create Manual Order
                        </button>
                    </div>
                </div>

                {/* Tactical Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: "Incoming Orders", value: stats.incoming.toString(), color: "text-slate-950", bg: "bg-slate-950 text-white" },
                        { label: "Active Processing", value: stats.processing.toString(), color: "text-amber-600", bg: "bg-white border border-slate-100" },
                        { label: "Target Fulfilled", value: stats.fulfilled.toString(), color: "text-emerald-600", bg: "bg-white border border-slate-100" },
                        { label: "Orders Pending", value: stats.pending.toString(), color: "text-rose-600", bg: "bg-white border border-slate-100" },
                    ].map((stat) => (
                        <div key={stat.label} className={`card-saas p-6 flex flex-col gap-4 group ${stat.bg === 'bg-slate-950 text-white' ? 'bg-slate-950 text-white shadow-2xl border-transparent' : 'hover:border-slate-300'}`}>
                            <div className="flex justify-between items-start">
                                <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${stat.bg === 'bg-slate-950 text-white' ? 'text-slate-400' : 'text-slate-400'}`}>{stat.label}</span>
                                <ShoppingCart size={14} className={stat.bg === 'bg-slate-950 text-white' ? 'text-white' : 'text-slate-300'} />
                            </div>
                            <p className="text-3xl font-black tracking-tighter leading-none">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Operations Bar */}
                <div className="card-saas p-6 mb-12 flex flex-col md:flex-row gap-4 shadow-lg border-slate-100/50">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-950 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Locate by Protocol ID or Entity Name..."
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:bg-white focus:border-slate-300 outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Ledger Table */}
                <div className="card-saas overflow-hidden border-slate-200/50 shadow-2xl min-h-[400px]">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-50 text-left">
                                    <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Index</th>
                                    <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Entity</th>
                                    <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Date</th>
                                    <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Value</th>
                                    <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mechanism</th>
                                    <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Fulfillment</th>
                                    <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Driver</th>
                                    <th className="p-8"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 bg-white">
                                {orders.length > 0 ? orders.map((order) => {
                                    const statusStyle: any = {
                                        Processing: "bg-amber-50 text-amber-600 border-amber-100",
                                        Pending: "bg-slate-950 text-white border-slate-900",
                                        Fulfilled: "bg-emerald-50 text-emerald-600 border-emerald-100",
                                        Cancelled: "bg-rose-50 text-rose-600 border-rose-100"
                                    };
                                    return (
                                        <tr key={order.id} className="hover:bg-slate-50 transition-all group animate-in fade-in duration-500">
                                            <td className="p-8">
                                                <span className="text-[11px] font-black text-slate-950 uppercase tracking-tighter">#ORD-{order.id.slice(-4).toUpperCase()}</span>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-black text-slate-950 uppercase tracking-tight leading-none">{order.customer_name}</span>
                                                    <span className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{order.items} Items Encoded</span>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {new Date(order.date).toLocaleDateString() + ' ' + new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </td>
                                            <td className="p-8">
                                                <span className="text-xs font-black text-slate-950 tracking-tighter">{order.total}</span>
                                            </td>
                                            <td className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                {order.method}
                                            </td>
                                            <td className="p-8 text-center">
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusStyle[order.status]}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex items-center gap-2">
                                                    <Truck size={14} className={order.driver_name ? "text-blue-500" : "text-slate-300"} />
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${order.driver_name ? "text-slate-900" : "text-slate-400 opacity-50"}`}>
                                                        {order.driver_name || "Unassigned"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-8 text-right">
                                                <button 
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-3 hover:bg-white hover:shadow-lg border border-transparent hover:border-slate-100 rounded-2xl text-slate-400 hover:text-slate-950 transition-all"
                                                >
                                                    <Eye size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan={7} className="p-32 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-30">
                                                <Package size={48} className="text-slate-300" />
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                                    {isLoading ? "Fetching Logistic Streams..." : "No Active Orders in Registry"}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-black text-slate-950 uppercase tracking-tighter italic">Order Protocol Detail</h3>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">#ORD-{selectedOrder.id.toUpperCase()}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-4 hover:bg-white rounded-2xl transition-all text-slate-400 hover:text-slate-950 shadow-sm border border-transparent hover:border-slate-100">
                                <Plus className="rotate-45" size={20} />
                            </button>
                        </div>
                        
                        <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto no-scrollbar">
                            {/* Customer & Shipping Section */}
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Phone size={12} /> Entity Contact
                                    </h4>
                                    <p className="text-sm font-black text-slate-950 uppercase">{selectedOrder.customer_name}</p>
                                    <p className="text-[10px] font-bold text-slate-500">{selectedOrder.customer_email}</p>
                                    <p className="text-[10px] font-bold text-slate-500">{selectedOrder.customer_phone}</p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin size={12} /> Shipping Node
                                    </h4>
                                    <p className="text-[10px] font-bold text-slate-950 leading-relaxed uppercase">
                                        {selectedOrder.shipping_address || "NO ADDRESS DATA"}<br />
                                        {selectedOrder.city}, {selectedOrder.zip_code}
                                    </p>
                                </div>
                            </div>

                            <div className="h-px bg-slate-50" />

                            {/* Status & Tracking Update */}
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">Update Fulfillment Parameters</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Process Status</label>
                                        <select 
                                            value={selectedOrder.status}
                                            onChange={async (e) => {
                                                const newStatus = e.target.value;
                                                setIsUpdating(true);
                                                try {
                                                    const token = localStorage.getItem("golalita_token");
                                                    const res = await fetch(`/api/python/orders/${selectedOrder.id}`, {
                                                        method: "PATCH",
                                                        headers: { 
                                                            "Authorization": `Bearer ${token}`,
                                                            "Content-Type": "application/json"
                                                        },
                                                        body: JSON.stringify({ status: newStatus })
                                                    });
                                                    if (res.ok) {
                                                        const updated = await res.json();
                                                        setOrders(orders.map(o => o.id === updated.id ? updated : o));
                                                        setSelectedOrder(updated);
                                                    }
                                                } catch (err) { console.error(err); } finally { setIsUpdating(false); }
                                            }}
                                            className="w-full bg-slate-50 border-none rounded-xl p-4 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-slate-950 transition-all appearance-none"
                                        >
                                            <option value="Processing">Processing</option>
                                            <option value="Fulfilled">Fulfilled</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Tracking ID</label>
                                        <input 
                                            type="text"
                                            placeholder="GOL-TRK-XXXX"
                                            value={selectedOrder.tracking_id || ""}
                                            onChange={async (e) => {
                                                const val = e.target.value;
                                                setSelectedOrder({...selectedOrder, tracking_id: val});
                                            }}
                                            onBlur={async () => {
                                                setIsUpdating(true);
                                                try {
                                                    const token = localStorage.getItem("golalita_token");
                                                    const res = await fetch(`/api/python/orders/${selectedOrder.id}`, {
                                                        method: "PATCH",
                                                        headers: { 
                                                            "Authorization": `Bearer ${token}`,
                                                            "Content-Type": "application/json"
                                                        },
                                                        body: JSON.stringify({ tracking_id: selectedOrder.tracking_id })
                                                    });
                                                    if (res.ok) {
                                                        const updated = await res.json();
                                                        setOrders(orders.map(o => o.id === updated.id ? updated : o));
                                                    }
                                                } catch (err) { console.error(err); } finally { setIsUpdating(false); }
                                            }}
                                            className="w-full bg-slate-50 border-none rounded-xl p-4 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-slate-950 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-slate-50">
                                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic flex items-center gap-2">
                                        <Truck size={14} /> Assign Logistics Officer
                                    </h4>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Active Driver</label>
                                        <select 
                                            value={selectedOrder.driver_id || ""}
                                            onChange={async (e) => {
                                                const driverId = e.target.value;
                                                const driverName = drivers.find(d => d.id === driverId)?.name || "";
                                                
                                                setIsUpdating(true);
                                                try {
                                                    const token = localStorage.getItem("golalita_token");
                                                    const res = await fetch(`/api/python/orders/${selectedOrder.id}`, {
                                                        method: "PATCH",
                                                        headers: { 
                                                            "Authorization": `Bearer ${token}`,
                                                            "Content-Type": "application/json"
                                                        },
                                                        body: JSON.stringify({ 
                                                            driver_id: driverId,
                                                            driver_name: driverName
                                                        })
                                                    });
                                                    if (res.ok) {
                                                        const updated = await res.json();
                                                        setOrders(orders.map(o => o.id === updated.id ? updated : o));
                                                        setSelectedOrder(updated);
                                                    }
                                                } catch (err) { console.error(err); } finally { setIsUpdating(false); }
                                            }}
                                            className="w-full bg-slate-950 text-white rounded-2xl p-5 text-[10px] font-black uppercase tracking-[0.2em] outline-none focus:ring-4 focus:ring-slate-950/20 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">No Driver Assigned</option>
                                            {drivers.map(driver => (
                                                <option key={driver.id} value={driver.id}>{driver.name} ({driver.vehicle})</option>
                                            ))}
                                        </select>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2 ml-1">Assignment will notify the driver terminal immediately</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue Impact</span>
                                <span className="text-2xl font-black text-slate-950 tracking-tighter italic">{selectedOrder.total}</span>
                            </div>
                            {isUpdating && <div className="flex items-center gap-2 text-[9px] font-black text-blue-600 animate-pulse uppercase"><Clock size={12} /> Syncing...</div>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
