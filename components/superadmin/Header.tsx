"use client";

import React from "react";
import { Menu, Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, { title: string; sub: string }> = {
    "/superadmin/dashboard": { title: "Dashboard", sub: "Platform overview & key metrics" },
    "/superadmin/stores": { title: "Stores", sub: "Manage all registered stores" },
    "/superadmin/admins": { title: "Store Admins", sub: "Manage store administrator accounts" },
    "/superadmin/subscriptions": { title: "Subscriptions", sub: "Manage subscription plans" },
    "/superadmin/settings": { title: "Settings", sub: "Platform configuration & preferences" },
};

export default function SuperAdminHeader({ onMobileMenuOpen }: { onMobileMenuOpen: () => void; sidebarCollapsed: boolean }) {
    const pathname = usePathname();
    const page = PAGE_TITLES[pathname] || { title: "Superadmin", sub: "Platform Control Center" };

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 lg:px-8 gap-4 flex-shrink-0 z-10">
            {/* Mobile menu */}
            <button onClick={onMobileMenuOpen}
                className="lg:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                <Menu size={20} />
            </button>

            {/* Page title */}
            <div className="flex-1 min-w-0">
                <h1 className="text-sm font-bold text-slate-900 uppercase tracking-wider truncate">{page.title}</h1>
            </div>

            {/* Search */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-400 w-48 transition-colors focus-within:border-indigo-500 focus-within:bg-white">
                <Search size={14} />
                <input placeholder="Search..." className="bg-transparent outline-none text-xs text-slate-600 placeholder-slate-300 w-full" />
            </div>

            {/* Notification */}
            <button className="relative p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded transition-all">
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500 border border-white" />
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                <span className="text-slate-600 font-bold text-[10px] uppercase">SA</span>
            </div>
        </header>
    );
}
