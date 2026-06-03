"use client";

import React from "react";
import { Table } from "@/components/ui/Table";
import { useAdmin } from "@/context/AdminContext";
import Link from "next/link";
import {
    ArrowRight,
    Eye,
    Search,
    CheckCircle,
    Clock,
    XCircle,
    ShoppingBag,
    Package,
    Truck,
    Filter
} from "lucide-react";



export default function OrdersPage() {
    const { orders, searchQuery, setSearchQuery, isLoading } = useAdmin();
    const [statusFilter, setStatusFilter] = React.useState<string>("All");
    const [dateFilter, setDateFilter] = React.useState<string>("All");
    const [customStart, setCustomStart] = React.useState<string>("");
    const [customEnd, setCustomEnd] = React.useState<string>("");

    const filteredOrders = React.useMemo(() => {
        let result = orders;

        // Status Filter
        if (statusFilter !== "All") {
            result = result.filter(o => o.status === statusFilter);
        }

        // Date Filter
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (dateFilter === "Today") {
            result = result.filter(o => o.created_at >= startOfToday);
        } else if (dateFilter === "Last 7 Days") {
            const sevenDaysAgo = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);
            result = result.filter(o => o.created_at >= sevenDaysAgo);
        } else if (dateFilter === "Custom" && customStart && customEnd) {
            const start = new Date(customStart);
            const end = new Date(customEnd);
            end.setHours(23, 59, 59, 999);
            result = result.filter(o => o.created_at >= start && o.created_at <= end);
        }

        // Search Filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(o => 
                o.id.toLowerCase().includes(q) ||
                o.customer.toLowerCase().includes(q) ||
                o.phone.toLowerCase().includes(q)
            );
        }

        // Sort by newest first
        result = [...result].sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

        return result;
    }, [orders, statusFilter, dateFilter, customStart, customEnd, searchQuery]);

    const stats = [
        { label: "Pending", count: orders.filter(o => o.status === "Pending").length, color: "text-amber-600" },
        { label: "Confirmed", count: orders.filter(o => o.status === "Confirmed").length, color: "text-blue-600" },
        { label: "Delivered", count: orders.filter(o => o.status === "Delivered").length, color: "text-green-600" },
        { label: "Cancelled", count: orders.filter(o => o.status === "Cancelled").length, color: "text-red-600" },
    ];

    const columns = [
        {
            header: "Order ID",
            accessor: (item: any) => <span className="font-bold text-black text-xs">{item.id.slice(0, 8).toUpperCase()}</span>
        },
        { header: "Customer Name", accessor: (item: any) => <span>{item.customer}</span> },
        { header: "Phone", accessor: (item: any) => <span>{item.phone}</span> },
        { header: "Item Count", accessor: (item: any) => <span>{item.item_count} items</span> },
        {
            header: "Amount",
            accessor: (item: any) => <span className="font-bold">{item.total}</span>
        },
        { 
            header: "Date/Time", 
            accessor: (item: any) => (
                <div className="flex flex-col">
                    <span>{item.date}</span>
                    <span className="text-[10px] text-gray-400">{item.time}</span>
                </div>
            ) 
        },
        {
            header: "Status",
            accessor: (item: any) => {
                const colors: Record<string, string> = {
                    "Pending": "bg-amber-50 text-amber-600",
                    "Confirmed": "bg-blue-50 text-blue-600",
                    "Preparing": "bg-purple-50 text-purple-600",
                    "Out For Delivery": "bg-indigo-50 text-indigo-600",
                    "Delivered": "bg-green-50 text-green-600",
                    "Cancelled": "bg-red-50 text-red-600",
                };
                return (
                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${colors[item.status] || "bg-gray-50 text-gray-600"}`}>
                        {item.status}
                    </span>
                );
            }
        },
        {
            header: "Actions",
            className: "text-right",
            accessor: (item: any) => (
                <Link
                    href={`/admin/orders/${item.id}`}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black transition-all inline-block"
                >
                    <Eye size={18} />
                </Link>
            )
        },
    ];

    if (isLoading && orders.length === 0) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-amber-600 rounded-full animate-spin" />
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Loading Orders...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
            {isLoading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-50 flex items-center justify-center rounded-[3rem]">
                    <div className="w-8 h-8 border-3 border-gray-100 border-t-amber-600 rounded-full animate-spin" />
                </div>
            )}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-black tracking-tight">Order Overview</h1>
                    <p className="text-gray-400 font-medium mt-1 italic">Track and manage customer pickup orders.</p>
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
                <div className="bg-white p-4 rounded-[2rem] border border-gray-100 flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by Order ID, Customer or Phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-6 text-sm font-medium outline-none focus:border-black transition-all"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Status:</span>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-4 text-sm font-medium outline-none focus:border-black"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Preparing">Preparing</option>
                                <option value="Out For Delivery">Out For Delivery</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Date:</span>
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="bg-gray-50 border border-gray-100 rounded-lg py-2.5 px-4 text-sm font-medium outline-none focus:border-black"
                            >
                                <option value="All">All Time</option>
                                <option value="Today">Today</option>
                                <option value="Last 7 Days">Last 7 Days</option>
                                <option value="Custom">Custom Range</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                {dateFilter === "Custom" && (
                    <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 w-fit">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400">From</span>
                            <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} className="bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 text-sm" />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400">To</span>
                            <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 text-sm" />
                        </div>
                    </div>
                )}

                <Table columns={columns} data={filteredOrders} />
            </div>
        </div>
    );
}
