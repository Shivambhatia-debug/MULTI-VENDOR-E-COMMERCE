"use client";

import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import {
    Star,
    ShoppingCart,
    Zap,
    Truck,
    ShieldCheck,
    ChevronRight,
    Heart,
    Share2,
    Clock,
    Award,
    CreditCard,
    Wallet,
    CheckCircle2,
    MessageSquare,
    ThumbsUp,
    ChevronLeft,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isWishlisted = isInWishlist(id);

    const [product, setProduct] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState("M");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [similarProducts, setSimilarProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Fetch product details
                const res = await fetch(`/api/python/public/products/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);
                    setSelectedImage(data.image);
                    
                    // Fetch similar products (placeholder for now, can be improved)
                    const allRes = await fetch("/api/python/public/products");
                    if (allRes.ok) {
                        const allData = await allRes.json();
                        setSimilarProducts(allData.filter((p: any) => p.category === data.category && p.id !== id).slice(0, 4));
                    }
                }
            } catch (err) {
                console.error("PRODUCT_FETCH_ERROR:", err);
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchProduct();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">Product Not Found</h1>
                    <Link href="/products" className="text-blue-600 font-bold uppercase tracking-widest text-xs hover:underline">Back to Shop</Link>
                </div>
            </div>
        );
    }

    const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    return (
        <main className="min-h-screen bg-white">
            <Navbar invert={true} />

            <div className="pt-16 pb-32 sm:pb-12 section-padding">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar">
                    <Link href="/products" className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Marketplace</Link>
                    <ChevronRight size={10} className="text-slate-300" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{product.category}</span>
                    <ChevronRight size={10} className="text-slate-300" />
                    <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest truncate">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                    {/* Left: Image Gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 group">
                            <Image
                                src={(selectedImage || product.image) || "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800"}
                                alt={product.name || "Product Image"}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            {discount > 0 && (
                                <div className="absolute top-6 left-6 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-2xl z-10">
                                    {discount}% OFF
                                </div>
                            )}
                            <button
                                onClick={() => toggleWishlist(product)}
                                className={`absolute top-6 right-6 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md border transition-all shadow-xl z-10 ${isWishlisted ? "bg-red-50 border-red-100 text-red-500" : "bg-white/80 border-white/20 text-slate-400 hover:text-slate-900"}`}
                            >
                                <Heart size={18} className={isWishlisted ? "fill-red-500" : ""} />
                            </button>
                        </div>

                        <div className="grid grid-cols-5 gap-3">
                            {(product.images && product.images.length > 0 ? product.images : [product.image]).slice(0, 5).map((img: string, i: number) => (
                                <div 
                                    key={i} 
                                    onClick={() => setSelectedImage(img)}
                                    className={`aspect-square rounded-xl bg-slate-50 border-2 transition-all cursor-pointer overflow-hidden ${selectedImage === img || (!selectedImage && i === 0) ? "border-blue-600 shadow-lg scale-95" : "border-transparent opacity-50 hover:opacity-100"}`}
                                >
                                    <img src={img || "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=100"} alt={`${product.name} ${i}`} className="object-cover w-full h-full" />
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: Product Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col"
                    >
                        <div className="space-y-5">
                            <div className="flex items-center gap-2">
                                <span className="bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-[0.2em] italic shadow-lg">New Arrival</span>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded-full">
                                    <Star size={9} className="fill-amber-400 text-amber-400" />
                                    <span className="text-[9px] font-black text-slate-900">{product.rating}</span>
                                    <span className="text-[9px] text-slate-400 font-bold ml-1">{product.reviews} Reviews</span>
                                </div>
                            </div>

                            <div>
                                <h1 className="text-3xl lg:text-4xl font-black text-slate-950 uppercase tracking-tighter leading-[0.9] mb-3">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-2">
                                    <Link href={`/stores/m1`} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline italic">
                                        by {product.merchantName || "Verified Store"}
                                    </Link>
                                    <CheckCircle2 size={10} className="text-blue-500" />
                                </div>
                            </div>

                            <div className="flex items-baseline gap-3 py-4 border-y border-slate-100">
                                <span className="text-3xl font-black text-slate-950 uppercase tracking-tighter">QAR {product.price}</span>
                                {product.originalPrice && (
                                    <span className="text-lg font-bold text-slate-300 line-through">QAR {product.originalPrice}</span>
                                )}
                            </div>

                            <p className="text-xs text-slate-500 font-bold leading-snug max-w-xl">
                                {product.description || "Experience unprecedented performance and luxury with our latest release."}
                            </p>

                            {/* Options Mockup */}
                            {product.category === "Apparel" && (
                                <div className="space-y-3">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Size</span>
                                    <div className="flex gap-2">
                                        {["S", "M", "L", "XL"].map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${selectedSize === size ? "bg-slate-950 text-white shadow-xl scale-110" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CTAs */}
                            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl p-4 border-t border-slate-100 flex gap-3 z-40 sm:relative sm:bg-transparent sm:p-0 sm:border-none sm:pt-2">
                                <button
                                    onClick={() => addToCart(product, 1)}
                                    className="flex-[2] bg-slate-950 text-white py-4 rounded-xl text-[9px] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95"
                                >
                                    <ShoppingCart size={14} /> Add to Cart
                                </button>
                                <button
                                    onClick={() => {
                                        addToCart(product, 1);
                                        router.push("/checkout");
                                    }}
                                    className="flex-1 bg-blue-600 text-white py-4 rounded-xl text-[9px] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95"
                                >
                                    <Zap size={14} className="fill-white" /> Buy Now
                                </button>
                            </div>

                            {/* Trust Elements */}
                            <div className="grid grid-cols-2 gap-3 pt-6">
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-blue-600 shrink-0">
                                        <Truck size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-tight">Express Shipping</h4>
                                        <p className="text-[8px] text-slate-400 font-bold uppercase">{product.deliveryTime || "2-3 Days"}</p>
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-green-600 shrink-0">
                                        <ShieldCheck size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-tight">2 Year Warranty</h4>
                                        <p className="text-[8px] text-slate-400 font-bold uppercase">100% Genuine</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Tabs / Detailed Sections */}
                <div className="mt-20 space-y-16">
                    {/* Reviews Section */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tighter italic">Voice of Community</h2>
                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Based on {product.reviews} real experiences</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {/* Review Form */}
                            <div className="lg:col-span-1 bg-slate-50 rounded-[2rem] p-8 border border-slate-100 overflow-hidden">
                                <h3 className="text-lg font-black uppercase tracking-tighter mb-4 italic">Write a Review</h3>
                                <form className="space-y-4">
                                    <div className="flex gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} size={14} className="text-slate-300 hover:text-amber-400 hover:fill-amber-400 cursor-pointer transition-colors" />
                                        ))}
                                    </div>
                                    <input type="text" placeholder="Subject" className="w-full bg-white border-none rounded-xl p-3 text-[10px] font-bold focus:ring-2 focus:ring-blue-600 transition-all placeholder:uppercase placeholder:tracking-widest" />
                                    <textarea rows={4} placeholder="Experience..." className="w-full bg-white border-none rounded-xl p-3 text-[10px] font-bold focus:ring-2 focus:ring-blue-600 transition-all placeholder:uppercase placeholder:tracking-widest" />
                                    <button className="w-full bg-slate-950 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all">Submit Review</button>
                                </form>
                            </div>

                            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2].map((i) => (
                                    <div key={i} className="space-y-3 p-6 rounded-2xl border border-slate-50 bg-white shadow-sm">
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} size={8} className="fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-600 font-medium italic leading-relaxed">
                                            "Absolutely incredible quality. Exceeded all my expectations."
                                        </p>
                                        <div className="flex items-center gap-2 pt-2">
                                            <div className="w-8 h-8 bg-slate-100 rounded-full" />
                                            <div>
                                                <h4 className="text-[9px] font-black text-slate-950 uppercase">Shivalik R.</h4>
                                                <p className="text-[8px] text-slate-400 font-bold uppercase">Verified Buyer</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Payment & Security Section */}
                    <section className="bg-slate-950 rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden">
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em]">Encrypted Checkout</span>
                                </div>
                                <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter italic leading-none mb-8">
                                    Secure Payments<br />
                                    <span className="text-white/40">Guaranteed.</span>
                                </h2>
                                <p className="text-slate-400 text-sm font-bold leading-relaxed mb-10 max-w-md">
                                    We support multiple payment methods including local gateways and international cards, ensuring your transaction is safe and smooth.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <div className="px-6 py-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                                        <CreditCard size={16} className="text-blue-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Visa / Master</span>
                                    </div>
                                    <div className="px-6 py-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                                        <Wallet size={16} className="text-amber-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">QPay Qatar</span>
                                    </div>
                                    <div className="px-6 py-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                                        <Zap size={16} className="text-indigo-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Apple Pay</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { title: "256-bit SSL", desc: "Military grade encryption", icon: ShieldCheck },
                                    { title: "Buyer Protection", desc: "45 Days full refund policy", icon: Award },
                                    { title: "Fraud Guard", desc: "Real-time AI monitoring", icon: CheckCircle2 },
                                    { title: "Dedicated Support", desc: "24/7 Premium assistance", icon: MessageSquare },
                                ].map((badge, i) => (
                                    <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                                        <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400">
                                            <badge.icon size={24} />
                                        </div>
                                        <h4 className="text-xs font-black uppercase tracking-tight">{badge.title}</h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase leading-tight">{badge.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
                    </section>

                    {/* Similar Products */}
                    {similarProducts.length > 0 && (
                        <section>
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tighter italic">You May Also Like</h2>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Based on your current interest</p>
                                </div>
                                <Link href="/products" className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                                    View Catalog <ChevronRight size={14} />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {similarProducts.map((p) => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>

        </main>
    );
}
