"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Clock, CheckCircle, Package, Truck, XCircle, User, MapPin, CreditCard, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { user, apiFetch } = useAuth();
    
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState("");
    const [cancellationReason, setCancellationReason] = useState("");
    const [showCancelPrompt, setShowCancelPrompt] = useState(false);

    const orderId = params.id as string;

    const fetchOrder = async () => {
        try {
            setIsLoading(true);
            const res = await apiFetch(`/api/admin/orders/${orderId}`);
            if (!res.ok) throw new Error("Failed to fetch order details");
            const data = await res.json();
            setOrder(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user && orderId) {
            fetchOrder();
        }
    }, [user, orderId]);

    const updateStatus = async (newStatus: string) => {
        if (newStatus === "Cancelled" && !showCancelPrompt) {
            setShowCancelPrompt(true);
            return;
        }

        if (newStatus === "Cancelled" && !cancellationReason.trim()) {
            alert("Please provide a reason for cancellation.");
            return;
        }

        try {
            setIsUpdating(true);
            const res = await apiFetch(`/api/admin/orders/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    id: orderId, 
                    status: newStatus,
                    cancellation_reason: newStatus === "Cancelled" ? cancellationReason : undefined
                })
            });
            if (!res.ok) throw new Error("Failed to update status");
            await fetchOrder(); // Refresh to get the new status_changed_at
            setShowCancelPrompt(false);
            setCancellationReason("");
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    const isTransitionAllowed = (current: string, target: string) => {
        if (current === target) return true; // Technically redundant, but let's allow it so button shows current state
        if (current === "Pending" && ["Confirmed", "Cancelled"].includes(target)) return true;
        if (current === "Confirmed" && ["Preparing", "Cancelled"].includes(target)) return true;
        if (current === "Preparing" && ["Out For Delivery", "Cancelled"].includes(target)) return true;
        if (current === "Out For Delivery" && ["Delivered"].includes(target)) return true;
        return false;
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-amber-600 rounded-full animate-spin" />
                <p className="text-gray-400 font-medium text-xs uppercase tracking-widest">Loading Order Details...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
                <p className="text-red-500 font-medium">{error || "Order not found"}</p>
                <button onClick={() => router.back()} className="text-gray-500 underline text-sm">Go Back</button>
            </div>
        );
    }

    const orderDate = new Date(order.created_at).toLocaleDateString("en-IN");
    const orderTime = new Date(order.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const statusChangedAt = order.status_changed_at 
        ? new Date(order.status_changed_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) 
        : "Never";

    const statusColors: Record<string, string> = {
        "Pending": "bg-amber-50 text-amber-600 border-amber-200",
        "Confirmed": "bg-blue-50 text-blue-600 border-blue-200",
        "Preparing": "bg-purple-50 text-purple-600 border-purple-200",
        "Out For Delivery": "bg-indigo-50 text-indigo-600 border-indigo-200",
        "Delivered": "bg-green-50 text-green-600 border-green-200",
        "Cancelled": "bg-red-50 text-red-600 border-red-200",
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative pb-20">
            {isUpdating && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-50 flex items-center justify-center rounded-[3rem]">
                    <div className="w-8 h-8 border-3 border-gray-100 border-t-amber-600 rounded-full animate-spin" />
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-4 text-sm font-medium">
                        <ArrowLeft size={16} /> Back to Orders
                    </button>
                    <h1 className="text-3xl font-medium text-black tracking-tight flex items-center gap-3">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                        <span className={cn("px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-widest border", statusColors[order.status] || "bg-gray-50 text-gray-600")}>
                            {order.status}
                        </span>
                    </h1>
                    <p className="text-gray-400 font-medium mt-1 text-sm">Placed on {orderDate} at {orderTime}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Customer & Items */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer & Delivery Card */}
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 ">
                        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-6">Customer & Pickup Info</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-1">Customer</p>
                                        <p className="text-sm font-medium text-black">{order.users?.name || "Unknown Customer"}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{order.users?.phone || "No Phone Number"}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-1">Pickup Schedule</p>
                                        <p className="text-sm font-medium text-black capitalize">
                                            {order.pickup_day && order.pickup_slot
                                                ? `${order.pickup_day}, ${order.pickup_slot}`
                                                : "Not specified"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-1">Pickup Store Address</p>
                                    <p className="text-sm font-medium text-black">{order.stores?.name || "Supermarket"}</p>
                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-[200px]">
                                        {order.stores?.address || "Address not provided"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 ">
                        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-6">Line Items</h2>
                        <div className="space-y-4">
                            {order.order_items?.map((item: any) => (
                                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-medium text-2xl  border border-gray-100">
                                            {item.products?.emoji || "📦"}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-black">{item.products?.name}</p>
                                            <p className="text-xs text-gray-500 font-medium mt-0.5">₹{Number(item.price).toFixed(2)} × {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-black">₹{(Number(item.price) * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Summary & Actions */}
                <div className="space-y-6">
                    {/* Payment Summary */}
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 ">
                        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-6">Payment Summary</h2>
                        <div className="space-y-4 mb-6">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 font-medium">Subtotal ({order.order_items?.reduce((a: number, b: any) => a + b.quantity, 0)} items)</span>
                                <span className="text-sm font-medium text-black">₹{Number(order.total_price).toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 font-medium">Taxes & Fees</span>
                                <span className="text-sm font-medium text-black">₹0.00</span>
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-sm font-medium text-black">Grand Total</span>
                                <span className="text-xl font-black text-amber-500">₹{Number(order.total_price).toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 ">
                                <CreditCard size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-0.5">Payment Method</p>
                                <p className="text-sm font-medium text-black uppercase tracking-wider">{order.payment_method || "Pay at Store"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Status Update Card */}
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 ">
                        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-6">Manage Status</h2>
                        
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <button
                                disabled={!isTransitionAllowed(order.status, "Pending") && order.status !== "Pending"}
                                onClick={() => updateStatus("Pending")}
                                className={cn(
                                    "flex items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all font-medium text-[10px] uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed",
                                    order.status === "Pending" ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-white border-gray-50 text-gray-400 hover:border-amber-100 hover:text-amber-500"
                                )}
                            >
                                <Clock size={14} /> Pending
                            </button>
                            <button
                                disabled={!isTransitionAllowed(order.status, "Confirmed") && order.status !== "Confirmed"}
                                onClick={() => updateStatus("Confirmed")}
                                className={cn(
                                    "flex items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all font-medium text-[10px] uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed",
                                    order.status === "Confirmed" ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white border-gray-50 text-gray-400 hover:border-blue-100 hover:text-blue-500"
                                )}
                            >
                                <CheckCircle size={14} /> Confirmed
                            </button>
                            <button
                                disabled={!isTransitionAllowed(order.status, "Preparing") && order.status !== "Preparing"}
                                onClick={() => updateStatus("Preparing")}
                                className={cn(
                                    "flex items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all font-medium text-[10px] uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed",
                                    order.status === "Preparing" ? "bg-purple-50 border-purple-200 text-purple-600" : "bg-white border-gray-50 text-gray-400 hover:border-purple-100 hover:text-purple-500"
                                )}
                            >
                                <Package size={14} /> Preparing
                            </button>
                            <button
                                disabled={!isTransitionAllowed(order.status, "Out For Delivery") && order.status !== "Out For Delivery"}
                                onClick={() => updateStatus("Out For Delivery")}
                                className={cn(
                                    "flex items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all font-medium text-[10px] uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed",
                                    order.status === "Out For Delivery" ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-white border-gray-50 text-gray-400 hover:border-indigo-100 hover:text-indigo-500"
                                )}
                            >
                                <Truck size={14} /> Out For Delivery
                            </button>
                            <button
                                disabled={!isTransitionAllowed(order.status, "Delivered") && order.status !== "Delivered"}
                                onClick={() => updateStatus("Delivered")}
                                className={cn(
                                    "flex items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all font-medium text-[10px] uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed",
                                    order.status === "Delivered" ? "bg-green-50 border-green-200 text-green-600" : "bg-white border-gray-50 text-gray-400 hover:border-green-100 hover:text-green-500"
                                )}
                            >
                                <CheckCircle size={14} /> Delivered
                            </button>
                            <button
                                disabled={!isTransitionAllowed(order.status, "Cancelled") && order.status !== "Cancelled"}
                                onClick={() => updateStatus("Cancelled")}
                                className={cn(
                                    "flex items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all font-medium text-[10px] uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed",
                                    order.status === "Cancelled" ? "bg-red-50 border-red-200 text-red-600" : "bg-white border-gray-50 text-gray-400 hover:border-red-100 hover:text-red-500"
                                )}
                            >
                                <XCircle size={14} /> Cancel
                            </button>
                        </div>

                        {showCancelPrompt && order.status !== "Cancelled" && (
                            <div className="mb-6 bg-red-50 p-4 rounded-2xl border border-red-100">
                                <p className="text-xs font-medium text-red-600 mb-2 uppercase tracking-widest">Reason for Cancellation</p>
                                <textarea
                                    value={cancellationReason}
                                    onChange={(e) => setCancellationReason(e.target.value)}
                                    placeholder="Enter reason..."
                                    className="w-full bg-white border border-red-200 rounded-xl p-3 text-sm focus:outline-none focus:border-red-400 mb-3"
                                    rows={3}
                                />
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setShowCancelPrompt(false)}
                                        className="flex-1 bg-white border border-gray-200 text-gray-500 py-2 rounded-xl text-xs font-medium uppercase tracking-wider hover:bg-gray-50"
                                    >
                                        Back
                                    </button>
                                    <button 
                                        onClick={() => updateStatus("Cancelled")}
                                        className="flex-1 bg-red-600 text-white py-2 rounded-xl text-xs font-medium uppercase tracking-wider hover:bg-red-700"
                                    >
                                        Confirm Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="pt-4 border-t border-gray-100">
                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-4">Order Timeline</p>
                            <div className="space-y-4">
                                {/* Timeline Item */}
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={cn("w-3 h-3 rounded-full mt-1", order.created_at ? "bg-amber-500" : "bg-gray-200")} />
                                        <div className="w-px h-full bg-gray-100 my-1" />
                                    </div>
                                    <div className="pb-4">
                                        <p className={cn("text-sm font-medium", order.created_at ? "text-black" : "text-gray-400")}>Pending</p>
                                        {order.created_at && <p className="text-[10px] text-gray-500 mt-0.5">{new Date(order.created_at).toLocaleString("en-IN")}</p>}
                                    </div>
                                </div>
                                {/* Timeline Item */}
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={cn("w-3 h-3 rounded-full mt-1", order.confirmed_at ? "bg-blue-500" : "bg-gray-200")} />
                                        <div className="w-px h-full bg-gray-100 my-1" />
                                    </div>
                                    <div className="pb-4">
                                        <p className={cn("text-sm font-medium", order.confirmed_at ? "text-black" : "text-gray-400")}>Confirmed</p>
                                        {order.confirmed_at && <p className="text-[10px] text-gray-500 mt-0.5">{new Date(order.confirmed_at).toLocaleString("en-IN")}</p>}
                                    </div>
                                </div>
                                {/* Timeline Item */}
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={cn("w-3 h-3 rounded-full mt-1", order.preparing_at ? "bg-purple-500" : "bg-gray-200")} />
                                        <div className="w-px h-full bg-gray-100 my-1" />
                                    </div>
                                    <div className="pb-4">
                                        <p className={cn("text-sm font-medium", order.preparing_at ? "text-black" : "text-gray-400")}>Preparing</p>
                                        {order.preparing_at && <p className="text-[10px] text-gray-500 mt-0.5">{new Date(order.preparing_at).toLocaleString("en-IN")}</p>}
                                    </div>
                                </div>
                                {/* Timeline Item */}
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={cn("w-3 h-3 rounded-full mt-1", order.out_for_delivery_at ? "bg-indigo-500" : "bg-gray-200")} />
                                        <div className="w-px h-full bg-gray-100 my-1" />
                                    </div>
                                    <div className="pb-4">
                                        <p className={cn("text-sm font-medium", order.out_for_delivery_at ? "text-black" : "text-gray-400")}>Out For Delivery</p>
                                        {order.out_for_delivery_at && <p className="text-[10px] text-gray-500 mt-0.5">{new Date(order.out_for_delivery_at).toLocaleString("en-IN")}</p>}
                                    </div>
                                </div>
                                {/* Timeline Item */}
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={cn("w-3 h-3 rounded-full mt-1", order.delivered_at ? "bg-green-500" : "bg-gray-200")} />
                                    </div>
                                    <div>
                                        <p className={cn("text-sm font-medium", order.delivered_at ? "text-black" : "text-gray-400")}>Delivered</p>
                                        {order.delivered_at && <p className="text-[10px] text-gray-500 mt-0.5">{new Date(order.delivered_at).toLocaleString("en-IN")}</p>}
                                    </div>
                                </div>
                            </div>
                            
                            {order.status === "Cancelled" && (
                                <div className="mt-6 bg-red-50 p-4 rounded-xl border border-red-100">
                                    <p className="text-xs font-medium text-red-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                                        <XCircle size={14} /> Cancelled
                                    </p>
                                    <p className="text-[10px] text-gray-500 mb-2">{new Date(order.cancelled_at || order.status_changed_at).toLocaleString("en-IN")}</p>
                                    <p className="text-sm font-medium text-red-800 italic">"{order.cancellation_reason || "No reason provided"}"</p>
                                </div>
                            )}

                            {order.changed_by && (
                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                                    <span className="text-xs text-gray-500">Last changed by:</span>
                                    <span className="text-xs font-medium text-black">{order.changed_by.slice(0, 8)}...</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
