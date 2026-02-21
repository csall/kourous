"use client";

import Link from "next/link";
import { ArrowLeft, Shield, Lock, EyeOff, FileText, Server, CheckCircle2, MoreHorizontal } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { en } from "@/lib/translations/en";
import { fr } from "@/lib/translations/fr";
import { useSessionStore } from "@/lib/store/sessionStore";

export default function PrivacyContent({ forceLocale }: { forceLocale?: 'fr' | 'en' }) {
    const { t: dynamicT, resolve: dynamicResolve, language: currentLang } = useTranslation();
    const beadColor = useSessionStore((state) => state.beadColor) || '#fb7185';

    // Determine which translations to use
    const effectiveLang = forceLocale || currentLang;
    const t = forceLocale === 'en' ? en : forceLocale === 'fr' ? fr : dynamicT;

    // Simple resolve for the few inline objects
    const resolve = (obj: any) => {
        if (!obj) return "";
        if (typeof obj === "string") return obj;
        return obj[effectiveLang] || obj["fr"] || "";
    };

    return (
        <div className="h-[100dvh] bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-sans selection:bg-emerald-500/30 overflow-hidden flex flex-col">
            {/* Background Effects (Dark Mode Only) */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-0 dark:opacity-100 transition-opacity duration-500">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar touch-pan-y">
                <main className="relative max-w-3xl mx-auto px-6 pt-[calc(env(safe-area-inset-top)+2rem)] pb-32 space-y-12">
                    <Link href="/settings" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-8">
                        <ArrowLeft size={20} />
                        <span>{t.common.back}</span>
                    </Link>

                    {/* Intro Section */}
                    <div className="space-y-6 text-center">
                        <div className="w-20 h-20 bg-emerald-100 dark:bg-transparent bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-3xl border border-emerald-200 dark:border-white/10 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/10">
                            <Shield size={32} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{t.privacy.title}</h2>
                            <p className="text-lg text-slate-700 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                                {t.privacy.subtitle}
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            {t.privacy.lastUpdate}
                        </div>
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

                    {/* 1. Introduction */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/5">
                                <span className="font-bold text-sm">1</span>
                            </div>
                            <h3 className="text-xl font-bold">{t.privacy.sections[0].title}</h3>
                        </div>
                        <div className="pl-11 space-y-4 text-slate-700 dark:text-slate-400 leading-relaxed">
                            <p>
                                {t.privacy.sections[0].content}
                            </p>
                            <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm dark:shadow-none">
                                <p className="font-medium text-slate-900 dark:text-white mb-2">{t.privacy.summary}</p>
                                <p className="text-sm">
                                    {t.privacy.summaryText}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 2. Données collectées */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/5">
                                <span className="font-bold text-sm">2</span>
                            </div>
                            <h3 className="text-xl font-bold">{t.privacy.sections[1].title}</h3>
                        </div>
                        <div className="pl-11 space-y-6 text-slate-700 dark:text-slate-400 leading-relaxed">
                            <p>
                                {t.privacy.sections[1].content}
                            </p>
                            <div className="grid sm:grid-cols-3 gap-4">
                                <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 p-5 rounded-2xl space-y-3 hover:shadow-lg dark:hover:bg-white/[0.05] transition-all group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <EyeOff size={20} className="text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{resolve({ fr: "Zéro inscription", en: "No Registration" })}</p>
                                        <p className="text-xs text-slate-600 mt-1">{resolve({ fr: "Utilisation immédiate", en: "Instant use" })}</p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 p-5 rounded-2xl space-y-3 hover:shadow-lg dark:hover:bg-white/[0.05] transition-all group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <FileText size={20} className="text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{resolve({ fr: "Zéro formulaire", en: "No Forms" })}</p>
                                        <p className="text-xs text-slate-600 mt-1">{resolve({ fr: "Rien à remplir", en: "Nothing to fill" })}</p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 p-5 rounded-2xl space-y-3 hover:shadow-lg dark:hover:bg-white/[0.05] transition-all group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Server size={20} className="text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{resolve({ fr: "Zéro serveur", en: "No Servers" })}</p>
                                        <p className="text-xs text-slate-600 mt-1">{resolve({ fr: "Tout est local", en: "Everything is local" })}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 3. Données stockées localement */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/5">
                                <span className="font-bold text-sm">3</span>
                            </div>
                            <h3 className="text-xl font-bold">{t.privacy.sections[2].title}</h3>
                        </div>
                        <div className="pl-11 space-y-4 text-slate-700 dark:text-slate-400 leading-relaxed">
                            <p>
                                {t.privacy.sections[2].content}
                            </p>
                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex gap-4 items-center mt-2">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                    <Lock size={18} className="text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <p className="text-sm text-emerald-800 dark:text-emerald-100/80 font-medium">{t.privacy.localDataInfo}</p>
                            </div>
                        </div>
                    </section>

                    {/* 4. Services tiers */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/5">
                                <span className="font-bold text-sm">4</span>
                            </div>
                            <h3 className="text-xl font-bold">{t.privacy.sections[3].title}</h3>
                        </div>
                        <div className="pl-11 space-y-4 text-slate-700 dark:text-slate-400 leading-relaxed">
                            <p>
                                {t.privacy.sections[3].content}
                            </p>
                            <div className="space-y-3">
                                {(t.privacy.thirdPartyPoints as string[]).map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                        <CheckCircle2 size={16} className="text-teal-500" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 5. Sécurité */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/5">
                                <span className="font-bold text-sm">5</span>
                            </div>
                            <h3 className="text-xl font-bold">{t.privacy.sections[4].title}</h3>
                        </div>
                        <div className="pl-11 text-slate-700 dark:text-slate-400 leading-relaxed">
                            <p>
                                {t.privacy.sections[4].content}
                            </p>
                        </div>
                    </section>

                    {/* 6. Modifications */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/5">
                                <span className="font-bold text-sm">6</span>
                            </div>
                            <h3 className="text-xl font-bold">{t.privacy.sections[5].title}</h3>
                        </div>
                        <div className="pl-11 text-slate-700 dark:text-slate-400 leading-relaxed space-y-2">
                            <p>
                                {t.privacy.sections[5].content}
                            </p>
                        </div>
                    </section>

                    {/* 7. Contact */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/5">
                                <span className="font-bold text-sm">7</span>
                            </div>
                            <h3 className="text-xl font-bold">{t.privacy.sections[6].title}</h3>
                        </div>
                        <div className="pl-11 text-slate-700 dark:text-slate-400 leading-relaxed">
                            <p>
                                {t.privacy.sections[6].content}{" "}
                                <a href="mailto:cheikh.sall@icloud.com" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
                                    cheikh.sall@icloud.com
                                </a>
                            </p>
                        </div>
                    </section>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

                    {/* Footer Logo */}
                    <div className="pt-8 flex flex-col items-center opacity-30">
                        <Shield size={24} className="mb-4" />
                        <p className="text-xs font-bold tracking-[0.3em] uppercase">Kourous</p>
                    </div>

                </main>
            </div>
        </div>
    );
}
