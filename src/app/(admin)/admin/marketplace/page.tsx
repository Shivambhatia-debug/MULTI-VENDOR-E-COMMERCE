"use client";

import { useState, useEffect, useRef } from "react";
import { 
    Sparkles, Image as ImageIcon, Save, Plus, Trash2, 
    Layout, Type, Target, Loader2, CheckCircle2, AlertCircle,
    Zap, Smartphone, ShieldCheck, ShoppingBag, Heart, Star, 
    Tag, Gift, Coffee, Headphones, Watch, Camera, Globe, Upload
} from "lucide-react";

export default function AdminMarketplacePage() {
    const [settings, setSettings] = useState<any>({
        banners: [],
        announcement_ticker: "",
        categories: [],
        featured_merchants: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = localStorage.getItem("golalita_token");
                const res = await fetch("/api/python/admin/marketplace/settings", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setSettings({
                        ...data,
                        categories: data.categories || [],
                        banners: data.banners || []
                    });
                }
            } catch (err) {
                console.error("MARKETPLACE_FETCH_ERROR:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);
        try {
            const token = localStorage.getItem("golalita_token");
            const res = await fetch("/api/python/admin/marketplace/settings", {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                setMessage({ type: 'success', text: 'Marketplace logic synchronized with global edge.' });
            } else {
                throw new Error("Failed to save");
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Synchronization failed. Integrity check rejected the payload.' });
        } finally {
            setIsSaving(false);
        }
    };

    const addBanner = () => {
        setSettings({
            ...settings,
            banners: [...settings.banners, { image_url: "", title: "", subtitle: "", link: "" }]
        });
    };

    const removeBanner = (index: number) => {
        const newBanners = settings.banners.filter((_: any, i: number) => i !== index);
        setSettings({ ...settings, banners: newBanners });
    };

    const addCategory = () => {
        setSettings({
            ...settings,
            categories: [...settings.categories, { name: "", icon: "Sparkles", link: "/products" }]
        });
    };

    const removeCategory = (index: number) => {
        const newCats = settings.categories.filter((_: any, i: number) => i !== index);
        setSettings({ ...settings, categories: newCats });
    };
 
    const addPromotion = () => {
        setSettings({
            ...settings,
            promotions: [...(settings.promotions || []), { title: "", subtitle: "", link: "", color: "#fb641b" }]
        });
    };
 
    const removePromotion = (index: number) => {
        const newPromos = settings.promotions.filter((_: any, i: number) => i !== index);
        setSettings({ ...settings, promotions: newPromos });
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && uploadingIndex !== null) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const b = [...settings.banners];
                b[uploadingIndex].image_url = base64String;
                setSettings({ ...settings, banners: b });
            };
            reader.readAsDataURL(file);
        }
    };

    const iconOptions = [
        "Sparkles", "Zap", "Smartphone", "ShieldCheck", "ShoppingBag", 
        "Heart", "Star", "Tag", "Gift", "Coffee", "Headphones", 
        "Watch", "Camera", "Globe", "Target"
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-950 uppercase tracking-tighter italic leading-none">Marketplace Logic</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3 opacity-60">Global frontend protocol & entity management console</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full md:w-auto px-10 py-5 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    Synchronize Core
                </button>
            </div>

            {message && (
                <div className={`p-5 rounded-[1.5rem] border flex items-center gap-3 text-[10px] font-black uppercase tracking-widest ${
                    message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'
                }`}>
                    {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Panel: Ticker & Info */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="card-saas p-8 bg-white shadow-xl border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-slate-950 text-white rounded-xl flex items-center justify-center shadow-lg"><Type size={18} /></div>
                            <h3 className="text-xs font-black text-slate-950 uppercase tracking-widest italic">Protocol Ticker</h3>
                        </div>
                        <p className="text-[9px] text-slate-400 mb-4 font-black uppercase tracking-widest">Global Broadcast Content</p>
                        <textarea 
                            value={settings.announcement_ticker}
                            onChange={(e) => setSettings({...settings, announcement_ticker: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] p-5 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-slate-950 transition-all min-h-[140px] shadow-inner"
                            placeholder="ENTER GLOBAL BROADCAST MESSAGE..."
                        />
                    </div>

                    <div className="card-saas p-8 bg-slate-950 text-white shadow-2xl overflow-hidden relative group">
                         <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                         <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-400">Edge Runtime</span>
                            </div>
                            <h3 className="text-lg font-black uppercase tracking-widest italic mb-3 underline decoration-blue-500 decoration-2 underline-offset-4">Live Evolution</h3>
                            <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-tighter">Any modifications to these parameters will propagate across the marketplace lattice in real-time. Use caution when updating core infrastructure.</p>
                         </div>
                    </div>
                </div>

                {/* Right Panel: Category & Banners */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Category Manager */}
                    <div className="card-saas p-8 bg-white shadow-xl border-slate-100">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-950 text-white rounded-xl flex items-center justify-center shadow-lg"><Layout size={18} /></div>
                                <h3 className="text-xs font-black text-slate-950 uppercase tracking-widest italic">Category Infrastructure</h3>
                            </div>
                            <button 
                                onClick={addCategory}
                                className="w-10 h-10 bg-slate-50 hover:bg-slate-950 hover:text-white rounded-xl transition-all text-slate-400 shadow-sm flex items-center justify-center border border-slate-100"
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {settings.categories.map((cat: any, index: number) => (
                                <div key={index} className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 group relative">
                                    <button 
                                        onClick={() => removeCategory(index)}
                                        className="absolute top-4 right-4 p-2 bg-white text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-rose-500 hover:text-white z-10"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    
                                    <div className="space-y-4">
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Label</label>
                                                <input 
                                                    type="text"
                                                    value={cat.name}
                                                    onChange={(e) => {
                                                        const c = [...settings.categories];
                                                        c[index].name = e.target.value;
                                                        setSettings({...settings, categories: c});
                                                    }}
                                                    className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-slate-950 transition-all"
                                                    placeholder="NAME"
                                                />
                                            </div>
                                            <div className="w-24">
                                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Icon</label>
                                                <select 
                                                    value={cat.icon}
                                                    onChange={(e) => {
                                                        const c = [...settings.categories];
                                                        c[index].icon = e.target.value;
                                                        setSettings({...settings, categories: c});
                                                    }}
                                                    className="w-full bg-white border border-slate-100 rounded-xl px-2 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-slate-950 transition-all"
                                                >
                                                    {iconOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Filter/Link</label>
                                            <input 
                                                type="text"
                                                value={cat.link}
                                                onChange={(e) => {
                                                    const c = [...settings.categories];
                                                    c[index].link = e.target.value;
                                                    setSettings({...settings, categories: c});
                                                }}
                                                className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-[10px] font-black tracking-widest outline-none focus:ring-2 focus:ring-slate-950 transition-all"
                                                placeholder="/path"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {settings.categories.length === 0 && (
                                <div className="col-span-2 py-10 text-center border-2 border-dashed border-slate-100 rounded-[1.5rem]">
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">No custom entities configured</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Banner Management */}
                    <div className="card-saas p-8 bg-white shadow-xl border-slate-100">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-950 text-white rounded-xl flex items-center justify-center shadow-lg"><ImageIcon size={18} /></div>
                                <h3 className="text-xs font-black text-slate-950 uppercase tracking-widest italic">Visual Narrative (Banners)</h3>
                            </div>
                            <button 
                                onClick={addBanner}
                                className="w-10 h-10 bg-slate-50 hover:bg-slate-950 hover:text-white rounded-xl transition-all text-slate-400 shadow-sm flex items-center justify-center border border-slate-100"
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {settings.banners.map((banner: any, index: number) => (
                                <div key={index} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 group relative">
                                    <button 
                                        onClick={() => removeBanner(index)}
                                        className="absolute top-6 right-6 p-2 bg-white text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:bg-rose-500 hover:text-white z-10"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-5">
                                            <div>
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Display Title</label>
                                                <input 
                                                    type="text"
                                                    value={banner.title}
                                                    onChange={(e) => {
                                                        const b = [...settings.banners];
                                                        b[index].title = e.target.value;
                                                        setSettings({...settings, banners: b});
                                                    }}
                                                    className="w-full bg-white border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-black uppercase tracking-tighter outline-none focus:ring-2 focus:ring-slate-950 transition-all shadow-sm"
                                                    placeholder="HERO TITLE"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Subtitle (Small Text)</label>
                                                <input 
                                                    type="text"
                                                    value={banner.subtitle}
                                                    onChange={(e) => {
                                                        const b = [...settings.banners];
                                                        b[index].subtitle = e.target.value;
                                                        setSettings({...settings, banners: b});
                                                    }}
                                                    className="w-full bg-white border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-slate-950 transition-all shadow-sm"
                                                    placeholder="NEW COLLECTION 2026"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Target Interface (URL)</label>
                                                <input 
                                                    type="text"
                                                    value={banner.link}
                                                    onChange={(e) => {
                                                        const b = [...settings.banners];
                                                        b[index].link = e.target.value;
                                                        setSettings({...settings, banners: b});
                                                    }}
                                                    className="w-full bg-white border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-black tracking-widest outline-none focus:ring-2 focus:ring-slate-950 transition-all shadow-sm"
                                                    placeholder="/products/special"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-5">
                                            <div>
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Digital Asset (Image URL)</label>
                                                <input 
                                                    type="text"
                                                    value={banner.image_url}
                                                    onChange={(e) => {
                                                        const b = [...settings.banners];
                                                        b[index].image_url = e.target.value;
                                                        setSettings({...settings, banners: b});
                                                    }}
                                                    className="w-full bg-white border border-slate-100 rounded-xl px-5 py-3.5 text-[11px] font-black tracking-widest outline-none focus:ring-2 focus:ring-slate-950 transition-all shadow-sm"
                                                    placeholder="HTTPS://IMAGE-CDN..."
                                                />
                                            </div>
                                            <div 
                                                className="h-24 bg-white rounded-[1.5rem] border border-dashed border-slate-200 overflow-hidden shadow-inner flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-all relative group"
                                                onClick={() => {
                                                    setUploadingIndex(index);
                                                    fileInputRef.current?.click();
                                                }}
                                            >
                                                {banner.image_url ? (
                                                    <>
                                                        <img src={banner.image_url} className="w-full h-full object-cover" alt="" />
                                                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                            <Upload className="text-white" size={24} />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-1 text-slate-300">
                                                        <Upload size={24} />
                                                        <span className="text-[8px] font-black uppercase">Click to Upload</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {settings.banners.length === 0 && (
                                <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                                    <Layout className="mx-auto text-slate-100 mb-4 opacity-50" size={64} />
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] italic">No active narratives in rotation</p>
                                </div>
                            )}
                        </div>
                    </div>
 
                    {/* Add Promotions Management here */}
                    <div className="card-saas p-8 bg-white shadow-xl border-slate-100">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-950 text-white rounded-xl flex items-center justify-center shadow-lg"><Zap size={18} /></div>
                                <h3 className="text-xs font-black text-slate-950 uppercase tracking-widest italic">In-Grid Promotions</h3>
                            </div>
                            <button 
                                onClick={addPromotion}
                                className="w-10 h-10 bg-slate-50 hover:bg-slate-950 hover:text-white rounded-xl transition-all text-slate-400 shadow-sm flex items-center justify-center border border-slate-100"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
 
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(settings.promotions || []).map((promo: any, index: number) => (
                                <div key={index} className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 group relative">
                                    <button 
                                        onClick={() => removePromotion(index)}
                                        className="absolute top-4 right-4 p-2 bg-white text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-rose-500 hover:text-white z-10"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Title</label>
                                                <input 
                                                    type="text"
                                                    value={promo.title}
                                                    onChange={(e) => {
                                                        const p = [...settings.promotions];
                                                        p[index].title = e.target.value;
                                                        setSettings({...settings, promotions: p});
                                                    }}
                                                    className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-slate-950 transition-all"
                                                    placeholder="FLASH DEALS"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Color</label>
                                                <input 
                                                    type="color"
                                                    value={promo.color}
                                                    onChange={(e) => {
                                                        const p = [...settings.promotions];
                                                        p[index].color = e.target.value;
                                                        setSettings({...settings, promotions: p});
                                                    }}
                                                    className="w-full h-10 p-1 bg-white border border-slate-100 rounded-xl cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Subtitle</label>
                                            <input 
                                                type="text"
                                                value={promo.subtitle}
                                                onChange={(e) => {
                                                    const p = [...settings.promotions];
                                                    p[index].subtitle = e.target.value;
                                                    setSettings({...settings, promotions: p});
                                                }}
                                                className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-slate-950 transition-all"
                                                placeholder="70% OFF"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <input 
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
            />
        </div>
    );
}
