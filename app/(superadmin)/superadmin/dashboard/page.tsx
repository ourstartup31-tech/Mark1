"use client";

import React, { useState } from "react";
import { useSuperAdmin } from "@/context/SuperAdminContext";
import { Store, Users, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

const STATUS_STYLES: Record<string, string> = {
    Active: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    Suspended: "bg-amber-50 text-amber-700 border border-amber-100",
    Expired: "bg-red-50 text-red-700 border border-red-100",
};

const PLAN_STYLES: Record<string, string> = {
    Basic: "bg-gray-100 text-gray-600",
    Pro: "bg-indigo-50 text-indigo-700",
    Enterprise: "bg-violet-50 text-violet-700",
};

export default function SuperAdminDashboard() {
    const { stores } = useSuperAdmin();
    const activeStores = stores.filter(s => s.status === "Active").length;
    const expiredStores = stores.filter(s => s.status === "Expired").length;
    const totalAdmins = stores.length; // Assuming 1 admin per store for now

    const metrics = [
        { label: "Total Stores", value: stores.length, icon: Store },
        { label: "Active Stores", value: activeStores, icon: CheckCircle, color: "text-emerald-600" },
        { label: "Expired Stores", value: expiredStores, icon: XCircle, color: "text-red-500" },
        { label: "Total Admin Accounts", value: totalAdmins, icon: Users },
    ];

    return (
        <div className="space-y-10">
            {/* Header Area */}
            <div className="pb-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900">Platform Overview</h2>
                <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">System-wide performance data</p>
            </div>

            {/* Simple Metric Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((m) => (
                    <div key={m.label} className="bg-white border border-slate-200 p-6 rounded shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center border border-slate-100">
                                <m.icon size={16} className={m.color || "text-slate-400"} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.label}</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 tracking-tight">{m.value}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions or Recent Activity (Minimal) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white border border-slate-200 rounded overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Recent Stores</h3>
                    </div>
                    <div className="p-0">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="px-5 py-3 font-semibold text-slate-500">Store Name</th>
                                    <th className="px-5 py-3 font-semibold text-slate-500">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {stores.slice(0, 5).map(s => (
                                    <tr key={s.id}>
                                        <td className="px-5 py-3 text-slate-700 font-medium border-r border-slate-50 last:border-0">{s.name}</td>
                                        <td className="px-5 py-3 last:border-0">
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${STATUS_STYLES[s.status] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                                                {s.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 bg-slate-50/30 border-t border-slate-100 text-center">
                        <Link href="/superadmin/stores" className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-800">
                            View All Stores
                        </Link>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded p-6 flex flex-col justify-center text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 text-slate-400">
                        <Store size={24} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Manage Your Platform</h3>
                    <p className="text-xs text-slate-500 mb-6 max-w-xs mx-auto">Access detailed management tools for stores, admin accounts, and subscriptions using the sidebar.</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/superadmin/stores" className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded hover:bg-slate-800 transition-colors">
                            Manage Stores
                        </Link>
                        <Link href="/superadmin/subscriptions" className="bg-white border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded hover:bg-slate-50 transition-colors">
                            Billing Status
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
