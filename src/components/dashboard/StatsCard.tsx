"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import * as Icons from "lucide-react";

interface StatsCardProps {
    label: string;
    value: string;
    change: string;
    icon: string;
    delay?: number;
}

const StatsCard = ({ label, value, change, icon, delay = 0 }: StatsCardProps) => {
    const IconComponent = (Icons as any)[icon];
    const isPositive = change.startsWith("+");

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-50 rounded-xl text-blue-600">
                    {IconComponent && <IconComponent size={24} />}
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    }`}>
                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {change}
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
                <h3 className="text-2xl font-extrabold text-slate-900">{value}</h3>
            </div>
        </motion.div>
    );
};

export default StatsCard;
