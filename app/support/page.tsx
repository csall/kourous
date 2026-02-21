"use client";

import Link from "next/link";
import { ArrowLeft, HelpCircle, Mail, Smartphone, Volume2, Sparkles, BookOpen, Palette } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useTranslation";

export default function SupportPage() {
    const { t } = useTranslation();
    return (
        <div className="h-[100dvh] bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-sans selection:bg-cyan-500/30 overflow-hidden flex flex-col">
            {/* Background Effects (Dark Mode Only) */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-0 dark:opacity-100 transition-opacity duration-500">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar touch-pan-y">
                <main className="relative max-w-3xl mx-auto px-6 pt-[calc(env(safe-area-inset-top)+2rem)] pb-32 space-y-8">
                    <Link href="/settings" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-8">
                        <ArrowLeft size={20} />
                        <span>{t.common.back}</span>
                    </Link>

                    {/* Intro Section */}
                    <div className="space-y-6 text-center">
                        <div className="w-20 h-20 bg-cyan-100 dark:bg-transparent bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-3xl border border-cyan-200 dark:border-white/10 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-cyan-500/10">
                            <HelpCircle size={32} className="text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{t.support.title}</h2>
                            <p className="text-lg text-slate-700 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                                {t.support.subtitle}
                            </p>
                        </div>
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

                    <div className="space-y-12">
                        {/* Contact Section */}
                        <section className="space-y-6">
                            <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-3xl p-8 text-center max-w-sm mx-auto shadow-sm dark:shadow-none transition-all">
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Mail size={22} className="text-slate-900 dark:text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.support.question}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                                    {t.support.description}
                                </p>
                                <a
                                    href="mailto:cheikh.sall@icloud.com"
                                    className="inline-flex items-center justify-center w-full px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition-colors shadow-lg shadow-cyan-500/20"
                                >
                                    cheikh.sall@icloud.com
                                </a>
                            </div>
                        </section>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        {/* FAQ Section */}
                        <section className="space-y-6">
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.support.faqTitle}</h3>
                            </div>

                            <div className="grid gap-6">
                                {t.support.faq.map((item: any, i: number) => (
                                    <div key={i} className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl p-6 space-y-3 shadow-sm dark:shadow-none">
                                        <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                                            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                                {i === 0 ? <Sparkles size={18} /> : i === 1 ? <BookOpen size={18} /> : i === 2 ? <Smartphone size={18} /> : i === 3 ? <Volume2 size={18} /> : <Palette size={18} />}
                                            </div>
                                            <h4 className="font-bold">{item.q}</h4>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed pl-[3.25rem]">
                                            {item.a}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Footer Logo */}
                    <div className="pt-8 flex flex-col items-center opacity-30">
                        <HelpCircle size={24} className="mb-4" />
                        <p className="text-xs font-bold tracking-[0.3em] uppercase">Kourous</p>
                    </div>

                </main>
            </div>
        </div>
    );
}
