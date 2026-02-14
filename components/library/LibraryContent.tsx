"use client";

import { motion } from "framer-motion";
import { Search, Sparkles, BookOpen, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useInvocationStore } from "@/lib/store/invocationStore";
import { CreateInvocationModal } from "@/components/library/CreateInvocationModal";
import { CreateGroupModal } from "@/components/library/CreateGroupModal";

interface LibraryContentProps {
    onSessionStart?: () => void;
}

export function LibraryContent({ onSessionStart }: LibraryContentProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"invocations" | "groups">("invocations");
    const [isCreateInvocationModalOpen, setIsCreateInvocationModalOpen] = useState(false);
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

    const { invocations, groups, deleteInvocation, deleteGroup } = useInvocationStore();

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
        <div className="max-w-4xl mx-auto px-6 py-8 pb-32 space-y-6">
            {/* Header Controls */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 sm:flex sm:justify-end">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsCreateInvocationModalOpen(true)}
                        className="group relative overflow-hidden flex items-center justify-center gap-2 px-5 py-3.5 sm:py-2.5 rounded-full bg-gradient-to-br from-slate-700/90 via-slate-700/90 to-slate-800/90 backdrop-blur-xl hover:from-slate-600 hover:via-slate-600 hover:to-slate-700 text-white text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-black/25 border border-white/10"
                    >
                        <Plus size={18} className="relative z-10" strokeWidth={2.5} />
                        <span className="relative z-10">Invocation</span>
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsCreateGroupModalOpen(true)}
                        className="group relative overflow-hidden flex items-center justify-center gap-2 px-5 py-3.5 sm:py-2.5 rounded-full bg-gradient-to-br from-slate-700/90 via-slate-700/90 to-slate-800/90 backdrop-blur-xl hover:from-slate-600 hover:via-slate-600 hover:to-slate-700 text-white text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-black/25 border border-white/10"
                    >
                        <Plus size={18} className="relative z-10" strokeWidth={2.5} />
                        <span className="relative z-10">Groupe</span>
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
                                <p className="text-slate-400">Aucun groupe trouvé</p>
                            </div>
                        ) : (
                            filteredGroups.map((group, index) => (
                                <Link key={group.id} href={`/session?group=${group.id}`} onClick={onSessionStart}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer mb-3"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                                                <Sparkles size={20} className="text-rose-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-medium text-white">{group.name}</h3>
                                                <p className="text-xs text-slate-400 truncate">{group.description || "Groupe personnalisé"}</p>
                                            </div>
                                            <button
                                                onClick={(e) => { e.preventDefault(); handleDeleteGroup(group.id); }}
                                                className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))
                        )}
                    </>
                )}

                {activeTab === "invocations" && (
                    <>
                        {filteredInvocations.length === 0 ? (
                            <div className="text-center py-12">
                                <BookOpen size={48} className="mx-auto text-slate-600 mb-4" />
                                <p className="text-slate-400">Aucune invocation trouvée</p>
                            </div>
                        ) : (
                            filteredInvocations.map((invocation, index) => (
                                <Link key={invocation.id} href={`/session?invocation=${invocation.id}`} onClick={onSessionStart}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer mb-3"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                                                <BookOpen size={18} className="text-rose-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-sm font-medium text-white">{invocation.name}</h3>
                                                <p className="text-xs text-slate-500">{invocation.repetitions} répétitions</p>
                                            </div>
                                            <button
                                                onClick={(e) => { e.preventDefault(); handleDeleteInvocation(invocation.id); }}
                                                className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))
                        )}
                    </>
                )}
            </div>

            <CreateInvocationModal isOpen={isCreateInvocationModalOpen} onClose={() => setIsCreateInvocationModalOpen(false)} />
            <CreateGroupModal isOpen={isCreateGroupModalOpen} onClose={() => setIsCreateGroupModalOpen(false)} />
        </div>
    );
}
