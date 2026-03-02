"use client";

import React, { useState } from "react";
import { ProductCard } from "@/components/sections/ProductCard";
import { AnimatedSection } from "@/components/ui/animated-section";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { cn } from "@/lib/utils";

const ALL = "All";

export function FeaturedProducts() {
    const { searchQuery } = useCart();
    const { products, categories } = useAdmin();
    const [active, setActive] = useState(ALL);

    const filtered = products.filter((p) => {
        const matchesCategory = active === ALL || p.category === active;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const displayTabs = [ALL, ...categories.map(c => c.name)];

    return (
        <section id="products" className="bg-gray-50 py-20 lg:py-24">
            <div className="max-w-7xl mx-auto px-6">
                <AnimatedSection className="text-center mb-16">
                    <p className="text-[10px] items-center justify-center inline-flex gap-2 font-bold text-[#D60000] uppercase tracking-[0.2em] mb-4">
                        <span className="w-1 h-1 rounded-full bg-[#D60000]" />
                        Curated Selection
                    </p>
                    <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tight mb-6">
                        Featured Products
                    </h2>
                    <div className="flex flex-wrap justify-center gap-2 mt-8">
                        {displayTabs.map((tab: string) => (
                            <button
                                key={tab}
                                onClick={() => setActive(tab)}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                                    active === tab
                                        ? "bg-black text-white shadow-lg shadow-black/10"
                                        : "bg-white border border-gray-100 text-gray-400 hover:border-gray-300 hover:text-black"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </AnimatedSection>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filtered.map((product, i) => (
                        <AnimatedSection key={product.id} delay={i * 50}>
                            <ProductCard product={product} />
                        </AnimatedSection>
                    ))}
                </div>

                <AnimatedSection delay={300} className="text-center mt-10">
                    <button className="inline-flex items-center gap-2 border-2 border-black text-black font-bold px-8 py-3.5 rounded-xl hover:bg-black hover:text-white active:scale-95 transition-all">
                        View All Products
                        <span>→</span>
                    </button>
                </AnimatedSection>
            </div>
        </section>
    );
}
