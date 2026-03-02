"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, ShoppingBag, Loader2, Check } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirm: "",
    });
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState<Partial<typeof form>>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const validate = () => {
        const e: Partial<typeof form> = {};
        if (!form.name.trim()) e.name = "Full name is required";
        if (!form.email.trim()) e.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            e.email = "Enter a valid email address";
        if (!form.phone.trim()) e.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, "")))
            e.phone = "Enter a valid 10-digit mobile number";
        if (!form.password) e.password = "Password is required";
        else if (form.password.length < 6)
            e.password = "Password must be at least 6 characters";
        if (!form.confirm) e.confirm = "Please confirm your password";
        else if (form.confirm !== form.password) e.confirm = "Passwords do not match";
        return e;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
        if (errors[name as keyof typeof errors])
            setErrors((p) => ({ ...p, [name]: undefined }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1800));
        setLoading(false);
        setSuccess(true);
    };

    const isValid = form.name && form.email && form.phone && form.password && form.confirm;

    /* ── Password strength ── */
    const strength = (() => {
        const p = form.password;
        if (!p) return 0;
        let s = 0;
        if (p.length >= 6) s++;
        if (p.length >= 10) s++;
        if (/[A-Z]/.test(p)) s++;
        if (/[0-9]/.test(p)) s++;
        return s;
    })();
    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
    const strengthColor = ["", "#D60000", "#ff8c00", "#22a862", "#16a34a"][strength];

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">

            {/* ─── Left Panel — Black ─── */}
            <div className="relative lg:w-[42%] bg-black flex flex-col justify-between p-10 lg:p-14 min-h-[220px] lg:min-h-screen overflow-hidden">
                <div
                    className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-30 pointer-events-none"
                    style={{ background: "radial-gradient(circle, #D60000 0%, transparent 65%)" }}
                />
                <div
                    className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
                    style={{ background: "radial-gradient(circle, #D60000 0%, transparent 70%)" }}
                />

                {/* Logo */}
                <Link href="/" className="relative flex items-center gap-2.5 w-fit group">
                    <div className="w-10 h-10 bg-[#D60000] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                        <span className="text-white font-bold text-lg">F</span>
                    </div>
                    <span className="font-bold text-xl text-white tracking-tight">
                        Fresh<span className="text-[#D60000]">Mart</span>
                    </span>
                </Link>

                {/* Hero copy */}
                <div className="relative space-y-5 py-10 lg:py-0">
                    <div className="inline-flex items-center gap-2 bg-[#D60000]/20 text-[#D60000] text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D60000]" />
                        New Customer
                    </div>
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.05] tracking-tight">
                        Join
                        <br />
                        FreshMart.
                    </h1>
                    <p className="text-gray-400 text-base lg:text-lg font-medium leading-relaxed max-w-xs">
                        Create your account and enjoy fresh groceries ready for pickup in as little as 30 minutes.
                    </p>

                    {/* Perks */}
                    <div className="flex flex-col gap-3 pt-4">
                        {[
                            "Free pickup — no delivery charges ever",
                            "Exclusive member-only discounts",
                            "Track orders in real time",
                            "Easy reorder from your history",
                        ].map((perk) => (
                            <div key={perk} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-[#D60000] flex items-center justify-center flex-shrink-0">
                                    <Check size={11} className="text-white" strokeWidth={3} />
                                </div>
                                <span className="text-gray-400 text-sm font-medium">{perk}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative text-gray-600 text-xs font-medium">
                    © 2025 FreshMart. All rights reserved.
                </p>
            </div>

            {/* ─── Right Panel — White ─── */}
            <div className="flex-1 bg-white flex items-center justify-center px-6 py-12 lg:py-10">
                <div className="w-full max-w-md" style={{ animation: "fadeInUp 0.5s ease-out both" }}>
                    {success ? (
                        <div className="text-center space-y-5">
                            <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto text-4xl">
                                🎉
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Account Created!</h2>
                                <p className="text-gray-400 mt-1.5 font-medium">
                                    Welcome to FreshMart, <strong>{form.name.split(" ")[0]}</strong>!
                                </p>
                            </div>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 bg-[#D60000] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[#b50000] active:scale-95 transition-all"
                            >
                                <ShoppingBag size={17} />
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="mb-7">
                                <h2 className="text-3xl font-bold text-black tracking-tight">
                                    Create Account
                                </h2>
                                <p className="text-gray-400 font-medium mt-1.5">
                                    Fill in your details to get started
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                                <Input
                                    label="Full Name"
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Rahul Kumar"
                                    autoComplete="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    error={errors.name}
                                />

                                <Input
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    error={errors.email}
                                />

                                <Input
                                    label="Mobile Number"
                                    type="tel"
                                    name="phone"
                                    id="phone"
                                    placeholder="9876543210"
                                    autoComplete="tel"
                                    value={form.phone}
                                    onChange={handleChange}
                                    error={errors.phone}
                                />

                                <Input
                                    label="Password"
                                    type={showPw ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    placeholder="Min. 6 characters"
                                    autoComplete="new-password"
                                    value={form.password}
                                    onChange={handleChange}
                                    error={errors.password}
                                    rightElement={
                                        <button
                                            type="button"
                                            onClick={() => setShowPw((p) => !p)}
                                            className="text-gray-400 hover:text-black transition-colors"
                                            aria-label={showPw ? "Hide password" : "Show password"}
                                        >
                                            {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                                        </button>
                                    }
                                />

                                {/* Password strength bar */}
                                {form.password && (
                                    <div className="space-y-1.5 -mt-1">
                                        <div className="flex gap-1.5">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div
                                                    key={i}
                                                    className="flex-1 h-1 rounded-full transition-all duration-300"
                                                    style={{ background: i <= strength ? strengthColor : "#e5e7eb" }}
                                                />
                                            ))}
                                        </div>
                                        {strengthLabel && (
                                            <p className="text-xs font-bold" style={{ color: strengthColor }}>
                                                {strengthLabel} password
                                            </p>
                                        )}
                                    </div>
                                )}

                                <Input
                                    label="Confirm Password"
                                    type={showConfirm ? "text" : "password"}
                                    name="confirm"
                                    id="confirm"
                                    placeholder="Re-enter your password"
                                    autoComplete="new-password"
                                    value={form.confirm}
                                    onChange={handleChange}
                                    error={errors.confirm}
                                    rightElement={
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm((p) => !p)}
                                            className="text-gray-400 hover:text-black transition-colors"
                                            aria-label={showConfirm ? "Hide" : "Show"}
                                        >
                                            {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                                        </button>
                                    }
                                />

                                <button
                                    type="submit"
                                    disabled={loading || !isValid}
                                    className="w-full flex items-center justify-center gap-2.5 bg-[#D60000] text-white font-bold text-sm tracking-wide rounded-xl hover:bg-[#b50000] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-red-600/20 mt-2"
                                    style={{ height: "52px" }}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Creating Account…
                                        </>
                                    ) : (
                                        <>
                                            Create My Account
                                            <ArrowRight size={17} />
                                        </>
                                    )}
                                </button>
                            </form>

                            <p className="text-center text-sm text-gray-400 font-medium mt-6">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="text-black font-bold hover:text-[#D60000] transition-colors"
                                >
                                    Login →
                                </Link>
                            </p>

                            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-300 font-medium">
                                <span>🔒</span>
                                <span>256-bit SSL encrypted · Your data is safe</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
