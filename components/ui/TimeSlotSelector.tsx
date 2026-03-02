"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { PickupSlot } from "@/context/CartContext";

const TODAY_SLOTS = [
    "10:00 AM – 11:00 AM",
    "1:00 PM – 2:00 PM",
    "3:00 PM – 4:00 PM",
    "5:00 PM – 6:00 PM",
    "7:00 PM – 8:00 PM",
];

const TOMORROW_SLOTS = [
    "9:00 AM – 10:00 AM",
    "11:00 AM – 12:00 PM",
    "2:00 PM – 3:00 PM",
    "4:00 PM – 5:00 PM",
    "6:00 PM – 7:00 PM",
];

interface TimeSlotSelectorProps {
    value: PickupSlot | null;
    onChange: (slot: PickupSlot) => void;
}

export function TimeSlotSelector({ value, onChange }: TimeSlotSelectorProps) {
    const [activeDay, setActiveDay] = React.useState<"today" | "tomorrow">(
        value?.day ?? "today"
    );

    const slots = activeDay === "today" ? TODAY_SLOTS : TOMORROW_SLOTS;

    const handleDayChange = (day: "today" | "tomorrow") => {
        setActiveDay(day);
        // Clear slot if it was from the other day
        if (value && value.day !== day) {
            onChange({ day, slot: "" }); // reset slot
        }
    };

    const isSelected = (slot: string) =>
        value?.day === activeDay && value?.slot === slot;

    return (
        <div className="space-y-4">
            {/* Day tabs */}
            <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl">
                {(["today", "tomorrow"] as const).map((day) => (
                    <button
                        key={day}
                        type="button"
                        onClick={() => handleDayChange(day)}
                        className={cn(
                            "flex-1 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all",
                            activeDay === day
                                ? "bg-white text-black shadow-sm"
                                : "text-gray-400 hover:text-black"
                        )}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {/* Slots grid */}
            <div className="grid grid-cols-2 gap-3">
                {slots.map((slot) => (
                    <button
                        key={slot}
                        type="button"
                        onClick={() => onChange({ day: activeDay, slot })}
                        className={cn(
                            "py-4 px-4 rounded-2xl text-[10px] font-bold border transition-all duration-300 text-center uppercase tracking-widest",
                            isSelected(slot)
                                ? "bg-black border-black text-white shadow-xl shadow-black/10"
                                : "bg-white border-gray-100 text-gray-500 hover:border-black hover:text-black"
                        )}
                    >
                        {slot}
                    </button>
                ))}
            </div>

            {value?.slot && (
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 transition-all animate-reveal">
                    <div className="w-2 h-2 rounded-full bg-[#D60000] shadow-[0_0_8px_rgba(214,0,0,0.3)]" />
                    <p className="text-[10px] font-bold text-black uppercase tracking-[0.15em]">
                        Confirmed: <span className="text-gray-400">{value.day}</span> @ {value.slot}
                    </p>
                </div>
            )}
        </div>
    );
}
