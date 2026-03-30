"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { User, Phone, Shield, Store, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminProfilePage() {
    const { user } = useAuth();

    const fallbackName = user?.role === "admin" ? "Admin User" : "Staff Member";
    const displayName = user?.name || fallbackName;

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Breadcrumb / Back */}
            <Link 
                href="/admin/dashboard" 
                className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] hover:text-black transition-colors"
            >
                <ArrowLeft size={14} />
                Back to Dashboard
            </Link>

            {/* Profile Header Card */}
            <div className="bg-black rounded-[3rem] p-10 lg:p-16 text-white relative overflow-hidden group shadow-2xl shadow-black/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D60000] rounded-full -mr-32 -mt-32 blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600 rounded-full -ml-24 -mb-24 blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity duration-1000" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="relative">
                        <div className="w-32 h-32 lg:w-40 lg:h-40 bg-white/10 rounded-[2.5rem] backdrop-blur-md border border-white/20 flex items-center justify-center text-5xl lg:text-6xl font-bold transition-transform duration-500 group-hover:scale-105">
                            {displayName.substring(0, 1).toUpperCase()}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-2xl border-4 border-black flex items-center justify-center shadow-lg">
                            <Shield size={18} className="text-white" />
                        </div>
                    </div>

                    <div className="text-center md:text-left space-y-4">
                        <div className="inline-flex px-4 py-1.5 bg-[#D60000] rounded-full text-[10px] font-bold uppercase tracking-widest mb-2 shadow-lg shadow-red-600/20">
                            System Administrator
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">{displayName}</h1>
                        <p className="text-gray-400 font-medium italic">Managing store operations and staff oversight.</p>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Account Details */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-50 rounded-2xl text-[#D60000]">
                            <User size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-black tracking-tight">Account Information</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-[#D60000]/20 transition-colors">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</p>
                            <p className="font-bold text-black text-lg">{displayName}</p>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-[#D60000]/20 transition-colors">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Phone Number</p>
                            <p className="font-bold text-black text-lg">{user?.phone || 'Not linked'}</p>
                        </div>
                    </div>
                </div>

                {/* Role & Access */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                            <Shield size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-black tracking-tight">Security & Access</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Account Role</p>
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 bg-green-500 rounded-full" />
                                <p className="font-bold text-black text-lg capitalize">{user?.role || 'User'}</p>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Store Assignment</p>
                            <div className="flex items-center gap-3">
                                <Store size={18} className="text-gray-400" />
                                <p className="font-bold text-black text-lg">{user?.store_id ? 'Central Supermarket' : 'Standalone'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metadata Footer */}
            <div className="flex flex-wrap items-center justify-center gap-8 py-10 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    <Shield size={14} /> Secure Login Active
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    <Calendar size={14} /> Last Login Today
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    <Store size={14} /> Terminal Verified
                </div>
            </div>
        </div>
    );
}
