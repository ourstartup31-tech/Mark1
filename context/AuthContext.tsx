"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type UserRole = "admin" | "customer" | "superadmin" | null;

interface AuthContextType {
    role: UserRole;
    login: (phone: string, pin: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [role, setRole] = useState<UserRole>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Load role from localStorage on mount
        const savedRole = localStorage.getItem("supermarket_role") as UserRole;
        if (savedRole === "admin" || savedRole === "customer" || savedRole === "superadmin") {
            setRole(savedRole);
        }
        setIsLoading(false);
    }, []);

    const login = async (phone: string, pin: string) => {
        setIsLoading(true);
        // Simulate API delay
        await new Promise((r) => setTimeout(r, 1000));

        let userRole: UserRole = null;

        // Demo logic as requested
        if (phone === "8888888888" && pin === "1234") {
            userRole = "superadmin";
        } else if (phone === "9999999999" && pin === "1234") {
            userRole = "admin";
        } else {
            userRole = "customer";
        }

        setRole(userRole);
        localStorage.setItem("supermarket_role", userRole);
        setIsLoading(false);
        return userRole === "admin";
    };

    const logout = () => {
        setRole(null);
        localStorage.removeItem("supermarket_role");
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ role, login, logout, isLoading }}>
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
