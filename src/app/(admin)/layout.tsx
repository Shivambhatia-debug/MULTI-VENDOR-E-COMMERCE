import AuthGuard from "@/components/auth/AuthGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Bell, Search, User } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard requiredRole="admin">
            <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-slate-950 selection:text-white">
                <AdminSidebar />
                <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
                    {/* Admin Header */}
                    <header className="h-16 md:h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
                        <div className="relative w-full max-w-xs md:max-w-md ml-12 lg:ml-0">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                            <input
                                type="text"
                                placeholder="GLOBAL PLATFORM SEARCH..."
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 md:py-3 pl-11 pr-4 text-[10px] font-black tracking-widest uppercase focus:ring-2 focus:ring-slate-950 outline-none transition-all placeholder:text-slate-200"
                            />
                        </div>

                        <div className="flex items-center gap-2 md:gap-4">
                            <button className="hidden md:flex p-2.5 text-slate-400 hover:bg-slate-50 hover:text-slate-950 rounded-xl transition-all relative border border-transparent hover:border-slate-100">
                                <Bell size={20} />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                            </button>
                            <div className="hidden md:block h-8 w-px bg-slate-100 mx-2"></div>
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] font-black text-slate-950 leading-none uppercase tracking-tighter italic">Super Admin</p>
                                    <p className="text-[9px] font-black text-slate-400 mt-1 uppercase tracking-widest opacity-60">System Root</p>
                                </div>
                                <div className="w-9 h-9 md:w-11 md:h-11 bg-slate-950 rounded-2xl flex items-center justify-center text-white font-black border border-slate-900 shadow-2xl shadow-slate-950/20">
                                    <User size={20} />
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content Area */}
                    <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}
