"use client";

import { motion } from "framer-motion";
import { Search, Sparkles, Moon, BookOpen, Clock, Plus, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePrayerStore } from "@/lib/store/prayerStore";
import { CreatePrayerModal } from "@/components/library/CreatePrayerModal";

const defaultPrayers = {
    Chapelet: [
        { id: "tasbih-33", title: "Tasbih 33 perles", subtitle: "Subḥān Allāh • Alḥamdu lillāh • Allāhu akbar", icon: Sparkles, href: "/session?preset=tasbih-33", goal: 33 },
        { id: "tasbih-99", title: "Tasbih 99 perles", subtitle: "Les 99 noms d'Allah", icon: Sparkles, href: "/session?preset=tasbih-99", goal: 99 },
    ],
    Douha: [
        { id: "morning", title: "Invocations du matin", subtitle: "Adhkār aṣ-ṣabāḥ", icon: Moon, href: "/session?preset=morning-adhkar", goal: 10 },
        { id: "evening", title: "Invocations du soir", subtitle: "Adhkār al-masā'", icon: Moon, href: "/session?preset=evening-adhkar", goal: 10 },
    ],
    Tasbih: [
        { id: "custom", title: "Dhikr personnalisé", subtitle: "Créez votre propre session", icon: BookOpen, href: "/session?preset=custom-dhikr", goal: 33 },
    ]
};

export default function Library() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { customPrayers, deletePrayer } = usePrayerStore();

    const handleDelete = (id: string) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette prière ?")) {
            deletePrayer(id);
        }
    };

    // Merge default and custom prayers by category
    const getCategoryPrayers = (category: keyof typeof defaultPrayers) => {
        const defaults = defaultPrayers[category] || [];
        const customs = customPrayers.filter(p => p.category === category).map(p => ({
            id: p.id,
            title: p.name,
            subtitle: `${p.goal} répétitions`,
            icon: Sparkles,
            href: `/session?preset=${p.id}`,
            goal: p.goal,
            isCustom: true,
        }));
        return [...defaults, ...customs];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-y-auto overflow-x-hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="max-w-4xl mx-auto px-6 py-8 pb-32 space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <h1 className="text-3xl font-light">Bibliothèque</h1>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher une prière..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-white/20 transition-colors"
                        />
                    </div>
                </motion.div>

                {/* Categories */}
                <div className="space-y-6">
                    {(Object.keys(defaultPrayers) as Array<keyof typeof defaultPrayers>).map((category, categoryIndex) => {
                        const prayers = getCategoryPrayers(category);

                        return (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: categoryIndex * 0.1 }}
                                className="space-y-3"
                            >
                                <h2 className="text-lg font-light text-slate-300">{category}</h2>

                                <div className="space-y-3">
                                    {prayers.map((item) => {
                                        const Icon = item.icon;
                                        const isCustom = 'isCustom' in item && item.isCustom;

                                        return (
                                            <div key={item.id} className="relative group">
                                                <Link href={item.href}>
                                                    <motion.div
                                                        whileHover={{ x: 4 }}
                                                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                                                                <Icon size={20} className="text-rose-400" />
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <h3 className="text-sm font-medium text-white group-hover:text-rose-400 transition-colors">
                                                                        {item.title}
                                                                    </h3>
                                                                    {isCustom && (
                                                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                                                            Custom
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-slate-400 truncate">
                                                                    {item.subtitle}
                                                                </p>
                                                            </div>

                                                            <div className="text-slate-500 group-hover:text-slate-400 transition-colors">
                                                                →
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </Link>

                                                {/* Custom Prayer Actions */}
                                                {isCustom && (
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleDelete(item.id);
                                                            }}
                                                            className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors"
                                                            aria-label="Supprimer"
                                                        >
                                                            <Trash2 size={14} className="text-red-400" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* History Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3 pt-4"
                >
                    <h2 className="text-lg font-light text-slate-300">Historique récent</h2>

                    <div className="space-y-2">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 flex items-center gap-3">
                            <Clock size={16} className="text-slate-400" />
                            <div className="flex-1">
                                <div className="text-sm text-white">Chapelet 33</div>
                                <div className="text-xs text-slate-500">Il y a 2 heures</div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 flex items-center gap-3">
                            <Clock size={16} className="text-slate-400" />
                            <div className="flex-1">
                                <div className="text-sm text-white">Douha du matin</div>
                                <div className="text-xs text-slate-500">Hier</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Floating Add Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsCreateModalOpen(true)}
                className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-rose-500 hover:bg-rose-600 shadow-2xl flex items-center justify-center text-white transition-colors z-40"
                aria-label="Ajouter une prière"
            >
                <Plus size={24} />
            </motion.button>

            {/* Create Prayer Modal */}
            <CreatePrayerModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}
