"use client";

import React from "react";
import { X, Trash2, ShoppingBag, Store, ShoppingCart, CalendarClock, CreditCard, Smartphone, AlertTriangle, ImageIcon } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { TimeSlotSelector } from "@/components/ui/TimeSlotSelector";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

export function CartDrawer() {
    const {
        state,
        closeCart,
        removeItem,
        increment,
        decrement,
        setPaymentMethod,
        setPickupSlot,
        totalPrice,
        totalItems,
        clearCartOnServer,
    } = useCart();
    const { showToast } = useToast();
    const router = useRouter();
    const { user, apiFetch, requireAuth } = useAuth();
    const { items, isOpen, paymentMethod, pickupSlot, isLoading } = state;

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
                    payment_method: paymentMethod
                })
            });

            if (res.ok) {
                const data = await res.json();
                closeCart();
                showToast("Order placed successfully!", "success");
                // Just take the first order ID for the confirmation page for now
                const orderId = data.orders?.[0]?.id || "SUCCESS";
                router.push(`/order-confirmation?orderId=${orderId}&slot=${pickupSlot.slot}&day=${pickupSlot.day}&total=${totalPrice}&payment=${paymentMethod}`);
            } else {
                const data = await res.json();
                showToast(data.error || "Failed to place order", "error");
            }
        } catch (e) {
            showToast("Network error during checkout", "error");
        }
    };

    // LOCK BODY SCROLL WHEN OPEN
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                onClick={closeCart}
            />

            {/* Drawer */}
            <div className="fixed top-0 right-0 bottom-0 z-50 w-full sm:max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-r sm:rounded-l-[2.5rem] overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 sm:px-8 sm:py-6 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                        <ShoppingBag size={18} className="text-[#D60000] sm:w-5 sm:h-5" />
                        <h2 className="font-bold text-lg sm:text-xl text-black tracking-tight uppercase tracking-widest">Your Cart</h2>
                        {totalItems > 0 && (
                            <span className="bg-black text-white text-[9px] sm:text-[10px] font-bold rounded-full w-4.5 h-4.5 sm:w-5 sm:h-5 flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-black transition-colors"
                        aria-label="Close cart"
                    >
                        <X size={20} />
                    </button>
                </div>

                {items.length === 0 ? (
                    /* Empty state */
                    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-10">
                        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center border border-gray-100">
                            <ShoppingCart size={32} className="text-gray-200" />
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-xl text-black tracking-tight">Your cart is empty</p>
                            <p className="text-gray-400 text-sm font-medium mt-2 max-w-[200px] mx-auto">Looks like you haven't added anything yet.</p>
                        </div>
                        <button
                            onClick={closeCart}
                            className="mt-4 w-full bg-black text-white font-bold px-8 py-4 rounded-xl hover:bg-gray-900 active:scale-95 transition-all"
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Scrollable content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">

                            {/* Items */}
                            <div className="px-4 py-4 sm:px-8 sm:py-6 space-y-3">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="group flex items-center gap-3 sm:gap-4 bg-white border border-slate-50 rounded-2xl p-3 sm:p-4 hover:border-black hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300"
                                    >
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 flex-shrink-0 group-hover:scale-105 transition-transform">
                                            <div className="text-xl sm:text-2xl">
                                                {item.products.emoji || "📦"}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-xs sm:text-sm text-black truncate mb-0.5 uppercase tracking-tight">{item.products.name}</p>
                                            <p className="text-black font-bold text-sm sm:text-base">
                                                ₹{(Number(item.price) * item.quantity).toFixed(0)}
                                            </p>
                                        </div>
                                        {/* Qty controls */}
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            <button
                                                onClick={() => decrement(item.product_id)}
                                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-50 text-slate-400 font-bold text-xs flex items-center justify-center hover:bg-black hover:text-white transition-all border border-transparent"
                                            >
                                                −
                                            </button>
                                            <span className="w-3 text-center font-bold text-xs sm:text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => increment(item.product_id)}
                                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-black text-white font-bold text-xs flex items-center justify-center hover:bg-slate-900 transition-all"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="h-px bg-slate-50 mx-6 sm:mx-8" />

                            {/* Pickup time selector */}
                            <div className="px-4 py-6 sm:px-8 sm:py-8">
                                <h3 className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <CalendarClock size={12} className="text-[#D60000]" />
                                    Pickup Schedule
                                </h3>
                                <TimeSlotSelector
                                    value={pickupSlot}
                                    onChange={setPickupSlot}
                                />
                            </div>

                            <div className="h-px bg-slate-50 mx-6 sm:mx-8" />

                            {/* Payment method */}
                            <div className="px-4 py-6 sm:px-8 sm:py-8">
                                <h3 className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <CreditCard size={12} className="text-[#D60000]" />
                                    Payment Preference
                                </h3>
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    {[
                                        { id: "pay-online" as const, label: "Pay Online", sub: "UPI / Card", icon: Smartphone },
                                        { id: "pay-at-store" as const, label: "Pay at Store", sub: "Cash / Card", icon: Store },
                                    ].map((method) => (
                                        <button
                                            key={method.id}
                                            type="button"
                                            onClick={() => setPaymentMethod(method.id)}
                                            className={cn(
                                                "group flex flex-col items-center gap-2 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border transition-all duration-300",
                                                paymentMethod === method.id
                                                    ? "border-black bg-black text-white shadow-xl shadow-black/10"
                                                    : "border-slate-100 bg-white hover:border-slate-300"
                                            )}
                                        >
                                            <method.icon size={20} className={cn("transition-colors", paymentMethod === method.id ? "text-white" : "text-slate-400")} />
                                            <div className="text-center">
                                                <span className={cn("block font-bold text-[11px] sm:text-sm tracking-tight", paymentMethod === method.id ? "text-white" : "text-black")}>
                                                    {method.label}
                                                </span>
                                                <span className={cn("text-[8px] sm:text-[9px] font-bold uppercase tracking-widest", paymentMethod === method.id ? "text-white/40" : "text-slate-400")}>
                                                    {method.sub}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-100 px-6 py-6 sm:px-8 sm:py-8 space-y-4 bg-white">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-400 text-sm italic">Subtotal</span>
                                    <span className="font-bold text-black text-lg">₹{totalPrice.toFixed(0)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-400 text-sm italic flex items-center gap-2">
                                        <Store size={14} /> Pickup Fee
                                    </span>
                                    <span className="font-bold text-green-500 text-sm tracking-widest uppercase">Free</span>
                                </div>
                            </div>

                            <div className="h-px bg-gray-50" />

                            <div className="flex items-center justify-between pb-2">
                                <span className="font-bold text-black text-xl tracking-tight">Total Payment</span>
                                <span className="font-bold text-2xl text-black tracking-tight">₹{totalPrice.toFixed(0)}</span>
                            </div>

                            {!canCheckout && (
                                <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider text-center bg-amber-50 rounded-xl py-3 px-4 border border-amber-100 animate-pulse-subtle">
                                    Selection Required: Pickup Slot
                                </p>
                            )}

                            <button
                                onClick={handleCheckout}
                                disabled={!canCheckout}
                                className="w-full py-5 bg-[#D60000] text-white font-bold rounded-2xl hover:bg-black active:scale-[0.98] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed transition-all duration-300 shadow-xl shadow-red-600/10 hover:shadow-black/20 text-sm uppercase tracking-widest"
                            >
                                Secure Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
