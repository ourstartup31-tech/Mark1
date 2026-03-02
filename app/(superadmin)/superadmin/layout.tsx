"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import SuperAdminSidebar from "@/components/superadmin/Sidebar";
import SuperAdminHeader from "@/components/superadmin/Header";

export default function SuperAdminDashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const { role, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && role !== "superadmin") {
            router.push("/superadmin/login");
        }
    }, [role, isLoading, router]);

    if (isLoading || role !== "superadmin") {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0f0f1a] gap-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-900 border-t-indigo-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-7 h-7 bg-indigo-600 rounded-lg" />
                    </div>
                </div>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.25em] animate-pulse">
                    Verifying SuperAdmin Access...
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#f8f9fc] overflow-hidden">
            {/* Mobile overlay */}
            {mobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[60] lg:hidden backdrop-blur-sm"
                    onClick={() => setMobileSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
        fixed lg:relative top-0 left-0 z-[70] h-full transition-all duration-300
        ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${sidebarCollapsed ? "lg:w-[72px]" : "lg:w-[260px]"}
        w-[260px]
      `}>
                <SuperAdminSidebar
                    collapsed={sidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed(p => !p)}
                    currentPath={pathname}
                    onMobileClose={() => setMobileSidebarOpen(false)}
                />
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <SuperAdminHeader
                    onMobileMenuOpen={() => setMobileSidebarOpen(true)}
                    sidebarCollapsed={sidebarCollapsed}
                />
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
