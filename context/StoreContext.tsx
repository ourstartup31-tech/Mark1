"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface StoreContextType {
    products: any[];
    categories: any[];
    isLoading: boolean;
    error: string | null;
    activeCategory: string;
    setActiveCategory: (category: string) => void;
    refreshData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>("All");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/products`, { cache: "no-store" }),
                fetch(`${API_BASE_URL}/api/categories`, { cache: "no-store" })
            ]);

            if (!prodRes.ok) throw new Error(`Products API error: ${prodRes.status}`);
            if (!catRes.ok) throw new Error(`Categories API error: ${catRes.status}`);
            
            const prodData = await prodRes.json();
            const catData = await catRes.json();

            // Map Prisma products to the frontend Product interface
            const mappedProducts = prodData.map((p: any) => ({
                id: p.id,
                name: p.name,
                category: p.categories?.name || "Uncategorized",
                price: Number(p.price),
                unit: p.unit || "per unit",
                emoji: "📦", // Default emoji if not in DB
                inStock: p.is_available ?? true,
                image: p.image_url,
                badge: p.stock_quantity <= 5 ? "Low Stock" : undefined,
                category_id: p.category_id
            }));

            // Static category emojis if they aren't in the DB yet
            const categoryEmojis: Record<string, string> = {
                "Fruits & Vegetables": "🥦",
                "Dairy": "🥛",
                "Snacks": "🍿",
                "Beverages": "🧃",
                "Household": "🏠",
                "Personal Care": "🪥",
                "Default": "📁"
            };

            const categoriesWithCount = catData.map((cat: any) => ({
                ...cat,
                emoji: categoryEmojis[cat.name] || categoryEmojis["Default"],
                count: mappedProducts.filter((p: any) => p.category_id === cat.id).length
            }));

            setProducts(mappedProducts);
            setCategories(categoriesWithCount);
        } catch (err: any) {
            console.error("StoreContext Error:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <StoreContext.Provider value={{ 
            products, 
            categories, 
            isLoading, 
            error, 
            activeCategory,
            setActiveCategory,
            refreshData: fetchData 
        }}>
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return context;
}
