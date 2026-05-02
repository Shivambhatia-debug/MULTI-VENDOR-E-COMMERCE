"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
    children: React.ReactNode;
    requiredRole?: "admin" | "merchant" | "user";
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("golalita_token");
            
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const response = await fetch("/api/python/auth/me", {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error("Session expired");
                }

                const userData = await response.json();
                
                if (requiredRole && userData.role !== requiredRole) {
                    // Redirect to their respective correct dashboard if they have a different role
                    if (userData.role === "admin") router.push("/admin");
                    else if (userData.role === "merchant") router.push("/dashboard");
                    else router.push("/");
                    return;
                }

                setIsAuthorized(true);
            } catch (err) {
                console.error("AUTH_GUARD_ERROR:", err);
                localStorage.removeItem("golalita_token");
                router.push("/login");
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router, requiredRole]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-slate-950 animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Verifying Secure Protocol...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) return null;

    return <>{children}</>;
}
