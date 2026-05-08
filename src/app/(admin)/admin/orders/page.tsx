"use client";

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
    Plus,
    Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminOrdersPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("golalita_token");
                if (!token) {
                    router.push("/login");
                    return;
                }

                const response = await fetch("/api/python/orders", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                } else {
                    console.error("FETCH_ERROR:", response.status);
                    setError("Failed to load global order ledger");
                }
            } catch (err) {
                console.error("NETWORK_ERROR:", err);
                setError("Unable to connect to order protocol");
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [router]);

    const stats = {
        total: orders.length,
        revenue: orders.reduce((acc, o) => acc + parseFloat(o.total.replace('QAR ', '') || '0'), 0),
        processing: orders.filter(o => o.status === "Processing").length,
        fulfilled: orders.filter(o => o.status === "Fulfilled").length,
    };

    const filteredOrders = orders.filter(o => 
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-950 uppercase tracking-tighter italic leading-none">Global Ledger</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3 opacity-60">Real-time marketplace transaction & logistics monitor</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Global Orders", value: stats.total.toString(), color: "text-slate-950" },
                    { label: "Gross Revenue", value: `QAR ${stats.revenue.toFixed(2)}`, color: "text-emerald-600" },
                    { label: "Active Processing", value: stats.processing.toString(), color: "text-amber-500" },
                    { label: "Target Fulfilled", value: stats.fulfilled.toString(), color: "text-blue-600" },
                ].map((stat) => (
                    <div key={stat.label} className="card-saas p-8 bg-white shadow-xl border-slate-100 flex flex-col gap-4">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</span>
                        <p className={`text-3xl font-black tracking-tighter italic ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Search Bar */}
            <div className="card-saas p-6 bg-white shadow-xl border-slate-100 flex items-center gap-4">
                <Search className="text-slate-300" size={20} />
                <input
                    type="text"
                    placeholder="LOCATE BY ORDER ID OR CUSTOMER ENTITY..."
                    className="flex-1 bg-transparent border-none text-[10px] font-black uppercase tracking-widest outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Orders Table */}
            <div className="card-saas overflow-hidden bg-white shadow-2xl border-slate-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Protocol ID</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Entity Profile</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Timestamp</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Total Value</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Status</th>
                                <th className="px-8 py-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredOrders.map((order) => {
                                const statusColors: any = {
                                    Processing: "bg-amber-50 text-amber-600 border-amber-100",
                                    Fulfilled: "bg-emerald-50 text-emerald-600 border-emerald-100",
                                    Pending: "bg-slate-900 text-white border-slate-900",
                                    Cancelled: "bg-rose-50 text-rose-600 border-rose-100"
                                };
                                return (
                                    <tr key={order.id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-8 py-8 font-black text-[11px] text-slate-950 uppercase tracking-tighter">
                                            #ORD-{order.id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="px-8 py-8">
                                            <p className="text-[11px] font-black text-slate-950 uppercase tracking-tight">{order.customer_name}</p>
                                            <p className="text-[9px] text-slate-400 font-bold tracking-widest mt-1 italic">{order.customer_email}</p>
                                        </td>
                                        <td className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                            {new Date(order.date).toLocaleString()}
                                        </td>
                                        <td className="px-8 py-8 font-black text-xs text-slate-950">{order.total}</td>
                                        <td className="px-8 py-8">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusColors[order.status] || "bg-slate-100"}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-8 text-right">
                                            <button 
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-3 text-slate-300 hover:text-slate-950 transition-all"
                                            >
                                                <Eye size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filteredOrders.length === 0 && (
                        <div className="py-32 text-center">
                            <Package className="mx-auto text-slate-100 mb-6" size={64} />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">No transaction protocols detected</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-black text-slate-950 uppercase tracking-tighter italic">Global Order Protocol</h3>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">#ORD-{selectedOrder.id.toUpperCase()}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-4 hover:bg-white rounded-2xl transition-all text-slate-400 hover:text-slate-950 shadow-sm border border-transparent hover:border-slate-100">
                                <Plus className="rotate-45" size={20} />
                            </button>
                        </div>
                        
                        <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto no-scrollbar">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Phone size={12} /> Contact Node
                                    </h4>
                                    <p className="text-sm font-black text-slate-950 uppercase">{selectedOrder.customer_name}</p>
                                    <p className="text-[10px] font-bold text-slate-500">{selectedOrder.customer_email}</p>
                                    <p className="text-[10px] font-bold text-slate-500">{selectedOrder.customer_phone}</p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin size={12} /> Delivery Point
                                    </h4>
                                    <p className="text-[10px] font-bold text-slate-950 leading-relaxed uppercase">
                                        {selectedOrder.shipping_address || "NOT SPECIFIED"}<br />
                                        {selectedOrder.city}, {selectedOrder.zip_code}
                                    </p>
                                </div>
                            </div>

                            <div className="h-px bg-slate-50" />

                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">Administrative Controls</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">System Status</label>
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
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Global Tracking</label>
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
                            </div>
                        </div>

                        <div className="p-10 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Value</span>
                                <span className="text-2xl font-black text-slate-950 tracking-tighter italic">{selectedOrder.total}</span>
                            </div>
                            {isUpdating && <div className="flex items-center gap-2 text-[9px] font-black text-blue-600 animate-pulse uppercase"><Clock size={12} /> Synchronizing...</div>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
