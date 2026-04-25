"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle, ArrowLeft, Loader2, Store, MapPin } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

const STORE_ADDRESS = "SuperMarket Store, Main Market, City Centre — Open 8 AM – 10 PM";

export default function CheckoutPage() {
    const { state, totalPrice, clearCartOnServer, fetchCart } = useCart();
    const { user, apiFetch } = useAuth();
    const { items, pickupSlot, paymentMethod } = state;
    const router = useRouter();

    const [billing, setBilling] = useState({ 
        name: user?.name || "", 
        phone: user?.phone || "", 
        email: "" 
    });
    const [errors, setErrors] = useState<Partial<typeof billing>>({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const validate = () => {
        const e: Partial<typeof billing> = {};
        if (!billing.name.trim()) e.name = "Full name is required";
        if (!billing.phone.trim()) e.phone = "Phone number is required";
        return e;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBilling((p) => ({ ...p, [name]: value }));
        if (errors[name as keyof typeof billing])
            setErrors((p) => ({ ...p, [name]: undefined }));
    };

    const handlePlaceOrder = async () => {
        if (!user) {
            router.push("/login?callbackUrl=/checkout");
            return;
        }

        if (!pickupSlot?.slot) {
            setApiError("Please select a pickup slot in your cart first");
            return;
        }

        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        
        setLoading(true);
        setApiError(null);

        try {
            const res = await apiFetch("/api/orders", {
                method: "POST",
                body: JSON.stringify({
                    pickup_slot: pickupSlot.slot,
                    pickup_day: pickupSlot.day,
                    payment_method: paymentMethod
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to place order");
            }

            const orderId = data.orders?.[0]?.id || data.id || "SUCCESS";
            await fetchCart(); // Clear cart state locally
            
            router.push(`/order-confirmation?orderId=${orderId}&name=${encodeURIComponent(billing.name)}&slot=${encodeURIComponent(pickupSlot.slot)}&day=${pickupSlot.day}&payment=${paymentMethod}&total=${totalPrice.toFixed(0)}`);
        } catch (error: any) {
            setApiError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const isValid = billing.name && billing.phone && billing.email;

    if (!items.length && !loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="text-5xl">🛒</div>
                    <h2 className="text-2xl font-bold">Your cart is empty</h2>
                    <Link href="/" className="inline-block bg-[#D60000] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#b50000] transition-all">
                        Back to Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top nav */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
                            <Store size={22} />
                        </div>
                        <span className="font-bold text-xl tracking-tight">SuperMarket</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em]">
                        <span className="text-gray-300">Cart</span>
                        <span className="text-gray-200">/</span>
                        <span className="text-black">Checkout</span>
                        <span className="text-gray-200">/</span>
                        <span className="text-gray-300">Confirmation</span>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-black transition-colors text-xs font-bold uppercase tracking-widest"
                    >
                        <ArrowLeft size={14} />
                        Back to Store
                    </Link>
                    <h1 className="mt-4 text-4xl font-bold text-black tracking-tight">Finalize Order</h1>
                    <p className="text-gray-400 font-medium mt-2">Confirm your pickup details and billing information.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12">

                    {/* Left — Billing */}
                    <div className="space-y-8">
                        {apiError && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-2xl animate-in fade-in slide-in-from-top-2">
                                ⚠️ {apiError}
                            </div>
                        )}
                        <div className="bg-white rounded-[2rem] border border-gray-100 p-10">
                            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#D60000]" />
                                Billing Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <Input
                                        label="Full Name"
                                        type="text"
                                        name="name"
                                        id="name"
                                        placeholder="Enter your name"
                                        value={billing.name}
                                        onChange={handleChange}
                                        error={errors.name}
                                        className="rounded-xl border-gray-100 focus:border-black"
                                    />
                                </div>
                                <Input
                                    label="Phone Number"
                                    type="tel"
                                    name="phone"
                                    id="phone"
                                    placeholder="98765 43210"
                                    value={billing.phone}
                                    onChange={handleChange}
                                    error={errors.phone}
                                    className="rounded-xl border-gray-100 focus:border-black"
                                />
                                <Input
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="rahul@example.com"
                                    value={billing.email}
                                    onChange={handleChange}
                                    error={errors.email}
                                    className="rounded-xl border-gray-100 focus:border-black"
                                />
                            </div>
                        </div>

                        {/* Pickup details */}
                        <div className="bg-white rounded-[2rem] border border-gray-100 p-10">
                            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#D60000]" />
                                Pickup & Delivery
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                    <MapPin size={18} className="text-[#D60000] mb-3" />
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Store Location</p>
                                    <p className="font-bold text-black text-sm leading-relaxed">{STORE_ADDRESS}</p>
                                </div>
                                {pickupSlot?.slot ? (
                                    <div className="p-6 bg-black text-white rounded-2xl border border-black shadow-xl shadow-black/10">
                                        <Store size={18} className="text-white mb-3" />
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Schedule</p>
                                        <p className="font-bold text-white text-sm capitalize">
                                            {pickupSlot.day}, {pickupSlot.slot}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                                        <p className="text-xs font-bold text-amber-600">Please select a pickup slot in your cart.</p>
                                    </div>
                                )}
                                <div className="md:col-span-2 p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">{paymentMethod === "pay-online" ? "📱" : "🏪"}</span>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Method</p>
                                            <p className="font-bold text-black text-sm">
                                                {paymentMethod === "pay-online" ? "Online Transaction" : "Pay in Person"}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Selected</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right — Order summary */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[2rem] border border-gray-100 p-8 sticky top-32">
                            <h2 className="font-bold text-xl text-black mb-8 tracking-tight">Order Summary</h2>

                            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 flex-shrink-0">
                                            <span className="text-xl">{item.products.emoji || "📦"}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-black truncate">{item.products.name}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-sm text-black">
                                            ₹{(Number(item.price) * item.quantity).toFixed(0)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 py-6 border-t border-gray-100">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-medium italic">Subtotal</span>
                                    <span className="font-bold text-black">₹{totalPrice.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-medium italic flex items-center gap-1"><Store size={14} /> Pickup Fee</span>
                                    <span className="font-bold text-green-500 uppercase tracking-widest text-[11px]">Free</span>
                                </div>
                            </div>

                            <div className="flex justify-between py-6 border-t border-gray-100">
                                <span className="font-bold text-black text-lg">Total</span>
                                <span className="font-bold text-2xl text-black">₹{totalPrice.toFixed(0)}</span>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading || !isValid || !pickupSlot?.slot}
                                className="w-full py-5 bg-[#D60000] text-white font-bold rounded-2xl hover:bg-black active:scale-[0.98] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed transition-all duration-300 shadow-xl shadow-red-600/10 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={16} />
                                        Confirm Order
                                    </>
                                )}
                            </button>

                            <p className="text-[10px] text-gray-400 text-center mt-6 font-bold uppercase tracking-widest">
                                🔒 Encrypted Checkout
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
