"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface HorizontalScrollerProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

export default function HorizontalScroller({ title, subtitle, children }: HorizontalScrollerProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === "left" ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    return (
        <section className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-100 shadow-sm relative group">
            <div className="flex items-center justify-between mb-4 sm:mb-6 pb-2 border-b border-slate-50">
                <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tighter italic">{title}</h3>
                    {subtitle && <p className="text-[8px] sm:text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{subtitle}</p>}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll("left")}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
                    >
                        <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
                    >
                        <ChevronRight size={14} className="sm:w-4 sm:h-4" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-2"
                style={{ scrollSnapType: "x mandatory" }}
            >
                {/* Adding extra space at the end */}
                <div className="flex gap-4 sm:gap-6">
                    {children}
                </div>
            </div>
        </section>
    );
}
