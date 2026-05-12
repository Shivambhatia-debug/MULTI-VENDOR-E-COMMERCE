"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

export type MerchantPlan = "Basic" | "Premium" | "Mobile App";

interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    plan: string;
}

interface MerchantContextType {
    user: User | null;
    token: string | null;
    activePlan: MerchantPlan;
    updatePlan: (plan: MerchantPlan) => void;
    login: (token: string, userData: User) => void;
    logout: () => void;
    planLimits: {
        products: number;
        branches: number;
    };
    isAuthenticated: boolean;
    refreshUser: () => Promise<void>;
}

const MerchantContext = createContext<MerchantContextType | undefined>(undefined);

export const MerchantProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [activePlan, setActivePlan] = useState<MerchantPlan>("Basic");
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
    }, []);

    const login = (newToken: string, userData: User) => {
        setToken(newToken);
        setUser(userData);
        setActivePlan(userData.plan as MerchantPlan);
        localStorage.setItem("golalita_token", newToken);
        localStorage.setItem("golalita_user", JSON.stringify(userData));
        localStorage.setItem("golalita_merchant_plan", userData.plan);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("golalita_token");
        localStorage.removeItem("golalita_user");
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
            }
        } catch (err) {
            console.error("REFRESH_USER_ERROR:", err);
        }
    };

    return (
        <MerchantContext.Provider value={{
            user,
            token,
            activePlan,
            updatePlan,
            login,
            logout,
            planLimits,
            isAuthenticated: !!token,
            refreshUser
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
