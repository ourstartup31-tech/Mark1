"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Store, Loader2, Smartphone, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

function LoginContent() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    const [step, setStep] = useState<"phone" | "otp">("phone");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [receivedOtp, setReceivedOtp] = useState(""); // For demo testing
    const [errors, setErrors] = useState<{ phone?: string; otp?: string }>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const { user, role, sendOtp, verifyOtp } = useAuth();
    const router = useRouter();

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => setTimer((t) => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    // Auto-redirect if already logged in
    useEffect(() => {
        if (user && !loading) {
            console.log("LoginPage: Auth State Detect - User:", user.id, "Role:", role);
            const savedUser = localStorage.getItem("supermarket_user");
            const userData = savedUser ? JSON.parse(savedUser) : null;
            const authRole = userData?.role || role;

            console.log("LoginPage: Auto-redirecting based on role:", authRole, "Callback:", callbackUrl);
            setTimeout(() => {
                if (callbackUrl) window.location.href = callbackUrl;
                else if (authRole === "superadmin") window.location.href = "/superadmin/dashboard";
                else if (authRole === "admin") window.location.href = "/admin/dashboard";
                else if (authRole === "customer") window.location.href = "/";
            }, 800); // Increased delay to 800ms for stable cookie sync on all devices
        }
    }, [user, role, loading, callbackUrl]);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone || phone.length < 10) {
            setErrors({ phone: "Enter a valid 10-digit mobile number" });
            return;
        }

        setLoading(true);
        const result = await sendOtp(phone);
        setLoading(false);

        if (result.success) {
            setStep("otp");
            setErrors({});
            setSuccessMessage("OTP sent successfully!");
            setTimer(30);
            if (result.otp) setReceivedOtp(result.otp);
            // Clear success message after 5 seconds
            setTimeout(() => setSuccessMessage(null), 5000);
        } else {
            setErrors({ phone: result.error || "Failed to send OTP" });
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;
        if (!otp || otp.length < 6) {
            setErrors({ otp: "Enter the 6-digit OTP" });
            return;
        }

        setLoading(true);
        console.log("LoginPage: Attempting verification for", phone, "with OTP", otp);
        const result = await verifyOtp(phone, otp);
        setLoading(false);

        if (result.success) {
            console.log("LoginPage: verifyOtp successful. Waiting for useEffect to handle redirect...");
            // We've set loading to false and user is set in context, 
            // the useEffect above will now handle the redirection with the proper delay.
            // This prevents duplicate and race-condition redirects.
            setSuccessMessage("Login successful! Redirecting...");
        } else {
            setErrors({ otp: result.error || "Invalid OTP" });
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* ─── Left Panel — Black ─── */}
            <div className="relative lg:w-[42%] bg-black flex flex-col justify-between p-10 lg:p-14 min-h-[240px] lg:min-h-screen overflow-hidden">
                <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-30 pointer-events-none" style={{ background: "radial-gradient(circle, #D60000 0%, transparent 65%)" }} />
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, #D60000 0%, transparent 70%)" }} />

                {/* Logo */}
                <Link href="/" className="relative flex items-center gap-2.5 w-fit group">
                    <div className="w-10 h-10 bg-[#D60000] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                        <Store className="text-white" size={24} />
                    </div>
                    <span className="font-bold text-xl text-white tracking-tight uppercase tracking-widest">
                        Super<span className="text-[#D60000]">Market</span>
                    </span>
                </Link>

                {/* Hero copy */}
                <div className="relative space-y-5 py-10 lg:py-0">
                    <div className="inline-flex items-center gap-2 bg-[#D60000]/20 text-[#D60000] text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D60000]" />
                        Secure OTP Login
                    </div>
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.05] tracking-tight">
                        {step === "phone" ? "Ready to" : "Verify Your"}
                        <br />
                        {step === "phone" ? "Shop?" : "Device."}
                    </h1>
                    <p className="text-gray-400 text-base lg:text-lg font-medium leading-relaxed max-w-xs">
                        {step === "phone" 
                            ? "Enter your mobile number to receive a secure login code." 
                            : `We've sent a 6-digit code to ${phone}.`}
                    </p>

                    <div className="flex flex-col gap-2.5 pt-4">
                        {[
                            { icon: <ShieldCheck size={18} />, text: "No passwords to remember" },
                            { icon: <Smartphone size={18} />, text: "Secure one-time codes" },
                            { icon: <CheckCircle2 size={18} />, text: "Instant account access" },
                        ].map((t, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-[#D60000]">{t.icon}</span>
                                <span className="text-gray-400 text-sm font-medium">{t.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative text-gray-600 text-xs font-medium">
                    © 2026 FreshMart. All rights reserved.
                </p>
            </div>

            {/* ─── Right Panel — White ─── */}
            <div className="flex-1 bg-white flex items-center justify-center px-6 py-12 lg:py-0">
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-4xl font-bold text-black tracking-tight">
                            {step === "phone" ? "Login" : "Verification"}
                        </h2>
                        <p className="text-gray-400 font-medium mt-2">
                            {step === "phone" 
                                ? "Enter your phone number to continue" 
                                : "Enter the code sent to your mobile"}
                        </p>
                    </div>

                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 text-sm font-bold rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <CheckCircle2 size={18} />
                            {successMessage}
                        </div>
                    )}


                    {step === "phone" ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <Input
                                label="Mobile Number"
                                type="tel"
                                name="phone"
                                id="phone"
                                placeholder="9999999999"
                                autoComplete="tel"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    if (errors.phone) setErrors({});
                                }}
                                error={errors.phone}
                            />

                            <button
                                type="submit"
                                disabled={loading || !phone}
                                className="w-full h-16 flex items-center justify-center gap-3 bg-[#D60000] text-white font-bold text-sm uppercase tracking-widest rounded-2xl hover:bg-black active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl shadow-red-600/10 mt-4"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Sending OTP...
                                    </>
                                ) : (
                                    <>
                                        Get One-Time Code
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div className="relative">
                                <Input
                                    label="6-Digit OTP"
                                    type="text"
                                    name="otp"
                                    id="otp"
                                    placeholder="000000"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => {
                                        setOtp(e.target.value.replace(/\D/g, ""));
                                        if (errors.otp) setErrors({});
                                    }}
                                    error={errors.otp}
                                />
                                {receivedOtp && (
                                    <p className="absolute -top-1 right-0 text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">
                                        Demo OTP: {receivedOtp}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <button
                                    type="submit"
                                    disabled={loading || otp.length < 6}
                                    className="w-full h-16 flex items-center justify-center gap-3 bg-black text-white font-bold text-sm uppercase tracking-widest rounded-2xl hover:bg-[#D60000] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl mt-4"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            Verify & Continue
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    disabled={loading || timer > 0}
                                    onClick={handleSendOtp}
                                    className="w-full text-center text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-black disabled:opacity-50 transition-colors"
                                >
                                    {timer > 0 ? `Resend OTP in ${timer}s` : "Didn't receive code? Resend"}
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={() => setStep("phone")}
                                    className="w-full text-center text-xs font-bold text-[#D60000] uppercase tracking-widest hover:underline"
                                >
                                    Change Phone Number
                                </button>
                            </div>
                        </form>
                    )}

                    <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mt-10">
                        © 2026 SuperMarket · Secure Authentication
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center space-y-4">
                    <Store className="text-[#D60000] animate-bounce mx-auto" size={48} />
                    <Loader2 size={24} className="text-white animate-spin mx-auto" />
                    <p className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Preparing Login Session…</p>
                </div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}

