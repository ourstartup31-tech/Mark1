"use client";

import React, { useState } from "react";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/context/AdminContext";
import { useToast } from "@/context/ToastContext";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function StoreTimingForm() {
    const { storeSettings, updateStoreSettings } = useAdmin();
    const { showToast } = useToast();

    // Local state for the form during editing
    const [localTiming, setLocalTiming] = useState<any>(() => {
        const initial: any = {};
        DAYS.forEach(day => {
            initial[day] = storeSettings.timing[day] || { enabled: true, open: "09:00 AM", close: "09:00 PM" };
        });
        return initial;
    });

    const handleSave = () => {
        updateStoreSettings({ timing: localTiming });
        showToast("Operating hours saved", "success");
    };

    const updateDay = (day: string, updates: any) => {
        setLocalTiming((prev: any) => ({
            ...prev,
            [day]: { ...prev[day], ...updates }
        }));
    };

    return (
        <div className="space-y-8">
            <div className="grid gap-6">
                {DAYS.map((day) => (
                    <div key={day} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100 hover:border-gray-200 transition-all group gap-4">
                        <div className="flex items-center gap-6">
                            <Toggle
                                enabled={localTiming[day].enabled}
                                onChange={(val) => updateDay(day, { enabled: val })}
                            />
                            <span className="font-bold text-black min-w-[100px]">{day}</span>
                            {!localTiming[day].enabled && (
                                <span className="text-[10px] font-bold text-[#D60000] uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">Closed</span>
                            )}
                        </div>

                        <div className={cn("flex items-center gap-4 transition-opacity duration-300", !localTiming[day].enabled && "opacity-20 pointer-events-none")}>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Open</p>
                                <select
                                    value={localTiming[day].open}
                                    onChange={e => updateDay(day, { open: e.target.value })}
                                    className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-black transition-all"
                                >
                                    <option>08:00 AM</option>
                                    <option>09:00 AM</option>
                                    <option>10:00 AM</option>
                                </select>
                            </div>
                            <div className="w-4 h-px bg-gray-200 mt-4" />
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Close</p>
                                <select
                                    value={localTiming[day].close}
                                    onChange={e => updateDay(day, { close: e.target.value })}
                                    className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-black transition-all"
                                >
                                    <option>08:00 PM</option>
                                    <option>09:00 PM</option>
                                    <option>10:00 PM</option>
                                    <option>11:00 PM</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSave} className="px-10 py-6 rounded-2xl bg-[#D60000] hover:bg-black text-white transition-all shadow-xl shadow-red-600/10 font-bold uppercase tracking-widest text-xs">
                    Save Operating Hours
                </Button>
            </div>
        </div>
    );
}

// Helper needed because cn isn't imported
import { cn } from "@/lib/utils";
