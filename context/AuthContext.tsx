"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type UserRole = "admin" | "customer" | "superadmin" | null;

interface User {
    id: string;
    name: string | null;
    phone: string;
    role: UserRole;
    store_id?: string | null;
}

interface AuthContextType {
    user: User | null;
    role: UserRole;
    sendOtp: (phone: string) => Promise<{ success: boolean; otp?: string; error?: string }>;
    verifyOtp: (phone: string, otp: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    isLoading: boolean;
    apiFetch: (url: string, options?: RequestInit) => Promise<Response>;
    requireAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<UserRole>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const savedToken = localStorage.getItem("supermarket_token");
        const savedUser = localStorage.getItem("supermarket_user");
        
        if (savedToken && savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setToken(savedToken);
                setUser(parsedUser);
                setRole(parsedUser.role);
            } catch (e) {
                console.error("Failed to parse saved user", e);
                logout();
            }
        }
        setIsLoading(false);
    }, []);

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch (e) {
            console.error("Logout API failed", e);
        }
        setToken(null);
        setUser(null);
        setRole(null);
        localStorage.removeItem("supermarket_token");
        localStorage.removeItem("supermarket_user");
        router.push("/login");
    };

    /**
     * Helper to make authenticated API calls
     */
    const apiFetch = async (url: string, options: RequestInit = {}) => {
        const headers = {
            ...options.headers,
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
        } as Record<string, string>;

        const res = await fetch(url, { ...options, headers });
        
        if (res.status === 401) {
            logout();
            return res;
        }
        
        return res;
    };

    const requireAuth = () => {
        if (!user) {
            const currentPath = window.location.pathname + window.location.search;
            router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
            return false;
        }
        return true;
    };

    const sendOtp = async (phone: string) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
            });
            const data = await res.json();
            setIsLoading(false);
            if (!res.ok) return { success: false, error: data.error };
            return { success: true, otp: data.otp };
        } catch (error) {
            setIsLoading(false);
            return { success: false, error: "Failed to send OTP" };
        }
    };

    const verifyOtp = async (phone: string, otp: string) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, otp }),
            });
            const data = await res.json();
            
            if (!res.ok) {
                setIsLoading(false);
                return { success: false, error: data.error };
            }

            localStorage.setItem("supermarket_token", data.token);
            localStorage.setItem("supermarket_user", JSON.stringify(data.user));
            
            setToken(data.token);
            setUser(data.user);
            setRole(data.user.role);
            setIsLoading(false);
            return { success: true };
        } catch (error) {
            setIsLoading(false);
            return { success: false, error: "Verification failed" };
        }
    };

    return (
        <AuthContext.Provider value={{ user, role, sendOtp, verifyOtp, logout, isLoading, apiFetch, requireAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

