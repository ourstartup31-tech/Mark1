"use client";

import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type FilterState = {
    categories: string[];
    maxPrice: number | null;
    inStockOnly: boolean;
};

interface ProductFiltersProps {
    categories: any[];
    onApply: (filters: FilterState) => void;
    onClose?: () => void;
    initialFilters: FilterState;
    isMobile?: boolean;
}

const TABS = ["Categories", "Price Range", "Availability"];

export function ProductFilters({ categories, onApply, onClose, initialFilters, isMobile = false }: ProductFiltersProps) {
    const [activeTab, setActiveTab] = useState(TABS[0]);
    const [filters, setFilters] = useState<FilterState>(initialFilters);

    const handleCategoryToggle = (categoryName: string) => {
        setFilters(prev => {
            const current = prev.categories;
            if (current.includes(categoryName)) {
                return { ...prev, categories: current.filter(c => c !== categoryName) };
            } else {
                return { ...prev, categories: [...current, categoryName] };
            }
        });
    };

    const handleClearAll = () => {
        setFilters({ categories: [], maxPrice: null, inStockOnly: false });
    };

    const handleApply = () => {
        onApply(filters);
        if (onClose) onClose();
    };

    return (
        <div className={cn("flex flex-col bg-white overflow-hidden", isMobile ? "h-full w-full" : "h-[600px] rounded-xl border border-gray-200 ")}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
                <h2 className="text-lg font-medium text-gray-800">Filters</h2>
                <button onClick={handleClearAll} className="text-xs font-medium text-[#D60000] uppercase tracking-wider hover:underline">
                    Clear All
                </button>
            </div>

            {/* Main Content: Split Pane */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Pane: Filter Categories */}
                <div className="w-[120px] sm:w-[140px] flex-shrink-0 bg-gray-50 border-r border-gray-100 overflow-y-auto scrollbar-hide">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "w-full text-left p-3 sm:p-4 text-xs sm:text-sm font-medium border-b border-gray-100 transition-colors break-words",
                                activeTab === tab ? "bg-white text-black border-l-4 border-l-[#D60000]" : "text-gray-500 hover:bg-gray-100 border-l-4 border-l-transparent"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Right Pane: Filter Options */}
                <div className="flex-1 overflow-y-auto p-4 bg-white scrollbar-hide">
                    {activeTab === "Categories" && (
                        <div className="space-y-4">
                            {categories.map((cat: any) => (
                                <label key={cat.id} onClick={() => handleCategoryToggle(cat.name)} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={cn(
                                        "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                        filters.categories.includes(cat.name) ? "bg-[#D60000] border-[#D60000]" : "border-gray-300 group-hover:border-gray-400"
                                    )}>
                                        {filters.categories.includes(cat.name) && <Check size={14} className="text-white" />}
                                    </div>
                                    <span className="text-sm text-gray-700">{cat.name}</span>
                                    <span className="text-xs text-gray-400 ml-auto">({cat.count})</span>
                                </label>
                            ))}
                        </div>
                    )}

                    {activeTab === "Price Range" && (
                        <div className="space-y-6">
                            <p className="text-sm text-gray-600 mb-2">Set maximum price:</p>
                            <input 
                                type="range" 
                                min="10" 
                                max="2000" 
                                step="10"
                                value={filters.maxPrice || 2000}
                                onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                                className="w-full accent-[#D60000]"
                            />
                            <div className="flex justify-between text-xs font-medium text-gray-500">
                                <span>₹10</span>
                                <span className="text-[#D60000] text-sm">₹{filters.maxPrice || 2000}</span>
                            </div>
                        </div>
                    )}

                    {activeTab === "Availability" && (
                        <div className="space-y-4">
                            <label onClick={() => setFilters({ ...filters, inStockOnly: !filters.inStockOnly })} className="flex items-center gap-3 cursor-pointer group">
                                <div className={cn(
                                    "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                    filters.inStockOnly ? "bg-[#D60000] border-[#D60000]" : "border-gray-300 group-hover:border-gray-400"
                                )}>
                                    {filters.inStockOnly && <Check size={14} className="text-white" />}
                                </div>
                                <span className="text-sm text-gray-700">In Stock Only</span>
                            </label>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="flex border-t border-gray-100 flex-shrink-0 bg-white p-4 gap-4">
                {isMobile && onClose && (
                    <button 
                        onClick={onClose}
                        className="flex-1 py-3 text-sm font-medium text-gray-600 border border-gray-200 rounded uppercase tracking-wider hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                )}
                <button 
                    onClick={handleApply}
                    className="flex-1 py-3 text-sm font-medium text-white bg-[#D60000] rounded uppercase tracking-wider hover:bg-red-700 active:scale-95 transition-all"
                >
                    Apply
                </button>
            </div>
        </div>
    );
}
