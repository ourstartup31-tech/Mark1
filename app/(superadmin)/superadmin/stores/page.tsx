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
    const { stores, addStore, updateStore, deleteStore, toggleStoreStatus } = useSuperAdmin();
    const [search, setSearch] = useState("");
    const [modal, setModal] = useState<"add" | "edit" | "view" | "delete" | null>(null);
    const [selected, setSelected] = useState<Store | null>(null);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [planFilter, setPlanFilter] = useState("All");

    const filtered = stores.filter(s => {
        const q = search.toLowerCase();
        const matchSearch = s.name.toLowerCase().includes(q) || s.owner.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
        const matchPlan = planFilter === "All" || s.plan === planFilter;
        return matchSearch && matchPlan;
    });

    const openAdd = () => { setForm({ ...EMPTY_FORM }); setSelected(null); setModal("add"); };
    const openEdit = (s: Store) => { setForm({ name: s.name, owner: s.owner, email: s.email, phone: s.phone, plan: s.plan, status: s.status, createdDate: s.createdDate }); setSelected(s); setModal("edit"); };
    const openView = (s: Store) => { setSelected(s); setModal("view"); };
    const openDelete = (s: Store) => { setSelected(s); setModal("delete"); };

    const handleSave = () => {
        if (modal === "add") addStore(form);
        else if (modal === "edit" && selected) updateStore({ ...selected, ...form });
        setModal(null);
    };

    const FormField = ({ label, name, type = "text", options }: { label: string; name: keyof typeof form; type?: string; options?: string[] }) => (
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{label}</label>
            {options ? (
                <select value={form[name]} onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all bg-white">
                    {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
            ) : (
                <input type={type} value={form[name] as string} onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all bg-gray-50/50" />
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Top bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Stores Management</h2>
                    <p className="text-sm text-gray-400 mt-0.5">{stores.length} stores registered on the platform</p>
                </div>
                <button onClick={openAdd}
                    className="flex items-center gap-2 px-5 py-2.5 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-200 hover:opacity-90 active:scale-[0.98] transition-all"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                    <Plus size={18} /> Add Store
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search stores..."
                        className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-300 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 bg-white transition-all" />
                </div>
                <div className="relative">
                    <select value={planFilter} onChange={e => setPlanFilter(e.target.value)}
                        className="h-10 pl-3 pr-8 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-indigo-300 bg-white appearance-none cursor-pointer">
                        {["All", "Basic", "Pro", "Enterprise"].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="bg-gray-50/70 border-b border-gray-100">
                                {["Store", "Owner", "Phone", "Plan", "Created", "Status", "Revenue", "Actions"].map(h => (
                                    <th key={h} className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest px-5 py-3.5">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map(store => (
                                <tr key={store.id} className="hover:bg-gray-50/40 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                                                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                                                {store.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">{store.name}</p>
                                                <p className="text-xs text-gray-400 truncate max-w-[160px]">{store.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-sm font-medium text-gray-700">{store.owner}</td>
                                    <td className="px-5 py-4 text-sm text-gray-500">{store.phone}</td>
                                    <td className="px-5 py-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${PLAN_STYLES[store.plan]}`}>{store.plan}</span>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-gray-500">{store.createdDate}</td>
                                    <td className="px-5 py-4">
                                        <span className={`px-3 py-1 rounded-xl text-xs font-bold border inline-flex items-center gap-1 ${STATUS_STYLES[store.status]}`}>
                                            {store.status === "Active" ? <CheckCircle size={11} /> : <XCircle size={11} />}
                                            {store.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">₹{store.revenue.toLocaleString()}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => openView(store)} title="View"
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Eye size={15} /></button>
                                            <button onClick={() => openEdit(store)} title="Edit"
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Edit2 size={15} /></button>
                                            <button onClick={() => toggleStoreStatus(store.id)} title={store.status === "Active" ? "Suspend" : "Activate"}
                                                className={`p-2 rounded-lg transition-all ${store.status === "Active" ? "text-gray-400 hover:text-amber-600 hover:bg-amber-50" : "text-amber-500 hover:text-emerald-600 hover:bg-emerald-50"}`}>
                                                {store.status === "Active" ? <Lock size={15} /> : <Unlock size={15} />}
                                            </button>
                                            <button onClick={() => openDelete(store)} title="Delete"
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={15} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={8} className="text-center text-gray-400 text-sm py-12">No stores found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {(modal === "add" || modal === "edit") && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900 text-lg">{modal === "add" ? "Add New Store" : "Edit Store"}</h3>
                            <button onClick={() => setModal(null)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"><X size={18} /></button>
                        </div>
                        <div className="px-7 py-6 space-y-4 max-h-[65vh] overflow-y-auto">
                            <FormField label="Store Name" name="name" />
                            <FormField label="Owner Name" name="owner" />
                            <FormField label="Email" name="email" type="email" />
                            <FormField label="Phone" name="phone" />
                            <FormField label="Subscription Plan" name="plan" options={["Basic", "Pro", "Enterprise"]} />
                            <FormField label="Status" name="status" options={["Active", "Suspended"]} />
                        </div>
                        <div className="flex gap-3 px-7 py-5 border-t border-gray-100 bg-gray-50/30">
                            <button onClick={() => setModal(null)}
                                className="flex-1 h-11 border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 transition-all">Cancel</button>
                            <button onClick={handleSave}
                                className="flex-1 h-11 text-white font-bold text-sm rounded-xl hover:opacity-90 transition-all shadow-md shadow-indigo-200"
                                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                                {modal === "add" ? "Add Store" : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {modal === "view" && selected && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900 text-lg">Store Details</h3>
                            <button onClick={() => setModal(null)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"><X size={18} /></button>
                        </div>
                        <div className="px-7 py-6 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl text-white"
                                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>{selected.name.charAt(0)}</div>
                                <div>
                                    <p className="font-bold text-gray-900 text-lg">{selected.name}</p>
                                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${PLAN_STYLES[selected.plan]}`}>{selected.plan}</span>
                                </div>
                            </div>
                            {[
                                ["Owner", selected.owner], ["Email", selected.email], ["Phone", selected.phone],
                                ["Status", selected.status], ["Joined", selected.createdDate],
                                ["Revenue", `₹${selected.revenue.toLocaleString()}`], ["Orders", selected.orders.toString()],
                            ].map(([k, v]) => (
                                <div key={k} className="flex items-center justify-between py-2 border-b border-gray-50">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{k}</span>
                                    <span className="text-sm font-semibold text-gray-900">{v}</span>
                                </div>
                            ))}
                        </div>
                        <div className="px-7 py-4 border-t border-gray-100">
                            <button onClick={() => setModal(null)}
                                className="w-full h-11 text-white font-bold text-sm rounded-xl hover:opacity-90 transition-all"
                                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {modal === "delete" && selected && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-8 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={24} className="text-red-500" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2">Delete Store?</h3>
                        <p className="text-sm text-gray-400 mb-6">This will permanently delete <span className="font-semibold text-gray-700">{selected.name}</span>. This cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setModal(null)}
                                className="flex-1 h-11 border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 transition-all">Cancel</button>
                            <button onClick={() => { deleteStore(selected.id); setModal(null); }}
                                className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white font-bold text-sm rounded-xl transition-all">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
