"use client";

import { motion } from "framer-motion";
import { CheckCircle2, RotateCcw } from "lucide-react";

interface CompletionViewProps {
    onReset: () => void;
    presetName: string;
}

export function CompletionView({ onReset, presetName }: CompletionViewProps) {
    return (
        <div className="flex flex-col items-center justify-center space-y-8 p-8 text-center text-white relative">
            <motion.div
                initial={{ scale: 0, rotate: -45, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1
                }}
                className="rounded-full bg-emerald-500/20 p-6 text-emerald-400 ring-1 ring-emerald-500/50 shadow-[0_0_60px_rgba(16,185,129,0.4)] relative z-10"
            >
                <CheckCircle2 size={64} />
            </motion.div>

            <div className="space-y-4 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl font-bold text-white tracking-tight"
                >
                    Alhamdulillah!
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-xl text-slate-300 font-light"
                >
                    Ta session de <span className="font-semibold text-white">{presetName}</span> est terminée.
                </motion.p>
            </div>

            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                onClick={onReset}
                className="group flex items-center gap-3 rounded-2xl bg-white/10 px-8 py-5 text-white hover:bg-white/20 active:scale-95 transition-all backdrop-blur-md border border-white/10"
            >
                <RotateCcw size={18} className="group-hover:-rotate-180 transition-transform duration-700 ease-in-out" />
                <span className="font-medium tracking-wide">Recommencer</span>
            </motion.button>
        </div>
    );
}
