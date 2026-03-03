"use client";

import React, { useState } from "react";
import { useSuperAdmin } from "@/context/SuperAdminContext";
import { Search } from "lucide-react";

export default function SubscriptionsPage() {
    const { stores } = useSuperAdmin();
    const [search, setSearch] = useState("");

    const filtered = stores.filter(s => {
        const q = search.toLowerCase();
        return s.name.toLowerCase().includes(q);
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wider">Store Subscriptions</h2>
                    <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest">Manage store billing and plan status</p>
                </div>
            </div>

            {/* Filter bar */}
            <div className="flex items-center gap-4 bg-white border border-slate-200 p-4 rounded shadow-sm">
                <div className="relative flex-1 max-w-sm">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search stores..."
                        className="w-full h-9 pl-9 pr-4 rounded border border-slate-200 text-xs text-slate-900 placeholder-slate-300 outline-none focus:border-indigo-500 bg-slate-50/50"
                    />
                </div>
            </div>

            {/* Subscription Table */}
            <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                {["Store Name", "Plan", "Start Date", "Expiry Date", "Status", "Actions"].map(h => (
                                    <th key={h} className="px-5 py-3 font-bold text-slate-500 uppercase tracking-widest border-r border-slate-100 last:border-0">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map(store => (
                                <tr key={store.id} className="hover:bg-slate-50/50">
                                    <td className="px-5 py-4 font-bold text-slate-900 border-r border-slate-50 last:border-0">{store.name}</td>
                                    <td className="px-5 py-4 border-r border-slate-50 last:border-0">
                                        <span className="px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                                            {store.plan}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-slate-500 font-medium border-r border-slate-50 last:border-0">
                                        {store.createdDate}
                                    </td>
                                    <td className="px-5 py-4 text-slate-500 font-medium border-r border-slate-50 last:border-0">
                                        Mar 24, 2027
                                    </td>
                                    <td className="px-5 py-4 border-r border-slate-50 last:border-0">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${store.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                            store.status === "Expired" ? "bg-red-50 text-red-700 border-red-100" :
                                                "bg-slate-100 text-slate-600 border-slate-200"
                                            }`}>
                                            {store.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <button className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:underline">Extend</button>
                                            <button className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:underline">Upgrade</button>
                                            <button className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:underline">Cancel</button>
                                        </div>
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
