"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Plus, Minus, Check, ArrowLeft, ImageIcon, ShieldCheck, Truck, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/ui/animated-section";
import { cn } from "@/lib/utils";

// Deterministic pastel colour from product ID (no emojis needed)
const palettes = [
    { bg: "bg-red-50", icon: "text-red-300" },
    { bg: "bg-green-50", icon: "text-green-300" },
    { bg: "bg-yellow-50", icon: "text-yellow-300" },
    { bg: "bg-blue-50", icon: "text-blue-300" },
    { bg: "bg-purple-50", icon: "text-purple-300" },
    { bg: "bg-orange-50", icon: "text-orange-300" },
    { bg: "bg-teal-50", icon: "text-teal-300" },
    { bg: "bg-pink-50", icon: "text-pink-300" },
];

function ImagePlaceholder({ id }: { id: string }) {
    const charCodeSum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const p = palettes[charCodeSum % palettes.length];
    return (
        <div className={cn("w-full h-full min-h-[300px] flex flex-col items-center justify-center gap-4", p.bg)}>
            <ImageIcon size={64} className={p.icon} strokeWidth={1.5} />
            <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">Product Image</span>
        </div>
    );
}

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = Array.isArray(params.id) ? params.id[0] : params.id;
    
    const { products, isLoading } = useStore();
    const { state, addItem, increment, decrement, openCart } = useCart();
    const { requireAuth } = useAuth();
    const [justAdded, setJustAdded] = useState(false);

    // Find the product
    const product = products.find(p => p.id === productId);

    const cartItem = state.items.find((i) => i.product_id === productId);
    const quantity = cartItem?.quantity ?? 0;

    const handleAdd = () => {
        if (!requireAuth()) return;
        if (!product) return;
        addItem(product.id);
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1400);
    };

    if (isLoading) {
        return (
            <main className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <div className="flex-1 flex items-center justify-center pt-24">
                    <div className="animate-pulse flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#D60000] rounded-full animate-spin" />
                        <p className="text-gray-500 font-medium">Loading details...</p>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    if (!product) {
        return (
            <main className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <div className="flex-1 flex items-center justify-center pt-24">
                    <div className="text-center">
                        <span className="text-6xl mb-4 block">🔍</span>
                        <h1 className="text-2xl font-medium text-gray-800 mb-2">Product Not Found</h1>
                        <p className="text-gray-500 mb-6">The product you are looking for does not exist or has been removed.</p>
                        <button 
                            onClick={() => router.push("/shop")}
                            className="bg-black text-white px-6 py-3 rounded-lg font-medium text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors"
                        >
                            Return to Shop
                        </button>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <main className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <div className="flex-1 pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black uppercase tracking-wider mb-8 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
                        {/* Left: Product Image */}
                        <div className="md:col-span-2">
                            <AnimatedSection className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative group bg-gray-50 w-full max-w-sm mx-auto">
                                {/* Badges */}
                                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                                    {product.stock === 0 && <Badge className="bg-red-600 text-white px-2 py-0.5 text-[10px] uppercase tracking-wider">Out of stock</Badge>}
                                    {product.badge && <Badge className="bg-black text-white px-2 py-0.5 text-[10px] uppercase tracking-wider">{product.badge}</Badge>}
                                    {discount > 0 && <Badge variant="secondary" className="bg-green-100 text-green-800 px-2 py-0.5 text-[10px] uppercase tracking-wider">{discount}% OFF</Badge>}
                                </div>

                                <div className="aspect-square w-full relative flex items-center justify-center">
                                    {product.image ? (
                                        <img 
                                            src={product.image} 
                                            alt={product.name} 
                                            className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500" 
                                        />
                                    ) : (
                                        <ImagePlaceholder id={product.id} />
                                    )}
                                </div>
                            </AnimatedSection>
                        </div>

                        {/* Right: Product Details */}
                        <AnimatedSection delay={100} className="flex flex-col md:col-span-3">
                            <div className="mb-6">
                                <p className="text-[10px] text-[#D60000] font-medium uppercase tracking-[0.2em] mb-2">
                                    {product.category}
                                </p>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-black tracking-tight mb-3 leading-tight">
                                    {product.name}
                                </h1>
                                <p className="text-sm text-gray-500 mb-5 leading-relaxed max-w-xl">
                                    Experience premium quality with our carefully sourced {product.name.toLowerCase()}. 
                                    Perfect for your daily needs, ensuring freshness and satisfaction in every purchase.
                                </p>
                                
                                <div className="flex items-baseline gap-3 mb-1">
                                    <span className="text-3xl font-medium text-black tracking-tight">₹{product.price}</span>
                                    {product.originalPrice && (
                                        <span className="text-lg text-gray-400 line-through font-medium">₹{product.originalPrice}</span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 font-medium">Inclusive of all taxes • per {product.unit}</p>
                            </div>

                            <div className="w-full h-px bg-gray-100 my-6" />

                            {/* Add to Cart Section */}
                            <div className="mb-8">
                                {product.stock === 0 ? (
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-center">
                                        <p className="text-red-600 font-medium uppercase tracking-wider text-sm mb-1">Out of Stock</p>
                                        <p className="text-red-400 text-xs">We'll restock this item soon.</p>
                                    </div>
                                ) : quantity === 0 ? (
                                    <button
                                        onClick={handleAdd}
                                        className={cn(
                                            "w-full md:w-auto min-w-[200px] flex items-center justify-center gap-3 py-4 rounded-xl font-medium text-sm uppercase tracking-widest transition-all duration-300",
                                            justAdded
                                                ? "bg-green-500 text-white scale-95 shadow-xl shadow-green-500/30"
                                                : "bg-[#D60000] text-white hover:bg-black active:scale-95 shadow-xl shadow-[#D60000]/20"
                                        )}
                                    >
                                        {justAdded ? (
                                            <><Check size={18} /> Added to Cart</>
                                        ) : (
                                            <><ShoppingCart size={18} /> Add to Cart</>
                                        )}
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-3 max-w-[300px]">
                                        <button
                                            onClick={() => decrement(product.id)}
                                            className="w-14 h-14 flex items-center justify-center rounded-xl border-2 border-gray-200 text-gray-500 hover:border-black hover:text-black transition-all"
                                        >
                                            <Minus size={20} />
                                        </button>
                                        <button
                                            onClick={openCart}
                                            className="flex-1 flex items-center justify-center h-14 rounded-xl bg-black text-white font-medium text-sm uppercase tracking-widest hover:bg-gray-900 transition-all shadow-xl shadow-black/20"
                                        >
                                            {quantity} in Cart
                                        </button>
                                        <button
                                            onClick={() => increment(product.id)}
                                            disabled={quantity >= product.stock}
                                            className={cn(
                                                "w-14 h-14 flex items-center justify-center rounded-xl transition-all",
                                                quantity >= product.stock 
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                                    : "bg-black text-white hover:bg-gray-900 shadow-xl shadow-black/20"
                                            )}
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                )}
                                {product.stock > 0 && product.stock <= 10 && (
                                    <p className="text-orange-500 text-xs font-medium mt-3 flex items-center gap-1.5">
                                        <span>⏳</span> Hurry! Only {product.stock} left in stock.
                                    </p>
                                )}
                            </div>

                            {/* Perks */}
                            <div className="grid grid-cols-2 gap-4 mt-auto">
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-green-600">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-black uppercase tracking-wider mb-0.5">Quality Assured</p>
                                        <p className="text-[10px] text-gray-500">100% Genuine</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600">
                                        <Truck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-black uppercase tracking-wider mb-0.5">Fast Delivery</p>
                                        <p className="text-[10px] text-gray-500">Same day shipping</p>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
