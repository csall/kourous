"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { ReactNode, useEffect } from "react";

interface FullscreenModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    hideHeader?: boolean;
}

export function FullscreenModal({ isOpen, onClose, title, children, hideHeader }: FullscreenModalProps) {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: "100%" }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: "100%" }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onPointerUp={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    className="fixed inset-0 z-[100] bg-slate-950 flex flex-col"
                >
                    {/* Header */}
                    {!hideHeader && (
                        <div
                            onPointerDown={(e) => e.stopPropagation()}
                            onPointerUp={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onMouseUp={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                            onTouchEnd={(e) => e.stopPropagation()}
                            className="flex items-center gap-4 px-6 pt-[calc(env(safe-area-inset-top,0px)+16px)] pb-4 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-10"
                        >
                            <button
                                onClick={onClose}
                                className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors active:scale-90"
                                aria-label="Retour"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <h2 className="text-xl font-light text-white">{title}</h2>
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
