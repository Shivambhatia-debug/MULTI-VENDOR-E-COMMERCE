"use client";

import React, { useState } from "react";
import { Check, X, Shield, Smartphone, Zap, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useMerchant, MerchantPlan } from "@/context/MerchantContext";
import { useLanguage } from "@/context/LanguageContext";

const pricingSections = [
    {
        title: "E-Commerce Features",
        titleAr: "مميزات المتجر الإلكتروني",
        features: [
            { label: "Free Domain + SSL", labelAr: "إسم نطاق + شهادة حماية مجانية", values: [true, true, true] },
            { label: "Products Management", labelAr: "إدارة المنتجات", values: ["Up to 400", "Up to 1500", "Up to 1500"], valuesAr: ["حتى 400", "حتى 1500", "حتى 1500"] },
            { label: "Orders Management", labelAr: "إدارة الطلبات", values: ["Unlimited", "Unlimited", "Unlimited"], valuesAr: ["غير محدود", "غير محدود", "غير محدود"] },
            { label: "Admin App for Management", labelAr: "تطبيق ذكي لإدارة المتجر", values: [true, true, true] },
            { label: "Stock Management System", labelAr: "نظام إدارة المخزون", values: [true, true, true] },
            { label: "Detailed Sales & Analytics", labelAr: "تقارير المبيعات والإحصاءات", values: [true, true, true] },
        ]
    },
    {
        title: "Payment Features & Commission",
        titleAr: "الدفع والعمولة",
        features: [
            { label: "Cash On Delivery", labelAr: "الدفع عند الاستلام", values: [true, true, true] },
            { label: "Online Payment Gateway", labelAr: "الربط مع بوابة دفع إلكتروني", values: [true, true, true] },
            { label: "0% Commission on All Payments", labelAr: "صفر ٪ عمولة على كل المدفوعات", values: [true, true, true] },
        ]
    },
    {
        title: "Logistics and Other Services",
        titleAr: "الخدمات اللوجستية والخدمات الأخرى",
        features: [
            { label: "Branches Management", labelAr: "إدارة الأفرع", values: ["1", "3", "3"] },
            { label: "Drivers Management", labelAr: "إدارة السائقين", values: ["+25", true, true] },
            { label: "Discount Coupons", labelAr: "قسائم الخصومات", values: ["+25", true, true] },
            { label: "Customers / Guests Listing", labelAr: "قوائم العملاء والزائرين", values: ["+25", true, true] },
            { label: "Customer Wallet", labelAr: "محفظة العميل", values: [false, true, true] },
            { label: "Loyalty Program", labelAr: "برنامج الولاء", values: [false, true, true] },
        ]
    },
    {
        title: "Food & Beverage Features",
        titleAr: "مميزات لمتاجر المأكولات والمشروبات",
        features: [
            { label: "Catering Services", labelAr: "خدمات التجهيزات الغذائية", values: [true, true, true] },
            { label: "Dine In Services", labelAr: "خدمات إدارة طلبات الطاولات", values: [true, true, true] },
            { label: "Table Booking Services", labelAr: "خدمات حجز الطاولات", values: [true, true, true] },
        ]
    },
    {
        title: "Order Notifications",
        titleAr: "إشعارات الطلبات",
        features: [
            { label: "SMS Order Notifications", labelAr: "إشعارات عن طريق الرسائل القصيرة", values: [true, true, true] },
            { label: "Recharge for 1000 messages", labelAr: "شحن رصيد 1000 رسالة", values: ["+145", "+145", "+145"] },
            { label: "Notifications by email", labelAr: "اشعارات عن طريق البريد الالكتروني", values: ["+500", "+500", "+500"] },
        ]
    }
];

const plans = [
    { name: "Basic", nameAr: "الأولى", price: "3500 QAR", icon: Zap, highlight: false },
    { name: "Premium", nameAr: "المميزة", price: "4500 QAR", icon: Shield, highlight: true },
    { name: "Mobile App", nameAr: "تطبيق الجوال", price: "5500 QAR", icon: Smartphone, highlight: false }
];

export default function Pricing() {
    const { activePlan, updatePlan } = useMerchant();
    const { t, language } = useLanguage();
    const [expandedSection, setExpandedSection] = useState<number | null>(null);
    const isAr = language === 'ar';

    return (
        <section className="section-padding py-16 bg-slate-50" id="pricing">
            <div className="max-w-5xl mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <div className="h-5 w-1 bg-slate-950 rounded-full"></div>
                            <h2 className="text-xl font-black text-slate-950 uppercase tracking-tight">{t("packages_pricing")}</h2>
                        </div>
                        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest ml-3">{t("ecommerce_services")}</p>
                    </div>
                    {!isAr && (
                        <div className="text-right" dir="rtl">
                            <h2 className="text-2xl font-black text-slate-950 tracking-tight flex items-center gap-3 justify-end leading-none">
                                <span className="text-slate-400">الإشتراكات</span>
                                <span>| المتاجر الإلكترونية</span>
                            </h2>
                        </div>
                    )}
                </div>

                {/* Pricing Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-xl bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse table-fixed min-w-[750px]">
                            <thead>
                                <tr className="bg-white border-b border-slate-100">
                                    <th className="w-[34%] p-5 text-left bg-slate-50/30">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{t("features_breakdown")}</p>
                                    </th>
                                    {plans.map((plan, i) => (
                                        <th key={i} className={`w-[22%] p-5 text-center ${plan.highlight ? "bg-slate-50 relative" : ""}`}>
                                            {plan.highlight && (
                                                <div className="absolute top-0 inset-x-0 h-1 bg-slate-950"></div>
                                            )}
                                            <div className="flex flex-col items-center gap-2">
                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform hover:scale-110 ${plan.highlight ? "bg-slate-950 text-white shadow-xl shadow-slate-200" : "bg-slate-50 text-slate-400 border border-slate-100"
                                                    }`}>
                                                    <plan.icon size={18} />
                                                </div>
                                                <div className="leading-tight">
                                                    <p className="text-sm font-black text-slate-900">{isAr ? plan.nameAr : plan.name}</p>
                                                </div>
                                                <div className="mt-1">
                                                    <p className="text-xl font-black text-slate-950 leading-none">{plan.price}</p>
                                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{t("per_year")}</p>
                                                </div>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {pricingSections.map((section, sIdx) => {
                                    const isExpanded = expandedSection === sIdx || expandedSection === null;
                                    return (
                                        <React.Fragment key={sIdx}>
                                            {/* Section Header */}
                                            <tr
                                                className="bg-slate-50/80 cursor-pointer group hover:bg-slate-100 transition-colors"
                                                onClick={() => setExpandedSection(expandedSection === sIdx ? null : sIdx)}
                                            >
                                                <td colSpan={4} className="px-6 py-2.5">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-2">
                                                            {expandedSection === sIdx ? <ChevronUp size={13} className="text-slate-950" /> : <ChevronDown size={13} className="text-slate-400" />}
                                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? section.titleAr : section.title}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Features List */}
                                            {isExpanded && section.features.map((feature, fIdx) => (
                                                <tr key={`${sIdx}-${fIdx}`} className="bg-white border-b border-slate-50/50 hover:bg-slate-50/30 group transition-colors">
                                                    <td className="px-8 py-3">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[11px] font-black text-slate-600 group-hover:text-slate-950 transition-colors leading-tight">
                                                                {isAr ? feature.labelAr : feature.label}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    {feature.values.map((val, vIdx) => (
                                                        <td key={vIdx} className={`px-4 py-3 text-center ${plans[vIdx].highlight ? "bg-slate-50/50" : ""}`}>
                                                            <div className="flex items-center justify-center">
                                                                {typeof val === "boolean" ? (
                                                                    val ? (
                                                                        <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center ring-1 ring-emerald-100/50">
                                                                            <Check size={11} strokeWidth={3} />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-300 flex items-center justify-center">
                                                                            <X size={11} strokeWidth={2} />
                                                                        </div>
                                                                    )
                                                                ) : (
                                                                    <span className="text-[10px] font-black text-slate-700 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100/50">
                                                                        {isAr && (feature as any).valuesAr ? (feature as any).valuesAr[vIdx] : val}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                            <tfoot>
                                <tr className="bg-slate-50/20 border-t border-slate-100">
                                    <td className="p-6">
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-[9px] font-black text-slate-950 uppercase tracking-widest leading-relaxed">
                                                {t("ready_to_launch")} <br />{t("choose_your_plan")}
                                            </p>
                                        </div>
                                    </td>
                                    {plans.map((plan, i) => (
                                        <td key={i} className={`p-6 ${plan.highlight ? "bg-slate-50/50" : ""}`}>
                                            <button
                                                onClick={() => updatePlan(plan.name as MerchantPlan)}
                                                className={`w-full py-4 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center shadow-2xl active:scale-95 ${activePlan === plan.name
                                                    ? "bg-slate-200 text-slate-500 cursor-default"
                                                    : plan.highlight
                                                        ? "bg-slate-950 text-white hover:bg-slate-900 shadow-slate-200"
                                                        : "bg-white border-2 border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-white"
                                                    }`}
                                            >
                                                {activePlan === plan.name ? t("current_plan") : t("select")}
                                            </button>
                                        </td>
                                    ))}
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Support Footer - Compact */}
                <div className="mt-8 flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm gap-6">
                    <div className="flex gap-10">
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t("store_builder_label")}</p>
                            <p className="text-xs font-black text-slate-800">golalita.com</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t("email_support")}</p>
                            <p className="text-xs font-black text-slate-800">support@golalita.com</p>
                        </div>
                    </div>
                    <div className={`${isAr ? 'text-left' : 'text-right'}`}>
                        <p className="text-[10px] font-bold text-slate-600 mb-0.5">{t("all_rights_reserved_mn")}</p>
                        <p className="text-[9px] font-medium text-slate-400">{t("pro_saas_ecosystem")}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
