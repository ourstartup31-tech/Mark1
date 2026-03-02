"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, rightElement, className, id, ...props }, ref) => {
        const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-xs font-bold text-gray-700 uppercase tracking-widest"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            "w-full h-12 px-4 text-sm font-medium bg-white border-2 rounded-xl outline-none transition-all duration-200",
                            "placeholder:text-gray-300 text-black",
                            error
                                ? "border-red-500 focus:border-[#D60000] focus:ring-4 focus:ring-[#D60000]/10"
                                : "border-gray-200 focus:border-[#D60000] focus:ring-4 focus:ring-[#D60000]/10 hover:border-gray-300",
                            rightElement ? "pr-12" : "",
                            className
                        )}
                        {...props}
                    />
                    {rightElement && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {rightElement}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="text-xs text-[#D60000] font-semibold flex items-center gap-1 animate-[fadeInDown_0.2s_ease-out]">
                        <span>⚠</span> {error}
                    </p>
                )}
                {hint && !error && (
                    <p className="text-xs text-gray-400 font-medium">{hint}</p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";
