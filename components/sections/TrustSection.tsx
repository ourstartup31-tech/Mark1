"use client";

import React from "react";
import { Sprout, Clock, ShieldCheck, Store, MapPin, ChevronRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";

const pillars: { Icon: React.ElementType; title: string; description: string; color: string }[] = [
    {
        Icon: Sprout,
        title: "Freshly Packed",
        description: "Every item is freshly packed by our store staff moments before your pickup window.",
        color: "rgba(34,168,98,0.1)",
    },
    {
        Icon: Clock,
        title: "Ready On Time",
        description: "We guarantee your order is packed and ready before your chosen pickup slot.",
        color: "rgba(214,0,0,0.07)",
    },
    {
        Icon: ShieldCheck,
        title: "Secure Payments",
        description: "Pay online via UPI or card, or choose to pay at the pickup counter — your choice.",
        color: "rgba(59,130,246,0.07)",
    },
    {
        Icon: Store,
        title: "Easy Pickup",
        description: "Walk straight to the pickup counter, show your order ID, and you're done in 60 seconds.",
        color: "rgba(234,179,8,0.08)",
    },
];

export function TrustSection() {
    return (
        <section className="bg-white py-20 lg:py-24 relative overflow-hidden">
            {/* Subtle background texture */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.025]"
                style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "40px 40px" }}
            />

            <div className="relative max-w-7xl mx-auto px-6">
                <AnimatedSection className="text-center mb-16">
                    <p className="text-[10px] items-center justify-center inline-flex gap-2 font-bold text-[#D60000] uppercase tracking-[0.2em] mb-4">
                        <span className="w-1 h-1 rounded-full bg-[#D60000]" />
                        Why FreshMart
                    </p>
                    <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tight">
                        Built for Your Convenience
                    </h2>
                    <p className="mt-4 text-gray-400 font-medium max-w-sm mx-auto">
                        A shopping experience designed around your schedule, not ours.
                    </p>
                </AnimatedSection>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {pillars.map((p, i) => (
                        <AnimatedSection key={p.title} delay={i * 90}>
                            <div
                                className="group relative bg-white rounded-2xl border border-gray-100 p-8 hover:border-black hover:shadow-xl hover:shadow-gray-200/40 hover:-translate-y-1 transition-all duration-400 h-full cursor-default"
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-all duration-300 ease-out">
                                        <p.Icon size={24} className="group-hover:text-white" />
                                    </div>
                                    <h3 className="font-bold text-lg text-black mb-3">{p.title}</h3>
                                    <p className="text-gray-500 text-sm font-medium leading-relaxed">{p.description}</p>
                                </div>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>

                {/* Store address banner */}
                <AnimatedSection delay={380} className="mt-12">
                    <div className="bg-white border border-gray-100 rounded-[2rem] px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-8 group relative overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-[#D60000] flex-shrink-0 group-hover:scale-110 transition-transform">
                                <MapPin size={28} />
                            </div>
                            <div>
                                <p className="text-black font-bold text-xl mb-1">Visit Our Store</p>
                                <p className="text-gray-400 text-sm font-medium">Main Market, City Centre · Open 8 AM – 10 PM daily</p>
                            </div>
                        </div>
                        <a
                            href="#pickup"
                            className="flex items-center gap-2 bg-black text-white font-bold text-sm px-8 py-4 rounded-xl hover:bg-gray-800 active:scale-95 transition-all shadow-lg shadow-black/10"
                        >
                            View Pickup Info <ChevronRight size={16} />
                        </a>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
}
