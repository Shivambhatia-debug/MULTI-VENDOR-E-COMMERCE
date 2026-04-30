"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import {
    CheckCircle2,
    Sliders,
    ExternalLink,
    Store,
    Layout,
    Type,
    Palette,
    Smartphone,
    Monitor,
    Globe,
    ShieldCheck,
    RotateCcw,
    Eye,
    Save,
    Image as ImageIcon,
    ArrowRight,
    Sparkles,
    Zap,
    ShoppingCart,
    Camera,
    FolderHeart,
    ChevronRight,
    PaintBucket,
    Plus,
    Megaphone,
    Menu,
    Columns,
    Maximize,
    AlignCenter,
    Tally4,
    LayoutGrid,
    Type as TypeIcon,
    Palette as PaletteIcon,
    Box,
    Minus,
    ArrowUpRight,
    Circle,
    Square,
    Component
} from "lucide-react";
import { useState } from "react";

export default function CustomizerEditorialPage() {
    // UI State
    const [viewMode, setViewMode] = useState("desktop");
    const [previewPage, setPreviewPage] = useState("home");
    const [heroLayout, setHeroLayout] = useState("split");
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState<any[]>([]);

    // Color State - Defaulting to Professional Blue/White
    const [primaryColor, setPrimaryColor] = useState("#2563eb");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [textColor, setTextColor] = useState("#0f172a");
    const [accentColor, setAccentColor] = useState("#3b82f6");

    // Content State - Hero
    const [storeName, setStoreName] = useState("LUXE.");
    const [bannerTitle, setBannerTitle] = useState("EVOLVE YOUR IDENTITY.");
    const [bannerSubtitle, setBannerSubtitle] = useState("High-performance retail engine for modern brands.");
    const [bannerBtn, setBannerBtn] = useState("Shop Collection");
    const [heroImage, setHeroImage] = useState("https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop");

    // Content State - Discovery
    const [discoveryTitle, setDiscoveryTitle] = useState("New Arrivals");
    const [discoverySubtitle, setDiscoverySubtitle] = useState("Curated essentials for the modern lifestyle.");

    // Offer Ticker State
    const [tickerText, setTickerText] = useState("⚡ FLASH SALE: 50% OFF ALL ITEMS ⚡ LIMITED EDITION RELEASES ⚡ GLOBAL SHIPPING AVAILABLE ⚡");
    const [tickerColor, setTickerColor] = useState("#2563eb");
    const [showTicker, setShowTicker] = useState(true);

    // Asset Library
    const [customImageUrl, setCustomImageUrl] = useState("");
    const [heroLibrary, setHeroLibrary] = useState([
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200",
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200",
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200",
        "https://images.unsplash.com/photo-1540959733332-e94e270b4052?q=80&w=1200"
    ]);

    const handleAddAsset = () => {
        if (customImageUrl && !heroLibrary.includes(customImageUrl)) {
            setHeroLibrary([customImageUrl, ...heroLibrary]);
            setHeroImage(customImageUrl);
            setCustomImageUrl("");
        }
    };

    const addToCart = (product: any) => {
        setCartItems([...cartItems, product]);
        setIsCartOpen(true);
    };

    const removeFromCart = (index: number) => {
        const newItems = [...cartItems];
        newItems.splice(index, 1);
        setCartItems(newItems);
    };

    const isMobile = viewMode === 'mobile';

    const layoutPresets = [
        { id: 'modern', icon: Component, label: 'Modern' },
        { id: 'split', icon: Columns, label: 'Split' },
        { id: 'overlay', icon: Maximize, label: 'Overlay' },
        { id: 'minimal', icon: Minus, label: 'Minimal' },
        { id: 'sidebar', icon: Tally4, label: 'Panel' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />

            <main className="flex-1 p-4 lg:p-8 overflow-hidden flex flex-col">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                            <Sparkles className="text-white" size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                    STORE BUILDER
                                </h1>
                                <span className="text-[10px] font-black bg-slate-950 text-white px-2 py-0.5 rounded-md uppercase tracking-tighter">ULTRA</span>
                            </div>
                            <p className="text-slate-500 text-[11px] mt-0.5 font-medium">Pixel-perfect responsive design engine.</p>
                        </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <button className="flex-1 md:flex-initial px-8 py-3 bg-blue-600 text-white rounded-full text-[11px] font-bold uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95">
                            <Globe size={16} />
                            DEPLOY LIVE
                        </button>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 overflow-hidden">
                    {/* LEFT CONTROLS (4 Cols) */}
                    <div className="xl:col-span-4 space-y-6 overflow-y-auto pr-3 scrollbar-hide pb-12">
                        {/* Domain Interface */}
                        <div className="bg-white border-2 border-emerald-500/20 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
                            <div className="flex justify-between items-center mb-4 relative z-10">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ACTIVE SITE</h3>
                                <Globe size={14} className="text-emerald-500" />
                            </div>
                            <span className="text-[14px] font-bold text-slate-900 tracking-tight">lux-apparel.golalita.qa</span>
                        </div>

                        {/* BRAND IDENTITY */}
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                                <FolderHeart size={16} className="text-blue-500" />
                                BRAND IDENTITY
                            </h3>
                            <div className="flex gap-6 items-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center shrink-0 hover:bg-white hover:border-blue-500 transition-all cursor-pointer group">
                                    <Camera size={24} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                                    <span className="text-[8px] font-bold text-slate-300 uppercase mt-1">LOGO</span>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">DISPLAY NAME</label>
                                    <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-[12px] font-bold outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner" />
                                </div>
                            </div>
                        </div>

                        {/* ANNOUNCEMENT */}
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                    <Megaphone size={16} className="text-blue-500" />
                                    ANNOUNCEMENT
                                </h3>
                                <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer" onClick={() => setShowTicker(!showTicker)}>
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-md transition-all ${showTicker ? 'right-1' : 'left-1'}`} />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">TICKER MESSAGE</label>
                                    <input value={tickerText} onChange={(e) => setTickerText(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-[11px] font-bold outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner" />
                                </div>
                                <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
                                    <input type="color" value={tickerColor} onChange={(e) => setTickerColor(e.target.value)} className="w-10 h-10 rounded-lg shadow-inner cursor-pointer" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tickerColor}</span>
                                </div>
                            </div>
                        </div>

                        {/* INTERACTIVE HERO */}
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                                <Layout size={16} className="text-blue-500" />
                                INTERACTIVE HERO
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">HEADLINE</label>
                                    <input value={bannerTitle} onChange={(e) => setBannerTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-[12px] font-bold outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">BUTTON CTA</label>
                                    <input value={bannerBtn} onChange={(e) => setBannerBtn(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-[11px] font-bold outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner" />
                                </div>
                            </div>
                        </div>

                        {/* STORE LAYOUT */}
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                                <Columns size={16} className="text-blue-500" />
                                STORE LAYOUT
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                {layoutPresets.map((preset) => (
                                    <button
                                        key={preset.id}
                                        onClick={() => setHeroLayout(preset.id)}
                                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${heroLayout === preset.id ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                                    >
                                        <preset.icon size={20} />
                                        <span className="text-[8px] font-bold uppercase tracking-widest">{preset.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* THEME COLORS */}
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                                <Palette size={16} className="text-blue-500" />
                                THEME COLORS
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Primary', val: primaryColor, set: setPrimaryColor },
                                    { label: 'Background', val: bgColor, set: setBgColor },
                                    { label: 'Text', val: textColor, set: setTextColor },
                                    { label: 'Accent', val: accentColor, set: setAccentColor }
                                ].map((c) => (
                                    <div key={c.label} className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center gap-3">
                                        <input type="color" value={c.val} onChange={(e) => c.set(e.target.value)} className="w-8 h-8 rounded-lg border-none cursor-pointer p-0 bg-transparent" />
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{c.label}</span>
                                            <span className="text-[9px] font-bold text-slate-900 uppercase tracking-widest">{c.val}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ASSETS */}
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                                <ImageIcon size={16} className="text-blue-500" />
                                ASSET LIBRARY
                            </h3>
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                {heroLibrary.map((url, i) => (
                                    <button key={i} onClick={() => setHeroImage(url)} className={`aspect-square rounded-lg border-2 overflow-hidden transition-all ${heroImage === url ? 'border-blue-600' : 'border-transparent'}`}>
                                        <img src={url} alt="H" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input placeholder="Custom URL..." value={customImageUrl} onChange={(e) => setCustomImageUrl(e.target.value)} className="flex-1 bg-slate-50 border border-slate-100 p-2 rounded-lg text-[10px] outline-none" />
                                <button onClick={handleAddAsset} className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center shrink-0"><Plus size={16} /></button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PREVIEW (8 Cols) */}
                    <div className="xl:col-span-8 flex flex-col gap-6 overflow-hidden">
                        {/* Simulation Tabs */}
                        <div className="flex items-center justify-between px-2">
                            <div className="flex bg-slate-100 p-1 rounded-2xl shadow-inner gap-2">
                                <button onClick={() => setPreviewPage("home")} className={`px-8 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${previewPage === 'home' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>HOME</button>
                                <button onClick={() => setPreviewPage("collections")} className={`px-8 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${previewPage === 'collections' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>DISCOVERY</button>
                            </div>
                            <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner gap-2">
                                <button onClick={() => setViewMode("desktop")} className={`p-2 rounded-lg transition-all ${viewMode === 'desktop' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}><Monitor size={14} /></button>
                                <button onClick={() => setViewMode("mobile")} className={`p-2 rounded-lg transition-all ${viewMode === 'mobile' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}><Smartphone size={14} /></button>
                            </div>
                        </div>

                        {/* Browser Window */}
                        <div className="flex-1 border border-slate-200 shadow-2xl rounded-[2rem] overflow-hidden flex flex-col bg-white">
                            {/* Browser Header */}
                            <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                    </div>
                                    <div className="bg-white border border-slate-200 px-10 py-1.5 rounded-lg flex items-center gap-3">
                                        <Globe size={10} className="text-slate-300" />
                                        <span className="text-[10px] font-medium text-slate-400 tracking-tight">preview.lux-apparel.golalita.qa</span>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-300">
                                    <ChevronRight size={14} />
                                </div>
                            </div>

                            {/* Simulation Engine container */}
                            <div className="flex-1 bg-slate-100 overflow-hidden relative flex flex-col items-center p-0">
                                <div className={`transition-all duration-700 ease-in-out relative z-10 bg-white shadow-2xl flex flex-col h-full w-full overflow-hidden`}
                                    style={isMobile ? { width: '375px', maxWidth: '100%', margin: '0 auto', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' } : {}}
                                >
                                    {/* Cart Sidebar Overlay - Moved to frame root */}
                                    <div className={`absolute inset-0 z-[100] transition-all duration-500 ${isCartOpen ? 'visible bg-black/40 backdrop-blur-sm' : 'invisible bg-transparent overflow-hidden'}`} onClick={() => setIsCartOpen(false)}>
                                        <div
                                            className={`absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl transition-transform duration-500 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                                <h3 className="text-sm font-bold uppercase tracking-widest text-[#0f172a]">Shopping Cart</h3>
                                                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><Plus className="rotate-45" size={20} /></button>
                                            </div>
                                            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                                                {cartItems.length === 0 ? (
                                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                                                        <ShoppingCart size={40} className="stroke-1 text-[#0f172a]" />
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#0f172a]">Your cart is empty</p>
                                                    </div>
                                                ) : (
                                                    cartItems.map((item, idx) => (
                                                        <div key={idx} className="flex gap-4 items-center">
                                                            <div className="w-12 h-12 bg-slate-100 rounded-lg shrink-0 overflow-hidden">
                                                                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=100" className="w-full h-full object-cover" alt="" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="text-[10px] font-bold uppercase truncate text-[#0f172a]">{item.name}</h4>
                                                                <p className="text-[10px] font-bold opacity-40 text-[#0f172a]">${item.price.toFixed(2)}</p>
                                                            </div>
                                                            <button onClick={() => removeFromCart(idx)} className="text-[10px] font-bold text-red-500 uppercase">Remove</button>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                            {cartItems.length > 0 && (
                                                <div className="p-6 border-t border-slate-100 space-y-4 bg-slate-50/50">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[10px] font-bold uppercase opacity-40 text-[#0f172a]">Total</span>
                                                        <span className="text-sm font-bold text-[#0f172a]">${cartItems.reduce((acc, curr) => acc + curr.price, 0).toFixed(2)}</span>
                                                    </div>
                                                    <button className="w-full py-4 bg-blue-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-lg hover:opacity-90 active:scale-95 transition-all" style={{ backgroundColor: primaryColor }}>Checkout</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col flex-1 overflow-y-auto scrollbar-hide" style={{ backgroundColor: bgColor, color: textColor }}>

                                        {/* Announcement */}
                                        {showTicker && (
                                            <div className="overflow-hidden py-2 whitespace-nowrap text-white text-[10px] font-bold uppercase tracking-widest relative z-50" style={{ backgroundColor: tickerColor }}>
                                                <div className="flex gap-20 animate-marquee">
                                                    <span>{tickerText}</span>
                                                    <span>{tickerText}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Navbar */}
                                        <nav className="p-6 md:p-10 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: primaryColor }}>
                                                    <Sparkles size={20} className="text-white" />
                                                </div>
                                                <span className="text-xl font-black tracking-tight" style={{ color: textColor }}>{storeName}</span>
                                            </div>
                                            <div className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-widest opacity-60">
                                                <span>home</span>
                                                <span onClick={() => setPreviewPage("collections")} className="cursor-pointer">collections</span>
                                                <span>vault</span>
                                            </div>
                                            <div onClick={() => setIsCartOpen(true)} className="p-3 bg-slate-50 rounded-full border border-slate-100 relative cursor-pointer hover:bg-slate-100 transition-all">
                                                <ShoppingCart size={18} />
                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full text-white text-[8px] flex items-center justify-center font-bold" style={{ backgroundColor: primaryColor }}>{cartItems.length}</div>
                                            </div>
                                        </nav>

                                        {previewPage === 'home' ? (
                                            /* Hero Content */
                                            <div className="flex-1 flex flex-col">
                                                {heroLayout === "split" && (
                                                    <div className={`flex-1 flex ${isMobile ? 'flex-col' : 'flex-row'}`}>
                                                        <div className={`${isMobile ? 'p-8 pt-12' : 'w-1/2 p-20'} flex flex-col justify-center space-y-6`}>
                                                            <h2 className={`${isMobile ? 'text-4xl' : 'text-7xl'} font-bold tracking-tight leading-none`} style={{ color: textColor }}>{bannerTitle}</h2>
                                                            <p className={`${isMobile ? 'text-xs' : 'text-lg'} opacity-50 font-medium tracking-wide`}>{bannerSubtitle}</p>
                                                            <button className="px-10 py-4 bg-blue-600 text-white rounded-full font-bold uppercase tracking-widest text-[11px] transition-all hover:bg-blue-700 w-fit" style={{ backgroundColor: primaryColor }}>{bannerBtn}</button>
                                                        </div>
                                                        <div className="flex-1 p-6 md:p-12">
                                                            <img src={heroImage} className="w-full h-full object-cover rounded-3xl shadow-2xl min-h-[300px]" alt="Hero" />
                                                        </div>
                                                    </div>
                                                )}

                                                {heroLayout === "modern" && (
                                                    <div className="flex-1 flex flex-col items-center justify-center text-center p-10 md:p-20 space-y-8">
                                                        <div className="space-y-4 max-w-4xl">
                                                            <h2 className={`${isMobile ? 'text-4xl' : 'text-8xl'} font-bold tracking-tight`} style={{ color: textColor }}>{bannerTitle}</h2>
                                                            <p className={`${isMobile ? 'text-xs' : 'text-lg'} opacity-50 font-medium tracking-wide mx-auto max-w-2xl`}>{bannerSubtitle}</p>
                                                        </div>
                                                        <button className="px-12 py-5 bg-blue-600 text-white rounded-full font-bold uppercase tracking-widest text-[12px]" style={{ backgroundColor: primaryColor }}>{bannerBtn}</button>
                                                        <div className="w-full max-w-5xl mt-10">
                                                            <img src={heroImage} className="w-full h-[400px] object-cover rounded-3xl shadow-2xl" alt="H" />
                                                        </div>
                                                    </div>
                                                )}

                                                {heroLayout === "overlay" && (
                                                    <div className="flex-1 relative flex items-center justify-center min-h-[500px]">
                                                        <img src={heroImage} className="absolute inset-0 w-full h-full object-cover" alt="O" />
                                                        <div className="absolute inset-0 bg-black/40" />
                                                        <div className="relative z-10 text-center text-white p-10 space-y-8">
                                                            <h2 className={`${isMobile ? 'text-4xl' : 'text-7xl'} font-bold tracking-tight`}>{bannerTitle}</h2>
                                                            <p className="max-w-xl mx-auto opacity-80">{bannerSubtitle}</p>
                                                            <button className="px-12 py-5 bg-white text-blue-600 rounded-xl font-bold uppercase tracking-widest text-[11px]">{bannerBtn}</button>
                                                        </div>
                                                    </div>
                                                )}

                                                {heroLayout === "minimal" && (
                                                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-12">
                                                        <div className="space-y-4">
                                                            <h2 className="text-5xl font-light tracking-widest uppercase">{bannerTitle}</h2>
                                                            <div className="w-20 h-px bg-slate-200 mx-auto" />
                                                            <p className="text-xs uppercase tracking-[0.5em] opacity-40">{bannerSubtitle}</p>
                                                        </div>
                                                        <button className="text-[10px] font-bold uppercase tracking-widest border-b-2 border-blue-600 pb-2">{bannerBtn}</button>
                                                    </div>
                                                )}

                                                {heroLayout === "sidebar" && (
                                                    <div className="flex-1 flex">
                                                        <div className="flex-1 relative">
                                                            <img src={heroImage} className="w-full h-full object-cover" alt="S" />
                                                        </div>
                                                        <div className="w-1/3 bg-slate-900 p-12 flex flex-col justify-center text-white space-y-8">
                                                            <h2 className="text-4xl font-bold leading-tight">{bannerTitle}</h2>
                                                            <p className="opacity-60 text-sm">{bannerSubtitle}</p>
                                                            <button className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold uppercase tracking-widest text-[10px]">{bannerBtn}</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            /* Collections Content */
                                            <div className="p-8 md:p-16 flex-1 bg-white">
                                                <div className="mb-12">
                                                    <h3 className="text-3xl md:text-5xl font-bold tracking-tight" style={{ color: textColor }}>{discoveryTitle}</h3>
                                                    <p className="opacity-50 mt-2">{discoverySubtitle}</p>
                                                </div>
                                                <div className={`grid ${isMobile ? 'grid-cols-1 gap-12' : 'grid-cols-2 lg:grid-cols-3 gap-12'}`}>
                                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                                        <div key={i} className="group cursor-pointer">
                                                            <div className="aspect-[4/5] bg-slate-50 rounded-[2rem] overflow-hidden relative mb-4">
                                                                <img src={`https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600`} alt="P" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                                                                <div className="absolute bottom-6 left-6 right-6 translate-y-20 group-hover:translate-y-0 transition-all duration-500">
                                                                    <button
                                                                        onClick={() => addToCart({ id: i, name: `Product #${i}`, price: 99.00 })}
                                                                        className="w-full py-3 bg-white text-slate-900 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-slate-50 active:scale-95 transition-all"
                                                                    >
                                                                        Add to Cart
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h4 className="font-bold text-lg">Product #{i}</h4>
                                                                    <p className="text-xs opacity-50">Premium Collection</p>
                                                                </div>
                                                                <span className="font-bold" style={{ color: primaryColor }}>$99.00</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
                @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                .animate-marquee { animation: marquee 30s linear infinite; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
