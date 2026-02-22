"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, BookOpen, Trash2, Plus, ChevronDown, Pencil, Play, Star, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useInvocationStore, type InvocationGroup, type Invocation } from "@/lib/store/invocationStore";
import { CreateInvocationModal } from "@/components/library/CreateInvocationModal";
import { CreateGroupModal } from "@/components/library/CreateGroupModal";
import { useSessionStore } from "@/lib/store/sessionStore";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { HomeBackground } from "@/components/home/HomeBackground";

const glassCard = "relative bg-white/[0.042] backdrop-blur-xl border border-white/[0.07] rounded-3xl";
const Shine = () => (
    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent rounded-t-3xl" />
);

interface LibraryContentProps {
    onSessionStart?: () => void;
    onClose?: () => void;
}

export function LibraryContent({ onSessionStart, onClose }: LibraryContentProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"collections" | "invocations" | "favorites">("collections");
    const [isCreateInvocationModalOpen, setIsCreateInvocationModalOpen] = useState(false);
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<InvocationGroup | null>(null);
    const [editingInvocation, setEditingInvocation] = useState<Invocation | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const { t, resolve } = useTranslation();
    const [isSearching, setIsSearching] = useState(false);
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

    const { invocations, groups, deleteInvocation, deleteGroup, getInvocationById, toggleFavorite, isFavorite, favoriteIds } = useInvocationStore();
    const beadColor = useSessionStore((s) => s.beadColor);

    const filteredInvocations = invocations.filter(inv =>
        resolve(inv.name).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredGroups = groups.filter(grp =>
        resolve(grp.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
        resolve(grp.description).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const favoriteInvocations = invocations.filter(inv => isFavorite(inv.id));
    const favoriteGroups = groups.filter(grp => isFavorite(grp.id));

    const toggleExpand = (id: string, e?: React.MouseEvent) => {
        const isExpanding = expandedId !== id;
        setExpandedId(isExpanding ? id : null);

        if (isExpanding && e) {
            const target = e.currentTarget as HTMLElement;
            const container = target.closest('.scroll-mt-12');

            // Un délai pour laisser les autres éléments commencer à se fermer
            // et au navigateur de calculer la nouvelle position
            setTimeout(() => {
                if (container) {
                    container.scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 180);
        }
    };

    const handleEditGroup = (group: InvocationGroup) => {
        setEditingGroup(group);
        setIsCreateGroupModalOpen(true);
    };

    const handleGroupSuccess = (id: string) => {
        setSearchQuery("");
        setActiveTab("collections");
        setExpandedId(id);
    };

    const handleCloseGroupModal = () => {
        setIsCreateGroupModalOpen(false);
        setEditingGroup(null);
    };

    const handleEditInvocation = (invocation: Invocation) => {
        setEditingInvocation(invocation);
        setIsCreateInvocationModalOpen(true);
    };

    const handleInvocationSuccess = (id: string) => {
        setSearchQuery("");
        setActiveTab("invocations");
        setExpandedId(id);
    };

    return (
        <div className="flex flex-col w-full h-[100dvh] overflow-hidden text-white relative">
            <HomeBackground />

            {/* Immersive Mesh Glows - Keep some for extra depth if needed, or remove since HomeBackground has them */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 opacity-30">
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
            <div className="flex-none space-y-4 pt-[calc(env(safe-area-inset-top,20px)+0.75rem)] pb-2 px-5 z-20 relative">
                <AnimatePresence mode="wait">
                    {!isSearching ? (
                        <motion.div
                            key="normal-header"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {/* Spotify-style title row formatted like Settings */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-[12px] flex items-center justify-center"
                                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                        {onClose ? (
                                            <button
                                                onClick={onClose}
                                                className="w-full h-full flex items-center justify-center text-white/50 hover:text-white transition-colors"
                                            >
                                                <X size={18} />
                                            </button>
                                        ) : (
                                            <Sparkles size={16} style={{ color: beadColor }} />
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white tracking-tight">{t.library.title}</h2>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setIsSearching(true)}
                                        className="p-2.5 rounded-full hover:bg-white/5 text-white/50 active:scale-90 transition-all"
                                    >
                                        <Search size={22} />
                                    </button>

                                    {/* + button Spotify-style */}
                                    <div className="relative">
                                        <motion.button
                                            whileTap={{ scale: 0.88 }}
                                            onClick={() => setIsAddMenuOpen(v => !v)}
                                            className="p-2.5 rounded-full hover:bg-white/5 text-white/50 active:scale-90 transition-all"
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
                                                        className="absolute right-0 top-full mt-1 z-50 bg-white/90 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden min-w-[200px]"
                                                        style={{ transformOrigin: "top right" }}
                                                    >
                                                        <button
                                                            onClick={() => {
                                                                setIsAddMenuOpen(false);
                                                                setEditingGroup(null);
                                                                setIsCreateGroupModalOpen(true);
                                                            }}
                                                            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 active:bg-white/10 transition-colors text-left"
                                                        >
                                                            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                                                <Sparkles size={15} className="text-emerald-500 dark:text-emerald-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[14px] font-semibold text-slate-900 dark:text-white/90 leading-tight">{t.library.newCollection}</p>
                                                                <p className="text-[11px] text-slate-500 dark:text-white/40 mt-0.5">{t.library.groupInvocations}</p>
                                                            </div>
                                                        </button>

                                                        <div className="h-px bg-white/5 mx-4" />

                                                        <button
                                                            onClick={() => {
                                                                setIsAddMenuOpen(false);
                                                                setEditingInvocation(null);
                                                                setIsCreateInvocationModalOpen(true);
                                                            }}
                                                            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 active:bg-white/10 transition-colors text-left"
                                                        >
                                                            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center shrink-0">
                                                                <BookOpen size={15} className="text-indigo-500 dark:text-indigo-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[14px] font-semibold text-slate-900 dark:text-white/90 leading-tight">{t.library.newInvocation}</p>
                                                                <p className="text-[11px] text-slate-500 dark:text-white/40 mt-0.5">{t.library.createDhikr}</p>
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
                            className="flex items-center gap-3 h-[44px]"
                        >
                            <div className="relative flex-1 group">
                                <Search
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white transition-colors duration-300"
                                />
                                <input
                                    autoFocus
                                    type="text"
                                    inputMode="search"
                                    spellCheck="false"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="none"
                                    placeholder={t.common.search}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/[0.05] border border-white/5 rounded-2xl py-3 pl-11 pr-10 text-[15px] text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:bg-white/10"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-white/30 hover:text-white transition-colors"
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
                                className="text-[15px] font-medium text-white/50 hover:text-white px-1 active:opacity-70 transition-all"
                            >
                                {t.common.cancel}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── TABS ─────────────────────────── */}
                <div className="flex gap-2">
                    {[
                        { key: "collections" as const, label: t.library.collections, icon: <Sparkles size={13} />, count: groups.length },
                        { key: "invocations" as const, label: t.library.invocations, icon: <BookOpen size={13} />, count: invocations.length },
                        { key: "favorites" as const, label: t.library.favorites, icon: <Star size={13} />, count: favoriteInvocations.length + favoriteGroups.length },
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
                                    borderColor: "rgba(255,255,255,0.08)",
                                    color: undefined,
                                }}
                            >
                                <span className={isActive ? "" : "text-white/30"}>
                                    {tab.icon}
                                </span>
                                <span className={`text-[11px] font-bold leading-none ${isActive ? "" : "text-white/50"}`}>
                                    {tab.label}
                                </span>
                                <span
                                    className="text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none"
                                    style={isActive ? {
                                        backgroundColor: beadColor + "30",
                                        color: beadColor,
                                    } : {
                                        backgroundColor: "rgba(255,255,255,0.08)",
                                        color: "rgba(255,255,255,0.3)",
                                    }}
                                >
                                    {tab.count}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* ── SCROLLABLE CONTENT ─────────────────────── */}
            <div className="flex-1 overflow-y-auto w-full no-scrollbar pb-40 px-5 pt-2 touch-pan-y overscroll-contain scroll-pt-4">
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
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/25 px-1">{t.library.collections}</h3>
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
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/25 px-1">{t.library.invocations}</h3>
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
                                        <Star size={24} className="text-white/40" />
                                    </div>
                                    <p className="text-base font-bold text-white">{t.library.noFavorites}</p>
                                    <p className="text-xs text-white/40 mt-2 max-w-[200px] mx-auto leading-relaxed">{t.library.addFavoriteTip}</p>
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
                onSuccess={handleInvocationSuccess}
            />
            <CreateGroupModal
                isOpen={isCreateGroupModalOpen}
                onClose={handleCloseGroupModal}
                editGroup={editingGroup}
                onSuccess={handleGroupSuccess}
            />
        </div >
    );
}

// ── SUB-COMPONENTS ─────────────────────────────────────────────────────────

function FavoriteSection({ invocations, onSessionStart, onDelete, onEdit, onToggleFavorite, isFavorite, beadColor, expandedId, onToggleExpand }: any) {
    const { t, resolve } = useTranslation();
    return (
        <div className="space-y-2.5">
            {invocations.length > 0 ? (
                invocations.map((invocation: any) => {
                    const isExpanded = expandedId === invocation.id;
                    return (
                        <motion.div
                            key={invocation.id}
                            layout
                            className={`${glassCard} overflow-hidden shadow-2xl shadow-black/20`}
                        >
                            <Shine />
                            {/* ── Header row ── */}
                            <button
                                className="w-full flex items-center gap-3.5 px-4 py-4 text-left"
                                onClick={(e) => onToggleExpand(invocation.id, e)}
                            >
                                {/* Icon */}
                                <div
                                    className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-white/5 border border-white/10"
                                >
                                    <BookOpen size={17} style={{ color: beadColor }} />
                                </div>

                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                    <p
                                        className={`text-[15px] font-semibold text-white/90 leading-tight transition-all duration-300 ${isExpanded ? "whitespace-normal break-words overflow-visible" : "truncate"}`}
                                    >
                                        {resolve(invocation.name)}
                                    </p>
                                    {invocation.description && (
                                        <p className={`text-[12.5px] text-white/40 mt-0.5 leading-snug transition-all duration-300 ${isExpanded ? "whitespace-normal break-words" : "line-clamp-1"}`}>
                                            {resolve(invocation.description)}
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
                                        <ChevronDown size={16} className="text-white/20" />
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
                                        <div className="mx-4 h-px bg-white/[0.05]" />

                                        {/* Action bar */}
                                        <div className="flex items-center gap-2 px-4 py-3.5">
                                            <Link
                                                href={`/session?invocation=${invocation.id}`}
                                                onClick={onSessionStart}
                                                style={{ backgroundColor: beadColor }}
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-white text-[13px] font-bold active:scale-[0.97] transition-transform"
                                            >
                                                <Play size={13} fill="currentColor" />
                                                {t.library.launch}
                                            </Link>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onToggleFavorite(invocation.id); }}
                                                className="w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10 bg-white/5 active:scale-90 transition-all"
                                            >
                                                <Star size={16} fill={isFavorite(invocation.id) ? beadColor : "none"} style={{ color: isFavorite(invocation.id) ? beadColor : undefined }} className={isFavorite(invocation.id) ? "" : "text-white/20"} />
                                            </button>
                                            {!invocation.id.startsWith("sys-") && (
                                                <>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onEdit(invocation); }}
                                                        className="w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10 bg-white/5 text-white/30 active:scale-90 transition-all"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onDelete(invocation.id); }}
                                                        className="w-10 h-10 rounded-2xl flex items-center justify-center border border-red-500/20 bg-red-500/10 text-red-400 active:scale-90 transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })
            ) : (
                <div className="text-center py-16 px-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 opacity-40">
                        <BookOpen size={24} className="text-white/40" />
                    </div>
                    <p className="text-sm font-bold text-white/60 mb-1">{t.common.noResults}</p>
                    <p className="text-xs text-white/30">{t.common.tryAnother}</p>
                </div>
            )}
        </div>
    );
}

function CollectionSection({ groups, expandedId, onToggleExpand, onSessionStart, onEdit, onDelete, onToggleFavorite, isFavorite, beadColor, getInvocationById }: any) {
    const { t, resolve } = useTranslation();
    if (groups.length === 0) {
        return (
            <div className="text-center py-16 px-6 bg-white/[0.03] border border-dashed border-white/10 rounded-[2rem]">
                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5 opacity-40">
                    <Sparkles size={28} className="text-white/40" />
                </div>
                <p className="text-sm font-bold text-white/50 mb-2">{t.common.noResults}</p>
                <p className="text-xs text-white/30">{t.library.newCollection}</p>
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
                        className={`${glassCard} overflow-hidden shadow-2xl shadow-black/20`}
                    >
                        <Shine />
                        {/* ── Header row ── */}
                        <button
                            className="w-full flex items-center gap-3.5 px-4 py-4 text-left"
                            onClick={(e) => onToggleExpand(group.id, e)}
                        >
                            {/* Bead icon */}
                            <div
                                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-white/5 border border-white/10"
                            >
                                <div
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: beadColor, boxShadow: `0 0 8px ${beadColor}` }}
                                />
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <p
                                    className={`text-[15px] font-semibold text-white/90 leading-tight transition-all duration-300 ${isExpanded ? "whitespace-normal break-words overflow-visible" : "truncate"}`}
                                >
                                    {resolve(group.name)}
                                </p>
                                {group.description && (
                                    <p className={`text-[12.5px] text-white/40 mt-0.5 leading-snug transition-all duration-300 ${isExpanded ? "whitespace-normal break-words" : "line-clamp-1"}`}>
                                        {resolve(group.description)}
                                    </p>
                                )}
                            </div>

                            {/* Right side */}
                            <div className="flex items-center gap-2 shrink-0 ml-1">
                                <span
                                    className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                                    style={{ backgroundColor: beadColor + "18", color: beadColor }}
                                >
                                    {group.invocations.length} {t.session.steps}
                                </span>
                                <motion.div
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.25, ease: "easeInOut" }}
                                >
                                    <ChevronDown size={16} className="text-white/20" />
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
                                    <div className="mx-4 h-px bg-white/[0.05]" />

                                    {/* Steps list */}
                                    {group.invocations.length > 0 && (
                                        <div className="px-4 pt-3 pb-1 space-y-1">
                                            {group.invocations
                                                .filter((inv: { invocationId: string }) => !!getInvocationById(inv.invocationId))
                                                .map((inv: { invocationId: string; repetitions: number }, i: number) => {
                                                    const invData = getInvocationById(inv.invocationId);
                                                    return (
                                                        <div key={i} className="flex items-center gap-3 py-2">
                                                            <span
                                                                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                                                                style={{ backgroundColor: beadColor + "20", color: beadColor }}
                                                            >
                                                                {i + 1}
                                                            </span>
                                                            <span
                                                                className="flex-1 text-[13px] text-white/70 font-medium whitespace-normal break-words"
                                                            >
                                                                {resolve(invData?.name)}
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
                                    <div className="mx-4 h-px bg-white/[0.05] mt-1" />

                                    {/* Action bar */}
                                    <div className="flex items-center gap-2 px-4 py-3.5">
                                        <Link
                                            href={`/session?group=${group.id}`}
                                            onClick={onSessionStart}
                                            style={{ backgroundColor: beadColor }}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-white text-[13px] font-bold active:scale-[0.97] transition-transform"
                                        >
                                            <Play size={13} fill="currentColor" />
                                            {t.library.launch}
                                        </Link>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onToggleFavorite(group.id); }}
                                            className="w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10 bg-white/5 active:scale-90 transition-all"
                                        >
                                            <Star size={16} fill={isFavorite(group.id) ? beadColor : "none"} style={{ color: isFavorite(group.id) ? beadColor : undefined }} className={isFavorite(group.id) ? "" : "text-white/20"} />
                                        </button>
                                        {!group.id.startsWith("sys-") && (
                                            <>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onEdit(group); }}
                                                    className="w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10 bg-white/5 text-white/30 active:scale-90 transition-all"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onDelete(group.id); }}
                                                    className="w-10 h-10 rounded-2xl flex items-center justify-center border border-red-500/20 bg-red-500/10 text-red-400 active:scale-90 transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        )}
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
