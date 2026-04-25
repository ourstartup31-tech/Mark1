"use client";

import React from "react";
import { StatsCard } from "@/components/admin/StatsCard";
import {
    ShoppingBag,
    Clock,
    Box,
    Users,
    ArrowRight,
    Calendar,
    ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { Table } from "@/components/ui/Table";
import { useAdmin } from "@/context/AdminContext";
import { cn } from "@/lib/utils";


const columns = [
    { header: "Order ID", accessor: "id" as const },
    { header: "Customer", accessor: "customer" as const },
    { header: "Time", accessor: "time" as const },
    { header: "Amount", accessor: "total" as const },
    {
        header: "Status",
        accessor: (item: any) => (
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.status === "Completed" ? "bg-green-50 text-green-600" :
                item.status === "Pending" ? "bg-amber-50 text-amber-600" :
                    "bg-blue-50 text-blue-600"
                }`}>
                {item.status}
            </span>
        )
    },
];

export default function DashboardPage() {
    const { orders, products, staff, isStoreActive, toggleStoreStatus, stats } = useAdmin();
    const recentOrders = orders.slice(0, 4);

    console.log('Dashboard Re-render: isStoreActive:', isStoreActive);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-black tracking-tight">Dashboard Overview</h1>
                    <p className="text-gray-400 font-medium mt-1 italic">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="px-4 py-2 bg-gray-50 rounded-xl flex items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
                        <Calendar size={14} className="text-[#D60000]" />
                        March 1, 2026
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    label="Total Orders Today"
                    value={orders.length.toString()}
                    icon={ShoppingBag}
                    trend={{ value: 12, isUp: true }}
                />
                <StatsCard
                    label="Pending Orders"
                    value={orders.filter(o => o.status === "Pending").length.toString()}
                    icon={Clock}
                />
                <StatsCard
                    label="Total Products"
                    value={stats.totalProducts.toString()}
                    icon={Box}
                    trend={{ value: 3, isUp: true }}
                />
                <StatsCard
                    label="Active Staff"
                    value={stats.activeStaff.toString()}
                    icon={Users}
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-bold text-black tracking-tight">Recent Activity</h3>
                        <Link href="/admin/orders" className="text-[10px] font-bold text-[#D60000] uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                            View All Orders <ArrowRight size={14} />
                        </Link>
                    </div>
                    <Table columns={columns} data={recentOrders} />
                </div>

                {/* Store Status / Quick Actions */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-black tracking-tight px-2">Store Status</h3>
                    <div className={cn(
                        "rounded-[2.5rem] p-10 text-white relative overflow-hidden group transition-all duration-500",
                        isStoreActive ? "bg-black" : "bg-gray-400"
                    )}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D60000] rounded-full -mr-16 -mt-16 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <span className={cn(
                                    "w-2 h-2 rounded-full",
                                    isStoreActive ? "bg-green-500 animate-pulse" : "bg-red-500"
                                )} />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                    {isStoreActive ? "Live Now" : "Currently Closed"}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-gray-400 mb-1">Current Status</p>
                            <p className="text-3xl font-bold mb-8">
                                Store is {isStoreActive ? "Open" : "Closed"}
                            </p>



                            <button 
                                onClick={toggleStoreStatus}
                                className="w-full mt-10 py-4 bg-white text-black font-bold rounded-2xl hover:bg-[#D60000] hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                {isStoreActive ? "Close Store" : "Open Store"} <ArrowUpRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
