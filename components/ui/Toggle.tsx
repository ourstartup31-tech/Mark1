"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ToggleProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    label?: string;
    className?: string;
}

export function Toggle({ enabled, onChange, label, className }: ToggleProps) {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            <button
                type="button"
                onClick={() => onChange(!enabled)}
                className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2",
                    enabled ? "bg-[#D60000]" : "bg-gray-200"
                )}
            >
                <span
                    className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        enabled ? "translate-x-6" : "translate-x-1"
                    )}
                />
            </button>
            {label && (
                <span className="text-sm font-bold text-black">{label}</span>
            )}
        </div>
    );
}
