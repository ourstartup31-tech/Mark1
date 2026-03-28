"use client";

import React from "react";
import { Store, Clock, CalendarDays, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StoreTimingForm } from "@/components/admin/StoreTimingForm";
import { useAdmin } from "@/context/AdminContext";
import { useToast } from "@/context/ToastContext";
import { Modal } from "@/components/ui/Modal";

export default function StoreSettingsPage() {
    const { storeSettings, updateStoreSettings } = useAdmin();
    const { showToast } = useToast();
    const [isHolidayModalOpen, setIsHolidayModalOpen] = React.useState(false);
    const [newHoliday, setNewHoliday] = React.useState({ date: "", reason: "" });

    const handleUpdateInfo = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        updateStoreSettings({
            name: formData.get("name") as string,
            contact: formData.get("contact") as string,
            address: formData.get("address") as string,
        });
        showToast("Store information updated successfully", "success");
    };

    const handleAddHoliday = (e: React.FormEvent) => {
        e.preventDefault();
        updateStoreSettings({
            closedDates: [...storeSettings.closedDates, `${newHoliday.date} - ${newHoliday.reason}`]
        });
        showToast("Closure added", "success");
        setNewHoliday({ date: "", reason: "" });
        setIsHolidayModalOpen(false);
    };

    const removeHoliday = (idx: number) => {
        const newDates = storeSettings.closedDates.filter((_, i) => i !== idx);
        updateStoreSettings({ closedDates: newDates });
        showToast("Closure removed", "info");
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-4xl font-bold text-black tracking-tight">Store Settings</h1>
                <p className="text-gray-400 font-medium mt-1 italic">Configure your store information, timings and closures.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                <div className="xl:col-span-2 space-y-8">
                    <form onSubmit={handleUpdateInfo} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-red-50 rounded-2xl text-[#D60000]">
                                <Store size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-black tracking-tight">General Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Store Name" name="name" defaultValue={storeSettings.name} />
                            <Input label="Contact Number" name="contact" defaultValue={storeSettings.contact} />
                            <Input label="Store Email" name="email" defaultValue="contact@supermarket.com" />
                            <Input label="Store Address" name="address" defaultValue={storeSettings.address} />
                        </div>

                        <Button type="submit" className="bg-[#D60000] hover:bg-black text-white px-10 py-6 rounded-2xl transition-all shadow-xl shadow-red-600/10">
                            Update Store Info
                        </Button>
                    </form>

                    <section className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-red-50 rounded-2xl text-[#D60000]">
                                <Clock size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-black tracking-tight">Opening Hours</h2>
                        </div>
                        <StoreTimingForm />
                    </section>
                </div>

                <div className="space-y-8">
                    <section className="bg-black rounded-[2.5rem] p-10 text-white space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CalendarDays size={20} className="text-[#D60000]" />
                                <h2 className="text-xl font-bold tracking-tight">Special Closures</h2>
                            </div>
                            <button onClick={() => setIsHolidayModalOpen(true)} className="p-2 bg-white/10 rounded-xl hover:bg-[#D60000] transition-colors group">
                                <Plus size={18} className="text-white" />
                            </button>
                        </div>

                        <p className="text-gray-400 text-xs font-medium italic">Mark specific dates when the store will be closed for holidays or maintenance.</p>

                        <div className="space-y-4">
                            {storeSettings.closedDates.map((item, idx) => {
                                const [date, reason] = item.split(" - ");
                                return (
                                    <div key={idx} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-colors">
                                        <div>
                                            <p className="font-bold text-sm text-white">{date}</p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">{reason}</p>
                                        </div>
                                        <button onClick={() => removeHoliday(idx)} className="p-2 text-gray-600 hover:text-[#D60000] transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                );
                            })}

                            {storeSettings.closedDates.length === 0 && (
                                <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-2xl">
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">No closures scheduled</p>
                                </div>
                            )}
                        </div>

                        <div className="pt-4">
                            <Button onClick={() => setIsHolidayModalOpen(true)} className="w-full py-6 rounded-2xl bg-white text-black hover:bg-gray-200 transition-all font-bold">
                                Add New Closure
                            </Button>
                        </div>
                    </section>

                    <Modal isOpen={isHolidayModalOpen} onClose={() => setIsHolidayModalOpen(false)} title="Add Closure">
                        <form onSubmit={handleAddHoliday} className="space-y-6">
                            <Input label="Date" type="date" required value={newHoliday.date} onChange={e => setNewHoliday({ ...newHoliday, date: e.target.value })} />
                            <Input label="Reason" placeholder="e.g. Diwali Holiday" required value={newHoliday.reason} onChange={e => setNewHoliday({ ...newHoliday, reason: e.target.value })} />
                            <Button type="submit" className="w-full py-6 rounded-2xl bg-[#D60000] text-white hover:bg-black transition-all font-bold">
                                Save Closure
                            </Button>
                        </form>
                    </Modal>

                    <div className="p-8 bg-[#D60000]/5 rounded-[2rem] border border-[#D60000]/10 border-dashed">
                        <p className="text-[10px] font-bold text-[#D60000] uppercase tracking-[0.2em] mb-2 text-center">Important Note</p>
                        <p className="text-xs text-black font-medium leading-loose text-center">
                            Changes to store timing will be reflected instantly on the customer's pickup slot selector.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
