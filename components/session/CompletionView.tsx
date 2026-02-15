"use client";

import { motion } from "framer-motion";
import { CheckCircle2, RotateCcw, BookOpen } from "lucide-react";

interface CompletionViewProps {
    readonly onReset: () => void;
    readonly onOpenLibrary: () => void;
    readonly presetName: string;
}

export function CompletionView({ onReset, onOpenLibrary, presetName }: CompletionViewProps) {
    return (
        <div className="flex flex-col items-center justify-center space-y-6 sm:space-y-8 p-4 sm:p-8 text-center text-white relative">
            <motion.div
                initial={{ scale: 0, rotate: -45, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1
                }}
                className="rounded-full bg-emerald-500/20 p-4 sm:p-6 text-emerald-400 ring-1 ring-emerald-500/50 shadow-[0_0_60px_rgba(16,185,129,0.4)] relative z-10"
            >
                <CheckCircle2 size={56} className="sm:w-16 sm:h-16" />
            </motion.div>

            <div className="space-y-3 sm:space-y-4 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
                >
                    Alhamdulillah!
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg sm:text-xl text-slate-300 font-light px-4"
                >
                    Ta session de <span className="font-semibold text-white">{presetName}</span> est terminée.
                </motion.p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 relative z-10 w-full max-w-sm sm:max-w-none">
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    onClick={onReset}
                    className="group flex items-center justify-center gap-3 rounded-2xl bg-white/10 px-6 py-4 text-white hover:bg-white/20 active:scale-95 transition-all backdrop-blur-md border border-white/10 w-full sm:w-auto touch-manipulation min-h-[52px]"
                >
                    <RotateCcw size={18} className="group-hover:-rotate-180 transition-transform duration-700 ease-in-out" />
                    <span className="font-medium tracking-wide">Recommencer</span>
                </motion.button>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    onClick={onOpenLibrary}
                    className="group flex items-center justify-center gap-3 rounded-2xl bg-emerald-500/20 px-6 py-4 text-white hover:bg-emerald-500/30 active:scale-95 transition-all backdrop-blur-md border border-emerald-500/30 w-full sm:w-auto touch-manipulation min-h-[52px]"
                >
                    <BookOpen size={18} />
                    <span className="font-medium tracking-wide">Bibliothèque</span>
                </motion.button>
            </div>
        </div>
    );
}
