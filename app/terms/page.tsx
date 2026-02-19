import Link from "next/link";
import { ArrowLeft, Scale, ShieldAlert, BookOpen, Mail, FileText } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 font-sans selection:bg-indigo-500/30">
            {/* Background Effects (Dark Mode Only) */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-0 dark:opacity-100 transition-opacity duration-500">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-slate-500/5 rounded-full blur-[120px]" />
            </div>

            {/* Content */}
            <main className="relative max-w-3xl mx-auto px-6 pt-[calc(env(safe-area-inset-top)+2rem)] pb-32 space-y-12">
                <Link href="/settings" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-8">
                    <ArrowLeft size={20} />
                    <span>Retour</span>
                </Link>

                {/* Intro Section */}
                <div className="space-y-6 text-center">
                    <div className="w-20 h-20 bg-indigo-100 dark:bg-transparent bg-gradient-to-tr from-indigo-500/20 to-slate-500/20 rounded-3xl border border-indigo-200 dark:border-white/10 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/10">
                        <Scale size={32} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Conditions Générales</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                            Simplicité et transparence pour une utilisation sereine.
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        Mise à jour : 19 février 2026
                    </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

                {/* 1. Utilisation */}
                <section className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl p-6 hover:shadow-lg dark:hover:bg-white/[0.05] transition-all group">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                            <FileText size={24} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">1. Utilisation</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Kourous est une application gratuite destinée à un usage personnel et spirituel. Vous êtes libre de l'utiliser autant que vous le souhaitez pour vos pratiques quotidiennes.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 2. Responsabilité */}
                <section className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl p-6 hover:shadow-lg dark:hover:bg-white/[0.05] transition-all group">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                            <ShieldAlert size={24} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">2. Responsabilité</h3>
                            <div className="space-y-2 text-slate-600 dark:text-slate-400 leading-relaxed">
                                <p>
                                    L'application est fournie "telle quelle".
                                </p>
                                <p>
                                    Bien que nous nous efforcions de garantir une expérience parfaite, nous ne pouvons être tenus responsables d'éventuels bugs ou interruptions de service.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Contenu */}
                <section className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl p-6 hover:shadow-lg dark:hover:bg-white/[0.05] transition-all group">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                            <BookOpen size={24} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">3. Contenu</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Les textes et contenus présents dans l'application sont fournis à titre informatif et spirituel, dans le but de faciliter votre pratique.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

                {/* Footer Logo */}
                <div className="pt-8 flex flex-col items-center opacity-30">
                    <Scale size={24} className="mb-4" />
                    <p className="text-xs font-bold tracking-[0.3em] uppercase">Kourous</p>
                </div>

            </main>
        </div>
    );
}
