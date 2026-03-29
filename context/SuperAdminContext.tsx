"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Store {
    id: string;
    name: string;
    city?: string;
    owner: string;
    email: string;
    phone: string;
    plan: "Basic" | "Pro" | "Enterprise";
    status: "Active" | "Suspended" | "Expired";
    createdDate: string;
    revenue: number;
    orders: number;
}

export interface StoreAdmin {
    id: string;
    name: string;
    email: string;
    phone: string;
    assignedStore: string;
    status: "Active" | "Inactive";
    joinedDate: string;
}

export interface Plan {
    id: string;
    name: "Basic" | "Pro" | "Enterprise";
    price: number;
    maxProducts: number;
    maxStaff: number;
    customBranding: boolean;
    prioritySupport: boolean;
}

export interface PlatformSettings {
    platformName: string;
    supportEmail: string;
    logoUrl: string;
}

interface SuperAdminContextType {
    stores: Store[];
    admins: StoreAdmin[];
    plans: Plan[];
    platformSettings: PlatformSettings;
    addStore: (s: Omit<Store, "id" | "revenue" | "orders">) => void;
    updateStore: (s: Store) => void;
    deleteStore: (id: string) => void;
    toggleStoreStatus: (id: string) => void;
    addAdmin: (a: Omit<StoreAdmin, "id">) => void;
    updateAdmin: (a: StoreAdmin) => void;
    deleteAdmin: (id: string) => void;
    toggleAdminStatus: (id: string) => void;
    addPlan: (p: Omit<Plan, "id">) => void;
    updatePlan: (p: Plan) => void;
    deletePlan: (id: string) => void;
    updatePlatformSettings: (s: Partial<PlatformSettings>) => void;
}

const SuperAdminContext = createContext<SuperAdminContextType | null>(null);

const INITIAL_STORES: Store[] = [];

const INITIAL_ADMINS: StoreAdmin[] = [];

const INITIAL_PLANS: Plan[] = [
    { id: "p1", name: "Basic", price: 999, maxProducts: 100, maxStaff: 3, customBranding: false, prioritySupport: false },
    { id: "p2", name: "Pro", price: 2499, maxProducts: 500, maxStaff: 10, customBranding: true, prioritySupport: false },
    { id: "p3", name: "Enterprise", price: 5999, maxProducts: 999999, maxStaff: 999999, customBranding: true, prioritySupport: true },
];

const DEFAULT_SETTINGS: PlatformSettings = {
    platformName: "SuperMart Platform",
    supportEmail: "support@supermart.in",
    logoUrl: "",
};

import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

export function SuperAdminProvider({ children }: { children: React.ReactNode }) {
    const [stores, setStores] = useState<Store[]>([]);
    const [admins, setAdmins] = useState<StoreAdmin[]>([]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS);
    const { user, apiFetch } = useAuth();
    const { showToast } = useToast();

    const fetchStores = async () => {
        if (!user || user.role !== "superadmin") return;
        try {
            const res = await apiFetch("/api/admin/stores");
            if (res.ok) {
                const data = await res.json();
                // Map DB stores to UI Store interface
                const mapped: Store[] = data.map((s: any) => ({
                    id: s.id,
                    name: s.name,
                    city: s.city || "N/A",
                    owner: s.owner?.name || "No Owner",
                    email: s.email || "N/A",
                    phone: s.phone || "N/A",
                    plan: "Basic", // Mocked for now as not in DB
                    status: s.is_active ? "Active" : "Suspended",
                    createdDate: new Date(s.created_at).toLocaleDateString(),
                    revenue: 0,
                    orders: 0
                }));
                setStores(mapped);
            }
        } catch (e) {
            console.error("Failed to fetch stores", e);
        }
    };

    const fetchAdmins = async () => {
        if (!user || user.role !== "superadmin") return;
        try {
            const res = await apiFetch("/api/admin/admins");
            if (res.ok) {
                const data = await res.json();
                const mapped: StoreAdmin[] = data.map((a: any) => ({
                    id: a.id,
                    name: a.name || "Unknown",
                    email: a.email || "N/A",
                    phone: a.phone,
                    assignedStore: a.assigned_store?.name || "Unassigned",
                    status: a.role === "admin" || a.role === "superadmin" ? "Active" : "Inactive",
                    joinedDate: new Date(a.created_at).toLocaleDateString()
                }));
                setAdmins(mapped);
            }
        } catch (e) {
            console.error("Failed to fetch admins", e);
        }
    };

    useEffect(() => {
        if (user?.role === "superadmin") {
            fetchStores();
            fetchAdmins();
        }
        
        setPlans(JSON.parse(localStorage.getItem("sa_plans") || JSON.stringify(INITIAL_PLANS)));
        const savedSettings = localStorage.getItem("sa_settings");
        if (savedSettings) setPlatformSettings(JSON.parse(savedSettings));
    }, [user]);

    const persist = (key: string, data: unknown) => localStorage.setItem(key, JSON.stringify(data));

    const addStore = async (s: Omit<Store, "id" | "revenue" | "orders">) => {
        try {
            console.log("SuperAdminContext: addStore initiating...", s);
            const res = await apiFetch("/api/admin/stores", {
                method: "POST",
                body: JSON.stringify({ 
                    name: s.name, 
                    city: s.city || "Default City",
                    adminName: s.owner !== "Superadmin" ? s.owner : undefined,
                    adminPhone: s.phone || undefined
                })
            });
            console.log("SuperAdminContext: addStore response status:", res.status);
            if (res.ok) {
                showToast("Store created successfully", "success");
                await fetchStores();
                await fetchAdmins();
            } else {
                const err = await res.json();
                console.error("SuperAdminContext: addStore failed:", err);
                showToast(err.error || "Failed to create store", "error");
            }
        } catch (e) {
            console.error("SuperAdminContext: addStore network error:", e);
            showToast("Network error", "error");
        }
    };

    const updateStore = (s: Store) => {
        const updated = stores.map(x => x.id === s.id ? s : x);
        setStores(updated);
    };

    const deleteStore = (id: string) => {
        const updated = stores.filter(x => x.id !== id);
        setStores(updated);
    };

    const toggleStoreStatus = async (id: string) => {
        const store = stores.find(s => s.id === id);
        if (!store) return;
        
        try {
            const res = await apiFetch(`/api/admin/stores/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ is_active: store.status !== "Active" })
            });
            if (res.ok) {
                showToast(`Store ${store.status === "Active" ? "suspended" : "activated"}`, "success");
                await fetchStores();
            }
        } catch (e) {
            showToast("Failed to update store status", "error");
        }
    };

    const addAdmin = async (a: Omit<StoreAdmin, "id">) => {
        try {
            const res = await apiFetch("/api/admin/admins", {
                method: "POST",
                body: JSON.stringify({ 
                    phone: a.phone, 
                    name: a.name, 
                    store_id: a.assignedStore, // UI should pass ID
                    role: "admin"
                })
            });
            if (res.ok) {
                showToast("Admin created/updated successfully", "success");
                await fetchAdmins();
            } else {
                const err = await res.json();
                showToast(err.error || "Failed to create admin", "error");
            }
        } catch (e) {
            showToast("Network error", "error");
        }
    };

    const updateAdmin = (a: StoreAdmin) => {
        const updated = admins.map(x => x.id === a.id ? a : x);
        setAdmins(updated);
    };
    const deleteAdmin = async (id: string) => {
        // Optimistic update: remove from UI immediately
        const previousAdmins = [...admins];
        setAdmins(admins.filter(a => a.id !== id));

        try {
            const res = await apiFetch(`/api/admin/admins/${id}`, {
                method: "DELETE"
            });
            if (!res.ok) {
                // Revert on failure
                setAdmins(previousAdmins);
                const err = await res.json();
                showToast(err.error || "Failed to delete admin", "error");
            } else {
                showToast("Admin deleted successfully", "success");
            }
        } catch (e) {
            setAdmins(previousAdmins);
            showToast("Network error", "error");
        }
    };
    const toggleAdminStatus = async (id: string) => {
        const admin = admins.find(a => a.id === id);
        if (!admin) return;

        try {
            const res = await apiFetch(`/api/admin/admins/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ role: admin.status === "Active" ? "user" : "admin" })
            });
            if (res.ok) {
                showToast(`Admin ${admin.status === "Active" ? "deactivated" : "activated"}`, "success");
                await fetchAdmins();
            }
        } catch (e) {
            showToast("Failed to update admin status", "error");
        }
    };

    const addPlan = (p: Omit<Plan, "id">) => {
        const updated = [...plans, { ...p, id: `p${Date.now()}` }];
        setPlans(updated); persist("sa_plans", updated);
    };
    const updatePlan = (p: Plan) => {
        const updated = plans.map(x => x.id === p.id ? p : x);
        setPlans(updated); persist("sa_plans", updated);
    };
    const deletePlan = (id: string) => {
        const updated = plans.filter(x => x.id !== id);
        setPlans(updated); persist("sa_plans", updated);
    };

    const updatePlatformSettings = (s: Partial<PlatformSettings>) => {
        const updated = { ...platformSettings, ...s };
        setPlatformSettings(updated); persist("sa_settings", updated);
    };

    return (
        <SuperAdminContext.Provider value={{
            stores, admins, plans, platformSettings,
            addStore, updateStore, deleteStore, toggleStoreStatus,
            addAdmin, updateAdmin, deleteAdmin, toggleAdminStatus,
            addPlan, updatePlan, deletePlan,
            updatePlatformSettings,
        }}>
            {children}
        </SuperAdminContext.Provider>
    );
}

export function useSuperAdmin() {
    const ctx = useContext(SuperAdminContext);
    if (!ctx) throw new Error("useSuperAdmin must be used within SuperAdminProvider");
    return ctx;
}
