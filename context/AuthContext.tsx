"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
// Deployed Version: 1.0.1
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

                    // Verify session with backend — 10s timeout to prevent infinite loading on mobile
                    console.log("AuthContext: Initializing session check with token...");
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

                    try {
                        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
                            headers: { "Authorization": `Bearer ${savedToken}` },
                            credentials: "include",
                            signal: controller.signal,
                        });
                        clearTimeout(timeoutId);

                        if (!res.ok) {
                            console.warn("AuthContext: Session invalid on backend, logging out");
                            localStorage.removeItem("supermarket_token");
                            localStorage.removeItem("supermarket_user");
                            setToken(null);
                            setUser(null);
                            setRole(null);
                        } else {
                            const data = await res.json();
                            console.log("AuthContext: Session valid, user role:", data.user.role);
                            setUser(data.user);
                            setRole(data.user.role || "customer");
                        }
                    } catch (fetchError: any) {
                        clearTimeout(timeoutId);
                        if (fetchError.name === "AbortError") {
                            // Timeout: trust localStorage data, don't logout
                            console.warn("AuthContext: Session check timed out, trusting local data");
                        } else {
                            console.warn("AuthContext: Session check failed (network error), trusting local data");
                        }
                        // On network failure, keep user logged in with local data
                    }
                } catch (e) {
                    console.error("Failed to parse saved user", e);
                    localStorage.removeItem("supermarket_token");
                    localStorage.removeItem("supermarket_user");
                    setToken(null);
                    setUser(null);
                    setRole(null);
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const logout = async () => {
        // 1. Immediate local cleanup
        setToken(null);
        setUser(null);
        setRole(null);
        localStorage.removeItem("supermarket_token");
        localStorage.removeItem("supermarket_user");

        // 2. Clear local domain cookie
        document.cookie = "supermarket_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax; Secure";

        // 3. Inform backend (fire and forget for better UX)
        fetch(`${API_BASE_URL}/api/auth/logout`, { method: "POST", credentials: "include" }).catch(e => console.error("Logout API background failed", e));

        // 4. Hard redirect for clean state
        window.location.href = "/login";
    };

    /**
     * Helper to make authenticated API calls
     */
    const apiFetch = async (url: string, options: RequestInit = {}) => {
        // Fallback to localStorage if state token isn't ready yet
        const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("supermarket_token") : null);

        const headers = {
            ...options.headers,
            "Content-Type": "application/json",
            ...(activeToken ? { "Authorization": `Bearer ${activeToken}` } : {})
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
            console.log("AuthContext: verifyOtp - user saved to storage:", data.user.id, "Role:", data.user.role);

            // CRITICAL: Force Sync Cookie (v1.0.2)
            // Backend cookie is on .onrender.com, which is NOT visible to Vercel middleware.
            // NOTE: 'Secure' flag only set in production (HTTPS). On HTTP/mobile dev it must be omitted.
            const expires = new Date();
            expires.setDate(expires.getDate() + 7);
            const isSecure = window.location.protocol === "https:";
            const secureFlag = isSecure ? "; Secure" : "";
            document.cookie = `supermarket_token=${data.token}; path=/; expires=${expires.toUTCString()}; samesite=lax${secureFlag}`;

            setToken(data.token);
            setUser(data.user);
            setRole(data.user.role);
            console.log("AuthContext: verifyOtp - state updated, returning success");
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

