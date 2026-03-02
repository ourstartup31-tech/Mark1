import React from "react";
import Link from "next/link";

export function Footer() {
    const year = 2026;
    return (
        <footer id="contact" className="bg-[#0A0A0A] text-white overflow-hidden relative">
            {/* Subtle line at top */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/[0.05]">
                    {/* Brand */}
                    <div className="max-w-xs">
                        <Link href="/" className="flex items-center gap-3 mb-6 group">
                            <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center font-bold text-lg transition-transform group-hover:scale-105">
                                F
                            </div>
                            <span className="font-bold text-xl tracking-tight">FreshMart</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8">
                            Experience the future of local shopping. Pre-order fresh groceries and collect them at your convenience.
                        </p>
                        <div className="space-y-3 text-xs text-gray-500 font-medium">
                            <p className="flex items-center gap-2">📍 123 Market Street, City</p>
                            <p className="flex items-center gap-2">📞 +91 98765 43210</p>
                            <p className="flex items-center gap-2">✉ hello@freshmart.in</p>
                        </div>
                    </div>

                    {/* Links */}
                    {[
                        {
                            title: "About Store",
                            links: ["Our Story", "Quality Promise", "Store Hours", "Careers"],
                        },
                        {
                            title: "Pickup Policy",
                            links: [
                                "Pickup Hours",
                                "How It Works",
                                "Return Policy",
                                "Track Order",
                            ],
                        },
                        {
                            title: "Legal",
                            links: [
                                "Privacy Policy",
                                "Terms of Service",
                                "Cookie Policy",
                                "Refund Policy",
                            ],
                        },
                    ].map((col) => (
                        <div key={col.title}>
                            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-6">
                                {col.title}
                            </p>
                            <ul className="space-y-3">
                                {col.links.map((l) => (
                                    <li key={l}>
                                        <Link
                                            href="#"
                                            className="text-gray-500 text-sm hover:text-white transition-colors duration-300"
                                        >
                                            {l}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10">
                    <p className="text-gray-600 text-[11px] font-medium tracking-wide">
                        © {year} FreshMart. Crafted for Quality.
                    </p>
                    <div className="flex items-center gap-4 text-[11px] text-gray-600 font-medium">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                            Systems Active
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
