"use client";

import React, { useState } from "react";
import { useSuperAdmin } from "@/context/SuperAdminContext";
import { RevenueAndOrdersChart, OrdersBarChart } from "@/components/superadmin/Charts";
import { DollarSign, TrendingUp, ShoppingBag, BarChart2 } from "lucide-react";

const FILTERS = ["Last 7 Days", "Last 30 Days", "Last 12 Months"];
const FILTER_SLICES: Record<string, number> = { "Last 7 Days": 1, "Last 30 Days": 3, "Last 12 Months": 12 };

const PLAN_COLORS: Record<string, string> = {
    Basic: "bg-gray-400",
    Pro: "bg-indigo-500",
    Enterprise: "bg-violet-600",
};

export default function RevenuePage() {
    const { stores, revenueData, plans } = useSuperAdmin();
    const [filter, setFilter] = useState("Last 12 Months");
    const slicedData = revenueData.slice(-FILTER_SLICES[filter]);

    const totalRevenue = stores.reduce((s, x) => s + x.revenue, 0);
    const totalOrders = stores.reduce((s, x) => s + x.orders, 0);
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const currentMonthRevenue = revenueData[revenueData.length - 1]?.revenue || 0;

    // Revenue by plan
    const revenueByPlan = plans.map(plan => {
        const planStores = stores.filter(s => s.plan === plan.name);
        const planRevenue = planStores.reduce((sum, s) => sum + s.revenue, 0);
        const planCommission = Math.round(planRevenue * plan.commission / 100);
        return { name: plan.name, revenue: planRevenue, commission: planCommission, stores: planStores.length };
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Revenue</h2>
                    <p className="text-sm text-gray-400 mt-0.5">Platform-wide revenue insights</p>
                </div>
                {/* Filter */}
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

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: "Lifetime Revenue", value: `₹${(totalRevenue / 100000).toFixed(2)}L`, icon: <DollarSign size={20} className="text-violet-600" />, iconBg: "rgba(139,92,246,0.12)" },
                    { title: "This Month", value: `₹${(currentMonthRevenue / 1000).toFixed(0)}K`, icon: <TrendingUp size={20} className="text-indigo-600" />, iconBg: "rgba(99,102,241,0.12)" },
                    { title: "Total Orders", value: totalOrders.toLocaleString(), icon: <ShoppingBag size={20} className="text-amber-600" />, iconBg: "rgba(245,158,11,0.12)" },
                    { title: "Avg Order Value", value: `₹${avgOrderValue}`, icon: <BarChart2 size={20} className="text-emerald-600" />, iconBg: "rgba(16,185,129,0.12)" },
                ].map(card => (
                    <div key={card.title} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: card.iconBg }}>
                            {card.icon}
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">{card.title}</p>
                    </div>
                ))}
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="font-bold text-gray-900">Revenue Trend</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{filter}</p>
                    </div>
                </div>
                <RevenueAndOrdersChart data={slicedData} height={280} />
            </div>

            {/* Two-panel: Revenue by Plan + Revenue by Store */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue by Plan */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-50">
                        <h3 className="font-bold text-gray-900">Revenue by Plan</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        {revenueByPlan.map(plan => {
                            const pct = totalRevenue > 0 ? Math.round(plan.revenue / totalRevenue * 100) : 0;
                            return (
                                <div key={plan.name}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2.5 h-2.5 rounded-full ${PLAN_COLORS[plan.name]}`} />
                                            <span className="text-sm font-semibold text-gray-900">{plan.name}</span>
                                            <span className="text-xs text-gray-400">({plan.stores} stores)</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900">₹{plan.revenue.toLocaleString()}</p>
                                            <p className="text-xs text-emerald-600 font-semibold">₹{plan.commission.toLocaleString()} commission</p>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${PLAN_COLORS[plan.name]} transition-all duration-700`} style={{ width: `${pct}%` }} />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-0.5 text-right">{pct}%</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Revenue by Store */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-50">
                        <h3 className="font-bold text-gray-900">Top Stores by Revenue</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {[...stores].sort((a, b) => b.revenue - a.revenue).slice(0, 6).map((store, i) => (
                            <div key={store.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/40 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-gray-300 w-5">#{i + 1}</span>
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white"
                                        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                                        {store.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{store.name}</p>
                                        <p className="text-xs text-gray-400">{store.plan} plan</p>
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-gray-900">₹{store.revenue.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Orders chart */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="mb-5">
                    <h3 className="font-bold text-gray-900">Orders Breakdown</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Monthly order volume</p>
                </div>
                <OrdersBarChart data={slicedData} height={240} />
            </div>
        </div>
    );
}
