"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, ArrowRight, CheckCircle2, RotateCcw, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

type Step = "email" | "otp";

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<Step>("email");
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch(`/api/python/auth/forgot-password?email=${encodeURIComponent(email)}`, {
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

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch(`/api/python/auth/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}&new_password=${encodeURIComponent(newPassword)}`, {
                method: 'POST',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Failed to reset password');
            }

            setSuccess("Password reset successfully! Redirecting to login...");
            setTimeout(() => {
                router.push("/login");
            }, 3000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck size={32} className="text-slate-950" />
                </div>
                <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tighter mb-2">
                    {step === "email" ? "Reset Password" : "Check Your Email"}
                </h1>
                <p className="text-sm font-medium text-slate-500">
                    {step === "email" 
                        ? "Enter your email to receive a recovery code." 
                        : `We've sent a 6-digit code to ${email}`}
                </p>
            </div>

            {success ? (
                <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100 text-center space-y-4">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                    <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">{success}</p>
                </div>
            ) : (
                <>
                    {step === "email" && (
                        <form className="space-y-5" onSubmit={handleSendOTP}>
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
                                        placeholder="alex@example.com"
                                    />
                                </div>
                            </div>

                            <button
                                disabled={isLoading}
                                className="w-full bg-slate-950 text-white rounded-2xl py-4 text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? "Sending OTP..." : "Get Recovery Code"} <ArrowRight size={14} />
                            </button>
                        </form>
                    )}

                    {step === "otp" && (
                        <form className="space-y-6" onSubmit={handleResetPassword}>
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

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">New Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-950 transition-colors" size={16} />
                                    <input
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-slate-300 focus:bg-white transition-all shadow-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    disabled={isLoading || otp.length !== 6 || newPassword.length < 4}
                                    className="w-full bg-slate-950 text-white rounded-2xl py-4 text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isLoading ? "Resetting..." : "Reset Password"} <CheckCircle2 size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep("email")}
                                    className="w-full bg-white text-slate-400 border border-slate-200 rounded-2xl py-4 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                                >
                                    <RotateCcw size={14} /> Change Email
                                </button>
                            </div>
                        </form>
                    )}
                </>
            )}

            <div className="text-center mt-6">
                <p className="text-xs font-medium text-slate-500">
                    Remember your password?{" "}
                    <Link href="/login" className="text-slate-950 font-black uppercase tracking-tighter hover:underline">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
}
