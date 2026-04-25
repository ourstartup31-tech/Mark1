"use client";

import React, { useEffect, useState } from "react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { cn } from "@/lib/utils";


export function Hero() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch("/api/store-status");
                if (res.ok) {
                    const data = await res.json();
                    setIsOpen(data.isActive);
                }
            } catch (err) {
                console.error("Failed to fetch store status", err);
            }
        };
        fetchStatus();
        const interval = setInterval(fetchStatus, 30000); // Check every 30 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <section
            className="relative min-h-[90vh] flex items-center overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24 bg-slate-900"
            style={{
                backgroundImage: "url('/download.jpeg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px] pointer-events-none" />

            {/* Subtle atmospheric glow */}
            <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#D60000]/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Minimal pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                {/* LEFT Content */}
                <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left order-2 lg:order-1">
                    <AnimatedSection delay={100}>
                        <h1 className="text-4xl xs:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight text-balance">
                            Freshness <br className="hidden xs:block" />
                            <span className="text-white/40">Reserved for You.</span>
                        </h1>
                    </AnimatedSection>

                    <AnimatedSection delay={200}>
                        <p className="mt-6 text-base sm:text-lg text-gray-300 font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
                            Where convenience meets freshness. Place your order online and collect it quickly, packed just for you.
                        </p>
                    </AnimatedSection>

                    <AnimatedSection delay={300}>
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mt-10">
                            <a
                                href="#categories"
                                className="w-full sm:w-auto bg-[#D60000] text-white text-[11px] uppercase tracking-widest px-8 py-4 rounded font-bold hover:bg-[#B50000] transition-all shadow-lg shadow-red-600/20 active:scale-95 text-center"
                            >
                                Start Shopping
                            </a>
                            <button className="w-full sm:w-auto bg-white/10 text-white border border-white/20 text-[11px] uppercase tracking-widest px-8 py-4 rounded font-bold hover:bg-white/20 transition-all active:scale-95 backdrop-blur-sm">
                                How it Works
                            </button>
                        </div>
                    </AnimatedSection>
                </div>

                {/* RIGHT Visual Area — Ultra-Compact Status Bubble (Mobile Nav-Safe) */}
                <div className="order-1 lg:order-2 flex justify-end items-start mt-4 xs:mt-0 -mt-12 xs:-mt-24 sm:-mt-40 lg:-mt-80 lg:-mr-16 px-4 sm:px-0">
                    <AnimatedSection delay={200} className="relative">
                        <div className={cn(
                            "group relative flex items-center justify-center p-3 xs:p-5 md:p-8 transition-all duration-500 hover:scale-105 rotate-[-12deg] lg:rotate-[-8deg] origin-center",
                            isOpen
                                ? "bg-[#27AE60] shadow-[5px_5px_0_#000000] lg:shadow-[8px_8px_0_#000000]"
                                : "bg-rose-500 shadow-[5px_5px_0_#000000] lg:shadow-[8px_8px_0_#000000]"
                        )}
                            style={{
                                borderRadius: '45% 55% 50% 50% / 50% 50% 45% 55%',
                                border: '2.5px solid #000000'
                            }}
                        >
                            {/* Organic Speech Bubble "Tail" */}
                            <div className={cn(
                                "absolute -bottom-1 lg:-bottom-2 right-5 lg:right-8 w-5 lg:w-8 h-5 lg:h-8 border-r-[2.5px] border-b-[2.5px] border-black rotate-[35deg]",
                                isOpen ? "bg-[#27AE60]" : "bg-rose-500"
                            )}></div>

                            <div className="relative flex flex-col items-center text-center">
                                <span className="text-white font-black text-base xs:text-lg md:text-3xl leading-[0.85] tracking-tight uppercase italic drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                                    {isOpen ? "NOW" : "CLOSED"} <br /> {isOpen ? "OPEN" : "NOW"}
                                </span>

                                <div className="mt-2 flex items-center gap-1.5 bg-black/30 px-2 py-0.5 rounded-full border border-black/10">
                                    <div className={cn(
                                        "w-1.5 lg:w-2 h-1.5 lg:h-2 rounded-full shadow-inner",
                                        isOpen ? "bg-[#5DFFAD] animate-pulse" : "bg-white/50"
                                    )}></div>
                                    <span className="text-[7.5px] lg:text-[9px] text-white font-black tracking-widest uppercase">
                                        Store Status
                                    </span>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
}
