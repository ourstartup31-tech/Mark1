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
        fetchCart,
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
                showToast("Order placed successfully!", "success");
                await fetchCart();
                closeCart();
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
            <div className="fixed top-0 right-0 bottom-0 z-50 w-full sm:max-w-sm bg-white  flex flex-col animate-slide-in-r sm:rounded-l-3xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <ShoppingBag size={16} className="text-[#D60000]" />
                        <h2 className="font-medium text-sm text-black uppercase tracking-widest">Your Cart</h2>
                        {totalItems > 0 && (
                            <span className="bg-[#D60000] text-white text-[9px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-black transition-colors"
                        aria-label="Close cart"
                    >
                        <X size={18} />
                    </button>
                </div>

                {items.length === 0 ? (
                    /* Empty state */
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                            <ShoppingCart size={26} className="text-gray-200" />
                        </div>
                        <div className="text-center">
                            <p className="font-medium text-base text-black tracking-tight">Your cart is empty</p>
                            <p className="text-gray-400 text-xs font-medium mt-1 max-w-[180px] mx-auto">Looks like you haven't added anything yet.</p>
                        </div>
                        <button
                            onClick={() => {
                                closeCart();
                                router.push("/#categories");
                            }}
                            className="mt-2 w-full bg-black text-white font-medium px-6 py-3 rounded-xl hover:bg-gray-900 active:scale-95 transition-all text-sm"
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Scrollable content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">

                            {/* Items */}
                            <div className="px-3 py-3 space-y-2">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="group flex items-center gap-2.5 bg-white border border-slate-100 rounded-xl p-2.5 hover:border-black  transition-all duration-200"
                                    >
                                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 flex-shrink-0">
                                            <span className="text-lg">{item.products.emoji || "📦"}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-[11px] text-black truncate uppercase tracking-tight">{item.products.name}</p>
                                            <p className="text-black font-medium text-xs mt-0.5">
                                                ₹{(Number(item.price) * item.quantity).toFixed(0)}
                                            </p>
                                        </div>
                                        {/* Qty controls */}
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => decrement(item.product_id)}
                                                className="w-6 h-6 rounded-md bg-slate-50 text-slate-500 font-medium text-xs flex items-center justify-center hover:bg-black hover:text-white transition-all border border-transparent"
                                            >
                                                −
                                            </button>
                                            <span className="w-5 text-center font-medium text-xs">{item.quantity}</span>
                                            <button
                                                onClick={() => increment(item.product_id)}
                                                className="w-6 h-6 rounded-md bg-black text-white font-medium text-xs flex items-center justify-center hover:bg-slate-800 transition-all"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="h-px bg-slate-100 mx-4" />

                            {/* Pickup time selector */}
                            <div className="px-3 py-3">
                                <h3 className="text-[9px] font-medium text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                                    <CalendarClock size={10} className="text-[#D60000]" />
                                    Pickup Schedule
                                </h3>
                                <TimeSlotSelector
                                    value={pickupSlot}
                                    onChange={setPickupSlot}
                                />
                            </div>

                            <div className="h-px bg-slate-100 mx-4" />

                            {/* Payment method */}
                            <div className="px-3 py-3">
                                <h3 className="text-[9px] font-medium text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                                    <CreditCard size={10} className="text-[#D60000]" />
                                    Payment Preference
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: "pay-online" as const, label: "Pay Online", sub: "UPI / Card", icon: Smartphone },
                                        { id: "pay-at-store" as const, label: "Pay at Store", sub: "Cash / Card", icon: Store },
                                    ].map((method) => (
                                        <button
                                            key={method.id}
                                            type="button"
                                            onClick={() => setPaymentMethod(method.id)}
                                            className={cn(
                                                "group flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200",
                                                paymentMethod === method.id
                                                    ? "border-black bg-black text-white  "
                                                    : "border-slate-100 bg-white hover:border-slate-300"
                                            )}
                                        >
                                            <method.icon size={16} className={cn("transition-colors", paymentMethod === method.id ? "text-white" : "text-slate-400")} />
                                            <div className="text-center">
                                                <span className={cn("block font-medium text-[10px] tracking-tight", paymentMethod === method.id ? "text-white" : "text-black")}>
                                                    {method.label}
                                                </span>
                                                <span className={cn("text-[8px] font-medium uppercase tracking-widest", paymentMethod === method.id ? "text-white/50" : "text-slate-400")}>
                                                    {method.sub}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-100 px-4 py-3 space-y-2.5 bg-white flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-400 text-xs">Subtotal</span>
                                <span className="font-medium text-black text-sm">₹{totalPrice.toFixed(0)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-400 text-xs flex items-center gap-1.5">
                                    <Store size={11} /> Pickup Fee
                                </span>
                                <span className="font-medium text-green-500 text-xs tracking-widest uppercase">Free</span>
                            </div>

                            <div className="h-px bg-gray-100" />

                            <div className="flex items-center justify-between">
                                <span className="font-medium text-black text-sm">Total</span>
                                <span className="font-medium text-base text-black">₹{totalPrice.toFixed(0)}</span>
                            </div>

                            {!canCheckout && (
                                <p className="text-[9px] text-amber-600 font-medium uppercase tracking-wider text-center bg-amber-50 rounded-lg py-2 px-3 border border-amber-100">
                                    ⚠ Select a pickup slot to continue
                                </p>
                            )}

                            <button
                                onClick={handleCheckout}
                                disabled={!canCheckout}
                                className="w-full py-3.5 bg-[#D60000] text-white font-medium rounded-xl hover:bg-black active:scale-[0.98] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed transition-all duration-200   text-xs uppercase tracking-widest"
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
