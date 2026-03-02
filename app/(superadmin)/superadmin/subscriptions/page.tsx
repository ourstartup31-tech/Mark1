"use client";

import React, { useState } from "react";
import { useSuperAdmin, Plan } from "@/context/SuperAdminContext";
import { Plus, Edit2, Trash2, Check, X, Crown, Zap, Package } from "lucide-react";

const PLAN_ICONS: Record<string, React.ReactNode> = {
    Basic: <Package size={24} className="text-gray-500" />,
    Pro: <Zap size={24} className="text-indigo-500" />,
    Enterprise: <Crown size={24} className="text-violet-500" />,
};
const PLAN_COLORS: Record<string, { bg: string; border: string; badge: string; badgeText: string }> = {
    Basic: { bg: "bg-white", border: "border-gray-200", badge: "bg-gray-100", badgeText: "text-gray-600" },
    Pro: { bg: "bg-white", border: "border-indigo-200", badge: "bg-indigo-50", badgeText: "text-indigo-700" },
    Enterprise: { bg: "bg-white", border: "border-violet-300", badge: "bg-violet-50", badgeText: "text-violet-700" },
};

const EMPTY_PLAN: Omit<Plan, "id"> = { name: "Basic", price: 999, maxProducts: 100, maxStaff: 3, customBranding: false, prioritySupport: false, commission: 8 };

export default function SubscriptionsPage() {
    const { plans, addPlan, updatePlan, deletePlan } = useSuperAdmin();
    const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
    const [selected, setSelected] = useState<Plan | null>(null);
    const [form, setForm] = useState<Omit<Plan, "id">>({ ...EMPTY_PLAN });

    const openAdd = () => { setForm({ ...EMPTY_PLAN }); setSelected(null); setModal("add"); };
    const openEdit = (p: Plan) => { setForm({ name: p.name, price: p.price, maxProducts: p.maxProducts, maxStaff: p.maxStaff, customBranding: p.customBranding, prioritySupport: p.prioritySupport, commission: p.commission }); setSelected(p); setModal("edit"); };
    const handleSave = () => {
        if (modal === "add") addPlan(form);
        else if (modal === "edit" && selected) updatePlan({ ...selected, ...form });
        setModal(null);
    };

    const NumberField = ({ label, field }: { label: string; field: keyof typeof form }) => (
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{label}</label>
            <input type="number" value={form[field] as number}
                onChange={e => setForm(p => ({ ...p, [field]: Number(e.target.value) }))}
                className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all" />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Subscription Plans</h2>
                    <p className="text-sm text-gray-400 mt-0.5">Manage platform subscription tiers</p>
                </div>
                <button onClick={openAdd}
                    className="flex items-center gap-2 px-5 py-2.5 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-200 hover:opacity-90 active:scale-[0.98] transition-all"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                    <Plus size={18} /> New Plan
                </button>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {plans.map(plan => {
                    const c = PLAN_COLORS[plan.name] || PLAN_COLORS.Basic;
                    return (
                        <div key={plan.id} className={`${c.bg} border-2 ${c.border} rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200 relative group`}>
                            {plan.name === "Enterprise" && (
                                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-violet-600 text-white">Most Popular</div>
                            )}
                            <div className="mb-5">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                                    style={{ background: plan.name === "Enterprise" ? "linear-gradient(135deg, #8b5cf6,#7c3aed)" : plan.name === "Pro" ? "rgba(99,102,241,0.1)" : "#f5f5f5" }}>
                                    {PLAN_ICONS[plan.name]}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${c.badge} ${c.badgeText}`}>{plan.name}</span>
                                </div>
                                <div className="mt-3">
                                    <span className="text-3xl font-bold text-gray-900">₹{plan.price.toLocaleString()}</span>
                                    <span className="text-gray-400 text-sm font-medium">/month</span>
                                </div>
                            </div>

                            <div className="space-y-2.5 mb-6">
                                {[
                                    { label: `${plan.maxProducts === 999999 ? "Unlimited" : plan.maxProducts} Products` },
                                    { label: `${plan.maxStaff === 999999 ? "Unlimited" : plan.maxStaff} Staff` },
                                    { label: "Custom Branding", enabled: plan.customBranding },
                                    { label: "Priority Support", enabled: plan.prioritySupport },
                                    { label: `${plan.commission}% Commission` },
                                ].map((f, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${(f.enabled === undefined || f.enabled) ? "bg-emerald-100" : "bg-gray-100"}`}>
                                            {(f.enabled === undefined || f.enabled)
                                                ? <Check size={12} className="text-emerald-600" />
                                                : <X size={12} className="text-gray-400" />}
                                        </div>
                                        <span className={f.enabled === false ? "text-gray-400 line-through" : "text-gray-700 font-medium"}>{f.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => openEdit(plan)}
                                    className="flex-1 flex items-center justify-center gap-2 h-10 border-2 border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:border-indigo-300 hover:text-indigo-700 transition-all">
                                    <Edit2 size={14} /> Edit
                                </button>
                                <button onClick={() => { setSelected(plan); setModal("delete"); }}
                                    className="h-10 w-10 flex items-center justify-center border-2 border-gray-200 text-gray-400 rounded-xl hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Info table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">Plan Comparison</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead>
                            <tr className="bg-gray-50/70 border-b border-gray-100">
                                {["Plan", "Price", "Max Products", "Max Staff", "Custom Branding", "Priority Support", "Commission"].map(h => (
                                    <th key={h} className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest px-5 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {plans.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50/40 transition-colors">
                                    <td className="px-5 py-4 font-bold text-gray-900 text-sm">{p.name}</td>
                                    <td className="px-5 py-4 text-sm font-semibold text-gray-700">₹{p.price.toLocaleString()}</td>
                                    <td className="px-5 py-4 text-sm text-gray-600">{p.maxProducts === 999999 ? "Unlimited" : p.maxProducts}</td>
                                    <td className="px-5 py-4 text-sm text-gray-600">{p.maxStaff === 999999 ? "Unlimited" : p.maxStaff}</td>
                                    <td className="px-5 py-4">{p.customBranding ? <Check size={16} className="text-emerald-500" /> : <X size={16} className="text-gray-300" />}</td>
                                    <td className="px-5 py-4">{p.prioritySupport ? <Check size={16} className="text-emerald-500" /> : <X size={16} className="text-gray-300" />}</td>
                                    <td className="px-5 py-4 text-sm font-bold text-indigo-600">{p.commission}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {(modal === "add" || modal === "edit") && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900 text-lg">{modal === "add" ? "New Plan" : "Edit Plan"}</h3>
                            <button onClick={() => setModal(null)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl"><X size={18} /></button>
                        </div>
                        <div className="px-7 py-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Plan Name</label>
                                <select value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value as Plan["name"] }))}
                                    className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all bg-white">
                                    {["Basic", "Pro", "Enterprise"].map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>
                            <NumberField label="Price (₹/month)" field="price" />
                            <NumberField label="Max Products" field="maxProducts" />
                            <NumberField label="Max Staff" field="maxStaff" />
                            <NumberField label="Commission (%)" field="commission" />
                            <div className="flex gap-4">
                                {(["customBranding", "prioritySupport"] as const).map(k => (
                                    <label key={k} className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.checked }))}
                                            className="w-5 h-5 rounded accent-indigo-600" />
                                        <span className="text-sm font-medium text-gray-700 capitalize">{k === "customBranding" ? "Custom Branding" : "Priority Support"}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-3 px-7 py-5 border-t border-gray-100 bg-gray-50/30">
                            <button onClick={() => setModal(null)}
                                className="flex-1 h-11 border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 transition-all">Cancel</button>
                            <button onClick={handleSave}
                                className="flex-1 h-11 text-white font-bold text-sm rounded-xl hover:opacity-90 transition-all shadow-md shadow-indigo-200"
                                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                                {modal === "add" ? "Create Plan" : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {modal === "delete" && selected && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-8 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-red-500" /></div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2">Delete Plan?</h3>
                        <p className="text-sm text-gray-400 mb-6">Delete the <span className="font-semibold text-gray-700">{selected.name}</span> plan permanently?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setModal(null)} className="flex-1 h-11 border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 transition-all">Cancel</button>
                            <button onClick={() => { deletePlan(selected.id); setModal(null); }} className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white font-bold text-sm rounded-xl transition-all">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
