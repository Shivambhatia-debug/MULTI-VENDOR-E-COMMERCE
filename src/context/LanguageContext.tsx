"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { dict } from "@/lib/translations";

type Language = "en" | "ar";

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    t: (key: keyof typeof dict) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>("en");

    useEffect(() => {
        // Retrieve saved language from localStorage
        const savedLang = localStorage.getItem("golalita_lang") as Language;
        if (savedLang && (savedLang === "en" || savedLang === "ar")) {
            setLanguage(savedLang);
        }
    }, []);

    useEffect(() => {
        // Update document dir for RTL support when language changes
        document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = language;
        localStorage.setItem("golalita_lang", language);
    }, [language]);

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "en" ? "ar" : "en"));
    };

    const t = (key: keyof typeof dict): string => {
        const entry = dict[key as string];
        if (!entry) return String(key);
        return entry[language];
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
