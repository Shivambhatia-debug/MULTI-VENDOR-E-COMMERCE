"use client";

import { motion } from "framer-motion";

const brands = [
    "LUXE.", "URBANDECOR", "NOVA", "TECH_CORE", "GLALITA", "OMNI", "V3.0", "INFRA"
];

export default function BrandMarquee() {
    return (
        <div className="w-full py-24 overflow-hidden bg-slate-50 border-y border-slate-100">
            <div className="flex whitespace-nowrap">
                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: "-50%" }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="flex gap-20 items-center pr-20"
                >
                    {[...brands, ...brands].map((brand, i) => (
                        <span
                            key={i}
                            className="text-4xl lg:text-7xl font-black text-slate-200 hover:text-slate-950 transition-colors cursor-default select-none tracking-tighter uppercase"
                        >
                            {brand}
                        </span>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
