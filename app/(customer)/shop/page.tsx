"use client";

import React, { useState } from "react";
import { ProductCard } from "@/components/sections/ProductCard";
import { AnimatedSection } from "@/components/ui/animated-section";
import { useStore } from "@/context/StoreContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductFilters, FilterState } from "@/components/sections/ProductFilters";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ShopPage() {
    const { products, categories } = useStore();
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    
    const [filters, setFilters] = useState<FilterState>({
        categories: [],
        maxPrice: null,
        inStockOnly: false
    });

    const filteredProducts = products.filter(p => {
        if (filters.categories.length > 0 && !filters.categories.includes(p.category)) return false;
        if (filters.maxPrice !== null && p.price > filters.maxPrice) return false;
        if (filters.inStockOnly && p.stock <= 0) return false;
        return true;
    });

    return (
        <main className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <div className="flex-1 pt-20 pb-16">
                <section className="max-w-7xl mx-auto px-4 sm:px-6">
                    <AnimatedSection className="flex items-center justify-between mt-4 mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-medium text-black tracking-tight">
                                Shop All
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {filteredProducts.length} products found
                            </p>
                        </div>
                        <button 
                            onClick={() => setIsMobileFilterOpen(true)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium "
                        >
                            <Filter size={16} />
                            Filters
                        </button>
                    </AnimatedSection>
                    
                    <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                        {/* Desktop Filter Sidebar */}
                        <div className="hidden lg:block w-80 flex-shrink-0">
                            <div className="sticky top-24">
                                <ProductFilters 
                                    categories={categories}
                                    initialFilters={filters}
                                    onApply={setFilters}
                                />
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="flex-1">
                            {filteredProducts.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                                    {filteredProducts.map((product, i) => (
                                        <AnimatedSection key={product.id} delay={(i % 10) * 30}>
                                            <ProductCard product={product} />
                                        </AnimatedSection>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100">
                                    <span className="text-4xl mb-4">🔍</span>
                                    <h3 className="text-lg font-medium text-gray-800">No products found</h3>
                                    <p className="text-gray-500">Try adjusting your filters.</p>
                                    <button 
                                        onClick={() => setFilters({ categories: [], maxPrice: null, inStockOnly: false })}
                                        className="mt-4 text-[#D60000] font-medium text-sm uppercase tracking-wider hover:underline"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
            <Footer />

            {/* Mobile Filter Modal */}
            {isMobileFilterOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-white animate-slide-up">
                    <div className="flex-1 overflow-hidden">
                        <ProductFilters 
                            categories={categories}
                            initialFilters={filters}
                            onApply={setFilters}
                            onClose={() => setIsMobileFilterOpen(false)}
                            isMobile={true}
                        />
                    </div>
                </div>
            )}
        </main>
    );
}
