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
    isStoreOpen: boolean;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>("All");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isStoreOpen, setIsStoreOpen] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [prodRes, catRes, statusRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/products`, { cache: "no-store" }),
                fetch(`${API_BASE_URL}/api/categories`, { cache: "no-store" }),
                fetch(`${API_BASE_URL}/api/store-status`, { cache: "no-store" })
            ]);

            if (!prodRes.ok) throw new Error(`Products API error: ${prodRes.status}`);
            if (!catRes.ok) throw new Error(`Categories API error: ${catRes.status}`);
            
            const prodData = await prodRes.json();
            const catData = await catRes.json();
            
            if (statusRes.ok) {
                const statusData = await statusRes.json();
                setIsStoreOpen(statusData.isActive);
            }

            // Map Prisma products to the frontend Product interface
            const mappedProducts = prodData.map((p: any) => ({
                id: p.id,
                name: p.name,
                category: p.categories?.name || "Uncategorized",
                price: Number(p.price),
                unit: p.unit || "unit",
                emoji: "📦", // Default emoji if not in DB
                stock: p.stock_quantity ?? 0,
                image: p.image_url,
                badge: p.stock_quantity <= 5 ? "Low Stock" : undefined,
                category_id: p.category_id
            }));

            // Smart category emoji mapper
            const getCategoryEmoji = (name: string) => {
                const lowerName = name.toLowerCase();
                if (lowerName.includes("fruit")) return "🍎";
                if (lowerName.includes("veg")) return "🥬";
                if (lowerName.includes("dairy") || lowerName.includes("milk")) return "🥛";
                if (lowerName.includes("cloth") || lowerName.includes("apparel")) return "👕";
                if (lowerName.includes("crocery") || lowerName.includes("grocer")) return "🛒";
                if (lowerName.includes("snack") || lowerName.includes("chips")) return "🍿";
                if (lowerName.includes("beverage") || lowerName.includes("drink")) return "🧃";
                if (lowerName.includes("house") || lowerName.includes("home")) return "🏠";
                if (lowerName.includes("care") || lowerName.includes("health")) return "🪥";
                if (lowerName.includes("meat") || lowerName.includes("chicken")) return "🍗";
                if (lowerName.includes("fish") || lowerName.includes("seafood")) return "🐟";
                if (lowerName.includes("bakery") || lowerName.includes("bread")) return "🍞";
                // Better default generic icon instead of folder
                return "🛍️";
            };

            const categoriesWithCount = catData.map((cat: any) => ({
                ...cat,
                emoji: getCategoryEmoji(cat.name),
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
            refreshData: fetchData,
            isStoreOpen 
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
