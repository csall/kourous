"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { usePrayerStore } from "@/lib/store/prayerStore";

interface CreatePrayerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const categories = ["Chapelet", "Douha", "Tasbih"] as const;
const quickGoals = [33, 99];

export function CreatePrayerModal({ isOpen, onClose }: CreatePrayerModalProps) {
    const { addPrayer } = usePrayerStore();
    const [name, setName] = useState("");
    const [goal, setGoal] = useState<number>(33);
    const [customGoal, setCustomGoal] = useState("");
    const [category, setCategory] = useState<typeof categories[number]>("Chapelet");
    const [errors, setErrors] = useState<{ name?: string; goal?: string }>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const newErrors: { name?: string; goal?: string } = {};
        if (!name.trim()) {
            newErrors.name = "Le nom est requis";
        }
        const finalGoal = customGoal ? parseInt(customGoal) : goal;
        if (!finalGoal || finalGoal < 1) {
            newErrors.goal = "L'objectif doit être supérieur à 0";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Create prayer
        addPrayer({
            name: name.trim(),
            goal: finalGoal,
            category,
        });

        // Reset and close
        setName("");
        setGoal(33);
        setCustomGoal("");
        setCategory("Chapelet");
        setErrors({});
        onClose();
    };

    const handleClose = () => {
        setName("");
        setGoal(33);
        setCustomGoal("");
        setCategory("Chapelet");
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
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-light text-white">Nouvelle prière</h2>
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
                                <label className="text-sm text-slate-300">Nom</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ex: Subḥān Allāh"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500/50 transition-colors"
                                />
                                {errors.name && (
                                    <p className="text-xs text-rose-400">{errors.name}</p>
                                )}
                            </div>

                            {/* Goal */}
                            <div className="space-y-2">
                                <label className="text-sm text-slate-300">Objectif (nombre)</label>
                                <div className="flex gap-2">
                                    {quickGoals.map((quickGoal) => (
                                        <button
                                            key={quickGoal}
                                            type="button"
                                            onClick={() => {
                                                setGoal(quickGoal);
                                                setCustomGoal("");
                                            }}
                                            className={`flex-1 px-4 py-3 rounded-xl border transition-all ${goal === quickGoal && !customGoal
                                                    ? "bg-rose-500/20 border-rose-500/50 text-white"
                                                    : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                                                }`}
                                        >
                                            {quickGoal}
                                        </button>
                                    ))}
                                    <input
                                        type="number"
                                        value={customGoal}
                                        onChange={(e) => setCustomGoal(e.target.value)}
                                        placeholder="Autre"
                                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500/50 transition-colors"
                                    />
                                </div>
                                {errors.goal && (
                                    <p className="text-xs text-rose-400">{errors.goal}</p>
                                )}
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="text-sm text-slate-300">Catégorie</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as typeof categories[number])}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-rose-500/50 transition-colors"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat} className="bg-slate-900">
                                            {cat}
                                        </option>
                                    ))}
                                </select>
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
