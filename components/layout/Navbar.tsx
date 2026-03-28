"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Search, Menu, X, LogOut, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#categories", label: "Categories" },
    { href: "#products", label: "Offers" },
    { href: "#pickup", label: "Pickup Info" },
];

export function Navbar() {
    const { totalItems, openCart, searchQuery, setSearchQuery } = useCart();
    const { role, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
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
                    "fixed top-0 inset-x-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 transition-all duration-300",
                    scrolled ? "py-2" : "py-4"
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 h-12">
                    {/* Logo - Mobile-first sizing */}
                    <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#D60000]/5 rounded-lg sm:rounded-xl flex items-center justify-center border border-[#D60000]/10 shadow-sm group-hover:scale-105 transition-transform">
                            <span className="text-[#D60000] font-bold text-sm sm:text-base">F</span>
                        </div>
                        <div className="hidden xs:block">
                            <p className="font-bold text-base sm:text-lg leading-none tracking-tight text-black">
                                Fresh<span className="text-gray-600">Mart</span>
                            </p>
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden lg:flex items-center gap-1 flex-shrink-0">
                        {navLinks.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className="relative text-sm font-medium text-gray-600 hover:text-black px-3 py-2 rounded-md transition-colors group whitespace-nowrap"
                            >
                                {l.label}
                                <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-[#D60000] scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
                            </Link>
                        ))}
                    </nav>


                    {/* Right actions */}
                    <div className="flex items-center gap-1 sm:gap-3">
                        {/* Persistent Search Bar */}
                        <div className="hidden md:block relative group w-64 lg:w-72">
                            <div className="flex items-center gap-2 bg-gray-50/50 border border-gray-100 rounded-xl px-3 py-2 transition-all group-focus-within:bg-white group-focus-within:border-[#D60000]/20 group-focus-within:shadow-sm">
                                <Search size={15} className="text-gray-400 flex-shrink-0" />
                                <input
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 text-xs font-medium outline-none bg-transparent text-black placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Cart */}
                        <button
                            onClick={openCart}
                            className="relative p-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                            aria-label={`Cart (${totalItems} items)`}
                        >
                            <ShoppingCart size={20} />
                            {totalItems > 0 && (
                                <span
                                    key={badgeKey}
                                    className="absolute top-1 right-1 w-5 h-5 bg-[#D60000] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white"
                                >
                                    {totalItems > 99 ? "99+" : totalItems}
                                </span>
                            )}
                        </button>

                        {/* Auth Button - Desktop */}
                        {role ? (
                            <div className="hidden sm:flex items-center gap-3">
                                <Link
                                    href="/orders"
                                    className="text-xs font-bold text-gray-500 hover:text-black uppercase tracking-widest transition-colors"
                                >
                                    My Orders
                                </Link>
                                <button
                                    onClick={logout}
                                    className="inline-flex items-center gap-1.5 bg-[#D60000] text-white text-[11px] uppercase tracking-widest font-bold px-5 py-2.5 rounded-lg hover:bg-black active:scale-95 transition-all shadow-sm"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden sm:inline-flex items-center gap-1.5 bg-black text-white text-[11px] uppercase tracking-widest font-bold px-5 py-2.5 rounded-lg hover:bg-gray-900 active:scale-95 transition-all shadow-sm"
                            >
                                Login
                            </Link>
                        )}

                        {/* Mobile hamburger */}
                        <button
                            className="md:hidden p-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu size={20} />
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
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 mb-2">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-gray-50 border border-gray-100 rounded flex items-center justify-center shadow-sm">
                                    <span className="text-[#D60000] font-bold text-xs">F</span>
                                </div>
                                <span className="font-bold text-base text-black uppercase tracking-tight">
                                    FreshMart
                                </span>
                            </div>
                            <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <nav className="flex-1 px-4 py-2 space-y-1">
                            {navLinks.map((l) => (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    className="flex items-center px-4 py-3.5 text-sm font-bold text-gray-500 hover:text-black hover:bg-gray-50 rounded transition-all uppercase tracking-widest"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="px-6 pb-8 space-y-3">
                            <button
                                onClick={() => { setMobileOpen(false); openCart(); }}
                                className="w-full flex items-center justify-center gap-2 bg-black text-white text-[11px] uppercase tracking-widest font-bold py-4 rounded hover:bg-gray-900 active:scale-95 transition-all shadow-md shadow-black/5"
                            >
                                <ShoppingCart size={16} />
                                View Cart {totalItems > 0 && `(${totalItems})`}
                            </button>
                            {role ? (
                                <>
                                    <Link
                                        href="/orders"
                                        className="w-full flex items-center justify-center gap-2 border-2 border-slate-100 text-black text-[11px] uppercase tracking-widest font-bold py-4 rounded hover:bg-slate-50 transition-colors"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <Package size={16} />
                                        My Orders
                                    </Link>
                                    <button
                                        onClick={() => { setMobileOpen(false); logout(); }}
                                        className="w-full flex items-center justify-center gap-2 bg-[#D60000] text-white text-[11px] uppercase tracking-widest font-bold py-4 rounded hover:bg-black active:scale-95 transition-all shadow-md shadow-black/5"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="w-full flex items-center justify-center border-2 border-slate-100 text-black text-[11px] uppercase tracking-widest font-bold py-4 rounded hover:bg-slate-50 transition-colors"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}