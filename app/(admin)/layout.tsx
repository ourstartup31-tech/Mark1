"use client";

import React, { useEffect } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";
import { Menu, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const { role, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && role !== "admin") {
            router.push("/login");
        }
    }, [role, isLoading, router]);

    if (isLoading || role !== "admin") {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-100 border-t-[#D60000] rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-black rounded-lg" />
                    </div>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] animate-pulse">
                    Authenticating Security Clearance...
                </p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "fixed lg:sticky top-0 left-0 z-[70] h-screen transition-transform duration-300 lg:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                <Header />

                {/* Mobile Header Toggle */}
                <div className="lg:hidden px-10 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-3 bg-black text-white rounded-xl shadow-lg shadow-black/20"
                    >
                        <Menu size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#D60000] rounded-lg" />
                        <span className="font-bold text-sm tracking-widest uppercase">Admin</span>
                    </div>
                </div>

                <main className="flex-1 p-6 lg:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
