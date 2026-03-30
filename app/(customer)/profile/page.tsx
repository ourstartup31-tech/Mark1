"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { User, Phone, ShoppingBag, Heart, Settings, LogOut, ChevronRight, MapPin } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export default function ProfilePage() {
    const { user, logout } = useAuth();

    const fallbackName = "User";
    const displayName = user?.name || fallbackName;

    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar / Profile summary */}
                    <div className="lg:w-1/3 space-y-8">
                        <div className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100 relative overflow-hidden group">
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-black rounded-[2rem] flex items-center justify-center text-white text-3xl font-bold mb-6 group-hover:scale-105 transition-transform duration-500">
                                    {displayName.substring(0, 1).toUpperCase()}
                                </div>
                                <h1 className="text-2xl font-bold text-black mb-1">{displayName}</h1>
                                <p className="text-sm text-gray-400 font-medium italic mb-6">{user?.phone}</p>
                                
                                <div className="inline-flex px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-100">
                                    Verified Account
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
                        </div>

                        <nav className="space-y-2">
                            <Link href="/orders" className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors group">
                                <div className="flex items-center gap-4 text-gray-600 group-hover:text-black transition-colors font-bold text-sm tracking-tight">
                                    <ShoppingBag size={20} /> My Orders
                                </div>
                                <ChevronRight size={16} className="text-gray-300 group-hover:text-black" />
                            </Link>
                            <button className="w-full flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors group">
                                <div className="flex items-center gap-4 text-gray-600 group-hover:text-black transition-colors font-bold text-sm tracking-tight">
                                    <Heart size={20} /> Wishlist
                                </div>
                                <ChevronRight size={16} className="text-gray-300 group-hover:text-black" />
                            </button>
                            <button className="w-full flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors group">
                                <div className="flex items-center gap-4 text-gray-600 group-hover:text-black transition-colors font-bold text-sm tracking-tight">
                                    <MapPin size={20} /> Saved Addresses
                                </div>
                                <ChevronRight size={16} className="text-gray-300 group-hover:text-black" />
                            </button>
                            <button className="w-full flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors group">
                                <div className="flex items-center gap-4 text-gray-600 group-hover:text-black transition-colors font-bold text-sm tracking-tight">
                                    <Settings size={20} /> Account Settings
                                </div>
                                <ChevronRight size={16} className="text-gray-300 group-hover:text-black" />
                            </button>
                            <button 
                                onClick={logout}
                                className="w-full flex items-center justify-between p-5 bg-red-50/50 border border-red-100 rounded-2xl hover:bg-red-50 transition-colors group"
                            >
                                <div className="flex items-center gap-4 text-red-600 transition-colors font-bold text-sm tracking-tight">
                                    <LogOut size={20} /> Sign Out
                                </div>
                                <ChevronRight size={16} className="text-red-300 group-hover:text-red-600" />
                            </button>
                        </nav>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 space-y-10">
                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-10">
                            <div>
                                <h2 className="text-3xl font-bold text-black tracking-tight">Personal Details</h2>
                                <p className="text-gray-400 font-medium mt-1 italic">Manage your profile information.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
                                        <input 
                                            type="text" 
                                            readOnly 
                                            value={displayName}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-black outline-none focus:bg-white focus:border-black transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
                                        <input 
                                            type="text" 
                                            readOnly 
                                            value={user?.phone || ""}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-black outline-none focus:bg-white focus:border-black transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Account Role</label>
                                    <div className="relative group">
                                        <Settings className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
                                        <input 
                                            type="text" 
                                            readOnly 
                                            value={user?.role?.toUpperCase() || "CUSTOMER"}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-black outline-none focus:bg-white focus:border-black transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <button className="px-10 py-4 bg-black text-white font-bold rounded-2xl hover:bg-[#D60000] active:scale-95 transition-all text-sm uppercase tracking-widest shadow-xl shadow-black/5">
                                    Update Profile
                                </button>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-6 italic">
                                    Note: Phone number updates require OTP verification.
                                </p>
                            </div>
                        </div>

                        {/* Order History Preview Card */}
                        <div className="bg-black rounded-[3rem] p-12 text-white relative overflow-hidden group shadow-2xl shadow-black/10">
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="space-y-2 text-center md:text-left">
                                    <h3 className="text-2xl font-bold tracking-tight">Recent Activity?</h3>
                                    <p className="text-gray-400 font-medium italic">Check your recent order status and tracking.</p>
                                </div>
                                <Link href="/orders" className="px-8 py-4 bg-[#D60000] text-white font-bold rounded-2xl hover:bg-white hover:text-black transition-all text-xs uppercase tracking-widest">
                                    View Order History
                                </Link>
                            </div>
                            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-[#D60000]/10 transition-colors" />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
