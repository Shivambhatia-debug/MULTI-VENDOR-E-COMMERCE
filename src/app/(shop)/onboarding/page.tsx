"use client";

import { useState } from "react";
import { Check, ArrowRight, ArrowLeft, Building2, User, CreditCard, Rocket } from "lucide-react";
import Link from "next/link";

const steps = ["Account", "Choose Plan", "Store Details"];

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState("Professional");

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <nav className="h-16 flex items-center px-8 bg-white border-b border-slate-200">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">G</span>
                    </div>
                    <span className="font-bold text-slate-900 tracking-tight">Golalita</span>
                </Link>
            </nav>

            <main className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="max-w-xl w-full">
                    {/* Stepper */}
                    <div className="flex justify-between mb-12 relative">
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
                        {steps.map((step, i) => (
                            <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${currentStep > i + 1 ? "bg-blue-600 border-blue-600 text-white" :
                                        currentStep === i + 1 ? "bg-white border-blue-600 text-blue-600" : "bg-white border-slate-200 text-slate-400"
                                    }`}>
                                    {currentStep > i + 1 ? <Check size={18} /> : <span>{i + 1}</span>}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${currentStep === i + 1 ? "text-blue-600" : "text-slate-400"
                                    }`}>{step}</span>
                            </div>
                        ))}
                    </div>

                    {/* Step Content */}
                    <div className="card-saas p-8">
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="text-center mb-8">
                                    <h2 className="text-xl font-bold text-slate-900">Create your account</h2>
                                    <p className="text-sm text-slate-500">Join 12,000+ merchants powering their growth.</p>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Full Name</label>
                                        <input type="text" placeholder="John Doe" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-600" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Email Address</label>
                                        <input type="email" placeholder="john@example.com" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-600" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Password</label>
                                        <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-600" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="text-center mb-8">
                                    <h2 className="text-xl font-bold text-slate-900">Choose your plan</h2>
                                    <p className="text-sm text-slate-500">You can change this later in your dashboard.</p>
                                </div>
                                <div className="space-y-3">
                                    {["Starter", "Professional", "Enterprise"].map((plan) => (
                                        <button
                                            key={plan}
                                            onClick={() => setSelectedPlan(plan)}
                                            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${selectedPlan === plan ? "border-blue-600 bg-blue-50/50" : "border-slate-100 hover:border-slate-200"
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedPlan === plan ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
                                                    }`}>
                                                    <CreditCard size={16} />
                                                </div>
                                                <span className={`text-sm font-bold ${selectedPlan === plan ? "text-blue-600" : "text-slate-600"}`}>{plan}</span>
                                            </div>
                                            {selectedPlan === plan && <Check className="text-blue-600" size={18} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-6 text-center">
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Rocket size={32} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Building your store...</h2>
                                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                                    We're setting up your workspace and marketplace presence on the <b>{selectedPlan}</b> plan.
                                </p>
                            </div>
                        )}

                        <div className="mt-10 flex gap-4">
                            {currentStep > 1 && (
                                <button
                                    onClick={() => setCurrentStep(currentStep - 1)}
                                    className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-50"
                                >
                                    Back
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    if (currentStep < 3) setCurrentStep(currentStep + 1);
                                    else window.location.href = "/dashboard";
                                }}
                                className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                            >
                                {currentStep === 3 ? "Launch Dashboard" : "Continue"} <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
