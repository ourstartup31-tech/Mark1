"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, MapPin, Clock, CreditCard, ShoppingBag, Store, BadgeCheck, Tag, Package, Loader2 } from "lucide-react";

const STORE_ADDRESS = "FreshMart Store, Main Market, City Centre";

function OrderConfirmationContent() {
    const params = useSearchParams();
    const orderId = params.get("orderId") ?? "FM000000";
    const name = params.get("name") ?? "Customer";
    const slot = params.get("slot") ?? "";
    const day = params.get("day") ?? "today";
    const payment = params.get("payment") ?? "pay-online";
    const total = params.get("total") ?? "0";

    const now = new Date();
    const displayDate =
        day === "today"
            ? now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })
            : new Date(now.setDate(now.getDate() + 1)).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <div className="border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-bold text-lg transition-transform group-hover:scale-105">
                            F
                        </div>
                        <span className="font-bold text-xl tracking-tight">FreshMart</span>
                    </Link>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-16 lg:py-24">

                {/* Success header */}
                <div className="text-center space-y-6 mb-16">
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <CheckCircle2 size={80} className="text-[#D60000]" strokeWidth={1} />
                            <div className="absolute inset-0 bg-[#D60000]/10 rounded-full blur-2xl animate-pulse-slow" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bold text-black tracking-tighter">Order Captured.</h1>
                        <p className="text-gray-400 font-medium mt-4 text-lg max-w-lg mx-auto leading-relaxed">
                            Thank you, {name.split(" ")[0]}. Your request has been logged and we're getting everything ready for your visit.
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-3 bg-gray-50 border border-gray-100 px-6 py-3 rounded-2xl">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Order ID</span>
                        <span className="font-bold text-black text-sm tracking-[0.2em]">{orderId}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Left - Details */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-xl shadow-gray-200/20">
                            <div className="px-8 py-6 bg-gray-50 border-b border-gray-50">
                                <h2 className="font-bold text-[10px] text-gray-400 uppercase tracking-[0.2em]">Transaction Details</h2>
                            </div>
                            <div className="divide-y divide-gray-50">
                                <div className="px-8 py-6 flex items-start gap-5">
                                    <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                        <Clock size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Pick up on</p>
                                        <p className="font-bold text-lg text-black tracking-tight">{displayDate}</p>
                                        <p className="font-bold text-[#D60000] text-sm mt-0.5 uppercase tracking-widest">{slot}</p>
                                    </div>
                                </div>
                                <div className="px-8 py-6 flex items-start gap-5">
                                    <div className="w-10 h-10 bg-gray-100 text-black rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Pick up at</p>
                                        <p className="font-bold text-base text-black tracking-tight">{STORE_ADDRESS}</p>
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Standard Store Hours: 8 AM - 10 PM</p>
                                    </div>
                                </div>
                                <div className="px-8 py-6 flex items-start gap-5">
                                    <div className="w-10 h-10 bg-gray-100 text-black rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                        <CreditCard size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Payment Method</p>
                                        <p className="font-bold text-base text-black tracking-tight">
                                            {payment === "pay-online" ? "Digital Transaction" : "Pay at Counter"}
                                        </p>
                                        <p className="font-bold text-black text-sm mt-0.5">₹{total} Total</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/"
                                className="flex-1 flex items-center justify-center gap-3 bg-black text-white font-bold py-5 rounded-2xl hover:bg-gray-900 active:scale-[0.98] transition-all shadow-xl shadow-black/10 uppercase tracking-widest text-[11px]"
                            >
                                <ShoppingBag size={14} />
                                Home
                            </Link>
                            <Link
                                href="#"
                                className="flex-1 flex items-center justify-center gap-3 border border-gray-200 text-black font-bold py-5 rounded-2xl hover:border-black active:scale-[0.98] transition-all uppercase tracking-widest text-[11px]"
                            >
                                Orders
                            </Link>
                        </div>
                    </div>

                    {/* Right - Instructions */}
                    <div className="bg-[#0A0A0A] text-white rounded-[2rem] p-10 relative overflow-hidden shadow-2xl shadow-black/40">
                        <div
                            className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-[100px] bg-[#D60000]/20 pointer-events-none"
                        />
                        <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                            <Store size={14} className="text-[#D60000]" />
                            Next Steps
                        </h2>
                        <ul className="space-y-8">
                            {[
                                { Icon: BadgeCheck, text: "Keep Order ID " + orderId + " handy for store verification." },
                                { Icon: Tag, text: "Visit our dedicated pickup counter upon arrival." },
                                { Icon: Clock, text: "Please arrive during your window: " + slot },
                                { Icon: Package, text: "Our concierge will assist with your assembly." },
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <item.Icon size={14} className="text-gray-400" />
                                    </div>
                                    <span className="text-gray-400 font-medium text-sm leading-relaxed">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-12 pt-10 border-t border-white/[0.05]">
                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.15em] text-center italic">
                                A confirmation mail is on its way.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-3">
                    <Loader2 size={40} className="text-[#D60000] animate-spin mx-auto" />
                    <p className="font-bold text-gray-400">Loading your order…</p>
                </div>
            </div>
        }>
            <OrderConfirmationContent />
        </Suspense>
    );
}
