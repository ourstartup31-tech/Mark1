"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isUp: boolean;
    };
    className?: string;
}

export function StatsCard({ label, value, icon: Icon, trend, className }: StatsCardProps) {
    return (
        <div className={cn(
            "p-8 bg-white border border-gray-100 rounded-[2.5rem] hover:shadow-2xl hover:shadow-gray-200/50 hover:border-black transition-all duration-500 group",
            className
        )}>
            <div className="flex items-start justify-between mb-4">
                <div className="p-4 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-black group-hover:text-white transition-all duration-300">
                    <Icon size={24} />
                </div>
                {trend && (
                    <span className={cn(
                        "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        trend.isUp ? "bg-green-50 text-green-600" : "bg-[#D60000]/5 text-[#D60000]"
                    )}>
                        {trend.isUp ? "+" : "-"}{trend.value}%
                    </span>
                )}
            </div>

            <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-1">{label}</p>
                <p className="text-3xl font-bold text-black tracking-tight">{value}</p>
            </div>

            <div className="mt-6 h-1 w-full bg-gray-50 rounded-full overflow-hidden">
                <div
                    className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        trend?.isUp ? "bg-green-500" : "bg-[#D60000]"
                    )}
                    style={{ width: "65%" }} // Placeholder progress
                />
            </div>
        </div>
    );
}
