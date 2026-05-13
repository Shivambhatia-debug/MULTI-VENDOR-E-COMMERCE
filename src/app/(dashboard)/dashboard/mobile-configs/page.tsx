"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { 
    Smartphone, Layout, Bell, Palette, Upload, CheckCircle2, 
    Lock, ArrowUpRight, User, Save, RefreshCcw, Loader2,
    Home, ShoppingBag, Heart, Settings as SettingsIcon,
    Zap, Shield, Sparkles, ChevronRight, Star, Plus,
    Search, Grid, UserCircle
} from "lucide-react";
import Image from "next/image";
import { useMerchant } from "@/context/MerchantContext";
import { useRouter } from "next/navigation";

export default function MobileConfigsPage() {
    const router = useRouter();
    const { activePlan, merchantInfo } = useMerchant();

    // Custom Animation Keyframes
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes pulse-subtle {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.85; transform: scale(0.98); }
            }
            @keyframes progress-fast {
                0% { width: 0%; transform: translateX(-100%); }
                100% { width: 100%; transform: translateX(0%); }
            }
            .animate-pulse-subtle {
                animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            .animate-progress-fast {
                animation: progress-fast 1.5s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);
        return () => { document.head.removeChild(style); };
    }, []);
    const [config, setConfig] = useState<any>({
        primary_color: "#2563EB",
        accent_color: "#0F172A",
        logo_url: null,
        notifications_enabled: true,
        theme: "modern"
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const [originalConfig, setOriginalConfig] = useState<any>(null);
    const [activeScreen, setActiveScreen] = useState(0);
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveScreen((prev) => (prev + 1) % 4);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("golalita_token");
                
                // Fetch Config
                const configRes = await fetch("/api/python/store-config", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (configRes.ok) {
                    const data = await configRes.json();
                    if (data.mobile_config) {
                        setConfig(data.mobile_config);
                        setOriginalConfig(data.mobile_config);
                    }
                }

                // Fetch Products
                const productRes = await fetch("/api/python/products", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (productRes.ok) {
                    const data = await productRes.json();
                    setProducts(data.slice(0, 6)); // Get first 6 products
                }
            } catch (err) {
                console.error("DATA_FETCH_ERROR:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setConfig(prev => ({ ...prev, logo_url: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem("golalita_token");
            const getRes = await fetch("/api/python/store-config", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            
            if (getRes.ok) {
                const fullConfig = await getRes.json();
                const updatedConfig = {
                    ...fullConfig,
                    mobile_config: config
                };

                const saveRes = await fetch("/api/python/store-config/save", {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedConfig)
                });

                if (saveRes.ok) {
                    setOriginalConfig(config);
                    alert("System preferences synchronized across all native nodes.");
                }
            }
        } catch (err) {
            console.error("SAVE_ERROR:", err);
        } finally {
            setIsSaving(false);
        }
    };

    const hasChanges = JSON.stringify(config) !== JSON.stringify(originalConfig);

    // Theme Style Mapper
    const getThemeStyles = () => {
        const theme = config?.theme || 'modern';
        switch (theme) {
            case 'minimal':
                return {
                    radius: 'rounded-[2rem]',
                    cardRadius: 'rounded-[1.5rem]',
                    innerRadius: 'rounded-[1rem]',
                    font: 'font-sans',
                    border: 'border-slate-50',
                    shadow: 'shadow-sm'
                };
            case 'bold':
                return {
                    radius: 'rounded-none',
                    cardRadius: 'rounded-none',
                    innerRadius: 'rounded-none',
                    font: 'font-black uppercase tracking-tighter',
                    border: 'border-slate-900 border-2',
                    shadow: 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                };
            default: // modern
                return {
                    radius: 'rounded-[3rem]',
                    cardRadius: 'rounded-[2rem]',
                    innerRadius: 'rounded-xl',
                    font: 'font-bold',
                    border: 'border-slate-100',
                    shadow: 'shadow-xl shadow-slate-900/5'
                };
        }
    };

    const t = getThemeStyles();

    // Mockup Screen Components
    const MockupScreens = [
        // SPLASH SCREEN
        <div key="splash" className={`h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-1000`} style={{ backgroundColor: config?.primary_color }}>
            <div className={`w-24 h-24 ${t.cardRadius} bg-white shadow-2xl flex items-center justify-center p-4 relative overflow-hidden animate-bounce-slow`}>
                <Image src={config?.logo_url || "/web background/web background/logo 2 png.png"} alt="Logo" fill className="object-contain p-4" />
            </div>
            <div className="mt-8 flex flex-col items-center gap-3">
                <h2 className="text-white text-lg font-black uppercase tracking-tighter">{merchantInfo?.name || 'Loading Store...'}</h2>
                <div className="w-12 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white animate-progress-fast" />
                </div>
            </div>
        </div>,

        // HOME SCREEN
        <div key="home" className={`h-full bg-white flex flex-col animate-in fade-in slide-in-from-right-4 duration-700 ${t.font}`}>
            <div className={`pt-12 px-6 pb-4 flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-20`}>
                <div className={`w-8 h-8 ${t.innerRadius} bg-slate-50 flex items-center justify-center relative border ${t.border} overflow-hidden`}>
                    <Image src={config?.logo_url || "/web background/web background/logo 2 png.png"} alt="Logo" fill className="object-contain p-1.5" />
                </div>
                <div className="flex gap-2">
                    <div className={`w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400`}><ShoppingBag size={14} /></div>
                    <div className={`w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400`}><Bell size={14} /></div>
                </div>
            </div>
            <div className="p-6 space-y-8 overflow-y-auto max-h-[calc(100%-80px)] no-scrollbar">
                {/* Hero Banner */}
                <div className={`h-36 w-full ${t.cardRadius} p-6 relative overflow-hidden ${t.shadow}`} style={{ backgroundColor: config?.accent_color }}>
                    <div className="absolute right-0 top-0 w-32 h-32 rounded-full blur-3xl opacity-30" style={{ backgroundColor: config?.primary_color }} />
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <p className="text-[7px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">Official Store</p>
                            <h4 className="text-sm font-black text-white uppercase tracking-tighter leading-none mb-3">{merchantInfo?.name || 'Store Name'}</h4>
                        </div>
                        <button className={`w-fit px-5 py-2 ${t.innerRadius} text-[8px] font-black uppercase tracking-widest text-white shadow-lg transition-transform active:scale-90`} style={{ backgroundColor: config?.primary_color }}>Shop Now</button>
                    </div>
                </div>

                {/* Discover Categories */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h5 className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Categories</h5>
                        <span className="text-[7px] font-bold text-blue-600 uppercase">View All</span>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {['New', 'Hot', 'Sale', 'Top'].map((cat, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <div className={`w-full aspect-square ${t.innerRadius} bg-slate-50 border ${t.border} flex items-center justify-center text-slate-400 group-hover:bg-white transition-colors`}>
                                    {i === 0 ? <Sparkles size={14} /> : i === 1 ? <Zap size={14} /> : i === 2 ? <ShoppingBag size={14} /> : <Star size={14} />}
                                </div>
                                <span className="text-[7px] font-black text-slate-900 uppercase tracking-tighter">{cat}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trending Section */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h5 className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Selected for You</h5>
                    </div>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                        {products.length > 0 ? products.slice(0, 4).map((p, i) => (
                            <div key={i} className="shrink-0 w-36 space-y-3">
                                <div className={`aspect-[4/5] w-full ${t.innerRadius} bg-slate-50 border ${t.border} overflow-hidden relative shadow-sm`}>
                                    {p.image && <Image src={p.image} alt={p.name} fill className="object-cover" />}
                                    <div className="absolute top-2 right-2 w-6 h-6 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-rose-500"><Heart size={10} /></div>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-slate-900 uppercase truncate leading-none mb-1">{p.name}</p>
                                    <p className="text-[7px] font-bold text-blue-600 uppercase">{p.price} QAR</p>
                                </div>
                            </div>
                        )) : [1,2].map(i => (
                            <div key={i} className="shrink-0 w-36 h-48 bg-slate-50 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                </div>

                {/* Promo Card */}
                <div className={`h-28 w-full ${t.cardRadius} bg-slate-950 p-5 flex justify-between items-center relative overflow-hidden`}>
                    <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-transparent z-0" />
                    <div className="space-y-1.5 relative z-10">
                        <p className="text-[7px] font-black text-blue-400 uppercase tracking-[0.3em]">Special Protocol</p>
                        <p className="text-[11px] font-black text-white uppercase tracking-tight leading-none">Flash Sale<br/>Live Now</p>
                    </div>
                    <div className={`w-10 h-10 ${t.innerRadius} bg-white/10 flex items-center justify-center text-white backdrop-blur-md relative z-10`}><Zap size={18} /></div>
                </div>
            </div>
        </div>,
        
        // SHOP SCREEN
        <div key="shop" className={`h-full bg-slate-50 flex flex-col animate-in fade-in slide-in-from-right-4 duration-700 ${t.font}`}>
            <div className="pt-12 px-6 pb-6 bg-white border-b border-slate-100">
                <div className="flex justify-between items-center">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Marketplace</h4>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><Search size={14} /></div>
                </div>
                <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
                    {['All', 'Trending', 'New', 'Featured'].map((tag, i) => (
                        <span key={i} className={`px-4 py-1.5 ${t.innerRadius} text-[8px] font-black uppercase tracking-widest ${i === 0 ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-400'}`}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
                {products.length > 0 ? products.map((p, i) => (
                    <div key={i} className={`bg-white ${t.innerRadius} p-3 border ${t.border} ${t.shadow} space-y-2`}>
                        <div className={`aspect-square bg-slate-50 ${t.innerRadius} relative overflow-hidden`}>
                            {p.image && <Image src={p.image} alt={p.name} fill className="object-cover" />}
                            <div className="absolute top-2 right-2 w-6 h-6 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-rose-500 shadow-sm"><Heart size={10} /></div>
                        </div>
                        <p className="text-[9px] font-black text-slate-900 uppercase truncate leading-none">{p.name}</p>
                        <div className="flex justify-between items-center pt-1">
                            <span className="text-[9px] font-black tracking-tight" style={{ color: config?.primary_color }}>{p.price} QAR</span>
                            <div className={`w-5 h-5 ${t.innerRadius} flex items-center justify-center text-white`} style={{ backgroundColor: config?.accent_color }}><Plus size={10} /></div>
                        </div>
                    </div>
                )) : [1,2,3,4].map(i => (
                    <div key={i} className="aspect-square bg-white rounded-xl animate-pulse" />
                ))}
            </div>
        </div>,

        // PRODUCT DETAIL
        <div key="product" className={`h-full bg-white flex flex-col animate-in fade-in slide-in-from-right-4 duration-700 ${t.font}`}>
            <div className={`relative aspect-[4/5] bg-slate-50`}>
                {products[0]?.image && <Image src={products[0].image} alt="Featured" fill className="object-cover" />}
                <div className="absolute top-12 left-6 right-6 flex justify-between z-10">
                    <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-900"><ChevronRight size={14} className="rotate-180" /></div>
                    <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-900"><Heart size={14} /></div>
                </div>
            </div>
            <div className={`flex-1 -mt-6 bg-white ${t.cardRadius} shadow-2xl p-8 space-y-6 relative z-10 border-t ${t.border}`}>
                <div className="flex justify-between items-start">
                    <div className="flex-1 mr-4">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tighter mb-1 truncate">{products[0]?.name || 'Premium Item'}</h4>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Stock: Verified Available</p>
                    </div>
                    <div className={`flex items-center gap-1 bg-emerald-50 px-2 py-1 ${t.innerRadius}`}>
                        <Star size={10} className="fill-emerald-500 text-emerald-500" />
                        <span className="text-[9px] font-black text-emerald-600">5.0</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    {['X', 'Y', 'Z'].map(size => (
                        <div key={size} className={`w-8 h-8 ${t.innerRadius} border flex items-center justify-center text-[9px] font-bold ${size === 'X' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 text-slate-400'}`}>
                            {size}
                        </div>
                    ))}
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium line-clamp-3">
                    {products[0]?.description || 'Experience the future of native e-commerce with our precision-engineered core components. Fully optimized for high-fidelity rendering and real-time synchronization.'}
                </p>
                <div className="pt-4 flex items-center gap-4">
                    <div className={`flex-1 h-12 ${t.innerRadius} flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest shadow-xl`} style={{ backgroundColor: config?.primary_color }}>
                        Add To Cart
                    </div>
                    <div className={`w-12 h-12 ${t.innerRadius} border ${t.border} flex items-center justify-center text-slate-900 shadow-sm`}><ShoppingBag size={18} /></div>
                </div>
            </div>
        </div>,

        // PROFILE SCREEN
        <div key="profile" className={`h-full bg-slate-50 flex flex-col animate-in fade-in slide-in-from-right-4 duration-700 ${t.font}`}>
            <div className={`pt-16 pb-8 px-8 bg-white flex flex-col items-center text-center ${t.shadow}`}>
                <div className={`w-20 h-20 ${t.cardRadius} bg-slate-950 flex items-center justify-center text-white mb-4 relative shadow-xl overflow-hidden`}>
                    <UserCircle size={40} className="text-blue-400" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: config?.primary_color }}><CheckCircle2 size={12} /></div>
                </div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Native Account</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Authorized Node 001</p>
                <div className={`grid grid-cols-3 gap-6 mt-6 w-full max-w-xs p-4 bg-slate-50 ${t.innerRadius} border ${t.border}`}>
                    <div className="flex flex-col items-center">
                        <span className="text-[11px] font-black text-slate-900">{products.length}</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Items</span>
                    </div>
                    <div className="flex flex-col items-center border-x border-slate-200 px-4">
                        <span className="text-[11px] font-black text-slate-900">4.8</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Rating</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[11px] font-black text-slate-900">24</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Reviews</span>
                    </div>
                </div>
            </div>
            <div className="p-6 space-y-3">
                {[
                    { icon: ShoppingBag, label: 'Order History' },
                    { icon: Heart, label: 'Wishlist Protocol' },
                    { icon: Shield, label: 'Security & Access' }
                ].map((item, i) => (
                    <div key={i} className={`bg-white p-4 ${t.innerRadius} flex items-center justify-between border ${t.border} ${t.shadow} group hover:border-blue-100 transition-all`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 ${t.innerRadius} bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors`}>
                                <item.icon size={18} />
                            </div>
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{item.label}</span>
                        </div>
                        <ChevronRight size={14} className="text-slate-300" />
                    </div>
                ))}
                <div className={`mt-4 p-4 border border-dashed border-slate-200 ${t.innerRadius} flex flex-col items-center gap-2`}>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Connected to {merchantInfo?.name || 'Native Node'}</p>
                </div>
            </div>
        </div>
    ];

    if (activePlan !== "Mobile App" && activePlan !== "Enterprise") {
        return (
            <div className="min-h-screen bg-slate-50 flex">
                <Sidebar />
                <main className="flex-1 p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
                        <Lock size={40} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Mobile App Tier Required</h1>
                    <p className="text-slate-500 max-w-md mb-8">
                        The Native Mobile App management dashboard is exclusively available for the **Mobile App** or **Enterprise** plan subscribers.
                    </p>
                    <button className="btn-primary px-8 py-3 uppercase tracking-widest text-[10px]">Upgrade to Mobile App Tier</button>
                </main>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex">
                <Sidebar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Configuration...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
            <Sidebar />
            <main className="flex-1 p-4 md:p-6 lg:p-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/40 via-transparent to-transparent">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-slate-950 rounded-2xl flex items-center justify-center text-white shadow-2xl">
                                <Smartphone size={20} />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tighter uppercase italic">App Settings</h1>
                        </div>
                        <p className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] ml-1 opacity-60">Manage your Mobile App Appearance</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 bg-white/80 backdrop-blur-xl border border-slate-100 p-2 rounded-2xl md:rounded-[2rem] shadow-2xl shadow-blue-900/5">
                        <div className="flex items-center gap-2 bg-slate-950 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-[1.5rem]">
                            <Layout size={14} className="text-blue-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Active Plan</span>
                        </div>
                        <div className="hidden md:block h-6 w-px bg-slate-100 mx-2" />
                        <div className="pr-4 md:pr-6">
                            <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">App Status</p>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[9px] md:text-[10px] font-black text-slate-950 uppercase tracking-tighter">Live & Running</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Left Column: Configuration */}
                    <div className="xl:col-span-7 space-y-8 md:space-y-10">
                        
                        {/* Theme Selection */}
                        <section className="relative">
                            <div className="card-saas p-6 md:p-10 border-slate-100 shadow-2xl shadow-slate-900/5 bg-white/70 backdrop-blur-xl">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xs md:text-sm font-black text-slate-950 uppercase tracking-[0.2em] flex items-center gap-3">
                                        <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                            <Sparkles size={16} />
                                        </div>
                                        Choose App Theme
                                    </h3>
                                    <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-slate-100">Step 1</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[
                                        { id: 'modern', label: 'Modern', icon: Zap, desc: 'Clean & Rounded' },
                                        { id: 'minimal', label: 'Minimal', icon: Shield, desc: 'Simple & Elegant' },
                                        { id: 'bold', label: 'Bold', icon: ArrowUpRight, desc: 'High Contrast' }
                                    ].map((theme) => (
                                        <button 
                                            key={theme.id}
                                            onClick={() => setConfig(prev => ({...prev, theme: theme.id}))}
                                            className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden group active:scale-95 hover:scale-[1.02] ${config?.theme === theme.id ? 'border-slate-950 bg-slate-950 text-white shadow-xl' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                        >
                                            <div className={`absolute -right-2 -bottom-2 w-16 h-16 rounded-full blur-2xl opacity-10 ${config?.theme === theme.id ? 'bg-blue-400' : 'bg-slate-900'}`} />
                                            <theme.icon size={18} className={`mb-3 ${config?.theme === theme.id ? 'text-blue-400' : 'text-slate-400'}`} />
                                            <p className="text-[10px] font-black uppercase tracking-tight mb-1">{theme.label}</p>
                                            <p className={`text-[8px] font-bold uppercase tracking-widest opacity-60`}>{theme.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Visual Identity Section */}
                        <section className="relative group">
                            <div className="card-saas p-6 md:p-10 border-slate-100 shadow-2xl shadow-slate-900/5 bg-white/70 backdrop-blur-xl">
                                <div className="flex items-center justify-between mb-8 md:mb-10">
                                    <h3 className="text-xs md:text-sm font-black text-slate-950 uppercase tracking-[0.2em] flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                            <Palette size={16} />
                                        </div>
                                        Colors & Branding
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        {hasChanges && (
                                            <button 
                                                onClick={() => setConfig(originalConfig)}
                                                className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-600 flex items-center gap-1.5 active:scale-95 transition-all"
                                            >
                                                <RefreshCcw size={12} /> Reset
                                            </button>
                                        )}
                                        <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-slate-100">Step 2</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <div className="w-1 h-1 bg-blue-500 rounded-full" />
                                            Primary Color
                                        </label>
                                        <div className="relative group/color">
                                            <input 
                                                type="color" 
                                                value={config?.primary_color}
                                                onChange={(e) => setConfig(prev => ({...prev, primary_color: e.target.value}))}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                            />
                                            <div className="relative flex items-center justify-between p-4 md:p-5 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 transition-all shadow-sm">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl shadow-xl border-2 border-white" style={{ backgroundColor: config?.primary_color }} />
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] md:text-[11px] font-black text-slate-950 tracking-tighter uppercase">Brand Color</span>
                                                        <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest">{config?.primary_color}</span>
                                                    </div>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                                    <Layout size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <div className="w-1 h-1 bg-slate-950 rounded-full" />
                                            Accent Color
                                        </label>
                                        <div className="relative group/color">
                                            <input 
                                                type="color" 
                                                value={config?.accent_color}
                                                onChange={(e) => setConfig(prev => ({...prev, accent_color: e.target.value}))}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                            />
                                            <div className="relative flex items-center justify-between p-4 md:p-5 bg-white border border-slate-100 rounded-2xl hover:border-slate-950 transition-all shadow-sm">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl shadow-xl border-2 border-white" style={{ backgroundColor: config?.accent_color }} />
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] md:text-[11px] font-black text-slate-950 tracking-tighter uppercase">Secondary Color</span>
                                                        <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest">{config?.accent_color}</span>
                                                    </div>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                                    <Layout size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">App Logo (Splash Screen)</label>
                                    <input 
                                        type="file" 
                                        ref={logoInputRef}
                                        onChange={handleLogoUpload}
                                        className="hidden" 
                                        accept="image/*"
                                    />
                                    <div className="relative group/upload">
                                        <div 
                                            onClick={() => logoInputRef.current?.click()}
                                            className="relative h-40 md:h-48 border-2 border-dashed border-slate-200 rounded-2xl md:rounded-[2rem] p-6 md:p-10 flex flex-col items-center justify-center bg-slate-50/30 hover:bg-white hover:border-blue-400 transition-all cursor-pointer group/box active:scale-[0.98]"
                                        >
                                            {config?.logo_url ? (
                                                <div className="relative w-full h-full">
                                                    <Image src={config.logo_url} alt="Logo Preview" fill className="object-contain" />
                                                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/box:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Change Image</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-slate-300 group-hover/box:text-blue-500 group-hover/box:scale-110 transition-all duration-500 relative z-10 border border-slate-100">
                                                        <Upload size={24} />
                                                    </div>
                                                    <div className="mt-4 md:mt-6 text-center relative z-10">
                                                        <p className="text-[10px] md:text-[11px] font-black text-slate-950 uppercase tracking-widest">Upload Store Logo</p>
                                                        <p className="text-[8px] md:text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-tight">PNG or SVG (Max 2MB)</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Broadcast Relay Section */}
                        <section className="relative">
                            <div className="card-saas p-6 md:p-10 border-slate-100 shadow-2xl shadow-slate-900/5 bg-white/70 backdrop-blur-xl">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                    <h3 className="text-xs md:text-sm font-black text-slate-950 uppercase tracking-[0.2em] flex items-center gap-3">
                                        <div className="w-8 h-8 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                                            <Bell size={16} />
                                        </div>
                                        Push Notifications
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Service Active</span>
                                        <button 
                                            onClick={() => setConfig(prev => ({...prev, notifications_enabled: !prev?.notifications_enabled}))}
                                            className={`w-12 h-6 rounded-full relative transition-all duration-500 ${config?.notifications_enabled ? 'bg-blue-600' : 'bg-slate-200'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-500 ${config?.notifications_enabled ? 'left-7 shadow-lg' : 'left-1'}`} />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className={`flex flex-col sm:flex-row items-center justify-between p-6 border rounded-[2rem] relative overflow-hidden group transition-all duration-500 ${config?.notifications_enabled ? 'bg-gradient-to-br from-emerald-50 to-teal-50/30 border-emerald-100/50' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                                        <div className="flex items-center gap-5 relative z-10">
                                            <div className={`w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-emerald-50 ${config?.notifications_enabled ? 'text-emerald-500' : 'text-slate-300'}`}>
                                                <CheckCircle2 size={24} />
                                            </div>
                                            <div className="text-center sm:text-left mt-4 sm:mt-0">
                                                <p className="text-[10px] md:text-xs font-black text-slate-950 uppercase tracking-tight">Notification System</p>
                                                <p className="text-[9px] md:text-[10px] font-bold text-slate-500 mt-1">{config?.notifications_enabled ? 'Service is Online' : 'Service is Disabled'}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center sm:items-end gap-2 mt-6 sm:mt-0 relative z-10">
                                            <span className={`text-[8px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest ${config?.notifications_enabled ? 'text-emerald-600 bg-white border border-emerald-100' : 'text-slate-400 bg-slate-100 border-slate-200'}`}>
                                                {config?.notifications_enabled ? 'Verified' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={handleSave}
                                        disabled={!hasChanges || isSaving}
                                        className={`w-full group relative overflow-hidden py-4 md:py-5 text-white rounded-[1.5rem] text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 ${hasChanges ? 'bg-blue-600 shadow-blue-500/20 animate-pulse-subtle' : 'bg-slate-950 shadow-slate-900/20'} disabled:opacity-40 disabled:animate-none`}
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-opacity duration-500 ${hasChanges ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                                        <span className="relative z-10 flex items-center justify-center gap-3">
                                            {isSaving ? (
                                                <>
                                                    <Loader2 size={16} className="animate-spin" />
                                                    Saving Changes...
                                                </>
                                            ) : (
                                                <>
                                                    {hasChanges ? 'Deploy Changes to App' : 'Save All Configuration'}
                                                    <Save size={16} />
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: High-Fidelity Multi-Screen Mockup */}
                    <div className="xl:col-span-5 flex flex-col items-center sticky top-10">
                        <div className="relative w-full max-w-[320px] md:max-w-[380px] group/phone">
                            {/* Glow Effects */}
                            <div className="absolute -inset-10 bg-blue-500/10 rounded-full blur-[100px] opacity-50 group-hover/phone:opacity-100 transition-opacity duration-1000" />

                            {/* Phone Case */}
                            <div className={`relative bg-slate-950 p-3 md:p-4 shadow-2xl border border-slate-800/50 backdrop-blur-3xl transform transition-all duration-700 ${config?.theme === 'minimal' ? 'rounded-[3rem] md:rounded-[5rem]' : 'rounded-[3rem] md:rounded-[4rem]'}`}>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 md:w-32 h-4 md:h-6 bg-slate-950 rounded-b-3xl z-30" />
                                
                                <div className={`overflow-hidden relative shadow-inner ring-1 ring-slate-900/5 ${config?.theme === 'minimal' ? 'rounded-[2.5rem] md:rounded-[4.2rem]' : 'rounded-[2.5rem] md:rounded-[3.2rem]'}`} style={{ aspectRatio: '9/19' }}>
                                    
                                    {/* Mockup Screens Container */}
                                    <div className="h-full w-full">
                                        {MockupScreens[activeScreen]}
                                    </div>

                                    {/* Tactical Tab Bar */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-white/90 backdrop-blur-xl border-t border-slate-50 flex justify-between items-center z-20">
                                        <button onClick={() => setActiveScreen(1)} className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 active:scale-90 ${activeScreen === 1 ? 'text-white shadow-lg' : 'text-slate-300 hover:bg-slate-50'}`} style={{ backgroundColor: activeScreen === 1 ? config?.primary_color : 'transparent', boxShadow: activeScreen === 1 ? `0 8px 20px ${config?.primary_color}40` : 'none' }}>
                                            <Home size={activeScreen === 1 ? 20 : 18} />
                                        </button>
                                        <button onClick={() => setActiveScreen(2)} className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 active:scale-90 ${activeScreen === 2 ? 'text-white shadow-lg' : 'text-slate-300 hover:bg-slate-50'}`} style={{ backgroundColor: activeScreen === 2 ? config?.primary_color : 'transparent', boxShadow: activeScreen === 2 ? `0 8px 20px ${config?.primary_color}40` : 'none' }}>
                                            <ShoppingBag size={activeScreen === 2 ? 20 : 18} />
                                        </button>
                                        <button onClick={() => setActiveScreen(3)} className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 active:scale-90 ${activeScreen === 3 ? 'text-white shadow-lg' : 'text-slate-300 hover:bg-slate-50'}`} style={{ backgroundColor: activeScreen === 3 ? config?.primary_color : 'transparent', boxShadow: activeScreen === 3 ? `0 8px 20px ${config?.primary_color}40` : 'none' }}>
                                            <Sparkles size={activeScreen === 3 ? 20 : 18} />
                                        </button>
                                        <button onClick={() => setActiveScreen(4)} className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 active:scale-90 ${activeScreen === 4 ? 'text-white shadow-lg' : 'text-slate-300 hover:bg-slate-50'}`} style={{ backgroundColor: activeScreen === 4 ? config?.primary_color : 'transparent', boxShadow: activeScreen === 4 ? `0 8px 20px ${config?.primary_color}40` : 'none' }}>
                                            <User size={activeScreen === 4 ? 20 : 18} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Annotation Cards */}
                            <div className="hidden sm:block absolute -right-6 md:-right-12 top-1/4 bg-white/90 backdrop-blur-2xl p-4 md:p-6 rounded-[2rem] shadow-2xl border border-white/40 max-w-[140px] md:max-w-[160px] animate-bounce-slow">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: config?.primary_color }} />
                                    <p className="text-[10px] font-black text-slate-950 uppercase tracking-widest leading-none">Live Preview</p>
                                </div>
                                <p className="text-[8px] md:text-[9px] text-slate-500 font-bold leading-relaxed uppercase tracking-tight">
                                    {activeScreen === 0 ? 'Home Screen' : activeScreen === 1 ? 'Shop Page' : activeScreen === 2 ? 'Product Page' : 'Profile Page'}
                                </p>
                            </div>
                        </div>

                        {/* Screen Pagination Dots */}
                        <div className="flex gap-2 mt-8">
                            {[0,1,2,3,4].map(i => (
                                <button key={i} onClick={() => setActiveScreen(i)} className={`h-1.5 rounded-full transition-all duration-500 ${activeScreen === i ? 'w-8' : 'w-2 bg-slate-300'}`} style={{ backgroundColor: activeScreen === i ? config?.primary_color : undefined }} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
