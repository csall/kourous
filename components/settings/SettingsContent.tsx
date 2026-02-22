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
import { useTranslation } from "@/lib/hooks/useTranslation";
import { HomeBackground } from "@/components/home/HomeBackground";
import { hapticLight } from "@/lib/utils/haptics";

type SettingsView = 'menu' | 'preferences';

const glassCard = "relative bg-white/[0.042] backdrop-blur-xl border border-white/[0.07] rounded-2xl";
const Shine = () => (
    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent rounded-t-2xl" />
);

function SettingsInner() {
    const searchParams = useSearchParams();
    const paramView = searchParams.get('view') === 'preferences' ? 'preferences' : 'menu';
    const [view, setView] = useState<SettingsView>(paramView);
    const { t, language } = useTranslation();
    const {
        soundEnabled, hapticsEnabled, toggleSound, toggleHaptics,
        beadColor, setBeadColor, theme, setTheme, setLanguage
    } = useSessionStore();

    useEffect(() => { setView(paramView); }, [paramView]);

    const colors = [
        { name: "Rose", value: "#fb7185" },
        { name: "Émeraude", value: "#10b981" },
        { name: "Saphir", value: "#3b82f6" },
        { name: "Or", value: "#fbbf24" },
        { name: "Ardoise", value: "#94a3b8" },
        { name: "Améthyste", value: "#a855f7" },
    ];

    const languages = [
        { key: 'fr' as const, label: t.settings.languages.fr },
        { key: 'en' as const, label: t.settings.languages.en },
    ];

    const themes = [
        { key: 'dark' as const, label: t.settings.theme.dark, icon: <Moon size={13} /> },
        { key: 'light' as const, label: t.settings.theme.light, icon: <Sun size={13} /> },
        { key: 'auto' as const, label: t.settings.theme.auto, icon: <Smartphone size={13} /> },
    ];

    const menuGroups = [
        {
            title: t.settings.support,
            items: [
                { icon: HelpCircle, label: t.settings.support, href: "/support", external: false, color: "#3b82f6" },
                { icon: Mail, label: t.settings.contact, href: "mailto:cheikh.sall@icloud.com", external: true, color: "#0ea5e9" },
            ],
        },
        {
            title: t.settings.about,
            items: [
                { icon: Shield, label: t.settings.privacy, href: "/privacy", external: false, color: "#6b7280" },
                { icon: FileText, label: t.settings.terms, href: "/terms", external: false, color: "#64748b" },
            ],
        },
    ];

    return (
        <div className="flex flex-col w-full h-[100dvh] overflow-hidden text-white relative">
            <HomeBackground />

            <AnimatePresence mode="wait">

                {/* ── MENU ─────────────────────────────────── */}
                {view === 'menu' && (
                    <motion.div
                        key="menu"
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col h-full pt-[calc(env(safe-area-inset-top,20px)+0.5rem)] px-5 pb-[calc(env(safe-area-inset-bottom,20px)+5.5rem)] touch-none overflow-hidden relative z-10"
                    >
                        {/* Header */}
                        <div className="flex-none pb-6 px-1">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-[12px] flex items-center justify-center"
                                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                    <MoreHorizontal size={16} style={{ color: beadColor }} />
                                </div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">{t.settings.title}</h2>
                            </div>
                            <p className="text-[13px] text-white/38 font-medium pl-12 mt-0.5">{t.settings.info}</p>
                        </div>

                        {/* Groups */}
                        <div className="flex-1 overflow-hidden w-full px-1 space-y-5">
                            {menuGroups.map((group) => (
                                <div key={group.title}>
                                    <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/25 mb-2 pl-1">
                                        {group.title}
                                    </p>
                                    <div className={`${glassCard} overflow-hidden`}>
                                        <Shine />
                                        {group.items.map((item, index) => {
                                            const Icon = item.icon;
                                            const isLast = index === group.items.length - 1;
                                            return (
                                                <div key={item.label}>
                                                    <Link href={item.href} target={item.external ? "_blank" : undefined}>
                                                        <div className="flex items-center justify-between p-4 active:bg-white/[0.05] transition-colors">
                                                            <div className="flex items-center gap-3.5">
                                                                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                                                                    style={{ backgroundColor: `${item.color}20`, border: `1px solid ${item.color}30` }}>
                                                                    <Icon size={16} style={{ color: item.color }} />
                                                                </div>
                                                                <span className="text-[15px] font-medium text-white/78">{item.label}</span>
                                                            </div>
                                                            <ChevronRight size={15} className="text-white/20" />
                                                        </div>
                                                    </Link>
                                                    {!isLast && <div className="h-px bg-white/[0.05] ml-[3.5rem]" />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ── PRÉFÉRENCES ──────────────────────────── */}
                {view === 'preferences' && (
                    <motion.div
                        key="preferences"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                        className="flex flex-col h-full pt-[calc(env(safe-area-inset-top,20px)+0.5rem)] relative z-10"
                    >
                        {/* Header */}
                        <div className="flex-none px-6 pb-5">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-[12px] flex items-center justify-center"
                                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                    <Settings size={16} style={{ color: beadColor }} />
                                </div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">{t.settings.preferences}</h2>
                            </div>
                            <p className="text-[13px] text-white/38 pl-12 mt-0.5">{t.settings.language} & {t.settings.appearance}</p>
                        </div>

                        {/* Contenu fixe — pas de scroll */}
                        <div className="flex-1 overflow-hidden px-5 pb-[calc(env(safe-area-inset-bottom,20px)+5.5rem)] flex flex-col gap-2">

                            {/* Son */}
                            <div className={`${glassCard} px-4 py-3`}>
                                <Shine />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {soundEnabled
                                            ? <Volume2 size={18} style={{ color: beadColor }} />
                                            : <VolumeX size={18} className="text-white/30" />}
                                        <span className="text-[14px] font-medium text-white/78">{t.session.sound}</span>
                                    </div>
                                    <button onClick={() => { hapticLight(); toggleSound(); }}
                                        className="w-12 h-6 rounded-full transition-all"
                                        style={{ backgroundColor: soundEnabled ? beadColor : 'rgba(255,255,255,0.12)' }}>
                                        <div className={`w-5 h-5 rounded-full bg-white shadow-lg transform transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                    </button>
                                </div>
                            </div>

                            {/* Haptiques */}
                            <div className={`${glassCard} px-4 py-3`}>
                                <Shine />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Vibrate size={18} style={{ color: hapticsEnabled ? beadColor : 'rgba(255,255,255,0.3)' }} />
                                        <span className="text-[14px] font-medium text-white/78">{t.session.haptics}</span>
                                    </div>
                                    <button onClick={() => { hapticLight(); toggleHaptics(); }}
                                        className="w-12 h-6 rounded-full transition-all"
                                        style={{ backgroundColor: hapticsEnabled ? beadColor : 'rgba(255,255,255,0.12)' }}>
                                        <div className={`w-5 h-5 rounded-full bg-white shadow-lg transform transition-transform ${hapticsEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                    </button>
                                </div>
                            </div>

                            {/* Langue */}
                            <div className={`${glassCard} px-4 py-3 space-y-2`}>
                                <Shine />
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-black" style={{ color: beadColor }}>{language.toUpperCase()}</span>
                                    <span className="text-[14px] font-medium text-white/78">{t.settings.language}</span>
                                </div>
                                <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                                    {languages.map((l) => (
                                        <button key={l.key} onClick={() => setLanguage(l.key)}
                                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${language === l.key ? 'bg-white/10 text-white' : 'text-white/35'}`}>
                                            {l.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Thème */}
                            <div className={`${glassCard} px-4 py-3 space-y-2`}>
                                <Shine />
                                <div className="flex items-center gap-3">
                                    <Moon size={16} style={{ color: beadColor }} />
                                    <span className="text-[14px] font-medium text-white/78">{t.settings.appearance}</span>
                                </div>
                                <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                                    {themes.map((th) => (
                                        <button key={th.key} onClick={() => setTheme(th.key)}
                                            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${theme === th.key ? 'bg-white/10 text-white' : 'text-white/35'}`}>
                                            {th.icon}
                                            {th.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Couleur */}
                            <div className={`${glassCard} px-4 py-3 space-y-3`}>
                                <Shine />
                                <div className="flex items-center gap-3">
                                    <Palette size={18} style={{ color: beadColor }} />
                                    <span className="text-[15px] font-medium text-white/78">{t.settings.beadColor}</span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {colors.map((c) => (
                                        <button
                                            key={c.value}
                                            onClick={() => setBeadColor(c.value)}
                                            aria-label={c.name}
                                            className={`relative w-9 h-9 rounded-full transition-all active:scale-90 ${beadColor === c.value ? 'scale-110' : 'opacity-55'}`}
                                            style={{
                                                backgroundColor: c.value,
                                                boxShadow: beadColor === c.value
                                                    ? `0 0 0 2px rgba(255,255,255,0.85), 0 0 14px ${c.value}80`
                                                    : 'none',
                                            }}>
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
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}

export function SettingsContent() {
    return (
        <Suspense fallback={<div className="flex-1 w-full h-full" style={{ background: "#010208" }} />}>
            <SettingsInner />
        </Suspense>
    );
}
