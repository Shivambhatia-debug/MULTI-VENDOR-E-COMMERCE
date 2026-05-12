"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, Building, ArrowRight, ShieldCheck, ShoppingBag, CheckCircle2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMerchant } from "@/context/MerchantContext";

type Role = "merchant" | "user";
type Step = "form" | "otp";

export default function GetStartedPage() {
    const [role, setRole] = useState<Role>("merchant");
    const [step, setStep] = useState<Step>("form");
    const { login: contextLogin } = useMerchant();
    const router = useRouter();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch(`/api/python/auth/send-otp?email=${encodeURIComponent(email)}`, {
                method: 'POST',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Failed to send OTP');
            }

            setStep("otp");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const registerData = {
                user_in: {
                    name: fullName,
                    email: email,
                    password: password,
                    role: role,
                    plan: "None"
                },
                otp: otp,
                business_name: role === "merchant" ? businessName : undefined
            };

            const response = await fetch(`/api/python/auth/register?otp=${encodeURIComponent(otp)}${role === 'merchant' && businessName ? '&business_name=' + encodeURIComponent(businessName) : ''}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData.user_in),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Registration failed');
            }

            // After registration, auto-login
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const loginResponse = await fetch('/api/python/auth/login', {
                method: 'POST',
                body: formData,
            });

            if (!loginResponse.ok) throw new Error('Auto-login failed. Please login manually.');

            const { access_token } = await loginResponse.json();
            const userResponse = await fetch('/api/python/auth/me', {
                headers: { 'Authorization': `Bearer ${access_token}` }
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
                <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tighter mb-2">
                    {step === "form" ? (role === "merchant" ? "Create Your Store" : "Join Golalita") : "Verify Your Email"}
                </h1>
                <p className="text-sm font-medium text-slate-500">
                    {step === "form" 
                        ? (role === "merchant" ? "Launch your professional commerce engine." : "Start your shopping journey with us today.")
                        : `We've sent a 6-digit code to ${email}`}
                </p>
            </div>

            {step === "form" && (
                <>
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

                    <form className="space-y-5" onSubmit={handleSendOTP}>
                        {error && (
                            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">
                                {error}
                            </div>
                        )}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-950 transition-colors" size={16} />
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-slate-300 focus:bg-white transition-all shadow-sm"
                                    placeholder="Alex Morgan"
                                />
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {role === "merchant" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-1.5 overflow-hidden"
                                >
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Business Name</label>
                                    <div className="relative group">
                                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-950 transition-colors" size={16} />
                                        <input
                                            type="text"
                                            required={role === "merchant"}
                                            value={businessName}
                                            onChange={(e) => setBusinessName(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-slate-300 focus:bg-white transition-all shadow-sm"
                                            placeholder="Noir Studio"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

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
                                    placeholder="alex@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Password</label>
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

                        <div className="pt-2">
                            <p className="text-[9px] text-slate-400 font-medium leading-relaxed mb-6">
                                By signing up, you agree to our <Link href="/terms" className="text-slate-900 font-bold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-slate-900 font-bold hover:underline">Privacy Policy</Link>.
                            </p>
                            <button
                                disabled={isLoading}
                                className="w-full bg-slate-950 text-white rounded-2xl py-4 text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? "Sending OTP..." : "Get Verification Code"} <ArrowRight size={14} />
                            </button>
                        </div>
                    </form>
                </>
            )}

            {step === "otp" && (
                <form className="space-y-6" onSubmit={handleRegister}>
                    {error && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">
                            {error}
                        </div>
                    )}
                    <div className="space-y-1.5 text-center">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Enter 6-Digit Code</label>
                        <input
                            type="text"
                            maxLength={6}
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-6 text-center text-3xl font-black tracking-[0.5em] focus:outline-none focus:border-slate-300 focus:bg-white transition-all shadow-inner"
                            placeholder="000000"
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            disabled={isLoading || otp.length !== 6}
                            className="w-full bg-slate-950 text-white rounded-2xl py-4 text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? "Verifying..." : "Complete Registration"} <CheckCircle2 size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep("form")}
                            className="w-full bg-white text-slate-400 border border-slate-200 rounded-2xl py-4 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                        >
                            <RotateCcw size={14} /> Change Details
                        </button>
                    </div>

                    <div className="text-center">
                        <button 
                            type="button"
                            onClick={handleSendOTP}
                            className="text-[10px] font-black text-slate-950 uppercase tracking-widest hover:underline"
                        >
                            Resend Code
                        </button>
                    </div>
                </form>
            )}

            <div className="text-center mt-6">
                <p className="text-xs font-medium text-slate-500">
                    Already have an account?{" "}
                    <Link href="/login" className="text-slate-950 font-black uppercase tracking-tighter hover:underline">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
}
