"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
    label: string;
    value: string | number;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
    label?: string;
    options: Option[];
    onChange: (value: string) => void;
    error?: string;
}

export function Select({ label, options, onChange, error, className, ...props }: SelectProps) {
    return (
        <div className="space-y-2">
            {label && (
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                <select
                    onChange={(e) => onChange(e.target.value)}
                    className={cn(
                        "w-full appearance-none bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-black outline-none transition-all focus:border-black focus:bg-white focus:shadow-lg focus:shadow-gray-200/50",
                        error ? "border-red-500 focus:border-red-500" : "",
                        className
                    )}
                    {...props}
                >
                    <option value="" disabled>Select an option</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
                    <ChevronDown size={18} />
                </div>
            </div>
            {error && <p className="text-xs font-bold text-[#D60000] ml-1">{error}</p>}
        </div>
    );
}
