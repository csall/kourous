"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Hash } from "lucide-react";
import { useInvocationStore } from "@/lib/store/invocationStore";

interface CreateInvocationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const quickRepetitions = [33, 99, 100];

export function CreateInvocationModal({ isOpen, onClose }: CreateInvocationModalProps) {
    const { addInvocation } = useInvocationStore();
    const [name, setName] = useState("");
    const [repetitions, setRepetitions] = useState<number>(33);
    const [customRepetitions, setCustomRepetitions] = useState("");
    const [errors, setErrors] = useState<{ name?: string; repetitions?: string }>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const newErrors: { name?: string; repetitions?: string } = {};
        if (!name.trim()) {
            newErrors.name = "Le nom est requis";
        }
        const finalRepetitions = customRepetitions ? parseInt(customRepetitions) : repetitions;
        if (!finalRepetitions || finalRepetitions < 1) {
            newErrors.repetitions = "Le nombre doit être supérieur à 0";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Create invocation
        addInvocation({
            name: name.trim(),
            repetitions: finalRepetitions,
        });

        // Reset and close
        setName("");
        setRepetitions(33);
        setCustomRepetitions("");
        setErrors({});
        onClose();
    };

    const handleClose = () => {
        setName("");
        setRepetitions(33);
        setCustomRepetitions("");
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
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-0 sm:p-4"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-gradient-to-b from-slate-900 to-slate-950 backdrop-blur-xl border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-semibold text-white">Nouvelle invocation</h2>
                                <p className="text-sm text-slate-400 mt-1">Ajoutez une invocation à votre bibliothèque</p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 flex items-center justify-center transition-all"
                            >
                                <X size={20} className="text-white/70" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-300">Nom de l'invocation</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ex: Subḥān Allāh"
                                    autoFocus
                                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all text-base"
                                />
                                {errors.name && (
                                    <p className="text-xs text-rose-400 flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-rose-400" />
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Repetitions */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <Hash size={16} />
                                    Nombre de répétitions
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {quickRepetitions.map((quickRep) => (
                                        <button
                                            key={quickRep}
                                            type="button"
                                            onClick={() => {
                                                setRepetitions(quickRep);
                                                setCustomRepetitions("");
                                            }}
                                            className={`px-4 py-4 rounded-2xl border-2 transition-all font-semibold text-base active:scale-95 ${repetitions === quickRep && !customRepetitions
                                                    ? "bg-white/10 border-white/30 text-white shadow-lg"
                                                    : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/10"
                                                }`}
                                        >
                                            {quickRep}×
                                        </button>
                                    ))}
                                    <input
                                        type="number"
                                        value={customRepetitions}
                                        onChange={(e) => setCustomRepetitions(e.target.value)}
                                        placeholder="Personnalisé"
                                        className={`px-4 py-4 bg-white/5 border-2 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none transition-all min-w-0 text-center font-semibold text-base ${customRepetitions
                                                ? "border-white/30 bg-white/10"
                                                : "border-white/10 focus:border-white/30 focus:bg-white/10"
                                            }`}
                                    />
                                </div>
                                {errors.repetitions && (
                                    <p className="text-xs text-rose-400 flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-rose-400" />
                                        {errors.repetitions}
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-6 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-semibold transition-all active:scale-95 border border-white/10"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-4 rounded-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-semibold transition-all active:scale-95 shadow-lg shadow-black/30"
                                >
                                    Créer l'invocation
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
