"use client";

import React from "react";
import { ProductCard } from "@/components/sections/ProductCard";
import { AnimatedSection } from "@/components/ui/animated-section";
import { useStore } from "@/context/StoreContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ShopPage() {
    const { products } = useStore();

    return (
        <main className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <div className="flex-1 pt-24 pb-16">
                <section className="max-w-7xl mx-auto px-4 sm:px-6">
                    <AnimatedSection className="text-center mb-12">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black tracking-tight mb-4">
                            All Products
                        </h1>
                        <p className="text-gray-500">
                            Browse our complete collection of products.
                        </p>
                    </AnimatedSection>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
                        {products.map((product, i) => (
                            <AnimatedSection key={product.id} delay={(i % 10) * 50}>
                                <ProductCard product={product} />
                            </AnimatedSection>
                        ))}
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    );
}
