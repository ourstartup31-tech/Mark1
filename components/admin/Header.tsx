import { Bell, Search, User, ChevronDown, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/context/AdminContext";

export function Header() {
    const { logout, user } = useAuth();
    const { searchQuery, setSearchQuery } = useAdmin();

    return (
        <header className="h-24 bg-white border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-40">
            {/* Left side - Search or Page Title context */}
            <div className="flex-1 max-w-md">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search dashboard..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-12 pr-6 text-sm font-medium outline-none focus:bg-white focus:border-black focus:shadow-lg focus:shadow-gray-200/50 transition-all"
                    />
                </div>
            </div>

            {/* Right side - Actions & Profile */}
            <div className="flex items-center gap-6">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-400 hover:text-[#D60000] hover:bg-red-50 transition-all font-bold text-xs uppercase tracking-widest group"
                >
                    <LogOut size={16} className="group-hover:scale-110 transition-transform" />
                    Logout
                </button>

                <div className="h-8 w-px bg-gray-100" />

                <Link href="/admin/profile" className="flex items-center gap-4 group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-black group-hover:text-[#D60000] transition-colors">
                            {user?.name || (user?.role === 'admin' ? 'Admin User' : 'Staff')}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            {user?.phone || 'No Phone'}
                        </p>
                    </div>
                    <div className="relative">
                        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform duration-300">
                            {(user?.name || (user?.role === 'admin' ? 'Admin' : 'User')).substring(0, 2).toUpperCase()}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white" />
                    </div>
                    <ChevronDown size={16} className="text-gray-300 group-hover:text-black transition-colors" />
                </Link>
            </div>
        </header>
    );
}
