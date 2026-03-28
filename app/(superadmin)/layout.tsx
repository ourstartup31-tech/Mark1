"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SuperAdminGroupLayout({ children }: { children: React.ReactNode }) {
    const { role, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && role !== "superadmin") {
            router.push("/login");
        }
    }, [role, isLoading, router]);

    if (isLoading || role !== "superadmin") {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest animate-pulse">
                    Verifying Superadmin Access...
                </p>
            </div>
        );
    }

    return <>{children}</>;
}
