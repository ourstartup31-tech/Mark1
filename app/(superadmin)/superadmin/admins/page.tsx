"use client";

import React, { useState } from "react";
import { useSuperAdmin, StoreAdmin } from "@/context/SuperAdminContext";
import { Trash2, UserX, UserCheck, KeyRound, X, Search, CheckCircle, XCircle } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Inactive: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function AdminsPage() {
    const { admins, deleteAdmin, toggleAdminStatus } = useSuperAdmin();
    const [search, setSearch] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<StoreAdmin | null>(null);
    const [toast, setToast] = useState("");

    const filtered = admins.filter(a => {
        const q = search.toLowerCase();
        return a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.assignedStore.toLowerCase().includes(q);
    });

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(""), 3000);
    };

    const handleResetPassword = (name: string) => {
        showToast(`Password reset email sent to ${name}`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Store Admins</h2>
                    <p className="text-sm text-gray-400 mt-0.5">{admins.length} admin accounts registered</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Admins", value: admins.length, color: "indigo" },
                    { label: "Active", value: admins.filter(a => a.status === "Active").length, color: "emerald" },
                    { label: "Inactive", value: admins.filter(a => a.status === "Inactive").length, color: "gray" },
                    { label: "Stores Covered", value: new Set(admins.map(a => a.assignedStore)).size, color: "violet" },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search admins..."
                    className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-300 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 bg-white transition-all" />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr className="bg-gray-50/70 border-b border-gray-100">
                                {["Admin", "Email", "Phone", "Assigned Store", "Joined", "Status", "Actions"].map(h => (
                                    <th key={h} className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest px-5 py-3.5">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map(admin => (
                                <tr key={admin.id} className="hover:bg-gray-50/40 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                                                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                                                {admin.name.charAt(0)}
                                            </div>
                                            <p className="font-semibold text-gray-900 text-sm">{admin.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-gray-500">{admin.email}</td>
                                    <td className="px-5 py-4 text-sm text-gray-500">{admin.phone}</td>
                                    <td className="px-5 py-4">
                                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700">{admin.assignedStore}</span>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-gray-500">{admin.joinedDate}</td>
                                    <td className="px-5 py-4">
                                        <span className={`px-3 py-1 rounded-xl text-xs font-bold border inline-flex items-center gap-1 ${STATUS_STYLES[admin.status]}`}>
                                            {admin.status === "Active" ? <CheckCircle size={11} /> : <XCircle size={11} />}
                                            {admin.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => toggleAdminStatus(admin.id)} title={admin.status === "Active" ? "Deactivate" : "Activate"}
                                                className={`p-2 rounded-lg transition-all ${admin.status === "Active" ? "text-gray-400 hover:text-amber-600 hover:bg-amber-50" : "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"}`}>
                                                {admin.status === "Active" ? <UserX size={15} /> : <UserCheck size={15} />}
                                            </button>
                                            <button onClick={() => handleResetPassword(admin.name)} title="Reset Password"
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><KeyRound size={15} /></button>
                                            <button onClick={() => setDeleteTarget(admin)} title="Delete"
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={15} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={7} className="text-center text-gray-400 text-sm py-12">No admins found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-8 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={24} className="text-red-500" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2">Delete Admin?</h3>
                        <p className="text-sm text-gray-400 mb-6">
                            Permanently delete <span className="font-semibold text-gray-700">{deleteTarget.name}</span>? This cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteTarget(null)}
                                className="flex-1 h-11 border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 transition-all">Cancel</button>
                            <button onClick={() => { deleteAdmin(deleteTarget.id); setDeleteTarget(null); }}
                                className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white font-bold text-sm rounded-xl transition-all">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-[200] bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {toast}
                    <button onClick={() => setToast("")} className="text-white/50 hover:text-white ml-1"><X size={14} /></button>
                </div>
            )}
        </div>
    );
}
