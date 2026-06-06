"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { TimeSlotSelector } from "@/components/ui/TimeSlotSelector";
import {
    ShoppingCart, ArrowLeft, Trash2, Store,
    CreditCard, Smartphone, CalendarClock, ShoppingBag, Package
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function CartPage() {
    const {
        state,
        removeItem,
        increment,
        decrement,
        setPaymentMethod,
        setPickupSlot,
        totalPrice,
        totalItems,
        fetchCart,
    } = useCart();
    const { showToast } = useToast();
    const { user, apiFetch, requireAuth } = useAuth();
    const router = useRouter();
    const { items, paymentMethod, pickupSlot, isLoading } = state;

    const canCheckout = items.length > 0 && pickupSlot?.slot && !isLoading;

    const handleCheckout = async () => {
        if (!requireAuth()) return;
        if (!pickupSlot?.slot) {
            showToast("Please select a pickup time slot", "error");
            return;
        }
        showToast("Placing your order...", "info");
        try {
            const res = await apiFetch("/api/orders", {
                method: "POST",
                body: JSON.stringify({
                    pickup_slot: pickupSlot.slot,
                    pickup_day: pickupSlot.day,
                    payment_method: paymentMethod,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                showToast("Order placed successfully!", "success");
                await fetchCart();
                const orderId = data.orders?.[0]?.id || "SUCCESS";
                router.push(
                    `/order-confirmation?orderId=${orderId}&slot=${pickupSlot.slot}&day=${pickupSlot.day}&total=${totalPrice}&payment=${paymentMethod}`
                );
            } else {
                const data = await res.json();
                showToast(data.error || "Failed to place order", "error");
            }
        } catch {
            showToast("Network error during checkout", "error");
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f8fa]">
            <Navbar />
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors"
                    >
                        <ArrowLeft size={18} />
                        <span className="hidden sm:inline">Continue Shopping</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <ShoppingBag size={16} className="text-[#D60000]" />
                        <span className="font-medium text-sm text-black uppercase tracking-widest">My Cart</span>
                        {totalItems > 0 && (
                            <span className="bg-[#D60000] text-white text-[9px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </div>
                    <div className="w-24" /> {/* spacer */}
                </div>
            </div>

            {/* Empty State */}
            {items.length === 0 && (
                <div className="flex flex-col items-center justify-center min-h-[70vh] gap-5 px-6">
                    <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center border border-gray-100 ">
                        <ShoppingCart size={40} className="text-gray-200" />
                    </div>
                    <div className="text-center">
                        <p className="font-medium text-xl text-black">Your cart is empty</p>
                        <p className="text-gray-400 text-sm mt-2">Browse our products and add items to your cart.</p>
                    </div>
                    <Link
                        href="/#categories"
                        className="mt-2 bg-black text-white font-medium px-8 py-3.5 rounded-xl hover:bg-[#D60000] active:scale-95 transition-all text-sm"
                    >
                        Browse Products
                    </Link>
                </div>
            )}

            {/* Cart Content */}
            {items.length > 0 && (
                <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

                    {/* LEFT: Items + Options */}
                    <div className="space-y-4">

                        {/* Items Card */}
                        <div className="bg-white rounded-2xl border border-gray-100  overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                                <h2 className="font-medium text-sm text-black uppercase tracking-widest">
                                    Items ({totalItems})
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors group">
                                        {/* Emoji / Image */}
                                        <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 flex-shrink-0 text-2xl">
                                            {item.products.emoji || "📦"}
                                        </div>

                                        {/* Name + Price */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm text-black truncate">{item.products.name}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">₹{Number(item.price).toFixed(0)} × {item.quantity}</p>
                                        </div>

                                        {/* Total */}
                                        <p className="font-medium text-sm text-black w-16 text-right">
                                            ₹{(Number(item.price) * item.quantity).toFixed(0)}
                                        </p>

                                        {/* Qty Controls */}
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => decrement(item.product_id)}
                                                className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 font-medium text-sm flex items-center justify-center hover:bg-black hover:text-white transition-all"
                                            >
                                                −
                                            </button>
                                            <span className="w-6 text-center font-medium text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => increment(item.product_id)}
                                                className="w-7 h-7 rounded-lg bg-black text-white font-medium text-sm flex items-center justify-center hover:bg-[#D60000] transition-all"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Remove */}
                                        <button
                                            onClick={() => removeItem(item.product_id)}
                                            className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                            aria-label="Remove"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pickup Schedule Card */}
                        <div className="bg-white rounded-2xl border border-gray-100  p-5">
                            <h3 className="font-medium text-sm text-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                <CalendarClock size={14} className="text-[#D60000]" />
                                Pickup Schedule
                            </h3>
                            <TimeSlotSelector value={pickupSlot} onChange={setPickupSlot} />
                        </div>

                        {/* Payment Method Card */}
                        <div className="bg-white rounded-2xl border border-gray-100  p-5">
                            <h3 className="font-medium text-sm text-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                <CreditCard size={14} className="text-[#D60000]" />
                                Payment Method
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: "pay-online" as const, label: "Pay Online", sub: "UPI / Card", icon: Smartphone },
                                    { id: "pay-at-store" as const, label: "Pay at Store", sub: "Cash / Card", icon: Store },
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={cn(
                                            "flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left",
                                            paymentMethod === method.id
                                                ? "border-black bg-black text-white "
                                                : "border-gray-100 bg-white hover:border-gray-300"
                                        )}
                                    >
                                        <method.icon
                                            size={18}
                                            className={paymentMethod === method.id ? "text-white" : "text-gray-400"}
                                        />
                                        <div>
                                            <p className={cn("font-medium text-xs", paymentMethod === method.id ? "text-white" : "text-black")}>
                                                {method.label}
                                            </p>
                                            <p className={cn("text-[10px] font-semibold uppercase tracking-widest mt-0.5", paymentMethod === method.id ? "text-white/50" : "text-gray-400")}>
                                                {method.sub}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Order Summary */}
                    <div className="lg:sticky lg:top-20 self-start">
                        <div className="bg-white rounded-2xl border border-gray-100  overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-50">
                                <h2 className="font-medium text-sm text-black uppercase tracking-widest">Order Summary</h2>
                            </div>
                            <div className="px-5 py-4 space-y-3">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500 truncate max-w-[55%]">{item.products.name} × {item.quantity}</span>
                                        <span className="text-xs font-medium text-black">₹{(Number(item.price) * item.quantity).toFixed(0)}</span>
                                    </div>
                                ))}

                                <div className="h-px bg-gray-100 my-1" />

                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400">Subtotal</span>
                                    <span className="text-sm font-medium text-black">₹{totalPrice.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400 flex items-center gap-1"><Store size={11} /> Pickup Fee</span>
                                    <span className="text-xs font-medium text-green-500 uppercase tracking-widest">Free</span>
                                </div>

                                <div className="h-px bg-gray-100 my-1" />

                                <div className="flex justify-between items-center pt-1">
                                    <span className="font-medium text-sm text-black">Total</span>
                                    <span className="font-medium text-xl text-black">₹{totalPrice.toFixed(0)}</span>
                                </div>
                            </div>

                            <div className="px-5 pb-5 space-y-3">
                                {!canCheckout && (
                                    <p className="text-[10px] text-amber-700 font-semibold text-center bg-amber-50 border border-amber-100 rounded-lg py-2.5 px-3">
                                        ⚠ Please select a pickup time slot
                                    </p>
                                )}
                                <button
                                    onClick={handleCheckout}
                                    disabled={!canCheckout}
                                    className="w-full py-4 bg-[#D60000] text-white font-medium rounded-xl hover:bg-black active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 text-xs uppercase tracking-widest  "
                                >
                                    Place Order
                                </button>
                                <Link
                                    href="/"
                                    className="w-full py-3 border border-gray-100 text-black font-semibold rounded-xl hover:bg-gray-50 transition-all text-xs uppercase tracking-widest text-center block"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
