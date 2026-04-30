"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import {
    CalendarCheck,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Users,
    Clock,
    CheckCircle2,
    XCircle,
    User,
    Calendar
} from "lucide-react";

const mockBookings = [
    { id: "BOK-001", customer: "Fatima Al-Jassim", date: "2026-04-25", time: "07:30 PM", guests: 4, table: "T-12", status: "Confirmed" },
    { id: "BOK-002", customer: "John Doe", date: "2026-04-25", time: "08:00 PM", guests: 2, table: "T-05", status: "Pending" },
    { id: "BOK-003", customer: "Zaid Hassan", date: "2026-04-24", time: "01:15 PM", guests: 8, table: "VIP-1", status: "Arrived" },
    { id: "BOK-004", customer: "Eman Ahmed", date: "2026-04-24", time: "09:00 PM", guests: 2, table: "T-08", status: "Cancelled" },
];

export default function BookingsPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />

            <main className="flex-1 p-6 lg:p-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Table Reservations</h1>
                        <p className="text-slate-500 text-xs mt-1">Manage restaurant bookings, guest arrivals, and table assignments.</p>
                    </div>
                    <button className="btn-primary flex items-center justify-center gap-2 text-[10px] py-3 px-6 uppercase tracking-widest">
                        <Plus size={16} />
                        New Reservation
                    </button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card-saas p-6 border-l-4 border-l-blue-600">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Expected</p>
                                <p className="text-2xl font-black text-slate-900">42 Guests</p>
                            </div>
                            <Users className="text-blue-100" size={32} />
                        </div>
                    </div>
                    <div className="card-saas p-6 border-l-4 border-l-emerald-600">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Confirmed</p>
                                <p className="text-2xl font-black text-slate-900">12 Bookings</p>
                            </div>
                            <CheckCircle2 className="text-emerald-100" size={32} />
                        </div>
                    </div>
                    <div className="card-saas p-6 border-l-4 border-l-amber-600">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Next Arrival</p>
                                <p className="text-2xl font-black text-slate-900">7:30 PM</p>
                            </div>
                            <Clock className="text-amber-100" size={32} />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="card-saas p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="text" placeholder="Find booking by name or ID..." className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl text-[11px]" />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <button className="flex-1 md:flex-initial px-6 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                            <Calendar size={14} />
                            Date
                        </button>
                    </div>
                </div>

                {/* Bookings Table */}
                <div className="card-saas overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Guest Info</th>
                                    <th className="p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</th>
                                    <th className="p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Guests</th>
                                    <th className="p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Table</th>
                                    <th className="p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="p-6"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {mockBookings.map((booking) => {
                                    const statusColors: any = {
                                        Confirmed: "bg-emerald-50 text-emerald-600",
                                        Pending: "bg-blue-50 text-blue-600",
                                        Arrived: "bg-indigo-50 text-indigo-600",
                                        Cancelled: "bg-rose-50 text-rose-300 line-through"
                                    };
                                    return (
                                        <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-slate-50 text-slate-300 rounded-xl flex items-center justify-center">
                                                        <User size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-900 leading-none">{booking.customer}</p>
                                                        <p className="text-[10px] text-slate-400 mt-1.5 uppercase font-medium">{booking.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-black text-slate-700">{booking.time}</span>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{booking.date}</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-center">
                                                <span className="text-[11px] font-black text-slate-700 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                                                    {booking.guests}
                                                </span>
                                            </td>
                                            <td className="p-6 text-center">
                                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{booking.table}</span>
                                            </td>
                                            <td className="p-6 text-center">
                                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${statusColors[booking.status]}`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right">
                                                <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 transition-all">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
