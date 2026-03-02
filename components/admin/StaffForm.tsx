"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/Toggle";

interface StaffFormProps {
    initialData?: any;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export function StaffForm({ initialData, onSubmit, onCancel }: StaffFormProps) {
    return (
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSubmit({}); }}>
            <div className="space-y-4">
                <Input label="Full Name" placeholder="e.g. John Doe" defaultValue={initialData?.name} required />
                <Input label="Email Address" type="email" placeholder="john@example.com" defaultValue={initialData?.email} required />
                <Input label="Phone Number" placeholder="+91 00000-00000" defaultValue={initialData?.phone} required />

                {!initialData && (
                    <Input label="Temporary Password" type="password" placeholder="••••••••" required />
                )}

                <div className="pt-2">
                    <Toggle
                        label="Staff account is active"
                        enabled={initialData?.active ?? true}
                        onChange={() => { }}
                    />
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" className="flex-1 py-6 rounded-2xl border-2" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" className="flex-1 py-6 rounded-2xl bg-[#D60000] hover:bg-black transition-all">
                    {initialData ? "Update Staff" : "Add Staff Member"}
                </Button>
            </div>
        </form>
    );
}
