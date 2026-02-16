"use client";

import { motion } from "framer-motion";
import { Search, Sparkles, BookOpen, Trash2, Plus, ChevronDown, Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useInvocationStore, type InvocationGroup } from "@/lib/store/invocationStore";
import { CreateInvocationModal } from "@/components/library/CreateInvocationModal";
import { CreateGroupModal } from "@/components/library/CreateGroupModal";
import { prayerPresets } from "@/lib/data/prayerPresets";
import { useSessionStore } from "@/lib/store/sessionStore";

interface LibraryContentProps {
    onSessionStart?: () => void;
}

export function LibraryContent({ onSessionStart }: LibraryContentProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"chapelets" | "invocations">("chapelets");
    const [isCreateInvocationModalOpen, setIsCreateInvocationModalOpen] = useState(false);
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<InvocationGroup | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

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

    const handleEditGroup = (group: InvocationGroup) => {
        setEditingGroup(group);
        setIsCreateGroupModalOpen(true);
    };

    const handleCloseGroupModal = () => {
        setIsCreateGroupModalOpen(false);
        setEditingGroup(null);
    };

    const filteredInvocations = invocations.filter(inv =>
        inv.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredGroups = groups.filter(grp =>
        grp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grp.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredPresets = prayerPresets.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const stagger = {
        container: { hidden: {}, show: { transition: { staggerChildren: 0.05 } } },
        item: {
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } },
        },
    };

    return (
        <>
            {/* BG GLOW */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/6 blur-[140px] rounded-full" />
                <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>

            <motion.div
                className="relative z-10 max-w-md mx-auto px-5 pt-4 pb-32"
                variants={stagger.container}
                initial="hidden"
                animate="show"
            >
                {/* HEADER */}
                <motion.div variants={stagger.item} className="mb-6">
                    <h1 className="text-lg font-light text-slate-300">Bibliothèque</h1>
                    <p className="text-xs text-slate-600 mt-0.5">Vos chapelets & invocations</p>
                </motion.div>

                {/* ACTION BUTTONS */}
                <motion.div variants={stagger.item} className="grid grid-cols-2 gap-3 mb-5">
                    <button
                        onClick={() => setIsCreateInvocationModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold active:scale-[0.97] transition-all"
                    >
                        <Plus size={16} strokeWidth={2.5} />
                        Invocation
                    </button>
                    <button
                        onClick={() => { setEditingGroup(null); setIsCreateGroupModalOpen(true); }}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold active:scale-[0.97] transition-all"
                    >
                        <Plus size={16} strokeWidth={2.5} />
                        Groupe
                    </button>
                </motion.div>

                {/* SEARCH */}
                <motion.div variants={stagger.item} className="mb-5">
                    <div className="relative">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500/30 transition-colors"
                        />
                    </div>
                </motion.div>

                {/* TABS */}
                <motion.div variants={stagger.item} className="mb-6">
                    <div className="flex gap-1 p-1 bg-white/[0.04] rounded-2xl border border-white/[0.06]">
                        {[
                            { key: "chapelets" as const, label: "Chapelets", count: prayerPresets.length + groups.length },
                            { key: "invocations" as const, label: "Invocations", count: invocations.length },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === tab.key
                                    ? "bg-blue-500 text-white shadow-[0_4px_12px_rgba(59,130,246,0.3)]"
                                    : "text-slate-500 hover:text-slate-300"
                                    }`}
                            >
                                {tab.label} ({tab.count})
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* CONTENT */}
                <div className="space-y-2">
                    {/* CHAPELETS TAB (presets + groups merged) */}
                    {activeTab === "chapelets" && (
                        <>
                            {/* Default Presets */}
                            {filteredPresets.length > 0 && (
                                <div className="space-y-2 mb-4">
                                    <p className="text-sm font-light text-slate-400 px-1">Par défaut</p>
                                    {filteredPresets.map((preset, index) => (
                                        <motion.div
                                            key={preset.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.04 }}
                                        >
                                            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                                                <div
                                                    className="flex items-center gap-4 p-4 cursor-pointer active:bg-white/[0.02] transition-all"
                                                    onClick={() => toggleExpand(preset.id)}
                                                >
                                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                                                        <div className="w-3 h-3 rounded-full bg-blue-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-bold text-white">{preset.name}</h4>
                                                        <p className="text-[11px] text-slate-500 truncate">{preset.totalBeads} perles · {preset.cycles} cycles</p>
                                                    </div>
                                                    <ChevronDown
                                                        size={16}
                                                        className={`text-slate-600 transition-transform duration-200 ${expandedId === preset.id ? "rotate-180" : ""}`}
                                                    />
                                                </div>

                                                {/* Expanded: show sequence */}
                                                {expandedId === preset.id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="border-t border-white/[0.04]"
                                                    >
                                                        <div className="px-4 py-3 space-y-2">
                                                            {preset.sequence.map((step, i) => (
                                                                <div key={i} className="flex items-center justify-between py-1.5">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                                                                        <span className="text-xs text-slate-400">{step.label}</span>
                                                                    </div>
                                                                    <span className="text-[11px] text-slate-600 font-medium">{step.repetitions}×</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="px-4 pb-3">
                                                            <Link
                                                                href="/session"
                                                                onClick={() => { useSessionStore.getState().setPreset(preset); onSessionStart?.(); }}
                                                                className="block w-full py-2.5 rounded-xl bg-blue-500/10 text-blue-400 text-xs font-bold text-center active:scale-[0.97] transition-all"
                                                            >
                                                                Commencer
                                                            </Link>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* Custom Groups */}
                            {filteredGroups.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-light text-slate-400 px-1">Mes groupes</p>
                                    {filteredGroups.map((group, index) => {
                                        const totalReps = group.invocations.reduce((sum, inv) => sum + inv.repetitions, 0);
                                        const isExpanded = expandedId === group.id;

                                        return (
                                            <motion.div
                                                key={group.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: (filteredPresets.length + index) * 0.04 }}
                                            >
                                                <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                                                    <div
                                                        className="flex items-center gap-4 p-4 cursor-pointer active:bg-white/[0.02] transition-all"
                                                        onClick={() => toggleExpand(group.id)}
                                                    >
                                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                                                            <Sparkles size={16} className="text-indigo-400" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-bold text-white">{group.name}</h4>
                                                            <p className="text-[11px] text-slate-500 truncate">{totalReps} perles · {group.invocations.length} invocations</p>
                                                        </div>
                                                        <ChevronDown
                                                            size={16}
                                                            className={`text-slate-600 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                                                        />
                                                    </div>

                                                    {/* Expanded: show invocations + actions */}
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="border-t border-white/[0.04]"
                                                        >
                                                            <div className="px-4 py-3 space-y-2">
                                                                {group.invocations.map((inv, i) => {
                                                                    const invData = getInvocationById(inv.invocationId);
                                                                    return (
                                                                        <div key={i} className="flex items-center justify-between py-1.5">
                                                                            <div className="flex items-center gap-2">
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40" />
                                                                                <span className="text-xs text-slate-400">{invData?.name || "Invocation"}</span>
                                                                            </div>
                                                                            <span className="text-[11px] text-slate-600 font-medium">{inv.repetitions}×</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                            <div className="px-4 pb-3 flex gap-2">
                                                                <Link
                                                                    href={`/session?group=${group.id}`}
                                                                    onClick={onSessionStart}
                                                                    className="flex-1 py-2.5 rounded-xl bg-blue-500/10 text-blue-400 text-xs font-bold text-center active:scale-[0.97] transition-all"
                                                                >
                                                                    Commencer
                                                                </Link>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleEditGroup(group); }}
                                                                    className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center text-slate-500 hover:text-blue-400 transition-colors"
                                                                >
                                                                    <Pencil size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleDeleteGroup(group.id); }}
                                                                    className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center text-slate-500 hover:text-red-400 transition-colors"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}

                            {filteredPresets.length === 0 && filteredGroups.length === 0 && (
                                <div className="text-center py-16">
                                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
                                        <Sparkles size={24} className="text-slate-600" />
                                    </div>
                                    <p className="text-sm text-slate-500 mb-1">Aucun résultat</p>
                                    <p className="text-xs text-slate-600">Essayez un autre terme de recherche</p>
                                </div>
                            )}
                        </>
                    )}

                    {/* INVOCATIONS TAB */}
                    {activeTab === "invocations" && (
                        <>
                            {filteredInvocations.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
                                        <BookOpen size={24} className="text-slate-600" />
                                    </div>
                                    <p className="text-sm text-slate-500 mb-1">Aucune invocation</p>
                                    <p className="text-xs text-slate-600">Créez votre première invocation personnalisée</p>
                                </div>
                            ) : (
                                filteredInvocations.map((invocation, index) => (
                                    <motion.div
                                        key={invocation.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.04 }}
                                    >
                                        <Link href={`/session?invocation=${invocation.id}`} onClick={onSessionStart}>
                                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] active:scale-[0.98] transition-all">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                                    <BookOpen size={16} className="text-emerald-400" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-bold text-white">{invocation.name}</h4>
                                                    <p className="text-[11px] text-slate-500">{invocation.repetitions} répétitions</p>
                                                </div>
                                                <button
                                                    onClick={(e) => { e.preventDefault(); handleDeleteInvocation(invocation.id); }}
                                                    className="p-2 text-slate-700 hover:text-red-400 transition-colors shrink-0"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))
                            )}
                        </>
                    )}
                </div>
            </motion.div>

            <CreateInvocationModal isOpen={isCreateInvocationModalOpen} onClose={() => setIsCreateInvocationModalOpen(false)} />
            <CreateGroupModal isOpen={isCreateGroupModalOpen} onClose={handleCloseGroupModal} editGroup={editingGroup} />
        </>
    );
}
