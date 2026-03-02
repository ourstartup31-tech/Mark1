"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { products as initialProducts, categories as initialCategories, Product } from "@/data/products";

interface Order {
    id: string;
    customer: string;
    date: string;
    time: string;
    method: string;
    status: string;
    total: string;
}

interface Staff {
    id: number;
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
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    addProduct: (p: any) => void;
    updateProduct: (p: any) => void;
    deleteProduct: (id: number) => void;
    addCategory: (c: any) => void;
    updateCategory: (c: any) => void;
    deleteCategory: (id: number) => void;
    addStaff: (s: any) => void;
    updateStaff: (s: any) => void;
    deleteStaff: (id: number) => void;
    updateStoreSettings: (s: Partial<StoreSettings>) => void;
    updateOrderStatus: (id: string, status: string) => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

const MOCK_ORDERS: Order[] = [
    { id: "#ORD-8829", customer: "Rahul Sharma", date: "Mar 1, 2026", time: "10:30 AM", method: "Online", status: "Pending", total: "₹1,240" },
    { id: "#ORD-8828", customer: "Priya Patel", date: "Mar 1, 2026", time: "09:45 AM", method: "At Store", status: "Pickup", total: "₹850" },
    { id: "#ORD-8827", customer: "Amit Kumar", date: "Feb 28, 2026", time: "07:15 PM", method: "Online", status: "Completed", total: "₹2,100" },
    { id: "#ORD-8826", customer: "Sneha G.", date: "Feb 28, 2026", time: "06:30 PM", method: "Online", status: "Cancelled", total: "₹450" },
];

const MOCK_STAFF: Staff[] = [
    { id: 1, name: "Arjun Mehta", email: "arjun@market.com", phone: "+91 99887-76655", role: "Staff", status: "Active" },
    { id: 2, name: "Sarah Khan", email: "sarah@market.com", phone: "+91 88776-65544", role: "Staff", status: "Active" },
];

export function AdminProvider({ children }: { children: React.ReactNode }) {
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
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const savedProducts = localStorage.getItem("admin_products");
        const savedCats = localStorage.getItem("admin_categories");
        const savedStaff = localStorage.getItem("admin_staff");
        const savedOrders = localStorage.getItem("admin_orders");
        const savedSettings = localStorage.getItem("admin_settings");

        setProducts(savedProducts ? JSON.parse(savedProducts) : initialProducts);
        setCategories(savedCats ? JSON.parse(savedCats) : initialCategories);
        setStaff(savedStaff ? JSON.parse(savedStaff) : MOCK_STAFF);
        setOrders(savedOrders ? JSON.parse(savedOrders) : MOCK_ORDERS);
        if (savedSettings) setStoreSettings(JSON.parse(savedSettings));
    }, []);

    const persist = (key: string, data: any) => {
        localStorage.setItem(key, JSON.stringify(data));
    };

    const addProduct = (p: any) => {
        const newProducts = [...products, { ...p, id: Date.now() }];
        setProducts(newProducts);
        persist("admin_products", newProducts);
    };

    const updateProduct = (p: any) => {
        const newProducts = products.map(item => item.id === p.id ? p : item);
        setProducts(newProducts);
        persist("admin_products", newProducts);
    };

    const deleteProduct = (id: number) => {
        const newProducts = products.filter(item => item.id !== id);
        setProducts(newProducts);
        persist("admin_products", newProducts);
    };

    const addCategory = (c: any) => {
        const newCats = [...categories, { ...c, id: Date.now(), count: 0 }];
        setCategories(newCats);
        persist("admin_categories", newCats);
    };

    const updateCategory = (c: any) => {
        const newCats = categories.map(item => item.id === c.id ? c : item);
        setCategories(newCats);
        persist("admin_categories", newCats);
    };

    const deleteCategory = (id: number) => {
        const newCats = categories.filter(item => item.id !== id);
        setCategories(newCats);
        persist("admin_categories", newCats);
    };

    const addStaff = (s: any) => {
        const newStaff = [...staff, { ...s, id: Date.now() }];
        setStaff(newStaff);
        persist("admin_staff", newStaff);
    };

    const updateStaff = (s: any) => {
        const newStaff = staff.map(item => item.id === s.id ? s : item);
        setStaff(newStaff);
        persist("admin_staff", newStaff);
    };

    const deleteStaff = (id: number) => {
        const newStaff = staff.filter(item => item.id !== id);
        setStaff(newStaff);
        persist("admin_staff", newStaff);
    };

    const updateOrderStatus = (id: string, status: string) => {
        const newOrders = orders.map(o => o.id === id ? { ...o, status } : o);
        setOrders(newOrders);
        persist("admin_orders", newOrders);
    };

    const updateStoreSettings = (s: Partial<StoreSettings>) => {
        const newSettings = { ...storeSettings, ...s };
        setStoreSettings(newSettings);
        persist("admin_settings", newSettings);
    };

    return (
        <AdminContext.Provider value={{
            products, categories, staff, orders, storeSettings,
            searchQuery, setSearchQuery,
            addProduct, updateProduct, deleteProduct,
            addCategory, updateCategory, deleteCategory,
            addStaff, updateStaff, deleteStaff,
            updateStoreSettings, updateOrderStatus
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
