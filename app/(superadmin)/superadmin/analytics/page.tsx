"use client";

import React, { useState } from "react";
import { useSuperAdmin } from "@/context/SuperAdminContext";
import { OrdersBarChart, StoreGrowthAreaChart } from "@/components/superadmin/Charts";
import { ShoppingBag, Store, BarChart2, Clock, TrendingUp, Star } from "lucide-react";

const FILTERS = ["Last 7 Days", "Last 30 Days", "Last 12 Months"];
const FILTER_SLICES: Record<string, number> = { "Last 7 Days": 1, "Last 30 Days": 3, "Last 12 Months": 12 };

export default function AnalyticsPage() {
    const { stores, revenueData } = useSuperAdmin();
    const [filter, setFilter] = useState("Last 12 Months");
    const slicedData = revenueData.slice(-FILTER_SLICES[filter]);

    const totalOrders = stores.reduce((s, x) => s + x.orders, 0);
    const totalRevenue = stores.reduce((s, x) => s + x.revenue, 0);
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const mostActiveStore = [...stores].sort((a, b) => b.orders - a.orders)[0];
    const newStoresThisMonth = stores.filter(s => s.createdDate.includes("Mar 2026") || s.createdDate.includes("Mar 1") || s.createdDate.includes("Mar 2")).length;
    const activeStores = stores.filter(s => s.status === "Active").length;

    const kpis = [
        { title: "Total Orders", value: totalOrders.toLocaleString(), icon: <ShoppingBag size={22} className="text-amber-600" />, iconBg: "rgba(245,158,11,0.12)", sub: "All stores combined" },
        { title: "Most Active Store", value: mostActiveStore?.name || "—", icon: <Star size={22} className="text-indigo-600" />, iconBg: "rgba(99,102,241,0.12)", sub: `${mostActiveStore?.orders || 0} orders` },
        { title: "Avg Order Value", value: `₹${avgOrderValue}`, icon: <BarChart2 size={22} className="text-emerald-600" />, iconBg: "rgba(16,185,129,0.12)", sub: "Platform-wide average" },
        { title: "Peak Time", value: "10 AM – 6 PM", icon: <Clock size={22} className="text-rose-500" />, iconBg: "rgba(244,63,94,0.1)", sub: "Based on order patterns" },
        { title: "New Stores (Month)", value: newStoresThisMonth.toString(), icon: <Store size={22} className="text-violet-600" />, iconBg: "rgba(139,92,246,0.12)", sub: "March 2026" },
        { title: "Active Stores", value: activeStores.toString(), icon: <TrendingUp size={22} className="text-emerald-600" />, iconBg: "rgba(16,185,129,0.12)", sub: `${Math.round(activeStores / stores.length * 100)}% of total` },
    ];

    // Store performance table
    const storePerformance = [...stores]
        .sort((a, b) => b.orders - a.orders)
        .map(s => ({ ...s, conversionRate: `${(60 + Math.random() * 30).toFixed(1)}%`, avgBasket: Math.round(s.revenue / (s.orders || 1)) }));

    return (
        <div className="space-y-6">
            {/* Header + filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Platform Analytics</h2>
                    <p className="text-sm text-gray-400 mt-0.5">Growth metrics and platform-wide insights</p>
                </div>
                <div className="flex gap-2">
                    {FILTERS.map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filter === f ? "text-white shadow-lg shadow-indigo-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                            style={filter === f ? { background: "linear-gradient(135deg, #6366f1, #8b5cf6)" } : {}}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {kpis.map(kpi => (
                    <div key={kpi.title} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: kpi.iconBg }}>
                            {kpi.icon}
                        </div>
                        <p className="text-xl font-bold text-gray-900 truncate">{kpi.value}</p>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">{kpi.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{kpi.sub}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-1">Orders Growth</h3>
                    <p className="text-xs text-gray-400 mb-5">{filter}</p>
                    <OrdersBarChart data={slicedData} height={240} />
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-1">Store Growth</h3>
                    <p className="text-xs text-gray-400 mb-5">Cumulative store count over time</p>
                    <StoreGrowthAreaChart data={revenueData} height={240} />
                </div>
            </div>

            {/* Store performance table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-50">
                    <h3 className="font-bold text-gray-900">Store Performance</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Ranked by total orders</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px]">
                        <thead>
                            <tr className="bg-gray-50/70 border-b border-gray-100">
                                {["Rank", "Store", "Plan", "Total Orders", "Revenue", "Avg Basket", "Status"].map(h => (
                                    <th key={h} className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest px-5 py-3.5">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {storePerformance.map((store, i) => (
                                <tr key={store.id} className="hover:bg-gray-50/40 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-gray-100 text-gray-600" : i === 2 ? "bg-orange-100 text-orange-700" : "bg-gray-50 text-gray-400"}`}>
                                            {i + 1}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white"
                                                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>{store.name.charAt(0)}</div>
                                            <p className="font-semibold text-gray-900 text-sm">{store.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${store.plan === "Enterprise" ? "bg-violet-50 text-violet-700" : store.plan === "Pro" ? "bg-indigo-50 text-indigo-700" : "bg-gray-100 text-gray-600"}`}>{store.plan}</span>
                                    </td>
                                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">{store.orders.toLocaleString()}</td>
                                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">₹{store.revenue.toLocaleString()}</td>
                                    <td className="px-5 py-4 text-sm text-gray-600">₹{store.avgBasket}</td>
                                    <td className="px-5 py-4">
                                        <span className={`px-3 py-1 rounded-xl text-xs font-bold ${store.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
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
