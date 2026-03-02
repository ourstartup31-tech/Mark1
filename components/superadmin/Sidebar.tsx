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
    { href: "/superadmin/stores", label: "Stores", icon: Store },
    { href: "/superadmin/admins", label: "Admins", icon: Users },
    { href: "/superadmin/subscriptions", label: "Subscriptions", icon: CreditCard },
    { href: "/superadmin/revenue", label: "Revenue", icon: DollarSign },
    { href: "/superadmin/analytics", label: "Analytics", icon: BarChart3 },
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
        <aside className="flex flex-col h-full text-white transition-all duration-300"
            style={{ background: "linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%)", width: "100%" }}>

            {/* Header */}
            <div className={`flex items-center px-5 h-16 border-b border-white/10 ${collapsed ? "justify-center" : "justify-between"}`}>
                {!collapsed && (
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                            <Layers size={18} className="text-white" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-white font-bold text-sm tracking-tight truncate">SuperMart</p>
                            <p className="text-indigo-400 text-[10px] font-medium tracking-widest uppercase">Control Center</p>
                        </div>
                    </div>
                )}
                {collapsed && (
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                        <Layers size={18} className="text-white" />
                    </div>
                )}
                {/* Mobile close */}
                <button onClick={onMobileClose} className="lg:hidden p-1 text-white/50 hover:text-white transition-colors">
                    <X size={18} />
                </button>
                {/* Desktop collapse toggle */}
                <button onClick={onToggleCollapse}
                    className="hidden lg:flex p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all">
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
                flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group
                ${isActive
                                    ? "text-white"
                                    : "text-white/50 hover:text-white hover:bg-white/5"
                                }
                ${collapsed ? "justify-center" : ""}
              `}
                            style={isActive ? { background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))", borderLeft: "2px solid #6366f1", paddingLeft: collapsed ? "11px" : "11px" } : {}}
                        >
                            <Icon size={18} className={isActive ? "text-indigo-400" : "text-white/40 group-hover:text-white/70"} />
                            {!collapsed && <span className="truncate">{label}</span>}
                            {!collapsed && isActive && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-3 pb-4 border-t border-white/10 pt-4">
                <div className={`flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 mb-2 ${collapsed ? "justify-center" : ""}`}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                        <span className="text-white font-bold text-xs">SA</span>
                    </div>
                    {!collapsed && (
                        <div className="min-w-0 flex-1">
                            <p className="text-white text-xs font-semibold truncate">Superadmin</p>
                            <p className="text-white/40 text-[10px] truncate">superadmin@platform.com</p>
                        </div>
                    )}
                </div>
                <button onClick={logout}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium ${collapsed ? "justify-center" : ""}`}>
                    <LogOut size={16} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
}
