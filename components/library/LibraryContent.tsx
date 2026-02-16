"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, BookOpen, Trash2, Plus, ChevronDown, Pencil, Play, Star } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
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
    const [activeTab, setActiveTab] = useState<"collections" | "invocations" | "favorites">("invocations");
    const [isCreateInvocationModalOpen, setIsCreateInvocationModalOpen] = useState(false);
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<InvocationGroup | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const { invocations, groups, deleteInvocation, deleteGroup, getInvocationById, loadDefaultData, toggleFavorite, isFavorite, favoriteIds } = useInvocationStore();
    const beadColor = useSessionStore((s) => s.beadColor);

    // Load defaults if store is empty
    useEffect(() => {
        if (invocations.length === 0 && groups.length === 0) {
            loadDefaultData();
        }
    }, [invocations.length, groups.length, loadDefaultData]);

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

    const favoriteInvocations = invocations.filter(inv => isFavorite(inv.id));
    const favoriteGroups = groups.filter(grp => isFavorite(grp.id));
    const favoritePresets = prayerPresets.filter(p => isFavorite(p.id));

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleEditGroup = (group: InvocationGroup) => {
        setEditingGroup(group);
        setIsCreateGroupModalOpen(true);
    };

    const handleCloseGroupModal = () => {
        setIsCreateGroupModalOpen(false);
        setEditingGroup(null);
    };

    return (
        <div className="max-w-lg mx-auto px-5 pt-4 pb-36 space-y-6 sm:space-y-8">
            {/* Immersive Mesh Glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-slate-950/20">
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.06, 0.12, 0.06],
                        x: [20, -20, 20],
                        y: [-20, 20, -20],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[10%] -right-[15%] w-[80%] h-[60%] blur-[120px] rounded-full"
                    style={{ backgroundColor: beadColor }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <div>
                    <h2 className="text-lg font-light text-slate-300">Bibliothèque</h2>
                    <p className="text-xs text-slate-400 mt-1">Découvrez et gérez vos rituels et moments de prière.</p>
                </div>

                {/* ── TABS ─────────────────────────── */}
                <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/5">
                    {[
                        { key: "invocations" as const, label: "Invocations", count: invocations.length },
                        { key: "collections" as const, label: "Collections", count: prayerPresets.length + groups.length },
                        { key: "favorites" as const, label: "Favoris", count: favoriteIds.length },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${activeTab === tab.key
                                ? 'bg-white/10 text-white shadow-sm'
                                : 'text-slate-500'
                                }`}
                        >
                            {tab.label}
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${activeTab === tab.key ? "bg-white/20 text-white" : "bg-white/5 text-slate-600"}`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* ── SEARCH & ACTIONS ────────────────────── */}
                <div className="flex gap-3">
                    <div className="relative flex-1 group">
                        <Search
                            size={16}
                            style={{ color: searchQuery !== "" ? beadColor : undefined }}
                            className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${searchQuery !== "" ? "" : "text-slate-500"}`}
                        />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-white/10 transition-all"
                        />
                    </div>
                    <button
                        onClick={() => {
                            if (activeTab === "invocations") {
                                setIsCreateInvocationModalOpen(true);
                            } else {
                                setEditingGroup(null);
                                setIsCreateGroupModalOpen(true);
                            }
                        }}
                        style={{
                            backgroundColor: beadColor,
                            boxShadow: `0 8px 24px -6px ${beadColor}40`
                        }}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white text-[11px] font-black active:scale-95 transition-all shrink-0 relative overflow-hidden group/btn"
                    >
                        {/* Subtle Glass Shine */}
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        <Plus size={14} strokeWidth={4} className="relative z-10" />
                        <span className="relative z-10 tracking-wider">AJOUTER</span>
                    </button>
                </div>

                {/* ── CONTENT ─────────────────────── */}
                <div className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {activeTab === "invocations" ? (
                            <motion.div
                                className="space-y-6"
                            >
                                <FavoriteSection
                                    invocations={filteredInvocations}
                                    onSessionStart={onSessionStart}
                                    onDelete={deleteInvocation}
                                    onToggleFavorite={toggleFavorite}
                                    isFavorite={isFavorite}
                                    beadColor={beadColor}
                                />
                            </motion.div>
                        ) : activeTab === "collections" ? (
                            <motion.div
                                key="collections"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <CollectionSection
                                    groups={filteredGroups}
                                    presets={filteredPresets}
                                    expandedId={expandedId}
                                    onToggleExpand={toggleExpand}
                                    onSessionStart={onSessionStart}
                                    onEdit={handleEditGroup}
                                    onDelete={deleteGroup}
                                    onToggleFavorite={toggleFavorite}
                                    isFavorite={isFavorite}
                                    beadColor={beadColor}
                                    getInvocationById={getInvocationById}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="favorites"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                {favoriteIds.length > 0 ? (
                                    <div className="space-y-8">
                                        {favoriteInvocations.length > 0 && (
                                            <div className="space-y-4">
                                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 px-1">Invocations</h3>
                                                <FavoriteSection
                                                    invocations={favoriteInvocations}
                                                    onSessionStart={onSessionStart}
                                                    onDelete={deleteInvocation}
                                                    onToggleFavorite={toggleFavorite}
                                                    isFavorite={isFavorite}
                                                    beadColor={beadColor}
                                                />
                                            </div>
                                        )}
                                        {(favoriteGroups.length > 0 || favoritePresets.length > 0) && (
                                            <div className="space-y-4">
                                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 px-1">Collections</h3>
                                                <CollectionSection
                                                    groups={favoriteGroups}
                                                    presets={favoritePresets}
                                                    expandedId={expandedId}
                                                    onToggleExpand={toggleExpand}
                                                    onSessionStart={onSessionStart}
                                                    onEdit={handleEditGroup}
                                                    onDelete={deleteGroup}
                                                    onToggleFavorite={toggleFavorite}
                                                    isFavorite={isFavorite}
                                                    beadColor={beadColor}
                                                    getInvocationById={getInvocationById}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 px-6 bg-white/[0.03] border border-dashed border-white/10 rounded-[2rem]">
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 opacity-30">
                                            <Star size={24} className="text-slate-400" />
                                        </div>
                                        <p className="text-base font-bold text-white">Aucun favori</p>
                                        <p className="text-xs text-slate-500 mt-2 max-w-[200px] mx-auto leading-relaxed">Touchez l'étoile sur une invocation ou une collection pour l'ajouter ici.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            <CreateInvocationModal isOpen={isCreateInvocationModalOpen} onClose={() => setIsCreateInvocationModalOpen(false)} />
            <CreateGroupModal isOpen={isCreateGroupModalOpen} onClose={handleCloseGroupModal} editGroup={editingGroup} />
        </div>
    );
}

// ── SUB-COMPONENTS ─────────────────────────────────────────────────────────

function FavoriteSection({ invocations, onSessionStart, onDelete, onToggleFavorite, isFavorite, beadColor }: any) {
    return (
        <div className="space-y-3">
            {invocations.length > 0 ? (
                invocations.map((invocation: any) => (
                    <Link key={invocation.id} href={`/session?invocation=${invocation.id}`} onClick={onSessionStart} className="group block">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4 active:scale-[0.98] transition-all hover:bg-white/[0.08]">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-slate-400">
                                <BookOpen size={16} style={{ color: invocation.id.startsWith("inv-default-") ? beadColor : undefined }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-white group-hover:text-white transition-colors leading-tight">{invocation.name}</h4>
                                {invocation.description && (
                                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{invocation.description}</p>
                                )}
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1.5 font-black">{invocation.repetitions} répétitions</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={(e) => { e.preventDefault(); onToggleFavorite(invocation.id); }}
                                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-75"
                                >
                                    <Star
                                        size={18}
                                        fill={isFavorite(invocation.id) ? beadColor : "none"}
                                        className={isFavorite(invocation.id) ? "" : "text-slate-700"}
                                        style={{ color: isFavorite(invocation.id) ? beadColor : undefined }}
                                    />
                                </button>
                                {!invocation.id.startsWith("inv-default-") && (
                                    <button
                                        onClick={(e) => { e.preventDefault(); onDelete(invocation.id); }}
                                        className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <div className="text-center py-12 px-6 bg-white/[0.02] border border-dashed border-white/5 rounded-[2rem]">
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Aucun résultat</p>
                </div>
            )}
        </div>
    );
}

function CollectionSection({ groups, presets, expandedId, onToggleExpand, onSessionStart, onEdit, onDelete, onToggleFavorite, isFavorite, beadColor, getInvocationById }: any) {
    const allCollections = [...presets, ...groups];

    if (allCollections.length === 0) {
        return (
            <div className="text-center py-12 px-6 bg-white/[0.02] border border-dashed border-white/5 rounded-[2rem]">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Aucune collection</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {presets.map((preset: any) => (
                <div key={preset.id} className="group relative">
                    <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-[1.5rem] overflow-hidden transition-all duration-300 ${expandedId === preset.id ? "ring-1 ring-white/20" : ""}`}>
                        <div
                            className="flex items-center gap-4 p-4 cursor-pointer active:bg-white/[0.04] transition-all"
                            onClick={() => onToggleExpand(preset.id)}
                        >
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: beadColor, boxShadow: `0 0 10px ${beadColor}80` }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-white group-hover:text-white transition-colors leading-tight">{preset.name}</h4>
                                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{preset.description}</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1.5 font-black">{preset.totalBeads} perles · {preset.cycles} cycle{preset.cycles > 1 ? 's' : ''}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(preset.id); }}
                                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-75"
                                >
                                    <Star
                                        size={18}
                                        fill={isFavorite(preset.id) ? beadColor : "none"}
                                        className={isFavorite(preset.id) ? "" : "text-slate-700"}
                                        style={{ color: isFavorite(preset.id) ? beadColor : undefined }}
                                    />
                                </button>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-slate-700 transition-all duration-300 ${expandedId === preset.id ? "rotate-180 bg-white/10 text-white" : ""}`}>
                                    <ChevronDown size={14} />
                                </div>
                            </div>
                        </div>

                        {expandedId === preset.id && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-white/5 bg-white/[0.02]"
                            >
                                <div className="p-5 space-y-3">
                                    <div className="space-y-1">
                                        {preset.sequence.map((step: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/[0.02] last:border-0 opacity-70">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-[9px] font-black text-slate-700 w-4">{i + 1}</div>
                                                    <span className="text-[13px] font-medium text-slate-300">{step.label}</span>
                                                </div>
                                                <span className="text-[10px] font-black text-white bg-white/5 px-2 py-0.5 rounded-lg tracking-wider">{step.repetitions}×</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-3">
                                        <Link
                                            href="/session"
                                            onClick={() => { useSessionStore.getState().setPreset(preset); onSessionStart?.(); }}
                                            style={{
                                                backgroundColor: beadColor,
                                                boxShadow: `0 10px 30px -5px ${beadColor}40`
                                            }}
                                            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-white text-xs font-black active:scale-[0.98] transition-all"
                                        >
                                            <Play size={14} fill="currentColor" />
                                            LANCER LA SESSION
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            ))}

            {groups.map((group: any) => {
                const totalReps = group.invocations.reduce((sum: number, inv: any) => sum + inv.repetitions, 0);
                const isExpanded = expandedId === group.id;

                return (
                    <div key={group.id} className="group relative">
                        <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-[1.5rem] overflow-hidden transition-all duration-300 ${isExpanded ? "ring-1 ring-white/20" : ""}`}>
                            <div
                                className="flex items-center gap-4 p-4 cursor-pointer active:bg-white/[0.04] transition-all"
                                onClick={() => onToggleExpand(group.id)}
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: beadColor, boxShadow: `0 0 10px ${beadColor}80` }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-white group-hover:text-white transition-colors leading-tight">{group.name}</h4>
                                    {group.description && (
                                        <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{group.description}</p>
                                    )}
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1.5 font-black">{totalReps} perles · {group.invocations.length} étapes</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(group.id); }}
                                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-75"
                                    >
                                        <Star
                                            size={18}
                                            fill={isFavorite(group.id) ? beadColor : "none"}
                                            className={isFavorite(group.id) ? "" : "text-slate-700"}
                                            style={{ color: isFavorite(group.id) ? beadColor : undefined }}
                                        />
                                    </button>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-slate-700 transition-all duration-300 ${isExpanded ? "rotate-180 bg-white/10 text-white" : ""}`}>
                                        <ChevronDown size={14} />
                                    </div>
                                </div>
                            </div>

                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    className="border-t border-white/5 bg-white/[0.02]"
                                >
                                    <div className="p-5 space-y-4">
                                        <div className="space-y-1">
                                            {group.invocations.map((inv: any, i: number) => {
                                                const invData = getInvocationById(inv.invocationId);
                                                return (
                                                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/[0.02] last:border-0 opacity-70">
                                                        <div className="flex items-center gap-3">
                                                            <div className="text-[9px] font-black text-slate-700 w-4">{i + 1}</div>
                                                            <span className="text-[13px] font-medium text-slate-300">{invData?.name || "Invocation"}</span>
                                                        </div>
                                                        <span className="text-[10px] font-black text-white bg-white/5 px-2 py-0.5 rounded-lg tracking-wider">{inv.repetitions}×</span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="pt-2 flex gap-3">
                                            <Link
                                                href={`/session?group=${group.id}`}
                                                onClick={onSessionStart}
                                                style={{
                                                    backgroundColor: beadColor,
                                                    boxShadow: `0 10px 30px -5px ${beadColor}40`
                                                }}
                                                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-white text-xs font-black active:scale-[0.98] transition-all"
                                            >
                                                <Play size={14} fill="currentColor" />
                                                LANCER
                                            </Link>
                                            {!group.id.startsWith("grp-default-") && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onEdit(group); }}
                                                        className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onDelete(group.id); }}
                                                        className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-rose-500 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
