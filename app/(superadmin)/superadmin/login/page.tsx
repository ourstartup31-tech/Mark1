"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Loader2, ShieldCheck, Layers } from "lucide-react";

export default function SuperAdminLoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!form.email || !form.password) { setError("Please fill in all fields."); return; }

        setLoading(true);
        await new Promise(r => setTimeout(r, 1000));

        if (form.email === "superadmin@platform.com" && form.password === "super123") {
            localStorage.setItem("supermarket_role", "superadmin");
            router.push("/superadmin/dashboard");
        } else {
            setError("Invalid credentials. Try superadmin@platform.com / super123");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex" style={{ background: "#0f0f1a" }}>
            {/* Left panel */}
            <div className="hidden lg:flex flex-col justify-between w-[48%] p-14 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)" }}>
                {/* Glow blobs */}
                <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none"
                    style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)" }} />
                <div className="absolute bottom-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full opacity-15 pointer-events-none"
                    style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)" }} />

                {/* Logo */}
                <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                        <Layers size={22} className="text-white" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-lg tracking-tight">SuperMart Platform</p>
                        <p className="text-indigo-400 text-xs font-medium tracking-widest uppercase">Control Center</p>
                    </div>
                </div>

                {/* Copy */}
                <div className="relative z-10 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
                        style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc" }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                        Platform Superadmin
                    </div>
                    <h1 className="text-5xl xl:text-6xl font-bold text-white leading-[1.05] tracking-tight">
                        Platform<br />
                        <span style={{ background: "linear-gradient(90deg, #6366f1, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                            Command
                        </span><br />
                        Center.
                    </h1>
                    <p className="text-gray-400 text-base leading-relaxed max-w-sm">
                        Manage all stores, subscriptions, revenue, and platform-wide analytics from one powerful dashboard.
                    </p>

                    <div className="flex flex-col gap-3 pt-2">
                        {[
                            { icon: "🏪", label: "All registered stores" },
                            { icon: "💳", label: "Subscription & plan management" },
                            { icon: "📊", label: "Platform revenue analytics" },
                            { icon: "⚙️", label: "System-wide settings" },
                        ].map(item => (
                            <div key={item.label} className="flex items-center gap-3">
                                <span className="text-xl">{item.icon}</span>
                                <span className="text-gray-400 text-sm font-medium">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-gray-600 text-xs relative z-10">© 2026 SuperMart Platform. Platform Edition.</p>
            </div>

            {/* Right panel */}
            <div className="flex-1 flex items-center justify-center px-6 py-12"
                style={{ background: "#f8f9fc" }}>
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="flex items-center gap-3 mb-10 lg:hidden">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                            <Layers size={22} className="text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 tracking-tight">SuperMart Platform</p>
                            <p className="text-xs text-indigo-600 font-medium">Control Center</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 p-8 lg:p-10 border border-gray-100">
                        <div className="mb-8">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                                <ShieldCheck size={24} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Superadmin Login</h2>
                            <p className="text-gray-400 text-sm mt-1">Access the platform control center</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                    placeholder="superadmin@platform.com"
                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 placeholder-gray-300 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all bg-gray-50/50"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPw ? "text" : "password"}
                                        value={form.password}
                                        onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                        placeholder="••••••••"
                                        className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 placeholder-gray-300 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all bg-gray-50/50"
                                    />
                                    <button type="button" onClick={() => setShowPw(p => !p)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
                                    {error}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 flex items-center justify-center gap-2 text-white font-bold text-sm rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                            >
                                {loading ? (
                                    <><Loader2 size={18} className="animate-spin" /> Authenticating...</>
                                ) : (
                                    <><span>Sign in to Platform</span><ArrowRight size={18} /></>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Hint */}
                    <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                        <p className="text-xs font-bold text-indigo-700 mb-1">Demo Credentials</p>
                        <p className="text-xs text-indigo-500 font-medium">Email: superadmin@platform.com</p>
                        <p className="text-xs text-indigo-500 font-medium">Password: super123</p>
                        <p className="text-xs text-indigo-400 mt-1">Or use phone 8888888888 / PIN 1234 on customer login</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
