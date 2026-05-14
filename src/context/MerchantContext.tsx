"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

export type MerchantPlan = "Basic" | "Premium" | "Mobile App" | "Enterprise";

interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    plan: string;
    subscription_status: string;
    trial_end?: string;
    subscription_paid_at?: string;
}

interface MerchantInfo {
    id: string;
    name: string;
    email: string;
    phone?: string;
    logo?: string;
    business_type?: string;
    description?: string;
    address?: string;
    status: string;
    plan: string;
    joined: string;
    category: string;
}

interface MerchantContextType {
    user: User | null;
    token: string | null;
    activePlan: MerchantPlan;
    subscriptionStatus: string;
    isTrialActive: boolean;
    trialRemainingDays: number;
    updatePlan: (plan: MerchantPlan) => void;
    login: (token: string, userData: User) => void;
    logout: () => void;
    planLimits: {
        products: number;
        branches: number;
    };
    isAuthenticated: boolean;
    refreshUser: () => Promise<void>;
    merchantInfo: MerchantInfo | null;
}

const MerchantContext = createContext<MerchantContextType | undefined>(undefined);

export const MerchantProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [activePlan, setActivePlan] = useState<MerchantPlan>("Basic");
    const [merchantInfo, setMerchantInfo] = useState<MerchantInfo | null>(null);
    const router = useRouter();

    useEffect(() => {
        const savedToken = localStorage.getItem("golalita_token");
        const savedUser = localStorage.getItem("golalita_user");
        const savedPlan = localStorage.getItem("golalita_merchant_plan");

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        if (savedPlan) {
            setActivePlan(savedPlan as MerchantPlan);
        }

        const savedMerchantInfo = localStorage.getItem("golalita_merchant_info");
        if (savedMerchantInfo) {
            setMerchantInfo(JSON.parse(savedMerchantInfo));
        }
    }, []);

    const login = (newToken: string, userData: User) => {
        setToken(newToken);
        setUser(userData);
        setActivePlan(userData.plan as MerchantPlan);
        localStorage.setItem("golalita_token", newToken);
        localStorage.setItem("golalita_user", JSON.stringify(userData));
        localStorage.setItem("golalita_merchant_plan", userData.plan);
        // Refresh merchant info after login
        refreshMerchantInfo(newToken);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setMerchantInfo(null);
        localStorage.removeItem("golalita_token");
        localStorage.removeItem("golalita_user");
        localStorage.removeItem("golalita_merchant_info");
        localStorage.removeItem("golalita_merchant_plan");
        router.push("/login");
    };

    const updatePlan = (plan: MerchantPlan) => {
        setActivePlan(plan);
        localStorage.setItem("golalita_merchant_plan", plan);
    };

    const planLimits = {
        products: activePlan === "Basic" ? 400 : 1500,
        branches: activePlan === "Basic" ? 1 : 3,
    };

    const refreshUser = async () => {
        if (!token) return;
        try {
            const res = await fetch("/api/python/auth/me", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
                setActivePlan(userData.plan as MerchantPlan);
                localStorage.setItem("golalita_user", JSON.stringify(userData));
                localStorage.setItem("golalita_merchant_plan", userData.plan);
                
                // Also refresh merchant info
                refreshMerchantInfo(token);
            }
        } catch (err) {
            console.error("REFRESH_USER_ERROR:", err);
        }
    };

    const refreshMerchantInfo = async (authToken: string) => {
        try {
            const res = await fetch("/api/python/merchants/me", {
                headers: { "Authorization": `Bearer ${authToken}` }
            });
            if (res.ok) {
                const info = await res.json();
                setMerchantInfo(info);
                localStorage.setItem("golalita_merchant_info", JSON.stringify(info));
            }
        } catch (err) {
            console.error("REFRESH_MERCHANT_INFO_ERROR:", err);
        }
    };

    useEffect(() => {
        if (token && !merchantInfo) {
            refreshMerchantInfo(token);
        }
    }, [token]);

    const subscriptionStatus = user?.subscription_status || "none";
    
    let isTrialActive = false;
    let trialRemainingDays = 0;
    
    if (user?.trial_end) {
        const end = new Date(user.trial_end);
        const now = new Date();
        if (now < end) {
            isTrialActive = true;
            trialRemainingDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        }
    }

    return (
        <MerchantContext.Provider value={{
            user,
            token,
            activePlan,
            subscriptionStatus,
            isTrialActive,
            trialRemainingDays,
            updatePlan,
            login,
            logout,
            planLimits,
            isAuthenticated: !!token,
            refreshUser,
            merchantInfo
        }}>
            {children}
        </MerchantContext.Provider>
    );
};

export const useMerchant = () => {
    const context = useContext(MerchantContext);
    if (context === undefined) {
        throw new Error("useMerchant must be used within a MerchantProvider");
    }
    return context;
};
