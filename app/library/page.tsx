"use client";

import { motion } from "framer-motion";
import { Search, Sparkles, BookOpen, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useInvocationStore } from "@/lib/store/invocationStore";
import { CreateInvocationModal } from "@/components/library/CreateInvocationModal";
import { CreateGroupModal } from "@/components/library/CreateGroupModal";

export default function Library() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"invocations" | "groups">("invocations");
    const [isCreateInvocationModalOpen, setIsCreateInvocationModalOpen] = useState(false);
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

    const { invocations, groups, deleteInvocation, deleteGroup, getInvocationById } = useInvocationStore();

    const handleDeleteInvocation = (id: string) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette invocation ?")) {
            deleteInvocation(id);
        }
    };

    const handleDeleteGroup = (id: string) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce groupe ?")) {
            deleteGroup(id);
        }
    };



    const filteredInvocations = invocations.filter(inv =>
        inv.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredGroups = groups.filter(grp =>
        grp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grp.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-y-auto overflow-x-hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="max-w-4xl mx-auto px-6 py-8 pb-32 space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    {/* Title */}
                    <h1 className="text-3xl font-light">Bibliothèque</h1>

                    {/* Action Buttons - Mobile optimized */}
                    <div className="grid grid-cols-2 gap-3 sm:flex sm:justify-end">
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsCreateInvocationModalOpen(true)}
                            className="group relative overflow-hidden flex items-center justify-center gap-2 px-5 py-3.5 sm:py-2.5 rounded-full bg-gradient-to-br from-slate-700/90 via-slate-700/90 to-slate-800/90 backdrop-blur-xl hover:from-slate-600 hover:via-slate-600 hover:to-slate-700 text-white text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-black/25 hover:shadow-2xl hover:shadow-black/40 border border-white/10"
                            aria-label="Ajouter une invocation"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/5 to-white/20" />
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <Plus size={18} className="relative z-10 drop-shadow-sm" strokeWidth={2.5} />
                            <span className="relative z-10 drop-shadow-sm">Invocation</span>
                        </motion.button>

                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsCreateGroupModalOpen(true)}
                            className="group relative overflow-hidden flex items-center justify-center gap-2 px-5 py-3.5 sm:py-2.5 rounded-full bg-gradient-to-br from-slate-700/90 via-slate-700/90 to-slate-800/90 backdrop-blur-xl hover:from-slate-600 hover:via-slate-600 hover:to-slate-700 text-white text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-black/25 hover:shadow-2xl hover:shadow-black/40 border border-white/10"
                            aria-label="Ajouter un groupe"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/5 to-white/20" />
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <Plus size={18} className="relative z-10 drop-shadow-sm" strokeWidth={2.5} />
                            <span className="relative z-10 drop-shadow-sm">Groupe</span>
                        </motion.button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-white/20 transition-colors"
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                        <button
                            onClick={() => setActiveTab("invocations")}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "invocations"
                                ? "bg-rose-500 text-white"
                                : "text-slate-400 hover:text-white"
                                }`}
                        >
                            Invocations ({invocations.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("groups")}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "groups"
                                ? "bg-rose-500 text-white"
                                : "text-slate-400 hover:text-white"
                                }`}
                        >
                            Groupes ({groups.length})
                        </button>
                    </div>
                </motion.div>

                {/* Content */}
                <div className="space-y-3">
                    {activeTab === "groups" && (
                        <>
                            {filteredGroups.length === 0 ? (
                                <div className="text-center py-12">
                                    <BookOpen size={48} className="mx-auto text-slate-600 mb-4" />
                                    <p className="text-slate-400">
                                        {searchQuery ? "Aucun groupe trouvé" : "Aucun groupe créé"}
                                    </p>
                                    {!searchQuery && (
                                        <button
                                            onClick={() => setIsCreateGroupModalOpen(true)}
                                            className="mt-4 px-6 py-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition-all"
                                        >
                                            Créer un groupe
                                        </button>
                                    )}
                                </div>
                            ) : (
                                filteredGroups.map((group, index) => {
                                    const totalRepetitions = group.invocations.reduce((sum, inv) => sum + inv.repetitions, 0);

                                    return (
                                        <motion.div
                                            key={group.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="relative group"
                                        >
                                            <Link href={`/session?group=${group.id}`}>
                                                <motion.div
                                                    whileHover={{ x: 4 }}
                                                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                                                            <Sparkles size={20} className="text-rose-400" />
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-sm font-medium text-white group-hover:text-rose-400 transition-colors">
                                                                {group.name}
                                                            </h3>
                                                            <p className="text-xs text-slate-400 truncate">
                                                                {group.description || `${group.invocations.length} invocations • ${totalRepetitions} répétitions`}
                                                            </p>
                                                        </div>

                                                        {/* Delete Button - Shown on hover */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleDeleteGroup(group.id);
                                                            }}
                                                            className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                                            aria-label="Supprimer"
                                                        >
                                                            <Trash2 size={14} className="text-red-400" />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            </Link>
                                        </motion.div>
                                    );
                                })
                            )}
                        </>
                    )}

                    {activeTab === "invocations" && (
                        <>
                            {filteredInvocations.length === 0 ? (
                                <div className="text-center py-12">
                                    <BookOpen size={48} className="mx-auto text-slate-600 mb-4" />
                                    <p className="text-slate-400">
                                        {searchQuery ? "Aucune invocation trouvée" : "Aucune invocation créée"}
                                    </p>
                                    {!searchQuery && (
                                        <button
                                            onClick={() => setIsCreateInvocationModalOpen(true)}
                                            className="mt-4 px-6 py-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition-all"
                                        >
                                            Créer une invocation
                                        </button>
                                    )}
                                </div>
                            ) : (
                                filteredInvocations.map((invocation, index) => (
                                    <motion.div
                                        key={invocation.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="relative group"
                                    >
                                        <Link href={`/session?invocation=${invocation.id}`}>
                                            <motion.div
                                                whileHover={{ x: 4 }}
                                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                                                        <BookOpen size={18} className="text-rose-400" />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-sm font-medium text-white group-hover:text-rose-400 transition-colors">
                                                            {invocation.name}
                                                        </h3>
                                                        <p className="text-xs text-slate-500 mt-2">
                                                            {invocation.repetitions} répétitions
                                                        </p>
                                                    </div>

                                                    {/* Delete Button - Shown on hover */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleDeleteInvocation(invocation.id);
                                                        }}
                                                        className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                                        aria-label="Supprimer"
                                                    >
                                                        <Trash2 size={14} className="text-red-400" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    </motion.div>
                                ))
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Modals */}
            <CreateInvocationModal
                isOpen={isCreateInvocationModalOpen}
                onClose={() => setIsCreateInvocationModalOpen(false)}
            />
            <CreateGroupModal
                isOpen={isCreateGroupModalOpen}
                onClose={() => setIsCreateGroupModalOpen(false)}
            />
        </div>
    );
}
