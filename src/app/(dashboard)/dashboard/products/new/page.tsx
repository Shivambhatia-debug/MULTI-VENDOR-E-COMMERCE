"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import {
    ArrowLeft,
    Package,
    DollarSign,
    Tag,
    Layout,
    Image as ImageIcon,
    Hash,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Sparkles,
    Plus,
    Upload
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { useMerchant } from "@/context/MerchantContext";

export default function NewProductPage() {
    const { token } = useMerchant();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        originalPrice: "",
        category: "Electronics",
        description: "",
        image: "",
        stock: "",
        sku: "",
        status: "Active"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!token) {
            setError("Session expired. Please login again.");
            setIsLoading(false);
            return;
        }

        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
                stock: parseInt(formData.stock) || 0,
                rating: 0,
                reviews: 0
            };

            const response = await fetch('/api/python/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/dashboard/products');
                }, 1500);
            } else {
                const data = await response.json();
                if (response.status === 401) {
                    setError("SESSION EXPIRED — PLEASE SIGN OUT AND LOGIN AGAIN");
                } else {
                    setError(data.detail || "Failed to create product");
                }
            }
        } catch (err) {
            console.error("CREATE_PRODUCT_ERROR:", err);
            setError("NETWORK ERROR — CONNECTION ABORTED OR SERVER OFFLINE");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />

            <main className="flex-1 p-6 lg:p-8">
                {/* Header Section */}
                <div className="max-w-4xl mx-auto mb-10">
                    <Link href="/dashboard/products" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-950 transition-all mb-6 group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Inventory
                    </Link>

                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tighter">Add New Product</h1>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">Global Catalogue Management</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form Fields */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="card-saas p-8 shadow-xl border-slate-200/50">
                            <h2 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                <Layout size={16} className="text-slate-400" />
                                Product Details
                            </h2>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Product Name</label>
                                    <div className="relative group">
                                        <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-950 transition-colors" size={18} />
                                        <input
                                            required
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="Enter product title..."
                                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold focus:bg-white focus:border-slate-300 outline-none transition-all placeholder:text-slate-300"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                                    <textarea
                                        required
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={5}
                                        placeholder="Enter product description..."
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold focus:bg-white focus:border-slate-300 outline-none transition-all placeholder:text-slate-300 resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Sale Price (QAR)</label>
                                        <div className="relative group">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-950 transition-colors" size={18} />
                                            <input
                                                required
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold focus:bg-white focus:border-slate-300 outline-none transition-all placeholder:text-slate-300"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Original Price</label>
                                        <div className="relative group">
                                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-950 transition-colors" size={18} />
                                            <input
                                                name="originalPrice"
                                                value={formData.originalPrice}
                                                onChange={handleChange}
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00 (Optional)"
                                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold focus:bg-white focus:border-slate-300 outline-none transition-all placeholder:text-slate-300"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-saas p-8 shadow-xl border-slate-200/50">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em] flex items-center gap-3">
                                    <ImageIcon size={16} className="text-slate-400" />
                                    Product Image
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-4 py-2 bg-slate-950 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 transition-all flex items-center gap-2 active:scale-95 shadow-lg"
                                >
                                    <Upload size={12} />
                                    Open Gallery
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Or Paste Image URL</label>
                                    <div className="relative group">
                                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-950 transition-colors" size={18} />
                                        <input
                                            name="image"
                                            value={formData.image.startsWith('data:') ? '' : formData.image}
                                            onChange={handleChange}
                                            type="url"
                                            placeholder="Paste image link here..."
                                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold focus:bg-white focus:border-slate-300 outline-none transition-all placeholder:text-slate-300"
                                        />
                                    </div>
                                </div>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center cursor-pointer hover:border-slate-400 transition-all group"
                                >
                                    {formData.image ? (
                                        <div className="relative h-48 w-full rounded-xl overflow-hidden shadow-inner group-hover:opacity-90 transition-opacity">
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-[9px] font-black text-white uppercase tracking-[0.3em] bg-slate-950/40 px-4 py-2 rounded-full backdrop-blur-sm">Change Image</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-12 space-y-4">
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                                                <Upload size={24} className="text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-950 uppercase tracking-widest">Select from Gallery</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 leading-relaxed opacity-60">High-resolution PNG, JPG or WEBP preferred</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Fields */}
                    <div className="space-y-6">
                        <div className="card-saas p-8 shadow-xl border-slate-200/50">
                            <h2 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                <Hash size={16} className="text-slate-400" />
                                Inventory Details
                            </h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:bg-white focus:border-slate-300 outline-none transition-all shadow-sm appearance-none cursor-pointer"
                                    >
                                        <option>Electronics</option>
                                        <option>Apparel</option>
                                        <option>Home Decór</option>
                                        <option>Accessories</option>
                                        <option>Beauty</option>
                                        <option>Gourmet</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Stock</label>
                                    <input
                                        required
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        type="number"
                                        placeholder="0"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold focus:bg-white focus:border-slate-300 outline-none transition-all placeholder:text-slate-300"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">SKU Code</label>
                                    <input
                                        required
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="e.g. GOL-001"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold focus:bg-white focus:border-slate-300 outline-none transition-all placeholder:text-slate-300"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-[10px] font-black uppercase tracking-widest"
                                    >
                                        <AlertCircle size={16} />
                                        {error}
                                    </motion.div>
                                )}
                                {success && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-600 text-[10px] font-black uppercase tracking-widest"
                                    >
                                        <CheckCircle2 size={16} />
                                        Product Added!
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={isLoading || success}
                                className="w-full bg-slate-950 text-white p-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-3"
                            >
                                {isLoading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        <Plus size={18} />
                                        Add Product
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
