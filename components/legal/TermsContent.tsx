"use client";

import Link from "next/link";
import { ArrowLeft, Scale, ShieldAlert, BookOpen, Mail, FileText } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { en } from "@/lib/translations/en";
import { fr } from "@/lib/translations/fr";

export default function TermsContent({ forceLocale }: { forceLocale?: 'fr' | 'en' }) {
    const { t: dynamicT, language: currentLang } = useTranslation();

    // Determine which translations to use
    const t = forceLocale === 'en' ? en : forceLocale === 'fr' ? fr : dynamicT;

    return (
        <div className="h-[100dvh] bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-sans selection:bg-emerald-500/30 overflow-hidden flex flex-col">
            {/* Background Effects (Dark Mode Only) */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-0 dark:opacity-100 transition-opacity duration-500">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-slate-500/5 rounded-full blur-[120px]" />
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
                        <div className="w-20 h-20 bg-emerald-100 dark:bg-transparent bg-gradient-to-tr from-emerald-500/20 to-slate-500/20 rounded-3xl border border-emerald-200 dark:border-white/10 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10">
                            <Scale size={32} className="text-emerald-700 dark:text-emerald-400" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{t.terms.title}</h2>
                            <p className="text-lg text-slate-700 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                                {t.terms.subtitle}
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            {t.terms.lastUpdate}
                        </div>
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

                    {t.terms.sections.map((section: any, i: number) => (
                        <section key={i} className="bg-slate-100/30 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl p-6 hover:shadow-lg dark:hover:bg-white/[0.05] transition-all group">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-emerald-700 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                                    {i === 0 ? <FileText size={24} /> : i === 1 ? <ShieldAlert size={24} /> : i === 2 ? <BookOpen size={24} /> : <Mail size={24} />}
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{section.title}</h3>
                                    <p className="text-slate-700 dark:text-slate-400 leading-relaxed">
                                        {section.content}
                                        {i === t.terms.sections.length - 1 && (
                                            <>
                                                {" "}
                                                <a href="mailto:cheikh.sall@icloud.com" className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline">
                                                    cheikh.sall@icloud.com
                                                </a>
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </section>
                    ))}

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

                    {/* Footer Logo */}
                    <div className="pt-8 flex flex-col items-center opacity-40">
                        <Scale size={24} className="mb-4 text-emerald-700 dark:text-emerald-500" />
                        <p className="text-xs font-black tracking-[0.3em] uppercase text-slate-400 dark:text-slate-600">Kourous</p>
                    </div>

                </main>
            </div>
        </div>
    );
}
