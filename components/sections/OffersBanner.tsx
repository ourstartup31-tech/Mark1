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
        <section id="offers" className="bg-white py-10">
            <div className="max-w-7xl mx-auto px-6">
                <AnimatedSection>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {offers.map((o) => (
                            <div
                                key={o.label}
                                className={cn(
                                    o.bg,
                                    "border",
                                    o.border,
                                    "rounded-3xl p-5 flex items-center gap-4 hover:shadow-lg hover:shadow-gray-200/40 hover:-translate-y-0.5 transition-all cursor-pointer group"
                                )}
                            >
                                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{o.emoji}</span>
                                <div>
                                    <p className="font-bold text-sm text-black mb-0.5">{o.label}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{o.discount}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
}
