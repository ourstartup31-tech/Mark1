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
                apiFetch(`/api/admin/store-status?t=${Date.now()}`, { cache: "no-store" }),
                apiFetch(`/api/admin/stats?t=${Date.now()}`, { cache: "no-store" })
            ]);

            if (prodRes.ok) {
                const prodData = await prodRes.json();
                const mappedProducts = prodData.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    category: p.categories?.name || "Uncategorized",
                    price: Number(p.price),
                    stock: p.stock_quantity || 0,
                    unit: p.description?.replace("Unit: ", "") || "per unit",
                    inStock: p.is_available ?? true,
                    image: p.image_url,
                    category_id: p.category_id
                }));
                setProducts(mappedProducts);
            }
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
                // Backend returns a plain array, not { orders: [] }
                const ordersList = Array.isArray(data) ? data : (data.orders || []);
                
                // Map API orders to context Order interface
                const mappedOrders = ordersList.map((o: any) => ({
                    id: o.id,
                    customer: o.users?.name || o.users?.phone || "Unknown Customer",
                    date: new Date(o.created_at).toLocaleDateString("en-IN"),
                    time: new Date(o.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
                    method: o.payment_method || "Pay at Store",
                    status: o.status,
                    total: `₹${Number(o.total_price).toFixed(2)}`,
                    pickup_slot: o.pickup_slot || null,
                    pickup_day: o.pickup_day || null,
                    items: (o.order_items || []).map((item: any) => ({
                        ...item,
                        products: {
                            name: item.products?.name || "Product",
                            emoji: item.products?.emoji || "📦"
                        }
                    }))
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
            const categoryObj = categories.find(c => c.name === p.category);
            const payload = {
                name: p.name,
                price: p.price,
                stock_quantity: p.stock,
                category_id: categoryObj?.id,
                is_available: p.inStock,
                image_url: p.image,
                description: p.unit ? `Unit: ${p.unit}` : null
            };
            const res = await apiFetch("/api/products", {
                method: "POST",
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("Failed to add product");
            await fetchData();
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const updateProduct = async (p: any) => {
        setIsLoading(true);
        try {
            const categoryObj = categories.find(c => c.name === p.category);
            const payload = {
                name: p.name,
                price: p.price,
                stock_quantity: p.stock,
                category_id: categoryObj?.id,
                is_available: p.inStock,
                image_url: p.image,
                description: p.unit ? `Unit: ${p.unit}` : null
            };
            const res = await apiFetch(`/api/products/${p.id}`, {
                method: "PUT",
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("Failed to update product");
            await fetchData();
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteProduct = async (id: string) => {
        setIsLoading(true);
        try {
            const res = await apiFetch(`/api/products/${id}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("Failed to delete product");
            await fetchData();
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
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
        } finally {
            setIsLoading(false);
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
        } finally {
            setIsLoading(false);
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
        } finally {
            setIsLoading(false);
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
        } finally {
            setIsLoading(false);
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
        } finally {
            setIsLoading(false);
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
        } finally {
            setIsLoading(false);
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
        } finally {
            setIsLoading(false);
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
