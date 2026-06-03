"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, Mail, ArrowLeft } from "lucide-react";
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
        const trimmedPhone = phone.trim();
        if (!trimmedPhone || trimmedPhone.length < 10) {
            setErrors({ phone: "Enter a valid 10-digit mobile number" });
            return;
        }

        setLoading(true);
        const result = await sendOtp(trimmedPhone);
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
        const trimmedPhone = phone.trim();
        console.log("LoginPage: Attempting verification for", trimmedPhone, "with OTP", otp);
        const result = await verifyOtp(trimmedPhone, otp);
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
        <div className="min-h-screen flex flex-col bg-[#f8f9fa] md:bg-white">
            <div className="flex-1 flex flex-col md:flex-row">

                {/* Mobile Header (Hidden on Desktop) */}
                <div className="md:hidden w-full flex flex-col items-center pt-12 pb-6 px-6 relative">
                    <button
                        onClick={() => router.back()}
                        className="absolute top-0 left-4 flex items-center gap-1 text-gray-600 hover:text-black transition-colors p-2"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <h1 className="text-3xl font-extrabold text-[#D60000] mb-8">FreshMart</h1>
                    <h2 className="text-[28px] font-bold text-black mb-2">Ready to Shop?</h2>
                    <p className="text-gray-500 text-center text-sm font-medium">Join the club for premium freshness delivered to your door.</p>
                </div>

                {/* Left Panel: Image Section */}
                <div className="w-full md:w-[58%] relative flex flex-col">
                    {/* Desktop Logo + Back Button */}
                    <div className="hidden md:flex absolute top-10 left-6 z-10 items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow-sm text-gray-700 hover:text-black transition-all backdrop-blur-sm"
                            aria-label="Go back"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <h1 className="text-2xl font-bold tracking-tight text-[#D60000]">FreshMart</h1>
                    </div>

                    <div className="px-6 md:px-0 w-full md:h-full">
                        <div className="relative w-full h-[380px] sm:h-[480px] md:h-full rounded-2xl md:rounded-none overflow-hidden bg-gray-100">
                            {/* Grocery Image Placeholder */}
                            <img
                                src="/cart.jpg"
                                alt="Fresh groceries"
                                className="w-full h-full object-cover"
                            />
                            {/* Desktop Overlay Gradient & Text */}
                            <div className="hidden md:flex absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex-col justify-end p-12">
                                <h3 className="text-white text-3xl font-medium mb-3">Freshness at your doorstep.</h3>
                                <p className="text-gray-200 text-sm font-medium max-w-md">Discover curated artisanal products and farm-fresh produce delivered with care.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Form Section */}
                <div className="w-full md:w-[42%] flex items-center justify-center md:justify-start p-6 md:py-8 md:pl-12 lg:pl-20 md:pr-6 bg-[#f8f9fa] md:bg-white">
                    <div className="w-full max-w-[400px]">
                        {/* Desktop Header */}
                        <div className="hidden md:block mb-10">
                            <h2 className="text-3xl font-bold text-black mb-3">Ready to Shop?</h2>
                            <p className="text-gray-500 text-sm font-medium">Join the club for premium freshness delivered to your door.</p>
                        </div>

                        {/* Status Messages */}
                        {successMessage && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 text-sm font-bold rounded-xl flex items-center gap-3">
                                <CheckCircle2 size={18} />
                                {successMessage}
                            </div>
                        )}

                        {/* Form */}
                        {step === "phone" ? (
                            <form onSubmit={handleSendOtp} className="space-y-6">
                                <div>
                                    <label className="block text-[13px] font-bold text-black mb-2">Mobile Number</label>
                                    <Input
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        placeholder="98765 43210"
                                        autoComplete="tel"
                                        maxLength={10}
                                        value={phone}
                                        onChange={(e) => {
                                            setPhone(e.target.value.replace(/\D/g, ""));
                                            if (errors.phone) setErrors({});
                                        }}
                                        error={errors.phone}
                                        className="h-14 font-medium"
                                        leftElement={
                                            <div className="flex items-center gap-3 border-r border-gray-200 pr-3 h-6">
                                                <span className="text-gray-500 font-medium text-[15px]">+91</span>
                                            </div>
                                        }
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !phone}
                                    className="w-full h-14 flex items-center justify-center gap-2 bg-[#D60000] text-white font-semibold text-[15px] rounded-md hover:bg-[#b50000] active:scale-[0.98] disabled:opacity-70 transition-all shadow-sm mt-6"
                                >
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : "Request OTP"}
                                </button>

                                <div className="flex items-center gap-4 py-4">
                                    <div className="flex-1 h-px bg-gray-200"></div>
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Or continue with</span>
                                    <div className="flex-1 h-px bg-gray-200"></div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        type="button" 
                                        onClick={() => window.open("https://accounts.google.com", "_blank")}
                                        className="h-12 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700 shadow-sm"
                                    >
                                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-[18px] h-[18px]" />
                                        Google
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => window.open("https://mail.google.com", "_blank")}
                                        className="h-12 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700 shadow-sm"
                                    >
                                        <Mail size={18} />
                                        Email
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                <div className="relative">
                                    <label className="block text-[13px] font-bold text-black mb-2">6-Digit OTP</label>
                                    <Input
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
                                        className="h-14 font-medium"
                                    />
                                    {receivedOtp && (
                                        <p className="absolute -top-6 right-0 text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">
                                            Demo OTP: {receivedOtp}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <button
                                        type="submit"
                                        disabled={loading || otp.length < 6}
                                        className="w-full h-14 flex items-center justify-center gap-2 bg-[#D60000] text-white font-semibold text-[15px] rounded-md hover:bg-[#b50000] active:scale-[0.98] disabled:opacity-70 transition-all shadow-sm mt-6"
                                    >
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : "Verify OTP"}
                                    </button>

                                    <button
                                        type="button"
                                        disabled={loading || timer > 0}
                                        onClick={handleSendOtp}
                                        className="w-full text-center text-xs font-semibold text-gray-500 hover:text-black disabled:opacity-50 transition-colors"
                                    >
                                        {timer > 0 ? `Resend OTP in ${timer}s` : "Didn't receive code? Resend"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setStep("phone")}
                                        className="w-full text-center text-xs font-semibold text-[#D60000] hover:underline"
                                    >
                                        Change Phone Number
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-[#f8f9fa] md:bg-[#F4F4F5] pt-12 pb-8 px-6 md:px-12 flex flex-col md:flex-row justify-center md:justify-between items-center gap-6 text-center md:text-left">
                <div className="flex gap-6 text-sm text-gray-700 font-medium">
                    <Link href="#" className="hover:text-black transition-colors">Privacy Policy</Link>
                    <Link href="#" className="hover:text-black transition-colors">Terms of Service</Link>
                    <Link href="#" className="hover:text-black transition-colors">Help Center</Link>
                </div>
                <p className="text-xs text-gray-500 font-medium">© 2026 Premium Retailers. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold text-[#D60000] animate-pulse">FreshMart</h1>
                    <Loader2 size={24} className="text-[#D60000] animate-spin mx-auto" />
                </div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}

