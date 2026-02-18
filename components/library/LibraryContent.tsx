"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, BookOpen, Trash2, Plus, ChevronDown, Pencil, Play, Star } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useInvocationStore, type InvocationGroup, type Invocation } from "@/lib/store/invocationStore";
import { CreateInvocationModal } from "@/components/library/CreateInvocationModal";
import { CreateGroupModal } from "@/components/library/CreateGroupModal";
import { useSessionStore } from "@/lib/store/sessionStore";

interface LibraryContentProps {
    onSessionStart?: () => void;
}

export function LibraryContent({ onSessionStart }: LibraryContentProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"collections" | "invocations" | "favorites">("collections");
    const [isCreateInvocationModalOpen, setIsCreateInvocationModalOpen] = useState(false);
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<InvocationGroup | null>(null);
    const [editingInvocation, setEditingInvocation] = useState<Invocation | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const { invocations, groups, deleteInvocation, deleteGroup, getInvocationById, loadDefaultData, toggleFavorite, isFavorite, favoriteIds } = useInvocationStore();
    const beadColor = useSessionStore((s) => s.beadColor);

    // Load defaults if store is empty OR if new defaults are missing (migration)
    useEffect(() => {
        const hasTasbih = groups.some(g => g.name === "Tasbih après la Prière");
        if ((invocations.length === 0 && groups.length === 0) || !hasTasbih) {
            loadDefaultData();
        }
    }, [invocations.length, groups.length, loadDefaultData, groups]);

    const filteredInvocations = invocations.filter(inv =>
        inv.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredGroups = groups.filter(grp =>
        grp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grp.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const favoriteInvocations = invocations.filter(inv => isFavorite(inv.id));
    const favoriteGroups = groups.filter(grp => isFavorite(grp.id));

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

    const handleEditInvocation = (invocation: Invocation) => {
        setEditingInvocation(invocation);
        setIsCreateInvocationModalOpen(true);
    };



    return (
        <div className="flex flex-col h-[100dvh] bg-slate-950/20 px-5 pt-4 overflow-hidden">
            {/* Immersive Mesh Glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
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

            {/* ── FIXED HEADER ─────────────────────────── */}
            <div className="flex-none space-y-6 pb-2 z-10 touch-none">
                {/* ── MOBILE NATIVE HEADER ─────────────────────────── */}
                <div className="space-y-6">
                    {/* Large Title + Subtitle */}
                    <div className="space-y-1 px-1">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                <Sparkles size={16} style={{ color: beadColor }} />
                            </div>
                            <h2 className="text-3xl font-bold text-white tracking-tight">Bibliothèque</h2>
                        </div>
                        <p className="text-sm text-slate-400 font-medium pl-11">Vos rituels et collections</p>
                    </div>

                    {/* Toolbar Row: Search + Add */}
                    <div className="flex flex-col gap-3">
                        <div className="relative w-full group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300">
                                <Search
                                    size={18}
                                    className="text-slate-500 group-focus-within:text-white transition-colors"
                                    style={{
                                        filter: searchQuery ? `drop-shadow(0 0 8px ${beadColor}40)` : 'none'
                                    }}
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-300 hover:bg-white/[0.07] focus:bg-white/[0.08] focus:border-white/20"
                                style={{
                                    boxShadow: `0 0 0 0px ${beadColor}00`
                                }}
                                onFocus={(e) => e.target.style.boxShadow = `0 0 25px -10px ${beadColor}50`}
                                onBlur={(e) => e.target.style.boxShadow = `0 0 0 0px ${beadColor}00`}
                            />
                        </div>


                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button
                                onClick={() => {
                                    setEditingGroup(null);
                                    setIsCreateGroupModalOpen(true);
                                }}
                                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 active:scale-95 transition-all group"
                            >
                                <div className="relative">
                                    <Sparkles size={18} className="text-emerald-400 group-hover:text-emerald-300" />
                                    <Plus size={10} strokeWidth={4} className="absolute -bottom-1.5 -right-1.5 text-emerald-400 group-hover:text-emerald-300" />
                                </div>
                                <span className="text-sm font-bold text-emerald-400 group-hover:text-emerald-300">Collection</span>
                            </button>

                            <button
                                onClick={() => {
                                    setEditingInvocation(null);
                                    setIsCreateInvocationModalOpen(true);
                                }}
                                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 active:scale-95 transition-all group"
                            >
                                <div className="relative">
                                    <BookOpen size={18} className="text-indigo-400 group-hover:text-indigo-300" />
                                    <Plus size={10} strokeWidth={4} className="absolute -bottom-1.5 -right-1.5 text-indigo-400 group-hover:text-indigo-300" />
                                </div>
                                <span className="text-sm font-bold text-indigo-400 group-hover:text-indigo-300">Invocation</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── TABS ─────────────────────────── */}
                <div>
                    <div className="flex p-1 bg-[#1C1C1E] rounded-xl border border-white/10">
                        {[
                            { key: "collections" as const, label: "Collections", count: groups.length },
                            { key: "invocations" as const, label: "Invocations", count: invocations.length },
                            { key: "favorites" as const, label: "Favoris", count: favoriteIds.length },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`relative flex-1 flex items-center justify-center gap-2 py-2 rounded-[9px] text-[13px] font-medium transition-all duration-300 ${activeTab === tab.key
                                    ? 'text-white'
                                    : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                {activeTab === tab.key && (
                                    <motion.div
                                        layoutId="activeTabBg"
                                        className="absolute inset-0 bg-[#3A3A3C] rounded-[9px] shadow-sm border border-white/10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <span>{tab.label}</span>
                                    {tab.count > 0 && (
                                        <span className={`text-[10px] font-bold opacity-60 ${activeTab === tab.key ? "text-white" : "text-slate-500"}`}>
                                            {tab.count}
                                        </span>
                                    )}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── SCROLLABLE CONTENT ─────────────────────── */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-36 -mx-5 px-5">
                <AnimatePresence mode="wait">
                    {activeTab === "collections" ? (
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
                    ) : activeTab === "invocations" ? (
                        <motion.div
                            className="space-y-6"
                        >
                            <FavoriteSection
                                invocations={filteredInvocations}
                                onSessionStart={onSessionStart}
                                onDelete={deleteInvocation}
                                onEdit={handleEditInvocation}
                                onToggleFavorite={toggleFavorite}
                                isFavorite={isFavorite}
                                beadColor={beadColor}
                                expandedId={expandedId}
                                onToggleExpand={toggleExpand}
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
                                    {favoriteGroups.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 px-1">Collections</h3>
                                            <CollectionSection
                                                groups={favoriteGroups}
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
                                    {favoriteInvocations.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 px-1">Invocations</h3>
                                            <FavoriteSection
                                                invocations={favoriteInvocations}
                                                onSessionStart={onSessionStart}
                                                onDelete={deleteInvocation}
                                                onEdit={handleEditInvocation}
                                                onToggleFavorite={toggleFavorite}
                                                isFavorite={isFavorite}
                                                beadColor={beadColor}
                                                expandedId={expandedId}
                                                onToggleExpand={toggleExpand}
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

            <CreateInvocationModal
                isOpen={isCreateInvocationModalOpen}
                onClose={() => {
                    setIsCreateInvocationModalOpen(false);
                    setEditingInvocation(null);
                }}
                editInvocation={editingInvocation}
            />
            <CreateGroupModal isOpen={isCreateGroupModalOpen} onClose={handleCloseGroupModal} editGroup={editingGroup} />
        </div >
    );
}

// ── SUB-COMPONENTS ─────────────────────────────────────────────────────────

function FavoriteSection({ invocations, onSessionStart, onDelete, onEdit, onToggleFavorite, isFavorite, beadColor, expandedId, onToggleExpand }: any) {
    return (
        <div className="space-y-4">
            {invocations.length > 0 ? (
                invocations.map((invocation: any) => {
                    const isExpanded = expandedId === invocation.id;

                    return (
                        <div key={invocation.id} className="group relative">
                            <motion.div
                                whileHover={{ scale: isExpanded ? 1 : 1.005 }}
                                className={`bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-[1.25rem] overflow-hidden transition-all duration-500 ${isExpanded ? "ring-2 ring-white/20 shadow-xl shadow-white/5" : "hover:border-white/20"}`}
                            >
                                <div
                                    className="flex items-center gap-5 p-5 cursor-pointer active:bg-white/[0.04] transition-all"
                                    onClick={() => onToggleExpand(invocation.id)}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-slate-400 group-hover:border-white/20 transition-all duration-300">
                                        <BookOpen size={18} style={{ color: invocation.id.startsWith("inv-default-") ? beadColor : undefined }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[15px] font-bold text-white group-hover:text-white transition-colors leading-tight mb-1">{invocation.name}</h4>
                                        {invocation.description && (
                                            <p className="text-xs text-slate-500 line-clamp-1 mb-2">{invocation.description}</p>
                                        )}
                                        <p className="text-[10px] text-slate-400 uppercase tracking-[0.15em] font-black">{invocation.repetitions} répétitions</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 ml-auto">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onToggleFavorite(invocation.id); }}
                                            className="touch-target rounded-xl flex items-center justify-center transition-all active:scale-75 hover:bg-white/5"
                                        >
                                            <Star
                                                size={20}
                                                fill={isFavorite(invocation.id) ? beadColor : "none"}
                                                className={isFavorite(invocation.id) ? "" : "text-slate-700"}
                                                style={{ color: isFavorite(invocation.id) ? beadColor : undefined }}
                                            />
                                        </button>
                                        <div className={`touch-target rounded-xl flex items-center justify-center text-slate-700 transition-all duration-500 ${isExpanded ? "rotate-180 bg-white/10 text-white" : ""}`}>
                                            <ChevronDown size={18} />
                                        </div>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                            className="border-t border-white/5 bg-white/[0.02]"
                                        >
                                            <div className="p-6 pt-4 flex gap-3">
                                                <Link
                                                    href={`/session?invocation=${invocation.id}`}
                                                    onClick={onSessionStart}
                                                    style={{
                                                        backgroundColor: beadColor,
                                                        boxShadow: `0 12px 35px -8px ${beadColor}50, 0 0 0 1px ${beadColor}30`
                                                    }}
                                                    className="flex-1 flex items-center justify-center gap-2.5 py-4.5 rounded-xl text-white text-xs font-black hover:scale-[1.01] active:scale-[0.98] transition-all duration-300"
                                                >
                                                    <Play size={15} fill="currentColor" />
                                                    LANCER
                                                </Link>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onEdit(invocation); }}
                                                        className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onDelete(invocation.id); }}
                                                        className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-rose-500 hover:bg-white/10 transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    );
                })
            ) : (
                <div className="text-center py-16 px-6 bg-white/[0.03] border border-dashed border-white/10 rounded-[2rem]">
                    <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5 opacity-40">
                        <BookOpen size={28} className="text-slate-400" />
                    </div>
                    <p className="text-sm font-bold text-slate-500 mb-2">Aucun résultat</p>
                    <p className="text-xs text-slate-600">Essayez une autre recherche</p>
                </div>
            )}
        </div>
    );
}

function CollectionSection({ groups, expandedId, onToggleExpand, onSessionStart, onEdit, onDelete, onToggleFavorite, isFavorite, beadColor, getInvocationById }: any) {
    if (groups.length === 0) {
        return (
            <div className="text-center py-16 px-6 bg-white/[0.03] border border-dashed border-white/10 rounded-[2rem]">
                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5 opacity-40">
                    <Sparkles size={28} className="text-slate-400" />
                </div>
                <p className="text-sm font-bold text-slate-500 mb-2">Aucune collection</p>
                <p className="text-xs text-slate-600">Créez votre première collection</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {groups.map((group: any) => {
                const totalReps = group.invocations.reduce((sum: number, inv: any) => sum + inv.repetitions, 0);
                const isExpanded = expandedId === group.id;

                return (
                    <div key={group.id} className="group relative">
                        <motion.div
                            whileHover={{ scale: isExpanded ? 1 : 1.005 }}
                            className={`bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-[1.5rem] overflow-hidden transition-all duration-500 ${isExpanded ? "ring-2 ring-white/20 shadow-xl shadow-white/5" : "hover:border-white/20"}`}
                        >
                            <div
                                className="flex items-center gap-5 p-5 cursor-pointer active:bg-white/[0.04] transition-all"
                                onClick={() => onToggleExpand(group.id)}
                            >
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-white/20 transition-all">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: beadColor, boxShadow: `0 0 12px ${beadColor}90` }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[15px] font-bold text-white group-hover:text-white transition-colors leading-tight mb-1">{group.name}</h4>
                                    {group.description && (
                                        <p className="text-xs text-slate-500 line-clamp-1 mb-2">{group.description}</p>
                                    )}
                                    <p className="text-[10px] text-slate-400 uppercase tracking-[0.15em] font-black">{totalReps} perles · {group.invocations.length} étapes</p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(group.id); }}
                                        className="touch-target rounded-xl flex items-center justify-center transition-all active:scale-75 hover:bg-white/5"
                                    >
                                        <Star
                                            size={20}
                                            fill={isFavorite(group.id) ? beadColor : "none"}
                                            className={isFavorite(group.id) ? "" : "text-slate-700"}
                                            style={{ color: isFavorite(group.id) ? beadColor : undefined }}
                                        />
                                    </button>
                                    <div className={`touch-target rounded-xl flex items-center justify-center text-slate-700 transition-all duration-500 ${isExpanded ? "rotate-180 bg-white/10 text-white" : ""}`}>
                                        <ChevronDown size={18} />
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        className="border-t border-white/5 bg-white/[0.02]"
                                    >
                                        <div className="p-6 space-y-4">
                                            <div className="space-y-1.5">
                                                {group.invocations.map((inv: any, i: number) => {
                                                    const invData = getInvocationById(inv.invocationId);
                                                    return (
                                                        <div key={i} className="flex items-center justify-between py-3 border-b border-white/[0.03] last:border-0 opacity-80 hover:opacity-100 transition-opacity">
                                                            <div className="flex items-center gap-3.5">
                                                                <div className="text-[10px] font-black text-slate-600 w-5">{i + 1}</div>
                                                                <span className="text-sm font-medium text-slate-300">{invData?.name || "Invocation"}</span>
                                                            </div>
                                                            <span className="text-[11px] font-black text-white bg-white/10 px-2.5 py-1 rounded-lg tracking-wider">{inv.repetitions}×</span>
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
                                                        boxShadow: `0 12px 35px -8px ${beadColor}50, 0 0 0 1px ${beadColor}30`
                                                    }}
                                                    className="flex-1 flex items-center justify-center gap-2.5 py-4.5 rounded-xl text-white text-xs font-black hover:scale-[1.01] active:scale-[0.98] transition-all duration-300"
                                                >
                                                    <Play size={15} fill="currentColor" />
                                                    LANCER
                                                </Link>
                                                {/* ENABLE EDIT/DELETE FOR ALL GROUPS */}
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onEdit(group); }}
                                                        className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onDelete(group.id); }}
                                                        className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-rose-500 hover:bg-white/10 transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                );
            })}
        </div>
    );
}
