"use client";

import Sidebar from "@/components/dashboard/Sidebar";
// import { products } from "@/lib/data";
import {
    Plus,
    Filter,
    Search,
    MoreHorizontal,
    Box,
    AlertCircle,
    ArrowUpRight,
    Lock,
    Package,
    ArrowRight,
    Minus,
    Plus as PlusIcon,
    Trash2,
    Edit3,
    ExternalLink,
    Loader2,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useMerchant } from "@/context/MerchantContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function ProductsPage() {
    const { activePlan, planLimits } = useMerchant();
    const router = useRouter();
    const [inventory, setInventory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

    const productLimit = planLimits.products;

    const fetchInventory = async () => {
        const token = localStorage.getItem('golalita_token');
        if (!token) return;

        try {
            const response = await fetch('/api/python/products', {
                headers: { 'Authorization': `Bearer ${token}` },
                cache: 'no-store'
            });

            if (response.ok) {
                const data = await response.json();
                setInventory(data);
            } else {
                console.error("FETCH_ERROR:", response.status, response.statusText);
                setError("Failed to load inventory");
            }
        } catch (err) {
            console.error("FETCH_INVENTORY_ERROR:", err);
            setError("Failed to fetch inventory");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleStockChange = async (productId: string, currentStock: number, delta: number) => {
        const newStock = Math.max(0, currentStock + delta);
        if (newStock === currentStock) return;

        setUpdatingId(productId);
        const token = localStorage.getItem('golalita_token');

        try {
            const response = await fetch(`/api/python/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ stock: newStock })
            });

            if (response.ok) {
                // Optimistic update
                setInventory(prev => prev.map(p =>
                    p.id === productId ? { ...p, stock: newStock } : p
                ));
            } else {
                setError("Failed to update stock");
            }
        } catch (err) {
            setError("Connection error during update");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (productId: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        setUpdatingId(productId);
        const token = localStorage.getItem('golalita_token');

        try {
            const response = await fetch(`/api/python/products/${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setInventory(prev => prev.filter(p => p.id !== productId));
                setOpenMenuId(null);
            } else {
                setError("Failed to delete product");
            }
        } catch (err) {
            setError("Connection error during deletion");
        } finally {
            setUpdatingId(null);
        }
    };

    const currentCount = inventory.length;
    const usage = (currentCount / productLimit) * 100;
    const isLimitReached = currentCount >= productLimit;

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />

            <main className="flex-1 p-4 md:p-6 lg:p-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                    <div>
                        <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tighter">Inventory Core</h1>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">Catalogue & SKU Management</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        {isLimitReached ? (
                            <div className="flex items-center gap-4 bg-slate-900 text-white px-6 py-4 rounded-[2rem] shadow-2xl grow md:grow-0">
                                <Lock size={16} className="text-slate-400" />
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Storage Maximum</span>
                                    <Link href="/pricing" className="text-[10px] font-black uppercase text-white hover:underline flex items-center gap-1">Upgrade Tier <ArrowRight size={12} /></Link>
                                </div>
                            </div>
                        ) : (
                            <Link href="/dashboard/products/new" className="bg-slate-950 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95 grow md:grow-0">
                                <Plus size={18} />
                                Add New Product
                            </Link>
                        )}
                    </div>
                </div>

                {/* Capacity Visualization */}
                <div className="mb-12 card-saas p-8 flex flex-col md:flex-row items-center gap-8 border-l-4 border-l-slate-950 shadow-xl relative overflow-hidden group">
                    {/* Abstract Decor */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-slate-100 transition-colors" />

                    <div className="w-16 h-16 bg-slate-950 text-white rounded-[2rem] flex items-center justify-center shrink-0 shadow-lg relative z-10 animate-pulse">
                        <Package size={28} />
                    </div>
                    <div className="flex-1 space-y-5 w-full relative z-10">
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em]">Inventory Saturation</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 leading-relaxed">
                                    Deploying {currentCount} of {productLimit} absolute SKU slots on <span className="text-slate-950 italic">{activePlan}</span> tier.
                                </p>
                            </div>
                            <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest">{usage.toFixed(1)}% Capacity</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div className="h-full bg-slate-950 rounded-full transition-all duration-1000" style={{ width: `${usage}%` }} />
                        </div>
                    </div>
                    {activePlan === "Basic" && (
                        <div className="shrink-0 relative z-10">
                            <Link href="/pricing" className="bg-white border border-slate-200 text-slate-950 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm flex items-center gap-3">
                                Expand Storage
                                <ArrowUpRight size={16} />
                            </Link>
                        </div>
                    )}
                </div>

                {/* Tactical Controls */}
                <div className="card-saas p-6 mb-12 flex flex-col md:flex-row gap-4 items-center shadow-lg border-slate-100/50">
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-950 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Locate products, SKUs, or category hierarchies..."
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:bg-white focus:border-slate-300 outline-none transition-all placeholder:text-slate-300"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <button className="flex-1 md:flex-initial px-8 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 hover:text-slate-950 transition-all shadow-sm">
                            <Filter size={16} />
                            Strategic Filters
                        </button>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-500 font-bold uppercase tracking-widest text-[10px]">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                {/* Inventory Table */}
                <div className="card-saas overflow-hidden border-slate-200/50 shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-50">
                                    <th className="p-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Entity</th>
                                    <th className="p-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Category</th>
                                    <th className="p-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="p-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Unit Stock</th>
                                    <th className="p-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Price Evolution</th>
                                    <th className="p-8 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {inventory.length > 0 ? inventory.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50 transition-all group">
                                        <td className="p-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden relative border border-slate-100 shadow-sm">
                                                    <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black text-slate-950 uppercase tracking-tighter leading-none">{product.name}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{product.sku}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8 text-center">
                                            <span className="text-[9px] font-black text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full uppercase tracking-widest border border-slate-200/50">{product.category}</span>
                                        </td>
                                        <td className="p-8 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${product.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'} animate-pulse`} />
                                                <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest">{product.status}</span>
                                            </div>
                                        </td>
                                        <td className="p-8 text-center">
                                            <div className="flex items-center justify-center gap-4">
                                                <button
                                                    disabled={updatingId === product.id}
                                                    onClick={() => handleStockChange(product.id, product.stock, -1)}
                                                    className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all active:scale-90 disabled:opacity-30"
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <div className="relative w-12 flex justify-center">
                                                    {updatingId === product.id ? (
                                                        <Loader2 size={12} className="animate-spin text-slate-400" />
                                                    ) : (
                                                        <p className="text-[11px] font-black text-slate-700">{product.stock}</p>
                                                    )}
                                                </div>
                                                <button
                                                    disabled={updatingId === product.id}
                                                    onClick={() => handleStockChange(product.id, product.stock, 1)}
                                                    className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all active:scale-90 disabled:opacity-30"
                                                >
                                                    <PlusIcon size={12} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-8 text-center">
                                            <p className="text-xs font-black text-slate-950 uppercase tracking-tighter">QAR {product.price}</p>
                                        </td>
                                        <td className="p-8 text-right relative">
                                            <div className="flex justify-end items-center gap-2">
                                                <button
                                                    onClick={() => setOpenMenuId(openMenuId === product.id ? null : product.id)}
                                                    className={`p-3 border rounded-2xl transition-all group ${openMenuId === product.id ? 'bg-slate-950 text-white border-slate-950 shadow-lg' : 'bg-white text-slate-400 border-transparent hover:shadow-lg hover:border-slate-100'}`}
                                                >
                                                    <MoreHorizontal size={20} className={`${openMenuId === product.id ? 'rotate-90' : ''} transition-transform duration-300`} />
                                                </button>

                                                {/* Action Menu Dropdown */}
                                                <AnimatePresence>
                                                    {openMenuId === product.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, x: 10, scale: 0.95 }}
                                                            animate={{ opacity: 1, x: 0, scale: 1 }}
                                                            exit={{ opacity: 0, x: 10, scale: 0.95 }}
                                                            className="absolute right-24 top-1/2 -translate-y-1/2 z-50 bg-white/80 backdrop-blur-xl border border-white p-2 rounded-[2rem] shadow-2xl flex items-center gap-1"
                                                        >
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedProduct(product);
                                                                    setOpenMenuId(null);
                                                                }}
                                                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-950 hover:text-white transition-all"
                                                            >
                                                                <ExternalLink size={14} />
                                                                Details
                                                            </button>
                                                            <div className="w-[1px] h-4 bg-slate-100" />
                                                            <button
                                                                onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}
                                                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 transition-all"
                                                            >
                                                                <Edit3 size={14} />
                                                                Edit
                                                            </button>
                                                            <div className="w-[1px] h-4 bg-slate-100" />
                                                            <button
                                                                onClick={() => handleDelete(product.id)}
                                                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-rose-600 hover:text-white transition-all"
                                                            >
                                                                <Trash2 size={14} />
                                                                Delete
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="p-32 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-30">
                                                <Package size={48} className="text-slate-300" />
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                                    {isLoading ? "Connecting to Warehouse..." : "No Products in Current Inventory"}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Product Details Modal */}
                <AnimatePresence>
                    {selectedProduct && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedProduct(null)}
                                className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    <div className="h-64 md:h-auto relative bg-slate-100">
                                        <Image src={selectedProduct.image} alt={selectedProduct.name} fill className="object-cover" />
                                    </div>
                                    <div className="p-8 md:p-12 space-y-8">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-200/50">{selectedProduct.category}</span>
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{selectedProduct.sku}</span>
                                            </div>
                                            <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tighter">{selectedProduct.name}</h2>
                                        </div>

                                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{selectedProduct.description || "No description provided for this entity."}</p>

                                        <div className="grid grid-cols-2 gap-8 py-8 border-y border-slate-50">
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Stock</p>
                                                <p className="text-xl font-black text-slate-950">{selectedProduct.stock} Units</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Pricing Model</p>
                                                <p className="text-xl font-black text-slate-950">QAR {selectedProduct.price}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setSelectedProduct(null)}
                                            className="w-full py-4 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95 shadow-lg"
                                        >
                                            Close Intelligence
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
