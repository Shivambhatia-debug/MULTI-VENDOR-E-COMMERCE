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
            router.push("/dashboard");

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

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                    <span className="bg-white px-4 text-slate-400">Or Continue With</span>
                </div>
            </div>

            <div className="grid grid-cols-1">
                <button className="flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-2xl py-4 hover:bg-slate-50 transition-all group shadow-sm">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Continue with Google</span>
                </button>
            </div>

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
