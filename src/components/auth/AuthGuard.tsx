"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Sparkles } from "lucide-react";
import Link from "next/link";

interface AuthGuardProps {
    children: React.ReactNode;
    requiredRole?: "admin" | "merchant" | "user";
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(true);
    const [lockReason, setLockReason] = useState<"expired" | "none" | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("golalita_token");
            
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const response = await fetch("/api/python/auth/me", {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error("Session expired");
                }

                const userData = await response.json();
                
                if (requiredRole && userData.role !== requiredRole) {
                    if (userData.role === "admin") router.push("/admin");
                    else if (userData.role === "merchant") router.push("/dashboard");
                    else router.push("/");
                    return;
                }

                // Subscription Check for Merchants
                if (userData.role === "merchant") {
                    const status = userData.subscription_status;
                    const trialEnd = userData.trial_end;
                    
                    if (status === "none") {
                        setIsSubscribed(false);
                        setLockReason("none");
                    } else if (status === "trial" && trialEnd) {
                        const end = new Date(trialEnd);
                        const now = new Date();
                        if (now > end) {
                            setIsSubscribed(false);
                            setLockReason("expired");
                        }
                    }
                }

                setIsAuthorized(true);
            } catch (err) {
                console.error("AUTH_GUARD_ERROR:", err);
                localStorage.removeItem("golalita_token");
                router.push("/login");
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router, requiredRole]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-slate-950 animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Verifying Secure Protocol...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) return null;

    if (!isSubscribed) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 border border-slate-100 text-center space-y-8">
                    <div className="w-20 h-20 bg-slate-950 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-slate-200">
                        <Lock size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tighter italic">Protocol Locked</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Subscription Authorization Required</p>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        {lockReason === "expired" 
                            ? "Your 15-day free trial has concluded. To maintain access to your merchant dashboard and store management tools, please authorize a plan purchase." 
                            : "You are currently operating without an active subscription. Please select and authorize a plan to initialize your merchant ecosystem."}
                    </p>
                    <div className="space-y-3 pt-4">
                        <Link href="/packages" className="block w-full py-4 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-slate-950/20 transition-all active:scale-95">
                            Explore Packages
                        </Link>
                        <button 
                            onClick={() => {
                                localStorage.removeItem("golalita_token");
                                router.push("/login");
                            }} 
                            className="block w-full py-4 bg-white text-slate-400 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-slate-950 hover:border-slate-950 transition-all"
                        >
                            Deauthorize Session
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
