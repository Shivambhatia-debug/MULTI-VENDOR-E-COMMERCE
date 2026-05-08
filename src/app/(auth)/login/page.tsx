"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, ArrowRight, User, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMerchant } from "@/context/MerchantContext";

type Role = "merchant" | "user";

export default function LoginPage() {
    const [role, setRole] = useState<Role>("merchant");
    const { login: contextLogin } = useMerchant();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // Hard clear old session data
            localStorage.clear();

            const formData = new FormData();
            formData.append('username', email); // FastAPI OAuth2 handles email as 'username'
            formData.append('password', password);

            const response = await fetch('/api/python/auth/login', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Login failed');
            }

            const { access_token } = await response.json();

            // Fetch user profile info
            const userResponse = await fetch('/api/python/auth/me', {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });

            if (!userResponse.ok) throw new Error('Failed to fetch user profile');
            const userData = await userResponse.json();

            contextLogin(access_token, userData);
            
            if (userData.role === "admin") {
                router.push("/admin");
            } else {
                router.push("/dashboard");
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tighter mb-2">Welcome Back</h1>
                <p className="text-sm font-medium text-slate-500">Log in to your {role === "merchant" ? "professional store" : "customer account"}.</p>
            </div>

            {/* Role Switcher */}
            <div className="bg-slate-100 p-1 rounded-2xl flex gap-1">
                <button
                    onClick={() => setRole("merchant")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === "merchant" ? "bg-white text-slate-950 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                >
                    <ShoppingBag size={14} />
                    Merchant
                </button>
                <button
                    onClick={() => setRole("user")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === "user" ? "bg-white text-slate-950 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                >
                    <User size={14} />
                    Customer
                </button>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
                {error && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">
                        {error}
                    </div>
                )}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-950 transition-colors" size={16} />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-slate-300 focus:bg-white transition-all shadow-sm"
                            placeholder="name@example.com"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between items-end">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Password</label>
                        <Link href="/forgot" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-950">Forgot?</Link>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-950 transition-colors" size={16} />
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-slate-300 focus:bg-white transition-all shadow-sm"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button
                    disabled={isLoading}
                    className="w-full bg-slate-950 text-white rounded-2xl py-4 text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isLoading ? "Signing In..." : `Sign In as ${role === "merchant" ? "Merchant" : "Customer"}`} <ArrowRight size={14} />
                </button>
            </form>


            <div className="text-center mt-6">
                <p className="text-xs font-medium text-slate-500">
                    Don't have an account?{" "}
                    <Link href="/get-started" className="text-slate-950 font-black uppercase tracking-tighter hover:underline">
                        Get Started
                    </Link>
                </p>
            </div>
        </div>
    );
}
