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
    Component,
    Upload,
    ChevronLeft,
    MapPin,
    CreditCard,
    Truck,
    Lock,
    Tag,
    Wallet,
    Star
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function CustomizerEditorialPage() {
    // UI State
    const [viewMode, setViewMode] = useState("desktop");
    const [previewPage, setPreviewPage] = useState("home");
    const [heroLayout, setHeroLayout] = useState("split");
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [selectedSize, setSelectedSize] = useState("M");
    const [checkoutStep, setCheckoutStep] = useState<"cart" | "checkout" | "success">("cart");
    const [selectedPayment, setSelectedPayment] = useState("card");
    const [isCouponApplied, setIsCouponApplied] = useState(false);

    const logoInputRef = useRef<HTMLInputElement>(null);
    const assetInputRef = useRef<HTMLInputElement>(null);

    // Backend Integration State
    const [logoUrl, setLogoUrl] = useState("");
    const [merchantProducts, setMerchantProducts] = useState<any[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("golalita_token");
                if (!token) return;

                // Fetch Config
                const configRes = await fetch("/api/python/store-config/", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (configRes.ok) {
                    const config = await configRes.json();
                    if (config.store_name) setStoreName(config.store_name);
                    if (config.logo_url) setLogoUrl(config.logo_url);
                    if (config.primary_color) setPrimaryColor(config.primary_color);
                    if (config.bg_color) setBgColor(config.bg_color);
                    if (config.text_color) setTextColor(config.text_color);
                    if (config.accent_color) setAccentColor(config.accent_color);
                    if (config.banner_title) setBannerTitle(config.banner_title);
                    if (config.banner_subtitle) setBannerSubtitle(config.banner_subtitle);
                    if (config.banner_btn) setBannerBtn(config.banner_btn);
                    if (config.hero_image) setHeroImage(config.hero_image);
                    if (config.hero_layout) setHeroLayout(config.hero_layout);
                    if (config.ticker_text) setTickerText(config.ticker_text);
                    if (config.ticker_color) setTickerColor(config.ticker_color);
                    if (config.show_ticker !== undefined) setShowTicker(config.show_ticker);
                    if (config.discovery_title) setDiscoveryTitle(config.discovery_title);
                    if (config.discovery_subtitle) setDiscoverySubtitle(config.discovery_subtitle);
                    if (config.hero_library && config.hero_library.length > 0) setHeroLibrary(config.hero_library);
                }

                // Fetch Products
                const productsRes = await fetch("/api/python/products", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (productsRes.ok) {
                    const products = await productsRes.json();
                    setMerchantProducts(products);
                }
            } catch (error) {
                console.error("Failed to fetch customizer data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDeploy = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem("golalita_token");
            if (!token) return;

            const payload = {
                store_name: storeName,
                logo_url: logoUrl,
                primary_color: primaryColor,
                bg_color: bgColor,
                text_color: textColor,
                accent_color: accentColor,
                banner_title: bannerTitle,
                banner_subtitle: bannerSubtitle,
                banner_btn: bannerBtn,
                hero_image: heroImage,
                hero_layout: heroLayout,
                ticker_text: tickerText,
                ticker_color: tickerColor,
                show_ticker: showTicker,
                discovery_title: discoveryTitle,
                discovery_subtitle: discoverySubtitle,
                hero_library: heroLibrary
            };

            const saveRes = await fetch("/api/python/store-config/save/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!saveRes.ok) {
                const status = saveRes.status;
                const errorData = await saveRes.json().catch(() => ({}));
                console.error(`SAVE_CONFIG_ERROR (${status}):`, errorData);
                throw new Error(errorData.detail || `Server error (${status}) during save`);
            }

            const publishRes = await fetch("/api/python/store-config/publish/", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!publishRes.ok) {
                const errorData = await publishRes.json();
                console.error("PUBLISH_ERROR:", errorData);
                throw new Error(errorData.detail || "Failed to publish");
            }

            alert("Store successfully deployed live!");
        } catch (error: any) {
            console.error("DEPLOY_ERROR:", error);
            alert(`Error deploying store: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAssetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const url = reader.result as string;
                if (!heroLibrary.includes(url)) {
                    setHeroLibrary([url, ...heroLibrary]);
                    setHeroImage(url);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddAsset = () => {
        if (customImageUrl && !heroLibrary.includes(customImageUrl)) {
            setHeroLibrary([customImageUrl, ...heroLibrary]);
            setHeroImage(customImageUrl);
            setCustomImageUrl("");
        }
    };

    const addToCart = (product: any) => {
        setCartItems([...cartItems, product]);
        setCheckoutStep("cart");
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

            <main className="flex-1 p-4 lg:p-8 flex flex-col">
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
                        <button onClick={handleDeploy} disabled={isSaving || isLoading} className="flex-1 md:flex-initial px-8 py-3 bg-blue-600 text-white rounded-full text-[11px] font-bold uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
                            {isSaving ? <RotateCcw size={16} className="animate-spin" /> : <Globe size={16} />}
                            {isSaving ? "DEPLOYING..." : "DEPLOY LIVE"}
                        </button>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start relative">
                    {/* LEFT CONTROLS (4 Cols) */}
                    <div className="xl:col-span-4 space-y-6 sticky top-8 pb-12">
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
                                <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                                <div 
                                    className="w-20 h-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center shrink-0 hover:bg-white hover:border-blue-500 transition-all cursor-pointer group overflow-hidden relative"
                                    onClick={() => logoInputRef.current?.click()}
                                >
                                    {logoUrl ? (
                                        <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <>
                                            <Camera size={24} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                                            <span className="text-[8px] font-bold text-slate-300 uppercase mt-1">LOGO</span>
                                        </>
                                    )}
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
                                <input type="file" ref={assetInputRef} onChange={handleAssetUpload} accept="image/*" className="hidden" />
                                <button onClick={() => assetInputRef.current?.click()} className="flex-1 bg-slate-50 border border-slate-200 border-dashed py-3 rounded-xl text-[9px] font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2 group">
                                    <Upload size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                                    Upload from Device
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PREVIEW (8 Cols) */}
                    <div className="xl:col-span-8 flex flex-col gap-6">
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
                            <div className={`flex-1 bg-slate-100 relative flex items-center justify-center ${isMobile ? 'py-12' : 'p-0'}`}>
                                <div className={`transition-all duration-700 ease-in-out relative z-10 bg-white flex flex-col overflow-hidden ${isMobile ? 'w-[340px] h-[720px] rounded-[3rem] border-[12px] border-slate-900 shadow-2xl shrink-0' : 'w-full h-full min-h-[800px] shadow-sm'}`}>
                                    {/* Mobile Notch */}
                                    {isMobile && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-3xl z-[200]"></div>
                                    )}
                                    {/* Cart Sidebar Overlay - Moved to frame root */}
                                    <div className={`absolute inset-0 z-[200] transition-all duration-500 ${isCartOpen ? 'visible bg-black/40 backdrop-blur-sm' : 'invisible bg-transparent overflow-hidden'}`} onClick={() => setIsCartOpen(false)} style={{ borderRadius: isMobile ? 'calc(3rem - 12px)' : '0' }}>
                                        <div
                                            className={`absolute right-0 top-0 bottom-0 ${isMobile ? 'w-full pt-11' : 'w-80'} bg-white shadow-2xl transition-transform duration-500 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
                                            onClick={(e) => e.stopPropagation()}
                                            style={{ borderRadius: isMobile ? 'calc(3rem - 12px)' : '0' }}
                                        >
                                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                                <h3 className="text-xs font-bold uppercase tracking-widest text-[#0f172a]">
                                                    {checkoutStep === "cart" && "Shopping Cart"}
                                                    {checkoutStep === "checkout" && "Secure Checkout"}
                                                    {checkoutStep === "success" && "Order Confirmed"}
                                                </h3>
                                                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><Plus className="rotate-45" size={20} /></button>
                                            </div>

                                            {checkoutStep === "cart" && (
                                                <>
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
                                                                        <img src={item.image || "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=100"} className="w-full h-full object-cover" alt="" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0 text-[#0f172a]">
                                                                        <h4 className="text-[10px] font-bold uppercase truncate">{item.name}</h4>
                                                                        <p className="text-[10px] font-bold opacity-40">${item.price.toFixed(2)}</p>
                                                                    </div>
                                                                    <button onClick={() => removeFromCart(idx)} className="text-[10px] font-bold text-red-500 uppercase">Remove</button>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                    {cartItems.length > 0 && (
                                                        <div className="p-6 border-t border-slate-100 space-y-4 bg-slate-50/50">
                                                            <div className="flex justify-between items-center text-[#0f172a]">
                                                                <span className="text-[10px] font-bold uppercase opacity-40">Total</span>
                                                                <span className="text-sm font-bold">${cartItems.reduce((acc, curr) => acc + curr.price, 0).toFixed(2)}</span>
                                                            </div>
                                                            <button onClick={() => setCheckoutStep("checkout")} className="w-full py-4 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-lg hover:opacity-90 active:scale-95 transition-all" style={{ backgroundColor: primaryColor }}>Checkout</button>
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            {checkoutStep === "checkout" && (
                                                <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden text-[#0f172a]">
                                                    {/* Header */}
                                                    <div className="p-4 md:p-6 flex items-center gap-3 bg-white border-b border-slate-100">
                                                        <button onClick={() => setCheckoutStep("cart")} className="p-1.5 rounded-full bg-slate-50 text-slate-400">
                                                            <ChevronLeft size={16} />
                                                        </button>
                                                        <div>
                                                            <h2 className="text-sm font-black uppercase tracking-tighter italic">Checkout</h2>
                                                            <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Secure Protocol</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-6 space-y-6">
                                                        {/* Shipping */}
                                                        <div className="bg-white rounded-[1.5rem] p-5 border border-slate-100 shadow-sm space-y-4">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="w-8 h-8 bg-slate-950 text-white rounded-lg flex items-center justify-center">
                                                                    <MapPin size={16} />
                                                                </div>
                                                                <h3 className="text-[11px] font-black uppercase tracking-tighter italic">Destination</h3>
                                                            </div>
                                                            <div className="space-y-3">
                                                                <div className="space-y-1">
                                                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                                                    <div className="w-full bg-slate-50 p-3 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-tight">Shivalik R.</div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Address</label>
                                                                    <div className="w-full bg-slate-50 p-3 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-tight">West Bay, Doha</div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Payment Methods */}
                                                        <div className="bg-white rounded-[1.5rem] p-5 border border-slate-100 shadow-sm space-y-4">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                                                                    <CreditCard size={16} />
                                                                </div>
                                                                <h3 className="text-[11px] font-black uppercase tracking-tighter italic">Protocol</h3>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                {[
                                                                    { id: 'card', name: 'Card', icon: CreditCard },
                                                                    { id: 'apple', name: 'Apple', icon: Smartphone },
                                                                    { id: 'qpay', name: 'QPay', icon: Wallet },
                                                                    { id: 'cod', name: 'COD', icon: Truck },
                                                                ].map((m) => (
                                                                    <button key={m.id} onClick={() => setSelectedPayment(m.id)} className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 ${selectedPayment === m.id ? 'border-blue-600 bg-blue-50/50' : 'border-slate-50'}`}>
                                                                        <m.icon size={16} className={selectedPayment === m.id ? 'text-blue-600' : 'text-slate-300'} />
                                                                        <span className={`text-[7px] font-black uppercase tracking-widest ${selectedPayment === m.id ? 'text-blue-600' : 'text-slate-400'}`}>{m.name}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Coupon Preview */}
                                                        <div className="bg-white rounded-[1.5rem] p-5 border border-slate-100 shadow-sm space-y-4">
                                                            <div className="flex gap-2">
                                                                <div className="flex-1 bg-slate-50 p-3 rounded-lg text-[8px] font-bold text-slate-300 uppercase tracking-widest">COUPON CODE</div>
                                                                <button onClick={() => setIsCouponApplied(true)} className="px-4 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest">Apply</button>
                                                            </div>
                                                            {isCouponApplied && (
                                                                <div className="flex items-center justify-between bg-blue-50 text-blue-600 p-2 rounded-lg border border-blue-100">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <Tag size={10} />
                                                                        <span className="text-[7px] font-black uppercase tracking-widest">SAV20 Applied</span>
                                                                    </div>
                                                                    <button onClick={() => setIsCouponApplied(false)} className="text-[8px] font-black">×</button>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Summary Preview */}
                                                        <div className="bg-slate-950 rounded-[1.5rem] p-5 text-white shadow-xl space-y-4">
                                                            <div className="space-y-2.5">
                                                                <div className="flex justify-between items-center text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                                                                    <span>Subtotal</span>
                                                                    <span className="text-white">${cartItems.reduce((acc, curr) => acc + curr.price, 0).toFixed(2)}</span>
                                                                </div>
                                                                {isCouponApplied && (
                                                                    <div className="flex justify-between items-center text-[8px] font-bold text-blue-400 uppercase tracking-widest">
                                                                        <span>Discount</span>
                                                                        <span>-${(cartItems.reduce((acc, curr) => acc + curr.price, 0) * 0.2).toFixed(2)}</span>
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-between items-center text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                                                                    <span>Tax (15%)</span>
                                                                    <span className="text-white">${((cartItems.reduce((acc, curr) => acc + curr.price, 0) - (isCouponApplied ? cartItems.reduce((acc, curr) => acc + curr.price, 0) * 0.2 : 0)) * 0.15).toFixed(2)}</span>
                                                                </div>
                                                            </div>
                                                            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Total Payable</span>
                                                                <span className="text-white text-[16px] font-black tracking-tighter">
                                                                    ${((cartItems.reduce((acc, curr) => acc + curr.price, 0) - (isCouponApplied ? cartItems.reduce((acc, curr) => acc + curr.price, 0) * 0.2 : 0)) * 1.15).toFixed(2)}
                                                                </span>
                                                            </div>
                                                            <button 
                                                                onClick={() => { setCheckoutStep("success"); setCartItems([]); }}
                                                                className="w-full py-4 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.3em] shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                                                style={{ backgroundColor: primaryColor }}
                                                            >
                                                                <Lock size={12} /> Confirm & Pay Now
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {checkoutStep === "success" && (
                                                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 text-[#0f172a]">
                                                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border-4 border-green-100">
                                                        <CheckCircle2 size={32} className="text-green-500" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h4 className="text-sm font-black uppercase tracking-widest italic">Order Placed!</h4>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Simulator: Successful transaction</p>
                                                    </div>
                                                    <button onClick={() => { setIsCartOpen(false); setTimeout(() => setCheckoutStep("cart"), 500); }} className="px-8 py-3 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest">Continue Shopping</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Product Details Modal Overlay */}
                                    <div className={`absolute inset-0 z-[120] transition-all duration-500 ${selectedProduct ? 'visible bg-black/60 backdrop-blur-md' : 'invisible bg-transparent overflow-hidden'}`} onClick={() => setSelectedProduct(null)} style={{ borderRadius: isMobile ? 'calc(3rem - 12px)' : '0' }}>
                                        <div
                                            className={`absolute bottom-0 left-0 right-0 ${isMobile ? 'h-[85%]' : 'h-[90%]'} bg-white shadow-2xl transition-transform duration-500 flex flex-col rounded-t-[2rem] ${selectedProduct ? 'translate-y-0' : 'translate-y-full'}`}
                                            onClick={(e) => e.stopPropagation()}
                                            style={{ borderBottomLeftRadius: isMobile ? 'calc(3rem - 12px)' : '0', borderBottomRightRadius: isMobile ? 'calc(3rem - 12px)' : '0' }}
                                        >
                                            <div className="absolute top-4 right-4 z-[130]">
                                                <button onClick={() => setSelectedProduct(null)} className="w-8 h-8 bg-black/10 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 hover:bg-black/20 transition-colors">
                                                    <Plus className="rotate-45" size={20} />
                                                </button>
                                            </div>
                                            {selectedProduct && (
                                                <div className="flex flex-col md:flex-row h-full">
                                                    {/* Left: Image Gallery */}
                                                    <div className="w-full md:w-[50%] bg-slate-50 relative shrink-0 overflow-hidden p-4 md:p-8 flex flex-col justify-center items-center">
                                                        <div className="w-full aspect-[4/5] relative flex items-center justify-center overflow-hidden rounded-3xl shadow-xl">
                                                            <img src={selectedProduct.image} className="w-full h-full object-cover" />
                                                            <div className="absolute top-4 left-4">
                                                                <span className="bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest italic shadow-lg">New Arrival</span>
                                                            </div>
                                                        </div>
                                                        <div className="hidden md:flex gap-2 mt-4">
                                                            {[1, 2, 3].map((i) => (
                                                                <div key={i} className={`w-10 h-10 rounded-lg border-2 ${i === 1 ? 'border-blue-600' : 'border-slate-200'}`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Right: Info */}
                                                    <div className="w-full md:w-[50%] flex flex-col bg-white overflow-y-auto scrollbar-hide">
                                                        <div className="p-4 md:p-8 space-y-6">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">{selectedProduct.category || 'Premium Collection'}</span>
                                                                    <div className="flex items-center gap-1 text-amber-400">
                                                                        <Star size={8} className="fill-amber-400" />
                                                                        <span className="text-[8px] font-black text-slate-900">4.9</span>
                                                                    </div>
                                                                </div>
                                                                <h2 className="text-xl md:text-2xl font-black text-slate-950 uppercase tracking-tighter leading-none">{selectedProduct.name}</h2>
                                                            </div>
                                                            
                                                            <div className="text-2xl font-black tracking-tighter text-slate-950">${selectedProduct.price?.toFixed(2)}</div>
                                                            
                                                            <p className="text-[10px] text-slate-500 font-bold leading-relaxed">Ultra-soft premium essential made from 100% sustainable materials.</p>
                                                            
                                                            {/* Size Selector */}
                                                            <div className="space-y-2">
                                                                <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Select Size</h4>
                                                                <div className="flex gap-2">
                                                                    {['S', 'M', 'L'].map((size) => (
                                                                        <button key={size} onClick={() => setSelectedSize(size)} className={`w-8 h-8 rounded-lg text-[8px] font-black transition-all border ${selectedSize === size ? 'bg-slate-950 text-white border-slate-950' : 'bg-white text-slate-400 border-slate-100'}`}>{size}</button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Actions */}
                                                            <div className="flex flex-col gap-2">
                                                                <button onClick={() => addToCart({ ...selectedProduct, size: selectedSize })} className="w-full py-3 bg-slate-950 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-2" style={{ backgroundColor: primaryColor }}>
                                                                    <ShoppingCart size={12} /> Add to Cart
                                                                </button>
                                                                <button onClick={() => { addToCart({ ...selectedProduct, size: selectedSize }); setCheckoutStep("checkout"); }} className="w-full py-3 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                                                                    <Zap size={12} /> Buy Now
                                                                </button>
                                                            </div>

                                                            {/* Similar Section Preview */}
                                                            <div className="pt-6 border-t border-slate-100 space-y-4">
                                                                <h3 className="text-[10px] font-black uppercase tracking-tighter italic text-slate-950">Similar Products</h3>
                                                                <div className="grid grid-cols-2 gap-3">
                                                                    {[1, 2].map((i) => (
                                                                        <div key={i} className="space-y-2">
                                                                            <div className="aspect-square bg-slate-50 rounded-xl border border-slate-100" />
                                                                            <div className="h-2 bg-slate-50 w-3/4 rounded-full" />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className={`flex flex-col flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide`} style={{ backgroundColor: bgColor, color: textColor }}>
                                        
                                        {/* iPhone Status Bar Background */}
                                        {isMobile && (
                                            <div className="sticky top-0 w-full h-11 z-[150] shrink-0" style={{ backgroundColor: bgColor }}></div>
                                        )}

                                        {/* Announcement */}
                                        {showTicker && (
                                            <div className="overflow-hidden py-2 whitespace-nowrap text-white text-[10px] font-bold uppercase tracking-widest relative z-50 shrink-0" style={{ backgroundColor: tickerColor }}>
                                                <div className="flex gap-20 animate-marquee">
                                                    <span>{tickerText}</span>
                                                    <span>{tickerText}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Navbar */}
                                        <nav className={`${isMobile ? 'p-4 top-11' : 'p-10 top-0'} flex justify-between items-center sticky bg-white/80 backdrop-blur-md border-b border-slate-100 z-40 overflow-hidden shrink-0`}>
                                            <div className="flex items-center gap-3">
                                                {isMobile ? (
                                                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 shrink-0"><Menu size={20} /></button>
                                                ) : null}
                                                {logoUrl ? (
                                                    <img src={logoUrl} alt="Logo" className="h-8 max-w-[120px] object-contain shrink-0" />
                                                ) : (
                                                    !isMobile && (
                                                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shrink-0" style={{ backgroundColor: primaryColor }}>
                                                            <Sparkles size={20} className="text-white" />
                                                        </div>
                                                    )
                                                )}
                                                <span className={`${isMobile ? 'text-base' : 'text-xl'} font-black tracking-tight truncate`} style={{ color: textColor }}>{storeName}</span>
                                            </div>
                                            {!isMobile && (
                                                <div className="flex gap-8 text-[11px] font-bold uppercase tracking-widest opacity-60">
                                                    <span onClick={() => setPreviewPage("home")} className={`cursor-pointer transition-opacity hover:opacity-100 ${previewPage === 'home' ? 'text-slate-900 opacity-100' : ''}`}>home</span>
                                                    <span onClick={() => setPreviewPage("collections")} className={`cursor-pointer transition-opacity hover:opacity-100 ${previewPage === 'collections' ? 'text-slate-900 opacity-100' : ''}`}>collections</span>
                                                </div>
                                            )}
                                            <div onClick={() => setIsCartOpen(true)} className={`p-2 bg-slate-50 rounded-full border border-slate-100 relative cursor-pointer hover:bg-slate-100 transition-all shrink-0`}>
                                                <ShoppingCart size={isMobile ? 16 : 18} />
                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full text-white text-[8px] flex items-center justify-center font-bold" style={{ backgroundColor: primaryColor }}>{cartItems.length}</div>
                                            </div>
                                        </nav>

                                        {/* Mobile Menu Overlay */}
                                        <div className={`absolute inset-0 z-[150] transition-all duration-300 ${isMobileMenuOpen ? 'visible bg-black/40 backdrop-blur-sm' : 'invisible bg-transparent'}`} onClick={() => setIsMobileMenuOpen(false)} style={{ borderRadius: isMobile ? 'calc(3rem - 12px)' : '0' }}>
                                            <div className={`absolute left-0 top-0 bottom-0 w-64 bg-white shadow-2xl transition-transform duration-300 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${isMobile ? 'pt-11' : ''}`} onClick={(e) => e.stopPropagation()} style={{ borderTopLeftRadius: isMobile ? 'calc(3rem - 12px)' : '0', borderBottomLeftRadius: isMobile ? 'calc(3rem - 12px)' : '0' }}>
                                                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                                    <span className="text-lg font-black tracking-tight" style={{ color: textColor }}>{storeName}</span>
                                                    <button onClick={() => setIsMobileMenuOpen(false)}><Plus className="rotate-45 text-slate-400" size={24} /></button>
                                                </div>
                                                <div className="flex flex-col p-6 gap-6 text-sm font-bold uppercase tracking-widest text-slate-600">
                                                    <span onClick={() => { setPreviewPage("home"); setIsMobileMenuOpen(false); }} className={`cursor-pointer transition-colors hover:text-slate-900 ${previewPage === 'home' ? 'text-blue-600' : ''}`} style={{ color: previewPage === 'home' ? primaryColor : undefined }}>Home</span>
                                                    <span onClick={() => { setPreviewPage("collections"); setIsMobileMenuOpen(false); }} className={`cursor-pointer transition-colors hover:text-slate-900 ${previewPage === 'collections' ? 'text-blue-600' : ''}`} style={{ color: previewPage === 'collections' ? primaryColor : undefined }}>Collections</span>
                                                </div>
                                            </div>
                                        </div>

                                        {previewPage === 'home' && (
                                            /* Hero Content */
                                            <div className="flex-1 flex flex-col animate-in fade-in duration-500">
                                                {heroLayout === "split" && (
                                                    <div className={`flex-1 flex ${isMobile ? 'flex-col' : 'flex-row'}`}>
                                                        <div className={`${isMobile ? 'p-6 pt-10' : 'w-1/2 p-20'} flex flex-col justify-center space-y-6`}>
                                                            <h2 className={`${isMobile ? 'text-3xl' : 'text-7xl'} font-bold tracking-tight leading-none`} style={{ color: textColor }}>{bannerTitle}</h2>
                                                            <p className={`${isMobile ? 'text-xs' : 'text-lg'} opacity-50 font-medium tracking-wide`}>{bannerSubtitle}</p>
                                                            <button onClick={() => setPreviewPage("collections")} className="px-10 py-4 bg-blue-600 text-white rounded-full font-bold uppercase tracking-widest text-[11px] transition-all hover:bg-opacity-90 w-fit" style={{ backgroundColor: primaryColor }}>{bannerBtn}</button>
                                                        </div>
                                                        <div className={`flex-1 ${isMobile ? 'p-4' : 'p-12'}`}>
                                                            <img src={heroImage} className="w-full h-full object-cover rounded-3xl shadow-2xl min-h-[300px]" alt="Hero" />
                                                        </div>
                                                    </div>
                                                )}

                                                {heroLayout === "modern" && (
                                                    <div className={`flex-1 flex flex-col items-center justify-center text-center ${isMobile ? 'p-6 pt-12 space-y-6' : 'p-20 space-y-8'}`}>
                                                        <div className="space-y-4 max-w-4xl">
                                                            <h2 className={`${isMobile ? 'text-3xl' : 'text-8xl'} font-bold tracking-tight`} style={{ color: textColor }}>{bannerTitle}</h2>
                                                            <p className={`${isMobile ? 'text-xs' : 'text-lg'} opacity-50 font-medium tracking-wide mx-auto max-w-2xl`}>{bannerSubtitle}</p>
                                                        </div>
                                                        <button onClick={() => setPreviewPage("collections")} className="px-12 py-5 bg-blue-600 text-white rounded-full font-bold uppercase tracking-widest text-[12px] hover:bg-opacity-90 transition-opacity" style={{ backgroundColor: primaryColor }}>{bannerBtn}</button>
                                                        <div className={`w-full max-w-5xl ${isMobile ? 'mt-6' : 'mt-10'}`}>
                                                            <img src={heroImage} className={`w-full ${isMobile ? 'h-[300px]' : 'h-[400px]'} object-cover rounded-3xl shadow-2xl`} alt="H" />
                                                        </div>
                                                    </div>
                                                )}

                                                {heroLayout === "overlay" && (
                                                    <div className={`flex-1 relative flex items-center justify-center ${isMobile ? 'min-h-[400px]' : 'min-h-[500px]'}`}>
                                                        <img src={heroImage} className="absolute inset-0 w-full h-full object-cover" alt="O" />
                                                        <div className="absolute inset-0 bg-black/40" />
                                                        <div className={`relative z-10 text-center text-white ${isMobile ? 'p-6 space-y-6' : 'p-10 space-y-8'}`}>
                                                            <h2 className={`${isMobile ? 'text-3xl' : 'text-7xl'} font-bold tracking-tight`}>{bannerTitle}</h2>
                                                            <p className={`max-w-xl mx-auto opacity-80 ${isMobile ? 'text-sm' : 'text-base'}`}>{bannerSubtitle}</p>
                                                            <button onClick={() => setPreviewPage("collections")} className="px-12 py-5 bg-white text-slate-900 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-slate-100 transition-colors">{bannerBtn}</button>
                                                        </div>
                                                    </div>
                                                )}

                                                {heroLayout === "minimal" && (
                                                    <div className={`flex-1 flex flex-col items-center justify-center text-center ${isMobile ? 'p-10 space-y-8' : 'p-20 space-y-12'}`}>
                                                        <div className="space-y-4">
                                                            <h2 className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-light tracking-widest uppercase`} style={{ color: textColor }}>{bannerTitle}</h2>
                                                            <div className="w-20 h-px mx-auto" style={{ backgroundColor: primaryColor, opacity: 0.5 }} />
                                                            <p className="text-xs uppercase tracking-[0.3em] opacity-40" style={{ color: textColor }}>{bannerSubtitle}</p>
                                                        </div>
                                                        <button onClick={() => setPreviewPage("collections")} className="text-[10px] font-bold uppercase tracking-widest border-b-2 pb-2 hover:opacity-70 transition-opacity" style={{ color: primaryColor, borderColor: primaryColor }}>{bannerBtn}</button>
                                                    </div>
                                                )}

                                                {heroLayout === "sidebar" && (
                                                    <div className={`flex-1 flex ${isMobile ? 'flex-col' : 'row'}`}>
                                                        <div className="flex-1 relative min-h-[300px]">
                                                            <img src={heroImage} className="w-full h-full object-cover" alt="S" />
                                                        </div>
                                                        <div className={`${isMobile ? 'w-full p-8' : 'w-1/3 p-12'} bg-slate-900 flex flex-col justify-center text-white space-y-6`}>
                                                            <h2 className={`${isMobile ? 'text-3xl' : 'text-4xl'} font-bold leading-tight`}>{bannerTitle}</h2>
                                                            <p className={`opacity-60 ${isMobile ? 'text-xs' : 'text-sm'}`}>{bannerSubtitle}</p>
                                                            <button onClick={() => setPreviewPage("collections")} className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-colors">{bannerBtn}</button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Featured Products Section on Home Page */}
                                                <div className={`${isMobile ? 'p-6 py-12' : 'p-20'} bg-white border-t border-slate-50`}>
                                                    <div className="flex justify-between items-end mb-10">
                                                        <div>
                                                            <h3 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold tracking-tight`} style={{ color: textColor }}>{discoveryTitle}</h3>
                                                            <p className="text-[10px] font-medium uppercase tracking-[0.2em] opacity-40 mt-1">Curated from Inventory</p>
                                                        </div>
                                                        <button onClick={() => setPreviewPage("collections")} className="text-[10px] font-black uppercase tracking-widest border-b-2 border-slate-900 pb-1 hover:opacity-60 transition-opacity">Shop All</button>
                                                    </div>

                                                    <div className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-4 gap-8'}`}>
                                                        {merchantProducts.length === 0 ? (
                                                            [1, 2, 3, 4].map((i) => (
                                                                <div key={i} className="space-y-4 opacity-20">
                                                                    <div className="aspect-[4/5] bg-slate-100 rounded-2xl" />
                                                                    <div className="h-4 bg-slate-100 w-3/4 rounded-full" />
                                                                    <div className="h-4 bg-slate-100 w-1/2 rounded-full" />
                                                                </div>
                                                            ))
                                                        ) : (
                                                            merchantProducts.slice(0, 4).map((product: any, i: number) => (
                                                                <div key={product.id || i} className="group cursor-pointer" onClick={() => setSelectedProduct(product)}>
                                                                    <div className="aspect-[4/5] bg-slate-50 rounded-2xl overflow-hidden relative mb-3 border border-slate-100">
                                                                        {product.image ? (
                                                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                                                                <ImageIcon className="text-slate-300" size={24} />
                                                                            </div>
                                                                        )}
                                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <h4 className="text-[11px] font-bold truncate" style={{ color: textColor }}>{product.name}</h4>
                                                                        <div className="flex justify-between items-center">
                                                                            <span className="text-[10px] font-black" style={{ color: primaryColor }}>${product.price?.toFixed(2)}</span>
                                                                            <span className="text-[8px] font-bold opacity-30 uppercase tracking-widest">{product.category}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {previewPage === 'collections' && (
                                            /* Collections Content */
                                            <div className={`${isMobile ? 'p-6' : 'p-16'} flex-1 bg-white animate-in fade-in duration-500`} style={{ color: textColor }}>
                                                <div className={`${isMobile ? 'mb-8' : 'mb-12'}`}>
                                                    <h3 className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-bold tracking-tight`}>{discoveryTitle}</h3>
                                                    <p className="opacity-50 mt-2">{discoverySubtitle}</p>
                                                </div>
                                                <div className={`grid ${isMobile ? 'grid-cols-2 gap-6' : 'grid-cols-3 gap-12'}`}>
                                                    {merchantProducts.length === 0 ? (
                                                        [1, 2, 3, 4, 5, 6].map((i) => (
                                                            <div key={i} className="space-y-4 opacity-10">
                                                                <div className="aspect-[4/5] bg-slate-100 rounded-[2rem]" />
                                                                <div className="h-4 bg-slate-100 w-3/4 rounded-full" />
                                                                <div className="h-4 bg-slate-100 w-1/2 rounded-full" />
                                                            </div>
                                                        ))
                                                    ) : (
                                                        merchantProducts.map((product: any, i: number) => (
                                                            <div key={product.id || i} className="group cursor-pointer">
                                                                <div className="aspect-[4/5] bg-slate-50 rounded-[2rem] overflow-hidden relative mb-4 border border-slate-100">
                                                                    {product.image ? (
                                                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                                                            <ImageIcon className="text-slate-300" size={32} />
                                                                        </div>
                                                                    )}
                                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                                                                    <div className="absolute bottom-6 left-6 right-6 translate-y-20 group-hover:translate-y-0 transition-all duration-500">
                                                                        <button
                                                                            onClick={() => setSelectedProduct(product)}
                                                                            className="w-full py-3 bg-white text-slate-900 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-slate-50 active:scale-95 transition-all"
                                                                        >
                                                                            View Details
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between items-start gap-4">
                                                                    <div className="min-w-0">
                                                                        <h4 className={`font-bold truncate ${isMobile ? 'text-base' : 'text-lg'}`}>{product.name}</h4>
                                                                        <p className={`opacity-50 uppercase tracking-wider truncate ${isMobile ? 'text-[10px]' : 'text-xs'}`}>{product.category || 'Premium Collection'}</p>
                                                                    </div>
                                                                    <span className="font-bold shrink-0" style={{ color: primaryColor }}>${product.price?.toFixed(2)}</span>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                                {merchantProducts.length === 0 && (
                                                    <div className="mt-20 p-8 border-2 border-dashed border-slate-100 rounded-3xl text-center">
                                                        <Box size={40} className="mx-auto text-slate-200 mb-4" />
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Inventory is currently empty</p>
                                                        <p className="text-[10px] text-slate-300 mt-2">Products you add to your inventory will appear here live.</p>
                                                    </div>
                                                )}
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
