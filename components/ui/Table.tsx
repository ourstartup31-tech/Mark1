"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    onRowClick?: (item: T) => void;
    className?: string;
}

export function Table<T>({ columns, data, onRowClick, className }: TableProps<T>) {
    return (
        <div className={cn("overflow-x-auto rounded-[2rem] border border-gray-100 bg-white", className)}>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                        {columns.map((column, idx) => (
                            <th
                                key={idx}
                                className={cn(
                                    "px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]",
                                    column.className
                                )}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400 font-medium italic">
                                No data available
                            </td>
                        </tr>
                    ) : (
                        data.map((item, rowIdx) => (
                            <tr
                                key={rowIdx}
                                onClick={() => onRowClick?.(item)}
                                className={cn(
                                    "border-b border-gray-50 last:border-0 transition-colors",
                                    onRowClick ? "hover:bg-gray-50/50 cursor-pointer" : ""
                                )}
                            >
                                {columns.map((column, colIdx) => (
                                    <td key={colIdx} className={cn("px-6 py-4 text-sm font-medium text-black", column.className)}>
                                        {typeof column.accessor === "function"
                                            ? column.accessor(item)
                                            : (item[column.accessor] as React.ReactNode)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
