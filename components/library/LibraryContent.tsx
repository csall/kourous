"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Search, Sparkles, BookOpen, Trash2, Plus, ChevronDown, Pencil, Play, Star } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useInvocationStore, type InvocationGroup } from "@/lib/store/invocationStore";
import { CreateInvocationModal } from "@/components/library/CreateInvocationModal";
import { CreateGroupModal } from "@/components/library/CreateGroupModal";
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

    const { scrollY } = useScroll();
    const titleOpacity = useTransform(scrollY, [0, 40], [1, 0]);
    const titleScale = useTransform(scrollY, [0, 40], [1, 0.95]);
    const titleY = useTransform(scrollY, [0, 40], [0, -10]);

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
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
            >
                {/* ── MOBILE NATIVE HEADER ─────────────────────────── */}
                <div className="space-y-6">
                    {/* Toolbar Row: Search + Add */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 group">
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

                        <button
                            onClick={() => activeTab === "invocations" ? setIsCreateInvocationModalOpen(true) : setIsCreateGroupModalOpen(true)}
                            className="relative group overflow-hidden touch-target w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                        >
                            <div
                                className="absolute inset-0 transition-opacity duration-300 opacity-100 group-hover:opacity-90"
                                style={{
                                    background: `linear-gradient(135deg, ${beadColor}, ${beadColor}dd)`,
                                    boxShadow: `0 10px 30px -8px ${beadColor}50, 0 0 0 1px ${beadColor}20`
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <Plus size={24} className="text-white relative z-10" strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Large Title + Subtitle */}
                    <motion.div
                        style={{ opacity: titleOpacity, scale: titleScale, y: titleY }}
                        className="space-y-1 px-1 origin-left"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                <Sparkles size={16} style={{ color: beadColor }} />
                            </div>
                            <h2 className="text-3xl font-bold text-white tracking-tight">Bibliothèque</h2>
                        </div>
                        <p className="text-sm text-slate-400 font-medium pl-11">Vos rituels et collections</p>
                    </motion.div>
                </div>

                {/* ── STICKY TABS ─────────────────────────── */}
                {/* ── STICKY TABS ─────────────────────────── */}
                <motion.div
                    className="sticky top-0 z-40 -mx-5 px-5 py-3 mb-6 transition-all"
                    style={{
                        backgroundColor: useTransform(scrollY, [0, 50], ["rgba(2, 6, 23, 0.8)", "rgba(2, 6, 23, 0.95)"]),
                        backdropFilter: "blur(20px)",
                        borderBottom: "1px solid",
                        borderColor: useTransform(scrollY, [0, 50], ["rgba(255, 255, 255, 0.05)", "rgba(255, 255, 255, 0.1)"])
                    }}
                >
                    <div className="flex gap-1.5 p-1 bg-white/[0.04] rounded-xl border border-white/5">
                        {[
                            { key: "invocations" as const, label: "Invocations", count: invocations.length, icon: BookOpen },
                            { key: "collections" as const, label: "Collections", count: groups.length, icon: Sparkles },
                            { key: "favorites" as const, label: "Favoris", count: favoriteIds.length, icon: Star },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`relative flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-[11px] font-bold transition-all duration-300 ${activeTab === tab.key
                                    ? 'text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-400 hover:bg-white/[0.02]'
                                    }`}
                            >
                                {activeTab === tab.key && (
                                    <motion.div
                                        layoutId="activeTabBg"
                                        className="absolute inset-0 bg-white/[0.15] rounded-lg"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <tab.icon size={14} strokeWidth={2.5} />
                                    <span className="tracking-wide hidden sm:inline">{tab.label}</span>
                                    <span className="tracking-wide sm:hidden">{tab.label.slice(0, 4)}.</span>
                                    {tab.count > 0 && <span className={`min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center text-[9px] font-black transition-all ${activeTab === tab.key ? "bg-white/25 text-white" : "bg-white/5 text-slate-600"}`}>
                                        {tab.count}
                                    </span>}
                                </span>
                            </button>
                        ))}
                    </div>
                </motion.div>

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
            </motion.div >

            <CreateInvocationModal isOpen={isCreateInvocationModalOpen} onClose={() => setIsCreateInvocationModalOpen(false)} />
            <CreateGroupModal isOpen={isCreateGroupModalOpen} onClose={handleCloseGroupModal} editGroup={editingGroup} />
        </div >
    );
}

// ── SUB-COMPONENTS ─────────────────────────────────────────────────────────

function FavoriteSection({ invocations, onSessionStart, onDelete, onToggleFavorite, isFavorite, beadColor }: any) {
    return (
        <div className="space-y-4">
            {invocations.length > 0 ? (
                invocations.map((invocation: any) => (
                    <Link key={invocation.id} href={`/session?invocation=${invocation.id}`} onClick={onSessionStart} className="group block">
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-[1.25rem] p-5 flex items-center gap-5 transition-all duration-300 hover:bg-white/[0.09] hover:border-white/20 hover:shadow-lg hover:shadow-white/5"
                            style={{
                                boxShadow: `0 0 0 0px ${beadColor}00`
                            }}
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
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(invocation.id); }}
                                    className="touch-target rounded-xl flex items-center justify-center transition-all active:scale-75 hover:bg-white/5"
                                >
                                    <Star
                                        size={20}
                                        fill={isFavorite(invocation.id) ? beadColor : "none"}
                                        className={isFavorite(invocation.id) ? "" : "text-slate-700"}
                                        style={{ color: isFavorite(invocation.id) ? beadColor : undefined }}
                                    />
                                </button>
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(invocation.id); }}
                                    className="touch-target rounded-xl flex items-center justify-center text-slate-700 hover:text-rose-500 active:scale-75 transition-all hover:bg-white/5"
                                >
                                    <Trash2 size={19} />
                                </button>
                            </div>
                        </motion.div>
                    </Link>
                ))
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
