"use client";

import { motion } from "framer-motion";
import { CircleCheck, RefreshCw, BookOpen } from "lucide-react";

interface CompletionViewProps {
    readonly onReset: () => void;
    readonly onOpenLibrary: () => void;
    readonly presetName: string;
}

export function CompletionView({ onReset, onOpenLibrary, presetName }: CompletionViewProps) {
    // Isolated event handlers to prevent propagation
    const stopAllBubbles = (e: React.UIEvent) => {
        e.stopPropagation();
        if ('nativeEvent' in e) {
            (e.nativeEvent as any).stopImmediatePropagation?.();
        }
    };

    return (
        <div
            className="flex flex-col items-center justify-center space-y-8 p-6 sm:p-10 text-center text-white relative pointer-events-auto w-full h-full"
            onPointerDown={stopAllBubbles}
            onPointerUp={stopAllBubbles}
            onMouseDown={stopAllBubbles}
            onMouseUp={stopAllBubbles}
            onTouchStart={stopAllBubbles}
            onTouchEnd={stopAllBubbles}
        >
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                    delay: 0.1
                }}
                className="rounded-3xl bg-emerald-500/15 p-6 sm:p-8 text-emerald-400 ring-1 ring-emerald-500/20 backdrop-blur-2xl relative z-10"
            >
                <CircleCheck size={64} className="sm:w-20 sm:h-20 stroke-[1.5]" />
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

            <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 w-full max-w-md pointer-events-auto">
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    onClick={(e) => { stopAllBubbles(e); onReset(); }}
                    onPointerDown={stopAllBubbles}
                    onPointerUp={stopAllBubbles}
                    onMouseDown={stopAllBubbles}
                    onMouseUp={stopAllBubbles}
                    onTouchStart={stopAllBubbles}
                    className="group flex items-center justify-center gap-3 rounded-3xl bg-white/12 px-8 py-4 text-white hover:bg-white/18 active:scale-95 transition-all duration-200 backdrop-blur-2xl w-full sm:w-auto min-h-[56px]"
                >
                    <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500 ease-out stroke-[1.5]" />
                    <span className="font-medium text-base">Recommencer</span>
                </motion.button>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    onClick={(e) => { stopAllBubbles(e); onOpenLibrary(); }}
                    onPointerDown={stopAllBubbles}
                    onPointerUp={stopAllBubbles}
                    onMouseDown={stopAllBubbles}
                    onMouseUp={stopAllBubbles}
                    onTouchStart={stopAllBubbles}
                    className="group flex items-center justify-center gap-3 rounded-3xl bg-emerald-500/15 px-8 py-4 text-emerald-100 hover:bg-emerald-500/20 active:scale-95 transition-all duration-200 backdrop-blur-2xl ring-1 ring-emerald-500/20 w-full sm:w-auto min-h-[56px]"
                >
                    <BookOpen size={20} className="stroke-[1.5]" />
                    <span className="font-medium text-base">Bibliothèque</span>
                </motion.button>
            </div>
        </div>
    );
}
