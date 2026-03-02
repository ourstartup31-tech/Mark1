"use client";

import React, { useState } from "react";
import { useSuperAdmin } from "@/context/SuperAdminContext";
import MetricCard from "@/components/superadmin/MetricCard";
import { RevenueLineChart } from "@/components/superadmin/Charts";
import { Store, Users, DollarSign, TrendingUp, ShoppingBag, Eye, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

const STATUS_STYLES: Record<string, string> = {
    Active: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    Suspended: "bg-red-50 text-red-600 border border-red-100",
};

const PLAN_STYLES: Record<string, string> = {
    Basic: "bg-gray-100 text-gray-600",
    Pro: "bg-indigo-50 text-indigo-700",
    Enterprise: "bg-violet-50 text-violet-700",
};

export default function SuperAdminDashboard() {
    const { stores, revenueData } = useSuperAdmin();
    const activeStores = stores.filter(s => s.status === "Active").length;
    const totalRevenue = stores.reduce((sum, s) => sum + s.revenue, 0);
    const totalOrders = stores.reduce((sum, s) => sum + s.orders, 0);
    const monthlyRevenue = revenueData[revenueData.length - 1]?.revenue || 0;

    return (
        <div className="space-y-8">
            {/* Welcome banner */}
            <div className="rounded-2xl p-6 text-white relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)" }}>
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
                    style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }} />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3"
                        style={{ background: "rgba(99,102,241,0.25)", color: "#a5b4fc" }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                        Platform Admin
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight mb-1">Good evening, Superadmin 👋</h2>
                    <p className="text-white/60 text-sm">Here&apos;s a snapshot of your platform performance today.</p>
                </div>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
                <MetricCard
                    title="Total Stores"
                    value={stores.length.toString()}
                    icon={<Store size={20} className="text-indigo-600" />}
                    iconBg="rgba(99,102,241,0.12)"
                    trend={{ value: "+2 this month", positive: true }}
                />
                <MetricCard
                    title="Active Stores"
                    value={activeStores.toString()}
                    icon={<CheckCircle size={20} className="text-emerald-600" />}
                    iconBg="rgba(16,185,129,0.12)"
                    trend={{ value: `${Math.round(activeStores / stores.length * 100)}% uptime`, positive: true }}
                />
                <MetricCard
                    title="Total Revenue"
                    value={`₹${(totalRevenue / 100000).toFixed(1)}L`}
                    icon={<DollarSign size={20} className="text-violet-600" />}
                    iconBg="rgba(139,92,246,0.12)"
                    trend={{ value: "+18% YoY", positive: true }}
                />
                <MetricCard
                    title="Monthly Revenue"
                    value={`₹${(monthlyRevenue / 1000).toFixed(0)}K`}
                    icon={<TrendingUp size={20} className="text-indigo-600" />}
                    iconBg="rgba(99,102,241,0.12)"
                    trend={{ value: "+6% MoM", positive: true }}
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-6">
                <MetricCard
                    title="Total Orders (Platform)"
                    value={totalOrders.toLocaleString()}
                    icon={<ShoppingBag size={20} className="text-amber-600" />}
                    iconBg="rgba(245,158,11,0.12)"
                    sub="All stores combined"
                />
                <MetricCard
                    title="Store Admins"
                    value={stores.length.toString()}
                    icon={<Users size={20} className="text-indigo-600" />}
                    iconBg="rgba(99,102,241,0.12)"
                    sub="Registered admin accounts"
                />
            </div>

            {/* Revenue chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="font-bold text-gray-900 text-base">Revenue Growth</h3>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">Monthly platform-wide revenue (Apr 2025 – Mar 2026)</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        Revenue
                    </div>
                </div>
                <RevenueLineChart data={revenueData} height={280} />
            </div>

            {/* Recent stores */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
                    <h3 className="font-bold text-gray-900">Recent Store Registrations</h3>
                    <Link href="/superadmin/stores"
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors">
                        View all <Eye size={13} />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px]">
                        <thead>
                            <tr className="bg-gray-50/50">
                                {["Store Name", "Owner", "Email", "Plan", "Status"].map(h => (
                                    <th key={h} className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest px-6 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {stores.slice(-5).reverse().map(store => (
                                <tr key={store.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xs text-white"
                                                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                                                {store.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">{store.name}</p>
                                                <p className="text-xs text-gray-400">{store.createdDate}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{store.owner}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{store.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${PLAN_STYLES[store.plan]}`}>{store.plan}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 ${STATUS_STYLES[store.status]}`}>
                                            {store.status === "Active" ? <CheckCircle size={11} /> : <XCircle size={11} />}
                                            {store.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
