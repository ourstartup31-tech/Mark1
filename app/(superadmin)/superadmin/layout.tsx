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
            <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
                <div className="w-10 h-10 border-2 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Authenticating SuperAdmin...
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            {/* Mobile overlay */}
            {mobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-[60] lg:hidden backdrop-blur-sm"
                    onClick={() => setMobileSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
        fixed lg:relative top-0 left-0 z-[70] h-full transition-all duration-300
        ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${sidebarCollapsed ? "lg:w-[68px]" : "lg:w-[240px]"}
        w-[240px]
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
                <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6 lg:p-10">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
