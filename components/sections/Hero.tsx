"use client";

import React, { useEffect, useRef, useState } from "react";
import { Store, Clock, Lock, Leaf, Star, ImageIcon } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { cn } from "@/lib/utils";

/* ─── 3-D magnetic tilt card ────────────────────────────── */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    const cardRef = useRef<HTMLDivElement>(null);

    const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = cardRef.current;
        if (!el) return;
        const { left, top, width, height } = el.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        el.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) scale3d(1.01,1.01,1.01)`;
    };

    const onLeave = () => {
        const el = cardRef.current;
        if (!el) return;
        el.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)";
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className={className}
            style={{ transition: "transform 0.2s ease-out", willChange: "transform", transformStyle: "preserve-3d" }}
        >
            {children}
        </div>
    );
}

export function Hero() {
    const chips = [
        { icon: Store, text: "In-store pickup" },
        { icon: Clock, text: "Choose your time slot" },
        { icon: Lock, text: "Secure payment" },
    ];

    return (
        <section className="relative min-h-[85vh] flex items-center bg-white overflow-hidden pt-28 lg:pt-32 pb-20">
            {/* Minimal background accents */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-50/50 -skew-x-12 translate-x-1/4" />
                <div
                    className="absolute top-1/4 -right-24 w-96 h-96 rounded-full blur-3xl opacity-10"
                    style={{ background: "radial-gradient(circle, #D60000 0%, transparent 70%)" }}
                />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                {/* LEFT — Copy */}
                <div className="max-w-xl">
                    <AnimatedSection delay={0}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-gray-400 text-[10px] font-bold tracking-widest uppercase mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D60000] animate-pulse" />
                            Click & Collect
                        </div>
                    </AnimatedSection>

                    <AnimatedSection delay={100}>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-[1.1] tracking-tight">
                            Freshness <br />
                            <span className="text-gray-300">Reserved for You.</span>
                        </h1>
                    </AnimatedSection>

                    <AnimatedSection delay={200}>
                        <p className="mt-8 text-lg text-gray-500 font-medium leading-relaxed max-w-md">
                            Experience a refined way to shop. Order online and collect
                            your freshly packed essentials in as little as 30 minutes.
                        </p>
                    </AnimatedSection>

                    <AnimatedSection delay={300}>
                        <div className="flex flex-wrap items-center gap-4 mt-10">
                            <button className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-900 transition-all shadow-lg shadow-black/10 active:scale-95">
                                Start Shopping
                            </button>
                            <button className="bg-white text-black border border-gray-200 px-8 py-4 rounded-xl font-bold hover:border-black transition-all active:scale-95">
                                How it Works
                            </button>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection delay={400}>
                        <div className="flex items-center gap-8 mt-12 pt-8 border-t border-gray-50">
                            {chips.map((chip, i) => (
                                <div key={i} className="flex items-center gap-2 group cursor-default">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#D60000] transition-colors">
                                        <chip.icon size={16} />
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 group-hover:text-black transition-colors whitespace-nowrap">
                                        {chip.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>
                </div>

                {/* RIGHT — Visual */}
                <AnimatedSection delay={200} className="hidden lg:block">
                    <TiltCard>
                        <div className="relative">
                            {/* Elegant Placeholder Card */}
                            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200/40">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest leading-none">Your Pickup</p>
                                        <p className="font-bold text-xl text-black">Today, 2:00 PM</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                                        <Clock size={20} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 transition-all">
                                            <div className="w-16 h-16 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-200">
                                                <ImageIcon size={24} />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 w-28 bg-gray-200/50 rounded" />
                                                <div className="h-3 w-14 bg-gray-100 rounded" />
                                            </div>
                                            <p className="font-bold text-black text-lg">$12.00</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-10 pt-8 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="w-10 h-10 rounded-full bg-white border-2 border-white overflow-hidden shadow-sm flex items-center justify-center text-gray-200">
                                                <Leaf size={16} />
                                            </div>
                                        ))}
                                        <div className="w-10 h-10 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-400">+5</div>
                                    </div>
                                    <div className="text-right text-black">
                                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest leading-none mb-1">Total</p>
                                        <p className="font-bold text-2xl tracking-tight">$45.50</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating elements — subtle */}
                            <div className="absolute -top-6 -right-6 bg-white border border-gray-100 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-float">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-yellow-500/80">
                                    <Star size={18} fill="currentColor" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-300 uppercase leading-none mb-0.5">Rating</p>
                                    <p className="font-bold text-black text-sm">4.9 Stars</p>
                                </div>
                            </div>

                            <div className="absolute -bottom-8 -left-8 bg-black text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-float-slow">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/80">
                                    <Leaf size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-white/30 uppercase leading-none mb-0.5">Quality</p>
                                    <p className="font-bold text-white text-sm">100% Fresh</p>
                                </div>
                            </div>
                        </div>
                    </TiltCard>
                </AnimatedSection>
            </div>
        </section>
    );
}
