"use client";

import { motion } from "framer-motion";
import { CheckCircle2, RotateCcw } from "lucide-react";

interface CompletionViewProps {
    onReset: () => void;
    presetName: string;
}

export function CompletionView({ onReset, presetName }: CompletionViewProps) {
    return (
        <div className="flex flex-col items-center justify-center space-y-8 p-8 text-center text-white">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="rounded-full bg-emerald-500/20 p-6 text-emerald-400 ring-1 ring-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.3)]"
            >
                <CheckCircle2 size={64} />
            </motion.div>

            <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white tracking-tight">Alhamdulillah!</h2>
                <p className="text-lg text-slate-300">
                    Tu as terminé ta session de <span className="font-semibold text-white">{presetName}</span>.
                </p>
            </div>

            <button
                onClick={onReset}
                className="group flex items-center gap-2 rounded-full bg-white/10 px-8 py-4 text-white hover:bg-white/20 active:scale-95 transition-all backdrop-blur-md border border-white/10"
            >
                <RotateCcw size={18} className="group-hover:-rotate-180 transition-transform duration-500" />
                Commencer une nouvelle session
            </button>
        </div>
    );
}
