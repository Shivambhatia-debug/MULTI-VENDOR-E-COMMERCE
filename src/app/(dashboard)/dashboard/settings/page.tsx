"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import {
    Settings,
    Store,
    CreditCard,
    Bell,
    Shield,
    Globe,
    Mail,
    Phone,
    MapPin,
    Save,
    ChevronRight,
    Camera,
    Sparkles,
    ArrowRight,
    Zap,
    ShoppingBag,
    UserCircle
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMerchant } from "@/context/MerchantContext";

export default function SettingsPage() {
    const { user, activePlan, merchantInfo } = useMerchant();
    const [activeTab, setActiveTab] = useState("store");
    const [isSaving, setIsSaving] = useState(false);
    const [logoPreview, setLogoPreview] = useState(merchantInfo?.logo || "");
    const logoInputRef = useState<any>(null); // Using a simpler ref pattern or useRef
    const fileRef = useRef<HTMLInputElement>(null);

    const tabs = [
        { id: "store", label: "Store Info", icon: Store },
        { id: "billing", label: "Plan & Billing", icon: CreditCard },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Shield },
    ];

    const [formData, setFormData] = useState({
        name: merchantInfo?.name || "",
        business_type: merchantInfo?.business_type || "retail",
        description: merchantInfo?.description || "",
        email: merchantInfo?.email || "",
        phone: merchantInfo?.phone || "",
        address: merchantInfo?.address || ""
    });

    useEffect(() => {
        if (merchantInfo) {
            setFormData({
                name: merchantInfo.name || "",
                business_type: merchantInfo.business_type || "retail",
                description: merchantInfo.description || "",
                email: merchantInfo.email || "",
                phone: merchantInfo.phone || "",
                address: merchantInfo.address || ""
            });
            setLogoPreview(merchantInfo.logo || "");
        }
    }, [merchantInfo]);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API latency
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSaving(false);
        alert("Configuration Synchronized Successfully");
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />

            <main className="flex-1 p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                    <div>
                        <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tighter">System Control</h1>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">Global Configurations & Infrastructure</p>
                    </div>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`bg-slate-950 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl active:scale-95 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isSaving ? (
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Synchronizing...
                            </div>
                        ) : (
                            <>
                                <Save size={18} className="text-slate-400" />
                                Commit Changes
                            </>
                        )}
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Navigation Sidebar */}
                    <div className="w-full lg:w-72 shrink-0 space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all group ${activeTab === tab.id
                                    ? "bg-slate-950 text-white shadow-2xl translate-x-2"
                                    : "text-slate-400 hover:bg-slate-100 hover:text-slate-950"
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <tab.icon size={20} className={activeTab === tab.id ? "text-slate-300" : "text-slate-300 group-hover:text-slate-950 transition-colors"} />
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
                                </div>
                                <ChevronRight size={16} className={activeTab === tab.id ? "opacity-100" : "opacity-0"} />
                            </button>
                        ))}

                        {/* Upgrade CTA in Sidebar */}
                        <div className="mt-12 p-6 bg-slate-100/50 rounded-3xl border border-slate-200 border-dashed">
                            <Zap size={24} className="text-slate-300 mb-3" />
                            <p className="text-[10px] font-black text-slate-950 uppercase tracking-widest mb-1.5 leading-none">Enterprise Upgrade</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed mb-4">Unlock advanced API access & white-labeling.</p>
                            <Link href="/pricing" className="text-[10px] font-black text-slate-950 uppercase tracking-widest hover:underline flex items-center gap-2">Explore Tiers <ArrowRight size={12} /></Link>
                        </div>
                    </div>

                    {/* Command Surface */}
                    <div className="flex-1 max-w-4xl space-y-10">
                        {activeTab === 'store' && (
                            <>
                                {/* Store Information */}
                                <div className="card-saas p-6 md:p-10 border-slate-100/50 shadow-2xl bg-white rounded-[2rem]">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="h-6 w-1 bg-blue-600 rounded-full" />
                                        <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.3em]">Store Information</h3>
                                    </div>

                                    <div className="flex flex-col xl:flex-row gap-12 xl:gap-16">
                                        <div className="flex flex-col items-center gap-5">
                                            <input 
                                                type="file" 
                                                ref={fileRef}
                                                onChange={handleLogoUpload}
                                                className="hidden" 
                                                accept="image/*"
                                            />
                                            <div 
                                                onClick={() => fileRef.current?.click()}
                                                className="w-32 h-32 md:w-40 md:h-40 bg-slate-50 rounded-[2.5rem] md:rounded-[3rem] flex flex-col items-center justify-center border-2 border-slate-100 border-dashed relative group cursor-pointer overflow-hidden shadow-inner transition-all hover:border-blue-400 active:scale-95"
                                            >
                                                {logoPreview ? (
                                                    <Image src={logoPreview} alt="Logo" fill className="object-contain p-4" />
                                                ) : (
                                                    <Camera size={32} className="text-slate-300 group-hover:scale-110 group-hover:text-blue-600 transition-all duration-500" />
                                                )}
                                                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                    <span className="text-white text-[9px] font-black uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform">Change Logo</span>
                                                </div>
                                            </div>
                                            <p className="text-[8px] text-slate-400 text-center uppercase tracking-widest font-bold opacity-60">PNG, SVG or WEBP<br />MAX 2MB</p>
                                        </div>

                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Store Name</label>
                                                <input 
                                                    type="text" 
                                                    value={formData.name}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                    placeholder="Your Store Name" 
                                                    className="w-full bg-slate-50 border border-slate-100 p-4 md:p-5 rounded-2xl text-[11px] font-black text-slate-950 uppercase tracking-widest focus:bg-white focus:border-blue-400 outline-none transition-all shadow-sm" 
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Category</label>
                                                <select 
                                                    value={formData.business_type}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, business_type: e.target.value }))}
                                                    className="w-full bg-slate-50 border border-slate-100 p-4 md:p-5 rounded-2xl text-[11px] font-black text-slate-950 uppercase tracking-widest focus:bg-white focus:border-blue-400 outline-none transition-all appearance-none cursor-pointer shadow-sm"
                                                >
                                                    <option value="retail">Retail & E-commerce</option>
                                                    <option value="food">Food & Beverage</option>
                                                    <option value="lifestyle">Luxury Lifestyle</option>
                                                    <option value="tech">Technology</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-2 space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Store Description</label>
                                                <textarea 
                                                    rows={3} 
                                                    value={formData.description}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                                    className="w-full bg-slate-50 border border-slate-100 p-4 md:p-5 rounded-2xl text-[11px] font-black text-slate-950 uppercase tracking-widest focus:bg-white focus:border-blue-400 outline-none transition-all resize-none shadow-sm" 
                                                    placeholder="Tell customers about your brand..."
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Details */}
                                <div className="card-saas p-6 md:p-10 border-slate-100/50 shadow-2xl bg-white rounded-[2rem]">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="h-6 w-1 bg-blue-600 rounded-full" />
                                        <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.3em]">Contact Details</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-3">
                                                <Mail size={14} className="text-blue-500" />
                                                Support Email
                                            </label>
                                            <input 
                                                type="email" 
                                                value={formData.email}
                                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                                placeholder="support@yourstore.com" 
                                                className="w-full bg-slate-50 border border-slate-100 p-4 md:p-5 rounded-2xl text-[11px] font-black text-slate-950 uppercase tracking-widest focus:bg-white focus:border-blue-400 outline-none transition-all shadow-sm" 
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-3">
                                                <Phone size={14} className="text-blue-500" />
                                                Contact Phone
                                            </label>
                                            <input 
                                                type="text" 
                                                value={formData.phone}
                                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                                placeholder="+974 XXXX XXXX" 
                                                className="w-full bg-slate-50 border border-slate-100 p-4 md:p-5 rounded-2xl text-[11px] font-black text-slate-950 uppercase tracking-widest focus:bg-white focus:border-blue-400 outline-none transition-all shadow-sm" 
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-3">
                                                <MapPin size={14} className="text-blue-500" />
                                                Store Location
                                            </label>
                                            <input 
                                                type="text" 
                                                value={formData.address}
                                                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                                placeholder="Full business address" 
                                                className="w-full bg-slate-50 border border-slate-100 p-4 md:p-5 rounded-2xl text-[11px] font-black text-slate-950 uppercase tracking-widest focus:bg-white focus:border-blue-400 outline-none transition-all shadow-sm" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'billing' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="card-saas p-10 md:p-16 text-center border-slate-100 shadow-2xl relative overflow-hidden group bg-white rounded-[3rem]">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -mr-32 -mt-32" />
                                    
                                    <div className="w-24 h-24 bg-slate-950 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl mb-10 relative z-10">
                                        <CreditCard size={44} />
                                    </div>
                                    
                                    <div className="space-y-4 relative z-10">
                                        <div className="px-4 py-1 bg-green-500/10 text-green-600 text-[9px] font-black uppercase tracking-widest rounded-full w-fit mx-auto mb-4 border border-green-500/20">Active Infrastructure</div>
                                        <h3 className="text-3xl font-black text-slate-950 tracking-tighter uppercase">{activePlan || 'Mobile App'} Stack</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed">
                                            Your entity is currently operational on the <span className="text-slate-950 font-black">**{activePlan}**</span> protocol. 
                                            Next renewal cycle initializes on: <span className="text-blue-600 font-black">{user?.trial_end ? new Date(user.trial_end).toLocaleDateString() : 'Dec 2026'}</span>.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
                                        {[
                                            { label: 'API Calls', val: '8.4k/10k', color: 'bg-blue-600' },
                                            { label: 'Branches', val: '2/5', color: 'bg-slate-950' },
                                            { label: 'Uptime', val: '99.99%', color: 'bg-green-500' }
                                        ].map((stat, i) => (
                                            <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                                <p className="text-xs font-black text-slate-950 uppercase">{stat.val}</p>
                                                <div className="h-1 w-full bg-slate-200 rounded-full mt-3 overflow-hidden">
                                                    <div className={`h-full ${stat.color} w-3/4`} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap justify-center gap-4 mt-12">
                                        <button className="px-10 py-4 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl active:scale-95">Download Protocol Invoice</button>
                                        <Link href="/packages" className="px-10 py-4 bg-white border border-slate-200 text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-sm active:scale-95">Recalibrate Plan</Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="card-saas p-10 border-slate-100/50 shadow-2xl bg-white rounded-[2rem]">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="h-6 w-1 bg-blue-600 rounded-full" />
                                        <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.3em]">Notification Protocols</h3>
                                    </div>

                                    <div className="space-y-6">
                                        {[
                                            { id: 'orders', title: 'Order Real-time Alerts', desc: 'Notify when a new customer completes a transaction.', icon: ShoppingBag },
                                            { id: 'customers', title: 'Customer Engagement', desc: 'Alerts for new customer registrations and inquiries.', icon: UserCircle },
                                            { id: 'system', title: 'Infrastructure Updates', desc: 'Critical system maintenance and API status reports.', icon: Shield }
                                        ].map((n) => (
                                            <div key={n.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all group">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors shadow-sm">
                                                        <n.icon size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[11px] font-black text-slate-950 uppercase tracking-widest">{n.title}</h4>
                                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{n.desc}</p>
                                                    </div>
                                                </div>
                                                <div className="w-14 h-8 bg-blue-600 rounded-full relative p-1 cursor-pointer transition-all hover:scale-110 shadow-lg shadow-blue-500/20">
                                                    <div className="w-6 h-6 bg-white rounded-full ml-auto shadow-sm" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="card-saas p-10 border-slate-100/50 shadow-2xl bg-white rounded-[2rem]">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="h-6 w-1 bg-slate-950 rounded-full" />
                                        <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.3em]">Encryption Protocols</h3>
                                    </div>

                                    <div className="grid grid-cols-1 gap-8 max-w-xl">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                                            <input type="password" placeholder="••••••••••••" className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl text-[11px] font-black text-slate-950 uppercase tracking-widest focus:bg-white focus:border-slate-950 outline-none transition-all shadow-sm" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Command Password</label>
                                            <input type="password" placeholder="••••••••••••" className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl text-[11px] font-black text-slate-950 uppercase tracking-widest focus:bg-white focus:border-slate-950 outline-none transition-all shadow-sm" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Protocol Change</label>
                                            <input type="password" placeholder="••••••••••••" className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl text-[11px] font-black text-slate-950 uppercase tracking-widest focus:bg-white focus:border-slate-950 outline-none transition-all shadow-sm" />
                                        </div>
                                        <button className="w-fit px-10 py-4 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl active:scale-95 mt-4">Update Encryption Key</button>
                                    </div>

                                    <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-slate-100/80 transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-slate-950 transition-all shadow-sm">
                                                <Globe size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-[11px] font-black text-slate-950 uppercase tracking-widest">Two-Factor Authentication</h4>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Add an extra layer of security to your terminal.</p>
                                            </div>
                                        </div>
                                        <div className="w-14 h-8 bg-slate-200 rounded-full relative p-1 transition-all">
                                            <div className="w-6 h-6 bg-white rounded-full shadow-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
