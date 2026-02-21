"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CircleCheck, RefreshCw, BookOpen, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { useTranslation } from "@/lib/hooks/useTranslation";

interface CompletionViewProps {
    readonly onReset: () => void;
    readonly onOpenLibrary: () => void;
    readonly presetName: string;
    readonly beadColor: string;
    readonly isIntermediary?: boolean;
    readonly onNext?: () => void;
}

export function CompletionView({ onReset, onOpenLibrary, presetName, beadColor, isIntermediary, onNext }: CompletionViewProps) {
    const { t } = useTranslation();
    const confettiLaunched = useRef(false);

    useEffect(() => {
        if (!confettiLaunched.current) {
            const duration = isIntermediary ? 2.5 * 1000 : 5 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                // since particles fall down, start a bit higher than random
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                    colors: [beadColor, '#ffffff']
                });
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                    colors: [beadColor, '#ffffff']
                });
            }, 250);

            confettiLaunched.current = true;
        }
    }, [beadColor, isIntermediary]);

    // Isolated event handlers to prevent propagation
    const stopAllBubbles = (e: React.UIEvent) => {
        e.stopPropagation();
        if ('nativeEvent' in e) {
            (e.nativeEvent as any).stopImmediatePropagation?.();
        }
    };

    return (
        <div
            className="flex flex-col items-center justify-center p-6 sm:p-10 text-center text-white relative pointer-events-auto w-full h-full overflow-hidden bg-slate-950/80 backdrop-blur-xl"
            onPointerDown={stopAllBubbles}
            onPointerUp={stopAllBubbles}
            onMouseDown={stopAllBubbles}
            onMouseUp={stopAllBubbles}
            onTouchStart={stopAllBubbles}
            onTouchEnd={stopAllBubbles}
        >
            {/* Celestial Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                        rotate: [0, 90, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[100px]"
                    style={{ backgroundColor: `${beadColor}33` }}
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.05, 0.15, 0.05],
                        rotate: [0, -90, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full blur-[120px]"
                    style={{ backgroundColor: `${beadColor}1a` }}
                />
            </div>

            {/* Success Icon Group */}
            <div className="relative mb-12">
                <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.1
                    }}
                    className="relative z-20 w-32 h-32 flex items-center justify-center"
                >
                    {/* Rotating Rings */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-[2.5rem] border-2 border-dashed"
                        style={{ borderColor: `${beadColor}4d` }}
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 rounded-[2rem] border border-white/10"
                    />

                    {/* Inner Jewel */}
                    <div
                        className="absolute inset-4 rounded-full flex items-center justify-center overflow-hidden"
                        style={{
                            backgroundColor: beadColor,
                            boxShadow: `0 0 50px ${beadColor}80`
                        }}
                    >
                        <CircleCheck size={48} className="text-slate-950 stroke-[2]" />
                        <motion.div
                            animate={{
                                x: ['-200%', '200%'],
                                opacity: [0, 1, 0]
                            }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                        />
                    </div>
                </motion.div>

                {/* Sparkling Aura */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -inset-10 z-10"
                >
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute"
                            initial={{
                                x: "50%",
                                y: "50%",
                                scale: 0,
                                rotate: i * 60
                            }}
                            animate={{
                                x: `${50 + Math.cos(i * 60 * Math.PI / 180) * 80}%`,
                                y: `${50 + Math.sin(i * 60 * Math.PI / 180) * 80}%`,
                                scale: [0, 1, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.2 + 0.5,
                                ease: "easeOut"
                            }}
                        >
                            <Sparkles size={16} style={{ color: beadColor }} className="drop-shadow-2xl" />
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <div className="space-y-4 mb-10 relative z-10 transition-all">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <span
                        className="text-xs font-black tracking-[0.4em] uppercase"
                        style={{ color: beadColor }}
                    >
                        {isIntermediary ? t.session.modification : t.session.completion.sessionComplete}
                    </span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                        delay: 0.4
                    }}
                    className="text-5xl font-black text-white tracking-tighter"
                >
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-slate-400 font-medium max-w-[280px] mx-auto leading-relaxed"
                >
                    {isIntermediary ? (
                        <>{t.session.completion.sessionComplete} <span className="text-white border-b pb-0.5" style={{ borderColor: `${beadColor}4d` }}>{presetName}</span>.</>
                    ) : (
                        <>{t.session.completion.sessionComplete} <span className="text-white border-b pb-0.5" style={{ borderColor: `${beadColor}4d` }}>{presetName}</span>.</>
                    )}
                </motion.p>
            </div>

            <div className="grid grid-cols-1 gap-3 w-full max-w-[280px] relative z-10">
                {isIntermediary ? (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 }}
                        onClick={(e) => { stopAllBubbles(e); onNext?.(); }}
                        className="group flex items-center justify-center gap-3 rounded-2xl bg-white text-slate-950 px-6 py-4 hover:bg-white/90 active:scale-[0.98] transition-all duration-300 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                    >
                        <span className="font-black text-base uppercase tracking-wider">{t.common.back}</span>
                    </motion.button>
                ) : (
                    <>
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                            onClick={(e) => { stopAllBubbles(e); onReset(); }}
                            className="group flex items-center justify-between gap-3 rounded-2xl bg-white text-slate-950 px-6 py-4 hover:bg-white/90 active:scale-[0.98] transition-all duration-300 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                        >
                            <div className="flex items-center gap-3">
                                <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
                                <span className="font-bold text-sm">{t.session.completion.startAgain}</span>
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-950/20" />
                        </motion.button>

                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                            onClick={(e) => { stopAllBubbles(e); onOpenLibrary(); }}
                            className="group flex items-center justify-between gap-3 rounded-2xl bg-slate-900/50 border border-white/10 px-6 py-4 text-white hover:bg-slate-900 active:scale-[0.98] transition-all duration-300 backdrop-blur-xl"
                            style={{ '--hover-border': `${beadColor}4d` } as any}
                        >
                            <div className="flex items-center gap-3">
                                <BookOpen size={18} style={{ color: beadColor }} />
                                <span className="font-bold text-sm">{t.library.title}</span>
                            </div>
                        </motion.button>
                    </>
                )}
            </div>

            {/* Quote of the Day or encouraging hint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 1.2 }}
                className="mt-12 text-[10px] text-white uppercase tracking-[0.2em] font-medium"
            >
                {t.home.sub_evening}
            </motion.div>
        </div>
    );
}
