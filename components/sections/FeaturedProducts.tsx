"use client";

import React, { useState } from "react";
import { ProductCard } from "@/components/sections/ProductCard";
import { AnimatedSection } from "@/components/ui/animated-section";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/lib/utils";

const ALL = "All";

export function FeaturedProducts() {
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
        setActiveCategory(ALL);
        setSearchQuery(""); // Clear search when viewing all
        // Scroll to top of products section if not already there
        const section = document.getElementById("products");
        if (section) section.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section id="products" className="bg-slate-50 py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <AnimatedSection className="text-center mb-12 lg:mb-16">
                    <p className="text-[10px] items-center justify-center inline-flex gap-2 font-bold text-[#D60000] uppercase tracking-[0.2em] mb-4">
                        <span className="w-1 h-1 rounded-full bg-[#D60000]" />
                        Curated Selection
                    </p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black tracking-tight mb-8 text-balance">
                        Featured Products
                    </h2>
                    {/* Horizontal scrollable tabs on small mobile */}
                    <div className="flex items-center lg:justify-center gap-2 mt-8 overflow-x-auto pb-4 sm:pb-0 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
                        {displayTabs.map((tab: string) => (
                            <button
                                key={tab}
                                onClick={() => setActiveCategory(tab)}
                                className={cn(
                                    "px-5 py-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all duration-300 whitespace-nowrap uppercase tracking-widest",
                                    activeCategory === tab
                                        ? "bg-black text-white shadow-lg shadow-black/10"
                                        : "bg-white border border-slate-100 text-slate-400 hover:border-slate-300 hover:text-black"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </AnimatedSection>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
                    {filtered.map((product, i) => (
                        <AnimatedSection key={product.id} delay={i * 50}>
                            <ProductCard product={product} />
                        </AnimatedSection>
                    ))}
                </div>

                <AnimatedSection delay={300} className="text-center mt-12 sm:mt-16">
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
