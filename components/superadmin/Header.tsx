"use client";

import React from "react";
import { Menu, Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, { title: string; sub: string }> = {
    "/superadmin/dashboard": { title: "Dashboard", sub: "Platform overview & key metrics" },
    "/superadmin/stores": { title: "Stores", sub: "Manage all registered stores" },
    "/superadmin/admins": { title: "Store Admins", sub: "Manage store administrator accounts" },
    "/superadmin/subscriptions": { title: "Subscriptions", sub: "Manage subscription plans" },
    "/superadmin/revenue": { title: "Revenue", sub: "Platform-wide revenue insights" },
    "/superadmin/analytics": { title: "Analytics", sub: "Platform analytics & growth metrics" },
    "/superadmin/settings": { title: "Settings", sub: "Platform configuration & preferences" },
};

export default function SuperAdminHeader({ onMobileMenuOpen }: { onMobileMenuOpen: () => void; sidebarCollapsed: boolean }) {
    const pathname = usePathname();
    const page = PAGE_TITLES[pathname] || { title: "Superadmin", sub: "Platform Control Center" };

    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 lg:px-8 gap-4 flex-shrink-0 shadow-sm shadow-gray-100/60 z-10">
            {/* Mobile menu */}
            <button onClick={onMobileMenuOpen}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                <Menu size={20} />
            </button>

            {/* Page title */}
            <div className="flex-1 min-w-0">
                <h1 className="text-base font-bold text-gray-900 truncate">{page.title}</h1>
                <p className="text-xs text-gray-400 font-medium hidden sm:block truncate">{page.sub}</p>
            </div>

            {/* Search */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-400 w-56">
                <Search size={15} />
                <input placeholder="Search..." className="bg-transparent outline-none text-sm text-gray-600 placeholder-gray-300 w-full" />
            </div>

            {/* Notification */}
            <button className="relative p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 border border-white" />
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                <span className="text-white font-bold text-xs">SA</span>
            </div>
        </header>
    );
}
