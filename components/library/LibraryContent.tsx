"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, BookOpen, Trash2, Plus, ChevronDown, Pencil, Play, Star, X } from "lucide-react";
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
    const [isSearching, setIsSearching] = useState(false);
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

    const { invocations, groups, deleteInvocation, deleteGroup, getInvocationById, loadDefaultData, toggleFavorite, isFavorite, favoriteIds } = useInvocationStore();
    const beadColor = useSessionStore((s) => s.beadColor);

    // Load defaults if store is empty OR if new defaults are missing (migration)
    useEffect(() => {
        const hasNewDefaults = invocations.some(inv => inv.name === "Āyat al-Kursī");
        if ((invocations.length === 0 && groups.length === 0) || !hasNewDefaults) {
            loadDefaultData();
        }
    }, [invocations.length, groups.length, loadDefaultData, invocations]);

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
        <div className="flex flex-col h-[100dvh] bg-slate-50 dark:bg-slate-950/20 px-5 pt-[calc(env(safe-area-inset-top,20px)+2rem)] overflow-hidden touch-none">
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
            <div className="flex-none space-y-4 pb-2 z-10 touch-none">
                <AnimatePresence mode="wait">
                    {!isSearching ? (
                        <motion.div
                            key="normal-header"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {/* Spotify-style title row */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                        <Sparkles size={16} style={{ color: beadColor }} />
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Bibliothèque</h2>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setIsSearching(true)}
                                        className="p-2.5 rounded-full hover:bg-slate-200/50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-400 active:scale-90 transition-all"
                                    >
                                        <Search size={22} />
                                    </button>

                                    {/* + button Spotify-style */}
                                    <div className="relative">
                                        <motion.button
                                            whileTap={{ scale: 0.88 }}
                                            onClick={() => setIsAddMenuOpen(v => !v)}
                                            className="p-2.5 rounded-full hover:bg-slate-200/50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-400 active:scale-90 transition-all"
                                        >
                                            <motion.div
                                                animate={{ rotate: isAddMenuOpen ? 45 : 0 }}
                                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                            >
                                                <Plus size={22} strokeWidth={2.5} />
                                            </motion.div>
                                        </motion.button>

                                        {/* Dropdown menu */}
                                        <AnimatePresence>
                                            {isAddMenuOpen && (
                                                <>
                                                    {/* Backdrop */}
                                                    <button
                                                        className="fixed inset-0 z-40 cursor-default"
                                                        onClick={() => setIsAddMenuOpen(false)}
                                                        aria-label="Fermer le menu"
                                                        tabIndex={-1}
                                                    />
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9, y: -8 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9, y: -8 }}
                                                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                                                        className="absolute right-0 top-full mt-1 z-50 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden min-w-[200px]"
                                                        style={{ transformOrigin: "top right" }}
                                                    >
                                                        <button
                                                            onClick={() => {
                                                                setIsAddMenuOpen(false);
                                                                setEditingGroup(null);
                                                                setIsCreateGroupModalOpen(true);
                                                            }}
                                                            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:bg-slate-100 dark:active:bg-white/10 transition-colors text-left"
                                                        >
                                                            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                                                <Sparkles size={15} className="text-emerald-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[14px] font-semibold text-slate-900 dark:text-white leading-tight">Collection</p>
                                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Grouper des invocations</p>
                                                            </div>
                                                        </button>

                                                        <div className="h-px bg-slate-100 dark:bg-white/[0.06] mx-4" />

                                                        <button
                                                            onClick={() => {
                                                                setIsAddMenuOpen(false);
                                                                setEditingInvocation(null);
                                                                setIsCreateInvocationModalOpen(true);
                                                            }}
                                                            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:bg-slate-100 dark:active:bg-white/10 transition-colors text-left"
                                                        >
                                                            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center shrink-0">
                                                                <BookOpen size={15} className="text-indigo-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[14px] font-semibold text-slate-900 dark:text-white leading-tight">Invocation</p>
                                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Créer une nouvelle dhikr</p>
                                                            </div>
                                                        </button>
                                                    </motion.div>
                                                </>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="search-header"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex items-center gap-3"
                        >
                            <div className="relative flex-1 group">
                                <Search
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors duration-300"
                                />
                                <input
                                    autoFocus
                                    type="text"
                                    inputMode="search"
                                    spellCheck="false"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="none"
                                    placeholder="Rechercher..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-200/40 dark:bg-white/[0.05] border border-transparent dark:border-white/5 rounded-2xl py-3 pl-11 pr-10 text-[15px] text-slate-900 dark:text-white placeholder:text-slate-600/80 outline-none transition-all duration-300 focus:bg-white dark:focus:bg-white/10"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                    >
                                        <X size={14} strokeWidth={3} />
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    setIsSearching(false);
                                    setSearchQuery("");
                                }}
                                className="text-[15px] font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-1 active:opacity-70 transition-all"
                            >
                                Annuler
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── TABS ─────────────────────────── */}
                <div className="flex gap-2">
                    {[
                        { key: "collections" as const, label: "Collections", icon: <Sparkles size={13} />, count: groups.length },
                        { key: "invocations" as const, label: "Invocations", icon: <BookOpen size={13} />, count: invocations.length },
                        { key: "favorites" as const, label: "Favoris", icon: <Star size={13} />, count: favoriteInvocations.length + favoriteGroups.length },
                    ].map(tab => {
                        const isActive = activeTab === tab.key;
                        return (
                            <motion.button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                whileTap={{ scale: 0.95 }}
                                className="relative flex-1 flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-2xl border transition-all duration-300"
                                style={isActive ? {
                                    backgroundColor: beadColor + "18",
                                    borderColor: beadColor + "45",
                                    color: beadColor,
                                } : {
                                    backgroundColor: "transparent",
                                    borderColor: "rgba(148,163,184,0.18)",
                                    color: undefined,
                                }}
                            >
                                <span className={isActive ? "" : "text-slate-400 dark:text-slate-500"}>
                                    {tab.icon}
                                </span>
                                <span className={`text-[11px] font-bold leading-none ${isActive ? "" : "text-slate-600 dark:text-slate-400"}`}>
                                    {tab.label}
                                </span>
                                {tab.count > 0 && (
                                    <span
                                        className="text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none"
                                        style={isActive ? {
                                            backgroundColor: beadColor + "30",
                                            color: beadColor,
                                        } : {
                                            backgroundColor: "rgba(100,116,139,0.12)",
                                            color: "rgb(100,116,139)",
                                        }}
                                    >
                                        {tab.count}
                                    </span>
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* ── SCROLLABLE CONTENT ─────────────────────── */}
            <div className="flex-1 overflow-y-auto w-full no-scrollbar pb-36 touch-pan-y overscroll-contain">
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
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-600 px-1">Collections</h3>
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
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-600 px-1">Invocations</h3>
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
                                <div className="text-center py-20 px-6 bg-slate-50 dark:bg-white/[0.03] border border-dashed border-slate-200 dark:border-white/10 rounded-[2rem]">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto mb-6 opacity-30">
                                        <Star size={24} className="text-slate-400" />
                                    </div>
                                    <p className="text-base font-bold text-slate-900 dark:text-white">Aucun favori</p>
                                    <p className="text-xs text-slate-600 mt-2 max-w-[200px] mx-auto leading-relaxed">Touchez l'étoile sur une invocation ou une collection pour l'ajouter ici.</p>
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
                onSuccess={() => setActiveTab("invocations")}
            />
            <CreateGroupModal
                isOpen={isCreateGroupModalOpen}
                onClose={handleCloseGroupModal}
                editGroup={editingGroup}
                onSuccess={() => setActiveTab("collections")}
            />
        </div >
    );
}

// ── SUB-COMPONENTS ─────────────────────────────────────────────────────────

function FavoriteSection({ invocations, onSessionStart, onDelete, onEdit, onToggleFavorite, isFavorite, beadColor, expandedId, onToggleExpand }: any) {
    return (
        <div className="space-y-2.5">
            {invocations.length > 0 ? (
                invocations.map((invocation: any) => {
                    const isExpanded = expandedId === invocation.id;
                    const isDefault = invocation.id.startsWith("inv-default-");

                    return (
                        <motion.div
                            key={invocation.id}
                            layout
                            className={`overflow-hidden rounded-3xl border transition-all duration-300 ${isExpanded
                                ? "bg-white dark:bg-white/[0.07] border-slate-200 dark:border-white/12 shadow-md dark:shadow-none"
                                : "bg-white dark:bg-white/[0.04] border-slate-200/80 dark:border-white/[0.06] active:scale-[0.99]"
                                }`}
                        >
                            {/* ── Header row ── */}
                            <button
                                className="w-full flex items-center gap-3.5 px-4 py-4 text-left"
                                onClick={() => onToggleExpand(invocation.id)}
                            >
                                {/* Icon */}
                                <div
                                    className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 transition-colors"
                                >
                                    <BookOpen size={17} style={{ color: beadColor }} />
                                </div>

                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-[15px] font-semibold text-slate-800 dark:text-slate-100 leading-tight truncate">
                                        {invocation.name}
                                    </p>
                                    {invocation.description && (
                                        <p className={`text-[12.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug transition-all duration-300 ${isExpanded ? "" : "line-clamp-1"}`}>
                                            {invocation.description}
                                        </p>
                                    )}
                                </div>

                                {/* Right side */}
                                <div className="flex items-center gap-2 shrink-0 ml-1">
                                    <span
                                        className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                                        style={{ backgroundColor: beadColor + "18", color: beadColor }}
                                    >
                                        {invocation.repetitions}×
                                    </span>
                                    <motion.div
                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                        transition={{ duration: 0.25, ease: "easeInOut" }}
                                    >
                                        <ChevronDown size={16} className="text-slate-400 dark:text-slate-500" />
                                    </motion.div>
                                </div>
                            </button>

                            {/* ── Expanded panel ── */}
                            <AnimatePresence initial={false}>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                                        className="overflow-hidden"
                                    >
                                        {/* Separator */}
                                        <div className="mx-4 h-px bg-slate-100 dark:bg-white/[0.06]" />

                                        {/* Action bar */}
                                        <div className="flex items-center gap-2 px-4 py-3.5">
                                            <Link
                                                href={`/session?invocation=${invocation.id}`}
                                                onClick={onSessionStart}
                                                style={{ backgroundColor: beadColor }}
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-white text-[13px] font-bold active:scale-[0.97] transition-transform"
                                            >
                                                <Play size={13} fill="currentColor" />
                                                Lancer
                                            </Link>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onToggleFavorite(invocation.id); }}
                                                className="w-10 h-10 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 active:scale-90 transition-all"
                                            >
                                                <Star size={16} fill={isFavorite(invocation.id) ? beadColor : "none"} style={{ color: isFavorite(invocation.id) ? beadColor : undefined }} className={isFavorite(invocation.id) ? "" : "text-slate-400"} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onEdit(invocation); }}
                                                className="w-10 h-10 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-slate-500 active:scale-90 transition-all"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onDelete(invocation.id); }}
                                                className="w-10 h-10 rounded-2xl flex items-center justify-center border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 text-red-400 active:scale-90 transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })
            ) : (
                <div className="text-center py-16 px-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto mb-4 opacity-40">
                        <BookOpen size={24} className="text-slate-400" />
                    </div>
                    <p className="text-sm font-bold text-slate-600 mb-1">Aucun résultat</p>
                    <p className="text-xs text-slate-500">Essayez une autre recherche</p>
                </div>
            )}
        </div>
    );
}

function CollectionSection({ groups, expandedId, onToggleExpand, onSessionStart, onEdit, onDelete, onToggleFavorite, isFavorite, beadColor, getInvocationById }: any) {
    if (groups.length === 0) {
        return (
            <div className="text-center py-16 px-6 bg-slate-50 dark:bg-white/[0.03] border border-dashed border-slate-200 dark:border-white/10 rounded-[2rem]">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto mb-5 opacity-40">
                    <Sparkles size={28} className="text-slate-400" />
                </div>
                <p className="text-sm font-bold text-slate-600 mb-2">Aucune collection</p>
                <p className="text-xs text-slate-700">Créez votre première collection</p>
            </div>
        );
    }

    return (
        <div className="space-y-2.5">
            {groups.map((group: any) => {
                const isExpanded = expandedId === group.id;

                return (
                    <motion.div
                        key={group.id}
                        layout
                        className={`overflow-hidden rounded-3xl border transition-all duration-300 ${isExpanded
                            ? "bg-white dark:bg-white/[0.07] border-slate-200 dark:border-white/12 shadow-md dark:shadow-none"
                            : "bg-white dark:bg-white/[0.04] border-slate-200/80 dark:border-white/[0.06] active:scale-[0.99]"
                            }`}
                    >
                        {/* ── Header row ── */}
                        <button
                            className="w-full flex items-center gap-3.5 px-4 py-4 text-left"
                            onClick={() => onToggleExpand(group.id)}
                        >
                            {/* Bead icon */}
                            <div
                                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                            >
                                <div
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: beadColor, boxShadow: `0 0 8px ${beadColor}` }}
                                />
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <p className="text-[15px] font-semibold text-slate-800 dark:text-slate-100 leading-tight truncate">
                                    {group.name}
                                </p>
                                {group.description && (
                                    <p className={`text-[12.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug transition-all duration-300 ${isExpanded ? "" : "line-clamp-1"}`}>
                                        {group.description}
                                    </p>
                                )}
                            </div>

                            {/* Right side */}
                            <div className="flex items-center gap-2 shrink-0 ml-1">
                                <span
                                    className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                                    style={{ backgroundColor: beadColor + "18", color: beadColor }}
                                >
                                    {group.invocations.length} étapes
                                </span>
                                <motion.div
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.25, ease: "easeInOut" }}
                                >
                                    <ChevronDown size={16} className="text-slate-400 dark:text-slate-500" />
                                </motion.div>
                            </div>
                        </button>

                        {/* ── Expanded panel ── */}
                        <AnimatePresence initial={false}>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                                    className="overflow-hidden"
                                >
                                    {/* Separator */}
                                    <div className="mx-4 h-px bg-slate-100 dark:bg-white/[0.06]" />

                                    {/* Steps list */}
                                    {group.invocations.length > 0 && (
                                        <div className="px-4 pt-3 pb-1 space-y-1">
                                            {group.invocations.map((inv: { invocationId: string; repetitions: number }, i: number) => {
                                                const invData = getInvocationById(inv.invocationId);
                                                return (
                                                    <div key={i} className="flex items-center gap-3 py-2">
                                                        <span
                                                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                                                            style={{ backgroundColor: beadColor + "20", color: beadColor }}
                                                        >
                                                            {i + 1}
                                                        </span>
                                                        <span className="flex-1 text-[13px] text-slate-700 dark:text-slate-300 font-medium truncate">
                                                            {invData?.name || "Invocation"}
                                                        </span>
                                                        <span
                                                            className="text-[11px] font-bold px-2 py-0.5 rounded-lg shrink-0"
                                                            style={{ backgroundColor: beadColor + "15", color: beadColor }}
                                                        >
                                                            {inv.repetitions}×
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Separator */}
                                    <div className="mx-4 h-px bg-slate-100 dark:bg-white/[0.06] mt-1" />

                                    {/* Action bar */}
                                    <div className="flex items-center gap-2 px-4 py-3.5">
                                        <Link
                                            href={`/session?group=${group.id}`}
                                            onClick={onSessionStart}
                                            style={{ backgroundColor: beadColor }}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-white text-[13px] font-bold active:scale-[0.97] transition-transform"
                                        >
                                            <Play size={13} fill="currentColor" />
                                            Lancer
                                        </Link>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onToggleFavorite(group.id); }}
                                            className="w-10 h-10 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 active:scale-90 transition-all"
                                        >
                                            <Star size={16} fill={isFavorite(group.id) ? beadColor : "none"} style={{ color: isFavorite(group.id) ? beadColor : undefined }} className={isFavorite(group.id) ? "" : "text-slate-400"} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onEdit(group); }}
                                            className="w-10 h-10 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-slate-500 active:scale-90 transition-all"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDelete(group.id); }}
                                            className="w-10 h-10 rounded-2xl flex items-center justify-center border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 text-red-400 active:scale-90 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>
    );
}
