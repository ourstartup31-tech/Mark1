"use client";

import React, { useState } from "react";
import { useSuperAdmin } from "@/context/SuperAdminContext";
import { Plus, X, Search } from "lucide-react";

const PLAN_STYLES: Record<string, string> = {
    Basic: "bg-gray-100 text-gray-600 border-gray-200",
    Pro: "bg-indigo-50 text-indigo-700 border-indigo-100",
    Enterprise: "bg-violet-50 text-violet-700 border-violet-100",
};
const STATUS_STYLES: Record<string, string> = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Suspended: "bg-amber-50 text-amber-700 border-amber-100",
    Expired: "bg-red-50 text-red-700 border-red-100",
};

export default function StoresManagement() {
    const { stores, admins, addStore, addAdmin, toggleStoreStatus, toggleAdminStatus, deleteAdmin } = useSuperAdmin();
    const [activeTab, setActiveTab] = useState<"stores" | "admins">("stores");
    
    // Stores search
    const [storeSearch, setStoreSearch] = useState("");
    const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
    const [newStore, setNewStore] = useState({ name: "", city: "", adminName: "", adminPhone: "" });

    // Admins search
    const [adminSearch, setAdminSearch] = useState("");
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ name: "", phone: "", store_id: "" });

    const filteredStores = stores.filter(s => {
        const q = storeSearch.toLowerCase();
        return s.name.toLowerCase().includes(q) || s.owner.toLowerCase().includes(q) || (s.city && s.city.toLowerCase().includes(q));
    });

    const filteredAdmins = admins.filter(a => {
        const q = adminSearch.toLowerCase();
        return a.name.toLowerCase().includes(q) || a.assignedStore.toLowerCase().includes(q);
    });

    const handleStoreSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStore.name || !newStore.city) return;
        addStore({
            name: newStore.name,
            city: newStore.city,
            owner: newStore.adminName || "Superadmin",
            email: "",
            phone: newStore.adminPhone || "",
            plan: "Basic",
            status: "Active",
            createdDate: new Date().toLocaleDateString()
        });
        setIsStoreModalOpen(false);
        setNewStore({ name: "", city: "", adminName: "", adminPhone: "" });
    };

    const handleAdminSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAdmin.name || !newAdmin.phone || !newAdmin.store_id) return;
        addAdmin({
            name: newAdmin.name,
            phone: newAdmin.phone,
            assignedStore: newAdmin.store_id,
            email: "",
            status: "Active",
            joinedDate: new Date().toLocaleDateString()
        });
        setIsAdminModalOpen(false);
        setNewAdmin({ name: "", phone: "", store_id: "" });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Platform Management</h2>
                    <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest">Manage everything for your stores and administrators</p>
                </div>
                <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setActiveTab("stores")}
                        className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "stores" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        Stores
                    </button>
                    <button 
                        onClick={() => setActiveTab("admins")}
                        className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === "admins" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        Administrators
                    </button>
                </div>
            </div>

            {/* Content for STORES tab */}
            {activeTab === "stores" && (
                <div className="animate-in fade-in duration-300 space-y-6">
                    <div className="flex items-center justify-between">
                         {/* Filter bar */}
                        <div className="flex items-center gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex-1 mr-4">
                            <div className="relative flex-1 max-w-sm">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={storeSearch}
                                    onChange={e => setStoreSearch(e.target.value)}
                                    placeholder="Search stores or owners..."
                                    className="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 text-xs text-slate-900 outline-none focus:border-indigo-500 bg-slate-50/50"
                                />
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsStoreModalOpen(true)}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 h-full"
                        >
                            <Plus size={14} />
                            Add New Store
                        </button>
                    </div>

                    {/* Table */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        {["Store Name", "City", "Owner Name", "Plan", "Status", "Actions"].map(h => (
                                            <th key={h} className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest border-r border-slate-50 last:border-0">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredStores.map(store => (
                                        <tr key={store.id} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-900 border-r border-slate-50 last:border-0">{store.name}</td>
                                            <td className="px-6 py-4 text-slate-500 border-r border-slate-50 last:border-0 font-medium">{store.city}</td>
                                            <td className="px-6 py-4 text-slate-600 border-r border-slate-50 last:border-0">{store.owner}</td>
                                            <td className="px-6 py-4 border-r border-slate-50 last:border-0">
                                                <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase ${PLAN_STYLES[store.plan] || PLAN_STYLES.Basic}`}>
                                                    {store.plan}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 border-r border-slate-50 last:border-0">
                                                <span className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded-full border ${STATUS_STYLES[store.status] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                                                    {store.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <button className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-800">Edit</button>
                                                    <button
                                                        onClick={() => toggleStoreStatus(store.id)}
                                                        className={`text-[10px] font-bold uppercase tracking-widest ${store.status === "Active" ? "text-amber-500 hover:text-amber-700" : "text-emerald-500 hover:text-emerald-700"}`}
                                                    >
                                                        {store.status === "Active" ? "Suspend" : "Activate"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredStores.length === 0 && (
                                        <tr><td colSpan={6} className="text-center text-slate-300 py-16 uppercase tracking-widest text-[10px] font-bold">No stores matching your search.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Content for ADMINS tab */}
            {activeTab === "admins" && (
                 <div className="animate-in fade-in duration-300 space-y-6">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex-1 mr-4">
                            <div className="relative flex-1 max-w-sm">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={adminSearch}
                                    onChange={e => setAdminSearch(e.target.value)}
                                    placeholder="Search admins or assigned stores..."
                                    className="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 text-xs text-slate-900 outline-none focus:border-indigo-500 bg-slate-50/50"
                                />
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsAdminModalOpen(true)}
                            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-100 h-full"
                        >
                            <Plus size={14} className="text-indigo-400" />
                            Add Store Admin
                        </button>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        {["Admin Name", "Phone", "Store Assigned", "Status", "Actions"].map(h => (
                                            <th key={h} className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest border-r border-slate-50 last:border-0">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredAdmins.map(admin => (
                                        <tr key={admin.id} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-900 border-r border-slate-50 last:border-0">{admin.name}</td>
                                            <td className="px-6 py-4 text-slate-500 border-r border-slate-50 last:border-0 font-medium">{admin.phone}</td>
                                            <td className="px-6 py-4 border-r border-slate-50 last:border-0">
                                                <span className="px-2.5 py-1 rounded-full border border-indigo-100 bg-indigo-50 text-[9px] font-bold uppercase text-indigo-700">
                                                    {admin.assignedStore}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 border-r border-slate-50 last:border-0">
                                                <span className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded-full border ${admin.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"}`}>
                                                    {admin.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => toggleAdminStatus(admin.id)} className="text-[10px] font-bold uppercase tracking-widest text-amber-500 hover:text-amber-700">Suspend</button>
                                                    <button onClick={() => deleteAdmin(admin.id)} className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700">Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredAdmins.length === 0 && (
                                        <tr><td colSpan={5} className="text-center text-slate-300 py-16 uppercase tracking-widest text-[10px] font-bold">No admins listed.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                 </div>
            )}

            {/* Store Modal */}
            {isStoreModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <div>
                                <h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm">Create New Store</h3>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Setup store profile and administrator</p>
                            </div>
                            <button onClick={() => setIsStoreModalOpen(false)} className="text-slate-400 hover:text-slate-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200/50 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleStoreSubmit} className="p-6 space-y-6">
                            {/* Store Details Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-6 h-6 rounded bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <Search size={12} />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Store Profile</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Store Name</label>
                                        <input
                                            required
                                            value={newStore.name}
                                            onChange={e => setNewStore({ ...newStore, name: e.target.value })}
                                            className="w-full h-10 px-4 rounded border border-slate-200 text-sm outline-none focus:border-indigo-500 bg-slate-50/50"
                                            placeholder="e.g. Fresh Mart"
                                        />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">City</label>
                                        <input
                                            required
                                            value={newStore.city}
                                            onChange={e => setNewStore({ ...newStore, city: e.target.value })}
                                            className="w-full h-10 px-4 rounded border border-slate-200 text-sm outline-none focus:border-indigo-500 bg-slate-50/50"
                                            placeholder="e.g. Mumbai"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Admin details inside store creation */}
                            <div className="pt-6 border-t border-slate-100 space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-6 h-6 rounded bg-emerald-50 flex items-center justify-center text-emerald-600">
                                        <Plus size={12} />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Initial Administrator</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Admin Name</label>
                                        <input
                                            value={newStore.adminName}
                                            onChange={e => setNewStore({ ...newStore, adminName: e.target.value })}
                                            className="w-full h-10 px-4 rounded border border-slate-200 text-sm outline-none focus:border-emerald-500 bg-slate-50/50"
                                            placeholder="Assign Name"
                                        />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Admin Phone</label>
                                        <input
                                            value={newStore.adminPhone}
                                            onChange={e => setNewStore({ ...newStore, adminPhone: e.target.value })}
                                            className="w-full h-10 px-4 rounded border border-slate-200 text-sm outline-none focus:border-emerald-500 bg-slate-50/50"
                                            placeholder="Phone Number"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full h-11 bg-slate-900 text-white rounded font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 mt-2"
                            >
                                Setup Store & Assign Admin
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Admin Modal */}
            {isAdminModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm">Create New Admin</h3>
                            <button onClick={() => setIsAdminModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAdminSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Full Name</label>
                                <input
                                    required
                                    value={newAdmin.name}
                                    onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                    className="w-full h-10 px-4 rounded border border-slate-200 text-sm outline-none focus:border-indigo-500 bg-slate-50/50"
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Phone Number</label>
                                <input
                                    required
                                    value={newAdmin.phone}
                                    onChange={e => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                                    className="w-full h-10 px-4 rounded border border-slate-200 text-sm outline-none focus:border-indigo-500 bg-slate-50/50"
                                    placeholder="e.g. 9876543210"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Assign Store</label>
                                <select
                                    required
                                    value={newAdmin.store_id}
                                    onChange={e => setNewAdmin({ ...newAdmin, store_id: e.target.value })}
                                    className="w-full h-10 px-4 rounded border border-slate-200 text-sm outline-none focus:border-indigo-500 bg-slate-50/50"
                                >
                                    <option value="">Select a store</option>
                                    {stores.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full h-11 bg-indigo-600 text-white rounded font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-colors mt-2"
                            >
                                Assign Store Admin
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
