import AdminSidebar from "@/components/admin/AdminSidebar";
import { Bell, Search, User } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            <AdminSidebar />
            <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
                {/* Admin Header */}
                <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search merchants, stores, or analytics..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-slate-200 mx-2"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-slate-900 leading-none">Super Admin</p>
                                <p className="text-[11px] text-slate-500 mt-1">Platform Owner</p>
                            </div>
                            <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                                <User size={20} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
