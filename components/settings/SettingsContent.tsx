"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Volume2, VolumeX, Vibrate, Moon, Sun, Smartphone,
    Palette, ChevronRight,
    HelpCircle, Mail, Shield, FileText, Settings,
    MoreHorizontal
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSessionStore } from "@/lib/store/sessionStore";

import { useSearchParams } from "next/navigation";

type SettingsView = 'menu' | 'preferences';



function SettingsInner() {
    const searchParams = useSearchParams();
    const paramView = searchParams.get('view') === 'preferences' ? 'preferences' : 'menu';
    const [view, setView] = useState<SettingsView>(paramView);
    const { soundEnabled, hapticsEnabled, toggleSound, toggleHaptics, beadColor, setBeadColor, theme, setTheme } = useSessionStore();

    useEffect(() => {
        setView(paramView);
    }, [paramView]);

    const colors = [
        { name: "Rose", value: "#fb7185" },
        { name: "Émeraude", value: "#10b981" },
        { name: "Saphir", value: "#3b82f6" },
        { name: "Or", value: "#fbbf24" },
        { name: "Ardoise", value: "#94a3b8" },
        { name: "Améthyste", value: "#a855f7" }
    ];

    const themes = [
        { key: 'dark' as const, label: 'Sombre', icon: <Moon size={14} /> },
        { key: 'light' as const, label: 'Clair', icon: <Sun size={14} /> },
        { key: 'auto' as const, label: 'Auto', icon: <Smartphone size={14} /> },
    ];

    const menuGroups = [
        {
            title: "Support",
            items: [
                {
                    icon: HelpCircle,
                    label: "Aide",
                    href: "/support",
                    external: false,
                    color: "bg-blue-500"
                },
                {
                    icon: Mail,
                    label: "Contactez-nous",
                    href: "mailto:cheikh.sall@icloud.com",
                    external: true,
                    color: "bg-sky-500"
                }
            ]
        },
        {
            title: "Informations Légales",
            items: [
                {
                    icon: Shield,
                    label: "Politique de confidentialité",
                    href: "/privacy",
                    external: false,
                    color: "bg-gray-500"
                },
                {
                    icon: FileText,
                    label: "Conditions Générales d'Utilisation",
                    href: "/terms",
                    external: false,
                    color: "bg-slate-500"
                }
            ]
        }
    ];

    return (
        <div className="flex flex-col w-full h-[100dvh] overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 transition-colors">
            <AnimatePresence mode="wait">
                {view === 'menu' ? (
                    <motion.div
                        key="menu"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col h-full pt-[calc(env(safe-area-inset-top)+2rem)] px-5"
                    >
                        {/* ── FIXED HEADER ─────────────────────────── */}
                        <div className="flex-none space-y-6 pb-6 z-10 px-1">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 flex items-center justify-center">
                                        <MoreHorizontal size={16} style={{ color: beadColor }} />
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Autre</h2>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium pl-11">Paramètres avancés et informations</p>
                            </div>
                        </div>

                        {/* ── SCROLLABLE CONTENT ─────────────────────── */}
                        <div className="flex-1 overflow-y-auto no-scrollbar w-full px-1 pt-4 pb-32 touch-pan-y">
                            <div className="space-y-6">
                                {menuGroups.map((group, groupIndex) => (
                                    <div key={group.title}>
                                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-4">
                                            {group.title}
                                        </h3>
                                        <div className="bg-white dark:bg-white/[0.04] backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden mb-auto shadow-sm dark:shadow-none">
                                            {group.items.map((item, index) => {
                                                const Icon = item.icon;
                                                const isLast = index === group.items.length - 1;

                                                return (
                                                    <div key={item.label}>
                                                        <Link href={item.href} target={item.external ? "_blank" : undefined}>
                                                            <div className="flex items-center justify-between p-4 bg-transparent active:bg-slate-100 dark:active:bg-white/[0.08] transition-colors cursor-pointer group">
                                                                <div className="flex items-center gap-4">
                                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.color} text-white shadow-lg shadow-black/20`}>
                                                                        <Icon size={18} />
                                                                    </div>
                                                                    <span className="text-[15px] font-medium text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-white transition-colors">
                                                                        {item.label}
                                                                    </span>
                                                                </div>
                                                                <ChevronRight size={16} className="text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors opacity-70" />
                                                            </div>
                                                        </Link>
                                                        {!isLast && <div className="h-px bg-slate-100 dark:bg-white/5 ml-[3.5rem]" />}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preferences"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex flex-col h-full"
                    >
                        {/* ── FIXED HEADER ─────────────────────────── */}
                        <div className="flex-none space-y-6 pb-6 z-10 px-1">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 flex items-center justify-center">
                                        <Settings size={16} style={{ color: beadColor }} />
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Préférences</h2>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium pl-11">Personnalisez votre expérience</p>
                            </div>
                        </div>

                        {/* ── SCROLLABLE CONTENT ─────────────────────── */}
                        <div className="flex-1 overflow-y-auto no-scrollbar w-full px-1 pt-4 pb-32 touch-pan-y">
                            <div className="space-y-4">
                                {/* Sound Toggle */}
                                <div className="bg-white dark:bg-white/[0.04] backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm dark:shadow-none">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {soundEnabled ? (
                                                <Volume2 size={20} style={{ color: beadColor }} />
                                            ) : (
                                                <VolumeX size={20} className="text-slate-400" />
                                            )}
                                            <div>
                                                <div className="text-sm font-medium text-slate-900 dark:text-white">Son</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">Feedback audio</div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={toggleSound}
                                            className="w-12 h-6 rounded-full transition-all"
                                            style={{ backgroundColor: soundEnabled ? beadColor : '#cbd5e1' }}
                                        >
                                            <div className={`w-5 h-5 rounded-full bg-white shadow-lg transform transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                                                }`} />
                                        </button>
                                    </div>
                                </div>

                                {/* Haptics Toggle */}
                                <div className="bg-white dark:bg-white/[0.04] backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm dark:shadow-none">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Vibrate size={20} style={{ color: hapticsEnabled ? beadColor : '#94a3b8' }} />
                                            <div>
                                                <div className="text-sm font-medium text-slate-900 dark:text-white">Vibrations</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">Retour haptique</div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={toggleHaptics}
                                            className="w-12 h-6 rounded-full transition-all"
                                            style={{ backgroundColor: hapticsEnabled ? beadColor : '#cbd5e1' }}
                                        >
                                            <div className={`w-5 h-5 rounded-full bg-white shadow-lg transform transition-transform ${hapticsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                                                }`} />
                                        </button>
                                    </div>
                                </div>

                                {/* Theme Selector */}
                                <div className="bg-white dark:bg-white/[0.04] backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm dark:shadow-none">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Moon size={20} style={{ color: beadColor }} />
                                            <div>
                                                <div className="text-sm font-medium text-slate-900 dark:text-white">Thème</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">Apparence de l&apos;application</div>
                                            </div>
                                        </div>

                                        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-white/[0.04] rounded-xl">
                                            {themes.map((t) => (
                                                <button
                                                    key={t.key}
                                                    onClick={() => setTheme(t.key)}
                                                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${theme === t.key
                                                        ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                                                        : 'text-slate-500'
                                                        }`}
                                                >
                                                    {t.icon}
                                                    {t.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Color Selection */}
                                <div className="bg-white dark:bg-white/[0.04] backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm dark:shadow-none">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Palette size={20} style={{ color: beadColor }} />
                                            <div>
                                                <div className="text-sm font-medium text-slate-900 dark:text-white">Couleur des perles</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">Personnalisez votre expérience</div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3 pt-2">
                                            {colors.map((c) => (
                                                <button
                                                    key={c.value}
                                                    onClick={() => setBeadColor(c.value)}
                                                    className={`relative w-8 h-8 rounded-full transition-all active:scale-90 ${beadColor === c.value ? 'ring-2 ring-slate-900 dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-110' : 'opacity-70 hover:opacity-100'
                                                        }`}
                                                    style={{ backgroundColor: c.value }}
                                                    aria-label={c.name}
                                                >
                                                    {beadColor === c.value && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="w-2 h-2 rounded-full bg-white" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function SettingsContent() {
    return (
        <Suspense fallback={<div className="flex-1 w-full h-full bg-slate-950" />}>
            <SettingsInner />
        </Suspense>
    );
}
