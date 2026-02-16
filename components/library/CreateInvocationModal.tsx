"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Plus } from "lucide-react";
import { useInvocationStore } from "@/lib/store/invocationStore";
import { useSessionStore } from "@/lib/store/sessionStore";

interface CreateInvocationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const quickRepetitions = [33, 99, 100];

export function CreateInvocationModal({ isOpen, onClose }: CreateInvocationModalProps) {
    const { addInvocation } = useInvocationStore();
    const beadColor = useSessionStore((s) => s.beadColor);
    const [name, setName] = useState("");
    const [repetitions, setRepetitions] = useState<number>(33);
    const [customRepetitions, setCustomRepetitions] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState<{ name?: string; repetitions?: string }>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: { name?: string; repetitions?: string } = {};
        if (!name.trim()) {
            newErrors.name = "Veuillez donner un nom";
        }
        const finalRepetitions = customRepetitions ? parseInt(customRepetitions) : repetitions;
        if (!finalRepetitions || finalRepetitions < 1) {
            newErrors.repetitions = "Le nombre doit être supérieur à 0";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        addInvocation({
            name: name.trim(),
            repetitions: finalRepetitions,
            description: description.trim() || undefined,
        });

        handleClose();
    };

    const handleClose = () => {
        setName("");
        setRepetitions(33);
        setCustomRepetitions("");
        setDescription("");
        setErrors({});
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-5"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 30 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative overflow-hidden bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 sm:p-10 max-w-md w-full shadow-2xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Premium Glow Decoration */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-20" />
                        <div className="absolute -top-24 -right-24 w-64 h-64 blur-[100px] rounded-full pointer-events-none opacity-20" style={{ backgroundColor: beadColor }} />

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div>
                                <div className="flex items-center gap-2 mb-2" style={{ color: beadColor }}>
                                    <Sparkles size={14} className="animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.25em]">Personnalisation</span>
                                </div>
                                <h2 className="text-2xl font-black tracking-tight text-white leading-tight">Nouvelle Invocation</h2>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            {/* Name Input */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Nom de l'invocation</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ex: Al-Hamdulillah"
                                    autoFocus
                                    className="w-full px-6 py-4.5 bg-white/[0.03] border border-white/10 rounded-2xl text-white text-lg placeholder:text-slate-700 focus:outline-none focus:border-white/20 transition-all font-bold"
                                />
                                {errors.name && (
                                    <p className="text-[11px] font-bold text-rose-500 px-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Description Input */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Notes (Optionnel)</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Signification ou rappel..."
                                    rows={2}
                                    className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white text-sm placeholder:text-slate-700 focus:outline-none focus:border-white/20 transition-all font-medium resize-none"
                                />
                            </div>

                            {/* Repetitions Selection */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Nombre de répétitions</label>
                                <div className="grid grid-cols-4 gap-3">
                                    {quickRepetitions.map((quickRep) => (
                                        <button
                                            key={quickRep}
                                            type="button"
                                            onClick={() => {
                                                setRepetitions(quickRep);
                                                setCustomRepetitions("");
                                            }}
                                            style={{
                                                backgroundColor: repetitions === quickRep && !customRepetitions ? `${beadColor}20` : undefined,
                                                borderColor: repetitions === quickRep && !customRepetitions ? `${beadColor}40` : undefined,
                                                color: repetitions === quickRep && !customRepetitions ? 'white' : undefined
                                            }}
                                            className={`h-12 rounded-xl border-2 transition-all font-black text-sm flex items-center justify-center ${repetitions === quickRep && !customRepetitions
                                                ? ""
                                                : "bg-white/[0.03] border-white/5 text-slate-500"
                                                }`}
                                        >
                                            {quickRep}
                                        </button>
                                    ))}
                                    <input
                                        type="number"
                                        value={customRepetitions}
                                        onChange={(e) => setCustomRepetitions(e.target.value)}
                                        placeholder="..."
                                        className="w-full h-12 bg-white/[0.03] border-2 border-white/5 rounded-xl text-white placeholder:text-slate-700 focus:outline-none transition-all text-center font-black text-sm"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                style={{
                                    backgroundColor: beadColor,
                                    boxShadow: `0 10px 30px -10px ${beadColor}80`
                                }}
                                className="w-full py-5 rounded-[1.5rem] text-white font-black text-sm tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
                            >
                                <Plus size={18} strokeWidth={4} />
                                ENREGISTRER L'INVOCATION
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
