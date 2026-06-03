"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { PickupSlot } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";

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
    const { isStoreOpen } = useStore();

    const [activeDay, setActiveDay] = React.useState<"today" | "tomorrow">(
        value?.day ?? (isStoreOpen ? "today" : "tomorrow")
    );

    // If store closes while component is mounted and today is active, switch to tomorrow
    React.useEffect(() => {
        if (!isStoreOpen && activeDay === "today") {
            setActiveDay("tomorrow");
            if (value?.day === "today") {
                onChange({ day: "tomorrow", slot: "" });
            }
        }
    }, [isStoreOpen, activeDay, value, onChange]);

    const slots = activeDay === "today" ? TODAY_SLOTS : TOMORROW_SLOTS;

    const handleDayChange = (day: "today" | "tomorrow") => {
        setActiveDay(day);
        if (value && value.day !== day) {
            onChange({ day, slot: "" });
        }
    };

    const isSelected = (slot: string) =>
        value?.day === activeDay && value?.slot === slot;

    return (
        <div className="space-y-2">
            {/* Day tabs */}
            <div className="flex gap-1.5 p-0.5 bg-gray-100 rounded-xl relative">
                {(["today", "tomorrow"] as const).map((day) => {
                    const isDisabled = day === "today" && !isStoreOpen;
                    return (
                        <button
                            key={day}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => handleDayChange(day)}
                            className={cn(
                                "flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                                activeDay === day
                                    ? "bg-white text-black shadow-sm"
                                    : "text-gray-400 hover:text-black",
                                isDisabled && "opacity-40 cursor-not-allowed hover:text-gray-400"
                            )}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>

            {!isStoreOpen && (
                <p className="text-[10px] text-amber-700 font-semibold bg-amber-50 rounded-lg px-2.5 py-1.5 border border-amber-100">
                    Store is closed. Only tomorrow's slots are available.
                </p>
            )}

            {/* Slots grid — 2 columns, compact */}
            <div className="grid grid-cols-2 gap-1.5">
                {slots.map((slot) => (
                    <button
                        key={slot}
                        type="button"
                        onClick={() => onChange({ day: activeDay, slot })}
                        className={cn(
                            "py-2 px-2 rounded-lg text-[9px] font-bold border transition-all duration-200 text-center leading-tight",
                            isSelected(slot)
                                ? "bg-black border-black text-white shadow-md"
                                : "bg-white border-gray-100 text-gray-500 hover:border-black hover:text-black"
                        )}
                    >
                        {slot}
                    </button>
                ))}
            </div>

            {value?.slot && (
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D60000] flex-shrink-0" />
                    <p className="text-[9px] font-bold text-black uppercase tracking-wide truncate">
                        {value.day} @ {value.slot}
                    </p>
                </div>
            )}
        </div>
    );
}
