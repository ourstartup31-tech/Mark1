"use client";

import React, { useState } from "react";
import { Plus, Minus, ShoppingCart, Check, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    product: Product;
}

// Deterministic pastel colour from product ID (no emojis needed)
const palettes: { bg: string; icon: string }[] = [
    { bg: "bg-red-50", icon: "text-red-300" },
    { bg: "bg-green-50", icon: "text-green-300" },
    { bg: "bg-yellow-50", icon: "text-yellow-300" },
    { bg: "bg-blue-50", icon: "text-blue-300" },
    { bg: "bg-purple-50", icon: "text-purple-300" },
    { bg: "bg-orange-50", icon: "text-orange-300" },
    { bg: "bg-teal-50", icon: "text-teal-300" },
    { bg: "bg-pink-50", icon: "text-pink-300" },
];

function ImagePlaceholder({ id }: { id: number }) {
    const p = palettes[id % palettes.length];
    return (
        <div className={cn("w-full h-44 flex flex-col items-center justify-center gap-2", p.bg)}>
            <ImageIcon size={36} className={p.icon} strokeWidth={1.5} />
            <span className="text-xs font-medium text-gray-300">Product Image</span>
        </div>
    );
}

export function ProductCard({ product }: ProductCardProps) {
    const { state, addItem, increment, decrement, openCart } = useCart();
    const [justAdded, setJustAdded] = useState(false);

    const cartItem = state.items.find((i) => i.id === product.id);
    const quantity = cartItem?.quantity ?? 0;

    const handleAdd = () => {
        addItem(product);
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1400);
    };

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 hover:border-gray-200 transition-all duration-300">
            {/* Minimal line on top on hover */}
            <div className="absolute top-0 inset-x-0 h-0.5 bg-[#D60000] scale-x-0 group-hover:scale-x-100 transition-transform origin-left z-20" />

            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                {product.badge && <Badge variant="default" className="shadow-sm bg-black text-white px-2 py-0.5 text-[10px] uppercase tracking-wider">{product.badge}</Badge>}
                {discount > 0 && <Badge variant="green" className="bg-green-50 text-green-700 border-none px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider">{discount}% off</Badge>}
            </div>

            {/* Image placeholder or actual image */}
            <div className="relative overflow-hidden group-hover:brightness-[0.98] transition-all duration-300">
                {product.image ? (
                    <div className="w-full h-44 overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                ) : (
                    <ImagePlaceholder id={product.id} />
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">{product.category}</p>
                <h3 className="font-bold text-base text-black leading-[1.3] mb-1 group-hover:text-[#D60000] transition-colors">{product.name}</h3>
                <p className="text-xs text-gray-400 mb-4">{product.unit}</p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-5">
                    <span className="text-xl font-bold text-black tracking-tight">₹{product.price}</span>
                    {product.originalPrice && (
                        <span className="text-sm text-gray-300 line-through font-medium">₹{product.originalPrice}</span>
                    )}
                </div>

                {/* Add to Cart / Qty */}
                {quantity === 0 ? (
                    <button
                        onClick={handleAdd}
                        className={cn(
                            "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-200",
                            justAdded
                                ? "bg-green-500 text-white scale-95"
                                : "bg-white border border-gray-200 text-black hover:bg-black hover:text-white hover:border-black active:scale-95"
                        )}
                    >
                        {justAdded ? (
                            <><Check size={14} /> Added</>
                        ) : (
                            <><Plus size={14} /> Add to Cart</>
                        )}
                    </button>
                ) : (
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => decrement(product.id)}
                            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-black hover:text-black transition-all"
                        >
                            <Minus size={14} />
                        </button>
                        <button
                            onClick={openCart}
                            className="flex-1 flex items-center justify-center h-10 rounded-lg bg-black text-white font-bold text-sm hover:bg-gray-900 transition-all"
                        >
                            {quantity} in Cart
                        </button>
                        <button
                            onClick={() => increment(product.id)}
                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-black text-white hover:bg-gray-900 transition-all"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
