"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#categories", label: "Categories" },
    { href: "#products", label: "Offers" },
    { href: "#pickup", label: "Pickup Info" },
];

export function Navbar() {
    const { totalItems, openCart, searchQuery, setSearchQuery } = useCart();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [prevCount, setPrevCount] = useState(0);
    const [badgeKey, setBadgeKey] = useState(0);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 16);
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);

    useEffect(() => {
        if (totalItems > prevCount) setBadgeKey((k) => k + 1);
        setPrevCount(totalItems);
    }, [totalItems, prevCount]);

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 inset-x-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300",
                    scrolled ? "shadow-sm py-2" : "py-4"
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
                        <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm group-hover:scale-105 transition-transform">
                            <span className="text-[#D60000] font-bold text-base">F</span>
                        </div>
                        <div>
                            <p className="font-bold text-lg leading-none tracking-tight text-black">
                                Fresh<span className="text-gray-400">Mart</span>
                            </p>
                            <p className="text-[10px] text-gray-400 font-medium leading-none mt-1">
                                Local Supermarket
                            </p>
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className="relative text-sm font-medium text-gray-500 hover:text-black px-4 py-2 rounded-md transition-colors group"
                            >
                                {l.label}
                                <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-[#D60000] scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
                            </Link>
                        ))}
                    </nav>

                    {/* Right actions */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        {/* Search */}
                        <div className="relative">
                            {searchOpen ? (
                                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                                    <Search size={16} className="text-gray-400 flex-shrink-0" />
                                    <input
                                        autoFocus
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-40 sm:w-52 text-sm outline-none bg-transparent text-black placeholder:text-gray-400"
                                        onBlur={() => !searchQuery && setSearchOpen(false)}
                                    />
                                    <button onClick={() => { setSearchQuery(""); setSearchOpen(false); }}>
                                        <X size={14} className="text-gray-400 hover:text-black" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setSearchOpen(true)}
                                    className="p-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                                    aria-label="Search"
                                >
                                    <Search size={19} />
                                </button>
                            )}
                        </div>

                        {/* Cart */}
                        <button
                            onClick={openCart}
                            className="relative p-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                            aria-label={`Cart (${totalItems} items)`}
                        >
                            <ShoppingCart size={19} />
                            {totalItems > 0 && (
                                <span
                                    key={badgeKey}
                                    className="animate-badge-pop absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#D60000] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm"
                                >
                                    {totalItems > 99 ? "99+" : totalItems}
                                </span>
                            )}
                        </button>

                        {/* Login button */}
                        <Link
                            href="/login"
                            className="hidden sm:inline-flex items-center gap-1.5 bg-black text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-900 active:scale-95 transition-all shadow-sm"
                        >
                            Login
                        </Link>

                        {/* Mobile hamburger */}
                        <button
                            className="md:hidden p-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu size={19} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile drawer */}
            {mobileOpen && (
                <>
                    <div
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-white shadow-2xl flex flex-col animate-slide-in-r">
                        {/* Drawer header — white */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center shadow-sm">
                                    <span className="text-[#D60000] font-bold text-sm">F</span>
                                </div>
                                <span className="font-bold text-base text-black">
                                    FreshMart
                                </span>
                            </div>
                            <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400">
                                <X size={18} />
                            </button>
                        </div>

                        <nav className="flex-1 px-4 py-4 space-y-1">
                            {navLinks.map((l) => (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    className="flex items-center px-3 py-3 text-base font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="px-4 pb-6 space-y-3">
                            <button
                                onClick={() => { setMobileOpen(false); openCart(); }}
                                className="w-full flex items-center justify-center gap-2 bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-900 active:scale-95 transition-all shadow-sm"
                            >
                                <ShoppingCart size={17} />
                                View Cart {totalItems > 0 && `(${totalItems})`}
                            </button>
                            <Link
                                href="/login"
                                className="w-full flex items-center justify-center border border-gray-200 text-black font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors"
                                onClick={() => setMobileOpen(false)}
                            >
                                Login / Sign Up
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
