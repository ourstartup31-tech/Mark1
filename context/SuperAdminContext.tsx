"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Store {
    id: string;
    name: string;
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

export function SuperAdminProvider({ children }: { children: React.ReactNode }) {
    const [stores, setStores] = useState<Store[]>([]);
    const [admins, setAdmins] = useState<StoreAdmin[]>([]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS);

    useEffect(() => {
        setStores(JSON.parse(localStorage.getItem("sa_stores") || JSON.stringify(INITIAL_STORES)));
        setAdmins(JSON.parse(localStorage.getItem("sa_admins") || JSON.stringify(INITIAL_ADMINS)));
        setPlans(JSON.parse(localStorage.getItem("sa_plans") || JSON.stringify(INITIAL_PLANS)));
        const savedSettings = localStorage.getItem("sa_settings");
        if (savedSettings) setPlatformSettings(JSON.parse(savedSettings));
    }, []);

    const persist = (key: string, data: unknown) => localStorage.setItem(key, JSON.stringify(data));

    const addStore = (s: Omit<Store, "id" | "revenue" | "orders">) => {
        const newStore: Store = { ...s, id: `s${Date.now()}`, revenue: 0, orders: 0 };
        const updated = [...stores, newStore];
        setStores(updated); persist("sa_stores", updated);
    };
    const updateStore = (s: Store) => {
        const updated = stores.map(x => x.id === s.id ? s : x);
        setStores(updated); persist("sa_stores", updated);
    };
    const deleteStore = (id: string) => {
        const updated = stores.filter(x => x.id !== id);
        setStores(updated); persist("sa_stores", updated);
    };
    const toggleStoreStatus = (id: string) => {
        const updated = stores.map(x => x.id === id ? { ...x, status: x.status === "Active" ? "Suspended" : "Active" as "Active" | "Suspended" } : x);
        setStores(updated); persist("sa_stores", updated);
    };

    const addAdmin = (a: Omit<StoreAdmin, "id">) => {
        const updated = [...admins, { ...a, id: `a${Date.now()}` }];
        setAdmins(updated); persist("sa_admins", updated);
    };
    const updateAdmin = (a: StoreAdmin) => {
        const updated = admins.map(x => x.id === a.id ? a : x);
        setAdmins(updated); persist("sa_admins", updated);
    };
    const deleteAdmin = (id: string) => {
        const updated = admins.filter(x => x.id !== id);
        setAdmins(updated); persist("sa_admins", updated);
    };
    const toggleAdminStatus = (id: string) => {
        const updated = admins.map(x => x.id === id ? { ...x, status: x.status === "Active" ? "Inactive" : "Active" as "Active" | "Inactive" } : x);
        setAdmins(updated); persist("sa_admins", updated);
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
