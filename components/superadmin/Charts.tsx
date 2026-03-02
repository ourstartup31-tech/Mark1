/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, AreaChart, Area, Legend
} from "recharts";

interface ChartDataItem {
    month: string;
    revenue: number;
    orders: number;
    stores?: number;
}

interface ChartProps {
    data: ChartDataItem[];
    height?: number;
}

const formatCurrency = (v: number) => `₹${(v / 1000).toFixed(0)}K`;
const tooltipStyle = { borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "13px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" };

export function RevenueLineChart({ data, height = 280 }: ChartProps) {
    const fmt: any = (value: number) => [`₹${value.toLocaleString()}`, "Revenue"];
    return (
        <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false}
                    tickFormatter={v => v.split(" ")[0]} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false}
                    tickFormatter={formatCurrency} />
                <Tooltip formatter={fmt} contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5}
                    dot={{ fill: "#6366f1", strokeWidth: 2, r: 4, stroke: "#fff" }}
                    activeDot={{ r: 6, stroke: "#6366f1", strokeWidth: 2 }} />
            </LineChart>
        </ResponsiveContainer>
    );
}

export function OrdersBarChart({ data, height = 260 }: ChartProps) {
    const fmt: any = (value: number) => [value, "Orders"];
    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false}
                    tickFormatter={v => v.split(" ")[0]} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                <Tooltip formatter={fmt} contentStyle={tooltipStyle} />
                <Bar dataKey="orders" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}

export function StoreGrowthAreaChart({ data, height = 260 }: ChartProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                    <linearGradient id="storeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false}
                    tickFormatter={v => v.split(" ")[0]} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="stores" stroke="#8b5cf6" strokeWidth={2.5}
                    fill="url(#storeGrad)" dot={{ fill: "#8b5cf6", r: 3 }} />
            </AreaChart>
        </ResponsiveContainer>
    );
}

export function RevenueAndOrdersChart({ data, height = 280 }: ChartProps) {
    const fmt: any = (value: number, name: string) =>
        name === "revenue" ? [`₹${value.toLocaleString()}`, "Revenue"] : [value, "Orders"];
    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false}
                    tickFormatter={v => v.split(" ")[0]} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false}
                    tickFormatter={formatCurrency} />
                <Tooltip formatter={fmt} contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#revGrad)" />
            </AreaChart>
        </ResponsiveContainer>
    );
}
