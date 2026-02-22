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
    onSuccess?: (id: string) => void;
}

const quickRepetitions = [33, 99, 100];

export function CreateInvocationModal({ isOpen, onClose, editInvocation, onSuccess }: Readonly<CreateInvocationModalProps>) {
    const { addInvocation, updateInvocation } = useInvocationStore();
    const beadColor = useSessionStore((s) => s.beadColor);
    const [nameFr, setNameFr] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [showEnglish, setShowEnglish] = useState(false);
    const [repetitions, setRepetitions] = useState<number>(33);
    const [customRepetitions, setCustomRepetitions] = useState("");
    const [descriptionFr, setDescriptionFr] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [errors, setErrors] = useState<{ nameFr?: string; repetitions?: string }>({});

    useEffect(() => {
        if (editInvocation) {
            const n = editInvocation.name;
            const d = editInvocation.description;
            setNameFr(typeof n === 'string' ? n : n.fr);
            setNameEn(typeof n === 'string' ? "" : n.en);
            setDescriptionFr(typeof d === 'string' ? d : (d?.fr || ""));
            setDescriptionEn(typeof d === 'string' ? "" : (d?.en || ""));
            setShowEnglish(typeof n !== 'string' || !!(typeof d !== 'string' && d?.en));

            if (quickRepetitions.includes(editInvocation.repetitions)) {
                setRepetitions(editInvocation.repetitions);
                setCustomRepetitions("");
            } else {
                setRepetitions(0);
                setCustomRepetitions(editInvocation.repetitions.toString());
            }
        } else {
            setNameFr("");
            setNameEn("");
            setShowEnglish(false);
            setRepetitions(33);
            setCustomRepetitions("");
            setDescriptionFr("");
            setDescriptionEn("");
        }
        setErrors({});
    }, [editInvocation, isOpen]);

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const newErrors: { nameFr?: string; repetitions?: string } = {};
        if (!nameFr.trim()) newErrors.nameFr = "Veuillez donner un nom";
        const finalRepetitions = customRepetitions ? Number.parseInt(customRepetitions) : repetitions;
        if (!finalRepetitions || finalRepetitions < 1) newErrors.repetitions = "Nombre invalide";
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

        const nameData = nameEn.trim() ? { fr: nameFr.trim(), en: nameEn.trim() } : nameFr.trim();
        const descData = descriptionEn.trim() ? { fr: descriptionFr.trim(), en: descriptionEn.trim() } : (descriptionFr.trim() || undefined);

        if (editInvocation) {
            updateInvocation(editInvocation.id, {
                name: nameData,
                repetitions: finalRepetitions,
                description: descData,
            });
        } else {
            const newId = addInvocation({
                name: nameData,
                repetitions: finalRepetitions,
                description: descData,
            });
            onSuccess?.(newId);
        }
        handleClose();
    };

    const handleClose = () => {
        setNameFr(""); setNameEn(""); setShowEnglish(false);
        setRepetitions(33); setCustomRepetitions("");
        setDescriptionFr(""); setDescriptionEn("");
        setErrors({}); onClose();
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
                        className="fixed inset-x-0 top-0 z-50 bg-slate-50 dark:bg-[#1c1c1e] rounded-b-[2rem] shadow-2xl"
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
                                <div className="flex items-center justify-between">
                                    <label className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-600/70 dark:text-white/35">
                                        Nom (Français)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowEnglish(!showEnglish)}
                                        className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full transition-colors ${showEnglish ? 'bg-cyan-500 text-white' : 'bg-slate-200/50 dark:bg-white/10 text-slate-600 dark:text-slate-500'}`}
                                    >
                                        + Anglais
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={nameFr}
                                    onChange={(e) => setNameFr(e.target.value)}
                                    placeholder="Ex: Al-Hamdulillah"
                                    className="w-full px-4 py-3 bg-white dark:bg-white/[0.07] border border-slate-300 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white text-[15px] placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none focus:border-slate-400 dark:focus:border-white/25 font-semibold transition-all shadow-sm dark:shadow-none"
                                />
                                {errors.nameFr && <p className="text-[11px] font-bold text-rose-500 px-1">{errors.nameFr}</p>}

                                <AnimatePresence>
                                    {showEnglish && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden space-y-1.5 pt-1"
                                        >
                                            <label className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-600/70 dark:text-white/35 pl-1">
                                                Name (English)
                                            </label>
                                            <input
                                                type="text"
                                                value={nameEn}
                                                onChange={(e) => setNameEn(e.target.value)}
                                                placeholder="Ex: Al-Hamdulillah (English)"
                                                className="w-full px-4 py-3 bg-white dark:bg-white/[0.07] border border-slate-300 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white text-[15px] placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none focus:border-slate-400 dark:focus:border-white/25 font-semibold transition-all shadow-sm dark:shadow-none"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Notes */}
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-600/70 dark:text-white/35">
                                    Notes (Français)
                                </label>
                                <textarea
                                    value={descriptionFr}
                                    onChange={(e) => setDescriptionFr(e.target.value)}
                                    placeholder="Signification ou rappel..."
                                    rows={2}
                                    className="w-full px-4 py-3 bg-white dark:bg-white/[0.07] border border-slate-300 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none focus:border-slate-400 dark:focus:border-white/25 font-medium resize-none transition-all shadow-sm dark:shadow-none"
                                />

                                <AnimatePresence>
                                    {showEnglish && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden space-y-1.5 pt-1"
                                        >
                                            <label className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-600/70 dark:text-white/35 pl-1">
                                                Notes (English)
                                            </label>
                                            <textarea
                                                value={descriptionEn}
                                                onChange={(e) => setDescriptionEn(e.target.value)}
                                                placeholder="Meaning or reminder..."
                                                rows={2}
                                                className="w-full px-4 py-3 bg-white dark:bg-white/[0.07] border border-slate-300 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none focus:border-slate-400 dark:focus:border-white/25 font-medium resize-none transition-all shadow-sm dark:shadow-none"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Répétitions */}
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-600/70 dark:text-white/35">
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
                                                className={`h-11 rounded-xl border-2 font-black text-sm transition-all ${active ? "" : "bg-white dark:bg-white/[0.06] border-slate-200 dark:border-white/10 text-slate-400 dark:text-white/45"
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
                                        className="w-full h-11 bg-white dark:bg-white/[0.06] border-2 border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/25 focus:outline-none text-center font-black text-sm transition-all shadow-sm dark:shadow-none"
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
