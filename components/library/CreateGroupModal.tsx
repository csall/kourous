"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, GripVertical } from "lucide-react";
import { useInvocationStore } from "@/lib/store/invocationStore";

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
    const { addGroup, invocations } = useInvocationStore();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedInvocations, setSelectedInvocations] = useState<Array<{
        invocationId: string;
        repetitions: number;
    }>>([]);
    const [errors, setErrors] = useState<{ name?: string; invocations?: string }>({});

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

        // Validation
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

        // Create group
        addGroup({
            name: name.trim(),
            description: description.trim() || undefined,
            invocations: selectedInvocations,
        });

        // Reset and close
        setName("");
        setDescription("");
        setSelectedInvocations([]);
        setErrors({});
        onClose();
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

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-light text-white">Nouveau groupe</h2>
                            <button
                                onClick={handleClose}
                                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                            >
                                <X size={18} className="text-white/70" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-sm text-slate-300">Nom du groupe</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ex: Tasbih du matin"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500/50 transition-colors"
                                />
                                {errors.name && (
                                    <p className="text-xs text-rose-400">{errors.name}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-sm text-slate-300">Description (optionnel)</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Ex: Invocations recommandées après Fajr"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500/50 transition-colors"
                                />
                            </div>

                            {/* Selected Invocations */}
                            <div className="space-y-2">
                                <label className="text-sm text-slate-300">Invocations</label>

                                {selectedInvocations.length > 0 && (
                                    <div className="space-y-2 mb-3">
                                        {selectedInvocations.map((sel, index) => {
                                            const invocation = invocations.find(inv => inv.id === sel.invocationId);
                                            if (!invocation) return null;

                                            return (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl"
                                                >
                                                    <GripVertical size={16} className="text-slate-500" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-white truncate">{invocation.name}</p>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        value={sel.repetitions}
                                                        onChange={(e) => handleUpdateRepetitions(index, parseInt(e.target.value) || 1)}
                                                        className="w-16 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm text-center focus:outline-none focus:border-rose-500/50"
                                                        min="1"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveInvocation(index)}
                                                        className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors"
                                                    >
                                                        <Trash2 size={14} className="text-red-400" />
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
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-rose-500/50 transition-colors"
                                    >
                                        <option value="" className="bg-slate-900">+ Ajouter une invocation</option>
                                        {availableInvocations.map((inv) => (
                                            <option key={inv.id} value={inv.id} className="bg-slate-900">
                                                {inv.name} ({inv.repetitions}×)
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className="text-sm text-slate-500 text-center py-3">
                                        {invocations.length === 0
                                            ? "Créez d'abord des invocations individuelles"
                                            : "Toutes les invocations ont été ajoutées"
                                        }
                                    </p>
                                )}

                                {errors.invocations && (
                                    <p className="text-xs text-rose-400">{errors.invocations}</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition-all active:scale-95"
                                >
                                    Créer
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
