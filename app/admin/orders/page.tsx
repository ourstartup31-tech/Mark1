"use client";

import React from "react";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/context/AdminContext";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import {
    ArrowRight,
    Eye,
    Filter,
    Search,
    CheckCircle,
    Clock,
    XCircle,
    ShoppingBag
} from "lucide-react";



export default function OrdersPage() {
    const { orders, searchQuery, setSearchQuery, updateOrderStatus } = useAdmin();
    const [selectedOrder, setSelectedOrder] = React.useState<any>(null);

    const filteredOrders = orders.filter(o =>
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.date.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = [
        { label: "New", count: orders.filter(o => o.status === "Pending").length, color: "text-amber-600" },
        { label: "Ready", count: orders.filter(o => o.status === "Pickup").length, color: "text-blue-600" },
        { label: "Completed", count: orders.filter(o => o.status === "Completed").length, color: "text-green-600" },
        { label: "Cancelled", count: orders.filter(o => o.status === "Cancelled").length, color: "text-red-600" },
    ];

    const columns = [
        {
            header: "Order ID",
            accessor: (item: any) => <span className="font-bold text-black">{item.id}</span>
        },
        { header: "Customer", accessor: "customer" },
        { header: "Pickup Date", accessor: "date" as const },
        { header: "Pickup Time", accessor: "time" as const },
        {
            header: "Payment",
            accessor: (item: any) => (
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {item.method}
                </span>
            )
        },
        {
            header: "Total",
            accessor: (item: any) => <span className="font-bold">{item.total}</span>
        },
        {
            header: "Status",
            accessor: (item: any) => (
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.status === "Completed" ? "bg-green-50 text-green-600" :
                    item.status === "Pending" ? "bg-amber-50 text-amber-600" :
                        item.status === "Cancelled" ? "bg-red-50 text-red-600" :
                            "bg-blue-50 text-blue-600"
                    }`}>
                    {item.status}
                </span>
            )
        },
        {
            header: "Actions",
            className: "text-right",
            accessor: (item: any) => (
                <button
                    onClick={() => setSelectedOrder(item)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black transition-all"
                >
                    <Eye size={18} />
                </button>
            )
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-black tracking-tight">Order Overview</h1>
                    <p className="text-gray-400 font-medium mt-1 italic">Track and manage customer pickup orders.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="px-6 py-6 rounded-2xl border-2 flex items-center gap-2">
                        <Filter size={18} />
                        Filters
                    </Button>
                    <Button className="bg-[#D60000] hover:bg-black text-white px-8 py-6 rounded-2xl transition-all shadow-xl shadow-red-600/10">
                        Export Orders
                    </Button>
                </div>
            </div>

            {/* Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
                        <span className={`text-xl font-bold ${stat.color}`}>{stat.count}</span>
                    </div>
                ))}
            </div>

            {/* List */}
            <div className="space-y-6">
                <div className="bg-white p-4 rounded-[2rem] border border-gray-100 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by Order ID, Customer or Date..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-6 text-sm font-medium outline-none focus:border-black transition-all"
                        />
                    </div>
                </div>
                <Table columns={columns} data={filteredOrders} />
            </div>

            {/* Order Detail Modal */}
            <Modal
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                title={`Order Details ${selectedOrder?.id}`}
            >
                <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Customer</p>
                            <p className="text-sm font-bold text-black">{selectedOrder?.customer}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                            <p className="text-sm font-bold text-black">{selectedOrder?.total}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pickup Time</p>
                            <p className="text-sm font-bold text-black">{selectedOrder?.date} at {selectedOrder?.time}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Payment Method</p>
                            <p className="text-sm font-bold text-black">{selectedOrder?.method}</p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">Update Order Status</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => {
                                    updateOrderStatus(selectedOrder.id, "Pending");
                                    setSelectedOrder(null);
                                }}
                                className={cn(
                                    "flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all font-bold text-xs",
                                    selectedOrder?.status === "Pending" ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-white border-gray-50 text-gray-400 hover:border-amber-100 hover:text-amber-500"
                                )}
                            >
                                <Clock size={16} /> Pending
                            </button>
                            <button
                                onClick={() => {
                                    updateOrderStatus(selectedOrder.id, "Pickup");
                                    setSelectedOrder(null);
                                }}
                                className={cn(
                                    "flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all font-bold text-xs",
                                    selectedOrder?.status === "Pickup" ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white border-gray-50 text-gray-400 hover:border-blue-100 hover:text-blue-500"
                                )}
                            >
                                <ShoppingBag size={16} /> Ready
                            </button>
                            <button
                                onClick={() => {
                                    updateOrderStatus(selectedOrder.id, "Completed");
                                    setSelectedOrder(null);
                                }}
                                className={cn(
                                    "flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all font-bold text-xs",
                                    selectedOrder?.status === "Completed" ? "bg-green-50 border-green-200 text-green-600" : "bg-white border-gray-50 text-gray-400 hover:border-green-100 hover:text-green-500"
                                )}
                            >
                                <CheckCircle size={16} /> Complete
                            </button>
                            <button
                                onClick={() => {
                                    updateOrderStatus(selectedOrder.id, "Cancelled");
                                    setSelectedOrder(null);
                                }}
                                className={cn(
                                    "flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all font-bold text-xs",
                                    selectedOrder?.status === "Cancelled" ? "bg-red-50 border-red-200 text-red-600" : "bg-white border-gray-50 text-gray-400 hover:border-red-100 hover:text-red-500"
                                )}
                            >
                                <XCircle size={16} /> Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
