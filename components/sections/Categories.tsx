"use client";

import React from "react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { useStore } from "@/context/StoreContext";

export function Categories() {
    const { categories, setActiveCategory } = useStore();
    
    const handleCategoryClick = (name: string) => {
        setActiveCategory(name);
        // Smooth scroll to products section
        const section = document.getElementById("products");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section id="categories" className="bg-white py-16 lg:py-24 scroll-mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <AnimatedSection className="text-center mb-12 lg:mb-16">
                    <p className="text-[10px] items-center justify-center inline-flex gap-2 font-bold text-[#D60000] uppercase tracking-[0.2em] mb-4">
                        <span className="w-1 h-1 rounded-full bg-[#D60000]" />
                        Our Categories
                    </p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black tracking-tight text-balance">
                        Shop by Category
                    </h2>
                    <p className="mt-4 text-sm sm:text-base text-slate-400 font-medium max-w-xs sm:max-w-sm mx-auto">
                        Browse our full range of fresh products by category
                    </p>
                </AnimatedSection>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
                    {categories.map((cat, i) => (
                        <AnimatedSection key={cat.id} delay={i * 60}>
                            <button 
                                onClick={() => handleCategoryClick(cat.name)}
                                className="w-full group bg-white border border-slate-100 rounded-2xl p-4 sm:p-6 text-center hover:border-black hover:shadow-xl hover:shadow-gray-200/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                            >
                                <div className="text-2xl sm:text-3xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {cat.emoji}
                                </div>
                                <p className="font-bold text-xs sm:text-sm text-black leading-tight mb-1 uppercase tracking-tight">
                                    {cat.name}
                                </p>
                                <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                    {cat.count || 0} items
                                </p>
                                <div className="h-0.5 w-0 group-hover:w-8 bg-black rounded-full mx-auto mt-4 transition-all duration-300" />
                            </button>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
}
