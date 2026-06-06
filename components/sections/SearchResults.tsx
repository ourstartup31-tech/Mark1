"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/sections/ProductCard";
import { AnimatedSection } from "@/components/ui/animated-section";

export function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const { products } = useStore();

    const filtered = useMemo(() => {
        if (!query.trim()) return [];
        const lowerQuery = query.toLowerCase();
        
        return products.filter((p) => {
            const matchesName = p.name.toLowerCase().includes(lowerQuery);
            const matchesDesc = (p.description || "").toLowerCase().includes(lowerQuery);
            const matchesCategory = (p.categories?.name || p.category || "").toLowerCase().includes(lowerQuery);
            
            return matchesName || matchesDesc || matchesCategory;
        });
    }, [products, query]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <AnimatedSection className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-medium text-black mb-2">
                    Search Results
                </h1>
                {query ? (
                    <p className="text-gray-500">
                        Showing results for <span className="font-semibold text-black">"{query}"</span>
                    </p>
                ) : (
                    <p className="text-gray-500">Please enter a search term.</p>
                )}
            </AnimatedSection>

            {query && filtered.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
                    {filtered.map((product, i) => (
                        <AnimatedSection key={product.id} delay={i * 50}>
                            <ProductCard product={product} />
                        </AnimatedSection>
                    ))}
                </div>
            ) : query && filtered.length === 0 ? (
                <AnimatedSection className="py-16 text-center bg-white rounded-2xl border border-gray-100 ">
                    <p className="text-lg text-gray-500 font-medium">
                        No products found for '{query}'.
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                        Try checking your spelling or using more general terms.
                    </p>
                </AnimatedSection>
            ) : null}
        </div>
    );
}
