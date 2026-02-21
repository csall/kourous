"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus } from "lucide-react";
import { useInvocationStore, type Invocation } from "@/lib/store/invocationStore";
import { useSessionStore } from "@/lib/store/sessionStore";

interface CreateInvocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    editInvocation?: Invocation | null;
    onSuccess?: () => void;
}

const quickRepetitions = [33, 99, 100];

export function CreateInvocationModal({ isOpen, onClose, editInvocation, onSuccess }: Readonly<CreateInvocationModalProps>) {
    const { addInvocation, updateInvocation } = useInvocationStore();
    const beadColor = useSessionStore((s) => s.beadColor);
    const [name, setName] = useState("");
    const [repetitions, setRepetitions] = useState<number>(33);
    const [customRepetitions, setCustomRepetitions] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState<{ name?: string; repetitions?: string }>({});

    useEffect(() => {
        if (editInvocation) {
            setName(editInvocation.name);
            setDescription(editInvocation.description || "");
            if (quickRepetitions.includes(editInvocation.repetitions)) {
                setRepetitions(editInvocation.repetitions);
                setCustomRepetitions("");
            } else {
                setRepetitions(0);
                setCustomRepetitions(editInvocation.repetitions.toString());
            }
        } else {
            setName("");
            setRepetitions(33);
            setCustomRepetitions("");
            setDescription("");
        }
        setErrors({});
    }, [editInvocation, isOpen]);

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const newErrors: { name?: string; repetitions?: string } = {};
        if (!name.trim()) newErrors.name = "Veuillez donner un nom";
        const finalRepetitions = customRepetitions ? Number.parseInt(customRepetitions) : repetitions;
        if (!finalRepetitions || finalRepetitions < 1) newErrors.repetitions = "Nombre invalide";
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

        if (editInvocation) {
            updateInvocation(editInvocation.id, {
                name: name.trim(), repetitions: finalRepetitions,
                description: description.trim() || undefined,
            });
        } else {
            addInvocation({
                name: name.trim(), repetitions: finalRepetitions,
                description: description.trim() || undefined,
            });
            onSuccess?.();
        }
        handleClose();
    };

    const handleClose = () => {
        setName(""); setRepetitions(33); setCustomRepetitions("");
        setDescription(""); setErrors({}); onClose();
    };

    const isEditing = !!editInvocation;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    {/* Top Sheet */}
                    <motion.div
                        initial={{ y: "-100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }}
                        transition={{ type: "spring", damping: 32, stiffness: 320 }}
                        className="fixed inset-x-0 top-0 z-50 bg-white dark:bg-[#1c1c1e] rounded-b-[2rem] shadow-2xl"
                        style={{ paddingTop: "max(env(safe-area-inset-top), 16px)" }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 pt-3 pb-3">
                            <div>
                                <div className="flex items-center gap-1.5 mb-0.5" style={{ color: beadColor }}>
                                    <Sparkles size={10} className="animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.25em]">
                                        {isEditing ? "Édition" : "Nouvelle"}
                                    </span>
                                </div>
                                <h2 className="text-[18px] font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                                    {isEditing ? "Modifier l'invocation" : "Créer une invocation"}
                                </h2>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-white/50 active:opacity-70"
                            >
                                <Plus size={16} className="rotate-45" />
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-slate-200 dark:bg-white/[0.07] mx-5 mb-4" />

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="px-5 flex flex-col gap-4">

                            {/* Nom */}
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-500 dark:text-white/35">
                                    Nom de l'invocation
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ex: Al-Hamdulillah"
                                    className="w-full px-4 py-3 bg-slate-100 dark:bg-white/[0.07] border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white text-[15px] placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none focus:border-slate-400 dark:focus:border-white/25 font-semibold"
                                />
                                {errors.name && <p className="text-[11px] font-bold text-rose-500 px-1">{errors.name}</p>}
                            </div>

                            {/* Notes */}
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-500 dark:text-white/35">
                                    Notes (Optionnel)
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Signification ou rappel..."
                                    rows={2}
                                    className="w-full px-4 py-3 bg-slate-100 dark:bg-white/[0.07] border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none focus:border-slate-400 dark:focus:border-white/25 font-medium resize-none"
                                />
                            </div>

                            {/* Répétitions */}
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-500 dark:text-white/35">
                                    Répétitions
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {quickRepetitions.map((qr) => {
                                        const active = repetitions === qr && !customRepetitions;
                                        return (
                                            <button
                                                key={qr} type="button"
                                                onClick={() => { setRepetitions(qr); setCustomRepetitions(""); }}
                                                style={active ? {
                                                    backgroundColor: beadColor + "20",
                                                    borderColor: beadColor + "50",
                                                    color: beadColor,
                                                } : {}}
                                                className={`h-11 rounded-xl border-2 font-black text-sm transition-all ${active ? "" : "bg-slate-100 dark:bg-white/[0.06] border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/45"
                                                    }`}
                                            >
                                                {qr}
                                            </button>
                                        );
                                    })}
                                    <input
                                        type="text" inputMode="numeric" pattern="[0-9]*"
                                        value={customRepetitions}
                                        onChange={(e) => setCustomRepetitions(e.target.value.replaceAll(/\D/g, ""))}
                                        placeholder="…"
                                        className="w-full h-11 bg-slate-100 dark:bg-white/[0.06] border-2 border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/25 focus:outline-none text-center font-black text-sm"
                                    />
                                </div>
                                {errors.repetitions && <p className="text-[11px] font-bold text-rose-500 px-1">{errors.repetitions}</p>}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                style={{ backgroundColor: beadColor, boxShadow: `0 6px 20px -6px ${beadColor}90` }}
                                className="w-full py-[14px] rounded-2xl text-white font-black text-[11px] tracking-widest active:scale-95 transition-transform flex items-center justify-center gap-2 mt-1 mb-5"
                            >
                                <Plus size={15} strokeWidth={4} className={isEditing ? "rotate-45" : ""} />
                                {isEditing ? "ENREGISTRER" : "CRÉER L'INVOCATION"}
                            </button>
                        </form>

                        {/* Handle bas */}
                        <div className="flex justify-center pb-3">
                            <div className="w-9 h-1 rounded-full bg-slate-200 dark:bg-white/15" />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
