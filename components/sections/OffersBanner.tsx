import React from "react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { cn } from "@/lib/utils";

export function OffersBanner() {
    const offers = [
        { emoji: "🍎", label: "Fruits", discount: "Up to 20% off", bg: "bg-red-50", border: "border-red-100" },
        { emoji: "🥛", label: "Dairy", discount: "Daily fresh deals", bg: "bg-blue-50", border: "border-blue-100" },
        { emoji: "🍿", label: "Snacks", discount: "Buy 2 Get 1 Free", bg: "bg-yellow-50", border: "border-yellow-100" },
        { emoji: "🧃", label: "Beverages", discount: "Flat ₹20 off", bg: "bg-green-50", border: "border-green-100" },
    ];

    return (
        <section id="offers" className="bg-white py-12 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <AnimatedSection>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                        {offers.map((o) => (
                            <div
                                key={o.label}
                                className={cn(
                                    o.bg,
                                    "border",
                                    o.border,
                                    "rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4 hover:shadow-xl hover:shadow-gray-200/40 hover:-translate-y-0.5 transition-all cursor-pointer group"
                                )}
                            >
                                <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300">{o.emoji}</span>
                                <div>
                                    <p className="font-bold text-xs sm:text-sm text-black mb-0.5 uppercase tracking-tight">{o.label}</p>
                                    <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider">{o.discount}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
}
