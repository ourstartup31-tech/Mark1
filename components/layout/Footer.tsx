import React from "react";
import Link from "next/link";
import { Store } from "lucide-react";

export function Footer() {
    const year = 2026;
    return (
        <footer id="contact" className="bg-[#0A0A0A] text-white overflow-hidden relative border-t border-white/[0.05]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 lg:pt-24 pb-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16 pb-16 border-b border-white/[0.05]">
                    {/* Brand */}
                    <div className="lg:col-span-1 max-w-xs text-left">
                        <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white text-black rounded-lg sm:rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
                                <Store size={20} />
                            </div>
                            <span className="font-medium text-xl tracking-tight uppercase tracking-[0.05em]">SuperMarket</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8">
                            Experience the future of local shopping. Pre-order fresh groceries and collect them at your convenience.
                        </p>
                        <div className="space-y-3 text-[11px] text-gray-500 font-medium uppercase tracking-widest">
                            <p className="flex items-center justify-start gap-2">📍 123 Market Street, City</p>
                            <p className="flex items-center justify-start gap-2">📞 +91 98765 43210</p>
                            <p className="flex items-center justify-start gap-2">✉ hello@supermarket.in</p>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12">
                        {[
                            {
                                title: "About Store",
                                links: [
                                    { label: "Our Story", href: "/about" },
                                    { label: "Quality Promise", href: "/about#quality" },
                                    { label: "Careers", href: "/about#careers" }
                                ],
                            },
                            {
                                title: "Pickup Policy",
                                links: [
                                    { label: "How It Works", href: "/#how-it-works" },
                                    { label: "Return Policy", href: "/refund" },
                                    { label: "Track Order", href: "/orders" },
                                ],
                            },
                            {
                                title: "Legal",
                                links: [
                                    { label: "Privacy Policy", href: "/privacy" },
                                    { label: "Terms of Service", href: "/terms" },
                                    { label: "Cookie Policy", href: "/privacy#cookies" },
                                    { label: "Refund Policy", href: "/refund" },
                                ],
                            },
                        ].map((col) => (
                            <div key={col.title} className="text-left">
                                <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-gray-400 mb-6 border-b border-white/[0.05] block pb-2 sm:pb-0">
                                    {col.title}
                                </p>
                                <ul className="space-y-3">
                                    {col.links.map((l) => (
                                        <li key={l.label}>
                                            <Link
                                                href={l.href}
                                                className="text-gray-500 text-[11px] font-medium uppercase tracking-widest hover:text-white transition-colors duration-300"
                                            >
                                                {l.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10">
                    <p className="text-gray-600 text-[10px] font-medium uppercase tracking-[0.15em] text-left">
                        © {year} SuperMarket. Crafted for Quality.
                    </p>
                </div>
            </div>
        </footer>
    );
}
