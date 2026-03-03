"use client";

import React, { useState } from "react";
import { useSuperAdmin, Store } from "@/context/SuperAdminContext";
import { Plus, Eye, Edit2, Lock, Unlock, Trash2, X, CheckCircle, XCircle, Search, ChevronDown } from "lucide-react";

const PLAN_STYLES: Record<string, string> = {
    Basic: "bg-gray-100 text-gray-600",
    Pro: "bg-indigo-50 text-indigo-700",
    Enterprise: "bg-violet-50 text-violet-700",
};
const STATUS_STYLES: Record<string, string> = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Suspended: "bg-red-50 text-red-600 border-red-100",
};

const EMPTY_FORM = { name: "", owner: "", email: "", phone: "", plan: "Basic" as Store["plan"], status: "Active" as Store["status"], createdDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) };

export default function StoresPage() {
    const { stores, toggleStoreStatus } = useSuperAdmin();
    const [search, setSearch] = useState("");

    const filtered = stores.filter(s => {
        const q = search.toLowerCase();
        return s.name.toLowerCase().includes(q) || s.owner.toLowerCase().includes(q);
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wider">Stores Management</h2>
                    <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest">Directory of all platform stores</p>
                </div>
            </div>

            {/* Filter bar */}
            <div className="flex items-center gap-4 bg-white border border-slate-200 p-4 rounded shadow-sm">
                <div className="relative flex-1 max-w-sm">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search stores or admins..."
                        className="w-full h-9 pl-9 pr-4 rounded border border-slate-200 text-xs text-slate-900 placeholder-slate-300 outline-none focus:border-indigo-500 bg-slate-50/50"
                    />
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {filtered.length} Stores Found
                </div>
            </div>

            {/* Basic Table */}
            <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                {["Store Name", "Admin Name", "Subscription Plan", "Expiry Date", "Status", "Actions"].map(h => (
                                    <th key={h} className="px-5 py-3 font-bold text-slate-500 uppercase tracking-widest border-r border-slate-100 last:border-0">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map(store => (
                                <tr key={store.id} className="hover:bg-slate-50/50">
                                    <td className="px-5 py-4 font-bold text-slate-900 border-r border-slate-50 last:border-0">{store.name}</td>
                                    <td className="px-5 py-4 text-slate-600 border-r border-slate-50 last:border-0">{store.owner}</td>
                                    <td className="px-5 py-4 border-r border-slate-50 last:border-0">
                                        <span className="px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                                            {store.plan}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-slate-500 font-medium border-r border-slate-50 last:border-0">
                                        {/* Mocking Expiry Date as requested by columns */}
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
                                        <div className="flex items-center gap-2">
                                            <button className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:underline">Edit</button>
                                            <button
                                                onClick={() => toggleStoreStatus(store.id)}
                                                className={`text-[10px] font-bold uppercase tracking-widest ${store.status === "Active" ? "text-amber-600" : "text-emerald-600"} hover:underline`}
                                            >
                                                {store.status === "Active" ? "Deactivate" : "Activate"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={6} className="text-center text-slate-400 py-12 uppercase tracking-widest text-[10px] font-bold">No stores found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
