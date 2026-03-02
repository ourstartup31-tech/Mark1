"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Store {
    id: string;
    name: string;
    owner: string;
    email: string;
    phone: string;
    plan: "Basic" | "Pro" | "Enterprise";
    status: "Active" | "Suspended";
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
    commission: number;
}

export interface RevenueEntry {
    month: string;
    revenue: number;
    orders: number;
    stores: number;
}

export interface PlatformSettings {
    platformName: string;
    supportEmail: string;
    logoUrl: string;
    defaultCommission: number;
    commissionOverrides: Record<string, number>;
    enableSubscriptions: boolean;
    enableAnalytics: boolean;
    enableCoupons: boolean;
}

interface SuperAdminContextType {
    stores: Store[];
    admins: StoreAdmin[];
    plans: Plan[];
    revenueData: RevenueEntry[];
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

const INITIAL_STORES: Store[] = [
    { id: "s1", name: "FreshMart Central", owner: "Rajesh Kumar", email: "rajesh@freshmart.com", phone: "+91 98765-43210", plan: "Enterprise", status: "Active", createdDate: "Jan 10, 2026", revenue: 485000, orders: 1240 },
    { id: "s2", name: "Green Basket", owner: "Priya Sharma", email: "priya@greenbasket.in", phone: "+91 87654-32109", plan: "Pro", status: "Active", createdDate: "Jan 22, 2026", revenue: 212000, orders: 680 },
    { id: "s3", name: "KiraanHub", owner: "Amit Patel", email: "amit@kiraanhub.com", phone: "+91 76543-21098", plan: "Basic", status: "Active", createdDate: "Feb 3, 2026", revenue: 94000, orders: 310 },
    { id: "s4", name: "Daily Needs Co.", owner: "Sunita Joshi", email: "sunita@dailyneeds.in", phone: "+91 65432-10987", plan: "Pro", status: "Suspended", createdDate: "Feb 12, 2026", revenue: 138000, orders: 420 },
    { id: "s5", name: "QuickGrocer", owner: "Vikram Singh", email: "vikram@quickgrocer.com", phone: "+91 54321-09876", plan: "Basic", status: "Active", createdDate: "Feb 20, 2026", revenue: 57000, orders: 195 },
    { id: "s6", name: "MegaMart Express", owner: "Deepa Nair", email: "deepa@megamart.in", phone: "+91 43210-98765", plan: "Enterprise", status: "Active", createdDate: "Mar 1, 2026", revenue: 320000, orders: 890 },
];

const INITIAL_ADMINS: StoreAdmin[] = [
    { id: "a1", name: "Rajesh Kumar", email: "rajesh@freshmart.com", phone: "+91 98765-43210", assignedStore: "FreshMart Central", status: "Active", joinedDate: "Jan 10, 2026" },
    { id: "a2", name: "Priya Sharma", email: "priya@greenbasket.in", phone: "+91 87654-32109", assignedStore: "Green Basket", status: "Active", joinedDate: "Jan 22, 2026" },
    { id: "a3", name: "Amit Patel", email: "amit@kiraanhub.com", phone: "+91 76543-21098", assignedStore: "KiraanHub", status: "Active", joinedDate: "Feb 3, 2026" },
    { id: "a4", name: "Sunita Joshi", email: "sunita@dailyneeds.in", phone: "+91 65432-10987", assignedStore: "Daily Needs Co.", status: "Inactive", joinedDate: "Feb 12, 2026" },
    { id: "a5", name: "Vikram Singh", email: "vikram@quickgrocer.com", phone: "+91 54321-09876", assignedStore: "QuickGrocer", status: "Active", joinedDate: "Feb 20, 2026" },
    { id: "a6", name: "Deepa Nair", email: "deepa@megamart.in", phone: "+91 43210-98765", assignedStore: "MegaMart Express", status: "Active", joinedDate: "Mar 1, 2026" },
];

const INITIAL_PLANS: Plan[] = [
    { id: "p1", name: "Basic", price: 999, maxProducts: 100, maxStaff: 3, customBranding: false, prioritySupport: false, commission: 8 },
    { id: "p2", name: "Pro", price: 2499, maxProducts: 500, maxStaff: 10, customBranding: true, prioritySupport: false, commission: 5 },
    { id: "p3", name: "Enterprise", price: 5999, maxProducts: 999999, maxStaff: 999999, customBranding: true, prioritySupport: true, commission: 3 },
];

const INITIAL_REVENUE: RevenueEntry[] = [
    { month: "Apr 2025", revenue: 182000, orders: 520, stores: 2 },
    { month: "May 2025", revenue: 210000, orders: 640, stores: 2 },
    { month: "Jun 2025", revenue: 245000, orders: 750, stores: 3 },
    { month: "Jul 2025", revenue: 278000, orders: 820, stores: 3 },
    { month: "Aug 2025", revenue: 312000, orders: 940, stores: 4 },
    { month: "Sep 2025", revenue: 298000, orders: 880, stores: 4 },
    { month: "Oct 2025", revenue: 345000, orders: 1020, stores: 4 },
    { month: "Nov 2025", revenue: 410000, orders: 1240, stores: 5 },
    { month: "Dec 2025", revenue: 520000, orders: 1580, stores: 5 },
    { month: "Jan 2026", revenue: 480000, orders: 1420, stores: 6 },
    { month: "Feb 2026", revenue: 510000, orders: 1560, stores: 6 },
    { month: "Mar 2026", revenue: 540000, orders: 1620, stores: 6 },
];

const DEFAULT_SETTINGS: PlatformSettings = {
    platformName: "SuperMart Platform",
    supportEmail: "support@supermart.in",
    logoUrl: "",
    defaultCommission: 6,
    commissionOverrides: { Basic: 8, Pro: 5, Enterprise: 3 },
    enableSubscriptions: true,
    enableAnalytics: true,
    enableCoupons: false,
};

export function SuperAdminProvider({ children }: { children: React.ReactNode }) {
    const [stores, setStores] = useState<Store[]>([]);
    const [admins, setAdmins] = useState<StoreAdmin[]>([]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [revenueData] = useState<RevenueEntry[]>(INITIAL_REVENUE);
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
            stores, admins, plans, revenueData, platformSettings,
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
