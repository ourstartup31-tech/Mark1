"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, ShoppingBag, Loader2, Smartphone, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const [form, setForm] = useState({ phone: "", password: "" });
    const [showPw, setShowPw] = useState(false);
    const [errors, setErrors] = useState<{ phone?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const validate = () => {
        const e: typeof errors = {};
        if (!form.phone.trim()) e.phone = "Mobile number is required";
        else if (form.phone.length < 10) e.phone = "Enter a valid mobile number";
        if (!form.password) e.password = "Password is required";
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
        const { role: authRole } = await (async () => {
            await login(form.phone, form.password);
            const role = localStorage.getItem("supermarket_role");
            return { role };
        })();
        setLoading(false);

        if (authRole === "superadmin") {
            router.push("/superadmin/dashboard");
        } else if (authRole === "admin") {
            router.push("/dashboard");
        } else {
            router.push("/");
        }
    };

    const isValid = form.phone && form.password;

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* ─── Left Panel — Black ─── */}
            <div className="relative lg:w-[42%] bg-black flex flex-col justify-between p-10 lg:p-14 min-h-[240px] lg:min-h-screen overflow-hidden">
                <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-30 pointer-events-none" style={{ background: "radial-gradient(circle, #D60000 0%, transparent 65%)" }} />
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, #D60000 0%, transparent 70%)" }} />

                {/* Logo */}
                <Link href="/" className="relative flex items-center gap-2.5 w-fit group">
                    <div className="w-10 h-10 bg-[#D60000] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                        <ShoppingBag className="text-white" size={24} />
                    </div>
                    <span className="font-bold text-xl text-white tracking-tight uppercase tracking-widest">
                        Fresh<span className="text-[#D60000]">Mart</span>
                    </span>
                </Link>

                {/* Hero copy */}
                <div className="relative space-y-5 py-10 lg:py-0">
                    <div className="inline-flex items-center gap-2 bg-[#D60000]/20 text-[#D60000] text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D60000]" />
                        Secure Checkout
                    </div>
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.05] tracking-tight">
                        Welcome
                        <br />
                        Back.
                    </h1>
                    <p className="text-gray-400 text-base lg:text-lg font-medium leading-relaxed max-w-xs">
                        Enter your credentials to manage your store or start shopping.
                    </p>

                    <div className="flex flex-col gap-2.5 pt-4">
                        {[
                            { icon: "🌿", text: "Fresh products, daily" },
                            { icon: "⚡", text: "Pick up in 30 mins" },
                            { icon: "🔒", text: "Secure SSL encryption" },
                        ].map((t) => (
                            <div key={t.text} className="flex items-center gap-3">
                                <span className="text-lg">{t.icon}</span>
                                <span className="text-gray-400 text-sm font-medium">{t.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative text-gray-600 text-xs font-medium">
                    © 2026 Supermarket Store. All rights reserved.
                </p>
            </div>

            {/* ─── Right Panel — White ─── */}
            <div className="flex-1 bg-white flex items-center justify-center px-6 py-12 lg:py-0">
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-4xl font-bold text-black tracking-tight">
                            Login
                        </h2>
                        <p className="text-gray-400 font-medium mt-2 italic">
                            Demo: Use 9999999999 / 1234 for Admin
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate className="space-y-6">
                        <Input
                            label="Mobile Number"
                            type="tel"
                            name="phone"
                            id="phone"
                            placeholder="9999999999"
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
                            placeholder="••••"
                            autoComplete="current-password"
                            value={form.password}
                            onChange={handleChange}
                            error={errors.password}
                            rightElement={
                                <button
                                    type="button"
                                    onClick={() => setShowPw((p) => !p)}
                                    className="text-gray-400 hover:text-black transition-colors"
                                >
                                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            }
                        />

                        <button
                            type="submit"
                            disabled={loading || !isValid}
                            className="w-full h-16 flex items-center justify-center gap-3 bg-[#D60000] text-white font-bold text-sm uppercase tracking-widest rounded-2xl hover:bg-black active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl shadow-red-600/10 mt-4"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    Sign In Now
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-start gap-4">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                            <ShieldCheck size={20} className="text-green-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-black uppercase tracking-wider mb-1">Demo Credentials</p>
                            <p className="text-[10px] text-gray-500 font-medium leading-relaxed italic">
                                Use the above credentials to access the internal store management system.
                            </p>
                        </div>
                    </div>

                    <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mt-10">
                        © 2026 Retail Group · Professional Edition
                    </p>
                </div>
            </div>
        </div>
    );
}
