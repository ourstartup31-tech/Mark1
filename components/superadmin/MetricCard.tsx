"use client";

import React from "react";

interface MetricCardProps {
    title: string;
    value: string;
    sub?: string;
    icon: React.ReactNode;
    trend?: { value: string; positive: boolean };
    gradient?: string;
    iconBg?: string;
}

export default function MetricCard({ title, value, sub, icon, trend, gradient, iconBg }: MetricCardProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm shadow-gray-100/80 border border-gray-100 hover:shadow-md hover:shadow-gray-100 hover:-translate-y-0.5 transition-all duration-200"
            style={gradient ? { background: gradient } : {}}>
            <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: iconBg || "rgba(99,102,241,0.12)" }}>
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${trend.positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                        <span>{trend.positive ? "↑" : "↓"}</span>
                        {trend.value}
                    </div>
                )}
            </div>
            <p className={`text-2xl font-bold tracking-tight mb-0.5 ${gradient ? "text-white" : "text-gray-900"}`}>{value}</p>
            <p className={`text-xs font-semibold uppercase tracking-widest ${gradient ? "text-white/70" : "text-gray-400"}`}>{title}</p>
            {sub && <p className={`text-xs mt-1 ${gradient ? "text-white/60" : "text-gray-400"}`}>{sub}</p>}
        </div>
    );
}
