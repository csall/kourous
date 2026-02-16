"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, GripVertical, Sparkles, Plus, Check } from "lucide-react";
import { useInvocationStore, type InvocationGroup } from "@/lib/store/invocationStore";
import { useSessionStore } from "@/lib/store/sessionStore";

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    editGroup?: InvocationGroup | null;
}

export function CreateGroupModal({ isOpen, onClose, editGroup }: CreateGroupModalProps) {
    const { addGroup, updateGroup, invocations, getInvocationById } = useInvocationStore();
    const beadColor = useSessionStore((s) => s.beadColor);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedInvocations, setSelectedInvocations] = useState<Array<{
        invocationId: string;
        repetitions: number;
    }>>([]);
    const [errors, setErrors] = useState<{ name?: string; invocations?: string }>({});

    // Populate form when editing
    useEffect(() => {
        if (editGroup) {
            setName(editGroup.name);
            setDescription(editGroup.description || "");
            setSelectedInvocations([...editGroup.invocations]);
        } else {
            setName("");
            setDescription("");
            setSelectedInvocations([]);
        }
        setErrors({});
    }, [editGroup, isOpen]);

    const handleAddInvocation = (invocationId: string) => {
        const invocation = getInvocationById(invocationId);
        if (!invocation) return;

        setSelectedInvocations([
            ...selectedInvocations,
            {
                invocationId,
                repetitions: invocation.repetitions,
            },
        ]);
    };

    const handleRemoveInvocation = (index: number) => {
        setSelectedInvocations(selectedInvocations.filter((_, i) => i !== index));
    };

    const handleUpdateRepetitions = (index: number, repetitions: number) => {
        setSelectedInvocations(
            selectedInvocations.map((inv, i) =>
                i === index ? { ...inv, repetitions } : inv
            )
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: { name?: string; invocations?: string } = {};
        if (!name.trim()) {
            newErrors.name = "Donnez un nom à votre collection";
        }
        if (selectedInvocations.length === 0) {
            newErrors.invocations = "Ajoutez au moins une étape";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (editGroup) {
            updateGroup(editGroup.id, {
                name: name.trim(),
                description: description.trim() || undefined,
                invocations: selectedInvocations,
            });
        } else {
            addGroup({
                name: name.trim(),
                description: description.trim() || undefined,
                invocations: selectedInvocations,
            });
        }

        handleClose();
    };

    const handleClose = () => {
        setName("");
        setDescription("");
        setSelectedInvocations([]);
        setErrors({});
        onClose();
    };

    const availableInvocations = invocations.filter(
        inv => !selectedInvocations.some(sel => sel.invocationId === inv.id)
    );

    const isEditing = !!editGroup;

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
                        className="relative overflow-hidden bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 sm:p-10 max-w-lg w-full shadow-2xl flex flex-col max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Decoration */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20" />
                        <div className="absolute -top-24 -right-24 w-64 h-64 blur-[100px] rounded-full pointer-events-none opacity-20" style={{ backgroundColor: beadColor }} />

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div>
                                <div className="flex items-center gap-2 mb-2" style={{ color: beadColor }}>
                                    <Sparkles size={14} className="animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.25em]">{isEditing ? "Édition" : "Création"}</span>
                                </div>
                                <h2 className="text-3xl font-black tracking-tight text-white leading-tight">Collection</h2>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10 flex-1 flex flex-col min-h-0 overflow-y-auto pr-1 -mr-1 scrollbar-hide">
                            {/* Name Input */}
                            <div className="space-y-3 shrink-0">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Nom de la collection</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ex: Rituel du Matin"
                                    className="w-full px-6 py-4.5 bg-white/[0.03] border border-white/10 rounded-2xl text-white text-lg placeholder:text-slate-700 focus:outline-none focus:border-white/20 transition-all font-bold"
                                />
                                {errors.name && (
                                    <p className="text-[11px] font-bold text-rose-500 px-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Sequence List */}
                            <div className="space-y-4 flex-1 flex flex-col min-h-0">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Séquence d'étapes</label>
                                    <span className="text-[10px] font-bold text-slate-600 bg-white/5 px-3 py-1 rounded-full">{selectedInvocations.length} étape{selectedInvocations.length > 1 ? 's' : ''}</span>
                                </div>

                                <div className="space-y-2.5 overflow-y-auto px-1 -mx-1 scrollbar-hide py-1 flex-1">
                                    <AnimatePresence mode="popLayout">
                                        {selectedInvocations.map((sel, index) => {
                                            const invocation = getInvocationById(sel.invocationId);
                                            if (!invocation) return null;

                                            return (
                                                <motion.div
                                                    key={`${sel.invocationId}-${index}`}
                                                    layout
                                                    className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/5 rounded-2xl group transition-all"
                                                >
                                                    <GripVertical size={16} className="text-slate-700 shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-white truncate">{invocation.name}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="number"
                                                            value={sel.repetitions}
                                                            onChange={(e) => handleUpdateRepetitions(index, parseInt(e.target.value) || 1)}
                                                            className="w-14 h-10 bg-white/5 border border-white/5 rounded-xl text-white text-[13px] font-black text-center focus:outline-none focus:border-white/20"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveInvocation(index)}
                                                            className="w-10 h-10 rounded-xl bg-rose-500/5 flex items-center justify-center text-rose-500/60 hover:text-rose-500 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>

                                    {/* Add Step Dropdown */}
                                    {availableInvocations.length > 0 ? (
                                        <div className="relative pt-2">
                                            <select
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        handleAddInvocation(e.target.value);
                                                        e.target.value = "";
                                                    }
                                                }}
                                                className="w-full appearance-none px-6 py-4 bg-white/[0.02] border-2 border-dashed border-white/10 rounded-2xl text-slate-500 text-[13px] font-black focus:outline-none transition-all cursor-pointer hover:border-white/20 hover:text-slate-400"
                                            >
                                                <option value="">+ AJOUTER UNE ÉTAPE</option>
                                                {availableInvocations.map((inv) => (
                                                    <option key={inv.id} value={inv.id} className="bg-slate-900 text-white">
                                                        {inv.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                                                <Plus size={16} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 border-2 border-dashed border-white/5 rounded-2xl">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Toutes les étapes ont été ajoutées</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                style={{
                                    backgroundColor: beadColor,
                                    boxShadow: `0 10px 30px -10px ${beadColor}80`
                                }}
                                className="w-full py-5 rounded-[1.5rem] text-white font-black text-sm tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0"
                            >
                                <Check size={18} strokeWidth={4} />
                                {isEditing ? "ENREGISTRER LA COLLECTION" : "CRÉER LA COLLECTION"}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
