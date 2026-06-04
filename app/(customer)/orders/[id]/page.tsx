"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Clock, MapPin, CreditCard, Calendar, User, Package, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CustomerOrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { user, apiFetch, requireAuth } = useAuth();
    
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const orderId = params.id as string;

    const fetchOrder = async () => {
        try {
            setIsLoading(true);
            const res = await apiFetch(`/api/orders/${orderId}`);
            if (!res.ok) {
                if (res.status === 403 || res.status === 404) {
                    throw new Error("Order not found or you don't have permission to view it.");
                }
                throw new Error("Failed to fetch order details");
            }
            const data = await res.json();
            setOrder(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!requireAuth()) return;
        if (user && orderId) {
            fetchOrder();
        }
    }, [user, orderId]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-gray-100 border-t-[#D60000] rounded-full animate-spin mx-auto" />
                    <p className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Loading Order Details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4 text-center px-6">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-2">
                    <Package size={32} />
                </div>
                <p className="text-red-500 font-bold">{error || "Order not found"}</p>
                <button onClick={() => router.push("/orders")} className="bg-black text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-gray-900 transition-colors">
                    Back to My Orders
                </button>
            </div>
        );
    }

    const orderDate = new Date(order.created_at).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' });
    const orderTime = new Date(order.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const statusChangedAt = order.status_changed_at 
        ? new Date(order.status_changed_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) 
        : "Pending Confirmation";

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending": return "bg-amber-50 text-amber-600 border-amber-200";
            case "Confirmed": return "bg-blue-50 text-blue-600 border-blue-200";
            case "Preparing": return "bg-purple-50 text-purple-600 border-purple-200";
            case "Out For Delivery": return "bg-indigo-50 text-indigo-600 border-indigo-200";
            case "Delivered": return "bg-green-50 text-green-600 border-green-200";
            case "Cancelled": return "bg-red-50 text-red-600 border-red-200";
            default: return "bg-gray-50 text-gray-500 border-gray-100";
        }
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Header */}
            <div className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-xl z-20">
                <div className="max-w-4xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push("/orders")} className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 hover:text-black shrink-0">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="font-bold text-xl tracking-tight text-black flex items-center gap-3">
                                Order #{order.id.slice(0, 8).toUpperCase()}
                            </h1>
                            <p className="text-xs text-gray-400 font-medium mt-1">Placed on {orderDate} at {orderTime}</p>
                        </div>
                    </div>
                    <div className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border w-fit flex flex-col",
                        getStatusColor(order.status)
                    )}>
                        {order.status}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Items */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Status Timeline Card */}
                        <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
                            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Tracking Information</h2>
                            
                            <div className="space-y-4">
                                {/* Timeline Item */}
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={cn("w-3 h-3 rounded-full mt-1", order.created_at ? "bg-amber-500" : "bg-gray-200")} />
                                        <div className="w-px h-full bg-gray-200 my-1" />
                                    </div>
                                    <div className="pb-4">
                                        <p className={cn("text-sm font-bold", order.created_at ? "text-black" : "text-gray-400")}>Pending</p>
                                        {order.created_at && <p className="text-[10px] text-gray-500 mt-0.5">{new Date(order.created_at).toLocaleString("en-IN")}</p>}
                                    </div>
                                </div>
                                {/* Timeline Item */}
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={cn("w-3 h-3 rounded-full mt-1", order.confirmed_at ? "bg-blue-500" : "bg-gray-200")} />
                                        <div className="w-px h-full bg-gray-200 my-1" />
                                    </div>
                                    <div className="pb-4">
                                        <p className={cn("text-sm font-bold", order.confirmed_at ? "text-black" : "text-gray-400")}>Confirmed</p>
                                        {order.confirmed_at && <p className="text-[10px] text-gray-500 mt-0.5">{new Date(order.confirmed_at).toLocaleString("en-IN")}</p>}
                                    </div>
                                </div>
                                {/* Timeline Item */}
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={cn("w-3 h-3 rounded-full mt-1", order.preparing_at ? "bg-purple-500" : "bg-gray-200")} />
                                        <div className="w-px h-full bg-gray-200 my-1" />
                                    </div>
                                    <div className="pb-4">
                                        <p className={cn("text-sm font-bold", order.preparing_at ? "text-black" : "text-gray-400")}>Preparing</p>
                                        {order.preparing_at && <p className="text-[10px] text-gray-500 mt-0.5">{new Date(order.preparing_at).toLocaleString("en-IN")}</p>}
                                    </div>
                                </div>
                                {/* Timeline Item */}
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={cn("w-3 h-3 rounded-full mt-1", order.out_for_delivery_at ? "bg-indigo-500" : "bg-gray-200")} />
                                        <div className="w-px h-full bg-gray-200 my-1" />
                                    </div>
                                    <div className="pb-4">
                                        <p className={cn("text-sm font-bold", order.out_for_delivery_at ? "text-black" : "text-gray-400")}>Out For Delivery</p>
                                        {order.out_for_delivery_at && <p className="text-[10px] text-gray-500 mt-0.5">{new Date(order.out_for_delivery_at).toLocaleString("en-IN")}</p>}
                                    </div>
                                </div>
                                {/* Timeline Item */}
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={cn("w-3 h-3 rounded-full mt-1", order.delivered_at ? "bg-green-500" : "bg-gray-200")} />
                                    </div>
                                    <div>
                                        <p className={cn("text-sm font-bold", order.delivered_at ? "text-black" : "text-gray-400")}>Delivered</p>
                                        {order.delivered_at && <p className="text-[10px] text-gray-500 mt-0.5">{new Date(order.delivered_at).toLocaleString("en-IN")}</p>}
                                    </div>
                                </div>
                            </div>
                            
                            {order.status === "Cancelled" && (
                                <div className="mt-6 bg-red-50 p-4 rounded-xl border border-red-100">
                                    <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                                        <XCircle size={14} /> Cancelled
                                    </p>
                                    <p className="text-[10px] text-gray-500 mb-2">{new Date(order.cancelled_at || order.status_changed_at).toLocaleString("en-IN")}</p>
                                    <p className="text-sm font-medium text-red-800 italic">"{order.cancellation_reason || "No reason provided"}"</p>
                                </div>
                            )}
                        </div>

                        {/* Order Items Table */}
                        <div className="space-y-4">
                            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Items Ordered</h2>
                            {order.order_items?.map((item: any) => (
                                <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center font-bold text-2xl border border-gray-100">
                                            {item.products?.emoji || "📦"}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-black">{item.products?.name}</p>
                                            <p className="text-xs text-gray-500 font-medium mt-0.5">₹{Number(item.price).toFixed(2)} × {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-black">₹{(Number(item.price) * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Summary & Info */}
                    <div className="space-y-6">
                        
                        {/* Pickup Info Card */}
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Pickup Details</h2>
                            
                            <div className="space-y-6">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Schedule</p>
                                        <p className="text-sm font-bold text-black capitalize">
                                            {order.pickup_day && order.pickup_slot
                                                ? `${order.pickup_day}, ${order.pickup_slot}`
                                                : "Not specified"}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Store Address</p>
                                        <p className="text-sm font-bold text-black">{order.stores?.name || "Supermarket"}</p>
                                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                            {order.stores?.address || "Address not provided"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Payment Summary</h2>
                            <div className="space-y-4 mb-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500 font-medium">Subtotal ({order.order_items?.reduce((a: number, b: any) => a + b.quantity, 0)} items)</span>
                                    <span className="text-sm font-bold text-black">₹{Number(order.total_price).toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500 font-medium">Taxes & Fees</span>
                                    <span className="text-sm font-bold text-black">₹0.00</span>
                                </div>
                                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <span className="text-sm font-bold text-black">Grand Total</span>
                                    <span className="text-xl font-black text-[#D60000]">₹{Number(order.total_price).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-3 border border-gray-100">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm border border-gray-100">
                                    <CreditCard size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Method</p>
                                    <p className="text-xs font-bold text-black uppercase tracking-wider">{order.payment_method || "Pay at Store"}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
