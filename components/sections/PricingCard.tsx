import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface PricingCardProps {
    name: string;
    price: string;
    period?: string;
    description: string;
    features: string[];
    badge?: string;
    highlighted?: boolean;
    cta?: string;
    className?: string;
}

export function PricingCard({
    name,
    price,
    period = "/month",
    description,
    features,
    badge,
    highlighted = false,
    cta = "Get Started",
    className,
}: PricingCardProps) {
    return (
        <div
            className={cn(
                "relative flex flex-col rounded-[2rem] border p-10 transition-all duration-500",
                highlighted
                    ? "border-black bg-black text-white shadow-2xl shadow-black/20 scale-[1.02] z-10"
                    : "border-gray-100 bg-white text-black hover:border-gray-200 hover:shadow-xl hover:shadow-gray-200/50",
                className
            )}
        >
            {badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge variant={highlighted ? "default" : "black"} className="px-4 py-1.5 uppercase font-bold tracking-widest text-[10px]">{badge}</Badge>
                </div>
            )}

            <div className="mb-8">
                <h3 className={cn("font-bold text-2xl mb-2 tracking-tight", highlighted ? "text-white" : "text-black")}>
                    {name}
                </h3>
                <p className={cn("text-xs font-medium uppercase tracking-[0.1em]", highlighted ? "text-gray-400" : "text-gray-400")}>
                    {description}
                </p>
            </div>

            <div className="mb-10">
                <span className="text-5xl font-bold tracking-tighter">{price}</span>
                {price !== "Free" && (
                    <span className={cn("text-sm font-medium ml-1", highlighted ? "text-gray-500" : "text-gray-400")}>
                        {period}
                    </span>
                )}
            </div>

            <ul className="space-y-4 mb-10 flex-1">
                {features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm font-medium">
                        <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                            highlighted ? "bg-white/10" : "bg-gray-50"
                        )}>
                            <Check size={11} className={highlighted ? "text-white" : "text-black"} strokeWidth={3} />
                        </div>
                        <span className={highlighted ? "text-gray-400" : "text-gray-600"}>{f}</span>
                    </li>
                ))}
            </ul>

            <Button
                variant={highlighted ? "white" : "outline"}
                className={cn(
                    "w-full py-6 rounded-xl font-bold transition-all active:scale-95",
                    highlighted ? "bg-white text-black hover:bg-gray-100" : "border-gray-200 hover:border-black"
                )}
            >
                {cta}
            </Button>
        </div>
    );
}
