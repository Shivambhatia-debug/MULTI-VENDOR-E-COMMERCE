"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Globe, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
    const { t, language } = useLanguage();

    return (
        <footer className="bg-slate-900 text-slate-300">
            <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center relative">
                                <Image src="/web background/web background/logo 3 png.png" alt="Golalita" fill className="object-contain" />
                            </div>
                            <span className="text-xl font-bold text-white">Golalita</span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            {t("footer_desc")}
                        </p>
                        <div className={`flex ${language === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                            <a href="#" className="hover:text-blue-500 transition-colors"><MessageCircle size={20} /></a>
                            <a href="#" className="hover:text-blue-400 transition-colors"><Globe size={20} /></a>
                            <a href="#" className="hover:text-pink-500 transition-colors"><MessageCircle size={20} /></a>
                            <a href="#" className="hover:text-blue-600 transition-colors"><MessageCircle size={20} /></a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-6">{t("platform")}</h3>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">{t("store_builder")}</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">{t("marketplace")}</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">{t("vendor_dashboard")}</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">{t("api_reference")}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-6">{t("resources")}</h3>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">{t("documentation")}</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">{t("help_center")}</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">{t("pricing")}</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">{t("case_studies")}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-6">{t("contact_us")}</h3>
                        <p className="text-sm text-slate-400 mb-4">{t("stay_updated")}</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder={t("email_address")}
                                className="bg-slate-800 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                                dir={language === 'ar' ? 'rtl' : 'ltr'}
                            />
                            <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors shrink-0">
                                <Mail size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 shadow-2xl`}>
                    <p>{t("copyright")}</p>
                    <div className={`flex ${language === 'ar' ? 'space-x-reverse space-x-6' : 'space-x-6'}`}>
                        <Link href="#" className="hover:text-white">{t("privacy_policy")}</Link>
                        <Link href="#" className="hover:text-white">{t("terms_of_service")}</Link>
                        <Link href="#" className="hover:text-white">{t("cookie_policy")}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
