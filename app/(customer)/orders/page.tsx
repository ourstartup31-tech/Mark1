"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ShoppingBag, Package, Clock, ChevronRight, Loader2, ArrowLeft, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderItem {
    id: string;
    product_id: string;
    quantity: number;
    price: number;
    product: {
        name: string;
        emoji: string;
    };
}

interface Order {
    id: string;
    total_amount: number;
    status: string;
    pickup_slot: string;
    pickup_day: string;
    created_at: string;
    items: OrderItem[];
    store: {
        name: string;
    };
}

export default function OrdersPage() {
    const { user, apiFetch, requireAuth, isLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
        if (isLoading || !user) return; // Wait for auth
        setLoading(true);
        setError(null);
        try {
            const res = await apiFetch("/api/orders/my");
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
            } else {
                setError("Failed to fetch orders");
            }
        } catch (e) {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!requireAuth()) return;
        fetchOrders();
    }, [user, isLoading]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending": return "bg-amber-50 text-amber-600 border-amber-100";
            case "confirmed": return "bg-blue-50 text-blue-600 border-blue-100";
            case "preparing": return "bg-indigo-50 text-indigo-600 border-indigo-100";
            case "ready": return "bg-green-50 text-green-600 border-green-100";
            case "completed": return "bg-slate-50 text-slate-500 border-slate-200";
            case "cancelled": return "bg-red-50 text-red-600 border-red-100";
            default: return "bg-gray-50 text-gray-500 border-gray-100";
        }
    };

    if (loading && !orders.length) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center space-y-4">
                    <Loader2 size={40} className="animate-spin text-[#D60000] mx-auto" />
                    <p className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Loading History</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Header */}
            <div className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-xl z-20">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 hover:text-black">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="font-bold text-xl tracking-tight">My Orders</h1>
                    </div>
                    <button 
                        onClick={fetchOrders}
                        className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 hover:text-black"
                        title="Refresh"
                    >
                        <RefreshCw size={18} className={cn(loading && "animate-spin")} />
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-10">
                {error ? (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
                        <p className="text-red-600 font-bold mb-4">{error}</p>
                        <button onClick={fetchOrders} className="bg-black text-white px-6 py-2 rounded-xl font-bold text-sm">Retry</button>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border border-gray-100 border-dashed">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center border border-gray-100 mx-auto mb-6 shadow-sm">
                            <ShoppingBag size={32} className="text-gray-200" />
                        </div>
                        <h2 className="font-bold text-xl text-black">No orders yet</h2>
                        <p className="text-gray-400 mt-2 font-medium">Your request history will appear here once you place an order.</p>
                        <Link href="/" className="mt-8 inline-block bg-black text-white font-bold px-8 py-4 rounded-xl hover:bg-gray-900 transition-all">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div 
                                key={order.id}
                                className="group bg-white border border-gray-100 rounded-[2rem] overflow-hidden hover:border-[#D60000]/20 hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-500"
                            >
                                <div className="px-8 py-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-bold text-sm text-gray-400 border border-gray-100 group-hover:bg-[#D60000]/5 group-hover:text-[#D60000] group-hover:border-[#D60000]/10 transition-colors">
                                            ID
                                        </div>
                                        <div>
                                            <p className="font-bold text-black tracking-tight uppercase tracking-widest text-xs">Order #{order.id.slice(0, 8)}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                                                {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={cn(
                                            "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                                            getStatusColor(order.status)
                                        )}>
                                            {order.status}
                                        </span>
                                        <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                <div className="px-8 py-8 flex flex-col md:flex-row gap-8">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                                            <Package size={14} className="text-[#D60000]" />
                                            Items Summary
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                                                    <span className="text-sm">{item.product.emoji || "📦"}</span>
                                                    <span className="text-xs font-bold text-black">{item.product.name}</span>
                                                    <span className="text-[10px] font-bold text-gray-400">×{item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="w-px bg-gray-50 hidden md:block" />

                                    <div className="flex flex-col justify-between items-end min-w-[140px]">
                                        <div className="text-right">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 justify-end">
                                                <Clock size={12} />
                                                Pickup Window
                                            </div>
                                            <p className="font-bold text-black text-sm capitalize">{order.pickup_day}</p>
                                            <p className="font-bold text-[#D60000] text-xs uppercase tracking-widest mt-0.5">{order.pickup_slot}</p>
                                        </div>
                                        <div className="pt-6 text-right">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5 italic">Transaction Total</p>
                                            <p className="font-bold text-2xl text-black tracking-tighter">₹{Number(order.total_amount).toFixed(0)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
