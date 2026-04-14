"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

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
        const initAuth = async () => {
            const savedToken = localStorage.getItem("supermarket_token");
            const savedUser = localStorage.getItem("supermarket_user");
            
            if (savedToken && savedUser) {
                try {
                    const parsedUser = JSON.parse(savedUser);
                    setToken(savedToken);
                    setUser(parsedUser);
                    setRole(parsedUser.role);

                    // Verify session with backend (via cookie AND Bearer token for cross-domain reliability)
                    console.log("AuthContext: Initializing session check with token...");
                    const res = await fetch(`${API_BASE_URL}/api/auth/me`, { 
                        headers: { "Authorization": `Bearer ${savedToken}` },
                        credentials: "include" 
                    });

                    if (!res.ok) {
                        console.warn("AuthContext: Session invalid on backend, logging out");
                        logout();
                    } else {
                        const data = await res.json();
                        console.log("AuthContext: Session valid, user role:", data.user.role);
                        setUser(data.user);
                        setRole(data.user.role || "customer");
                    }
                } catch (e) {
                    console.error("Failed to parse saved user", e);
                    logout();
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const logout = async () => {
        try {
            await fetch(`${API_BASE_URL}/api/auth/logout`, { method: "POST", credentials: "include" });
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

        const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
        const res = await fetch(fullUrl, { ...options, headers, credentials: "include" });
        
        if (res.status === 401 && !isLoading) {
            logout();
            return res;
        }
        
        return res;
    };

    const requireAuth = () => {
        if (isLoading) return true; // Wait for auth state to load
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
            const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
                credentials: "include"
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
            const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, otp }),
                credentials: "include"
            });
            const data = await res.json();
            
            if (!res.ok) {
                setIsLoading(false);
                return { success: false, error: data.error };
            }

            localStorage.setItem("supermarket_token", data.token);
            localStorage.setItem("supermarket_user", JSON.stringify(data.user));
            
            // CRITICAL: Set cookie manually on the frontend domain so middleware can see it
            // Backend cookie is on .onrender.com, which is NOT visible to Vercel middleware.
            const expires = new Date();
            expires.setDate(expires.getDate() + 7);
            document.cookie = `supermarket_token=${data.token}; path=/; expires=${expires.toUTCString()}; samesite=lax; Secure`;

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

