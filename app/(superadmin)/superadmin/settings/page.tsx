"use client";

import React, { useState } from "react";
import { useSuperAdmin } from "@/context/SuperAdminContext";
import { Save, Globe, Settings } from "lucide-react";

export default function SettingsPage() {
    const { platformSettings, updatePlatformSettings } = useSuperAdmin();
    const [saved, setSaved] = useState(false);
    const [localSettings, setLocalSettings] = useState({ ...platformSettings });

    const handleSave = () => {
        updatePlatformSettings(localSettings);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const InputField = ({ label, value, onChange, type = "text", placeholder = "" }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) => (
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</label>
            <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                className="w-full h-11 px-4 rounded border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-500 bg-slate-50/50" />
        </div>
    );

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wider">Platform Settings</h2>
                    <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest">Configure platform-wide preferences</p>
                </div>
                <button onClick={handleSave}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded uppercase tracking-widest hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm">
                    <Save size={14} />
                    {saved ? "Saved!" : "Save Changes"}
                </button>
            </div>

            {/* 1. General Settings */}
            <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                    <div className="w-8 h-8 rounded bg-indigo-50 flex items-center justify-center">
                        <Settings size={16} className="text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-tight">General Settings</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Platform identity and contact info</p>
                    </div>
                </div>
                <div className="px-6 py-6 space-y-5">
                    <InputField
                        label="Platform Name"
                        value={localSettings.platformName}
                        onChange={v => setLocalSettings(p => ({ ...p, platformName: v }))}
                        placeholder="SuperMart Platform"
                    />
                    <InputField
                        label="Support Email"
                        value={localSettings.supportEmail}
                        onChange={v => setLocalSettings(p => ({ ...p, supportEmail: v }))}
                        type="email"
                        placeholder="support@yourplatform.com"
                    />
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Platform Logo URL</label>
                        <div className="flex gap-3">
                            <input
                                value={localSettings.logoUrl}
                                onChange={e => setLocalSettings(p => ({ ...p, logoUrl: e.target.value }))}
                                placeholder="https://..."
                                className="flex-1 h-11 px-4 rounded border border-slate-200 text-sm text-slate-900 outline-none focus:border-indigo-500 bg-slate-50/50"
                            />
                            {localSettings.logoUrl && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={localSettings.logoUrl} alt="Logo" className="w-11 h-11 rounded object-cover border border-slate-200" />
                            )}
                            {!localSettings.logoUrl && (
                                <div className="w-11 h-11 rounded bg-slate-100 flex items-center justify-center flex-shrink-0 border border-slate-200">
                                    <Globe size={18} className="text-slate-400" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Save banner */}
            {saved && (
                <div className="fixed bottom-6 right-6 z-[200] bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-5 py-3 rounded shadow-xl flex items-center gap-3 border border-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Settings saved successfully!
                </div>
            )}
        </div>
    );
}
