"use client";

import React from "react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ShoppingCart, CalendarClock, Store, MapPin } from "lucide-react";

const steps = [
    {
        step: "01",
        Icon: ShoppingCart,
        title: "Add Items to Cart",
        description: "Browse our full range of fresh groceries and add everything you need to your cart.",
    },
    {
        step: "02",
        Icon: CalendarClock,
        title: "Choose Pickup Time",
        description: "Select a convenient time slot — today or tomorrow — to collect your order from the store.",
    },
    {
        step: "03",
        Icon: Store,
        title: "Collect from Store",
        description: "Come to the store at your chosen time, show your order ID, and walk away with fresh groceries.",
    },
];

export function HowItWorks() {
    return (
        <section id="pickup" className="bg-[#0A0A0A] py-24 lg:py-32 relative overflow-hidden">
            {/* Minimal line accents */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="relative max-w-7xl mx-auto px-6">
                <AnimatedSection className="text-center mb-20">
                    <p className="text-[10px] items-center justify-center inline-flex gap-2 font-bold text-[#D60000] uppercase tracking-[0.2em] mb-4">
                        <span className="w-1 h-1 rounded-full bg-[#D60000]" />
                        Simple & Seamless
                    </p>
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        How Store Pickup Works
                    </h2>
                    <p className="mt-5 text-gray-400 font-medium max-w-sm mx-auto">
                        A modern way to shop. No waiting, no fees, just fresh groceries.
                    </p>
                </AnimatedSection>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, i) => {
                        const Icon = step.Icon;
                        return (
                            <AnimatedSection key={step.step} delay={i * 140}>
                                <div className="group relative h-full bg-white/[0.02] border border-white/[0.05] rounded-3xl p-10 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-500 cursor-default">
                                    {/* Step indicator — subtle */}
                                    <div className="text-[5rem] font-bold text-white/[0.02] absolute -top-4 -left-2 leading-none select-none group-hover:text-white/[0.05] transition-colors duration-500">
                                        {step.step}
                                    </div>

                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-2xl bg-white/[0.05] flex items-center justify-center mb-8 border border-white/5 group-hover:bg-[#D60000] group-hover:border-[#D60000] transition-all duration-300">
                                            <Icon size={24} className="text-white/60 group-hover:text-white transition-colors" />
                                        </div>

                                        <h3 className="font-bold text-xl text-white mb-4 tracking-tight">{step.title}</h3>
                                        <p className="text-gray-400 text-sm font-medium leading-[1.6]">{step.description}</p>
                                    </div>
                                </div>
                            </AnimatedSection>
                        );
                    })}
                </div>

                <AnimatedSection delay={400} className="text-center mt-16">
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.03] border border-white/5">
                        <MapPin size={16} className="text-[#D60000]" />
                        <p className="text-gray-400 text-sm font-medium">
                            Store: <span className="text-white">Main Market, City Centre</span>
                        </p>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
}
