"use client";

import React, { useState } from "react";
import { useSuperAdmin } from "@/context/SuperAdminContext";
import { Save, Globe, Mail, Percent, ToggleLeft, ToggleRight, Settings, CreditCard, Sliders } from "lucide-react";

const SECTION_ICON_BG = "rgba(99,102,241,0.1)";

export default function SettingsPage() {
    const { platformSettings, updatePlatformSettings, plans } = useSuperAdmin();
    const [saved, setSaved] = useState(false);
    const [localSettings, setLocalSettings] = useState({ ...platformSettings });
    const [overrides, setOverrides] = useState({ ...platformSettings.commissionOverrides });

    const handleSave = () => {
        updatePlatformSettings({ ...localSettings, commissionOverrides: overrides });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const ToggleSwitch = ({ value, onChange, label, sub }: { value: boolean; onChange: (v: boolean) => void; label: string; sub: string }) => (
        <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
            <div>
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
            </div>
            <button onClick={() => onChange(!value)}
                className={`relative w-12 h-6 rounded-full transition-all duration-200 ${value ? "" : "bg-gray-200"}`}
                style={value ? { background: "linear-gradient(135deg, #6366f1, #8b5cf6)" } : {}}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200 ${value ? "left-6.5 translate-x-[26px]" : "left-0.5"}`} />
            </button>
        </div>
    );

    const InputField = ({ label, value, onChange, type = "text", placeholder = "" }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) => (
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{label}</label>
            <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all bg-gray-50/50" />
        </div>
    );

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Platform Settings</h2>
                    <p className="text-sm text-gray-400 mt-0.5">Configure platform-wide preferences</p>
                </div>
                <button onClick={handleSave}
                    className="flex items-center gap-2 px-5 py-2.5 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-200 hover:opacity-90 active:scale-[0.98] transition-all"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                    <Save size={16} />
                    {saved ? "Saved!" : "Save Changes"}
                </button>
            </div>

            {/* 1. General Settings */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: SECTION_ICON_BG }}>
                        <Settings size={18} className="text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">General Settings</h3>
                        <p className="text-xs text-gray-400">Platform identity and contact info</p>
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
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Platform Logo URL</label>
                        <div className="flex gap-3">
                            <input
                                value={localSettings.logoUrl}
                                onChange={e => setLocalSettings(p => ({ ...p, logoUrl: e.target.value }))}
                                placeholder="https://..."
                                className="flex-1 h-11 px-4 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all bg-gray-50/50"
                            />
                            {localSettings.logoUrl && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={localSettings.logoUrl} alt="Logo" className="w-11 h-11 rounded-xl object-cover border border-gray-200" />
                            )}
                            {!localSettings.logoUrl && (
                                <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <Globe size={18} className="text-gray-400" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-xl flex items-center gap-3">
                        <Globe size={18} className="text-indigo-500 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-indigo-800">{localSettings.platformName}</p>
                            <p className="text-xs text-indigo-500"><Mail size={10} className="inline mr-1" />{localSettings.supportEmail}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Commission Settings */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: SECTION_ICON_BG }}>
                        <Percent size={18} className="text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Commission Settings</h3>
                        <p className="text-xs text-gray-400">Platform commission rates by plan</p>
                    </div>
                </div>
                <div className="px-6 py-6 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Default Commission (%)</label>
                        <div className="flex items-center gap-3">
                            <input type="range" min={0} max={25} value={localSettings.defaultCommission}
                                onChange={e => setLocalSettings(p => ({ ...p, defaultCommission: Number(e.target.value) }))}
                                className="flex-1 accent-indigo-600" />
                            <span className="w-14 h-10 flex items-center justify-center border border-indigo-200 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-xl">
                                {localSettings.defaultCommission}%
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-5">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <CreditCard size={13} /> Per-Plan Override
                        </p>
                        <div className="space-y-3">
                            {plans.map(plan => (
                                <div key={plan.id} className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 w-32">
                                        <span className={`w-2 h-2 rounded-full ${plan.name === "Enterprise" ? "bg-violet-500" : plan.name === "Pro" ? "bg-indigo-500" : "bg-gray-400"}`} />
                                        <span className="text-sm font-semibold text-gray-900">{plan.name}</span>
                                    </div>
                                    <div className="flex-1">
                                        <input type="range" min={0} max={20} value={overrides[plan.name] || localSettings.defaultCommission}
                                            onChange={e => setOverrides(p => ({ ...p, [plan.name]: Number(e.target.value) }))}
                                            className="w-full accent-indigo-600" />
                                    </div>
                                    <span className="w-14 h-9 flex items-center justify-center border border-gray-200 bg-gray-50 text-gray-700 font-bold text-sm rounded-xl">
                                        {overrides[plan.name] || localSettings.defaultCommission}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Feature Toggles */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: SECTION_ICON_BG }}>
                        <Sliders size={18} className="text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Feature Toggles</h3>
                        <p className="text-xs text-gray-400">Enable or disable platform-wide features</p>
                    </div>
                </div>
                <div className="px-6 py-2">
                    <ToggleSwitch
                        value={localSettings.enableSubscriptions}
                        onChange={v => setLocalSettings(p => ({ ...p, enableSubscriptions: v }))}
                        label="Enable Subscriptions"
                        sub="Allow stores to subscribe to plans"
                    />
                    <ToggleSwitch
                        value={localSettings.enableAnalytics}
                        onChange={v => setLocalSettings(p => ({ ...p, enableAnalytics: v }))}
                        label="Enable Analytics"
                        sub="Show analytics dashboards to admins"
                    />
                    <ToggleSwitch
                        value={localSettings.enableCoupons}
                        onChange={v => setLocalSettings(p => ({ ...p, enableCoupons: v }))}
                        label="Enable Coupon System"
                        sub="Allow stores to create and manage coupons"
                    />
                </div>
            </div>

            {/* Save banner */}
            {saved && (
                <div className="fixed bottom-6 right-6 z-[200] text-white text-sm font-bold px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                    <span className="w-2 h-2 rounded-full bg-white" />
                    Platform settings saved successfully!
                </div>
            )}
        </div>
    );
}
