"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface BeadDisplayProps {
    count: number;
    total: number;
    label?: string;
    sublabel?: string;
    onTap: () => void;
}

export function BeadDisplay({ count, total, label, sublabel, onTap }: BeadDisplayProps) {
    const [direction, setDirection] = useState(1);
    const [prevCount, setPrevCount] = useState(count);

    useEffect(() => {
        setDirection(count > prevCount ? 1 : -1);
        setPrevCount(count);
    }, [count, prevCount]);

    return (
        <div
            className="relative flex h-80 w-full flex-col items-center justify-center overflow-hidden rounded-full bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer touch-none select-none"
            onClick={onTap}
        >
            {/* Background Rings */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="h-64 w-64 rounded-full border-4 border-slate-300" />
                <div className="absolute h-48 w-48 rounded-full border-4 border-slate-300" />
            </div>

            {/* Main Bead Animation */}
            <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                    key={count}
                    custom={direction}
                    initial={{ y: 50 * direction, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -50 * direction, opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="z-10 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600 shadow-xl shadow-rose-500/30"
                >
                    <div className="flex flex-col items-center pt-2 text-white">
                        <span className="text-4xl font-bold tracking-tighter">{count}</span>
                        <span className="text-[10px] uppercase opacity-80">sur {total}</span>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Label / Prayer Text */}
            <div className="absolute bottom-12 z-20 mx-auto w-full px-8 text-center">
                <motion.div
                    key={`text-${count}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h3 className="text-xl font-bold text-slate-800">{label || "Kourous"}</h3>
                    {sublabel && <p className="mt-1 text-sm text-slate-500">{sublabel}</p>}
                </motion.div>
            </div>

            {/* Tap Hint */}
            <div className="absolute bottom-4 text-xs font-medium uppercase tracking-widest text-slate-300">
                Tap pour avancer
            </div>
        </div>
    );
}
