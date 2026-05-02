"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
    ShoppingCart, Plus, ChevronRight, Menu, 
    ImageIcon, Box, ShieldCheck, Sparkles, Globe,
    ArrowRight, CheckCircle2, CreditCard, MapPin, Truck,
    ChevronLeft, Lock, Tag, Smartphone, Wallet, Zap, Star
} from "lucide-react";
import Link from "next/link";

export default function MerchantLandingPage() {
    const params = useParams();
    const merchantId = params.merchantId as string;

    const [storeData, setStoreData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [previewPage, setPreviewPage] = useState("home");
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState<"cart" | "checkout" | "success">("cart");
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [selectedSize, setSelectedSize] = useState("M");
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [selectedPayment, setSelectedPayment] = useState("card");
    const [couponCode, setCouponCode] = useState("");
    const [isCouponApplied, setIsCouponApplied] = useState(false);

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const res = await fetch(`/api/python/public/stores/${merchantId}`);
                if (res.ok) {
                    const data = await res.json();
                    setStoreData(data);
                }
            } catch (error) {
                console.error("Failed to fetch store data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStoreData();
    }, [merchantId]);

    if (isLoading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-white text-slate-900">
                <div className="animate-spin mb-4"><Globe size={48} className="text-blue-500" /></div>
                <p className="text-xs font-black uppercase tracking-[0.4em]">Loading Store...</p>
            </div>
        );
    }

    if (!storeData || storeData.error) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-white">
                <Box size={64} className="text-slate-100 mb-6" />
                <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-950 mb-2">Store Not Found</h1>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">This portal has been deactivated or does not exist.</p>
                <Link href="/stores" className="px-10 py-4 bg-slate-950 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Back to Directory</Link>
            </div>
        );
    }

    const { config, products: merchantProducts, merchant } = storeData;
    
    // Derived config states
    const storeName = config.store_name || "LUXE.";
    const logoUrl = config.logo_url || "";
    const primaryColor = config.primary_color || "#2563eb";
    const bgColor = config.bg_color || "#ffffff";
    const textColor = config.text_color || "#0f172a";
    const accentColor = config.accent_color || "#3b82f6";
    const bannerTitle = config.banner_title || "EVOLVE YOUR IDENTITY.";
    const bannerSubtitle = config.banner_subtitle || "High-performance retail engine for modern brands.";
    const bannerBtn = config.banner_btn || "Shop Collection";
    const heroImage = config.hero_image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8";
    const heroLayout = config.hero_layout || "split";
    const tickerText = config.ticker_text || "⚡ FLASH SALE: 50% OFF ALL ITEMS ⚡";
    const tickerColor = config.ticker_color || "#2563eb";
    const showTicker = config.show_ticker !== undefined ? config.show_ticker : true;
    const discoveryTitle = config.discovery_title || "New Arrivals";
    const discoverySubtitle = config.discovery_subtitle || "Curated essentials for the modern lifestyle.";

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

    const closeCart = () => {
        setIsCartOpen(false);
        setTimeout(() => setCheckoutStep("cart"), 500);
    };

    const handleCheckoutSubmit = (e: any) => {
        e.preventDefault();
        setCheckoutStep("success");
        setCartItems([]);
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-x-hidden" style={{ backgroundColor: bgColor, color: textColor }}>
            
            {/* Cart Sidebar Overlay */}
            <div className={`fixed inset-0 z-[200] transition-all duration-500 ${isCartOpen ? 'visible bg-black/40 backdrop-blur-sm' : 'invisible bg-transparent overflow-hidden'}`} onClick={closeCart}>
                <div
                    className={`absolute right-0 top-0 bottom-0 w-full md:w-[400px] bg-white shadow-2xl transition-transform duration-500 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-[#0f172a]">
                            {checkoutStep === "cart" && "Shopping Cart"}
                            {checkoutStep === "checkout" && "Secure Checkout"}
                            {checkoutStep === "success" && "Order Confirmed"}
                        </h3>
                        <button onClick={closeCart} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><Plus className="rotate-45" size={20} /></button>
                    </div>

                    {checkoutStep === "cart" && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide text-[#0f172a]">
                                {cartItems.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                                        <ShoppingCart size={40} className="stroke-1 text-[#0f172a]" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#0f172a]">Your cart is empty</p>
                                    </div>
                                ) : (
                                    cartItems.map((item: any, idx: number) => (
                                        <div key={idx} className="flex gap-4 items-center">
                                            <div className="w-16 h-16 bg-slate-100 rounded-lg shrink-0 overflow-hidden">
                                                <img src={item.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=100"} className="w-full h-full object-cover" alt={item.name} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-[12px] font-bold uppercase truncate text-[#0f172a]">{item.name}</h4>
                                                <p className="text-[11px] font-bold opacity-60 text-[#0f172a]">${item.price?.toFixed(2)}</p>
                                            </div>
                                            <button onClick={() => removeFromCart(idx)} className="text-[10px] font-bold text-red-500 uppercase">Remove</button>
                                        </div>
                                    ))
                                )}
                            </div>
                            {cartItems.length > 0 && (
                                <div className="p-6 border-t border-slate-100 space-y-4 bg-slate-50/50">
                                    <div className="flex justify-between items-center text-[#0f172a]">
                                        <span className="text-[10px] font-bold uppercase opacity-60">Total</span>
                                        <span className="text-lg font-bold">${cartItems.reduce((acc, curr) => acc + curr.price, 0).toFixed(2)}</span>
                                    </div>
                                    <button onClick={() => setCheckoutStep("checkout")} className="w-full py-4 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-lg hover:opacity-90 active:scale-95 transition-all" style={{ backgroundColor: primaryColor }}>Proceed to Checkout</button>
                                </div>
                            )}
                        </>
                    )}

                    {checkoutStep === "checkout" && (
                        <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
                            {/* Header */}
                            <div className="p-6 md:p-10 flex items-center gap-4 bg-white border-b border-slate-100">
                                <button onClick={() => setCheckoutStep("cart")} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                                    <ChevronLeft size={20} />
                                </button>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-black text-slate-950 uppercase tracking-tighter italic">Checkout</h2>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Secure Transaction Protocol</p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto scrollbar-hide p-6 md:p-10">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                    {/* Left: Forms */}
                                    <div className="lg:col-span-7 space-y-6">
                                        {/* Shipping */}
                                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-6">
                                            <div className="flex items-center gap-4 mb-2">
                                                <div className="w-10 h-10 bg-slate-950 text-white rounded-xl flex items-center justify-center">
                                                    <MapPin size={20} />
                                                </div>
                                                <h3 className="text-lg font-black uppercase tracking-tighter italic">Shipping Destination</h3>
                                            </div>
                                            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                                    <input required type="text" placeholder="John Doe" className="w-full bg-slate-50 border-none rounded-xl p-3.5 text-xs font-bold focus:ring-2 focus:ring-blue-600 transition-all" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                                    <input required type="tel" placeholder="+974 0000 0000" className="w-full bg-slate-50 border-none rounded-xl p-3.5 text-xs font-bold focus:ring-2 focus:ring-blue-600 transition-all" />
                                                </div>
                                                <div className="md:col-span-2 space-y-1.5">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Delivery Address</label>
                                                    <textarea required placeholder="Doha, Qatar..." className="w-full bg-slate-50 border-none rounded-xl p-3.5 text-xs font-bold focus:ring-2 focus:ring-blue-600 transition-all resize-none h-20" />
                                                </div>
                                            </form>
                                        </div>

                                        {/* Payment */}
                                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-6">
                                            <div className="flex items-center gap-4 mb-2">
                                                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                                                    <CreditCard size={20} />
                                                </div>
                                                <h3 className="text-lg font-black uppercase tracking-tighter italic">Payment Protocol</h3>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {[
                                                    { id: "card", name: "Card", icon: CreditCard },
                                                    { id: "apple", name: "Apple", icon: Smartphone },
                                                    { id: "qpay", name: "QPay", icon: Wallet },
                                                    { id: "cod", name: "COD", icon: Truck },
                                                ].map((method) => (
                                                    <button
                                                        key={method.id}
                                                        onClick={() => setSelectedPayment(method.id)}
                                                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${selectedPayment === method.id ? "border-blue-600 bg-blue-50/50" : "border-slate-50 hover:border-slate-100"}`}
                                                    >
                                                        <method.icon size={20} className={selectedPayment === method.id ? "text-blue-600" : "text-slate-300"} />
                                                        <span className={`text-[8px] font-black uppercase tracking-widest ${selectedPayment === method.id ? "text-blue-600" : "text-slate-400"}`}>{method.name}</span>
                                                    </button>
                                                ))}
                                            </div>

                                            {selectedPayment === "card" && (
                                                <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Number</label>
                                                        <input type="text" placeholder="**** **** **** 0000" className="w-full bg-slate-50 border-none rounded-xl p-3.5 text-xs font-bold focus:ring-2 focus:ring-blue-600 transition-all font-mono" />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry</label>
                                                            <input type="text" placeholder="MM/YY" className="w-full bg-slate-50 border-none rounded-xl p-3.5 text-xs font-bold focus:ring-2 focus:ring-blue-600 transition-all" />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">CVV</label>
                                                            <input type="text" placeholder="***" className="w-full bg-slate-50 border-none rounded-xl p-3.5 text-xs font-bold focus:ring-2 focus:ring-blue-600 transition-all" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {selectedPayment === "cod" && (
                                                <div className="p-6 bg-slate-50 rounded-2xl flex items-center gap-4 animate-in fade-in duration-300">
                                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                                                        <Truck size={20} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-[10px] font-black text-slate-900 uppercase">Cash on Delivery</p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase">Pay securely when you receive your items.</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: Summary */}
                                    <div className="lg:col-span-5 space-y-6 sticky top-0">
                                        <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white shadow-2xl space-y-8">
                                            <h3 className="text-xl font-black uppercase tracking-tighter italic">Order Review</h3>
                                            
                                            <div className="space-y-4 max-h-[200px] overflow-y-auto scrollbar-hide">
                                                {cartItems.map((item, idx) => (
                                                    <div key={idx} className="flex gap-4">
                                                        <div className="w-14 h-14 bg-white/10 rounded-xl overflow-hidden shrink-0">
                                                            <img src={item.image || "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=100"} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="text-[10px] font-black uppercase tracking-tight line-clamp-1">{item.name}</h4>
                                                            <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">${item.price?.toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Coupon Section */}
                                            <div className="pt-8 border-t border-white/10 space-y-4">
                                                <div className="flex gap-2">
                                                    <input 
                                                        type="text" 
                                                        value={couponCode}
                                                        onChange={(e) => setCouponCode(e.target.value)}
                                                        placeholder="COUPON CODE" 
                                                        className="flex-1 bg-white/5 border-none rounded-xl px-4 py-3 text-[9px] font-black uppercase tracking-widest focus:ring-1 focus:ring-blue-500 placeholder:text-white/20" 
                                                    />
                                                    <button 
                                                        onClick={() => { if(couponCode) setIsCouponApplied(true); }}
                                                        className="px-6 py-3 bg-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/20 transition-all"
                                                    >
                                                        Apply
                                                    </button>
                                                </div>
                                                {isCouponApplied && (
                                                    <div className="flex items-center justify-between bg-blue-600/20 text-blue-400 p-3 rounded-xl border border-blue-600/30 animate-in zoom-in-95 duration-300">
                                                        <div className="flex items-center gap-2">
                                                            <Tag size={12} />
                                                            <span className="text-[9px] font-black uppercase tracking-widest">SAV20 Applied (-20%)</span>
                                                        </div>
                                                        <button onClick={() => setIsCouponApplied(false)} className="text-xs font-black">×</button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-4 pt-6 border-t border-white/10">
                                                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <span>Subtotal</span>
                                                    <span className="text-white">${cartItems.reduce((acc, curr) => acc + curr.price, 0).toFixed(2)}</span>
                                                </div>
                                                {isCouponApplied && (
                                                    <div className="flex justify-between items-center text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                                                        <span>Discount</span>
                                                        <span>-${(cartItems.reduce((acc, curr) => acc + curr.price, 0) * 0.2).toFixed(2)}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <span>Tax (15%)</span>
                                                    <span className="text-white">${((cartItems.reduce((acc, curr) => acc + curr.price, 0) - (isCouponApplied ? cartItems.reduce((acc, curr) => acc + curr.price, 0) * 0.2 : 0)) * 0.15).toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <span>Delivery</span>
                                                    <span className="text-emerald-400 italic">FREE</span>
                                                </div>
                                                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                                                    <span className="text-xs font-black uppercase tracking-widest">Payable</span>
                                                    <span className="text-3xl font-black tracking-tighter">
                                                        ${(
                                                            (cartItems.reduce((acc, curr) => acc + curr.price, 0) - (isCouponApplied ? cartItems.reduce((acc, curr) => acc + curr.price, 0) * 0.2 : 0)) * 1.15
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={handleCheckoutSubmit}
                                                className="w-full py-5 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-3 group"
                                                style={{ backgroundColor: primaryColor }}
                                            >
                                                <Lock size={16} /> Confirm & Pay Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {checkoutStep === "success" && (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 text-[#0f172a]">
                            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center border-4 border-green-100">
                                <CheckCircle2 size={48} className="text-green-500" />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter">Order Placed!</h3>
                            <p className="text-xs font-bold opacity-60 leading-relaxed max-w-[250px]">Your order has been successfully processed and sent to the merchant. You will receive an email confirmation shortly.</p>
                            <div className="w-full p-4 bg-slate-50 rounded-xl border border-slate-100 mt-4">
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Order Reference</p>
                                <p className="text-sm font-black tracking-widest">{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
                            </div>
                            <button onClick={closeCart} className="w-full mt-4 py-4 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-lg hover:opacity-90 active:scale-95 transition-all" style={{ backgroundColor: primaryColor }}>Continue Shopping</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Details Modal Overlay */}
            <div className={`fixed inset-0 z-[120] transition-all duration-500 flex items-end md:items-center justify-center ${selectedProduct ? 'visible bg-black/60 backdrop-blur-md' : 'invisible bg-transparent overflow-hidden'}`} onClick={() => setSelectedProduct(null)}>
                <div
                    className={`w-full md:w-[850px] md:max-w-[90vw] bg-white md:rounded-[2rem] transition-transform duration-500 flex flex-col md:flex-row overflow-hidden relative shadow-2xl ${selectedProduct ? 'translate-y-0 md:scale-100' : 'translate-y-full md:translate-y-0 md:scale-95'} rounded-t-[2rem]`}
                    style={{ maxHeight: '85vh' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="absolute top-4 right-4 z-[130] hidden md:block">
                        <button onClick={() => setSelectedProduct(null)} className="w-10 h-10 bg-black/5 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 hover:bg-black/10 transition-colors">
                            <Plus className="rotate-45" size={24} />
                        </button>
                    </div>

                    {/* Mobile Close Handle */}
                    <div className="w-full flex justify-center pt-4 pb-2 md:hidden absolute top-0 z-[130] bg-gradient-to-b from-black/20 to-transparent">
                        <div className="w-12 h-1.5 bg-white/50 rounded-full" />
                    </div>
                    
                    {selectedProduct && (
                        <div className="flex flex-col md:flex-row h-full">
                            {/* Left: Image Gallery */}
                            <div className="w-full md:w-[55%] bg-slate-50 relative shrink-0 overflow-y-auto scrollbar-hide">
                                <div className="w-full aspect-[4/5] md:aspect-auto md:h-[65vh] relative overflow-hidden p-6 md:p-12">
                                    <div className="w-full h-full relative flex items-center justify-center">
                                        <img 
                                            src={activeImage || selectedProduct.image} 
                                            alt={selectedProduct.name} 
                                            className="w-full h-full object-cover rounded-[2rem] shadow-2xl transition-all duration-500" 
                                        />
                                        <div className="absolute top-10 left-10 flex flex-col gap-2">
                                            <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] italic shadow-xl w-fit">New Arrival</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Thumbnails */}
                                <div className="hidden md:flex gap-4 p-12 pt-0">
                                    {(selectedProduct.images && selectedProduct.images.length > 0 ? selectedProduct.images : [selectedProduct.image]).slice(0, 5).map((img: string, i: number) => (
                                        <div 
                                            key={i} 
                                            onClick={() => setActiveImage(img)}
                                            className={`w-20 h-20 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${activeImage === img || (!activeImage && i === 0) ? 'border-blue-600 shadow-lg scale-95' : 'border-slate-100 hover:border-slate-200'}`}
                                        >
                                            <img src={img} className={`w-full h-full object-cover ${activeImage === img || (!activeImage && i === 0) ? 'opacity-100' : 'opacity-50'}`} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Right: Info & Actions */}
                            <div className="w-full md:w-[45%] flex flex-col bg-white overflow-y-auto scrollbar-hide">
                                <div className="p-6 md:p-12 space-y-10">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{selectedProduct.category || 'Premium Collection'}</span>
                                            <div className="flex items-center gap-1 text-amber-400">
                                                <Star size={10} className="fill-amber-400" />
                                                <span className="text-[10px] font-black text-slate-900">4.9</span>
                                                <span className="text-[10px] font-bold text-slate-400">(56 Reviews)</span>
                                            </div>
                                        </div>
                                        <h2 className="text-3xl md:text-5xl font-black text-slate-950 uppercase tracking-tighter leading-none">{selectedProduct.name}</h2>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">BY {storeName} <span className="text-blue-600 ml-1">✓</span></p>
                                    </div>
                                    
                                    <div className="flex items-baseline gap-4">
                                        <span className="text-4xl font-black tracking-tighter text-slate-950">${selectedProduct.price?.toFixed(2)}</span>
                                        {selectedProduct.originalPrice && (
                                            <span className="text-xl font-bold text-slate-300 line-through">${selectedProduct.originalPrice.toFixed(2)}</span>
                                        )}
                                    </div>
                                    
                                    <p className="text-sm text-slate-500 font-bold leading-relaxed">{selectedProduct.description || "Ultra-soft premium essential made from 100% sustainable materials."}</p>
                                    
                                    {/* Options */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Size</h4>
                                        <div className="flex gap-3">
                                            {['S', 'M', 'L', 'XL'].map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`w-12 h-12 rounded-xl text-[10px] font-black transition-all border-2 flex items-center justify-center ${selectedSize === size ? 'bg-slate-950 text-white border-slate-950' : 'bg-white text-slate-400 border-slate-50 hover:border-slate-100'}`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-4">
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => addToCart({ ...selectedProduct, size: selectedSize })}
                                                className="flex-[2] py-5 bg-slate-950 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 group"
                                            >
                                                <ShoppingCart size={16} className="group-hover:-translate-y-1 transition-transform" /> Add to Cart
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    addToCart({ ...selectedProduct, size: selectedSize });
                                                    setCheckoutStep("checkout");
                                                }}
                                                className="flex-1 py-5 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Zap size={16} /> Buy Now
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Trust Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 rounded-2xl bg-slate-50 flex items-center gap-4 border border-slate-100">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-600 shrink-0">
                                                <Truck size={18} />
                                            </div>
                                            <div>
                                                <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-tight">Express Shipping</h4>
                                                <p className="text-[8px] text-slate-400 font-bold uppercase">Next Day</p>
                                            </div>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-slate-50 flex items-center gap-4 border border-slate-100">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-emerald-600 shrink-0">
                                                <ShieldCheck size={18} />
                                            </div>
                                            <div>
                                                <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-tight">2 Year Warranty</h4>
                                                <p className="text-[8px] text-slate-400 font-bold uppercase">100% Genuine</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SIMILAR PRODUCTS Section */}
                                    <div className="pt-12 border-t border-slate-100 space-y-8">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-black uppercase tracking-tighter italic text-slate-950">Similar Products</h3>
                                            <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-600 pb-0.5">See All</button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {merchantProducts.filter((p: any) => p.id !== selectedProduct.id).slice(0, 4).map((p: any, i: number) => (
                                                <div 
                                                    key={p.id || i} 
                                                    className="group cursor-pointer space-y-3"
                                                    onClick={() => setSelectedProduct(p)}
                                                >
                                                    <div className="aspect-[4/5] bg-slate-50 rounded-2xl overflow-hidden relative border border-slate-100">
                                                        <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[10px] font-black uppercase truncate text-slate-900">{p.name}</h4>
                                                        <p className="text-[10px] font-black text-blue-600 mt-1">${p.price?.toFixed(2)}</p>
                                                    </div>
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

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-[150] transition-all duration-300 ${isMobileMenuOpen ? 'visible bg-black/40 backdrop-blur-sm' : 'invisible bg-transparent'}`} onClick={() => setIsMobileMenuOpen(false)}>
                <div className={`absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl transition-transform duration-300 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                        <span className="text-2xl font-black tracking-tight text-slate-900">{storeName}</span>
                        <button onClick={() => setIsMobileMenuOpen(false)}><Plus className="rotate-45 text-slate-400" size={32} /></button>
                    </div>
                    <div className="flex flex-col p-8 gap-8 text-lg font-bold uppercase tracking-widest text-slate-600">
                        <span onClick={() => { setPreviewPage("home"); setIsMobileMenuOpen(false); }} className={`cursor-pointer transition-colors hover:text-slate-900 ${previewPage === 'home' ? 'text-blue-600' : ''}`} style={{ color: previewPage === 'home' ? primaryColor : undefined }}>Home</span>
                        <span onClick={() => { setPreviewPage("collections"); setIsMobileMenuOpen(false); }} className={`cursor-pointer transition-colors hover:text-slate-900 ${previewPage === 'collections' ? 'text-blue-600' : ''}`} style={{ color: previewPage === 'collections' ? primaryColor : undefined }}>Collections</span>
                    </div>
                </div>
            </div>

            {/* Announcement */}
            {showTicker && (
                <div className="overflow-hidden py-3 whitespace-nowrap text-white text-[12px] font-bold uppercase tracking-widest relative z-50 shrink-0" style={{ backgroundColor: tickerColor }}>
                    <div className="flex gap-20 animate-marquee">
                        <span>{tickerText}</span>
                        <span>{tickerText}</span>
                        <span>{tickerText}</span>
                    </div>
                </div>
            )}

            {/* Navbar */}
            <nav className={`sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 z-40 shrink-0`}>
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 shrink-0"><Menu size={24} /></button>
                        {logoUrl ? (
                            <img src={logoUrl} alt="Logo" className="h-8 md:h-10 max-w-[150px] object-contain shrink-0" />
                        ) : (
                            <div className="hidden md:flex w-10 h-10 md:w-12 md:h-12 rounded-xl items-center justify-center shadow-lg shrink-0" style={{ backgroundColor: primaryColor }}>
                                <Sparkles size={20} className="text-white" />
                            </div>
                        )}
                        <span className={`text-lg md:text-2xl font-black tracking-tight truncate`} style={{ color: textColor }}>{storeName}</span>
                    </div>
                    <div className="hidden md:flex gap-10 text-xs md:text-sm font-bold uppercase tracking-widest opacity-60">
                        <span onClick={() => setPreviewPage("home")} className={`cursor-pointer transition-opacity hover:opacity-100 ${previewPage === 'home' ? 'text-slate-900 opacity-100' : ''}`}>home</span>
                        <span onClick={() => setPreviewPage("collections")} className={`cursor-pointer transition-opacity hover:opacity-100 ${previewPage === 'collections' ? 'text-slate-900 opacity-100' : ''}`}>collections</span>
                    </div>
                    <div onClick={() => setIsCartOpen(true)} className={`p-2.5 md:p-3 bg-slate-50 rounded-full border border-slate-100 relative cursor-pointer hover:bg-slate-100 transition-all shrink-0 text-slate-900`}>
                        <ShoppingCart size={20} />
                        <div className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 rounded-full text-white text-[9px] md:text-[10px] flex items-center justify-center font-bold shadow-md" style={{ backgroundColor: primaryColor }}>{cartItems.length}</div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 flex flex-col">
                {previewPage === 'home' && (
                    <div className="flex-1 flex flex-col animate-in fade-in duration-500">
                        {/* HERO SECTION */}
                        {heroLayout === "split" && (
                            <div className="max-w-7xl mx-auto w-full">
                                <div className={`flex flex-col md:flex-row min-h-[60vh] md:min-h-[80vh] items-center`}>
                                    <div className={`p-8 py-16 md:w-1/2 md:p-12 lg:p-24 flex flex-col justify-center space-y-8`}>
                                        <h2 className={`text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9]`} style={{ color: textColor }}>{bannerTitle}</h2>
                                        <p className={`text-sm md:text-lg lg:text-xl opacity-60 font-medium tracking-wide max-w-lg`}>{bannerSubtitle}</p>
                                        <button onClick={() => setPreviewPage("collections")} className="px-12 py-5 text-white rounded-full font-bold uppercase tracking-widest text-xs md:text-sm transition-all hover:opacity-90 w-fit shadow-xl" style={{ backgroundColor: primaryColor }}>{bannerBtn}</button>
                                    </div>
                                    <div className={`w-full md:w-1/2 p-6 md:p-12`}>
                                        <img src={heroImage} className="w-full h-full object-cover rounded-[2rem] md:rounded-[3rem] shadow-2xl min-h-[300px] md:min-h-[500px]" alt="Hero" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {heroLayout === "modern" && (
                            <div className={`flex-1 flex flex-col items-center justify-center text-center p-8 py-16 md:p-24 space-y-10`}>
                                <div className="space-y-6 max-w-5xl">
                                    <h2 className={`text-5xl md:text-8xl font-bold tracking-tight leading-[0.9]`} style={{ color: textColor }}>{bannerTitle}</h2>
                                    <p className={`text-base md:text-xl opacity-60 font-medium tracking-wide mx-auto max-w-3xl`}>{bannerSubtitle}</p>
                                </div>
                                <button onClick={() => setPreviewPage("collections")} className="px-14 py-6 text-white rounded-full font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity shadow-xl" style={{ backgroundColor: primaryColor }}>{bannerBtn}</button>
                                <div className={`w-full max-w-6xl mt-12`}>
                                    <img src={heroImage} className={`w-full h-[400px] md:h-[600px] object-cover rounded-[2rem] md:rounded-[3rem] shadow-2xl`} alt="Hero" />
                                </div>
                            </div>
                        )}

                        {heroLayout === "overlay" && (
                            <div className={`flex-1 relative flex items-center justify-center min-h-[60vh] md:min-h-[80vh]`}>
                                <img src={heroImage} className="absolute inset-0 w-full h-full object-cover" alt="Hero" />
                                <div className="absolute inset-0 bg-black/50" />
                                <div className={`relative z-10 text-center text-white p-8 md:p-16 space-y-10 max-w-4xl`}>
                                    <h2 className={`text-5xl md:text-8xl font-bold tracking-tight leading-[0.9]`}>{bannerTitle}</h2>
                                    <p className={`max-w-2xl mx-auto opacity-80 text-base md:text-2xl`}>{bannerSubtitle}</p>
                                    <button onClick={() => setPreviewPage("collections")} className="px-14 py-6 bg-white text-slate-900 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-slate-100 transition-colors shadow-2xl">{bannerBtn}</button>
                                </div>
                            </div>
                        )}

                        {heroLayout === "minimal" && (
                            <div className={`flex-1 flex flex-col items-center justify-center text-center p-12 md:p-32 space-y-12`}>
                                <div className="space-y-6">
                                    <h2 className={`text-4xl md:text-7xl font-light tracking-[0.2em] uppercase`} style={{ color: textColor }}>{bannerTitle}</h2>
                                    <div className="w-32 h-1 mx-auto rounded-full" style={{ backgroundColor: primaryColor, opacity: 0.5 }} />
                                    <p className="text-sm md:text-base uppercase tracking-[0.4em] opacity-50" style={{ color: textColor }}>{bannerSubtitle}</p>
                                </div>
                                <button onClick={() => setPreviewPage("collections")} className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] border-b-2 pb-2 hover:opacity-70 transition-opacity" style={{ color: primaryColor, borderColor: primaryColor }}>{bannerBtn}</button>
                            </div>
                        )}

                        {heroLayout === "sidebar" && (
                            <div className={`flex-1 flex flex-col md:flex-row min-h-[60vh] md:min-h-[80vh]`}>
                                <div className="flex-1 relative min-h-[400px]">
                                    <img src={heroImage} className="absolute inset-0 w-full h-full object-cover" alt="Hero" />
                                </div>
                                <div className={`w-full md:w-1/3 p-12 md:p-20 bg-slate-900 flex flex-col justify-center text-white space-y-8`}>
                                    <h2 className={`text-5xl font-bold leading-[0.9]`}>{bannerTitle}</h2>
                                    <p className={`opacity-70 text-base leading-relaxed`}>{bannerSubtitle}</p>
                                    <button onClick={() => setPreviewPage("collections")} className="w-full py-5 bg-white text-slate-900 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-slate-100 transition-colors shadow-xl">{bannerBtn}</button>
                                </div>
                            </div>
                        )}

                        {/* FEATURED PRODUCTS */}
                        <div className="bg-white">
                            <div className={`max-w-7xl mx-auto px-8 py-20 md:px-12 lg:px-24`}>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 lg:mb-16 gap-6">
                                    <div>
                                        <h3 className={`text-3xl md:text-5xl font-bold tracking-tight text-slate-900`}>{discoveryTitle}</h3>
                                        <p className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mt-3">Curated from Inventory</p>
                                    </div>
                                    <button onClick={() => setPreviewPage("collections")} className="text-xs font-black uppercase tracking-widest border-b-2 border-slate-900 pb-1 hover:opacity-60 transition-opacity text-slate-900">Shop All Products</button>
                                </div>

                                <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-12`}>
                                {merchantProducts.length === 0 ? (
                                    [1, 2, 3, 4].map((i) => (
                                        <div key={i} className="space-y-6 opacity-20">
                                            <div className="aspect-[4/5] bg-slate-200 rounded-[2rem]" />
                                            <div className="h-4 bg-slate-200 w-3/4 rounded-full" />
                                            <div className="h-4 bg-slate-200 w-1/2 rounded-full" />
                                        </div>
                                    ))
                                ) : (
                                    merchantProducts.slice(0, 4).map((product: any, i: number) => (
                                        <div key={product.id || i} className="group cursor-pointer" onClick={() => setSelectedProduct(product)}>
                                            <div className="aspect-[4/5] bg-slate-50 rounded-[2rem] overflow-hidden relative mb-6 border border-slate-100">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                                        <ImageIcon className="text-slate-300" size={48} />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-base md:text-lg font-bold truncate text-slate-900">{product.name}</h4>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-black" style={{ color: primaryColor }}>${product.price?.toFixed(2)}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.category}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {previewPage === 'collections' && (
                    <div className="bg-white text-slate-900 animate-in fade-in duration-500 min-h-screen">
                        <div className={`max-w-7xl mx-auto px-8 py-16 md:px-12 lg:px-24`}>
                            <div className={`mb-16`}>
                                <h3 className={`text-4xl md:text-6xl font-bold tracking-tight`}>{discoveryTitle}</h3>
                                <p className="opacity-60 mt-4 text-base md:text-lg max-w-2xl">{discoverySubtitle}</p>
                            </div>
                            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16`}>
                            {merchantProducts.length === 0 ? (
                                [1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="space-y-6 opacity-10">
                                        <div className="aspect-[4/5] bg-slate-200 rounded-[2rem]" />
                                        <div className="h-6 bg-slate-200 w-3/4 rounded-full" />
                                        <div className="h-6 bg-slate-200 w-1/2 rounded-full" />
                                    </div>
                                ))
                            ) : (
                                merchantProducts.map((product: any, i: number) => (
                                    <div key={product.id || i} className="group cursor-pointer" onClick={() => setSelectedProduct(product)}>
                                        <div className="aspect-[4/5] bg-slate-50 rounded-[2rem] overflow-hidden relative mb-6 border border-slate-100 shadow-sm">
                                            {product.image ? (
                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                                    <ImageIcon className="text-slate-300" size={64} />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                                            <div className="absolute bottom-8 left-8 right-8 translate-y-20 group-hover:translate-y-0 transition-all duration-500 opacity-0 group-hover:opacity-100">
                                                <button className="w-full py-4 bg-white text-slate-900 rounded-xl text-xs font-bold uppercase tracking-widest shadow-2xl hover:bg-slate-50 active:scale-95 transition-all">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="min-w-0">
                                                <h4 className={`font-bold truncate text-xl text-slate-900`}>{product.name}</h4>
                                                <p className={`text-slate-400 uppercase tracking-widest truncate text-xs mt-1`}>{product.category || 'Premium Collection'}</p>
                                            </div>
                                            <span className="font-bold text-lg shrink-0" style={{ color: primaryColor }}>${product.price?.toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {merchantProducts.length === 0 && (
                            <div className="mt-32 p-16 border-2 border-dashed border-slate-200 rounded-[3rem] text-center max-w-2xl mx-auto">
                                <Box size={64} className="mx-auto text-slate-300 mb-8" />
                                <p className="text-lg font-bold text-slate-500 uppercase tracking-widest">Inventory is currently empty</p>
                                <p className="text-sm text-slate-400 mt-4">Products you add to your inventory will appear here live.</p>
                        </div>
                    )}
                </div>
            </div>
        )}
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
