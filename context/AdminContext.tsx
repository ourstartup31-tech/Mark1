"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/data/products";
import { useAuth } from "@/context/AuthContext";

interface Order {
    id: string;
    customer: string;
    date: string;
    time: string;
    method: string;
    status: string;
    total: string;
    items: any[];
}

interface Staff {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: "Active" | "Inactive";
}

interface StoreSettings {
    name: string;
    address: string;
    contact: string;
    timing: any;
    closedDates: string[];
}

interface AdminContextType {
    products: Product[];
    categories: any[];
    staff: Staff[];
    orders: Order[];
    storeSettings: StoreSettings;
    isLoading: boolean;
    error: string | null;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    refreshData: () => Promise<void>;
    addProduct: (p: any) => Promise<void>;
    updateProduct: (p: any) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    addCategory: (c: any) => Promise<void>;
    updateCategory: (c: any) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    addStaff: (s: any) => Promise<void>;
    updateStaff: (s: any) => Promise<void>;
    deleteStaff: (id: string) => Promise<void>;
    updateStoreSettings: (s: Partial<StoreSettings>) => Promise<void>;
    updateOrderStatus: (id: string, status: string) => Promise<void>;
    isStoreActive: boolean;
    setIsStoreActive: (active: boolean) => void;
    toggleStoreStatus: () => Promise<void>;
    stats: { totalProducts: number; activeStaff: number };
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
    const { apiFetch, user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [storeSettings, setStoreSettings] = useState<StoreSettings>({
        name: "FreshMart Central",
        address: "123, MG Road, Bangalore, India",
        contact: "+91 91234 56789",
        timing: {},
        closedDates: []
    });
    const [isStoreActive, setIsStoreActive] = useState<boolean>(true);
    const [stats, setStats] = useState({ totalProducts: 0, activeStaff: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchData = async () => {
        if (!user || user.role !== "admin") {
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true);
        setError(null);
        try {
            const [prodRes, catRes, orderRes, staffRes, statusRes, statsRes] = await Promise.all([
                apiFetch("/api/products", { cache: "no-store" }),
                apiFetch("/api/categories", { cache: "no-store" }),
                apiFetch("/api/admin/orders", { cache: "no-store" }),
                apiFetch("/api/admin/staff", { cache: "no-store" }),
                apiFetch("/api/admin/store-status", { cache: "no-store" }),
                apiFetch("/api/admin/stats", { cache: "no-store" })
            ]);

            if (prodRes.ok) setProducts(await prodRes.json());
            if (catRes.ok) setCategories(await catRes.json());
            if (staffRes.ok) {
                const staffData = await staffRes.json();
                setStaff(staffData.map((s: any) => ({
                    ...s,
                    status: s.store_id ? "Active" : "Inactive"
                })));
            }
            if (statusRes.ok) {
                const statusData = await statusRes.json();
                setIsStoreActive(statusData.isActive);
            }
            
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            }

            if (orderRes.ok) {
                const data = await orderRes.json();
                const ordersList = data.orders || [];
                
                // Map API orders to context Order interface
                const mappedOrders = ordersList.map((o: any) => ({
                    id: o.id,
                    customer: o.users?.name || "Unknown",
                    date: new Date(o.created_at).toLocaleDateString(),
                    time: new Date(o.created_at).toLocaleTimeString(),
                    method: o.payment_method || "Online",
                    status: o.status,
                    total: `₹${o.total_price}`,
                    items: o.order_items || []
                }));
                setOrders(mappedOrders);
            }
            
        } catch (err: any) {
            console.error("Failed to fetch admin data", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user?.id]);

    const addProduct = async (p: any) => {
        setIsLoading(true);
        try {
            const res = await apiFetch("/api/products", {
                method: "POST",
                body: JSON.stringify(p)
            });
            if (!res.ok) throw new Error("Failed to add product");
            await fetchData();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateProduct = async (p: any) => {
        setIsLoading(true);
        try {
            const res = await apiFetch("/api/products", {
                method: "PUT",
                body: JSON.stringify(p)
            });
            if (!res.ok) throw new Error("Failed to update product");
            await fetchData();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteProduct = async (id: string) => {
        setIsLoading(true);
        try {
            const res = await apiFetch(`/api/products?id=${id}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("Failed to delete product");
            await fetchData();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const addCategory = async (c: any) => {
        setIsLoading(true);
        try {
            const res = await apiFetch("/api/categories", {
                method: "POST",
                body: JSON.stringify(c)
            });
            if (!res.ok) throw new Error("Failed to add category");
            await fetchData();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateCategory = async (c: any) => {
        setIsLoading(true);
        try {
            const res = await apiFetch("/api/categories", {
                method: "PUT",
                body: JSON.stringify(c)
            });
            if (!res.ok) throw new Error("Failed to update category");
            await fetchData();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteCategory = async (id: string) => {
        setIsLoading(true);
        try {
            const res = await apiFetch(`/api/categories?id=${id}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("Failed to delete category");
            await fetchData();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const addStaff = async (s: any) => {
        setIsLoading(true);
        try {
            const res = await apiFetch("/api/admin/staff", {
                method: "POST",
                body: JSON.stringify(s)
            });
            if (!res.ok) throw new Error("Failed to add staff");
            await fetchData();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateStaff = async (s: any) => {
        setIsLoading(true);
        try {
            const res = await apiFetch("/api/admin/staff", {
                method: "POST", // Upsert logic in API
                body: JSON.stringify(s)
            });
            if (!res.ok) throw new Error("Failed to update staff");
            await fetchData();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteStaff = async (id: string) => {
        setIsLoading(true);
        try {
            const res = await apiFetch(`/api/admin/staff?id=${id}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("Failed to remove staff");
            await fetchData();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateOrderStatus = async (id: string, status: string) => {
        setIsLoading(true);
        try {
            const res = await apiFetch("/api/admin/orders/status", {
                method: "PUT",
                body: JSON.stringify({ id, status })
            });
            if (!res.ok) throw new Error("Failed to update order status");
            await fetchData();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const toggleStoreStatus = async () => {
        console.log("ToggleStoreStatus: Current:", isStoreActive);
        try {
            const newStatus = !isStoreActive;
            const res = await apiFetch("/api/admin/store-status", {
                method: "PUT",
                body: JSON.stringify({ isActive: newStatus })
            });
            console.log("ToggleStoreStatus: Response OK:", res.ok);
            if (res.ok) {
                const data = await res.json();
                console.log("ToggleStoreStatus: New Status from API:", data.isActive);
                setIsStoreActive(data.isActive);
            }
        } catch (err) {
            console.error("Failed to toggle store status", err);
        }
    };

    const updateStoreSettings = async (s: Partial<StoreSettings>) => {
        const newSettings = { ...storeSettings, ...s };
        setStoreSettings(newSettings);
    };

    return (
        <AdminContext.Provider value={{
            products, categories, staff, orders, storeSettings,
            isLoading, error, searchQuery,
            setSearchQuery, refreshData: fetchData,
            addProduct, updateProduct, deleteProduct,
            addCategory, updateCategory, deleteCategory,
            addStaff, updateStaff, deleteStaff,
            updateStoreSettings, updateOrderStatus,
            isStoreActive, setIsStoreActive, toggleStoreStatus,
            stats
        }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (!context) throw new Error("useAdmin must be used within AdminProvider");
    return context;
}
