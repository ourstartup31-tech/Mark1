import React from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
    className?: string;
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
    return (
        <div
            className={cn(
                "group bg-white rounded-2xl border border-gray-100 p-8 hover:border-black hover:shadow-xl hover:shadow-gray-200/40 hover:-translate-y-1 transition-all duration-300",
                className
            )}
        >
            <div className="text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="font-bold text-lg text-black mb-2 tracking-tight">{title}</h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">{description}</p>
        </div>
    );
}
