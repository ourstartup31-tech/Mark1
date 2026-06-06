"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/sections/ProductCard";
import { AnimatedSection } from "@/components/ui/animated-section";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/lib/utils";
import { Shirt, ShoppingBasket, Milk, Apple, Carrot, Package, Grid, Heart, Home, Coffee } from "lucide-react";

const ALL = "All";

export function FeaturedProducts() {
    const router = useRouter();
    const { searchQuery, setSearchQuery } = useCart();
    const { products, categories, activeCategory, setActiveCategory } = useStore();

    const filtered = products.filter((p) => {
        const matchesCategory = activeCategory === ALL || (p.categories?.name === activeCategory || p.category === activeCategory);
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.categories?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const displayTabs = [ALL, ...categories.map(c => c.name)];

    const handleViewAll = () => {
        router.push("/shop");
    };

    const getCategoryIcon = (name: string) => {
        if (name === ALL) return <Grid className="w-6 h-6 sm:w-8 sm:h-8" />;
        const lower = name.toLowerCase();
        if (lower.includes("cloth")) return <Shirt className="w-6 h-6 sm:w-8 sm:h-8" />;
        if (lower.includes("crocery") || lower.includes("grocer")) return <ShoppingBasket className="w-6 h-6 sm:w-8 sm:h-8" />;
        if (lower.includes("dairy")) return <Milk className="w-6 h-6 sm:w-8 sm:h-8" />;
        if (lower.includes("fruit")) return <Apple className="w-6 h-6 sm:w-8 sm:h-8" />;
        if (lower.includes("veg")) return <Carrot className="w-6 h-6 sm:w-8 sm:h-8" />;
        if (lower.includes("snack")) return <Coffee className="w-6 h-6 sm:w-8 sm:h-8" />;
        if (lower.includes("home") || lower.includes("house")) return <Home className="w-6 h-6 sm:w-8 sm:h-8" />;
        if (lower.includes("care") || lower.includes("health")) return <Heart className="w-6 h-6 sm:w-8 sm:h-8" />;
        return <Package className="w-6 h-6 sm:w-8 sm:h-8" />;
    };

    return (
        <section id="products" className="bg-slate-50 py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <AnimatedSection className="text-center mb-8 lg:mb-12">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black tracking-tight mb-2 text-balance">
                        Featured Products
                    </h2>
                </AnimatedSection>

                {/* Blinkit Style Layout */}
                <div className="flex bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden h-[600px] md:h-[700px]">
                    {/* Left Sidebar - Categories */}
                    <div className="w-24 sm:w-32 flex-shrink-0 border-r border-gray-200 overflow-y-auto bg-gray-50 scrollbar-hide">
                        {displayTabs.map((tab: string) => {
                            const isActive = activeCategory === tab;
                            
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveCategory(tab)}
                                    className={cn(
                                        "w-full flex flex-col items-center justify-center p-3 sm:p-4 text-center border-b border-gray-200 transition-all",
                                        isActive 
                                            ? "bg-white border-l-4 border-l-[#D60000] text-[#D60000] shadow-[inset_0_0_10px_rgba(0,0,0,0.02)]" 
                                            : "bg-gray-50 text-gray-500 hover:bg-gray-100 border-l-4 border-l-transparent"
                                    )}
                                >
                                    <div className={cn("mb-2 flex items-center justify-center", isActive ? "scale-110 transition-transform" : "")}>
                                        {getCategoryIcon(tab)}
                                    </div>
                                    <span className={cn("text-[10px] sm:text-xs leading-tight line-clamp-2", isActive ? "font-bold text-black" : "font-medium")}>
                                        {tab}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    
                    {/* Right Content - Products Grid */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white relative">
                        <div className="sticky top-0 bg-white/95 backdrop-blur z-10 pb-4 mb-2 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg sm:text-xl font-bold text-black">
                                {activeCategory === ALL ? "All Items" : activeCategory}
                                <span className="text-sm font-normal text-gray-500 ml-2">
                                    ({filtered.length} products)
                                </span>
                            </h3>
                        </div>

                        {filtered.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 pb-20">
                                {filtered.map((product, i) => (
                                    <AnimatedSection key={product.id} delay={(i % 10) * 50}>
                                        <ProductCard product={product} />
                                    </AnimatedSection>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <span className="text-4xl mb-4">🔍</span>
                                <p className="text-gray-500 font-medium">No products found in this category.</p>
                            </div>
                        )}
                    </div>
                </div>

                <AnimatedSection delay={100} className="text-center mt-8 sm:mt-12">
                    <button 
                        onClick={handleViewAll}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-black text-black text-[11px] uppercase tracking-widest font-bold px-8 py-4 rounded hover:bg-black hover:text-white active:scale-95 transition-all"
                    >
                        View All Products
                        <span>→</span>
                    </button>
                </AnimatedSection>
            </div>
        </section>
    );
}
