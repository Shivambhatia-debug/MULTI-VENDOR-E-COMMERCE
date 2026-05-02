"use client";

import { useState, useEffect } from "react";
import { 
    Sparkles, Image as ImageIcon, Save, Plus, Trash2, 
    Layout, Type, Target, Loader2, CheckCircle2, AlertCircle
} from "lucide-react";

export default function AdminMarketplacePage() {
    const [settings, setSettings] = useState<any>({
        banners: [],
        announcement_ticker: "",
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
                if (res.ok) setSettings(await res.json());
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
                setMessage({ type: 'success', text: 'Marketplace settings synchronized successfully.' });
            } else {
                throw new Error("Failed to save");
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Operation failed. System engine rejected the update.' });
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tighter italic">Marketplace Logic</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60">Global frontend protocol management</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-8 py-4 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl flex items-center gap-3 disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    Synchronize Core
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-2xl border flex items-center gap-3 text-[10px] font-black uppercase tracking-widest ${
                    message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'
                }`}>
                    {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Global Announcement */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="card-saas p-8 bg-white shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-slate-950 text-white rounded-xl"><Type size={16} /></div>
                            <h3 className="text-xs font-black text-slate-950 uppercase tracking-widest">Protocol Ticker</h3>
                        </div>
                        <p className="text-[10px] text-slate-400 mb-4 font-bold uppercase tracking-widest">Global Announcement Bar Text</p>
                        <textarea 
                            value={settings.announcement_ticker}
                            onChange={(e) => setSettings({...settings, announcement_ticker: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-slate-950 transition-all min-h-[120px]"
                            placeholder="ENTER GLOBAL MESSAGE..."
                        />
                    </div>

                    <div className="card-saas p-8 bg-slate-950 text-white shadow-2xl overflow-hidden relative group">
                         <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
                         <div className="relative z-10">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3">Live Evolution</h3>
                            <p className="text-[10px] text-slate-400 leading-relaxed">Any changes made here will reflect immediately across all public marketplace interfaces.</p>
                         </div>
                    </div>
                </div>

                {/* Banner Management */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card-saas p-8 bg-white shadow-xl">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-950 text-white rounded-xl"><ImageIcon size={16} /></div>
                                <h3 className="text-xs font-black text-slate-950 uppercase tracking-widest">Hero Banners</h3>
                            </div>
                            <button 
                                onClick={addBanner}
                                className="p-2.5 bg-slate-50 hover:bg-slate-950 hover:text-white rounded-xl transition-all text-slate-400 shadow-sm"
                            >
                                <Plus size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {settings.banners.map((banner: any, index: number) => (
                                <div key={index} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group relative">
                                    <button 
                                        onClick={() => removeBanner(index)}
                                        className="absolute top-4 right-4 p-2 bg-white text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-rose-500 hover:text-white"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Banner Title</label>
                                                <input 
                                                    type="text"
                                                    value={banner.title}
                                                    onChange={(e) => {
                                                        const b = [...settings.banners];
                                                        b[index].title = e.target.value;
                                                        setSettings({...settings, banners: b});
                                                    }}
                                                    className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-slate-950 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Destination URL</label>
                                                <input 
                                                    type="text"
                                                    value={banner.link}
                                                    onChange={(e) => {
                                                        const b = [...settings.banners];
                                                        b[index].link = e.target.value;
                                                        setSettings({...settings, banners: b});
                                                    }}
                                                    className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-[10px] font-black tracking-widest outline-none focus:ring-2 focus:ring-slate-950 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Image URL</label>
                                                <input 
                                                    type="text"
                                                    value={banner.image_url}
                                                    onChange={(e) => {
                                                        const b = [...settings.banners];
                                                        b[index].image_url = e.target.value;
                                                        setSettings({...settings, banners: b});
                                                    }}
                                                    className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-[10px] font-black tracking-widest outline-none focus:ring-2 focus:ring-slate-950 transition-all"
                                                />
                                            </div>
                                            <div className="h-20 bg-white rounded-2xl border border-dashed border-slate-200 overflow-hidden">
                                                {banner.image_url ? (
                                                    <img src={banner.image_url} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-200"><ImageIcon size={24} /></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {settings.banners.length === 0 && (
                                <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                                    <Layout className="mx-auto text-slate-100 mb-4" size={48} />
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No active banners in rotation</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
