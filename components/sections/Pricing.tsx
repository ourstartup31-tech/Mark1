import React from "react";
import { PricingCard } from "@/components/sections/PricingCard";
import { AnimatedSection } from "@/components/ui/animated-section";

const plans = [
    {
        name: "Basic",
        price: "Free",
        description: "Perfect for occasional shoppers",
        features: [
            "Browse all products",
            "Standard pickup slot",
            "Order history (30 days)",
            "Email support",
        ],
    },
    {
        name: "Plus",
        price: "₹99",
        description: "For regular grocery shoppers",
        features: [
            "Everything in Basic",
            "Priority pickup slot",
            "Exclusive member discounts",
            "Order history (1 year)",
            "Phone & chat support",
        ],
        badge: "Most Popular",
        highlighted: true,
        cta: "Start Free Trial",
    },
    {
        name: "Family",
        price: "₹199",
        description: "Best value for large families",
        features: [
            "Everything in Plus",
            "Express 1-hour pickup",
            "Bulk order discounts",
            "Dedicated account manager",
            "Unlimited order history",
        ],
        badge: "Best Value",
        cta: "Get Family Plan",
    },
];

export function Pricing() {
    return (
        <section className="bg-white py-20 lg:py-24">
            <div className="max-w-7xl mx-auto px-6">
                <AnimatedSection className="text-center mb-16">
                    <p className="text-[10px] items-center justify-center inline-flex gap-2 font-bold text-[#D60000] uppercase tracking-[0.2em] mb-4">
                        <span className="w-1 h-1 rounded-full bg-[#D60000]" />
                        Membership Plans
                    </p>
                    <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tight">
                        Choose Your Plan
                    </h2>
                    <p className="mt-4 text-gray-400 font-medium max-w-sm mx-auto">
                        Unlock exclusive deals and priority pickup slots
                    </p>
                </AnimatedSection>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {plans.map((plan, i) => (
                        <AnimatedSection key={plan.name} delay={i * 80}>
                            <PricingCard {...plan} />
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
}
