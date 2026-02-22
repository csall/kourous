"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, GripVertical, Sparkles, Plus, Check } from "lucide-react";
import { useInvocationStore, type InvocationGroup } from "@/lib/store/invocationStore";
import { useSessionStore } from "@/lib/store/sessionStore";
import { useTranslation } from "@/lib/hooks/useTranslation";

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    editGroup?: InvocationGroup | null;
    onSuccess?: (id: string) => void;
}

export function CreateGroupModal({ isOpen, onClose, editGroup, onSuccess }: Readonly<CreateGroupModalProps>) {
    const { addGroup, updateGroup, invocations, getInvocationById } = useInvocationStore();
    const beadColor = useSessionStore((s) => s.beadColor);
    const [nameFr, setNameFr] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [showEnglish, setShowEnglish] = useState(false);
    const [descriptionFr, setDescriptionFr] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [selectedInvocations, setSelectedInvocations] = useState<Array<{
        invocationId: string;
        repetitions: number;
    }>>([]);
    const [errors, setErrors] = useState<{ nameFr?: string; invocations?: string }>({});
    const { t, resolve } = useTranslation();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll au bas de la liste quand on ajoute une étape
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [selectedInvocations.length]);

    useEffect(() => {
        if (editGroup) {
            const n = editGroup.name;
            const d = editGroup.description;
            setNameFr(typeof n === 'string' ? n : n.fr);
            setNameEn(typeof n === 'string' ? "" : n.en);
            setDescriptionFr(typeof d === 'string' ? (d || "") : (d?.fr || ""));
            setDescriptionEn(typeof d === 'string' ? "" : (d?.en || ""));
            setShowEnglish(typeof n !== 'string' || !!(typeof d !== 'string' && d?.en));
            setSelectedInvocations([...editGroup.invocations]);
        } else {
            setNameFr(""); setNameEn(""); setShowEnglish(false);
            setDescriptionFr(""); setDescriptionEn(""); setSelectedInvocations([]);
        }
        setErrors({});
    }, [editGroup, isOpen]);

    const handleAddInvocation = (invocationId: string) => {
        const inv = getInvocationById(invocationId);
        if (!inv) return;
        setSelectedInvocations([...selectedInvocations, { invocationId, repetitions: inv.repetitions }]);
    };

    const handleRemoveInvocation = (index: number) => {
        setSelectedInvocations(selectedInvocations.filter((_, i) => i !== index));
    };

    const handleUpdateRepetitions = (index: number, repetitions: number) => {
        setSelectedInvocations(selectedInvocations.map((inv, i) => i === index ? { ...inv, repetitions } : inv));
    };

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const newErrors: { nameFr?: string; invocations?: string } = {};
        if (!nameFr.trim()) newErrors.nameFr = "Donnez un nom à votre collection";
        if (selectedInvocations.length === 0) newErrors.invocations = "Ajoutez au moins une étape";
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

        const nameData = nameEn.trim() ? { fr: nameFr.trim(), en: nameEn.trim() } : nameFr.trim();
        const descData = descriptionEn.trim() ? { fr: descriptionFr.trim(), en: descriptionEn.trim() } : (descriptionFr.trim() || undefined);

        if (editGroup) {
            updateGroup(editGroup.id, {
                name: nameData, description: descData,
                invocations: selectedInvocations,
            });
        } else {
            const newId = addGroup({
                name: nameData, description: descData,
                invocations: selectedInvocations,
            });
            onSuccess?.(newId);
        }
        handleClose();
    };

    const handleClose = () => {
        setNameFr(""); setNameEn(""); setShowEnglish(false);
        setDescriptionFr(""); setDescriptionEn("");
        setSelectedInvocations([]); setErrors({}); onClose();
    };

    const availableInvocations = invocations.filter(
        inv => !selectedInvocations.some(sel => sel.invocationId === inv.id)
    );
    const isEditing = !!editGroup;

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

                    {/* Top Sheet — slide depuis le haut, clavier en dessous */}
                    <motion.div
                        initial={{ y: "-100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }}
                        transition={{ type: "spring", damping: 32, stiffness: 320 }}
                        className="fixed inset-x-0 top-0 z-50 bg-slate-50 dark:bg-[#1c1c1e] rounded-b-[2rem] flex flex-col shadow-2xl"
                        style={{
                            maxHeight: "90dvh",
                            paddingTop: "max(env(safe-area-inset-top), 16px)",
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 pt-3 pb-3 shrink-0">
                            <div>
                                <div className="flex items-center gap-1.5 mb-0.5" style={{ color: beadColor }}>
                                    <Sparkles size={10} className="animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.25em]">
                                        {isEditing ? "Édition" : "Création"}
                                    </span>
                                </div>
                                <h2 className="text-[18px] font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                                    {isEditing ? "Modifier la collection" : "Nouvelle collection"}
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
                        <div className="h-px bg-slate-200 dark:bg-white/[0.07] mx-5 mb-4 shrink-0" />

                        {/* Champs fixes — toujours visibles */}
                        <div className="px-5 flex flex-col gap-4 shrink-0">
                            {/* Nom */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="group-name" className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-600/70 dark:text-white/35">
                                        Nom (Français)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowEnglish(!showEnglish)}
                                        className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full transition-colors ${showEnglish ? 'bg-indigo-500 text-white' : 'bg-slate-200/50 dark:bg-white/10 text-slate-600'}`}
                                    >
                                        + Anglais
                                    </button>
                                </div>
                                <input
                                    id="group-name"
                                    type="text"
                                    value={nameFr}
                                    onChange={(e) => setNameFr(e.target.value)}
                                    placeholder="Ex: Rituel du Matin"
                                    className="w-full px-4 py-3 bg-white dark:bg-white/[0.07] border border-slate-300 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white text-[15px] placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none focus:border-slate-400 dark:focus:border-white/25 font-semibold transition-all shadow-sm dark:shadow-none"
                                />
                                {errors.nameFr && <p className="text-[11px] font-bold text-rose-400 px-1">{errors.nameFr}</p>}

                                <AnimatePresence>
                                    {showEnglish && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden space-y-1.5 pt-1"
                                        >
                                            <label htmlFor="group-name-en" className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-600/70 dark:text-white/35 pl-1">
                                                Name (English)
                                            </label>
                                            <input
                                                id="group-name-en"
                                                type="text"
                                                value={nameEn}
                                                onChange={(e) => setNameEn(e.target.value)}
                                                placeholder="Ex: Morning Ritual"
                                                className="w-full px-4 py-3 bg-white dark:bg-white/[0.07] border border-slate-300/50 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white text-[15px] placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none focus:border-slate-400 dark:focus:border-white/25 font-semibold transition-colors shadow-sm dark:shadow-none"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Notes */}
                            <div className="space-y-1.5">
                                <label htmlFor="group-description" className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-600/70 dark:text-white/35">
                                    Notes (Français)
                                </label>
                                <textarea
                                    id="group-description"
                                    value={descriptionFr}
                                    onChange={(e) => setDescriptionFr(e.target.value)}
                                    placeholder="Rappel ou intention pour cette collection..."
                                    rows={1}
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
                                            <label htmlFor="group-description-en" className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-600/70 dark:text-white/35 pl-1">
                                                Name (English)
                                            </label>
                                            <textarea
                                                id="group-description-en"
                                                value={descriptionEn}
                                                onChange={(e) => setDescriptionEn(e.target.value)}
                                                placeholder="Reminder or intention..."
                                                rows={1}
                                                className="w-full px-4 py-3 bg-white dark:bg-white/[0.07] border border-slate-300 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none focus:border-slate-400 dark:focus:border-white/25 font-medium resize-none transition-all shadow-sm dark:shadow-none"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Header étapes */}
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-600/70 dark:text-white/35">
                                    Étapes
                                </span>
                                <span
                                    className="text-[10px] font-black px-2.5 py-0.5 rounded-full"
                                    style={{ backgroundColor: beadColor + "20", color: beadColor }}
                                >
                                    {selectedInvocations.length}
                                </span>
                            </div>
                        </div>

                        {/* Liste d'étapes — scrollable si besoin */}
                        <div
                            ref={scrollContainerRef}
                            className="flex-1 min-h-0 overflow-y-auto px-5 pt-2 scrollbar-hide"
                        >
                            <div className="space-y-2 pb-2">
                                <AnimatePresence mode="popLayout">
                                    {selectedInvocations.map((sel, index) => {
                                        const inv = getInvocationById(sel.invocationId);
                                        if (!inv) return null;
                                        return (
                                            <motion.div
                                                key={`${sel.invocationId}-${index}`}
                                                layout
                                                initial={{ opacity: 0, x: -12 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 12 }}
                                                className="flex items-center gap-3 p-3 bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.07] rounded-2xl shadow-sm dark:shadow-none"
                                            >
                                                <GripVertical size={13} className="text-white/20 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{resolve(inv.name)}</p>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <input
                                                        type="text" inputMode="numeric" pattern="[0-9]*"
                                                        value={sel.repetitions}
                                                        onChange={(e) => handleUpdateRepetitions(index, Number.parseInt(e.target.value.replaceAll(/\D/g, "")) || 1)}
                                                        className="w-11 h-9 bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-xs font-black text-center focus:outline-none"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveInvocation(index)}
                                                        className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400/50 active:text-rose-400"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>

                                {selectedInvocations.length === 0 && (
                                    <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-white/[0.07] rounded-2xl">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/20">Aucune étape</p>
                                        <p className="text-[10px] text-slate-500 dark:text-white/15 mt-0.5">Ajoutez une invocation ci-dessous</p>
                                    </div>
                                )}
                                {errors.invocations && <p className="text-[11px] font-bold text-rose-400 px-1">{errors.invocations}</p>}
                            </div>
                        </div>

                        {/* Footer sticky — ajouter étape + valider */}
                        <div className="px-5 pt-3 flex flex-col gap-3 shrink-0 border-t border-slate-200 dark:border-white/[0.06]">
                            {/* Ajouter une étape */}
                            {availableInvocations.length > 0 ? (
                                <div className="relative">
                                    <select
                                        onChange={(e) => {
                                            if (e.target.value) { handleAddInvocation(e.target.value); e.target.value = ""; }
                                        }}
                                        className="w-full appearance-none px-4 py-3 bg-white dark:bg-white/[0.04] border-2 border-dashed border-slate-300 dark:border-white/[0.12] rounded-2xl text-slate-900/40 dark:text-white/40 text-xs font-black focus:outline-none cursor-pointer hover:bg-white/80 transition-all"
                                    >
                                        <option value="">+ AJOUTER UNE ÉTAPE</option>
                                        {availableInvocations.map((inv) => (
                                            <option key={inv.id} value={inv.id} className="bg-white dark:bg-[#1c1c1e] text-slate-900 dark:text-white">
                                                {resolve(inv.name)}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-white/20">
                                        <Plus size={13} />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-3 border-2 border-dashed border-slate-200 dark:border-white/[0.07] rounded-2xl">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/20">Toutes les étapes ajoutées</p>
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="button"
                                onClick={handleSubmit as unknown as React.MouseEventHandler}
                                style={{ backgroundColor: beadColor, boxShadow: `0 6px 20px -6px ${beadColor}90` }}
                                className="w-full py-[14px] rounded-2xl text-white font-black text-[11px] tracking-widest active:scale-95 transition-transform flex items-center justify-center gap-2"
                            >
                                <Check size={15} strokeWidth={4} />
                                {isEditing ? "ENREGISTRER" : "CRÉER LA COLLECTION"}
                            </button>
                        </div>

                        {/* Handle bas */}
                        <div className="flex justify-center py-3 shrink-0">
                            <div className="w-9 h-1 rounded-full bg-slate-200 dark:bg-white/15" />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
