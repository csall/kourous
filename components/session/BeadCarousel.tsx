"use client";

import { motion, AnimatePresence, PanInfo, useAnimation } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils/cn";

interface BeadCarouselProps {
    count: number; // Current bead number (1-based index in cycle)
    total: number; // Total beads in cycle
    label: string;
    sublabel?: string;
    onAdvance: () => void;
    onRewind?: () => void;
}

export function BeadCarousel({
    count,
    total,
    label,
    sublabel,
    onAdvance,
    onRewind,
}: BeadCarouselProps) {
    // Trigger animation when count changes
    useEffect(() => {
        // We could trigger animations here if needed, but AnimatePresence handles key changes
    }, [count]);

    // Generate a few beads to show context
    // We only really animate the "current" key change, but we can simulate a list.
    // Actually, a simple key-based animation of the central bead + ghost beads is easier and smoother than a full virtual list for this scale.

    return (
        <div className="relative flex h-[60vh] w-full flex-col items-center justify-center overflow-hidden touch-none select-none">

            {/* Ambient Glow/Grid Background */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-900/40 via-transparent to-transparent blur-3xl" />
            </div>

            {/* Main Bead Area */}
            <div className="z-10 flex flex-col items-center justify-center relative h-96 w-full cursor-grab active:cursor-grabbing">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={count}
                        initial={{ y: -100, opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                        animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ y: 120, opacity: 0, scale: 0.5, filter: "blur(10px)" }} // Exit downwards as if pulled
                        transition={{ type: "spring", stiffness: 350, damping: 25, mass: 1 }}
                        onClick={onAdvance}
                        className="relative flex h-40 w-40 items-center justify-center cursor-pointer"
                    >
                        {/* The Bead Itself */}
                        <div className="h-32 w-32 rounded-full bg-gradient-to-br from-rose-500 to-amber-600 shadow-[0_0_50px_rgba(244,63,94,0.4)] ring-1 ring-white/20 backdrop-blur-md flex items-center justify-center">
                            <div className="absolute inset-2 rounded-full border border-white/10 opacity-50" />
                            <span className="text-5xl font-bold text-white drop-shadow-md font-mono tracking-tighter">
                                {count}
                            </span>
                        </div>

                        {/* Connection String visual */}
                        <div className="absolute -top-40 h-40 w-1 bg-gradient-to-b from-transparent to-white/20" />
                        <div className="absolute -bottom-40 h-40 w-1 bg-gradient-to-b from-white/20 to-transparent" />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Text Info */}
            <div className="z-20 mt-12 text-center">
                <motion.div
                    key={`label-${count}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                >
                    <h2 className="text-3xl font-light tracking-wide text-white/90">
                        {label}
                    </h2>
                    {sublabel && (
                        <p className="text-sm uppercase tracking-[0.2em] text-white/50">
                            {sublabel}
                        </p>
                    )}
                </motion.div>
            </div>

            {/* Progress Indicator (Minimal) */}
            <div className="absolute bottom-10 z-20 flex gap-1">
                {Array.from({ length: Math.min(total, 10) }).map((_, i) => ( // Show distinct dots only for small counts or simplified
                    // Simplified progress bar for large counts
                    <div key={i} className={cn("h-1 rounded-full transition-all duration-300",
                        i < (count / total) * 10 ? "w-8 bg-rose-500" : "w-2 bg-slate-800"
                    )} />
                ))}
                {total > 10 && <div className="h-1 w-2 bg-slate-800" />}
                {/* This is just a visual flourish, not accurate for 33/99. Better to just use a line. */}
            </div>

            <div className="absolute bottom-0 h-1 w-64 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent opacity-50 blur-sm" />

        </div>
    );
}
