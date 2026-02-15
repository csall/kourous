"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, GripVertical } from "lucide-react";
import { useInvocationStore, type InvocationGroup } from "@/lib/store/invocationStore";

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    editGroup?: InvocationGroup | null;
}

export function CreateGroupModal({ isOpen, onClose, editGroup }: CreateGroupModalProps) {
    const { addGroup, updateGroup, invocations } = useInvocationStore();
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
        const invocation = invocations.find(inv => inv.id === invocationId);
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
            newErrors.name = "Le nom est requis";
        }
        if (selectedInvocations.length === 0) {
            newErrors.invocations = "Ajoutez au moins une invocation";
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
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-[#0c0f16] border border-white/[0.08] rounded-t-3xl sm:rounded-3xl p-6 w-full sm:max-w-lg shadow-2xl max-h-[85vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">{isEditing ? "Modifier le groupe" : "Nouveau groupe"}</h2>
                            <button
                                onClick={handleClose}
                                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center transition-colors"
                            >
                                <X size={16} className="text-slate-400" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Nom du groupe</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ex: Tasbih du matin"
                                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500/30 transition-colors"
                                />
                                {errors.name && (
                                    <p className="text-xs text-red-400">{errors.name}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Description (optionnel)</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Ex: Invocations recommandées après Fajr"
                                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500/30 transition-colors"
                                />
                            </div>

                            {/* Selected Invocations */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Invocations</label>

                                {selectedInvocations.length > 0 && (
                                    <div className="space-y-2 mb-3">
                                        {selectedInvocations.map((sel, index) => {
                                            const invocation = invocations.find(inv => inv.id === sel.invocationId);
                                            if (!invocation) return null;

                                            return (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-2 p-3 bg-white/[0.04] border border-white/[0.06] rounded-xl"
                                                >
                                                    <GripVertical size={14} className="text-slate-600" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-white truncate">{invocation.name}</p>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        value={sel.repetitions}
                                                        onChange={(e) => handleUpdateRepetitions(index, parseInt(e.target.value) || 1)}
                                                        className="w-16 px-2 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm text-center focus:outline-none focus:border-blue-500/30"
                                                        min="1"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveInvocation(index)}
                                                        className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                                                    >
                                                        <Trash2 size={13} className="text-red-400" />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Add Invocation Dropdown */}
                                {availableInvocations.length > 0 ? (
                                    <select
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                handleAddInvocation(e.target.value);
                                                e.target.value = "";
                                            }
                                        }}
                                        className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl text-white text-sm focus:outline-none focus:border-blue-500/30 transition-colors"
                                    >
                                        <option value="" className="bg-[#0c0f16]">+ Ajouter une invocation</option>
                                        {availableInvocations.map((inv) => (
                                            <option key={inv.id} value={inv.id} className="bg-[#0c0f16]">
                                                {inv.name} ({inv.repetitions}×)
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className="text-sm text-slate-600 text-center py-3">
                                        {invocations.length === 0
                                            ? "Créez d'abord des invocations individuelles"
                                            : "Toutes les invocations ont été ajoutées"
                                        }
                                    </p>
                                )}

                                {errors.invocations && (
                                    <p className="text-xs text-red-400">{errors.invocations}</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-3 rounded-2xl bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] transition-all text-sm font-medium"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 rounded-2xl bg-blue-500 text-white hover:bg-blue-600 transition-all active:scale-[0.97] text-sm font-bold"
                                >
                                    {isEditing ? "Enregistrer" : "Créer"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
