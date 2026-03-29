"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
    LayoutDashboard, Store, Users, CreditCard, DollarSign,
    BarChart3, Settings, ChevronLeft, ChevronRight, Layers,
    LogOut, X
} from "lucide-react";

const NAV_ITEMS = [
    { href: "/superadmin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/superadmin/stores", label: "Manage Stores", icon: Store },
    { href: "/superadmin/subscriptions", label: "Subscriptions", icon: CreditCard },
    { href: "/superadmin/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
    collapsed: boolean;
    onToggleCollapse: () => void;
    currentPath: string;
    onMobileClose: () => void;
}

export default function SuperAdminSidebar({ collapsed, onToggleCollapse, currentPath, onMobileClose }: SidebarProps) {
    const { logout } = useAuth();

    return (
        <aside className="flex flex-col h-full text-white transition-all duration-300 bg-slate-900 border-r border-slate-800"
            style={{ width: "100%" }}>

            {/* Header */}
            <div className={`flex items-center px-5 h-16 border-b border-white/5 ${collapsed ? "justify-center" : "justify-between"}`}>
                {!collapsed && (
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center flex-shrink-0">
                            <Layers size={18} className="text-white" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-white font-bold text-sm tracking-tight truncate">SuperMart</p>
                            <p className="text-slate-400 text-[9px] font-bold tracking-widest uppercase">Admin Panel</p>
                        </div>
                    </div>
                )}
                {collapsed && (
                    <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center">
                        <Layers size={18} className="text-white" />
                    </div>
                )}
                {/* Mobile close */}
                <button onClick={onMobileClose} className="lg:hidden p-1 text-white/50 hover:text-white transition-colors">
                    <X size={18} />
                </button>
                {/* Desktop collapse toggle */}
                <button onClick={onToggleCollapse}
                    className="hidden lg:flex p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
                {!collapsed && (
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2 mb-3">Platform</p>
                )}
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                    const isActive = currentPath === href || currentPath.startsWith(href + "/");
                    return (
                        <Link key={href} href={href}
                            className={`
                flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 group
                ${isActive
                                    ? "text-white bg-indigo-600 shadow-sm"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                }
                ${collapsed ? "justify-center" : ""}
              `}
                        >
                            <Icon size={18} className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"} />
                            {!collapsed && <span className="truncate">{label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-3 pb-4 border-t border-white/5 pt-4">
                <div className={`flex items-center gap-3 px-3 py-3 rounded-lg bg-white/5 mb-2 ${collapsed ? "justify-center" : ""}`}>
                    <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs uppercase">S</span>
                    </div>
                    {!collapsed && (
                        <div className="min-w-0 flex-1">
                            <p className="text-white text-[11px] font-bold truncate">Superadmin</p>
                            <p className="text-slate-500 text-[10px] truncate uppercase font-medium">Owner Access</p>
                        </div>
                    )}
                </div>
                <button onClick={logout}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-red-600/10 transition-all text-xs font-semibold uppercase tracking-wider ${collapsed ? "justify-center" : ""}`}>
                    <LogOut size={16} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
}
