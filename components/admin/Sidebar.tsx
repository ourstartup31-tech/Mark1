"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Box,
    ListTree,
    ShoppingBag,
    Users,
    Settings,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Products", href: "/products", icon: Box },
    { label: "Categories", href: "/categories", icon: ListTree },
    { label: "Orders", href: "/orders", icon: ShoppingBag },
    { label: "Staff", href: "/staff", icon: Users },
    { label: "Store Settings", href: "/store-settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-72 bg-black h-screen sticky top-0 flex flex-col transition-all duration-300">
            {/* Logo area */}
            <div className="p-8 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#D60000] rounded-xl flex items-center justify-center">
                        <ShoppingBag className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-lg leading-tight uppercase tracking-widest">
                            Store<span className="text-[#D60000]">Admin</span>
                        </h1>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-0.5">
                            Supermarket v1.0
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300",
                                isActive
                                    ? "bg-[#D60000] text-white shadow-xl shadow-red-600/20"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon size={20} className={cn("transition-colors", isActive ? "text-white" : "group-hover:text-white")} />
                                <span className="font-bold text-sm tracking-tight">{item.label}</span>
                            </div>
                            {isActive && <ChevronRight size={16} className="text-white/50" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Store Badge */}
            <div className="p-8">
                <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">Managed Store</p>
                    <p className="text-white font-bold text-sm">Downtown Market</p>
                    <p className="text-gray-500 text-xs mt-1">Terminal ID: 8820-A</p>
                </div>
            </div>
        </aside>
    );
}
